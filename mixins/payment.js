import { mapGetters, mapActions } from 'vuex';

import { SocketMixin } from '~/mixins/socket';

import PaidStatus from '~/components/elements/PaidStatus';

export const PaymentMixin = {
  mixins: [SocketMixin],
  components: {
    PaidStatus
  },
  computed: {
    ...mapGetters(['paidStatusData'])
  },
  methods: {
    ...mapActions(['updatePaidStatus']),
    
    handlePayment(res, name = 'purchaseservice') {
      if (!this.isMobileBreakpoint) {
        window.open(res.data.redirect_url, name, 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=494,height=718');
        this.connectEcho(`purchase.${res.data.payment_id}`, false).listen('PurchaseInitiated', async (data) => {
          const paid = data.payment.status === 1;
          if (paid) await this.$nuxt.refresh();
          let type = paid ? 'success' : 'error';
          this.updatePaidStatus({
            type,
            text: this.$t(`${type}_payment_msg`),
            title: this.$t(`${type}_payment`)
          });
        });
      } else {
        // redirect to kapital bank page
        this.$nuxt.$loading.start();
        setTimeout(() => this.$nuxt.$loading.finish(), 500);
        window.location = res.data.redirect_url;
      }
    }
  }
}