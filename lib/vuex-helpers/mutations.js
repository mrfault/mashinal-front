import Vue from 'vue';

export const mutate = () => {
  return (state, payload) => {
    if (payload.key !== undefined) {
      if (payload.param !== undefined) {
        Vue.set(state[payload.property][payload.key], payload.param, payload.value);
      } else {
        Vue.set(state[payload.property], payload.key, payload.value);
      }
    } else {
      Vue.set(state, payload.property, payload.value);
    }
  }
};

export const reset = (initialState) => {
  return (state, payload) => {
    payload.map(property => { 
      if (Object.keys(initialState[property] || false).length) {
        for (let key in initialState[property]) {
          if (Object.keys(initialState[property][key] || false).length) {
            for (let key1 in initialState[property][key]) {
              Vue.set(state[property][key], key1, initialState[property][key][key1]);
            }
          } else {
            Vue.set(state[property], key, initialState[property][key]);
          }
        }
      } else {
        Vue.set(state, property, initialState[property]);
      }
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