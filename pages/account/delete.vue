<template>
   <div class="deleteAccount">
      <div class="container">
         <h1 class="deleteAccount__title">{{ $t('delete_account') }}</h1>

         <div class="deleteAccount__inner">
            <div class="deleteAccount__content">
               <inline-svg src="/images/account_delete.svg" />

               <h2 class="deleteAccount__content-title">{{ $t('delete_account') }}</h2>
               <h3 class="deleteAccount__content-subtitle">{{ $t('delete_account_description') }}</h3>

               <form-text-input
                  v-model="phone"
                  :auto-focus="!isMobileBreakpoint"
                  :mask="$maskPhone()"
                  :placeholder="$t('your_phone_number')"
                  :invalid="invalidPhone"
                  autocomplete="tel"
               />

               <button
                  :class="['btn', 'btn--green', 'full-width mt-4', { pending }]"
                  @click="handleDelete"
               >
                  {{ $t('go_further') }}
               </button>
            </div>
         </div>
      </div>

      <modal-popup
         :modal-class="'deleteAccount__modal'"
         :toggle="openModal"
         @close="closeModal"
      >
         <inline-svg src="/icons/success_icon.svg" />

         <h3 class="deleteAccount__modal-title">{{ $t('delete_account') }}</h3>

         <h4 class="deleteAccount__modal-subtitle">{{ $t('delete_account_description_2') }}</h4>

         <button
            :class="['btn', 'btn--green', 'full-width', { pending }]"
            @click="closeModal"
         >
            {{ $t('close2') }}
         </button>
      </modal-popup>
   </div>
</template>

<script>
   import MonetizationAlertModal from "~/components/sell/MonetizationAlertModal.vue";
   import FeedbackModal from "~/components/sell/FeedbackModal.vue";
   import { UserDataMixin } from '~/mixins/user-data'

   export default {
      components: { FeedbackModal, MonetizationAlertModal },

      mixins: [ UserDataMixin ],

      middleware: 'auth_general',

      nuxtI18n: {
         paths: {
            az: '/hesabin-silinmesi'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('delete_account')
         })
      },

      data() {
         return {
            pending: false,
            openModal: false,
            invalidPhone: false,
            phone: ''
         }
      },

      methods: {
         handleDelete() {
            if (+this.phone.replace(/[^0-9]+/g, '') === this.user.phone) {
               this.openModal = true;
            } else {
               console.log('else')
               this.invalidPhone = true;
            }
         },

         closeModal() {
            this.logout();
         }
      }
   }
</script>

<style lang="scss">
   .deleteAccount {
      padding: 24px 0;

      &__title {
         color: #121926;
         font-size: 20px;
         font-weight: 600;
         line-height: 24px;
      }

      &__inner {
         display: flex;
         align-items: center;
         justify-content: center;
         margin-top: 24px;
         padding: 70px 0;
         background-color: #FFFFFF;
      }

      &__content {
         text-align: center;
         max-width: 350px;
         width: 100%;

         &-title {
            margin-top: 40px;
            color: #121926;
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
         }

         &-subtitle {
            margin: 16px 0 24px 0;
            color: #364152;
            font-size: 16px;
            font-weight: 400;
            line-height: 20px;
         }
      }
   }

   .dark-mode {
      .deleteAccount {
         &__inner {
            background-color: #1B2434;
         }
      }

      .modal-popup {
         &.deleteAccount__modal {
            .deleteAccount__modal-title {
               color: #FFFFFF;
            }

            .deleteAccount__modal-subtitle {
               color: #CDD5DF;
            }
         }
      }
   }

   .modal-popup {
      &.deleteAccount__modal {
         max-width: 476px;
         width: 100%;
         text-align: center;

         .deleteAccount__modal-title {
            margin-top: 24px;
            color: #121926;
            font-size: 24px;
            font-weight: 600;
            line-height: 28px;
         }

         .deleteAccount__modal-subtitle {
            margin: 20px 0 32px 0;
            color: #364152;
            font-size: 18px;
            font-weight: 400;
            line-height: 24px;
         }
      }
   }
</style>