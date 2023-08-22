<template>
   <div class="row">
      <div class="col-6">
         <div class="guide">
            <h1>{{ $t('menu_guide') }}</h1>
            <p>İçkili vəziyyətdə avtomobili idarə etmək qadağandır. Bu, sizin və başqalarının həyatını riskə atır. Lorem
               ipsum dolor sit amet consectur emprario merbaken culirius lorem ipsum dolor sit amet consectur. Lorem
               ipsum dolor sit amet consectur emprario</p>
         </div>
         <div class="row">


            <div class="col-4">
               <form-radio
                  :id="'1'"
                  :label="$t('all2')"
                  input-name="announceType"
                  v-model="announceType"
                  :radio-value="1"
               />
            </div>
            <div class="col-4">
               <form-radio
                  :id="'2'"
                  :label="$t('new')"
                  input-name="announceType"
                  v-model="announceType"
                  :radio-value="2"
               />
            </div>
            <div class="col-4">
               <form-radio
                  :id="'3'"
                  :label="$t('with_mileage_2')"
                  input-name="announceType"
                  v-model="announceType"
                  :radio-value="3"
               />
            </div>
         </div>

         <car-option-packs v-model="formAssistant.packs"/>
         <div class="row">
            <div class="col-12">
               <div
                  class="row align-items-end">
                  <div class="col-lg-12">
                     <form-range
                        v-model="formAssistant.price" :min="5000"
                        :max="100000" :step="5000"
                     >
                        <div class="row mt-2 mt-lg-3 mb-2 mb-lg-0">
                           <div class="col-6">
                              <div class="form-info">
                                 {{ $readNumber(formAssistant.price[0]) }} ₼
                              </div>
                           </div>
                           <div class="col-6">
                              <div class="form-info"> {{ $readNumber(formAssistant.price[1]) }} ₼
                              </div>
                           </div>
                        </div>
                     </form-range>
                  </div>
                  <div
                     v-if="!onlySavedSearch"
                     class="col-lg-12"
                  >
                     <div class="row">
                        <div class="col-6">
                           <button type="button"
                                   :class="['btn', 'full-width', 'btn--red-outline', { 'pointer-events-none': pending }]"
                                   @click="resetForm(!(advanced))">
                              <icon name="reset"/>
                              {{ $t('clear_search') }}
                           </button>
                        </div>
                        <div class="col-6">
                           <button
                              type="button" :class="['btn', 'full-width', 'btn--green', { pending }]"
                              @click="submitForm()">
                              <icon name="search"/>
                              {{ $t('find') }}
                           </button>
                        </div>
                     </div>
                  </div>
                  <div v-else
                       class="col-lg-6">
                     <div class="row">
                        <div class="col-6">
                           <button type="button" :class="['btn', 'full-width', 'btn--red-outline', { 'pointer-events-none': pending },
                    ]" @click="resetForm(!(advanced))">
                              <icon name="reset"/>
                              {{ $t('clear_search') }}
                           </button>
                        </div>
                        <div class="col-12">
                           <button type="button"
                                   :class="['btn', 'full-width', 'btn--green', { pending, 'btn-disabled': !searchAppliedCustom }]"
                                   @click="saveSearch">
                              <icon name="search"/>
                              {{ $t('search_and_save') }}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="col-6">
         <car-body-shortcuts v-model="formAssistant.body"/>
      </div>


   </div>
</template>

<script>
import CarOptionPacks from "~/components/cars/CarOptionPacks.vue";
import CarBodyShortcuts from "~/components/cars/CarBodyShortcuts.vue";
import {mapGetters} from "vuex";

export default {
   components: {CarBodyShortcuts, CarOptionPacks},
   props: {
      onlySavedSearch: {
         default: false,
         type: Boolean,
      },
      pending: Boolean,
   },
   computed: {
      ...mapGetters([
         'bodyOptions'
      ]),
      getMileageOptions() {
         let zeroFirst;
         return [
            {name: this.$t('all2'), key: zeroFirst ? 0 : 1},
            {name: this.$t('new'), key: zeroFirst ? 1 : 2},
            {name: this.$t('with_mileage_2'), key: zeroFirst ? 2 : 3}
            // {name: this.$t(this.meta.type === 'parts' ? 'S_H' : 'with_mileage'), key: zeroFirst ? 2 : 3}
         ];
      },
   },
   data() {
      return {
         announceType: 1,
         form: {
            korobka: []
         },
         formAssistant: {
            body: {},
            packs: [],
            price: [5000, 100000],
         },
      }
   }

}
</script>

<style lang="scss">

</style>
