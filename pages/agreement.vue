<template>
   <div class="agreementPage">
      <div class="container">
         <ComeBack :text="$t('agreements')" v-if="isMobileBreakpoint" />

         <breadcrumbs :crumbs="crumbs" />

         <h4 class="agreementPage__title">{{ $t('agreements') }}</h4>

<!--         <h5 class="agreementPage__subtitle">{{ $t('get_new_package') }}</h5>-->

         <table class="agreementPage__table">
            <thead class="agreementPage__table-thead">
               <tr>
                  <th>{{ $t('invoice_date') }}</th>
                  <th>{{ $t('invoice_number') }}</th>
                  <th>{{ $t('type_of_service') }}</th>
                  <th>{{ $t('payment_amount') }}</th>
                  <th>{{ $t('status_and_date') }}</th>
               </tr>
            </thead>

            <tbody class="agreementPage__table-tbody">
               <tr
                  :class="['', { 'active' : activeAgreement === agreement.package.id }]"
                  v-for="agreement in getAgreements"
                  :key="agreement.id"
                  @click="activeAgreement = agreement.package.id"
               >
                  <td>{{ $moment(agreement.start_date).format('DD.MM.YYYY') }}</td>
                  <td>{{ agreement.id }}</td>
                  <td>{{ agreement.package.name[locale] }} {{ $t('package3') }}</td>
                  <td>{{ agreement.price }} AZN</td>
                  <td :class="['status', {
                        'not_paid' : !agreement.payment.is_paid && !agreement.is_expired,
                        'is_expired' : agreement.is_expired
                        }]"
                  >
                     <span v-if="agreement.is_expired === false">{{ agreement.payment.is_paid ? $t('already_paid') : $t('not_paid') }}</span>
                     <span v-else>{{ $t('overdue') }} | {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}</span>

                     <div class="btns">
                        <inline-svg :src="'/icons/download.svg'" @click="downloadInvoice(agreement.id)" />

                        <button
                           class="btn"
                           v-if="!agreement.payment.is_paid || agreement.is_expired"
                           @click="openModal = true"
                        >{{ $t('pay') }}</button>

                        <icon :name="'chevron-down'" />
                     </div>

                     <div class="detailsMobile">
                        <button class="btn">
                           {{ $t('details') }}
