<template>
  <div class="select-banking-card">
    <form-select
      :label="$t('pay_with_card')"
      :options="cardOptions"
      :clear-option-text="$t('other_card')"
      :clear-option-pull-down="true"
      :has-cards="true"
      :skip-select="true"
      img-key="icon"
      v-model="activeCardId"
    />
    <div class="banking-cards_item mt-3" v-if="activeCard && showCardImage">
      <div class="card-img">
        <img :src="`/img/cards/card-${activeCard.brand.toLowerCase()}-${activeCard.img}.png`" :alt="activeCard.brand" />
      </div>
      <div class="card-details d-flex flex-column justify-content-between">
        <div class="card-top d-flex">
        </div>
        <div class="card-number d-flex justify-content-between"
          v-html="cardNumber(activeCard.masked_pan)">
        </div>
        <div class="card-bottom d-flex">
          <span>**/**</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    value: {},
    showCardImage:{
      type: Boolean,
      default: true,
    }
  },

  computed: {
    ...mapGetters({
      bankingCards: 'bankingCards/bankingCards'
    }),
    activeCardId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    cardOptions() {
      return this.bankingCards.map(card => ({
        key: card.id,
        name: this.$parseCardNum(card.masked_pan).join(' '),
        icon: `/img/cards/${card.brand.toLowerCase()}${this.isDarkMode ? '-white' : ''}.svg`,
        brand: card.brand
      }));
    },
    activeCard() {
      return this.bankingCards.find(card => card.id === this.activeCardId);
    }
  },
  methods: {
    ...mapActions({
      getBankingCards: 'bankingCards/getBankingCards'
    }),
    cardNumber(num) {
      return this.$parseCardNum(num).map(n => `<span>${n}</span>`).join('');
    }
  },
  async fetch() {
    await this.getBankingCards();
  }
}
</script>
