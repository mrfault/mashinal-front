<template>
   <page-layout>
      <template #nuxt>
         <div class="container">
            <div class="ma-garage">
               <div class="ma-garage__nav">
                  <NuxtLink :to="$localePath('garage-services')" class="ma-garage__nav--profile">

                     <div class="ma-garage__nav--profile__avatar">
                        <template v-if="user.avatar">
                           <img :src="user.avatar"/>
                        </template>
                        <h5 v-else class="ma-garage__nav--profile__name">{{ user.full_name.charAt(0) }}</h5>
                     </div>
                     <h5 class="ma-garage__nav--profile__name"> {{ user.full_name }}</h5>
                  </NuxtLink>
                  <template v-for="(item, index) in garageNavs">
                     <nuxt-link
                        v-if="!item.isButton"
                        :class="{'ma-garage-link-active': isRouteActive(item.link) }"
                        :to="item.link"
                        class="ma-garage__nav--item"
                     >
                        <inline-svg :src="`/new-icons/${item.icon}-new.svg`"/>
                        <h6 class="ma-garage__nav--item__title">{{ item.title }}</h6>
                     </nuxt-link>
                     <a v-else class="ma-garage__nav--item" href="javascript:void(0);" @click="logout">
                        <inline-svg :src="`/new-icons/${item.icon}-new.svg`"/>
                        <h6 class="ma-garage__nav--item__title">{{ item.title }}</h6>
                     </a>
                  </template>
               </div>
               <div class="ma-garage__content">
                  <nuxt/>
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
               title: this.$t('my_announces'),
               icon: 'layers',
               link: '/profile/announcements',
            },
            {
               title: this.$t('garage'),
               icon: 'line-chart',
               link: '/garage',
            },
            {
               title: this.$t('my_balance'),
               icon: 'wallet',
               link: '/profile/balance/',
            },
            {
               title: this.$t('my_account'),
               icon: 'user',
               link: '/profile/settings/',
            },
            {
               title: this.$t('sign_out'),
               icon: 'logout',
               link: 'announces',
               isButton: true,
            },
         ]
      },
   },
   methods: {
      isRouteActive(link) {
         console.log("this.$route.path", this.$route.path, link)
         if (this.$route.path == this.$localePath(link)) {
            return true
         } else {
            return false
         }
      },
   }

}
</script>


