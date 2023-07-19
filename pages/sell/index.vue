<template>
   <div class="add_announce">
      <div class="container">
         <h1>Yeni elan</h1>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <div class="add_announce_info">
                     <inline-svg
                        :src="'/icons/stars.svg'"
                        class="add_announce_info_svg"
                     />
                     <p v-html="$t('add_announce_info')"/>
                  </div>
                  <div class="mobile_info">
                     <inline-svg
                        :src="'/icons/mobile_2.svg'"
                        class="mobile_info_svg"
                     />
                     <p v-html="$t('mobile_info', {phone: '+' + user.phone})"/>
                  </div>
                  <form-select
                     :label="$t('announcement_type')"
                     :options="searchMenus.map((menu) => ({...menu,name: $t(menu.title)}))"
                     @change="handleAnnounceType($event)"
                     :objectInValue="true"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.announce_type"
                  />
<!--                  <form-select-->
<!--                     :label="$t('type_of_motos')"-->
<!--                     :options="-->
<!--                searchMenus.map((menu) => ({-->
<!--                  ...menu,-->
<!--                  name: $t(menu.title),-->
<!--                }))-->
<!--              "-->
<!--                     :clear-placeholder="true"-->
<!--                     :clear-option="false"-->
<!--                     v-model="form.moto_type"-->
<!--                  />-->
<!--                  <form-select-->
<!--                     :label="$t('type_of_commercial_vehicle')"-->
<!--                     :options="-->
<!--                searchMenus.map((menu) => ({-->
<!--                  ...menu,-->
<!--                  name: $t(menu.title),-->
<!--                }))-->
<!--              "-->
<!--                     :clear-placeholder="true"-->
<!--                     :clear-option="false"-->
<!--                     :new-label="false"-->
<!--                     v-model="form.commercial_vehicle_type"-->
<!--                  />-->

<car_form />
               </form>
               <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
                  <grid-item :announcement="announcement" />
               </div>
            </div>
            <div class="form_navigation" v-if="!isMobileBreakpoint"></div>
         </div>
      </div>

   </div>
</template>

<script>
import GridRadio from "~/components/elements/GridRadio.vue";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import FormNumericInput from "~/components/forms/FormNumericInput.vue";
import FormRadio from "~/components/forms/FormRadio.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import ImageComponent from "~/pages/sell/image-component.vue";
import {mapGetters} from "vuex";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import GridItem from "~/components/announcements/GridItem.vue";
import Car_form from "~/components/sell/car_form.vue";

export default {
   name: "add-announce",
   mixins: [MenusDataMixin, ToastErrorsMixin],
   components: {Car_form, GridItem, PickOnMapButton, ImageComponent, GridRadio, ToggleGroup, FormNumericInput, FormRadio},
   data() {
      return {
         announcement: {
            show_vin: true,
            has_360: true,
            price: "48000",
            tradeable: true,
            credit: true,
            brand: "BMW",
            model: "5 series",
            year: 2006,
            mileage: 287000,
            car_catalog: {capacity: "3.0"},
            created_at: "19, July"
         },
         form: {
            announce_type: "",
            moto_type: "",
            commercial_vehicle_type: "",
            brand: "",
            model: "",
            year: "",
            body_type: "",
            fuel_type: "",
            autogas: "",
            transmission: "",
            gearing: "",
            modification: "",
            color: "",
            mileage: 0,
            mileage_type: "",
            beaten: "",
            customs_clearance: "",
            guaranty: "",
            region_id: "",
            address: "",
            lat: 0,
            lng: 0,
            tradeable: "",
            credit: "",
            car_number: "",
            show_car_number: "",
            vin: "",
            show_vin: "",
            comment: "",
            saved_images: [],
            name: "",
            email: "",
            phone: ""
         },
      };
      // {"end_date":"","auction":1,"country_id":null,"car_catalog_id":46273,"brand":"bmw","model":"5-series","generation_id":4782,"car_body_type":2,"gearing":"1","modification":"2","transmission":"1","capacity":"","power":"","year":2006,"youtube":{"id":"","thumb":""},"selectedColor":[23],"is_matte":false,"mileage":287000,"mileage_measure":1,"region_id":1,"address":"","lat":0,"lng":0,"vin":"","price":20000,"owner_type":0,"currency":1,"car_number":"77 - BZ - 351","show_car_number":1,"show_vin":0,"part":{},"all_options":{"camera":true,"usb":true,"luke":true,"abs":true,"headlights":1,"c_locking":true},"comment":"test test","autogas":false,"is_new":false,"beaten":false,"customs_clearance":false,"tradeable":false,"credit":false,"guaranty":false,"saved_images":[1512580,1512581,1512582,1512583],"btl_cookie":"","is_autosalon":false}
   },
   methods: {
      async handleAnnounceType(payload) {
         await this.$store.dispatch(payload.api_key)
      },
   },
};
</script>

<style lang="scss">
.add_announce {
   .btn {
      height: 52px;
   }

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

            .add_announce_info {
               display: flex;
               align-items: center;
               padding: 16px;
               gap: 12px;
               background-color: #EEF2F6;
               border-radius: 12px;

               &_svg {
                  min-width: 32px;
                  min-height: 32px;
                  color: #155EEF;
               }
            }

            .mobile_info {
               display: flex;
               align-items: center;
               padding: 16px;
               gap: 12px;
               background-color: #ECFDF3;
               border-radius: 12px;

               &_svg {
                  min-width: 32px;
                  min-height: 32px;
                  color: #12B76A;
               }

               p {
                  color: #12B76A;

                  strong {
                     color: #081A3E;
                  }
               }
            }


         }

         .vehicle_card_info {
            position: sticky;
            top: 128px;
            width: 260px;
            height: 300px;
            min-width: 200px;
            background-color: green;
         }
      }

      .form_navigation {
         height: 300px;
         min-width: 300px;
         background-color: red;
         flex-grow: 1;
      }

      .divider {
         display: grid;
         grid-template-columns: repeat(2, 1fr);
         gap: 16px;

         .mileage_types {
            display: flex;
            gap: 16px;
         }

         .map_btn {
            width: 24px;
            height: 24px;
            color: #155eef;
         }

         .price_types {
            .price_item {
               display: flex;
               align-items: center;
               justify-content: center;
               height: 52px;
               padding: 0 16px;
            }
         }

         .car_number_suffix {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 16px;
         }
      }

      .beaten_suffix {
         position: relative;
         z-index: 1;
         margin-left: auto;
         cursor: progress;
      }

      .comment {
         &_info {
            display: flex;
            margin-top: 12px;
            align-items: center;
            gap: 10px;
         }
      }
   }
}

@media (max-width: 1150px) {
   .form_navigation {
      display: none;
   }
}
</style>
