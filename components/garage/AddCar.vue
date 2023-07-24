<template>
   <component
      :is="tag"
      :class="
      tag === 'button'
        ? [`btn__blue-outlined`, { 'full-width': isMobileBreakpoint }]
        : 'add-item'
    "
      @click="showModal = true"
   >
      <template v-if="tag === 'button'">
         {{ $t('add_vehicle') }}
         <icon v-if="!isMobileBreakpoint" name="plus"/>
         <icon v-if="isMobileBreakpoint" class="ml-1" name="arrow-right"/>
      </template>
      <div v-else class="add-item_inner">
         <icon name="plus"></icon>
      </div>

      <modal-popup
         :title="$t('add_vehicle')"
         :toggle="showModal"
         modal-class="midsize"
         @close="showModal = false"
      >
         <asan-login-button
            v-if="!hasAsanLoginCopy"
            :fromGarageNav="true"
            :fullWidth="true"
            :has-asan-login="hasAsanLoginCopy"
            :redirectPath="redirectPath"
            @click="redirectToAsanLogin()"
            @closeAddCarPopup="manageModalsInLoading()"
         ></asan-login-button>
         <form class="form" @submit.prevent="checkCarNumber">
            <form-text-input
               v-model="form.car_number"
               :invalid="$v.form.car_number.$error"
               :mask="'99 - A{1,2} - 999'"
               :placeholder="$t('car_number')"
               class="mb-2 mb-lg-3"
            />
            <form-text-input
               v-model="form.tech_id"
               :invalid="$v.form.tech_id.$error"
               :mask="$maskAlphaNumeric('********')"
               :placeholder="$t('tech_id')"
               class="mb-2 mb-lg-3"
            />
            <!--            <div class="info-text mb-2">-->
            <!--               <icon name="alert-circle"/>-->
            <!--               <span>{{ $t('garage_payment_info') }}</span>-->
            <!--            </div>-->
            <p class="remove-vehicle-modal__text-with-info" style="margin-bottom: 24px">
               <inline-svg src="/icons/info-1.svg"/>
               {{ $t('add_vehicle_desc') }}
            </p>
            <div class="protocol-payment-modal__actions">
               <button
                  :class="[
                                        'btn',
                                        'btn--white',
                                        'btn-dark-text',
                                      ]"
                  type="button"
                  @click="showModal = false"
               >
                  {{ $t('reject') }}
               </button>
               <button
                  :class="[
                        'btn btn--green',
                        { pending: pending && !showPaymentModal },
                      ]"
                  type="submit"
               >
                  {{ $t('go_further') }}
               </button>
            </div>
         </form>
      </modal-popup>

      <modal-popup
         :overflow-hidden="isMobileBreakpoint"
         :title="$t('payment')"
         :toggle="showPaymentModal"
         @close="showPaymentModal = false"
         modal-class="midsize"
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
            <strong>{{ price }} AZN</strong>
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
                     @click="showModal = false"
                  >
                     {{ $t('reject') }}
                  </button>
               </div>
               <div class="col-6">
                  <button
                     :class="['btn btn--green full-width', { pending }]"
                     @click="payForCar"
                  >
                     {{ $t('pay') }}
                  </button>
               </div>
            </div>
         </div>
      </modal-popup>

      <terminal-info-popup
         name="garage-add-popup"
         @close="showPaymentModal = true"
         @open="showPaymentModal = false"
      />
      <modal-popup
         :overflow-hidden="isMobileBreakpoint"
         :title="$t('add_car_with_asan_login')"
         :title-logo="isDarkMode ? '/asan_logo_dark_mode.svg' : '/asan_logo.svg'"
         :toggle="showRedirect"
         @close="showRedirect = false"
      >
         <p>{{ $t('asan_login_redirect') }}</p>
         <div
            class="align-items-center d-flex justify-content-center position-relative"
         >
            <animated-spinner/>
            <span style="position: absolute;">{{ timer }}</span>
         </div>
      </modal-popup>
   </component>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {PaymentMixin} from '~/mixins/payment'