<!--                           {{ activeAgreement === agreement.package.id ? $t('close2') : $t('details') }}-->
                        </button>
                     </div>
                  </td>
                  <td class="agreementDetails">
                     <h5 class="agreementDetails__title">{{ agreement.package.name[locale] }} {{ $t('package2') }}</h5>

                     <div class="agreementDetails__content">
                        <div class="divider">
                           <div class="agreementDetails__content-head">
                              <div class="agreementDetails__content-head_item">
                                 <span>{{ $t('paid_ads') }}:</span>
                                 <span>{{ agreement.package.announce_count }}</span>
                              </div>

                              <div class="agreementDetails__content-head_item">
                                 <span>{{ $t('paid_services') }}:</span>
                                 <span>{{ agreement.package.service_price }} AZN</span>
                              </div>

                              <div class="agreementDetails__content-head_item">
                                 <span>{{ $t('package_duration') }}:</span>
                                 <span>{{ $moment(agreement.start_date).format('DD.MM.YYYY') }} - {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}</span>
                              </div>
                           </div>
                        </div>

                        <div class="divider">
                           <div class="agreementDetails__content-price">
                              <div class="agreementDetails__content-price_item">
                                 <span>{{ $t('vat') }}:</span>
                                 <span>{{ agreement.price }} AZN</span>
                              </div>

                              <div class="agreementDetails__content-price_item">
                                 <span>{{ $t('total') }}:</span>
                                 <span>{{ agreement.price }} AZN</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </td>
                  <td class="agreementDetailsMobile">
                     <inline-svg
                        class="agreementDetailsMobile__downloadIcon"
                        :src="'/icons/download.svg'"
                        @click="downloadInvoice(agreement.id)"
                     />

                     <div class="agreementDetailsMobile__content">
                        <ul class="agreementDetailsMobile__content-list">
                           <li>
                              <h5>{{ $t('invoice_date') }}</h5>
                              <span>{{ $moment(agreement.start_date).format('DD.MM.YYYY') }}</span>
                           </li>

                           <li>
                              <h5>{{ $t('invoice_number') }}</h5>
                              <span>{{ agreement.id }}</span>
                           </li>

                           <li>
                              <h5>{{ $t('type_of_service') }}</h5>
                              <span>{{ agreement.package.name[locale] }} {{ $t('package3') }}</span>
                           </li>
                        </ul>

                        <ul class="agreementDetailsMobile__content-info">
                           <li>
                              <h5>{{ $t('paid_ads') }}:</h5>
                              <span>{{ agreement.package.announce_count }}</span>
                           </li>

                           <li>
                              <h5>{{ $t('paid_services') }}:</h5>
                              <span>{{ agreement.package.service_price }} AZN</span>
                           </li>

                           <li>
                              <h5>{{ $t('package_duration') }}:</h5>
                              <span>{{ $moment(agreement.start_date).format('DD.MM.YYYY') }} - {{ $moment(agreement.end_date).format('DD.MM.YYYY') }}</span>
                           </li>
                        </ul>

                        <ul class="agreementDetailsMobile__content-price">
                           <li>
                              <span>{{ $t('vat') }}:</span>
                              <span>{{ agreement.price }} AZN</span>
                           </li>

                           <li>
                              <span>{{ $t('total') }}:</span>
                              <span>{{ agreement.price }} AZN</span>
                           </li>
                        </ul>

                        <button
                           v-if="!agreement.payment.is_paid"
                           class="btn full-width"
                           @click="openModal = true"
                        >{{ $t('pay') }}</button>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>

         <modal-popup
            :toggle="openModal"
            :title="$t('ads_balans')"
            :modal-class="'larger packages'"
            @close="openModal = false"
         >
            <h4 class="paymentMethods mb-3">{{ $t('payment_method') }}</h4>

            <label class="radio-container">
               {{$t('pay_with_card')}}
               <input type="radio" name="payment_type" checked @change="payment_type = 'card'">
               <span class="checkmark"></span>
            </label>

            <label class="radio-container" v-if="this.$auth.loggedIn && totalBalance > 0">
               {{$t('balans')}}
               <input type="radio" name="payment_type" @change="payment_type = 'balance'">
               <span class="checkmark"></span>
            </label>

            <hr v-if="totalBalance > 0" />

            <div class="terminal-section" v-if="totalBalance > 0">
               {{ $t('balans') }}: <span style="margin-right: 20px;">{{ totalBalance }}</span>
               {{ $t('package_price') }}: {{ selectedPackage?.price * duration }} AZN
            </div>

            <hr v-if="totalBalance < 1" />

            <div class="terminal-section" v-if="totalBalance < 1">
               {{ $t('package_price') }} {{ getAgreements[0]?.price || selectedPackage?.price * duration }} AZN
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

