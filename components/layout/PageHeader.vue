<template>
  <div class="page-header">
    <div v-if="!isMobileBreakpoint && !close && !$cookies.get('smartbanner_exited')">
      <div class="top-promotion-row">
        <div class="container ">
          <div class="top-promotion">
            <div class="top-promotion-row-item">
              <img src="/img/logo-red.svg">
              <p>
                Mashin.al-dan çoxfunksiyalı yeni əlavə
              </p>
            </div>
            <div class="top-promotion-row-item">
              <img src="/img/app-stor
              e.svg" class="app-store-img">
              <img src="/img/google-play.svg" class="google-play-img">
            </div>
            <div class="top-promotion-row-item">
              <img src="/img/mobile-app.png" class="mobile-app" @click="">
              <a style="margin-left: 10px;cursor:pointer" @click.prevent="closePromotion"><icon style="" name="cross"/></a>
            </div>

          </div>
        </div>
      </div>
    </div>
    <header class="header-menu container d-none d-lg-block" :class="{ 'no-border-radius':hoverMenu}" >

      <div class="topbar">
        <nuxt-link class="logo" :to="$localePath('/')" @click.native="$nuxt.$emit('logo-click')">
          <img :src="`/img/${isDarkMode ? 'logo-white' : 'logo'}.svg`" alt="logo"
               v-if="!btlCookie && !$env.NEW_YEAR_SOON"/>
          <img :src="`/img/${isDarkMode ? 'logo-dark-mode' : 'logo-dark-blue-white'}.svg`" alt="logo"
               v-if="!btlCookie && $env.NEW_YEAR_SOON"/>
        </nuxt-link>
        <div class="call-center">
          <img src="/icons/subtract.svg">
          <span>*8787</span>
        </div>
        <nav class="topbar-nav">
          <ul class="menu">
            <li v-for="menu in topbarMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)">
                <icon :name="menu.icon"/>

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
              <icon name="user"/>
              <div class="user-menu_list" v-if="loggedIn" @click.stop>
                <div class="user-menu_list-inner">
                  <nuxt-link :to="getUserSettingsLink" class="d-inline-flex align-items-center align-top">
                    <img :src="getUserAvatar" :alt="user.full_name"/>
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
            <icon name="chevron-down"/>
            <div class="langs-menu_list">
              <div class="langs-menu_list-inner">
                <span class="cursor-pointer" v-for="code in locales" :key="code" @click="changeLocale(code)">{{
                    code
                  }}</span>
              </div>
            </div>
          </div>
          <theme-switch/>
        </nav>

      </div>
      <div class="navbar" :class="{ 'no-border-radius': hoverMenu }">
        <div class="container">
          <nav class="full-width">
            <div class="row align-items-center">
              <div class="col-lg-8 position-static">
                <ul class="menu">
                  <li @mouseover="menu.children ? hoverMenu = true : ''"
                      @mouseleave="hoverMenu = false;activeCategory = 0" v-for="menu in navbarMenus" :key="menu.title"
                      :class="{'dropdown': menu.children}">
                    <nuxt-link :to="$localePath(menu.route)">
                      {{ $t(menu.title) }}
                      <icon name="chevron-down" v-if="menu.children"/>
                    </nuxt-link>
                    <div class="dropdown-content" v-if="menu.children">
                      <div class="container">
                        <div class="row">
                          <div class="col-3" v-if="menu.categories">
                            <ul class="dropdown-menu_categories">
                              <li @mouseover="activeCategory = index" v-for="(category, index) in menu.categories"
                                  :key="category.title">
                                <nuxt-link :to="$localePath(category.route)" active-class="link-active"
                                           :class="{'active': index === activeCategory}">
                                  {{ $t(category.title) }}
                                  <icon name="chevron-right"/>
                                </nuxt-link>
                              </li>
                            </ul>
                          </div>
                          <div :class="`col-${menu.categories ? 9 : 12}`">
                            <ul class="dropdown-menu row">
                              <li :class="`col-${menu.categories ? 4 : 3}`"
                                  v-for="submenu in (menu.categories ? menu.categories[activeCategory].children : menu.children)"
                                  :key="submenu.title">
                                <nuxt-link :to="$localePath(submenu.route)" exact>
                                  <icon :name="submenu.icon"/>
                                  {{ $t(submenu.title) }}
                                </nuxt-link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="col-lg-4">
                <div class="row justify-content-end top-header-right">
                  <div class="col-2 text-right">
                    <div class="support-hotline">
                      <icon name="support"/>
                      <span>*8787</span>
                    </div>
                  </div>
                  <div class="col-5">
                    <nuxt-link class="btn full-width btn--red-outline" :to="$localePath('/garage')"
                               @click.native="handleBtnClick('garage')">
                      <icon name="garage"/>
                      {{ $t('garage') }}
                    </nuxt-link>
                  </div>
                  <div class="col-5">
                    <nuxt-link class="btn full-width btn--pale-green-outline" :to="$localePath('/sell')"
                               @click.native="handleBtnClick('sell')">
                      <icon name="plus-circle"/>
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

  </div>


</template>
<style lang="scss">
.topbar-nav {
   .menu > li i {
     color: #fff;
   }
}
.header-menu {
  background-color: #fff;
  transition: box-shadow .1s ease-out;
  border-radius: 0 0 20px 20px;
}
</style>
<script>
import {mapGetters, mapActions} from 'vuex';

import {MenusDataMixin} from '~/mixins/menus-data';
import {UserDataMixin} from '~/mixins/user-data';

import ThemeSwitch from '~/components/elements/ThemeSwitch';

export default {
  mixins: [MenusDataMixin, UserDataMixin],
  components: {
    ThemeSwitch
  },
  data() {
    return {
      close: false,
      hoverMenu: false,
      activeCategory: 0,
      topAdsVisible:true,

    }
  },
  methods: {
    ...mapActions(['changeLocale']),
    closePromotion() {
      this.$cookies.set('smartbanner_exited',1)
      this.close = true;
    },
    handleBtnClick(name) {
      if (this.routeName === name) {
        this.scrollTo(9, 9);
      }
    }
  },
  computed: {
    ...mapGetters(['notViewedFavorites', 'notViewedSavedSearch','homePageSliders'])
  }
}
</script>
