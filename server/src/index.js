import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { createSession, finishSession, getReport, handleTextTurn, handleVoiceTurn } from './routes.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } })
const port = Number(process.env.AI_SERVER_PORT || 8787)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/sessions', async (req, res) => {
  try {
    res.json(await createSession(req.body))
  } catch (error) {
    handleError(res, error)
  }
})

app.post('/api/sessions/:sessionId/turns', async (req, res) => {
  try {
    res.json(await handleTextTurn(req.params.sessionId, req.body))
  } catch (error) {
    handleError(res, error)
  }
})

app.post('/api/sessions/:sessionId/voice-turns', upload.single('audio'), async (req, res) => {
  try {
    res.json(await handleVoiceTurn(req.params.sessionId, req.file))
  } catch (error) {
    handleError(res, error)
  }
})

app.post('/api/sessions/:sessionId/finish', async (req, res) => {
  try {
    res.json(await finishSession(req.params.sessionId))
  } catch (error) {
    handleError(res, error)
  }
})

app.get('/api/reports/:reportId', async (req, res) => {
  try {
    res.json(await getReport(req.params.reportId))
  } catch (error) {
    handleError(res, error)
  }
})

app.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`)
})

function handleError(res, error) {
  const status = error.status || 500
  res.status(status).json({
    error: error.message || 'Server error',
  })
}