<!--         <aaa />-->
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import ComeBack from "~/components/elements/ComeBack.vue";
   import aaa from "~/components/aaa.vue";
   import {PaymentMixin} from "~/mixins/payment";

   export default {
      components: {
         aaa,
         ComeBack
      },

      head() {
         return this.$headMeta({
            title: this.$t('agreements')
         });
      },

      mixins: [PaymentMixin],

      data() {
         return {
            activeAgreement: 1,
            openModal: false,
            pending: false,
            duration: 1,
            payment_type: 'card',
            selectedPackage: {}
         }
      },

      methods: {
         async handleSubmit() {
            this.pending = true;

            let api = '/payment/package',
               data = {
                  package_id: this.findUnpaid.package.id,
                  payment_type: this.payment_type,
                  name: this.user.autosalon.name,
                  days_type: this.duration
               };

            if ((this.selectedPackage.id === this.getAgreements[0]?.package?.id) && this.getAgreements[0].payment.is_paid === true) {
               api = '/payment/renew-package';
               data.autosalon_id = this.user.autosalon.id;
               data.agreement_id = this.findUnpaid.id;
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
                  });
               } else {
                  await this.handlePayment(res, this.$localePath('/agreement'));
                  this.pending = this.openModal = false;
               }
            } catch (error) {
               this.pending = false;

               // const response = error.response.data;
               // if (response.data && Object.keys(response.data).length) {
               //    for (let key in response.data) {
               //       this.$toast.error(response.data[key][0])
               //    }
               // }
            }
         },

         downloadInvoice(id) {
            this.$axios.$get(`/invoice/${id}/download`, { responseType: 'blob' })
               .then(res => {
                  const blob = new Blob([res], { type: 'application/pdf' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `invoice.pdf`;
                  link.click();
                  URL.revokeObjectURL(link.href);
               })
         }
      },

      computed: {
         ...mapGetters({
            getAgreements: 'getAgreements'
         }),

         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/1' },
               { name: this.$t('agreements') }
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

      async asyncData({ store }) {
         await store.dispatch('fetchAgreements');
      }
   }
</script>

<style lang="scss" scoped>
   .agreementPage {
      padding-bottom: 100px;

      ul, h5, p {
         list-style: none;
         margin: 0;
         padding: 0;
      }

      &__title {
         margin: 36px 0 8px 0;
         font-weight: 500;
         font-size: 18px;
         line-height: 22px;
         color: #081A3E;
      }

      &__subtitle {
         font-weight: 400;
         font-size: 14px;
         line-height: 17px;
         color: #246EB2;
         margin: 0;
      }

      &__table {
         margin-top: 20px;
         width: 100%;
         border-radius: 4px;
         background-color: #FFFFFF;

         &-thead {
            tr {
               th {
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 19px;
                  color: #081A3E;
               }
            }
         }

         &-tbody {
            tr {
               position: relative;
               border-top: 1px solid #D6E4F8;

               &.active {
                  td {
                     padding-bottom: 230px;
                  }

                  .agreementDetails {
                     display: block;
                  }

                  .btns {
                     i {
                        transform: rotate(180deg);
                     }
                  }
               }

               td {
                  line-height: 17px;
                  color: #081A3E;

                  &.status {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     color: #29A53E;

                     .btns {
                        display: flex;
                        align-items: center;
                        gap: 40px;
                        margin-left: 40px;

                        svg {
                           cursor: pointer;
                        }

                        .btn {
                           padding: 12px 36px;
                           color: #FFFFFF;
                           background-color: #246EB2;
                           backdrop-filter: blur(10px);
                        }

                        i {
                           &:before {
                              margin: 0;
                              font-size: 13px;
                              color: #081A3E;
                           }
                        }
                     }

                     .detailsMobile {
                        display: none;

                        .btn {
                           height: 34px;
                           padding: 0 36px;
                           color: #FFFFFF;
                           background-color: #246EB2;
                        }
                     }
                  }

                  &.not_paid {
                     span {
                        color: #081A3E;
                        opacity: 0.3;
                     }
                  }

                  &.is_expired {
                     span {
                        color: #F81734;
                        opacity: 1;
                     }
                  }

                  &.agreementDetails {
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

                  &.agreementDetailsMobile {
                     display: none;
                     position: absolute;
                     width: 100%;
                     left: 0;
                     top: 60px;

                     .agreementDetailsMobile__downloadIcon {
                        position: absolute;
                        top: 32px;
                        right: 36px;
                     }

                     .agreementDetailsMobile__content {
                        padding: 16px;
                        border-radius: 4px;
                        background-color: #D6E4F8;

                        &-list {
                           li {
                              &:not(:first-child) {
                                 margin-top: 20px;
                              }

                              h5 {
                                 font-weight: 500;
                                 font-size: 14px;
                                 line-height: 17px;
                                 color: #081A3E;
                                 margin-bottom: 10px;
                              }

                              span {
                                 font-weight: 400;
                                 font-size: 12px;
                                 line-height: 14px;
                                 color: #081A3E;
                              }
                           }
                        }

                        &-info {
                           margin: 16px 0;

                           li {
                              display: flex;
                              align-items: center;

                              &:not(:first-child) {
                                 margin-top: 16px;
                              }

                              h5, span {
                                 font-weight: 400;
                                 font-size: 12px;
                                 line-height: 14px;
                                 color: #081A3E;
                              }

                              span {
                                 color: #246EB2;
                                 margin-left: 5px;
                              }
                           }
                        }

                        &-price {
                           display: flex;
                           align-items: center;
                           justify-content: space-around;

                           li {
                              span {
                                 font-size: 12px;
                                 line-height: 14px;
                                 color: #081A3E;

                                 &:last-child {
                                    font-weight: 600;
                                    color: #F81734;
                                 }
                              }
                           }
                        }

                        &-info, &-price {
                           padding: 16px;
                           border-radius: 4px;
                           background-color: #FFFFFF;
                        }

                        .btn {
                           margin-top: 16px;
                           height: 34px;
                           padding: 0 36px;
                           color: #FFFFFF;
                           background-color: #246EB2;
                        }
                     }
                  }
               }

               &.expired {
                  td {
                     &:last-child {
                        color: #F81734;
                        opacity: unset;
                     }
                  }
               }
            }
         }

         th, td {
            padding: 20px;
         }
      }
   }

   .dark-mode {
      .agreementPage {
         &__title {
            color: #FFFFFF;
         }

         &__table {
            background-color: #242426;

            &-thead {
               tr {
                  th {
                     color: #FFFFFF;
                  }
               }
            }

            &-tbody {
               tr {
                  border-color: #A4A4A5;

                  td {
                     &:not(.status) {
                        color: #A4A4A5;
                     }

                     &.status {
                        .btns {
                           i {
                              &:before {
                                 color: #FFFFFF;
                              }
                           }
                        }
                     }

                     &.not_paid {
                        span {
                           color: #ffe400;
                           opacity: 1;
                        }
                     }

                     .agreementDetails {
                        &__title {
                           color: #FFFFFF;
                        }

                        &__content {
                           &-head {
                              background-color: #b9b9b9;
                           }

                           &-price {
                              border-color: #A4A4A5;

                              &_item {
                                 span {
                                    color: #A4A4A5;
                                 }
                              }
                           }
                        }
                     }

                     .agreementDetailsMobile {
                        &__content {
                           background-color: #d6e4f826;

                           ul {
                              li {
                                 h5 {
                                    color: #FFFFFF;
                                 }

                                 span {
                                    color: #A4A4A5;
                                 }
                              }
                           }

                           &-info, &-price {
                              background-color: #454b50;
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .agreementPage {
         &__table {
            &-thead {
               tr {
                  th {
                     font-size: 14px;
                  }
               }
            }

            &-tbody {
               tr {
                  td {
                     &.agreementDetails {
                        .agreementDetails {
                           &__content {
                              .divider {
                                 max-width: 850px;

                                 &:last-child {
                                    max-width: 250px;
                                 }
                              }

                              &-head {
                                 padding: 16px 13px;

                                 &_item {
                                    span {
                                       font-size: 13px;
                                    }
                                 }
                              }

                              &-price {
                                 padding: 25px 0;

                                 &_item {
                                    &:not(:first-child) {
                                       margin-top: 15px;
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .agreementPage {
         &__table {
            &-thead {
               tr {
                  th {
                     &:nth-child(1),
                     &:nth-child(2),
                     &:nth-child(3) {
                        display: none;
                     }
                  }
               }
            }

            &-tbody {
               tr {
                  &.active {
                     td {
                        padding-bottom: 490px;
                     }

                     .agreementDetailsMobile {
                        display: block;
                     }
                  }

                  td {
                     &:nth-child(1),
                     &:nth-child(2),
                     &:nth-child(3) {
                        display: none;
                     }

                     &.status {
                        .btns {
                           display: none;
                        }

                        .detailsMobile {
                           display: block;
                        }
                     }

                     &.agreementDetails {
                        display: none !important;
                     }
                  }
               }
            }
         }
      }
   }
</style>
