import Vue from 'vue';

const getInitialState = () => ({
  announcements: {},
  otherAnnouncements: [],
  pagination: {},
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
  },
  searchActive: false,
  showNotFound: false
})

export const state = () => getInitialState()

export const getters = {
  announcements: s => s.announcements.data || [],
  otherAnnouncements: s => s.otherAnnouncements || [],
  pagination: s => {
    const data = {...s.announcements}
    delete data.data
    return data
  },
  categories: s => s.categories,
  form: s => s.form,
  searchActive: s => s.searchActive,
  showNotFound: s => s.showNotFound,
}

export const actions = {
  async getHomePageData({ commit, state }) {
    const data = await this.$axios.$post('/part/home_page');
    commit('mutate', {
      property: 'announcements',
      value: { data }
    })
    commit('mutate', {
      property: 'otherAnnouncements',
      value: data
    })

  },
  async getNextAnnounements({ state, commit }) {
    const data = await this.$axios.$post('/part/home_page');
    if (state.showNotFound) {
      commit('mutate', {
        property: 'otherAnnouncements',
        value: [...state.otherAnnouncements, ...data]
      })
    } else {
      commit('mutate', {
        property: 'announcements',
        key: 'data',
        value: [...state.announcements.data, ...data]
      })
    }
  },
  async search({ commit }, payload) {
    if (payload.announce_type) {
      payload.is_new = payload.announce_type === 1 ? true : false
    }
    delete payload.announce_type;

    const data = await this.$axios.$post('/grid/part?page=' + payload?.page || 1, payload)
    commit('mutate', {
      property: 'showNotFound',
      value: !data.data.length
    }) 
    commit('mutate', {
      property: 'announcements',
      value: data
    })
  },
  async getCategoryAnnouncements({ commit }, payload) {
    const data = await this.$axios.$post('/grid/part', payload);

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
  },
  setSearchActive({ commit }, payload) {
    commit('mutate', {
      property: 'searchActive',
      value: payload
    })
  },
  async getAnnouncementsByNumber({ commit }, phone) {
    const announcements = await this.$axios.$get('/get_announces_by_phone/' + phone);
    commit('mutate', {
      property: 'announcements',
      key: 'data',
      value: announcements
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

