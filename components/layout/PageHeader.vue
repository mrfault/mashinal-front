<template>
  <header class="page-header d-none d-lg-block">
    <div class="topbar">
      <div class="container">
        <nuxt-link class="logo" :to="$localePath('/')" @click.native="$nuxt.$emit('logo-click')">
          <img :src="`/img/${isDarkMode ? 'logo-white' : 'logo'}.svg`" alt="logo" v-if="!btlCookie" />
        </nuxt-link>
        <nav>
          <ul class="menu">
            <li v-for="menu in topbarMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)">
                <icon :name="menu.icon" />
                {{ $t(menu.title) }}
                <template v-if="menu.title === 'messages' && countNewMessages > 0">
                  <span class="badge-counter">{{ countNewMessages }}</span>
                </template>
                <template v-else-if="menu.title === 'favorites' && notViewedFavorites > 0">
                  <span class="badge-counter">{{ notViewedFavorites }}</span>
                </template>
                <template v-else-if="menu.title === 'templates' && notViewedSavedSearch > 0">
                  <span class="badge-counter">{{ notViewedSavedSearch }}</span>
                </template>
              </nuxt-link>
            </li>
          </ul>
          <nuxt-link custom :to="getUserSettingsLink" v-slot="{ navigate }">
            <div class="user-menu btn btn--dark-blue-outline" @click="navigate">
              <icon name="user" />
              <div class="user-menu_list" v-if="loggedIn" @click.stop>
                <div class="user-menu_list-inner">
                  <nuxt-link :to="getUserSettingsLink" class="d-inline-flex align-items-center align-top">
                    <img :src="getUserAvatar" :alt="user.full_name" />
                    <span class="text-truncate">{{ user.full_name }}</span>
                  </nuxt-link>
                  <hr/>
                  <ul>
                    <li v-for="menu in userMenus" :key="menu.title">
                      <nuxt-link :to="$localePath(menu.route)">{{ $t(menu.title) }}</nuxt-link>
                    </li>
                    <li key="logout">
                      <a href="javascript:void(0);" @click="logout">{{ $t('logout') }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nuxt-link>
          <div class="langs-menu btn btn--dark-blue-outline">
            <span>{{ locale }}</span>
            <icon name="chevron-down" />
            <div class="langs-menu_list">
              <div class="langs-menu_list-inner">
                <span class="cursor-pointer" v-for="code in locales" :key="code" @click="changeLocale(code)">{{ code }}</span>
              </div>
            </div>
          </div>
          <theme-switch />
        </nav>
      </div>
    </div>
    <div class="navbar">
      <div class="container">
        <nav class="full-width">
          <div class="row align-items-center">
            <div class="col-lg-9 position-static">
              <ul class="menu">
                <li v-for="menu in navbarMenus" :key="menu.title" :class="{'dropdown': menu.children}">
                  <nuxt-link :to="$localePath(menu.route)">
                    {{ $t(menu.title) }}
                    <icon name="chevron-down" v-if="menu.children" />
                  </nuxt-link>
                  <div class="dropdown-content" v-if="menu.children">
                    <div class="container">
                      <ul class="dropdown-menu row">
                        <li class="col-3" v-for="submenu in menu.children" :key="submenu.title">
                          <nuxt-link :to="$localePath(submenu.route)" exact>
                            <icon :name="submenu.icon" />
                            {{ $t(submenu.title) }}
                          </nuxt-link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-lg-3">
              <div class="row">
                <div class="col-6">
                  <nuxt-link class="btn full-width btn--pale-red-outline" :to="$localePath('/garage')" :active-class="''">
                    <icon name="garage" />
                    {{ $t('garage') }}
                  </nuxt-link>
                </div>
                <div class="col-6">
                  <nuxt-link class="btn full-width btn--pale-green-outline" :to="$localePath('/sell')">
                    <icon name="plus-circle" />
                    {{ $t('to_sell') }}
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { MenusDataMixin } from '~/mixins/menus-data';
import { UserDataMixin } from '~/mixins/user-data';

import ThemeSwitch from '~/components/elements/ThemeSwitch';

export default {
  mixins: [MenusDataMixin, UserDataMixin],
  components: {
    ThemeSwitch
  },
  methods: {
    ...mapActions(['changeLocale'])
  },
  computed: {
    ...mapGetters(['notViewedFavorites','notViewedSavedSearch'])
  }
}
</script>