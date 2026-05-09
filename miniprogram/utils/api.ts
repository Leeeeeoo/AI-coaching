export const API_BASE_URL = 'http://localhost:8787'

export type SessionMode = 'training' | 'test'
export type SessionChannel = 'text' | 'voice'

export interface ApiMessage {
  role: 'ai' | 'pharmacist'
  name: string
  text: string
  time: string
}

export interface CreateSessionResponse {
  sessionId: string
  scenario: {
    id: number
    title: string
    objective: string
  }
  mode: SessionMode
  channel: SessionChannel
  firstMessage: ApiMessage
}

export interface TurnResponse {
  sessionId: string
  message: ApiMessage
  suggestions: string[]
  canFinish: boolean
  transcript?: string
}

export interface ReportResponse {
  report: any
}

export function createSession(payload: { sceneId: number; mode: SessionMode; channel: SessionChannel }) {
  return request<CreateSessionResponse>({
    url: '/api/sessions',
    method: 'POST',
    data: payload,
  })
}

export function sendTurn(sessionId: string, text: string) {
  return request<TurnResponse>({
    url: `/api/sessions/${sessionId}/turns`,
    method: 'POST',
    data: { text },
  })
}

export function finishSession(sessionId: string) {
  return request<{ reportId: string; report: any }>({
    url: `/api/sessions/${sessionId}/finish`,
    method: 'POST',
  })
}

export function getReport(reportId: string) {
  return request<ReportResponse>({
    url: `/api/reports/${reportId}`,
    method: 'GET',
  })
}

export function uploadVoiceTurn(sessionId: string, filePath: string) {
  return new Promise<TurnResponse>((resolve, reject) => {
    wx.uploadFile({
      url: `${API_BASE_URL}/api/sessions/${sessionId}/voice-turns`,
      filePath,
      name: 'audio',
      success(res) {
        try {
          const data = JSON.parse(res.data)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data)
            return
          }
          reject(new Error(data.error || '语音提交失败'))
        } catch (error) {
          reject(error)
        }
      },
      fail: reject,
    })
  })
}

function request<T>(options: { url: string; method: 'GET' | 'POST'; data?: any }) {
  return new Promise<T>((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method,
      data: options.data,
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        const data: any = res.data
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data as T)
          return
        }
        reject(new Error(data?.error || '请求失败'))
      },
      fail: reject,
    })
  })
}
