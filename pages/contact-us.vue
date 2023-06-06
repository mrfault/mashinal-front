<template>
   <div class="pages-contact-us pt-5 pt-lg-0">
      <div class="container">
         <breadcrumbs :crumbs="crumbs">
<!--            <share-it type="contact"/>-->
         </breadcrumbs>

         <div class="pages-contact-us__inner">
            <div class="divider">
               <h2 class="pages-contact-us__title">{{ $t('send_an_application') }}</h2>

               <form class="form" @submit.prevent="sendMessage" novalidate>
                  <div class="row">
                     <div class="col-12 mb-2 mb-lg-3">
                        <form-text-input
                           v-model="form.email"
                           autocomplete="email"
                           :maxlength="255"
                           :placeholder="$t('email')"
                           :mask="$maskEmail()"
                           :invalid="$v.form.email.$error"
                        />
                     </div>

                     <div class="col-12 mb-2 mb-lg-3">
                        <form-text-input
                           v-model="form.phone"
                           autocomplete="email"
                           :maxlength="255"
                           :placeholder="$t('phone_number')"
                           :mask="$maskPhone()"
                           :invalid="$v.form.phone.$error"
                        />
                     </div>

                     <div class="col-12 mb-2 mb-lg-3">
                        <form-select
                           :label="$t('title_application')"
                           :options="types"
                           :clearPlaceholder="true"
                           :clear-option="false"
                           v-model="form.type"
                        />
                     </div>

                     <div class="col-12 mb-2 mb-lg-3">
                        <form-textarea
                           v-model="form.message"
                           :placeholder="$t('appeal_text')"
                           :invalid="$v.form.message.$error"
                           :maxlength="3000"
                        />
                     </div>

                     <div class="col-12">
                        <button type="submit" class="btn btn--green full-width">
                           {{ $t('appeal_send') }}
                        </button>
                     </div>
                  </div>
               </form>
            </div>

            <div class="divider d-none d-md-block">
               <img src="/images/contact-us_img.png" alt="img">
            </div>
         </div>

         <div class="card contact-us-card">
            <div class="row contact-us_info">
               <div class="col-md-4 mb-5 mb-md-0">
                  <div class="contact-us_info-details">
                     <div class="icon">
                        <inline-svg :src="support.phone.icon" />
                     </div>

                     <div class="text">
                        <h5>{{ $t('make_a_call') }}</h5>
                        <a :href="`tel:${support.phone.name}`">{{ support.phone.name }}</a>
                     </div>
                  </div>
               </div>

               <div class="col-md-4 mb-5 mb-md-0">
                  <div class="contact-us_info-details">
                     <div class="icon">
                        <inline-svg :src="support.email.icon" />
                     </div>

                     <div class="text">
                        <h5>{{ $t('write_an_email') }}</h5>
                        <a :href="`mailto:${support.email.name}`">{{ support.email.name }}</a>
                     </div>
                  </div>
               </div>

               <div class="col-md-4 mb-5 mb-md-0">
                  <div class="contact-us_info-details">
                     <div class="icon">
                        <inline-svg :src="support.worktime.icon" />
                     </div>

                     <div class="text">
                        <h5>{{ $t('our_working_hours') }}</h5>
                        <span>{{ support.worktime.name }}</span>
                     </div>
                  </div>
               </div>
            </div>
<!--            <template v-if="isMobileBreakpoint">-->
<!--               <hr/>-->
<!--               <share-it type="contact"/>-->
<!--            </template>-->
         </div>
      </div>
   </div>
</template>

<script>
   import { required, email } from 'vuelidate/lib/validators';

   export default {
      name: 'pages-contact-us',

      nuxtI18n: {
         paths: {
            az: '/elaqe'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('contact_us')
         });
      },

      data() {
         return {
            pending: false,
            form: {
               email: '',
               phone: '',
               type: '',
               message: ''
            },
            support: {
               phone: { name: '*8787', icon: '/icons/phone_new.svg ' },
               email: { name: 'support@mashin.al', icon: '/icons/email_new.svg ' },
               worktime: { name: this.$t('worktime_support'), icon: '/icons/clock_new.svg ' },
            }
         }
      },

      methods: {
         async sendMessage() {
            this.$v.$touch();
            if (this.pending || this.$v.$error) return;
            this.pending = true;
            try {
               await this.$axios.$post('/save_mail', this.form);
               this.pending = false;
               this.form.email = '';
               this.form.message = '';
               this.form.phone = '';
               this.$v.$reset();
               this.$toasted.success(this.$t('message_sent_successfully'));
            } catch (err) {
               this.pending = false;
            }
         }
      },

      computed: {
         crumbs() {
            return [
               { name: this.$t('contact_us') }
            ]
         },

         types() {
            return [
               { id: 1, name: this.$t('offer') },
               { id: 2, name: this.$t('complaint') },
               { id: 3, name: this.$t('appeal') },
            ]
         }
      },

      validations: {
         form: {
            email: {required, email},
            phone: {},
            message: {required},
         }
      }
   }
</script>

<style lang="scss" scoped>
   .pages-contact-us {
      &__title {
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #121926;
         margin-bottom: 32px;
      }

      &__inner {
         display: flex;
         border-radius: 12px;
         margin-bottom: 40px;
         overflow: hidden;

         .divider {
            width: 45%;

            &:first-child {
               padding: 40px 32px 32px;
               background-color: #FFFFFF;
            }

            &:last-child {
               width: 55%;
            }
         }

         img {
            width: 100%;
            height: 100%;
         }
      }

      .contact-us-card {
         padding: 32px;

         a, span {
            font-size: 16px;
            line-height: 24px;
         }
      }
   }

   @media (max-width: 992px) {
      .pages-contact-us {
         &__inner {
            .divider {
               width: 100%;
            }
         }
      }
   }

   @media (max-width: 600px) {
      .pages-contact-us {
         .breadcrumbs {
            display: none !important;
         }

         &__title {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
         }

         &__inner {
            .divider {
               &:first-child {
                  padding: 32px 24px 24px;
               }
            }
         }

         .contact-us-card {
            padding: 0;
            background-color: transparent;

            h5 {
               font-size: 20px;
               line-height: 24px;
            }

            .icon {
               background-color: #FFFFFF;
            }
         }
      }
   }
</style>
