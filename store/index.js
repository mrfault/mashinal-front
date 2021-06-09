const getInitialState = () =>({
  loading: true,
  colorMode: 'light',
  breakpoint: null,
  uiScale: 1,
  menus: [],
  staticPages: [],
  // axios cancellation
  CancelToken: null,
  cancel: null,
  // saved search & favorites
  savedSearchList: [],
  singleSavedSearch: {},
  favorites: [],
  // messages
  messages: [],
  suggestedMessages: [],
  // services
  services: [],
  actives: [],
  myServices: [],
  myServiceOptions: [],
  myServiceHistory: [],
  promotion: {
    id: '',
    optionId: '',
    paymentId: 1
  },
  paidStatusData: false,
  // announcements
  myAnnouncements: {},
  mainAnnouncements: {},
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
  specificationsList: [],
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
  sellAutosalonRights: false,
  sellProgress: 5,
  sellYears: [],
  sellBody: [],
  sellGenerations: [],
  sellEngines: [],
  sellGearing: [],
  sellTransmissions: [],
  sellModifications: [],
  // autosalons
  autosalonsList: [],
  autosalonsInBounds: false,
  autosalonsSelected: [],
  autosalonsOnlyOfficial: false,
  autosalonSingle: {},
  myAutosalon: {},
  myAnnouncementCalls: {},
  myAnnouncementStats: {},
  myPackageStats: {},
});

export const state = () => (getInitialState());

export const getters = {
  loading: s => s.loading,
  colorMode: s => s.colorMode,
  uiScale: s => s.uiScale,
  breakpoint: s => s.breakpoint,
  loggedIn: s => s.auth.loggedIn,
  user: s => s.auth.user,
  menus: s => s.menus,
  staticPages: s => s.staticPages,
  // saved search & favorites
  savedSearchList: s => s.favoritesSearchList,
  singleSavedSearch: s => s.singleSavedSearch,
  favorites: s => s.favorites,
  // profile
  messages: s => s.messages,
  suggestedMessages: s => s.suggestedMessages,
  // services
  services: s => s.services,
  actives: s => s.actives,
  myServices: s => s.myServices,
  myServiceOptions: s => s.myServiceOptions,
  myServiceHistory: s => s.myServiceHistory,
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
  myAnnouncements: s => s.myAnnouncements,
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
  // generations
  generations: s => s.generations,
  generationTypes: s => s.generationTypes,
  carGenerations: s => s.carGenerations,
  carTypeName: s => s.carTypeName,
  firstGeneration: s => s.firstGeneration,
  firstGenerationEquipments: s => s.firstGenerationEquipments,
  specificationsList: s => s.specificationsList,
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
  sellAutosalonRights: s => s.sellAutosalonRights,
  sellProgress: s => s.sellProgress,
  sellYears: s => s.sellYears,
  sellBody: s => s.sellBody,
  sellGenerations: s => s.sellGenerations,
  sellEngines: s => Object.keys(s.sellEngines).map(key => s.sellEngines[key]),
  sellGearing: s => Object.keys(s.sellGearing).map(key => s.sellGearing[key]),
  sellTransmissions: s => Object.keys(s.sellTransmissions).map(key => s.sellTransmissions[key]),
  sellModifications: s => Object.keys(s.sellModifications).map(key => s.sellModifications[key]),
  // autosalons
  autosalonsList: s => s.autosalonsList,
  autosalonsInBounds: s => s.autosalonsInBounds,
  autosalonsSelected: s => s.autosalonsSelected,
  autosalonSingle: s => s.autosalonSingle,
  myAutosalon: s => s.myAutosalon,
  myAnnouncementCalls: s => s.myAnnouncementCalls,
  myAnnouncementStats: s => s.myAnnouncementStats,
  myPackageStats: s => s.myPackageStats
};

const objectNotEmpty = (state, commit, property) => {
  if(state['needResetOptions'].includes(property)) {
    let arr = state['needResetOptions'].filter(p => p !== property);
    commit('mutate', { property: 'needResetOptions', value: arr }); 
    return false;
  }
  return typeof state[property] === 'object' && Object.keys(state[property]).length > 0;
};

