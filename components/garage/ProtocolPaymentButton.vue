<template>
   <div>
      <button
         :class="['btn', 'full-width', 'btn--light-green', { pending }]"
         type="button"
         @click="showPopover = true"
      >
         {{ $t('make_payment') }}

      </button>
      <modal-popup :modal-class="'larger packages'"
                   :title="$t('ads_balans')"
                   :toggle="showPopover"
                   @close="showPopover = false">
         <h1>sagol</h1>
      </modal-popup>
   </div>
</template>

<script>
export default {
   data() {
      return {
         showPopover: false,
      }
   }
}
</script>

<style scoped>

</style>
