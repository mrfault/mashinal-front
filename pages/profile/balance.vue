<template>
   <div class="pages-profile-balance">
      <div class="">

         <portal to="breadcrumbs">
            <breadcrumbs :crumbs="crumbs"/>
         </portal>

         <component
            :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
            :bar-title="$t('my_balance')"
            @back="$router.push(pageRef || $localePath('/profile/balance'))"
            height-auto>

            <div class="row" v-if="!isMobileBreakpoint">
               <div class="col-md-12 mb-0 mb-lg-4">
                  <h1>{{ $t('my_balance') }}</h1>
               </div>
            </div>
            <div class="row pt-lg-0 pt-5">
               <div class="col-md-5 col-xs-12 p-0 p-1">
                  <div class="card card-gray d-flex justify-content-start align-items-center">
                     <div class="icon-cashier">
                        <img src="/img/cashier.png" alt="">
                     </div>
                     <div class="balance-info">
                        <h2>{{ $readNumber(totalBalance) }} ALManat</h2>
                        <p>{{ $t('wallet_balance') }}</p>
                     </div>
                  </div>
               </div>
               <div class="col-md-7 col-xs-12 p-0 p-1">
                  <div class="card" :class="{ 'increase-balance-animation': balanceHasAnimation }">
                     <div class="d-flex justify-content-between align-items-center">
                        <h2 class="increase-balance-title">{{ $t('replenishment') }}</h2>
                        <p class="saved-card-text" @click="nextStep">{{ $t('saved_card') }}</p>
                     </div>
                     <div class="mt-3">
                        <form class="form" @submit.prevent="increaseBalance" novalidate>
                           <div class="form-group d-flex justify-content-between align-items-center">
                              <form-text-input
                                 type="number"
                                 v-model="form.money"
                                 :placeholder="$t('payment_amount')"
                              />

                              <select-banking-card
                                 style="display: none"
                                 v-if="bankingCards.length"
                                 :show-card-image="false"
                                 :value="bankingCard"
                                 @input="bankingCard = $event"
                                 class="mt-2 mt-lg-3"
                              />

                              <button type="submit" :class="['btn btn--green ml-2 full-width', { pending, disabled: form.money < this.minAmount }]">
                                 {{ $t('replenish') }}
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                  <div class="row">
                     <div class="col-md-12">
                        <ul class="tabs">
                           <li
                              :class="['tabs__item', {'active' : activeFilter === 0 }]"
                              :key="0"
                              @click="filterHistory(0)"
                           >{{ $t('all') }}</li>

                           <li
                              :class="['tabs__item', {'active' : activeFilter === 1 }]"
                              :key="1"
                              @click="filterHistory(1)"
                           >{{ $t('last_one_week') }}</li>

                           <li
                              :class="['tabs__item', {'active' : activeFilter === 2 }]"
                              :key="2"
                              @click="filterHistory(2)"
                           >{{ $t('last_month') }}</li>

                           <li
                              :class="['tabs__item', {'active' : activeFilter === 3 }]"
                              :key="3"
                              @click="filterHistory(3)"
                           >{{ $t('last_6_month') }}</li>
                        </ul>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-md-12">
                        <div class="table-responsive">
                           <table class="table" v-if="myBalanceHistory.data.length > 0">
                              <thead>
                                 <tr>
                                    <th>{{ $t('transaction') }}</th>
                                    <th>{{ $t('payment_amount') }}</th>
                                    <th>{{ $t('date') }}</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr v-for="(row, i) in myBalanceHistory.data" :key="i + 1">
                                    <td>
                                       <span class="payment-service">
                                          <span>{{ $t(row.operation_key) }} </span>&nbsp;
                                          <template
                                             v-if="row.what_bought && row.what_bought_type === 'App\\GarageCar' && row.operation_key !== 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/garage?id='+row.what_bought_id)">{{
                                                row.what_bought.car_number
                                             }}</nuxt-link> )
                                          </template>

                                          <template
                                             v-else-if="row.what_bought && ['App\\Announcement'].includes(row.what_bought_type) && row.operation_key !== 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/cars/announcement/'+row.what_bought.id_unique)">{{
                                                row.what_bought.id_unique
                                             }}</nuxt-link> )
                                          </template>

                                          <template
                                             v-else-if="row.what_bought && ['App\\Motorcycle','App\\Scooter','App\\MotoAtv'].includes(row.what_bought_type) && row.operation_key !== 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/moto/announcement/'+row.what_bought.id_unique)">{{
                                                row.what_bought.id_unique
                                             }}</nuxt-link> )
                                          </template>

                                          <template
                                             v-else-if="row.what_bought && row.what_bought_type === 'App\\Commercial' && row.operation_key !== 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/commercial/announcement/'+row.what_bought.id_unique)">{{
                                                row.what_bought.id_unique
                                             }}</nuxt-link> )
                                          </template>

                                          <template
                                             v-else-if="row.what_bought && row.what_bought_type === 'App\\Part' && row.operation_key !== 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/parts/announcement/'+row.what_bought.id_unique)">{{
                                                row.what_bought.id_unique
                                             }}</nuxt-link> )
                                          </template>

                                          <template v-if="row.operation_key === 'plate_announce_key'">
                                             ( <nuxt-link :to="$localePath('/plates/'+row.what_bought.id_unique)"> {{
                                                row.what_bought.id_unique
                                             }}</nuxt-link> )
                                          </template>
                                       </span>
                                    </td>
                                    <td>
                                       <span :class="row.operation_type === '+' ? 'text-green' : 'text-red'">
                                         {{ row.operation_type }}
                                         {{ row.price }}
                                         {{ row.provider === 'balance' ||
                                             row.operation_key === 'ad_stopped'
                                                ? 'ALM'
                                                : '₼'
                                         }}
                                       </span>
                                    </td>
                                    <td>
                                       <span>
                                          {{
                                             $moment(row.created_at).format(
                                                isMobileBreakpoint ? 'DD.MM' : 'HH:mm | DD.MM.YYYY',
                                             )
                                          }}
                                       </span>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                           <template v-else>
                              <table class="table">
                                 <tr>
                                    <td colspan="3" class="text-center" style="border: 0">
                                       {{ $t('no_payments_yet') }}
                                    </td>
                                 </tr>
                              </table>
                           </template>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </component>

         <modal-popup
            :toggle="openModal"
            :title="$t('saved_card')"
            :modal-class="'larger cards'"
            @close="openModal = false">
            <div>
               <banking-cards
                  :cards="bankingCards"
                  :selected-card="bankingCard"
                  @input="bankingCard = $event"
                  @close="openModal = false"
               />
            </div>
         </modal-popup>
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapState} from 'vuex'
   import BankingCards from '~/components/payments/BankingCards'
   import {PaymentMixin} from '~/mixins/payment'
   import ComeBack from "~/components/elements/ComeBack.vue";

   export default {
      name: 'pages-profile-balance',
      middleware: 'auth_general',
      mixins: [PaymentMixin],
      layout: 'garageLayout',
      components: {
         ComeBack,
         BankingCards,
      },
      nuxtI18n: {
         paths: {
            az: '/profil/balans',
         },
      },

      beforeDestroy() {
         this.mutate({property: 'temporaryLazyData', value: {}});
      },
      head() {
         return this.$headMeta({
            title: this.$t('balans'),
         })
      },
      data() {
         return {
            openModal: false,
            activeFilter: 0,
            refreshInfinity: 0,
         }
      },
      async asyncData({store, app, $auth}) {
         await Promise.all([
            store.dispatch('getMyBalanceHistory'),
            store.dispatch('bankingCards/getBankingCards'),
            $auth.fetchUser(),
         ])

         return {
            pending: false,
            minAmount: app.$env.DEV ? 0.01 : 1,
            form: {
               money: '',
            },
         }
      },
      computed: {
         ...mapState(['balanceHasAnimation']),
         ...mapGetters(['myBalanceHistory']),

         crumbs() {
            return [
               {name: this.$t('dashboard'), route: `${this.user.autosalon ? '/dashboard/1' : '/garage-services'}`},
               {name: this.$t('balans')}
            ]
         },
         totalBalance() {
            return this.$sum(
               this.user.balance,
               this.user.autosalon?.balance || 0,
               this.user.part_salon?.balance || 0,
               this.user.external_salon?.balance || 0,
            )
         },
      },
      methods: {
         nextStep() {
            this.openModal = true;
         },
         filterHistory(type) {
            this.activeFilter = type
            this.mutate({property: 'temporaryLazyData', value: {}});
            this.refreshInfinity++;
            this.$store.dispatch('getMyBalanceHistory', {page: 1, type: type})
         },
         async increaseBalance() {
            if (this.pending || this.form.money < this.minAmount) return
            this.pending = true
            try {
               const res = await this.$axios.$post(
                  `/payment/addBalance?is_mobile=${this.isMobileBreakpoint}`,
                  {...this.form, card_id: this.bankingCard},
               )
               if (!res?.data?.redirect_url) {
                  await this.$nuxt.refresh();
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('balance_increased'),
                     title: this.$t('success_payment')
                  }).then(r => {
                     console.log(r);
                  });
                  this.pending = false;
               } else {
                  this.pending = false
                  this.form.money = ''
                  this.handlePayment(res, false, this.$t('balance_increased'))
               }
            } catch (err) {
               this.pending = false
            }
         },
         removeAnimationbalanceIncrement() {
            setTimeout(() => {
               this.$store.commit('mutate', {
                  property: 'balanceHasAnimation',
                  value: false
               });
            }, 1000)

         },
      },
      mounted() {
         this.$nextTick(() => {
            if (this.$route.query.scrollto) {
               let ref = this.$refs[this.$route.query.scrollto]
               this.$router.replace({query: null})
               if (ref)
                  setTimeout(() => {
                     this.scrollTo(ref, [-15, -20])
                     ref.classList.add('underline')
                     setTimeout(() => {
                        ref.classList.remove('underline')
                     }, 2000)
                     this.$el?.querySelector('.text-input input')?.focus()
                  }, 300)
            }
         })
         this.removeAnimationbalanceIncrement()
      },
   }
