<template>
   <div class="cars_form">
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
         v-if="form.brand && models.length"
         :label="$t('model_name')"
         :options="models"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         object-in-value
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
         @change="onChangeYear"
      />
      <grid-radio
         v-if="form.year && sellBody.length"
         :default-value="form.body_type || ''"
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
         :default-value="form.generation || ''"
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
         :default-value="form.gearing || ''"
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
              capacity: o.capacity
            }))"
         :clear-placeholder="true"
         :clear-option="false"
         :translate-options="false"
         object-in-value
         :new-label="false"
         v-model="form.modification"
         @change="preview.car_catalog.capacity = form.modification?.capacity"
      />
      <!--      v-if="form.modification"-->

      <template v-if="isEdit || (form.modification && sellModificationsV2.length)">
         <div class="divider">
            <form-select
               :class="{form_error: $v.form.color.$error}"
               :label="$t('color')"
               :options="colors"
               :clear-placeholder="true"
               :clear-option="false"
               v-model="form.color"
               multiple
               :invalid="$v.form.color.$error"
               :limit="2"
            />
            <form-checkbox
               v-model="form.is_matte"
               :label="$t('matt')"
               input-name="is_matte"
               transparent
            />
         </div>
         <div class="divider mobile-column">
            <form-numeric-input
               :class="{form_error: $v.form.mileage.$error}"
               :placeholder="$t('mileage')"
               :max-value="form.is_new ? (form.mileage_type === 1 ? 500 : 310) : 10000000"
               v-model="form.mileage"
               :invalid="$v.form.mileage.$error"
            />
            <!--               @change="announcement.mileage = $event ? $event  + ' ' + mileageTypeName : 0"-->
            <div class="mileage_types">
               <form-radio
                  :id="'1'"
                  :label="$t('char_kilometre')"
                  input-name="mileage"
                  v-model="form.mileage_type"
                  :radio-value="1"
               />
               <form-radio
                  :id="'52'"
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
               :type="'checkbox'"
               :label="$t('new')"
               input-name="is_new"
               v-model="form.is_new"
               :radio-value="1"
               @change="onChangeIsNew"
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
         <div class="divider mobile-column" v-if="!user.external_salon">
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
            v-if="!user.autosalon && !user.external_salon"
            :class="{form_error: $v.form.region_id.$error}"
            :label="$t('city_of_sale')"
            :options="sellOptions.regions"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.region_id"
            :invalid="$v.form.region_id.$error"
         />
         <form-select
            v-if="user.external_salon"
            :class="{form_error: $v.form.country_id.$error}"
            :label="$t('sale_region_country')"
            :options="sellOptions.countries"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.country_id"
            :invalid="$v.form.country_id.$error"
         />
         <div class="divider" v-if="!user.autosalon && !user.external_salon">
            <form-text-input
               :class="{form_error: $v.form.address.$error}"
               key="address"
               v-model="form.address"
               :placeholder="$t('address')"
               :invalid="$v.form.address.$error"
            />
            <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                                @change-address="updateAddress" @change-latlng="updateLatLng">
               <form-text-input :placeholder="$t('address')" v-model="form.address"/>
            </pick-on-map-button>
         </div>
         <div class="divider mobile-column">
            <form-numeric-input
               :class="{form_error: $v.form.price.$error}"
               :placeholder="$t('price')"
               v-model="form.price"
               @change="preview.price = $event ? $event + ' ' + (form.currency.name?.[locale] || priceTypes.find((pr) => pr.id === form.currency).name?.[locale]) : 0"
               :invalid="$v.form.price.$error"
            />
            <div class="price_types">
               <toggle-group :items="priceTypes" :default-value="form.currency || 1" v-slot="{ item }"
                             @change="toggleCurrency">
                  <div class="price_item">
                     <p>{{ item.name[locale] }}</p>
                  </div>
               </toggle-group>
            </div>
         </div>
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
         <div class="divider mobile-column" v-if="!user.external_salon">
            <form-checkbox
               v-model="form.tradeable"
               :label="$t('tradeable')"
               input-name="tradeable"
               transparent
               @change="preview.tradeable = $event"
            />
            <form-checkbox
               v-model="form.credit"
               :label="$t('credit_possible')"
               input-name="credit"
               transparent
               @change="preview.credit = $event"
            />
         </div>
         <div v-if="!user.external_salon">
            <p class="mb-1">{{ $t("license_plate_number") }}</p>
            <div class="divider mobile-column">
               <form-text-input
                  :class="{form_error: $v.form.car_number.$error}"
                  v-model="form.car_number"
                  input-class="car-number-show-popover"
                  img-src="/icons/circled_flag.svg"
                  :mask="'99 - AA - 999'"
                  placeholder="__ - __ - ___"
                  :invalid="$v.form.car_number.$error"
               />
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
                  @change="preview.show_vin = $event"
                  transparent
               />
            </div>
         </div>
         <form-select
            :label="$t('other_parameters')"
            v-model="form.other_parameters"
            :options="otherParameters"
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
         <div class="comment" :class="{form_error: $v.form.saved_images.$error}">
            <client-only>
               <image-component :type="'cars'" :initial-form="form" :announcement="announcement"
                                :deletedFiles="deletedFiles"/>
            </client-only>
            <div class="comment_info">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <div class="warning_texts">
                  <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_section_warning") }}</p>
                  <p :class="{invalid_paragraph: $v.form.saved_images.$error}">{{ $t("add_image_max_warning") }}</p>
               </div>
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
import {maxLength, maxValue, minLength, required, requiredIf} from "vuelidate/lib/validators";
import MaxLength from "vuelidate/lib/validators/maxLength";

