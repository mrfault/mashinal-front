<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container d-flex flex-wrap">
      <template  v-for="(item,index) in garageServices" >
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
  components: { EServiceCard },
  data() {
    return {
      garageServices: [
        {
          title: 'Etibarnamə',
          description: 'Etibarnamələrin sayı:',
          value: 0,
          icon: 'grey-attorney',
          url: '/asd',
          hasAction: true,
          image: 'etibarname',
          isAvailable: true,
        },
        {
          title: 'Bal yoxla',
          description: null,
          value: null,
          icon: 'grey-check',
          url: '/check-penalty',
          hasAction: false,
          image: 'check-penalty',
          isAvailable: true,
        },
        {
          title: 'Elanlarım',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'announcement',
          isAvailable: true,
        },
        {
          title: 'Hesabım',
          description: 'Salon “Mashin.Al”',
          value: null,
          icon: 'grey-hammer',
          url: '/acoount',
          hasAction: false,
          image: 'super-offer',
          isAvailable: true,
        },
        {
          title: 'Cərimələr',
          description: null,
          value: null,
          icon: 'grey-penalty',
          url: '/insurance-calculator',
          hasAction: false,
          image: 'penalties',
          isAvailable: true,
        },
        {
          title: 'Balans',
          description: 'Pul kisəsinin balansı:',
          value: '10.90 ALManat',
          icon: 'grey-penalty',
          url: '/insurance-calculator',
          hasAction: false,
          image: 'wallet',
          isAvailable: true,
        },
        {
          title: 'Axtarış şablonları',
          description: null,
          value: null,
          icon: 'grey-calculator',
          url: '/insurance-calculator',
          hasAction: false,
          image: 'search',
          isAvailable: true,
        },
        {
          title: 'Bələdçi',
          description: null,
          value: null,
          icon: 'grey-guide-icon',
          url: '/insurance-calculator',
          hasAction: false,
          image: 'guide',
          isAvailable: true,
        },
        {
          title: 'Super təklif',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'super-offer',
          isAvailable: true,
        },
        {
          title: 'Hesabatlarım',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'parchment',
          isAvailable: true,
        },
        {
          title: 'İcarə avtomobillərim',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'rent-a-car',
          isAvailable: true,
        },
        {
          title: 'Salonun idarəetmə paneli',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'saloon-dashboard',
          isAvailable: true,
        },
        {
          title: 'Mağazanın idarəetmə paneli',
          description: null,
          value: null,
          icon: 'grey-hammer',
          url: '/super-offers',
          hasAction: false,
          image: 'shop-dashboard',
          isAvailable: true,
        },
      ],
    }
  },
}
</script>

<style></style>
