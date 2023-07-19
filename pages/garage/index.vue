<template>
   <div class="pages-garage-index ma-penalties">
      <div class="container">
         <h2 class="ma-title--md">{{ $t('penalties') }}</h2>
         <!--         top ----------------------------------------------------------------------------------------------------------------------- -->
         <!--         top ----------------------------------------------------------------------------------------------------------------------- -->
         <!--         top ----------------------------------------------------------------------------------------------------------------------- -->
         <div class="ma-penalties__top">
            <div class="ma-penalties__top--search">
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
                     <div v-for="(car, index) in carsList" :key="index"
                          :class="{'ma-penalty-number-chip--active': selectedCar == car}"
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
         <!--         top ----------------------------------------------------------------------------------------------------------------------- -->
         <!--         body ----------------------------------------------------------------------------------------------------------------------- -->
         <div class="row">
            <div class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <div class="ma-penalties__card--header">
                     <div v-for="(item,index) in cardTabs" :key="index"
                          :class="{'ma-penalties__card--header__item--active': activeCardTab ==  item.id}"
                          class="ma-penalties__card--header__item"
                          @click="activeCardTab = item.id"
                     >
                        {{ $t(item.title) }}
                     </div>
                  </div>
                  <div class="ma-penalties__card--body">
                     <div v-if="activeCardTab == 1" class="ma-penalties__card--body__penalties">
                        <div v-if="false" class="ma-penalties__card--body__no-results">
                           <img alt="" src="/images/penalty-no-result.png">
                           <p>{{ $t('no_protocols') }}</p>
                        </div>
                        <div class="ma-penalties__card--body__penalties--item all-items">
                           <div class="ma-left">
                              <custom-checkbox v-model="checkboxtest"/>
                              <p>{{ $t('select_all') }}</p>
                           </div>
                           <div class="ma-right">
                              <button class="ma-btn-green-outlined">{{ $t('pay_for_selected') }}</button>
                           </div>
                        </div>
                        <div class="ma-penalties__card--body__penalties--item">
                           <div class="ma-left">
                              <div class="ma-left__checkbox">
                                 <custom-checkbox v-model="checkboxtest"/>
                              </div>
                              <div class="ma-left__content">
                                 <p>EQ12114578</p>
                                 <strong>110.80 AZN</strong>
                              </div>
                           </div>
                           <div class="ma-right">
                              <p class="ma-right__amount">
                                 11.80 AZN
                              </p>
                           </div>
                        </div>
                        <div class="ma-penalties__card--body__penalties--item">
                           <div class="ma-left">
                              <div class="ma-left__checkbox">
                                 <custom-checkbox v-model="checkboxtest"/>
                              </div>
                              <div class="ma-left__content">
                                 <p>EQ12114578</p>
                              </div>
                           </div>
                           <div class="ma-right">
                              <protocol-details-button/>

                              <protocol-payment-button style="margin-left: 8px"/>
                           </div>
                        </div>
                     </div>
                     <div v-if="activeCardTab == 2" class="ma-penalties__card--body__penalty_history">
                        <div class="ma-penalties__card--body__penalties--item">
                           <div class="ma-left">
                              <div class="ma-left__checkbox">
                                 <custom-checkbox v-model="checkboxtest"/>
                              </div>
                              <div class="ma-left__content">
                                 <p>EQ12114578</p>
                                 <strong>110.80 AZN</strong>
                              </div>
                           </div>
                           <div class="ma-right">
                              <p class="ma-right__amount">
                                 11.80 AZN
                              </p>
                           </div>
                        </div>
                        <div class="ma-penalties__card--body__penalties--item">
                           <div class="ma-left">
                              <div class="ma-left__checkbox">
                                 <custom-checkbox v-model="checkboxtest"/>
                              </div>
                              <div class="ma-left__content">
                                 <p>EQ12114578</p>
                              </div>
                           </div>
                           <div class="ma-right">
                              <button
                                 :class="[
                                        'btn',
                                        'full-width',
                                        'btn--white',
                                        'btn-dark-text',
                                        { 'pointer-events-none': pending },
                                      ]"
                                 type="button"
                              >
                                 {{ $t('detail') }}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div class="col-12 col-md-6">
               <div class="ma-penalties__card">
                  <h2 class="ma-title--md">{{ $t('my_vehicle_info') }}</h2>
                  <template v-if="selectedCar && mainSpecs">
                     <div v-for="(spec,index) in mainSpecs" :key="index + 654" class="ma-penalties__card--car-specs">
                        <div v-for="(value,key) in spec" class="ma-penalties__card--car-specs__item">
                           <p>{{ $t(key) }}</p>
                           <strong>{{ value }}</strong>
                        </div>
                     </div>
                  </template>
               </div>
            </div>
         </div>
         <!--         body ----------------------------------------------------------------------------------------------------------------------- -->
         <!--         body ----------------------------------------------------------------------------------------------------------------------- -->
         <!--         body ----------------------------------------------------------------------------------------------------------------------- -->
         <no-ssr>
            <template v-if="cars.data && cars.data.length">

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

            <template v-if="true">
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

import GarageNav from '~/components/garage/GarageNav'
import GarageEmpty from '~/components/garage/GarageEmpty'
import CarsList from '~/components/garage/CarsList'
import CheckDriverPoints from '~/components/garage/CheckDriverPoints'
import ListOfAttorneys from '~/components/garage/loa/ListOfAttorneys'
import CustomCheckbox from "~/components/forms/CustomCheckbox";
import ProtocolDetailsButton from "~/components/garage/ProtocolDetailsButton";
import ProtocolPaymentButton from "~/components/garage/ProtocolPaymentButton";

export default {
   name: 'pages-garage-index',
   mixins: [UserDataMixin, MenusDataMixin],
   layout: 'garageLayout',
   components: {
      ProtocolPaymentButton,
      ProtocolDetailsButton,
      CustomCheckbox,
      ListOfAttorneys,
      GarageNav,
      GarageEmpty,
      CarsList,
      CheckDriverPoints,
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
         this.selectedCar = this.cars.data[0];
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
      getCarProtocols() {
         this.$store.dispatch('garage/getProtocols', {id: this.selectedCar.car_id, history: 0})
      },
      selectCar(car) {
         this.selectedCar = car;
         this.getCarProtocols();
      }
   },
   computed: {
      ...mapGetters({
         cars: 'garage/cars',
         attorneys: 'garage/attorneys',
         protocols: 'garage/protocols',
      }),
      crumbs() {
         return [{name: this.$t('garage')}]
      },
      cardTabs() {
         return [
            {
               id: '1',
               title: 'penalties'
            },
            {
               id: '2',
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
         searchNumber: "",
         activeCardTab: 1,
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
         checkboxtest: true,

      }
   }
}
</script>
