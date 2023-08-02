<template>
   <div class="no-results" v-if="!template" :class="{'darker-no-results': darker}">
      <img :src="`/img/${type}.svg`" alt=""/>
      <span>{{ text || $t('no_results_found') }}</span>
      <slot/>
   </div>

   <div class="no-results" v-else-if="template === 'new'" :class="{'darker-no-results': darker}">
      <inline-svg :src="url" />
      <span>{{ text || $t('no_results_found') }}</span>
      <slot/>
   </div>

   <div class="no-results" v-else-if="template === 'new-img'" :class="{'darker-no-results': darker}">
      <img class="light-mode" :src="url" alt="img">
      <img class="dark-mode" :src="urlDarkMode" alt="img">
      <span>{{ text || $t('no_results_found') }}</span>
      <slot/>
   </div>
</template>

<script>
export default {
   props: {
      text: String,
      darker: Boolean,
      type: {
         type: String,
         required: false,
         default: 'car',
         validator(val) {
            return ['car', 'part'].includes(val)
         }
      },

      template: {
         type: String,
         default: ''
      },

      url: {
         type: String,
         default: ''
      },

      urlDarkMode: {
         type: String,
         default: ''
      },

   }
}
</script>

<style lang="scss">
.dark-mode{
   .darker-no-results{
      background: #121926;
   }
}
</style>
