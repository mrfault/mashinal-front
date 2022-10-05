<template>
  <div class="pages-catalog">
    <div class="container alcometer-container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>
      <div class="ma-tiremeter">
        <div class="ma-tiremeter__card">
          <h2 class="title-with-line full-width mb-2">
            <span>{{ $t('visual_tire_calculator') }}</span>
          </h2>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-5 col-xl-3">
              <div class="ma-tiremeter__card--input-group">
                <h6 class="ma-tiremeter__card--input-group__title">
                  {{ $t('size_of_old_tire') }}
                </h6>
                <form-select
                  :options="tireWidth"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.tireWidth.old"
                />
                <span class="ma-tiremeter__card--input-group__spacer">/</span>
                <form-select
                  :options="profileWidth"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.profile.old"
                />
                <span class="ma-tiremeter__card--input-group__spacer">R</span>
                <form-select
                  :options="radiusOptions"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.radius.old"
                />
              </div>
              <div class="ma-tiremeter__card--input-group">
                <h6 class="ma-tiremeter__card--input-group__title">
                  {{ $t('size_of_new_tire') }}
                </h6>
                <form-select
                  :options="tireWidth"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.tireWidth.new"
                />
                <span class="ma-tiremeter__card--input-group__spacer">/</span>
                <form-select
                  :options="profileWidth"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.profile.new"
                />
                <span class="ma-tiremeter__card--input-group__spacer">R</span>
                <form-select
                  :options="radiusOptions"
                  :allowClear="false"
                  :clearOption="false"
                  v-model="form.radius.new"
                />
              </div>
            </div>
            <div
              class="col-12 col-md-12 col-lg-7 col-xl-5 pt-5 pt-lg-0 d-flex justify-content-center"
            >
              <tires
                :oldExternalDiameter="oldExternalDiameter"
                :newExternalDiameter="newExternalDiameter"
                :oldDiscDiameter="oldDiscDiameter / 10"
                :newDiscDiameter="newDiscDiameter / 10"
                :oldProfileHeight="oldProfileHeight"
                :newProfileHeight="newProfileHeight"
                :oldTireWidth="form.tireWidth.old / 10"
                :newTireWidth="form.tireWidth.new / 10"
              ></tires>
            </div>
            <div class="col-4 col-md-5 col-lg-5 col-xl-1">
              <speedometer :percententage="speedometerErrorPercentage * -1" />
            </div>
            <div class="col-8 col-md-7 col-lg-7 col-xl-3">
              <clearance :value="clearanceChange / 10" />
            </div>
          </div>
          <div class="submit-button mt-3 d-flex justify-content-end mr-1 pb-2">
            <button class="btn btn--green" @click="findTextResults()">
              {{ $t('calculate') }}
            </button>
          </div>
        </div>

        <!-- ------------------------------------------------------------------- -->
        <!-- ------------------------------------------------------------------- -->
        <!-- ------------------------------------------------------------------- -->
        <div
          class="ma-tiremeter__card"
          v-if="showResults"
          id="tiremeterTextResults"
        >
          <h2 class="title-with-line full-width mb-2">
            <span>{{ $t('result_of_calculation') }}</span>
          </h2>
          <table class="ma-tiremeter__results-table">
            <tr class="ma-tiremeter__results-table--header">
              <th>{{ $t('dimensions') }}</th>
              <th>{{ $t('previous_version') }}</th>
              <th>{{ $t('new_1') }}</th>
              <th>{{ $t('change_noun') }}</th>
            </tr>
            <tr>
              <td>{{ $t('width_of_tire') }}</td>
              <td>{{ form.tireWidth.old }} {{ $t('char_millimetre') }}</td>
              <td>{{ form.tireWidth.new }} {{ $t('char_millimetre') }}</td>
              <td>
                {{ form.tireWidth.old - form.tireWidth.new }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('height_of_profile') }}</td>
              <td>
                {{ oldProfileHeight * 10 }}
                {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ newProfileHeight * 10 }}
                {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ profileHeightDifference }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('disc_diameter') }}</td>
              <td>{{ oldDiscDiameter }} {{ $t('char_millimetre') }}</td>
              <td>{{ newDiscDiameter }} {{ $t('char_millimetre') }}</td>
              <td>
                {{ oldDiscDiameter - newDiscDiameter }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('external_diameter_of_tire') }}</td>
              <td>
                {{ oldExternalDiameter * 10 }}
                {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ newExternalDiameter * 10 }}
                {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ externalDiameterDifference }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>
                <strong>{{ $t('clearance_change') }}</strong>
              </td>
              <td>
                <template v-if="clearanceChange > 0">+</template>
                {{ clearanceChange }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>
                <strong>{{ $t('speedometer_error_percentage') }}</strong>
              </td>
              <td>
                <template v-if="speedometerErrorPercentage < 0">+</template>
                {{ speedometerErrorPercentage * -1 }} %
              </td>
            </tr>
          </table>
          <div class="row mt-5 mt-lg-0">
            <div class="col-12 col-lg-6">
              <text-results
                :listH="lists.h"
                :listD="lists.d"
                :listL="lists.l"
                :errorPercentage="speedometerErrorPercentage"
              />
            </div>
            <div class="col-12 col-lg-6 mt-5 mt-lg-0">
              <how-to></how-to>
            </div>
          </div>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tires from '../components/tiremeter/tires.vue'
import Speedometer from '~/components/tiremeter/speedometer.vue'
import Clearance from '~/components/tiremeter/clearance.vue'
import TextResults from '~/components/tiremeter/textResults.vue'
import HowTo from '~/components/tiremeter/howTo.vue'
export default {
  components: {
    Tires,
    Speedometer,
    Clearance,
    TextResults,
    HowTo,
  },
  head() {
    return this.$headMeta({
      title: this.$t('visual_tire_calculator'),
    })
  },
  computed: {
    isRussian() {
      if (this.$i18n.locale == 'ru') {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      crumbs: [{ name: this.$t('visual_tire_calculator') }],
      showResults: false,
      tireWidth: [
        {
          name: '30',
          key: 30,
        },
        {
          name: '31',
          key: 31,
        },
        {
          name: '32',
          key: 32,
        },
        {
          name: '33',
          key: 33,
        },
        {
          name: '125',
          key: 125,
        },
        {
          name: '135',
          key: 135,
        },
        {
          name: '145',
          key: 145,
        },
        {
          name: '155',
          key: 155,
        },
        {
          name: '165',
          key: 165,
        },
        {
          name: '175',
          key: 175,
        },
        {
          name: '185',
          key: 185,
        },
        {
          name: '195',
          key: 195,
        },
        {
          name: '205',
          key: 205,
        },
        {
          name: '215',
          key: 215,
        },
        {
          name: '225',
          key: 225,
        },
        {
          name: '235',
          key: 235,
        },
        {
          name: '245',
          key: 245,
        },
        {
          name: '255',
          key: 255,
        },
        {
          name: '265',
          key: 265,
        },
        {
          name: '275',
          key: 275,
        },
        {
          name: '280',
          key: 280,
        },
        {
          name: '285',
          key: 285,
        },
        {
          name: '295',
          key: 295,
        },
        {
          name: '305',
          key: 305,
        },
        {
          name: '315',
          key: 315,
        },
        {
          name: '325',
          key: 325,
        },
        {
          name: '335',
          key: 335,
        },
        {
          name: '345',
          key: 345,
        },
        {
          name: '365',
          key: 365,
        },
        {
          name: '385',
          key: 385,
        },
        {
          name: '425',
          key: 425,
        },
        {
          name: '435',
          key: 435,
        },
        {
          name: '445',
          key: 445,
        },
      ],
      profileWidth: [
        {
          name: '9',
          key: 9,
        },
        {
          name: '9.5',
          key: 9.5,
        },
        {
          name: '10',
          key: 10,
        },
        {
          name: '11',
          key: 11,
        },
        {
          name: '12',
          key: 12,
        },
        {
          name: '25',
          key: 25,
        },
        {
          name: '30',
          key: 30,
        },
        {
          name: '35',
          key: 35,
        },
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
      ],
      radiusOptions: [
        { key: 12, name: 'R12' },
        { key: 13, name: 'R13' },
        { key: 14, name: 'R14' },
        { key: 15, name: 'R15' },
        { key: 16, name: 'R16' },
        { key: 17, name: 'R17' },
        { key: 17.5, name: 'R17.5' },
        { key: 18, name: 'R18' },
        { key: 19, name: 'R19' },
        { key: 19.5, name: 'R19.5' },
        { key: 20, name: 'R20' },
        { key: 21, name: 'R21' },
        { key: 22, name: 'R22' },
        { key: 22.5, name: 'R22.5' },
        { key: 24, name: 'R24' },
      ],
      results: {
        table: {
          tireWidth: {
            old: null,
            new: null,
            difference: null,
          },
          profileHeight: {
            old: null,
            new: null,
            difference: null,
          },
          discDiameter: {
            old: null,
            new: null,
            difference: null,
          },
          externalDiameter: {
            old: null,
            new: null,
            difference: null,
          },
        },
      },
      oldSpeed: 100,
      form: {
        radius: null,
        secondHeight: null,
        length: null,
        diameter: {
          old: null,
          new: null,
        },
        tireWidth: {
          old: 165,
          new: 165,
        },
        profile: {
          old: 70,
          new: 70,
        },
        radius: {
          old: 13,
          new: 13,
        },
        old: {
          radius: null,
        },
      },
      lists: {
        d: [],
        h: [],
        l: [],
      },
      tiremeterModels: {
        a1: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_1',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_2',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_3',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_4',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_5',
          },
        ],
        a2: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_6',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_7',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_8',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_9',
          },
        ],
        c1: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_10',
          },
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_11',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_12',
          },
        ],

        c2: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_13',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_14',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_15',
          },
        ],

        d1: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_16',
          },
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_17',
          },
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_18',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_19',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_20',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_21',
          },
        ],

        d2: [
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_22',
          },
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_23',
          },
          {
            isPositive: true,
            text: 'visual_tire_size_change_result_24',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_25',
          },
          {
            isPositive: false,
            text: 'visual_tire_size_change_result_26',
          },
        ],
      },
    }
  },
  computed: {
    oldExternalDiameter() {
      return (
        Math.round(
          this.form.tireWidth.old * this.form.profile.old * 0.02 +
            this.form.radius.old * 25.4,
        ) / 10
      )
    },
    newExternalDiameter() {
      return (
        Math.round(
          this.form.tireWidth.new * this.form.profile.new * 0.02 +
            this.form.radius.new * 25.4,
        ) / 10
      )
    },
    externalDiameterDifference() {
      return (
        (Math.round(
          this.oldExternalDiameter * 10 - this.newExternalDiameter * 10,
        ) /
          10) *
        10
      )
    },

    // C
    oldDiscDiameter() {
      return Math.round(this.form.radius.old * 25.4)
    },
    newDiscDiameter() {
      return Math.round(this.form.radius.new * 25.4)
    },

    // D
    oldProfileHeight() {
      return (
        Math.round(
          ((this.oldExternalDiameter - this.oldDiscDiameter / 10) / 2) * 10,
        ) / 10
      )
    },
    newProfileHeight() {
      return (
        Math.round(
          ((this.newExternalDiameter - this.newDiscDiameter / 10) / 2) * 10,
        ) / 10
      )
    },
    profileHeightDifference() {
      return (
        Math.round(
          (this.oldProfileHeight * 10 - this.newProfileHeight * 10) * 10,
        ) / 10
      )
    },

    clearanceChange() {
      return (
        (Math.round(
          this.form.tireWidth.new * this.form.profile.new * 0.02 +
            this.form.radius.new * 25.4,
        ) -
          Math.round(
            this.form.tireWidth.old * this.form.profile.old * 0.02 +
              this.form.radius.old * 25.4,
          )) /
        2
      )
    },
    newSpeed() {
      return (
        ((Math.round(
          this.form.tireWidth.new * this.form.profile.new * 0.02 +
            this.form.radius.new * 25.4,
        ) /
          Math.round(
            this.form.tireWidth.old * this.form.profile.old * 0.02 +
              this.form.radius.old * 25.4,
          )) *
          this.oldSpeed *
          100) /
        100
      )
    },
    speedometerErrorPercentage() {
      return Math.round(Math.round((this.newSpeed - this.oldSpeed) * 100) / 100)
    },
  },
  methods: {
    findTextResults() {
      var oldD = this.oldProfileHeight
      var newD = this.newProfileHeight
      var oldC = this.oldDiscDiameter
      var newC = this.newDiscDiameter

      var oldB = Math.round((oldD - oldC) / 2)
      var newB = Math.round((newD - newC) / 2)

      var f = oldB / 10
      var g = newB / 10

      var c =
        Math.round(
          25.4 * this.form.radius.new +
            (this.form.tireWidth.new * this.form.profile.new * 2) / 100,
        ) / 10
      var b =
        Math.round(
          25.4 * this.form.radius.old +
            (this.form.tireWidth.old * this.form.profile.old * 2) / 100,
        ) / 10

      if (g > f) {
        this.lists.h = this.tiremeterModels.c1
      } else if (f > g) {
        this.lists.h = this.tiremeterModels.c2
      }

      console.log('asdas', this.tiremeterModels.a1)
      console.log('c>b', c > b)
      console.log('c<b', c < b)
      if (c > b) {
        this.lists.d = this.tiremeterModels.a1
      } else if (b > c) {
        this.lists.d = this.tiremeterModels.a2
      }

      if (this.form.tireWidth.old > this.form.tireWidth.new) {
        this.lists.l = this.tiremeterModels.d2
      } else if (this.form.tireWidth.new > this.form.tireWidth.old) {
        this.lists.l = this.tiremeterModels.d1
      }
      if (this.isMobileBreakpoint) {
        setTimeout(() => {
          const el = document.querySelector('#tiremeterTextResults')
           el.scrollIntoView({block:'start', behavior: 'smooth'});
        }, 500)
      } else {
        setTimeout(() => {
          const el = document.querySelector('#tiremeterTextResults')
          el.scrollIntoView({ block: 'start', behavior: 'smooth' })
          window.scrollTo({ top: 360, behavior: 'smooth' })
        }, 500)
      }
      this.showResults = true
    },
  },
}
</script>
