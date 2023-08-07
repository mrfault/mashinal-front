<template>
   <div class="agreementPage">
      <div class="">

         <portal to="breadcrumbs">
            <breadcrumbs :crumbs="crumbs"/>
         </portal>

         <component
            :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
            :bar-title="$t('agreements')"
            @back="$router.push(pageRef || $localePath('/garage-services'))"
            height-auto>

            <div class="row" v-if="!isMobileBreakpoint">
               <div class="col-md-12 mb-4">
                  <h1>{{ $t('agreements') }}</h1>
               </div>
            </div>

            <div class="row">

               <div class="col-md-12" v-if="!isMobileBreakpoint">
                  <table class="table" v-if="getAgreements.length > 0">
                     <thead>
                        <tr>
                           <th class="text-center" v-if="!isMobileBreakpoint">{{ $t('invoice_number') }}</th>
                           <th class="text-center" v-if="!isMobileBreakpoint">{{ $t('invoice_date') }}</th>
                           <th class="text-center" v-if="!isMobileBreakpoint">{{ $t('type_of_service') }}</th>
                           <th class="text-center">{{ $t('payment_amount') }}</th>
                           <th class="text-center">{{ $t('status_and_date') }}</th>
                           <th class="text-center">{{ $t('transactions') }}</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(agreement, i) in getAgreements" :key="i + 1">
                           <td  class="text-center" v-if="!isMobileBreakpoint">{{ agreement.id }}</td>
                           <td class="text-center" v-if="!isMobileBreakpoint">{{ $moment(agreement.start_date).format('DD.MM.YYYY') }}</td>
                           <td class="text-center" v-if="!isMobileBreakpoint">{{ agreement.package.name }} {{ $t('package3') }}</td>
                           <td class="text-center">{{ agreement.price }} AZN</td>
                           <td class="text-center" :class="['status', {
                              'not_paid' : !agreement.payment.is_paid && !agreement.is_expired,
                              'is_expired' : agreement.is_expired
                              }]">
                              <span v-if="agreement.is_expired === false">{{ agreement.payment.is_paid ? $t('already_paid') : $t('not_paid') }}</span>
                              <span v-else>{{ $t('overdue') }} | {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}</span>
                           </td>
                           <td>
                              <div class="btns d-flex justify-content-center align-items-center">
                                 <button
                                    class="btn btn-pay"
                                    v-if="!agreement.payment.is_paid || agreement.is_expired"
                                    @click="paymentPackage(agreement)">
                                    {{ $t('pay') }}
                                 </button>

                                 <template v-else>
                                    <button
                                       :class="['btn', 'btn-download', { pending }]"
                                       v-bind:key="agreement.id"
                                       :disabled="clicked.includes(agreement.id)"
                                       @click="downloadInvoice(agreement.id)">
                                       {{ $t('download_invoice') }}
                                       <inline-svg :src="'/icons/loader1.svg'" v-if="clicked.includes(agreement.id)"/>
                                       <inline-svg :src="'/icons/download1.svg'" v-if="!clicked.includes(agreement.id)"/>
                                    </button>
                                 </template>

                                 <button class="btn btn-view ml-2" @click="openViewPopup(agreement)">
                                    {{ $t('view') }} <inline-svg :src="'/icons/eye1.svg'"/>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
                  <template v-else>
                     <table class="table">
                        <tr>
                           <td colspan="6" class="text-center" style="border: 0">
                              {{ $t('no_agreements') }}
                           </td>
                        </tr>
                     </table>
                  </template>
               </div>

               <div class="col-md-12 pb-5" v-if="isMobileBreakpoint">

                  <div class="accordion">
                     <div
                        v-for="(agreement, index) in getAgreements"
                        :key="index"
                        class="accordion__item"
                        :class="{'accordion__item--active': activeAccordionIndex === index}"
                     >
                        <div class="accordion__header" @click="toggleAccordion(index)">
                           <div class="accordion__header__title w-100 d-flex align-items-center justify-content-between">
                              <div class="w-50">
                                 {{ agreement.package.name }} {{ $t('package3') }}
                              </div>
                              <div class="w-50">
                                 <div class="badge" v-if="agreement.is_expired === false" :class="agreement.payment.is_paid ? 'badge-success' : 'badge-primary'">
                                    {{ agreement.payment.is_paid ? $t('already_paid') : $t('not_paid') }}
                                 </div>
                                 <div class="badge badge-danger" v-else>
                                    {{ $t('overdue') }} | {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}
                                 </div>
                              </div>
                           </div>
                           <div class="accordion__header__toggle"
                              :class="{'accordion__header__toggle--active': activeAccordionIndex === index}">
                              <icon name="chevron-down" />
                           </div>
                        </div>
                        <transition-expand>
                           <div v-if="activeAccordionIndex === index">
                              <div class="accordion__body p-0 pb-2">
                                 <table class="table">
                                    <tr>
                                       <td>
                                          <div class="mobile-accordion-table-title">{{ $t('status_and_date') }}</div>
                                          <div :class="['status', {
                                             'not_paid' : !agreement.payment.is_paid && !agreement.is_expired,
                                             'is_expired' : agreement.is_expired
                                             }]">
                                             <span v-if="agreement.is_expired === false">{{ agreement.payment.is_paid ? $t('already_paid') : $t('not_paid') }}</span>
                                             <span v-else>{{ $t('overdue') }} | {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}</span>
                                          </div>
                                       </td>
                                       <td>
                                          <div class="mobile-accordion-table-title">{{ $t('payment_amount') }}</div>
                                          <div class="mobile-accordion-table-content">{{ agreement.price }} AZN</div>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td>
                                          <div class="mobile-accordion-table-title">{{ $t('invoice_date') }}</div>
                                          <div class="mobile-accordion-table-content">{{ $moment(agreement.start_date).format('DD.MM.YYYY') }}</div>
                                       </td>
                                       <td>
                                          <div class="mobile-accordion-table-title">{{ $t('invoice_number') }}</div>
                                          <div class="mobile-accordion-table-content">{{ agreement.id }}</div>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td>
                                          <div class="d-flex w-100 align-items-center justify-content-start">
                                             <button class="btn btn-pay"
                                                v-if="!agreement.payment.is_paid || agreement.is_expired"
                                                @click="paymentPackage(agreement)">
                                                {{ $t('pay') }}
                                             </button>
                                             <template v-else>
                                                <button
                                                   :class="['btn', 'btn-download', { pending }]"
                                                   v-bind:key="agreement.id"
                                                   :disabled="clicked.includes(agreement.id)"
                                                   @click="downloadInvoice(agreement.id)">
                                                   {{ $t('download_invoice') }}
                                                   <inline-svg :src="'/icons/loader1.svg'" v-if="clicked.includes(agreement.id)"/>
                                                   <inline-svg :src="'/icons/download1.svg'" v-if="!clicked.includes(agreement.id)"/>
                                                </button>
                                             </template>
                                          </div>
                                       </td>
                                       <td>
                                          <div class="d-flex w-100 align-items-center justify-content-end">
                                             <button class="btn btn-view pull-right" @click="openViewPopup(agreement)">
                                                {{ $t('view') }} <inline-svg :src="'/icons/eye1.svg'"/>
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                 </table>
                              </div>
                           </div>
                        </transition-expand>
                     </div>
                  </div>

               </div>

            </div>
         </component>

         <modal-popup
            :toggle="openViewModal"
            :title="$t('agreement_details')"
            :modal-class="'larger viewAgreement'"
            @close="openViewModal = false">
            <table class="table table-agreement-detail">
               <tr>
                  <td>{{ $t('paid_ads') }}</td>
                  <td>{{ activeAgreementDetail.package.announce_count }}</td>
               </tr>
               <tr>
                  <td>{{ $t('paid_services') }}</td>
                  <td>{{ activeAgreementDetail.package.service_price }} AZN</td>
               </tr>
               <tr>
                  <td>{{ $t('package_duration') }}</td>
                  <td>{{ $moment(activeAgreementDetail.start_date).format('DD.MM.YYYY') }} - {{ $moment(activeAgreementDetail.end_date).format('DD.MM.YYYY') }}</td>
               </tr>
               <tr>
                  <td>{{ $t('vat') }}</td>
                  <td>{{ activeAgreementDetail.price }} AZN</td>
               </tr>
               <tr>
                  <td>{{ $t('total') }}</td>
                  <td>{{ activeAgreementDetail.price }} AZN</td>
               </tr>
            </table>

            <div class="modal-sticky-bottom">
               <div class="row">
                  <div class="col-12 col-lg-12 mt-2 mt-lg-0 p-1">

                     <div class="btns d-flex justify-content-center align-items-center">
                        <button
                           class="btn btn-pay"
                           v-if="!activeAgreementDetail.payment.is_paid || activeAgreementDetail.is_expired"
                           @click="paymentPackage(activeAgreementDetail)">
                           {{ $t('pay') }}
                        </button>

                        <button
                           v-else
                           :class="['btn', 'btn-download', { pending }]"
                           v-bind:key="activeAgreementDetail.id"
                           :disabled="clicked.includes(activeAgreementDetail.id)"
                           @click="downloadInvoice(activeAgreementDetail.id)">
                           {{ $t('download_invoice') }}
                           <inline-svg :src="'/icons/loader1.svg'" v-if="clicked.includes(activeAgreementDetail.id)"/>
                           <inline-svg :src="'/icons/download1.svg'" v-if="!clicked.includes(activeAgreementDetail.id)"/>
                        </button>

                     </div>

                  </div>
               </div>
            </div>
         </modal-popup>

         <modal-popup
            :toggle="openModal"
            :title="$t('ads_balans')"
            :modal-class="'larger packages'"
            @close="openModal = false">
            <h4 class="paymentMethods mb-3">{{ $t('payment_method') }}</h4>

            <div class="d-flex justify-content-between align-items-center">
               <form-radio
                  :id="'1'"
                  :value="'card'"
                  :label="$t('pay_with_card')"
                  input-name="payment_type"
                  v-model="payment_type"
                  @change="payment_type = 'card'"
                  :radio-value="'card'"
                  :checked="true"
               />
               <form-radio
                  v-if="this.$auth.loggedIn && totalBalance > 0"
                  :id="'2'"
                  :value="'balance'"
                  :label="$t('balans') +' ('+$readNumber(user.balance)+' AZN)'"
                  input-name="payment_type"
                  v-model="payment_type"
                  class="ml-2"
                  :radio-value="'balance'"
                  @change="payment_type = 'balance'"
               />
            </div>

            <hr v-if="totalBalance > 0"/>

            <div class="terminal-section" v-if="totalBalance > 0">
               {{ $t('package_price') }}: {{ activeAgreementDetail?.package?.price * duration }} AZN
            </div>

            <hr v-if="totalBalance < 1"/>

            <div class="terminal-section" v-if="totalBalance < 1">
               {{ $t('package_price') }} {{ activeAgreementDetail?.price || activeAgreementDetail?.package?.price * duration }} AZN
            </div>

            <div class="modal-sticky-bottom">
               <hr />
               <div class="row">
                  <div class="col-12 col-lg-12 mt-2 mt-lg-0">
                     <button :class="['btn btn--green full-width m-0', { pending }]"  @click="handleSubmit">
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
import {mapGetters} from "vuex";
import {PaymentMixin} from "~/mixins/payment";
import ComeBack from "~/components/elements/ComeBack.vue";
import CollapseContent from "~/components/elements/CollapseContent.vue";
import Accordion from "~/components/elements/Accordion.vue";

