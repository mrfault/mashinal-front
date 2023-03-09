<template>
   <div class="pages-sell">
      <div class="container">
         <h2 class="pages-sell__title">Elan yerləşdir</h2>
         <!--            <breadcrumbs :crumbs="crumbs" />-->

         <!--            <sell-progress v-if="!isMobileBreakpoint" />-->

         <div class="row">
            <div class="col-lg-10">
               <div class="pages-sell__loginInfo">
                  <div class="row align-items-center">
                     <div class="col-6">
                        <h2 class="pages-sell__loginInfo-title">
                           <template v-if="loggedIn">{{ $t('new_announce') }}</template>
                           <template v-if="!loggedIn">{{ $t('login_2') }}</template>
                        </h2>

                        <div class="sell_tokens-info">
                           <client-only>
                              <template v-if="loggedIn || sellTokens !== false">
                                 <p v-html="getTextLines(sellPhoneEntered)" v-if="!loggedIn"></p>
                                 <p v-html="getTextLines($parsePhone(user.phone))" v-else></p>
                              </template>

                              <template v-else>
                                 <!-- login -->
                                 <login-tabs
                                    :tabOptions="tabOptions"
                                    :sellCheckTokens="true"
                                 ></login-tabs>
                                 <!-- <sell-check-tokens /> -->
                              </template>
                           </client-only>
                        </div>

                        <!-- qrcode -->
                        <qrcode-box :inSellPage="true"></qrcode-box>
                     </div>

                     <div class="col-6">
                        <div class="pages-sell__loginInfo-item">
                           <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                              <path
                                 d="M29.1803 23.3416C27.5157 23.3416 25.9524 22.6994 24.7779 21.5333C23.6039 20.3677 22.9574 18.8153 22.9574 17.1621C22.9574 16.709 22.59 16.3418 22.1371 16.3418C21.684 16.3418 21.3168 16.709 21.3168 17.1621C21.3168 18.8153 20.6702 20.3677 19.4961 21.5333C18.3216 22.6994 16.7583 23.3416 15.0938 23.3416C14.6407 23.3416 14.2734 23.7088 14.2734 24.1619C14.2734 24.615 14.6407 24.9822 15.0938 24.9822C18.525 24.9822 21.3168 27.7625 21.3168 31.1798C21.3168 31.6329 21.684 32.0002 22.1371 32.0002C22.59 32.0002 22.9574 31.6329 22.9574 31.1798C22.9574 27.7625 25.7491 24.9822 29.1803 24.9822C29.6334 24.9822 30.0006 24.615 30.0006 24.1619C30.0006 23.7088 29.6334 23.3416 29.1803 23.3416Z"
                                 fill="#155EEF"/>
                              <path
                                 d="M13.2238 16.9275C10.8079 16.9275 8.84235 14.9765 8.84235 12.5781C8.84235 12.1252 8.47513 11.7578 8.02203 11.7578C7.56894 11.7578 7.20172 12.1252 7.20172 12.5781C7.20172 14.9765 5.23618 16.9275 2.82031 16.9275C2.36722 16.9275 2 17.2949 2 17.7478C2 18.2009 2.36722 18.5681 2.82031 18.5681C5.23618 18.5681 7.20172 20.5253 7.20172 22.9309C7.20172 23.3838 7.56894 23.7513 8.02203 23.7513C8.47513 23.7513 8.84235 23.3838 8.84235 22.9309C8.84235 20.5253 10.8079 18.5681 13.2238 18.5681C13.6768 18.5681 14.0441 18.2009 14.0441 17.7478C14.0441 17.2949 13.6768 16.9275 13.2238 16.9275Z"
                                 fill="#155EEF"/>
                              <path
                                 d="M14.5585 9.6687C16.3352 9.6687 17.7808 11.1032 17.7808 12.8662C17.7808 13.3191 18.148 13.6865 18.6011 13.6865C19.0542 13.6865 19.4214 13.3191 19.4214 12.8662C19.4214 11.0974 20.867 9.65845 22.6437 9.65845C23.0968 9.65845 23.464 9.29102 23.464 8.83813C23.464 8.38504 23.0968 8.01782 22.6437 8.01782C20.867 8.01782 19.4214 6.58334 19.4214 4.82031C19.4214 4.36722 19.0542 4 18.6011 4C18.148 4 17.7808 4.36722 17.7808 4.82031C17.7808 6.58911 16.3352 8.02808 14.5585 8.02808C14.1054 8.02808 13.7382 8.39529 13.7382 8.84839C13.7382 9.30148 14.1054 9.6687 14.5585 9.6687Z"
                                 fill="#155EEF"/>
                           </svg>

                           <p class="pages-sell__loginInfo-text">
                              {{ $t('you_can_only_have_some_free_announcement_within_30_days') }} </p>
                        </div>

                        <div class="pages-sell__loginInfo-item">
                           <svg width="84" height="84" viewBox="0 0 84 84" fill="none"
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                              <rect width="84" height="84" rx="8" fill="white"/>
                              <rect x="10" y="10" width="64" height="64" fill="url(#pattern0)"/>
                              <defs>
                                 <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlink:href="#image0_641_8607"
                                         transform="translate(-0.421687 -0.144578) scale(0.0120482)"/>
                                 </pattern>
                                 <image id="image0_641_8607" width="130" height="150"
                                        xlink:href="data:image/png;base64,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"/>
                              </defs>
                           </svg>

                           <div class="content">
                              <h4>Mobil tətbiqimizi yükləyin</h4>

                              <p class="pages-sell__loginInfo-text">
                                 Tətbiqdən avtomobilinizin 360º panorama görüntüsünü tam pulsuz yerləşdirə bilərsiniz.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

