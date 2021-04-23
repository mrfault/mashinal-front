<template>
  <header class="page-header d-none d-lg-block">
    <div class="topbar">
      <div class="container">
        <nuxt-link class="logo" :to="$localePath('/')">
          <img :src="`/img/${colorMode === 'dark' ? 'logo-white' : 'logo'}.svg`" alt="logo" />
        </nuxt-link>
        <nav>
          <ul class="menu">
            <li v-for="menu in topbarMenus" :key="menu.title">
              <a :href="$localePath(menu.route)" @click.prevent="handleMenuItem(menu)">
                <i :class="menu.icon"></i>
                {{ $t(menu.title) }}
              </a>
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
                      <a :href="$localePath(menu.route)" @click.prevent="handleMenuItem(menu)">
                        {{ $t(menu.title) }}
                      </a>
                    </li>
                    <li key="logout">
                      <a href="javascript:void(0);" @click="logout">{{ $t('output') }}</a>
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
        </nav>
      </div>
    </div>
    <div class="navbar">
      <div class="container">
        <nav>
          <ul class="menu">
            <li v-for="menu in navbarMenus" :key="menu.id" :class="{'dropdown': hasDropdown(menu)}">
              <a :href="$localePath(menu.url)" @click.prevent="handleMenuItem(menu)">
                {{ menu.name[locale] }}
                <icon name="chevron-down" v-if="hasDropdown(menu)" />
              </a>
              <div class="dropdown-content" v-if="hasDropdown(menu)">
                <div class="container">
                  <ul class="dropdown-menu row">
                    <li class="col-3" v-for="submenu in menu.children" :key="submenu.id">
                      <a :href="$localePath(submenu.url)" @click.prevent="handleMenuItem(submenu)">
                        <icon :name="getIconBase(menu)+submenu.order" />
                        {{ submenu.name[locale] }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <nuxt-link class="btn btn--pale-green" :to="$localePath('/sell')" v-html="$t('to_sell')" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';

import { MenusDataMixin } from '~/mixins/menus-data';
import { UserDataMixin } from '~/mixins/user-data';

export default {
  mixins: [MenusDataMixin, UserDataMixin],
  methods: {
    ...mapActions(['changeLocale']),

    handleMenuItem(item) {
      if(item.route === 'javascript:void(0);') return;
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