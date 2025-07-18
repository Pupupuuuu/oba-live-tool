import { ProductSelectorBase } from './ProductSelectorBase'

export class BuyinProductSelector extends ProductSelectorBase {
  private readonly selectionUrl =
    'https://buyin.jinritemai.com/dashboard/merch-picking-library'

  public async selectAndSearch(productId: string): Promise<string> {
    this.logger.info(`正在为巨量百应平台搜索商品ID: ${productId}`)
    this.logger.info(`正在创建新标签页并跳转到: ${this.selectionUrl}`)
    const newPage = await this.browserContext.newPage()

    try {
      await newPage.goto(this.selectionUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })
      await newPage.bringToFront()
      this.logger.info('选品库页面加载完成')

      const inputSelector = '#SearchBarWrapper [role="combobox"]'
      const buttonSelector = '#SearchBarWrapper button'

      this.logger.info(`正在等待输入框出现: ${inputSelector}`)
      await newPage.waitForSelector(inputSelector, { timeout: 5000 })
      this.logger.info('输入框已找到，正在输入商品ID...')
      await newPage.fill(inputSelector, productId)

      this.logger.info(`正在等待搜索按钮出现: ${buttonSelector}`)
      await newPage.waitForSelector(buttonSelector, { timeout: 5000 })
      this.logger.info('搜索按钮已找到，正在强制点击...')
      await newPage.click(buttonSelector, { force: true })
      this.logger.success(`已成功搜索商品ID: ${productId}`)

      const cardSelector = 'div[class*="cardContent"]'
      this.logger.info(`等待商品卡片出现: ${cardSelector}`)
      await newPage.waitForSelector(cardSelector, { timeout: 5000 })

      const addToCartSelector = 'div[class*="addWindowAndRadio"] button'
      this.logger.info(`正在等待“加选品车”按钮: ${addToCartSelector}`)
      await newPage.waitForSelector(addToCartSelector, { timeout: 5000 })
      this.logger.info('正在点击“加选品车”按钮...')
      await newPage.click(addToCartSelector)
      this.logger.success('已成功添加商品到选品车！')

      // await newPage.close()

      return `已成功添加商品ID: ${productId}`
    } catch (error) {
      this.logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_${Date.now()}.png`
      await newPage.screenshot({ path: screenshotPath, fullPage: true })
      this.logger.error(
        `已截取错误屏幕快照，保存在项目根目录: ${screenshotPath}`,
      )
      throw new Error('操作失败，请检查URL或页面元素。详情请查看日志和截图。')
    }
  }
}
