import { mutate } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  announcementIds: [],
  announcementsList: [],
  modelsList: [],
  limit: 5,
  filter: {
    compareType: 'announcements',
    showDifferences: false,
    hideEmptyCells: true
  },
  showAddModelPopup: false,
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
  count: s => s.announcementsList.length + s.modelsList.length,
  limit: s => s.limit,
}

export const actions = {
  // Announcements
  getInitialAnnouncements({ dispatch, commit }) {
    const val = this.$cookies.get('comparisonAnnouncements') || []

    commit('mutate', {
      property: 'announcementIds',
      value: val
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

    this.$cookies.set('comparisonAnnouncements', state.announcementIds)
  },
  removeAnnouncement({ dispatch, commit, state }, index) {
    commit('removeAnnouncement', index);
    this.$cookies.set('comparisonAnnouncements', state.announcementIds)
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

  // Models
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
  toggleModel({ dispatch, commit, state }, id) {
    if (state.modelsList.findIndex(m => m.id === id) >= 0) {
      commit('removeModel', id)
    } else {
      dispatch('addModel', id)
    }
  },
  async addModel({ state, commit }, id) {
    const { data } = await this.$axios.get('/catalog/' + id)
    const model = Array.isArray(data) ? data[0] : data
    commit('addModel', model)
    this.$cookies.set('comparisonModels', JSON.stringify(state.modelsList.map(m => m.id)))
  },
  removeModel({ state, commit }, id) {
    commit('removeModel', id);
    this.$cookies.set('comparisonModels', JSON.stringify(state.modelsList.map(m => m.id)))
  },
  async getInitialRecommendation({ commit }) {
    const { data } = await this.$axios.$get(`/comparison/model/recommended/initial`);
    commit('mutate', {
      property: 'recommendedModel',
      value: data
    });
  },
  async updateRecommendation({ commit, state, dispatch }) {
    const skip = state.recommendedModel.catalog_id;
    
    let catalog = null;
    const modelIds = state.modelsList.map(m => m.id)
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
  async selectModel({ dispatch, state, rootState }, catalogId) {
    if (rootState.auth.loggedIn) {
      await this.$axios.$post(`/comparison/model`, { catalog_id: catalogId });
      dispatch('addModel', catalogId)
    } else {
      await this.$axios.$post(`/comparison/model/catalog`, { catalogId });
      dispatch('addModel', catalogId)
      this.$cookies.set('comparisonModels', JSON.stringify(state.modelsList.map(m => m.id)))
    }
  }
}

export const mutations = {
  mutate: mutate(),

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
      if (!state.modelsList.map(m => m.id).includes(payload.id)) {
        state.modelsList.push(payload)
      }
    }
  },
  removeModel(state, id) {
    state.modelsList = state.modelsList.filter(m => m.id !== id)
  },
}

