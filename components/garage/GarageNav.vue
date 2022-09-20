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
          <form-text-input input-class="car-number-show-popover" img-src="/img/flag.svg"
                           :mask="'99 - A{1,2} - 999'"
                           v-model="car_number"
                           :placeholder="'__ - _ - ___'"
                           @input="$emit('filterCarNumber',car_number.replace(/[^a-z0-9]/gi,''))"
                           @change="$emit('filterCarNumber',car_number.replace(/[^a-z0-9]/gi,''))"/>
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
      car_number: ''
    }
  }
}
</script>
