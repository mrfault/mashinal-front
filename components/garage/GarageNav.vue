<template>
  <div class="garage_nav card with-margins mb-2 mb-lg-3">
    <div class="row">
      <!--      <div class="col-6 col-lg-auto">-->
      <!--        <button-->
      <!--          :class="['btn btn&#45;&#45;pale-red-outline', {'active': tab === 'check-points', 'full-width': isMobileBreakpoint}]"-->
      <!--          @click="$emit('change-tab', 'check-points')"-->
      <!--          v-html="$t('check_points')"-->
      <!--        />-->
      <!--      </div>-->
      <div class="col-12 d-flex align-items-center" :class="{'justify-content-between': !isMobileBreakpoint,'justify-content-center' : isMobileBreakpoint}">
        <div class="d-flex" :style="`margin-left: -20px;${isMobileBreakpoint ? 'flex-direction: column;':''}`" >
          <div class="font-weight-bold mr-2 ml-1 align-items-center d-flex" :class="{'mb-1': isMobileBreakpoint}" style="white-space: nowrap;">
            {{ $t('search_by_car_number') }}
          </div>
        <div class="d-flex justify-content-center" >
          <form-text-input input-class="car-number-show-popover"
                           :mask="'99'"
                           class="mr-1"
                           v-model="car_number1"
                           style="width: 50px;"
                           :placeholder="'__'"
                           @input="$emit('filterCarNumber', getValue)"
                           @change="$emit('filterCarNumber', getValue)"/>
          <form-text-input input-class="car-number-show-popover"
                           :mask="'A{1,2}'"
                           class="mr-1"
                           style="width: 50px;"
                           v-model="car_number2"
                           :placeholder="'__'"
                           @input="$emit('filterCarNumber', getValue)"
                           @change="$emit('filterCarNumber', getValue)"/>
          <form-text-input input-class="car-number-show-popover"
                           :mask="'999'"
                           style="width: 60px;"
                           v-model="car_number3"
                           class="mr-1"
                           :placeholder="'___'"
                           @input="$emit('filterCarNumber',getValue)"
                           @change="$emit('filterCarNumber',getValue)"/>
        </div>
        </div>
        <div >
          <add-car v-if="!isMobileBreakpoint"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar';

export default {
  props: {
    tab: String
  },
  components: {
    AddCar
  },
  data() {
    return {
      car_number1: '',
      car_number2: '',
      car_number3: '',
    }
  },
  computed: {
    getValue() {
      return (this.car_number1 + this.car_number2 + this.car_number3).replace(/[^a-z0-9]/gi,'');
    }
  }
}
</script>
