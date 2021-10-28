<template>
  <div class="not-found">
    <img :src="imgSrc || `/img/404${isDarkMode ? '-dark-mode' : ''}.svg`" :alt="text || $t('no_results_found')" />
    <h1 :class="textClass">{{ text || $t('no_results_found') }}</h1>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    textClass: {
      type: String,
      default: 'text-red'
    },
    imgSrc: String
  }
}
</script>