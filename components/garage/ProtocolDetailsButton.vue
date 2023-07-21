<template>
   <div>
      <button
         :class="[
                                        'btn',
                                        'full-width',
                                        'btn--white',
                                        'btn-dark-text',
                                        { 'pointer-events-none': pending },
                                      ]"
         type="button"
         @click="showPopover = true"
      >
         {{ $t('detail') }}
      </button>
      <modal-popup :modal-class="'wider'"
                   :title="$t('protocol_details')"
                   :toggle="showPopover"
                   @close="showPopover = false">
         <div class="protocol-details-button__content">
            <div v-for="i in 10" class="ma-penalties__card--body__penalties--item no-borders">
               <div class="ma-left">
                  <div class="ma-left__content">
                     <p>Cərimənin statusu</p>
                  </div>
               </div>
               <div class="ma-right">
                  <p class="ma-right__amount">
                     99EM447
                  </p>
               </div>
            </div>
            <div
               class="
               ma-penalties__card--body__penalties--item
               total
               no-borders">
               <strong class="">{{ $t('total') }}</strong>
               <strong>
                  18.00 AZN
               </strong>
            </div>
         </div>
         <div class="protocol-details-button__actions">
            <button
               :class="[
                                        'btn',

                                        'btn--white',
                                        'btn-dark-text',
                                        { 'pointer-events-none': pending },
                                      ]"
               type="button"
            >
               {{ $t('show_image_or_video') }}
            </button>
            <button
               :class="['btn',  'btn--light-green', { pending }]"
               type="button"
            >
               {{ $t('pay_online') }}

            </button>
         </div>
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
