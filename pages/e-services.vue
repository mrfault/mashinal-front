<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container d-flex flex-wrap">
      <template  v-for="(item,index) in tabs" >
        <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-2 mb-lg-3" :key="index" v-if="item.isAvailable">
          <e-service-card :item="item"></e-service-card>

        </div>
      </template>
    </div>
  </div>
</template>

<script>
import EServiceCard from '~/components/eservices/EServiceCard.vue'
export default {
  components:{
    'e-service-card' :EServiceCard
  },
   nuxtI18n: {
    paths: {
      az: '/e-xidmetler'
    }
  },
  data(){
    return{
      tabs: [
        {
          title: this.$t('attorney'),
          description: this.$t('attorney_count'),
          value: 0,
          icon: "stamp-rotated",
          url: "/garage",
          hasAction: true,
          image: 'etibarname',
          isAvailable: true,
        },
        {
          title: this.$t("customs_calculator"),
          description: 'Dolların məzənnəsi:',
          value: '1 $ = 1.7₼',
          icon: "customs-calculator-police",
          url: "/calculator/customs",
          hasAction: false,
          image: 'customs',
          isAvailable: true
        },
        {
          title: this.$t("compulsory_insurance_calculator"),
          description: null,
          value: null,
          icon: "compulsory-insurance-calculator",
          url: "/calculator/compulsory-insurance",
          hasAction: false,
          image: 'insurance',
          isAvailable: true
        },
        // icon
        {
          title: "Kasko sığorta kalkulyatoru",
          description: null,
          value: null,
          icon: "",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'casco',
          isAvailable: false,
        },
        {
          title: this.$t("check_points"),
          description: null,
          value: null,
          icon: "receipe-manat",
          url: "/check-penalty",
          hasAction: false,
          image: 'check-penalty',
          isAvailable: true
        },
        {
          title: "Super təklif",
          description: null,
          value: null,
          icon: "hammer",
          url: "/super-offers",
          hasAction: false,
          image: 'super-offer',
          isAvailable: false,
        },
        {
          title: this.$t('helper_search'),
          description: null,
          value: null,
          icon: "helper-tab",
          url: "/cars/assistant",
          hasAction: false,
          image: 'guide',
          isAvailable: true
        },
        {
          title: this.$t('my_searches'),
          description: null,
          value: null,
          icon: "template",
          url: "/profile/templates",
          hasAction: false,
          image: 'search',
          isAvailable: true
        },
        {
          title: this.$t('fines'),
          description: null,
          value: null,
          icon: "receipe",
          url: "/garage",
          hasAction: false,
          image: 'penalties',
          isAvailable: true
        },

      ]
    }
  }
}
</script>

<style></style>
