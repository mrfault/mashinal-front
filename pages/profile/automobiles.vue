<template>
   <div class="ma-autos">
      <h2 class="ma-title--md">{{ $t('my_autos') }}</h2>
      <p class="ma-autos--subtitle">{{ $t('my_autos_desc') }}</p>
      <div class="ma-autos__content">
         <div class="ma-autos__content--item">
            <button class="ma-new-automobile__button" @click="showModal = true">
               {{ $t('add_new_auto') }}
               <icon name="plus"/>
            </button>
         </div>
         <div v-for="(item,index) in userCabinetCars" class="ma-autos__content--item">
            <automobile-card :item="item" :keyItem="index" @openEditModal="openEditModal(item)"/>
         </div>
      </div>
      <new-automobile
         :showModal="showModal"
         :announcement="selectedCar"
         :is-editing="isEditing"
         @carEdited="getAllCars"
         @carAdded="getAllCars"
         @modalClosed="closeModal"
      />
   </div>
</template>

<script>
import AutomobileCard from "~/components/profile/automobiles/AutomobileCard";
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
         this.selectedCar = null;
      },
      openNewCarModal(){
        this.isEditing = false;
        this.showModal = true;
      },
      openEditModal(item) {
         this.isEditing = true;
         this.selectedCar = item;
         this.showModal = true;

      },
      closeModal(){
         this.showModal = false;
         this.isEditing = false;
      }
   },
   data() {
      return {
         showEditModal: false,
         selectedCar: null,
         showModal: false,
         isEditing: false,
      }
   },
   computed: {
      ...mapGetters([
         'userCabinetCars'
      ])
   },

}
</script>

