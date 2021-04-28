<template>
  <div class="mobile-menu d-lg-none">
    <div class="menu-header">
      <div class="container">
        <span class="cursor-pointer" @click="toggleSidebarMenu(true)">
          <icon name="burger" />
        </span>
        <nuxt-link class="logo" :to="$localePath('/')" @click.native="$nuxt.$emit('logo-click')">
          <img :src="`/img/${isDarkMode ? 'logo-white' : 'logo'}.svg`" alt="logo" />
        </nuxt-link>
        <span class="cursor-pointer" @click.stop>
          <icon name="options" />
        </span>
      </div>
    </div>
    <div class="menu-backdrop" v-if="showSidebar" @click="toggleSidebarMenu(false)"></div>
    <div :class="['menu-sidebar', {'show': showSidebar}]">
      <div class="menu-sidebar_content">
        <div class="d-flex align-items-center justify-content-between">
          <div class="langs-menu">
            <button :class="['btn','btn--pale-red-outline',{'active': code === locale}]" v-for="code in locales" :key="code" 
              @click="changeLocale(code)">{{ code }}</button>
          </div>
          <span class="cursor-pointer close d-inline-flex align-top" @click="toggleSidebarMenu(false)">
            <icon name="cross" />
          </span>
        </div>
        <div class="user-menu" v-if="loggedIn">
          <nuxt-link :to="getUserSettingsLink" @click.native="handleLink" class="d-inline-flex align-items-center align-top">
            <img :src="getUserAvatar" :alt="user.full_name" />
            <span class="text-truncate">{{ user.full_name }}</span>
          </nuxt-link>
          <hr/>
        </div>
        <ul>
          <li class="login" key="login" v-if="!loggedIn">
            <nuxt-link :to="$localePath('/login')" @click.native="handleLink">
              <icon name="user" />
              <span>{{ $t('login_or_register') }}</span>
            </nuxt-link>
            <hr/>
          </li>
          <li v-for="menu in sidebarMenus" :key="menu.id || menu.title">
            <nuxt-link :to="$localePath(menu.route || menu.url)" @click.native="handleLink(menu)">
              <span>{{ menu.name ? menu.name[locale] : $t(menu.title) }}</span>
            </nuxt-link>
          </li>
          <li>
            <slot />
          </li>
          <li class="logout" key="logout" v-if="loggedIn">
            <a href="javascript:void(0);" @click="logout(), handleLink()">
              <icon name="logout" />
              <span>{{ $t('output') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { MenusDataMixin } from '~/mixins/menus-data';
import { UserDataMixin } from '~/mixins/user-data';

export default {
  mixins: [MenusDataMixin, UserDataMixin],
  data() {
    return {
      showSidebar: false
    }
  },
  methods: {
    ...mapActions(['changeLocale']),

    toggleSidebarMenu(toggle) {
      this.showSidebar = toggle;
    },
    handleLink(menu = false) {
      this.toggleSidebarMenu(false);
      if(!menu) return;
    }
  },
  watch: {
    showSidebar(show) {
      document.querySelector('body').style.overflowY = show ? 'hidden' : 'scroll';
    },
    breakpoint(breakpoint) {
      if(breakpoint === 'lg') {
        this.showSidebar = false;
      }
    }
  }
}
</script>