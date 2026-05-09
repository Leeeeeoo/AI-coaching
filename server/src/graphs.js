import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { generatePatientReply, generateReport, generateTrainingHint } from './deepseek.js'

const SessionState = Annotation.Root({
  session: Annotation({ reducer: (_left, right) => right }),
  userText: Annotation({ reducer: (_left, right) => right, default: () => '' }),
  patientReply: Annotation({ reducer: (_left, right) => right, default: () => '' }),
  suggestions: Annotation({ reducer: (_left, right) => right, default: () => [] }),
  canFinish: Annotation({ reducer: (_left, right) => right, default: () => false }),
})

const ReportState = Annotation.Root({
  session: Annotation({ reducer: (_left, right) => right }),
  report: Annotation({ reducer: (_left, right) => right }),
})

export const sessionGraph = new StateGraph(SessionState)
  .addNode('guardrail', async (state) => state)
  .addNode('patientReply', async (state) => ({
    patientReply: await generatePatientReply(state),
  }))
  .addNode('trainingHint', async (state) => ({
    suggestions: await generateTrainingHint(state),
  }))
  .addNode('completionCheck', async (state) => ({
    canFinish: state.session.messages.length >= 4,
  }))
  .addEdge(START, 'guardrail')
  .addEdge('guardrail', 'patientReply')
  .addConditionalEdges('patientReply', (state) => (state.session.mode === 'training' ? 'trainingHint' : 'completionCheck'))
  .addEdge('trainingHint', 'completionCheck')
  .addEdge('completionCheck', END)
  .compile()

export const reportGraph = new StateGraph(ReportState)
  .addNode('scoreReport', async (state) => ({
    report: await generateReport(state),
  }))
  .addEdge(START, 'scoreReport')
  .addEdge('scoreReport', END)
  .compile()
