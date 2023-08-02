<template>
   <div class="banking-cards-new">
      <div class="row" v-if="removedCard === null">
         <div class="col-md-12" v-if="bankingCards.length">
            <ul class="banking-card-list">

               <li class="banking-card-list-item" :key="card.id" v-for="card in bankingCards" :class="card.default ? 'active' : ''" @click="setDefault(card)">
                  <div class="card-information">
                     <div>
                        <inline-svg src="/icons/visa.svg" v-if="card.brand === 'VISA'"/>
                        <inline-svg src="/icons/master.svg" v-if="card.brand === 'MC'"/>
                     </div>
                     <div class="card-pan">
                        <span v-html="cardNumber(card.masked_pan)"></span>
                     </div>
                  </div>
                  <div class="card-option">
                     <button class="btn-delete" @click="deleteCardDialog(card)">
                        <inline-svg src="/icons/close.svg"/>
                     </button>
                  </div>
               </li>
            </ul>
         </div>
         <div class="col-md-12">
            <button :class="['btn btn-template']" @click="addCard">
               {{ $t('add_new_card') }} <inline-svg src="/icons/plus1.svg"/>
            </button>
         </div>
      </div>

      <div class="row" v-if="removedCard">
         <div class="col-md-12">
            <p class="mb-3 delete-text">{{$t('are_you_sure_you_wnat_to_delete_the_card')}}</p>
            <p class="mb-3 delete-text" v-html="cardNumber(removedCard.masked_pan)"></p>
         </div>
         <div class="col-md-12">
            <div class="row">
               <div class="col-md-6">
                  <button :class="['btn btn-template']" @click="reject">
                     {{ $t('reject') }}
                  </button>
               </div>
               <div class="col-md-6">
                  <button :class="['btn btn-template']" @click="deleteCard(removedCard.id)">
                     {{ $t('delete_card') }}
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { PaymentMixin } from '~/mixins/payment';

export default {
   mixins: [PaymentMixin],
   data() {
      return {
         pending: false,
         showDeleteModal: false,
         removedCard: null,
         swiperOps: {
            effect: 'coverflow',
            grabCursor: true,
            init: false,
            centeredSlides: true,
            slidesPerView: 'auto',
            roundLengths: true,
            keyboard: {
               enabled: true
            },
            coverflowEffect: {
               rotate: 40,
               stretch: 110,
               depth: 300,
               modifier: 1,
               slideShadows: false,
            },
            breakpoints: {
               340: {
                  coverflowEffect: {
                     stretch: 130
                  }
               },
               390: {
                  coverflowEffect: {
                     stretch: 160
                  }
               }
            }
         }
      }
   },
   computed: {
      ...mapGetters({
         bankingCards: 'bankingCards/bankingCards',
         cars: 'garage/cars'
      }),
      activeCars() {
         if (!this.cars.data) return [];
         return this.cars.data.filter(car => car.status === 1).map(car => ({
            id: car.id,
            car_number: this.$readCarNumber(car.car_number),
            created_date: this.$moment(car.created_date).format('DD.MM.YYYY')
         }));
      },
      showCardsSwiper() {
         return !!this.bankingCards.length;
      }
   },
   methods: {
      ...mapActions({
         getBankingCards: 'bankingCards/getBankingCards',
         makeCardDefault: 'bankingCards/makeCardDefault',
         add: 'bankingCards/addCard',
         delete: 'bankingCards/deleteCard'
      }),
      reject() {
         this.removedCard = null;
      },
      cardNumber(num) {
         return this.$parseCardNum(num).map(n => `<span>${n}</span>`).join('');
      },
      async addCard() {
         if (this.pending) return;
         this.pending = true;
         try {
            const res = await this.add({
               is_mobile: this.isMobileBreakpoint
            });
            this.pending = false;
            this.handlePayment(res, false, this.$t('card_added'), 'v2');
         } catch(err) {
            this.pending = false;
         }
      },
      async deleteCardDialog(card) {
         this.removedCard = card;
      },
      async deleteCard(id) {
         if (this.pending) return;
         this.pending = true;
         try {
            await this.delete(id);
            this.$toasted.success(this.$t('card_deleted'));
            this.pending = false;
            this.showDeleteModal = false;
            this.removedCard = null;
         } catch(err) {
            this.pending = false;
         }
      },
      setDefault(card) {
         if (card.default) return;
         this.makeCardDefault(card.id);
         this.$toasted.success(card.masked_pan  +" "+ "Əsas kart kimi yadda saxlanıldı");
      },
      initSwiper() {
         this.$nextTick(() => {
            setTimeout(() => {
               this.cardsSwiper?.init();
            }, 100);
         });
      }
   },
   watch: {
      showCardsSwiper(val) {
         if (val) {
            this.initSwiper();
         }
      }
   },
   mounted() {
      this.initSwiper();
   },
}
</script>
<style>

   .delete-text{
      font-size: 18px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0;
      text-align: left;
      color: #364152;
   }
   .banking-cards-new {
      margin: 0;
      padding: 0;
   }

   .banking-card-list{
      margin: 0;
      padding: 0;
   }

   .banking-card-list .banking-card-list-item{
      width: 100%;
      height: 52px;
      padding: 8px 16px 8px 16px;
      border-radius: 8px;
      gap: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #CDD5DF;
      margin-bottom: 15px;
   }

   .banking-card-list .banking-card-list-item:hover{
      background-color: #f5f8fb;
      cursor: pointer;
   }

   .banking-card-list .banking-card-list-item.active{
      border: 1px solid #155EEF;
   }

   .card-information{
      width: 60%;
      height: 25px;
      display: flex;
      justify-content: start;
      align-items: center;
   }

   .card-option {
      width: 20%;
      height: 25px;
      display: flex;
      justify-content: end;
      align-items: center;
   }
   .card-pan{
      margin-left: 15px;
   }

   .btn-delete{
      height: 20px;
      width: 20px;
      border: 0;
      background: none;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
   }

   .btn-delete:hover,
   .btn-delete:focus{
      border: 0;
      background: none;
   }

   .btn-delete svg path,
   .btn-delete svg path{
      stroke: #CDD5DF;
      fill: #CDD5DF;
   }

   .btn-delete:hover svg path,
   .btn-delete:focus svg path{
      stroke: #a9bfd7;
      fill: #a9bfd7;
   }

   .btn-template{
      width: 100%;
      height: 52px;
      padding: 14px 16px 14px 16px;
      border-radius: 8px;
      border: 1px solid #CDD5DF;
      gap: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #FFFFFF;
   }

   .btn-template:hover,
   .btn-template:focus{
      background-color: #f5f8fb;
   }

   .modal-popup_content ul, .modal-popup_content ol{
      padding: 0;
      margin: 0;
   }

   .dark-mode {
      .btn-template{
         background: #1B2434;
         border: 1px solid #4B5565;
         color: #CDD5DF;
      }
      .btn-template svg path{
         fill: #CDD5DF!important;
         stroke: #CDD5DF!important;
      }
      .banking-card-list .banking-card-list-item:hover{
         background-color: #1b2434;
         opacity: .8;
         cursor: pointer;
      }
      .delete-text {
         color: #9AA4B2;
      }
   }
</style>
