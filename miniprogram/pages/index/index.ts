import { trainingCategories } from '../../utils/mock-data'

Component({
  data: {
    categories: trainingCategories,
    trend: [18, 28, 22, 36, 26, 44, 54],
  },
  methods: {
    goScenes() {
      wx.navigateTo({ url: '/pages/scenes/scenes' })
    },
    goPath() {
      wx.navigateTo({ url: '/pages/path/path' })
    },
  },
})
