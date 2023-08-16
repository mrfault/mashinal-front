<template>
   <div>
      <div class="ma-penalties__card">
         <h2 v-if="!isMobileBreakpoint" class="ma-title--md">{{ $t('my_vehicle_info') }}</h2>
         <div>
            <div :class="{'ma-penalties__card--body__no-results': !selectedCar}"
                 class="ma-penalties__right-card__body">
               <div v-if="selectedCar && selectedCar.sync_status == 0"
                    class="ma-penalties__card--car-specs__item">
                  <p style="color: #F81734">{{ $t('vehicle_is_not_active') }}</p>
               </div>
               <template v-if="selectedCar && mainVehicleSpecs">
                  <div v-for="(spec,index) in mainVehicleSpecs" :key="index + 213654"
                       class="ma-penalties__card--car-specs">
                     <div v-for="(value,key) in spec" class="ma-penalties__card--car-specs__item">
                        <p v-if="key == 'auth_date'">{{ $t('subscription_registration_date_on_site') }}</p>
                        <p v-else-if="key == 'auth_end_date'">{{
                              $t('subscription_registration_end_date_on_site2')
                           }}</p>
                        <p v-else v-html="$t(key)"></p>
                        <strong>
                           <template v-if="key ==='insurance_end_date'">
                                    <span
                                       v-if="selectedCar.status == 1"
                                       style="color: #2970FF; text-decoration: underline; font: 500 16px/20px 'TTHoves'; margin-right: 8px; cursor: pointer"
                                       @click="openDateChangeModal = true">{{ $t('edition') }}
                                 </span>
                           </template>
                           {{ value }}</strong>
                     </div>
                     <hr v-if="index < mainVehicleSpecs.length - 1"
                         class="m-0 ma-penalties__card--car-specs__item--divider">
                  </div>
               </template>
            </div>
            <div v-if="selectedCar" class="ma-penalties__card--actions">
               <remove-vehicle :vehicle="selectedCar" @selectedCarDeleted="getAllCarsList"/>
               <stop-subsribtion v-if="selectedCar.sync_status == 1 && selectedCar.status == 1"
                                 :vehicle="selectedCar"
                                 @carDeactivated="getAllCarsList"/>
               <start-subsribtion v-if="selectedCar.sync_status == 1 && selectedCar.status == 0 "
                                  :vehicle="selectedCar"
                                  @carActivated="carActivatedMethod()"/>
            </div>
         </div>
      </div>

      <!--         date change modal-->
      <modal-popup
         :modal-class="isMobileBreakpoint ? 'wider' : 'car-info-modal'"
         :overflow-hidden="false"
         :title="$t('insurance_end_date_text')"
         :toggle="openDateChangeModal"
         @close="openDateChangeModal = false"
      >
         <form-select
            v-model="dateChangeForm.company"
            :allow-clear="false"
            :clear-option="false"
            :label="$t('insurance_company')"
            :options="companies"
            class="mb-2"
         />
         <div class="mb-1">{{ $t('date') }}</div>
         <div class="ma-penalties-date-change-row">
            <form-select
               v-model="dateChangeForm.year"
               :allow-clear="false"
               :clear-option="false"
               :label="$t('year_first_letter')"
               :options="years"
               class="mr-1"
            />
            <form-select
               v-model="dateChangeForm.month"
               :allow-clear="false"
               :clear-option="false"
               :label="capitalizeFirstLetter($t('plural_forms_month')[0])"
               :options="months"
               class="mr-1"
            />
            <form-select
               v-model="dateChangeForm.day"
               :allow-clear="false"
               :clear-option="false"
               :label="$t('day')"
               :options="days"
            />
         </div>

         <button
            :class="{ 'disabled' : !dateChangeForm.company || !dateChangeForm.year ||  !dateChangeForm.month ||  !dateChangeForm.day  }"
            :disabled="!dateChangeForm.company || !dateChangeForm.year ||  !dateChangeForm.month ||  !dateChangeForm.day  "
            class="btn btn--green mt-2 w-100"
            @click="confirmInsurance"
         >
            {{
               $t('confirm')
            }}
         </button>
      </modal-popup>
   </div>
</template>

<script>
import StartSubsribtion from "~/components/garage/StartSubsribtion";
import StopSubsribtion from "~/components/garage/StopSubsribtion";
import RemoveVehicle from "~/components/garage/RemoveVehicle";

