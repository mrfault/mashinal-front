import { mapGetters, mapActions } from 'vuex';

import { SocketMixin } from '~/mixins/socket';

export const PaymentMixin = {
  mixins: [SocketMixin],
  data() {
    return {
      selectedPaymentMethod: 1
    }
  },
  computed: {
    ...mapGetters(['paidStatusData'])
  },
  methods: {
    ...mapActions(['updatePaidStatus']),
    
    handlePayment(res, name = 'purchaseservice') {
      if (!this.isMobileBreakpoint) {
        window.open((res?.data?.redirect_url || res), name, 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=494,height=718');
        if (res?.data?.payment_id) {
          this.connectEcho(`purchase.${res.data.payment_id}`, false).listen('PurchaseInitiated', async (data) => {
            let { is_paid, status } = data.payment;
            let paid = is_paid || status === 1;
            if (paid) {
              await this.$nuxt.refresh();
              if (this.loggedIn)
                await this.$auth.fetchUser();
            }
            let type = paid ? 'success' : 'error';
            this.updatePaidStatus({
              type,
              text: '', //this.$t(`${type}_payment_msg`),
              title: this.$t(`${type}_payment`)
            });
          });
        }
      } else {
        // redirect to kapital bank page
        this.$nuxt.$loading.start();
        setTimeout(() => this.$nuxt.$loading.finish(), 500);
        window.location = res?.data?.redirect_url || res;
      }
    }
  }
}