import { transcribeAudio } from './asr.js'
import { reportGraph, sessionGraph } from './graphs.js'
import { findScenario } from './scenarios.js'
import { makeId, readReport, readSession, saveReport, saveSession } from './store.js'

export async function createSession(body = {}) {
  const scenario = findScenario(body.sceneId)
  const session = saveSession({
    sessionId: makeId('session'),
    sceneId: scenario.id,
    scenario,
    mode: body.mode === 'test' ? 'test' : 'training',
    channel: body.channel === 'voice' ? 'voice' : 'text',
    messages: [
      makeMessage({
        role: 'ai',
        name: 'AI患者',
        text: scenario.opening,
      }),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return {
    sessionId: session.sessionId,
    scenario,
    mode: session.mode,
    channel: session.channel,
    firstMessage: session.messages[0],
  }
}

export async function handleTextTurn(sessionId, body = {}) {
  const text = String(body.text || '').trim()
  if (!text) {
    const error = new Error('Text is required')
    error.status = 400
    throw error
  }

  const session = readSession(sessionId)
  session.messages.push(makeMessage({ role: 'pharmacist', name: '药师', text }))

  const result = await sessionGraph.invoke({ session, userText: text })
  const aiMessage = makeMessage({ role: 'ai', name: 'AI患者', text: result.patientReply })

  session.messages.push(aiMessage)
  session.updatedAt = new Date().toISOString()
  saveSession(session)

  return {
    sessionId,
    message: aiMessage,
    suggestions: result.suggestions || [],
    canFinish: Boolean(result.canFinish),
  }
}

export async function handleVoiceTurn(sessionId, file) {
  const transcript = await transcribeAudio(file)
  const turn = await handleTextTurn(sessionId, { text: transcript })
  return {
    ...turn,
    transcript,
  }
}

export async function finishSession(sessionId) {
  const session = readSession(sessionId)
  const result = await reportGraph.invoke({ session })
  const report = saveReport({
    reportId: makeId('report'),
    sessionId,
    scenario: session.scenario,
    mode: session.mode,
    completedAt: new Date().toISOString(),
    ...result.report,
  })

  return {
    reportId: report.reportId,
    report,
  }
}

export async function getReport(reportId) {
  return {
    report: readReport(reportId),
  }
}

function makeMessage({ role, name, text }) {
  const now = new Date()
  return {
    role,
    name,
    text,
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
  }
}
