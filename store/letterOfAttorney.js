import Vue from 'vue';
import { mutate, reset } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  step: 1,
  stepSendData: {
    garageId: '',
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
    recepientFullName: '',
    hasDriverLicense: false
  }
});

export const state = () => getInitialState();

export const getters = {
  currentStep: s => s.step,
  currentRealStep: (s, g) => {
    let steps = [1,2,4,5,8,10];
    // check if 6th, 7th and 9th steps are required
    if (g.hasGeneralPower) steps.splice(4,1,6,7,8,9);
    // check if 3rd step is required
    if (g.stepReceivedData.hasDriverLicense) steps.splice(2,0,3);
    return steps[s.step - 1];
  },
  maxSteps: (s, g) => {
    return (g.hasGeneralPower ? 10 : 7) - (g.stepReceivedData.hasDriverLicense ? 0 : 1);
  },
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
    state.step++;
  },
  setPrevStep(state) {
    if (state.step > 1) {
      state.step--;
    }
  }
}