export default {
   components: {
      Accordion,
      ComeBack,
      CollapseContent
   },

   nuxtI18n: {
      paths: {
         az: '/profil/muqavileler'
      }
   },
   layout: 'garageLayout',

   head() {
      return this.$headMeta({
         title: this.$t('agreements')
      });
   },

   mixins: [PaymentMixin],

   data() {
      return {
         activeAgreement: 1,
         activeAccordionIndex: null,
         downloadInvoiceIsDisabled: 0,
         activeAgreementDetail: {
            id: 0,
            is_expired: false,
            payment: {
               is_paid: false
            },
            package: {
               announce_count: 0,
               service_price: 0,
            },
            start_date: '',
            end_date: '',
            price: 0,
         },
         openModal: false,
         openViewModal: false,
         pending: false,
         duration: 1,
         payment_type: 'card',
         selectedPackage: {},
         clicked: []
      }
   },

   methods: {
      paymentPackage(agreement) {
         this.activeAgreementDetail = agreement;
         this.selectedPackage = agreement.package;
         this.openModal = true;
         this.openViewModal = false;
      },
      toggleAccordion(index) {
         if (this.activeAccordionIndex === index) {
            this.activeAccordionIndex = null
         } else {
            this.activeAccordionIndex = index
         }
      },
      async handleSubmit() {
         this.pending = true;

         let api = '/payment/package',
            data = {
               package_id: this.activeAgreementDetail.package.id,
               payment_type: this.payment_type,
               name: this.user.autosalon.name,
               agreement_id: this.activeAgreementDetail.id,
               days_type: this.duration
            };

         try {
            const res = await this.$axios.$post(`${api}?is_mobile=${this.isMobileBreakpoint}`, data);

            if (!res?.data?.redirect_url) {
               await this.$nuxt.refresh();
               await this.updatePaidStatus({
                  type: 'success',
                  // text: this.$t('announcement_paid'),
                  title: this.$t('success_payment')
               });

               this.pending =  false;
               this.openViewModal = false;
               this.openModal = false;
            } else {
               await this.handlePayment(res, this.$localePath('/profile/agreement'), this.$t('success_payment'));
               this.pending =  false;
               this.openViewModal = false;
               this.openModal = false;
            }
         } catch (error) {
            this.pending = false;
         }
      },

      downloadInvoice(id) {

         this.downloadInvoiceIsDisabled = 1;


         this.clicked.push(id)
         if (!id) {
            return null;
         }

         this.$axios.$get(`/invoice/${id}/download`, {responseType: 'blob'})
            .then(res => {
               const blob = new Blob([res], {type: 'application/pdf'});
               const link = document.createElement('a');
               link.href = URL.createObjectURL(blob);
               link.download = `invoice.pdf`;
               link.click();
               URL.revokeObjectURL(link.href);
               this.clicked.pop(id);
               this.downloadInvoiceIsDisabled = 0;
            })
      },
      openViewPopup(agreement) {
         this.openViewModal = true;
         this.activeAgreementDetail = agreement;
         this.activeAgreement = agreement.id;
      }
   },

   computed: {
      ...mapGetters({
         getAgreements: 'getAgreements'
      }),

      crumbs() {
         return [
            {name: this.$t('dashboard'), route: `${this.user.autosalon ? '/dashboard/1' : '/garage-services'}`},
            {name: this.$t('agreements')}
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

      findUnpaid() {
         return this.getAgreements.find(item => item.payment.is_paid === false);
      }
   },

   mounted() {
      this.selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));
   },

   async asyncData({store}) {
      await store.dispatch('fetchAgreements');
   }
}
</script>

