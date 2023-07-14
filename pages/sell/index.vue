<template>
   <div class="add_announce">
      <div class="container">
         <h1>Yeni elan</h1>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <form-select
                     :label="$t('announcement_type')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.announce_type"
                  />
                  <form-select
                     :label="$t('type_of_motos')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     v-model="form.moto_type"
                  />
                  <form-select
                     :label="$t('type_of_commercial_vehicle')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.commercial_vehicle_type"
                  />
                  <form-select
                     :label="$t('brand_name')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.brand"
                  />
                  <form-select
                     :label="$t('model_name')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.model"
                  />
                  <form-select
                     :label="$t('prod_year')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.year"
                  />
                  <grid-radio
                     :label="$t('body_type')"
                     :items="bodyTypes"
                     v-slot="{ item }"
                  >
                     <div class="body_type_grid_item_inner">
                        <inline-svg :src="item.icon" width="104px"/>
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </grid-radio>
                  <grid-radio
                     :label="$t('generation')"
                     :items="bodyTypes"
                     v-slot="{ item }"
                  >
                     <div class="generation_grid_item">
                        <img
                           src="https://static.mashin.al/media/3896062/BMW_5_5_Sed_1.jpg"
                           alt=""
                           class="generation_img"
                        />
                        <div class="generation_grid_item_inner">
                           <p>{{ item.name[locale] }}</p>
                        </div>
                     </div>
                  </grid-radio>
                  <form-select
                     :label="$t('fuel_type')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.fuel_type"
                  />
                  <form-checkbox
                     v-model="form.autogas"
                     :disabled="false"
                     :label="$t('gas_equipment')"
                     input-name="autogas"
                     transparent
                  />
                  <toggle-group
                     :label="$t('type_of_drive')"
                     :items="gearingTypes"
                     v-slot="{ item }"
                  >
                     <div class="gearing_grid_item">
                        <inline-svg :src="item.icon"/>
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </toggle-group>
                  <form-select
                     :label="$t('box')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.gearing"
                  />
                  <form-select
                     :label="$t('modification')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.modification"
                  />
                  <form-select
                     :label="$t('color')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.color"
                  />
                  <div class="divider">
                     <form-numeric-input
                        :placeholder="$t('mileage')"
                        v-model="form.mileage"
                     />
                     <div class="mileage_types">
                        <form-radio
                           :id="'1'"
                           :label="$t('km')"
                           input-name="milage"
                           v-model="form.mileage_type"
                           radio-value="km"
                        />
                        <form-radio
                           :id="'2'"
                           :label="$t('ml')"
                           input-name="milage"
                           v-model="form.mileage_type"
                           radio-value="mile"
                        />
                     </div>
                  </div>
                  <div class="divider">
                     <form-radio
                        :id="'3'"
                        :label="$t('new')"
                        input-name="beaten"
                        v-model="form.beaten"
                        radio-value="new"
                     />
                     <form-radio
                        :id="'4'"
                        :label="$t('broken')"
                        input-name="beaten"
                        v-model="form.beaten"
                        radio-value="beaten"
                     >
                        <template v-slot:suffix>
                           <inline-svg
                              :src="'/icons/info.svg'"
                              class="beaten_suffix"
                              v-tooltip="
                      $t(
                        'with_significant_damage_to_body_elements_that_do_not_move_on_their_own'
                      )
                    "
                           />
                        </template>
                     </form-radio>
                  </div>
                  <div class="divider">
                     <form-checkbox
                        v-model="form.customs_clearance"
                        :label="$t('not_cleared2')"
                        input-name="customs_clearance"
                        transparent
                     />
                     <form-checkbox
                        v-model="form.guaranty"
                        :label="$t('guaranty')"
                        input-name="guaranty"
                        transparent
                     />
                  </div>
                  <form-select
                     :label="$t('city_of_sale')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.region_id"
                  />
                  <div class="divider">
                     <form-text-input
                        key="address"
                        v-model="form.address"
                        :placeholder="$t('address')"
                     />
                     <button
                        type="button"
                        class="btn full-width btn--blue-new-light-2"
                     >
                        <inline-svg :src="'/icons/map.svg'" class="map_btn"/>
                        {{ $t("choose_on_map") }}
                     </button>
                  </div>
                  <div class="divider">
                     <form-numeric-input
                        :placeholder="$t('price')"
                        v-model="form.price"
                     />
                     <div class="price_types">
                        <toggle-group :items="priceTypes" v-slot="{ item }">
                           <div class="price_item">
                              <p>{{ item.name[locale] }}</p>
                           </div>
                        </toggle-group>
                     </div>
                  </div>
                  <div class="divider">
                     <form-checkbox
                        v-model="form.tradeable"
                        :label="$t('tradeable')"
                        input-name="tradeable"
                        transparent
                     />
                     <form-checkbox
                        v-model="form.credit"
                        :label="$t('credit_possible')"
                        input-name="credit"
                        transparent
                     />
                  </div>
                  <div>
                     <p class="mb-1">{{ $t("license_plate_number") }}</p>
                     <div class="divider">
                        <form-text-input
                           v-model="form.car_number"
                           input-class="car-number-show-popover"
                           img-src="/icons/circled_flag.svg"
                           :mask="
                    type === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'
                  "
                           :placeholder="
                    type === 'cars' ? '__ - __ - ___' : '__ - _ - ___'
                  "
                        >
                           <template #default>
                              <inline-svg
                                 class="car_number_suffix"
                                 :src="'/icons/info.svg'"
                                 v-tooltip="$t('real-car-number-will-make-post-faster')"
                              />
                           </template>
                        </form-text-input>
                        <form-checkbox
                           v-model="form.show_car_number"
                           :label="$t('show_on_site')"
                           input-name="show_car_number"
                           transparent
                        />
                     </div>
                  </div>
                  <div>
                     <p class="mb-1">{{ $t("vin_carcase_number") }}</p>
                     <div class="divider">
                        <form-text-input
                           v-model="form.vin"
                           :placeholder="$t('vin_carcase_number')"
                        >
                           <template #default>
                              <inline-svg
                                 class="car_number_suffix"
                                 :src="'/icons/info.svg'"
                                 v-tooltip="
                        $t(
                          'with_significant_damage_to_body_elements_that_do_not_move_on_their_own'
                        )
                      "
                              />
                           </template>
                        </form-text-input>
                        <form-checkbox
                           v-model="form.show_vin"
                           :label="$t('show_on_site')"
                           input-name="show_vin"
                           transparent
                        />
                     </div>
                  </div>
                  <form-select
                     :label="$t('other_parameters')"
                     :options="
                searchMenus.map((menu) => ({
                  ...menu,
                  name: $t(menu.title),
                }))
              "
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.region_id"
                  />
                  <div class="comment">
                     <form-textarea
                        v-model="form.comment"
                        :placeholder="$t('additional_info')"
                        :maxlength="600"
                     />
                     <div class="comment_info">
                        <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
                        <p>{{ $t("additional_info_warning") }}</p>
                     </div>
                  </div>
                  <image-component :type="'cars'" :initial-form="form"/>
               </form>
               <div class="vehicle_card_info"></div>
            </div>
            <div class="form_navigation"></div>
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

