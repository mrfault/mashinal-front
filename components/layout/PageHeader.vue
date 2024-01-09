<template>
   <div class="page-header">
      <header :class="['header-menu d-none d-lg-block', { 'no-border-radius': hoverMenu }]">
         <!-- topbar -->
         <div class="topbar">
            <div class="container">
               <nuxt-link
                  class="logo"
                  :to="$localePath('/')"
                  @click.native="$nuxt.$emit('logo-click')"
               >
                  <inline-svg
                     :src="'/img/logo_new.svg'"
                     v-if="!btlCookie"
                  />
               </nuxt-link>

               <div class="call-center">
                  <inline-svg :src="'/icons/subtract.svg'"/>
                  <span>*8787</span>
               </div>

               <nav class="topbar-nav">
                  <ul class="topbar-nav__menu">
                     <li v-for="menu in topbarMenus" :key="menu.title">
                        <nuxt-link :to="$localePath(menu.route)">
                           <icon
                              v-if="!['comparisons', 'favorites', 'templates'].includes(menu.title)"
                              :name="menu.icon"
                              v-b-tooltip="$t('tooltip_' + menu.title)"
                           />

                           <div v-else v-b-tooltip="$t('tooltip_' + menu.title)">
                              <inline-svg :src="`/icons/${menu.icon}`"/>
                           </div>

                           <template v-if="menu.title === 'messages' && countNewMessages > 0">
                              <span class="badge-counter">{{ countNewMessages }}</span>
                           </template>

                           <template v-if="menu.title === 'notifications' && countNewNotifications > 0">
                              <span class="badge-counter">{{ countNewNotifications }}</span>
                           </template>

                           <template v-else-if="menu.title === 'comparisons' && comparisonCount > 0">
                              <span class="badge-counter" style="top: -3px; right:-12px;">{{ comparisonCount }}</span>
                           </template>

                           <template v-else-if="menu.title === 'favorites' && notViewedFavorites > 0">
                              <span class="badge-counter" style="top: -3px; right:-12px;">{{ notViewedFavorites }}</span>
                           </template>

                           <template v-else-if="menu.title === 'templates' && notViewedSavedSearch > 0">
                              <span class="badge-counter" style="top: -3px; right:-12px;">{{notViewedSavedSearch }}</span>
                           </template>
                        </nuxt-link>
                     </li>
                  </ul>

                  <nuxt-link custom :to="getUserSettingsLink" v-slot="{ navigate }">
                     <div class="user-menu btn rotatable_hover" @click="navigate">
                        <icon name="garage-tab" v-if="loggedIn"/>

                        <p v-if="loggedIn" class="user-menu__title mb-0 pr-3">{{ $t('profile') }}</p>

                        <p v-if="!loggedIn" class="m-auto">{{ $t('login') }}</p>

                        <icon
                           name="chevron-down rotatable"
                           class="user-menu__toggler"
                           v-if="loggedIn"
                        />

                        <div class="user-menu_list" v-if="loggedIn" @click.stop>
                           <div class="user-menu_list-inner">
                              <nuxt-link
                                 v-if="image"
                                 :to="getUserSettingsLink"
                                 class="d-inline-flex align-items-center align-top"
                              >
                                 <template>
                                    <img :src="image" :alt="user.full_name"/>
                                 </template>

                                 <span class="text-truncate">{{ user.full_name }}</span>
                              </nuxt-link>

                              <NuxtLink v-else :to="getUserSettingsLink" class="ma-garage__nav--profile">
                                 <div class="ma-garage__nav--profile__avatar">
                                    <h5  class="ma-garage__nav--profile__name">{{ user?.full_name?.charAt(0) }}</h5>
                                 </div>
                                 <h5 class="ma-garage__nav--profile__name"> {{ user?.full_name }}</h5>
                              </NuxtLink>

                              <hr/>

                              <ul>
                                 <template
                                    v-for="menu in userMenus"
                                    v-if="menu.isAvailable && ((user.parent_id || (user.children && user.children.length)) ? menu.title !== 'garage':true )"
                                 >

                                    <li
                                       v-if="menu.title === 'my_account' ? !user.parent_id: true"
                                       :key="menu.title"
                                    >
                                       <nuxt-link :to="$localePath(menu.route)">{{ $t(menu.title) }}</nuxt-link>
                                    </li>

                                    <li v-else>
                                       <a href="javascript:void(0);" @click="logoutToParent">{{
                                             $t('logout_to_parent')
                                          }}</a>
                                    </li>
                                 </template>

                                 <li v-if="user.children && user.children.length">
                                    <nuxt-link to="/my-autosalons">{{ $t('logout_to_parent') }}</nuxt-link>
                                 </li>

                                 <li key="logout">
                                    <a href="javascript:void(0);" @click="logout">{{ $t('logout') }}</a>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </nuxt-link>

                  <LanguageChange/>

                  <!--                        <div class="langs-menu btn btn&#45;&#45;dark-white-outline">-->
                  <!--                            <span class="langs-menu__selected">{{ locale }}</span>-->
                  <!--                            <icon name="chevron-down"/>-->
                  <!--                            <div class="langs-menu_list">-->
                  <!--                                <div class="langs-menu_list-inner">-->
                  <!--                                    <span-->
                  <!--                                        class="cursor-pointer"-->
                  <!--                                        v-for="code in locales"-->
                  <!--                                        :key="code"-->
                  <!--                                        @click="changeLocale(code)"-->
                  <!--                                    >-->
                  <!--                                      {{ code }}-->
                  <!--                                    </span>-->
                  <!--                                </div>-->
                  <!--                            </div>-->
                  <!--                        </div>-->

                  <theme-switch/>
               </nav>
            </div>
         </div>

         <!-- navbar white -->
         <div :class="['navbar navbar-white position-relative', { 'no-border-radius': hoverMenu }]">
            <div class="container">
               <nav class="full-width">
                  <div class="row align-items-center">
                     <div class="col-lg-10 position-static">
                        <ul class="menu position-relative">
                           <li v-for="menu in navbarMenus"
                              :key="menu.title"
                              @mouseover="menu.children ? (hoverMenu = true) : ''"
                              @mouseleave="hoverMenu = false, activeCategory = 0"
                              :class="{ dropdown: menu.children }"
                           >
                              <nuxt-link
                                 class="external_salon_hover"
                                 :class="{'exact-active' : menu.activeRoute === activeTab}"
                                 style="position: relative"
                                 :to="$localePath(menu.route)"
                              >
                                 {{ $t(menu.title) }}
                                 <icon name="chevron-down" v-if="menu.children" />
                                 <IconNovelties v-if="menu.with_badge" />
                              </nuxt-link>

