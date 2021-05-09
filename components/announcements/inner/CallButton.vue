<template>
  <button :class="['btn btn--pale-green full-width', {'justify-content-between': !showPhone}]" @click="handleClick">
    <template v-if="showPhone">
      <icon name="phone-call" /> 
      <span v-mask="maskPhone(true)">+{{ phone }}</span>
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
  methods: {
    handleClick() {
      if (!this.showPhone) {
        this.showPhone = true;
        this.trackCall(1);
      } else {
        window.location.href = `tel:+${this.phone}`;
        this.trackCall(2);
      }
    },
    trackCall(n) {
      this.fbTrack('Call ' + n);
      this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
    }
  }
}
</script>