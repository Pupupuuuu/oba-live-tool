# API 使用说明

本文档介绍了如何使用本工具提供的 API 来控制自动化任务。

## 打开中控台

### 获取账户配置

在连接到中控台之前，您需要先获取所有账户的配置信息，特别是用于免登录的 `storageState`。

- **URL**: `/state/accounts`
- **Method**: `GET`
- **成功响应 (200 OK)**:
  ```json
  {
    "accounts": [
      {
        "id": "default",
        "name": "默认账号",
        "config": {
          "path": "C:\path\to\chrome.exe",
          "storageState": "{\"cookies\":[...],\"origins\":[...]}",
          "headless": false
        }
      }
    ]
  }
  ```

### 连接到中控台

- **URL**: `/tasks/live-control/connect`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "platform": "douyin",
    "headless": true,
    "chromePath": "C:\path\to\chrome.exe",
    "storageState": "{...}"
  }
  ```

#### 参数说明

- `platform` (string, required): 要连接的直播平台。支持的选项包括：
  - `douyin`: 抖音小店
  - `buyin`: 巨量百应
  - `eos`: 抖音团购
  - `redbook`: 小红书
  - `wxchannel`: 视频号
  - `kuaishou`: 快手小店
  - `taobao`: 淘宝
- `headless` (boolean, optional): 是否以无头模式（后台静默运行）启动浏览器。默认为 `true`。
- `chromePath` (string, optional): 指定的浏览器可执行文件路径。如果未提供，程序将自动查找。
- `storageState` (string, optional): JSON 格式的字符串，包含了浏览器的登录状态（Cookies, Local Storage等）。提供此参数可以跳过登录步骤。通常在一次成功登录后由程序返回，用户无需手动构造。

### 断开中控台连接

- **URL**: `/tasks/live-control/disconnect`
- **Method**: `POST`

## 自动弹窗

### 启动自动弹窗任务

- **URL**: `/tasks/auto-popup/start`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "goodsIds": [1, 2, 3],
    "scheduler": {
      "interval": [30000, 60000]
    },
    "random": false
  }
  ```

### 停止自动弹窗任务

- **URL**: `/tasks/auto-popup/stop`
- **Method**: `POST`

### 更新自动弹窗任务配置

- **URL**: `/tasks/auto-popup/update-config`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "goodsIds": [4, 5, 6]
  }
  ```

## 自动发言

### 启动自动发言任务

- **URL**: `/tasks/auto-message/start`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "messages": [
      { "id": "1", "content": "欢迎来到直播间！", "pinTop": false },
      { "id": "2", "content": "喜欢主播的点点关注！", "pinTop": true }
    ],
    "scheduler": {
      "interval": [30000, 60000]
    },
    "random": true,
    "extraSpaces": true
  }
  ```

### 停止自动发言任务

- **URL**: `/tasks/auto-message/stop`
- **Method**: `POST`

### 一键刷屏

- **URL**: `/tasks/auto-message/send-batch`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "messages": ["666", "主播真棒！"],
    "count": 10
  }
  ```

## 自动回复

### 启动自动回复任务

启动自动回复任务，开始监听直播间的互动信息并根据配置进行回复。

- **URL**: `/tasks/auto-reply/start`
- **Method**: `POST`

#### 参数说明

- `source` (string, required): 监听信息的来源，决定了能获取到哪些互动信息。
  - `"control"`: 通过中控台的评论列表获取信息。**仅能监听到评论互动**。
  - `"compass"`: 通过电商罗盘的直播大屏获取信息。**能监听到包括评论、进入直播间、点赞、关注、下单等更全面的互动信息**。推荐使用此模式。
- `ws` (object, optional): WebSocket 服务配置。
  - `enable` (boolean): 是否启用 WebSocket 服务。启用后，所有监听到的互动信息会通过 WebSocket 广播。
  - `port` (number): WebSocket 服务的端口号。
- `comment` (object, required): 针对用户评论的回复配置。
  - `keywordReply` (object): 关键词回复配置。
    - `enable` (boolean): 是否启用关键词回复。
    - `rules` (array): 关键词规则列表。
      - `keywords` (string[]): 触发回复的关键词数组。评论中包含任意一个关键词即会触发。
      - `contents` (string[]): 回复内容数组。触发后会随机选择一条内容进行回复。
  - `aiReply` (object): AI 智能回复配置。
    - `enable` (boolean): 是否启用 AI 回复。当关键词回复未命中时，会使用 AI 回复。
    - `prompt` (string): 提供给 AI 的系统提示词，用于指导 AI 的行为和回复风格。
    - `autoSend` (boolean): AI 生成回复后是否自动发送。`false` 则仅在界面上显示预览，可手动发送。

- **Body 示例**:
  ```json
  {
    "source": "compass",
    "ws": {
      "enable": true,
      "port": 12354
    },
    "comment": {
      "keywordReply": {
        "enable": true,
        "rules": [
          {
            "keywords": ["价格", "多少钱"],
            "contents": ["价格在详情页哦", "可以看我们的1号链接"]
          }
        ]
      },
      "aiReply": {
        "enable": true,
        "prompt": "你是一个友好的直播间助手...",
        "autoSend": false
      }
    }
  }
  ```

### 停止自动回复任务

- **URL**: `/tasks/auto-reply/stop`
- **Method**: `POST`

### 手动发送回复

- **URL**: `/tasks/auto-reply/send`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "message": "欢迎新来的朋友！"
  }
  ```