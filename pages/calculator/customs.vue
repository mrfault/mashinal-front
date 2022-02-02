<template>
  <div class="container">
    <breadcrumbs :crumbs="crumbs">
      <share-it type="publish" v-if="$route.params.body" />
    </breadcrumbs>
    <div class="calculator">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="calculator__inputs">
            <h4 class="calculator__inputs--heading">
              {{ $t('customs_calculator') }}
            </h4>
            <div class="row">
              <div class="col-12">
                <form-select
                  :label="labels.vehicleType"
                  :options="vehicleType"
                  v-model="filled.vehicleType"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.engineType"
                  :options="engineTypes"
                  v-model="filled.engineType"
                />
              </div>
              <div class="col-12" v-if="isHybrid">
                <form-select
                  :label="labels.hybridEngineType"
                  :options="hybridEngineTypes"
                  v-model="filled.hybridEngineType"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.producerCountry"
                  :options="countries"
                  v-model="filled.producerCountry"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.senderCountry"
                  :options="countries"
                  v-model="filled.senderCountry"
                />
              </div>
              <div class="col-12">
                <form-numeric-input
                  :placeholder="labels.customsValueOfVehicle"
                  v-model="filled.customsValueOfVehicle"
                />
              </div>
              <div class="col-12">
                <h6 class="secondary--heading">İstehsal tarixi</h6>
              </div>
              <div class="col-6">
                <form-checkbox
                  :label="$t('more_than_one_year')"
                  v-model="filled.isMoreThanOneYear"
                  input-name="isMoreThanOneYear"
                />
              </div>
              <div class="col-6">
                <form-numeric-input
                  :placeholder="`${$t('production_year')}`"
                  v-model="filled.productionYear"
                  maxlegth="4"
                />
              </div>
              <div class="col-12">
                <div class="dollar__exchange">
                  <span>
                    Dolların məzənnəsi:
                  </span>
                  <span>
                    1 $ = 1.7 ₼
                  </span>
                </div>
              </div>
              <div class="col-12">
                <hr />
              </div>
              <div class="col-6">
                <button
                  type="button"
                  :class="['btn', 'full-width', 'btn--red-outline']"
                  @click="reset"
                >
                  <icon name="reset" />
                  {{ $t('clear_search') }}
                </button>
              </div>
              <div class="col-6">
                <button
                  type="button"
                  :class="['btn', 'full-width', 'btn--green']"
                >
                  {{ $t('calculate') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- -------------------------------------------------------- -->
        <!-- -------------------------------------------------------- -->
        <!-- -------------------------------------------------------- -->
        <!-- -------------------------------------------------------- -->
        <!-- -------------------------------------------------------- -->
        <div class="col-12 col-md-6 col-lg-8">
          <div class="calculator__results">
            <div class="calculator__results--content">
              <div>
                <h2 class="title-with-line">
                  <span>{{ $t('result') }}</span>
                </h2>
                <div class="vehicle-specs">
                  <div class="row">
                    <div class="col">
                      <!-- <ul>
                        <li>
                          <span>{{ $t('ad_active') }}</span>
                          <span>{{ $t('yes') }}</span>
                        </li>
                        <li>
                          <span>{{ $t('ad_done') }}</span>
                          <span>
                            {{
                              $t('add_calc_percent', {
                                n: stats.calculated_percent,
                              })
                            }}
                          </span>
                        </li>
                      </ul> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Models from '@/models'
export default {
  data() {
    return {
      countries: [],
      vehicleType: Models.vehicleTypes,
      engineTypes: Models.engineTypes,
      hybridEngineTypes: Models.hybridEngineTypes,
      countries: Models.countries,
      filled: {
        country: 0,
        vehicleType: 0,
        engineVolume: '',
        engineType: '',
        isHybrid: false,
        hybridEngineType: 0,
        producerCountry: 0,
        senderCountry: 0,
        customsValueOfVehicle: '',
        isMoreThanOneYear: false,
        productionYear: '',
      },
      labels: {
        vehicleType: 'Nəqliyyat vasitəsinin növü',
        engineVolume: 'Mühərrikin işçi həcmi (sm3)',
        vehicleOwner: 'Nəqliyyat vasitəsinin sahibi',
        engineType: 'Mühərrikin növü',
        isHybrid: 'Hibrid',
        hybridEngineType: 'Hibrid mühərrikin növü',
        producerCountry: 'Mənşə(istehsal) ölkəsi',
        senderCountry: 'Göndərən ölkə',
        customsValueOfVehicle: 'Avtomobilin gömrük dəyəri ($)',
        productionYear: 'İstehsal tarixi',
        moreThanOneYear: '',
        productionYearNumber: 'İstehsal ili',
      },
    }
  },
  computed: {
    ...mapGetters(['brands']),
    crumbs() {
      return [{ name: this.$t('customs_calculator') }]
    },
    isHybrid: function () {
      if (this.filled.engineType == 'hybrid12345') {
        return true
      } else {
        return false
      }
    },
  },

  methods: {
    reset() {
      this.filled = {
        country: 0,
        vehicleType: 0,
        engineVolume: '',
        vehicleOwner: 0,
      }
    },
  },
}
</script>
