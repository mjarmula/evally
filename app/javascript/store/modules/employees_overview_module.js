import http from '@utils/http'

import { Employee } from '@models/employee'
import { EmployeesAnalytics } from '@models/employees_analytics'

const initialState = () => ({
  groups: [],
  positionsChartData: [],
  analytics: new EmployeesAnalytics(),
  loading: false
})

const EmployeesOverviewModule = {
  namespaced: true,

  state: initialState(),

  getters: {
    groups: state => state.groups,
    positionsChartData: state => state.positionsChartData,
    analytics: state => state.analytics,
    loading: state => state.loading
  },

  mutations: {
    setData(state, { groups, positions_chart_data, analytics }) {
      state.groups = groups
      state.positionsChartData = positions_chart_data
      state.analytics = new EmployeesAnalytics(analytics)
      return state
    },
    setLoading(state, status) {
      state.loading = status
      return state
    },
    resetState(state) {
      state = Object.assign(state, initialState())
      return state
    }
  },

  actions: {
    overview({ commit }) {
      commit('setLoading', true)

      http.get(Employee.routes.employeesOverviewPath)
        .then(response => {
          commit('setData', response.data)
        })
        .catch(() => {
          commit(
            'NotificationsModule/push',
            { error: 'Error :(' },
            { root: true }
          )
        })
        .finally(() => commit('setLoading', false))
    }
  }
}

export default EmployeesOverviewModule