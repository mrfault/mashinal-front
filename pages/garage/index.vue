<template>
   <div class="pages-garage-index ma-penalties">
      <div class="container">

         <portal to="breadcrumbs">
            <breadcrumbs :crumbs="crumbs"/>
         </portal>
         <div class="d-flex  justify-content-between">
            <h2 class="ma-title--md" style="margin-bottom: 32px">{{ $t('penalties') }}</h2>
            <!--            <button class="btn__blue-outlined" >{{ $t('add_vehicle') }} <icon name="plus"></icon></button>-->
            <add-car @newVehicleAdded="getAllCarsList"/>
         </div>
         <div class="ma-penalties__top">
            <div v-if="carsList.length" class="ma-penalties__top--search">
               <form-text-input
                  v-model="searchNumber"
                  :placeholder="$t('search_number')"
                  icon-name="search"
                  input-class="car-number-show-popover"
                  @change="filterCarNumber"
                  @input="filterCarNumber"
               />
            </div>
            <div class="ma-penalties__top--numbers">

               <div id="carNumberContainer" class="ma-penalty-number-chip__container" @mousedown="startDragging">
                  <div class="ma-penalty-number-chip__list">
                     <div v-for="(car, index) in carsList" :key="index + 98237492"
                          :class="{'ma-penalty-number-chip--active': selectedCar == car, 'ma-penalty-number-chip--disabled': car.sync_status !== 1}"
                          class="ma-penalty-number-chip"
                          @click="selectCar(car)"

                     >
                        {{ formattedCarNumber(car.car_number) }}
                     </div>
                  </div>
               </div>
               <div v-if="carsList.length > 4" class="ma-penalties__top--numbers__scrollButton">
                  <button @click="scrollToRight">
                     <icon name="chevron-right"/>
                  </button>
               </div>
            </div>
         </div>

         <div class="row">
            <!--            left-->
            <div class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <div v-if="carsList.length" class="ma-penalties__card--header">
                     <div v-for="(item,index) in cardTabs" :key="index + 23974"
                          :class="{'ma-penalties__card--header__item--active': activeCardTab ==  item.id}"
                          class="ma-penalties__card--header__item"
                          @click="switchCardTab(item.id)"
                     >
                        {{ $t(item.title) }}
                     </div>
                  </div>
                  <div class="ma-penalties__card--body">
                     <div v-if="activeCardTab == 0" class="ma-penalties__card--body__penalties">
                        <div v-if="loading && carsList.length">
                           <loader/>
                        </div>
                        <template v-else>
                           <template v-if="protocols && protocols.data && protocols.data.length">
                              <div
                                 v-if="false"
                                 class="ma-penalties__card--body__penalties--item all-items">
                                 <div class="ma-left" >
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
                                    @openPaymentModal="showPaymentModal = true"
                                    @selectProtocol="selectProtocol(protocol)"
                                 >
                                    <protocol-details
                                       v-if="protocol.isSelected"
                                       :protocol="protocol"
                                       style="margin-right: 8px !important;"
                                       @showPaymentModal="openPaymentModal"
                                    >
                                       <protocol-files
                                          :protocol="protocol"
                                       >
                                          <div class="card garage_protocol-info">
                                             <div class="garage_protocol-titles">
                                                <h3 class="text-normal">{{ $readCarNumber(protocol.car_number) }}</h3>
                                                <h3 class="text-normal text-dark-blue-2">{{ getTitle(protocol) }}</h3>
                                                <hr/>
                                             </div>
                                             <div class="vehicle-specs">
                                                <div class="row">
                                                   <div v-for="(specs, i) in mainMediaSpecs(protocol, true)"
                                                        :key="i + '6545'"
                                                        class="col">
                                                      <ul>
                                                         <template v-for="(spec, key) in specs">
                                                            <li v-if="spec + 218" :key="key + '1546786'">
                                                               <span class="w-auto">{{ $t(key) }}</span>
                                                               <span>{{ spec }}</span>
                                                            </li>
                                                         </template>
                                                      </ul>
                                                   </div>
                                                </div>
                                             </div>
                                             <template v-if="protocol.can_pay && protocol.total > 0">
                                                <hr class="mb-auto"/>
                                                <div class="row">
                                                   <div class="col-6">
                                                                 <span class="total-price">
                                                                   <span>{{ $t('total') }}</span>
                                                                   <strong>{{ protocol.total }} ₼</strong>
                                                                 </span>
                                                   </div>
                                                   <div class="col-6">
                                                      <a :href="getPayLink(protocol)" class="btn btn--green full-width"
                                                         rel="noopener"
                                                         target="_blank">
                                                         {{ $t('pay_online') }}
                                                      </a>
                                                   </div>
                                                </div>
                                             </template>
                                          </div>
                                       </protocol-files>
                                    </protocol-details>
                                 </protocol-list-item>
                              </template>
                           </template>
                           <div v-else class="ma-penalties__card--body__no-results">
                              <img alt="" src="/images/penalty-no-result.png">
                              <p v-if="carsList.length">{{ $t('no_protocols') }}</p>
                              <p v-else>{{ $t('no_vehicle_found') }}</p>
                           </div>
                        </template>
                     </div>
                     <div v-if="activeCardTab == 1" class="ma-penalties__card--body__penalty_history">
                        <div v-if="loading && carsList.length">
                           <loader/>
                        </div>
                        <template v-else>
                           <template v-if="protocols && protocols.data && protocols.data.length">
                              <div
                                 class="ma-penalties__card--body__penalties--item all-items">
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
                                    @openPaymentModal="showPaymentModal = true"
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
                              <p v-if="carsList.length">{{ $t('no_protocols') }}</p>
                              <p v-else>{{ $t('no_vehicle_found') }}</p>
                           </div>
                        </template>
                     </div>
                  </div>
               </div>
            </div>

            <!--            right-->
            <div v-if="carsList.length" class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <h2 class="ma-title--md">{{ $t('my_vehicle_info') }}</h2>
                  <div class="ma-penalties__right-card__body">
                     <template v-if="selectedCar && mainSpecs">
                        <div v-for="(spec,index) in mainSpecs" :key="index + 213654"
                             class="ma-penalties__card--car-specs">
                           <div v-for="(value,key) in spec" class="ma-penalties__card--car-specs__item">
                              <p>{{ $t(key) }}</p>
                              <strong>{{ value }}</strong>
                           </div>
                        </div>
                     </template>
                  </div>
                  <div class="ma-penalties__card--actions">
                     <remove-vehicle :vehicle="selectedCar" @selectedCarDeleted="getAllCarsList"/>
                     <stop-subsribtion :vehicle="selectedCar" @carDeactivated="getAllCarsList"/>
                  </div>
               </div>
            </div>
         </div>


         <modal-popup
            :overflow-hidden="isMobileBreakpoint"
            :title="$t('payment')"
            :toggle="showPaymentModal"
            modal-class="midsize"
            @close="showPaymentModal = false"
         >
            <h4 class="mb-2">{{ $t('payment_method') }}</h4>
            <div class="d-flex align-items-center justify-content-between">
               <template v-for="(item,index) in paymentMethodOptions">
                  <form-radio
                     v-model="paymentMethod"
                     :group-by="2"
                     :label="$t(item.name)"
                     :radio-value="item.key"
                     style="width: calc(50% - 8px)"
                  />
               </template>
            </div>
            <select-banking-card
               v-show="paymentMethod === 'card'"
               :value="bankingCard"
               class="mt-2 mt-lg-3"
               @input="bankingCard = $event"
            />
            <div class="protocol-payment-modal__body--total-amount">
               <p>{{ $t('total_payment_amount') }}</p>
               <strong v-if="protocol.selected && protocol.selected.total">{{ protocol.selected.total }} AZN</strong>
            </div>
            <!--         <terminal-info-button popup-name="garage-add-popup"/>-->
            <div :class="{ 'modal-sticky-bottom': isMobileBreakpoint }">
               <!--            <hr/>-->
               <div class="row">
                  <div class="col-6">
                     <button
                        :class="[
                                        'btn',
                                        'btn--white',
                                        'btn-dark-text',
                                        'full-width',
                                      ]"
                        type="button"
                        @click="showPaymentModal = false"
                     >
                        {{ $t('reject') }}
                     </button>
                  </div>
                  <div v-if="protocol.selected" class="col-6">
                     <!--                     <button-->
                     <!--                        :class="['btn btn&#45;&#45;green full-width', { pending }]"-->
                     <!--                        @click="getPayLink(protocol.selected)"-->
                     <!--                     >-->
                     <!--                        {{ $t('pay') }}-->
                     <!--                     </button>-->
                     <a :href="getPayLink(protocol.selected)" class="btn btn--green full-width" rel="noopener"
                        target="_blank">
                        {{ $t('pay_online') }}
                     </a>
                  </div>
               </div>
            </div>
         </modal-popup>

         <no-ssr>
            <template v-if="cars.data && cars.data.length">
               <garage-nav
                  v-show="showNav || !isMobileBreakpoint"
                  :tab="tab"
                  @filterCarNumber="filterCarNumber"
                  @change-tab="tab = $event"
               />
               <cars-list v-if="tab === 'cars'" :filter_car_number="car_number" @show-nav="showNav = $event"/>
               <cars-list v-if="tab === 'penalty_history'" key="history_key" :filter_car_number="car_number" history
                          @show-nav="showNav = $event"/>
               <check-driver-points
                  v-show="tab === 'check-points'"
                  @show-nav="showNav = $event"
               />
               <list-of-attorneys
                  v-show="tab === 'attorney-list'"
                  :attorneys="attorneys"
                  @show-nav="showNav = $event"
               />
            </template>
            <template v-else>
               <garage-empty :default-vehicle-list="vehicleList"/>
            </template>
            <template v-if="false">
               <template v-if="tab === 'cars' && (showNav || !isMobileBreakpoint)">
                  <div
                     v-if="isMobileBreakpoint"
                     :class="[
                'card profile-links-card with-margins',
                { 'mt-3': !cars.data || !cars.data.length },
              ]"
                  >
                     <div
                        v-for="menu in userMenus.filter((menu) => menu.showOnCard)"
                        :key="menu.title"
                        class="link-block"
                     >
                        <nuxt-link :to="$localePath(menu.route)">
                           <icon :name="menu.icon"/>
                           {{ $t(menu.title) }}
                           <icon name="chevron-right"/>
                           <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
                        </nuxt-link>
                        <hr/>
                     </div>
                  </div>
               </template>
            </template>
         </no-ssr>

      </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'

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
         this.selectedCar = this.cars.data.find(el => el.sync_status == 1);
         this.getCarProtocols();
      }
      const carNumberContainer = document.getElementById('carNumberContainer');
      carNumberContainer.addEventListener('mousedown', this.startDragging);
   },
   methods: {
      filterCarNumber() {
         if (this.searchNumber) {
            // Remove non-alphanumeric characters from the search input
            const searchTerm = this.searchNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

            this.carsList = this.cars.data.filter((car) => {
               // Remove non-alphanumeric characters from the car_number and convert to uppercase
               const carNumber = car.car_number.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

               // Check if the carNumber includes the searchTerm
               return carNumber.includes(searchTerm);
            });
         } else {
            // If the search input is empty, reset the carsList to the original data
            this.carsList = this.cars.data;
         }
      },
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
         await this.$store.dispatch('garage/getProtocols', {id: this.selectedCar.id, history: this.activeCardTab})

         this.protocol.filteredList = [];
         if (this.protocols && this.protocols.data && this.protocols.data.length) {
            this.protocols.data.forEach(el => {
               el.isSelected = false;
               el.isChecked = false;
               this.protocol.filteredList.push(el);
            })
         }
         this.loading = false;


      },
      selectCar(car) {
         if (car.sync_status == 1) {

            this.loading = true;
            this.selectedCar = car;
            this.getCarProtocols();
            this.protocol.selected = {};
         } else return
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
         this.activeCardTab = id;
         this.getCarProtocols()
         this.protocol.selected = {};
      },
      getAllCarsList() {
         this.$store.dispatch('garage/getCarList');
         this.selectedCar = this.carsList[0];
      },
      async activatePaymentModal() {
         this.showPaymentModal = true;
      },
      openPaymentModal() {
         this.showPaymentModal = true;
      },
      resetFields() {
         this.protocol.selected = {};
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },



      //===================
      getTitle(protocol) {
         return `${protocol.protocol_series || ''}${protocol.protocol_number}`;
      },
      mainMediaSpecs(protocol, unite) {
         let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

         return this.$dataRows({
            pay_status: this.history ? this.$t('already_paid') : '',
            car_number: !unite && protocol.car_number,
            fined_fullname: protocol.fullname,
            point: protocol.point,
            fine: protocol.amount && `${protocol.amount} ₼`,
            discount: protocol.discount && `${protocol.discount} ₼`,
            penalty: protocol.penalty && `${protocol.penalty} ₼`,
            total_amount: !unite && protocol.total && `${protocol.total} ₼`,
            speed_max: protocol.speed_max && `${protocol.speed_max} ${this.$t('char_kilometre_hour')}`,
            speed_real: protocol.speed_real && `${protocol.speed_real} ${this.$t('char_kilometre_hour')}`,

            status: protocol.has_decision !== undefined && (protocol.has_decision ? this.$t('has_decision') : this.$t('no_decision')),
            date_decided: getDate(protocol.decision_date),
            date_expire: getDate(protocol.expiry_date),
            date: getDate(protocol.date)|| getDate(protocol.action_date),
            protocol_took_place: unite && protocol.address
         }, this.isMobileBreakpoint || unite);
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
         return [
            {
               id: '0',
               title: 'penalties'
            },
            {
               id: '1',
               title: 'penalty_history'
            },
         ]
      },
      mainSpecs() {
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
      formattedCarNumber() {
         return (carNumber) => {
            // Assuming carNumber is a string like "90GX606"
            const formattedNumber = carNumber.replace(/(\d{2})([A-Z]+)(\d{3})/, "$1 $2 $3");
            return formattedNumber;
         };
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
         pending: false,
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


