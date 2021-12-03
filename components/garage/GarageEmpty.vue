<template>
  <div class="garage_no-cars card with-margins">
    <div class="text-center">
      <img src="/img/car-garage.svg" alt="" />
      <p class="text-red mb-1 mb-lg-3">{{ $t('no_cars_found') }}</p>
      <add-car class="mb-lg-3" />
    </div>
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar';

export default {
  components: {
    AddCar
  }
}
</script>