import Vue from 'vue';
import _ from '~/lib/underscore';

const getInitialState = () => ({
  loading: true,
  loadingKey: 1,
  colorMode: 'light',
  breakpoint: null,
  ptk: null,
  menus: [],
  staticPages: [],
  pageRef: '',
  pageRefs: ['',''],
  hideFooter: false,
  // saved search & favorites
  savedSearchList: [],
  singleSavedSearch: {},
  notViewedSavedSearch: [],
  favorites: [],
  favoriteAnnouncements: [],
  notViewedFavorites: 0,
  // messages
  messages: [],
  suggestedMessages: [],
  // services
  services: [],
  actives: [],
  myServices: [],
  myServiceOptions: [],
  myServiceHistory: [],
  myBalanceHistory: [],
  promotion: {
    id: '',
    optionId: '',
    paymentId: 1
  },
  paidStatusData: false,
  // announcements
  myAnnouncements: {},
  myAnnouncement: {},
  mainAnnouncements: {},
  mainPartsAnnouncements: {},
  carsAnnouncements: [],
  motoAnnouncements: [],
  commercialAnnouncements: [],
  promotedAnnouncements: [],
  announcement: {},
  relativeAnnouncements: [],
  // catalog
  catalogTotal: 0,
  catalogItems: {},
  catalogForm: {},
  // brands
  brands: [],
  commercialBrands: [],
  // models
  models: [],
  atvModels: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  motorcycleModels: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  commercialModels: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  scooterModels: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  carModels: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  modelDescription: false,
  // generations
  generations: [],
  generationTypes: [],
  carGenerations: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  carTypeName: {},
  firstGeneration: false,
  firstGenerationEquipments: [],
  modificationsList: [],
  equipmentsList: [],
  // options
  colors: [],
  sellOptions: {},
  allSellOptions: [],
  allSellOptions2: {},
  popularOptions: [],
  bodyOptions: {},
  motoOptions: [],
  complaintOptions: [],
  badges: [],
  needResetOptions: [],
  // commercial
  commercialTypes: [],
  commercialAllOptions: [],
  commercialFilters: [],
  commercialSearchFilters: [],
  // sell
  sellTokens: false,
  sellPhoneEntered: '',
  sellPhoneRegistered: false,
  sellSalonRights: false,
  sellProgress: 5,
  sellYears: [],
  sellBody: [],
  sellGenerations: [],
  sellEngines: [],
  sellGearing: [],
  sellTransmissions: [],
  sellModifications: [],
  sellPreviewData: {},
  // salons
  salonsList: [],
  salonsSearched: [],
  salonsFilters: {},
  salonsSearchFilters: {},
  salonsFiltered: [],
  salonsInBounds: false,
  salonsOnlyOfficial: false,
  salonSingle: {},
  mySalon: {},
  myAnnouncementCalls: {},
  myAnnouncementStats: {},
  myPackageStats: {},
});

export const state = () => (getInitialState());

