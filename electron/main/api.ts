import express from 'express'
import { createLogger } from './logger'
import { accountManager } from './managers/AccountManager'
import { contextManager } from './managers/BrowserContextManager'
import { taskManager } from './managers/TaskManager'
import { type AutoPopUpConfig, AutoPopUpTask } from './tasks/autoPopUp'

const logger = createLogger('APIServer')
const app = express()
app.use(express.json())

const PORT = process.env.API_PORT || 3000
const TASK_NAME = '自动弹窗'

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
      TASK_NAME,
      (page, account) => new AutoPopUpTask(page, account, config),
    )
    taskManager.startTask(TASK_NAME)

    logger.info('通过 API 启动自动��窗任务')
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
    taskManager.stopTask(TASK_NAME)
    logger.info('通过 API 停止自动弹窗任务')
    res.status(200).json({ message: '自动弹窗任务已停止' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`通过 API 停止自动弹窗任务失败: ${errorMessage}`)
    res.status(500).json({ error: errorMessage })
  }
})

export function startApiServer() {
  app.listen(PORT, () => {
    logger.info(`API 服务器正在监听端口 ${PORT}`)
  })
}
