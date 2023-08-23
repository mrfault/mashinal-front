<template>
   <div class="add_announce">
      <div class="container">
         <h1 class="add_announce_title">{{ $t('new_announce') }}</h1>
         <div class="announce_container">
            <div class="card">
               <div class="add_announce_info">
                  <inline-svg
                     :src="'/icons/stars.svg'"
                     class="add_announce_info_svg"
                  />
                  <p v-html="$t('add_announce_info')"/>
               </div>
               <div class="mobile_info" v-if="Object.values(user).length">
                  <inline-svg
                     :src="'/icons/mobile_2.svg'"
                     class="mobile_info_svg info_svg"
                  />
                  <p v-html="$t('mobile_info', {phone: '+' + user.phone})"/>
               </div>
               <h2 class="card_title">{{ announceTitle }}</h2>
               <div class="card_container">
                  <form class="add_announce_form">
                     <form-select
                        :label="$t('announcement_type')"
                        :options="searchMenus.filter((menu) => menu.id !== 3).map((menu) => ({...menu,name: $t(menu.title)}))"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        object-in-value
                        has-search
                        v-model="form.announce_type"
                        @change="handleAnnounceType"
                     />


                     <car_form v-if="form.announce_type.title === 'cars'" :announcement="announcement"
                               :isReady="isReady"
                               @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                               @getForm="getCarForm($event)" @done="submitShow = $event"/>
                     <moto_form v-if="form.announce_type.title === 'moto'" :announcement="announcement"
                                :isReady="isReady"
                                @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                                @getForm="getMotoForm($event)" @done="submitShow = $event"/>
                     <part_form v-if="form.announce_type.title === 'parts'" :announcement="announcement"
                                @changeType="onChangePartType($event)"
                                @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                                :isReady="isReady" @getForm="getPartForm($event)" @done="submitShow = $event"/>
                     <registration_mark v-if="form.announce_type.title === 'registration_marks'" :isReady="isReady"
                                        @getForm="getRegistrationMarksForm($event)"/>

                     <template v-if="submitShow">
                        <div class="contacts">
                           <h2>{{ $t("contact_information") }}</h2>
                           <form-text-input
                              :class="{form_error: $v.authForm.name.$error}"
                              v-model="authForm.name"
                              :placeholder="$t('your_name') + '*'"
                              :invalid="$v.authForm.name.$error"
                              :disabled="loggedIn"
                           />
                           <form-text-input
                              :class="{form_error: $v.authForm.email.$error}"
                              v-model="authForm.email"
                              :placeholder="$t('email')"
                              :mask="$maskEmail()"
                              :invalid="$v.authForm.email.$error"
                           />
                           <form-text-input
                              v-if="!Object.values(user).length"
                              :class="{form_error: $v.authForm.phone.$error}"
                              key="phone"
                              :placeholder="$t('mobile_phone_number') + '*'"
                              v-model="authForm.phone"
                              :mask="$maskPhone()"
                              :invalid="$v.authForm.phone.$error"
                           />
                           <form-text-input
                              v-if="authStep === 'handleOTP'"
                              :class="{form_error: $v.authForm.code.$error}"
                              :placeholder="$t('otp') + '*'"
                              v-model="authForm.code"
                              :invalid="$v.authForm.code.$error"
                           />
                           <div class="contacts_info" v-if="!Object.values(user).length">
                              <inline-svg class="contacts_info_svg info_svg" :src="'/icons/info.svg'"/>
                              <p>{{ $t("contacts_registration_info") }}</p>
                           </div>

                           <div class="service_packages"
                                v-if="form.announce_type.title === 'cars' || form.announce_type.title === 'moto'">
                              <div
                                 :class="['package', 'standard_package', form.add_monetization === 0 ? 'selected': '' ]"
                                 @click="form.add_monetization = 0">
                                 <div class="title">
                                    <inline-svg class="stars_svg" :src="'/icons/stars.svg'"/>
                                    <p>{{ $t('standard_announce') }}</p>
                                 </div>
                                 <ul class="content">
                                    <li class="content_list" v-for="sp in servicePackages?.standard" :key="sp.id">
                                       <inline-svg :class="sp.status ? 'active' : 'check_svg'"
                                                   :src="'/icons/filled_circled_check.svg'"/>
                                       {{ sp.text }}
                                    </li>
                                 </ul>
                                 <div class="package_price">
                                    <p>{{ $t('free_for_30_days') }}</p>
                                 </div>
                              </div>
                              <div
                                 :class="['package', 'premium_package', form.add_monetization === 1 ? 'selected': '' ]"
                                 @click="form.add_monetization = 1">
                                 <div class="sale_effect">
                                    <p>x3</p>
                                    <span v-html="$t('x3morefaster')"></span>
                                 </div>
                                 <div class="title">
                                    <inline-svg class="stars_svg" :src="'/icons/promote_square.svg'"/>
                                    <p>{{ $t('paid_announce') }}</p>

                                 </div>
                                 <ul class="content">
                                    <li class="content_list" v-for="sp in servicePackages?.premium" :key="sp.id">
                                       <inline-svg :class="sp.status ? 'active' : 'check_svg'"
                                                   :src="'/icons/filled_circled_check.svg'"/>
                                       {{ sp.text }}
                                    </li>
                                 </ul>
                                 <div class="package_price">
                                    <p><span>{{ $t('discount_message') }}</span>{{ $t('total_count_message') }}</p>
                                    <div class="badge">
                                       <p style="text-transform: lowercase">40% {{ $t('discount') }}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <button type="button" @click="onClick()"
                                   class="btn full-width btn--pale-green-outline active">
                              {{ authStep === "notLoggedIn" ? $t("enter_sms_code") : $t("place_announcement") }}
                           </button>
                        </div>
                        <div class="comment_info">
                           <p>{{ $t("by_posting_an_ad_you_confirm_your_agreement_with_the_rules") }}:
                              <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`"
                                         @click.native.prevent="showRules = true"
                                         event="">
                                 <strong style="text-decoration: underline">{{ $t('general_rules') }}</strong>
                              </nuxt-link>
                           </p>
                        </div>
                        <modal-popup
                           :modal-class="'wider'"
                           :toggle="showRules"
                           :title="getRulesPage.title[locale]"
                           @close="showRules = false"
                        >
                           <div v-html="getRulesPage.text[locale]"></div>
                        </modal-popup>
                     </template>

                  </form>
                  <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
                     <template
                        v-if="form.announce_type.title !== 'registration_marks' && form.announce_type !== '' && announcement.image !== ''">
                        <div class="bg-white">
                           <grid-item
                              v-if="form.announce_type.title === 'cars' ||  form.announce_type.title === 'moto' || announcement.image"
                              style="pointer-events: none"
                              :announcement="announcement"/>
                        </div>
                        <div class="vehicle_card_info_description">
                           <p>{{ $t('announce_looks_like') }}</p>
                        </div>
                        <div class="vehicle_card_info_help">
                           <div class="vehicle_card_info_help_inner">
                              <inline-svg
                                 :src="'/icons/info.svg'"
                              />
                              <p>{{ $t('announce_help_text') }}</p>
                           </div>
                           <button class="btn btn--red">{{ $t("let_us_know") }}</button>
                        </div>
                     </template>
                  </div>
               </div>
            </div>
            <div class="form_navigation" v-if="!isMobileBreakpoint">
               <ul>
                  <li v-for="(nav) in navigationData" :key="nav.id">
                     <inline-svg :class="['nav_svg', {active: nav.isActive}]" :src="'/icons/filled_circled_check.svg'"/>
                     {{ nav.title }}
                  </li>
               </ul>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import GridRadio from "~/components/elements/GridRadio.vue";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import FormNumericInput from "~/components/forms/FormNumericInput.vue";
import FormRadio from "~/components/forms/FormRadio.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import ImageComponent from "~/pages/sell/image-component.vue";
import {mapActions, mapGetters} from "vuex";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import GridItem from "~/components/announcements/GridItem.vue";
import Car_form from "~/components/sell/car_form.vue";
import Part_form from "~/components/sell/part_form.vue";
import Registration_mark from "~/components/sell/registration_mark.vue";
import Moto_form from "~/components/sell/moto_form.vue";
import {required, email, requiredIf} from "vuelidate/lib/validators";
import {PaymentMixin} from "~/mixins/payment";

export default {
   name: "add-announce",
   mixins: [MenusDataMixin, ToastErrorsMixin, PaymentMixin],
   components: {
      Moto_form,
      Registration_mark,
      Part_form,
      Car_form, GridItem, PickOnMapButton, ImageComponent, GridRadio, ToggleGroup, FormNumericInput, FormRadio
   },
   computed: {
      ...mapGetters(['staticPages', 'servicePackages']),
      getRulesPage() {
         return this.staticPages.find(page => page.id == 1);
      },
   },
   data() {
      return {
         submitShow: false,
         showRules: false,
         isReady: false,
         announceTitle: "",
         navigationData: [
            {
               id: 1, title: "Elan məlumatları", isActive: false
            },
            {
               id: 2, title: "Elanın təsviri", isActive: false
            },
            {
               id: 3, title: "Şəkillər", isActive: false
            },
            {
               id: 4, title: "Hesab məlumatları", isActive: false
            }
         ],
         announcement: {
            image: "",
            show_vin: true,
            has_360: true,
            price: "0 AZN",
            tradeable: false,
            credit: false,
            brand: "Marka",
            model: "Model",
            year: "0000",
            mileage: 0,
            car_catalog: {capacity: "0"},
            created_at: this.$moment(new Date()).format('DD.MM.YYYY')
         },
         form: {
            announce_type: "",
            add_monetization: 0
         },
         authForm: {
            name: "",
            email: "",
            phone: "",
            code: ""
         },
         authStep: ""
      };
   },
   async asyncData({store}) {
      await store.dispatch('getServicePackages')
   },
   methods: {
      ...mapActions(['carsPost', 'motoPost', 'partsPost', 'plateNumbersPost', 'updatePaidStatus']),
      async handleAnnounceType(payload) {
         if (payload) {
            await this.$store.dispatch(payload.api_key)
         }
      },
      onChangePartType(id) {
         switch (id) {
            case 19:
               return this.announcement.image = "/img/tyre.svg"
            case 20:
               return this.announcement.image = "/img/disc.svg"
            case 21:
               return this.announcement.image = "/img/oil.svg"
            case 27:
               return this.announcement.image = "/img/battery.svg"
            default:
               return this.announcement.image = "/img/parts.svg"
         }
      },
      getMainImage(img) {
         this.announcement.image = img
      },
      async getCarForm(form) {
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            formData.append('add_monetization', this.form.add_monetization)
            const res = await this.carsPost(formData);
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               this.$router.push(this.$localePath('/profile/announcements'))
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
      async getMotoForm(form) {
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            formData.append('add_monetization', this.form.add_monetization)
            const res = await this.motoPost(formData);
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               this.$router.push(this.$localePath('/profile/announcements'))
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

      async getRegistrationMarksForm(form) {
         try {
            const res = await this.plateNumbersPost({is_mobile: false, form});
            if (res?.redirect_url) {
               const response = {data: {...res}}
               this.handlePayment(response, false, this.$t('car_added'), 'v2')
               this.$router.push(this.$localePath('/profile/announcements'))
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
      async getPartForm(form) {
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            const res = await this.partsPost(formData);
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });

               });
            }
            this.$router.push(this.$localePath('/profile/announcements'))
         } catch (e) {
         }
      },

      onClick() {
         this.$v.authForm.$touch()
         setTimeout(() => {
            this.scrollTo('.form_error', [-50, -50])
         });
         if (this.$v.authForm.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }

         if (this.authStep === "loggedIn") {
            this.isReady = !this.isReady
         } else if (this.authStep === "notLoggedIn") {
            this.onPhoneVerification()
         } else {
            this.onOTPVerification()
         }
      },
      async onPhoneVerification() {
         try {
            const res = await this.$axios
               .$post('https://v2dev.mashin.al/api/v2/auth/login-or-register', {phone: this.authForm.phone.replace(/[^0-9]+/g, ''),})

            this.authStep = 'handleOTP'
            this.$v.authForm.$reset()
         } catch (e) {
            console.log(e)
         }
      },
      async onOTPVerification() {
         try {
            const data = await this.$axios
               .$post('https://v2dev.mashin.al/api/v2/auth/confirm-otp', {
                  ...this.authForm,
                  phone: this.authForm.phone.replace(/[^0-9]+/g, '')
               })
            this.fbTrack('Complete Registration Api')
            this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C')
            this.$auth.setUser(data.user.original)
            await this.$auth.setUserToken(data.meta.token)
            this.authStep = 'loggedIn'
            this.isReady = !this.isReady
            this.$v.authForm.$reset()
         } catch (e) {
         }
      }
   },
   async mounted() {
      this.announceTitle = this.$t('place_an_ad')
      if (Object.values(this.user).length) {
         this.authForm.name = this.user.full_name
         this.authForm.email = this.user.email
         this.authForm.phone = this.user.phone
      }
      Object.values(this.user).length ? this.authStep = "loggedIn" : this.authStep = "notLoggedIn"
      this.$nuxt.$on("get-main-image", this.getMainImage)
      await this.$store.dispatch("getOptions")
      await this.$store.dispatch("getColors")
   },
   watch: {
      'form.announce_type'() {
         this.submitShow = false
         this.navigationData.forEach((nav) => nav.id !== 4 && (nav.isActive = false))
         switch (this.form.announce_type.title) {
            case "cars":
               this.announceTitle = this.$t('vehicle_info')
               return this.announcement.image = "/img/car_default.svg"
            case "moto":
               this.announceTitle = this.$t('vehicle_info')
               return this.announcement.image = "/img/motorbike.svg"
            case "parts":
               return this.announceTitle = this.$t('part_info')
            case "registration_marks":
               this.announceTitle = this.$t('registration_mark_info')
               return this.submitShow = true
            default:
               this.announceTitle = this.$t('place_an_ad')
         }
      },
      authForm: {
         deep: true,
         handler() {
            const accControl = this.loggedIn ? ['name',
               'email'].every((key) => this.authForm[key]) : ['name',
               'email',
               'phone'].every((key) => this.authForm[key])
            this.navigationData.find((nav) => nav.id === 4).isActive = accControl
         }
      }

   },
   validations: {
      authForm: {
         name: {required},
         email: {
            email, required
         },
         phone: {required},
         code: {
            required: requiredIf(function () {
               return !(this.authStep === "loggedIn" || this.authStep === "notLoggedIn")
            })
         }
      }
   }
};
</script>

<style lang="scss">
.add_announce {
   padding: 40px 0 160px 0;

   &_title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 32px;
   }

   .btn {
      height: 52px;
   }

   .announce_container {
      display: flex;
      column-gap: 16px;

      .card {
         flex-grow: 3;
         display: flex;
         flex-direction: column;
         gap: 20px;

         &_title {
            font-size: 24px;
            font-weight: 600;
         }

         .add_announce_info {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
            background-color: #EEF2F6;
            border-radius: 12px;


            &_svg {
               min-width: 32px;
               min-height: 32px;
               color: #155EEF;
            }
         }

         .mobile_info {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
            background-color: #ECFDF3;
            border-radius: 12px;

            &_svg {
               min-width: 32px;
               min-height: 32px;
               color: #12B76A;
            }

            p {
               color: #12B76A;

               strong {
                  color: #081A3E;
               }
            }
         }

         &_container {
            display: flex;
            gap: 36px;

            .add_announce_form {
               display: flex;
               flex-grow: 1;
               flex-direction: column;
               gap: 20px;


               .contacts {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  margin-top: 24px;

                  svg {
                     min-width: 24px;
                     min-height: 24px;
                  }

                  h2 {
                     margin-bottom: 24px;
                  }

                  &_info {
                     display: flex;
                     align-items: center;
                     gap: 10px;
                     padding: 12px 16px;
                     background-color: #EEF2F6;
                     border-radius: 8px;
                  }

                  .service_packages {
                     display: flex;
                     gap: 16px;

                     .package {
                        position: relative;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        padding: 20px 16px;
                        border: 1px solid #CDD5DF;
                        border-radius: 12px;
                        overflow: hidden;
                        cursor: pointer;

                        .title {

                           display: flex;
                           align-items: center;
                           gap: 8px;
                           padding-bottom: 20px;
                           border-bottom: 1px solid #CDD5DF;


                           p {
                              font-size: 16px;
                              font-weight: 700;
                           }

                           .stars_svg {
                              width: 24px;
                              height: 24px;
                              color: #0A77E8;
                           }
                        }

                        .sale_effect {
                           width: 100%;
                           position: absolute;
                           top: 2%;
                           right: -35%;
                           background-color: #D1E0FF;
                           display: flex;
                           align-items: center;
                           gap: 2px;
                           justify-content: center;
                           transform: rotate(45deg);
                           padding: 2px 0;

                           p {
                              font-size: 17px;
                              font-weight: 600;
                           }

                           span {
                              line-height: 13px;
                              font-size: 11px;
                              font-weight: 600;
                           }
                        }

                        .content {

                           &_list {
                              padding: 20px 0;
                              display: flex;
                              align-items: center;
                              gap: 12px;

                              .check_svg {
                                 color: #CDD5DF;

                              }

                              .active {
                                 color: #12B76A;
                              }
                           }
                        }

                        .package_price {
                           position: relative;
                           padding: 4px 8px;
                           height: 56px;
                           margin-top: auto;
                           display: flex;
                           justify-content: center;
                           align-items: center;
                           border-radius: 8px;
                           background-color: #D1E0FF;
                           font-size: 15px;
                           font-weight: 700;
                           text-align: center;

                           span {
                              display: block;
                              font-size: 11px;
                              font-weight: 500;
                           }

                           .badge {
                              position: absolute;
                              top: -21px;
                              right: 8px;
                              background-color: #F81734;
                              padding: 4px 6px;
                              border-radius: 6px;
                              color: #fff;
                              font-size: 13px;
                              font-weight: 600;
                           }
                        }

                        &.selected {
                           border-color: #004EEB;

                           .package_price {
                              background-color: #004EEB;
                              color: #fff;
                           }

                           .sale_effect {
                              background-color: #004EEB;
                              color: #fff;
                           }
                        }
                     }
                  }
               }


            }

            .vehicle_card_info {
               position: sticky;
               top: 128px;
               display: flex;
               flex-direction: column;
               gap: 16px;
               height: min-content;
               width: 260px;
               min-width: 260px;

               &_description {
                  background-color: #EEF2F6;
                  border-radius: 8px;
                  padding: 10px;
                  text-align: center;
               }

               &_help {
                  display: flex;
                  padding: 16px 12px;
                  flex-direction: column;
                  gap: 16px;
                  border-radius: 12px;
                  border: 1px solid #CDD5DF;
                  background-color: #F8FAFC;

                  &_inner {
                     display: flex;
                     align-items: center;
                     gap: 10px;

                     svg {
                        min-width: 24px;
                        min-height: 24px;
                     }
                  }
               }

               .item-bg {
                  background-repeat: no-repeat;
                  background-size: inherit;
               }
            }
         }


      }

      .form_navigation {
         position: sticky;
         top: 188px;
         min-width: 300px;
         height: min-content;
         flex-grow: 1;

         ul {
            display: flex;
            flex-direction: column;

            li {
               display: flex;
               align-items: center;
               gap: 8px;
               font-size: 16px;
               font-weight: 500;
               padding: 10px 0;

               .nav_svg {
                  min-width: 32px;
                  min-height: 32px;
                  color: #CDD5DF;

                  &.active {
                     color: #12B76A;
                  }
               }
            }

         }
      }

      .divider {
         display: grid;
         grid-template-columns: repeat(2, calc(50% - 8px));
         gap: 16px;

         .mileage_types {
            display: flex;
            gap: 16px;
         }

         .map_btn {
            width: 24px;
            height: 24px;
            color: #155eef;
         }

         .price_types {
            .price_item {
               display: flex;
               align-items: center;
               justify-content: center;
               height: 52px;
               padding: 0 8px;
            }
         }

         .car_number_suffix {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 16px;
         }
      }

      .beaten_suffix {
         position: relative;
         z-index: 1;
         margin-left: auto;
         cursor: progress;
      }

      .comment {
         &_info {
            display: flex;
            align-items: center;
            gap: 10px;
         }
      }
   }
}

.dark-mode {
   .add_announce {
      .btn {
         height: 52px;
      }

      .announce_container {


         .card {
            .add_announce_info {
               background-color: #364152;
            }

            &_container {
               .add_announce_form {
                  .info_svg {
                     color: #4B5565 !important;
                  }

                  .checkbox-input input:checked ~ label {
                     background-color: #121926 !important;

                     .checkbox {
                        background: #121926 !important;
                     }
                  }


                  .contacts {

                     &_info {
                        background-color: #364152;
                     }

                     .service_packages {
                        display: flex;
                        gap: 16px;

                        .package {
                           background-color: #364152;

                           .content {
                              &_list {
                                 color: #CDD5DF;

                                 svg {
                                    color: #CDD5DF;

                                    &.active {
                                       color: #12B76A;
                                    }
                                 }
                              }
                           }

                           .sale_effect {
                              background-color: #697586;

                           }


                        }

                        .package_price {
                           background-color: #697586;
                        }

                     }
                  }
               }
            }

            .vehicle_card_info {
               &_description {
                  background-color: #00359E;
               }

               &_help {
                  background-color: #364152;
               }
            }
         }

      }
   }
}


@media (max-width: 1150px) {
   .form_navigation {
      display: none;
   }
}

@media (max-width: 485px) {
   .add_announce {
      padding: 24px 0 32px 0;

      &_title {
         font-size: 24px;
         font-weight: 700;
         margin-bottom: 16px;
      }

      .announce_container {
         .divider {

            &.mobile-column {
               display: flex;
               flex-direction: column;
            }
         }

         .card {
            &_title {
               font-size: 20px;
            }

            &_container {
               .add_announce_form {
                  .contacts {
                     .service_packages {
                        flex-direction: column;
                     }
                  }
               }
            }

         }
      }
   }
}
</style>
