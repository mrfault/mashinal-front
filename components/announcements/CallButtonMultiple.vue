<template>
  <button v-if="!showPhone" :class="['btn full-width', `btn--${callAtOnce ? '' : 'pale-'}green`]" @click.stop="handleClick">
    <icon name="phone-call" />
    <template>
      +994 *******
    </template>
  </button>
  <div v-else>
    <template v-if="callAtOnce">
      <template v-if="!showSinglePhone">
          <template v-for="phone in phones" v-if="!isMobileBreakpoint">
             <a class="call-a" style="" :href="`tel:+${phone}`" v-mask="$maskPhone(true)" >+{{ phone }}</a>
             <br>
          </template>
          <span v-else>{{ $t('make_a_call') }}</span>
       </template>

      <template v-else-if="showSinglePhone">
         <a v-if="singlePhone" class="call-a" style="" :href="`tel:+${singlePhone}`" v-mask="$maskPhone(true)" >+{{ singlePhone }}</a>
         <br>
      </template>

    </template>
  </div>
</template>
<style lang="scss">
.call-a {
  font-size: 16px;
  color: #081A3E;
  font-weight: 500;
  &:hover {
    color: #2aa53e;
  }
}
</style>
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
      showPhone: false,
      showSinglePhone: false,
      singlePhone: '',
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
       if (!this.showPhone) {
          this.showPhone = true;
          this.trackCall(1);
       } else {
          window.location.href = `tel:+${this.phone}`;
          this.trackCall(2);
       }
     /* if (this.callAtOnce) {
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

            },
            0,
            '00994555501571'
         );
      }*/
    },
    trackCall(n) {
      this.fbTrack('Call ' + n);
      this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
      this.$axios.$get(`/announce/${this.id}/show/phone`);
    }
  }
}
</script>
