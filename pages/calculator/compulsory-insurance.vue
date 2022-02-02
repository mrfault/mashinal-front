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
              {{ $t('compulsory_insurance_calculator')}}
            </h4>
            <div class="row">
              <div class="col-12">
                <form-select
                  :label="labels.country"
                  :options="countries"
                  v-model="filled.country"
                  :disabled="true"
                  :allowClear="false"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.vehicleType"
                  :options="vehicleType"
                  v-model="filled.vehicleType"
                />
              </div>
              <div class="col-12">
                <form-numeric-input
                  :placeholder="labels.engineVolume"
                  v-model="filled.engineVolume"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.vehicleOwner"
                  :options="vehicleOwners"
                  v-model="filled.vehicleOwner"
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
        <div class="col-12 col-md-6 col-lg-8">
          <div class="calculator__results">
            <div class="calculator__results--heading">
              <h3>{{ $t('insurance_fee_of_vehicle') }}</h3>
              <h4>100 ₼</h4>
              <div class="label">{{ $t('buy_insurance_with_credit')}}</div>
              <span class="label-flip"></span>
            </div>
            <div class="calculator__results--content">
              <div><h2 class="title-with-line"><span>{{ $t('buy_insurance')}}</span></h2> </div>
              
              <div class="row">
                <div class="col-12 col-md-6 mb-3">
                  <form-select
                    :label="labels.country"
                    :options="countries"
                    v-model="filled.country"
                    :disabled="true"
                    :allowClear="false"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3">
                  <form-select
                    :label="labels.vehicleType"
                    :options="vehicleType"
                    v-model="filled.vehicleType"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3">
                  <form-numeric-input
                    :placeholder="labels.engineVolume"
                    v-model="filled.engineVolume"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3">
                  <form-select
                    :label="labels.vehicleOwner"
                    :options="vehicleOwners"
                    v-model="filled.vehicleOwner"
                  />
                </div>
                <hr>
                <div class="col-3 ml-auto">
                  <button
                    type="button"
                    :class="['btn', 'full-width', 'btn--green']"
                  >
                    {{ $t('officialize') }}
                  </button>
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
export default {
  computed: {
    ...mapGetters(['brands']),
    crumbs() {
      return [{ name: this.$t('compulsory_insurance_calculator') }]
    },
  },
  data() {
    return {
      countries: [],
      vehicleType: [
        { name: 'Sedan', id: 'sedan123' },
        { name: 'SUV', id: 'suv123' },
        { name: 'Bus', id: 'bus123' },
      ],
      vehicleOwners: [
        { name: 'Fiziki ', id: 'fiz123' },
        { name: 'Huquqi', id: 'huq123' },
      ],
      filled: {
        country: 0,
        vehicleType: 0,
        engineVolume: '',
        vehicleOwner: 0,
      },
      labels: {
        country: 'Ölkə - Azərbaycan',
        vehicleType: 'Nəqliyyat vasitəsinin növü',
        engineVolume: 'Mühərrikin həcmi',
        vehicleOwner: 'Nəqliyyat vasitəsinin sahibi',
      },
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

<style></style>
