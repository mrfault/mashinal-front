<template>
   <div class="registration_mark_form">
      <form-select
         :label="$t('region_2')"
         :options="getRegionNumbers.map((rn) => ({...rn, id: rn.serial_number}))"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         v-model="form.car_number.region_id"
         :invalid="$v.form.car_number.region_id.$error"
      />
      <div class="car_number">
         <form-select
            :label="$t('letter')"
            :options="numbers"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.car_number.first"
            :invalid="$v.form.car_number.first.$error"
         />
         <form-select
            :label="$t('letter')"
            :options="numbers"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.car_number.second"
         />
         <form-numeric-input
            :placeholder="$t('000')"
            v-model="form.car_number.number"
            :maxlength="3"
            :invalid="$v.form.car_number.number.$error"
         />
      </div>
      <div class="divider">
         <form-numeric-input
            :placeholder="$t('price')"
            v-model="form.price"
         />
         <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
         <div class="price_types">
            <toggle-group :items="priceTypes" v-slot="{ item }" :defaultValue="2" @change="form.currency_id = $event.id">
               <div class="price_item">
                  <p>{{ item.name[locale] }}</p>
               </div>
            </toggle-group>
         </div>
      </div>
      <form-checkbox
         v-model="negotiable_price"
         :label="$t('negotiable_price')"
         input-name="negotiable_price"
         transparent
      />
      <form-select :label="$t('region')" :options="sellOptions.regions"
                   v-model="form.region_id"
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
import {email, required} from "vuelidate/lib/validators";

export default {
   components: {ToggleGroup},
   props: {
      isReady: {
         type: Boolean,
         default: false
      }
   },
   computed: {
      ...mapGetters(['getRegionNumbers', "sellOptions"]),
   },
   data() {
      return {
         negotiable_price: false,
         form: {
            car_number: {
               region_id: "",
               first: "",
               second: "",
               number: ""
            },
            price: "",
            currency_id: "",
            region_id: "",
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
      }
   },
   methods: {},
   watch: {
      isReady() {
         this.$v.form.$touch()
         if (this.$v.form.$error) return;
         const {region_id, first, second, number} = this.form.car_number;
         const car_number = `${region_id} -  ${first + second} - ${number}`
         const body = {...this.form, price: this.negotiable_price ? null : this.form.price, car_number}
         this.$emit("getForm", body)
      }
   },
   validations: {
      form: {
         car_number: {
            region_id: {required},
            first: {required},
            number: {required}
         },
         price: {required},
         region_id: {required},
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
}
</style>
