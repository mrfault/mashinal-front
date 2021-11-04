<template>
  <div class="garage_no-cars card with-margins">
    <div class="text-center">
      <img src="/img/car-garage.svg" alt="" />
      <p class="text-red">{{ $t('no_cars_found') }}</p>
      <add-car />
    </div>
    <h2 class="title-with-line full-width">
      <span>{{ $t('garage_terms_title') }}</span>
    </h2>
    <ol>
      <li v-for="(term, i) in $t('garage_terms_points')" :key="i">
        {{ term }}
      </li>
    </ol>
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