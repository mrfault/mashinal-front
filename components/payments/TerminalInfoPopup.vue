<template>
  <modal-popup
    :toggle="showTerminalInfo"
    :title="$t('pay_with_terminal')"
    @close="close"
    :modal-class="'terminal-info-popup'"
  >
    <div class="phone-section">
      <div class="phone" v-if="announcement.user">
        {{ $parsePhone(announcement.user.phone) }}
      </div>
      <span>
        {{$t('mobile_number')}}
      </span>
    </div>
    <hr>
      <div class="description">
        <img src="/images/milli-on.svg" alt=""> <span>{{$t('terminal_popup_title')}}</span>
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
         {{$t('terminal_help_description')}}
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
import {mapGetters} from "vuex";

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
