<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container d-flex flex-wrap">
      <breadcrumbs :crumbs="crumbs" />
      <template v-for="(item, index) in tabs">
        <div
          class="col-12 col-md-6 col-lg-4 col-xl-3 mb-2 mb-lg-3"
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
  components: {
    'e-service-card': EServiceCard,
  },
  nuxtI18n: {
    paths: {
      az: '/e-xidmetler',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('eservices'),
    })
  },
  data() {
    return {
      tabs: [
        {
          title: this.$t('attorney'),
          description: null,
          value: 0,
          icon: 'stamp-rotated',
          url: '/garage',
          hasAction: true,
          image: 'etibarname',
          isAvailable: false,
          isAttorney: true,
          checkIfSafari: true,
        },
        {
          title: this.$t('customs_calculator'),
          description: this.$t('dollar_course'),
          value: '1 $ = 1.7₼',
          icon: 'customs-calculator-police',
          url: '/calculator/customs',
          hasAction: false,
          image: 'customs',
          isAvailable: true,
        },
        {
          title: this.$t('compulsory_insurance_calculator'),
          description: null,
          value: null,
          icon: 'compulsory-insurance-calculator',
          url: '/calculator/compulsory-insurance',
          hasAction: false,
          image: 'insurance',
          isAvailable: false,
        },
        // icon
        {
          title: this.$t('casco_insurance_calculator'),
          description: null,
          value: null,
          icon: '',
          url: '/insurance-calculator',
          hasAction: false,
          image: 'casco',
          isAvailable: false,
        },
        {
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
          title: this.$t('comparisons'),
          description: null,
          value: null,
          icon: 'comparisons',
          url: '/comparison',
          hasAction: false,
          image: 'comparisons',
          isAvailable: true,
        },
        {
          title: this.$t('create_eservice_and_shop'),
          description: null,
          value: null,
          icon: 'create-shop',
          url: '/business-profile',
          hasAction: false,
          image: 'createshop',
          isAvailable: false,
        },
        {
          title: this.$t('alcometer'),
          description: null,
          value: null,
          icon: 'alco',
          url: '/alcometer',
          hasAction: false,
          image: 'alcometer',
          isAvailable: true,
        },
        {
          title: this.$t('visual_tire_calculator'),
          description: null,
          value: null,
          icon: 'part-2',
          url: '/tiremeter',
          hasAction: false,
          image: 'car',
          isAvailable: true,
        },
        {
          title: this.$t('Get moderator ticket'),
          description: null,
          value: null,
          icon: 'customs-calculator-police',
          url: '/moderator/rand?token=645973%7C64bjaugEZHc6d49sHWuoWSvn4rseVZT1kn3fOGKx',
          hasAction: false,
          image: 'horse',
          isAvailable: true,
        },
        {
          title: this.$t('Supervisor'),
          description: null,
          value: null,
          icon: 'customs-calculator-police',
          url: '/moderator/ticket/moto?token=662042%7CWzf6CSenwnrxqyEgDoo6UOvCN5S6sFidldaDCTrK&type=moto',
          hasAction: false,
          image: 'loading_animated',
          isAvailable: true,
        },
      ],
    }
  },
  computed: {
    crumbs() {
      return [{ name: this.$t('eservices') }]
    },
  },
}
</script>

<style></style>
