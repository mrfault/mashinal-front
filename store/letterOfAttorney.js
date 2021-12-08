import Vue from 'vue';
import { mutate, reset } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  maxSteps: { 1: 10, 2: 7 },
  step: 1,
  stepSendData: {
    1: { 
      letterType: 1, 
      finCode: '', 
      serialNumber: ''
    }
  },
  stepReceivedData: {}
});

export const state = () => getInitialState();

export const getters = {
  currentStep: s => s.step,
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
  updateSendData({ commit }, data) {
    commit('mutate', { property: 'stepSendData', value: data.value, key: data.step, param: data.param });
  },
  updateReceivedData({ commit }, data) {
    commit('mutate', { property: 'stepReceivedData', value: data.value, key: data.step });
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