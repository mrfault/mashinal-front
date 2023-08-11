<template>
   <div class="pages-announcement-edit">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <car_form isEdit :announcement="announcement" :isReady="isReady"
                             @getForm="getCarForm($event)" />
                  <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
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
import { mapGetters, mapActions } from 'vuex';

import SellLastStep from '~/components/sell/SellLastStep';
import SellPreview from '~/components/sell/SellPreview';
import Car_form from "~/components/sell/car_form.vue";
import GridItem from "~/components/announcements/GridItem.vue";

export default {
   name: 'pages-moto-announcement-edit',
   middleware: 'auth_general',
   components: {
      GridItem,
      Car_form,
      SellLastStep,
      SellPreview
   },
   nuxtI18n: {
      paths: {
         az: '/masinlar/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('your_announcements')
      });
   },
   data() {
      return {
         isReady: false
      }
   },
   async asyncData({ store, route, app }) {
      store.dispatch('setSellPreviewData', { value: {} });
      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
         store.dispatch('getAllOtherOptions'),
         store.dispatch('getPopularOptions'),
         store.dispatch('getMyAnnouncement', route.params.id)
      ]);

      const announcement = store.state.myAnnouncement;
      const catalog = announcement.car_catalog;

      return {
         lastStepKey: 0,
         form: {
            car_catalog_id: announcement.car_catalog_id,
            brand: announcement.brand.slug,
            model: announcement.model.slug,
            generation_id: catalog.generation_id,
            car_body_type: catalog.car_type.id,
            gearing: catalog.main['  ']['engine'], // engines
            modification: catalog.main[' ']['box'], // transmissions/box
            transmission: catalog.main[' ']['type_of_drive'], // gearing
            capacity: catalog.capacity,
            power: catalog.power,
            year: announcement.year,
            auction: announcement.auction,
            end_date: app.$moment(announcement.end_date).format('DD.MM.YYYY HH:mm'),
            country_id: announcement.country_id,
            youtube: {
               id: announcement.youtube_link,
               thumb: `https://img.youtube.com/vi/${announcement.youtube_link}/hqdefault.jpg`
            },
            selectedColor: announcement.colors,
            is_matte: announcement.is_matte,
            mileage: parseInt(announcement.mileage || 0),
            mileage_measure: announcement.mileage_measure || 1,
            region_id: announcement.region_id || 1,
            address: announcement.address,
            lat: parseFloat(announcement.latitude || 0),
            lng: parseFloat(announcement.longitude || 0),
            vin: announcement.vin,
            price: announcement.price_int || '',
            owner_type: parseInt(announcement.owner_type || 0),
            currency: announcement.currency_id || 1,
            car_number: announcement.car_number,
            show_car_number: announcement.show_car_number,
            show_vin: announcement.show_vin,
            part: announcement.car_body_health ? JSON.parse(announcement.car_body_health.options) : {},
            all_options: app.$clone(announcement.options),
            badges: announcement.stickers?.map(item => item.id),
            new_badges: [],
            comment: announcement.comment || '',
            is_new: announcement.is_new,
            beaten: announcement.broken,
            customs_clearance: announcement.customs_clearance,
            tradeable: announcement.exchange_possible,
            credit: announcement.credit,
            guaranty: announcement.in_garanty,
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
            { name: this.$t('my_announces'), route: `/profile/announcements` },
            { name: `#${this.announcement.id_unique}`, route: `/cars/announcement/${this.$route.params.id}` },
            { name: this.$t('edit_ad') }
         ]
      }
   },
   methods: {
      ...mapActions(['carEdit']),
      async getCarForm(form) {

         try {
            await this.carEdit({id: this.$route.params.id.slice(0, -1), isMobile: this.isMobileBreakpoint, form})
            this.$router.push(this.$localePath('/profile/announcements'))
         }catch(e){}
      },
      onClick() {
         // this.$v.form.$touch()
         // if (this.$v.authForm.$error) return;
         this.isReady = !this.isReady


      },
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
