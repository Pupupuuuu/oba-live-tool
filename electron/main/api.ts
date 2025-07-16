import express from 'express'
import { IPC_CHANNELS } from 'shared/ipcChannels'
import { createLogger } from './logger'
import { accountManager } from './managers/AccountManager'
import { contextManager } from './managers/BrowserContextManager'
import { taskManager } from './managers/TaskManager'
import type { AutoMessageConfig } from './tasks/autoMessage'
import { AutoMessageTask } from './tasks/autoMessage'
import { type AutoPopUpConfig, AutoPopUpTask } from './tasks/autoPopUp'
import type { AutoReplyConfig } from './tasks/autoReply'
import { AutoReplyManager } from './tasks/autoReply/AutoReplyManager'
import { LiveControlManager } from './tasks/connection/LiveControlManager'
import { LiveController } from './tasks/controller/LiveController'
import { replaceVariant, typedIpcMainOn } from './utils'
import windowManager from './windowManager'

const logger = createLogger('APIServer')
const app = express()
app.use(express.json({ limit: '10mb' }))

let syncedState: any = {}
typedIpcMainOn(IPC_CHANNELS.state.syncToMain, (_, state) => {
  syncedState = state
})

const PORT = process.env.API_PORT || 3000
const AUTO_POPUP_TASK_NAME = '自动弹窗'
const AUTO_MESSAGE_TASK_NAME = '自动发言'
const AUTO_REPLY_TASK_NAME = '自动回复'

app.get('/state/accounts', (req, res) => {
  res.status(200).json(syncedState)
})

