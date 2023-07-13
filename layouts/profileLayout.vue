<template>
   <page-layout>
      <template #nuxt>
         <div class="container-fluid">
            <div class="row breadcrumbs_main" v-if="!isMobileBreakpoint">
               <div class="container">
                  <portal-target name="breadcrumbs"/>
               </div>
            </div>
            <div class="row">
               <div class="container">
                  <div class="ma-garage pt-5 pb-5">
                     <div class="ma-garage__nav" v-if="!isMobileBreakpoint">
                        <div class="ma-garage__nav--profile">
                           <div class="ma-garage__nav--profile__avatar">
                              <template v-if="user.avatar">
                                 <img :src="user.avatar"/>
                              </template>
                              <h5 v-else class="ma-garage__nav--profile__name">{{ user.full_name.charAt(0) }}</h5>
                           </div>
                           <h5 class="ma-garage__nav--profile__name"> {{ user.full_name }}</h5>
                        </div>
                        <template v-for="(item, index) in garageNavs">
                           <nuxt-link v-if="!item.isButton" :to="item.link" class="ma-garage__nav--item">
                              <icon :name="item.icon"/>
                              <h6 class="ma-garage__nav--item__title">{{ item.title }}</h6>
                           </nuxt-link>
                           <a v-else class="ma-garage__nav--item" href="javascript:void(0);" @click="logout">
                              <icon :name="item.icon"/>
                              <h6 class="ma-garage__nav--item__title">{{ item.title }}</h6>
                           </a>
                        </template>
                     </div>
                     <div :class="isMobileBreakpoint ? 'ma-garage__content-full' : 'ma-garage__content'">
                        <nuxt/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </template>
   </page-layout>
</template>

<script>
import PageLayout from '~/components/layout/PageLayout';
import {MenusDataMixin} from "~/mixins/menus-data";
import {UserDataMixin} from "~/mixins/user-data";

export default {
   name: 'garage',
   middleware: ['main'],
   mixins: [MenusDataMixin, UserDataMixin],

   components: {
      PageLayout
   },
   computed: {
      garageNavs() {
         return [
            {
               title: this.$t('my_packages'),
               icon: 'line-chart',
               link: '/profile/packages/',
            },
            {
               title: this.$t('my_announces'),
               icon: 'line-chart',
               link: '/profile/announcements?type=1',
            },
            {
               title: this.$t('my_balance'),
               icon: 'line-chart',
               link: '/profile/balance/',
            },
            {
               title: this.$t('my_profile'),
               icon: 'line-chart',
               link: '/profile/settings/',
            },
            {
               title: this.$t('agreements'),
               icon: 'line-chart',
               link: '/profile/agreement',
            },
            {
               title: this.$t('sign_out'),
               icon: 'line-chart',
               link: '/logout',
               isButton: true,
            },
         ]
      },
   }
}
</script>

<style lang="scss">
.container-fluid{
   background-color: #fff!important;
   margin-bottom: -112px;
   min-height: 900px;
}
.breadcrumbs_main{
   background-color: #EEF2F6;
}
.ma-garage__nav--profile{
   margin-bottom: 30px;
}
</style>
