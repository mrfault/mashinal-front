import Vue from 'vue';
import { mutate } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  cars: {},
  attorneys: {},
  protocols: {},
  protocolFiles: {},
  driverLicensePoints: {}
});

export const state = () => getInitialState();

export const getters = {
  cars: s => s.cars,
  attorneys: s => s.attorneys,
  protocols: s => s.protocols,
  protocolFiles: s => s.protocolFiles,
  driverLicensePoints: s => s.driverLicensePoints
}

export const actions = {
  async getCarList({ commit }, data) {
    const res = await this.$axios.$get(`${this.$env().API_SECRET}/garage/car/list${this.$queryParams(data)}`);
    commit('mutate', { property: 'cars', value: {data: res} });
    return {data: res};
  },
  async getAttorneyList({ commit }) {
    const res = await this.$axios.$get(`/attorney/list`);
    commit('mutate', { property: 'attorneys', value: res.data });
    return res;
  },
  async checkNewCar({}, data) {
    return await this.$axios.$get(`/garage/check${this.$queryParams(data)}`);
  },
  async registerNewCar({}, data) {
    return await this.$axios.$post(`${this.$env().API_SECRET}/garage/car/add`, data);
  },
  async activateCar({}, data) {
    return await this.$axios.$patch(`${this.$env().API_SECRET}/garage/car/${data.id}/activate`);
  },
  async deactivateCar({ commit }, data) {
    const res = await this.$axios.$patch(`${this.$env().API_SECRET}/garage/car/${data.id}/deactivate`);
    commit('updateCar', { id: data.id, key: 'status', value: 0 });
    commit('updateCar', { id: data.id, key: 'sync_status', value: 0 });
    return res;
  },
  async deleteCar({ commit }, data) {
    const res = await this.$axios.$delete(`${this.$env().API_SECRET}/garage/car/${data.id}/delete`);
    commit('removeCar', { id: data.id });
    return res;
  },
  async getProtocols({ commit }, data) {
    const res = await this.$axios.$get(`${this.$env().API_SECRET}/garage/protocols/list${this.$queryParams(data)}`);
    console.log('sssss4444', data)
    commit('mutate', { property: 'protocols', value: res });
    return res;
  },
  async getProtocolFiles({ commit }, data) {
    const res = await this.$axios.$get(`/garage/protocols/files${this.$queryParams(data)}`);
    commit('mutate', { property: 'protocolFiles', value: res });
    commit('mutate', { property: 'protocolFiles', key: 'din_id', value: data.din_id });
    return res;
  },
  async checkDriverPoints({ commit }, data) {
    const res = await this.$axios.$get(`/garage/driver/license/check${this.$queryParams(data)}`);
    commit('mutate', { property: 'driverLicensePoints', value: res });
    return res;
  },
  async uploadCarThumb({ commit }, data) {
    const res = await this.$axios.$post(`/garage/image_upload`, data);
    if (res) commit('updateCar', { id: data.get('id'), key: 'thumb', value: res });
    return res;
  },
  async resetCarData({ commit }, data) {
    commit('mutate', { property: 'protocols', value: {} });
    commit('mutate', { property: 'protocolFiles', value: {} });
  }
}

export const mutations = {
  mutate: mutate(),
  updateCar(state, { id, key, value }) {
    if (!state.cars.data) return;
    let index = state.cars.data.findIndex(item => item.id === parseInt(id));
    if (index !== -1) Vue.set(state.cars.data[index], key, value);
  },
  removeCar(state, { id }) {
    if (!state.cars.data) return;
    let index = state.cars.data.findIndex(item => item.id === parseInt(id));
    if (index !== -1) Vue.delete(state.cars.data, index);
    if (!state.cars.data.length) Vue.delete(state.cars, 'data');
  }
}
