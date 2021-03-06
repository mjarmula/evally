import http from '@utils/http'
import { fetchError } from '@utils/helpers'

import i18n from '@locales/i18n'

import { User, UsersList } from '@models/user'

const initialState = () => ({
  users: new UsersList(),
  user: new User(),
  loading: true
})

const UsersModule = {
  namespaced: true,

  state: initialState(),

  getters: {
    users: state => state.users,
    user: state => state.user,
    loading: state => state.loading
  },

  mutations: {
    addToList(state, data) {
      state.users.add(data)
      return state
    },
    refreshListItem(state, data) {
      state.users.refresh(data)
      return state
    },
    setItem(state, user) {
      state.user = new User(user)
      return state
    },
    setList(state, users) {
      state.users = new UsersList(users)
      state.loading = false
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
    index({ commit }) {
      commit('setLoading', true)

      http.get(User.routes.usersPath)
        .then(response => {
          commit('setList', response.data)
        })
        .catch(error => {
          commit(
            'NotificationsModule/push',
            { error: i18n.t('messages.users.index.error', { msg: fetchError(error) }) },
            { root: true }
          )
        })
        .finally(() => commit('setLoading', false))
    },
    create({ commit }, user) {
      const params = {
        invitation: user.attributes
      }

      return new Promise(resolve => {
        http.post(User.routes.invitationsPath, params)
          .then(response => {
            const { data } = response

            commit('addToList', data)
            commit(
              'NotificationsModule/push',
              { success: i18n.t('messages.users.create.ok') },
              { root: true }
            )

            resolve(data)
          })
          .catch(error => {
            commit(
              'NotificationsModule/push',
              { error: i18n.t('messages.users.create.error', { msg: fetchError(error) }) },
              { root: true }
            )
          })
      })
    },
    update({ commit }, user) {
      const params = {
        user: user.attributes
      }

      return new Promise(resolve => {
        http.put(User.routes.userPath(user.id), params)
          .then(response => {
            const { data } = response

            commit('refreshListItem', data)
            commit(
              'NotificationsModule/push',
              { success: i18n.t('messages.users.update.ok') },
              { root: true }
            )

            resolve(data)
          })
          .catch(error => {
            commit(
              'NotificationsModule/push',
              { error: i18n.t('messages.users.update.error', { msg: fetchError(error) }) },
              { root: true }
            )
          })
      })
    }
  }
}

export default UsersModule
