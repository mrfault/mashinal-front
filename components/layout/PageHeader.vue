<template>
  <div class="page-header"
       :style="(!isMobileBreakpoint ? 'height: 90px;': ''),
        !isMobileBreakpoint ? ($cookies.get('smartbanner_exited')  ? 'margin-bottom: 70px;' :'margin-bottom:70px;') : '' ">

<!--    <div-->
<!--      v-if="-->
<!--        !isMobileBreakpoint && !close && !$cookies.get('smartbanner_exited')-->
<!--      "-->
<!--    >-->
<!--      <div class="top-promotion-row">-->
<!--        <div class="container">-->
<!--          <div class="top-promotion">-->
<!--            <div class="top-promotion-row-item">-->
<!--              <img src="/img/logo-red.svg" />-->
<!--              <p>-->
<!--                Mashin.al-dan çoxfunksiyalı yeni əlavə-->
<!--              </p>-->
<!--            </div>-->
<!--            <div class="top-promotion-row-item">-->
<!--              <a-->
<!--                target="_blank"-->
<!--                href="https://apps.apple.com/tn/app/mashin-al/id1588371190?l=az"-->
<!--              >-->
<!--                <img src="/img/app-store.svg" class="app-store-img" />-->
<!--              </a>-->
<!--              <a-->
<!--                target="_blank"-->
<!--                href="https://play.google.com/store/apps/details?id=ventures.al.mashinal&hl=az&gl=US"-->
<!--              >-->
<!--                <img src="/img/google-play.svg" class="google-play-img" />-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="top-promotion-row-item">-->
<!--              <img src="/img/mobile-app.png" class="mobile-app" />-->
<!--              <a-->
<!--                style="margin-left: 10px; cursor: pointer;"-->
<!--                @click.prevent="closePromotion"-->
<!--              >-->
<!--                <icon style="color: #081a3e;" name="cross" />-->
<!--                &lt;!&ndash; <inline-svg src="/icons/cross.svg" height="14" style="color: #081a3e;"/> &ndash;&gt;-->
<!--              </a>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <header
      class="header-menu container d-none d-lg-block"
      :class="{ 'no-border-radius': hoverMenu }"
    >
      <!-- topbar -->
      <div class="topbar">
        <nuxt-link
          class="logo"
          :to="$localePath('/')"
          @click.native="$nuxt.$emit('logo-click')"
        >
          <img
            :src="$env.NEW_YEAR_SOON ? '/img/logo-white-newyear.svg' : '/img/logo-dark-mode.svg'"
            alt="logo"
            :style="$env.NEW_YEAR_SOON ? 'height: unset;': ''"
            v-if="!btlCookie"
          />
        </nuxt-link>
        <div class="call-center">
          <img src="/icons/subtract.svg" />
          <span>*8787</span>
        </div>
        <nav class="topbar-nav">
          <ul class="topbar-nav__menu">
            <li v-for="menu in topbarMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)">
                <icon
                  v-if="!['favorites','templates'].includes(menu.title)"
                  :name="menu.icon"
                  v-b-tooltip="$t('tooltip_' + menu.title)"
                />
                <div  v-else v-b-tooltip="$t('tooltip_' + menu.title)">
                  <inline-svg
                    :src="`/icons/${menu.icon}`"
                  />
                </div>

                <template
                  v-if="menu.title === 'messages' && countNewMessages > 0"
                >
                  <span class="badge-counter">{{ countNewMessages }}</span>
                </template>
                <template
                  v-if="
                    menu.title === 'notifications' && countNewNotifications > 0
                  "
                >
                  <span class="badge-counter">{{ countNewNotifications }}</span>
                </template>
                <template
                  v-else-if="
                    menu.title === 'favorites' && notViewedFavorites > 0
                  "
                >
                  <span class="badge-counter" style="top: -3px;right:-12px;">{{ notViewedFavorites }}</span>
                </template>
                <template
                  v-else-if="
                    menu.title === 'templates' && notViewedSavedSearch > 0
                  "
                >
                  <span class="badge-counter" style="top: -3px;right:-12px;">{{ notViewedSavedSearch }}</span>
                </template>
              </nuxt-link>
            </li>
          </ul>
          <nuxt-link custom :to="getUserSettingsLink" v-slot="{ navigate }">
            <div class="user-menu btn rotatable_hover" @click="navigate">
              <icon name="garage-tab" v-if="loggedIn" />
              <p v-if="loggedIn" class="user-menu__title mb-0 pr-3">
                {{ $t('profile') }}
              </p>
              <p v-if="!loggedIn" class="m-auto">{{ $t('login') }}</p>
              <icon
                name="chevron-down rotatable"
                class="user-menu__toggler"
                v-if="loggedIn"
              />
              <div class="user-menu_list" v-if="loggedIn" @click.stop>
                <div class="user-menu_list-inner">
                  <nuxt-link
                    :to="getUserSettingsLink"
                    class="d-inline-flex align-items-center align-top"
                  >
                    <img :src="getUserAvatar" :alt="user.full_name" />
                    <span class="text-truncate">{{ user.full_name }}</span>
                  </nuxt-link>

                  <hr />

                  <ul>
                    <template
                       v-for="menu in userMenus"
                       v-if="menu.isAvailable && ((user.parent_id || (user.children && user.children.length)) ? menu.title !== 'garage':true )"
                    >
                      <li v-if="menu.title === 'my_account' ? !user.parent_id: true" :key="menu.title">
                        <nuxt-link :to="$localePath(menu.route)">
                          {{ $t(menu.title) }}
                        </nuxt-link>
                      </li>

                      <li v-else>
                        <a href="javascript:void(0);" @click="logoutToParent">
                          {{ $t('logout_to_parent') }}
                        </a>
                      </li>
                    </template>
                    <li v-if="user.children && user.children.length">
                      <nuxt-link to="/my-autosalons">{{ $t('logout_to_parent') }}</nuxt-link>
                    </li>
                    <li key="logout">
                      <a href="javascript:void(0);" @click="logout">
                        {{ $t('logout') }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nuxt-link>
          <div class="langs-menu btn" @click="changeLoc">
            <span>{{ locale === 'ru' ? 'AZ' : 'RU' }}</span>

<!--            <icon name="chevron-down" />-->

<!--             <div class="langs-menu_list">-->
<!--              <div class="langs-menu_list-inner">-->
<!--                <span-->
<!--                  class="cursor-pointer"-->
<!--                  v-for="code in locales"-->
<!--                  :key="code"-->
<!--                  @click="changeLocale(code)"-->
<!--                >{{ code }}</span>-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <theme-switch />
        </nav>
      </div>
      <!-- navbar white -->
        <div
          class="navbar navbar-white position-relative"
          :class="{ 'no-border-radius': hoverMenu }"
        >
          <div class="container">
            <nav class="full-width">
              <div class="row align-items-center">
                <div class="col-lg-9 position-static">
                  <ul class="menu position-relative">
                    <li
                      @mouseover="menu.children ? (hoverMenu = true) : ''"
                      @mouseleave="
                        hoverMenu = false
                        activeCategory = 0
                      "
                      v-for="menu in navbarMenus"
                      v-if="(user && user.children && user.children.length) || (user && user.parent_id) ? !['eservices','salons','shops'].includes(menu.title) :true"
                      :key="menu.title"
                      :class="{ dropdown: menu.children }"
                    >
                      <nuxt-link class="external_salon_hover" style="position: relative" :to="$localePath(menu.route)">
<!--                         <icon-->
<!--                          v-if="menu.icon && menu.icon !== 'external-tab'"-->
<!--                          style="font-size: 20px; margin-right: 10px;"-->
<!--                          class="no-transform "-->
<!--                          :name="menu.icon"-->
<!--                        />-->

<!--                        <inline-svg-->
<!--                           v-else-->
<!--                           class="no-transform"-->
<!--                           src="/icons/registration_marks.svg"-->
<!--                           style="margin-right: 10px;"-->
<!--                        />-->

                        {{ $t(menu.title) }}

                        <icon name="chevron-down" v-if="menu.children" />

                        <span class="navbar__icon">
                          <inline-svg
                             class="not-hover"
                             :width="'35px'"
                             :height="'25px'"
                             v-if="menu.title === 'registration_marks'"
                             src="/icons/new_badge.svg"
                          />
                        </span>
                      </nuxt-link>

                      <div
                        class="dropdown-content container"
                        style="padding-left:0;"
                        v-if="menu.children"
                        :class="{ 'dropdown-menu-click': closeDropdownMenu }"
                      >
                        <div class="container">
                          <div class="row">
                            <div class="col-3" v-if="menu.categories">
                              <ul class="dropdown-menu_categories">
                                <li
                                  @mouseover="activeCategory = index"
                                  v-for="(category, index) in menu.categories"
                                  :key="category.title"
                                >
                                  <nuxt-link
                                    :to="$localePath(category.route)"
                                    active-class="link-active"
                                    :class="{
                                      active: index === activeCategory,
                                    }"
                                  >
                                    {{ $t(category.title) }}
                                    <icon name="chevron-right" />
                                    <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
                                  </nuxt-link>
                                </li>
                              </ul>
                            </div>
                            <div :class="`col-${menu.categories ? 9 : 12}`">
                              <ul class="dropdown-menu row" :class="{'resize-icon': activeCategory === 3}">
                                <li
                                  :class="`col-${menu.categories ? 4 : 3}`"
                                  v-for="submenu in (menu.categories ? menu.categories[activeCategory].children : menu.children)"
                                  :key="submenu.title"
                                >
                                  <nuxt-link
                                    class="svg-hover"
                                    :to="$localePath(submenu.route)"
                                    exact
                                  >
                                    <inline-svg v-if="submenu.icon ==='camera360'" style="width: 28px;height:28px;" src="/img/camera360.svg"/>
                                    <icon v-else :name="submenu.icon" />
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
                <div class="col-lg-2 ml-auto">
                  <div class="row justify-content-end top-header-right">
                    <div class="col-5 col-lg-12 col-xl-12">
                      <nuxt-link
                        class="btn full-width btn--pale-green-outline"
                        :to="$localePath('/sell')"
                        @click.native="handleBtnClick('sell')"
                      >
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { MenusDataMixin } from '~/mixins/menus-data'
import { UserDataMixin } from '~/mixins/user-data'

