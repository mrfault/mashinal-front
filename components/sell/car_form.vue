<template>
   <div class="cars_form">
      <div class="head_section divider mobile-column">
         <div class="inner_left">
            <form-select
               v-if="!isEdit"
               :label="$t('brand_name')"
               :options="brands"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               object-in-value
               has-search
               v-model="form.brand"
               @clear="clearFields(['model', 'year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               @change="onChangeBrand($event)"
            />
            <form-select
               :label="$t('model_name')"
               :options="models"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               object-in-value
               has-search
               v-model="form.model"
               :disabled="!(form.brand && models.length > 0)"
               @clear="clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               @change="onChangeModel()"
            />
            <form-select
               :label="$t('prod_year')"
               :options="sellYears?.years?.map((year) => ({name: year}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               has-search
               v-model="form.year"
               :disabled="!(form.model && sellYears.years)"
               @clear="clearFields(['body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               @change="onChangeYear"
            />
            <form-select
               :label="$t('body_type')"
               :options="sellBody"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               has-search
               v-model="form.body_type"
               :disabled="!(form.year && sellBody.length > 0)"
               @clear="clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               @change="onChangeBody"
            />
            <form-select
               :label="$t('generation')"
               :options="sellGenerationsV2"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               has-search
               v-model="form.generation"
               :disabled="!(form.body_type && sellGenerationsV2.length > 0)"
               @clear="clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               @change="onChangeGeneration"
            />
            <div class="divider mobile-column">
               <form-select
                  :label="$t('fuel_type')"
                  :options="sellEngines.map((engine) => ({id: engine.engine, name: $t('engine_values')[engine.engine]}))"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :new-label="false"
                  :translate-options="false"
                  v-model="form.fuel_type"
                  :disabled="!(form.generation && sellEngines.length > 0)"
                  @change="onChangeFuelType"
               />
               <form-checkbox
                  v-model="form.autogas"
                  :label="$t('gas_equipment')"
                  input-name="autogas"
                  :disabled="!(form.generation && sellEngines.length > 0)"
                  transparent
               />
            </div>
            <form-select
               :label="$t('type_of_drive')"
               :options="sellGearing.map((typeOfDrive) => ({id: typeOfDrive.type_of_drive, name: $t('type_of_drive_values')[typeOfDrive.type_of_drive]}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :translate-options="false"
               v-model="form.gearing"
               :disabled="!(form.fuel_type && sellGearing.length > 0)"
               @change="onChangeGearing"
            />
            <form-select
               :label="$t('box')"
               :options="sellTransmissions.map((transmission) => ({id: transmission.box, name: $t('box_values')[transmission.box]}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.transmission"
               :disabled="!(form.gearing && sellTransmissions.length > 0)"
               @change="onChangeTransmission($event)"
            />
            <form-select
               :label="$t('modification')"
               :options="sellModificationsV2.map((o) => ({
              name: o.title,
              key: o.id,
              capacity: o.capacity
            }))"
               :clear-placeholder="true"
               :clear-option="false"
               :translate-options="false"
               object-in-value
               :new-label="false"
               :disabled="!(form.transmission && sellModificationsV2.length > 0)"
               v-model="form.modification"
            />
            <div class="divider mobile-column">
               <form-numeric-input
                  :class="{form_error: $v.form.mileage.$error}"
                  :placeholder="$t('mileage')"
                  :max-value="form.is_new ? (form.mileage_type === 1 ? 500 : 310) : 10000000"
                  v-model="form.mileage"
                  :disabled="!readyAllParameters"
                  :invalid="$v.form.mileage.$error"
               />
               <radio-group
                  class="mileage_types"
                  v-model="form.mileage_type"
                  :disabledAll="!readyAllParameters"
                  :options="[{key:1, name: 'char_kilometre'},{key:2, name: 'ml'}]"
               />
            </div>
         </div>
         <div class="inner_right">
            <div class="divider">
               <form-select
                  :class="{form_error: $v.form.color.$error}"
                  :label="$t('color')"
                  :options="colors"
                  :clear-placeholder="true"
                  :clear-option="false"
                  v-model="form.color"
                  multiple
                  :disabled="!readyAllParameters"
                  has-search
                  :invalid="$v.form.color.$error"
                  :limit="2"
               />
               <form-select
                  :label="$t('count_of_seats')"
                  :options="[{id: 1, name: 1}, {id: 2, name: 2}, {id: 3, name: 4}]"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :translate-options="false"
                  object-in-value
                  :disabled="!readyAllParameters"
                  :new-label="false"
                  v-model="form.seats_count"
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
                  :disabled="!readyAllParameters"
                  @change="onChangeIsNew"
               />
               <form-radio
                  :id="'4'"
                  :type="'checkbox'"
                  :label="$t('bitie2')"
                  input-name="beaten"
                  :disabled="!readyAllParameters"
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
            <div class="divider mobile-column" v-if="!user.external_salon">
               <form-checkbox
                  v-model="form.customs_clearance"
                  :label="$t('not_cleared')"
                  input-name="customs_clearance"
                  :disabled="!readyAllParameters"
                  transparent
               />
               <form-checkbox
                  v-model="form.guaranty"
                  :label="$t('guaranty')"
                  input-name="guaranty"
                  :disabled="!readyAllParameters"
                  transparent
               />
            </div>
            <!--            <form-select-->
            <!--               v-if="!user.autosalon && !user.external_salon"-->
            <!--               :class="{form_error: $v.form.region_id.$error}"-->
            <!--               :label="$t('city_of_sale')"-->
            <!--               :options="sellOptions.regions"-->
            <!--               :clear-placeholder="true"-->
            <!--               :clear-option="false"-->
            <!--               :new-label="false"-->
            <!--               has-search-->
            <!--               v-model="form.region_id"-->
            <!--               :invalid="$v.form.region_id.$error"-->
            <!--            />-->
            <!--            <form-select-->
            <!--               v-if="user.external_salon"-->
            <!--               :class="{form_error: $v.form.country_id.$error}"-->
            <!--               :label="$t('sale_region_country')"-->
            <!--               :options="sellOptions.countries"-->
            <!--               :clear-placeholder="true"-->
            <!--               :clear-option="false"-->
            <!--               :new-label="false"-->
            <!--               has-search-->
            <!--               v-model="form.country_id"-->
            <!--               :invalid="$v.form.country_id.$error"-->
            <!--            />-->
            <!--            <div class="divider" v-if="!user.autosalon && !user.external_salon">-->
            <!--               <form-text-input-->
            <!--                  :class="{form_error: $v.form.address.$error}"-->
            <!--                  key="address"-->
            <!--                  v-model="form.address"-->
            <!--                  :placeholder="$t('address')"-->
            <!--                  :invalid="$v.form.address.$error"-->
            <!--               />-->
            <!--               <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"-->
            <!--                                   @change-address="updateAddress" @change-latlng="updateLatLng">-->
            <!--                  <form-text-input :placeholder="$t('address')" v-model="form.address"/>-->
            <!--               </pick-on-map-button>-->
            <!--            </div>-->
            <div class="divider mobile-column">
               <form-numeric-input
                  :class="{form_error: $v.form.price.$error}"
                  :placeholder="$t('price')"
                  v-model="form.price"
                  :disabled="!readyAllParameters"
                  :invalid="$v.form.price.$error"
               />
               <div class="price_types">
                  <toggle-group :items="priceTypes" :default-value="form.currency || 1" v-slot="{ item }"

                                @change="toggleCurrency">
                     <div :class="['price_item', {price_item_disabled: !readyAllParameters}]">
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </toggle-group>
               </div>
            </div>
            <div class="divider_3" v-if="!user.external_salon">
               <form-checkbox
                  v-model="form.tradeable"
                  :label="$t('tradeable')"
                  :show-input="false"
                  :disabled="!readyAllParameters"
                  input-name="tradeable"
                  transparent
               />
               <form-checkbox
                  v-model="form.is_rent"
                  :label="$t('rent')"
                  :show-input="false"
                  :disabled="!readyAllParameters"
                  input-name="rent"
                  transparent
               />
               <form-checkbox
                  v-model="form.credit"
                  :label="$t('credit_possible')"
                  :show-input="false"
                  :disabled="!readyAllParameters"
                  input-name="credit"
                  transparent
               />
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
                                 :class="{form_error: $v.form.car_number.$error}"
                                 v-model="form.car_number"
                                 input-class="car-number-show-popover"
                                 :mask="'99 - AA - 999'"
                                 placeholder="__ - __ - ___"
                                 :invalid="$v.form.car_number.$error"
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
                           :class="{form_error: $v.form.vin.$error}"
                           v-model="form.vin"
                           :placeholder="$t('vin_carcase_number')"
                           :mask="$maskAlphaNumeric('*****************')"
                           :invalid="$v.form.vin.$error"
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
      <div class="car_description_section">
         <h2>Avtomobilin təchizatı</h2>
         <div class="divider mobile-column">

            <div class="other_parameters_wrapper">
               <div class="other_parameters">
                  <div class="other_parameters__checkbox" v-for="check in otherParameters">
                     <form-checkbox
                        :id="check.slug"
                        :value="other_parameters_checkboxes[check.slug]"
                        @getIdValue="changeOtherParameters"
                        :label="check.name"
                        :input-name="check.slug"
                        transparent
                     />
                  </div>
               </div>
            </div>
            <!--         <form-select-->
            <!--            :label="$t('other_parameters')"-->
            <!--            v-model="form.other_parameters"-->
            <!--            :options="otherParameters"-->
            <!--            :clear-placeholder="true"-->
            <!--            :clear-option="false"-->
            <!--            object-in-value-->
            <!--            translate-options-->
            <!--            multiple-->
            <!--         />-->
            <div class="comment">
               <form-textarea
                  v-model="form.comment"
                  :placeholder="$t('additional_info')"
                  :maxlength="600"
               />
            </div>
         </div>
         <div class="comment_info">
            <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
            <p>{{ $t("additional_info_warning") }}</p>
         </div>
      </div>
      <div class="image_section" :class="{form_error: $v.form.saved_images.$error}">
         <h2>Şəkillər</h2>
         <client-only>
            <image-component :type="'cars'" :initial-form="form" :announcement="announcement"
                             :deletedFiles="deletedFiles"/>
         </client-only>
         <div class="image_info">
            <inline-svg :src="'/icons/info.svg'"/>
            <div class="warning_texts">
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_section_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_max_warning") }}</p>
            </div>
         </div>
      </div>


      <template v-if="form.modification && sellModificationsV2.length">


         <div class="divider" v-if="user.external_salon">
            <form-radio
               :id="'5'"
               :label="$t('auction')"
               input-name="auction"
               v-model="form.auction"
               :radio-value="1"
            />
            <form-radio
               :id="'6'"
               :label="$t('sell')"
               input-name="auction"
               v-model="form.auction"
               :radio-value="0"
            />
         </div>
         <form-text-input
            v-if="user.external_salon && form.auction === 1"
            @change="removeError('end_date')"
            date-type="datetime"
            value-type="datetime"
            date-format="DD.MM.YYYY HH:00"
            v-model="form.end_date"
            :placeholder="$t('announcement_end_date')"
            input-date
         />

         <!--         <div v-if="!user.external_salon">-->
         <!--            <p class="mb-1">{{ $t("license_plate_number") }}</p>-->
         <!--            <div class="divider mobile-column">-->
         <!--               <form-text-input-->
         <!--                  :class="{form_error: $v.form.car_number.$error}"-->
         <!--                  v-model="form.car_number"-->
         <!--                  input-class="car-number-show-popover"-->
         <!--                  img-src="/icons/circled_flag.svg"-->
         <!--                  :mask="'99 - AA - 999'"-->
         <!--                  placeholder="__ - __ - ___"-->
         <!--                  :invalid="$v.form.car_number.$error"-->
         <!--               />-->
         <!--               <form-checkbox-->
         <!--                  v-model="form.show_car_number"-->
         <!--                  :label="$t('show_on_site')"-->
         <!--                  input-name="show_car_number"-->
         <!--                  :disabled="!form.car_number"-->
         <!--                  transparent-->
         <!--               />-->
         <!--            </div>-->
         <!--         </div>-->


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
import {maxLength, maxValue, minLength, required, requiredIf} from "vuelidate/lib/validators";
import MaxLength from "vuelidate/lib/validators/maxLength";
import RadioGroup from "~/components/moderator/RadioGroup.vue";

