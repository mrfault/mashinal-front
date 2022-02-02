<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container d-flex flex-wrap">
      <template  v-for="(item,index) in tabs" >
        <div class="col-lg-3 mb-2 mb-lg-3" :key="index" v-if="item.isAvailable">
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
  data(){
    return{
      tabs: [
        {
          title: "Etibarnamə",
          description: 'Etibarnamələrin sayı:',
          value: 0,
          icon: "grey-attorney",
          url: "/asd",
          hasAction: true,
          image: 'etibarname',
          isAvailable: true
        },
        {
          title: "Gömrük rüsumu kalkulyatoru",
          description: 'Dolların məzənnəsi:',
          value: '1 $ = 1.7₼',
          icon: "grey-Customs-Officer",
          url: "/calculator/customs",
          hasAction: false,
          image: 'customs',
          isAvailable: true
        },
        {
          title: "İcbari sığorta kalkulyatoru",
          description: null,
          value: null,
          icon: "grey-insurance-icon",
          url: "/calculator/compulsory-insurance",
          hasAction: false,
          image: 'insurance',
          isAvailable: true
        },
        {
          title: "Kasko sığorta kalkulyatoru",
          description: null,
          value: null,
          icon: "grey-calculator",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'casco',
          isAvailable: false,
        },
        {
          title: "Bal yoxla",
          description: null,
          value: null,
          icon: "grey-check",
          url: "/check-penalty",
          hasAction: false,
          image: 'check-penalty',
          isAvailable: true
        },
        {
          title: "Super təklif",
          description: null,
          value: null,
          icon: "grey-hammer",
          url: "/super-offers",
          hasAction: false,
          image: 'super-offer',
          isAvailable: false,
        },
        {
          title: "Bələdçi",
          description: null,
          value: null,
          icon: "grey-guide-icon",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'guide',
          isAvailable: true
        },
        {
          title: "Axtarış şablonları",
          description: null,
          value: null,
          icon: "grey-calculator",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'search',
          isAvailable: true
        },
        {
          title: "Cərimələr",
          description: null,
          value: null,
          icon: "grey-penalty",
          url: "/insurance-calculator",
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
