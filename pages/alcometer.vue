<template>
   <div class="alcometer-page">
      <div class="container">
         <breadcrumbs :crumbs="crumbs">
            <share-it type="publish" v-if="$route.params.body"/>
         </breadcrumbs>

         <div class="row">
            <div class="col-12 col-md-5 mb-5 mb-md-0">
               <div class="alco-form dropdowns">
                  <h2 class="alco-form__title mb-5">
                     <span>{{ $t('alcometer') }}</span>
                  </h2>

                  <div class="alco-form__inner">
                     <form-select
                        v-model="form.drinkType1"
                        :options="drinkTypes"
                        :label="$t('drink_type')"
                        :clearOption="false"
                        :allowClear="false"
                        :invalid="$v.form.drinkType1.$error"
                     />

                     <form-select
                        v-model="form.drinkValue1"
                        :options="drinkAmounts"
                        :label="$t('amount_of_ml')"
                        :clearOption="false"
                        :disabled="disabledDrinkValue1"
                        :allowClear="false"
                        :invalid="$v.form.drinkValue1.$error && !disabledDrinkValue1"
                     />

                     <div class="alco-form__group" v-if="drinksCounts.includes(1)">
<!--                        :disabled="-->
<!--                        form.drinkType1 == null ||-->
<!--                        form.drinkType1 == '' ||-->
<!--                        form.drinkValue1 == null ||-->
<!--                        form.drinkValue1 == ''-->
<!--                        "-->
                        <div class="alco-form__group-item">
                           <form-select
                              v-model="form.drinkType2"
                              :options="drinkTypes"
                              :label="$t('drink_type')"
                              :clearOption="false"
                              :invalid="$v.form.drinkType2.$error"
                              :allowClear="form.drinkType3 == null || form.drinkType3 === ''"
                              :showLabelOnSelect="false"
                           />

                           <div
                              class="alco-form__group-delete"
                              @click="deleteDrinks(1)"
                           >{{ $t('delete') }}</div>
                        </div>

                        <form-select
                           v-model="form.drinkValue2"
                           :options="drinkAmounts"
                           :label="$t('amount_of_ml')"
                           :clearOption="false"
                           :disabled="disabledDrinkValue2"
                           :allowClear="false"
                           :invalid="$v.form.drinkValue2.$error && !disabledDrinkValue2"
                           :showLabelOnSelect="false"
                        />
                     </div>

                     <div class="alco-form__group" v-if="drinksCounts.includes(2)">
                        <div class="alco-form__group-item">
