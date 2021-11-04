import Vue from 'vue';

export const mutate = () => {
  return (state, payload) => {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else Vue.set(state, payload.property, payload.value);
  }
};

export const reset = (initialState) => {
  return (state, payload) => {
    payload.map(property => { 
      Vue.set(state, property, initialState[property]);
    });
  }
};