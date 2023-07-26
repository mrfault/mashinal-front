<template>
  <div class="banking-cards">
    <div class="pt-2 pb-2">
      <div class="swiper-container" v-swiper:cardsSwiper="swiperOps" ref="cardsSwiper" v-show="showCardsSwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="card.id" v-for="card in bankingCards">
            <div class="banking-cards_item">
              <div class="card-img">
                <img :src="`/img/cards/card-${card.brand.toLowerCase()}-${card.img}.png`" :alt="card.brand" />
              </div>
              <div class="card-details d-flex flex-column justify-content-between">
                <div class="card-top d-flex">
                  <transition name="fade2">
                    <span class="badge" v-if="card.default">
                      <span>{{ $t('main') }}</span>
                    </span>
                  </transition>
                  <div class="d-flex ml-auto">
                    <span :class="['cursor-pointer', { active: card.default }]" @click="setDefault(card)">
                      <icon :name="`bookmark-${card.default ? 'fill' : 'outline'}`" />
                    </span>
                    <span class="cursor-pointer" @click="showDeleteModal = card.id">
                      <icon name="garbage" />
                      <!-- <inline-svg src="/icons/garbage.svg" :height="14" /> -->
                      <modal-popup
                        :toggle="showDeleteModal === card.id"
                        :title="$t('are_you_sure_you_wnat_to_delete_the_card')"
                        @close="showDeleteModal = false"
                      >
                        <form class="form" @submit.prevent="deleteCard(card.id)" novalidate>
                          <template v-if="card.default && activeCars.length">
                            <div class="card-bordered">
                              <div class="vehicle-specs">
                                <div class="row">
                                  <div class="col">
                                    <ul>
                                      <li v-for="car in activeCars" :key="car.id">
                                        <span>{{ car.car_number }}</span>
                                        <span>{{ car.created_date }}</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p v-html="$t('card_is_used_to_pay', { card: card.masked_pan })"></p>
                          </template>
                          <button type="submit" :class="['btn btn--green full-width', { pending }]">
                            {{ $t('confirm') }}
                          </button>
                        </form>
                      </modal-popup>
                    </span>
                  </div>
                </div>
                <div class="card-number d-flex justify-content-between"
                  v-html="cardNumber(card.masked_pan)">
                </div>
                <div class="card-bottom d-flex">
                   <span>**/**</span>
                   <!-- <img class="ml-auto" :src="`/img/cards/${card.brand.toLowerCase()}-white.svg`" :alt="card.brand" />-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-cards position-relative" v-if="!showCardsSwiper">
        <div class="banking-cards_item">
          <div class="card-img">
            <img :src="`/img/cards/card-${colorMode}-0.png`" alt="" />
          </div>
          <div class="card-details d-flex flex-column align-items-center justify-content-center">
            <span class="text-center">{{ $t('no_active_cards') }}</span>
          </div>
        </div>
        <div class="banking-cards_item">
          <div></div>
        </div>
        <div class="banking-cards_item">
          <div></div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button :class="['btn p-2 mt-1', { pending: pending && !showDeleteModal }]" @click="addCard">
        <icon name="plus-circle" class="btn-plus mr-1" />
        {{ $t('add_new_card') }}
      </button>
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
    async deleteCard(id) {
      if (this.pending) return;
      this.pending = true;
      try {
        await this.delete(id);
        this.$toasted.success(this.$t('card_deleted'));
        this.pending = false;
        this.showDeleteModal = false;
      } catch(err) {
        this.pending = false;
      }
    },
    setDefault(card) {
      if (card.default) return;
      this.makeCardDefault(card.id);
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
.btn-plus{
   margin-right: 10px;
}
</style>
