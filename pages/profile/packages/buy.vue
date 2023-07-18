<template>
   <div class="pt-4 pb-5">

      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs" />
      </portal>

      <component
         :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
         :bar-title="$t('registration2')"
         @back="$router.push(pageRef || $localePath('/profile/packages/buy'))"
         height-auto
      >
         <div class="row">
            <div class="col-md-8 col-lg-8 col-xs-12 p-0 p-1">
               <div class="myPackagesBuy__cart">
                  <h1 class="myPackagesBuy__cart__title">{{$t('registration2')}}</h1>
                  <table class="myPackagesBuy__cart__table table table-bordered w-100">
                     <tr class="w-100">
                        <td class="text-left">{{ $t('package') }}</td>
                        <td class="text-right">{{ selectedPackage.name }}</td>
                     </tr>
                     <tr class="w-100">
                        <td class="text-left">{{ $t('package_price') }}</td>
                        <td class="text-right">{{ selectedPackage.price }} AZN</td>
                     </tr>
                     <tr class="w-100">
                        <td class="text-left">{{ $t('period_time') }}</td>
                        <td class="text-right">
                           <form-select :options="durations" v-model="duration"  :new-label="false"></form-select>
                        </td>
                     </tr>
                     <tr class="w-100">
                        <td class="text-left">{{ $t('start_date') }}</td>
                        <td class="text-right">{{ $moment(new Date()).format('DD.MM.YYYY') }}</td>
                     </tr>
                     <tr class="w-100">
                        <td class="text-left">{{ $t('end_date') }}</td>
                        <td class="text-right">{{ $moment(new Date()).format('DD.MM.YYYY') }}</td>
                     </tr>
                  </table>
               </div>
               <div class="d-flex justify-content-center align-items-center pt-4" v-if="isMobileBreakpoint">
                  <Alert :type="'info'" :content="$t('my_packages_duration')"/>
               </div>
               <div class="d-flex justify-content-center align-items-center pt-4">
                  <div class="full-width-xs">
                     <button class="btn btn--green full-width" @click="nextStep">
                        {{ $t('pay') }}
                     </button>
                  </div>
                  <div class="ml-2" v-if="!isMobileBreakpoint">
                     <Alert :type="'info'" :content="$t('my_packages_duration')"/>
                  </div>
               </div>
            </div>
            <div class="col-md-4 col-lg-4 col-xs-12 p-0 p-1" v-if="!isMobileBreakpoint">

               <div class="myPackagesBuy__package myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__title">{{ selectedPackage.name }} {{ $t('package2') }}</h4>

                  <h3 class="myPackagesBuy__subtitle">
                     {{ selectedPackage.price }} AZN <span>/ {{ $t('month') }}</span>
                  </h3>

                  <ul class="myPackagesBuy__package-list">
                     <li :class="['myPackagesBuy__package-list_item', {'opacity' : !option.checked}]"
                        v-for="option in selectedPackage.items"
                        :key="option.id">

                        <inline-svg :src="'/icons/check3.svg'" v-if="option.checked" />
                        <inline-svg :src="'/icons/close2.svg'" v-else />

                        <span>{{ option.text }}</span>
                     </li>
                  </ul>
               </div>

            </div>
         </div>
      </component>

      <modal-popup
         :toggle="openModal"
         :title="$t('balans')"
         :modal-class="'larger packages'"
         @close="openModal = false">

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
                  <button  :class="['btn btn--green full-width', { pending }]"  @click="handleSubmit">
                     {{ $t('pay') }}
                  </button>
               </div>
            </div>
         </div>
      </modal-popup>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import { required } from "vuelidate/lib/validators";
   import { PaymentMixin } from "~/mixins/payment";
   import ComeBack from "~/components/elements/ComeBack.vue";
   import Alert from "~/components/elements/Alert.vue";

   export default {
      components: {Alert, ComeBack },

      layout: 'profileFullWidthLayout',

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
            if (this.$v.$error) return;

            this.openModal = true;
         },

         async handleSubmit({commit}, value) {
            this.pending = true;

            let api = '/payment/package',
                data = {
                   package_id: this.selectedPackage.id,
                   payment_type: this.payment_type,
                   name: this.salon_name,
                   days_type: this.duration
                };

            if (this.selectedPackage.id === this.getAgreements[0]?.package?.id) {
               api = '/payment/renew-package';
               data.autosalon_id = this.user.autosalon.id;
               data.agreement_id = this.getAgreements[0]?.id;
               delete data.name;
            }

            try {
               const res = await this.$axios.$post(`${api}?is_mobile=${this.isMobileBreakpoint}`, data);

               if (!res?.data?.redirect_url) {
                  await this.$nuxt.refresh();
                  await this.updatePaidStatus({
                     type: 'success',
                     // text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  }, value);
               } else {
                  await this.handlePayment(res, this.$localePath('/agreement'));
                  this.pending = this.openModal = false;
               }
            } catch (error) {
               this.pending = false;
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

      &__title {
         font-weight: 600;
         font-size: 20px;
         line-height: 25px;
         color: #081A3E;
         margin-bottom: 20px !important;
         text-align: left;
      }

      &__subtitle {
         display: flex;
         align-items: center;
         justify-content: start;
         font-weight: 700;
         font-size: 34px;
         line-height: 46px;
         color: #081A3E;
         text-align: left;

         span {
            margin-left: 9px;
            font-weight: 500;
            font-size: 18px;
            line-height: 22px;
            color: #081A3E;
            opacity: 0.3;
         }
      }

      &__info {
         margin-top: 23px !important;
         text-align: initial;

         &-item {
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
               margin-top: 28px;
            }

            span {
               margin-left: 8px;
            }
         }
      }

      &__cart {
         padding: 30px;
         border-radius: 12px;
         background-color: #FFFFFF;
         border: 1px solid #CDD5DF;

         .myPackagesBuy__cart__title{
            font-size: 28px;
            font-weight: 700;
            line-height: 32px;
            letter-spacing: 0;
            text-align: left;
            margin-bottom: 20px;
         }

         .myPackagesBuy__cart__table {
            width: 100%;
            border-collapse: collapse;

            tr {
               border-bottom: 1px solid #E3E8EF;
               padding: 10px 0;

               &:last-child {
                  border-bottom: none;
               }

               td {
                  padding: 20px 0;
                  font-size: 14px;
                  font-weight: 500;
                  color: #242426;
                  text-align: left;
                  vertical-align: middle;

                  &:first-child {
                     width: 50%;
                     color: #364152;
                     font-size: 16px;
                     font-weight: 400;
                     line-height: 20px;
                     letter-spacing: 0;
                     text-align: left;
                  }

                  &:last-child {
                     color: #121926;
                     font-size: 16px;
                     font-weight: 500;
                     line-height: 20px;
                     letter-spacing: 0;
                     text-align: right;
                  }
               }
            }
         }
      }

      .btn--green{
         width: 230px;
         height: 60px;
         padding: 14px 16px 14px 16px;
         border-radius: 8px;
         gap: 8px;
         font-size: 16px;
         font-weight: 500;
         line-height: 20px;
         letter-spacing: 0;
         text-align: center;
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
      .myPackagesBuy__cart__table {
         border: 0!important;
         tr {
            border-bottom: 1px solid #E3E8EF;

            &:last-child {
               border: 0!important;
            }

            td {
               border: 0!important;

               &:first-child {
                  border: 0!important;
               }

               &:last-child {
                  border: 0!important;
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .myPackagesBuy__cart__table {
         border: 0!important;
         tr {
            border-bottom: 1px solid #E3E8EF;
            &:last-child {
               border: 0!important;
            }
            td {
               border: 0!important;

               &:first-child {
                  border: 0!important;
               }

               &:last-child {
                  border: 0!important;
               }
            }
         }
      }
      .full-width-xs{
         width: 100%;
      }
      .full-width{
         width: 100%;
      }
   }

   @media (max-width: 740px) {
      .full-width-xs{
         width: 100%;
      }
      .full-width{
         width: 100%;
      }
   }
</style>
