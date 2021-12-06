<template>
  <modal-popup
    :toggle="showTerminalInfo"
    :title="$t('pay_with_terminal')"
    @close="close"
  >
    <p>{{ $t('terminal_pay_info') }}</p>
    <div class="form-info text-green mb-2">{{ $t('mobile_number_your')}}: {{ $parsePhone(user.phone) }}</div>
    <ol>
      <li v-for="(step, i) in $t('terminal_pay_steps')" :key="i">{{ step }}</li>
    </ol>
    <div class="row">
      <div class="col">
        <button type="button" class="btn btn--primary-outline full-width" @click="close">
          {{ $t('go_back') }}
        </button>
      </div>
    </div>
  </modal-popup>
</template>

<script>
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