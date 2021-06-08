<template>
  <div class="sell_preview">
    <div :class="['img-bg', {'no-img': true}]"></div>
    <h4>{{ brand.name }} {{ model.name }}</h4>
    <p>{{ form.year || form.selectedYear }} {{ $t('year') }}, {{ form.mileage || 0 }} {{ $t('char_kilometre') }}</p>
    <p class="price">{{ form.price || 0 }} {{ form.currency === 2 ? '$' : '₼' }}</p>
    <p>{{ form.region || $t('baku') }}</p>
  </div>
</template>

<script>
export default {
  props: {
    form: {},
    brand: {},
    model: {}
  }
}
</script>