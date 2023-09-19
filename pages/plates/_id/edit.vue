<template>
   <div class="pages-sell">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <registration_mark isEdit :announcement="announcement" :isReady="isReady"
                                     @getForm="getPlateForm($event)"/>
                  <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
                     {{ $t("place_announcement") }}
                  </button>
               </form>
               <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {minLength, required} from "vuelidate/lib/validators";
import {PaymentMixin} from '~/mixins/payment';
import Registration_mark from "~/components/sell/registration_mark.vue";
import {ToastErrorsMixin} from "~/mixins/toast-errors";

export default {
   components: {Registration_mark},
   nuxtI18n: {
      paths: {
         az: '/qeydiyyat-nishani/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('registration_marks'),
      });
   },

   mixins: [ToastErrorsMixin, PaymentMixin],

   middleware: ['auth_general'],

   data() {
      return {
         isReady: false,
         pending: false,
      }
   },

   methods: {
      // async handleSubmit() {
      //    this.$v.$touch();
      //    if (this.$v.$error) return;
      //
      //    this.pending = true;
      //
      //    this.form.car_number = `${this.region_id.split('-')[0]} - ${this.region_letter1}${this.region_letter2} - ${this.region_number}`;
      //
      //    try {
      //       await this.$axios.$post(`/sell/plate/edit/${this.$route.params.id.slice(0, -1)}`, this.form)
      //          .then(() => {
      //             this.pending = false;
      //             this.$toasted.success(this.$t('success_payment'));
      //             this.$router.push(this.$localePath('/profile/announcements'));
      //          })
      //          .catch(() => {
      //             this.$toasted.error(this.$t('error'));
      //          })
      //    } catch (err) {
      //       console.error(err)
      //    }
      // }
      ...mapActions(['registrationMarkEdit']),
      async getPlateForm(form) {
         try {
            const res = await this.registrationMarkEdit({id: this.$route.params.id.slice(0, -1), form: form})
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });
               });
            }
         } catch (e) {
         }
      },
      onClick() {
         this.isReady = !this.isReady
      },

   },

   computed: {
      ...mapGetters({
         announcement: 'announcement',
         cities: 'sellOptions'
      }),

      crumbs() {
         return [{name: this.$t('edit_ad')}]
      }
   },

   async fetch({store, route}) {
      await store.dispatch('fetchRegistrationMark', route.params.id.slice(0, route.params.id.length - 1));
      await store.dispatch('getOptions');
   },

   mounted() {
      // this.region_id = this.registrationMark.car_number.split('-')[0];
      // this.region_letter1 =  this.registrationMark.car_number.split('-')[1][0];
      // this.region_letter2 =  this.registrationMark.car_number.split('-')[1][1];
      // this.region_number =  this.registrationMark.car_number.split('-')[2];
      // this.form.price =  this.registrationMark.price.split(' ').slice(0, -1).join('');
      // this.form.currency_id =  this.registrationMark.currency;
      // this.form.region_id =  this.registrationMark.region.id;
      // this.form.comment =  this.registrationMark.comment;
   },

   validations: {
      form: {
         price: {minLength: minLength(2)},
         currency_id: {required},
         region_id: {required}
      }
   }
}
</script>
<style lang="scss">
.pages-sell {
   padding: 40px 0 160px 0;

   .announce_container {
      .card {

         .add_announce_form {

            .btn--pale-green-outline {
               margin-top: 24px;
            }

            .price_types {
               .price_item {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 52px;
                  padding: 0 16px;
               }
            }
         }
      }

   }

}

.dark-mode {
   .pages-sell {

      .announce_container {
         .card {

            .add_announce_form {

               .price_types {
                  .toggle_item {

                     border-color: #121926;
                     overflow: hidden;

                     &.active {
                        border-color: #155EEF;
                     }

                     .price_item {
                        background-color: #121926;
                        color: #9AA4B2;
                     }
                  }
               }
            }
         }

      }
   }
}

   @media (max-width: 1150px) {
      .pages-sell {

         .announce_container {
            .card {
               padding-right: 24px;

               .add_announce_form {

                  .btn--pale-green-outline {
                  }
               }
            }

         }

      }
   }

   @media (max-width: 485px) {
      .registration_mark_form {
         .divider {

            &.mobile-column {
               display: flex !important;
               flex-direction: column;
            }

            .price_types {
               .toggle_container {
                  gap: 8px !important;
               }

               .price_item {
                  padding: 0 8px;
               }
            }
         }


      }
   }
</style>
