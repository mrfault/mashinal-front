<template>
   <div class="cars_form">

      <form-select
         :label="$t('brand_name')"
         :options="this.brands"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.brand"
         @change="onChangeBrand($event)"
      />
      <form-select
         v-if="models.length"
         :label="$t('model_name')"
         :options="models"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         v-model="form.model"
         @change="onChangeModel()"
      />
      <form-select
         v-if="sellYears.years"
         :label="$t('prod_year')"
         :options="sellYears?.years?.map((year) => ({name: year}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         v-model="form.year"
         @change="onChangeYear()"
      />
      <grid-radio
         v-if="sellBody.length"
         :label="$t('body_type')"
         :items="sellBody"
         v-slot="{ item }"
         @change="onChangeBody($event)"
      >
         <div class="body_type_grid_item_inner">
            <img :src="item.transformed_media"/>
            <p>{{ item.name[locale] }}</p>
         </div>
      </grid-radio>
      <grid-radio
         :label="$t('generation')"
         :items="priceTypes"
         v-slot="{ item }"
         @change="onChangeGeneration($event)"
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
         v-if="sellEngines.length"
         :label="$t('fuel_type')"
         :options="sellEngines.map((engine) => ({id: engine.engine, name: $t('engine_values')[engine.engine]}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :translate-options="false"
         v-model="form.fuel_type"
         @change="onChangeFuelType($event)"
      />
      <form-checkbox
         v-if="sellEngines.length"
         v-model="form.autogas"
         :disabled="false"
         :label="$t('gas_equipment')"
         input-name="autogas"
         transparent
      />
      <toggle-group
         v-if="sellGearing.length"
         :label="$t('type_of_drive')"
         :items="sellGearing.map((typeOfDrive) => ({id: typeOfDrive.type_of_drive, name: $t('type_of_drive_values')[typeOfDrive.type_of_drive]}))"
         v-slot="{ item }"
         @change="onChangeGearing($event)"
      >
         <div class="gearing_grid_item">
            <inline-svg :src="gearingIcons[item.id]"/>
            <p>{{ item.name }}</p>
         </div>
      </toggle-group>
      <form-select
         v-if="sellTransmissions.length"
         :label="$t('box')"
         :options="sellTransmissions.map((transmission) => ({id: transmission.box, name: $t('box_values')[transmission.box]}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         v-model="form.transmission"
         @change="onChangeTransmission($event)"
      />
      <form-select
         v-if="sellModifications.length"
         :label="$t('modification')"
         :options="sellModifications.map((o) => ({
              name: getModificationName(o),
              key: o.id,
            }))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         v-model="form.modification"
      />
      <template v-if="form.modification">
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
                  radio-value="ml"
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
            <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                                @change-address="updateAddress" @change-latlng="updateLatLng">
               <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address"/>
            </pick-on-map-button>
         </div>
         <div class="divider">
            <form-numeric-input
               :placeholder="$t('price')"
               v-model="form.price"
            />
            <div class="price_types">
               <toggle-group :items="priceTypes" v-slot="{ item }" @change="($event) => form.currency = $event">
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
                    // form.announce_type.title === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'
                    '99 - AA - 999'
                  "
                  :placeholder="
                    // form.announce_type.title === 'cars' ? '__ - __ - ___' : '__ - _ - ___'
                    '__ - __ - ___'
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
         <div class="comment">
            <image-component :type="'cars'" :initial-form="form"/>
            <div class="comment_info">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p>{{ $t("add_image_section_warning") }}</p>
            </div>
         </div>
         <button class="btn full-width btn--pale-green-outline mt-4 active">{{ $t("place_an_ad") }}</button>
      </template>
      <div class="contacts">
         <h2>{{ $t("contact_information") }}</h2>
         <form-text-input
            v-model="form.name"
            :placeholder="$t('your_name') + '*'"
         />
         <form-text-input
            v-model="form.email"
            :placeholder="$t('email')"
            :mask="$maskEmail()"
         />
         <form-numeric-input
            :placeholder="$t('mobile_phone_number') + '*'"
            v-model="form.phone"
         />
         <div class="contacts_info">
            <inline-svg class="contacts_info_svg" :src="'/icons/info.svg'"/>
            <p>{{ $t("contacts_registration_info") }}</p>
         </div>
         <button class="btn full-width btn--pale-green-outline active">{{ $t("enter_sms_code") }}</button>
      </div>
      <div class="comment_info">
         <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
         <p>{{ $t("by_posting_an_ad_you_confirm_your_agreement_with_the_rules") }}:
            <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`"
                       @click.native.prevent="showRules = true"
                       event="">
               <strong>{{ $t('general_rules') }}</strong>
            </nuxt-link>
         </p>
      </div>
      <modal-popup
         :modal-class="'wider'"
         :toggle="showRules"
         :title="getRulesPage.title[locale]"
         @close="showRules = false"
      >
         <div v-html="getRulesPage.text[locale]"></div>
      </modal-popup>
   </div>
</template>

<script>
import GridRadio from "~/components/elements/GridRadio.vue";
import ImageComponent from "~/pages/sell/image-component.vue";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import {ToastErrorsMixin} from "~/mixins/toast-errors";
import {mapActions, mapGetters} from "vuex";

export default {
   components: {PickOnMapButton, ToggleGroup, ImageComponent, GridRadio},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['staticPages', 'brands', 'models', 'sellYears', 'sellBody', "sellGenerations", "sellEngines", "sellGearing", "sellTransmissions", "sellModifications"]),
      getRulesPage() {
         return this.staticPages.find(page => page.id == 1);
      },
   },
   data() {
      return {
         showRules: false,
         gearingIcons: ["-", "/icons/rear-transmission.svg", "/icons/front-transmission.svg", "/icons/full-transmission.svg"],
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
            moto_type: "",
            commercial_vehicle_type: "",
            brand: "",
            model: "",
            year: "",
            body_type: "",
            generation: "",
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
            price: "",
            currency: "",
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
      }
   },
   methods: {
      ...mapActions(['getModels', 'getSellYears', 'getSellBody', 'getSellGenerations', 'getSellEngines', 'getSellGearing', 'getSellTransmissions', 'getSellModifications']),
      async onChangeBrand({slug}) {
         await this.getModels(slug);
      },
      async onChangeModel() {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         await this.getSellYears({brand, model});
      },
      async onChangeYear() {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         await this.getSellBody({brand, model, year});
      },
      async onChangeBody(body) {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         this.form.body_type = body
         await this.getSellGenerations({brand, model, year, body});
      },
      async onChangeGeneration(generation) {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         this.form.generation = 4782 //generation
         await this.getSellEngines({brand, model, year, body, generation: 4782});
      },
      async onChangeFuelType(engine) {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const generation = this.form.generation
         this.form.fuel_type = engine
         await this.getSellGearing({brand, model, year, body, generation, engine});
      },
      async onChangeGearing(gearing) {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const engine = this.form.fuel_type
         const generation = this.form.generation
         this.form.gearing = gearing
         await this.getSellTransmissions({brand, model, year, body, generation, engine, gearing});
      },
      async onChangeTransmission(transmission) {
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const engine = this.form.fuel_type
         const generation = this.form.generation
         const gearing = this.form.gearing
         await this.getSellModifications({brand, model, year, body, generation, engine, gearing, transmission});
      },
      getModificationName(o) {
         let generation = this.sellGenerations.find(
            (o) => o.id === this.form.generation
         );
         let name = `${this.$t("box_mode_values")[o.box]}/${
            generation.start_year
         } - ${generation.end_year || this.currentYear}`;
         if (o.capacity) name = `${o.capacity} ${name}`;
         if (o.power) name = `${o.power} ${this.$t("char_h_power")}/${name}`;
         if (o.complect_type) name += `/${o.complect_type}`;
         return name;
      },
      updateAddress(address) {
         this.form.address = address;
         this.removeError('address');
      },
      updateLatLng({lat, lng}) {
         this.form.lat = lat;
         this.form.lng = lng;
      },
   },
   mounted() {
      console.log(this.sellYears)
   },

   watch: {
      "form.currency"() {
         console.log(this.form)
      }
   }
}
</script>

<style lang="scss" scoped>
.cars_form {
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

   .contacts {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;

      h2 {
         margin-bottom: 24px;
      }

      &_info {
         display: flex;
         align-items: center;
         gap: 10px;
         padding: 12px 16px;
         background-color: #EEF2F6;
         border-radius: 8px;
      }
   }
}
</style>
