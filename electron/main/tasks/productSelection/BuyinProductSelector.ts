import { ProductSelectorBase } from './ProductSelectorBase'

export class BuyinProductSelector extends ProductSelectorBase {
  private readonly selectionUrl =
    'https://buyin.jinritemai.com/dashboard/merch-picking-library'

  public async selectAndSearch(productId: string): Promise<string> {
    this.logger.info(`正在为巨量百应平台搜索商品ID: ${productId}`)
    const newPage = await this.browserContext.newPage()

    try {
      this.logger.info(`正在创建新标签页并跳转到: ${this.selectionUrl}`)
      await newPage.goto(this.selectionUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      })
      await newPage.bringToFront()
      this.logger.info('选品库页面加载完成')

      const inputSelector = '#SearchBarWrapper [role="combobox"]'
      const buttonSelector = '#SearchBarWrapper button'

      this.logger.info(`正在等待输入框出现: ${inputSelector}`)
      await newPage.waitForSelector(inputSelector, { timeout: 10000 })
      this.logger.info('输入框已找到，正在输入商品ID...')
      await newPage.fill(inputSelector, productId)

      this.logger.info(`正在等待搜索按钮出现: ${buttonSelector}`)
      await newPage.waitForSelector(buttonSelector, { timeout: 5000 })
      this.logger.info('搜索按钮已找到，正在强制点击...')
      await newPage.click(buttonSelector, { force: true })
      this.logger.success(`已成功搜索商品ID: ${productId}`)

      const addToCartButton = newPage.getByRole('button', { name: '加选品车' })
      const addedButton = newPage.getByText('已加选品车')

      await Promise.race([
        addToCartButton.waitFor({ state: 'visible', timeout: 10000 }),
        addedButton.waitFor({ state: 'visible', timeout: 10000 }),
      ])

      if (await addedButton.isVisible()) {
        this.logger.info('商品已在选品车中，无需重复添加。')
        return `商品ID: ${productId} 已在选品车中。`
      }

      if (await addToCartButton.isVisible()) {
        this.logger.info('正在点击“加选品车”按钮...')
        await addToCartButton.click()
        this.logger.success('已成功添加商品到选品车！')
        return `已成功添加商品ID: ${productId}`
      }

      throw new Error('未找到“加选品车”或“已加选品车”按钮。')
    } catch (error) {
      this.logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_buyin_${Date.now()}.png`
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
