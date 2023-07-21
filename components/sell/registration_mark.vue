<template>
   <div class="registration_mark_form">
      <form-select
         :label="$t('region')"
         :options="getRegionNumbers"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         v-model="form.car_number.region_id"
      />
      <div class="car_number">
         <form-select
            :label="$t('letter')"
            :options="numbers"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.car_number.first"
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
            maxlength="3"
         />
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
      <form-checkbox
         v-model="form.negotiable_price"
         :label="$t('negotiable_price')"
         input-name="negotiable_price"
         transparent
      />
      <form-select :label="$t('region')" :options="sellOptions.years"
                   v-model="form.region_id"
                   has-search
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

export default {
   components: {ToggleGroup},
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
            region_id: ""
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