export default {
   components: {RadioGroup, PickOnMapButton, ToggleGroup, ImageComponent, GridRadio},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['brands', 'models', 'sellYears', 'sellBody', "sellGenerationsV2", "sellEngines", "sellGearing", "sellTransmissions", "sellModificationsV2", "colors", "popularOptions", 'sellOptions']),
      readyAllParameters() {
         return this.form.modification && this.sellModificationsV2.length > 0
      },
      otherParameters() {
         let list = this.popularOptions.map((p) => ({
            ...p,
            key: this.$t(p.label),
            selected: false,
            slug: p.name,
            name: this.$t(p.label)
         }))
         list.forEach((p) => {
            this.other_parameters_checkboxes[p.slug] = false
         })
         return list
      },
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
         gearingIcons: ["-", "/icons/rear-transmission.svg", "/icons/front-transmission.svg", "/icons/full-transmission.svg"],
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
         other_parameters_checkboxes: {},
         deletedFiles: [],
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
            seats_count: null,
            mileage: '',
            mileage_type: 1,
            is_new: false,
            beaten: false,
            customs_clearance: false,
            guaranty: false,
            address: "",
            lat: 0,
            lng: 0,
            price: "",
            currency: 1,
            tradeable: false,
            is_rent: false,
            credit: false,
            car_number: "",
            vin: "",
            show_vin: false,
            other_parameters: [],
            comment: "",
            saved_images: [],
            name: "",
            email: "",
            phone: "",
            country_id: "",
            auction: 1,
            end_date: "",
         },
      }
   },
   methods: {
      ...mapActions(['getModels', 'getSellYears', 'getSellBody', 'getSellGenerationsV2', 'getSellEngines', 'getSellGearing', 'getSellTransmissions', 'getSellModificationsV2']),

      async onChangeBrand({slug}) {
         this.clearFields(['model', 'year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         if (slug) {
            await this.getModels(slug);
         }
      },
      async onChangeModel() {
         this.clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         if (brand && this.form.model.name) {
            try {
               await this.getSellYears({brand, model});
            } catch (e) {
            }
            if (this.sellYears.years.length === 1) {
               this.form.year = this.sellYears.years[0]
               await this.onChangeYear()
            }
         }
      },
      async onChangeYear() {
         this.clearFields(['body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         if (brand && model && this.form.year) {
            try {
               await this.getSellBody({brand, model, year});
            } catch (e) {
            }
            if (this.sellBody.length === 1) {
               this.form.body_type = this.sellBody[0].id
               await this.onChangeBody(this.sellBody[0].id)
            }
         }
      },
      async onChangeBody(body) {
         this.clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         if (brand && model && year && body) {
            try {
               await this.getSellGenerationsV2({brand, model, year, body});
            } catch (e) {
            }
            if (this.sellGenerationsV2.length === 1) {
               this.form.generation = this.sellGenerationsV2[0].id
               await this.onChangeGeneration(this.sellGenerationsV2[0].id)
            }
         }
      },
      async onChangeGeneration(generation) {
         this.clearFields(['fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         const year = this.form.year
         const body = this.form.body_type
         if (brand && model && year && body && generation) {
            try {
               await this.getSellEngines({brand, model, year, body, generation});
            } catch (e) {
            }
            if (this.sellEngines.length === 1) {
               this.form.fuel_type = this.sellEngines[0].engine
               await this.onChangeFuelType(this.sellEngines[0].engine)
            }
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
         if (brand && model && year && body && generation && engine) {
            try {
               await this.getSellGearing({brand, model, year, body, generation, engine});
            } catch (e) {
            }
            if (this.sellGearing.length === 1) {
               this.form.gearing = this.sellGearing[0].type_of_drive
               await this.onChangeGearing({id: this.sellGearing[0].type_of_drive})
            }
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
         if (brand && model && year && body && generation && engine && gearing.id) {
            try {
               await this.getSellTransmissions({brand, model, year, body, generation, engine, gearing: gearing.id});
            } catch (e) {
            }
            if (this.sellTransmissions.length === 1) {
               this.form.transmission = this.sellTransmissions[0].box
               await this.onChangeTransmission(this.sellTransmissions[0].box)
            }
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
         if (brand && model && year && body && generation && engine && gearing && transmission) {
            try {
               await this.getSellModificationsV2({brand, model, year, body, generation, engine, gearing, transmission});
            } catch (e) {
            }
            if (this.sellModificationsV2.length === 1) {
               this.form.modification = this.sellModificationsV2.map((o) => ({
                  name: o.title,
                  key: o.id,
                  capacity: o.capacity
               }))[0]
            }
         }
      },
      changeOtherParameters(val) {
         this.other_parameters_checkboxes[val.id] = val.value
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
            this.form[key] = ""
         })
      },
   },
   mounted() {
      if (this.isEdit) {
         this.form.brand = this.announcement.brand
         this.form.model = this.announcement.model
         this.form.generation = this.announcement.generation.id
         this.form.year = this.announcement.year
         this.form.saved_images = this.announcement.mediaIds
         this.form.color = this.announcement.colors
         this.form.is_matte = this.announcement.is_matte
         this.form.gearing = this.announcement.gear_id
         this.form.mileage = this.announcement.mileage
         this.form.mileage_type = this.announcement.mileage_measure
         this.form.is_new = this.announcement.is_new ? 1 : 0
         this.form.beaten = this.announcement.broken ? 1 : 0
         this.form.guaranty = this.announcement.in_garanty
         this.form.address = this.announcement.address
         this.form.lat = Number(this.announcement.latitude)
         this.form.lng = Number(this.announcement.longitude)
         this.form.price = this.announcement.price_int
         this.form.currency = this.announcement.currency_id
         this.form.tradeable = this.announcement.exchange_possible
         this.form.credit = this.announcement.credit
         this.form.car_number = this.announcement.car_number
         this.form.vin = this.announcement.vin
         this.form.show_vin = this.announcement.show_vin
         this.form.customs_clearance = this.announcement.customs_clearance
         this.form.number_of_vehicles = this.announcement.tact
         this.form.comment = this.announcement.comment
         this.form.other_parameters = this.popularOptions.filter((option) => Object.keys(this.announcement.options).includes(option.name)).map((p) => ({
            ...p,
            key: this.$t(p.label),
            slug: p.name,
            name: this.$t(p.label)
         }))
      }
   },
   async fetch() {
      await Promise.all([
         this.$store.dispatch("getPopularOptions")
      ]);

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
         let newForm = {
            brand: this.form.brand.slug,
            model: this.form.model.slug,
            generation_id: this.form.generation,
            car_body_type: this.form.body_type,
            gearing: this.form.gearing,
            car_catalog_id: this.form.modification.key,
            transmission: this.form.transmission,
            year: this.form.year,
            mileage: this.form.mileage || 0,
            mileage_measure: this.form.mileage_type,
            vin: this.form.vin,
            price: this.form.price,
            currency: this.form.currency,
            car_number: this.form.car_number,
            show_vin: this.form.show_vin,
            comment: this.form.comment,
            autogas: this.form.autogas,
            is_new: this.form.is_new ? 1 : 0,
            beaten: this.form.beaten,
            customs_clearance: this.form.customs_clearance,
            tradeable: this.form.tradeable,
            credit: this.form.credit,
            guaranty: this.form.guaranty,
            seats_count: this.form.seats_count,
            is_rent: this.form.is_rent,
            saved_images: this.form.saved_images,
            all_options: this.form.other_parameters.reduce((acc, curr) => {
               acc[curr.slug] = curr.selected_key ? curr.selected_key : true;
               return acc;
            }, {}),
            selectedColor: this.form.color,
            owner_type: 0,
            youtube: {"id": "0", "thumb": ""}
         }

         if (this.user.external_salon) {
            newForm = {
               ...newForm, country_id: this.form.country_id,
               auction: this.form.auction,
               end_date: this.form.end_date
            }
         } else {
            newForm = {...newForm, region_id: this.region_id}
         }

         this.$emit("getForm", {
            form: newForm,
            deletedImages: (this.isEdit && this.deletedFiles.length) ? this.deletedFiles : []
         })
      },
   },
   validations() {
      return {
         form: {
            color: {required},
            mileage: {
               required: requiredIf(function () {
                  return !this.form.is_new
               }),
               maxValue: maxValue(this.form.is_new ? 500 : 10000000)
            },
            car_number: {
               required: requiredIf(function () {
                  return !this.form.vin && (!this.user.external_salon && !this.user.autosalon)
               })
            },
            country_id: {
               required: requiredIf(function () {
                  return !!this.user.external_salon
               })
            },
            vin: {
               required: requiredIf(function () {
                  return (!this.user.external_salon && !this.user.autosalon) && this.form.customs_clearance
               })

            },
            price: {required},
            saved_images: {required, minLength: minLength(3)}
         }
      }
   }

}
</script>

<style lang="scss">
.cars_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;

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

   .car_description_section {
      h2 {
         margin-bottom: 20px;
      }

      .other_parameters_wrapper {
         display: flex;
         flex-direction: column;
         gap: 20px;

         .other_parameters {
            display: flex;
            flex-wrap: wrap;
            column-gap: 12px;
            row-gap: 10px;
            border-radius: 8px;
            border: 1px solid #CDD5DF;
            padding: 20px;

            &__checkbox {
               width: calc(50% - 8px);

               .checkbox-input label {
                  border: unset;
                  padding: unset;
                  font-size: 16px;
                  font-weight: 400;
                  height: unset;
               }
            }
         }
      }

      .comment {
         display: flex;
         flex-direction: column;
         gap: 16px;

         * {
            height: 100%;
         }
      }

      .comment_info {
         width: calc(50% - 8px);
         display: flex;
         margin-top: 8px;
         margin-left: auto;
         align-items: center;
         gap: 10px;
         font-size: 14px;

         svg {
            max-width: 18px;
            max-height: 18px;
            min-width: 18px;
            min-height: 18px;
         }

         .invalid_paragraph {
            color: red
         }
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
            width: 100%;
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
         z-index: 1;

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

   .full_grid {
      grid-column: 1/3;
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

            &_disabled {
               pointer-events: none;
               border-color: #cdd5df;
               opacity: 0.4;
            }
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


}

@media (max-width: 1150px) {
   .cars_form {
      .car_description_section {
         .comment {
            textarea {
               height: 250px;
            }
         }

         .comment_info {
            width: 100%;
         }
      }
   }
}


.dark-mode {
   .cars_form {
      .body_type_grid_item {

         &_inner {

            .body_imgs {
               filter: invert(48%) sepia(15%) saturate(490%) hue-rotate(176deg) brightness(90%) contrast(83%);
            }
         }
      }
   }
}
</style>