<!--                           :disabled="drinksCounts.length < 1 &&-->
<!--                           (form.drinkType2 == null ||-->
<!--                           form.drinkType2 == '' ||-->
<!--                           form.drinkValue2 == null ||-->
<!--                           form.drinkValue2 == '')-->
<!--                           "-->
                           <form-select
                              v-model="form.drinkType3"
                              :options="drinkTypes"
                              :label="$t('drink_type')"
                              :clearOption="false"
                              :invalid="$v.form.drinkType3.$error"
                              :showLabelOnSelect="false"
                           />

                           <div
                              class="alco-form__group-delete"
                              @click="deleteDrinks(2)"
                           >{{ $t('delete') }}</div>
                        </div>

                        <form-select
                           v-model="form.drinkValue3"
                           :options="drinkAmounts"
                           :label="$t('amount_of_ml')"
                           :allowClear="false"
                           :clearOption="false"
                           :disabled="disabledDrinkValue3"
                           :invalid="$v.form.drinkValue3.$error && !disabledDrinkValue3"
                           :showLabelOnSelect="false"
                        />
                     </div>

                     <div class="row">
                        <form-select
                           class="col-6"
                           v-model="form.gender"
                           :options="genders"
                           :label="$t('your_gender')"
                           :allowClear="false"
                           :clearOption="false"
                           :showLabelOnSelect="false"
                           :invalid="$v.form.gender.$error"
                        />

                        <form-select
                           class="col-6 mt-0"
                           v-model="form.mass"
                           :options="massOptions"
                           :allow-clear="false"
                           :label="$t('your_weight')"
                           :clear-option="false"
                           :invalid="$v.form.mass.$error"
                        />
                     </div>

                     <form-select
                        v-model="form.time"
                        :options="hours"
                        :label="$t('hour_2')"
                        :allowClear="false"
                        :clear-option="false"
                        :invalid="$v.form.time.$error"
                     />

                     <button class="btn btn--grey-new full-width" @click="showDrinks" v-if="drinksCounts.length < 2">
                        {{ $t('add_another_drink') }}
                        <span>+</span>
                     </button>

                     <button class="btn btn--pale-green-outline full-width" @click="submit()">
                        {{ $t('when_may_i_can_drive') }}
                     </button>
                  </div>
               </div>
            </div>

            <div class="col-12 col-md-7">
               <!-- results -->
               <div class="alco-form info" v-show="!showGraphs">
                  <img
                     class="alco-form__img d-none d-sm-block"
                     :src="`/images/${isDarkMode ? 'alcometer_img_dark': 'alcometer_img'}.png`"
                     alt="alcometer_img"
                  >

                  <h5 class="d-sm-none">{{ $t('customs_info_title') }}</h5>

                  <div class="alco-form__description">
                     <inline-svg :src="'/icons/info.svg'" />
                     <p>{{ $t('alcometer_descr') }}</p>
                  </div>
               </div>

               <div :class="['alco-form result', {'ru' : locale === 'ru'}]" v-show="showGraphs">
                  <div class="ma-alco-card">
                     <alcometer-speedometer
                        :speedometerValue="diagValue"
                        :isRussian="isRussian"
                     />

                     <ul class="ma-alco-card__list">
                        <li class="ma-alco-card__list-item">
                           <h5>{{ $t('may_drive') }}</h5>

                           <p>{{ timeToDrive }} {{ $t('after_hours') }}</p>
                        </li>

                        <li class="ma-alco-card__list-item">
                           <h5>
                              {{ $t('indications_of_breathalyzer') }}
                              <inline-svg :src="'/icons/info.svg'" />
                           </h5>

                           <p>{{ parseFloat(concentrProm) }} {{ $t('promil') }}</p>
                        </li>

                        <li class="ma-alco-card__list-item">
                           <h5>
                              {{ $t('alcohol_concentration') }}.
                              <inline-svg :src="'/icons/info.svg'" />
                           </h5>

                           <p>{{ concentration }} {{ $t('milligram') }}</p>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import AlcometerPromil from '~/components/alcometer/promil.vue'
   import AlcometerSpeedometer from '~/components/alcometer/speedometer.vue'
   import { required, requiredIf } from 'vuelidate/lib/validators'

   export default {
      components: {
         AlcometerPromil,
         AlcometerSpeedometer,
      },

      head() {
         return this.$headMeta({
            title: this.$t('alcometer'),
         })
      },

      data() {
         return {
            drinksCounts: [],
            showInterior: true,
            crumbs: [
               { name: this.$t('eservices2'), route: '/e-services' },
               { name: this.$t('alcometer') }
            ],
            drinkTypes: [
               {
                  name: this.$t('vodka'),
                  key: 40,
               },
               {
                  name: this.$t('light_beer'),
                  key: 6,
               },
               {
                  name: this.$t('strong_beer'),
                  key: 12,
               },
               {
                  name: this.$t('vine'),
                  key: 15,
               },
               {
                  name: this.$t('port_vine'),
                  key: 20,
               },
               {
                  name: this.$t('tequila'),
                  key: 50,
               },
               {
                  name: this.$t('champagne'),
                  key: 10,
               },
            ],
            massOptions: [
               {
                  name: '40',
                  key: 40,
               },
               {
                  name: '45',
                  key: 45,
               },
               {
                  name: '50',
                  key: 50,
               },
               {
                  name: '55',
                  key: 55,
               },
               {
                  name: '60',
                  key: 60,
               },
               {
                  name: '65',
                  key: 65,
               },
               {
                  name: '70',
                  key: 70,
               },
               {
                  name: '75',
                  key: 75,
               },
               {
                  name: '80',
                  key: 80,
               },
               {
                  name: '85',
                  key: 85,
               },
               {
                  name: '90',
                  key: 90,
               },
               {
                  name: '100',
                  key: 100,
               },
               {
                  name: '105',
                  key: 105,
               },
               {
                  name: '110',
                  key: 110,
               },
               {
                  name: '115',
                  key: 115,
               },
               {
                  name: '120',
                  key: 120,
               },
            ],
            drinkAmounts: [
               {
                  name: `50 ${this.$t('ml')}`,
                  key: 50,
               },
               {
                  name: `100 ${this.$t('ml')}`,
                  key: 100,
               },
               {
                  name: `200 ${this.$t('ml')}`,
                  key: 200,
               },
               {
                  name: `300 ${this.$t('ml')}`,
                  key: 300,
               },
               {
                  name: `500 ${this.$t('ml')}`,
                  key: 500,
               },
               {
                  name: `700 ${this.$t('ml')}`,
                  key: 700,
               },
               {
                  name: `900 ${this.$t('ml')}`,
                  key: 900,
               },
               {
                  name: `1000 ${this.$t('ml')}`,
                  key: 1000,
               },
               {
                  name: `1200 ${this.$t('ml')}`,
                  key: 1200,
               },
               {
                  name: `1500 ${this.$t('ml')}`,
                  key: 1500,
               },
            ],
            hours: [
               {
                  name: '0',
                  key: 0,
               },
               {
                  name: '0.5',
                  key: 0.5,
               },
               {
                  name: '1',
                  key: 1,
               },
               {
                  name: '1.5',
                  key: 1.5,
               },
               {
                  name: '2',
                  key: 2,
               },
               {
                  name: '2.5',
                  key: 2.5,
               },
               {
                  name: '3',
                  key: 3,
               },
               {
                  name: '4',
                  key: 4,
               },
               {
                  name: '5',
                  key: 5,
               },
               {
                  name: '6',
                  key: 6,
               },
               {
                  name: '7',
                  key: 7,
               },
               {
                  name: '8',
                  key: 8,
               },
               {
                  name: '9',
                  key: 9,
               },
               {
                  name: '10',
                  key: 10,
               },
               {
                  name: '12',
                  key: 12,
               },
               {
                  name: '14',
                  key: 14,
               },
               {
                  name: '18',
                  key: 18,
               },
               {
                  name: '24',
                  key: 24,
               },
            ],
            diagramValues: [0.01, 0.154, 0.6, 1.2, 2.5, 6, 10],
            genders: [
               {
                  name: this.$t('male'),
                  key: 'm',
               },
               {
                  name: this.$t('female'),
                  key: 'f',
               },
            ],
            diag2: [0, 30, 60, 90, 120, 150, 180],
            showGraphs: false,
            timeToDrive: 0,
            diagValue: 0,
            concentration: 0,
            concentrProm: 0,
            form: {
               gender: '',
               mass: '',
               time: null,
               drinkValue1: null,
               drinkType1: null,
               drinkValue2: null,
               drinkType2: null,
               drinkValue3: null,
               drinkType3: null,
            },
            disabled: {
               drinkValue1: true,
               drinkValue2: true,
               drinkValue3: true,
               drinkType2: true,
               drinkType3: true,
            },
         }
      },

      validations: {
         form: {
            drinkType1: { required },
            drinkValue1: {
               required: requiredIf(function () {
                  if (this.form.drinkType1 !== null || this.form.drinkType1 !== '') {
                     return true
                  }
               }),
            },
            drinkValue2: {
               required: requiredIf(function () {
                  return this.form.drinkType2
               }),
            },
            drinkValue3: {
               required: requiredIf(function () {
                  return this.form.drinkType3
               }),
            },
            drinkType2: {
               required: requiredIf(function () {
                  return this.drinksCounts.length > 0
               }),
            },
            drinkType3: {
               required: requiredIf(function () {
                  return this.drinksCounts.length > 1 && this.form.drinkValue2 !== null
               }),
            },
            gender: { required },
            mass: { required },
            time: { required }
         },
      },

      computed: {
         isRussian() {
            if (this.$i18n.locale == 'ru') {
               return true
            } else {
               return false
            }
         },

         disabledDrinkValue1() {
            if (this.form.drinkType1 == null || this.form.drinkType1 == '') {
               return true
            } else {
               return false
            }
         },

         disabledDrinkValue2() {
            if (this.form.drinkType2 == null || this.form.drinkType2 == '') {
               return true
            } else {
               return false
            }
         },

         disabledDrinkValue3() {
            if (this.form.drinkType3 == null || this.form.drinkType3 == '') {
               return true
            } else {
               return false
            }
         },
      },

      methods: {
         showDrinks() {
            if (!this.drinksCounts.length) {
               this.drinksCounts.push(1);
            } else if (this.drinksCounts.includes(1)) {
               this.drinksCounts.push(2);
            } else {
               this.drinksCounts.push(1);
            }
         },

         deleteDrinks(id) {
            this.drinksCounts = this.drinksCounts.filter(item => item !== id);

            if (id === 1) {
               this.form.drinkValue2 = this.form.drinkType2 = null;
            } else {
               this.form.drinkValue3 = this.form.drinkType3 = null;
            }
         },

         calculate() {
            // this.$v.form.$touch();
            // if (this.$v.form.$error) return;

            this.showGraphs = true;
            try {
               let r
               if (this.form.gender === 'm') {
                  r = 0.68
               } else if (this.form.gender === 'f') {
                  r = 0.55
               }

               let M = parseFloat(this.form.mass)
               if (isNaN(M) || !M) {
                  this.form.mass = 70
               }
               let T = parseFloat(this.form.time)
               if (isNaN(T) || !T) {
                  this.form.time = 0
               }
               let v = parseInt(this.form.drinkValue1)
               let k = parseInt(this.form.drinkType1)
               let A = 0

               if (isNaN(v) || !v) v = 0
               if (isNaN(k) || !k) k = 0
               A += (v * k) / 100

               v = parseInt(this.form.drinkValue2)
               k = parseInt(this.form.drinkType2)
               if (isNaN(v) || !v) v = 0
               if (isNaN(k) || !k) k = 0
               A += (v * k) / 100

               v = parseInt(this.form.drinkValue3)
               k = parseInt(this.form.drinkType3)
               if (isNaN(v) || !v) v = 0
               if (isNaN(k) || !k) k = 0
               A += (v * k) / 100
               A *= 0.79384
               let C = 0.68 * (A / M / r - 0.13 * T)
               if (C < 0) C = 0
               this.concentration = this.nrm(C, 1000)
               this.concentrProm = this.nrm(C / 0.45, 1000)
               this.diag(C)

               let rul = 0
               let Cor = C
               while (C > this.diagramValues[1]) {
                  rul++
                  C = 0.8 * (A / M / r - 0.13 * (T + rul))
               }
               this.timeToDrive = rul
               // if (Cor > 8) f.rul.value = f.rul.value + '';

               if (this.isMobileBreakpoint) {
                  setTimeout(() => {
                     console.log('sdsad')
                     this.scrollTo('.alco-form.result', [-80, 0]);
                  }, 100)
               }
               // } else if (this.showGraphs && this.isMobileBreakpoint) {
               //    setTimeout(() => {
               //       window.scrollTo({top: 2500, behavior: 'smooth'})
               //       // window.scrollTo({ top: 1200, behavior: 'smooth' })
               //       // window.location.href = '#alcometerResult'
               //       // document.querySelector(this.getAttribute('href')).scrollIntoView({
               //       //   behavior: 'smooth',
               //       // })
               //    }, 1000)
               // }
            } catch (error) {
               this.$toasted.error(this.$t('info_is_not_correct'))
            }
         },

         nrm(val, to) {
            let t = Math.round(val * to)
            let tt = t / to
            return tt.toFixed(2)
         },

         diag(doza) {
            for (let i = 0; i < this.diagramValues.length; i++) {
               if (doza <= this.diagramValues[i])
                  return (this.diagValue = this.diag2[i])
            }
            return (this.diagValue = this.diag2[6])
         },

         submit() {
            this.$v.form.$touch();
            setTimeout(() => {
               this.scrollTo('.invalid', [-75, -190]);
            }, 100);
            if (this.$v.$invalid) return;

            this.calculate();

            // this.$v.$touch();
            // if (this.$v.$error) {
            //    this.scrollIntoError()
            // } else {
            //    this.calculate()
            // }
         },

         scrollIntoError() {
            if (this.$v.form.drinkType1.$error) {
               this.$toasted.error(this.$t('type_of_drink_not_defined'))
               setTimeout(() => {
                  const el = document.querySelector('#drink1')
                  el.scrollIntoView({block: 'start', behavior: 'smooth'})
               }, 100)
            } else if (this.$v.form.drinkValue1.$error && !this.disabledDrinkValue1) {
               this.$toasted.error(this.$t('amount_of_drink_not_defined'))
               setTimeout(() => {
                  const el = document.querySelector('#drink1')
                  el.scrollIntoView({block: 'start', behavior: 'smooth'})
               }, 100)
            } else if (this.form.drinkType3 == null || this.form.drinkType3 == '') {
               this.$toasted.error(this.$t('amount_of_drink_not_defined'))

               setTimeout(() => {
                  const el = document.querySelector('#drink2')
                  el.scrollIntoView({block: 'start', behavior: 'smooth'})
               }, 100)
            } else if (this.$v.form.drinkValue2.$error && !this.disabledDrinkValue2) {
               this.$toasted.error(this.$t('amount_of_drink_not_defined'))
               setTimeout(() => {
                  const el = document.querySelector('#drink2')
                  el.scrollIntoView({block: 'start', behavior: 'smooth'})
               }, 100)
            } else if (this.$v.form.drinkValue3.$error && !this.disabledDrinkValue3) {
               this.$toasted.error(this.$t('amount_of_drink_not_defined'))
               setTimeout(() => {
                  const el = document.querySelector('#drink3')
                  el.scrollIntoView({block: 'start', behavior: 'smooth'})
               }, 100)
            }
         },
      },

      watch: {
         'form.drinkType1': {
            deep: true,
            handler() {
               if (this.form.drinkType1 === null || this.form.drinkType1 === '') {
                  this.form.drinkValue1 = null
               }
               this.$v.$reset();
            },
         },

         'form.drinkType2': {
            deep: true,
            handler() {
               if (this.form.drinkType2 === null || this.form.drinkType2 === '') {
                  this.form.drinkValue2 = null
               }
               this.$v.$reset();
            },
         },

         'form.drinkType3': {
            deep: true,
            handler() {
               if (this.form.drinkType3 === null || this.form.drinkType3 === '') {
                  this.form.drinkValue3 = null
               }
               this.$v.$reset();
            },
         },
      },
   }
