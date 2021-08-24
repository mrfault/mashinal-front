import Vue from 'vue';

const getInitialState = () => ({
  announcementIds: [],
  announcementsList: [],
  modelsList: [],
  limit: 10,
  filter: {
    compareType: 'announcements',
    showDifferences: false,
    hideEmptyCells: false
  },
  showAddModelPopup: false.property,
  brands: [],
  models: [],
  generations: [],
  carTypes: [],
  modifications: [],
  recommendedModel: null
})

export const state = () => getInitialState()

export const getters = {
  announcementIds: s => s.announcementIds,
  announcementsList: s => s.announcementsList,
  modelsList: s => s.modelsList,
  filter: s => s.filter,
  showAddModelPopup: s => s.showAddModelPopup,
  brands: s => s.brands,
  models: s => s.models,
  generations: s => s.generations,
  carTypes: s => s.carTypes,
  modifications: s => s.modifications,
  recommendedModel: s => s.recommendedModel,
}

export const actions = {
  getInitialAnnouncements({ dispatch, commit }) {
    commit('mutate', {
      property: 'announcementIds',
      value: JSON.parse(this.$cookies.get('comparisonAnnouncements') || '[]')
    })
    dispatch('getAnnouncements')
  },
  toggleAnnouncement({ dispatch, commit, state }, id) {
    if (state.announcementIds.includes(id)) {
      commit('removeAnnouncement', id)
    } else {
      commit('addAnnouncement', id)
      dispatch('getAnnouncements')
    }

    this.$cookies.set('comparisonAnnouncements', JSON.stringify(state.announcementIds))
  },
  removeAnnouncement({ dispatch, commit, state }, index) {
    commit('removeAnnouncement', index);
    this.$cookies.set('comparisonAnnouncements', JSON.stringify(state.announcementIds))
    dispatch('getAnnouncements')
  },
  async getAnnouncements({ commit, state }) {
    if (state.announcementIds.length) {
      const { data } = await this.$axios.$post('/comparison/announcements/by_ids', {
        ids: state.announcementIds.map(x => Math.floor((Number(x) / 10)))
      });
      commit('mutate', {
        property: 'announcementsList',
        value: data
      });
    }
  },
  async getInitialRecommendation({ commit }) {
    const { data } = await this.$axios.$get(`/comparison/model/recommended/initial`);
    console.log(data)
    commit('mutate', {
      property: 'recommendedModel',
      value: data
    });
  },
  async updateRecommendation({ commit, state, dispatch }, params) {
    // fix here 
    const skip = state.recommendedModel.catalog_id;
    
    let catalog = null;
    const modelIds = state.modelsList.map(m => m.id || m.catalog_id)
    if (modelIds.length) {
      catalog = modelIds[Math.floor(Math.random() * modelIds.length)];
    } else {
      if (!state.recommendedModel) {
        await dispatch('getInitialRecommendation')
      }
      catalog = state.recommendedModel.catalog_id
    }

    const { data } = await this.$axios.$get(`/comparison/model/${catalog}/recommended?skip=${skip}&comparisons=` + (this.$cookies.get('comparisonModels') ? this.$cookies.get('comparisonModels') : ''));
    commit('mutate', {
      property: 'recommendedModel',
      value: data
    });
  },
  async getBrands({ commit }) {
    const { data } = await this.$axios.$get(`/comparison/model/brands`);
    commit('mutate', {
      property: 'brands',
      value: data
    });

    commit('mutate', { property: 'models', value: [] });
    commit('mutate', { property: 'generations', value: [] });
    commit('mutate', { property: 'carTypes', value: [] });
    commit('mutate', { property: 'modifications', value: [] });
  },
  async getModels({ commit }, brand_id) {
    let { data } = await this.$axios.$get(`/comparison/model/brand/${brand_id}/models`);
    data = data.map((item) => ({
      ...item, name: item.name.replace("серия", this.app.i18n.t('series')).replace('класс',this.app.i18n.t('class'))
    }));
    commit('mutate', {
      property: 'models',
      value: data
    });

    commit('mutate', { property: 'generations', value: [] });
    commit('mutate', { property: 'carTypes', value: [] });
    commit('mutate', { property: 'modifications', value: [] });
  },
  async getGenerations({ commit }, model_id) {
    const { data } = await this.$axios.$get(`/comparison/model/${model_id}/generations`);
    commit('mutate', {
      property: 'generations',
      value: data
    });

    commit('mutate', { property: 'carTypes', value: [] });
    commit('mutate', { property: 'modifications', value: [] });
  },
  async getCarTypes({ commit }, generation_id) {
    const { data } = await this.$axios.$get(`/comparison/generation/${generation_id}/car_types`);
    commit('mutate', {
      property: 'carTypes',
      value: data
    });

    commit('mutate', { property: 'modifications', value: [] });
  },
  async getModifications({ commit }, params) {
    const { data } = await this.$axios.$get(`/comparison/generation/${params.generation_id}/car_type/${params.car_type_id}/modifications`);
    commit('mutate', {
      property: 'modifications',
      value: data
    });
  },
  addModel({ commit }, model) {
    commit('addModel', model)
  },
  removeModel({ commit }, id) {
    commit('removeModel', id);
  },
  async selectModel({ commit, state, rootState }, catalogId) {
    if (rootState.auth.loggedIn) {
      const { data } = await this.$axios.$post(`/comparison/model`, { catalog_id: catalogId });
      commit('addModel', data)
    } else {
      const { data } = await this.$axios.$post(`/comparison/model/catalog`, { catalogId });
      commit('addModel', data)
      this.$cookies.set('comparisonModels', state.modelsList.map(m => m.id || m.catalog_id))
    }
  }

}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else state[payload.property] = payload.value;
  },
  addAnnouncement(state, payload) {
    if (state.announcementsList.length < state.limit) {
      state.announcementIds.push(payload)
    }
  },
  removeAnnouncement(state, id) {
    const index = state.announcementIds.findIndex(x => x === id)
    const listIndex = state.announcementsList.findIndex(x => x.id_unique === id)
    state.announcementIds.splice(index, 1)
    state.announcementsList.splice(listIndex, 1)
  },
  addModel(state, payload) {
    if (state.modelsList.length < state.limit) {
      if (!state.modelsList.map(m => m.id || m.catalog_id).includes(payload.id || payload.catalog_id)) {
        state.modelsList.push(payload)
      }
    }
  },
  removeModel(state, id) {
    const index = state.modelsList.findIndex(x => x.id === id)
    state.modelsList.splice(index, 1)
  },
}

