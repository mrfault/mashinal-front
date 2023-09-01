<template>
   <div class="mobile-menu d-lg-none">
      <div class="menu-header">
         <div class="container">
            <span class="cursor-pointer" @click="toggleSidebarMenu(true)">
               <icon name="burger"/>
            </span>

            <nuxt-link class="logo" :to="$localePath('/')" @click.native="$nuxt.$emit('logo-click')">
               <inline-svg
                  :src="`/img/${isDarkMode ? 'logo_new' : 'logo_mobile_new'}.svg`"
                  v-if="!btlCookie"
               />
            </nuxt-link>

            <span class="cursor-pointer" @click="handleIconClick(false, 'search-icon-click')" v-if="hasSearchFilters">
               <icon name="search"/>
            </span>

            <span class="cursor-pointer" @click="handleIconClick($localePath('/parts/shops'))" v-else-if="hasShops">
               <icon name="store"/>
            </span>

            <span class="cursor-pointer" @click="handleIconClick($localePath('/cars'))"
                  v-else-if="exceptions">

            </span>

            <span class="cursor-pointer" @click="handleIconClick($localePath('/cars'))"
                  v-else-if="hasSearchNav || !loggedIn">
               <icon name="options"/>
            </span>

            <span class="cursor-pointer" @click="logout" v-else>
               <icon name="logout"/>
            </span>
         </div>
      </div>

      <div class="menu-backdrop" v-if="showSidebar" @click="toggleSidebarMenu(false)"></div>

      <div :class="['menu-sidebar-new', {'show': showSidebar}]">
         <div class="menu-sidebar_content">
            <div class="col-md-12">
               <div class="menu-sidebar-new-action-bar">
                  <div class="menu-sidebar-new-action-bar-left"></div>
                  <div class="menu-sidebar-new-action-bar-center">
                     <span>{{$t('menu')}}</span>
                  </div>
                  <div class="menu-sidebar-new-action-bar-right" @click="toggleSidebarMenu(false)">
                     <inline-svg :src="'/icons/close-nav.svg'"/>
                  </div>
               </div>
            </div>
            <div class="col-md-12">
               <div class="ma-garage-services__container">
                  <div class="ma-garage-services">
                     <div v-for="(item, index) in menuServices">
                        <div v-if="item.row === 1" :key="index" class="ma-garage-services__item">
                           <menu-card :item="item" @click.native="toggleSidebarMenu(false)"></menu-card>
                        </div>
                     </div>
                  </div>
                  <div class="ma-garage-services">
                     <div v-for="(item, index) in menuServices">
                        <div v-if="item.row === 2" :key="index" class="ma-garage-services__item">
                           <menu-card :item="item" @click.native="toggleSidebarMenu(false)"></menu-card>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {MenusDataMixin} from '~/mixins/menus-data';
import {UserDataMixin} from '~/mixins/user-data';
import ThemeSwitch from '~/components/elements/ThemeSwitch';
import MenuCard from "~/components/menu/MenuCard.vue";

export default {
   mixins: [MenusDataMixin, UserDataMixin],
   components: {
      MenuCard,
      ThemeSwitch
   },
   data() {
      return {
         showSidebar: false
      }
   },
   created() {
      this.$root.$refs.MobileMenuNew = this;
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
      }),
      image() {
         if (this.user?.autosalon) {
            return (this.user?.autosalon?.logo.includes('http') ? '' : 'https://dev.mashin.al/storage/') + this.user?.autosalon?.logo;
         } else if (this.user?.avatar){
            return (this.user?.avatar?.includes('http') ? '' : 'https://dev.mashin.al/storage/') + this.user?.avatar;
         } else {
            return false;
         }
      },
      menuServices() {
         let data = [
            {
               title: 'menu_qn',
               image: 'qn.png',
               url: '/plates',
               description: 'menu_qn_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_external_salon',
               image: 'auto-by-order.png',
               url: '/external-salons',
               description: 'menu_external_salon_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_spare_parts',
               image: 'spare-parts.png',
               url: '/parts',
               description: 'menu_spare_parts_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_auto_catalog',
               image: 'auto-catalog.png',
               url: '/catalog',
               description: 'menu_auto_catalog_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_call_center',
               image: 'support.png',
               url: '/contact-us',
               description: 'menu_call_center_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_guide',
               image: 'guide.png',
               url: '/cars/assistant',
               description: 'menu_guide_desc',
               row: 1,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_e_services',
               image: 'e-services.png',
               url: '/e-services',
               description: 'menu_e_services_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_salons',
               image: 'salons.png',
               url: '/salons',
               description: 'menu_salons_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_shops',
               image: 'shops.png',
               url: '/parts/shops',
               description: 'menu_shops_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_messages',
               image: 'messages.png',
               url: '/profile/messages',
               description: 'menu_messages_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_comparisons',
               image: 'comparisons.png',
               url: '/comparison',
               description: 'menu_comparisons_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_settings',
               image: 'settings.png',
               url: '/settings',
               description: 'menu_settings_desc',
               row: 2,
               auth: false,
               disabled: false
            },
            {
               title: 'menu_terms',
               image: 'terms.png',
               url: '/policy',
               description: 'menu_terms_desc',
               row: 2,
               auth: false,
               disabled: false
            }
         ];

         if (!this.loggedIn) {
            data.unshift({
               title: 'menu_login',
               image: 'login.png',
               url: '/login',
               description: 'menu_login_desc',
               row: 1,
               auth: false,
               disabled: false
            });
         } else {
            data.unshift({
               title: this.user.full_name,
               image: this.image,
               url: '/garage-services',
               description: 'garage_services',
               row: 1,
               auth: true,
               disabled: false
            });
         }

         return data;
      }
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
