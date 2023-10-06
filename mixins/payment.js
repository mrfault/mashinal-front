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
         let type = paid ? 'success' : 'error';
         if (!paid) text = this.$t('try_again');
         this.updatePaidStatus({type, text, title: this.$t(`${type}_payment`)}).then(r => {
            console.log('Update Payment Status', r);
         });
      },
      handlePayment(res, route = false, text = '', version = 'v1', isCreateRegistrationMark) {
         if (!this.isMobileBreakpoint) {
            let size = ({v1: 'width=494,height=718', v2: 'width=1042,height=725'})[version];
            window.open((res?.data.redirect_url || res), 'purchaseservice', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,' + size);
            let payment_id = res?.data?.payment_id;
            // console.log(payment_id);
            if (payment_id) {
               if (isCreateRegistrationMark) {
                  this.$toasted.success(" isCreateRegistrationMark payment_id")
               }
               this.$toasted.success("payment_id")
               this.connectEcho(`purchase.${payment_id}`, false).listen('PurchaseInitiated', async (data) => {

                  this.showPaymentModal = false;
                  let {is_paid, status} = data.payment;
                  let paid = is_paid || status === 1;

                  route = (route instanceof Array) ? (route[paid ? 0 : 1]) : route;

                  if (paid) {
                     if (isCreateRegistrationMark) {
                        this.$toasted.success(" isCreateRegistrationMark paid")
                     }
                     this.$toasted.success("paid")

                     if (data.payment.operation_key === 'attorney_pay') {
                        return this.$router.push({path: this.$localePath('/garage'), query: {tab: 'attorney-list'}})
                     }

                     if (this.loggedIn) await this.$auth.fetchUser();

                     if (!route) {
                        await this.$nuxt.refresh();
                        this.callUpdatePaidStatus(paid, text);
                     }
                     localStorage.removeItem('selectedPackage');
                  } else {
                     if (isCreateRegistrationMark) {
                        this.$toasted.success(" isCreateRegistrationMark paid else")
                     }
                     this.$toasted.success("paid else")
                     this.callUpdatePaidStatus(paid);
                  }

                  const stopListening = () => {
                     if (isCreateRegistrationMark) {
                        this.$toasted.success(" isCreateRegistrationMark 0000000000000000000000000000000")
                     }
                     this.$toasted.success("0000000000000000000000000000000")
                     this.connectEcho(`purchase.${payment_id}`, false).stopListening('PurchaseInitiated');
                  }

                  if (route) {
                     if (paid) {
                        this.$toasted.success("paid")
                        if (isCreateRegistrationMark) {
                           this.$toasted.success("paid isCreateRegistrationMark")
                        }

                        this.$router.push(route, () => {
                           this.callUpdatePaidStatus(paid, text);

                           stopListening();
                        });
                     } else {
                        await this.$store.dispatch('fetchResetForm', false);
                        if (isCreateRegistrationMark) {
                           this.$toasted.success("else fetchResetForm isCreateRegistrationMark ")
                        }
                        this.$toasted.success("else fetchResetForm ")
                        this.callUpdatePaidStatus(paid, text);
                        stopListening();
                     }
                  } else {
                     if (isCreateRegistrationMark) {
                        this.$toasted.success("else stopListening isCreateRegistrationMark ")
                     }
                     this.$toasted.success("else stopListening ")
                     stopListening();
                  }
                  if (data.payment.operation_key === 'offer_payment_key' && paid) {
                     if (isCreateRegistrationMark) {
                        this.$toasted.success("else offer_payment_key isCreateRegistrationMark ")
                     }
                        this.$toasted.success("else offer_payment_key ")
                     setTimeout(() => {
                        this.$router.push('/offer');
                     }, 2000)
                  }
               });
            }
         } else {
            if (isCreateRegistrationMark) {
               this.$toasted.success(" isCreateRegistrationMark payment_id else")
            }
            this.$toasted.success("payment_id else")
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
