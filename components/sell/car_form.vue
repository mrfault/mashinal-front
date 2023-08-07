<template>
   <div class="cars_form">
      <form-select
         :label="$t('brand_name')"
         :options="brands"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.brand"
         @clear="clearFields(['model', 'year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
         @change="onChangeBrand($event)"
      />
      <form-select
         v-if="form.brand && models.length"
         :label="$t('model_name')"
         :options="models"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.model"
         @clear="clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
         @change="onChangeModel()"
      />
      <form-select
         v-if="form.model && sellYears.years"
         :label="$t('prod_year')"
         :options="sellYears?.years?.map((year) => ({name: year}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         has-search
         v-model="form.year"
         @clear="clearFields(['body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
         @change="onChangeYear()"
      />
      <grid-radio
         v-if="form.year && sellBody.length"
         :label="$t('body_type')"
         :items="form.year ? sellBody : []"
         v-slot="{ item }"
         @change="onChangeBody($event)"
      >
         <div class="body_type_grid_item_inner">
            <img class="body_imgs" :src="item.transformed_media" :alt="item.name[locale]"/>
            <p>{{ item.name[locale] }}</p>
         </div>
      </grid-radio>
      <grid-radio
         v-if="form.body_type && sellGenerationsV2.length"
         :label="$t('generation')"
         :items="form.body_type ? sellGenerationsV2 : []"
         v-slot="{ item }"
         @change="onChangeGeneration($event)"
      >
         <div class="generation_grid_item">
            <img
               :src="item.image"
               :alt="item.name"
               class="generation_img"
            />
            <div class="generation_grid_item_inner">
               <p>{{ item.name }}</p>
            </div>
         </div>
      </grid-radio>
      <form-select
         v-if="form.generation && sellEngines.length"
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
         v-if="form.generation && sellEngines.length"
         v-model="form.autogas"
         :disabled="false"
         :label="$t('gas_equipment')"
         input-name="autogas"
         transparent
      />
      <toggle-group
         v-if="form.fuel_type && sellGearing.length"
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
         v-if="form.gearing && sellTransmissions.length"
         :label="$t('box')"
         :options="sellTransmissions.map((transmission) => ({id: transmission.box, name: $t('box_values')[transmission.box]}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         v-model="form.transmission"
         @change="onChangeTransmission($event)"
      />
      <form-select
         v-if="form.transmission && sellModificationsV2.length"
         :label="$t('modification')"
         :options="sellModificationsV2.map((o) => ({
              name: o.title,
              key: o.id,
            }))"
         :clear-placeholder="true"
         :clear-option="false"
         :translate-options="false"
         :new-label="false"
         v-model="form.modification"
      />
      <!--      v-if="form.modification"-->

      <template v-if="form.modification && sellModificationsV2.length">
         <form-select
            :label="$t('color')"
            :options="colors"
            :clear-placeholder="true"
            :clear-option="false"
            v-model="form.color"
            multiple
            :invalid="$v.form.color.$error"
            :limit="2"
         />
         <div class="divider">
            <form-numeric-input
               :placeholder="$t('mileage')"
               v-model="form.mileage"
               @change="announcement.mileage = $event || 0"
                  :invalid="$v.form.mileage.$error"
            />
            <div class="mileage_types">
               <form-radio
                  :id="'1'"
                  :label="$t('km')"
                  input-name="mileage"
                  v-model="form.mileage_type"
                  :radio-value="1"
               />
               <form-radio
                  :id="'2'"
                  :label="$t('ml')"
                  input-name="mileage"
                  v-model="form.mileage_type"
                  :radio-value="2"
               />
            </div>
         </div>
         <div class="divider">
            <form-radio
               :id="'3'"
               :label="$t('new')"
               input-name="is_new"
               v-model="form.is_new"
               :radio-value="1"
            />
            <form-radio
               :id="'4'"
               :label="$t('broken')"
               input-name="beaten"
               v-model="form.beaten"
               :radio-value="1"
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
            :options="sellOptions.regions"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.region_id"
            :invalid="$v.form.region_id.$error"
         />
         <div class="divider">
            <form-text-input
               key="address"
               v-model="form.address"
               :placeholder="$t('address')"
               :invalid="$v.form.address.$error"
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
               @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"
               :invalid="$v.form.price.$error"
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
               @change="announcement.tradeable = $event"
            />
            <form-checkbox
               v-model="form.credit"
               :label="$t('credit_possible')"
               input-name="credit"
               transparent
               @change="announcement.credit = $event"
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
                  @change="announcement.show_vin = $event"
                  transparent
               />
            </div>
         </div>
         <form-select
            :label="$t('other_parameters')"
            v-model="form.other_parameters"
            :options="popularOptions.map((p) => ({...p, key: $t(p.label), name: $t(p.label)}))"
            :clear-placeholder="true"
            :clear-option="false"
            object-in-value
            translate-options
            multiple
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
      </template>

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
import { required } from "vuelidate/lib/validators";
import MaxLength from "vuelidate/lib/validators/maxLength";

