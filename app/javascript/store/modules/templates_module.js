import http from '@/lib/http_config'

import { Template, TemplatesList } from '@models/template'
import { SectionsList } from '@models/section'

const initialState = () => ({
  templates: new TemplatesList(),
  template: new Template(),
  sections: new SectionsList(),
  loading: true
})

const TemplatesModule = {
  namespaced: true,

  state: initialState(),

  getters: {
    templates: state => state.templates,
    template: state => state.template,
    sections: state => state.sections,
    loading: state => state.loading
  },

  mutations: {
    addToList(state, data) {
      state.templates.add(data)
      return state
    },
    setEditable(state, value = true) {
      state.template.set('editable', value)
      return state
    },
    setItem(state, { template, sections }) {
      state.template = new Template(template)
      state.sections = new SectionsList(sections)
      return state
    },
    setList(state, templates) {
      state.templates = new TemplatesList(templates)
      state.loading = false
      return state
    },
    setLoading(state, status) {
      state.loading = status
      return state
    },
    setSections(state, sectionsList) {
      state.sections = sectionsList
      return state
    },
    removeFromList(state, id) {
      state.template = new Template()
      state.sections = new SectionsList()
      state.templates.remove(id)
      return state
    },
    resetItem(state) {
      state.template = new Template()
      state.sections = new SectionsList()
      return state
    },
    resetState(state) {
      state = Object.assign(state, initialState())
      return state
    }
  },

  actions: {
    index({ commit }) {
      commit('setLoading', true)

      http.get(Template.routes.templatesPath)
        .then(response => {
          commit('setList', response.data)
        })
        .catch(() => {
          commit('FlashStore/push', { error: 'Error :(' }, { root: true })
        })
        .finally(() => commit('setLoading', false))
    },
    show({ commit }, id) {
      if (id === 'new') {
        commit('setItem', { template: { editable: true }, sections: [] })
      } else {
        http.get(Template.routes.templatePath(id))
          .then(response => {
            commit('setItem', response.data)
          })
          .catch(() => {
            commit('FlashStore/push', { error: 'Error :(' }, { root: true })
          })
      }
    },
    create({ state, commit }) {
      const { template, sections } = state;

      const params = {
        template: {
          ...template.attributes,
          sections: sections.models
        }
      }

      return new Promise(resolve => {
        http.post(Template.routes.templatesPath, params)
          .then(response => {
            const { data } = response

            commit('addToList', data.template)
            commit('FlashStore/push', { success: 'Created :)' }, { root: true })

            resolve(data)
          })
          .catch(() => {
            commit('FlashStore/push', { error: 'Error :(' }, { root: true })
          })
      })
    },
    update({ state, commit }) {
      const { template, sections } = state

      const params = {
        template: {
          ...template.attributes,
          sections: sections.models
        }
      }

      return new Promise(resolve => {
        http.put(Template.routes.templatePath(template.id), params)
          .then(response => {
            const { data } = response

            commit('setItem', data)
            commit('FlashStore/push', { success: 'Updated :)' }, { root: true })

            resolve(data)
          })
          .catch(() => {
            commit('FlashStore/push', { error: 'Error :(' }, { root: true })
          })
      })
    },
    destroy({ state, commit }) {
      const { template } = state

      return new Promise(resolve => {
        http.delete(Template.routes.templatePath(template.id))
          .then(() => {
            commit('removeFromList', template.id)
            commit('FlashStore/push', { success: 'Destroyed :)' }, { root: true })

            resolve()
          })
          .catch(() => {
            commit('FlashStore/push', { error: 'Error :(' }, { root: true })
          })
      })
    }
  }
}

export default TemplatesModule
