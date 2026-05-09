export const scenarios = [
  {
    id: 1,
    title: '首次建档与治疗启动',
    patientType: '新确诊一线患者',
    objective: '建档、表明身份、收集治疗方案和风险信息',
    opening: '您好，我刚确诊 DLBCL，医生说要开始治疗了。我有点紧张，也不知道药店这边能帮我做些什么。',
  },
  {
    id: 2,
    title: 'C1 后基础随访',
    patientType: '第 1 治疗周期后患者',
    objective: '询问治疗后反应、提醒下次治疗、建立治疗信心',
    opening: '我第一次治疗结束两三天了，整体还可以，就是有点乏力，想问问这是不是正常。',
  },
  {
    id: 3,
    title: 'C1 后发热随访',
    patientType: '第 1 治疗周期后患者',
    objective: '追问体温、持续时间、寒战、感染表现，识别红旗信号',
    opening: '我今天感觉有点发烧，不知道是不是治疗后的正常反应，可以先买点退烧药吗？',
  },
  {
    id: 4,
    title: 'C1 后手脚麻木',
    patientType: '一线 Pola 相关方案患者',
    objective: '识别周围神经病风险，提醒反馈医生',
    opening: '这两天我手脚有点麻，拿东西也不太舒服，这个要紧吗？',
  },
  {
    id: 5,
    title: 'C2 前患者想推迟治疗',
    patientType: '一线持续治疗患者',
    objective: '区分医嘱调整和患者自行延迟，解释足疗程价值',
    opening: '我下次治疗快到了，但最近家里有事，想自己往后推一周，可以吗？',
  },
  {
    id: 6,
    title: '患者担心副作用想停药',
    patientType: '一线持续治疗患者',
    objective: '处理安全性顾虑，避免越权建议，推动医生评估',
    opening: '我有点怕副作用，想先停一停药，等身体好点再继续。',
  },
  {
    id: 7,
    title: '感染风险咨询',
    patientType: '治疗中患者或家属',
    objective: '识别咳嗽、脓痰、尿痛、伤口红肿等感染风险',
    opening: '家里人这两天咳嗽，还有点没精神，我担心是不是感染了。',
  },
  {
    id: 8,
    title: '经济压力与报销咨询',
    patientType: '治疗中患者或家属',
    objective: '说明医保、惠民保、商保、慈善援助查询路径，不承诺结果',
    opening: '这个治疗费用压力挺大的，你们能不能保证这个药能报销？',
  },
  {
    id: 9,
    title: 'C6 后 CR 随访',
    patientType: '一线治疗完成患者',
    objective: '祝贺并转入复查随访，提醒前 2 年复查频率',
    opening: '医生说我这次评估达到 CR 了，后面是不是就不用太管了？',
  },
  {
    id: 10,
    title: 'C6 后未达 CR',
    patientType: '一线治疗完成但未达 CR 患者',
    objective: '安慰患者，提示后线治疗选择需医生评估',
    opening: '这次评估没有达到 CR，我有点害怕，是不是就没办法了？',
  },
  {
    id: 11,
    title: '后线 Glofit-GemOx 建档',
    patientType: '复发 / 难治患者或家属',
    objective: '收集治疗线数、既往方案、担忧点和 C1 特殊节点',
    opening: '医生说要换后线方案，我之前已经治疗过几次了，家里人也很担心。',
  },
  {
    id: 12,
    title: '后线 C1 后 CRS / ICANS 风险',
    patientType: 'Glofit 相关方案患者',
    objective: '识别发热、低血压、呼吸困难、意识改变等风险并提示及时就医',
    opening: '我今天有点发热，还觉得头晕，人也有点反应慢，这种情况要紧吗？',
  },
]

export function findScenario(sceneId) {
  return scenarios.find((scenario) => scenario.id === Number(sceneId)) || scenarios[0]
}
