const getInitialState = () => ({
  profileType: 'autosalon'
})

export const state = () => getInitialState()

export const getters = {
  profileType: s => s.profileType
}

export const actions = {
  setProfileType({ commit }, value) {
    commit('mutate', {
      property: 'profileType',
      value
    })
  }
}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else state[payload.property] = payload.value;
  },
}