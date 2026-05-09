const sessions = new Map()
const reports = new Map()

export function saveSession(session) {
  sessions.set(session.sessionId, session)
  return session
}

export function readSession(sessionId) {
  const session = sessions.get(sessionId)
  if (!session) {
    const error = new Error('Session not found')
    error.status = 404
    throw error
  }
  return session
}

export function saveReport(report) {
  reports.set(report.reportId, report)
  return report
}

export function readReport(reportId) {
  const report = reports.get(reportId)
  if (!report) {
    const error = new Error('Report not found')
    error.status = 404
    throw error
  }
  return report
}

export function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
