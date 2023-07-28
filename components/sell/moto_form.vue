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
         :label="$t('brand_name')"
         :options="motoBrands"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.brand"
         @change="onChangeMotoBrand($event)"
      />
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
            v-model="form.engine"
         />
         <form-numeric-input
            :placeholder="$t('horse_power')"
            v-model="form.hp"
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
            @change="this.announcement.mileage = $event || 0"
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
         <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
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
            <!--               @change="this.announcement.show_vin = $event"-->
         </div>
      </div>
      <form-select
         :label="$t('other_parameters')"
         v-model="form.other_parameters"
         :options="popularOptions.map((p) => ({...p, key: $t(p.label), name: $t(p.label)}))"
         :clear-placeholder="true"
         :clear-option="false"
         name-in-value
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
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import {ToastErrorsMixin} from "~/mixins/toast-errors";

export default {
   components: {PickOnMapButton, ToggleGroup},
   mixins: [MenusDataMixin, ToastErrorsMixin],
   computed: {
      ...mapGetters(['motoOptionsV2', 'motoBrands', 'motoModelsV2', 'sellOptions', 'colors', 'motoOptions', 'popularOptions']),
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
            engine: "",
            hp: "",
            fuel: "",
            box: "",
            color: "",
            gearing: "",
            mileage: "",
            mileage_type: "",
            beaten: "",
            customs_clearance: "",
            guaranty: "",
            region_id: "",
            address: "",
            price: "",
            currency: "",
            tradeable: "",
            credit: "",
            car_number: "",
            show_car_number: "",
            vin: "",
            show_vin: "",
            other_parameters: "",
            comment: "",
         }
      }
   },
   methods: {
      ...mapActions(['getMotoBrandsV2', 'getMotoModelsV2', 'getMotoOptions']),
      async onChangeMotoType({value}) {
         await this.getMotoBrandsV2({value, whereHas: 1});
      },
      async onChangeMotoBrand(val) {
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
   },
   async mounted() {
      await this.getMotoOptions()
      await this.$store.dispatch("getPopularOptions")
   }
}
</script>

<style lang="scss" scoped>
.moto_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;
}
</style>
