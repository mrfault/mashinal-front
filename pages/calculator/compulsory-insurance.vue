<template>
  <div class="container">
    <breadcrumbs :crumbs="crumbs">
      <share-it type="publish" v-if="$route.params.body"/>
    </breadcrumbs>
    <div class="calculator">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="calculator__inputs">
            <h4 class="calculator__inputs--heading">
              {{ $t('compulsory_insurance_calculator') }}
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
                  :invalid="$v.filled.vehicleType.$error"
                  v-model="filled.vehicleType"
                />
              </div>
              <div class="col-12" v-if="filled.vehicleType < 4">
                <form-numeric-input
                  :placeholder="labels.engineVolume"
                  v-model="filled.engineVolume"
                  :invalid="$v.filled.engineVolume.$error"
                />
              </div>
              <div class="col-12">
                <form-select
                  :label="labels.vehicleOwner"
                  :options="vehicleOwners"
                  :invalid="$v.filled.vehicleOwner.$error"
                  v-model="filled.vehicleOwner"
                />
              </div>
              <div class="col-6">
                <button
                  type="button"
                  :class="['btn', 'full-width', 'btn--red-outline']"
                  @click="reset"
                >
                  <icon name="reset"/>
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
        <div class="col-12 col-md-6 col-lg-8" v-if="resultPrice">
          <div class="calculator__results">
            <div class="calculator__results--heading">
              <h3>{{ $t('insurance_fee_of_vehicle') }}</h3>
              <h4>{{ resultPrice }} ₼</h4>
              <div class="label">{{ $t('buy_insurance_with_credit') }}</div>
              <span class="label-flip"></span>
            </div>
            <div class="calculator__results--content">
              <div><h2 class="title-with-line"><span>{{ $t('buy_insurance') }}</span></h2></div>

              <div class="row">
                <div class="col-12 col-md-6 mb-3">
                  <form-select
                    :label="labels.country"
                    :options="countries"
                    v-model="filled.country"
                    :disabled="true"
                    :clear-option="false"
                    :allowClear="false"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3">
                  <form-select
                    :label="labels.vehicleType"
                    :options="vehicleType"
                    v-model="filled.vehicleType"
                    :invalid="$v.filled.vehicleType.$error"
                    :clear-option="false"
                    :clear-option-pull-down="false"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3" v-if="filled.vehicleType < 4">
                  <form-numeric-input
                    :placeholder="labels.engineVolume"
                    v-model="filled.engineVolume"
                    :invalid="$v.filled.engineVolume.$error"
                  />
                </div>
                <div class="col-12  col-md-6  mb-3">
                  <form-select
                    :label="labels.vehicleOwner"
                    :options="vehicleOwners"
                    v-model="filled.vehicleOwner"
                    :invalid="$v.filled.vehicleOwner.$error"
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
import {mapGetters} from 'vuex'
import {required, requiredIf} from "vuelidate/lib/validators";

export default {
  validations: {
    filled: {
      vehicleType: {required},
      engineVolume: {
        required: requiredIf(function () {
          return this.filled.vehicleType < 4
        })
      },
      vehicleOwner: {required}
    }
  },
  computed: {
    ...mapGetters(['brands']),
    crumbs() {
      return [{name: this.$t('compulsory_insurance_calculator')}]
    },
  },
  data() {
    return {
      countries: [],
      resultPrice: 0,
      vehicleType: [
        {name: this.$t('cars'), id: 1},
        {name: this.$t('buses'), id: 2},
        {name: this.$t('trucks'), id: 3},
        {name: this.$t('motorcycles'), id: 4},
        {name: this.$t('commercial_trailers'), id: 5},
        {name: this.$t('commercial_tractors'), id: 6},
        {name: this.$t('trolleybus'), id: 7},
      ],
      vehicleOwners: [
        {name: this.$t('private_person'), id: 1},
        {name: this.$t('juridical_person'), id: 2},
      ],
      filled: {
        country: 0,
        vehicleType: '',
        engineVolume: '',
        vehicleOwner: '',
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
      this.$v.$reset();
      this.resultPrice = 0;
      this.filled = {
        country: 0,
        vehicleType: '',
        engineVolume: '',
        vehicleOwner: '',
      }
    },

    async submit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      let form = {
        type: this.filled.vehicleType,
        capacity: this.filled.engineVolume,
        user_type: this.filled.vehicleOwner
      };
      if(this.filled.vehicleType >= 4) delete form.capacity;
      try {
       const data = await this.$axios.$post('/insurance/compulsory/calculate', form)
        this.resultPrice = data.data.price;
      }catch (e){

      }

    }
  },
}
</script>

<style></style>
