<template>
   <div class="registration_mark_form">
      <form-select
         :label="$t('region_2')"
         :class="{form_error: $v.form.car_number.region_id.$error}"
         :options="getRegionNumbers.map((rn) => ({...rn, id: rn.serial_number}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         has-search
         v-model="form.car_number.region_id"
         :invalid="$v.form.car_number.region_id.$error"
         :disabled="isEdit"
      />
      <div class="car_number">
         <form-select
            :label="$t('letter')"
            :class="{form_error: $v.form.car_number.first.$error}"
            :options="numbers"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            has-search
            v-model="form.car_number.first"
            :invalid="$v.form.car_number.first.$error"
            :disabled="isEdit"
         />
         <form-select
            :label="$t('letter')"
            :options="numbers"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            has-search
            v-model="form.car_number.second"
            :disabled="isEdit"
         />
         <form-numeric-input
            placeholder="000"
            :class="{form_error: $v.form.car_number.number.$error}"
            v-model="form.car_number.number"
            :maxlength="3"
            :float="true"
            :invalid="$v.form.car_number.number.$error"
            :disabled="isEdit"
         />
      </div>
      <div class="divider mobile-column">
         <form-numeric-input
            :placeholder="$t('price')"
            :class="{form_error: $v.form.price.$error}"
            v-model="form.price"
            :invalid="$v.form.price.$error"
            @change="form.is_negotiable = false"
         />
         <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
         <div class="price_types">
            <toggle-group :items="priceTypes" v-slot="{ item }" :defaultValue="form.currency_id"
                          @change="form.currency_id = $event.id">
               <div class="price_item">
                  <p>{{ item.name[locale] }}</p>
               </div>
            </toggle-group>
         </div>
      </div>
      <form-checkbox
         v-model="form.is_negotiable"
         :label="$t('negotiable_price')"
         input-name="is_negotiable"
         transparent
         @change="$event && (form.price = '')"
      />
      <form-select
         :label="$t('region')"
         :class="{form_error: $v.form.region_id.$error}"
         :options="sellOptions.regions"
         v-model="form.region_id"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         has-search
         :invalid="$v.form.region_id.$error"
      />
      <div class="registration_mark_form_with_info">
         <form-textarea
            v-model="form.comment"
            :placeholder="$t('additional_info')"
            :maxlength="600"
         />
         <div class="registration_mark_form_with_info_inner">
            <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
            <p>{{ $t("additional_info_warning") }}</p>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters} from "vuex";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import {required, requiredIf} from "vuelidate/lib/validators";

export default {
   components: {ToggleGroup},
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
   computed: {
      ...mapGetters(['getRegionNumbers', "sellOptions"]),
   },
   data() {
      return {
         form: {
            car_number: {
               region_id: "",
               first: "",
               second: "",
               number: ""
            },
            price: "",
            currency_id: 1,
            is_negotiable: false,
            region_id: 1,
            comment: ""

         },
         numbers: [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'},
            {name: 'D'},
            {name: 'E'},
            {name: 'F'},
            {name: 'G'},
            {name: 'H'},
            {name: 'I'},
            {name: 'J'},
            {name: 'K'},
            {name: 'L'},
            {name: 'M'},
            {name: 'N'},
            {name: 'O'},
            {name: 'P'},
            {name: 'Q'},
            {name: 'R'},
            {name: 'S'},
            {name: 'T'},
            {name: 'U'},
            {name: 'V'},
            {name: 'W'},
            {name: 'X'},
            {name: 'Y'},
            {name: 'Z'}
         ],
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
      }
   },
   methods: {},
   mounted() {
      if (this.isEdit) {
         this.form.car_number.region_id = this.announcement.car_number.split("-")[0]
         this.form.car_number.first = this.announcement.car_number.split("-")[1].charAt(0)
         this.form.car_number.second = this.announcement.car_number.split("-")[1].charAt(1) || ""
         this.form.car_number.number = this.announcement.car_number.split("-")[2]
         this.form.price = this.announcement.price_int
         this.form.currency_id = this.announcement.currency
         this.form.is_negotiable = this.announcement.is_negotiable
         this.form.region_id = this.announcement.region.id
         this.form.comment = this.announcement.comment
      }
   },
   watch: {
      isReady() {
         this.$v.form.$touch()
         setTimeout(() => {
            this.scrollTo('.form_error', -190)
         });
         if (this.$v.form.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }
         const {region_id, first, second, number} = this.form.car_number;
         const car_number = `${region_id.split(" -")[0]} -  ${first + second} - ${number}`
         const body = {...this.form, price: this.form.is_negotiable ? null : this.form.price, car_number}
         this.$emit("getForm", body)
      }
   },
   validations() {
      return {
         form: {
            car_number: {
               region_id: {required},
               first: {required},
               number: {required}
            },
            price: {
               required: requiredIf(function () {
                  return !this.form.is_negotiable
               })
            },
            region_id: {required},
         }
      }
   }
}
</script>

<style lang="scss" scoped>
.registration_mark_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;

   .car_number {
      display: flex;
      gap: 20px;

      & > * {
         width: 100%;
         min-width: 0;
      }
   }

   &_with_info {
      &_inner {
         display: flex;
         margin-top: 12px;
         align-items: center;
         gap: 10px;

         svg {
            min-width: 24px;
            min-height: 24px;
         }
      }
   }

   .divider {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 8px));
      gap: 20px;

      .price_types {
         .price_item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            padding: 0 16px;
         }
      }
   }
}
</style>
