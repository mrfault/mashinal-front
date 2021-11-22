import Vue from 'vue';
import { mutate } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  bankingCards: []
});

export const state = () => getInitialState();

export const getters = {
  bankingCards: s => s.bankingCards,
}

export const actions = {
  async getBankingCards({ commit }) {
    const res = await this.$axios.$get(`/cards/list`);
    let cb = (card, i) => ({...card, img: (i % 3) + 1});
    commit('mutate', { property: 'bankingCards', value: res.data.map(cb) });
    return res;
  },
  async makeCardDefault({ commit }, id) {
    commit('makeDefault', { id });
    const res = await this.$axios.$post(`/cards/${id}/set_default`);
    return res;
  },
  async deleteCard({ commit }, id) {
    const res = await this.$axios.$delete(`/cards/${id}`);
    commit('removeCard', { id });
    return res;
  },
  async addCard({ commit }) {
    const res = await this.$axios.$post(`/cards/add`);
    // commit('addCard', { card });
    return res;
  }
}

export const mutations = {
  mutate: mutate(),
  addCard(state, { card }) {
    Vue.set(state.bankingCards, state.bankingCards.length, card);
  },
  removeCard(state, { id }) {
    let index = state.bankingCards.findIndex(item => item.id === parseInt(id));
    if (index !== -1) Vue.delete(state.bankingCards, index);
  },
  makeDefault(state, { id }) {
    let indexNew = state.bankingCards.findIndex(item => item.id === parseInt(id));
    let indexOld = state.bankingCards.findIndex(item => item.default);
    Vue.set(state.bankingCards[indexNew], 'default', true);
    Vue.set(state.bankingCards[indexOld], 'default', false);
  }
}