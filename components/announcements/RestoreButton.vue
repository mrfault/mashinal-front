<template>
   <div>
      <button :class="`restore-btn btn full-width btn--${className}`" @click.stop="onClick">
         {{ $t('restore' + (free ? '_free' : '')) }}
         <icon name="refresh"/>
      </button>

      <modal-popup
         :modal-class="'wider'"
         :toggle="showModal"
         :title="$t('restore_popup_alert', {count: settingsV2?.settings?.restore_price})"
         @close="showModal = false"
      >
         <div>
            <button
               :class="['btn', 'full-width', 'btn--blue-new', 'active', { pending }]"
               @click.stop="restoreAnnouncement"
            >{{ $t('pay') }}</button>
         </div>
      </modal-popup>
   </div>
</template>

<script>
   import {PaymentMixin} from '~/mixins/payment';
   import FeedbackModal from "~/components/sell/FeedbackModal.vue";
   import MonetizationAlertModal from "~/components/sell/MonetizationAlertModal.vue";
   import {mapGetters} from "vuex";

export default {
   components: {MonetizationAlertModal, FeedbackModal},
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
         showModal: false,
         pending: false
      }
   },
   computed: {
      ...mapGetters(['settingsV2'])
   },
   // mounted() {
   //    console.log("type", this.announcement.type)
   // },
   methods: {
      onClick() {
         (this.user.autosalon || this.user.external_salon || this.announcement.type === "part") ? this.restore() : (this.showModal = true)
      },
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
      },
      async restore() {
         try {
            await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`)
            this.$emit('refreshData');

            this.$toasted.success(this.$t('announcement_restored'))
            this.$store.commit('closeDropdown');
         } catch (e) {
            this.$toasted.error(this.$t(e.message))
         }
      },
   }
}
</script>

<style lang="scss" scoped>
   .restore-btn {

   }

   .dark-mode {
      .restore-btn {
         border-color: #1B2434;
         background-color: #1B2434;
      }
   }
</style>