export default {
   components: {PickOnMapButton, ToggleGroup, ImageComponent, GridRadio},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['brands', 'models', 'sellYears', 'sellBody', "sellGenerationsV2", "sellEngines", "sellGearing", "sellTransmissions", "sellModificationsV2", "colors", "popularOptions", 'sellOptions']),
   },
   props: {
      announcement: {
         type: Object,
         required: true
      },
      isReady: {
         type: Boolean,
         default: false
      }
   },
   data() {
      return {
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
            brand: "",
            model: "",
            year: "",
            body_type: "",
            generation: "",
            fuel_type: "",
            autogas: false,
            transmission: "",
            gearing: "",
            modification: "",
            color: [],
            mileage: 0,
            mileage_type: "",
            is_new: "",
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
            other_parameters: [],
            comment: "",
            saved_images: [],
            name: "",
            email: "",
            phone: ""
         },
      }
   },
   methods: {
      ...mapActions(['getModels', 'getSellYears', 'getSellBody', 'getSellGenerationsV2', 'getSellEngines', 'getSellGearing', 'getSellTransmissions', 'getSellModificationsV2']),
      async onChangeBrand({slug}) {
         this.clearFields(['model', 'year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         this.announcement.brand = this.form.brand.name || this.$t('mark')
         if (slug) {
            await this.getModels(slug);
         }
      },
      async onChangeModel() {
         this.clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         this.announcement.model = this.form.model.name || this.$t('model')
         if (this.form.model.name) {
            await this.getSellYears({brand, model});
         }
      },
      async onChangeYear() {
         this.clearFields(['body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         this.announcement.year = this.form.year || "0000"
         if (this.form.year) {
            await this.getSellBody({brand, model, year});
         }
      },
      async onChangeBody(body) {
         this.clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         this.form.body_type = body || ""
         if (body) {
            await this.getSellGenerationsV2({brand, model, year, body});
         }
      },
      async onChangeGeneration(generation) {
         this.clearFields(['fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         this.form.generation = generation || "";
         if (generation) {
            await this.getSellEngines({brand, model, year, body, generation});
         }
      },
      async onChangeFuelType(engine) {
         this.clearFields(['transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const generation = this.form.generation
         this.form.fuel_type = engine || "";
         if (engine) {
            await this.getSellGearing({brand, model, year, body, generation, engine});
         }
      },
      async onChangeGearing(gearing) {
         this.clearFields(['gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const engine = this.form.fuel_type
         const generation = this.form.generation
         this.form.gearing = gearing.id || ""
         if (gearing.id) {
            await this.getSellTransmissions({brand, model, year, body, generation, engine, gearing: gearing.id});
         }
      },
      async onChangeTransmission(transmission) {
         this.clearFields(['modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         const engine = this.form.fuel_type
         const generation = this.form.generation
         const gearing = this.form.gearing
         if (transmission) {
            await this.getSellModificationsV2({brand, model, year, body, generation, engine, gearing, transmission});
         }
      },
      updateAddress(address) {
         this.form.address = address;
         this.removeError('address');
      },
      updateLatLng({lat, lng}) {
         this.form.lat = lat;
         this.form.lng = lng;
      },
      clearFields(keys) {
         keys.forEach((key) => {
            this.form[key] = ""
         })
      }
   },
   async fetch() {
      await Promise.all([
         this.$store.dispatch("getPopularOptions")
      ]);

   },
   watch: {
      'form.modification'() {
         this.$emit("done", !!(this.form.modification && this.sellModificationsV2.length))
      },
      "form.color"() {
         console.log(this.form.color)
      },
      isReady() {
         this.$v.form.$touch()
         const newForm = {
            brand: this.form.brand.slug,
            model: this.form.model.slug,
            generation_id: this.form.generation,
            car_body_type: this.form.body_type,
            gearing: this.form.gearing,
            modification: this.form.modification,
            transmission: this.form.transmission,
            year: this.form.year,
            mileage: this.form.mileage,
            mileage_measure: this.form.mileage_type,
            address: this.form.address,
            lat: this.form.lat,
            lng: this.form.lng,
            vin: this.form.vin,
            price: this.form.price,
            currency: this.form.currency,
            car_number: this.form.car_number,
            show_car_number: this.form.show_car_number,
            show_vin: this.form.show_vin,
            comment: this.form.comment,
            autogas: this.form.autogas,
            is_new: this.form.is_new === 1,
            beaten: this.form.beaten === 1,
            customs_clearance: this.form.customs_clearance,
            tradeable: this.form.tradeable,
            credit: this.form.credit,
            guaranty: this.form.guaranty,
            saved_images: this.form.saved_images,
            all_options: [],
            selectedColor: this.form.color,
            owner_type: 0,
            region_id: this.form.region_id
         }
         const formData = new FormData()
         formData.append('data', JSON.stringify(newForm))
         this.$emit("getForm", formData)
      },
// {"end_date":"","auction":1,"country_id":null,"car_catalog_id":46273,"brand":"bmw","model":"5-series","generation_id":4782,"car_body_type":2,"gearing":"1","modification":"2","transmission":"1","capacity":"","power":"","year":2006,"youtube":{"id":"","thumb":""},"selectedColor":[23],"is_matte":false,"mileage":400,"mileage_measure":1,"region_id":1,"address":"","lat":0,"lng":0,"vin":"QWERTYUIASDFGHJJI","price":17500,"owner_type":0,"currency":1,"car_number":"","show_car_number":0,"show_vin":0,"part":{},"all_options":{"disc_types":2,"headlights":1,"usb":true,"camera_360":true,"a_headlights":true,"r_sensor":true,"bluetooth":true,"camera":true,"conditioner":1,"salon_material":6,"p_windows":1,"h_seats":1,"side_curtain":true,"tire_pressure_sensor":true,"p_assist_system":1,"abs":true,"luke":true,"c_locking":true,"n_of_seats":5,"s_ventilation":1,"opening_trunk_without_hands":true},"comment":"test test test","autogas":true,"is_new":true,"beaten":true,"customs_clearance":true,"tradeable":true,"credit":true,"guaranty":true,"saved_images":[1512806,1512808,1512807],"btl_cookie":"","is_autosalon":false}
   },
   validations: {
      form: {
         color: {required},
         mileage: {
            required,
            maxLength: MaxLength(function () {
               return this.is_new && 500
            }),
         },
         region_id: {required},
         address: {required},
         price: {required},
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

         .body_imgs {
            width: 150px;
            height: 50px;
         }

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
</style>
