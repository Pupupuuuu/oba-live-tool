import { ProductSelectorBase } from './ProductSelectorBase'

export class EosProductSelector extends ProductSelectorBase {
  private readonly selectionUrl =
    'https://eos.douyin.com/livesite/commission/goods/list'

  public async selectAndSearch(productName: string): Promise<string> {
    this.logger.info(`正在为抖音团购平台搜索商品: ${productName}`)
    this.logger.info(`正在创建新标签页并跳转到: ${this.selectionUrl}`)
    const newPage = await this.browserContext.newPage()

    try {
      await newPage.goto(this.selectionUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })
      await newPage.bringToFront()
      this.logger.info('选品广场页面加载完成')

      const iframeSelector = 'iframe.iframe-E9iJZw'
      this.logger.info(`正在等待 iframe 出现: ${iframeSelector}`)
      const iframeElement = await newPage.waitForSelector(iframeSelector, {
        timeout: 10000,
      })
      const frame = await iframeElement.contentFrame()

      if (!frame) {
        throw new Error('无法获取 iframe 的 contentFrame')
      }

      const inputSelector = 'input[placeholder="搜索商家/团购名称"]'

      this.logger.info(`正在等待输入框出现: ${inputSelector}`)
      await frame.waitForSelector(inputSelector, { timeout: 5000 })
      this.logger.info('输入框已找到，正在输入商品名称...')
      await frame.fill(inputSelector, productName)

      this.logger.info('正在模拟按下回车键...')
      await frame.focus(inputSelector)
      await frame.press(inputSelector, 'Enter')
      this.logger.success(`已成功搜索商品: ${productName}`)

      return `已成功搜索商品: ${productName}`
    } catch (error) {
      this.logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_eos_${Date.now()}.png`
      await newPage.screenshot({ path: screenshotPath, fullPage: true })
      this.logger.error(
        `已截取错误屏幕快照，保存在项目根目录: ${screenshotPath}`,
      )
      throw new Error('操作失败，请检查URL或页面元素。详情请查看日志和截图。')
    }
  }
}
