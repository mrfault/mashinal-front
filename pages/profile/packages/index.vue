<template>
   <div class="myPackages">
      <div class="myPackages__container">
         <portal to="breadcrumbs">
            <breadcrumbs :crumbs="crumbs"/>
         </portal>
         <component
            :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
            :bar-title="$t('my_packages')"
            @back="$router.push($localePath('/garage-services'))"
            height-auto>
            <div>
               <div v-if="showPackage === false">
                  <div class="row">
                     <div class="col-md-12">
                        <CustomNotifications
                           v-if="!!unpaidAgreement"
                           class="mb-3"
                           :title="$t('unpaid_invoice')"
                           :unpaidAgreement="unpaidAgreement"
                           :subtitle="$t('unpaid_params', {
                              package_type: unpaidAgreement.package.name,
                              start_date: $moment(unpaidAgreement.start_date).format('DD.MM.YYYY'),
                              end_date: $moment(unpaidAgreement.end_date).format('DD.MM.YYYY'),
                              price: unpaidAgreement.price
                           })"/>
                     </div>
                  </div>
                  <div class="row" v-if="getAgreements.length > 0">
                     <div class="col-md-7">
                        <div class="package-card mt-3 mt-lg-0">
                           <div class="row">
                              <div class="col-md-12">
                                 <h2 class="package-card-title mb-3">{{ $t('package_information') }}</h2>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-md-12">
                                 <table class="package-card-table mb-5">
                                    <tr>
                                       <td class="text-left">{{ $t('package_type') }}</td>
                                       <td class="text-right">{{ getAgreements[(getAgreements.length - 1)].package.name }}</td>
                                    </tr>
                                    <tr>
                                       <td class="text-left">{{ $t('package_price') }}</td>
                                       <td class="text-right">{{ getAgreements[(getAgreements.length - 1)].price }} AZN</td>
                                    </tr>
                                    <tr>
                                       <td class="text-left">{{ $t('duration_package') }}</td>
                                       <td class="text-right">{{ getAgreements[(getAgreements.length - 1)].days_type }} {{ $t('month') }}</td>
                                    </tr>
                                    <tr>
                                       <td class="text-left">{{ $t('start_date') }}</td>
                                       <td class="text-right">
                                          {{ $moment(new Date(getAgreements[(getAgreements.length - 1)].start_date)).format('DD.MM.YYYY') }}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td class="text-left">{{ $t('end_date') }}</td>
                                       <td class="text-right">
                                          {{ $moment(new Date(getAgreements[(getAgreements.length - 1)].end_date)).format('DD.MM.YYYY') }}
                                       </td>
                                    </tr>
                                 </table>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-md-12">
                                 <button class="btn btn-refresh-package mt-5" @click="setShowPackage(true)">
                                    {{ $t('package_refresh') }}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="col-md-5" v-if="!isMobileBreakpoint">
                        <div class="package-card mt-3 mt-lg-0">
                           <div class="row">
                              <div class="col-md-12">
                                 <h2 class="package-card-subtitle mb-2">{{ $t('package_current') }}</h2>
                              </div>
                              <div class="col-md-12">
                                 <h2 class="package-card-title mb-5">{{ getAgreements[(getAgreements.length - 1)].package.name }}</h2>
                              </div>
                           </div>
                           <div class="row">
                              <div class="col-md-12">
                                 <ul class="package-card-list">
                                    <li v-for="option in getAgreements[(getAgreements.length - 1)].package.items" :key="option.id"
                                        :class="option.checked ? 'checked' : 'unchecked'">
                                       <div>
                                          <inline-svg :src="'/icons/check3.svg'" v-if="option.checked"/>
                                          <inline-svg :src="'/icons/close2.svg'" v-else/>
                                       </div>
                                       <div>
                                          {{ option.text }}
                                       </div>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="clearfix"></div>
                  </div>
               </div>
               <template v-else>
                  <CustomNotifications
                     v-if="!!unpaidAgreement"
                     class="mb-3"
                     :title="$t('unpaid_invoice')"
                     :unpaidAgreement="unpaidAgreement"
                     :subtitle="$t('unpaid_params', {
                        package_type: unpaidAgreement.package.name[locale],
                        start_date: $moment(unpaidAgreement.start_date).format('DD.MM.YYYY'),
                        end_date: $moment(unpaidAgreement.end_date).format('DD.MM.YYYY'),
                        price: unpaidAgreement.price })"/>
                  <Packages :packages="getPackages" :disableBtn="disableBtn"/>
               </template>
            </div>
         </component>
      </div>
   </div>
</template>

<script>
import Packages from "~/components/profile/Packages.vue";
import CustomNotifications from "~/components/elements/CustomNotifications.vue";
import ComeBack from "~/components/elements/ComeBack.vue";
import {mapGetters} from "vuex";

