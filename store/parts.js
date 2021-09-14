import Vue from 'vue';

const getInitialState = () => ({
  announcements: [],
  pagination: {
    current_page: 0,
    last_page: 0,
    total: 0,
    per_page: 0,
  },
  categories: [],
  form: {
    product_code: '',
    title: '',
    description: '',
    category_id: '',
    sub_category_id: '',
    region_id: '',
    brand_id: '',
    is_new: true,
    is_original: true,
    have_delivery: false,
    have_warranty: false,
    price: '',
    is_negotiable: false,
    keywords: []
  }
})

export const state = () => getInitialState()

export const getters = {
  announcements: s => s.announcements,
  pagination: s => s.pagination,
  categories: s => s.categories,
  form: s => s.form,
}

export const actions = {
  async getHomePageData({ commit }) {
    const data = await this.$axios.$post('/part/home_page');
    commit('mutate', {
      property: 'announcements',
      value: data
    })
  },
  async getNextAnnounements({ state, commit }) {
    const data = await this.$axios.$post('/part/home_page');
    commit('mutate', {
      property: 'announcements',
      value: [...state.announcements, ...data]
    })
  },
  async search({ commit }, payload) {
    if (payload.announce_type) {
      payload.is_new = payload.announce_type === 1 ? true : false
    }
    delete payload.announce_type;

    const data = await this.$axios.$post('/part', payload)
    commit('mutate', {
      property: 'announcements',
      value: data.data
    })
    commit('mutate', {
      property: 'pagination',
      value: {
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page,
      }
    })
  },
  async getCategoryAnnouncements({ commit }, payload) {
    const { data } = await this.$axios.$post('/part', payload);

    commit('mutate', {
      property: 'announcements',
      value: data
    })
  },
  async getCategories({ commit }) {
    const categories = await this.$axios.$get('/part/categories');

    commit('mutate', {
      property: 'categories',
      value: categories
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