// 启动自动弹窗任务
app.post('/tasks/auto-popup/start', (req, res) => {
  const config = req.body as AutoPopUpConfig

  if (!config || !config.goodsIds || !config.scheduler) {
    return res.status(400).json({ error: '无效的配置' })
  }

  try {
    // 检查中控台是否已连接
    contextManager.getCurrentContext()

    taskManager.register(
      AUTO_POPUP_TASK_NAME,
      (page, account) => new AutoPopUpTask(page, account, config),
    )
    taskManager.startTask(AUTO_POPUP_TASK_NAME)

    logger.info('通过 API 启动自动弹窗任务')
    res.status(200).json({ message: '自动弹窗任务已启动' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 启动自动弹窗任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 停止自动弹窗任务
app.post('/tasks/auto-popup/stop', (req, res) => {
  try {
    taskManager.stopTask(AUTO_POPUP_TASK_NAME)
    logger.info('通过 API 停止自动弹窗任务')
    res.status(200).json({ message: '自动弹窗任务已停止' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 停止自动弹窗任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 更新自动弹窗任务配置
app.post('/tasks/auto-popup/update-config', (req, res) => {
  const newConfig = req.body as Partial<AutoPopUpConfig>

  if (!newConfig) {
    return res.status(400).json({ error: '无效的配置' })
  }

  try {
    taskManager.updateTaskConfig(AUTO_POPUP_TASK_NAME, newConfig)
    logger.info('通过 API 更新自动弹窗任务配置')
    res.status(200).json({ message: '自动弹窗任务配置已更新' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 更新自动弹窗任务配置失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 启动自动发言任务
app.post('/tasks/auto-message/start', (req, res) => {
  const config = req.body as AutoMessageConfig

  if (!config || !config.messages || !config.scheduler) {
    return res.status(400).json({ error: '无效的配置' })
  }

  try {
    contextManager.getCurrentContext()

    taskManager.register(
      AUTO_MESSAGE_TASK_NAME,
      (page, account) => new AutoMessageTask(page, account, config),
    )
    taskManager.startTask(AUTO_MESSAGE_TASK_NAME)

    logger.info('通过 API 启动自动发言任务')
    res.status(200).json({ message: '自动发言任务已启动' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 启动自动发言任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 停止自动发言任务
app.post('/tasks/auto-message/stop', (req, res) => {
  try {
    taskManager.stopTask(AUTO_MESSAGE_TASK_NAME)
    logger.info('通过 API 停止自动发言任务')
    res.status(200).json({ message: '自动发言任务已停止' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 停止自动发言任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 一键刷屏
app.post('/tasks/auto-message/send-batch', async (req, res) => {
  const { messages, count } = req.body as { messages: string[]; count: number }

  if (
    !messages ||
    !count ||
    !Array.isArray(messages) ||
    typeof count !== 'number'
  ) {
    return res.status(400).json({ error: '无效的参数' })
  }

  try {
    const page = contextManager.getCurrentContext().page
    await AutoMessageTask.sendBatchMessages(page, messages, count)
    logger.info('通过 API 执行一键刷屏')
    res.status(200).json({ message: '一键刷屏任务已执行' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 执行一键刷屏失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 启动自动回复任务
app.post('/tasks/auto-reply/start', async (req, res) => {
  const config = req.body as AutoReplyConfig

  if (!config) {
    return res.status(400).json({ error: '无效的配置' })
  }

  try {
    contextManager.getCurrentContext()

    taskManager.register(
      AUTO_REPLY_TASK_NAME,
      (page, account) => new AutoReplyManager(page, account, config),
    )
    await taskManager.startTask(AUTO_REPLY_TASK_NAME)

    logger.info('通过 API 启动自动回复任务')
    res.status(200).json({ message: '自动回复任务已启动' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 启动自动回复任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 停止自动回复任务
app.post('/tasks/auto-reply/stop', (req, res) => {
  try {
    taskManager.stopTask(AUTO_REPLY_TASK_NAME)
    logger.info('通过 API 停止自动回复任务')
    res.status(200).json({ message: '自动回复任务已停止' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 停止自动回复任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 手动发送回复
app.post('/tasks/auto-reply/send', async (req, res) => {
  const { message } = req.body as { message: string }

  if (!message) {
    return res.status(400).json({ error: '无效的消息' })
  }

  try {
    const page = contextManager.getCurrentContext().page
    const controller = new LiveController(page)
    await controller.sendMessage(replaceVariant(message))
    logger.info('通过 API 发送回复')
    res.status(200).json({ message: '回复已发送' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 发送回复失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 连接到中控台
app.post('/tasks/live-control/connect', async (req, res) => {
  const {
    platform = 'douyin',
    headless,
    chromePath,
    storageState,
  } = req.body as {
    platform: LiveControlPlatform
    headless?: boolean
    chromePath?: string
    storageState?: string
  }

  const manager = new LiveControlManager(platform)
  if (chromePath) {
    manager.setChromePath(chromePath)
  }

  try {
    const { browser, context, page, accountName } = await manager.connect({
      headless,
      storageState,
    })

    contextManager.setContext(accountManager.getActiveAccount().id, {
      browser,
      browserContext: context,
      page,
      platform,
    })

    logger.info('通过 API 连接到中控台')
    const accountId = accountManager.getActiveAccount().id
    windowManager.send(
      IPC_CHANNELS.tasks.liveControl.connectedEvent,
      accountId,
      accountName,
      platform,
      headless ?? false,
    )
    res.status(200).json({ message: '成功连接到中控台', accountName })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 连接到中控台失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

// 断开中控台连接
app.post('/tasks/live-control/disconnect', async (req, res) => {
  try {
    const currentContext = contextManager.getCurrentContext()
    const accountId = accountManager.getActiveAccount().id
    await currentContext.browser.close()
    windowManager.send(
      IPC_CHANNELS.tasks.liveControl.disconnectedEvent,
      accountId,
    )
    logger.info('通过 API 断开中控台连接')
    res.status(200).json({ message: '中控台连接已断开' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 断开中控台连接失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

export function startApiServer() {
  app.listen(PORT, () => {
    logger.info(`API 服务器正在监听端口 ${PORT}`)
  })
}
