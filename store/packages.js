import { mutate } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
   profileType: 'salon',
   // selectedPackage: [],
   packages: [],
   faq: [],
   salonAnnouncements: {}
});

export const state = () => getInitialState();

export const getters = {
   getPackages: s => s.packages,
   // getSelectedPackage: s => s.selectedPackage,
   salonPackages: s => s.packages.filter(p => p.type_id == 1),
   partsPackages: s => s.packages.filter(p => p.type_id == 2),
   profileType: s => s.profileType,
   salonAnnouncements: s => s.salonAnnouncements,
   faq: s => s.faq
}

export const actions = {
   setProfileType({commit}, value) {
      commit('mutate', {property: 'profileType', value});
   },

   async getPackages({commit}) {
      const res = await this.$axios.$get('/packages');
      commit('mutate', {property: 'packages', value: res.data});
   },

   // async getSelectedPackage({commit}, data) {
   //    commit('mutate', {property: 'selectedPackage', value: data});
   // },

   // async buyPackage({commit}, data) {
   //    const res = await this.$axios.$post('/payment/packages', data);
   //    commit('mutate', {property: 'packages', value: res.data});
   // },

   async getFaq({commit}) {
      const res = await this.$axios.$get('/faq');
      commit('mutate', {property: 'faq', value: res});
   },

   async getSalonAnnouncements({commit}) {
      const res = await this.$axios.$get('/my/all-car-announces');
      commit('mutate', {property: 'salonAnnouncements', value: res});
   }
}

export const mutations = {
   mutate: mutate()
}
