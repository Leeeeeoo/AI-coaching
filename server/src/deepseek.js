const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const chatModel = process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-v4-flash'
const reportModel = process.env.DEEPSEEK_REPORT_MODEL || 'deepseek-v4-pro'

export async function generatePatientReply({ session, userText }) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return fallbackPatientReply(session, userText)
  }

  const messages = [
    {
      role: 'system',
      content: buildPatientSystemPrompt(session),
    },
    ...session.messages.map((message) => ({
      role: message.role === 'pharmacist' ? 'user' : 'assistant',
      content: message.text,
    })),
    {
      role: 'user',
      content: userText,
    },
  ]

  try {
    return await callDeepSeek({
      model: chatModel,
      messages,
      temperature: 0.7,
    })
  } catch {
    return fallbackPatientReply(session, userText)
  }
}

export async function generateTrainingHint({ session, userText, patientReply }) {
  if (session.mode !== 'training') {
    return []
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return fallbackTrainingHints(userText, patientReply)
  }

  try {
    const content = await callDeepSeek({
      model: chatModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            '你是药师训练教练。请基于药师刚才的回复，给出最多3条极短训练提示。只输出 JSON 字符串数组，不要解释。',
        },
        {
          role: 'user',
          content: JSON.stringify({
            mode: session.mode,
            scenario: session.scenario,
            pharmacistText: userText,
            patientReply,
          }),
        },
      ],
    })

    return parseStringArray(content, fallbackTrainingHints(userText, patientReply))
  } catch {
    return fallbackTrainingHints(userText, patientReply)
  }
}

export async function generateReport({ session }) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return fallbackReport(session)
  }

  try {
    const content = await callDeepSeek({
      model: reportModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            '你是 DLBCL 院外药学服务训练评分员。按 100 分 rubric 输出 JSON，不要输出 markdown。字段必须包含：score, grade, comment, dimensions[{label,value}], review[{index,title,result,tone}], goodPoints, improvements, missedQuestions, riskReminder, revisedScript, nextSuggestion。',
        },
        {
          role: 'user',
          content: JSON.stringify({
            mode: session.mode,
            scenario: session.scenario,
            messages: session.messages,
          }),
        },
      ],
    })

    return normalizeReport(JSON.parse(extractJson(content)))
  } catch {
    return fallbackReport(session)
  }
}

