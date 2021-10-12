import Vue from 'vue';

const getInitialState = () => ({
  profileType: 'autosalon',
  packages: [],
  faq: []
});

export const state = () => getInitialState();

export const getters = {
  salonPackages: s => s.packages.filter(p => p.type_id == 1),
  partsPackages: s => s.packages.filter(p => p.type_id == 2),
  profileType: s => s.profileType,
  faq: s => s.faq
}

export const actions = {
  setProfileType({ commit }, value) {
    commit('mutate', { property: 'profileType', value });
  },
  async getPackages({ commit }) {
    const res = await this.$axios.$get('/packages');
    commit('mutate', { property: 'packages', value: res });
  },
  async getFaq({ commit }) {
    const res = await this.$axios.$get('/faq');
    commit('mutate', { property: 'faq', value: res });
  }
}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else state[payload.property] = payload.value;
  },
}