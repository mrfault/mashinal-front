<template>
   <div class="pages-dashboard pt-2 pt-lg-5 mb-5 pb-5">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <div class="ma-garage-services__container">
            <div class="ma-garage-services">
               <div v-for="(item, index) in garageServices">
                  <div v-if="item.row == 1" :key="index" class="ma-garage-services__item">
                     <garage-card :item="item"></garage-card>
                  </div>
               </div>
            </div>
            <div class="ma-garage-services">
               <div v-for="(item, index) in garageServices">
                  <div v-if="item.row == 2" :key="index" class="ma-garage-services__item">
                     <garage-card :item="item"></garage-card>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import EServiceCard from '~/components/eservices/EServiceCard.vue'
import GarageCard from "~/components/garage/GarageCard";

export default {
   components: {EServiceCard, GarageCard},

   middleware: ['auth_general'],
   layout: 'garageLayout',

   head() {
      return this.$headMeta({
         title: this.$t('garage_services'),
      })
   },

   async asyncData({$axios}) {
      const data = await $axios.$get('/garage-positions')

      return {
         positions: data
      }
   },

   computed: {
      crumbs() {
         return [{name: this.$t('garage_services')}]
      },

      // garageServiceList() {
      //    return [
      //       {
      //          title: this.$t('attorney'),
      //          description: null,
      //          value: 0,
      //          icon: 'stamp-rotated',
      //          url: '/garage',
      //          hasAction: true,
      //          isAttorney: true,
      //          image: 'etibarname',
      //          isAvailable: false,
      //          checkIfSafari: true,
      //       },
      //       {
      //          type: 1,
      //          title: this.$t('check_points'),
      //          description: null,
      //          value: null,
      //          icon: 'receipe-manat',
      //          url: '/check-driver-penalties',
      //          hasAction: false,
      //          image: 'check-penalty',
      //          isAvailable: false,
      //       },
      //       {
      //          type: 2,
      //          title: this.$t('my_announces'),
      //          description: null,
      //          value: null,
      //          icon: 'announcement',
      //          url: '/profile/announcements',
      //          hasAction: true,
      //          image: 'announcement',
      //          isAvailable: true,
      //          actionName: this.$t('to_sell'),
      //          actionLink: '/sell',
      //       },
      //       {
      //          type: 3,
      //          title: this.$t('my_account'),
      //          description: this.$auth.user.full_name,
      //          value: null,
      //          icon: 'user',
      //          url: '/profile/settings',
      //          hasAction: false,
      //          image: 'account',
      //          isAvailable: !this.$auth.user.parent_id,
      //       },
      //       {
      //          type: 4,
      //          title: this.$t('fines'),
      //          description: null,
      //          value: null,
      //          icon: 'receipe',
      //          url: '/garage',
      //          hasAction: false,
      //          image: 'penalties',
      //          isAvailable: true,
      //       },
      //       {
      //          type: 5,
      //          title: this.$t('balans'),
      //          description: this.$t('wallet_balance') + ':',
      //          value: this.$auth.user.balance + ' AZN',
      //          icon: 'wallet',
      //          url: '/profile/balance',
      //          hasAction: true,
      //          image: 'wallet',
      //          isAvailable: true,
      //          actionName: this.$t('replenish'),
      //          actionLink: '/profile/balance?scrollto=increase',
      //          hasActionMethod: true,
      //       },
      //       {
      //          type: 6,
      //          title: this.$t('my_searches'),
      //          description: null,
      //          value: null,
      //          icon: 'template',
      //          url: '/profile/templates',
      //          hasAction: false,
      //          image: 'search',
      //          isAvailable: true,
      //       },
      //       {
      //          type: 7,
      //          title: this.$t('helper_search'),
      //          description: null,
      //          value: null,
      //          icon: 'helper-tab',
      //          url: '/cars/assistant',
      //          hasAction: false,
      //          image: 'guide',
      //          isAvailable: true,
      //       },
      //       {
      //          title: 'Super təklif',
      //          description: null,
      //          value: null,
      //          icon: 'hammer',
      //          url: '/super-offers',
      //          hasAction: false,
      //          image: 'super-offer',
      //          isAvailable: false,
      //       },
      //       {
      //          title: this.$t('my_reports'),
      //          description: null,
      //          value: null,
      //          icon: 'order-history',
      //          url: '/super-offers',
      //          hasAction: false,
      //          image: 'parchment',
      //          isAvailable: false,
      //       },
      //       {
      //          title: 'İcarə avtomobillərim',
      //          description: null,
      //          value: null,
      //          icon: 'hand-key',
      //          url: '/super-offers',
      //          hasAction: false,
      //          image: 'rent-a-car',
      //          isAvailable: false,
      //       },
      //       {
      //          type: 8,
      //          title: `${this.$t('dashboard_salon')}`,
      //          description: null,
      //          value: null,
      //          icon: 'salons-tab',
      //          url: '/dashboard/1',
      //          hasAction: false,
      //          image: 'saloon-dashboard',
      //          isAvailable: !!this.$auth.user.autosalon && !this.$auth.user.external_salon,
      //       },
      //       {
      //          type: 9,
      //          title: this.$t('dashboard_shop'),
      //          description: null,
      //          value: null,
      //          icon: 'shops-tab',
      //          url: '/dashboard/2',
      //          hasAction: false,
      //          image: 'shop-dashboard',
      //          isAvailable: !!this.$auth.user.part_salon,
      //       },
      //       {
      //          type: 11,
      //          title: this.$t('notifications'),
      //          description: null,
      //          value: null,
      //          icon: 'bell',
      //          url: '/notifications',
      //          hasAction: false,
      //          image: 'notifications-image',
      //          isAvailable: this.isMobileBreakpoint,
      //       },
      //       {
      //          type: 12,
      //          title: this.$t('policy'),
      //          description: null,
      //          value: null,
      //          icon: 'copy-1',
      //          url: '/policy',
      //          hasAction: false,
      //          image: 'rules-image',
      //          isAvailable: this.isMobileBreakpoint,
      //       },
      //       {
      //          type: 10,
      //          title: this.$t('create_eservice_and_shop'),
      //          description: null,
      //          value: null,
      //          icon: 'create-shop',
      //          url: '/business-profile',
      //          hasAction: false,
      //          image: 'createshop',
      //          isAvailable: false/*!this.$auth.user.external_salon*/,
      //       },
      //       {
      //          type: 14,
      //          title: 'Super təklif',
      //          description: null,
      //          value: null,
      //          icon: 'create-shop',
      //          url: this.$auth.user.autosalon ? '/salons/offer?param=all' : '/offer?param=all',
      //          hasAction: false,
      //          image: 'createshop',
      //          isAvailable: true,
      //       },
      //       // {
      //       //    type: 15,
      //       //    title: `${this.$t('dashboard_external_salon')}`,
      //       //    description: null,
      //       //    value: null,
      //       //    icon: 'salons-tab',
      //       //    url: '/dashboard/3',
      //       //    hasAction: false,
      //       //    image: 'saloon-dashboard',
      //       //    isAvailable: !!this.$auth.user.external_salon,
      //       // },
      //       {
      //          type: 15,
      //          title: this.$t('my_packages'),
      //          description: null,
      //          value: null,
      //          icon: 'packages',
      //          url: '/profile/packages',
      //          hasAction: true,
      //          image: 'packages',
      //          isAvailable: !!this.$auth.user.can_be_autosalon,
      //          actionName: `${this.$t('get_package')}`,
      //       },
      //       {
      //          type: 16,
      //          title: this.$t('eservices'),
      //          description: null,
      //          value: null,
      //          icon: 'globe',
      //          url: '/e-services',
      //          hasAction: true,
      //          image: 'globe',
      //          isAvailable: true,
      //          // actionName: `${this.$t('get_package')}`,
      //       },
      //    ]
      // },

      garageServices() {
         return [
            {
               title: 'my_announcements',
               image: 'speaker.png',
               url: '/profile/announcements',
               description: 'sign_in_to_account',
               row: 1,
            },
            {
               title: 'my_balance',
               image: 'wallet.png',
               url: '/profile/balance',
               description: 'profile_balance_desc',
               row: 1,
            },
            {
               title: 'site_settings',
               image: 'settings.png',
               url:  '/settings',
               description: 'profile_settings_desc',
               row: 1,
            },
            {
               title: 'MashinPay',
               image: 'mashinpay.png',
               url: '/',
               description: 'Lorem ipsum dolor sit amet consectetu. Ipsum nunc tincidun utred lorempus.',
               row: 2,
            },
            {
               title: 'penalties',
               image: 'doc.png',
               url: '/garage',
               description: 'garage_penalties_desc',
               row: 2,
            },
            {
               title: 'my_autos',
               image: 'mycar.png',
               url: '/profile/automobiles',
               description: 'my_car_desc',
               row: 1,
            },
            {
               title: 'my_account',
               image: 'avatar.png',
               url:  this.user.autosalon ? '/dashboard/1/settings' : '/profile/settings',
               description: 'garage_account_desc',
               row: 2,
            },
            {
               title: 'logout',
               image: 'logout.png',
               url: null,
               description: 'logout_account_desc',
               row: 2,
            },
         ]
      }

      // garageServices() {
      //    return this.positions.map(item => {
      //       return this.garageServiceList.find(g_item => g_item.type === item.type) || {}
      //    })
      // },
   },

   nuxtI18n: {
      paths: {
         az: '/qaraj-xidmetleri',
      },
   },
}
</script>

<style lang="scss">
.ma-garage-services {
   width: calc(50% - 8px);
   box-sizing: border-box;
   overflow: hidden;

   &__container {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
   }

   &__item {
      //width: calc(50% - 8px);
      width: 100%;
   }
}
</style>