export default {
   props: {
      selectedCar: Object,
   },
   components: {
      StopSubsribtion,
      RemoveVehicle,
      StartSubsribtion,
   },
   data() {
      return {
         openDateChangeModal: false,
         dateChangeForm: {
            day: null,
            month: null,
            year: null,
            company: null,
         },
         companies: [
            {key: 1, name: 'Azsığorta'},
            {key: 2, name: 'Ata Sığorta'},
            {key: 3, name: 'Atəşgah Sığorta'},
            {key: 4, name: 'A-qroup sığorta'},
            {key: 5, name: 'AzRe Təkrarsığorta'},
            {key: 6, name: 'Azərbaycan Sənaye Sığorta'},
            {key: 7, name: 'Azərbaycan Dövlət Sığorta'},
            {key: 8, name: 'Bakı Sığorta'},
            {key: 9, name: 'Günay Sığorta'},
            {key: 10, name: 'Xalq Sığorta'},
            {key: 11, name: 'İpək Yolu Sığorta'},
            {key: 12, name: 'Qala Sığorta'},
            {key: 13, name: 'Meqa Sığorta'},
            {key: 14, name: 'Naxçıvan sığorta'},
            {key: 15, name: 'Paşa Sığorta'},
         ],
      }
   },
   methods: {
      getAllCarsList() {
         this.$emit('carDataChanged', true)
      },
      getInsuranceText(id) {
         return this.companies.find(item => item.key == id)?.name
      },
      async confirmInsurance() {
         console.log("confirmInsurance")
         this.pending = true;
         try {
            console.log("confirmInsurance try")
            await this.$axios.$post('/garage/insurance/set-enddate', {
               car_id: this.selectedCar.id,
               end_date: `${this.dateChangeForm.year}-${this.dateChangeForm.month}-${this.dateChangeForm.day}`,
               insurance_company_id: this.dateChangeForm.company
            })
            console.log("confirmInsurance response")
            this.$emit('refresh-data')
            this.openDateChangeModal = false;
            this.$emit('carDataChanged', true)
            this.dateChangeForm = {
               day: null,
               month: null,
               year: null,
               company: null,
            };
            this.$nuxt.refresh();
         } catch (e) {
            console.log("confirmInsurance catch", e)
         }
         this.pending = false;
      },
      capitalizeFirstLetter(string) {
         return string.charAt(0).toUpperCase() + string.slice(1);
      },
      carActivatedMethod() {
         console.log("carActivated ahey ahey")
         this.getAllCarsList();
         this.$nuxt.refresh();
      }
   },
   computed: {
      days() {
         let days = Array.from({length: 31}, (v, i) => 31 - i).reverse();
         return days.map((item) => {
            return {
               name: item,
               key: item
            }
         });
      },
      months() {
         this.$moment.locale(this.locale)
         return this.$moment.months().map((item, code) => {
            return {
               name: this.capitalizeFirstLetter(item),
               key: code + 1
            }
         });
      },
      years() {
         const years = (back) => {
            const year = new Date().getFullYear() + 10;
            return Array.from({length: back}, (v, i) => year - back + i + 1).reverse();
         }
         return years(50).map(item => {
            return {
               name: item,
               key: item
            }
         })
      },
      mainVehicleSpecs() {
         let getDate = (date) => date && this.$moment((date)).format('DD.MM.YYYY');

         return this.$dataRows({
            tech_id: this.selectedCar.tech_id,
            brand_model: this.selectedCar.mark,
            years: this.selectedCar.year,
            insurance_company: this.getInsuranceText(this.selectedCar.insurance_company_id),
            // has_insurance: this.selectedCar.insurance_id ? this.$t('have') : this.$t('dont_have'),
            insurance_end_date: this.selectedCar.insurance_end_date ? this.$moment(this.selectedCar.insurance_end_date).format('DD.MM.YYYY') : '00.00.0000',
            auth_date: getDate(this.selectedCar.created_date),
            auth_end_date: getDate(this.selectedCar.end_date),
            tech_exp_date: getDate(this.selectedCar.tech_exp_date),
            has_arrest: this.selectedCar.has_arrest ? this.$t('have') : this.$t('dont_have')
         }, this.isMobileBreakpoint);
      },

   }
}
</script>

<style lang="scss">
.ma-penalties-date-change-row{
   display: flex;
}
@media (max-width: 1149px) and (min-width: 992px) {
   .ma-penalties-date-change-row {
      .select-menu_dropdown {
         bottom: 60px;
         top: auto;
      }
   }
}
</style>
