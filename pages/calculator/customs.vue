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
                  v-model="filled.vehicleType"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.hybridEngineType"
                  :options="hybridEngineTypes"
                  v-model="filled.vehicleType"
                />
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
            <div class="calculator__results--heading">
              <h3>{{ $t('insurance_fee_of_vehicle') }}</h3>
              <h4>100 ₼</h4>
              <div class="label">{{ $t('buy_insurance_with_credit') }}</div>
              <span class="label-flip"></span>
            </div>
            <div class="calculator__results--content">
              <div>
                <h2 class="title-with-line">
                  <span>{{ $t('buy_insurance') }}</span>
                </h2>
                {{filled.engineType}}
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
      filled: {
        country: 0,
        vehicleType: 0,
        engineVolume: '',
        engineType: '',
        isHybrid: false,
        hybridEngineType: 0,
        producerCountry: 0,
        senderCountry: 0,
        customsValueOfVehicle: 0,
        productionYearMoreThanOneYear: false,
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
        moreThanOneYear: '1 ildən çox',
        productionYearNumber: 'İstehsal ili',
      },
    }
  },
  computed: {
    ...mapGetters(['brands']),
    crumbs() {
      return [{ name: this.$t('customs_calculator') }]
    },
    isHybrid: function(){
      if (this.filled.vehicleType == "hybrid") {
        return true;
      }else{
        return false;
      }
    }
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
