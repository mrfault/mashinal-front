<template>
  <div class="mobile-menu d-lg-none">
    <div class="menu-header">
      <div class="container">
        <span class="cursor-pointer" @click="toggleSidebarMenu(true)">
          <icon name="burger" />
        </span>
        <nuxt-link class="logo" :to="$localePath('/')" @click.native="$nuxt.$emit('logo-click')">
          <img :src="`/img/${isDarkMode ? 'logo-dark-blue-white' : 'logo'}.svg`" alt="logo" v-if="!btlCookie" />
        </nuxt-link>
        <span class="cursor-pointer" @click="handleIconClick(false, 'search-icon-click')" v-if="hasSearchFilters">
          <icon name="search" />
        </span>
        <span class="cursor-pointer" @click="handleIconClick($localePath('/parts/shops'))" v-else-if="hasShops">
          <icon name="store" />
        </span>
        <span class="cursor-pointer" @click="handleIconClick($localePath('/cars/advanced-search'))" v-else-if="hasSearchNav || !loggedIn">
          <icon name="options" />
        </span>
        <span class="cursor-pointer" @click="logout" v-else>
          <icon name="logout" />
        </span>
      </div>
    </div>
    <div class="menu-backdrop" v-if="showSidebar" @click="toggleSidebarMenu(false)"></div>
    <div :class="['menu-sidebar', {'show': showSidebar}]">
      <div class="menu-sidebar_content">
        <div class="d-flex align-items-center justify-content-between">
          <div class="langs-menu">
            <button
               :class="['btn','btn--pale-red-outline']"
               @click="changeLoc"
            >{{ locale === 'ru' ? 'AZ' : 'RU' }}</button>
          </div>
          <theme-switch v-if="isMobileBreakpoint" />
          <span class="cursor-pointer close d-inline-flex align-top" @click="toggleSidebarMenu(false)">
            <icon name="cross" />
            <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
          </span>
        </div>
        <div class="user-menu" v-if="loggedIn">
          <nuxt-link :to="getUserSettingsLink" @click.native="toggleSidebarMenu(false)" class="d-inline-flex align-items-center align-top">
            <img :src="getUserAvatar" :alt="user.full_name" />
            <span class="text-truncate">{{ user.full_name }}</span>
          </nuxt-link>
          <hr/>
        </div>
        <ul>
          <li class="login" key="login" v-if="!loggedIn">
            <nuxt-link :to="$localePath('/login')" @click.native="toggleSidebarMenu(false)">
              <icon name="user" />
              <span>{{ $t('login_or_register') }}</span>
            </nuxt-link>
            <hr/>
          </li>
          <template v-for="menu in sidebarMenus">
            <li :key="menu.title[locale] || menu.title" v-if="(menu.auth && loggedIn) || !menu.auth">
              <nuxt-link
                 style="position:relative"
                 :to="$localePath(menu.route)"
                 @click.native="toggleSidebarMenu(false)"
              >
                <inline-svg
                   v-if="menu.title === 'registration_marks'"
                   src="/icons/registration_marks-white.svg"
                   style="width: 20px;
                   margin-right: 10px;"
                />
                <icon
                  v-else-if="!['favorites','comparisons'].includes(menu.title)"
                  :name="menu.icon"
                />
                <inline-svg  v-else :src="`/icons/${menu.icon}`"/>

                <span>{{ menu.title[locale] || $t(menu.title) }}</span>
                <span>{{ (menu.title === 'comparisons') && comparisonCount ? '&nbsp;('+comparisonCount+')' : '' }}</span>
                <span v-if="isMobileBreakpoint" style="position: absolute; top: -13px; right: -23px; display: flex;">
                          <inline-svg style="width: 31px;" v-if="menu.title === 'registration_marks'" src="/img/new_badge_white.svg" />
                        </span>
              </nuxt-link>
            </li>
          </template>
          <li class="logout" key="logout" v-if="loggedIn">
            <a href="javascript:void(0);" @click="logout(), toggleSidebarMenu(false)">
              <icon name="logout" />
              <span>{{ $t('logout') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
  data() {
    return {
      showSidebar: false
    }
  },
  methods: {
    ...mapActions(['changeLocale']),
     changeLoc() {
        if (this.locale === 'ru') {
           this.changeLocale('az')
        } else {
           this.changeLocale('ru')
        }
     },
    toggleSidebarMenu(show) {
      this.showSidebar = show;
      this.setBodyOverflow(show ? 'hidden' : 'scroll');
    },
    handleIconClick(path, event) {
      if (path) {
        if (['moto', 'moto-moto', 'commercial', 'commercial-commercial'].includes(this.routeName))
          this.$nuxt.$emit('extend-options');
        else if (['cars', 'index', 'cars-assistant', 'cars-advanced-search'].includes(this.routeName))
          this.$nuxt.$emit('extend-options', path);
        else this.$router.push(path);
      } else if (event) {
        this.$nuxt.$emit(event);
      }
    }
  },
  computed: {
    ...mapGetters({
      comparisonCount: 'comparison/count'
    })
  },
  watch: {
    breakpoint(breakpoint) {
      if (breakpoint === 'lg') {
        this.showSidebar = false;
        this.setBodyOverflow('scroll');
      }
    }
  }
}
</script>
