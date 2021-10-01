<template>
  <button :class="['btn btn--dark-blue-2-outline full-width', { pending }]" @click.stop="pay">
    {{ $t('pay_money', {n: 5}) }}
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
        if (!res?.data?.redirect_url) {
          await this.$nuxt.refresh();
          this.$toasted.success(this.$t('announcement_paid'));
          this.pending = false;
        } else {
          this.pending = false;
          this.handlePayment(res, false, this.$t('announcement_paid'));
        }
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>