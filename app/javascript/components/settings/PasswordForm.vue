<template>
  <v-form ref="form" @submit.prevent="save" class="pa-3">
    <h2 class="subtitle-1 my-3">{{ $t('components.settings.passwordForm.subtitle') }}</h2>

    <v-layout wrap row>
      <v-flex xs12 md6>
        <v-text-field
          v-model="new_password"
          :rules="[vRequired, vMin6]"
          prepend-icon="mdi-lock-outline"
          :label="$t('components.settings.passwordForm.newPassword')"
          type="password"
        />
      </v-flex>

      <v-flex xs12 md6>
        <v-text-field
          v-model="password_confirmation"
          :rules="[vConfirmed, vMin6]"
          :label="$t('components.settings.passwordForm.passwordConfirmation')"
          type="password"
        />
      </v-flex>

      <v-flex xs12>
        <v-text-field
          v-model="password"
          :rules="[vRequired, vMin6]"
          prepend-icon="mdi-lock-outline"
          :label="$t('components.settings.passwordForm.password')"
          type="password"
        />
      </v-flex>
    </v-layout>

    <div class="settings__actions text-right">
      <v-btn @click="$refs.form.reset()" text>
        {{ $t('shared.buttons.reset') }}
      </v-btn>

      <v-btn type="submit" color="primary" text>
        {{ $t('shared.buttons.changePassword') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  name: 'PasswordForm',
  data() {
    return {
      new_password: '',
      password_confirmation: '',
      password: ''
    }
  },
  methods: {
    save() {
      this.$store.dispatch('AuthenticationModule/updatePassword', this.$data)
        .then(() => this.$router.push({ name: 'login_path' }))
    },
    vConfirmed(val) {
      return val === this.new_password || this.$t('shared.validations.confirmed')
    }
  }
}
</script>
