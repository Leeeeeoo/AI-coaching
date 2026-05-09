import { scenarioGroups } from '../../utils/mock-data'
import { createSession, SessionChannel } from '../../utils/api'

Component({
  data: {
    scenarioGroups,
    loading: false,
  },
  methods: {
    async openScenario(event: any) {
      if (this.data.loading) {
        return
      }
      const channel = event.currentTarget.dataset.mode as SessionChannel
      const sceneId = Number(event.currentTarget.dataset.id || 1)
      this.setData({ loading: true })
      wx.showLoading({ title: '创建会话...' })
      try {
        const session = await createSession({ sceneId, mode: 'training', channel })
        wx.setStorageSync(`session:${session.sessionId}`, session)
        const page = channel === 'voice' ? '/pages/voice/voice' : '/pages/chat/chat'
        wx.navigateTo({ url: `${page}?sessionId=${session.sessionId}` })
      } catch (error: any) {
        wx.showToast({ title: error.message || '创建失败', icon: 'none' })
      } finally {
        wx.hideLoading()
        this.setData({ loading: false })
      }
    },
  },
})
