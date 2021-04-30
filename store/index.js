const getInitialState = () =>({
  loading: true,
  colorMode: 'light',
  breakpoint: null,
  uiScale: 1,
  navbarMenus: [],
  staticPages: [],
  // axios cancellation
  CancelToken: null,
  cancel: null,
  // profile
  messages: [],
  suggested_messages: [],
  saved: {
    cars: [],
    motorcycles: [],
    scooters: [],
    motoAtv: [],
    commercial: [],
    parts: [],
  },
  actives: [],
  // announcements
  myAnnouncements: {},
  mainAnnouncements: {},
  carsAnnouncements: [],
  motoAnnouncements: [],
  commercialAnnouncements: [],
  promotedAnnouncements: [],
  announcement: {},
  relativeAnnouncements: [],
  // saved search
  savedSearchList: [],
  singleSavedSearch: {},
  // catalog
  catalog_total: 0,
  catalog_items: {},
  catalog_form: {},
  // brands
  brands: [],
  com_brands: [],
  // models
  models: [],
  moto_atv_models: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  moto_models: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  com_models: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  scooter_models: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  array_models: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  model_description: false,
  // generations
  generations: [],
  generation_types: [],
  car_type_name: {},
  array_generations: { 0:[], 1:[], 2:[], 3:[], 4:[] },
  specifications_list: [],
  specifications_raw_list: [],
  equipments_list: [],
  first_generation: false,
  first_generation_equipments: [],
  // options
  sell_options: {},
  all_sell_options: [],
  all_sell_options2: {},
  popular_options: [],
  body_options: {},
  moto_options: [],
  colors: [],
  complaint_options: [],
  badges: [],
  options_to_reset: [],
  // commercial
  com_types: [],
  com_all_options: [],
  com_filters: [],
  com_search_filters: [],
  // sell
  sell_tokens: false,
  sell_phone: '',
  sell_phone_auth: false,
  sell_autosalon_auth: false,
  sell_cookies: {
    brand: '',
    model: '',
    years: '',
    body: '',
    generations: '',
    engines: '',
    gearing: '',
    transmissions: '',
    modifications: '',
    power: '',
    capacity: '',
    box: ''
  },
  sell_generations: [],
  sell_engines: [],
  sell_years: [],
  sell_gearing: [],
  sell_modifications: [],
  sell_transmissions: [],
  sell_body: [],
  // services
  services: [],
  packages: [],
  all_type_packages: {
    cars: [],
    moto: [],
    commercial: []
  },
  my_services: [],
  my_service_options: [],
  my_service_history: [],
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
  navbarMenus: s => s.navbarMenus,
  staticPages: s => s.staticPages,
  // profile
  messages: s => s.messages,
  suggested_messages: s => s.suggested_messages,
  savedSearchList: s => s.savedSearchList,
  singleSavedSearch: s => s.singleSavedSearch,
  saved: s => s.saved,
  actives: s => s.actives,
  // announcements
  announcement: s => s.announcement,
  carsAnnouncements: s => s.carsAnnouncements,
  motoAnnouncements: s => s.motoAnnouncements,
  commercialAnnouncements: s => s.commercialAnnouncements,
  promotedAnnouncements: s => s.promotedAnnouncements,
  mainAnnouncements: s => s.mainAnnouncements,
  myAnnouncements: s => s.myAnnouncements,
  relativeAnnouncements: s => s.relativeAnnouncements,
  // catalog
  catalog_items: s => s.catalog_items,
  catalog_total: s => s.catalog_total,
  catalog_form: s => s.catalog_form,
  // brands
  brands: s => s.brands,
  com_brands: s => s.com_brands,
  // models
  models: s => s.models,
  moto_atv_models: s => s.moto_atv_models,
  moto_models: s => s.moto_models,
  com_models: s => s.com_models,
  scooter_models: s => s.scooter_models,
  array_models: s => s.array_models,
  // generations
  generations: s => s.generations,
  generation_types: s => s.generation_types,
  car_type_name: s => s.car_type_name,
  array_generations: s => s.array_generations,
  first_generation: s => s.first_generation,
  first_generation_equipments: s => s.first_generation_equipments,
  specifications_list: s => s.specifications_list,
  specifications_raw_list: s => s.specifications_raw_list,
  equipments_list: s => s.equipments_list,
  // options
  sell_options: s => s.sell_options,
  all_sell_options: s => s.all_sell_options,
  all_sell_options2: s => s.all_sell_options2,
  popular_options: s => s.popular_options,
  body_options: s => s.body_options,
  moto_options: s => s.moto_options,
  colors: s => s.colors,
  complaint_options: s => s.complaint_options,
  // commercial
  com_types: s => s.com_types,
  com_all_options: s => s.com_all_options,
  com_filters: s => s.com_filters,
  com_search_filters: s => s.com_search_filters,
  // sell
  sell_tokens: s => s.sell_tokens,
  sell_phone: s => s.sell_phone,
  sell_phone_auth: s => s.sell_phone_auth,
  sell_autosalon_auth: s => s.sell_autosalon_auth,
  sell_cookies: s => s.sell_cookies,
  sell_generations: s => s.sell_generations,
  sell_engines: s => s.sell_engines,
  sell_years: s => s.sell_years,
  sell_gearing: s => s.sell_gearing,
  sell_modifications: s => s.sell_modifications,
  sell_transmissions: s => s.sell_transmissions,
  // services
  services: s => s.services,
  packages: s => s.packages,
  all_type_packages: s => s.all_type_packages,
  my_services: s => s.my_services,
  my_service_options: s => s.my_service_options,
  my_service_history: s => s.my_service_history,
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
  if(state['options_to_reset'].includes(property)) {
    let arr = state['options_to_reset'].filter(p => p !== property);
    commit('mutate', { property: 'options_to_reset', value: arr }); 
    return false;
  }
  return typeof state[property] === 'object' && Object.keys(state[property]).length > 0;
};

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await Promise.all([
      dispatch('getMenus'),
      dispatch('getStaticPages')
    ]);
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
    commit('mutate', { property: 'navbarMenus', value: res });
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
    commit('mutate', { property: 'suggested_messages', value: res })
  },
  async sendMessage({ commit }, data) {
    const res = await this.$axios.$post('/profile/messages', data.form);
    commit('appendToMessage', { group: data.activeGroup, message: res });
  },
  async createMessagesGroup({ commit }, data) {
    const res = await this.$axios.$post('/profile/messages/'+ data.recipientId, data.announce);
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
  // Saved announces
  announceSaveOrDelete({ commit }, data) {
    this.$axios.$post('/announce/save', {id: data.id, type: data.type});
    commit('announceSaveOrDelete', {id: data.id, type: data.type});
  },
  async getSavedAnnouncements({ commit }) {
    const res = await this.$axios.$get('/announce/saved');
    commit('loadSavedAnnouncements', res);
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
    const rest_search = state.savedSearchList.filter(search => search.id !== id);
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
  async getComBrands({ commit }, type) {
    const res = await this.$axios.$get(`/commercial/get_brands/${type}`);
    commit('mutate', { property: 'com_brands', value: res });
  },
  // Models
  async getModels({ commit }, name) {
    const res = await this.$axios.$get(`/brand/${name}/models`);
    commit('mutate', { property:'models', value: res });
  },
  async getComModels({ commit }, data) {
    const res = await this.$axios.$get(`/commercial/type/${data.type}/brand/${data.id}/models`);
    commit('mutate', { property: 'com_models', value: res, key: data.index })
  },
  async getMotoModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/brand/${data.id}/models`);
    commit('mutate', { property: 'moto_models', value: res, key: data.index });
  },
  async getMotoAtvModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/atv/brand/${data.id}/models`);
    commit('mutate', { property: 'moto_atv_models', value: res, key: data.index });
  },
  async getScooterModels({ commit }, data) {
    const res = await this.$axios.$get(`/moto/scooter/brand/${data.id}/models`);
    commit('mutate', { property: 'scooter_models', value: res, key: data.index });
  },
  // Generations
  async getGenerations({ commit }, data) {
    const res = await this.$axios.$get(`/brand/${data.params.name}/model/${data.params.model}/generations`);
    commit('mutate', { property: 'generations', value: res.generations });
    commit('mutate', { property: 'model_description', value: res.model.description });
    if (!data.onlyGeneration) commit('mutate', { property: 'first_generation', value: res.first_generation });
  },
  async getFirstGeneration({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}`);
    commit('mutate', { property: 'first_generation', value: res });
  },
  async getModelGenerations({ commit }, slug) {
    const res = await this.$axios.$get(`/model/${slug}/generations`);
    commit('mutate', { property: 'generations', value: res.generations });
  },
  async getModelsArray({ commit }, data) {
    const res = data.value ? await this.$axios.$get(`/brand/${data.value}/models`) : [];
    commit('mutate', { property: 'array_models', value: res || [], key: data.index })
  },
  async getModelGenerationsArray({ commit }, data) {
    const res = data.value ? await this.$axios.$get(`/brand/${data.brand_slug}/model/${data.value}/generations`) : [];
    commit('mutate', { property: 'array_generations', value: res.generations || [], key: data.index })
  },
  async getGenerationTypes({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_types`);
    commit('mutate', { property: 'generation_types', value: res });
  },
  async getCarTypeName({ commit }, id) {
    const res = await this.$axios.$get(`/car_type_id/${id}`);
    commit('mutate', { property: 'car_type_name', value: res });
  },
  // Body
  async getBody({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}`);
    commit('mutate', { property: 'first_generation', value: res });
  },
  async getSpecificationsList({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_type/${params.body}`);
    commit('mutate', { property: 'specifications_list', value: res });
  },
  async getRawSpecificationsList({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_type/${params.body}/raw`);
    commit('mutate', { property: 'specifications_raw_list', value: res });
  },
  async getEquipmentsList({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/get_type/${params.body}/equipments`);
    commit('mutate', { property: 'equipments_list', value: res });
  },
  async getCatalogSpecifications({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}/catalog/${params.specification || params.equipment}`);
    commit('mutate', { property: 'first_generation', value: res });
  },
  async getCatalogEquipments({ commit }, params) {
    const res = await this.$axios.$get(`/brand/${params.name}/model/${params.model}/generation/${params.generation}/body/${params.body}/catalog/${params.equipment}/equipments`);
    commit('mutate', { property: 'first_generation_equipments',  value: res });
  },
  // Options
  async getOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'sell_options')) return;
    const res = await this.$axios.$get('/config/get_options');
    commit('mutate', { property: 'sell_options', value: res });
  },
  async getAllOtherOptions({ state, commit }, suffix = '') {
    if (objectNotEmpty(state, commit, 'all_sell_options' + suffix)) return;
    const res = await this.$axios.$get('/config/get_all_options' + suffix);
    commit('mutate', { property: 'all_sell_options' + suffix, value: res });
  },
  async getPopularOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'popular_options')) return;
    const res = await this.$axios.$get('/config/get_popular_options');
    commit('mutate', { property: 'popular_options', value: res });
  },
  async getBodyOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'body_options')) return;
    const res = await this.$axios.$get('/get_body_options');
    commit('mutate', { property: 'body_options', value: res });
  },
  async getMotoOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'moto_options')) return;
    const res = await this.$axios.$get(`/moto/search_options`);
    commit('mutate', { property: 'moto_options', value: res });
  },
  async getColors({ state, commit }) {
    if (objectNotEmpty(state, commit, 'colors')) return;
    const res = await this.$axios.$get(`/config/get_colors?formatted=false`);
    commit('mutate', { property: 'colors', value: res });
  },
  async getComplaintOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'complaint_options')) return;
    const res = await this.$axios.$get(`/complaint-options`);
    commit('mutate', { property: 'complaint_options', value: res.data });
  },
  async getBadges({ state, commit }) {
    if (objectNotEmpty(state, commit, 'badges')) return;
    const res = await this.$axios.$get(`/additional/get_badges`);
    commit('mutate', { property: 'badges', value: res });
  },
  resetOptions({ state, commit }, property = false) {
    let arr = [
      'sell_options','all_sell_options2','body_options',
      'colors','complaint_options','badges','brands','popular_options','all_sell_options',
      'moto_options','com_all_options','com_types'
    ];
    if (property) {
      arr = state['options_to_reset'].filter(p => p !== property);
      commit('mutate', { property: 'options_to_reset', value: arr });
    } else {
      commit('mutate', { property: 'options_to_reset', value: arr });
    }
  },
  // Commercial
  async getComAllOptions({ state, commit }) {
    if (objectNotEmpty(state, commit, 'com_all_options')) return;
    const res = await this.$axios.$get(`/commercial/get_all_options`);
    commit('mutate', { property: 'com_all_options', value: res });
  },
  async getComFilters({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/type/${id}/get_filters`);
    commit('mutate', { property: 'com_filters', value: res });
  },
  async getComSearchFilters({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/type/${id}/get_search_filters`);
    commit('mutate', { property: 'com_search_filters', value: res });
  },
  async getComTypes({ state, commit }) {
    if (objectNotEmpty(state, commit, 'com_types')) return;
    const res = await this.$axios.$get('/commercial/all_types');
    commit('mutate', { property: 'com_types', value: res });
  },
  // Announcements
  async getMainSearch({ commit }, data) {
    const res = await this.$axios.$get(data.url);
    commit('mutate', { property: 'mainAnnouncements', value: res });
    // hard-code pagination
    if(res.standard_count) {
      let paginate = {
        current_page: 1,
        last_page: Math.ceil(res.standard_count / 40),
        total: res.standard_count
      }
      commit('mutate', { property: 'mainAnnouncements', key: 'paginate', value: paginate });
    }
  },
  async getGridSearch({ commit }, data) {
    const url = data.url, prefix = data.prefix;
    const res = await this.$axios.$post(`${url}?page=${data.page || 1}`, data.post);
    commit('mutate', { property: prefix + 'Announcements', value: res });
  },
  // Premium / VIP
  async getPromotedSearch({ commit }, data) {
    const res = await this.$axios.$get(`/${data.type}/cars?page=${data.page || 1}`);
    commit('mutate', { property: 'promotedAnnouncements', value: res });
  },
  async getMyAllAnnouncements({ commit }) {
    const res = await this.$axios.$get('/my/all-announce');
    commit('mutate', { property: 'myAnnouncements', value: res });
  },
  async deleteAnnounement({ commit }, data) {
    await this.$axios.$post('/' + data.type + '/' + data.id + '/delete');
  },
  setRestoreOptions({commit}, data){
    commit('mutate', { property: 'restore_announcement', value: data });
  },
  // Car announcements
  async getSingleAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/announcement/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/edit_announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getRelativeAnnouncements({ commit }, id) {
    const res = await this.$axios.$get(`/grid/same/announcements/${id}`);
    commit('mutate', { property: 'relativeAnnouncements', value: res });
  },
  // Commercial Announcements
  async getSingleComAnnouncement({ commit }, data) {
    const res = await this.$axios.$get(`/commercial/get_single_announce/${data.id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  async getMyComAnnouncement({ commit }, id) {
    const res = await this.$axios.$get(`/commercial/edit_announce/${id}`);
    commit('mutate', { property: 'announcement', value: res });
  },
  // Moto Announcements
  async getSingleMotoAnnouncement({ commit }, data) {
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
      const res = await this.$axios.$post(`/search_catalog?page=${data.query.page || 1}`, { filteredData: state.catalog_form, params: data.params }, {
        cancelToken: new state.CancelToken(function executor(c) { 
          commit('mutate', { property: 'cancel', value: c });
        }),
      });
      if(data.get_items) commit('mutate', { property: 'catalog_items', value: res.items });
      commit('mutate', { property: 'catalog_total', value: res.total });
    } catch(e) {}
  },
  // Sell
  setSellSavedOptions({commit, state}) {
    for(let key in state.sell_cookies) {
      commit('mutate', { property: 'sell_cookies', value: this.$cookies.get(`sell_${key}`), key: key });
    }
  },
  removeSellSavedOptions({commit, state}, options = false) {
    let cookies = options || state.sell_cookies;
    for(let key in cookies) {
      key = options ? cookies[key] : key;
      this.$cookies.remove(`sell_${key}`);
      if(state.sell_cookies[key] !== '')
        commit('mutate', { property: 'sell_cookies', value: '', key: key });
      if(state.hasOwnProperty(`sell_${key}`) && Object.keys(state[`sell_${key}`]).length)
        commit('mutate', { property: `sell_${key}`, value: [] });
    }
  },
  async checkSellTokens({ commit }, phone) {
    const res = await this.$axios.$post('/check/user/by/phone', { phone });
    commit('mutate', { property: 'sell_tokens', value: res.data && res.data.announce_count });
    commit('mutate', { property: 'sell_phone_auth', value: res.data && res.data.have_account });
    commit('mutate', { property: 'sell_autosalon_auth', value: res.data && res.data.is_autosalon });
  },
  resetSellTokens({ commit }) {
    commit('mutate', { property: 'sell_tokens', value: false });
    commit('mutate', { property: 'sell_phone_auth', value: false });
    commit('mutate', { property: 'sell_autosalon_auth', value: false });
    commit('mutate', { property: 'sell_phone', value: '' });
  },
  // Sell Options
  async getSellYears({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/get_years`);
    commit('mutate', { property: 'sell_years', value: res });
  },
  async getSellBody({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}`);
    commit('mutate', { property: 'sell_body', value: res });
  },
  async getSellGenerations({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}/body/${params.body}/generations`);
    commit('mutate', { property: 'sell_generations', value: res });
  },
  async getSellEngines({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/year/${params.year}/body/${params.body}/generation/${params.generation}/engines`);
    commit('mutate', { property: 'sell_engines', value: res });
  },
  async getSellGearing({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing`);
    commit('mutate', { property: 'sell_gearing', value: res });
  },
  async getSellTransmissions({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing/${params.gearing}/transmissions`);
    commit('mutate', { property: 'sell_transmissions', value: res });
  },
  async getSellModifications({ commit }, params) {
    const res = await this.$axios.$get(`/sell/${params.brand}/${params.model}/body/${params.body}/generation/${params.generation}/engine/${params.engine}/gearing/${params.gearing}/trns/${params.transmission}/modifications`);
    commit('mutate', { property: 'sell_modifications', value: res });
  },
  // Services
  async getPackages({ commit }, id) {
    const res = await this.$axios.$get(`/marketing/getPackages/${id}`);
    commit('mutate', { property: 'packages', value: res });
  },
  async getAllTypePackages({ commit }) {
    ['cars', 'moto', 'commercial'].map(async (type, i) => {
      const res = await this.$axios.$get(`/marketing/getPackages/${i + 1}`);
      commit('mutate', { property: 'all_type_packages', value: res, key: type });
    })
  },
  async getServices({ commit }) {
    const res = await this.$axios.$get(`/marketing/getServices`);
    commit('mutate', { property: 'services', value: res });
  },
  async getMyServices({ commit }) {
    const res = await this.$axios.$get(`/my/actives`);
    commit('mutate', { property: 'my_services', value: res });
  },
  async getMyServiceOptions({ commit }, type) {
    const res = await this.$axios.$get(`/my/actives/${type}`);
    commit('mutate', { property: 'my_service_options', value: res });
  },
  async getMyServiceHistory({ commit }) {
    const res = await this.$axios.$get(`/my/actives/history`);
    commit('mutate', { property: 'my_service_history', value: res });
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
  // saved
  announceSaveOrDelete(state, payload) {
    let type = state.saved[payload.type];
    let index = type.indexOf(payload.id);
    if (index >= 0) type.splice(index,1);
    else type.push(payload.id);
  },
  loadSavedAnnouncements(state, payload) {
    for (var key in state.saved) {
      if (payload[key] !== undefined){
        state.saved[key] = payload[key];
      }
    }
  },
}