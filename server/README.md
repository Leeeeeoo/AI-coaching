# AI 服务层

这个服务为微信小程序提供 AI 会话、语音转写和报告生成接口。大语言模型相关流程统一通过 LangGraph 编排。

## 启动

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

默认端口是 `8787`。没有配置 DeepSeek 或阿里云密钥时，服务会使用本地 fallback，便于小程序先跑通交互闭环。

## 接口

- `POST /api/sessions`
- `POST /api/sessions/:sessionId/turns`
- `POST /api/sessions/:sessionId/voice-turns`
- `POST /api/sessions/:sessionId/finish`
- `GET /api/reports/:reportId`

生产环境请使用 HTTPS 域名，并在微信小程序后台配置 request/uploadFile 合法域名。