export default {
   layout: 'garageLayout',
   components: {Packages, CustomNotifications, ComeBack},
   head() {
      return this.$headMeta({
         title: this.$t('my_packages'),
      });
   },
   data() {
      return {
         showPackage: true
      }
   },
   nuxtI18n: {
      paths: {
         az: '/profil/paketler'
      }
   },
   methods: {
      setShowPackage(params) {
         this.showPackage = params;
      }
   },
   mounted() {
      if (this.getAgreements.length) {
         console.log(this.getAgreements)
         this.showPackage = false;
      }
   },
   computed: {
      ...mapGetters({
         getPackages: 'packages/getPackages',
         getAgreements: 'getAgreements'
      }),
      crumbs() {
         return [
            {name: this.$t('dashboard'), route: `${this.user.autosalon ? '/dashboard/1' : '/garage-services'}`},
            {name: this.$t('my_packages')}
         ]
      },
      unpaidAgreement() {
         return this.getAgreements.find(item => item.payment.is_paid === false);
      },
      disableBtn() {
         return {
            hasPackage: this.getPackages.find(item => item.id === this.getAgreements[0]?.package?.id),
            is_expired: this.getAgreements[0]?.is_expired
         }
      }
   },
   async asyncData({store}) {
      await Promise.all([
         store.dispatch('packages/getPackages'),
         store.dispatch('fetchAgreements')
      ]);
   }
}
</script>

<style lang="scss">
.package-card {
   padding: 32px 24px;
   border-radius: 12px;
   border: 1px solid var(--gray-300, #CDD5DF);
   background: var(--main-white, #FFF);
   min-height: 535px;
}

.package-card-title {
   color: var(--gray-800, #1B2434);
   font-size: 28px;
   font-style: normal;
   font-weight: 700;
   line-height: 32px;
}

.package-card-subtitle {
   color: var(--gray-600, #4B5565);
   font-size: 16px;
   font-style: normal;
   font-weight: 600;
   line-height: 24px;
}

.package-card-table {
   width: 100%;
}

.package-card-table tr {
   border-bottom: 1px solid var(--gray-200, #E3E8EF);
}

.package-card-table tr:last-child {
   border-bottom: 1px solid transparent;
}

.package-card-table tr td {
   padding: 20px 0;
}

.package-card-table tr td.text-left {
   color: var(--gray-700, #364152);
   font-size: 16px;
   font-style: normal;
   font-weight: 400;
   line-height: 20px;
}

.package-card-table tr td.text-right {
   color: var(--gray-900, #121926);
   text-align: right;
   font-size: 16px;
   font-style: normal;
   font-weight: 500;
   line-height: 20px;
}

.package-card .btn-refresh-package {
   display: flex;
   padding: 14px 16px;
   justify-content: center;
   align-items: center;
   gap: 8px;
   align-self: stretch;
   border-radius: 8px;
   background: var(--success-600, #039855);
   color: var(--main-white, #FFF);
   text-align: center;
   font-size: 16px;
   font-style: normal;
   font-weight: 500;
   line-height: 20px;
   width: 100%;
}

.package-card-list {
   padding: 0;
   margin: 0;
   list-style: none;
}

.package-card-list li {
   color: var(--gray-900, #121926);
   font-size: 16px;
   font-style: normal;
   font-weight: 400;
   line-height: 20px;
   margin-bottom: 10px;
   display: flex;
   justify-content: start;
   align-items: center;
}

.package-card-list li:last-child {
   margin-bottom: 0;
}

.package-card-list li.unchecked {
   display: none;
}

.package-card-list li svg {
   margin-right: 10px;
   width: 24px;
   height: 24px;
}

.dark-mode {
   .package-card {
      background: #1B2434;
      border: 1px solid #364152;
   }

   .package-card-table tr td.text-left {
      color: #CDD5DF;
   }

   .package-card-table tr td.text-right {
      color: #CDD5DF;
   }

   .package-card-table tr {
      border-bottom: 1px solid #E3E8EF;
   }

   .package-card-table tr:last-child {
      border-bottom: 1px solid transparent;
   }

   .package-card-list li {
      color: #CDD5DF;
   }

   .package-card-list li.unchecked svg path {
      stroke: #CDD5DF;
      fill: #CDD5DF;
   }
}

.myPackages {
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

   .customPackages {
      margin: 0px -25px 0 -25px;
   }

   .swiper-container {
      padding-top: 25px;

      .swiper-wrapper {
         align-items: stretch;
         height: unset !important;
      }
   }

   * {
      box-sizing: border-box;
   }
}

.dark-mode {
   .myPackages {
      &__title {
         color: #A4A4A5;
      }
   }
}

@media (max-width: 1250px) {
   .myPackages {
      .customPackages {
         &__info {
            &-item {
               font-size: 13px;
            }
         }
      }
   }
}

@media (max-width: 992px) {
   .myPackages {
      .customPackages {
         &__info {
            &-item {
               font-size: 12px;

               svg {
                  max-width: 20px;
                  width: 100%;
               }
            }
         }
      }
   }
}

@media (max-width: 370px) {
   .myPackages {
      .customPackages {
         &__subtitle {
            font-size: 35px;
         }

         &__info {
            &-item {
               font-size: 12px;

               svg {
                  max-width: 20px;
                  width: 100%;
               }
            }
         }
      }
   }
}

@media (min-width: 550px) {
   .myPackages {
      .customPackages {
         margin: 0px 0 0 0;
      }
   }
}
</style>
