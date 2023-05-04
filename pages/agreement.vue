<template>
   <div class="agreementPage">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />
<!--         <pre>{{getAgreements}}</pre>-->

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
                  <td>{{ agreement.package.price }} AZN</td>
                  <td :class="['status', {'not_paid' : !agreement.payment.is_paid}]">
                     <span>{{ agreement.payment.is_paid ? $t('already_paid') : $t('not_paid') }}</span>

                     <div class="btns">
                        <inline-svg :src="'/icons/download.svg'" />

                        <button class="btn" v-if="!agreement.payment.is_paid">{{ $t('pay') }}</button>

                        <icon :name="'chevron-down'" />
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
                                 <span>{{ agreement.package.price }} AZN</span>
                              </div>

                              <div class="agreementDetails__content-price_item">
                                 <span>{{ $t('total') }}:</span>
                                 <span>{{ agreement.package.price }} AZN</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>


<!--         <table class="invoiceTable">-->
<!--&lt;!&ndash;            <thead class="invoiceTable__thead">&ndash;&gt;-->
<!--&lt;!&ndash;               <tr>&ndash;&gt;-->
<!--&lt;!&ndash;                  <th>Hesab - Faktura tarixi</th>&ndash;&gt;-->
<!--&lt;!&ndash;                  <th>Hesab - Faktura nömrəsi</th>&ndash;&gt;-->
<!--&lt;!&ndash;                  <th>Xidmətin növü</th>&ndash;&gt;-->
<!--&lt;!&ndash;                  <th>Məbləğ</th>&ndash;&gt;-->
<!--&lt;!&ndash;                  <th>Status və tarix</th>&ndash;&gt;-->
<!--&lt;!&ndash;               </tr>&ndash;&gt;-->
<!--&lt;!&ndash;            </thead>&ndash;&gt;-->

<!--            <tbody class="invoiceTable__tbody">-->
<!--               <tr>-->
<!--                  <td>asdasdasd</td>-->
<!--               </tr>-->
<!--            </tbody>-->
<!--         </table>-->

<!--         <aaa/>-->

<!--         <div-->
<!--            class="invoice"-->
<!--            style="-->
<!--               width: 100%;-->
<!--               max-width: 600px;-->
<!--               padding: 20px;-->
<!--               background: url('/images/invoice_bg.png') center center / cover no-repeat-->
<!--            "-->
<!--         >-->
<!--            <div-->
<!--               class="invoice__head"-->
<!--               style="-->
<!--                  display: flex;-->
<!--                  align-items: center;-->
<!--                  justify-content: space-between;-->
<!--                  padding-bottom: 10px;-->
<!--                  border-bottom: 2px solid #EE2539;-->
<!--               "-->
<!--            >-->
<!--               <div class="divider">-->
<!--                  <img src="/icons/alv-logo.svg" alt="alv-logo">-->
<!--               </div>-->

<!--               <div-->
<!--                  class="divider"-->
<!--                  style="-->
<!--                     display: flex;-->
<!--                     align-items: center;-->
<!--                  "-->
<!--               >-->
<!--                  <ul-->
<!--                     style="-->
<!--                        list-style: none;-->
<!--                        margin: 0 8px 0 0;-->
<!--                        padding: 0 8px 0 0;-->
<!--                        border-right: 1px solid #0A1B3D;-->
<!--                        text-align: right;-->
<!--                     "-->
<!--                  >-->
<!--                     <li>*8787</li>-->
<!--                     <li>Park Azure, Blok 6, Mərtəbə 3</li>-->
<!--                     <li>www.al.ventures</li>-->
<!--                  </ul>-->

<!--                  <img src="/icons/alv-logo.svg" alt="alv-logo" style="width: 50px; height: 50px">-->
<!--               </div>-->
<!--            </div>-->
<!--         </div>-->
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import aaa from "~/components/aaa.vue";

   export default {
      components: {aaa},
      data() {
         return {
            activeAgreement: 1
         }
      },

      computed: {
         ...mapGetters({
            getAgreements: 'getAgreements'
         }),

         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('contract') }
            ]
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchAgreements');
      }
   }
</script>

<style lang="scss" scoped>
   .agreementPage {
      .invoice {
         margin-top: 100px;}
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
                  }

                  &.not_paid {
                     color: #081A3E;
                     opacity: 0.3;
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
                           max-width: 784px;

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
                           //display: flex;
                           //align-items: center;
                           //flex-direction: column;
                           padding: 32px 75px;
                           border-radius: 4px;
                           border: 1px solid #D6E4F8;

                           &_item {
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
</style>