export default {
   name: "add-announce",
   mixins: [MenusDataMixin],
   components: {ImageComponent, GridRadio, ToggleGroup, FormNumericInput, FormRadio},
   data() {
      return {
         bodyTypes: [
            {
               id: 1,
               name: {az: "Sedan", ru: "Sedan ru", en: "Sedan en"},
               icon: "/icons/calendar.svg",
            },
            {
               id: 2,
               name: {az: "Kupe", ru: "Kupe ru", en: "Kupe en"},
               icon: "/icons/calendar.svg",
            },
            {
               id: 3,
               name: {az: "Kabriolet", ru: "Kabriolet ru", en: "Kabriolet en"},
               icon: "/icons/calendar.svg",
            },
         ],
         gearingTypes: [
            {
               id: 1,
               name: {az: "Ön", ru: "Ön ru", en: "Ön en"},
               icon: "/icons/front-transmission.svg",
            },
            {
               id: 2,
               name: {az: "Arxa", ru: "Arxa ru", en: "Arxa en"},
               icon: "/icons/rear-transmission.svg",
            },
            {
               id: 3,
               name: {az: "Tam", ru: "Tam ru", en: "Tam en"},
               icon: "/icons/full-transmission.svg",
            },
         ],
         priceTypes: [
            {
               id: 1,
               name: {az: "AZN", ru: "AZN ru", en: "AZN en"},
            },
            {
               id: 2,
               name: {az: "USD", ru: "USD ru", en: "USD en"},
            },
            {
               id: 3,
               name: {az: "EUR", ru: "EUR ru", en: "EUR en"},
            },
         ],
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
            tradeable: "",
            credit: "",
            car_number: "",
            show_car_number: "",
            vin: "",
            show_vin: "",
            comment: "",
            saved_images: []
         },
      };
      // {"end_date":"","auction":1,"country_id":null,"car_catalog_id":46273,"brand":"bmw","model":"5-series","generation_id":4782,"car_body_type":2,"gearing":"1","modification":"2","transmission":"1","capacity":"","power":"","year":2006,"youtube":{"id":"","thumb":""},"selectedColor":[23],"is_matte":false,"mileage":287000,"mileage_measure":1,"region_id":1,"address":"","lat":0,"lng":0,"vin":"","price":20000,"owner_type":0,"currency":1,"car_number":"77 - BZ - 351","show_car_number":1,"show_vin":0,"part":{},"all_options":{"camera":true,"usb":true,"luke":true,"abs":true,"headlights":1,"c_locking":true},"comment":"test test","autogas":false,"is_new":false,"beaten":false,"customs_clearance":false,"tradeable":false,"credit":false,"guaranty":false,"saved_images":[1512580,1512581,1512582,1512583],"btl_cookie":"","is_autosalon":false}
   },
};
</script>

<style scoped lang="scss">
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

            .body_type_grid_item {
               position: relative;
               background-color: #eff4ff;
               border-radius: 8px;
               padding: 12px 12px 16px 12px;
               cursor: pointer;

               &_inner {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;

                  .check_icon {
                     position: absolute;
                     left: 16px;
                     top: 16px;
                     width: 16px;
                     height: 16px;
                     color: #155eef;
                  }
               }
            }

            .body_type_grid_item_inner {
               padding: 12px 12px 16px 12px;
            }

            .generation_grid_item {
               position: relative;
               display: flex;
               align-items: flex-end;
               aspect-ratio: 1.48;
               border-radius: 8px;
               padding: 12px 12px 16px 12px;
               cursor: pointer;
               overflow: hidden;

               &::after {
                  content: "";
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 50%;
                  background: linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0) 0%,
                        #081a3e 100%
                  );
               }

               .generation_img {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
               }

               &_inner {
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  z-index: 10;

                  p {
                     color: white;
                  }
               }
            }

            .gearing_grid_item {
               display: flex;
               align-items: center;
               gap: 8px;
               height: 52px;
               padding: 0 16px;
            }
         }

         .vehicle_card_info {
            position: sticky;
            top: 128px;
            width: 260px;
            height: 300px;
            background-color: green;
         }
      }

      .form_navigation {
         height: 300px;
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
