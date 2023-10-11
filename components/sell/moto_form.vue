<template>
   <div class="moto_form">
      <div class="head_section divider mobile-column">
         <div class="inner_left">
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
               v-if="!isEdit"
               :label="$t('brand_name')"
               :options="form.type_of_moto ? motoBrands : []"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :object-in-value="true"
               has-search
               v-model="form.brand"
               :disabled="!(form.type_of_moto && motoBrands.length > 0)"
               @change="onChangeMotoBrand($event)"
            />
            <form-select
               v-if="!isEdit"
               :label="$t('model_name')"
               :options="form.brand ? motoModelsV2 : []"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :object-in-value="true"
               has-search
               v-model="form.model"
               :disabled="!(form.brand && motoModelsV2.length > 0)"
               @change="onChangeMotoModel($event)"
            />
            <form-select
               v-if="sellOptions.years"
               :class="{form_error: $v.form.year.$error}"
               :label="$t('prod_year')"
               :options="sellOptions?.years"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :has-search="true"
               v-model="form.year"
               :invalid="$v.form.year.$error"
               :disabled="!isEdit && !readyAllParameters"
            />
            <form-select
               :label="$t('engine_power_system')"
               :options="motoOptions?.config?.engine?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.engine"
               :disabled="!isEdit && !readyAllParameters"
            />
            <div class="divider">
               <form-numeric-input
                  :class="{form_error: $v.form.volume.$error}"
                  :placeholder="$t('engine_volume2')"
                  v-model="form.volume"
                  :disabled="!isEdit && !readyAllParameters"
                  :invalid="$v.form.volume.$error"
               />
               <form-numeric-input
                  :placeholder="$t('horse_power')"
                  :disabled="!isEdit && !readyAllParameters"
                  v-model="form.power"
               />
            </div>
            <div class="divider" v-if="isEdit">
               <form-select
                  :label="$t('fuel')"
                  :options="motoOptions?.config?.fuel_type?.values.map((f) => ({...f, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="!isEdit && !readyAllParameters"
                  v-model="form.fuel"
               />
               <form-select
                  :label="$t('box')"
                  :options="motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, id: f.key, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="(!isEdit && !readyAllParameters) || !motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.length"
                  v-model="form.box"
               />
            </div>
            <div class="comment">
               <form-textarea
                  v-model="form.comment"
                  :placeholder="$t('additional_info')"
                  :maxlength="600"
                  :disabled="!isEdit && !readyAllParameters"
               />
               <div class="comment_info">
                  <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
                  <p>{{ $t("additional_info_warning") }}</p>
               </div>
            </div>
         </div>
         <div class="inner_right">
            <div class="divider" v-if="!isEdit">
               <form-select
                  :label="$t('fuel')"
                  :options="motoOptions?.config?.fuel_type?.values.map((f) => ({...f, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="!isEdit && !readyAllParameters"
                  v-model="form.fuel"
               />
               <form-select
                  :label="$t('box')"
                  :options="motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, id: f.key, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="(!isEdit && !readyAllParameters) || !motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.length"
                  v-model="form.box"
               />
            </div>
            <div class="divider">
               <form-select
                  :class="{form_error: $v.form.color.$error}"
                  :label="$t('color')"
                  :options="colors"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  has-search
                  v-model="form.color"
                  :disabled="!isEdit && !readyAllParameters"
                  :invalid="$v.form.color.$error"
               />

               <form-select
                  :label="$t('gearing')"
                  :options="motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="(!isEdit && !readyAllParameters) || !motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.length"
                  v-model="form.gearing"
               />
            </div>
            <div class="divider mobile-column">
               <form-select
                  :label="$t('number_of_cylinders')"
                  :options="motoOptions?.config?.cylinders?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="(!isEdit && !readyAllParameters) || form.type_of_moto?.id === 2"
                  v-model="form.cylinders"
               />
               <form-select
                  :label="$t('number_of_vehicles')"
                  :options="motoOptions?.config?.number_of_vehicles?.values.map((f) => ({...f, name: $t(f.name)}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :disabled="!isEdit && !readyAllParameters"
                  v-model="form.number_of_vehicles"
               />
               <form-numeric-input
                  :placeholder="$t('mileage')"
                  :class="{form_error: $v.form.mileage.$error}"
                  :max-value="form.is_new ? (form.mileage_type === 1 ? 500 : 310) : 10000000"
                  v-model="form.mileage"
                  :disabled="!isEdit && !readyAllParameters"
                  :invalid="$v.form.mileage.$error"
               />
               <radio-group
                  class="divider"
                  v-model="form.mileage_type"
                  :disabledAll="!isEdit && !readyAllParameters"
                  :options="[{key:1, name: 'char_kilometre'},{key:2, name: 'ml'}]"
               />
            </div>
            <div class="divider">
               <form-radio
                  :id="'3'"
                  :type="'checkbox'"
                  :label="$t('new')"
                  input-name="is_new"
                  v-model="form.is_new"
                  :radio-value="1"
                  :disabled="!isEdit && !readyAllParameters"
                  @change="onChangeIsNew"
               />
               <form-radio
                  :id="'4'"
                  :type="'checkbox'"
                  :label="$t('bitie2')"
                  input-name="beaten"
                  v-model="form.beaten"
                  :disabled="!isEdit && !readyAllParameters"
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
            <div class="divider_3" v-if="!user.external_salon">
               <form-checkbox
                  v-model="form.tradeable"
                  :label="$t('tradeable')"
                  :show-input="false"
                  :disabled="!isEdit && !readyAllParameters"
                  input-name="tradeable"
                  transparent
               />
               <form-checkbox
                  v-model="form.is_rent"
                  :label="$t('rent')"
                  :show-input="false"
                  :disabled="!isEdit && !readyAllParameters"
                  input-name="rent"
                  transparent
               />
               <form-checkbox
                  v-model="form.credit"
                  :label="$t('credit_possible')"
                  :show-input="false"
                  :disabled="!isEdit && !readyAllParameters"
                  input-name="credit"
                  transparent
               />
            </div>
            <!--            <div class="divider mobile-column">-->
            <!--               <form-checkbox-->
            <!--                  v-model="form.customs_clearance"-->
            <!--                  :label="$t('not_cleared')"-->
            <!--                  input-name="customs_clearance"-->
            <!--                  transparent-->
            <!--               />-->
            <!--               <form-checkbox-->
            <!--                  v-model="form.guaranty"-->
            <!--                  :label="$t('guaranty')"-->
            <!--                  input-name="guaranty"-->
            <!--                  transparent-->
            <!--               />-->
            <!--            </div>-->
            <div class="divider mobile-column">
               <form-numeric-input
                  :placeholder="$t('price')"
                  :class="{form_error: $v.form.price.$error}"
                  v-model="form.price"
                  :invalid="$v.form.price.$error"
                  :disabled="!isEdit && !readyAllParameters"
               />
               <div class="price_types">
                  <toggle-group :items="priceTypes" :default-value="form.currency || 1" v-slot="{ item }"
                                :disabled="!isEdit && !readyAllParameters"
                                @change="toggleCurrency">
                     <div class="price_item">
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </toggle-group>
               </div>
            </div>
            <div v-if="!user.external_salon" class="car_identification divider mobile-column">
               <div class="car_number_form">
                  <div class="registrationMarks">
                     <p class="mb-1">{{ $t("license_plate_number") }}</p>
                     <div class="registrationMarks__number">
                        <div class="registrationMarks__number-inner">
                           <div class="">
                              <img src="/icons/registrationMarks_icons.svg" alt="icons">
                           </div>
                           <div class="">
                              <form-text-input
                                 v-model="form.car_number"
                                 input-class="car-number-show-popover"
                                 :mask="'99 - A - 999'"
                                 placeholder="__ - __ - ___"
                              />
                           </div>
                        </div>
                        <span class="registrationMarks__number-description">MASHIN.AL</span>
                     </div>
                  </div>
                  <div>
                     <p class="mb-1">{{ $t("vin_carcase_number") }}</p>
                     <div class="vin">
                        <form-text-input
                           v-model="form.vin"
                           :placeholder="$t('vin_carcase_number')"
                           :mask="$maskAlphaNumeric('*****************')"
                        />
                        <form-checkbox
                           v-model="form.show_vin"
                           :label="$t('show_on_site')"
                           input-name="show_vin"
                           :disabled="!form.vin"
                           transparent
                        />
                     </div>
                  </div>
               </div>
               <div class="car_number_info divider">
                  <p>Qeydiyyat nişanın və ya BAN (VİN) nömrəni daxil etdikdə, elanınız axtarışlarda daha ön sıralarda
                     yer alacaqdır.</p>
                  <strong>
                     QEYD: Daxil etdiyiniz qeydiyyat nişanı avtomobilin həqiqiliyin təsdiq edir və saytda istifadəçilərə
                     nümayiş etdirilməyəcək!
                  </strong>
               </div>
            </div>
         </div>
      </div>


      <div class="image_section" :class="{form_error: $v.form.saved_images.$error}">
         <h2>{{ $t('photos') }}</h2>
         <client-only>
            <image-component :type="'moto'" :initial-form="form" :announcement="announcement"
                             :deletedFiles="deletedFiles"/>
         </client-only>
         <div class="image_info">
            <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
            <div class="warning_texts">
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_minmax_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_location_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_autosalon_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_user_warning") }}</p>
            </div>
         </div>
      </div>
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
import RadioGroup from "~/components/moderator/RadioGroup.vue";

