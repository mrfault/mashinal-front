import Vue from 'vue'
import {mutate, reset} from '~/lib/vuex-helpers/mutations'

const getInitialState = () => ({
  single_announce: {},
  sell_saved_items: {
    generation: '',
    engine: '',
    year: '',
    transmissions: '',
    modifications: '',
    gearing: '',
    sell_id: '',
  },
  brands: [],
  boxes: {},
  engines: {},
  generations: [],
  models: [],
  moderator: {},
  modifications: {},
  sellYears: {},
  sell_bodies: [],
  type_of_drives: {},
  //  --------
  getTimer: {
    data: '',
    unix: 0,
  },
  announceId: null,
})

export const state = () => getInitialState()

export const getters = {
  single_announce: (s) => s.single_announce,
  brands: (s) => s.brands,
  boxes: (s) => s.boxes,
  engines: (s) => s.engines,
  generations: (s) => s.generations,
  models: (s) => s.models,
  moderator: (s) => s.moderator,
  modifications: (s) => s.modifications,
  sell_bodies: (s) => s.sell_bodies,
  type_of_drives: (s) => s.type_of_drives,
  sellYears: (s) => s.sellYears,

  getTimer: (s) => s.getTimer,
  announceId: (s) => s.announceId
}

export const actions = {
  async getAnnounce({commit}, id_unique) {
    const data = await this.$axios.$get(`/announce/${id_unique}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async getMyAnnounce({commit}, id) {
    const data = await this.$axios.$get('/edit_announce/' + id)

    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async editMoto({commit}, args) {
    const data = await this.$axios.$get(
      `/moto/edit_announce/${args.id}?type=${args.type}`,
    )
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },

  async editCommercial({commit}, id) {
    const data = await this.$axios.$get(`/commercial/edit_announce/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async getSingleAnnounce({commit}, id) {
    const data = await this.$axios.$get(`/announcement/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async getMotos({commit}) {
    const data = await this.$axios.$get(`/moto/get_all`)
    commit('mutate', {
      property: 'motos',
      with: data,
    })
  },
  async getSingleMotoAnnounce({commit}, id) {
    const data = await this.$axios.$get(`/moto/get_announce/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },

  async getSingleCommercialAnnounce({commit}, id) {
    const data = await this.$axios.$get(`/commercial/get_single_announce/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },

  async getSingleScooterAnnounce({commit}, id) {
    const data = await this.$axios.$get(`/moto/scooter/get_announce/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async getSingleMotoAtvAnnounce({commit}, id) {
    const data = await this.$axios.$get(`/moto/atv/get_announce/${id}`)
    commit('mutate', {
      property: 'single_announce',
      with: data,
    })
  },
  async setSellSavedItems({commit}) {
    commit('sell_saved_items_push', {
      property: 'generation',
      with: this.$cookies.get('sell_generation'),
    })
    commit('sell_saved_items_push', {
      property: 'engine',
      with: this.$cookies.get('sell_engines'),
    })
    commit('sell_saved_items_push', {
      property: 'year',
      with: this.$cookies.get('sell_year'),
    })
    commit('sell_saved_items_push', {
      property: 'model',
      with: this.$cookies.get('sell_model'),
    })
    commit('sell_saved_items_push', {
      property: 'years',
      with: this.$cookies.get('sell_years'),
    })
    commit('sell_saved_items_push', {
      property: 'transmissions',
      with: this.$cookies.get('sell_transmissions'),
    })
    commit('sell_saved_items_push', {
      property: 'modifications',
      with: this.$cookies.get('sell_modifications'),
    })
    commit('sell_saved_items_push', {
      property: 'gearing',
      with: this.$cookies.get('sell_gearing'),
    })

    commit('sell_saved_items_push', {
      property: 'box',
      with: this.$cookies.get('sell_box'),
    })

    commit('sell_saved_items_push', {
      property: 'capacity',
      with: this.$cookies.get('sell_capacity'),
    })

    commit('sell_saved_items_push', {
      property: 'power',
      with: this.$cookies.get('sell_power'),
    })

    commit('sell_saved_items_push', {
      property: 'sell_id',
      with: this.$cookies.get('sell_id'),
    })
  },
  async transferToSupervisor({commit}, params) {
    await this.$axios.$post('/ticket/transfer/car/' + params.id, {
      comment: params.comment,
    })
  },
  async getAnnouncements({commit}, params) {
    await this.$axios.$post('/nova-api/announcements', params)
  },
  async sendModeratorVehicleData({commit},payload){
    await this.$axios.$post(`/ticket/car/${payload.id}`, {data:payload.formData})
  },
}

export const mutations = {
  moderatorMutator(state, payload) {
    state[payload.property] = JSON.parse(JSON.stringify(payload.with));
  },
  changeSingleAnnounce(state, paylaod){
    console.log("pay",paylaod)
    state.single_announce = paylaod
  },
  reset: reset(getInitialState()),
  sell_saved_items_push(state, payload) {
    state.sell_saved_items[payload.property] = payload.with
  },
  changeTimerData(state, payload) {
    state.getTimer = {
      data: payload.data,
      unix: payload.timer
    };
  },
  changeAnnounceId(state, payload){
    state.announceId = payload;

  }

}
