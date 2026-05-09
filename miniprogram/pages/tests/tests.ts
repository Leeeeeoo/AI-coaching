import { testItems } from '../../utils/mock-data'
import { createSession } from '../../utils/api'

Component({
  data: {
    testItems,
    loading: false,
  },
  methods: {
    async openTest(event: any) {
      if (this.data.loading) {
        return
      }
      const sceneId = Number(event.currentTarget.dataset.index || 0) + 1
      this.setData({ loading: true })
      wx.showLoading({ title: '创建测评...' })
      try {
        const session = await createSession({ sceneId, mode: 'test', channel: 'text' })
        wx.setStorageSync(`session:${session.sessionId}`, session)
        wx.navigateTo({ url: `/pages/chat/chat?sessionId=${session.sessionId}` })
      } catch (error: any) {
        wx.showToast({ title: error.message || '创建失败', icon: 'none' })
      } finally {
        wx.hideLoading()
        this.setData({ loading: false })
      }
    },
  },
})
