<template>
   <div class="ma-autos">
      <h2 class="ma-title--md">{{ $t('my_autos') }}</h2>
      <p class="ma-autos--subtitle">{{ $t('my_autos_desc') }}</p>
      <div class="ma-autos__content">
         <div class="ma-autos__content--item">
            <new-automobile @carAdded="getAllCars"/>
         </div>
         <div v-for="(item,index) in userCabinetCars" class="ma-autos__content--item">
            <automobile-card :item="item" :keyItem="index"/>
         </div>
      </div>
   </div>
</template>

<script>
import AutomobileCard from "~/components/profile/Automobiles/AutomobileCard";
import NewAutomobile from "~/components/profile/automobiles/NewAutomobile";


import {mapGetters} from "vuex";

export default {
   layout: 'garageLayout',
   components: {
      AutomobileCard,
      NewAutomobile
   },
   async asyncData({store}) {
      await store.dispatch('UserCabinetCarsGetAll');
   },
   methods: {
      async getAllCars() {
         await this.$store.dispatch('UserCabinetCarsGetAll');
      }
   },
   computed: {
      ...mapGetters([
         'userCabinetCars'
      ])
   },

}
</script>

<style lang="scss">
.ma-autos {
   margin-bottom: 150px;
   .ma-title--md {
      padding: 10px 10px 20px 10px;
   }

   &--subtitle {
      padding: 10px 10px 20px 10px;
      font: 400 16px/26px 'TTHoves';
      color: rgba(27, 36, 52, 1);

   }

   &__content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      &--item {
         width: 50%;
         padding: 10px;
      }
   }
}

@media(max-width: 599px) {
   .ma-autos {
      .ma-title--md {
         padding: 10px 10px 20px 10px;
      }

      &--subtitle {
         padding: 10px 10px 20px 10px;
         font: 400 16px/26px 'TTHoves';
      }

      &__content {
         width: 100%;
         display: flex;
         flex-wrap: wrap;

         &--item {
            width: 100%;
            padding: 10px;
         }
      }
   }
}

.dark-mode{
   .ma-autos {
      .ma-title--md {
         color: #fff;
      }

      &--subtitle {
         color: #fff;
      }

      &__content {

         &--item {

         }
      }
   }
}
</style>
