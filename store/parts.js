import Vue from 'vue';

const getInitialState = () => ({
  announcements: [],
  otherAnnouncements: [],
  pagination: {},
  otherAnnouncementsPagination: {},
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
  otherAnnouncements: s => s.otherAnnouncements,
  pagination: s => s.pagination,
  otherAnnouncementsPagination: s => s.otherAnnouncementsPagination,
  categories: s => s.categories,
  form: s => s.form,
  searchActive: s => s.searchActive,
  showNotFound: s => s.showNotFound,
}

export const actions = {
  async getAnnouncementsReq(store, payload = {}) {
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

    return {
      announcements, pagination
    }
  },
  async getAnnouncements({ dispatch, commit }, payload) {
    const { announcements, pagination } = await dispatch('getAnnouncementsReq', payload)

    commit('mutate', {
      property: 'showNotFound',
      value: pagination.total === 0
    }) 
    commit('mutate', {
      property: 'pagination',
      value: pagination
    }) 
    commit('setAnnouncements', {
      announcements,
      append: pagination.current_page > 1,
      property: "announcements"
    })

    if (pagination.total === 0) {
      await dispatch('getOtherAnnouncements')
    } else {
      commit('mutate', {
        property: 'otherAnnouncementsPagination',
        value: {}
      })
      commit('setAnnouncements', {
        announcements: [],
        property: "otherAnnouncements"
      })
    }
  },
  async getOtherAnnouncements({ dispatch, commit }, payload) {
    const { announcements, pagination } = await dispatch('getAnnouncementsReq', payload)

    commit('mutate', {
      property: 'otherAnnouncementsPagination',
      value: pagination
    })
    commit('setAnnouncements', {
      announcements,
      append: pagination.current_page > 1,
      property: "otherAnnouncements"
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
  }
}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else state[payload.property] = payload.value;
  },

  setAnnouncements(state, payload) {
    const property = payload.property || 'announcements'
    const announcements = [...payload.announcements]
    
    if (payload?.append) {
      state[property] = [...state[property], ...announcements]
    } else {
      state[property] = announcements
    }
  }
}

