import { ProductSelectorBase } from './ProductSelectorBase'

export class EosProductSelector extends ProductSelectorBase {
  private readonly selectionUrl =
    'https://eos.douyin.com/livesite/commission/goods/list'

  public async selectAndSearch(productName: string): Promise<string> {
    this.logger.info(`正在为抖音团购平台搜索商品: ${productName}`)
    const newPage = await this.browserContext.newPage()

    try {
      this.logger.info(`正在创建新标签页并跳转到: ${this.selectionUrl}`)
      await newPage.goto(this.selectionUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 15000, // Increased timeout for initial load
      })
      await newPage.bringToFront()
      this.logger.info('选品广场页面加载完成')

      const iframeSelector = 'iframe.iframe-E9iJZw'
      this.logger.info(`正在等待 iframe 出现: ${iframeSelector}`)
      const frame = await newPage.frameLocator(iframeSelector).first()
      await frame.locator('body').waitFor({ timeout: 15000 })

      const inputSelector = 'input[placeholder="搜索商家/团购名称"]'
      this.logger.info(`正在等待输入框出现: ${inputSelector}`)
      const inputLocator = frame.locator(inputSelector)
      await inputLocator.waitFor({ state: 'visible', timeout: 15000 })

      this.logger.info('输入框已找到，正在输入商品名称...')
      await inputLocator.fill(productName)
      await inputLocator.press('Enter')
      this.logger.success(`已成功触发搜索: ${productName}`)

      // Instead of complex waits, we directly wait for the result and click
      const cardSelector = 'div.card'
      this.logger.info(`正在等待搜索结果出现: ${cardSelector}`)
      const firstCard = frame.locator(cardSelector).first()
      await firstCard.waitFor({ state: 'visible', timeout: 15000 })
      await firstCard.click()
      this.logger.info('已点击第一个商品，等待详情加载...')

      const addButton = frame.getByRole('button', { name: '加入我的选品库' })
      const cancelButton = frame.getByRole('button', { name: '取消加入' })

      // Wait for either button to be visible to confirm navigation
      await Promise.race([
        addButton.waitFor({ state: 'visible', timeout: 15000 }),
        cancelButton.waitFor({ state: 'visible', timeout: 15000 }),
      ])

      if (await cancelButton.isVisible()) {
        this.logger.info('商品已在选品库中，无需重复添加。')
        return `商品 "${productName}" 已在选品库中。`
      }

      if (await addButton.isVisible()) {
        this.logger.info('找到“加入我的选品库”按钮，正在点击...')
        await addButton.click()
        await newPage.waitForTimeout(1000) // Wait for action to complete
        return `已成功添加商品: ${productName}`
      }

      throw new Error('无法确定商品状态，未找到“加入”或“取消”按钮。')
    } catch (error) {
      this.logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_eos_${Date.now()}.png`
      await newPage.screenshot({ path: screenshotPath, fullPage: true })
      this.logger.error(
        `已截取错误屏幕快照，保存在项目根目录: ${screenshotPath}`,
      )
      throw new Error('操作失败，请检查URL或页面元素。详情请查看日志和截图。')
    } finally {
      if (!newPage.isClosed()) {
        await newPage.close()
        this.logger.info('任务完成，已关闭标签页。')
      }
    }
  }
}
