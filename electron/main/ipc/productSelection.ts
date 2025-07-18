import { IPC_CHANNELS } from 'shared/ipcChannels'
import { createLogger } from '#/logger'
import { contextManager } from '#/managers/BrowserContextManager'
import { getProductSelector } from '#/tasks/productSelection'
import { typedIpcMainHandle } from '#/utils'

const logger = createLogger('ProductSelectionIPC')

typedIpcMainHandle(
  IPC_CHANNELS.tasks.productSelection.open,
  async (_, productId: string) => {
    logger.info(`接收到商品ID: ${productId} 的处理请求`)

    const { browserContext, platform, page } =
      contextManager.getCurrentContext()

    try {
      // 1. 通过工厂函数获取当前平台的逻辑处理器
      const selector = getProductSelector(platform, browserContext, page)

      // 2. 执行该处理器的 selectAndSearch 方法
      const result = await selector.selectAndSearch(productId)

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`处理失败: ${errorMessage}`)
      // 将错误重新抛出，以便前端可以捕获并显示
      throw error
    }
  },
)