export default {
   components: {PickOnMapButton, ToggleGroup, ImageComponent, GridRadio},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['brands', 'models', 'sellYears', 'sellBody', "sellGenerationsV2", "sellEngines", "sellGearing", "sellTransmissions", "sellModificationsV2", "colors", "popularOptions", 'sellOptions']),
      otherParameters() {
         return this.popularOptions.map((p) => ({...p, key: this.$t(p.label), slug: p.name, name: this.$t(p.label)}))
      },
      mileageTypeName() {
         return this.form.mileage_type === 1 ? this.$t('char_kilometre') : this.$t('ml')
      },
   },
   props: {
      announcement: {
         type: Object,
         required: true
      },
      preview: {
         type: Object,
         default: {}
      },
      isReady: {
         type: Boolean,
         default: false
      },
      isEdit: {
         type: Boolean,
         default: false
      },
      navigationProgress: {
         type: Object
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
            is_matte: false,
            mileage: '',
            mileage_type: 1,
            is_new: false,
            beaten: false,
            customs_clearance: false,
            guaranty: false,
            region_id: 1,
            address: "",
            lat: 0,
            lng: 0,
            price: "",
            currency: 1,
            tradeable: false,
            credit: false,
            car_number: "",
            show_car_number: false,
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
         this.preview.brand = this.form.brand.name || this.$t('mark')
         if (slug) {
            await this.getModels(slug);
         }
      },
      async onChangeModel() {
         this.clearFields(['year', 'body_type', 'generation', 'fuel_type', 'transmission', 'gearing', 'modification'])
         const brand = this.form.brand.slug
         const model = this.form.model.slug
         this.preview.model = this.form.model.name || this.$t('model')
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
         this.preview.year = this.form.year || "0000"
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
         this.form.body_type = body || ""
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
         this.form.generation = generation || "";
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
               this.preview.car_catalog.capacity = this.sellModificationsV2[0].capacity
               this.form.modification = this.sellModificationsV2.map((o) => ({
                  name: o.title,
                  key: o.id,
                  capacity: o.capacity
               }))[0]
            }
         }
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
         this.preview.price = this.form.price ? this.form.price + ' ' + (currency.name?.[this.locale] || 'AZN') : 0
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
         this.form.region_id = this.announcement.region_id
         this.form.address = this.announcement.address
         this.form.lat = Number(this.announcement.latitude)
         this.form.lng = Number(this.announcement.longitude)
         this.form.price = this.announcement.price_int
         this.form.currency = this.announcement.currency_id
         this.form.tradeable = this.announcement.exchange_possible
         this.form.credit = this.announcement.credit
         this.form.car_number = this.announcement.car_number
         this.form.show_car_number = this.announcement.show_car_number
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
         this.preview.mileage = this.form.mileage ? this.form.mileage + ' ' + (this.form.mileage_type === 1 ? this.$t('char_kilometre') : this.$t('ml')) : 0
         if (this.form.is_new) {
            if (this.form.mileage_type === 1 && this.form.mileage > 500) {
               this.form.mileage = 500
            }
            if (this.form.mileage_type === 2 && this.form.mileage > 310) {
               this.form.mileage = 310
            }
         }
      },
      'form.mileage'() {
         this.preview.mileage = this.form.mileage ? this.form.mileage + ' ' + (this.form.mileage_type === 1 ? this.$t('char_kilometre') : this.$t('ml')) : 0
      },
      'form.modification'() {
         this.$emit("navigationProgress", {id: 1, status: !!this.form.modification})
         this.$emit("done", !!(this.form.modification && this.sellModificationsV2.length))
      },
      "form.saved_images"() {
         this.$emit("navigationProgress", {id: 3, status: this.form.saved_images.length > 2})
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
            is_new: this.form.is_new ? 1 : 0,
            beaten: this.form.beaten,
            customs_clearance: this.form.customs_clearance,
            tradeable: this.form.tradeable,
            credit: this.form.credit,
            guaranty: this.form.guaranty,
            saved_images: this.form.saved_images,
            all_options: this.form.other_parameters.reduce((acc, curr) => {
               acc[curr.slug] = curr.selected_key ? curr.selected_key : true;
               return acc;
            }, {}),
            selectedColor: this.form.color,
            is_matte: this.form.is_matte,
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
            newForm = {...newForm, region_id: this.form.region_id}
         }
         if (this.isEdit && this.deletedFiles.length) {
            newForm = {...newForm, deletedFiles: this.deletedFiles}
         }

         this.$emit("getForm", newForm)
      },
   },
   updated() {
      const announceDescription = ['brand',
         'color',
         'mileage',
         'car_number',
         'address',
         'price'].every((key) => this.form[key]) && (!this.user.autosalon ? this.form.region_id : true)
      this.$emit("navigationProgress", {id: 2, status: announceDescription})
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
                  return !this.form.vin && !this.user.external_salon && !this.user.autosalon
               })
            },
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
            address: {
               required: requiredIf(function () {
                  return !this.user.autosalon && !this.user.external_salon
               })
            },
            vin: {
               required: requiredIf(function () {
                  return this.form.customs_clearance
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
