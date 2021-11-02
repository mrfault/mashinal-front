import Vue from 'vue';

export const mutate = () => {
  return (state, payload) => {
    if (payload.key !== undefined) {
      Vue.set(state[payload.property], payload.key, payload.value);
    } else {
      Vue.set(state, payload.property, payload.value);
    }
  }
};

export const reset = (initialState) => {
  return (state, payload) => {
    payload.map(property => { 
      Vue.set(state, property, initialState[property]);
    });
  }
};

export const removeInArray = () => {
  return (state, payload) => {
    if (payload.where !== undefined) {
      let index = state[payload.property].findIndex(item => item[where.key] === where.value);
      if (index !== -1) Vue.delete(state[payload.property], index);
    } else {
      Vue.delete(state[payload.property], payload.index);
    }
  }
};

export const updateInArray = () => {
  return (state, payload) => {
    if (payload.where !== undefined) {
      let index = state[payload.property].findIndex(item => item[where.key] === where.value);
      if (index !== -1) {
        Vue.set(state[payload.property][index], payload.key, payload.value);
      }
    } else {
      Vue.set(state[payload.property][payload.index], payload.key, payload.value);
    }
  }
};