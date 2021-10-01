<template>
  <button :class="['btn btn--dark-blue-2-outline full-width', { pending }]" @click.stop="pay">
    {{ $t('pay') }}
  </button>
</template>

<script>
import { PaymentMixin } from '~/mixins/payment';

export default {
  props: {
    announcement: {}
  },
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false
    }
  },
  methods: {
    async pay() {
      if (this.pending) return;
      this.pending = true;
      try {
        const res = await this.$axios.$get(`/payment/get_system_paid_announce_status/${this.announcement.id}?is_mobile=${this.isMobileBreakpoint}`);
        this.pending = false;
        this.handlePayment(res);
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>