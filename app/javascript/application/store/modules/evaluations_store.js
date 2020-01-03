import http from '@/lib/http_config'

import { Evaluation, EvaluationsList } from '@models/evaluation'
import { SectionsList } from '@models/section'

const initialState = () => ({
  evaluations: new EvaluationsList(),
  evaluation: new Evaluation(),
  sections: new SectionsList(),
  loading: true
})

const EvaluationsStore = {
  namespaced: true,

  state: initialState(),

  getters: {
    evaluations: state => state.evaluations,
    evaluation: state => state.evaluation,
    sections: state => state.sections,
    loading: state => state.loading
  },
  mutations: {
    list(state, data) {
      state.evaluations = new EvaluationsList(data)
      state.loading = false
      return state
    },
    item(state, { evaluation, sections }) {
      state.evaluation = new Evaluation(evaluation)
      state.sections = new SectionsList(sections)
      return state
    },
    inProgress(state, status) {
      state.loading = status
      return state
    },
    replace(state, section) {
      state.sections.replace(section)
      return state
    },
    resetState(state) {
      state = Object.assign(state, initialState())
      return state
    }
  },
  actions: {
    drafts(context) {
      context.commit('inProgress', true)

      http.get(Evaluation.routes.draftsEvaluations)
        .then(response => {
          context.commit('list', response.data)
        })
        .catch(() => {
          context.commit('FlashStore/push', { error: 'Error :('}, { root: true })
        })
    },
    show(context, id) {
      http.get(Evaluation.routes.evaluationPath(id))
        .then(response => {
          context.commit('item', response.data)
        })
        .catch(() => {
          context.commit('FlashStore/push', { error: 'Error :('}, { root: true })
        })
    },
    update(context) {
      const { evaluation, sections } = context.state;

      const params = {
        evaluation: {
          state: 'draft',
          sections: sections.models
        }
      }

      http.put(Evaluation.routes.evaluationPath(evaluation.id), params)
        .then(response => {
          context.commit('item', response.data)

          context.commit('FlashStore/push', { success: 'Updated :)' }, { root: true })
        })
        .catch(() => {
          context.commit('FlashStore/push', { error: 'Error :('}, { root: true })
        })
    }
  }
}

export default EvaluationsStore