<!--                              <div-->
<!--                                 class="dropdown-content container"-->
<!--                                 style="padding-left: 0;"-->
<!--                                 v-if="menu.children"-->
<!--                                 :class="{ 'dropdown-menu-click': closeDropdownMenu }"-->
<!--                              >-->
<!--                                 <div class="container">-->
<!--                                    <div class="row">-->
<!--                                       <div class="col-3" v-if="menu.categories">-->
<!--                                          <ul class="dropdown-menu_categories">-->
<!--                                             <li-->
<!--                                                @mouseover="activeCategory = index"-->
<!--                                                v-for="(category, index) in menu.categories"-->
<!--                                                :key="category.title"-->
<!--                                             >-->
<!--                                                <nuxt-link-->
<!--                                                   :to="$localePath(category.route)"-->
<!--                                                   active-class="link-active"-->
<!--                                                   :class="{ active: index === activeCategory }"-->
<!--                                                >-->
<!--                                                   {{ $t(category.title) }}-->

<!--                                                   <icon name="chevron-right"/>-->

<!--                                                   &lt;!&ndash; <inline-svg src="/icons/chevron-right.svg" :height="14" /> &ndash;&gt;-->
<!--                                                </nuxt-link>-->
<!--                                             </li>-->
<!--                                          </ul>-->
<!--                                       </div>-->

<!--                                       <div :class="`col-${menu.categories ? 9 : 12}`">-->
<!--                                          <ul :class="['dropdown-menu row', {'resize-icon': activeCategory === 3}]">-->
<!--                                             <li-->
<!--                                                :class="`col-${menu.categories ? 4 : 3}`"-->
<!--                                                v-for="submenu in (menu.categories ? menu.categories[activeCategory].children : menu.children)"-->
<!--                                                :key="submenu.title"-->
<!--                                             >-->
<!--                                                <nuxt-link-->
<!--                                                   class="svg-hover"-->
<!--                                                   :to="$localePath(submenu.route)"-->
<!--                                                   exact-->
<!--                                                >-->
<!--                                                   <inline-svg-->
<!--                                                      v-if="submenu.icon ==='camera360'"-->
<!--                                                      style="width: 28px; height:28px;"-->
<!--                                                      src="/img/camera360.svg"-->
<!--                                                   />-->

