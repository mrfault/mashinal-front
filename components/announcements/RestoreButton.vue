<template>
  <button :class="['btn full-width', `btn--${className}`, { pending }]" @click.stop="restoreAnnouncement">
    <icon name="refresh" /> {{ $t('restore'+(free ? '_free' : '')) }}
  </button>
</template>

<script>
import { PaymentMixin } from '~/mixins/payment';

export default {
  props: {
    free: Boolean,
    announcement: {},
    className: {
      default: 'dark-blue-outline'
    }
  },
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false
    }
  },
  methods: {
    async restoreAnnouncement() {
      if (this.pending) return;
      this.pending = true;
      try {
        const res = await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`);
        if (!res?.data?.redirect_url) {
          await this.$nuxt.refresh();
          this.updatePaidStatus({ 
            type: 'success', 
            text: this.$t('announcement_restored'), 
            title: this.$t('success_payment') 
          });
          this.pending = false;
        } else {
          this.pending = false;
          this.handlePayment(res, false, this.$t('announcement_restored'));
        }
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>