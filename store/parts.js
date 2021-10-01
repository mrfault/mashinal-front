import Vue from 'vue';

const getInitialState = () => ({
  announcements: [],
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
  announcements: s => s.announcements,
  otherAnnouncements: s => s.otherAnnouncements || [],
  pagination: s => s.pagination,
  categories: s => s.categories,
  form: s => s.form,
  searchActive: s => s.searchActive,
  showNotFound: s => s.showNotFound,
}

export const actions = {
  async getAnnouncements({ commit }, payload = {}) {
    const body = payload.body ? {...payload.body} : {}
    if (body.announce_type) {
      body.is_new = body.announce_type === 1 ? true : false
    }
    delete body.announce_type;

    const config = {
      params: {
        ...(payload.params ? payload.params : {}),
        page: payload?.params?.page || 1
      }
    }

    const { data: announcements, ...pagination} = await this.$axios.$post('/grid/part', body, config);

    commit('mutate', {
      property: 'showNotFound',
      value: !announcements.length
    }) 
    commit('mutate', {
      property: 'pagination',
      value: pagination
    }) 
    commit('setAnnouncements', {
      announcements,
      append: config.params.page > 1
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

  setAnnouncements(state, payload) {
    if (payload?.append) {
      state.announcements = [...state.announcements, ...payload.announcements]
    } else {
      state.announcements = payload.announcements
    }
  }
}

