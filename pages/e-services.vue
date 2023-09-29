<template>
   <div class="pages-dashboard pt-2 pb-lg-5 pt-lg-0">
      <div class="container d-flex flex-wrap">
<!--         <breadcrumbs :crumbs="crumbs"/>-->

         <Cap :className="'mb-3 mt-md-3 mb-md-5'">
            <template #left>
               <h3>{{ $t('eservices2') }}</h3>
            </template>
         </Cap>

         <div class="row">
            <template v-for="(item, index) in tabs">
               <div
                  class="col-12 col-md-6 col-lg-4 col-xl-3 mb-2 mb-lg-3"
                  :key="index"
                  v-if="item.isAvailable"
               >
                  <e-service-card :item="item" />
               </div>
            </template>
         </div>
      </div>
   </div>
</template>

<script>
   import Cap from "~/components/elements/Cap.vue";
   import EServiceCard from '~/components/eservices/EServiceCard.vue'

   export default {
      components: {
         'e-service-card': EServiceCard,
         Cap
      },

      nuxtI18n: {
         paths: {
            az: '/e-xidmetler',
         }
      },

      transition: 'fade-y-20',

      head() {
         return this.$headMeta({
            title: this.$t('eservices')
         })
      },

      data() {
         return {
            tabs: [
               {
                  title: this.$t('customs_calculator'),
                  description: this.$t('customs_calculator_desc'),
                  // description: this.$t('dollar_course'),
                  value: '1 $ = 1.7₼',
                  // icon: 'customs-calculator-police',
                  url: '/calculator/customs',
                  // hasAction: false,
                  image: 'calc',
                  isAvailable: true
               },
               {
                  title: this.$t('helper_search'),
                  description: this.$t('helper_search_desc'),
                  value: null,
                  // icon: 'helper-tab',
                  url: '/cars/assistant',
                  // hasAction: false,
                  image: 'guide',
                  isAvailable: true,
               },
               {
                  title: this.$t('fines'),
                  description: this.$t('fines_desc'),
                  value: null,
                  // icon: 'receipe',
                  url: '/garage',
                  // hasAction: false,
                  image: 'fine',
                  isAvailable: true,
               },
               {
                  title: this.$t('alcometer'),
                  description: this.$t('alcometer_desc'),
                  value: null,
                  // icon: 'alco',
                  url: '/alcometer',
                  // hasAction: false,
                  image: 'breathalyzer',
                  isAvailable: true,
               },
               {
                  title: this.$t('comparisons'),
                  description: this.$t('comparisons_desc'),
                  value: null,
                  // icon: 'comparisons',
                  url: '/comparison',
                  // hasAction: false,
                  image: 'comparisons',
                  isAvailable: true,
               },
               {
                  title: this.$t('my_searches'),
                  description: this.$t('my_searches_desc'),
                  value: null,
                  // icon: 'template',
                  url: '/profile/templates',
                  // hasAction: false,
                  image: 'search-templates',
                  isAvailable: true,
               },
               {
                  title: this.$t('visual_tire_calculator'),
                  description: this.$t('visual_tire_calculator_desc'),
                  value: null,
                  // icon: 'part-2',
                  url: '/tiremeter',
                  // hasAction: false,
                  image: 'tire-calculator',
                  isAvailable: true,
               },
               {
                  title: this.$t('external_salon'),
                  description: this.$t('external_salon_desc'),
                  value: null,
                  // icon: 'part-2',
                  url: '/external-salons',
                  // hasAction: false,
                  image: 'external-salons',
                  isAvailable: true,
               },
               // {
               //    title: this.$t('shops'),
               //    description: this.$t('shops_desc'),
               //    value: null,
               //    // icon: 'part-2',
               //    url: '/parts/shops',
               //    // hasAction: false,
               //    image: 'stores',
               //    isAvailable: true,
               // },
               {
                  title: this.$t('autocatalog'),
                  description: this.$t('autocatalog_desc'),
                  value: null,
                  // icon: 'part-2',
                  url: '/catalog',
                  // hasAction: false,
                  image: 'auto-catalog',
                  isAvailable: true,
               },
               // {
               //    title: this.$t('external_salon'),
               //    description: null,
               //    value: null,
               //    icon: 'external_salon',
               //    url: '/external-salons',
               //    hasAction: false,
               //    image: 'external_salon',
               //    isAvailable: true,
               // },
               // {
               //    title: this.$t('create_eservice_and_shop'),
               //    description: null,
               //    value: null,
               //    icon: 'create-shop',
               //    url: '/business-profile',
               //    hasAction: false,
               //    image: 'createshop',
               //    isAvailable: false,
               // },
               // {
               //    title: this.$t('attorney'),
               //    description: null,
               //    value: 0,
               //    icon: 'stamp-rotated',
               //    url: '/garage',
               //    hasAction: true,
               //    image: 'etibarname',
               //    isAvailable: false,
               //    isAttorney: true,
               //    checkIfSafari: true,
               // },
               // {
               //    title: this.$t('check_points'),
               //    description: null,
               //    value: null,
               //    // icon: 'receipe-manat',
               //    url: '/check-driver-penalties',
               //    // hasAction: false,
               //    image: 'check-penalty',
               //    isAvailable: false,
               // },
               // {
               //    title: this.$t('compulsory_insurance_calculator'),
               //    description: null,
               //    value: null,
               //    icon: 'compulsory-insurance-calculator',
               //    url: '/calculator/compulsory-insurance',
               //    hasAction: false,
               //    image: 'insurance',
               //    isAvailable: false,
               // },
               // {
               //    title: this.$t('casco_insurance_calculator'),
               //    description: null,
               //    value: null,
               //    icon: '',
               //    url: '/insurance-calculator',
               //    hasAction: false,
               //    image: 'casco',
               //    isAvailable: false,
               // },
               // {
               //    title: 'Super təklif',
               //    description: null,
               //    value: null,
               //    icon: 'hammer',
               //    url: '/super-offers',
               //    hasAction: false,
               //    image: 'super-offer',
               //    isAvailable: false,
               // },
            ]
         }
      },

      computed: {
         crumbs() {
            return [{ name: this.$t('eservices') }]
         }
      }
   }
</script>
