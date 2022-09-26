<template>
  <div class="pages-dashboard pt-2 pt-lg-5 mb-5 pb-5">
    <div class="container d-flex flex-wrap">
      <breadcrumbs :crumbs="crumbs"/>
      <template v-for="(item, index) in garageServices">
        <div class="col-12 col-lg-4 mb-2 mb-xl-3" :key="index" v-if="item.isAvailable">
          <e-service-card :item="item"></e-service-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import EServiceCard from '~/components/eservices/EServiceCard.vue'

export default {
  components: {EServiceCard},
  middleware: ['auth_general'],
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
    garageServiceList() {
      return [
        {

          title: this.$t('attorney'),
          description: null,
          value: 0,
          icon: 'stamp-rotated',
          url: '/garage',
          hasAction: true,
          isAttorney: true,
          image: 'etibarname',
          isAvailable: false,
          checkIfSafari: true,
        },
        {
          type: 1,
          title: this.$t('check_points'),
          description: null,
          value: null,
          icon: 'receipe-manat',
          url: '/check-driver-penalties',
          hasAction: false,
          image: 'check-penalty',
          isAvailable: false,
        },
        {
          type: 2,
          title: this.$t('my_announces'),
          description: null,
          value: null,
          icon: 'announcement',
          url: '/profile/announcements',
          hasAction: true,
          image: 'announcement',
          isAvailable: true,
          actionName: this.$t('to_sell'),
          actionLink: '/sell',
        },
        {
          type: 3,
          title: this.$t('my_account'),
          description: this.$auth.user.full_name,
          value: null,
          icon: 'user',
          url: '/profile/settings',
          hasAction: false,
          image: 'account',
          isAvailable: !this.$auth.user.parent_id,
        },
        {
          type: 4,
          title: this.$t('fines'),
          description: null,
          value: null,
          icon: 'receipe',
          url: '/garage',
          hasAction: false,
          image: 'penalties',
          isAvailable: true,
        },
        {
          type: 5,
          title: this.$t('balans'),
          description: this.$t('wallet_balance') + ':',
          value: this.$auth.user.balance + ' ALManat',
          icon: 'wallet',
          url: '/profile/balance',
          hasAction: true,
          image: 'wallet',
          isAvailable: true,
          actionName: this.$t('replenish'),
          actionLink: '/profile/balance?scrollto=increase',
          hasActionMethod: true,
        },
        {
          type: 6,
          title: this.$t('my_searches'),
          description: null,
          value: null,
          icon: 'template',
          url: '/profile/templates',
          hasAction: false,
          image: 'search',
          isAvailable: true,
        },
        {
          type: 7,
          title: this.$t('helper_search'),
          description: null,
          value: null,
          icon: 'helper-tab',
          url: '/cars/assistant',
          hasAction: false,
          image: 'guide',
          isAvailable: true,
        },
        {
          title: 'Super təklif',
          description: null,
          value: null,
          icon: 'hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'super-offer',
          isAvailable: false,
        },
        {
          title: this.$t('my_reports'),
          description: null,
          value: null,
          icon: 'order-history',
          url: '/super-offers',
          hasAction: false,
          image: 'parchment',
          isAvailable: false,
        },
        {
          title: 'İcarə avtomobillərim',
          description: null,
          value: null,
          icon: 'hand-key',
          url: '/super-offers',
          hasAction: false,
          image: 'rent-a-car',
          isAvailable: false,
        },
        {
          type: 8,
          title: `${this.$t('dashboard_salon')}`,
          description: null,
          value: null,
          icon: 'salons-tab',
          url: '/dashboard/1',
          hasAction: false,
          image: 'saloon-dashboard',
          isAvailable: !!this.$auth.user.autosalon,
        },
        {
          type: 9,
          title: this.$t('dashboard_shop'),
          description: null,
          value: null,
          icon: 'shops-tab',
          url: '/dashboard/2',
          hasAction: false,
          image: 'shop-dashboard',
          isAvailable: !!this.$auth.user.part_salon,
        },
        {
          type: 11,
          title: this.$t('notifications'),
          description: null,
          value: null,
          icon: 'bell',
          url: '/notifications',
          hasAction: false,
          image: 'notifications-image',
          isAvailable: this.isMobileBreakpoint,
        },
        {
          type: 12,
          title: this.$t('policy'),
          description: null,
          value: null,
          icon: 'copy-1',
          url: '/policy',
          hasAction: false,
          image: 'rules-image',
          isAvailable: this.isMobileBreakpoint,
        },
        {
          type: 10,
          title: this.$t('create_eservice_and_shop'),
          description: null,
          value: null,
          icon: 'create-shop',
          url: '/business-profile',
          hasAction: false,
          image: 'createshop',
          isAvailable: true,
        },
        {
          type: 14,
          title: 'Super təklif' ,
          description: null,
          value: null,
          icon: 'create-shop',
          url: this.$auth.user.autosalon ? '/salons/offer' : '/offer',
          hasAction: false,
          image: 'createshop',
          isAvailable: true,
        },
        {
          type: 15,
          title: `${this.$t('dashboard_external_salon')}`,
          description: null,
          value: null,
          icon: 'salons-tab',
          url: '/dashboard/3',
          hasAction: false,
          image: 'saloon-dashboard',
          isAvailable: !!this.$auth.user.external_salon,
        },
      ]
    },
    garageServices() {
      return this.positions.map(item => {
        return this.garageServiceList.find(g_item => g_item.type === item.type) || {}
      })
    },
  },
  nuxtI18n: {
    paths: {
      az: '/qaraj-xidmetleri',
    },
  },
}
</script>

<style></style>
