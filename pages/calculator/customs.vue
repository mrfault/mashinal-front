<template>
  <div class="container">
    <breadcrumbs :crumbs="crumbs">
      <share-it type="publish" v-if="$route.params.body" />
    </breadcrumbs>
    <div class="calculator">
      <div class="row mt-5 mt-md-0">
        <div class="col-12 col-md-12 col-lg-4">
          <div class="calculator__inputs">
            <h4 class="calculator__inputs--heading">
              {{ $t('customs_calculator') }}
            </h4>
            <div class="row">
              <div class="col-12" v-if="false">
                <form-select
                  :label="$t('vehicle_type_2')"
                  :options="vehicleTypes"
                  v-model="filled.vehicleType"
                  :invalid="$v.filled.vehicleType.$error"
                  :allowClear="false"
                  :showLabelOnlyOnActionBar="false"
                  :clearOption="false"
                  :hideOptions="true"
                  disabled
                />
              </div>

              <div class="col-12">
                <form-text-input
                  :disabled="true"
                  :class="'override-disabled'"
                  v-model="selectedVehicleType"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="$t('engine_type')"
                  :options="engineTypes"
                  v-model="filled.engineType"
                  :invalid="$v.filled.engineType.$error"
                  :clearOption="false"
                />
              </div>
              <div class="col-12" v-if="isHybrid">
                <form-select
                  :label="$t('hybrid_engine_type')"
                  :options="hybridEngineTypes"
                  v-model="filled.hybridEngineType"
                  :invalid="$v.filled.hybridEngineType.$error"
                  :clearOption="false"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="$t('production_country')"
                  :options="countries"
                  v-model="filled.producerCountry"
                  :invalid="$v.filled.producerCountry.$error"
                  :clearOption="false"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="$t('sender_country')"
                  :options="countries"
                  v-model="filled.senderCountry"
                  :invalid="$v.filled.senderCountry.$error"
                  :clearOption="false"
                />
              </div>
              <div class="col-12">
                <form-numeric-input
                  :placeholder="$t('customs_value_of_vehicle')"
                  v-model="filled.customsValueOfVehicle"
                  :invalid="$v.filled.customsValueOfVehicle.$error"
                />
              </div>
              <div class="col-12" v-if="filled.engineType !== 4">
                <form-numeric-input
                  :placeholder="$t('engine_volume2')"
                  v-model="filled.engineVolume"
                  :invalid="$v.filled.engineVolume.$error"
                />
              </div>
              <div class="col-12">
                <h6 class="secondary--heading">{{ $t('production_year') }}</h6>
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
                  v-if="filled.isMoreThanOneYear"
                  :invalid="$v.filled.productionYear.$error"
                />
              </div>
              <div class="col-12">
                <div class="dollar__exchange">
                  <span>{{ $t('dollar_course') }}:</span>
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
                  @click.prevent="submit"
                  type="button"
                  :class="['btn', 'full-width', 'btn--green']"
                >
                  {{ $t('calculate') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-lg-8" v-if="hasResult">
          <div class="calculator__results">
            <div class="calculator__results--content">
              <div>
                <h2 class="title-with-line">
                  <span>{{ $t('result') }}</span>
                </h2>
                <div class="vehicle-specs">
                  <div class="row">
                    <div class="col">
                      <ul>
                        <li>
                          <span>{{ $t('excise_tax') }}</span>
                          <span>{{ result.aksizvergi || 0 }} ₼</span>
                        </li>
                        <li>
                          <span>{{ $t('custom_duty') }}</span>
                          <span>{{ result.rusum }} ₼</span>
                        </li>
                        <li>
                          <span>{{ $t('operating_fee') }}</span>
                          <span>{{ result.sbor }} ₼</span>
                        </li>
                        <li>
                          <span>{{ $t('license_fee') }}</span>
                          <span>{{ result.vesiqe }} ₼</span>
                        </li>
                        <li>
                          <span>{{ $t('vat') }}</span>
                          <span>{{ result.edv || 0 }} ₼</span>
                        </li>
                        <li>
                          <span>
                            {{
                              $t(
                                'for_the_provision_of_electronic_customs_service',
                              )
                            }}
                          </span>
                          <span>{{ result.elprice }} ₼</span>
                        </li>
                        <li>
                          <span>
                            {{
                              $t(
                                'vat_for_the_provision_of_electronic_customs_services',
                              )
                            }}
                          </span>
                          <span>{{ result.gomrukedv }} ₼</span>
                        </li>
                      </ul>
                      <hr />
                      <div class="sum">
                        <span>{{ $t('total') }}</span>
                        <span>{{ result.cem }} ₼</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-lg-8" v-else>
          <div class="calculator__empty-results">
            <div class="calculator__empty-results--image">
              <img src="/images/customs-empty-result.png" alt="image" />
            </div>
            <p class="calculator__empty-results--message">
              {{ $t('learn_customs_duty') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <h4>{{ $t('customs_info_title') }}</h4>
          <hr />
          <p class="calculator__info--paragraph">
            {{ $t('customs_info_part_1') }}
          </p>
          <p class="calculator__info--paragraph">
            {{ $t('customs_info_part_2') }}
          </p>
          <p class="calculator__info--paragraph mb-0">
            {{ $t('customs_info_part_3') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
import Models from '@/models'
export default {
  data() {
    return {
      vehicleTypes: [{ name: this.$t('passenger_car'), id: 1 }],
      engineTypes: [
        { name: this.$t('benzin'), id: 1 },
        { name: this.$t('dizel'), id: 2 },
        { name: this.$t('hybrid'), id: 3 },
        { name: this.$t('electrical'), id: 4 },
      ],
      hybridEngineTypes: Models.hybridEngineTypes,
      hasResult: false,
      result: {},
      filled: {
        vehicleType: 1,
        engineType: '',
        isHybrid: false,
        hybridEngineType: '',
        producerCountry: '',
        senderCountry: '',
        customsValueOfVehicle: '',
        engineVolume: '',
        isMoreThanOneYear: false,
        productionYear: '',
      },
      values: Models.calculationValues,
    }
  },
  computed: {
    ...mapGetters(['brands']),
    countries() {
      return Models['countries_' + this.locale]
    },
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
    selectedVehicleType(){
      return this.$t('passenger_car')
    }
  },
  methods: {
    reset() {
      this.$v.$reset()
      this.filled = {
        vehicleType: 1,
        engineType: '',
        isHybrid: false,
        hybridEngineType: '',
        producerCountry: '',
        senderCountry: '',
        customsValueOfVehicle: '',
        engineVolume: '',
        isMoreThanOneYear: false,
        productionYear: '',
      }
      this.hasResult = false
    },
    calculate() {
      var engine_id = this.filled.engineType
      var hybrid_id = this.filled.hybridEngineType

      var pro_date = this.filled.productionYear
      var cur_date = new Date().getFullYear()
      var diff_p_date = cur_date - pro_date

      var prices = [],
        prices_o = [],
        changes = [],
        changes_o = [],
        engines = [],
        engineminuses = []
      engines = this.values.engines
      engineminuses = this.values.engineminuses
      prices = this.values.prices
      prices_o = this.values.prices_o
      changes = this.values.changes
      changes_o = this.values.changes_o

      var radio_year = this.filled.isMoreThanOneYear ? 'on' : 1
      var productionCity = this.filled.producerCountry.value
      var productionCityRel = this.filled.producerCountry.rel
      var senderCountry = this.filled.senderCountry.value
      var senderCountryRel = this.filled.senderCountry.rel
      var CustomsValue = this.filled.customsValueOfVehicle
      var EngineValue = engine_id == 4 ? 1 : this.filled.engineVolume
      var rad = diff_p_date
      var GR = 0
      var Type = 0
      var Price_ = 0
      var Emel = 0
      var SBOR = 0
      var cem = 0
      var vesiqe = ''
      var ElPrice = ''
      var ElPriceEdv = ''
      var aks = ''
      var OUT = 0
      var ElPrc = 0
      var rusum = ''
      var edv = ''
      var currency = 1.7
      var auto_id = 1
      if (
        productionCity == 0 ||
        senderCountry == 0 ||
        CustomsValue.length == 0
      ) {
        return false
      } else {
        if (radio_year == 1) {
          rad = 0
        }

        if (rad == 0) {
          if (auto_id == 2) GR = 0.4
          if (auto_id == 1 && EngineValue <= 1500) GR = 0.4
        }

        if (rad > 0) {
          if (auto_id == 2) GR = 0.7
          if (auto_id == 1 && EngineValue <= 1500) GR = 0.7
        }

        if (rad == 0) {
          if (auto_id == 2) GR = 0.7
          if (auto_id == 1 && EngineValue > 1500) GR = 0.7
        }

        if (rad > 0) {
          if (auto_id == 2) GR = 1.2
          if (auto_id == 1 && EngineValue > 1500) GR = 1.2
        }

        if (engine_id == 4) {
          if (auto_id == 1) {
            GR = 0.15
          }
        }

        ///new
        if (EngineValue <= parseFloat(engines.engine_0)) Type = 1
        else if (
          EngineValue <= parseFloat(engines.engine_1) &&
          EngineValue > parseFloat(engines.engine_0)
        )
          Type = 2
        else if (
          EngineValue <= parseFloat(engines.engine_2) &&
          EngineValue > parseFloat(engines.engine_1)
        )
          Type = 3
        else if (
          EngineValue <= parseFloat(engines.engine_3) &&
          EngineValue > parseFloat(engines.engine_2)
        )
          Type = 4
        else if (EngineValue > parseFloat(engines.engine_3)) Type = 5

        Price_ = CustomsValue * currency

        if (Price_ <= 1000) SBOR = 15
        else if (Price_ <= 10000) SBOR = 60
        else if (Price_ <= 50000) SBOR = 120
        else if (Price_ <= 100000) SBOR = 200
        else if (Price_ <= 500000) SBOR = 300
        else if (Price_ <= 1000000) SBOR = 600
        else if (Price_ > 1000000) SBOR = 1000

        vesiqe = 30
        ElPrice = 30
        ElPriceEdv = 5.4

        if (auto_id == 1 && rad <= 3 && 3000 < EngineValue) {
          prices.price_0 = parseFloat(prices_o.price_0)
          prices.price_1 = parseFloat(prices_o.price_1)
          prices.price_2 = parseFloat(prices_o.price_2)
          prices.price_3 = parseFloat(prices_o.price_3)
          prices.price_4 = parseFloat(prices_o.price_4)

          changes.change_0 = parseFloat(changes_o.change_0)
          changes.change_1 = parseFloat(changes_o.change_1)
          changes.change_2 = parseFloat(changes_o.change_2)
          changes.change_3 = parseFloat(changes_o.change_3)
          changes.change_4 = parseFloat(changes_o.change_4)

          //console.log('3 ilden az, 3kubdan cox');
        }

        if (Type == 1) {
          OUT =
            parseFloat(prices.price_0) +
            (EngineValue - parseFloat(engineminuses.engineminus_0)) *
              parseFloat(changes.change_0)
        } else if (Type == 2) {
          OUT =
            parseFloat(prices.price_1) +
            (EngineValue - parseFloat(engineminuses.engineminus_1)) *
              parseFloat(changes.change_1)
        } else if (Type == 3) {
          OUT =
            parseFloat(prices.price_2) +
            (EngineValue - parseFloat(engineminuses.engineminus_2)) *
              parseFloat(changes.change_2)
        } else if (Type == 4) {
          OUT =
            parseFloat(prices.price_3) +
            (EngineValue - parseFloat(engineminuses.engineminus_3)) *
              parseFloat(changes.change_3)
          //console.log('444_'+prices.price_3);
        } else if (Type == 5) {
          OUT =
            parseFloat(prices.price_4) +
            (EngineValue - parseFloat(engineminuses.engineminus_4)) *
              parseFloat(changes.change_4)
        }

        if (rad > 7) {
          if (auto_id == 1 && engine_id != 4) {
            if (engine_id == 1) {
              OUT = OUT * 1.2
            } else if (engine_id == 2) {
              OUT = OUT * 1.5
            } else if (engine_id == 3) {
              if (hybrid_id == 1) {
                OUT = OUT * 1.2
              } else if (hybrid_id == 2) {
                OUT = OUT * 1.5
              }
            }
          }
        }

        ElPrc = 35.4

        if (
          productionCityRel == 1 &&
          senderCountryRel == 1 &&
          productionCity == senderCountry
        ) {
          rusum = 0
          GR = 0
        } else {
          if (engine_id == 4) {
            rusum = Price_ * GR
          } else {
            rusum = EngineValue * GR * currency
          }
        }

        if ((rad > 0) & (auto_id == 2)) {
          OUT = OUT * 1.5
        }
        const ifLessThanOneYear = !this.filled.isMoreThanOneYear
        if (
          (hybrid_id == 1 || hybrid_id == 2) &&
          engine_id == 3 &&
          rad <= 3 &&
          EngineValue <= 2500
        ) {
          edv = 0
        } else {
          edv =
            (Price_ + OUT + EngineValue * GR * currency + SBOR + vesiqe) * 0.18
        }

        //edv = (Price_ + OUT + (EngineValue * GR * currency) + SBOR + vesiqe) * 0.18;

        //cem = OUT + rusum + SBOR + vesiqe + edv + ElPrice + ElPriceEdv;
        //cem = OUT + EngineValue * GR * currency + SBOR + 20 +
        cem = OUT + rusum + SBOR + vesiqe + edv + ElPrice + (ElPrice * 18) / 100
        ElPrc + (Price_ + OUT + EngineValue * GR * currency + SBOR + 20) * 0.18

        const result = {}
        if (engine_id == 4) {
          cem =
            parseFloat(rusum) +
            parseFloat(SBOR) +
            parseFloat(vesiqe) +
            parseFloat(ElPrice) +
            parseFloat((ElPrice * 18) / 100)
          result['cem'] = cem.toFixed(2)
          result['sbor'] = SBOR.toFixed(2)
          result['rusum'] = rusum.toFixed(2)
          result['vesiqe'] = vesiqe.toFixed(2)
          result['elprice'] = ElPrice.toFixed(2)
          result['gomrukedv'] = ((ElPrice * 18) / 100).toFixed(2)

          //  $('#cem').html(+cem.toFixed(2) + ' AZN')
        } else {
          result['aksizvergi'] = OUT.toFixed(2)
          result['edv'] = edv.toFixed(2)
          result['sbor'] = SBOR.toFixed(2)
          result['rusum'] = rusum.toFixed(2)
          result['vesiqe'] = vesiqe.toFixed(2)
          result['elprice'] = ElPrice.toFixed(2)
          result['gomrukedv'] = ((ElPrice * 18) / 100).toFixed(2)
          result['cem'] = cem.toFixed(2)
        }
        this.result = result
        this.hasResult = true
      }
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$error) return
      try {
        this.calculate()
      } catch (e) {}
    },
  },
  validations: {
    filled: {
      vehicleType: { required },
      engineType: {
        required: requiredIf(function () {
          return this.filled.engineType !== 4
        }),
      },
      hybridEngineType: {
        required: requiredIf(function () {
          return this.filled.isHybrid == true
        }),
      },
      producerCountry: { required },
      senderCountry: { required },
      customsValueOfVehicle: { required },
      engineVolume: { required },
      isMoreThanOneYear: false,
      productionYear: {
        required: requiredIf(function () {
          return this.filled.isMoreThanOneYear == true
        }),
      },
    },
  },
}
</script>
