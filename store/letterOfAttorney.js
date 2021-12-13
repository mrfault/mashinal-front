import Vue from 'vue';
import { mutate, reset } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  maxSteps: { 1: 7, 2: 10 },
  step: 1,
  stepSendData: {
    letterType: 1, 
    idFinCode: '', 
    idSerialNumber: '',
    idExpiryDate: '',
    birthDate: '', 
    gender: 1,
    driverLicenseNumber: '',
    driverLicenseGivenDate: '',
    driverLicenseExpiryDate: '',
    transportNumber: '',
    transportGivenDate: '',
    idFinCodeB: '', 
    idSerialNumberB: '',
    driverLicenseNumberB: '',
    mobileNotariatConfirm: false,
    letterPermissions: [],
    letterExpiryDate: '',
    region: '',
    senderPhone: '',
    recepientPhone: '',
    letterPermissionsTransfer: false,
    letterConfirmData: false,
    videoFile: ''
  },
  stepReceivedData: {
    senderFullName: '',
    recepientFullName: ''
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
  maxSteps: s => s.maxSteps[s.stepSendData.letterType],
  stepSendData: s => s.stepSendData,
  stepReceivedData: s => s.stepReceivedData,
  hasGeneralPower: s => s.stepSendData.letterType === 2
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
      commit('mutate', { property: 'stepSendData', value: row.value, key: row.key });
    });
  },
  updateReceivedData({ commit }, dataRows) {
    if (!(dataRows instanceof Array)) dataRows = [dataRows];
    dataRows.map(row => {
      commit('mutate', { property: 'stepReceivedData', value: row.value, key: row.key });
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
    if (state.step < state.maxSteps[state.stepSendData.letterType]) {
      state.step++;
    }
  },
  setPrevStep(state) {
    if (state.step > 1) {
      state.step--;
    }
  }
}