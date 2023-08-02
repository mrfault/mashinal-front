<template>
   <modal-popup
      :toggle="showTerminalInfo"
      :title="$t('pay_with_terminal')"
      @close="close"
      :modal-class="'terminal-info-popup'"
   >
      <div class="terminal-info-popup__inner">
         <h5 class="terminal-info-popup__description">Million {{ $t('terminal_popup_title') }}</h5>

         <div class="steps">
            <div v-for="(step, i) in $t('terminal_pay_steps')" :key="i" class="step-item">
               <div class="step-number">
                  <span>{{ i + 1 }}</span>
               </div>

               <p class="step-text">{{ step }}</p>
            </div>
         </div>

         <div class="ads_statics">
            <inline-svg src="/icons/stars.svg" />
            <span>{{ $t('terminal_help_description') }}</span>
         </div>

         <button type="button" class="btn btn--blue-new-2 full-width" @click="close">{{ $t('go_back') }}</button>
      </div>
   </modal-popup>
</template>

<script>
   import { mapGetters } from "vuex";

   export default {
      props: {
         name: {
            type: String,
            default: 'payment-popup'
         }
      },

      data() {
         return {
            showTerminalInfo: false
         }
      },

      computed: {
         ...mapGetters(['announcement'])
      },

      methods: {
         open(name) {
            if (name !== this.name) return;
            this.showTerminalInfo = true;
            this.$emit('open');
         },

         close() {
            this.showTerminalInfo = false;
            this.$emit('close');
         }
      },

      mounted() {
         this.$nuxt.$on('show-terminal-info', this.open);
      },

      beforeDestroy() {
         this.$nuxt.$off('show-terminal-info', this.open);
      }
   }
</script>
