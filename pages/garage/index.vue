<template>
   <div class="pages-garage-index ma-penalties">
      <div class="container p-0">

         <portal to="breadcrumbs">
            <breadcrumbs :crumbs="crumbs"/>
         </portal>
         <div :class="{'flex-wrap': isMobileBreakpoint}" class="d-flex  justify-content-between">
            <h2 :class="{'w-100 text-center': isMobileBreakpoint}" class="ma-title--md" style="margin-bottom: 32px">
               {{ $t('penalties') }}</h2>
            <div :class="{'mt-2 w-100':isMobileBreakpoint}">
               <add-car @newVehicleAdded="getAllCarsList"/>
            </div>
         </div>
         <!--         numbers/search-->
         <div class="ma-penalties__top">
            <div v-if="cars.data.length" :class="{'mr-0 mt-3' : isMobileBreakpoint}" class="ma-penalties__top--search">
               <div class="form-group lighterOnDarkMode isSearchInput">
                  <div class="text-input">
                     <input
                        v-model="searchNumber"
                        :placeholder="$t('search_number')"
                        autocomplete="off"
                        class="car-number-show-popover"
                        maxlength="9"
                        type="text"
                        @input="onInputChange"
                        @keypress="validateInput"
                     >
                     <inline-svg src="/new-icons/fi_search.svg"/>
                  </div>
               </div>
            </div>
            <div v-show="carsList.length" class="ma-penalties__top--numbers">
               <div
                  id="carNumberContainer"
                  :class="{
                    'overflow-x-hidden': carsList.length < 5 && !isMobileBreakpoint,
                    'overflow-x-hidden-mobile': carsList.length < 3 && isMobileBreakpoint
                  }"
                  class="ma-penalty-number-chip__container"
                  @mousedown="startDragging"
               >
                  <div class="ma-penalty-number-chip__list">
                     <div
                        v-for="(car, index) in carsList"
                        :key="index + 98237492"
                        :class="{
                           'ma-penalty-number-chip--active': selectedCar == car,
                           'ma-penalty-number-chip--disabled': car.sync_status !== 1,
                           'ma-penalty-number-chip--active--disabled':
                             selectedCar == car && car.sync_status !== 1
                         }"
                        class="ma-penalty-number-chip"
                        @click="selectCar(car)"
                     >
                        {{ formattedCarNumber(car.car_number) }}
                     </div>
                  </div>
               </div>
               <div v-if="(carsList.length > 4 && isMobileBreakpoint) || (carsList.length > 5 && !isMobileBreakpoint)"
                    class="ma-penalties__top--numbers__scrollButton">
                  <button @click="scrollToRight">
                     <icon name="chevron-right"/>
                  </button>
               </div>
            </div>
         </div>


         <!--         tabs-->
         <div class="row">
            <!--            left-->
            <div v-if="selectedCar && selectedCar.sync_status == 1" class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <div v-if="carsList.length" class="ma-penalties__card--header">
                     <template v-for="(item,index) in cardTabs">

                        <div
                           :key="index + 23974"
                           :class="{'ma-penalties__card--header__item--active': activeCardTab ==  item.id}"
                           class="ma-penalties__card--header__item"
                           @click="switchCardTab(item.id)"
                        >
                           {{ $t(item.title) }}
                        </div>
                     </template>
                  </div>

                  <div class="ma-penalties__card--body" v-if="carsList.length">
                     <div v-if="activeCardTab == 0" class="ma-penalties__card--body__penalties">

                        <!--                                loading-->
                        <div v-if="loading && protocols && protocols.data && protocols.data.length">
                           <loader/>
                        </div>

                        <!--                                content-->

                        <template v-else-if="protocols && protocols.data && protocols.data.length">
                           <template v-for="(protocol,index) in protocol.filteredList">

                              <protocol-list-item
                                 :protocol="protocol"
                                 @openPaymentModal="openPaymentModal"
                                 @selectProtocol="selectProtocol(protocol)"
                              >
                                 <protocol-details
                                    v-if="protocol.isSelected"
                                    :protocol="protocol"
                                    style="margin-right: 8px !important;"
                                    @showPaymentModal="openPaymentModal"
                                 >


                                 </protocol-details>
                              </protocol-list-item>
                           </template>
                        </template>

                        <!--                           no results-->
                        <div v-else class="ma-penalties__card--body__no-results">
                           <img alt="" src="/images/penalty-no-result.png">
                           <p v-if="carsList.length">{{ $t('no_protocols') }}</p>
                           <p v-else>{{ $t('no_vehicle_found') }}</p>
                        </div>

                     </div>

                     <!--                     history-->
                     <div v-if="activeCardTab == 1" class="ma-penalties__card--body__penalty_history">
                        <div v-if="loading && carsList.length && protocols && protocols.data && protocols.data.length">
                           <loader/>
                        </div>
                        <template v-else>
                           <template v-if="protocols && protocols.data && protocols.data.length">
                              <div
                                 v-if="false" class="ma-penalties__card--body__penalties--item all-items">
                                 <div class="ma-left">
                                    <custom-checkbox v-model="protocol.allSelected"/>
                                    <p>{{ $t('select_all') }}</p>
                                 </div>
                                 <div class="ma-right">
                                    <button class="ma-btn-green-outlined">{{ $t('pay_for_selected') }}</button>
                                 </div>
                              </div>
                              <template v-for="(protocol,index) in protocol.filteredList">
                                 <protocol-list-item
                                    :protocol="protocol"
                                    history
                                    @openPaymentModal="openPaymentModal"
                                    @selectProtocol="selectProtocol(protocol)"
                                 >
                                    <protocol-details
                                       v-if="protocol.isSelected"
                                       :protocol="protocol"
                                       history
                                       style="margin-right: 8px !important;"
                                       @showPaymentModal="openPaymentModal"
                                    />
                                 </protocol-list-item>
                              </template>
                           </template>
                           <div v-else class="ma-penalties__card--body__no-results">
                              <img alt="" src="/images/penalty-no-result.png">
                              <p v-if="carsList.length">{{ $t('no_payment_history') }}</p>
                              <p v-else>{{ $t('no_vehicle_found') }}</p>
                           </div>
                        </template>
                     </div>

                     <!--                     vehicle info-->
                     <div v-if="activeCardTab == 2" class="ma-penalties__card--body__penalty_history">
                        <div>
                           <div class="ma-penalties__right-card__body">
                              <template v-if="selectedCar && mainVehicleSpecs">
                                 <div v-for="(spec,index) in mainVehicleSpecs" :key="index + 213654"
                                      class="ma-penalties__card--car-specs">
                                    <div v-for="(value,key) in spec" class="ma-penalties__card--car-specs__item">
                                       <p v-html="$t(key)"></p>
                                       <strong>{{ value }}</strong>
                                    </div>
                                 </div>
                              </template>
                           </div>
                           <div class="ma-penalties__card--actions">
                              <remove-vehicle v-if="selectCar.sync_status !== 0" :vehicle="selectedCar"
                                              @selectedCarDeleted="getAllCarsList"/>
                              <stop-subsribtion v-if="selectedCar.sync_status == 1" :vehicle="selectedCar"
                                                @carDeactivated="getAllCarsList"/>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!--            right-->
            <div v-if="carsList.length && !isMobileBreakpoint" class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <h2 class="ma-title--md">{{ $t('my_vehicle_info') }}</h2>
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
                                    $t('subscription_registration_end_date_on_site')
                                 }}</p>
                              <p v-else v-html="$t(key)"></p>
                              <strong>
                                    <span v-if="key ==='insurance_end_date'"
                                          style="color: #2970FF; text-decoration: underline; font: 500 16px/20px 'TTHoves'; margin-right: 8px; cursor: pointer"
                                          @click="openDateChangeModal = true">{{ $t('edition') }}
                                 </span>
                                 {{ value }}</strong>
                           </div>
                           <hr v-if="index < mainVehicleSpecs.length - 1"
                               class="m-0 ma-penalties__card--car-specs__item--divider">
                        </div>
                     </template>
                  </div>
                  <div v-if="selectedCar" class="ma-penalties__card--actions">
                     <remove-vehicle :vehicle="selectedCar" @selectedCarDeleted="getAllCarsList"/>
                     <stop-subsribtion v-if="selectedCar.sync_status == 1" :vehicle="selectedCar"
                                       @carDeactivated="getAllCarsList"/>
                     <start-subsribtion v-if="selectedCar.sync_status !== 1" :vehicle="selectedCar"
                                       @carDeactivated="getAllCarsList"/>

                  </div>
               </div>
            </div>
         </div>



         <!--         date change modal-->
         <modal-popup
            :overflow-hidden="false"
            :title="$t('insurance_end_date_text')"
            :toggle="openDateChangeModal"
            modal-class="car-info-modal"
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
            <span>{{ $t('date') }}</span>
            <div class="d-flex">
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
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

