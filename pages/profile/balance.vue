<template>
   <div class="pages-profile-balance pt-2 pt-lg-5">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <div class="row">
            <div class="col-lg-4">
               <div class="card mb-2 mb-lg-3">
                  <h2 class="title-with-line mt-n1 mb-n1" v-if="isMobileBreakpoint">
                     <span>{{ $t('wallet_balance') }}</span>
                  </h2>
                  <div
                     class="increase-balance-info"
                  >
                     <icon name="wallet" class="mb-2"/>
                     <strong class="mb-1">
                        {{ $readNumber(totalBalance) }} ALManat
                     </strong>
                     <p v-if="!isMobileBreakpoint">{{ $t('wallet_balance') }}</p>
                     <template v-if="user.autosalon || user.part_salon || user.external_salon">
                        <hr/>
                        <div class="row justify-content-center">
                           <div class="col-12 text-medium mb-1">
                              {{ $t('is_main') }}: {{ $readNumber(user.balance) }} ALM
                           </div>
                           <div class="col-auto text-medium" v-if="user.autosalon">
                              {{ $t('salon') }}:
                              {{ $readNumber(user.autosalon.balance) }} ALM
                           </div>
                           <div class="col-auto text-medium" v-if="user.part_salon">
                              {{ $t('shop') }}:
                              {{ $readNumber(user.part_salon.balance) }} ALM
                           </div>
                           <div class="col-auto text-medium" v-if="user.external_salon">
                              {{ $t('salon') }}:
                              {{ $readNumber(user.external_salon.balance) }} ALM
                           </div>
                        </div>
                     </template>
                  </div>
               </div>
               <div class="mb-2 mb-lg-0" ref="increase" id="increasebalance">
                  <div
                     class="card increase-balance-form"
                     :class="{ 'increase-balance-animation': balanceHasAnimation }"
                  >
                     <form class="form" @submit.prevent="increaseBalance" novalidate>
                        <h2 class="title-with-line">
                           <span>{{ $t('replenishment') }}</span>
                        </h2>
                        <div class="mb-2 mb-lg-3">
                           <form-text-input
                              type="number"
                              v-model="form.money"
                              :placeholder="$t('payment_amount')"
                           />
                           <select-banking-card
                              v-if="bankingCards.length"
                              :show-card-image="false"
                              :value="bankingCard"
                              @input="bankingCard = $event"
                              class="mt-2 mt-lg-3"
                           />
                        </div>
                        <p>* {{ $t('enter_the_amount_in_azn', {min: minAmount}) }}</p>
                        <hr/>
                        <button
                           type="submit"
                           :class="[
                    'btn btn--green full-width',
                    { pending, disabled: form.money < this.minAmount },
                  ]"
                        >
                           {{ $t('replenish') }}
                        </button>
                     </form>
                  </div>
                  <div>
                     <banking-cards/>
                  </div>
               </div>
            </div>
            <div class="col-lg-8">
               <div class="card mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
                  <div class="payment-history-rows">
                     <div class="row less-cols head justify-content-between flex-nowrap">
                        <span class="payment-service">
                           <span>{{ $t('transaction') }}</span>
                         </span>
                        <span class="payment-price">
                           <span>{{ $t('payment_amount') }}</span>
                         </span>
                        <span class="payment-date">
                           <span>{{ $t('date') }}</span>
                         </span>
                     </div>
                  </div>
               </div>
               <div class="card">
                  <div class="payment-history-rows">
                     <div
                        :class="[
                           'payment-history-info',
                           { 'mb-2 mb-lg-4': myBalanceHistory.data.length },
                         ]"
                        :key="0"
                     >
                        <template v-if="!isMobileBreakpoint ">
                           <button
                              class="btn btn--grey pointer-events-none"
                              v-if="myBalanceHistory.data.length"
                           >
                              <icon name="refresh"/>
                              {{ $moment(myBalanceHistory.data[0].created_at).format('DD.MM.YYYY') }}
                           </button>
                           <div class="mt-2">
                              <button
                                 @click="filterHistory(0)"
                                 :class="{
                        'btn--dark-blue-2': activeFilter === 0,
                        'btn--dark-blue-2-outline': activeFilter !== 0,
                      }"
                                 class="btn btn-custom-border mr-2"
                              >
                                 {{ $t('all') }}
                              </button>
                              <button
                                 @click="filterHistory(1)"
                                 :class="{
                        'btn--dark-blue-2': activeFilter === 1,
                        'btn--dark-blue-2-outline': activeFilter !== 1,
                      }"
                                 class="btn btn-custom-border mr-2"
                              >
                                 {{ $t('last_one_week') }}
                              </button>
                              <button
                                 @click="filterHistory(2)"
                                 :class="{
                        'btn--dark-blue-2': activeFilter === 2,
                        'btn--dark-blue-2-outline': activeFilter !== 2,
                      }"
                                 class="btn btn-custom-border mr-2"
                              >
                                 {{ $t('last_month') }}
                              </button>
                              <button
                                 @click="filterHistory(3)"
                                 :class="{
                        'btn--dark-blue-2': activeFilter === 3,
                        'btn--dark-blue-2-outline': activeFilter !== 3,
                      }"
                                 class="btn btn-custom-border"
                              >
                                 {{ $t('last_6_month') }}
                              </button>
                           </div>
                        </template>
                        <template v-if="!myBalanceHistory.data.length">
                           <div class="not-found" style="padding: 215px 0;">
                              <img src="/img/no_transactions.png"/>
                              <span class="d-block text-left mt-2 mb-3 mb-lg-0">
                      {{ $t('no_payments_yet') }}
                    </span>
                           </div>
                        </template>
                     </div>
                     <div
                        class="row less-cols justify-content-between flex-nowrap"
                        v-for="(row, i) in myBalanceHistory.data"
                        :key="i + 1"
                     >
                      <span class="payment-service">
                          <span>{{ $t(row.operation_key) }}</span>&nbsp;

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
                           ( <nuxt-link :to="$localePath('/registration-marks/'+row.what_bought.id_unique)"> {{
                              row.what_bought.id_unique
                           }}</nuxt-link> )
                        </template>


                         <template v-if="row.operation_key === 'package_bought'">
                           ( <nuxt-link :to="$localePath('/agreement')"> {{
                              row.what_bought.package.name[locale]
                           }}</nuxt-link> )
                        </template>
                      </span>

                        <span class="payment-price">
                  <span
                     :class="
                      row.operation_type === '+' ? 'text-green' : 'text-red'
                    "
                  >
                    {{ row.operation_type }}
                    {{ row.price }}
                    {{
                        row.provider === 'balance' ||
                        row.operation_key === 'ad_stopped'
                           ? 'ALM'
                           : '₼'
                     }}
                  </span>
                </span>
                        <span class="payment-date">
                  <span>
                    {{
                        $moment(row.created_at).format(
                           isMobileBreakpoint ? 'DD.MM' : 'HH:mm | DD.MM.YYYY',
                        )
                     }}
                  </span>
                </span>
                     </div>
                  </div>
               </div>
               <infinite-loading
                  :key="refreshInfinity"
                  :type="activeFilter"
                  action="getMyBalanceHistoryWithoutMutate"
                  getter="myBalanceHistory"
                  class-name="mt-3 mt-lg-4"
                  :per-page="10"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<style>
.btn-custom-border {
   border: 1px solid rgba(36, 110, 178, 0.2);
}
</style>

<script>
import {mapGetters, mapState} from 'vuex'
import BankingCards from '~/components/payments/BankingCards'
import {PaymentMixin} from '~/mixins/payment'

export default {
   name: 'pages-profile-balance',
   middleware: 'auth_general',
   mixins: [PaymentMixin],
   components: {
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
         return [{name: this.$t('balans')}]
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
