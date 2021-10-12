import Vue from 'vue';

const getInitialState = () => ({
  packages: [],
  profileType: 'autosalon'
});

export const state = () => getInitialState();

export const getters = {
  salonPackages: s => s.packages.filter(p => p.type_id == 1).sort((a, b) => b.sort_order - a.sort_order),
  partsPackages: s => s.packages.filter(p => p.type_id == 2).sort((a, b) => b.sort_order - a.sort_order),
  profileType: s => s.profileType
}

export const actions = {
  setProfileType({ commit }, value) {
    commit('mutate', { property: 'profileType', value });
  },
  async getPackages({ commit }) {
    const res = await this.$axios.$get('/packages');
    commit('mutate', { property: 'packages', value: res });
  }
}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else state[payload.property] = payload.value;
  },
}