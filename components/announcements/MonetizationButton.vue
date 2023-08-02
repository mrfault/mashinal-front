<template>
   <component
      :is="tag"
      :class="{
      [classes]: classes,
      [`btn btn--${className} full-width`]: !classes,
      'disabled': disabled
    }"

      @click.prevent="openPaymentModal()"
   >
      <div :class="{'disabled': disabled}">


         {{ $t('featured_ads_2') }}

         <inline-svg src="/icons/megaphone.svg"/>
         <modal-popup
            :modal-class="'larger monetization-popup'"
            :title="$t('featured_ads_2')"
            :toggle="showPaymentModal"
            @close="showPaymentModal = false"
         >

            <div class="ads_statics">
               <div>{{ $t('ads_title') }}</div>
            </div>

            <hr/>

            <div class="radio-items">

               <label v-for="(priceItem,index) in priceList" class="radio-container">

                  {{ priceItem.days }} {{ $t('ads_day') }} - {{ priceItem.price }} AZN
                  <input :checked="index==0 ? 'checked' : null" name="package" type="radio"
                         @change="selectPackage(priceItem.days,priceItem.price)">
                  <span class="checkmark"></span>
               </label>
            </div>


            <hr>
            <h4 class="paymentMethods mt-5 mb-3">{{ $t('payment_method') }}</h4>

            <div class="d-flex">
               <label class="radio-container" style="width: 50%;">
                  {{ $t('pay_with_card') }}
                  <input :checked="paymentMethod=='card'" name="payment_type" type="radio"
                         @change="paymentMethod='card'">
                  <span class="checkmark"></span>
               </label>


               <label v-if="this.$auth.loggedIn && this.user.balance>10 && this.user.balance>this.price.value"
                      class="radio-container">
                  {{ $t('balans') }}
                  <input :checked="paymentMethod=='balance'" name="payment_type" type="radio"
                         @change="paymentMethod='balance'">
                  <span class="checkmark"></span>
               </label>
            </div>

            <hr/>
            <div class="row terminal-section">
               <div class="col-md-5">
                  <terminal-info-button popup-name="monetization-popup"/>
               </div>
               <div class="col-md-7">
                  <p class="description">{{ $t('ad_can_be_paused') }}</p>


               </div>
            </div>

            <div class="modal-sticky-bottom">
               <hr/>
               <div class="row">

                  <div class="col-12 col-lg-12 mt-2 mt-lg-0">
                     <button
                        :class="['btn btn--green full-width', { pending }]"
                        @click="getAnAd"
                     >
                        {{ $t('pay') }}
                     </button>
                  </div>
               </div>
            </div>
         </modal-popup>
         <terminal-info-popup
            name="monetization-popup"
            @close="showPaymentModal = true"
            @open="showPaymentModal = false"
         />
      </div>
   </component>
</template>

<script>
import {PaymentMixin} from '~/mixins/payment'
import {mapGetters} from 'vuex'

export default {
   mixins: [PaymentMixin],

   props: {
      className: {
         default: 'red-opacity-2',
      },
      multipleAnnouncements: {
         default: () => []
      },
      multiple: {
         type: Boolean,
         default: false,
      },
      classes: {
         default: '',
      },
      tag: {
         default: 'button',
         type: String
      },
      announcement: {},
      disabled: Boolean,
   },

   data() {
      return {
         pending: false,
         priceList: [],
         day: {
            value: 7,
            min: 1,
            max: 30,
         },
         price: {
            value: 0,
            min: 0.5,
            max: 1,
         },
      }
   },

   computed: {
      ...mapGetters(['user']),
      ...mapGetters({
         bankingCards: 'bankingCards/bankingCards'
      }),

      totalBalance() {
         let balance = this.user ? this.user.balance : 0;
         if (this.user && this.user?.id === this.announcement?.user_id) {
            if (this.announcement.is_autosalon)
               return this.$sum(balance, this.announcement.user.autosalon.balance)
            else if (this.announcement.is_part_salon)
               return this.$sum(balance, this.announcement.user.part_salon.balance)
            else if (this.announcement.is_external_salon)
               return this.$sum(balance, this.announcement.user.external_salon.balance)
            return balance
         } else {
            if (this.user.autosalon)
               return this.$sum(balance, this.user.autosalon.balance)
            else if (this.user.part_salon)
               return this.$sum(balance, this.user.part_salon.balance)
            else if (this.user.external_salon)
               return this.$sum(balance, this.user.external_salon.balance)
            return balance
         }

      },
      pricesForPlan() {
         return this.priceList.map((item) => parseFloat(item.price))
      },
      availablePlans() {
         return (
            this.priceList.find(
               (item) => item.price == this.price.value,
            )?.prices || []
         )
      },
      daysForPlan() {
         return this.availablePlans.map((item) => item.days)
      },
      selectedPlan() {
         return (
            this.priceList.find((item) => item.days === this.day.value) || {}
         )
      },
      haveBalanceToPay() {
         return parseFloat(this.selectedPlan.price) <= this.totalBalance
      },
   },

   methods: {
      selectPackage(day, price) {
         this.day.value = day
         this.price.value = price

         if (this.user.balance < price && this.paymentMethod == 'balance') {
            this.paymentMethod = 'card'
         }
      },
      async getAnAd() {
         if (this.pending) return
         this.pending = true
         if (!this.haveBalanceToPay) {
            this.paymentMethod = 'card'
         }

         console.log(this.selectedPlan)

         let form = {
            id_unique: this.announcement.id_unique,
            monetize_id: this.selectedPlan.id,
            type: this.paymentMethod,
            card_id: this.bankingCard
         };

         if (this.multiple) {
            delete form.id_unique;
            form['announcements'] = this.multipleAnnouncements.map(item => ({id_unique: item.id_unique}))
         }
         const res = await this.$axios.$post(
            `/monetization/start?is_mobile=${
               this.isMobileBreakpoint ? 'true' : 'false'
            }`,
            form,
         )
         if (this.paymentMethod === 'card') {
            if (!res?.data?.redirect_url) {
               await this.$nuxt.refresh();
               this.updatePaidStatus({
                  type: 'success',
                  text: this.$t('ad_started'),
                  title: this.$t('success_payment')
               });
               this.pending = false;
            } else {
               this.pending = false
               this.showPaymentModal = false
               this.$nuxt.$emit('refresh-my-announcements')
               this.handlePayment(res, false, this.$t('ad_started'))
            }
         } else {
            await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
            this.pending = false
            this.showPaymentModal = false
            this.$nuxt.$emit('refresh-my-announcements')
            this.updatePaidStatus({
               type: 'success',
               text: this.$t('ad_started'),
               title: this.$t('success_payment'),
            })
         }
      },
      openPaymentModal() {
         if (!this.disabled)
            this.showPaymentModal = true
         else return
      },
   },

   created() {
      this.$axios.$get('/monetization/price/list').then((res) => {
         this.priceList = res;
         this.price.value = res[0].price;
         this.day.value = res[0].days;

         /*      this.price.min = this.pricesForPlan[0]
               this.price.value = this.pricesForPlan[2]
               this.price.max = this.pricesForPlan[this.pricesForPlan.length - 1]*/
      })
   }
}
</script>

<style lang="scss">
.btn--red-opacity-2 {
   .disabled {
      cursor: context-menu;
      opacity: 50%;
   }
}
</style>