</script>

<style lang="scss">
   .alcometer-page {
      padding-bottom: 120px;

      .alco-form {
         height: 100%;
         padding: 32px;
         border-radius: 12px;
         background-color: #FFFFFF;

         &__title {
            font-weight: 700;
            font-size: 28px;
            line-height: 32px;
            color: #121926;
         }

         &__inner {
            display: flex;
            flex-direction: column;
            gap: 20px;
         }

         &__img {
            width: 80%;
            margin: 52px auto 0 auto;
         }

         &__description {
            display: flex;
            align-items: center;
            //margin-top: 104px;

            svg {
               min-width: 22px;
               height: 22px;
            }

            p {
               font-weight: 400;
               font-size: 15px;
               line-height: 22px;
               color: #4B5565;
               margin-left: 11px;
            }
         }

         &__group {
            display: flex;
            flex-direction: column;
            gap: 19px;

            &-item {
               display: flex;
               gap: 12px;
               width: 100%;
            }

            &-delete {
               border-radius: 8px;
               border: 1px solid #CDD5DF;
               cursor: pointer;
               color: #1B2434;
               font-size: 16px;
               font-weight: 400;
               line-height: 20px;
               padding: 16px;
               transition: all .3s;

               &:hover {
                  border-color: #155EEF;
               }
            }
         }

         h5 {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #1B2434;
            margin-bottom: 16px;
         }

         //.form-group {
         //   &:not(:first-child) {
         //      margin-top: 20px;
         //   }
         //}

         .btn {
            height: 52px;

            span {
               font-size: 30px;
               font-weight: 300;
               margin-top: -5px;
               margin-left: 10px;
            }
         }

         &.info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 32px 22px 22px;
         }

         &.result {
            svg {
               width: 100%;
            }
         }

         &.ru {
            .ma-alco-card__list {
               margin-top: 80px;
               flex-wrap: wrap;

               &-item {
                  width: 48%;

                  &:first-child {
                     width: 100%;
                     text-align: center;
                     margin-bottom: 20px;

                     h5 {
                        justify-content: center;
                     }
                  }
               }
            }
         }
      }

      .ma-alco-card {
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         height: 100%;

         &__list {
            display: flex;
            justify-content: space-between;

            &-item {
               padding: 18px 16px;
               border-radius: 12px;
               background-color: #EEF2F6;

               &:first-child {
                  background-color: #D1FADF;

                  p {
                     font-weight: 600;
                     color: #039855;
                  }
               }

               h5 {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  white-space: nowrap;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 16px;
                  color: #364152;
                  height: 24px;
                  margin-bottom: 4px;

                  svg {
                     min-width: 20px;
                     max-width: 20px;
                     margin-left: 7px;
                     //cursor: pointer;
                  }
               }

               p {
                  font-weight: 500;
                  font-size: 18px;
                  line-height: 22px;
                  color: #121926;
               }
            }
         }
      }

      .ma-alcometer__promil--title {
         font-size: 18px;
      }
   }

   .dark-mode {
      .alcometer-page {
         .alco-form {
            background-color: #1b2434;

            &__title, h5 {
               color: #eef2f6;
            }

            &__description {
               svg {
                  path {
                     fill: #697586;
                  }
               }
            }

            &__group {
               &-delete {
                  color: #9AA4B2;
                  border-color: transparent;
                  background-color: #121926;
               }
            }

            p {
               color: #9AA4B2;
            }
         }

         .ma-alco-card {
            &__list {
               &-item {
                  background-color: #364152;

                  &:first-child {
                     background-color: rgba(5, 96, 58, 0.5);

                     h5 {
                        color: #12B76A;
                     }

                     p {
                        color: #32D583;
                     }
                  }

                  h5 {
                     color: #9AA4B2;
                  }

                  p {
                     color: #EEF2F6;
                  }

                  svg {
                     path {
                        fill: #9AA4B2;
                     }
                  }
               }
            }
         }

         .ma-alcometer__graph {
            .speedometer-division {
               path {
                  fill: #4B5565;
               }
            }

            .ma-speedometer-arrow {
               svg {
                  g {
                     fill: #9AA4B2;
                  }
               }
            }
         }

         .ma-alcometer__promil--title {
            fill: #E3E8EF;
         }

         .ma-alcometer__promil--text {
            fill: #FFFFFF;
         }
      }
   }

   @media (max-width: 1150px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               bottom: 30px;
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: 50px !important;
               flex-wrap: wrap;

               &-item {
                  width: 48%;

                  &:first-child {
                     width: 100%;
                     text-align: center;
                     margin-bottom: 20px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 992px) {
      .alcometer-page {
         .alco-form {
            &__img {
               margin-top: 0;
               margin-bottom: 80px;
            }
         }
      }
   }

   @media (max-width: 600px) {
      .alcometer-page {
         .alco-form {
            &__title {
               font-weight: 600;
               font-size: 24px;
               line-height: 28px;
            }

            &__description {
               margin-top: 0;

               svg {
                  display: none;
               }

               p {
                  margin-left: 0;
               }
            }

            &.dropdowns {
               padding: 10px 0 0;
               background-color: transparent;
            }

            .btn--grey-new {
               border-color: #9AA4B2;
            }
         }

         .ma-alco-card {
            &__list {
               &-item {
                  width: 47%;

                  h5 {
                     white-space: initial;
                     margin-bottom: 8px;
                  }
               }
            }
         }
      }

      .dark-mode {
         .alcometer-page {
            .select-menu_label {
               background-color: #1b2434 !important;
            }

            .alco-form__group-delete {
               background-color: #1b2434 !important;
            }
         }
      }
   }

   @media (max-width: 530px) {
      .alcometer-page {
         .ma-alcometer__graph {
            margin-top: -30px;

            .ma-speedometer-arrow {
               bottom: 40px;

               svg {
                  width: 70pt;
               }
            }
         }
      }
   }

   @media (max-width: 500px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               bottom: 50px;
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: 30px !important;
            }
         }
      }
   }

   @media (max-width: 460px) {
      .alcometer-page {
         .alco-form {
            &.result {
               padding: 16px;
            }
         }

         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               bottom: 60px;
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: 20px !important;

               &-item {
                  padding: 16px;
               }
            }
         }
      }
   }

   @media (max-width: 430px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               bottom: 65px;

               svg {
                  width: 65pt;
               }
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: 10px;
            }
         }

         .alco-form {
            &.ru {
               .ma-alco-card__list {
                  margin-top: 0 !important;
                  flex-wrap: wrap;
               }
            }
         }
      }
   }

   @media (max-width: 400px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               svg {
                  width: 60pt;
               }
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: 0;
            }
         }
      }
   }

   @media (max-width: 375px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               svg {
                  width: 50pt;
               }
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: -10px;
            }
         }
      }
   }

   @media (max-width: 340px) {
      .alcometer-page {
         .ma-alcometer__graph {
            .ma-speedometer-arrow {
               svg {
                  width: 45pt;
               }
            }
         }

         .ma-alco-card {
            &__list {
               margin-top: -20px;
            }
         }
      }
   }
</style>
