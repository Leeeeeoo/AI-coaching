import { getReport } from '../../utils/api'
import { reportDimensions, reportReview } from '../../utils/mock-data'

Component({
  data: {
    reportId: '',
    score: 86,
    grade: '良好',
    comment: '表现良好，继续保持！',
    scenarioTitle: '综合测试',
    completedAt: '2025-05-20 09:21',
    reportDimensions,
    reportReview,
    goodPoints: [] as string[],
    improvements: [] as string[],
    missedQuestions: [] as string[],
    riskReminder: '',
    revisedScript: '',
    nextSuggestion: '',
  },
  methods: {
    async onLoad(options: any) {
      const reportId = String(options?.reportId || '')
      if (!reportId) {
        return
      }
      this.setData({ reportId })
      const cached = wx.getStorageSync(`report:${reportId}`)
      if (cached) {
        this.applyReport(cached)
      }
      try {
        const result = await getReport(reportId)
        this.applyReport(result.report)
      } catch {
        if (!cached) {
          wx.showToast({ title: '报告读取失败，显示示例数据', icon: 'none' })
        }
      }
    },
    applyReport(report: any) {
      this.setData({
        score: report.score || 0,
        grade: report.grade || '待提升',
        comment: report.comment || '',
        scenarioTitle: report.scenario?.title || '训练报告',
        completedAt: formatDate(report.completedAt),
        reportDimensions: report.dimensions?.length ? report.dimensions : reportDimensions,
        reportReview: report.review?.length ? report.review : reportReview,
        goodPoints: report.goodPoints || [],
        improvements: report.improvements || [],
        missedQuestions: report.missedQuestions || [],
        riskReminder: report.riskReminder || '',
        revisedScript: report.revisedScript || '',
        nextSuggestion: report.nextSuggestion || '',
      })
    },
  },
})

function formatDate(value: string) {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}