</script>

<style lang="scss">

.card {
   padding: 22px;
   border-radius: 12px;
   border: 1px solid #CDD5DF;
   gap: 20px;
}

.card.card-gray {
   padding: 32px;
   background-color: #EEF2F6;
}

.card-body {
   padding: 0;
}

.card-title {
   font-size: 18px;
   font-weight: 600;
   margin-bottom: 20px;
}

.card-text {
   font-size: 14px;
   font-weight: 400;
   margin-bottom: 20px;
}

.card-text span {
   font-weight: 600;
}

.icon-cashier {
   width: 80px;
   height: 80px;
   angle: -180 deg;
   margin: 0 auto;
}

.balance-info {
   text-align: left;
}

.balance-info h2 {
   font-size: 24px;
   font-weight: 600;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;
}

.balance-info p {
   font-size: 18px;
   font-weight: 500;
   line-height: 22px;
   letter-spacing: 0;
   margin-top: 10px;
}

.increase-balance-title {
   font-size: 24px;
   font-weight: 600;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;

}

.saved-card-text {
   font-size: 17px;
   font-weight: 500;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;
   text-decoration: underline;
   cursor: pointer;
}

.btn--green{
   height: 52px;
   width: 160px;
   border-radius: 8px;
}

table {
   border-collapse:separate;
   border:solid #CDD5DF 1px;
   border-radius: 12px;
   width: 100%;
}

