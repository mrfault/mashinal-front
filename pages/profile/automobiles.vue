<template>
   <div class="ma-autos">
      <h2 class="ma-title--md">{{ $t('my_autos') }}</h2>
      <p class="ma-autos--subtitle">{{ $t('my_autos_desc') }}</p>
      <div v-if="!pending" class="ma-autos__content">
         <div class="ma-autos__content--item">
            <button class="ma-new-automobile__button" @click="showModal = true">
               {{ $t('add_new_auto') }}
               <icon name="plus"/>
            </button>
         </div>
         <div v-for="(item,index) in userCabinetCars" class="ma-autos__content--item">
            <automobile-card :item="item" :keyItem="index" @automobileDeleted="automobileDeleted"
                             @openEditModal="openEditModal(item)"/>
         </div>
      </div>
      <div v-if="pending" class="w-100">
         <loader/>
      </div>
      <new-automobile
         :announcement="selectedCar"
         :is-editing="isEditing"
         :showModal="showModal"
         @carAdded="getAllCars"
         @carEdited="getAllCars"
         @modalClosed="closeModal"
      />
   </div>
</template>

<script>
import AutomobileCard from "~/components/profile/automobiles/AutomobileCard";
import NewAutomobile from "~/components/profile/automobiles/NewAutomobile";


import {mapGetters} from "vuex";

export default {
   name: 'pages-automobiles',

   layout: 'garageLayout',
   head() {
      return this.$headMeta({
         title: this.$t('my_autos'),
      })
   },
   nuxtI18n: {
      paths: {
         az: '/profil/avtomobiller',
      },
   },
   components: {
      AutomobileCard,
      NewAutomobile
   },
   // async asyncData({store}) {
   //    await store.dispatch('UserCabinetCarsGetAll');
   // },
   methods: {
      async getAllCars() {
         this.pending = true
         this.$store.commit("mutate", {property: "userCabinetCars", value: []});

         for (let currentPage = 1; currentPage < 5;) {
            // setTimeout(() => {
            await this.$store.dispatch('UserCabinetCarsGetAll', currentPage);
            currentPage++
            // }, 1000)
         }
         this.pending = false;


      },
      openNewCarModal() {
         this.isEditing = false;
         this.showModal = true;
      },
      openEditModal(item) {
         this.isEditing = true;
         this.selectedCar = item;
         this.showModal = true;
      },
      closeModal() {
         this.showModal = false;
         this.isEditing = false;
      },
      automobileDeleted() {
         this.getAllCars()
         this.$nuxt.refresh();
      }
   },
   data() {
      return {
         showEditModal: false,
         selectedCar: null,
         showModal: false,
         isEditing: false,
         pending: false,
      }
   },
   computed: {
      ...mapGetters([
         'userCabinetCars'
      ])
   },
   mounted() {
      this.getAllCars();
   }

}
</script>

