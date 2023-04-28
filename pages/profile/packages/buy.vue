<template>
   <div class="myPackagesBuy">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="myPackagesBuy__inner">
            <div class="divider">
               <div class="myPackagesBuy__package myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">Rəsmiləşdirmə</h4>
                  <h4 class="myPackagesBuy__cart-subtitle">Standart paket</h4>

                  <ul class="myPackagesBuy__package-list">
                     <li
                        :class="['myPackagesBuy__package-list_item', {'opacity' : !option.checked}]"
                        v-for="option in options.list"
                        :key="option.id"
                     >
                        <inline-svg :src="'/icons/check2.svg'" v-if="option.checked" />
                        <inline-svg :src="'/icons/close2.svg'" v-else />

                        <span>{{ option.name }}</span>
                     </li>
                  </ul>
               </div>
            </div>

            <div class="divider">
               <div class="myPackagesBuy__duration myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">Paketin müddəti</h4>
                  <h4 class="myPackagesBuy__cart-subtitle">Seçim edin</h4>

                  <form-buttons
                     :options="durations"
                     :group-by="3"
                     v-model="duration"
                  />

                  <p class="myPackagesBuy__duration-description">
                     “Ödəniş et” düyməsini sıxmaqla siz <span>Mashin.al istifadəçi razılaşmasını və
                     ofertasını</span> qəbul etdiyinizi təsdiqləmiş olursunuz.
                  </p>
               </div>

               <div class="myPackagesBuy__salon myPackagesBuy__cart">
                  <h4 class="myPackagesBuy__cart-title">Avtosalon adı</h4>
                  <h4 class="myPackagesBuy__cart-subtitle">Adı daxil edin</h4>

                  <div class="myPackagesBuy__salon-info">Best Cars</div>
               </div>
            </div>

            <div class="divider">
               <div class="myPackagesBuy__receipt myPackagesBuy__cart">
                  <ul class="myPackagesBuy__receipt-list">
                     <li
                        class="myPackagesBuy__receipt-list_item"
                        v-for="item in receipt"
                        :key="item.id"
                     >
                        <span>{{ item.key }}</span>
                        <span>{{ item.value }}</span>
                     </li>
                  </ul>

                  <nuxt-link to="/dashboard/3/statistics" class="btn btn--green full-width">{{ $t('pay') }}</nuxt-link>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   export default {
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

      data() {
         return {
            options: {
               id: 1,
               title: 'Standart paket',
               list: [
                  { id: 1, name: '50 elan', checked: true },
                  { id: 2, name: '150 AZN reklam büdcəsi', checked: true },
                  { id: 3, name: 'Avtosalon üçün korporativ səhifə', checked: true },
                  { id: 4, name: 'Platforma daxili mesaj sistemi', checked: true },
                  { id: 5, name: 'Xüsusi fərdi köməkçi və ay ərzində  2 dəfə sayt-vizit', checked: true },
                  { id: 6, name: 'Statistik və analitik məlumatlar', checked: true },
                  { id: 7, name: 'Zəng tarixçəsi', checked: true },
                  { id: 8, name: 'Sosial şəbəkələrdə reklam (büdcəsiz)', checked: true },
                  { id: 9, name: 'Sosial şəbəkələrdə reklam (50 AZN büdcə ilə)', checked: false },
                  { id: 10, name: 'Sosial şəbəkələr üçün foto çəkiliş', checked: false }
               ]
            },

            duration: 1,
            durations: [
               { key: 1, name: '30 gün' },
               { key: 2, name: '60 gün' },
               { key: 3, name: '90 gün' }
            ],
            receipt: [
               { id: 1, key: 'Paket:', value: 'Standart' },
               { id: 2, key: 'Müddət:', value: '30 gün' },
               { id: 3, key: 'Başlama tarixi:', value: '23.03.2023' },
               { id: 4, key: 'Yekun:', value: '300 AZN' }
            ]
         }
      },

      computed: {
         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('my_packages'), route: '/profile/packages' },
               { name: this.$t('registration2') }
            ]
         }
      }
   }
</script>

<style lang="scss">
   .myPackagesBuy {
      &__inner {
         display: flex;
         justify-content: space-between;

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

               span {
                  margin-left: 12px;
               }
            }
         }
      }

      &__duration {
         margin-bottom: 16px;

         &-description {
            margin-top: 85px !important;

            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            color: #ADADAD;

            span {
               color: #246EB2;
            }
         }

         .form-buttons {
            margin-top: 24px;

            .form-group {
               .btn {
                  height: 42px;
               }
            }
         }
      }

      &__salon {
         &-info {
            margin-top: 16px;
            padding: 15px 16px;
            border-radius: 4px;
            font-weight: 500;
            line-height: 17px;
            color: #081A3E;
            background-color: #F3F7FC;
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
</style>
