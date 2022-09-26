<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>
      <div class="ma-tiremeter">
        <div class="ma-tiremeter__card">
          <h2 class="title-with-line full-width mb-2">
            <span>{{ $t('visual_tire_calculator') }}</span>
          </h2>
          <div class="row">
            <div class="col-12 col-md-5 col-lg-3">
              <div class="ma-tiremeter__card--input-group">
                <h6 class="ma-tiremeter__card--input-group__title">
                  {{ $t('size_of_old_tire') }}
                </h6>
                <form-select :options="tireWidth" :allowClear="false" />
                <span class="ma-tiremeter__card--input-group__spacer">/</span>
                <form-select :options="profileWidth" :allowClear="false" />
                <span class="ma-tiremeter__card--input-group__spacer">R</span>
                <form-select :options="radius" :allowClear="false" />
              </div>
              <div class="ma-tiremeter__card--input-group">
                <h6 class="ma-tiremeter__card--input-group__title">
                  {{ $t('size_of_new_tire') }}
                </h6>
                <form-select :options="tireWidth" :allowClear="false" />
                <span class="ma-tiremeter__card--input-group__spacer">/</span>
                <form-select :options="profileWidth" :allowClear="false" />
                <span class="ma-tiremeter__card--input-group__spacer">R</span>
                <form-select :options="radius" :allowClear="false" />
              </div>
            </div>
            <div class="col-12 col-md-7 col-lg-5 pt-5 pt-lg-0 d-flex justify-content-center">
              <tires></tires>
            </div>
            <div class="col-4 col-md-5 col-lg-1">
              <speedometer/>
            </div>
            <div class="col-8 col-md-7 col-lg-3">
              <clearance />
            </div>
          </div>
        </div>
        <div class="ma-tiremeter__card">
          <h2 class="title-with-line full-width mb-2">
            <span>{{ $t('result_of_calculation') }}</span>
          </h2>
          <table class="ma-tiremeter__results-table">
            <tr class="ma-tiremeter__results-table--header">
              <th>{{ $t('dimensions') }}</th>
              <th>{{ $t('previous_version') }}</th>
              <th>{{ $t('new') }}</th>
              <th>{{ $t('change_noun') }}</th>
            </tr>
            <tr>
              <td>{{ $t('width_of_tire') }}</td>
              <td>{{ results.table.tireWidth.old }} {{ $t('char_millimetre') }}</td>
              <td>{{ results.table.tireWidth.new }} {{ $t('char_millimetre') }}</td>
              <td>
                {{ results.table.tireWidth.difference }} {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('height_of_profile') }}</td>
              <td>
                {{ results.table.profileHeight.old }} {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ results.table.profileHeight.new }} {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ results.table.profileHeight.difference }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('disc_diameter') }}</td>
              <td>{{ results.table.discDiameter.old }} {{ $t('char_millimetre') }}</td>
              <td>{{ results.table.discDiameter.new }} {{ $t('char_millimetre') }}</td>
              <td>
                {{ results.table.discDiameter.difference }} {{ $t('char_millimetre') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('external_diameter_of_tire') }}</td>
              <td>
                {{ results.table.externalDiameter.old }} {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ results.table.externalDiameter.new }} {{ $t('char_millimetre') }}
              </td>
              <td>
                {{ results.table.externalDiameter.difference }}
                {{ $t('char_millimetre') }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tires from '../components/tiremeter/tires.vue'
import Speedometer from '~/components/tiremeter/speedometer.vue'
import Clearance from '~/components/tiremeter/clearance.vue'
export default {
  components: {
    Tires,
    Speedometer,
    Clearance,
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
          key: 10,
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
      radius: [
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
      form: {
        oldWidth: null,
      },

      oldA: null,
      oldAinch: null,
      oldWidth: null,
      newA: null,
      newAinch: null,
      newWidth: null,
      difA: null,

      oldC: null,
      oldRadius: null,
      newC: null,
      newRadius: null,
      difC: null,

      oldD: null,
      oldProfile: null,
      newD: null,
      newProfile: null,
      difD: null,

      oldB: null,
      newB: null,
      difB: null,
    }
  },

  methods: {
    calculate() {
      if (!/d/.test(oldWidth.value)) {
        // если старый размер в мм
        var oldWidth2 = oldWidth.value
        if (oldProfile.value == '0') {
          var oldProfile2 = '82'
        } else {
          var oldProfile2 = oldProfile.value
        }

        oldA.innerHTML = oldWidth2 / 10
        oldB.innerHTML = ((oldWidth2 * oldProfile2) / 100 / 10).toFixed(1)
      } else if (/d/.test(oldWidth.value)) {
        //если старый размер в дюймах
        var oldWidth2 = oldWidth.value.slice(1)
        var oldProfile2 = oldProfile.value

        oldA.innerHTML = (oldWidth2 * 2.54).toFixed(1)
        oldB.innerHTML = (oldWidth2 * 2.54).toFixed(1)
      } else {
        alert('Некорректно введен старый размер')
        return
      }

      if (!/d/.test(newWidth.value) && !/d/.test(newProfile.value)) {
        // если новый размер в мм
        var newWidth2 = newWidth.value
        if (newProfile.value == '0') {
          var newProfile2 = '82'
        } else {
          var newProfile2 = newProfile.value
        }

        newA.innerHTML = newWidth2 / 10
        newB.innerHTML = Math.round((newWidth2 * newProfile2) / 100) / 10
      } else if (/d/.test(newWidth.value)) {
        //если новый размер в дюймах
        var newWidth2 = newWidth.value.slice(1)
        var newProfile2 = newProfile.value

        newA.innerHTML = (newWidth2 * 2.54).toFixed(1)
        newB.innerHTML = (newWidth2 * 2.54).toFixed(1)
      } else {
        alert('Некорректно введен новый размер')
        return
      }

      oldC.innerHTML = (oldRadius.value * 2.54).toFixed(1)
      oldCd.innerHTML = oldRadius.value
      newC.innerHTML = (newRadius.value * 2.54).toFixed(1)
      newCd.innerHTML = newRadius.value
      difC.innerHTML = (newC.innerHTML - oldC.innerHTML).toFixed(1)

      oldAinch.innerHTML = (oldA.innerHTML / 2.54).toFixed(1)
      newAinch.innerHTML = (newA.innerHTML / 2.54).toFixed(1)
      difA.innerHTML = (newA.innerHTML - oldA.innerHTML).toFixed(1)

      oldBd.innerHTML =
        ((oldB.innerHTML / oldA.innerHTML) * 100).toFixed(0) + '%'
      newBd.innerHTML =
        ((newB.innerHTML / newA.innerHTML) * 100).toFixed(0) + '%'
      difB.innerHTML = (newB.innerHTML - oldB.innerHTML).toFixed(1)

      oldD.innerHTML = (+oldB.innerHTML * 2 + +oldC.innerHTML).toFixed(1)
      newD.innerHTML = (+newB.innerHTML * 2 + +newC.innerHTML).toFixed(1)
      oldDd.innerHTML = (
        (+oldB.innerHTML * 2 + +oldC.innerHTML) /
        2.54
      ).toFixed(1)
      newDd.innerHTML = (
        (+newB.innerHTML * 2 + +newC.innerHTML) /
        2.54
      ).toFixed(1)
      difD.innerHTML = (newD.innerHTML - oldD.innerHTML).toFixed(1)

      var difClearense = document.getElementById('difClearense')

      difClearense.innerHTML = (difD.innerHTML / 2).toFixed(1)

      var newSpeed = document.getElementById('newSpeed')
      var oldSpeed = document.getElementById('oldSpeed')
      var difSpeed = document.getElementById('difSpeed')

      difSpeed.innerHTML = Math.round(
        ((newD.innerHTML * 3.14) / (oldD.innerHTML * 3.14) - 1) * 100,
      )
      newSpeed.innerHTML = Math.round(
        +oldSpeed.value + (+oldSpeed.value * +difSpeed.innerHTML) / 100,
      )
      var razm1 = newWidth.value
      var razm2 = newProfile.value
      var nrazm1 = razm1
      var nrazm2 = razm2
      var nrazm22 = razm2
      var separator = '/'
      if (razm1.search('d') == '0') {
        var nrazm1 = razm1.replace('d', '')
        separator = ''
        nrazm2 = 'all'
        nrazm22 = ''
      }
      shinlink.innerHTML =
        "<a href='/mshina-filters?quicktabs_shina_filter=1&grazm1=" +
        nrazm1 +
        '&grazm2=' +
        nrazm2 +
        '&gradius=' +
        newRadius.value +
        "'>Искать шины " +
        nrazm1 +
        ' ' +
        separator +
        ' ' +
        nrazm22 +
        ' R' +
        newRadius.value +
        '</a>'
    },
  },
}
</script>
