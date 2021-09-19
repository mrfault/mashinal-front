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
        if (this.announcement.is_autosalon || this.free) {
          await this.$axios.$get(`/restore/${this.announcement.id_unique}`);
          await this.$nuxt.refresh();
          this.$toasted.success(this.$t('announcement_restored'));
          this.pending = false;
        } else {
          const res = await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`);
          this.pending = false;
          this.handlePayment(res);
        }
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>