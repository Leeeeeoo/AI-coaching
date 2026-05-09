import { ApiMessage, finishSession, sendTurn } from '../../utils/api'

Component({
  data: {
    sessionId: '',
    mode: 'training',
    title: 'AI 对话',
    messages: [] as ApiMessage[],
    inputValue: '',
    suggestions: [] as string[],
    loading: false,
    canFinish: false,
  },
  methods: {
    onLoad(options: any) {
      const sessionId = String(options?.sessionId || '')
      const session = sessionId ? wx.getStorageSync(`session:${sessionId}`) : null
      if (!session) {
        wx.showToast({ title: '会话不存在，请重新进入', icon: 'none' })
        return
      }
      this.setData({
        sessionId,
        mode: session.mode,
        title: session.scenario?.title || 'AI 对话',
        messages: [session.firstMessage],
      })
    },
    onInput(event: any) {
      this.setData({ inputValue: event.detail.value })
    },
    async sendMessage() {
      const value = String(this.data.inputValue || '').trim()
      if (!value || this.data.loading) {
        return
      }
      const nextMessage: ApiMessage = {
        role: 'pharmacist',
        name: '药师',
        text: value,
        time: currentTime(),
      }
      this.setData({
        messages: [...this.data.messages, nextMessage],
        inputValue: '',
        loading: true,
      })
      try {
        const result = await sendTurn(this.data.sessionId, value)
        this.setData({
          messages: [...this.data.messages, result.message],
          suggestions: result.suggestions || [],
          canFinish: result.canFinish,
        })
      } catch (error: any) {
        wx.showToast({ title: error.message || '发送失败', icon: 'none' })
      } finally {
        this.setData({ loading: false })
      }
    },
    async finishChat() {
      if (!this.data.sessionId || this.data.loading) {
        return
      }
      this.setData({ loading: true })
      wx.showLoading({ title: '生成报告...' })
      try {
        const result = await finishSession(this.data.sessionId)
        wx.setStorageSync(`report:${result.reportId}`, result.report)
        wx.navigateTo({ url: `/pages/report/report?reportId=${result.reportId}` })
      } catch (error: any) {
        wx.showToast({ title: error.message || '生成失败', icon: 'none' })
      } finally {
        wx.hideLoading()
        this.setData({ loading: false })
      }
    },
  },
})

function currentTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}
