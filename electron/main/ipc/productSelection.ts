import { IPC_CHANNELS } from 'shared/ipcChannels'
import { createLogger } from '#/logger'
import { contextManager } from '#/managers/BrowserContextManager'
import { typedIpcMainHandle } from '#/utils'

const logger = createLogger('ProductSelection')

typedIpcMainHandle(
  IPC_CHANNELS.tasks.productSelection.open,
  async (_, productId: string) => {
    logger.info(`接收到商品ID: ${productId}`)

    const { browserContext } = contextManager.getCurrentContext()
    const selectionUrl =
      'https://buyin.jinritemai.com/dashboard/merch-picking-library'

    logger.info(`正在创建新标签页并跳转到: ${selectionUrl}`)
    const newPage = await browserContext.newPage()

    try {
      await newPage.goto(selectionUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })
      await newPage.bringToFront()
      logger.info('选品库页面加载完成')

      const inputSelector = '#SearchBarWrapper [role="combobox"]'
      const buttonSelector = '#SearchBarWrapper button'

      logger.info(`正在等待输入框出现: ${inputSelector}`)
      await newPage.waitForSelector(inputSelector, { timeout: 5000 })
      logger.info('输入框已找到，正在输入商品ID...')
      await newPage.fill(inputSelector, productId)

      logger.info(`正在等待搜索按钮出现: ${buttonSelector}`)
      await newPage.waitForSelector(buttonSelector, { timeout: 5000 })
      logger.info('搜索按钮已找到，正在点击...')
      await newPage.click(buttonSelector, { force: true })
      logger.info(`已成功搜索商品ID: ${productId}`)

      // 搜索后等待商品卡片出现
      const cardSelector = 'div[class*="cardContent"]'
      logger.info(`等待商品卡片出现: ${cardSelector}`)
      await newPage.waitForSelector(cardSelector, { timeout: 5000 })

      // 点击“加选品车”
      const addToCartSelector = 'div[class*="addWindowAndRadio"] button'
      logger.info(`正在等待“加选品车”按钮: ${addToCartSelector}`)
      await newPage.waitForSelector(addToCartSelector, { timeout: 5000 })
      logger.info('正在点击“加选品车”按钮...')
      await newPage.click(addToCartSelector)
      logger.success('已成功添加商品到选品车！')

      // 注意：这里我们暂时不关闭页面，方便观察结果
      // await newPage.close()

      return `已成功添加商品ID: ${productId}`
    } catch (error) {
      logger.error('操作失败:', error)
      const screenshotPath = `error_screenshot_${Date.now()}.png`
      await newPage.screenshot({ path: screenshotPath, fullPage: true })
      logger.error(`已截取错误屏幕快照，保存在项目根目录: ${screenshotPath}`)
      // 即使失败也尝试关闭页面
      // await newPage.close()
      throw new Error('操作失败，请检查URL或页面元素。详情请查看日志和截图。')
    }
  },
)
