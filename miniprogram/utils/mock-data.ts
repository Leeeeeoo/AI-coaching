export type StatusTone = 'done' | 'active' | 'idle' | 'warn' | 'ok'

export interface TrainingCategory {
  key: string
  title: string
  icon: string
  tone: string
}

export interface ScenarioItem {
  id: number
  title: string
  desc: string
  status: string
  tone: StatusTone
  mode: 'chat' | 'voice'
}

export interface ScenarioGroup {
  title: string
  items: ScenarioItem[]
}

export interface TestItem {
  title: string
  meta: string[]
  tone: string
}

export interface ChatMessage {
  role: 'ai' | 'pharmacist'
  name: string
  text: string
  time: string
}

export const trainingCategories: TrainingCategory[] = [
  { key: 'record', title: '初次建档', icon: '⌾', tone: 'purple' },
  { key: 'first', title: '1L治疗', icon: '▤', tone: 'blue' },
  { key: 'rr', title: 'R/R治疗', icon: '▣', tone: 'green' },
  { key: 'adr', title: '不良反应', icon: '○', tone: 'orange' },
  { key: 'pay', title: '医保支付', icon: '□', tone: 'cyan' },
  { key: 'care', title: '结疗复查', icon: '♥', tone: 'heart' },
]

export const scenarioGroups: ScenarioGroup[] = [
  {
    title: '初次建档',
    items: [
      { id: 1, title: '初次建档：患者信息核对', desc: '建档、表明身份、收集风险信息', status: '已完成', tone: 'done', mode: 'chat' },
      { id: 2, title: '疾病宣教：解释 DLBCL 与治疗信心', desc: '建立信任，解释治疗目标', status: '进行中', tone: 'active', mode: 'chat' },
    ],
  },
  {
    title: '1L治疗',
    items: [
      { id: 3, title: '1L治疗：Pola-R-CHP / R-CHOP介绍', desc: '方案理解与用药节点提醒', status: '未开始', tone: 'idle', mode: 'chat' },
      { id: 4, title: 'C1完成后随访', desc: '询问治疗后反应与下次治疗', status: '未开始', tone: 'idle', mode: 'chat' },
      { id: 5, title: 'C2-C6治疗前提醒', desc: '依从性管理与风险识别', status: '未开始', tone: 'idle', mode: 'chat' },
    ],
  },
  {
    title: 'R/R治疗',
    items: [
      { id: 6, title: 'R/R治疗：Glofit-GemOx说明', desc: '后线建档与首周期节点', status: '未开始', tone: 'idle', mode: 'voice' },
      { id: 7, title: 'CRS/ICANS识别', desc: '识别发热、低血压、意识改变', status: '未开始', tone: 'idle', mode: 'voice' },
    ],
  },
  {
    title: '随访与复查',
    items: [
      { id: 8, title: '长期复查提醒', desc: '复查频率、复发信号和长期关怀', status: '未开始', tone: 'idle', mode: 'chat' },
    ],
  },
]

export const testItems: TestItem[] = [
  { title: '初次建档综合测评', meta: ['20题', '限时15分钟', '模拟真实患者'], tone: 'purple' },
  { title: '一线路径考核', meta: ['20题', '限时15分钟', '模拟真实患者'], tone: 'blue' },
  { title: '复发/难治路径考核', meta: ['20题', '限时15分钟', '模拟真实患者'], tone: 'green' },
  { title: '不良反应识别', meta: ['20题', '限时15分钟', '模拟真实患者'], tone: 'orange' },
  { title: '结疗复查与长期关怀', meta: ['20题', '限时15分钟', '模拟真实患者'], tone: 'cyan' },
]

export const chatMessages: ChatMessage[] = [
  {
    role: 'ai',
    name: 'AI患者',
    text: '我今天输液后有点发热，还觉得手脚有点麻，需要担心吗？',
    time: '09:21',
  },
  {
    role: 'pharmacist',
    name: '药师',
    text: '理解您的担心。请您每4小时测量体温，若体温≥38℃或持续发热，需要及时联系医生。',
    time: '09:25',
  },
  {
    role: 'pharmacist',
    name: '药师',
    text: '手脚麻木可能与周围神经症状有关，请注意观察是否影响日常活动，如症状加重或出现无力，请尽快就医。',
    time: '09:25',
  },
  {
    role: 'pharmacist',
    name: '药师',
    text: '下次随访时间是下周三，我们会持续关注您的恢复情况。如有任何不适随时联系我。',
    time: '09:25',
  },
]

export const reportDimensions = [
  { label: '专业准确性', value: 88 },
  { label: '共情沟通', value: 84 },
  { label: '依从性引导', value: 87 },
  { label: '风险识别', value: 82 },
  { label: '随访闭环', value: 89 },
]

export const reportReview = [
  { index: 1, title: 'Pola-R-CHP周期', result: '正确', tone: 'ok' },
  { index: 2, title: 'CRS预警症状', result: '部分正确', tone: 'warn' },
  { index: 3, title: '复查频率', result: '正确', tone: 'ok' },
]

export const profileStats = [
  { label: '累计训练', value: '42次' },
  { label: '平均得分', value: '85分' },
  { label: '高风险识别率', value: '81%' },
  { label: '闭环完成率', value: '88%' },
]

export const badges = ['DLBCL基础训练完成', '1L路径达标', 'R/R路径达标']

export const pathCards = [
  {
    title: '1L：C1-C6',
    tone: 'blue',
    icon: '针',
    points: ['Pola-R-CHP / R-CHOP', '21天/周期', '通常6周期', '关注IRR、骨髓抑制、周围神经病'],
  },
  {
    title: 'R/R：C1-C12',
    tone: 'green',
    icon: '药',
    points: ['Glofit-GemOx', 'C1更复杂单抗预处理', '阶梯递增 2.5mg→10mg→30mg', '警惕 CRS、ICANS、燃瘤反应'],
  },
  {
    title: '复查提醒',
    tone: 'orange',
    icon: '历',
    points: ['复查：2年内每3个月', '3-5年每6个月', '5年后每年'],
  },
]
