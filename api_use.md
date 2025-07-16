# API 使用说明

本文档介绍了如何使用本工具提供的 API 来控制自动化任务。

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

- **URL**: `/tasks/auto-reply/start`
- **Method**: `POST`
- **Body**:
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