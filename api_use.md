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
    "goodsIds": [1]
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
