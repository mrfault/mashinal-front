import Vue from 'vue';
import { mutate } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  cars: {},
  protocols: {},
  protocolFiles: {},
  driverLicensePoints: {}
});

export const state = () => getInitialState();

export const getters = {
  cars: s => s.cars,
  protocols: s => s.protocols,
  protocolFiles: s => s.protocolFiles,
  driverLicensePoints: s => s.driverLicensePoints
}

export const actions = {
  async getCarList({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/list${this.$queryParams(data)}`);
    commit('mutate', { property: 'cars', value: res });
    return res;
  },
  async addNewCar({ dispatch }, data) {
    const res = await this.$axios.$get(`/garage/register${this.$queryParams(data)}`);
    if (res.status === 'success') await dispatch('getCarList', {});
    return res;
  },
  async activateCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/activate${this.$queryParams(data)}`);
    if (res.status === 'success') commit('updateCar', { id: data.id, key: 'status', value: 1 });
    return res;
  },
  async deactivateCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/deactivate${this.$queryParams(data)}`);
    if (res.status === 'success') commit('updateCar', { id: data.id, key: 'status', value: 0 });
    return res;
  },
  async deleteCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/delete${this.$queryParams(data)}`);
    if (res.status === 'success') commit('removeCar', { id: data.id });
    return res;
  },
  async getProtocols({ commit }, data) {
    const res = await this.$axios.$get(`/garage/protocol/list${this.$queryParams(data)}`);
    commit('mutate', { property: 'protocols', value: res });
    return res;
  },
  async getProtocolFiles({ commit }, data) {
    const res = await this.$axios.$get(`/garage/protocol/files${this.$queryParams(data)}`);
    commit('mutate', { property: 'protocolFiles', value: res });
    return res;
  },
  async checkDriverPoints({ commit }, data) {
    const res = await this.$axios.$get(`/garage/driver/license/check${this.$queryParams(data)}`);
    commit('mutate', { property: 'driverLicensePoints', value: res });
    return res;
  },
  async uploadCarThumb({ commit }, data) {
    const res = await this.$axios.$post(`/garage/image_upload`, data);
    if (res) commit('updateCar', { id: data.get('car_id'), key: 'thumb', value: res });
    return res;
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