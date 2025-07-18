import { IPC_CHANNELS } from 'shared/ipcChannels'
import { createLogger } from '#/logger'
import { contextManager } from '#/managers/BrowserContextManager'
import { typedIpcMainHandle } from '#/utils'

const logger = createLogger('ProductSelection')

typedIpcMainHandle(
  IPC_CHANNELS.tasks.productSelection.open,
  async (_, productId: string) => {
    logger.info(`接收到商品ID: ${productId}`)

    const { page } = contextManager.getCurrentContext()
    const originalUrl = page.url()

    try {
      logger.info('正在点击“选品”按钮...')
      await page.click('li.xuanpin .headerNav-item__container')

      logger.info('等待页面跳转到选品库...')
      await page.waitForURL('**/merch-picking-library**', { timeout: 10000 })
      logger.info('已进入选品库页面')

      const inputSelector = '#rc_select_0'
      const buttonSelector = '#SearchBarWrapper button'

      logger.info(`正在等待输入框出现: ${inputSelector}`)
      await page.waitForSelector(inputSelector, { timeout: 5000 })
      logger.info('输入框已找到，正在输入商品ID...')
      await page.fill(inputSelector, productId)

      logger.info(`正在等待搜索按钮出现: ${buttonSelector}`)
      await page.waitForSelector(buttonSelector, { timeout: 5000 })
      logger.info('搜索按钮已找到，正在点击...')
      await page.click(buttonSelector)
      logger.success(`已成功搜索商品ID: ${productId}`)

      // 操作完成后，返回到原来的中控台页面
      logger.info('操作完成，正在返回中控台页面...')
      // await page.goBack()
      // await page.waitForURL(originalUrl, { timeout: 10000 })
      logger.info('已成功返回中控台')

      return `已成功搜索商品ID: ${productId}`
    } catch (error) {
      logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_${Date.now()}.png`
      await page.screenshot({ path: screenshotPath, fullPage: true })
      logger.error(`已截取错误屏幕快照，保存在项目根目录: ${screenshotPath}`)
      throw new Error(
        '操作失败，请检查选择器或页面加载状态。详情请查看日志和截图。',
      )
    }
  },
)
