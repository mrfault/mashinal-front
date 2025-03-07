<template>
   <div class="myPackagesBuy">
      <div class="container">
         <ComeBack :text="$t('registration2')" v-if="isMobileBreakpoint" />

         <breadcrumbs :crumbs="crumbs" />

         <div class="myPackagesBuy__inner">
            <div class="divider">
               <div class="myPackagesBuy__package myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">{{ $t('registration2') }}</h4>
                  <h4 class="myPackagesBuy__cart-subtitle">{{ selectedPackage.name }} {{ $t('package2') }}</h4>

                  <ul class="myPackagesBuy__package-list">
                     <li
                        :class="['myPackagesBuy__package-list_item', {'opacity' : !option.checked}]"
                        v-for="option in selectedPackage.items"
                        :key="option.id"
                     >
                        <inline-svg :src="'/icons/check2.svg'" v-if="option.checked" />
                        <inline-svg :src="'/icons/close2.svg'" v-else />

                        <span>{{ option.text }}</span>
                     </li>
                  </ul>
               </div>
            </div>

            <div class="divider">
               <div class="myPackagesBuy__duration myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">{{ $t('duration_package') }}</h4>
                  <h4 class="myPackagesBuy__cart-subtitle">{{ $t('choose') }}</h4>

                  <form-buttons
                     :options="durations"
                     :group-by="3"
                     v-model="duration"
                  />

                  <p class="myPackagesBuy__duration-description" v-html="$t('my_packages_duration')"></p>
               </div>

               <div class="myPackagesBuy__salon myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">{{ $t('autosalon_name') }}</h4>

                  <h5 class="myPackagesBuy__cart-subtitle">{{ $t('enter_name') }}</h5>

                  <form-text-input
                     v-model="salon_name"
                     :placeholder="$t('autosalon_name')"
                     :invalid="$v.salon_name.$error"
                     :disabled="(this.user?.autosalon?.name) ? true : false"
                     type="text"
                  />
               </div>
            </div>

            <div class="divider">
               <div class="myPackagesBuy__receipt myPackagesBuy__cart">
                  <ul class="myPackagesBuy__receipt-list">
                     <li class="myPackagesBuy__receipt-list_item">
                        <span>{{ $t('package') }}:</span>
                        <span>{{ selectedPackage.name }}</span>
                     </li>

                     <li class="myPackagesBuy__receipt-list_item">
                        <span>{{ $t('period_time') }}:</span>
                        <span>{{ duration * 30 }}</span>
                     </li>

                     <li class="myPackagesBuy__receipt-list_item">
                        <span>{{ $t('start_date') }}:</span>
                        <span>{{ $moment(new Date()).format('DD.MM.YYYY') }}</span>
                     </li>

                     <li class="myPackagesBuy__receipt-list_item">
                        <span>{{ $t('total2') }}:</span>
                        <span>{{ selectedPackage.price * duration }} AZN</span>
                     </li>
                  </ul>

                  <button
                     class="btn btn--green full-width"
                     @click="nextStep"
                  >{{ $t('pay') }}</button>
               </div>
            </div>
         </div>

         <modal-popup
            :toggle="openModal"
            :title="$t('balans')"
            :modal-class="'larger packages'"
            @close="openModal = false"
         >
            <h4 class="paymentMethods mb-3">{{ $t('payment_method') }}</h4>

            <label class="radio-container">
               {{$t('pay_with_card')}}
               <input type="radio" name="payment_type" checked @change="payment_type = 'card'">
               <span class="checkmark"></span>
            </label>

            <label class="radio-container" v-if="this.$auth.loggedIn && $readNumber(user.balance) > 0">
               {{ $t('balans') }}
               <input type="radio" name="payment_type" @change="payment_type = 'balance'">
               <span class="checkmark"></span>
            </label>

            <hr v-if="$readNumber(user.balance) > 0" />

            <div class="wrapp">
               <div class="terminal-section" v-if="$readNumber(user.balance) > 0">
                  {{ $t('balans') }}: <span style="margin-right: 20px;">{{ $readNumber(user.balance) }}</span>
               </div>

               <div class="terminal-section" v-if="$readNumber(user.balance) > 0">
                  {{ $t('package_price') }}: <span>{{ selectedPackage?.price * duration }} AZN</span>
               </div>
            </div>

            <hr v-if="$readNumber(user.balance) < 1" />
            <div class="terminal-section" v-if="$readNumber(user.balance) < 1">
               {{ $t('package_price') }} {{ selectedPackage?.price * duration }} AZN
            </div>

            <div class="modal-sticky-bottom">
               <hr />

               <div class="row">
                  <div class="col-12 col-lg-12 mt-2 mt-lg-0">
                     <button
                        :class="['btn btn--green full-width', { pending }]"
                        @click="handleSubmit"
                     >
                        {{ $t('pay') }}
                     </button>
                  </div>
               </div>
            </div>
         </modal-popup>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import { required } from "vuelidate/lib/validators";
   import { PaymentMixin } from "~/mixins/payment";
   import ComeBack from "~/components/elements/ComeBack.vue";

   export default {
      components: { ComeBack },

      head() {
         return this.$headMeta({
            title: this.$t('my_packages'),
            description: this.$t('registration2')
         });
      },

      nuxtI18n: {
         paths: {
            az: '/profil/paketler/resmilesdirme'
         }
      },

      mixins: [PaymentMixin],

      data() {
         return {
            openModal: false,
            pending: false,
            duration: 1,
            payment_type: 'card',
            salon_name: '',
            durations: [
               { key: 1, name: `30 ${this.$t('ads_day')}` },
               { key: 2, name: `60 ${this.$t('ads_day')}` },
               { key: 3, name: `90 ${this.$t('ads_day')}` }
            ],
            selectedPackage: {}
         }
      },

      methods: {
         nextStep() {
            this.$v.$touch();
            if (this.$v.$error) {
               this.scrollTo('.myPackagesBuy__salon', [-15, -20]);
               return;
            }

            this.openModal = true;
         },

         async handleSubmit() {
            this.pending = true;

            let api = '/payment/package',
                data = {
                   package_id: this.selectedPackage.id,
                   payment_type: this.payment_type,
                   name: this.salon_name,
                   days_type: this.duration
                };

            try {
               const res = await this.$axios.$post(`${api}?is_mobile=${this.isMobileBreakpoint}`, data);
               this.openModal = false;
               if (!res?.data?.redirect_url) {

                  await this.$nuxt.refresh();
                  await this.updatePaidStatus({
                     type: 'success',
                     // text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });
               } else {
                  await this.handlePayment(res, this.$localePath('/agreement'));

               }
               this.pending = false;
            } catch (error) {
               this.pending = false;

               // const response = error.response.data;
               // if (response.data && Object.keys(response.data).length) {
               //    for (let key in response.data) {
               //       this.$toast.error(response.data[key][0])
               //    }
               // }
            }
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchAgreements');
      },

      computed: {
         ...mapGetters({
            getAgreements: 'getAgreements',
            getResetForm: 'getResetForm'
         }),

         crumbs() {
            return [
               { name: this.$t('dashboard'), route: `${this.user.autosalon ? '/dashboard/1' : '/garage-services'}` },
               { name: this.$t('my_packages'), route: '/profile/packages' },
               { name: this.$t('registration2') }
            ]
         }
      },

      mounted() {
         this.selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));

         if (this.user?.autosalon?.name) this.salon_name = this.user?.autosalon?.name;
      },

      validations: {
         salon_name: { required }
      }
   }
</script>

<style lang="scss">
   .myPackagesBuy {
      padding-bottom: 100px;

      &__inner {
         display: flex;
         justify-content: space-between;
         gap: 20px;

         .divider {
            width: 100%;

            &:first-child {
               max-width: 387px;
            }

            &:nth-child(2) {
               max-width: 458px;
            }

            &:last-child {
               max-width: 313px;
            }
         }
      }

      &__package {
         &-list {
            margin-top: 23px !important;

            &_item {
               display: flex;
               align-items: center;
               font-weight: 500;
               font-size: 14px;
               line-height: 17px;
               color: #081A3E;

               &.opacity {
                  span {
                     opacity: 0.3;
                  }
               }

               &:not(:first-child) {
                  margin-top: 27px;
               }

               svg {
                  width: 100%;
                  max-width: 24px;
               }

               span {
                  margin-left: 12px;
               }
            }
         }
      }

      &__duration {
         margin-bottom: 16px;

         &-description {
            margin-top: 81px !important;

            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            color: #ADADAD;

            span {
               color: #246EB2;
            }
         }

         .form-buttons {
            margin-top: 8px;

            .form-group {
               .btn {
                  height: 42px;
               }
            }
         }
      }

      &__receipt {
         &-list {
            margin-bottom: 20px !important;
            padding-bottom: 20px !important;
            border-bottom: 1px solid #D6E4F8;

            &_item {
               &:not(:first-child) {
                  margin-top: 20px;
               }

               &:last-child {
                  span {
                     &:last-child {
                        font-weight: 700;
                     }
                  }
               }

               span {
                  font-weight: 500;
                  font-size: 18px;
                  line-height: 22px;
                  color: #246EB2;

                  &:last-child {
                     margin-left: 3px;
                     color: #081A3E;
                  }
               }
            }
         }

         .btn {
            height: 42px;
         }
      }

      &__cart {
         padding: 20px;
         border-radius: 4px;
         background-color: #FFFFFF;

         .form-group {
            margin-top: 16px;

            .text-input {
               input {
                  height: 42px;
                  border: none;
                  outline: none;
                  font-weight: 500;
                  color: #081A3E;
                  background-color: #F3F7FC;

                  &::placeholder {
                     color: #ADADAD;
                  }
               }
            }
         }
      }

      &__cart-title {
         font-weight: 500;
         font-size: 18px;
         line-height: 22px;
         color: #081A3E;
      }

      &__cart-subtitle {
         margin-top: 8px !important;
         padding-bottom: 8px !important;
         font-weight: 400;
         font-size: 14px;
         line-height: 17px;
         color: #246EB2;
         border-bottom: 1px solid #D6E4F8;
      }

      h1, h2, h3, h4, h5, h6, ul, p {
         margin: 0;
         padding: 0;
         list-style: none;
      }
   }

   .dark-mode {
      .myPackagesBuy {
         &__cart {
            background-color: #242426;

            &-title {
               color: #FFFFFF;
            }

            &-subtitle {
               color: #7dc1ff;
            }

            .form-group {
               .text-input {
                  input {
                     background-color: #f3f7fc33;
                  }
               }
            }
         }

         &__package {
            &-list {
               &_item {
                  color: #FFFFFF;

                  &.opacity {
                     svg {
                        path {
                           stroke: #FFFFFF;
                        }
                     }
                  }
               }
            }
         }

         &__receipt {
            &-list {
               &_item {
                  span {
                     color: #7dc1ff;

                     &:last-child {
                        color: #FFFFFF;
                     }
                  }
               }
            }
         }

         &__duration {
            &-description {
               color: #FFFFFF;
            }
         }

         &__salon {
            .form-group {
               .text-input {
                  input {
                     color: #FFFFFF;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .myPackagesBuy {
         &__package {
            &-list {
               &_item {
                  font-size: 13px;
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .myPackagesBuy {
         &__inner {
            flex-direction: column-reverse;

            .divider {
               &:first-child,
               &:nth-child(2),
               &:last-child {
                  max-width: unset;
               }
            }
         }

         &__package {
            &-list {
               &_item {
                  font-size: 12px;
               }
            }
         }
      }
   }
</style>
