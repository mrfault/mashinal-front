<template>
   <div class="add_announce">
      <div class="container">
         <h1>Yeni elan</h1>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
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
                        class="mobile_info_svg"
                     />
                     <p v-html="$t('mobile_info', {phone: '+' + user.phone})"/>
                  </div>
                  <form-select
                     :label="$t('announcement_type')"
                     :options="searchMenus.map((menu) => ({...menu,name: $t(menu.title)}))"
                     @change="handleAnnounceType($event)"
                     :objectInValue="true"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :new-label="false"
                     v-model="form.announce_type"
                  />

                  <car_form v-if="form.announce_type.title === 'cars'" :announcement="announcement" :isReady="isReady"
                            @getForm="getCarForm($event)" @done="submitShow = $event"/>
                  <moto_form v-if="form.announce_type.title === 'moto'" :announcement="announcement" :isReady="isReady"
                             @getForm="getMotoForm($event)"/>
                  <part_form v-if="form.announce_type.title === 'parts'" @changeType="onChangePartType($event)"
                             :isReady="isReady" @getForm="getPartForm($event)"/>
                  <registration_mark v-if="form.announce_type.title === 'registration_marks'" :isReady="isReady"
                                     @getForm="getRegistrationMarksForm($event)"/>
                  <template v-if="submitShow">
                     <div class="contacts">
                        <h2>{{ $t("contact_information") }}</h2>
                        <form-text-input
                           v-model="authForm.name"
                           :placeholder="$t('your_name') + '*'"
                           :invalid="$v.authForm.name.$error"
                        />
                        <form-text-input
                           v-model="authForm.email"
                           :placeholder="$t('email')"
                           :mask="$maskEmail()"
                           :invalid="$v.authForm.email.$error"
                        />

                        <form-text-input
                           v-if="!Object.values(user).length"
                           key="phone"
                           :placeholder="$t('mobile_phone_number') + '*'"
                           v-model="authForm.phone"
                           :mask="$maskPhone()"
                           :invalid="$v.authForm.phone.$error"
                        />
                        <form-text-input
                           v-if="authStep === 'handleOTP'"
                           :placeholder="$t('otp') + '*'"
                           v-model="authForm.code"
                           :invalid="$v.authForm.code.$error"
                        />
                        <div class="contacts_info" v-if="!Object.values(user).length">
                           <inline-svg class="contacts_info_svg" :src="'/icons/info.svg'"/>
                           <p>{{ $t("contacts_registration_info") }}</p>
                        </div>
                        <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
                           {{ authStep === "notLoggedIn" ? $t("enter_sms_code") : $t("place_announcement") }}
                        </button>
                     </div>
                     <div class="comment_info">
                        <p>{{ $t("by_posting_an_ad_you_confirm_your_agreement_with_the_rules") }}:
                           <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`"
                                      @click.native.prevent="showRules = true"
                                      event="">
                              <strong>{{ $t('general_rules') }}</strong>
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
                  <template v-if="form.announce_type.title !== 'registration_marks'">
                     <grid-item :announcement="announcement"/>
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
            <div class="form_navigation" v-if="!isMobileBreakpoint"></div>
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
import {required, email} from "vuelidate/lib/validators";

export default {
   name: "add-announce",
   mixins: [MenusDataMixin, ToastErrorsMixin],
   components: {
      Moto_form,
      Registration_mark,
      Part_form,
      Car_form, GridItem, PickOnMapButton, ImageComponent, GridRadio, ToggleGroup, FormNumericInput, FormRadio
   },
   computed: {
      ...mapGetters(['staticPages']),
      getRulesPage() {
         return this.staticPages.find(page => page.id == 1);
      },
   },
   data() {
      return {
         submitShow: false,
         showRules: false,
         isReady: false,
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
            moto_type: "",
            commercial_vehicle_type: "",
            brand: "",
            model: "",
            year: "",
            body_type: "",
            fuel_type: "",
            autogas: "",
            transmission: "",
            gearing: "",
            modification: "",
            color: "",
            mileage: 0,
            mileage_type: "",
            beaten: "",
            customs_clearance: "",
            guaranty: "",
            region_id: "",
            address: "",
            lat: 0,
            lng: 0,
            tradeable: "",
            credit: "",
            car_number: "",
            show_car_number: "",
            vin: "",
            show_vin: "",
            comment: "",
            saved_images: [],
            name: "",
            email: "",
            phone: ""
         },
         authForm: {
            name: "",
            email: "",
            phone: "",
            code: ""
         },
         authStep: ""
      };
      // {"end_date":"","auction":1,"country_id":null,"car_catalog_id":46273,"brand":"bmw","model":"5-series","generation_id":4782,"car_body_type":2,"gearing":"1","modification":"2","transmission":"1","capacity":"","power":"","year":2006,"youtube":{"id":"","thumb":""},"selectedColor":[23],"is_matte":false,"mileage":287000,"mileage_measure":1,"region_id":1,"address":"","lat":0,"lng":0,"vin":"","price":20000,"owner_type":0,"currency":1,"car_number":"77 - BZ - 351","show_car_number":1,"show_vin":0,"part":{},"all_options":{"camera":true,"usb":true,"luke":true,"abs":true,"headlights":1,"c_locking":true},"comment":"test test","autogas":false,"is_new":false,"beaten":false,"customs_clearance":false,"tradeable":false,"credit":false,"guaranty":false,"saved_images":[1512580,1512581,1512582,1512583],"btl_cookie":"","is_autosalon":false}
   },
   methods: {
      ...mapActions(['carsPost', 'motoPost', 'partsPost', 'plateNumbersPost']),
      async handleAnnounceType(payload) {
         await this.$store.dispatch(payload.api_key)
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
            await this.carsPost(form);
         } catch (e) {
         }
      },
      async getMotoForm(form) {
         try {
            await this.motoPost(form);
         } catch (e) {
         }
      },
      async getRegistrationMarksForm(form) {
         try {
            await this.plateNumbersPost(form);
         } catch (e) {
         }
      },
      async getPartForm(form) {
         try {
            await this.partsPost(form);
         } catch (e) {
         }
      },

      onClick() {
         this.$v.authForm.$touch()
         // if (this.$v.authForm.$error) return;
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
            this.$v.authForm.$reset()
         } catch (e) {
         }
      }
   },
   async mounted() {
      if (Object.values(this.user).length) {
         this.authForm.name = this.user.full_name
         this.authForm.email = this.user.email
      }
      Object.values(this.user).length ? this.authStep = "loggedIn" : this.authStep = "notLoggedIn"
      this.$nuxt.$on("get-main-image", this.getMainImage)
      await this.$store.dispatch("getOptions")
      await this.$store.dispatch("getColors")
   },
   watch: {
      'form.announce_type'() {
         switch (this.form.announce_type.title) {
            case "cars":
               return this.announcement.image = "/img/car.svg"
            case "moto":
               return this.announcement.image = "/img/motorbike.svg"
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
         code: {required}
      }
   }
};
</script>

<style lang="scss">
.add_announce {
   .btn {
      height: 52px;
   }

   .announce_container {
      display: flex;
      column-gap: 16px;

      .card {
         flex-grow: 3;
         display: flex;
         gap: 68px;

         .add_announce_form {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 20px;

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

      .form_navigation {
         height: 300px;
         min-width: 300px;
         background-color: red;
         flex-grow: 1;
      }

      .divider {
         display: grid;
         grid-template-columns: repeat(2, 1fr);
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
               padding: 0 16px;
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

@media (max-width: 1150px) {
   .form_navigation {
      display: none;
   }
}
</style>
