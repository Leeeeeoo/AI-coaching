Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    back: {
      type: Boolean,
      value: false,
    },
    rightText: {
      type: String,
      value: '',
    },
    rightIcon: {
      type: String,
      value: '',
    },
  },
  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack()
        return
      }
      wx.redirectTo({ url: '/pages/index/index' })
    },
  },
})
