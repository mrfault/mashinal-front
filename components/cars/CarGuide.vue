<template>
   <form class="guide_container" @submit="submitForm">
      <div class="guide_wrapper">
         <div class="guide">
            <h1>{{ $t('menu_guide') }}</h1>
            <p>{{ $t('assistant_description') }}</p>
         </div>
         <div class="guide_filter">
            <div class="guide_filter_radios">
               <form-radio
                  :id="'1'"
                  :label="$t('all2')"
                  input-name="announceType"
                  v-model="form.announce_type"
                  :radio-value="0"
               />
               <form-radio
                  :id="'2'"
                  :label="$t('new')"
                  input-name="announceType"
                  v-model="form.announce_type"
                  :radio-value="1"
               />
               <form-radio
                  :id="'3'"
                  :label="$t('with_mileage_2')"
                  input-name="announceType"
                  v-model="form.announce_type"
                  :radio-value="2"
               />
            </div>
            <car-body-shortcuts v-if="isMobileBreakpoint" v-model="formAssistant.body"/>
            <car-option-packs v-model="formAssistant.packs" @getObjects="getPackObjects"/>
            <div class="guide_range">
               <p class="mb-5">{{ $t("price_range") }} (AZN)</p>
               <vue-slider v-model="formAssistant.price" :tooltip="'always'"
                           :tooltip-placement="['top', 'bottom']"
                           :min="5000"
                           :max="100000"
                           :interval="1000"></vue-slider>
            </div>
            <div class="guide_buttons">
               <button type="button"
                       :class="['btn', 'full-width', 'btn--red-opacity']"

                       @click="resetForm">
                  {{ $t('clear_search') }}
               </button>
               <button
                  :class="['btn', 'full-width', 'btn--green', {pending}]"
               >
                  {{ $t('find') }}
               </button>
            </div>
         </div>
      </div>
      <car-body-shortcuts v-if="!isMobileBreakpoint" v-model="formAssistant.body"/>
   </form>
</template>

<script>
import CarOptionPacks from "~/components/cars/CarOptionPacks.vue";
import CarBodyShortcuts from "~/components/cars/CarBodyShortcuts.vue";
import {mapGetters} from "vuex";
import VueSlider from "vue-slider-component";

export default {
   components: {CarBodyShortcuts, CarOptionPacks, VueSlider},
   props: {
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
         ];
      },
   },
   data() {
      return {
         form: {
            announce_type: 0,
            additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
            exclude_additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
            all_options: {},
            body: [],
            currency: 1,
            sort_by: "created_at",
            sort_order: "desc"
         },
         formAssistant: {
            price: [5000, 100000],
            body: [],
            packs: [],
            packObjects: []
         },
         initFormAssistant: {...this.formAssistant}
      }
   },
   methods: {
      submitForm(e) {
         e.preventDefault()
         const value = []
         const objects = {}
         this.bodyOptions.main.default_options.body.values.forEach((val) => {
            if (Object.values(this.formAssistant.body).length && Object.values(this.formAssistant.body).flat().includes(val.key)) {
               value.push(val)
            }

         })
         this.form.body = value
         this.formAssistant.packObjects.forEach((pack) => {
            Object.entries(pack.values).forEach((val) => {
               objects[val[0]] = val[1]
            })
         })
         const price = {
            price_from: this.formAssistant.price[0],
            price_to: this.formAssistant.price[1]
         }
         this.$emit('onSubmit', {...this.form, ...objects, ...price});
      },
      resetForm() {
         this.form.announce_type = 0
         this.formAssistant = {
            price: [5000, 100000],
            body: [],
            packs: [],
            packObjects: []
         }
         this.$emit("reset")
      },
      getPackObjects(val) {
         this.formAssistant.packObjects = val
      }
   }

}
</script>

<style lang="scss">
.guide_container {
   display: flex;
   gap: 25px;

   .guide_wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: #fff;
      padding: 32px 24px;
      border-radius: 12px;

      .guide {
         display: flex;
         flex-direction: column;
         gap: 16px;
         margin-bottom: 32px;
      }

      .guide_filter {
         display: flex;
         flex-direction: column;
         height: 100%;
         gap: 32px;

         &_radios {
            display: flex;
            gap: 20px;
         }

         .guide_range {
            display: flex;
            flex-direction: column;
            gap: 16px;

            p {
               font-size: 18px;
               font-weight: 500;
            }
         }

         .guide_buttons {
            display: flex;
            gap: 20px;
            align-items: stretch;
            margin-top: 20px;

            button {
               height: 52px;
            }
         }
      }
   }
}

.dark-mode {
   .guide_container {

      .guide_wrapper {
         background-color: #1B2434;


      }
   }
}

@media (max-width: 1150px) {
   .guide_container {
      flex-direction: column;

      .guide_wrapper {


         .guide_filter {
            &_radios {
               overflow: auto;
               padding-bottom: 10px;

               .form-group {
                  min-width: 120px;
               }
            }
         }
      }
   }
}
</style>
