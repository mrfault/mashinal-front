<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>

      <div class="alco-form" :class="{ 'mb-5': !showGraphs }">
        <div class="form-items row">
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">1</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">{{ $t('drink_amount') }} (1)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType1"
                  :options="drinkTypes"
                  :label="$t('drink_type')"
                  :clearOption="false"
                  :allowClear="false"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue1"
                  :options="drinkAmounts"
                  :label="$t('amount_of_ml')"
                  :clearOption="false"
                  :disabled="disabledDrinkValue1"
                  :allowClear="false"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">{{ $t('your_gender') }}:</h4>
                <form-switch
                  class="gender-switcher text-transform-normal"
                  v-model="form.gender"
                  :options="genders"
                  :allowClear="false"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">2</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">{{ $t('drink_amount') }} (2)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType2"
                  :options="drinkTypes"
                  :label="$t('drink_type')"
                  :clearOption="false"
                  :disabled="(form.drinkType1 == null) || (form.drinkType1 == '') || (form.drinkValue1 == null) || (form.drinkValue1 == '')"
                  :allowClear="(form.drinkType3 == null) || (form.drinkType3 == '')"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue2"
                  :options="drinkAmounts"
                  :label="$t('amount_of_ml')"
                  :clearOption="false"
                  :disabled="disabledDrinkValue2"
                   :allowClear="false"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">{{ $t('your_weight') }}:</h4>
                <form-select
                  class=""
                  v-model="form.mass"
                  :options="massOptions"
                  :allow-clear="false"
                  :label="$t('weight')"
                  :clear-option="false"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">3</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">{{ $t('drink_amount') }} (3)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType3"
                  :options="drinkTypes"
                  :label="$t('drink_type')"
                  :clearOption="false"
                  :disabled="(form.drinkType2 == null) || (form.drinkType2 == '') || (form.drinkValue2 == null) || (form.drinkValue2 == '')"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue3"
                  :options="drinkAmounts"
                  :label="$t('amount_of_ml')"
                  :allowClear="false"
                  :clearOption="false"
                  :disabled="disabledDrinkValue3"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">{{ $t('how_many_hours_passed') }}?</h4>
                <form-select
                  v-model="form.time"
                  :options="hours"
                  :label="$t('hour')"
                  :allowClear="false"
                  :clear-option="false"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="submit-button mt-3 d-flex justify-content-end mr-1 pb-2">
          <button class="btn btn--green" @click="doTest()">
            {{ $t('when_may_i_can_drive') }}?
          </button>
        </div>
      </div>
      <!-- results -->
      <div class="alco-form my-4" v-show="showGraphs">
        <div class="row">
          <div class="col-12 col-lg-5">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">
                {{ $t('indications_of_breathalyzer') }}
              </h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-promil
                  :promilValue="parseFloat(concentrProm)"
                  :isRussian="isRussian"
                ></alcometer-promil>
                <h3 class="ma-alco-card__bottom--body--desc">
                  {{ $t('alcohol_concentration') }}:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  {{ concentration }}
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  {{ $t('milligrams_per_liter_of_inhaled_air') }}
                </h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7" id="alcometerResult">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">
                {{ $t('degree_of_intoxication') }}
              </h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-speedometer
                  :speedometerValue="diagValue"
                  :isRussian="isRussian"
                ></alcometer-speedometer>
                <h3 class="ma-alco-card__bottom--body--desc">
                  {{ $t('may_drive') }}:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  {{ timeToDrive }}
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  {{ $t('after_hours') }}
                </h3>
              </div>
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
      showInterior: true,
      crumbs: [{ name: this.$t('alcometer') }],
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
        gender: 'm',
        mass: 40,
        time: 0,
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
  computed: {
    isRussian() {
      if (this.$i18n.locale == 'ru') {
        return true
      } else {
        return false
      }
    },
    disabledDrinkValue1() {
      if (
        this.form.drinkType1 == null ||
        this.form.drinkType1 == ''
      ) {
        return true
      } else {
        return false
      }
    },
    disabledDrinkValue2() {
      if (
        this.form.drinkType2 == null ||
        this.form.drinkType2 == ''
      ) {
        return true
      } else {
        return false
      }
    },
    disabledDrinkValue3() {
      if (
        this.form.drinkType3 == null ||
        this.form.drinkType3 == '' 
      ) {
        return true
      } else {
        return false
      }
    },

  },
  methods: {
    doTest() {
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
      var T = parseFloat(this.form.time)
      if (isNaN(T) || !T) {
        this.form.time = 0
      }
      var v = parseInt(this.form.drinkValue1)
      var k = parseInt(this.form.drinkType1)
      var A = 0

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
      var C = 0.68 * (A / M / r - 0.13 * T)
      if (C < 0) C = 0
      this.concentration = this.nrm(C, 1000)
      this.concentrProm = this.nrm(C / 0.45, 1000)
      this.diag(C)

      var rul = 0
      var Cor = C
      while (C > this.diagramValues[1]) {
        rul++
        C = 0.8 * (A / M / r - 0.13 * (T + rul))
      }
      this.timeToDrive = rul
      //if (Cor > 8) f.rul.value = f.rul.value + '';
      this.showGraphs = true
      if (this.showGraphs && !this.isMobileBreakpoint) {
        setTimeout(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' })
        }, 1000)
      } else if (this.showGraphs && this.isMobileBreakpoint) {
        setTimeout(() => {
          window.scrollTo({ top: 2500, behavior: 'smooth' })
          // window.scrollTo({ top: 1200, behavior: 'smooth' })
          // window.location.href = '#alcometerResult'
          // document.querySelector(this.getAttribute('href')).scrollIntoView({
          //   behavior: 'smooth',
          // })
        }, 1000)
      }
    },
    nrm(val, to) {
      var t = Math.round(val * to)
      var tt = t / to
      return tt.toFixed(2)
    },
    diag(doza) {
      for (var i = 0; i < this.diagramValues.length; i++) {
        if (doza <= this.diagramValues[i])
          return (this.diagValue = this.diag2[i])
      }
      return (this.diagValue = this.diag2[6])
    },
  },
  watch: {
    'form.drinkType1': {
      deep: true,
      handler() {
        if (this.form.drinkType1 === null || this.form.drinkType1 === '') {
          this.form.drinkValue1 = null
        }
      },
    },
    'form.drinkType2': {
      deep: true,
      handler() {
        if (this.form.drinkType2 === null || this.form.drinkType2 === '') {
          this.form.drinkValue2 = null
        }
      },
    },
    'form.drinkType3': {
      deep: true,
      handler() {
        if (this.form.drinkType3 === null || this.form.drinkType3 === '') {
          this.form.drinkValue3 = null
        }
      },
    },
  },
}
</script>

<style lang="scss">
.gender-switcher {
  width: 100% !important;
  .form-switch {
    text-transform: normal !important;
    button {
      width: calc(50% - 2px) !important;
      text-align: center;
      text-transform: normal !important;
    }
  }
}
.text-transform-normal button {
  text-transform: initial !important;
}
</style>
