<template>
   <div class="moto_form">
      <form-select
         v-if="!isEdit"
         :label="$t('type_of_motos')"
         :options="motoOptionsV2"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.type_of_moto"
         @change="onChangeMotoType($event)"
      />
      <form-select
         v-if="!isEdit && form.type_of_moto && motoBrands.length"
         :label="$t('brand_name')"
         :options="form.type_of_moto ? motoBrands : []"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.brand"
         @change="onChangeMotoBrand($event)"
      />
      <form-select
         v-if="!isEdit && form.brand && motoModelsV2.length "
         :label="$t('model_name')"
         :options="form.brand ? motoModelsV2 : []"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.model"
         @change="onChangeMotoModel($event)"
      />
      <template v-if="isEdit || form.model && motoModelsV2.length">
         <form-select
            v-if="sellOptions.years"
            :class="{form_error: $v.form.year.$error}"
            :label="$t('prod_year')"
            :options="sellOptions?.years"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.year"
            @change="announcement.year = $event || '0000'"
            :invalid="$v.form.year.$error"
         />
         <div class="divider">
            <form-numeric-input
               :class="{form_error: $v.form.volume.$error}"
               :placeholder="$t('engine_volume2')"
               v-model="form.volume"
               @change="announcement.car_catalog.capacity = ($event / 1000).toFixed(1)"
               :invalid="$v.form.volume.$error"
            />
            <form-numeric-input
               :placeholder="$t('horse_power')"
               v-model="form.power"
            />
         </div>
         <div class="divider">
            <form-select
               :label="$t('fuel')"
               :options="motoOptions?.config?.fuel_type?.values.map((f) => ({...f, name: $t(f.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.fuel"
            />
            <form-select
               v-if="motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.length"
               :label="$t('box')"
               :options="motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, id: f.key, name: $t(f.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.box"
            />
         </div>
         <div class="divider">
            <form-select
               :class="{full_grid: !motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.length, form_error: $v.form.color.$error}"
               :label="$t('color')"
               :options="colors"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.color"
               :invalid="$v.form.color.$error"
            />

            <form-select
               v-if="motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.length"
               :label="$t('gearing')"
               :options="motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.gearing"
            />
         </div>
         <div class="divider mobile-column">
            <form-numeric-input
               :placeholder="$t('mileage')"
               :class="{form_error: $v.form.mileage.$error}"
               v-model="form.mileage"
               @change="announcement.mileage = $event ? $event  + ' ' + mileageTypeName : 0"
               :invalid="$v.form.mileage.$error"
            />
            <div class="mileage_types">
               <form-radio
                  :id="'1'"
                  :label="$t('km')"
                  input-name="milage"
                  v-model="form.mileage_type"
                  :radio-value="1"
               />
               <form-radio
                  :id="'2'"
                  :label="$t('ml')"
                  input-name="milage"
                  v-model="form.mileage_type"
                  :radio-value="2"
               />
            </div>
         </div>
         <div class="divider">
            <form-radio
               :id="'3'"
               :type="'checkbox'"
               :label="$t('new')"
               input-name="is_new"
               v-model="form.is_new"
               :radio-value="1"
            />
            <form-radio
               :id="'4'"
               :type="'checkbox'"
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
         <div class="divider mobile-column">
            <form-checkbox
               v-model="form.customs_clearance"
               :label="$t('not_cleared')"
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
            v-if="!user.autosalon"
            :class="{form_error: $v.form.region_id.$error}"
            :label="$t('city_of_sale')"
            :options="sellOptions.regions"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            has-search
            v-model="form.region_id"
            :invalid="$v.form.region_id.$error"
         />
         <div class="divider" v-if="!user.autosalon">
            <form-text-input
               key="address"
               v-model="form.address"
               :placeholder="$t('address')"
            />
            <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                                @change-address="updateAddress" @change-latlng="updateLatLng">
               <form-text-input :placeholder="$t('address')" v-model="form.address"/>
            </pick-on-map-button>
         </div>
         <div class="divider mobile-column">
            <form-numeric-input
               :placeholder="$t('price')"
               :class="{form_error: $v.form.price.$error}"
               v-model="form.price"
               @change="announcement.price = $event ? $event + ' ' + (form.currency.name?.[locale] || 'AZN') : 0"
               :invalid="$v.form.price.$error"
            />
            <div class="price_types">
               <toggle-group :items="priceTypes" v-slot="{ item }" @change="form.currency = $event.id">
                  <div class="price_item">
                     <p>{{ item.name[locale] }}</p>
                  </div>
               </toggle-group>
            </div>
         </div>
         <div class="divider mobile-column">
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
            <div class="divider mobile-column">
               <form-text-input
                  v-model="form.car_number"
                  input-class="car-number-show-popover"
                  img-src="/icons/circled_flag.svg"
                  :mask="'99 - A - 999'"
                  placeholder="__ - _ - ___"
                  class="with-trailing"
                  :class="{form_error: $v.form.car_number.$error}"
                  :invalid="$v.form.car_number.$error"
               >
                  <template #default v-if="!$v.form.car_number.$error">
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
            <div class="divider mobile-column">
               <form-text-input
                  v-model="form.vin"
                  :placeholder="$t('vin_carcase_number')"
                  :mask="$maskAlphaNumeric('*****************')"
                  class="with-trailing"
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
            :label="$t('engine_power_system')"
            :options="motoOptions?.config?.engine?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.engine"
         />
         <form-select
            :label="$t('number_of_cylinders')"
            :options="motoOptions?.config?.cylinders?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.cylinders"
         />
         <form-select
            :label="$t('number_of_vehicles')"
            :options="motoOptions?.config?.number_of_vehicles?.values.map((f) => ({...f, name: $t(f.name)}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.number_of_vehicles"
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
         <div class="comment" :class="{form_error: $v.form.saved_images.$error}">
            <image-component :type="'moto'" :initial-form="form" :announcement="announcement"/>
            <div class="comment_info">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_section_warning") }}</p>
            </div>
         </div>
      </template>
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import {ToastErrorsMixin} from "~/mixins/toast-errors";
import ImageComponent from "~/pages/sell/image-component.vue";
import {maxValue, minLength, required, requiredIf} from "vuelidate/lib/validators";

