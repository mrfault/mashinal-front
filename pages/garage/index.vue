<template>
   <div class="pages-garage-index ma-penalties">
      <div class="container p-0">
         <div :class="{'flex-wrap': isMobileBreakpoint}" class="d-flex justify-content-between">
            <h2 :class="{'w-100 text-center': isMobileBreakpoint}" class="ma-title--md" style="margin-bottom: 32px">
               {{ $t('penalties') }}
            </h2>
            <div :class="{'mt-2 w-100':isMobileBreakpoint}">
               <add-car @newVehicleAdded="getAllCarsList"/>
            </div>
         </div>

         <!--         numbers/search-->
         <div class="ma-penalties__top">
            <div v-if="cars?.data?.length" :class="{'mr-0 mt-3' : isMobileBreakpoint}" class="ma-penalties__top--search">
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

            <div v-else class="w-100 d-flex flex-wrap justify-content-center">
               <no-results
                  :url="'/new-icons/no-car.svg'"
                  darker
               >
               </no-results>
               <h2 class="ma-title--md text-center w-100">{{ $t('no_vehicle_found') }}</h2>
            </div>

<!--            <pre>{{carsList}}</pre>-->
            <div v-show="carsList?.length" class="ma-penalties__top--numbers">
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
         <div v-if="carsList?.length" class="row">
            <!--            penalties,history, vehicle info(mobile)-->
            <div
               v-if="selectedCar && showLeftCard"
               class="col-12 col-md-6"
            >
               <div class="ma-penalties__card">
                  {{loading}}
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

                  <div v-if="carsList.length" class="ma-penalties__card--body">
                     <!--                     penalties-->
                     <div v-if="activeCardTab == 0" class="ma-penalties__card--body__penalties">

                        <!--                                loading-->
                        <div v-if="loading">
                           <loader />
                        </div>

                        <!--                                content-->
                        <template v-else-if="!loading && protocols && protocols.data && protocols.data.length">
                           <template v-for="(protocol,index) in protocol.filteredList">
                              <protocol-list-item
                                 :protocol="protocol"
                                 @selectProtocol="selectProtocol(protocol)"
                              />
                           </template>
                        </template>

                        <!--                           no results-->
                        <div v-else class="ma-penalties__card--body__no-results">
                           <img alt="" src="/images/penalty-no-result.png">
                           <p v-if="vehiclePassportExpired">{{ $t('vehiclePassportExpired') }}</p>
                           <p v-else-if="carsList.length">{{ $t('no_protocols') }}</p>
                           <p v-else>{{ $t('no_vehicle_found') }}</p>
                        </div>
                     </div>

                     <!--                     history-->
                     <div v-if="activeCardTab == 1" class="ma-penalties__card--body__penalty_history">
                        <div v-if="loading">
                           <loader/>
                        </div>
                        <template v-else-if="!loading && protocols && protocols.data && protocols.data.length">
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
                                    @selectProtocol="selectProtocol(protocol)"
                                 />
                              </template>
                           </template>

                        </template>
                        <div v-else class="ma-penalties__card--body__no-results">
                           <img alt="" src="/images/penalty-no-result.png">
                           <p v-if="vehiclePassportExpired">{{ $t('vehiclePassportExpired') }}</p>
                           <p v-else-if="carsList.length">{{ $t('no_payment_history') }}</p>
                           <p v-else>{{ $t('no_vehicle_found') }}</p>
                        </div>
                     </div>

                     <!--                     vehicle info(mobile)-->
                     <div v-if="activeCardTab == 2" class="ma-penalties__card--body__penalty_history">
                        <vehicle-info
                           :selected-car="selectedCar"
                           @carDataChanged="carDataChanged(selectedCar)"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <!--            vehicle info-->
            <div v-if="carsList.length && !isMobileBreakpoint" class="col-12 col-md-6">
               <vehicle-info
                  v-if="selectedCar && selectedCar.sync_status == 1"
                  :selectedCar="selectedCar"
                  @carDataChanged="carDataChanged(selectedCar)"
               />
            </div>
            <div v-if="carsList.length && selectedCar && selectedCar.sync_status !== 1"
                 class="w-100 d-flex flex-wrap justify-content-center">
               <no-results no-text/>
               <h2 class="ma-title--md w-100 text-center">{{ $t('vehicle_is_processing') }}</h2>
            </div>
         </div>

         <!--         no search results-->
         <div v-if="cars && cars?.data && cars?.data?.length && !carsList?.length"
              class="row flex-wrap justify-content-center" style="height: 500px">
            <no-results class="mb-0"/>
            <h2 class="ma-title--md text-center w-100">{{ $t('no_models_found_for_this_request') }}</h2>
         </div>
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
   import AddCar from "~/components/garage/AddCar";
   import SelectBankingCard from "~/components/payments/SelectBankingCard";
   import ProtocolFiles from "~/components/garage/ProtocolFiles";
   import FsLightbox from 'fslightbox-vue';
   import NoResults from "~/components/elements/NoResults";
   import VehicleInfo from "~/components/garage/VehicleInfo";

   export default {
      name: 'pages-garage-index',
      mixins: [UserDataMixin, MenusDataMixin, PaymentMixin],
      layout: 'garageLayout',
      components: {
         ProtocolPayment,
         ProtocolDetails,
         CustomCheckbox,
         ListOfAttorneys,
         GarageNav,
         GarageEmpty,
         CarsList,
         CheckDriverPoints,
         ProtocolListItem,
         AddCar,
         SelectBankingCard,
         ProtocolFiles,
         FsLightbox,
         NoResults,
         VehicleInfo,
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
         carDataChanged(item) {
            setTimeout(() => {
               this.$route.query.id = item.id;
               this.refreshCarData()
            }, 1500)
         },
         async refreshCarData() {
            await this.getAllCarsList();
            // this.selectedCar = item;
            this.$nuxt.refresh()
         },
         getPayLink(protocol) {
            let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
            return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
         },

         async activateCar() {
            if (this.pending || this.thumbSet) return;
            this.pending = true;
            try {
               const res = await this.activate({
                  id: this.selectedCar.id,
                  card_id: this.bankingCard,
                  pay_type: this.paymentMethod,
                  is_mobile: this.isMobileBreakpoint
               });
               if (this.paymentMethod === 'card' && !this.bankingCard) {
                  this.pending = false;
                  this.showPaymentModal = false;
                  this.handlePayment(res, false, this.$t('car_activated'), 'v2');
               } else {
                  await Promise.all([
                     this.$nuxt.refresh(),
                     this.$auth.fetchUser()
                  ]);
                  this.pending = false;
                  this.showPaymentModal = false;
                  this.bankingCard = '';
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('car_activated'),
                     title: this.$t('success_payment')
                  });
               }
            } catch (err) {
               this.pending = false;
            }
         },

         setInitialSelectedCar(insuranceCase) {
            if (this.$route.query.id && this.cars.data.find(el => el.id == this.$route.query.id)) {
               this.selectedCar = this.cars.data.find(el => el.id == this.$route.query.id)
            } else {
               const carWithSyncStatus1 = this.cars.data.find(el => el.sync_status === 1);
               if (carWithSyncStatus1) {
                  this.selectedCar = carWithSyncStatus1;
               } else {
                  this.selectedCar = this.cars.data[0];
               }
            }
         },

         onInputChange() {
            if (this.searchNumber.trim() === "") {
               this.carsList = this.cars.data;
               this.setInitialSelectedCar();
            } else if (this.isValidInput(this.searchNumber)) {
               this.selectedCar = {};
               this.filterCarNumber();
            } else {
               this.carsList = [];
            }
         }
         ,
         isValidInput(text) {
            const validCharactersRegex = /^[A-Za-z0-9]*$/;
            return validCharactersRegex.test(text);
         }
         ,
         filterCarNumber() {
            const searchCarNumber = this.searchNumber.trim();

            if (
               this.containsRussianLetters(searchCarNumber) ||
               this.containsDisallowedCharacters(searchCarNumber)
            ) {
               this.carsList = [];
               return;
            }

            const initialFilter = this.cars.data.filter((car) =>
               car.car_number.toLowerCase().includes(searchCarNumber.toLowerCase())
            );

            this.carsList = initialFilter.filter((car) => car.sync_status == 1)

            this.selectedCar = this.carsList[0];
            this.loading = true;
            this.getCarProtocols()
         }
         ,
         validateInput(event) {
            const enteredChar = event.key;
            const validCharactersRegex = /^[A-Za-z0-9]*$/;

            if (!validCharactersRegex.test(enteredChar)) {
               event.preventDefault();
            }
         }
         ,
         containsRussianLetters(text) {
            const russianLettersRegex = /[а-яА-ЯЁё]/;
            return russianLettersRegex.test(text);
         }
         ,
         containsDisallowedCharacters(text) {
            const disallowedCharactersRegex = /[^0-9A-Za-z-]/;
            return disallowedCharactersRegex.test(text);
         }
         ,
         formattedCarNumber(carNumber) {
            return carNumber.replace(/(\d{2})([A-Z]+)(\d{3})/, "$1 $2 $3");
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

         async getCarProtocols() {
            if (this.selectedCar && this.selectedCar.id) {
               try {
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
               } catch (e) {
                  this.loading = false;
                  this.vehiclePassportExpired = true;
               }
            } else {
               this.loading = false;
            }
         },
         selectCar(car) {
            this.vehiclePassportExpired = false;
            this.protocol.filteredList = [];
            this.loading = true;
            this.pending = true;
            this.protocol.selected = {};
            this.protocol.allSelected = [];
            // this.loading = true;
            this.selectedCar = car;

            this.protocol.selected = {};

            this.activeCardTab = 0;
            if (this.isMobileBreakpoint && this.selectedCar.status == 0) {
               this.activeCardTab = 2
            }
            this.protocol.filteredList = [];

            if (car.sync_status == 1) {
               this.getCarProtocols();
            }
            this.loading = false;
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
            this.loading = true;
            const res = await this.$store.dispatch('garage/getCarList', {})
            this.carsList = res.data;
            this.loading = false;
            this.setInitialSelectedCar();
         },
         async activatePaymentModal() {
            this.openPaymentModal();
         },

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
            if (!this.isMobileBreakpoint) {
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
            } else if (this.isMobileBreakpoint && this.selectedCar.status !== 1 && this.selectedCar.sync_status == 1) {
               return [
                  {
                     id: '2',
                     title: 'my_vehicle_info',
                  }
               ]
            } else if (this.isMobileBreakpoint && this.selectedCar.sync_status == 1 && this.selectedCar.status == 1) {
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
            }
         },
         showLeftCard() {
            if (!this.isMobileBreakpoint) {
               return this.selectedCar.status == 1
            } else {
               return this.selectedCar.sync_status == 1
            }
         }
      },

      data() {
         return {
            loading: true,
            searchNumber: "",
            activeCardTab: 0,
            selectedCar: null,
            vehiclePassportExpired: false,

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
         }
      },

      watch: {
         'protocol.allSelected':
            {
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