export default {
   components: {RadioGroup, ImageComponent, PickOnMapButton, ToggleGroup},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['motoOptionsV2', 'motoBrands', 'motoModelsV2', 'sellOptions', 'colors', 'motoOptions', 'popularOptions']),
      readyAllParameters() {
         return this.form.model && this.motoModelsV2.length > 0
      },
      mileageTypeName() {
         return this.form.mileage_type === 1 ? this.$t('char_kilometre') : this.$t('ml')
      }
   },
   props: {
      announcement: {
         type: Object,
      },
      isReady: {
         type: Boolean,
         default: false
      },
      isEdit: {
         type: Boolean,
         default: false
      },
      region_id: {
         type: Number,
         required: true
      }
   },
   data() {
      return {
         motoTypeKey: "",
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
         deletedFiles: [],
         form: {
            type_of_moto: "",
            brand: "",
            model: "",
            year: "",
            volume: "",
            power: 0,
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
            saved_images: [],
            is_rent: false,
         }
      }
   },
   watch: {
      'form.mileage_type'() {
         if (this.form.is_new) {
            if (this.form.mileage_type === 1 && this.form.mileage > 500) {
               this.form.mileage = 500
            }
            if (this.form.mileage_type === 2 && this.form.mileage > 310) {
               this.form.mileage = 310
            }
         }
      },
      'form.car_number'() {
         !this.form.car_number && (this.form.show_car_number = false)
      },
      'form.vin'() {
         !this.form.vin && (this.form.show_vin = false)
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
            beaten: this.form.beaten,
            customs_clearance: this.form.customs_clearance,
            tradeable: this.form.tradeable,
            credit: this.form.credit,
            guaranty: this.form.guaranty,
            saved_images: this.form.saved_images,
            drive: this.form.gearing || 0,
            fuel_type: this.form.fuel || 0,
            owner_type: 0,
            volume: this.form.volume,
            power: this.form.power,
            engine: this.form.engine || 0,
            cylinders: this.form.cylinders || 0,
            number_of_vehicles: this.form.number_of_vehicles || 0,
            category: this.form.type_of_moto.id,
            youtube: {"id": "", "thumb": ""},
            is_rent: this.form.is_rent,
         }
         this.$emit("getForm", {
            form: newForm,
            deletedImages: (this.isEdit && this.deletedFiles.length) ? this.deletedFiles : []
         })
      }
   },

   methods: {
      ...mapActions(['getMotoBrandsV2', 'getMotoModelsV2', 'getMotoOptions']),
      async onChangeMotoType({value}) {
         this.form.brand = "";
         this.form.model = "";
         this.clearFields(['brand', 'model', 'year'])
         if (value) {
            await this.getMotoBrandsV2({value, whereHas: 0});
         }
      },
      async onChangeMotoBrand(val) {
         this.clearFields(['model', 'year'])
         const value = this.form.type_of_moto.value;
         if (this.form.brand.name) {
            await this.getMotoModelsV2({value, id: val.id, whereHas: 0});
         }
      },
      onChangeMotoModel() {
         this.clearFields(['year'])
      },
      onChangeIsNew(isnew) {
         if (isnew) {
            if (this.form.mileage_type === 1 && this.form.mileage > 500) {
               this.form.mileage = 500
            }
            if (this.form.mileage_type === 2 && this.form.mileage > 310) {
               this.form.mileage = 310
            }
         }
      },
      toggleCurrency(currency) {
         this.form.currency = currency.id
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
         })
      }
   },
   async fetch() {
      // await this.getMotoOptions();
      await this.$store.dispatch("getMotoOptions")
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
         this.form.is_rent = this.announcement.is_rent
         this.form.region_id = this.announcement.region_id
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
            price: {required},
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

   .head_section {
      .inner_left, .inner_right {
         display: flex;
         flex-direction: column;
         gap: 20px
      }
   }

   .image_section {
      h2 {
         margin-bottom: 20px;
      }

      .image_info {
         display: flex;
         align-items: center;
         gap: 10px;
         margin-top: 10px;
      }
   }

   .comment {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;

      .form-group {
         height: 100%;

         * {
            height: 100%;
         }
      }

      &_info {
         display: flex;
         align-items: center;
         gap: 10px;

         .invalid_paragraph {
            color: red
         }
      }
   }

   .price_types {
      .price_item {
         height: 52px;
         display: flex;
         justify-content: center;
         align-items: center;
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
