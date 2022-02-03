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
  data(){
    return{
      tabs: [
        {
          title: "Etibarnamə",
          description: 'Etibarnamələrin sayı:',
          value: 0,
          icon: "stamp-rotated",
          url: "/asd",
          hasAction: true,
          image: 'etibarname',
          isAvailable: true
        },
        // icon 
        {
          title: "Gömrük rüsumu kalkulyatoru",
          description: 'Dolların məzənnəsi:',
          value: '1 $ = 1.7₼',
          icon: "",
          url: "/calculator/customs",
          hasAction: false,
          image: 'customs',
          isAvailable: true
        },
        // icon
        {
          title: "İcbari sığorta kalkulyatoru",
          description: null,
          value: null,
          icon: "",
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
          title: "Bal yoxla",
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
          title: "Bələdçi",
          description: null,
          value: null,
          icon: "helper-tab",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'guide',
          isAvailable: true
        },
        {
          title: "Axtarış şablonları",
          description: null,
          value: null,
          icon: "template",
          url: "/insurance-calculator",
          hasAction: false,
          image: 'search',
          isAvailable: true
        },
        {
          title: "Cərimələr",
          description: null,
          value: null,
          icon: "receipe",
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
