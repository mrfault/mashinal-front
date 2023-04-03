<template>
  <modal-popup
    :toggle="showTerminalInfo"
    :title="$t('pay_with_terminal')"
    @close="close"
    :modal-class="'terminal-info-popup'"
  >
    <div class="phone-section">
      <div class="phone">
        {{ $parsePhone(user.phone) }}
      </div>
      <span>
        Sizin mobil nömrəniz
      </span>
    </div>
    <hr>
      <div class="description">
        <img src="/images/milli-on.svg" alt=""> <span>terminalları vasitəsilə balans artırılması aşağıdakı qaydadadır.</span>
      </div>

    <div class="steps">
      <div v-for="(step, i) in $t('terminal_pay_steps')" :key="i" class="step-item">
        <div class="step-number">
          <span>{{i}}</span>
        </div>
        <div class="step-text">{{step}}</div>
      </div>
    </div>

    <hr>
    <div class="row">

      <div class="col-md-7">
        <p>
          Xidmət dərhal tətbiq olunacaq. Hər hansı çətinlik
          yarandıqda <b>*8787 Çağrı Mərkəzi</b> ilə əlaqə saxlayın.
        </p>
      </div>

      <div class="col-md-5">
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
