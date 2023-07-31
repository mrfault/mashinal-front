<template>
   <div class="moto_form">
      <form-select
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
         v-if="form.type_of_moto && motoBrands.length"
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
         v-if="form.brand && motoModelsV2.length "
         :label="$t('model_name')"
         :options="form.brand ? motoModelsV2 : []"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         has-search
         v-model="form.model"
      />
      <!--         @change="onChangeMotoModel($event)"-->

      <template v-if="form.model && motoModelsV2.length">
         <form-select
            v-if="sellOptions.years"
            :label="$t('prod_year')"
            :options="sellOptions?.years"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.year"
         />
         <div class="divider">
            <form-numeric-input
               :placeholder="$t('engine_volume2')"
               v-model="form.volume"
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
               :options="motoOptions?.config?.box?.sell_values[form.type_of_moto.id]?.map((f) => ({...f, name: $t(f.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.box"
            />
         </div>
         <div class="divider">
            <form-select
               :class="{full_grid: !motoOptions?.config?.drive?.sell_values[form.type_of_moto.id]?.length}"
               :label="$t('color')"
               :options="colors"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.color"
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
         <div class="divider">
            <form-numeric-input
               :placeholder="$t('mileage')"
               v-model="form.mileage"
               @change="announcement.mileage = $event || 0"
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
            <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
            <div class="price_types">
               <toggle-group :items="priceTypes" v-slot="{ item }" @change="form.currency = $event.id">
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
            <!--            @change="announcement.tradeable = $event"-->
            <form-checkbox
               v-model="form.credit"
               :label="$t('credit_possible')"
               input-name="credit"
               transparent
            />
            <!--            @change="announcement.credit = $event"-->
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
                    '99 - A - 999'
                  "
                  :placeholder="
                    // form.announce_type.title === 'cars' ? '__ - __ - ___' : '__ - _ - ___'
                    '__ - _ - ___'
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
               <!--               @change="this.announcement.show_vin = $event"-->
            </div>
         </div>
         <!--      <form-select-->
         <!--         :label="$t('other_parameters')"-->
         <!--         v-model="form.other_parameters"-->
         <!--         :options="popularOptions.map((p) => ({...p, key: $t(p.label), name: $t(p.label)}))"-->
         <!--         :clear-placeholder="true"-->
         <!--         :clear-option="false"-->
         <!--         name-in-value-->
         <!--         translate-options-->
         <!--         multiple-->
         <!--      />-->
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
         <div class="comment">
            <image-component :type="'moto'" :initial-form="form"/>
            <div class="comment_info">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p>{{ $t("add_image_section_warning") }}</p>
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
import {required} from "vuelidate/lib/validators";

export default {
   components: {ImageComponent, PickOnMapButton, ToggleGroup},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['motoOptionsV2', 'motoBrands', 'motoModelsV2', 'sellOptions', 'colors', 'motoOptions', 'popularOptions']),
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
         motoTypeKey: "",
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
            mileage_type: "",
            is_new: false,
            beaten: false,
            customs_clearance: "",
            guaranty: "",
            region_id: "",
            address: "",
            lng: 0,
            lat: 0,
            price: "",
            currency: "",
            tradeable: "",
            credit: "",
            car_number: "",
            show_car_number: "",
            vin: "",
            show_vin: "",
            engine: "",
            cylinders: "",
            number_of_vehicles: "",
            comment: "",
            saved_images: []
         }
      }
   },
   watch: {
      isReady() {
         // this.$v.form.$touch()
         const newForm = {
            selectedBrand: this.form.brand.id,
            selectedModel: this.form.model,
            selectedYear: this.form.year,
            selectedColor: this.form.color,
            mileage: this.form.mileage,
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
            owner_type: 0,
            volume: this.form.volume,
            power: this.form.power,
            engine: this.form.engine,
            cylinders: this.form.cylinders,
            number_of_vehicles: this.form.number_of_vehicles,
            category: this.form.type_of_moto.id,
            youtube: {"id": "", "thumb": ""}
         }
         const formData = new FormData()
         formData.append('data', JSON.stringify(newForm))
         this.$emit("getForm", formData)
      }
   },
// {"volume":200,"engine":3,"cylinders":5,"drive":1,"fuel_type":2,"box":14,"number_of_vehicles":2,"used_ones":"","customed_ones":"","power":150,"end_date":"","auction":1,"country_id":null,"category":1,"selectedBrand":917,"selectedModel":9258,"selectedYear":2010,"selectedColor":28,"youtube":{"id":"","thumb":""},"mileage":40,"mileage_measure":1,"region_id":1,"address":"Baku, Sax Ismayil Xеtai Avenue, Azerbaijan","lat":40.39645130412052,"lng":49.86599707246074,"vin":"","price":7800,"owner_type":0,"currency":1,"car_number":"","show_car_number":0,"show_vin":0,"all_options":{},"comment":"qwertyu test","is_new":true,"beaten":true,"customs_clearance":true,"tradeable":true,"credit":true,"guaranty":true,"saved_images":[1512831,1512830,1512832],"btl_cookie":"","is_autosalon":false}
   methods: {
      ...mapActions(['getMotoBrandsV2', 'getMotoModelsV2', 'getMotoOptions']),
      async onChangeMotoType({value}) {
         this.form.brand = "";
         this.form.model = "";
         this.clearFields(['brand', 'model'])
         if (value) {
            await this.getMotoBrandsV2({value, whereHas: 1});
         }
      },
      async onChangeMotoBrand(val) {
         this.clearFields(['model'])
         const value = this.form.type_of_moto.value;
         await this.getMotoModelsV2({value, id: val.id, whereHas: 1});
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
   async mounted() {
      await this.getMotoOptions();
      await this.$store.dispatch("getPopularOptions")
   },
   validations: {
      form: {
         car_number: {required},
         price: {required},
         region_id: {required},
         is_new: {required}
      }
   }
}
</script>

<style lang="scss" scoped>
.moto_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;

   .full_grid {
      grid-column: 1/3;
   }
}
</style>