export const actions = {
  async nuxtServerInit({ dispatch }, { route, app }) {
    await Promise.all([
      dispatch('getStaticPages')
    ]);
    if(['true','false'].includes(route.query.success)) {
      let type = route.query.success === 'true' ? 'success' : 'error';
      dispatch('updatePaidStatus', {
        type,
        title: app.i18n.t(`${type}_payment`),
        text: app.i18n.t(`${type}_payment_msg`)
      });
    }
  },
  // Loading
  setLoading({ commit }, loading) {
    commit('mutate', { property: 'loading', value: loading })
  },
  // Dark/Light theme
  setColorMode({ commit }, theme) {
    commit('mutate', { property: 'colorMode', value: theme });
  },
  // Grid
  setGridBreakpoint({ commit }, breakpoint) {
    commit('mutate', { property: 'breakpoint', value: breakpoint });
  },
  // Localization
  async changeLocale({ dispatch }, locale) {
    let changed = locale !== this.$i18n.locale;
    this.$i18n.setLocale(locale);
    // update options in store
    if(changed) dispatch('resetOptions');
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
  // Messages
  async getMessages({ commit }) {
    const res = await this.$axios.$get('/profile/messages');
    commit('mutate', { property: 'messages', value: res });
    commit('appendMessagesToGroup', { setAllEmpty: true });
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
  async getSuggestedMessages({ commit }) {
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
  markAsRead({ commit, state }, data) {
    this.$axios.$get('/profile/messages/'+state.messages[data.groupIndex].id+'/read');
    commit('markAsRead', { groupIndex: data.groupIndex });
  },
  async blockUser({}, data) {
    await this.$axios.$post('/profile/messages/'+ data.id +'/block');
  },
  // Payments
  async getTransactions({ commit }, data) {
    const res = await this.$axios.$get(`/payment/getHistory?page=${data.page || 1}`);
    commit('mutate', { property: 'transactions', value: res });
  },
  // Favorites
  async getFavorites({ commit }) {
    const res = await this.$axios.$get('/announce/favorites');
    commit('mutate', { property: 'favorites', value: res });
  },
  async addToFavorites({ commit }, id) {
    this.$axios.$post(`/announce/${id}/favorite`);
    commit('addToFavorites', { id });
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
    const rest_search = state.favoritesSearchList.filter(search => search.id !== id);
    commit('mutate', { property: 'savedSearchList', value: rest_search });
    commit('mutate', { property: 'singleSavedSearch', value: {} });
  },
  async updateSavedSearchNotificationsInterval({ commit }, data){
    const res = await this.$axios.$post('/saved-search-notification-interval', data);
    commit('mutate', { property: 'singleSavedSearch', key: 'notification_interval', value: data.type });
  },
  clearSavedSearch({ commit }){
    commit('mutate', { property: 'singleSavedSearch', value: {} });
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
    if(data.category == 1)  
      await dispatch('getMotorcycleModels', { id: data.id, index: data.index || 0 });
    else if(data.category == 2)  
      await dispatch('getScooterModels', { id: data.id, index: data.index || 0 });
    else if(data.category == 3)  
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
    const res = await this.$axios.$get(`/brand/${data.params.name}/model/${data.params.model}/generations`);
    commit('mutate', { property: 'generations', value: res.generations });
    commit('mutate', { property: 'modelDescription', value: res.model.description });
    if (!data.onlyGeneration) commit('mutate', { property: 'firstGeneration', value: res.firstGeneration });
  },
  async getFirstGeneration({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}`);
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
  async getGenerationTypes({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_types`);
    commit('mutate', { property: 'generationTypes', value: res });
  },
  async getCarTypeName({ commit }, id) {
    const res = await this.$axios.$get(`/car_type_id/${id}`);
    commit('mutate', { property: 'carTypeName', value: res });
  },
  // Body
  async getBody({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}`);
    commit('mutate', { property: 'firstGeneration', value: res });
  },
  async getSpecificationsList({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_type/${params.body}`);
    commit('mutate', { property: 'specificationsList', value: res });
  },
  async getEquipmentsList({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_type/${params.body}/equipments`);
    commit('mutate', { property: 'equipmentsList', value: res });
  },
  async getCatalogSpecifications({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}/catalog/${params.specification || params.equipment}`);
    commit('mutate', { property: 'firstGeneration', value: res });
  },
  async getCatalogEquipments({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}/catalog/${params.equipment}/equipments`);
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
      'motoOptions','commercialAllOptions','commercialTypes'
    ];
    if (property) {
      arr = state['needResetOptions'].filter(p => p !== property);
      commit('mutate', { property: 'needResetOptions', value: arr });
    } else {
      commit('mutate', { property: 'needResetOptions', value: arr });
    }
  },
  // Search
  async getMainSearch({ commit }, data) {
    const res = await this.$axios.$get(data.url);
    commit('mutate', { property: 'mainAnnouncements', value: res });
  },
  async getGridSearch({ commit }, data) {
    const url = data.url, prefix = data.prefix;
    const res = await this.$axios.$post(`${url}?page=${data.page || 1}`, data.post);
    commit('mutate', { property: prefix + 'Announcements', value: res });
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
  async getMyAllAnnouncements({ commit }) {
    const res = await this.$axios.$get('/my/all-announce');
    commit('mutate', { property: 'myAnnouncements', value: res });
  },
  async getAnnouncementInner({ commit }, id) {
    const res = await this.$axios.$get(`/announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async deleteAnnounement({ commit }, data) {
    await this.$axios.$post('/' + data.type + '/' + data.id + '/delete');
  },
  // Car announcements
  async getCarAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/announcement/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyCarAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/edit_announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  // Commercial Announcements
  async getCommercialAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/commercial/get_single_announce/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyCommercialAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/edit_announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  // Moto Announcements
  async getMotoAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`${data.path}/get_announce/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyMotoAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/moto/edit_announce/${data.id}?type=${data.type}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  // Catalog
  async getCatalogSearch({commit, state}, data) {
    try {
      commit('mutate', { property: 'CancelToken', value: this.$axios.CancelToken });
      if(typeof state.cancel == 'function') state.cancel('operation cancelled');
      const res = await this.$axios.$post(`/search_catalog?page=${data.query.page || 1}`, { filteredData: state.catalogForm, params: data.params }, {
        cancelToken: new state.CancelToken(function executor(c) { 
          commit('mutate', { property: 'cancel', value: c });
        }),
      });
      if(data.get_items) commit('mutate', { property: 'catalogItems', value: res.items });
      commit('mutate', { property: 'catalogTotal', value: res.total });
    } catch(e) {}
  },
  // Sell
  async checkSellTokens({ commit }, phone) {
    const res = await this.$axios.$post('/check/user/by/phone', { phone });
    commit('mutate', { property: 'sellTokens', value: res.data && res.data.announce_count });
    commit('mutate', { property: 'sellPhoneRegistered', value: res.data && res.data.have_account });
    commit('mutate', { property: 'sellAutosalonRights', value: res.data && res.data.is_autosalon });
  },
  resetSellTokens({ commit }) {
    commit('mutate', { property: 'sellTokens', value: false });
    commit('mutate', { property: 'sellPhoneRegistered', value: false });
    commit('mutate', { property: 'sellAutosalonRights', value: false });
    commit('mutate', { property: 'sellPhoneEntered', value: '' });
  },
  setSellProgress({ commit }, value) {
    commit('mutate', { property: 'sellProgress', value });
  },
  // Sell Options
  async getSellYears({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/get_years`);
    commit('mutate', { property: 'sellYears', value: res });
  },
  async getSellBody({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}`);
    commit('mutate', { property: 'sellBody', value: res });
  },
  async getSellGenerations({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}/body/${params.body}/generations`);
    commit('mutate', { property: 'sellGenerations', value: res });
  },
  async getSellEngines({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}/body/${params.body}/generation/${params.generation}/engines`);
    commit('mutate', { property: 'sellEngines', value: res });
  },
  async getSellGearing({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing`);
    commit('mutate', { property: 'sellGearing', value: res });
  },
  async getSellTransmissions({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing/${params.gearing}/transmissions`);
    commit('mutate', { property: 'sellTransmissions', value: res });
  },
  async getSellModifications({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing/${params.gearing}/trns/${params.transmission}/modifications`);
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
  async updatePromotion({ commit }, {key, value}) {
    commit('mutate', { property: 'promotion', key, value });
  },
  async updatePaidStatus({ commit }, value) {
    commit('mutate', { property: 'paidStatusData', value });
  },
  // Autosalons
  async getAutoSalonsList({commit}, params) {
    const data = await this.$axios.$get('/auto_salon_list' + (params ? ('?' + params) : ''));
    commit('mutate', { property: 'autosalonsList', value: data });
  },
  async getAutoSalonById({commit}, {id, page}) {
    const data = await this.$axios.$get('/auto_salon/' + id + '?page=' + (page || 1));
    commit('mutate', { property: 'autosalonSingle', value: data });
  },
  async getMyAutoSalon({commit}) {
    const data = await this.$axios.$get('/my/autosalon/edit');
    commit('mutate', { property: 'myAutosalon', value: data });
  },
  async setMyAutoSalon({commit}, form) {
    const data = await this.$axios.$post('/my/autosalon/edit', form);
    commit('mutate', { property: 'myAutosalon', value: data });
  },
  async getAnnouncementCalls({commit}) {
    const data = await this.$axios.$get('/my/call-announces');
    commit('mutate', { property: 'myAnnouncementCalls', value: data });
  },
  async incrementAnnouncementCalls({}, id) {
    await this.$axios.$get(`/announce/${id}/show/phone`);
  },
  async getAnnouncementStats({commit}) {
    const data = await this.$axios.$get('/my/dashboard/statistics');
    commit('mutate', { property: 'myAnnouncementStats', value: data });
  },
  async getPackageStats({commit}) {
    const data = await this.$axios.$get('/my/dashboard/package');
    commit('mutate', { property: 'myPackageStats', value: data });
  },
  updateAutosalonsInBounds({commit}, list) {
    commit('mutate', { property: 'autosalonsInBounds', value: list });
  },
  updateAutosalonsSelected({commit}, list) {
    commit('mutate', { property: 'autosalonsSelected', value: list });
  },
  // Reset Data on Logout
  resetUserData({ commit }) {
    // reset services
    commit('reset', ['myServices','myServiceHistory','myServiceOptions']);
  }
}

export const mutations = {
  mutate(state, payload) {
    if(payload.key !== undefined) state[payload.property][payload.key] = payload.value;
    else state[payload.property] = payload.value;
  },
  reset(state, payload) {
    const initialState = getInitialState();
    payload.map(property => { 
      state[property] = initialState[property];
    });
  },
  removeItem(state, payload) {
    state[payload.property] = state[payload.property].filter(item => {
      return item[payload.key] !== payload.value;
    });
  },

  // messages
  appendToMessage(state, payload) {
    let groupIndex = state.messages.findIndex(group => group.id == payload.group.id);

    if (groupIndex === -1){
      payload.group.messages = [];
      state.messages.unshift(payload.group);
      groupIndex = 0;
    }
    state.messages[groupIndex].is_read = false;
    state.messages[groupIndex].messages.push(payload.message);
    state.messages[groupIndex].last_message = payload.message;
    // show group first
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
    if(payload.setAllEmpty) {
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
    state.messages[payload.groupIndex].is_read = true;
    state.messages[payload.groupIndex].last_message.is_read = true;
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
    if (index >= 0) state.favorites.splice(index,1);
    else state.favorites.push(payload.id);
  }
}