import {UserDataMixin} from '~/mixins/user-data'
import {MenusDataMixin} from '~/mixins/menus-data'
import {PaymentMixin} from '~/mixins/payment'

import GarageNav from '~/components/garage/GarageNav'
import GarageEmpty from '~/components/garage/GarageEmpty'
import CarsList from '~/components/garage/CarsList'
import CheckDriverPoints from '~/components/garage/CheckDriverPoints'
import ListOfAttorneys from '~/components/garage/loa/ListOfAttorneys'
import CustomCheckbox from "~/components/forms/CustomCheckbox";
import ProtocolDetails from "~/components/garage/ProtocolDetails";
import ProtocolPayment from "~/components/garage/ProtocolPayment";
import ProtocolListItem from "~/components/garage/ProtocolListItem";
import RemoveVehicle from "~/components/garage/RemoveVehicle";
import StopSubsribtion from "~/components/garage/StopSubsribtion";
import AddCar from "~/components/garage/AddCar";
import SelectBankingCard from "~/components/payments/SelectBankingCard";
import ProtocolFiles from "~/components/garage/ProtocolFiles";
import FsLightbox from 'fslightbox-vue';

import StartSubsribtion from "~/components/garage/StartSubsribtion";

export default {
   name: 'pages-garage-index',
   mixins: [UserDataMixin, MenusDataMixin, PaymentMixin],
   layout: 'garageLayout',
   components: {
      StopSubsribtion,
      ProtocolPayment,
      ProtocolDetails,
      CustomCheckbox,
      ListOfAttorneys,
      GarageNav,
      GarageEmpty,
      CarsList,
      CheckDriverPoints,
      ProtocolListItem,
      RemoveVehicle,
      AddCar,
      SelectBankingCard,
      ProtocolFiles,
      FsLightbox,
      StartSubsribtion,
   },
   middleware: ['auth_general'],
   nuxtI18n: {
      paths: {
         az: '/qaraj',
      },
   },
   head() {
      return this.$headMeta({
         title: this.$t('garage'),
      })
   },
   async asyncData({store, $cookies, $axios}) {
      await Promise.all([
         store.dispatch('garage/getCarList', {}),
         store.dispatch('bankingCards/getBankingCards')
      ])
      let vehicleList = {}

      if ($cookies.get('asan_token')) {
         try {
            vehicleList = await $axios.$get('/attorney/get_vehicle_list/false')
         } catch (e) {
         }
      }

      return {
         vehicleList: vehicleList,
         tab: 'cars',
         showNav: true,
         car_number: '',
      }
   },
   mounted() {
      if (this.$route.query.tab) {
         this.tab = this.$route.query.tab;
      }
      if (this.cars && this.cars.data && this.cars.data.length) {
         this.carsList = this.cars.data;


         this.setInitialSelectedCar();

      }
      this.getCarProtocols();

      const carNumberContainer = document.getElementById('carNumberContainer');
      carNumberContainer.addEventListener('mousedown', this.startDragging);
   },
   methods: {
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },

      setInitialSelectedCar() {
         const carWithSyncStatus1 = this.cars.data.find(el => el.sync_status === 1);

         // If an element with sync_status: 1 exists, set selectedCar to that element
         if (carWithSyncStatus1) {
            this.selectedCar = carWithSyncStatus1;
         } else {
            // If no element with sync_status: 1, set selectedCar to the first element of the first element of the cars array
            this.selectedCar = this.cars.data[0];
         }
      },


      // search input
      onInputChange() {
         if (this.searchNumber.trim() === "") {
            this.carsList = this.cars.data;
         } else if (this.isValidInput(this.searchNumber)) {
            this.filterCarNumber();
         } else {
            this.carsList = [];
         }
      },
      isValidInput(text) {
         const validCharactersRegex = /^[A-Za-z0-9]*$/;
         return validCharactersRegex.test(text);
      },
      filterCarNumber() {
         const searchCarNumber = this.searchNumber.trim();

         if (
            this.containsRussianLetters(searchCarNumber) ||
            this.containsDisallowedCharacters(searchCarNumber)
         ) {
            this.carsList = [];
            return;
         }

         this.carsList = this.cars.data.filter((car) =>
            car.car_number.toLowerCase().includes(searchCarNumber.toLowerCase())
         );

         this.selectedCar = null;
      },
      validateInput(event) {
         const enteredChar = event.key;
         const validCharactersRegex = /^[A-Za-z0-9]*$/;

         if (!validCharactersRegex.test(enteredChar)) {
            event.preventDefault();
         }
      },
      containsRussianLetters(text) {
         const russianLettersRegex = /[а-яА-ЯЁё]/;
         return russianLettersRegex.test(text);
      },
      containsDisallowedCharacters(text) {
         const disallowedCharactersRegex = /[^0-9A-Za-z-]/;
         return disallowedCharactersRegex.test(text);
      },
      formattedCarNumber(carNumber) {
         return carNumber.replace(/(\d{2})([A-Z]+)(\d{3})/, "$1 $2 $3");
      },
      // --- --- search input


      startDragging(event) {
         event.preventDefault(); // Disable content selection while dragging

         const container = event.currentTarget;
         let startX = event.clientX;
         let scrollLeft = container.scrollLeft;

         const scrollByDragging = (event) => {
            const distance = event.clientX - startX;
            container.scrollLeft = scrollLeft - distance;
         };

         const stopDragging = () => {
            document.removeEventListener('mousemove', scrollByDragging);
            document.removeEventListener('mouseup', stopDragging);
            container.style.userSelect = ''; // Restore default content selection behavior
         };

         document.addEventListener('mousemove', scrollByDragging);
         document.addEventListener('mouseup', stopDragging);
         container.style.userSelect = 'none'; // Disable content selection during dragging
      },
      scrollToRight(e) {
         const carNumberContainer = document.getElementById('carNumberContainer');
         carNumberContainer.scrollLeft += 100
      },
      getInsuranceText(id) {
         return this.companies.find(item => item.key == id)?.name
      },
      async getCarProtocols() {
         console.log("ahey ahey")
         if (this.selectedCar && this.selectedCar.id) {
            await this.$store.dispatch('garage/getProtocols', {id: this.selectedCar.id, history: this.activeCardTab})
            console.log("this../././././ if")
            this.protocol.filteredList = [];
            if (this.protocols && this.protocols.data && this.protocols.data.length) {
               this.protocols.data.forEach(el => {
                  el.isSelected = false;
                  el.isChecked = false;
                  this.protocol.filteredList.push(el);
               })
            }
            this.loading = false;
         } else {
            console.log("getCarProtocols else")
            this.loading = false;
         }

         console.log("getCarProtocols end")


      },
      selectCar(car) {

         if (car.sync_status !== 1) {
            return
         } else {
            this.protocol.filteredList = [];
            this.loading = true;
            this.pending = true;
            this.protocol.selected = {};
            this.protocol.allSelected = [];
            this.loading = true;
            this.selectedCar = car;
            this.getCarProtocols();
            this.protocol.selected = {};
            this.activeCardTab = 0;
            this.protocol.filteredList = [];
         }
      },
      selectProtocol(protocol) {
         this.protocol.selected = protocol;
         const updatedArrayOfObjects = this.protocol.filteredList.map((obj) => ({
            ...obj,
            isSelected: obj.protocol_number === protocol.protocol_number,
         }));


         this.protocol.filteredList = updatedArrayOfObjects;

      },
      switchCardTab(id) {
         this.loading = true;
         this.pending = true;
         this.activeCardTab = id;
         this.getCarProtocols()
         this.protocol.selected = {};
      },
      async getAllCarsList() {
         console.log("--------------sadhajsdhjaks", "dispacth")
         this.loading = true;
         const res = await this.$store.dispatch('garage/getCarList', {})
         this.carsList = res.data;
         this.loading = false;
         this.setInitialSelectedCar();
      },
      async activatePaymentModal() {
         this.openPaymentModal();
      },
      openPaymentModal() {
         // this.showPaymentModal = true;
         this.getPayLink(this.protocol.selected)
      },


      //===================


      async payFromBalance(protocol) {
         this.pending = true
         if (this.haveBalanceToPay) {
            await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
            this.pending = false
            // this.showPaymentModal = false
            this.bankingCard = ''
            this.updatePaidStatus({
               type: 'success',
               text: this.$t('car_added'),
               title: this.$t('success_payment'),
            })
         } else {
            this.$toasted.error(this.$t('please_make_a_payment'))
         }
      },
      haveBalanceToPay() {
         return parseFloat(this.protocol.selected.total) <= this.user.balance
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
            this.getAllCarsList();
            this.dateChangeForm = {
               day: null,
               month: null,
               year: null,
               company: null,
            }
         } catch (e) {
            console.log("confirmInsurance catch", e)
         }
         this.pending = false;
      },
      capitalizeFirstLetter(string) {
         return string.charAt(0).toUpperCase() + string.slice(1);
      },

   },
   computed: {
      ...mapGetters({
         cars: 'garage/cars',
         attorneys: 'garage/attorneys',
         protocols: 'garage/protocols',
         bankingCards: 'bankingCards/bankingCards',
      }),
      crumbs() {
         return [{name: this.$t('garage')}]
      },
      cardTabs() {
         if (this.isMobileBreakpoint) {

            return [
               {
                  id: '0',
                  title: 'penalties',
               },
               {
                  id: '1',
                  title: 'penalty_history',
               },
               {
                  id: '2',
                  title: 'my_vehicle_info',
               }
            ]
         } else {
            return [
               {
                  id: '0',
                  title: 'penalties',
               },
               {
                  id: '1',
                  title: 'penalty_history',
               },
            ]
         }
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
      years() {
         const years = (back) => {
            const year = new Date().getFullYear();
            return Array.from({length: back}, (v, i) => year - back + i + 1).reverse();
         }
         return years(50).map(item => {
            return {
               name: item,
               key: item
            }
         })
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
      days() {
         let days = Array.from({length: 31}, (v, i) => 31 - i).reverse();
         return days.map((item) => {
            return {
               name: item,
               key: item
            }
         });
      },
   },
   data() {
      return {
         loading: true,
         searchNumber: "",
         activeCardTab: 0,
         selectedCar: null,
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
         carsList: [],
         filteredCarsList: [],
         protocol: {
            selected: null,
            filteredList: [],
            allSelected: true,
         },
         history: {
            selected: null,
            filteredList: [],
         },
         showPaymentModal: false,
         pending: true,
         name: 'pay_with_card',
         paymentOptions: [
            {
               label: 'pay_with_card',
               id: 0,
            },
            {
               label: 'balans',
               id: 1,
            },
         ],
         pay_with_card: false,
         balance: false,
         index: 1,
         selectedCard: null,
         cardOptions: [
            {
               name: 'payment_with_other_card',
               value: null,
            },
            {
               name: 'Pasha Bank card',
               value: '1234 5678 7897 3454'
            }
         ],
         showNewVehicleModal: false,
         paymentMethod: 'card',
         bankingCard: '',
         price: 0,
         showProtocolDetails: false,
         openDateChangeModal: false,
         dateChangeForm: {
            day: null,
            month: null,
            year: null,
            company: null,
         }
      }
   },
   watch: {
      'protocol.allSelected': {
         deep: true,
         handler() {
            if (this.protocol.allSelected) {
               this.protocol.filteredList.forEach(el => el.isChecked = true)
            } else {
               this.protocol.filteredList.forEach(el => el.isChecked = false)

            }
         }

      }
   }
}
</script>

<style lang="scss">
.dark-mode {
   .ma-penalties__card--car-specs__item--divider {
      background: #fff;
   }

   .ma-penalty-number-chip--active {
      background: #155EEF !important;
      color: #fff !important;
   }

   .ma-penalties {
      .btn__blue-outlined {
         &:hover {
            background: #1b2434;
         }
      }
   }

   .remove-vehicle-modal {
      p {
         color: rgba(205, 213, 223, 1);
      }
   }

   .ma-penalties__top--numbers__scrollButton {
      background: #121926 !important;

      button {
         color: #fff;
         background: #364152;

      }
   }
}
</style>