<style lang="scss" scoped>
.modal-popup.packages .form-group {
   max-width: 100%;
}
.table  {
   border-collapse: separate;
   border:solid #CDD5DF 1px;
   border-radius: 12px;
   width: 100%;
   background: #FFF;
}

.table td, .table th {
   border-top: 1px solid #CDD5DF;
   font-size: 14px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   padding: 20px 12px;
}

.table td:last-child, th:last-child {
   text-align: right;
}

.table th {
   border-top: none;
}

.table td:first-child, .table th:first-child {
   border-left: none;
}

.table-agreement-detail tr:first-child td{
   border-top: 0;
}

.btn{
   background-color: #fff;
   border: 1px solid #D1D5DB;
   border-radius: 8px;
   color: #1F2937;
   display: flex;
   justify-content: center;
   align-items: center;
   margin-left: 5px;
   margin-right: 5px;
}
.btn:hover,
.btn:focus {
   background-color: #fff;
   border: 1px solid #9b9fa7;
   color: #1F2937;
}

.modal-popup.packages .btn--green{
   border-radius: 8px;
   background: var(--success-600, #039855);
   border: 1px solid var(--success-600, #039855);
   color: #FFF;
}

.modal-popup.packages .btn--green:hover,
.modal-popup.packages .btn--green:focus {
   border-radius: 8px;
   background: var(--success-600, #039855);
   border: 1px solid var(--success-600, #039855);
   color: #FFF;
}

.btn-download:disabled{
   background-color: #eee;
   cursor: not-allowed;
}
.btn-download svg{
   width: 20px;
   height: 20px;
}

.agreementDetails {
   display: none;
   position: absolute;
   width: 100%;
   padding: 20px;
   left: 0;
   bottom: 0;

   .agreementDetails__title {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #081A3E;
      margin: 0 0 20px 0;
   }

   .agreementDetails__content {
      display: flex;
      gap: 20px;

      .divider {
         width: 100%;
         max-width: 800px;

         &:last-child {
            width: 100%;
            max-width: 300px;
         }
      }

      &-head {
         display: flex;
         align-items: center;
         justify-content: space-between;
         padding: 16px 20px;
         border-radius: 4px;
         background-color: #D6E4F8;

         &_item {
            span {
               font-size: 14px;
               line-height: 17px;
               color: #081A3E;

               &:last-child {
                  font-weight: 600;
                  color: #246EB2;
               }
            }
         }
      }

      &-price {
         display: flex;
         align-items: center;
         flex-direction: column;
         padding: 32px 0;
         border-radius: 4px;
         border: 1px solid #D6E4F8;

         &_item {
            min-width: 120px;

            &:not(:first-child) {
               margin-top: 24px;
            }

            span {
               display: inline-block;
               font-size: 16px;
               line-height: 19px;
               color: #081A3E;

               &:last-child {
                  font-weight: 600;
                  color: #F81734;
                  margin-left: 8px;
               }
            }
         }
      }
   }
}

.accordion{
   width: 100%;
   border-radius: 12px;
   gap: 16px;
   margin-top: 16px;
}
.accordion__header{
   padding: 16px 24px 16px 24px;
   height: auto;
}
.accordion__body{
   padding: 16px 24px 16px 24px;
   border-radius: 0 0 12px 12px;
}
.accordion__item{
   border: 1px solid #eee;
   border-radius: 8px;
   box-shadow: 0 0 24px 0 #0000001A;
}
.accordion__item .accordion__header{
   padding: 16px 24px 16px 24px;
   border-radius: 12px;
}
.accordion__item--active .accordion__header{
   padding: 16px 24px 16px 24px;
   border-radius: 12px 12px 0 0;
}
.mobile-accordion-table-title{
   font-size: 15px;
   font-weight: 400;
   line-height: 20px;
   letter-spacing: 0;
   color: #585C5E;
}
.mobile-accordion-table-content{
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   color: #24282A;
}
.w-50{
   width: 50%;
}
.w-25{
   width: 25%;
}
.badge{
   font-size: 16px;
   font-weight: 500;
   letter-spacing: 0;
   text-align: left;
   border-radius: 8px;
   padding: 12px 16px;
   width: max-content;
   float: right;
   margin-right: 25px;
}
.badge.badge-success{
   background: #ECFDF3;
   border: 1px solid #ECFDF3;
   color: #039855;
}

.badge.badge-danger{
   background: #FEF3F2;
   border: 1px solid #FEF3F2;
   color: #F81734;
}

.badge.badge-primary{
   background: #EEF2F6;
   border: 1px solid #EEF2F6;
   color: #24282A;
}

.accordion{
   table{
      border: none!important;
      border-radius: 0!important;
   }
   table tr{
      border: none!important;
      border-radius: 0!important;
   }
   table tr td,
   table tr th{
      border: none!important;
      border-radius: 0!important;
   }
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

   .table td, .table th {
      border-top: 1px solid #364152;
      font-size: 14px;
      color: #CDD5DF;
   }

   .table td:last-child, .table th:last-child {
      text-align: right;
   }

   .table th {
      border-top: none;
   }

   .table td:first-child, .table th:first-child {
      border-left: none;
   }

   .mobile-accordion-table-title{
      color: #CDD5DF;
   }
   .mobile-accordion-table-content{
      color: #FFF;
   }

   .accordion__header{
      background: #1B2434;
   }
   .accordion__body{
      background: #1B2434;
   }
   .modal-sticky-bottom{
      background: #1b2434!important
   }
}
</style>