<!--            <div class="col-lg-7">-->
<!--               <div class="card mt-2 mt-lg-0">-->
<!--                  <h2 class="title-with-line full-width">-->
<!--                     <span>{{ $t('vehicle_type') }}</span>-->
<!--                  </h2>-->

<!--                  <vehicle-options-->
<!--                     :group-by="2"-->
<!--                     :options="vehicleOptions"-->
<!--                     :value="form.vehicleType"-->
<!--                     @change="handleVehicleType"-->
<!--                  />-->

<!--                  <template v-if="hasCategories">-->
<!--                     <h2 class="title-with-line full-width mt-3" ref="categories">-->
<!--                        <span>{{ $t(vehicleOptions[selectedIndex].name) }}</span>-->
<!--                     </h2>-->

<!--                     <vehicle-options-->
<!--                        :group-by="2"-->
<!--                        :options="vehicleOptions[selectedIndex].children"-->
<!--                        :value="vehicleCategory"-->
<!--                        @change="handleVehicleCategory"-->
<!--                     />-->
<!--                  </template>-->
<!--               </div>-->
<!--            </div>-->
         </div>

         <div class="row">
            <div class="col-lg-10">
               <div class="pages-sell__vehicleInformation">
                  <h4 class="pages-sell__vehicleInformation-title">Nəqliyyat vasitəsinin məlumatları</h4>
                  <div class="divider">
                     <div class="divider__item">
                        <CustomDropdown
                           :items="vehicleOptions"
                           :placeholder="'Elanın növü'"
                           v-model="form.vehicleType"
                        />

                        <CustomDropdown
                           v-show="form.vehicleType"
                           :items="brands"
                           :placeholder="'Marka'"
                           :getFullDetails="true"
                           :disabled="disabledItem(form.vehicleType)"
                           :search="true"
                           v-model="form.brand"
                           :translate="false"
                        />

                        <CustomDropdown
                           v-show="form.brand"
                           :items="models"
                           :placeholder="'Model'"
                           :getFullDetails="true"
                           :disabled="disabledItem(form.brand)"
                           :search="true"
                           v-model="form.model"
                        />

                        <CustomDropdown
                           v-show="form.model"
                           :items="sellYears.years"
                           :placeholder="'Buraxılış ili'"
                           :disabled="disabledItem(form.model)"
                           :translate="false"
                           :search="true"
                           v-model="form.year"
                        />

                        <CarBody
                           v-show="form.year"
                           :items="sellBody"
                           :disabled="disabledItem(form.year)"
                           @selected="form.car_body_type = $event"
                        />

                        <CarGenerations
                           v-show="form.car_body_type"
                           :items="sellGenerations"
                           :disabled="disabledItem(form.car_body_type)"
                           @selected="form.car_generations = $event"
                        />

                        <CustomDropdown
                           v-show="form.car_generations"
                           :items="sellEngines.map((o) => ({
                              name: $t('engine_values')[o.engine],
                              key: o.engine
                           }))"
                           :placeholder="'Yanacaq növü'"
                           :disabled="disabledItem(form.car_generations)"
                           :translate="false"
                           :getFullDetails="true"
                           v-model="form.fuel_type"
                        />

                        <CustomCheckbox
                           v-show="form.car_generations"
                           :checkbox="true"
                           :text="'Qaz balon avadanlıqları'"
                           @check="form.autogas = $event"
                        />

                        <span
                           class="customRadio__title"
                           v-show="form.fuel_type"
                        >

                        </span>

                        <CustomRadio
                           v-show="form.fuel_type"
                        >
                           <template #title>
                              <span>Ötürücü növü</span>
                           </template>

                           <template #content
                           >
                              <div
                                 class="customRadio__content"
                                 v-for="item in sellGearing.map((o) => ({
                                    name: $t('type_of_drive_values')[o.type_of_drive],
                                    key: o.type_of_drive,
                                 }))"
                              >
                                 <input type="radio" name="aaa" :id="`radio${item.key}`">

                                 <label :for="`radio${item.key}`">
                                    <icon
                                       :class="`type-of-drive-${item.key}`"
                                       :name="getIcon('type_of_drive', item.key)"
                                    />

                                    <span>{{ item.name }}</span>
                                 </label>
                              </div>
                           </template>
                        </CustomRadio>
                     </div>

                     <div class="divider__item">