td, th {
   border-top:solid #CDD5DF 1px;
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   text-align: left;
   padding: 24px;
}

td:last-child, th:last-child {
   text-align: right;
}

th {
   border-top: none;
}

td:first-child, th:first-child {
   border-left: none;
}

.tabs {
   display: flex;
   align-items: center;
   justify-content: start;
   margin: 0 0 20px;
}
.tabs .tabs__item {
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   text-align: left;
   color: #4B5565;
   cursor: pointer;
   transition: all .3s ease;
   background-color: transparent;
   border-bottom: 3px solid transparent;
   border-radius: 0;
}
.tabs .tabs__item.active {
   color: #4B5565;
   border-bottom: 3px solid #155EEF;
   border-radius: 0;
}
.tabs .tabs__item:hover,
.tabs .tabs__item:focus {
   color: #4B5565;
   border-bottom: 3px solid #155EEF;
   border-radius: 0;
}

.dark-mode {
   .tabs .tabs__item {
      color: #CDD5DF;
   }
   .tabs .tabs__item.active {
      color: #EEF2F6;
   }
   .tabs .tabs__item:hover,
   .tabs .tabs__item:focus {
      color: #EEF2F6;
   }
   .card, .card.card-gray {
      background-color: #1B2434;
      border: 1px solid #1B2434;
   }
   .balance-info p {
      color: #9AA4B2;
   }
   table {
      border-collapse:separate;
      border: 1px solid #1B2434;
      border-radius: 12px;
      width: 100%;
      background: #1B2434;
   }

   td, th {
      border-top: 1px solid #364152;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0;
      text-align: left;
      padding: 24px;
      color: #CDD5DF;
   }

   td:last-child, th:last-child {
      text-align: right;
   }

   th {
      border-top: none;
   }

   td:first-child, th:first-child {
      border-left: none;
   }
}

@media (max-width: 1250px) {
   td, th {
      padding: 12px;
   }
}

@media (max-width: 992px) {
   td, th {
      padding: 12px;
   }
}

@media (max-width: 370px) {
   td, th {
      padding: 12px;
   }
}


</style>
