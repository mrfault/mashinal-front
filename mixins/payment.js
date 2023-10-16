import {mapGetters, mapActions} from 'vuex';
import {SocketMixin} from '~/mixins/socket';
import SelectBankingCard from '~/components/payments/SelectBankingCard';
import TerminalInfoButton from '~/components/payments/TerminalInfoButton';
import TerminalInfoPopup from '~/components/payments/TerminalInfoPopup';

export const PaymentMixin = {
   mixins: [SocketMixin],
   components: {
      SelectBankingCard,
      TerminalInfoButton,
      TerminalInfoPopup
   },
   data() {
      return {
         showPaymentModal: false,
         paymentMethod: 'card',
         bankingCard: ''
      }
   },
   mounted() {
      this.selectDefaultCard();
   },
   computed: {
      ...mapGetters({bankingCards: 'bankingCards/bankingCards'}),
      ...mapGetters(['paidStatusData']),
      paymentMethodOptions() {
         return [
            {key: 'card', name: this.$t('pay_with_card')},
            {key: 'balance', name: this.$t('pay_with_balance'), disabled: !this.haveBalanceToPay},
         ]
      }
   },
   methods: {
      ...mapActions(['updatePaidStatus']),

      selectDefaultCard() {
         let item = this.bankingCards.find(item => item.default)
         if (item)
            this.bankingCard = item.id
      },

      callUpdatePaidStatus(paid, text) {
         console.log('Otkaz paid', paid)
         let type = paid ? 'success' : 'error';
         if (!paid) text = this.$t('try_again');

         this.updatePaidStatus({type, text, title: this.$t(`${type}_payment`)});
      },

      handlePayment(res, route = false, text = '', version = 'v1') {
         if (!this.isMobileBreakpoint) {
            let size = ({v1: 'width=494,height=718', v2: 'width=1042,height=725'})[version];
            window.open((res?.data?.redirect_url || res), 'purchaseservice', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,' + size);
            let payment_id = res?.data?.payment_id;
            if (payment_id) {
               let channel = this.getPusher().subscribe(`purchase.${payment_id}`);

               channel.bind('App\\Events\\PurchaseInitiated', async (data) => {
                  console.log('connectEcho', data.payment)
                  this.showPaymentModal = false;
                  let {is_paid, status} = data.payment;
                  let paid = is_paid || status === 1;

                  route = (route instanceof Array) ? (route[paid ? 0 : 1]) : route;

                  if (paid) {
                     if (data.payment.operation_key === 'attorney_pay') {
                        return this.$router.push({path: this.$localePath('/garage'), query: {tab: 'attorney-list'}})
                     }

                     if (data.payment.operation_key === "uncompleted_announce") {
                        await this.$store.dispatch('getAnnouncementsStatuses');
                        await this.$store.dispatch('getMyAllAnnouncementsV2', {status: '', shop: false});
                        await this.$nuxt.refresh();
                        await this.callUpdatePaidStatus(paid, text);
                        this.$nuxt.$emit('changeTab');
                     }

                     if (this.loggedIn) await this.$auth.fetchUser();

                     if (!route) {
                        await this.$nuxt.refresh();
                        this.callUpdatePaidStatus(paid, text);
                     }
                     localStorage.removeItem('selectedPackage');
                  } else {
                     console.log('Otkaz')
                     this.callUpdatePaidStatus(paid);
                  }

                  const stopListening = () => {
                     this.connectEcho(`purchase.${payment_id}`, false).stopListening('App\\Events\\PurchaseInitiated');
                  }

                  if (route) {
                     if (paid) {
                        this.$router.push(route, () => {
                           this.callUpdatePaidStatus(paid, text);

                           stopListening();
                        });
                     } else {
                        await this.$store.dispatch('fetchResetForm', false);
                        this.callUpdatePaidStatus(paid, text);
                        stopListening();
                     }
                  } else {
                     stopListening();
                  }
                  if (data.payment.operation_key === 'offer_payment_key' && paid) {
                     setTimeout(() => {
                        this.$router.push('/offer');
                     }, 2000)
                  }
               });

               // this.connectEcho(`purchase.${payment_id}`, false).bind('App\Events\PurchaseInitiated', async (data) => {
               //    console.log('connectEcho', data)
               //    this.showPaymentModal = false;
               //    let {is_paid, status} = data.payment;
               //    let paid = is_paid || status === 1;
               //
               //    route = (route instanceof Array) ? (route[paid ? 0 : 1]) : route;
               //
               //    if (paid) {
               //       if (data.payment.operation_key === 'attorney_pay') {
               //          return this.$router.push({path: this.$localePath('/garage'), query: {tab: 'attorney-list'}})
               //       }
               //
               //       if (this.loggedIn) await this.$auth.fetchUser();
               //
               //       if (!route) {
               //          await this.$nuxt.refresh();
               //          this.callUpdatePaidStatus(paid, text);
               //       }
               //       localStorage.removeItem('selectedPackage');
               //    } else {
               //       this.callUpdatePaidStatus(paid);
               //    }
               //
               //    const stopListening = () => {
               //       this.connectEcho(`purchase.${payment_id}`, false).stopListening('App\Events\PurchaseInitiated');
               //    }
               //
               //    if (route) {
               //       if (paid) {
               //          this.$router.push(route, () => {
               //             this.callUpdatePaidStatus(paid, text);
               //
               //             stopListening();
               //          });
               //       } else {
               //          await this.$store.dispatch('fetchResetForm', false);
               //          this.callUpdatePaidStatus(paid, text);
               //          stopListening();
               //       }
               //    } else {
               //       stopListening();
               //    }
               //    if (data.payment.operation_key === 'offer_payment_key' && paid) {
               //       setTimeout(() => {
               //          this.$router.push('/offer');
               //       }, 2000)
               //    }
               // });
            }
         } else {
            // redirect to kapital bank page
            this.$nuxt.$loading.start();

            setTimeout(() => this.$nuxt.$loading.finish(), 500);
            window.location = res?.data?.redirect_url || res;
         }
      }
   },
   watch: {
      bankingCards(value) {
         this.selectDefaultCard();
      },
      haveBalanceToPay(value) {
         if (!value) {
            this.paymentMethod = 'card';
         }
      }
   }
}
