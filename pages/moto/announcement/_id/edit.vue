<template>
   <div class="pages-announcement-edit">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <moto_form isEdit :announcement="announcement" :isReady="isReady"
                             @getForm="getMotoForm($event)"/>
                  <button type="button" class="btn full-width btn--pale-green-outline active">
                     {{ $t("place_announcement") }}
                  </button>
               </form>
               <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
                  <template>
                     <grid-item :announcement="announcement"/>
                  </template>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import SellLastStep from '~/components/sell/SellLastStep';
import SellPreview from '~/components/sell/SellPreview';
import Part_form from "~/components/sell/part_form.vue";
import Moto_form from "~/components/sell/moto_form.vue";
import GridItem from "~/components/announcements/GridItem.vue";
import Car_form from "~/components/sell/car_form.vue";
import Registration_mark from "~/components/sell/registration_mark.vue";

export default {
   name: 'pages-cars-announcement-edit',
   middleware: 'auth_general',
   components: {
      Registration_mark, Car_form, GridItem, Moto_form, Part_form,
      SellLastStep,
      SellPreview
   },
   nuxtI18n: {
      paths: {
         az: '/moto/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('your_announcements')
      });
   },
   data() {
      return {
         isReady: true
      }
   },
   async asyncData({store, route, app}) {
      store.dispatch('setSellPreviewData', {value: {}});
      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
         store.dispatch('getMotoOptions'),
         store.dispatch('getMyAnnouncement', route.params.id)
      ]);

      const announcement = store.state.myAnnouncement;

      let category;
      if (announcement.moto_brand) category = '1';
      else if (announcement.scooter_brand) category = '2';
      else if (announcement.moto_atv_brand) category = '3';

      return {
         lastStepKey: 0,
         form: {
            auction: announcement.auction,
            end_date: app.$moment(announcement.end_date).format('DD.MM.YYYY HH:mm'),
            country_id: announcement.country_id,
            category: category,
            engine: announcement.engine_type_id,
            volume: announcement.capacity || '',
            power: announcement.power,
            cylinders: announcement.cylinders,
            box: announcement.box_id,
            cylinder_placement: announcement.cylinder_type_id,
            number_of_vehicles: announcement.tact,
            drive: announcement.gear_id,
            capacity: announcement.capacity || '',
            selectedYear: announcement.year,
            youtube: {
               id: announcement.youtube,
               thumb: `https://img.youtube.com/vi/${announcement.youtube}/hqdefault.jpg`
            },
            selectedColor: announcement.color_id,
            mileage: parseInt(announcement.mileage || 0),
            mileage_measure: announcement.mileage_measure || 1,
            region_id: announcement.region_id || 1,
            address: announcement.address,
            lat: parseFloat(announcement.latitude || 0),
            lng: parseFloat(announcement.longitude || 0),
            vin: announcement.vin,
            price: announcement.price_int || '',
            owner_type: parseInt(announcement.owners || 0),
            currency: announcement.currency_id || 1,
            car_number: announcement.car_number,
            show_car_number: announcement.show_car_number,
            show_vin: announcement.show_vin,
            badges: announcement.stickers?.map(item => item.id),
            new_badges: [],
            comment: announcement.comment || '',
            is_new: announcement.is_new,
            beaten: announcement.status_id,
            customs_clearance: announcement.customed_id,
            tradeable: announcement.tradeable,
            credit: announcement.credit,
            guaranty: announcement.guaranty,
            saved_images: announcement.mediaIds
         }
      }
   },
   computed: {
      ...mapGetters({
         announcement: 'myAnnouncement'
      }),

      crumbs() {
         return [
            {name: this.$t('my_announces'), route: `/profile/announcements`},
            {name: `#${this.announcement.id_unique}`, route: `/moto/announcement/${this.$route.params.id}`},
            {name: this.$t('edit_ad')}
         ]
      }
   },
   methods: {
      getMotoForm(val) {
         console.log(val)
      }
   }
}
</script>

<style lang="scss" scoped>
.announce_container {
   display: flex;
   column-gap: 16px;

   .card {
      flex-grow: 3;
      display: flex;
      gap: 68px;

      .add_announce_form {
         display: flex;
         flex-grow: 1;
         flex-direction: column;
         gap: 20px;
      }
   }
}
</style>
