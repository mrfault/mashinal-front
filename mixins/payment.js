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
    
    callUpdatePaidStatus(paid, text) {
      let type = paid ? 'success' : 'error';
      if (!paid) text = this.$t('try_again');
      this.updatePaidStatus({ type, text, title: this.$t(`${type}_payment`) });
    },
    handlePayment(res, route = false, text = '', name = 'purchaseservice') {
      if (!this.isMobileBreakpoint) {
        window.open((res?.data?.redirect_url || res), name, 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=494,height=718');
        let payment_id = res?.data?.payment_id;
        if (payment_id) {
          this.connectEcho(`purchase.${payment_id}`, false).listen('PurchaseInitiated', async (data) => {
            let { is_paid, status } = data.payment;
            let paid = is_paid || status === 1;
            
            if (paid) {
              if (this.loggedIn)
                await this.$auth.fetchUser();
              if (!route) {
                await this.$nuxt.refresh();
                this.callUpdatePaidStatus(paid, text);
              }
            } else {
              this.callUpdatePaidStatus(paid);
            }

            const stopListening = () => {
              this.connectEcho(`purchase.${payment_id}`, false).stopListening('PurchaseInitiated');
            }
            
            if (route) {
              this.$router.push(route, () => {
                this.callUpdatePaidStatus(paid, text);
                stopListening();
              });
            } else {
              stopListening();
            }
            
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