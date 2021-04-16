<template>
  <header class="page-header">
    <div class="topbar">
      <div class="container">
        <nuxt-link class="logo" :to="$localePath('/')">
          <img src="/img/logo.svg" alt="logo" />
        </nuxt-link>
        <nav>
          <ul class="menu">
            <li v-for="item in topbarMenus" :key="item.title">
              <nuxt-link event="" :to="$localePath(item.route)" @click.native.prevent="handleMenuItem(item)">
                <i :class="item.icon"></i>
                {{ $t(item.title) }}
              </nuxt-link>
            </li>
          </ul>
          <div class="user-menu btn btn--dark-blue-outline" @click="handleUserMenuClick">
            <icon name="user" />
            <div class="user-menu_list" v-if="loggedIn">
              <div class="user-menu_list-inner">
              </div>
            </div>
          </div>
          <div class="langs-menu btn btn--dark-blue-outline">
            <span>{{ locale }}</span>
            <icon name="chevron-down" />
            <div class="langs-menu_list">
              <div class="langs-menu_list-inner">
                <span v-for="code in locales" :key="code" @click="changeLocale(code)">{{ code }}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="navbar">
      <div class="container">
        <nav>
          <ul class="menu">
            <li v-for="menu in navbarMenus" :key="menu.id" :class="{'dropdown': hasDropdown(menu)}">
              <nuxt-link event="" :to="$localePath(menu.url)" @click.native.prevent="handleMenuItem(menu)">
                {{ menu.name[locale] }}
                <icon name="chevron-down" v-if="hasDropdown(menu)" />
              </nuxt-link>
              <div class="dropdown-content" v-if="hasDropdown(menu)">
                <div class="container">
                  <ul class="dropdown-menu row">
                    <li class="col-3" v-for="submenu in menu.children" :key="submenu.id">
                      <nuxt-link event="" :to="$localePath(submenu.url)" @click.native.prevent="handleMenuItem(submenu)">
                        <icon :name="getIconBase(menu)+submenu.order" />
                        {{ submenu.name[locale] }}
                      </nuxt-link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <nuxt-link class="btn btn--pale-green" :to="$localePath('/sell')" v-html="$t('place_an_ad')" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
      topbarMenus: [
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'favorites', route: '/profile/favorites', icon: 'star' },
        { title: 'templates', route: '/profile/templates', icon: 'template' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' }
      ]
    }
  },
  computed: {
    ...mapGetters(['navbarMenus'])
  },
  methods: {
    ...mapActions(['changeLocale']),

    handleUserMenuClick() {
      let path = this.loggedIn 
        ? (this.user.autosalon ? '/profile/dashboard' : '/profile') 
        : '/login';
      this.$router.push(this.$localePath(path));
    },
    handleMenuItem(item) {
      if(item.route === '#0') return;
      this.$router.push(this.$localePath(item.route))
    },
    hasDropdown(menu) {
      return [5,7].includes(menu.id) && menu.children.length;
    },
    getIconBase(menu) {
      if (menu.id === 5) return 'moto-';
      else if (menu.id === 7) return 'commercial-';
    }
  }
}
</script>