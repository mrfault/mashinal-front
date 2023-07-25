<template>
   <page-layout>
      <template #nuxt>
         <div v-if="false" class="container">
            <portal-target name="breadcrumbs"/>
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
         <div class="container-fluid max-container">
            <div v-if="!isMobileBreakpoint" class="row breadcrumbs_main">
               <div class="container">
                  <portal-target name="breadcrumbs"/>
               </div>
            </div>
            <div class="row">
               <div class="container">
                  <div class="ma-garage pt-5 pb-5">
                     <div v-if="!isMobileBreakpoint" class="ma-garage__nav">
                        <div class="ma-garage__nav--profile">
                           <div class="ma-garage__nav--profile__avatar">
                              <template v-if="user.avatar">
                                 <img :src="`${user.avatar}`" alt="avatar"/>
                              </template>
                              <h5 v-else class="ma-garage__nav--profile__name">{{ user.full_name.charAt(0) }}</h5>
                           </div>
                           <h5 class="ma-garage__nav--profile__name"> {{ user.full_name }}</h5>
                        </div>
                        <template v-for="(item) in garageNavs">
                           <nuxt-link v-if="!item.isButton" :to="item.link" class="ma-garage__nav--item">
                              <!--                              <icon :name="item.icon"/>-->
                              <inline-svg :src="`/new-icons/${item.icon}-new.svg`"/>
                              <h6 class="ma-garage__nav--item__title">{{ item.title }}</h6>
                           </nuxt-link>
                           <a v-else class="ma-garage__nav--item" href="javascript:void(0);" @click="logout">
                              <inline-svg :src="`/new-icons/${item.icon}-new.svg`"/>
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
   mounted() {
      console.log("user", this.user)
   },
   components: {
      PageLayout
   },
   computed: {
      garageNavs() {
         if (this.user.autosalon) {
            return [
               {
                  title: this.$t('my_packages'),
                  icon: 'packages',
                  link: '/profile/packages/',
               },
               {
                  title: this.$t('my_announces'),
                  icon: 'layers',
                  link: '/profile/announcements?type=1',
               },
               {
                  title: this.$t('my_balance'),
                  icon: 'wallet',
                  link: '/profile/balance/',
               },
               {
                  title: this.$t('my_profile'),
                  icon: 'store',
                  link: '/profile/settings/',
               },
               {
                  title: this.$t('agreements'),
                  icon: 'document-text',
                  link: '/profile/agreement',
               },
               {
                  title: this.$t('sign_out'),
                  icon: 'logout',
                  link: '/logout',
                  isButton: true,
               },
            ]
         } else return [
            {
               title: this.$t('my_announces'),
               icon: 'layers',
               link: '/profile/announcements',
            },
            {
               icon: 'invoice',
               title: this.$t('penalties'),
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

<style lang="scss">
.max-container{
   background-color: #fff!important;
   min-height: 900px;
}
.breadcrumbs_main{
   background-color: #EEF2F6;
}
.ma-garage__nav--profile{
   margin-bottom: 30px;
}
.dark-mode{
   .breadcrumbs_main{
      background-color: #121926;
   }
   .max-container{
      background-color: #121926!important;
   }
   .ma-garage__nav--item__title{
      color: #9AA4B2!important;
   }
   .ma-garage__nav--profile__name{
      color: #fff!important;
   }
}
</style>

<style lang="scss">
.dark-mode {
   .layout {
      background: #121926 !important;

   }

   .ma-announcements{
      .no-results{
         background: #1b2434 !important;
      }
   }
   .ma-announcements__head{
      background: #1B2434;
      button{
         color: #fff;
      }
   }

   .ma-garage {
      &__nav {
         &--profile{
            h5{
               color: #fff;
            }
         }
         &--item {
            h6,h5 {
               color: #fff;
            }

            svg {
               path {

                  stroke: #fff;
               }
            }
         }
      }

      .container {
         //background: #1B2434;
         border-radius: 8px;
         padding-bottom: 40px;
      }
   }
}

</style>