export default {
   components: {ImageComponent, PickOnMapButton, ToggleGroup},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['motoOptionsV2', 'motoBrands', 'motoModelsV2', 'sellOptions', 'colors', 'motoOptions', 'popularOptions']),
      mileageTypeName() {
         return this.form.mileage_type === 1 ? this.$t('km') : this.$t('ml')
      }
   },
   props: {
      announcement: {
         type: Object,
         required: true
      },
      isReady: {
         type: Boolean,
         default: false
      },
      isEdit: {
         type: Boolean,
         default: false
      }
   },
   data() {
      return {
         motoTypeKey: "",
         initialAnnouncement: {...this.announcement},
         priceTypes: [
            {
               id: 1,
               name: {az: "AZN", ru: "AZN"},
            },
            {
               id: 2,
               name: {az: "USD", ru: "USD"},
            },
            {
               id: 3,
               name: {az: "EUR", ru: "EUR"},
            },
         ],
         form: {
            type_of_moto: "",
            brand: "",
            model: "",
            year: "",
            volume: "",
            power: "",
            fuel: "",
            box: "",
            color: "",
            gearing: "",
            mileage: "",
            mileage_type: 1,
            is_new: false,
            beaten: false,
            customs_clearance: false,
            guaranty: false,
            region_id: 1,
            address: "",
            lng: 0,
            lat: 0,
            price: "",
            currency: 1,
            tradeable: false,
            credit: false,
            car_number: "",
            show_car_number: false,
            vin: "",
            show_vin: false,
            engine: "",
            cylinders: "",
            number_of_vehicles: "",
            comment: "",
            saved_images: []
         }
      }
   },
   watch: {
      'form.mileage_type'() {
         this.announcement.mileage = this.form.mileage ? this.form.mileage + ' ' + (this.form.mileage_type === 1 ? this.$t('km') : this.$t('ml')) : 0
      },
      'form.model'() {
         this.$emit("navigationProgress", {id: 1, status: !!this.form.model})
         this.$emit("done", !!(this.form.model && this.motoModelsV2.length))
      },
      "form.saved_images"() {
         this.$emit("navigationProgress", {id: 3, status: this.form.saved_images.length > 2})
      },
      form: {
         deep: true,
         handler() {
            const announceDescription = ['year',
               'color',
               'volume',
               'mileage',
               'car_number', 'price'].every((key) => this.form[key]) && (!this.user.autosalon ? this.form.region_id : true)
            this.$emit("navigationProgress", {id: 2, status: announceDescription})
         }
      },
      isReady() {
         this.$v.form.$touch()
         setTimeout(() => {
            this.scrollTo('.form_error', -190)
         });
         if (this.$v.form.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }
         const newForm = {
            selectedBrand: this.form.brand.id,
            selectedModel: this.form.model.id,
            selectedYear: this.form.year,
            selectedColor: this.form.color,
            box: this.form.box,
            mileage: this.form.mileage || 0,
            mileage_measure: this.form.mileage_type,
            region_id: this.form.region_id,
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
            is_new: this.form.is_new === 1,
            beaten: this.form.beaten === 1,
            customs_clearance: this.form.customs_clearance,
            tradeable: this.form.tradeable,
            credit: this.form.credit,
            guaranty: this.form.guaranty,
            saved_images: this.form.saved_images,
            drive: this.form.gearing || 0,
            fuel_type: this.form.fuel,
            owner_type: 0,
            volume: this.form.volume,
            power: this.form.power,
            engine: this.form.engine || 0,
            cylinders: this.form.cylinders || 0,
            number_of_vehicles: this.form.number_of_vehicles || 0,
            category: this.form.type_of_moto.id,
            youtube: {"id": "", "thumb": ""}
         }

         this.$emit("getForm", newForm)
      }
   },

   methods: {
      ...mapActions(['getMotoBrandsV2', 'getMotoModelsV2', 'getMotoOptions']),
      async onChangeMotoType({value}) {
         this.form.brand = "";
         this.form.model = "";
         this.clearFields(['brand', 'model', 'year'])
         if (value) {
            await this.getMotoBrandsV2({value, whereHas: 1});
         }
      },
      async onChangeMotoBrand(val) {
         this.clearFields(['model', 'year'])
         const value = this.form.type_of_moto.value;
         this.announcement.brand = this.form.brand.name || this.$t('mark')
         if (this.form.brand.name) {
            await this.getMotoModelsV2({value, id: val.id, whereHas: 1});
         }
      },
      onChangeMotoModel() {
         this.announcement.model = this.form.model.name || this.$t('model')
         this.clearFields(['year'])
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
            this.form[key] = "";
            this.announcement[key] = this.initialAnnouncement[key]
         })
      }
   },
   async fetch() {
      await this.getMotoOptions();
      await this.$store.dispatch("getPopularOptions")
   },
   mounted() {
      if (this.isEdit) {
         this.form.type_of_moto = {id: this.announcement.type_of_moto}
         this.form.year = this.announcement.year
         this.form.volume = this.announcement.capacity
         this.form.power = this.announcement.power
         this.form.fuel = this.announcement.engine_type_id
         this.form.box = this.announcement.box_id
         this.form.saved_images = this.announcement.mediaIds
         this.form.color = this.announcement.color.id
         this.form.gearing = this.announcement.gear_id
         this.form.mileage = this.announcement.mileage
         this.form.mileage_type = this.announcement.mileage_measure
         this.form.is_new = this.announcement.is_new ? 1 : 0
         this.form.beaten = this.announcement.status_id ? 1 : 0
         this.form.guaranty = this.announcement.guaranty
         this.form.region_id = this.announcement.region_id
         this.form.address = this.announcement.address
         this.form.lat = Number(this.announcement.latitude)
         this.form.lng = Number(this.announcement.longitude)
         this.form.price = this.announcement.price_int
         this.form.currency = this.announcement.currency_id
         this.form.tradeable = this.announcement.tradeable
         this.form.credit = this.announcement.credit
         this.form.car_number = this.announcement.car_number
         this.form.show_car_number = this.announcement.show_car_number
         this.form.vin = this.announcement.vin
         this.form.show_vin = this.announcement.show_vin
         this.form.customs_clearance = this.announcement.customed_id
         this.form.engine = this.announcement.engine_type_id
         this.form.cylinders = this.announcement.cylinders
         this.form.number_of_vehicles = this.announcement.tact
         this.form.comment = this.announcement.comment
      }
   },
   validations() {
      return {
         form: {
            year: {required},
            color: {required},
            volume: {required},
            mileage: {
               required: requiredIf(function () {
                  return !this.form.is_new
               }),
               maxValue: maxValue(this.form.is_new ? 500 : 10000000)
            },
            car_number: {
               required: requiredIf(function () {
                  return !this.form.vin && !this.user.external_salon
               })
            },
            price: {required},
            region_id: {
               required: requiredIf(function () {
                  return !this.user.autosalon && !this.user.external_salon
               })
            },
            country_id: {
               required: requiredIf(function () {
                  return !!this.user.external_salon
               })
            },
            saved_images: {required, minLength: minLength(3)}
         }
      }
   }
}
</script>

<style lang="scss">
.moto_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;

   .full_grid {
      grid-column: 1/3;
   }

   .with-trailing input {
      padding-right: 42px !important;
   }

   .divider {

      .mileage_types {
         display: flex;
         gap: 16px;
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

      .beaten_suffix {
         position: relative;
         z-index: 1;
         margin-left: auto;
         cursor: progress;
      }
   }

   .comment {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &_info {
         display: flex;
         align-items: center;
         gap: 10px;

         .invalid_paragraph {
            color: red
         }
      }
   }
}

@media (max-width: 485px) {
   .moto_form {
      .divider {

         .price_types {
            .toggle_container {
               gap: 8px !important;
            }

            .price_item {
               padding: 0 8px;
            }
         }
      }


   }
}
</style>
