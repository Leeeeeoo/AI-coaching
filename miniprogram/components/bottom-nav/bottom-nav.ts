Component({
  properties: {
    active: {
      type: String,
      value: 'training',
    },
  },
  methods: {
    goTraining() {
      wx.redirectTo({ url: '/pages/index/index' })
    },
    goTests() {
      wx.redirectTo({ url: '/pages/tests/tests' })
    },
    goProfile() {
      wx.redirectTo({ url: '/pages/profile/profile' })
    },
  },
})
