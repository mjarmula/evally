<template>
  <section class="app">
    <v-app-bar
      class="elevation-1 toolbar"
      color="white"
      fixed
      scroll-off-screen
    >
      <v-toolbar-title>
        <router-link class="logo" :to="{ name: 'dashboard_path' }">
          <img src="@assets/images/logo_black.png" class="logo__img" alt="Logo Evally">
        </router-link>
      </v-toolbar-title>

      <v-spacer />

      <v-menu transition="slide-y-transition" offset-y>
        <template #activator="{ on }">
          <span class="profile" v-on="on" v-ripple>
            <v-avatar class="profile__avatar" color="primary" size="32">
              <span class="white--text body-2" data-cy="profile-initials">{{ user.initials }}</span>
            </v-avatar>

            <span class="profile__fullname" data-cy="profile-fullname">{{ user.fullname }}</span>

            <span class="profile__arrow">
              <v-icon size="24">mdi-chevron-down</v-icon>
            </span>
          </span>
        </template>

        <v-list>
          <template v-if="$vuetify.breakpoint.mdAndDown">
            <v-list-item v-for="tab in tabs" :key="`tab-${tab.id}`" :to="{ name: tab.path }">
              <v-list-item-action>
                <v-icon>{{ tab.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{ $t(`shared.navbar.${tab.name}`) }}</v-list-item-title>
            </v-list-item>

            <v-divider class="my-2" />
          </template>

          <v-list-item v-for="item in items" :key="`item_${item.id}`"  :data-cy="`li-${item.name}`" :to="{ name: item.path }">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ $t(`shared.navbar.${item.name}`) }}</v-list-item-title>
          </v-list-item>

          <!-- Log out list item -->
          <v-list-item @click="logout" data-cy="li-logout">
            <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ $t('shared.navbar.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template #extension v-if="$vuetify.breakpoint.lgAndUp">
        <v-tabs
          :hide-slider="canHideSlider"
          slider-color="primary"
          grow
        >
          <v-tab
            v-for="tab in tabs"
            :key="`tab_${tab.id}`"
            :to="{ name: tab.path }"
          >
            <v-icon>{{ tab.icon }}</v-icon>

            <span class="separator" />

            {{ $t(`shared.navbar.${tab.name}`) }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <router-view />

    <forms-dialog />
    <confirm-dialog />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import FormsDialog from '@components/shared/FormsDialog'
import ConfirmDialog from '@components/shared/ConfirmDialog'

export default {
  name: 'Base',
  components: { ConfirmDialog, FormsDialog },
  data () {
    return {
      tabs: [
        { id: 0, name: 'dashboard', icon: 'mdi-view-dashboard', path: 'dashboard_path' },
        { id: 10, name: 'drafts', icon: 'mdi-file-edit-outline', path: 'drafts_path' },
        { id: 20, name: 'employees', icon: 'mdi-account-group', path: 'employees_path' },
        { id: 30, name: 'templates', icon: 'mdi-file-multiple-outline', path: 'templates_path' }
      ],
      items: [
        { id: 0, name: 'settings', icon: 'mdi-settings', path: 'general_settings_path' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'SessionModule/user',
      setting: 'SessionModule/setting',
    }),

    canHideSlider() {
      return this.$route.path.startsWith('/app/settings')
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('SessionModule/destroy')
        .then(() => this.$router.push({ name: 'login_path' }))
    }
  },
  created() {
    this.$store.dispatch('SessionModule/show')
      .then(data => this.updateLocale(data.setting.lang))
  }
}
</script>