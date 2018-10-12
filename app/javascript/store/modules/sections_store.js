import axios from 'axios'

import { Utils } from '../../lib/utils'
import { Section, SectionsList } from '../../models/section'

const SectionsStore = {
  namespaced: true,
  state: {
    sections: new SectionsList()
  },
  getters: {
    sections: state => state.sections
  },
  mutations: {
    clear(state) {
      state.sections = new SectionsList()
      return state
    },
    many(state, data) {
      state.sections.replace(data)
      return state
    },
    push(state, data) {
      state.sections.add(data)
      return state
    },
    markAsRemoved(state, id) {
      if (isNaN(id)) {
        state.sections.remove({ tempId: id })
      } else {
        state.sections.map(section => {
          if (section.id === id) section._destroy = 1
          return section
        })
      }
      return state
    }
  },
  actions: {

  }
}

export default SectionsStore