import {required} from 'vuelidate/lib/validators'
import AsanLoginButton from '~/components/buttons/AsanLoginButton'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
import asan_login from '~/mixins/asan_login'

export default {
   components: {
      AsanLoginButton,
      AnimatedSpinner,
   },
   props: {
      btnClass: {
         type: String,
         default: 'green',
      },
      tag: {
         type: String,
         default: 'button',
      },
      hasAsanLogin: {
         type: Boolean,
         default: false,
      },
   },
   mixins: [PaymentMixin, asan_login],

   data() {
      return {
         bankingCardRefresh: 0,
         showModal: false,
         pending: false,
         price: 0,
         hasAsanLoginCopy: false,
         redirectPath: 'garage',
         form: {
            car_number: '',
            tech_id: '',
         },
      }
   },
   validations: {
      form: {
         car_number: {required},
         tech_id: {required},
      },
   },
   computed: {
      ...mapGetters({bankingCards: 'bankingCards/bankingCards'}),
      haveBalanceToPay() {
         return parseFloat(this.price) <= this.user.balance
      },

   },
   methods: {
      ...mapActions({
         checkNewCar: 'garage/checkNewCar',
         registerNewCar: 'garage/registerNewCar',
      }),
      async redirectToAsanLogin() {
         if (await this.checkTokenOnly()) {
            this.$router.push(this.$localePath('/garage/asan-cars'))
            return
         }
         // if (this.fromGarageNav) {
         //   this.$emit('closeAddCarPopup', true)
         // }
         if (!this.$auth.loggedIn) {
            return await this.$router.push(
               this.$localePath(`/login?param=garage/asan-cars`),
            )
         } else {
            // if (!hasAsanLogin) {
            this.showModal = false
            this.showRedirect = true
            await this.asanLogin('garage/asan-cars')
            const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
            this.vehicleList = data
            // }else{
            // this.$router.push(this.$localePath('/garage/asan-cars'))
            // }
         }
      },
      async checkCarNumber() {
         this.$v.$touch()
         if (this.pending || this.$v.$error) return
         this.pending = true
         try {
            const res = await this.checkNewCar({
               ...this.form,
               car_number: this.form.car_number.replace(/-|[ ]/g, ''),
            })
            this.pending = false
            if (res.data?.price) {
               this.showModal = false
               this.$v.$reset()
               this.price = res.data.price
               this.showPaymentModal = true
            }
         } catch (err) {
            this.pending = false
         }
      },
      async payForCar() {
         if (this.pending) return
         this.pending = true
         this.form.car_number = this.form.car_number.replace(/-|[ ]/g, '')
         try {
            const res = await this.registerNewCar({
               vehicles: [{...this.form}],
               card_id: this.bankingCard,
               pay_type: this.paymentMethod,
               is_mobile: this.isMobileBreakpoint,
            })
            this.form.car_number = ''
            this.form.tech_id = ''
            this.form.card_id = ''
            if (this.paymentMethod === 'card' && !this.bankingCard) {
               this.pending = false
               this.showPaymentModal = false
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
            } else {
               await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
               this.pending = false
               this.showPaymentModal = false
               this.bankingCard = ''
               this.updatePaidStatus({
                  type: 'success',
                  text: this.$t('car_added'),
                  title: this.$t('success_payment'),
               })
            }
            this.$emit('newVehicleAdded', true)
         } catch (err) {
            this.pending = false
         }
      },
      manageModalsInLoading() {
         this.showModal = false
      },
   },
   async mounted() {
      if (await this.checkTokenOnly()) {
         this.hasAsanLoginCopy = true
         this.vehicleList = this.$set(
            this,
            'vehicleList',
            await this.$axios.$get('/attorney/get_vehicle_list/false'),
         )
      } else {
         this.hasAsanLoginCopy = false
      }
      this.hasAsanLoginCopy = this.hasAsanLogin
   },
}
</script>
