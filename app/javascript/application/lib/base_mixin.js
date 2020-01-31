export default {
  methods: {
    flash (message) {
      this.$store.commit('FlashStore/push', message)
    },

    fullname(employee) {
      return [employee.first_name, employee.last_name].join(' ').trim()
    },

    renderError(errorResponse) {
      if (typeof errorResponse.data === 'object') {
        let details = errorResponse.data.details.join(', ')
        return details !== "" ? details : errorResponse.data.message
      } else {
        return errorResponse.statusText
      }
    },

    updateLocale(locale) {
      this.$i18n.locale = locale
      this.$vuetify.lang.current = locale
      this.$moment.locale(locale)
    },

    vIsString(val) {
      return this.$_.isString(val) || this.$t('shared.validations.isString')
    },

    vMin6(val) {
      return !!val && val.length >= 6 || this.$t('shared.validations.min6')
    },

    vRequired(val) {
      return !!val || this.$t('shared.validations.required')
    }
  },
  computed: {

    isLoading() {
			return this.status === 'loading'
    }
  }
}
