<template>
   <button
      class="call-button-multiple btn full-width"
      :class="[
         {'active': showPhone}, { pending },
         `btn--${callAtOnce ? '' : 'new-'}green`
      ]"
      @click.stop="handleClick"
   >
      <template v-if="!showPhone">
         <template v-if="callAtOnce">
            <span v-mask="$maskPhone(true)" v-for="phone in phones">+{{ phone }}</span>
         </template>

         <template v-else>
            <span>{{ $t('show_number') }}</span>
            <span>+994 {{ String(phones[0]).slice(3, 8).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} ** **</span>
         </template>
      </template>

      <template v-else>
         <template v-if="callAtOnce">
            <a class="call-a pending" :href="`tel:${ringostat_number}`">
               {{ formatPhoneNumber(ringostat_number) }}
            </a>
         </template>
      </template>
   </button>
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
            pending: false,
            showPhone: false,
            ringostat_number: '',
            ringostat_number_mask: '',
         }
      },

      computed: {
         callAtOnce() {
            return this.showPhone;
         },

         id() {
            return this.$route.params.id || this.announcementId
         }
      },

      methods: {
         formatPhoneNumber(phoneNumber) {
            phoneNumber = phoneNumber.replace(/\D/g, '');
            return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 10)}-${phoneNumber.slice(10)}`;
         },

         handleClick() {
            if (this.callAtOnce) {
               window.location.href = `tel:+${this.phone}`;
               this.trackCall(2);
            } else {
               this.showPhone = true;
               this.trackCall(1);
               this.pending = true

               window.getManualClassifiedNumber(ringostat_announce,
                  (number) => {
                     this.ringostat_number = number.numberWithoutMask;
                     this.ringostat_number_mask = number.numberWithoutMask;
                     this.pending = false
                  }, 0, this.phones.map(item => `00${item}`).join(",")
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

      .call-a {
         font-size: 16px;
         color: #081A3E;
         font-weight: 500;
         transition: all .3s;

         &:hover {
            color: #2aa53e;
         }
      }

      &.active {
         height: 56px;

         .call-a {
            color: #FFFFFF;

            &:hover {
               text-decoration: underline;
            }
         }
      }
   }
</style>
