<template>
   <div class="cars_form">
      <div class="head_section divider mobile-column">
         <div class="inner_left">
            <template v-if="!isEdit">
               <form-select
                  v-model="form.brand"
                  :class="{form_error: $v.form.brand.$error}"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :invalid="$v.form.brand.$error"
                  :label="$t('brand_name')"
                  :new-label="false"
                  :options="brands"
                  has-search
                  object-in-value
                  @change="onChangeBrand($event)"
                  @clear="clearFields(['model', 'year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               />

               <form-select
                  v-model="form.model"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.brand && models.length > 0)"
                  :label="$t('model_name')"
                  :new-label="false"
                  :options="models"
                  has-search
                  object-in-value
                  @change="onChangeModel()"
                  @clear="clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               />
               <form-select
                  v-model="form.year"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.model && sellYears.years)"
                  :label="$t('prod_year')"
                  :new-label="false"
                  :options="sellYears?.years?.map((year) => ({name: year}))"
                  has-search
                  @change="onChangeYear"
                  @clear="clearFields(['body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               />
               <form-select
                  v-model="form.body_type"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.year && sellBody.length > 0)"
                  :label="$t('body_type')"
                  :new-label="false"
                  :options="sellBody"
                  has-search
                  @change="onChangeBody"
                  @clear="clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               />
               <form-select
                  v-model="form.generation"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.body_type && sellGenerationsV2.length > 0)"
                  :label="$t('generation')"
                  :new-label="false"
                  :options="sellGenerationsV2"
                  has-search
                  @change="onChangeGeneration"
                  @clear="clearFields(['generation', 'fuel_type', 'transmission', 'gearing', 'modification'])"
               />
               <div class="divider mobile-column">
                  <form-select
                     v-model="form.fuel_type"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :disabled="!(form.generation && sellEngines.length > 0)"
                     :label="$t('fuel_type')"
                     :new-label="false"
                     :options="sellEngines.map((engine) => ({id: engine.engine, name: $t('engine_values')[engine.engine]}))"
                     :translate-options="false"
                     @change="onChangeFuelType"
                  />
                  <form-checkbox
                     v-model="form.autogas"
                     :disabled="!(form.generation && sellEngines.length > 0)"
                     :label="$t('gas_equipment')"
                     input-name="autogas"
                     transparent
                  />
               </div>
               <form-select
                  v-model="form.gearing"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.fuel_type && sellGearing.length > 0)"
                  :label="$t('type_of_drive')"
                  :new-label="false"
                  :options="sellGearing.map((typeOfDrive) => ({id: typeOfDrive.type_of_drive, name: $t('type_of_drive_values')[typeOfDrive.type_of_drive]}))"
                  :translate-options="false"
                  @change="onChangeGearing"
               />
               <form-select
                  v-model="form.transmission"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.gearing && sellTransmissions.length > 0)"
                  :label="$t('box')"
                  :new-label="false"
                  :options="sellTransmissions.map((transmission) => ({id: transmission.box, name: $t('box_values')[transmission.box]}))"
                  @change="onChangeTransmission($event)"
               />
               <form-select
                  v-model="form.modification"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :disabled="!(form.transmission && sellModificationsV2.length > 0)"
                  :label="$t('modification')"
                  :new-label="false"
                  :options="sellModificationsV2.map((o) => ({name: o.title, key: o.id, capacity: o.capacity}))"
                  :translate-options="false"
                  object-in-value
               />
            </template>
            <div class="divider mobile-column">
               <div>
                  <form-numeric-input
                      v-model="form.mileage"
                      :class="{form_error: $v.form.mileage.$error || mileage_is_new}"
                      :disabled="!isEdit && !readyAllParameters"
                      :invalid="$v.form.mileage.$error"

                      :placeholder="$t('mileage')"
                  />
                  <!--               :max-value="form.is_new ? (form.mileage_type === 1 ? 500 : 310) : 10000000"-->

                  <span
                      class="mileage_is_new"
                      v-if="mileage_is_new && form.mileage"
                  >{{ $t('mileage_is_new') }}</span>
               </div>

               <radio-group
                  v-model="form.mileage_type"
                  :disabledAll="!isEdit && !readyAllParameters"
                  :options="[{key:1, name: 'char_kilometre'}, {key:2, name: 'ml'}]"
                  class="mileage_types"
               />
            </div>