export const getters = {
  loading: s => s.loading,
  loadingKey: s => s.loadingKey,
  colorMode: s => s.colorMode,
  breakpoint: s => s.breakpoint,
  ptk: s => s.ptk,
  loggedIn: s => s.auth.loggedIn,
  user: s => s.auth.user,
  menus: s => s.menus,
  staticPages: s => s.staticPages,
  pageRefs: s => s.pageRefs,
  pageRef: s => s.pageRef,
  hideFooter: s => s.hideFooter,
  // saved search & favorites
  savedSearchList: s => s.savedSearchList,
  singleSavedSearch: s => s.singleSavedSearch,
  notViewedSavedSearch: s => s.notViewedSavedSearch,
  favorites: s => s.favorites,
  favoriteAnnouncements: s => s.favoriteAnnouncements,
  notViewedFavorites: s => s.notViewedFavorites,
  // profile
  messages: s => s.messages,
  messagesByGroup: s => id => s.messages.find(group => group.id == id),
  messagesByDate: s => id => {
    let messages = s.messages.find(group => group.id == id).messages;
    return _.groupBy(messages, (message) => message.created_at.slice(0,10));
  },
  suggestedMessages: s => s.suggestedMessages,
  countNewMessages: s => s.messages.filter((group) => {
    return group.last_message && !group.last_message.is_read && (group.last_message.sender_id != s.auth.user.id);
  }).length,
  // services
  services: s => s.services,
  actives: s => s.actives,
  myServices: s => s.myServices,
  myServiceOptions: s => s.myServiceOptions,
  myServiceHistory: s => s.myServiceHistory,
  myBalanceHistory: s => s.myBalanceHistory,
  promotion: s => s.promotion,
  paidStatusData: s => s.paidStatusData,
  // announcements
  announcement: s => s.announcement,
  catalog: s => s.announcement.car_catalog,
  carsAnnouncements: s => s.carsAnnouncements,
  motoAnnouncements: s => s.motoAnnouncements,
  commercialAnnouncements: s => s.commercialAnnouncements,
  promotedAnnouncements: s => s.promotedAnnouncements,
  mainAnnouncements: s => s.mainAnnouncements,
  mainPartsAnnouncements: s => s.mainPartsAnnouncements,
  myAnnouncements: s => s.myAnnouncements,
  myAnnouncement: s => s.myAnnouncement,
  relativeAnnouncements: s => s.relativeAnnouncements,
  // catalog
  catalogItems: s => s.catalogItems,
  catalogTotal: s => s.catalogTotal,
  catalogForm: s => s.catalogForm,
  // brands
  brands: s => s.brands,
  commercialBrands: s => s.commercialBrands,
  // models
  models: s => s.models,
  atvModels: s => s.atvModels,
  motorcycleModels: s => s.motorcycleModels,
  commercialModels: s => s.commercialModels,
  scooterModels: s => s.scooterModels,
  carModels: s => s.carModels,
  modelDescription: s => s.modelDescription,
  // generations
  generations: s => s.generations,
  generationTypes: s => s.generationTypes,
  carGenerations: s => s.carGenerations,
  carTypeName: s => s.carTypeName,
  firstGeneration: s => s.firstGeneration,
  firstGenerationEquipments: s => s.firstGenerationEquipments,
  modificationsList: s => s.modificationsList,
  equipmentsList: s => s.equipmentsList,
  // options
  colors: s => s.colors,
  sellOptions: s => s.sellOptions,
  allSellOptions: s => s.allSellOptions,
  allSellOptions2: s => s.allSellOptions2,
  popularOptions: s => s.popularOptions,
  bodyOptions: s => s.bodyOptions,
  motoOptions: s => s.motoOptions,
  complaintOptions: s => s.complaintOptions,
  // commercial
  commercialTypes: s => s.commercialTypes,
  commercialAllOptions: s => s.commercialAllOptions,
  commercialFilters: s => s.commercialFilters,
  commercialSearchFilters: s => s.commercialSearchFilters,
  // sell
  sellTokens: s => s.sellTokens,
  sellPhoneEntered: s => s.sellPhoneEntered,
  sellPhoneRegistered: s => s.sellPhoneRegistered,
  sellSalonRights: s => s.sellSalonRights,
  sellProgress: s => s.sellProgress,
  sellYears: s => s.sellYears,
  sellBody: s => s.sellBody,
  sellGenerations: s => s.sellGenerations,
  sellEngines: s => Object.keys(s.sellEngines).map(key => s.sellEngines[key]),
  sellGearing: s => Object.keys(s.sellGearing).map(key => s.sellGearing[key]),
  sellTransmissions: s => Object.keys(s.sellTransmissions).map(key => s.sellTransmissions[key]),
  sellModifications: s => Object.keys(s.sellModifications).map(key => s.sellModifications[key]),
  sellPreviewData: s => s.sellPreviewData,
  // salons
  salonsList: s => s.salonsList,
  salonsSearched: s => s.salonsSearched,
  salonsFilters: s => s.salonsFilters,
  salonsSearchFilters: s => s.salonsSearchFilters,
  salonsFiltered: s => s.salonsFiltered,
  salonsInBounds: s => s.salonsInBounds,
  salonSingle: s => s.salonSingle,
  mySalon: s => s.mySalon,
  myAnnouncementCalls: s => s.myAnnouncementCalls,
  myAnnouncementStats: s => s.myAnnouncementStats,
  myPackageStats: s => s.myPackageStats
};

const objectNotEmpty = (state, commit, property) => {
  if (state['needResetOptions'].includes(property)) {
    let arr = state['needResetOptions'].filter(p => p !== property);
    commit('mutate', { property: 'needResetOptions', value: arr }); 
    return false;
  }
  return typeof state[property] === 'object' && Object.keys(state[property]).length > 0;
};