async function callDeepSeek(payload) {
  const response = await fetch(`${deepseekBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`DeepSeek request failed: ${response.status} ${body}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

function buildPatientSystemPrompt(session) {
  return [
    '你扮演 DLBCL 患者或家属，用中文与药师进行训练对话。',
    '必须逐步披露信息，不要一次性给出所有关键症状。',
    '不得替代医生诊疗，不得鼓励停药、减量、延迟治疗或承诺疗效/报销。',
    `训练模式：${session.mode}`,
    `情景：${session.scenario.title}`,
    `患者类型：${session.scenario.patientType}`,
    `训练目标：${session.scenario.objective}`,
  ].join('\n')
}

function fallbackPatientReply(session, userText) {
  const text = userText || ''
  const askedTemperature = /体温|多少度|发热|发烧/.test(text)
  const askedDoctor = /医生|医院|就医|返院/.test(text)
  const askedSymptoms = /寒战|咳嗽|呼吸|头晕|意识|低血压|症状/.test(text)

  if (askedTemperature && !askedSymptoms) {
    return '我最高量到 38.5℃，大概从今天下午开始的。除了发热，我还觉得有点乏力。'
  }
  if (askedSymptoms && !askedDoctor) {
    return '还有点寒战和咳嗽，刚才起身时也有点头晕。我还没联系医生，想先问问能不能买药吃。'
  }
  if (askedDoctor) {
    return '明白了，我会尽快联系主治医生或去医院评估。那我现在需要把体温和症状都记录下来，对吗？'
  }
  if (/停药|减量|推迟|延期/.test(text)) {
    return '我主要是担心副作用和费用，所以才想自己先缓一缓。听您这么说，我需要先问医生再决定。'
  }
  return '我有点担心这个情况会不会影响后续治疗。您还需要了解哪些信息？'
}

function fallbackTrainingHints(userText, patientReply) {
  const hints = []
  if (!/体温|多少度/.test(userText)) {
    hints.push('建议追问最高体温和持续时间。')
  }
  if (!/寒战|咳嗽|呼吸|意识|头晕|低血压/.test(userText)) {
    hints.push('注意追问红旗信号和伴随症状。')
  }
  if (!/医生|医院|就医|返院/.test(userText + patientReply)) {
    hints.push('发现风险时应推动联系医生或及时就医。')
  }
  return hints.slice(0, 3)
}

function fallbackReport(session) {
  const joined = session.messages.map((message) => message.text).join('\n')
  const hasDoctor = /医生|医院|就医|返院/.test(joined)
  const hasTemperature = /体温|多少度|38/.test(joined)
  const hasRisk = /寒战|咳嗽|呼吸|意识|头晕|低血压/.test(joined)
  const score = 70 + (hasDoctor ? 8 : 0) + (hasTemperature ? 8 : 0) + (hasRisk ? 8 : 0)

  return normalizeReport({
    score: Math.min(score, 94),
    grade: score >= 86 ? '良好' : '待提升',
    comment: hasDoctor ? '能够关注风险并推动就医评估。' : '需要更明确地完成就医提醒和行动闭环。',
    dimensions: [
      { label: '信息收集完整度', value: hasTemperature ? 86 : 68 },
      { label: '专业准确性', value: 82 },
      { label: '风险识别', value: hasRisk ? 88 : 66 },
      { label: '合规边界', value: hasDoctor ? 90 : 72 },
      { label: '行动闭环', value: hasDoctor ? 86 : 65 },
    ],
    review: [
      { index: 1, title: '症状追问', result: hasTemperature ? '较完整' : '需补充体温追问', tone: hasTemperature ? 'ok' : 'warn' },
      { index: 2, title: '风险识别', result: hasRisk ? '已覆盖红旗信号' : '红旗信号追问不足', tone: hasRisk ? 'ok' : 'warn' },
      { index: 3, title: '行动闭环', result: hasDoctor ? '已建议联系医生' : '需明确就医建议', tone: hasDoctor ? 'ok' : 'warn' },
    ],
    goodPoints: ['语气较温和，能够回应患者担忧。'],
    improvements: ['继续强化体温、持续时间、伴随症状和是否联系医生的结构化追问。'],
    missedQuestions: hasTemperature ? [] : ['最高体温是多少？发热持续多久？'],
    riskReminder: '遇到持续高热、呼吸困难、意识改变、低血压等红旗信号，应提醒及时联系医生或就医评估。',
    revisedScript:
      '您提到有发热，我需要确认最高体温、持续时间，以及有没有寒战、咳嗽、呼吸困难、头晕或意识改变。如果体温持续超过 38℃或伴随明显不适，建议尽快联系主治医生或前往医院评估。',
    nextSuggestion: '建议复练“C1 后发热随访”和“后线 C1 后 CRS / ICANS 风险”。',
  })
}

function parseStringArray(content, fallback) {
  try {
    const value = JSON.parse(extractJson(content))
    return Array.isArray(value) ? value.map(String).slice(0, 3) : fallback
  } catch {
    return fallback
  }
}

function extractJson(content) {
  const trimmed = String(content || '').trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  return fenced ? fenced[1].trim() : trimmed
}

function normalizeReport(report) {
  return {
    score: Number(report.score || 0),
    grade: report.grade || '待提升',
    comment: report.comment || '',
    dimensions: Array.isArray(report.dimensions) ? report.dimensions : [],
    review: Array.isArray(report.review) ? report.review : [],
    goodPoints: Array.isArray(report.goodPoints) ? report.goodPoints : [],
    improvements: Array.isArray(report.improvements) ? report.improvements : [],
    missedQuestions: Array.isArray(report.missedQuestions) ? report.missedQuestions : [],
    riskReminder: report.riskReminder || '',
    revisedScript: report.revisedScript || '',
    nextSuggestion: report.nextSuggestion || '',
  }
}