<!--                                                   <icon v-else :name="submenu.icon"/>-->

<!--                                                   {{ $t(submenu.title) }}-->
<!--                                                </nuxt-link>-->
<!--                                             </li>-->
<!--                                          </ul>-->
<!--                                       </div>-->
<!--                                    </div>-->
<!--                                 </div>-->
<!--                              </div>-->
                           </li>
                        </ul>
                     </div>

                     <div class="col-lg-2">
                        <div class="row">
                           <div class="col-5 col-lg-12 col-xl-12 d-flex justify-content-end">
                              <nuxt-link
                                 class="btn full-width btn--green"
                                 :to="$localePath('/sell')"
                                 @click.native="handleBtnClick('sell')"
                              >
                                 {{ $t('new_announce') }}

                                 <icon name="plus" />
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
   import {mapGetters, mapActions} from 'vuex'
   import {MenusDataMixin} from '~/mixins/menus-data'
   import {UserDataMixin} from '~/mixins/user-data'
   import ThemeSwitch from '~/components/elements/ThemeSwitch'
   import SiteBanner from "~/components/banners/SiteBanner";
   import IconNovelties from "~/components/elements/IconNovelties.vue";
   import LanguageChange from "~/components/elements/languageChange.vue";

   export default {
      mixins: [MenusDataMixin, UserDataMixin],

      components: {
         LanguageChange,
         SiteBanner,
         ThemeSwitch,
         IconNovelties
      },

      data() {
         return {
            close: false,
            hoverMenu: false,
            topAdsVisible: true,
            closeDropdownMenu: false,
            activeCategory: 0
         }
      },

      methods: {
         ...mapActions(['changeLocale']),

         handleBtnClick(name) {
            if (this.routeName === name) this.scrollTo(9, 9);
         }
      },

      computed: {
         ...mapGetters({
            notViewedFavorites: 'notViewedFavorites',
            notViewedSavedSearch: 'notViewedSavedSearch',
            homePageSliders: 'homePageSliders',
            comparisonCount: 'comparison/count'
         }),

         image() {
            if (this.user?.autosalon) {
               return (this.user?.autosalon?.logo.includes('http') ? '' : 'https://mashin.al/storage/') + this.user?.autosalon?.logo;
            } else if (this.user?.avatar){
               return (this.user?.avatar?.includes('http') ? '' : 'https://mashin.al/storage/') + this.user?.avatar;
            } else {
               return false;
            }
         },

         activeTab() {
            return this.$route.name.split('__')[0];
         }
      },

      watch: {
         $route(to, from) {
            this.closeDropdownMenu = true;
            setTimeout(() => this.closeDropdownMenu = false, 1000);
         }
      }
   }
</script>

<style lang="scss" scoped>
   .ma-garage__nav--profile {
      margin-bottom: 30px;
   }
   .ma-garage__nav--profile__avatar img {
      height: 36px;
      width: 36px;
      object-fit: contain;
   }
   .dark-mode{
      .ma-garage__nav--item__title{
         color: #9AA4B2!important;
      }
      .ma-garage__nav--profile__name{
         color: #fff!important;
      }
   }

   .resize-icon {
      i {
         font-size: 35px !important;
      }
   }

   .external_salon_hover:hover, .external_salon_hover.exact-active {
      svg, path {
         fill: #F81734 !important;
      }
   }

   .topbar-nav {
      position: relative;

      &__menu {
         display: flex;
         align-items: center;
         margin-bottom: 0;
         justify-content: space-between;
         padding-left: 0;

         li {
            list-style-type: none;

            &:not(:first-child) {
               margin-left: 40px;
            }

            a {
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

      .languageChange {
         margin-right: 15px;
      }
   }

   .page-header .navbar .menu > li a.active, .page-header .navbar .menu > li a.exact-active {
      color: #F81734;
   }
</style>