import ThemeSwitch from '~/components/elements/ThemeSwitch'
import SiteBanner from "~/components/banners/SiteBanner";

export default {
  mixins: [MenusDataMixin, UserDataMixin],
  components: {
    SiteBanner,
    ThemeSwitch,
  },
  data() {
    return {
      close: false,
      hoverMenu: false,
      activeCategory: 0,
      topAdsVisible: true,
      closeDropdownMenu: false,
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
    closePromotion() {
      this.$cookies.set('smartbanner_exited', 1)
      this.close = true
      this.$store.commit('closeSmartBanner', false)
    },
    handleBtnClick(name) {
      if (this.routeName === name) {
        this.scrollTo(9, 9)
      }
    },
  },
  computed: {
    ...mapGetters([
      'notViewedFavorites',
      'notViewedSavedSearch',
      'homePageSliders',
    ]),
  },
  watch: {
    $route(to, from) {
      this.closeDropdownMenu = true
      setTimeout(() => {
        this.closeDropdownMenu = false
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.resize-icon {
  i {
    font-size:35px !important;
  }
}
//.external_salon_hover:hover,.external_salon_hover.exact-active {
//  svg, path {
//    fill:#F81734 !important;
//  }
//}
.topbar-nav {
  &__menu {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    justify-content: space-between;
    padding-left: 0;
    li {
      padding-left: 30px;
      list-style-type: none;
      a {
        width: 24px;
        height: 24px;
        position: relative;
        i {
          color: #fff;
          font-size: 24px;
        }
        span {
          position: absolute;
          top: -14px;
          right: -9px;
        }
      }
    }
  }
}

.header-menu {
  transition: box-shadow 0.1s ease-out;
  border-radius: 0 0 20px 20px;
}
</style>
