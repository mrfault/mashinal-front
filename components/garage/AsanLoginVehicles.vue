<template>
  <div class="garage__asan-cars">
    <div class="row mt-5 mt-lg-0">
      <div
        class="col-12 col-lg-6 col-xl-4"
        v-for="(item, index) in vehicleList.ownVehicles"
        :key="index"
      >
        <div class="asan-card">
          <div class="asan-card__top">
            <div class="asan-card__top--image">
              <img
                src="img/asan-car.svg"
                alt="https://media.istockphoto.com/photos/generic-modern-suv-car-in-concrete-garage-picture-id1307086567?s=612x612"
              />
            </div>
          </div>
          <div class="asan-card__bottom">
            <p class="asan-card__bottom--number">
              {{ item.vehicleNumber }}
            </p>
            <form-checkbox
              input-name="selected_vehicles"
              class="d-contents cursor-pointer"
              transparent="transparent"
              @change="selectVehicle(item, $event)"
            ></form-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="selectedVehicleList.length">
      <div class="col-12">
        <div class="asan-card__summary">
          <div class="asan-card__summary--info">
            <p>{{ $t('total') }}</p>
            <h4>{{ price }} ₼ {{ $t('must_pay') }}</h4>
          </div>
          <button
            @click="showPaymentModal()"
            class="asan-card__summary--button btn btn--green px-3"
            :class="{ pending }"
          >
            {{ $t('pay') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    vehicleList: {
      type: Object,
      default: null,
    },
    pending: Boolean,
  },
  data() {
    return {
      selectedVehicleList: [],
    }
  },
  computed: {
    price() {
      return this.selectedVehicleList.filter((item) => item.status).length
    },
  },
  methods: {
    selectVehicle(item, e) {
      this.$emit('asanLoginVehiclesObj', this.asanLoginVehiclesObj)
      if (e) {
        this.selectedVehicleList.push({
          car_number: item.vehicleNumber,
          tech_id: item.tech_id,
          status: e,
        })
      } else {
        let index = this.selectedVehicleList.findIndex(
          (i) => i.car_number === item.car_number,
        )
        this.selectedVehicleList.splice(index, 1)
      }
    },
    showPaymentModal() {
      this.$emit('showPaymentModal', true)
    },
    ...mapMutations(['changeSelectedVehiclesPrice','changeSelectedVehicleList']),
  },
  watch: {
    price() {
      this.changeSelectedVehiclesPrice(this.price)
    },
    selectedVehicleList(){
        this.changeSelectedVehicleList = this.selectedVehicleList
    }
  },
}
</script>