<!--                        <pre>{{ form }}</pre>-->
<!--                        <pre>{{ sellGearing }}</pre>-->
<!--                        <pre>{{ sellGearing.map((o) => ({-->
<!--                           name: $t('type_of_drive_values')[o.type_of_drive],-->
<!--                           key: o.type_of_drive,-->
<!--                        })) }}</pre>-->
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {MenusDataMixin} from '~/mixins/menus-data'

import SellCheckTokens from '~/components/sell/SellCheckTokens'
import VehicleOptions from '~/components/options/VehicleOptions'
import SellProgress from '~/components/sell/SellProgress'
import QrcodeBox from '~/components/login/Qrcode-box.vue'
import SignInForm from '~/components/login/SignInForm.vue'
import CustomDropdown from "~/components/elements/CustomDropdown.vue"
import CustomCheckbox from "~/components/elements/CustomCheckbox.vue";
import CarBody from "~/components/cars/CarBody.vue";
import CarGenerations from "~/components/cars/CarGenerations.vue";
import CustomRadio from "~/components/elements/CustomRadio.vue";

export default {
   name: 'pages-sell-index',
   components: {
      CustomRadio,
      CarGenerations,
      SellCheckTokens,
      VehicleOptions,
      SellProgress,
      QrcodeBox,
      SignInForm,
      CustomDropdown,
      CustomCheckbox,
      CarBody
   },
   mixins: [MenusDataMixin],
   nuxtI18n: {
      paths: {
         az: '/satmaq',
      },
   },
   data() {
      return {
         form: {
            vehicleType: '',
            vehicleCategory: '',
            selectedIndex: '',
            brand: '',
            model: '',
            year: '',
            car_body_type: '',
            car_generations: '',
            fuel_type: '',
            autogas: ''
         },
         tabOptions: {
            header: false,
            signInForm: true,
            confirmPhone: true,
            qrCode: false,
         }
      }
   },
   watch: {
      'form.brand'() {
         if (this.form.brand) this.$store.dispatch('getModels', this.form.brand.slug);
      },
      'form.model'() {
         if (this.form.model) this.$store.dispatch('getSellYears',
            { brand: this.form.brand.slug,
               model: this.form.model.slug
            }
         );
      },
      'form.year'() {
         if (this.form.year) this.$store.dispatch('getSellBody',
            {
               brand: this.form.brand.slug,
               model: this.form.model.slug,
               year: this.form.year
            }
         );
      },
      'form.car_body_type'() {
         if (this.form.car_body_type) this.$store.dispatch('getSellGenerations',
            {
               brand: this.form.brand.slug,
               model: this.form.model.slug,
               year: this.form.year,
               body: this.form.car_body_type,
            }
         );
      },
      'form.car_generations'() {
         if (this.form.car_generations) this.$store.dispatch('getSellEngines',
            {
               brand: this.form.brand.slug,
               model: this.form.model.slug,
               year: this.form.year,
               body: this.form.car_body_type,
               generation: this.form.car_generations
            }
         );
      },
      'form.fuel_type'() {
         if (this.form.fuel_type) this.$store.dispatch('getSellGearing',
            {
               brand: this.form.brand.slug,
               model: this.form.model.slug,
               body: this.form.car_body_type,
               generation: this.form.car_generations,
               engine: this.form.fuel_type.key
            }
         );
      },
   },

   head() {
      return this.$headMeta({
         title: this.$t('meta-title_sell'),
         description: this.$t('meta-descr_sell'),
      })
   },

   async asyncData({store, route}) {
      if (!route.query.phone) {
         await Promise.all([
            store.dispatch('getBrands'),
            store.dispatch('resetSellTokens'),
            // store.dispatch('getSellGearing'),
         ]);
      }

      // return {
      //    vehicleType: '',
      //    vehicleCategory: '',
      //    selectedIndex: '',
      // }
   },
   computed: {
      ...mapGetters([
         'sellTokens',
         'sellPhoneEntered',
         'brands',
         'models',
         'sellYears',
         'sellBody',
         'sellGenerations',
         'sellEngines',
         'sellGearing'
      ]),

      crumbs() {
         return [{name: this.$t('place_an_ad')}]
      },

      tokens() {
         let tokens = {
            cars: 0,
            moto: 0,
            commercial: 0,
            parts: 0,
            parts_unlimited: this.loggedIn
               ? true
               : this.sellTokens.parts_unlimited,
            salon_unlimited: this.loggedIn
               ? this.user?.autosalon?.status === 1 &&
               this.user?.autosalon?.is_unlimited
               : this.sellTokens.salon_unlimited,
         }

         for (let type of ['cars', 'moto', 'commercial', 'parts']) {
            let tokenKey = `announce_left_${type}`
            if (type === 'cars') tokenKey = tokenKey.slice(0, -1)
            else if (type === 'parts') tokenKey = 'part_announce_left'
            if (this.loggedIn) tokens[type] = this.user[tokenKey]
            else if (this.sellTokens) tokens[type] = this.sellTokens[type]
         }

         return tokens
      },

      hasCategories() {
         // return ['moto', 'commercial'].includes(this.vehicleType);
         return ['moto', 'commercial'].includes(this.form.vehicleType);
      },

      vehicleOptions() {
         return this.searchMenus.map((menu) => ({
            ...menu,
            disabled:
               (this.user?.external_salon ? menu.name === 'parts' : false) ||
               this.tokens[menu.name] <= 0 &&
               !this.tokens[menu.name === 'parts' ? 'parts_unlimited' : 'salon_unlimited']
         }))
      },
   },
   methods: {
      getIcon(key, value) {
         return {
            engine: {
               1: 'fuel-station',
               2: 'battery-charge',
               3: 'diesel',
               4: 'gas',
               5: 'plug',
            },
            type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
            box: {
               1: 'mechanical',
               2: 'automatic',
               3: 'robot',
               4: 'variator',
               5: 'reductor',
            },
         }[key][value]
      },

      disabledItem(item) {
         if (item) {
            return false;
         } else {
            return true;
         }
      },
      handleVehicleType(e) {
         // this.vehicleCategory = ''
         // this.vehicleType = e.value
         // this.selectedIndex = e.index

         this.form.vehicleCategory = ''
         this.form.vehicleType = e.value
         this.form.selectedIndex = e.index
         if (this.hasCategories) {
             this.$nextTick(() => {
                 if (this.isMobileBreakpoint) this.scrollTo(this.$refs.categories, -20)
             })
         } else {
             this.nextSteps()
         }
      },
      handleVehicleCategory(e) {
         this.form.vehicleCategory = e.value
         this.nextSteps()
      },
      nextSteps() {
         let path = this.$localePath(
            `/sell/${this.form.vehicleType}${
               this.form.vehicleCategory ? `?category=${this.form.vehicleCategory}` : ''
            }`,
         )
         this.$router.push(path)
      },
      getTextLines(phone) {
         let isSalon = this.loggedIn && this.user.autosalon || this.user.external_salon;
         let isShop = this.loggedIn && this.user.part_salon

         let firstLine, secondLine, thirdLine

         let transportTokens = this.$maxInArray([
            this.tokens.cars,
            this.tokens.moto,
            this.tokens.commercial,
            0,
         ])
         let partTokens = this.$maxInArray([this.tokens.parts, 0])

         let hasTransportTokens =
            transportTokens > 0 || this.tokens.salon_unlimited
         let hasPartsTokens = this.user.external_salon ? 0 : (partTokens > 0 || this.tokens.parts_unlimited);

         let firstLocaleEnding =
            hasTransportTokens && hasPartsTokens
               ? ''
               : hasTransportTokens
                  ? '_transport'
                  : '_parts'
         let secondLocaleEnding =
            !hasTransportTokens && !hasPartsTokens
               ? ''
               : !hasTransportTokens
                  ? '_transport'
                  : '_parts'

         if (hasTransportTokens || hasPartsTokens) {
            firstLine = this.$t(`you_can_create_announcement${firstLocaleEnding}`, {
               phone: phone.replace('+994 (', '(0'),
               plural: this.$readPlural(
                  this.tokens.salon_unlimited ? 1000 : transportTokens,
                  this.$t('plural_forms_announcements'),
                  false,
               ),
               plural_parts: this.$readPlural(
                  this.tokens.parts_unlimited ? 1000 : partTokens,
                  this.$t('plural_forms_announcements'),
                  false,
               ),
               left: this.tokens.salon_unlimited
                  ? this.$t('unlimited_count')
                  : transportTokens,
               left_parts: this.tokens.parts_unlimited
                  ? this.$t('unlimited_count')
                  : partTokens,
            })
         }
         if (!hasTransportTokens || !hasPartsTokens) {
            if (!(secondLocaleEnding && this.user.external_salon) || !this.user.external_salon) {
               secondLine =
                  '<strong class="text-red">*</strong> ' +
                  this.$t(`no_announcements_on_balance${secondLocaleEnding}`)
            }
            thirdLine = this.$t('contact_for_more_info', {
               phone: '*8787',
               email:
                  isSalon || isShop ? 'sales@al.ventures' : 'office@al.ventures',
            })
         }
         return [firstLine, secondLine, thirdLine]
            .filter((line) => line)
            .map((line) => `${line}`)
            .join('<br/><br/>')
      },
   },
}
</script>