<!--            {{$v.form.mileage.$error}} - $v.form.mileage.$error <br>-->
<!--            {{form.mileage}} - form.mileage.length-->

            <template v-if="isEdit">
               <div class="divider">
                  <form-select
                     v-model="form.color"
                     :class="{form_error: $v.form.color.$error}"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :disabled="!isEdit && !readyAllParameters"
                     :invalid="$v.form.color.$error"
                     :label="$t('color')"
                     :limit="2"
                     :options="colors"
                     colorInput
                     multiple
                  />
                  <form-select
                     v-model="form.seats_count"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('count_of_seats')"
                     :new-label="false"
                     :options="allSellOptions2?.n_of_seats?.options"
                     translate-options
                  />
               </div>

               <div class="divider">
                  <form-radio
                     :id="'3'"
                     v-model="form.is_new"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('new')"
                     :radio-value="1"
                     :type="'checkbox'"
                     input-name="is_new"

                  />
<!--                  @change="onChangeIsNew"-->

                  <form-radio
                     :id="'4'"
                     v-model="form.beaten"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('bitie2')"
                     :radio-value="1"
                     :type="'checkbox'"
                     input-name="beaten"
                  >
                     <template v-slot:suffix>
                        <inline-svg
                           v-tooltip="
                      $t(
                        'with_significant_damage_to_body_elements_that_do_not_move_on_their_own'
                      )
                    "
                           :src="'/icons/info.svg'"
                           class="beaten_suffix"
                        />
                     </template>
                  </form-radio>
               </div>
               <div v-if="!user.external_salon" class="divider mobile-column">
                  <form-checkbox
                     v-model="form.customs_clearance"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('not_cleared')"
                     input-name="customs_clearance"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.guaranty"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('guaranty')"
                     input-name="guaranty"
                     transparent
                  />
               </div>
               <div class="divider mobile-column">
                  <form-numeric-input
                     v-model="form.price"
                     :class="{form_error: $v.form.price.$error}"
                     :disabled="!isEdit && !readyAllParameters"
                     :invalid="$v.form.price.$error"
                     :placeholder="$t('price')"
                  />
                  <div class="price_types">
                     <toggle-group v-slot="{ item }" :default-value="form.currency || 1" :items="priceTypes"

                                   @change="toggleCurrency">
                        <div :class="['price_item', {price_item_disabled: !isEdit && !readyAllParameters}]">
                           <p>{{ item.name[locale] }}</p>
                        </div>
                     </toggle-group>
                  </div>
               </div>
               <div v-if="!user.external_salon" class="divider_3">
                  <form-checkbox
                     v-model="form.tradeable"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('barter')"
                     :show-input="false"
                     input-name="tradeable"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.is_rent"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('rent')"
                     :show-input="false"
                     input-name="rent"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.credit"
                     :disabled="!isEdit && !readyAllParameters"
                     :label="$t('credit_possible')"
                     :show-input="false"
                     input-name="credit"
                     transparent
                  />
               </div>
            </template>
         </div>

         <div class="inner_right">
            <template v-if="!isEdit">
               <div class="divider">
                  <form-select
                     v-model="form.color"
                     :class="{form_error: $v.form.color.$error}"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :disabled="!readyAllParameters"
                     :invalid="$v.form.color.$error"
                     :label="$t('color')"
                     :limit="2"
                     :options="colors"
                     color-input
                     has-search
                     multiple
                  />
                  <form-select
                     v-model="form.seats_count"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :disabled="!readyAllParameters"
                     :label="$t('count_of_seats')"
                     :new-label="false"
                     :options="allSellOptions2?.n_of_seats?.options"
                     :translate-options="false"
                     translate-options
                  />
               </div>

               <div class="divider">
                  <form-radio
                     :id="'3'"
                     v-model="form.is_new"
                     :disabled="!readyAllParameters"
                     :label="$t('new')"
                     :radio-value="1"
                     :type="'checkbox'"
                     input-name="is_new"
                     @change="onChangeIsNew"
                  />
                  <form-radio
                     :id="'4'"
                     v-model="form.beaten"
                     :disabled="!readyAllParameters"
                     :label="$t('bitie2')"
                     :radio-value="1"
                     :type="'checkbox'"
                     input-name="beaten"
                  >
                     <template v-slot:suffix>
                        <inline-svg
                           v-tooltip="
                      $t(
                        'with_significant_damage_to_body_elements_that_do_not_move_on_their_own'
                      )
                    "
                           :src="'/icons/info.svg'"
                           class="beaten_suffix"
                        />
                     </template>
                  </form-radio>
               </div>
               <div v-if="!user.external_salon" class="divider mobile-column">
                  <form-checkbox
                     v-model="form.customs_clearance"
                     :disabled="!readyAllParameters"
                     :label="$t('not_cleared')"
                     input-name="customs_clearance"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.guaranty"
                     :disabled="!readyAllParameters"
                     :label="$t('guaranty')"
                     input-name="guaranty"
                     transparent
                  />
               </div>
               <div class="divider mobile-column">
                  <form-numeric-input
                     v-model="form.price"
                     :class="{form_error: $v.form.price.$error}"
                     :disabled="!readyAllParameters"
                     :invalid="$v.form.price.$error"
                     :placeholder="$t('price')"
                  />
                  <div class="price_types">
                     <toggle-group v-slot="{ item }" :default-value="form.currency || 1" :disabled="!readyAllParameters"
                                   :items="priceTypes"
                                   @change="toggleCurrency">
                        <div class="price_item">
                           <p>{{ item.name[locale] }}</p>
                        </div>
                     </toggle-group>
                  </div>
               </div>
               <div v-if="!user.external_salon" class="divider_3">
                  <form-checkbox
                     v-model="form.tradeable"
                     :disabled="!readyAllParameters"
                     :label="$t('barter')"
                     :show-input="false"
                     input-name="tradeable"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.is_rent"
                     :disabled="!readyAllParameters"
                     :label="$t('rent')"
                     :show-input="false"
                     input-name="rent"
                     transparent
                  />
                  <form-checkbox
                     v-model="form.credit"
                     :disabled="!readyAllParameters"
                     :label="$t('credit_possible')"
                     :show-input="false"
                     input-name="credit"
                     transparent
                  />
               </div>
            </template>
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

            <div v-if="user.external_salon" class="divider">
               <form-radio
                  :id="'5'"
                  v-model="form.auction"
                  :label="$t('auction')"
                  :radio-value="1"
                  input-name="auction"
               />
               <form-radio
                  :id="'6'"
                  v-model="form.auction"
                  :label="$t('sell')"
                  :radio-value="0"
                  input-name="auction"
               />
            </div>
            <form-text-input
               v-if="user.external_salon && form.auction === 1"
               v-model="form.end_date"
               :placeholder="$t('announcement_end_date')"
               date-format="DD.MM.YYYY HH:00"
               date-type="datetime"
               input-date
               value-type="datetime"
               @change="removeError('end_date')"
            />
            <div class="car_identification divider mobile-column">
               <div class="car_number_form">
                  <div v-if="!user.external_salon" class="registrationMarks">
                     <p class="mb-1">{{ $t("license_plate_number") }}</p>
                     <div class="registrationMarks__number">
                        <div class="registrationMarks__number-inner">
                           <div class="">
                              <img alt="icons" src="/icons/registrationMarks_icons.svg">
                           </div>
                           <div class="">
                              <form-text-input
                                 v-model="form.car_number"
                                 :mask="'99 - AA - 999'"
                                 input-class="car-number-show-popover"
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
                           :class="{form_error: $v.form.vin.$error}"
                           :invalid="$v.form.vin.$error"
                           :mask="$maskAlphaNumeric('*****************')"
                           :placeholder="$t('vin_carcase_number')"
                        />
                        <form-checkbox
                           v-model="form.show_vin"
                           :disabled="!form.vin"
                           :label="$t('show_on_site')"
                           input-name="show_vin"
                           transparent
                        />
                     </div>
                  </div>
               </div>
               <div class="car_number_info divider">
                  <p>{{ $t('vin_search_1') }}</p>
                  <strong>
                     {{ $t('registration_number_note') }}
                  </strong>
               </div>
            </div>
         </div>
      </div>
      <div class="car_description_section">
         <h2>{{ $t("vehicle_supply") }}</h2>
         <div class="divider mobile-column">
            <div class="other_parameters_wrapper">
               <div class="other_parameters">
                  <div v-for="check in otherParameters" class="other_parameters__checkbox">
                     <form-checkbox
                        :id="check.slug"
                        v-model="other_parameters_checkboxes[check.slug]"
                        :input-name="check.slug"
                        :label="check.name"
                        :obj="check"
                        transparent
                        @getObject="changeOtherParameters"
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
                  :maxlength="600"
                  :placeholder="$t('additional_info')"
               />
            </div>
         </div>
         <div class="comment_info">
            <inline-svg :src="'/icons/info.svg'" class="comment_svg"/>
            <p>{{ $t("additional_info_warning") }}</p>
         </div>
      </div>
      <div :class="{form_error: $v.form.saved_images.$error || form_errored}" class="image_section">
         <h2>{{ $t("photos") }}</h2>
         <client-only>
            <image-component :announcement="announcement" :deletedFiles="deletedFiles" :initial-form="form"
                             :type="'cars'"/>
         </client-only>
         <div class="image_info">
            <inline-svg :src="'/icons/info.svg'"/>
            <div class="warning_texts">
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_minmax_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_location_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_autosalon_warning") }}</p>
               <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_user_warning") }}</p>
            </div>
         </div>
      </div>

      <template v-if="form.modification && sellModificationsV2.length">
         <div v-if="user.external_salon" class="divider">
            <form-radio
               :id="'5'"
               v-model="form.auction"
               :label="$t('auction')"
               :radio-value="1"
               input-name="auction"
            />
            <form-radio
               :id="'6'"
               v-model="form.auction"
               :label="$t('sell')"
               :radio-value="0"
               input-name="auction"
            />
         </div>
         <form-text-input
            v-if="user.external_salon && form.auction === 1"
            v-model="form.end_date"
            :placeholder="$t('announcement_end_date')"
            date-format="DD.MM.YYYY HH:00"
            date-type="datetime"
            input-date
            value-type="datetime"
            @change="removeError('end_date')"
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
      ...mapGetters(['brands', 'models', 'sellYears', 'sellBody', "sellGenerationsV2", "sellEngines", "sellGearing", "sellTransmissions", "sellModificationsV2", "colors", "popularOptions", 'sellOptions', "allSellOptions2"]),
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
      },
      form_errored: Boolean,
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
         mileage_is_new: false,
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
               await this.onChangeGearing(this.sellGearing[0].type_of_drive)
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
         this.form.gearing = gearing || ""
         if (brand && model && year && body && generation && engine && gearing) {
            try {
               await this.getSellTransmissions({brand, model, year, body, generation, engine, gearing});
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
         this.other_parameters_checkboxes[val.obj.slug] = val.value
         const allValues = []
         for (const key in this.other_parameters_checkboxes) {
            if (this.other_parameters_checkboxes[key]) {
               allValues.push(this.otherParameters.find((p) => p.slug === key))
            }
         }
         this.form.other_parameters = allValues
      },
      // onChangeIsNew(isnew) {
      //    if (isnew) {
      //       this.mileage_is_new = true;
      //
      //       // if (this.form.mileage_type === 1 && this.form.mileage > 500) {
      //       //    this.form.mileage = 500
      //       // }
      //       // if (this.form.mileage_type === 2 && this.form.mileage > 310) {
      //       //    this.form.mileage = 310
      //       // }
      //    }
      // },
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
         this.form.is_rent = this.announcement.is_rent
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
         this.form.seats_count = this.announcement.seats_count
         this.form.other_parameters = this.popularOptions.filter((option) => Object.keys(this.announcement.options).includes(option.name)).map((p) => ({
            ...p,
            key: this.$t(p.label),
            slug: p.name,
            name: this.$t(p.label)
         }))
         this.form.other_parameters.forEach((p) => {
            this.other_parameters_checkboxes[p.slug] = true
         })
      }
   },
   async fetch() {
      await Promise.all([
         this.$store.dispatch("getPopularOptions")
      ]);

   },
   watch: {
      // 'form.mileage_type'() {
      //    if (this.form.is_new) {
      //       if (this.form.mileage_type === 1 && this.form.mileage > 500) {
      //          this.form.mileage = 500
      //       }
      //       if (this.form.mileage_type === 2 && this.form.mileage > 310) {
      //          this.form.mileage = 310
      //       }
      //    }
      // },

      // 'other_parameters_checkboxes': {
      //    deep: true,
      //    handler() {
      //       console.log("this.other_parameters_checkboxes", this.other_parameters_checkboxes)
      //    }
      // },

      'form.is_new'(val) {
         this.mileage_is_new = !!val;
      },

      'form.vin'() {
         !this.form.vin && (this.form.show_vin = false)
      },

      isReady() {
         this.$v.form.$touch();

         setTimeout(() => {
            this.scrollTo('.form_error', -190)
         });

         if (this.$v.form.$error || (this.mileage_is_new && this.form.mileage)) {
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
            brand: {required},
            color: {required},
            mileage: {
               required: requiredIf(function () {
                  console.log('validations')
                  return !this.form.is_new
               }),
               // maxValue: maxValue(this.form.is_new ? 500 : 10000000)
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
         gap: 20px;

         .mileage_is_new {
            margin-top: -15px;
            font-size: 14px;
            color: red;
         }
      }
   }

   .car_description_section {
      h2 {
         margin-bottom: 20px;
         font-size: 20px;
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

         svg {
            min-width: 24px;
         }
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
               height: 150px;
            }
         }

         .comment_info {
            width: 100%;
         }
      }
   }
}


@media(max-width: 991px) and (min-width: 486px) {
   .cars_form {
      .head_section {
         display: flex !important;
         flex-wrap: wrap;

         .inner_left, .inner_right {
            width: 100%;
         }
      }

      .car_description_section {
         .divider {
            display: flex !important;
            flex-wrap: wrap;

            .other_parameters_wrapper {
               width: 100%;
            }

            .comment {
               width: 100%;
            }

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

@media(max-width: 991px) {
   .pages-announcement-edit .car_number_info {
      height: min-content !important;
   }
}
</style>
