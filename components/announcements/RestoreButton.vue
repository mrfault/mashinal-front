<template>
   <div>
      <button :class="`btn full-width btn--${className}`" @click.stop="showModal = true">
         {{ $t('restore' + (free ? '_free' : '')) }}
         <icon name="refresh"/>
      </button>
      <modal-popup
         :modal-class="'wider'"
         :toggle="showModal"
         :title="$t('restore_popup_alert', {count: amount})"
         @close="showModal = false"
      >

         <div>
            <button :class="['btn', 'full-width', 'btn--blue-new', 'active', { pending }]" @click.stop="restoreAnnouncement">{{ $t('pay') }}</button>
         </div>
      </modal-popup>
   </div>
</template>

<script>
import {PaymentMixin} from '~/mixins/payment';
import FeedbackModal from "~/components/sell/FeedbackModal.vue";
import MonetizationAlertModal from "~/components/sell/MonetizationAlertModal.vue";

export default {
   components: {MonetizationAlertModal, FeedbackModal},
   props: {
      free: Boolean,
      announcement: {},
      amount: '',
      className: {
         default: 'dark-blue-outline'
      }
   },
   mixins: [PaymentMixin],
   data() {
      return {
         showModal: false,
         pending: false
      }
   },
   methods: {
      async restoreAnnouncement() {
         if (this.pending) return;
         this.pending = true;
         try {
            const res = await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`);
            this.showModal = false
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
