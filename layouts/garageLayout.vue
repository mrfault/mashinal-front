<template>
   <page-layout>
      <template #nuxt>
         <div v-if="false" class="container">
            <portal-target name="breadcrumbs"/>
            <div class="ma-garage">
               <div class="ma-garage__nav">
                  <NuxtLink :to="$localePath('garage-services')" class="ma-garage__nav--profile" >
                     <div class="ma-garage__nav--profile__avatar">
                        <template v-if="image">
                           <img :src="image" :alt="user?.full_name"/>
                        </template>
                        <h5 v-else class="ma-garage__nav--profile__name">{{ user?.full_name?.charAt(0) }}</h5>
                     </div>
                     <h5 class="ma-garage__nav--profile__name"> {{ user?.full_name }}</h5>
                  </NuxtLink>
                  <template v-for="(item, index) in garageNavs">
                     <nuxt-link
                        v-if="!item.isButton"
                        :class="{'ma-garage-link-active': isRouteActive(item.link) }"
                        :to="$localePath(item.link)"
                        :active-class="''"
                        :exact-active-clas="'active'"
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
                              <template v-if="image">
                                 <img :src="image" :alt="user.full_name"/>
                              </template>
                              <h5 v-else class="ma-garage__nav--profile__name">{{ user.full_name?.charAt(0) }}</h5>
                           </div>
                           <h5 class="ma-garage__nav--profile__name"> {{ user.full_name }}</h5>
                        </div>
                        <template v-for="(item) in garageNavs">
                           <nuxt-link v-if="!item.isButton" :to="item.link" class="ma-garage__nav--item">
                              <!--<icon :name="item.icon"/>-->
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
   mounted(){
      if (this.loggedIn) {
         this.$axios.$get('/new-notifications-count')
      }
   },
   components: {
      PageLayout
   },
   computed: {
      image() {
         if (this.user?.autosalon) {
            return (this.user?.autosalon?.logo.includes('http') ? '' : 'https://dev.mashin.al/storage/') + this.user?.autosalon?.logo;
         } else if (this.user?.avatar){
            return (this.user?.avatar?.includes('http') ? '' : 'https://dev.mashin.al/storage/') + this.user?.avatar;
         } else {
            return false;
         }
      },
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
               // {
               //    icon: 'invoice',
               //    title: this.$t('penalties'),
               //    link: '/garage',
               // },
               {
                  title: this.$t('my_balance'),
                  icon: 'wallet',
                  link: '/profile/balance/',
               },
               {
                  title: this.$t('my_profile'),
                  icon: 'store',
                  link: '/dashboard/1/settings/',
               },
               {
                  title: this.$t('agreements'),
                  icon: 'document-text',
                  link: '/profile/agreement',
               },
               {
                  title: this.$t('my_autos'),
                  icon: 'car',
                  link: '/profile/automobiles/',
               },
               {
                  title: this.$t('sign_out'),
                  icon: 'logout',
                  link: '/logout',
                  isButton: true,
               },
            ];
         } else {
            let data =  [
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
                  title: this.$t('my_autos'),
                  icon: 'car',
                  link: '/profile/automobiles/',
               },
               {
                  title: this.$t('sign_out'),
                  icon: 'logout',
                  link: 'announces',
                  isButton: true,
               },
            ];

            if (this.user.autosalon || this.user.part_salon || this.user.external_salon || this.user.can_be_autosalon) {
               data.unshift({
                  title: this.$t('my_packages'),
                  icon: 'packages',
                  link: '/profile/packages/',
               });
            }

            return data;
         }
      },
   },
   methods: {
      isRouteActive(link) {
         if (this.$route.path === this.$localePath(link)) {
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
.ma-garage__nav--profile__avatar img{
   height: 36px;
   width: 36px;
   object-fit: contain;
   border-radius: 50%;
}
.ma-garage__nav--profile__name{
   width: auto!important;
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
      .stratch-child-block{
         height: 100%;
      }
   }
   .ma-announcements__head{
      width: auto;
      background: #1B2434;
      overflow-y: auto !important;
      &::-webkit-scrollbar {
         width: 3px;
         height: 7px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
         background: transparent !important;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
         background: rgb(206, 206, 206);
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
         background: #555;
      }
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
               path,ellipse,circle {

                  stroke: #fff;
               }
            }
         }
      }

      .ma-garage__nav--profile__name{
         width: auto!important;
      }
      .container {
         //background: #1B2434;
         border-radius: 8px;
         padding-bottom: 40px;
      }
   }
}

.ma-garage__nav--profile__name {
   width: calc(100% - 48px);
   box-sizing: border-box;
   overflow: hidden;
   white-space: break-spaces;
   height: auto;
}



</style>