export const actions = {
  async nuxtServerInit({ dispatch, commit }) {
    await Promise.all([
      dispatch('getStaticPages')
    ]);

    let ptk = this.$cookies.get('ptk') || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
      .toUpperCase();

    if (!this.$cookies.get('ptk')) {
      this.$cookies.set('ptk', ptk, { maxAge: 60 * 60 * 24 * 7000 });
    }

    commit('mutate', { property:'ptk', value: ptk });
  },
  // Loading
  setLoading({ commit, state }, loading) {
    commit('mutate', { property: 'loading', value: loading })
    if (state.loadingKey < 3) {
      commit('mutate', { property: 'loadingKey', value: state.loadingKey + 1 })
    }
  },
  // Dark/Light theme
  setColorMode({ commit }, theme) {
    commit('mutate', { property: 'colorMode', value: theme });
  },
  // Grid
  setGridBreakpoint({ commit }, breakpoint) {
    commit('mutate', { property: 'breakpoint', value: breakpoint });
  },
  // Footer
  setFooterVisibility({ commit }, show) {
    commit('mutate', { property: 'hideFooter', value: !show });
  },
  // Localization
  async changeLocale({ dispatch }, locale) {
    let changed = locale !== this.$i18n.locale;
    this.$i18n.setLocale(locale);
    // update options in store
    if (changed) dispatch('resetOptions');
  },
  // Pages
  async getMenus({ commit }) {
    const res = await this.$axios.$get('/menus');
    commit('mutate', { property: 'menus', value: res });
  },
  async getStaticPages({ commit }) {
    const res = await this.$axios.$get('/get_static_pages');
    commit('mutate', { property: 'staticPages', value: res });
  },
  setPageRefs({ commit }, {index, path}) {
    commit('mutate', { property: 'pageRefs', key: index, value: path });
  },
  setPageRef({ commit }, path) {
    commit('mutate', { property: 'pageRef', value: path });
  },
  // Messages
  async getMessages({ commit, state }, groupId) {
    const res = await this.$axios.$get('/profile/messages');
    let messages = [];
    if (groupId) {
      messages = await this.$axios.$get('/profile/group/'+ groupId +'/messages');
    }
    
    commit('mutate', { property: 'messages', value: res });
    commit('appendMessagesToGroup', { setAllEmpty: true });
    
    if (groupId && messages.length) {
      let groupIndex = state.messages.findIndex(group => group.id == groupId);

      if (groupIndex !== -1){
        if (!state.messages[groupIndex].messages_loaded){
          commit('appendMessagesToGroup', { groupIndex, messages });
        }
      }
    }
  },
  async getGroupMessages({ commit, state }, groupId) {
    let groupIndex = state.messages.findIndex(group => group.id == groupId);

    if (groupIndex !== -1){
      if (!state.messages[groupIndex].messages_loaded){
        const messages = await this.$axios.$get('/profile/group/'+ groupId +'/messages');
        commit('appendMessagesToGroup', { groupIndex, messages });
      }
    }
  },
  async getSuggestedMessages({ commit, state }) {
    if (objectNotEmpty(state, commit, 'suggestedMessages')) return;
    const res = await this.$axios.$get('/profile/suggestedMessages');
    commit('mutate', { property: 'suggestedMessages', value: res })
  },
  async sendMessage({ commit }, data) {
    const res = await this.$axios.$post('/profile/messages', data.form);
    commit('appendToMessage', { group: data.activeGroup, message: res });
  },
  async createMessagesGroup({ commit }, data) {
    const res = await this.$axios.$post('/profile/messages/'+ data.recipientId, { id_unique: data.announceId });
    commit('appendMessageToGroup', { group: res });
    return res;
  },
  async removeMessageGroup({ commit }, id) {
    await this.$axios.$get('/profile/messages/'+ id +'/remove');
    commit('removeGroup', { groupId: id });
  },
  markAsRead({ commit }, id) {
    this.$axios.$get('/profile/messages/'+ id +'/read');
    commit('markAsRead', { groupId: id });
  },
  async blockUser({}, data) {
    await this.$axios.$post('/profile/messages/'+ data.id +'/block');
  },
  // Favorites
  async getFavorites({ commit }) {
    const res = await this.$axios.$get('/announce/favorites');
    commit('mutate', { property: 'favorites', value: res });
  },
  async addToFavorites({ commit }, id) {
    commit('addToFavorites', { id });
    await this.$axios.$post(`/announce/${id}/favorite`);
  },
  async getFavoriteAnnouncements({ commit }, data = {}) {
    const res = await this.$axios.$get(`/my/saved/all-announce?page=${data.page || 1}`);
    commit('mutate', { property: 'favoriteAnnouncements', value: res });
  },
  async getNotViewedFavorites({ commit }) {
    const res = await this.$axios.$get(`/announce/saved/not-viewed-count`);
    commit('mutate', { property: 'notViewedFavorites', value: res.data });
  },
  async markViewedFavorites({ commit }) {
    const res = await this.$axios.$get(`/announce/saved/mark-viewed`);
    commit('mutate', { property: 'notViewedFavorites', value: res.data });
  },
  // Saved search
  async getSavedSearch({ commit }){
    const res = await this.$axios.$get('/saved-search');
    commit('mutate', { property: 'savedSearchList', value: res });
  },
  async createSavedSearch({ commit }, data){
    const res = await this.$axios.$post('/saved-search', data);
    commit('mutate', { property: 'singleSavedSearch', value: res });
  },
  async fetchSavedSearch({ commit }, data){
    const res = await this.$axios.$post('/one-saved-search', data);
    commit('mutate', { property: 'singleSavedSearch', value: res || {} });
  },
  async deleteSavedSearch({ commit, state }, id){
    await this.$axios.$delete(`/saved-search/${id}`);
    const list = state.savedSearchList.filter(search => search.id !== id);
    commit('mutate', { property: 'savedSearchList', value: list });
    commit('mutate', { property: 'singleSavedSearch', value: {} });
  },
  async deleteSavedSearchMultiple({ commit, state }, data){
    await this.$axios.$post(`/saved-search/delete_all`, data);
    const list = state.savedSearchList.filter(search => !data.ids.includes(search.id));
    commit('mutate', { property: 'savedSearchList', value: list });
    commit('mutate', { property: 'singleSavedSearch', value: {} });
  },
  async updateSavedSearchNotificationsInterval({ commit, state }, data){
    await this.$axios.$post('/saved-search-notification-interval', data);
    const list = state.savedSearchList.map(search => !data.id.includes(search.id) ? search : ({...search, notification_interval: data.type }));
    commit('mutate', { property: 'savedSearchList', value: list });
    commit('mutate', { property: 'singleSavedSearch', key: 'notification_interval', value: data.type });
  },
  clearSavedSearch({ commit }){
    commit('mutate', { property: 'singleSavedSearch', value: {} });
  },
  async getNotViewedSavedSearch({ commit }) {
    const res = await this.$axios.$get(`/saved-search/not-viewed-count`);
    commit('mutate', { property: 'notViewedSavedSearch', value: res.data });
  },
  async markViewedSavedSearch({ commit }) {
    const res = await this.$axios.$get(`/saved-search/mark-viewed`);
    commit('mutate', { property: 'notViewedSavedSearch', value: res.data });
  },
  // Services
  async getMyActives({ commit }) {
    const res = await this.$axios.$get(`/my/actives`);
    commit('mutate', { property: 'actives', value: res });
  },
  // Brands
  async getBrands({ commit, state }) {
    if (objectNotEmpty(state, commit, 'brands')) return;
    const res = await this.$axios.$get('/brands');
    commit('mutate', { property: 'brands', value: res });
  },
  async getCommercialBrands({ commit }, category) {
    const res = await this.$axios.$get(`/commercial/get_brands/${category}`);
    commit('mutate', { property: 'commercialBrands', value: res });
  },
  // Models
  async getModels({ commit }, name) {
    const res = await this.$axios.$get(`/brand/${name}/models`);
    commit('mutate', { property:'models', value: res });
  },
  async getCommercialModels({ commit }, data) {
    const res = await this.$axios.$get(`/commercial/type/${data.category}/brand/${data.id}/models`);
    commit('mutate', { property: 'commercialModels', value: res, key: data.index || 0 })
  },
  async getMotoModels({ dispatch }, data) {
    if (data.category == 1)  
      await dispatch('getMotorcycleModels', { id: data.id, index: data.index || 0 });
    else if (data.category == 2)  
      await dispatch('getScooterModels', { id: data.id, index: data.index || 0 });
    else if (data.category == 3)  
      await dispatch('getAtvModels', { id: data.id, index: data.index || 0 });
  },
  async getMotorcycleModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/brand/${data.id}/models`);
    commit('mutate', { property: 'motorcycleModels', value: res, key: data.index || 0 });
  },
  async getAtvModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/atv/brand/${data.id}/models`);
    commit('mutate', { property: 'atvModels', value: res, key: data.index || 0 });
  },
  async getScooterModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/scooter/brand/${data.id}/models`);
    commit('mutate', { property: 'scooterModels', value: res, key: data.index || 0 });
  },
  // Generations
  async getGenerations({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generations`);
    commit('mutate', { property: 'generations', value: res.generations });
    commit('mutate', { property: 'modelDescription', value: res.model.description });
  },
  async getFirstGeneration({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}`);
    commit('mutate', { property: 'firstGeneration', value: res });
  },
  async getModelGenerations({ commit }, slug) {
    const res = await this.$axios.$get(`/model/${slug}/generations`);
    commit('mutate', { property: 'generations', value: res.generations });
  },
  async getModelsArray({ commit }, data) {
    const res = data.value ? await this.$axios.$get(`/brand/${data.value}/models`) : [];
    commit('mutate', { property: 'carModels', value: res || [], key: data.index })
  },
  async getModelGenerationsArray({ commit }, data) {
    const res = data.value ? await this.$axios.$get(`/brand/${data.brand_slug}/model/${data.value}/generations`) : [];
    commit('mutate', { property: 'carGenerations', value: res.generations || [], key: data.index })
  },
  async getGenerationTypes({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_types`);
    commit('mutate', { property: 'generationTypes', value: res });
  },
  async getCarTypeName({ commit }, id) {
    const res = await this.$axios.$get(`/car_type_id/${id}`);
    commit('mutate', { property: 'carTypeName', value: res });
  },
  // Body
  async getBody({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/body/${data.body}`);
    commit('mutate', { property: 'firstGeneration', value: res });
  },
  async getModificationsList({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_type/${data.body}`);
    commit('mutate', { property: 'modificationsList', value: res });
  },
  async getBodyModification({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/body/${data.body}${data.modification ? `/catalog/${data.modification}` : ''}`);
    commit('mutate', { property: 'firstGeneration', value: res });
  },
  async getEquipmentsList({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_type/${data.body}/equipments`);
    commit('mutate', { property: 'equipmentsList', value: res });
  },
  async getBodyEquipments({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.brand}/model/${data.model}/generation/${data.generation}/body/${data.body}/catalog/${data.equipment}/equipments`);
    commit('mutate', { property: 'firstGenerationEquipments',  value: res });
  },
  // Options
  async getOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'sellOptions')) return;
    const res = await this.$axios.$get('/config/get_options');
    commit('mutate', { property: 'sellOptions', value: res });
  },
  async getAllOtherOptions({ state, commit }, suffix = '') {
    if (objectNotEmpty(state, commit, 'allSellOptions' + suffix)) return;
    const res = await this.$axios.$get('/config/get_all_options' + suffix);
    commit('mutate', { property: 'allSellOptions' + suffix, value: res });
  },
  async getPopularOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'popularOptions')) return;
    const res = await this.$axios.$get('/config/get_popular_options');
    commit('mutate', { property: 'popularOptions', value: res });
  },
  async getBodyOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'bodyOptions')) return;
    const res = await this.$axios.$get('/get_body_options');
    commit('mutate', { property: 'bodyOptions', value: res });
  },
  async getMotoOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'motoOptions')) return;
    const res = await this.$axios.$get(`/moto/search_options`);
    commit('mutate', { property: 'motoOptions', value: res });
  },
  async getColors({ state, commit }) {
    if (objectNotEmpty(state, commit, 'colors')) return;
    const res = await this.$axios.$get(`/config/get_colors?formatted=false`);
    commit('mutate', { property: 'colors', value: res });
  },
  async getComplaintOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'complaintOptions')) return;
    const res = await this.$axios.$get(`/complaint-options`);
    commit('mutate', { property: 'complaintOptions', value: res.data });
  },
  async getBadges({ state, commit }) {
    if (objectNotEmpty(state, commit, 'badges')) return;
    const res = await this.$axios.$get(`/additional/get_badges`);
    commit('mutate', { property: 'badges', value: res });
  },
  // Commercial Options
  async getCommercialAllOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'commercialAllOptions')) return;
    const res = await this.$axios.$get(`/commercial/get_all_options`);
    commit('mutate', { property: 'commercialAllOptions', value: res });
  },
  async getCommercialFilters({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/type/${id}/get_filters`);
    commit('mutate', { property: 'commercialFilters', value: res });
  },
  async getCommercialSearchFilters({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/type/${id}/get_search_filters`);
    commit('mutate', { property: 'commercialSearchFilters', value: res });
  },
  async getCommercialTypes({ state, commit }) {
    if (objectNotEmpty(state, commit, 'commercialTypes')) return;
    const res = await this.$axios.$get('/commercial/all_types');
    commit('mutate', { property: 'commercialTypes', value: res });
  },
  // Reset Options
  resetOptions({ state, commit }, property = false) {
    let arr = [
      'sellOptions','allSellOptions2','bodyOptions',
      'colors','complaintOptions','badges','brands','popularOptions','allSellOptions',
      'motoOptions','commercialAllOptions','commercialTypes',
      'suggestedMessages','messages'
    ];
    if (property) {
      arr = state['needResetOptions'].filter(p => p !== property);
      commit('mutate', { property: 'needResetOptions', value: arr });
    } else {
      commit('mutate', { property: 'needResetOptions', value: arr });
    }
  },
  // Search
  async getInfiniteMainSearch({ commit }, data = {}) {
    const res = await this.$axios.$get(`/grid/home_page_all?page=${data.page || 1}`);
    commit('mutate', { property: 'mainAnnouncements', value: res });
  },
  async getInfiniteMainPartsSearch({ commit }, data = {}) {
    const res = await this.$axios.$get(`/grid/home_page_parts?per_page=4&page=${data.page || 1}`);
    commit('mutate', { property: 'mainPartsAnnouncements', value: res });
  },
  async getMainSearch({ commit }, data) {
    const res = await this.$axios.$get(data.url);
    commit('mutate', { property: 'mainAnnouncements', value: res });
  },
  async getGridSearch({ commit }, data) {
    const res = await this.$axios.$post(`${data.url}?page=${data.page || 1}`, data.post);
    commit('mutate', { property: data.prefix + 'Announcements', value: res });
  },
  async getPromotedSearch({ commit }, data) {
    const res = await this.$axios.$get(`/${data.type}/cars?page=${data.page || 1}`);
    commit('mutate', { property: 'promotedAnnouncements', value: res });
  },
  // Announcements
  async getRelativeAnnouncements({ commit }, id) {
    const res = await this.$axios.$get(`/grid/same/announcements/${id}`);
    commit('mutate', { property: 'relativeAnnouncements', value: res });
  },
  async getMyAllAnnouncements({ commit }, data = {}) {
    const res = await this.$axios.$get(`/my/all-announce-paginated?page=${data.page || 1}${[0,1,2,3].includes(data.status) ? `&status=${data.status}` : ''}`);
    commit('mutate', { property: 'myAnnouncements', value: res });
  },
  async getAnnouncementInner({ commit }, id) {
    const res = await this.$axios.$get(`/announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/announcement/edit/${id}`);
    commit('mutate', { property: 'myAnnouncement', value: res });
  },
  async deleteMyAnnounement({ commit }, id) {
    await this.$axios.$delete(`/announcement/${id}/delete`);
    commit('mutate', { property: 'myAnnouncement', value: {} });
  },
  // Car announcements
  async getCarAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/announcement/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyCarAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/edit_announce/${id}`);
    commit('mutate', { property: 'myAnnouncement', value: res });
  },
  // Commercial Announcements
  async getCommercialAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/commercial/get_single_announce/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyCommercialAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/edit_announce/${id}`);
    commit('mutate', { property: 'myAnnouncement', value: res });
  },
  // Moto Announcements
  async getMotoAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`${data.path}/get_announce/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyMotoAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/moto/edit_announce/${data.id}?type=${data.type}`);
    commit('mutate', { property: 'myAnnouncement', value: res });
  },
  // Catalog
  async getCatalogSearch({commit}, data) {
    if (data.params.brand) data.params.name = data.params.brand;
    if (data.params.generation) data.params.generation = 'g_' + data.params.generation;
    if (data.params.body) data.params.body = 'body_' + data.params.body;

    let filteredData = {};
    for (let key in data.post) {
      if (['kolichestvo-mest','privod','tip-dvigatelya','korobka','body'].includes(key)) {
        filteredData[key] = { key, value: data.post[key] };
      } else if (key.includes('max_')) {
        let rangeKey = key.replace('max_', '');
        filteredData[rangeKey] = `${data.post['min_'+rangeKey] || 0}-${data.post['max_'+rangeKey] || 0}`;
      } else if (key.includes('min_')) {
        continue;
      } else {
        filteredData[key] = data.post[key];
      }
    }

    const res = await this.$axios.$post(`/search_catalog?page=${data.page || 1}`, { filteredData, params: data.params });
    if (!data.totalCount) commit('mutate', { property: 'catalogItems', value: res.items });
    if (data.totalCount !== false) commit('mutate', { property: 'catalogTotal', value: res.total });
  },
  // Sell
  async checkSellTokens({ commit }, phone) {
    const res = await this.$axios.$post('/check/user/by/phone', { phone });
    commit('mutate', { property: 'sellTokens', value: res.data && { transport: res.data.announce_count, parts: res.data.part_announce_count } });
    commit('mutate', { property: 'sellPhoneRegistered', value: res.data && res.data.have_account });
    commit('mutate', { property: 'sellSalonRights', value: res.data && res.data.is_autosalon });
  },
  resetSellTokens({ commit }) {
    commit('mutate', { property: 'sellTokens', value: false });
    commit('mutate', { property: 'sellPhoneRegistered', value: false });
    commit('mutate', { property: 'sellSalonRights', value: false });
    commit('mutate', { property: 'sellPhoneEntered', value: '' });
  },
  setSellProgress({ commit }, value) {
    commit('mutate', { property: 'sellProgress', value });
  },
  setSellPreviewData({ commit }, {value, key}) {
    commit('mutate', { property: 'sellPreviewData', value, key });
  },
  // Sell Options
  async getSellYears({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/get_years`);
    commit('mutate', { property: 'sellYears', value: res });
  },
  async getSellBody({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/year/${data.year}`);
    commit('mutate', { property: 'sellBody', value: res });
  },
  async getSellGenerations({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/year/${data.year}/body/${data.body}/generations`);
    commit('mutate', { property: 'sellGenerations', value: res });
  },
  async getSellEngines({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/year/${data.year}/body/${data.body}/generation/${data.generation}/engines`);
    commit('mutate', { property: 'sellEngines', value: res });
  },
  async getSellGearing({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing`);
    commit('mutate', { property: 'sellGearing', value: res });
  },
  async getSellTransmissions({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing/${data.gearing}/transmissions`);
    commit('mutate', { property: 'sellTransmissions', value: res });
  },
  async getSellModifications({ commit }, data) {
    const res = await this.$axios.$get(`/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing/${data.gearing}/trns/${data.transmission}/modifications`);
    commit('mutate', { property: 'sellModifications', value: res });
  },
  // Services
  async getServices({ commit }) {
    const res = await this.$axios.$get(`/marketing/getServices`);
    commit('mutate', { property: 'services', value: res });
  },
  async getMyServices({ commit }) {
    const res = await this.$axios.$get(`/my/actives`);
    commit('mutate', { property: 'myServices', value: res });
  },
  async getMyServiceOptions({ commit }, type) {
    const res = await this.$axios.$get(`/my/actives/${type}`);
    commit('mutate', { property: 'myServiceOptions', value: res });
  },
  async getMyServiceHistory({ commit }) {
    const res = await this.$axios.$get(`/my/actives/history`);
    commit('mutate', { property: 'myServiceHistory', value: res });
  },
  async getMyBalanceHistory({ commit }, data = {}) {
    const res = await this.$axios.$get(`/payment/getHistory?page=${data.page || 1}`);
    commit('mutate', { property: 'myBalanceHistory', value: res });
  },
  async updatePromotion({ commit }, {key, value}) {
    commit('mutate', { property: 'promotion', key, value });
  },
  async updatePaidStatus({ commit }, value) {
    commit('mutate', { property: 'paidStatusData', value });
  },
  // Salons
  async getSalonsList({commit}, params = '') {
    const res = await this.$axios.$get('/auto_salon_list' + params);
    if (!params || params === '?part=true') {
      commit('mutate', { property: 'salonsList', value: res });
    }
    commit('mutate', { property: 'salonsSearched', value: res });
    commit('mutate', { property: 'salonsFiltered', value: res });
  },
  async getSalonById({commit}, data) {
    const res = await this.$axios.$get('/auto_salon/' + data.id + '?page=' + (data.page || 1));
    commit('mutate', { property: 'salonSingle', value: res });
  },
  async getMySalon({commit}) {
    const res = await this.$axios.$get('/my/autosalon/edit');
    commit('mutate', { property: 'mySalon', value: res });
  },
  async updateMySalon({commit}, form) {
    const res = await this.$axios.$post('/my/autosalon/edit', form);
    commit('mutate', { property: 'mySalon', value: res });
  },
  updateSalonsFilters({commit}, form) {
    commit('mutate', { property: 'salonsFilters', value: form });
  },
  updateSalonsSearchFilters({commit}, form) {
    commit('mutate', { property: 'salonsSearchFilters', value: form });
  },
  async getAnnouncementCalls({commit}, data = {}) {
    const res = await this.$axios.$get(`/my/call-announces?page=${data.page || 1}`);
    commit('mutate', { property: 'myAnnouncementCalls', value: res });
  },
  async incrementAnnouncementCalls({}, id) {
    await this.$axios.$get(`/announce/${id}/show/phone`);
  },
  async getAnnouncementStats({commit}) {
    const res = await this.$axios.$get('/my/dashboard/statistics');
    commit('mutate', { property: 'myAnnouncementStats', value: res });
  },
  async getPackageStats({commit}) {
    const res = await this.$axios.$get('/my/dashboard/package');
    commit('mutate', { property: 'myPackageStats', value: res });
  },
  updateSalonsFiltered({commit}, list) {
    commit('mutate', { property: 'salonsFiltered', value: list });
  },
  updateSalonsInBounds({commit}, list) {
    commit('mutate', { property: 'salonsInBounds', value: list });
  },
  // Reset Data on Logout
  resetUserData({ commit }) {
    commit('reset', ['myServices','myServiceHistory','myServiceOptions','messages','notViewedFavorites','notViewedSavedSearch']);
  }
}

export const mutations = {
  mutate(state, payload) {
    if (payload.key !== undefined) 
      Vue.set(state[payload.property], payload.key, payload.value);
    else Vue.set(state, payload.property, payload.value);
  },
  reset(state, payload) {
    const initialState = getInitialState();
    payload.map(property => { 
      Vue.set(state, property, initialState[property]);
    });
  },
  removeItem(state, payload) {
    Vue.set(state, payload.property, state[payload.property].filter(item => {
      return item[payload.key] !== payload.value;
    }));
  },

  // messages
  appendToMessage(state, payload) {
    let groupIndex = state.messages.findIndex(group => group.id == payload.group.id);

    if (groupIndex === -1){
      payload.group.messages = [];
      state.messages.unshift(payload.group);
      groupIndex = 0;
    }

    state.messages[groupIndex] = {
      ...state.messages[groupIndex],
      is_read: false,
      messages: [...state.messages[groupIndex].messages, payload.message],
      last_message: payload.message
    }
    
    let group = state.messages[groupIndex];
    let isChatBot = group.sender_id == 3;
    state.messages.splice(groupIndex, 1);
    state.messages.splice(isChatBot ? 0 : 1, 0, group);
  },
  appendMessageToGroup(state, payload) {
    let groupIndex = state.messages.findIndex(group => group.id == payload.group.id);

    if (groupIndex === -1){
      payload.group.messages = [];
      state.messages.unshift(payload.group);
      groupIndex = 0;
    }
  },
  appendMessagesToGroup(state, payload) {
    if (payload.setAllEmpty) {
      state.messages.map( (item) => {
        item.messages_loaded = false;
        item.messages = [];
      });
      return;
    }
    state.messages[payload.groupIndex].messages_loaded = true;
    state.messages[payload.groupIndex].messages = payload.messages;
  },
  markAsRead(state, payload) {
    let groupIndex = state.messages.findIndex(group => group.id == payload.groupId);

    state.messages[groupIndex].is_read = true;
    
    if (state.messages[groupIndex].last_message) {
      state.messages[groupIndex].last_message.is_read = true;
    }
  },
  removeGroup(state, payload) {
    let groupIndex = state.messages.findIndex(group => group.id == payload.groupId);

    if (groupIndex !== -1){
      state.messages.splice(groupIndex, 1);
    }
  },
  // favorites
  addToFavorites(state, payload) {
    let index = state.favorites.indexOf(payload.id);
    // let announcementIndex = state.favoriteAnnouncements.data
    //   .findIndex(announcement => announcement.id_unique === payload.id);
    if (index >= 0) {
      state.favorites.splice(index,1);
    } else {
      state.favorites.push(payload.id);
    }
  }
}