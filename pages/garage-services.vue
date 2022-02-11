<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container d-flex flex-wrap">
      <breadcrumbs :crumbs="crumbs" />
      <template v-for="(item, index) in garageServices">
          <div
            class="col-lg-3 mb-2 mb-lg-3"
            :key="index"
            v-if="item.isAvailable"
          >
            <e-service-card :item="item"></e-service-card>
          </div>
      </template>
    </div>
  </div>
</template>

<script>
import EServiceCard from '~/components/eservices/EServiceCard.vue'
export default {
  components: { EServiceCard },
  head() {
    return this.$headMeta({
      title: this.$t('garage_services'),
    })
  },
  computed: {
    crumbs() {
      return [{ name: this.$t('garage_services') }]
    },
    garageServices() {
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
          isAvailable: true,
        },
        {
          title: this.$t('check_points'),
          description: null,
          value: null,
          icon: 'receipe-manat',
          url: '/check-driver-penalties',
          hasAction: false,
          image: 'check-penalty',
          isAvailable: true,
        },
        {
          title: this.$t('my_announces'),
          description: null,
          value: null,
          icon: 'announcement',
          url: '/profile/announcements',
          hasAction: true,
          image: 'announcement',
          isAvailable: true,
          actionName: this.$t('to_sell'),
          actionLink: '/asd',
        },
        {
          title: this.$t('my_account'),
          description: this.$auth.user.full_name,
          value: null,
          icon: 'user',
          url: '/profile/settings',
          hasAction: false,
          image: 'account',
          isAvailable: true,
        },
        {
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
          title: this.$t('balans'),
          description: this.$t('wallet_balance') + ':',
          value: this.$auth.user.balance + ' ALManat',
          icon: 'wallet',
          url: '/profile/balance',
          hasAction: true,
          image: 'wallet',
          isAvailable: true,
          actionName: this.$t('replenish'),
          actionLink: '/profile/balance',
          hasActionMethod: true,
        },
        {
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
          title: this.$t('policy'),
          description: null,
          value: null,
          icon: 'copy-1',
          url: '/policy',
          hasAction: false,
          image: 'rules-image',
          isAvailable: this.isMobileBreakpoint,
        },
      ]
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
