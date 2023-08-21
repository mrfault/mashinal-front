<template>
   <component
      :is="tag"
      :class="{
      [classes]: classes,
      [`btn btn--${className} full-width`]: !classes,
      'disabled': disabled
    }"

      @click="openPaymentModal"
   >
      <div :class="['d-flex align-items-center', {'disabled': disabled}]">
         {{ $t('featured_ads_2') }}

         <inline-svg src="/icons/megaphone.svg"/>

         <modal-popup
            :modal-class="'monetization-popup'"
            :title="$t('featured_ads_4')"
            :toggle="showPaymentModal"
            @close="showPaymentModal = false"
         >
            <div class="monetization-popup__inner">
               <div class="ads_statics">
                  <inline-svg src="/icons/stars.svg"/>
                  <span>{{ $t('ads_title') }}</span>
               </div>

               <div class="radio-items">
                  <label v-for="(priceItem, index) in priceList" class="radio-container">
                     <div class="radio-container__description">
                        <h6>{{ priceItem.days }} {{ $t('ads_day') }}</h6>
                        <h5>{{ priceItem.price }} AZN</h5>
                     </div>

                     <input
                        :checked="index == 0 ? 'checked' : null"
                        name="package"
                        type="radio"
                        @change="selectPackage(priceItem.days, priceItem.price)"
                     >

                     <span class="checkmark"></span>
                  </label>
               </div>

               <h3 class="monetization-popup__title">{{ $t('payment_method') }}</h3>

               <div class="radio-items payment">
                  <label v-for="item in paymentMethods" class="radio-container">
                     <div class="radio-container__description">
                        <h5>{{ item.name }}</h5>
                     </div>

                     <input
                        :checked="item.id === paymentType ? 'checked' : null"
                        name="payment_type"
                        type="radio"
                        @change="handlePaymentType(item.id)"
                     >

                     <span class="checkmark"></span>
                  </label>

                  <label
                     v-if="this.$auth.loggedIn && this.user.balance > 10 && this.user.balance > this.price.value"
                     class="radio-container"
                  >
                     <div class="radio-container__description">
                        <h5>{{ $t('balans') }}</h5>
                     </div>

                     <input
                        :checked="paymentMethod === 'balance'"
                        name="payment_type"
                        type="radio"
                        @change="paymentMethod = 'balance'"
                     >
                     <span class="checkmark"></span>
                  </label>
               </div>

               <div v-if="paymentType === 1" class="modal-sticky-bottom">
                  <div class="row">
                     <div class="col-12 col-lg-12 mt-2 mt-lg-0">
                        <button
                           :class="['btn btn--light-green full-width', { pending }]"
                           @click="getAnAd"
                        >
                           {{ $t('pay') }}
                        </button>
                     </div>
                  </div>
               </div>

               <terminal-info-button v-else popup-name="monetization-popup"/>
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
         paymentType: 1,
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
      ...mapGetters({
         user: 'user',
         bankingCards: 'bankingCards/bankingCards',
         monetizationPriceList: 'monetizationPriceList',
      }),

      totalBalance() {
         let balance = this.user ? this.user?.balance : 0;
         if (this.user && this.user?.id === this.announcement?.user.id) {
            if (this.announcement?.is_auto_salon)
               return this.$sum(balance, this.announcement?.user?.auto_salon?.balance)
            else if (this.announcement?.is_part_salon)
               return this.$sum(balance, this.announcement?.user?.part_salon?.balance)
            else if (this.announcement?.is_external_salon)
               return this.$sum(balance, this.announcement?.user?.external_salon?.balance)
            return balance
         } else {
            if (this.user?.autosalon)
               return this.$sum(balance, this.user?.auto_salon?.balance)
            else if (this.user?.part_salon)
               return this.$sum(balance, this.user?.part_salon?.balance)
            else if (this.user?.external_salon)
               return this.$sum(balance, this.user?.external_salon?.balance)
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

      paymentMethods() {
         return [
            {id: 1, name: this.$t('pay_with_card')},
            {id: 2, name: this.$t('pay_with_terminal_2')},
         ]
      }
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

      openPaymentModal(e) {

         if (this.announcement.status != 1) {
            e.stopPropagation()
            // this.$toasted.error('announcement_cannot_monetization')
            return;

         } else {
            e.stopPropagation();
            this.showPaymentModal = true;
         }
      },

      handlePaymentType(id) {
         this.paymentMethod = 'card';
         this.paymentType = id;
      },
      async getPriceList() {
         await this.$store.dispatch('getMonetizationPriceList')
         this.priceList = this.monetizationPriceList;
         this.price.value = this.monetizationPriceList[0].price;
         this.day.value = this.monetizationPriceList[0].days;
      },
   },

   created() {
      this.getPriceList()
   }
}
</script>

<style lang="scss">
.btn--red-opacity-2 {
   svg {
      margin-left: 9px;
   }

   &.disabled {
      cursor: context-menu;
      opacity: 50%;
      pointer-events: all;
      @media (min-width: 992px) {
         .btn--red-opacity-2:hover {
            color: #fff;
            border-radius: 8px;
            border: none;
            background-color: rgba(248, 23, 52, 0.72);
         }

      }
   }
}
</style>
