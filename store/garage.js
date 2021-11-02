import { mutate, removeInArray, updateInArray } from '~/lib/vuex-helpers/mutations';

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
  },
  async addNewCar({ dispatch }, data) {
    const res = await this.$axios.$get(`/garage/register${this.$queryParams(data)}`);
    if (res.status === 'success') {
      await dispatch('getCarList');
    }
  },
  async activateCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/activate${this.$queryParams(data)}`);
    if (res.status === 'success') {
      commit('updateInArray', { property: 'cars', where: { key: 'id', value: data.id }, key: 'status', value: 1 });
    }
  },
  async deactivateCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/deactivate${this.$queryParams(data)}`);
    if (res.status === 'success') {
      commit('updateInArray', { property: 'cars', where: { key: 'id', value: data.id }, key: 'status', value: 2 });
    }
  },
  async deleteCar({ commit }, data) {
    const res = await this.$axios.$get(`/garage/car/delete${this.$queryParams(data)}`);
    if (res.status === 'success') {
      commit('removeInArray', { property: 'cars', where: { key: 'id', value: data.id } });
    }
  },
  async getProtocols({ commit }, data) {
    const res = await this.$axios.$get(`/garage/protocol/list${this.$queryParams(data)}`);
    commit('mutate', { property: 'protocols', value: res });
  },
  async getProtocolFiles({ commit }, data) {
    const res = await this.$axios.$get(`/garage/protocol/files${this.$queryParams(data)}`);
    commit('mutate', { property: 'protocolFiles', value: res });
  },
  async checkDriverPoints({ commit }, data) {
    const res = await this.$axios.$get(`/garage/driver-license/check${this.$queryParams(data)}`);
    commit('mutate', { property: 'driverLicensePoints', value: res });
  }
}

export const mutations = {
  mutate: mutate(),
  removeInArray: removeInArray(),
  updateInArray: updateInArray()
}