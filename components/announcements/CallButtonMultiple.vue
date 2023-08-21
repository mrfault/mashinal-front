<template>
   <button
      v-if="!showPhone"
      :class="['call-button-multiple btn full-width', `btn--${callAtOnce ? '' : 'new-'}green`]"
      @click.stop="handleClick"
   >
<!--      <icon name="phone-call"/>-->
      <template v-if="callAtOnce">
         <template v-for="phone in phones" v-if="!isMobileBreakpoint">
            <span v-mask="$maskPhone(true)">+{{ phone }}</span>
            <br>
         </template>

         <span v-else>{{ $t('make_a_call') }}</span>
      </template>

      <template v-else>
         <span>{{ $t('show_number') }}</span>
         <span>+994 {{ String(phone).slice(3, 8).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} ** **</span>
      </template>
   </button>

   <div v-else>
      <template v-if="callAtOnce">
         <template v-for="phone in phones" v-if="!isMobileBreakpoint">
            <a class="call-a" style="" :href="`tel:+${phone}`" v-mask="$maskPhone(true)">+{{ phone }}</a>
            <br>
         </template>

         <span v-else>{{ $t('make_a_call') }}</span>
      </template>
   </div>
</template>

<script>
   export default {
      props: {
         phones: {},
         announcementId: {
            type: [String, Number],
            required: false
         }
      },

      data() {
         return {
            showPhone: false
         }
      },

      computed: {
         callAtOnce() {
            return this.showPhone || this.isMobileBreakpoint;
         },

         id() {
            return this.$route.params.id || this.announcementId
         }
      },

      methods: {
         // handleClick() {
         //    if (this.callAtOnce) {
         //       window.location.href = `tel:+${this.phone}`;
         //       this.trackCall(2);
         //    } else {
         //       this.showPhone = true;
         //       this.trackCall(1);
         //    }
         // },

         handleClick() {
            /*    if (!this.showPhone) {
                   this.showPhone = true;
                   this.trackCall(1);
                } else {
                   window.location.href = `tel:+${this.phone}`;
                   this.trackCall(2);
                }*/
            if (this.callAtOnce) {
               window.location.href = `tel:+${this.phone}`;
               this.trackCall(2);
            } else {
               this.showPhone = true;
               this.showSinglePhone = true;
               this.trackCall(1);

               window.getManualClassifiedNumber(
                  ringostat_announce,
                  (number) => {
                     console.log(number);
                     this.singlePhone = number?.numberWithoutMask.replace('+','')

                  }, 0, `00${this.phone}`
               );
            }
         },

         trackCall(n) {
            this.fbTrack('Call ' + n);
            this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
            this.$axios.$get(`/announce/${this.announcementId}/show/phone`);
         }
      }
   }
</script>

<style lang="scss">
   .call-button-multiple {
      flex-direction: column;
      height: 56px;
   }

   .call-a {
      font-size: 16px;
      color: #081A3E;
      font-weight: 500;

      &:hover {
         color: #2aa53e;
      }
   }
</style>
