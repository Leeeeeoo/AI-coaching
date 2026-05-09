import { ApiMessage, finishSession, uploadVoiceTurn } from '../../utils/api'

const recorder = wx.getRecorderManager()

Component({
  data: {
    sessionId: '',
    title: '语音演练',
    muted: false,
    ended: false,
    recording: false,
    loading: false,
    transcript: '',
    messages: [] as ApiMessage[],
    cues: ['追问最高体温', '确认持续时间', '识别寒战/咳嗽/呼吸困难', '确认是否联系医生', '红旗信号需及时就医'],
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
        title: session.scenario?.title || '语音演练',
        messages: [session.firstMessage],
      })

      recorder.onStart(() => {
        this.setData({ recording: true })
      })
      recorder.onStop(async (result) => {
        this.setData({ recording: false })
        await this.submitRecording(result.tempFilePath)
      })
      recorder.onError(() => {
        this.setData({ recording: false, loading: false })
        wx.showToast({ title: '录音失败', icon: 'none' })
      })
    },
    toggleMute() {
      this.setData({ muted: !this.data.muted })
    },
    toggleRecording() {
      if (this.data.loading) {
        return
      }
      if (this.data.recording) {
        recorder.stop()
        return
      }
      recorder.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3',
      })
    },
    async submitRecording(filePath: string) {
      if (!filePath || !this.data.sessionId) {
        return
      }
      this.setData({ loading: true })
      wx.showLoading({ title: '识别中...' })
      try {
        const result = await uploadVoiceTurn(this.data.sessionId, filePath)
        const pharmacistMessage: ApiMessage = {
          role: 'pharmacist',
          name: '药师',
          text: result.transcript || '语音输入',
          time: currentTime(),
        }
        this.setData({
          transcript: result.transcript || '',
          messages: [...this.data.messages, pharmacistMessage, result.message],
          cues: result.suggestions?.length ? result.suggestions : this.data.cues,
        })
      } catch (error: any) {
        wx.showToast({ title: error.message || '语音提交失败', icon: 'none' })
      } finally {
        wx.hideLoading()
        this.setData({ loading: false })
      }
    },
    async endCall() {
      if (!this.data.sessionId || this.data.loading) {
        return
      }
      if (this.data.recording) {
        recorder.stop()
        wx.showToast({ title: '录音提交后再结束', icon: 'none' })
        return
      }
      this.setData({ ended: true, loading: true })
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
