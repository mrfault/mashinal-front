<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>

      <div class="alco-form">
        <div class="form-items row">
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">1</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (1)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType1"
                  :options="drinkTypes"
                  :label="$t('type')"
                  :clear-option="false"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue1"
                  :options="drinkAmounts"
                  :label="$t('amount')"
                  :clear-option="false"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Cinsiniz</h4>
                <form-switch
                  class="gender-switcher text-transform-normal"
                  v-model="form.gender"
                  :options="genders"
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
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (2)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType2"
                  :options="drinkTypes"
                  :label="$t('type')"
                  :clear-option="false"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue2"
                  :options="drinkAmounts"
                  :label="$t('amount')"
                  :clear-option="false"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Çəkiniz</h4>
                <form-select
                  class=""
                  v-model="form.mass"
                  :options="massOptions"
                  :label="$t('Çəki')"
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
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (3)</h4>
              <div class="d-flex">
                <form-select
                  class="col-6"
                  v-model="form.drinkType3"
                  :options="drinkTypes"
                  :label="$t('type')"
                  :clear-option="false"
                />
                <form-select
                  class="col-6"
                  v-model="form.drinkValue3"
                  :options="drinkAmounts"
                  :label="$t('amount')"
                  :clear-option="false"
                />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Neçə saat keçib?</h4>
                <form-select
                  class=""
                  v-model="form.time"
                  :options="hours"
                  :label="$t('Saat')"
                  :clear-option="false"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="submit-button mt-3 d-flex justify-content-end mr-1 pb-2">
          <button class="btn btn--green" @click="doTest()">
            Nə zaman sükan arxasına keçə bilərəm?
          </button>
        </div>
      </div>
      <!-- results -->
      <div class="alco-form my-4" v-if="showGraphs">
        <div class="row">
          <div class="col-12 col-lg-5">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">
                Alkotesterin göstəriciləri
              </h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-promil
                  :promilValue="parseFloat(concentrProm)"
                ></alcometer-promil>
                <h3 class="ma-alco-card__bottom--body--desc">
                  Alkoqol konsentrasiyası:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  {{ concentration }}
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  çəkilmiş havanın litrinə düşən milliqram
                </h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">İntoksikasiya dərəcəsi</h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-speedometer
                  :speedometerValue="diagValue"
                ></alcometer-speedometer>
                <h3 class="ma-alco-card__bottom--body--desc">
                  Sürmək olar:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  {{ timeToDrive }}
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  saat sonra
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
  data() {
    return {
      showInterior: true,
      crumbs: [{ name: 'alcometer' }],
      drinkTypes: [
        {
          name: 'Vodka',
          key: 40,
        },
        {
          name: 'Yüngül pivə',
          key: 6,
        },
        {
          name: 'Sərt pivə',
          key: 12,
        },
        {
          name: 'Çaxır',
          key: 15,
        },
        {
          name: 'Port şərabı',
          key: 20,
        },
        {
          name: 'Tekila',
          key: 50,
        },
        {
          name: 'Şampan',
          key: 10,
        },
        {
          name: 'Konyak',
          key: 40,
        },
      ],
      massOptions: [
        {
          name: '40 kq',
          key: 40,
        },
        {
          name: '45 kq',
          key: 45,
        },
        {
          name: '55 kq',
          key: 55,
        },
        {
          name: '60 kq',
          key: 60,
        },
        {
          name: '65 kq',
          key: 65,
        },
        {
          name: '70 kq',
          key: 70,
        },
        {
          name: '75 kq',
          key: 75,
        },
        {
          name: '80 kq',
          key: 80,
        },
        {
          name: '85 kq',
          key: 85,
        },
        {
          name: '90 kq',
          key: 90,
        },
        {
          name: '100 kq',
          key: 100,
        },
        {
          name: '105 kq',
          key: 105,
        },
        {
          name: '110 kq',
          key: 110,
        },
        {
          name: '115 kq',
          key: 115,
        },
        {
          name: '120 kq',
          key: 120,
        },
      ],
      drinkAmounts: [
        {
          name: '50',
          key: 50,
        },
        {
          name: '100',
          key: 100,
        },
        {
          name: '200',
          key: 200,
        },
        {
          name: '300',
          key: 300,
        },
        {
          name: '500',
          key: 500,
        },
        {
          name: '700',
          key: 700,
        },
        {
          name: '900',
          key: 900,
        },
        {
          name: '1000',
          key: 1000,
        },
        {
          name: '1200',
          key: 1200,
        },
        {
          name: '1500',
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
          name: 'Kişi',
          key: 'm',
        },
        {
          name: 'Qadın',
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
        drinkValue1: 0,
        drinkType1: 0,
        drinkValue2: 0,
        drinkType2: 0,
        drinkValue3: 0,
        drinkType3: 0,
      },
    }
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
