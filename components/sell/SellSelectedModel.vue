<template>
  <div class="sell_selected-model mb-3" v-if="!isMobileBreakpoint">
    <div class="img mr-1" v-if="brand.transformed_media">
      <img :src="$withBaseUrl(brand.transformed_media)" :alt="brand.name" />
    </div>
    <span>{{ brand.name }}</span>
    <span v-if="model"><span>&nbsp;/</span> {{ model.name }}</span>
    <span v-if="year"><span>&nbsp;/</span> {{ year }}</span>
    <div class="ml-auto" v-if="allowClear">
      <button @click="$emit('back')" class="btn btn--red-outline">{{ $t('back') }}</button>
      <button class="btn btn--red-outline" @click="$emit('clean')">{{ $t('clean') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    brand: {},
    model: {},
    year: {},
    allowClear: Boolean
  }
}
</script>