<style lang="scss" scoped>
   .pages-sell {
      &__title {
         font-size: 28px;
         line-height: 32px;
         margin-bottom: 32px;
      }

      &__loginInfo {
         padding: 40px;
         border-radius: 12px;
         background-color: #FFFFFF;

         &-title {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #121926;
            margin-bottom: 32px;
         }

         &-item {
            display: flex;
            align-items: center;
            padding: 16px;
            margin-left: 20px;
            border-radius: 12px;
            background-color: #EEF2F6;

            &:not(:first-child) {
               margin-top: 16px;
            }

            &:first-child {
               svg {
                  max-width: 32px;
                  width: 100%;
                  height: 32px;
               }
            }

            &:last-child {
               svg {
                  max-width: 84px;
                  width: 100%;
                  height: 84px;
               }
            }

            h4 {
               font-weight: 600;
               font-size: 16px;
               line-height: 24px;
               color: #202939;
               margin: 0 0 4px 0;
            }
         }

         &-text {
            line-height: 20px;
            margin: 0;
         }

         .content {
            margin-left: 12px;
         }
      }

      &__vehicleInformation {
         margin-top: 32px;
         width: 100%;
         padding: 40px;
         border-radius: 12px;
         background-color: #FFFFFF;
         &-title {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #121926;
            margin-bottom: 32px;
         }

         .divider {
            &__item {
               position: relative;
               .customDropdown {
                  width: 100%;
               }
            }
         }

         .customDropdown {
            &:not(:first-child) {
               margin-top: 20px;
            }
         }

         .carBody, .carGenerations, .customCheckbox, .customRadio {
            margin-top: 20px;
         }
      }
   }

   .login-forms {
      margin: 0;
      width: 100%;
   }
</style>
