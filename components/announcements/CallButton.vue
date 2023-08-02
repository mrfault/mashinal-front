<template>
   <button :class="['call-button btn full-width', `btn--${callAtOnce ? '' : 'new-'}green`]" @click.stop="handleClick">
<!--      <icon name="phone-call"/>-->
      <template v-if="callAtOnce">
         <span v-mask="$maskPhone(true)" v-if="!isMobileBreakpoint">+{{ phone }}</span>
         <span v-else>{{ $t('make_a_call') }}</span>
      </template>

      <template v-else>
        <span>{{ $t('show_number') }}</span>
        <span>+994 {{ String(phone).slice(3, 8).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} ** **</span>
      </template>
   </button>
</template>

<script>
   export default {
      props: {
         phone: {},
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
         handleClick() {
            if (this.callAtOnce) {
               window.location.href = `tel:+${this.phone}`;
               this.trackCall(2);
            } else {
               this.showPhone = true;
               this.trackCall(1);
            }

            // window.getManualClassifiedNumber('ringostat_announce', function () {
            //    console.log('number onclick', this.phone)
            // },0, this.phone);
         },

         trackCall(n) {
            this.fbTrack('Call ' + n);
            this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
            this.$axios.$get(`/announce/${this.id}/show/phone`);
         }
      },

      // mounted() {
      //    if (getManualClassifiedNumber) {
      //       console.log('2321321', getManualClassifiedNumber)
      //    } else {
      //       console.log('Empty')
      //    }
      // }
   }
</script>

<style lang="scss" scoped>
   .call-button {
      flex-direction: column;
      height: 56px;
   }

   .dark-mode {
      .call-button {
         border-color: #05603A;
         background-color: #05603A;

         &:hover {
            border-color: #29A53E;
         }
      }
   }
</style>
