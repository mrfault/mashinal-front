<template>
  <button :class="['btn full-width', `btn--${callAtOnce ? '' : 'pale-'}green`, {'justify-content-between': !callAtOnce}]" @click.stop="handleClick">
    <template v-if="callAtOnce">
      <icon name="phone-call" /> 
      <span v-mask="$maskPhone(true)" v-if="!isMobileBreakpoint">+{{ phone }}</span>
      <span v-else>{{ $t('make_a_call') }}</span>
    </template>
    <template v-else>
      {{ $t('show_number') }} <icon name="eye" />
    </template>
  </button>
</template>

<script>
export default {
  props: {
    phone: {}
  },
  data() {
    return {
      showPhone: false
    }
  },
  computed: {
    callAtOnce() {
      return this.showPhone || this.isMobileBreakpoint;
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
    },
    trackCall(n) {
      this.fbTrack('Call ' + n);
      this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
    }
  }
}
</script>