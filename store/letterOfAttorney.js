import Vue from 'vue';
import { mutate, reset } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  maxSteps: { 1: 7, 2: 10 },
  step: 1,
  stepSendData: {
    1: { 
      letterType: 1, 
      idFinCode: '', 
      idSerialNumber: ''
    },
    2: { 
      idExpiryDate: '',
      birthDate: '', 
      gender: 1
    },
    3: {
      driverLicenseNumber: '',
      driverLicenseGivenDate: '',
      driverLicenseExpiryDate: ''
    },
    4: {
      transportNumber: '',
      transportGivenDate: ''
    },
    5: { 
      idFinCodeB: '', 
      idSerialNumberB: ''
    }
  },
  stepReceivedData: { 
    1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 
    6: {}, 7: {}, 8: {}, 9: {}, 10: {} 
  }
});

export const state = () => getInitialState();

export const getters = {
  currentStep: s => s.step,
  currentRealStep: (s, g) => {
    if (g.maxSteps === 7) {
      if (s.step === 6) return 8;
      if (s.step === 7) return 10;
    }
    return s.step;
  },
  maxSteps: s => s.maxSteps[s.stepSendData['1'].letterType],
  stepSendData: s => s.stepSendData,
  stepReceivedData: s => s.stepReceivedData,
}

export const actions = {
  updateStep({ commit }, step) {
    commit('setStep', { value: step });
  },
  increaseStep({ commit }) {
    commit('setNextStep');
  },
  decreaseStep({ commit }) {
    commit('setPrevStep');
  },
  updateSendData({ commit }, dataRows) {
    if (!(dataRows instanceof Array)) dataRows = [dataRows];
    dataRows.map(row => {
      commit('mutate', { property: 'stepSendData', value: row.value, key: row.step, param: row.param });
    });
  },
  updateReceivedData({ commit }, dataRows) {
    if (!(dataRows instanceof Array)) dataRows = [dataRows];
    dataRows.map(row => {
      commit('mutate', { property: 'stepReceivedData', value: row.value, key: row.step, param: row.param });
    });
  },
  resetSteps({ commit }) {
    commit('reset', ['maxSteps','step','stepSendData','stepReceivedData']);
  }
}

export const mutations = {
  mutate: mutate(),
  reset: reset(getInitialState()),
  
  setStep(state, payload) {
    state.step = payload.value;
  },
  setNextStep(state) {
    if (state.step < state.maxSteps[state.stepSendData['1'].letterType]) {
      state.step++;
    }
  },
  setPrevStep(state) {
    if (state.step > 1) {
      state.step--;
    }
  }
}