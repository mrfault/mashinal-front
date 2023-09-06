import _ from "~/lib/underscore";
import {mutate, reset} from "~/lib/vuex-helpers/mutations";
import Vue from "vue";
import uuid from "uuid";
import offer from "~/components/offer/offer";

const getInitialState = () => ({
   loading: true,
   loadingData: false,
   colorMode: "light",
   notificationStatus: "deactive",
   currentLanguage: "az",
   partAnnouncements: {},
   breakpoint: null,
   newOfferCount: 0,
   ptk: null,
   temporaryLazyData: [],
   temporaryLazyDataB: [],
   menus: [],
   staticPages: [
      {
         id: 1,
         title: {},
         text: {},
         slug: {}
      },
      {
         id: 1,
         title: {},
         text: {},
         slug: {}
      }
   ],
   pageRef: "",
   pageRefs: ["", ""],
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
   notifications: [],
   suggestedMessages: [],
   // services
   services: [],
   actives: [],
   myServices: [],
   myServiceOptions: [],
   myServiceHistory: [],
   myBalanceHistory: [],
   promotion: {
      id: "",
      optionId: "",
      paymentId: 1
   },
   paidStatusData: false,
   // announcements
   myAnnouncements: {},
   myAnnouncementsV2: [],
   myPlatesV2: [],
   myAnnouncement: {},
   mainAnnouncements: {},
   mainMonetized: [],
   monetizedPage: [],
   carShowroom: [],
   partsHome: [],
   partsV2: [],
   partsV2Monetized: [],
   plateNumbers: [],
   brandsList: [],
   monetizedCars: [],
   autosalonAnnouncementsId: [],
   motoGearbox: [],
   motoTransmissions: [],
   motoFuelTypes: [],
   mainPartsAnnouncements: {},
   carsAnnouncements: [],
   motoAnnouncements: [],
   commercialAnnouncements: [],
   shopAnnouncements: {},
   announcement: {},
   motoRelatives: [],
   relativeAnnouncements: [],
   userAnnouncements: [],
   userRegistrationMarks: [],
   // catalog
   catalogAnnouncements: [],
   catalogTotal: 0,
   timestamp: new Date().getTime(),
   bnFixed: true,
   catalogItems: {},
   catalogForm: {},
   // brands
   brands: [],
   existsBrands: [],
   commercialBrands: {0: [], 1: [], 2: [], 3: [], 4: []},
   // models
   models: [],
   atvModels: {0: [], 1: [], 2: [], 3: [], 4: []},
   motorcycleModels: {0: [], 1: [], 2: [], 3: [], 4: []},
   commercialModels: {0: [], 1: [], 2: [], 3: [], 4: []},
   scooterModels: {0: [], 1: [], 2: [], 3: [], 4: []},
   motoModelsV2: [],
   carModels: {0: [], 1: [], 2: [], 3: [], 4: []},
   carModelsExclude: {0: [], 1: [], 2: [], 3: [], 4: []},
   modelDescription: false,
   popularComments: [],

   // generations`
   generations: [],
   generationTypes: [],
   carGenerations: {0: [], 1: [], 2: [], 3: [], 4: []},
   carGenerationsExclude: {0: [], 1: [], 2: [], 3: [], 4: []},
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
   motoOptionsV2: [],
   motoBrands: [],
   scooterOptions: [],
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
   sellPhoneEntered: "",
   sellPhoneRegistered: false,
   sellSalonRights: false,
   sellPartSalonRights: false,
   sellProgress: 5,
   sellYears: {},
   sellBody: [],
   sellGenerations: [],
   sellGenerationsV2: [],
   sellEngines: [],
   sellGearing: [],
   sellTransmissions: [],
   sellModifications: [],
   sellModificationsV2: [],
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
   homePageSliders: {},
   servicePackages: [],
   myAnnouncementCalls: {},
   myAnnouncementStats: {},
   mapView: false,
   // balance
   balanceHasAnimation: false,
   // banner
   smartBannerIsOn: true,
   // edit
   editPath: "",
   editing: false,
   editingPostAuthor: "",
   // garage
   selectedVehicleList: [],
   selectedVehiclesPrice: 0,
   offers: [],
   offer: null,
   current_offer_id: null,
   OffersAcceptedByAutoSalon: {},
   offerMessages: [],
   isFavorite: false,
   offerPartners: [],
   offerPartnersMeta: {},
   offer_announcement_count: [
      {
         key: uuid.v4(),
         collapsed: false
      }
   ],

   offer_announcements: [],
   offer_selected_models: [
      {
         logo: null,
         img: null,
         brand: "",
         model: "",
         price: null,
         year: null
      },
      {
         logo: null,
         img: null,
         brand: "",
         model: "",
         price: null,
         year: null
      }
   ],
   offer_id: null,
   showOfferPaymentModal: false,
   offer_add_is_loader: false,
   offer_faq: null,
   user_deleted_auto_salon_offers: [],
   active_my_offers: [],
   offer_generations: [],
   //  moderator
   savedImageUrls: [],
   single_announce: {},
   partCategories: [],
   partFilters: {},

   regionNumbers: [],
   agreements: [],
   resetForm: false,
   registrationMarks: [],
   myPlates: [],
   mySavedPlates: [],
   mySavedParts: [],
   registrationMark: [],
   handleIds: null,

   //   dropdown
   openDropdownId: null,

   //usercabinet
   userCabinetCars: [],

   monetizationPriceList: [],

   autosalonStatistics: {},

   settingsV2: [],

   loginInEditModal: false,
});

export const state = () => getInitialState();

export const getters = {
   motoRelatives: s => s.motoRelatives,
   monetizedPage: s => s.monetizedPage,
   getAgreements: s => s.agreements,
   getResetForm: s => s.resetForm,
   getMainMonetized: s => s.mainMonetized,
   getUserRegistrationMarks: s => s.userRegistrationMarks,
   getMyPlates: s => s.myPlates,
   getMySavedPlates: s => s.mySavedPlates,
   getMySavedParts: s => s.mySavedParts,
   getRegionNumbers: s => s.regionNumbers,
   getRegistrationMarks: s => s.registrationMarks,
   getRegistrationMark: s => s.registrationMark,
   single_announce: s => s.single_announce,
   homePageSliders: s => s.homePageSliders,
   servicePackages: s => s.servicePackages,
   loading: s => s.loading,
   loadingData: s => s.loadingData,
   colorMode: s => s.colorMode,
   breakpoint: s => s.breakpoint,
   ptk: s => s.ptk,
   loggedIn: s => s.auth.loggedIn,
   user: s => s.auth.user || {},
   menus: s => s.menus,
   staticPages: s => s.staticPages,
   pageRefs: s => s.pageRefs,
   pageRef: s => s.pageRef,
   hideFooter: s => s.hideFooter,
   monetizedCars: s => s.monetizedCars,
   autosalonAnnouncementsId: s => s.autosalonAnnouncementsId,
   motoGearbox: s => s.motoGearbox,
   motoTransmissions: s => s.motoTransmissions,
   motoFuelTypes: s => s.motoFuelTypes,
   // saved search & favorites
   savedSearchList: s => s.savedSearchList,
   carModelsExclude: s => s.carModelsExclude,
   carGenerationsExclude: s => s.carGenerationsExclude,
   singleSavedSearch: s => s.singleSavedSearch,
   notViewedSavedSearch: s => s.notViewedSavedSearch,
   favorites: s => s.favorites,
   favoriteAnnouncements: s => s.favoriteAnnouncements,
   notViewedFavorites: s => s.notViewedFavorites,
   // profile
   messages: s => s.messages,
   notifications: s => s.notifications,
   messagesByGroup: s => id => s.messages.find(group => group.id == id),
   messagesByDate: s => id => {
      let messages = s.messages.find(group => group.id == id).messages;
      return _.groupBy(messages, message => message.created_at.slice(0, 10));
   },
   suggestedMessages: s => s.suggestedMessages,
   countNewMessages: s =>
      s.messages.filter(group => {
         return (
            group.last_message &&
            !group.last_message.is_read &&
            group.last_message.sender_id != s.auth.user.id
         );
      }).length,
   countNewNotifications: s =>
      s.notifications.data
         ? s.notifications.data.filter(item => !item.read_at).length
         : [],
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
   shopAnnouncements: s => {
      return s.shopAnnouncements;
   },
   partAnnouncements: s => s.partAnnouncements,
   mainAnnouncements: s => s.mainAnnouncements,
   carShowroom: s => s.carShowroom,
   plateNumbers: s => s.plateNumbers,
   partsHome: s => s.partsHome,
   partsV2: s => s.partsV2,
   partsV2Monetized: s => s.partsV2Monetized,
   brandsList: s => s.brandsList,
   mainPartsAnnouncements: s => s.mainPartsAnnouncements,
   myAnnouncements: s => s.myAnnouncements,
   myAnnouncementsV2: s => s.myAnnouncementsV2,
   myPlatesV2: s => s.myPlatesV2,
   myAnnouncement: s => s.myAnnouncement,
   relativeAnnouncements: s => {
      return s.relativeAnnouncements;
   },
   userAnnouncements: s => s.userAnnouncements,
   // catalog
   catalogAnnouncements: s => s.catalogAnnouncements,
   catalogItems: s => s.catalogItems,
   catalogTotal: s => s.catalogTotal,
   catalogForm: s => s.catalogForm,
   // brands
   brands: s => s.brands,
   existsBrands: s => s.existsBrands,
   commercialBrands: s => s.commercialBrands,
   // models
   models: s => s.models,
   atvModels: s => s.atvModels,
   motorcycleModels: s => s.motorcycleModels,
   commercialModels: s => s.commercialModels,
   scooterModels: s => s.scooterModels,
   motoModelsV2: s => s.motoModelsV2,
   carModels: s => s.carModels,
   modelDescription: s => s.modelDescription,
   getPopularComments: s => s.popularComments,
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
   motoOptionsV2: s => s.motoOptionsV2,
   motoBrands: s => s.motoBrands,
   scooterOptions: s => s.scooterOptions,
   complaintOptions: s => s.complaintOptions,
   badges: s => s.badges,

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
   sellPartSalonRights: s => s.sellPartSalonRights,
   sellProgress: s => s.sellProgress,
   sellYears: s => s.sellYears,
   sellBody: s => s.sellBody,
   sellGenerations: s => s.sellGenerations,
   sellGenerationsV2: s => s.sellGenerationsV2,
   sellEngines: s => Object.keys(s.sellEngines).map(key => s.sellEngines[key]),
   sellGearing: s => Object.keys(s.sellGearing).map(key => s.sellGearing[key]),
   sellTransmissions: s =>
      Object.keys(s.sellTransmissions).map(key => s.sellTransmissions[key]),
   sellModifications: s =>
      Object.keys(s.sellModifications).map(key => s.sellModifications[key]),
   sellModificationsV2: s => s.sellModificationsV2,
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
   mapView: s => s.mapView,
   // banner
   smartBanner: s => s.smartBannerIsOn,
   // edit
   editPath: s => s.editPath,
   editing: s => s.editing,
   editingPostAuthor: s => s.editingPostAuthor,
   // garage
   selectedVehicleList: s => s.selectedVehicleList,
   selectedVehiclesPrice: s => s.selectedVehiclesPrice,
   offers: s => s.offers,
   OffersAcceptedByAutoSalon: s => s.OffersAcceptedByAutoSalon,
   getOfferMessages: s => s.offerMessages,
   isFavorite: s => s.isFavorite,
   getOfferPartners: s => s.offerPartners,
   getOfferPartnersMeta: s => s.offerPartnersMeta,
   getOffer: s => s.offer,
   getNewOfferCount: s => s.newOfferCount,
   offerAnnouncementsCount: s => s.offer_announcement_count,
   offerAnnouncements: s => s.offer_announcements,
   offerSelectedModels: s => s.offer_selected_models,
   showOfferPaymentModal: s => s.showOfferPaymentModal,
   offerAddIsLoader: s => s.offer_add_is_loader,
   getOfferFaq: s => s.offer_faq,
   getUserDeletedAutoSalonOffer: s => s.user_deleted_auto_salon_offers,
   getActiveMyOffers: s => s.active_my_offers,
   offerGenerations: s => s.offer_generations,
//  moderator
   partCategories: s => s.partCategories,
   partFilters: s => s.partFilters,

   openDropdownId: s => s.openDropdownId,


//   usercabinet
   userCabinetCars: s => s.userCabinetCars,

 //monetization
   monetizationPriceList: s => s.monetizationPriceList,

   autosalonStatistics: s => s.autosalonStatistics,

   settingsV2: s => s.settingsV2,
   
   loginInEditModal: s => s.loginInEditModal,


};

const objectNotEmpty = (state, commit, property) => {
   if (state["needResetOptions"].includes(property)) {
      let arr = state["needResetOptions"].filter(p => p !== property);
      commit("mutate", {property: "needResetOptions", value: arr});
      return false;
   }
   return (
      typeof state[property] === "object" &&
      Object.keys(state[property]).length > 0
   );
};
export const actions = {
   // New API ++++++++++++++++++++
   async fetchMonetizedAnnouncementsPage({commit}, page = 1) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/monetized-announcements?${page}`);
      commit("mutate", {property: "monetizedPage", value: res});
   },

   async fetchMonetizedAnnouncementsHome({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/monetized-announcements/home');
      commit("mutate", {property: "mainMonetized", value: res});
   },

   async fetchAllAnnouncementsHome({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/all-announcements/home');
      commit("mutate", {property: "mainAnnouncements", value: res});
   },

   async fetchCarShowroomAnnouncementsHome({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/autosalon/announcements/home');
      commit("mutate", {property: "carShowroom", value: res});
   },

   async fetchPlateNumbersHome({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/plate-numbers/home');
      commit("mutate", {property: "plateNumbers", value: res});
   },

   async fetchPartsAnnouncementsHome({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/parts/home');
      commit("mutate", {property: "partsHome", value: res});
   },

   async fetchPartsAnnouncements({commit}, page = 1) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/parts?page=${page}`);
      commit("mutate", {property: "partsV2", value: res});
   },

   async fetchPartMonetized({commit}, payload = {}) {
      const body = payload.body ? {...payload.body} : {};
      if (body.announce_type) {
         body.is_new = body.announce_type === 1 ? true : false;
      }
      delete body.announce_type;

      // const config = {
      //    params: {
      //       ...(payload.params ? payload.params : {}),
      //       page: payload?.params?.page || 1
      //    }
      // };

      const res = await this.$axios.$post(`${this.$env().API_SECRET}/parts/monetized`, body, payload?.params?.page || 1);
      commit("mutate", {property: "partsV2Monetized", value: res});
   },

   async getInfiniteMainPartsPageSearch({commit, dispatch}, payload = {}) {
      const body = payload.body ? {...payload.body} : {};
      if (body.announce_type) {
         body.is_new = body.announce_type === 1 ? true : false;
      }
      delete body.announce_type;

      // const config = {
      //    params: {
      //       ...(payload.params ? payload.params : {}),
      //       page: payload?.params?.page || 1
      //    }
      // };
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/parts?page=${payload?.page || 1}`, body);

      commit("parts/mutate", {
         property: "showNotFound",
         value: res.total === 0
      });

      if (res.total === 0) {
         await dispatch("parts/getOtherAnnouncements");
      } else {
         commit("parts/mutate", {
            property: "otherAnnouncementsPagination",
            value: {}
         });
         commit("parts/setAnnouncements", {
            announcements: [],
            property: "otherAnnouncements"
         });
      }
      commit("mutate", {property: "partsV2", value: res});
      // commit("mutate", {property: "partAnnouncements", value: res});
   },

   async fetchBrandsList({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/brands/list-with-count');
      commit("mutate", {property: "brandsList", value: res});
   },

   async fetchAutosalonAnnouncementsId({commit}, data) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/autosalon/announcements/${data.id}?page=${data.page || 1}`);
      commit("mutate", {property: "autosalonAnnouncementsId", value: res});
   },

   async fetchPartsAnnouncementsId({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/parts/announcements/${id}`);
      commit("mutate", {property: "autosalonAnnouncementsId", value: res});
   },

   async fetchMonetizedCars({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/car/monetized-cars');
      commit("mutate", {property: "monetizedCars", value: res});
   },

   async fetchMonetizedCarsSearch({commit}, data = {}) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/car/monetized`, data);
      commit("mutate", {property: "monetizedCars", value: res});
   },

   async getAnnouncementInnerV2({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/car/${id}`);
      commit("mutate", {property: "announcement", value: res});
   },

   async getMotoGearboxV2({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/moto/gearbox');
      commit("mutate", {property: "motoGearbox", value: res});
   },

   async getMotoTransmissionsV2({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/moto/transmissions');
      commit("mutate", {property: "motoTransmissions", value: res});
   },

   async getMotoFuelTypesV2({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + '/moto/fuel-types');
      commit("mutate", {property: "motoFuelTypes", value: res});
   },
   // New API --------------------

   async fetchAgreements({commit}) {
      const res = await this.$axios.$get("/agreements")
      commit("mutate", {property: "agreements", value: res.data || []})
   },

   async fetchHandleIds({commit}, payload) {
      let link = 'announcement-view';
      if (payload.single) link = 'announcement-open';

      const res = await this.$axios.$post(link, payload.data);
      commit("mutate", { property: "resetForm", value: res });
   },

   async fetchResetForm({commit}, data) {
      commit("mutate", {property: "resetForm", value: data})
   },

   async fetchUserRegistrationMarks({commit}, id) {
      const res = await this.$axios.$get(`/user/${id}/plates`);
      commit("mutate", {property: "userRegistrationMarks", value: res});
   },

   async fetchRegionNumbers({commit}) {
      const res = await this.$axios.$get(this.$env().API_SECRET + "/regions/list-serial-number")
      commit("mutate", {property: "regionNumbers", value: res || []})
   },

   async fetchRegistrationMarks({commit}, data = '') {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/plate-numbers${data}`);

      if (res.data.length) commit("mutate", {property: "loadingData", value: false});
      commit("mutate", {property: "registrationMarks", value: res || []});
   },

   async fetchRegistrationMark({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/plate-numbers/${id}`)
      commit("mutate", {property: "announcement", value: res?.data || []})
   },

   async fetchPlates({commit}, data = '') {
      const res = await this.$axios.$get(`/my/plates${data}`)
      commit("mutate", {property: "myPlates", value: res || []})
   },
   async fetchPlatesV2({commit}, data = {}) {

      const res = await this.$axios.$get(
         `${this.$env().API_SECRET}/me/announcements/plate-numbers?status=${data.status}`
      );
      commit("mutate", {property: "myPlatesV2", value: res});
   },

   async fetchMySavedPlates({commit}, data = '') {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/me/bookmarks/plate-numbers${data}`)
      commit("mutate", {property: "mySavedPlates", value: res || []})
   },

   async fetchMySavedParts({commit}, data = '') {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/me/bookmarks/parts${data}`)
      commit("mutate", {property: "mySavedParts", value: res || []})
   },

   async nuxtServerInit({dispatch, commit}) {
      let ptk =
         this.$cookies.get("ptk") ||
         "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace(/[xy]/g, c => {
               let r = (Math.random() * 16) | 0,
                  v = c == "x" ? r : (r & 0x3) | 0x8;
               return v.toString(16);
            })
            .toUpperCase();

      if (!this.$cookies.get("ptk")) {
         this.$cookies.set("ptk", ptk, {maxAge: 5 * 60});
      }

      commit("mutate", {property: "ptk", value: ptk});
   },
   // Loading
   loadingData({commit}, loading) {
      commit("mutate", {property: "loading", value: loading});
   },
   setLoading({commit}, loading) {
      commit("mutate", {property: "loading", value: loading});
   },
   // Dark/Light theme
   setColorMode({commit}, theme) {
      commit("mutate", {property: "colorMode", value: theme});
   },
   setNotificationStatus({commit}, status) {
      commit("mutate", {property: "notificationStatus", value: status});
   },
   // Grid
   setGridBreakpoint({commit}, breakpoint) {
      commit("mutate", {property: "breakpoint", value: breakpoint});
   },
   // Footer
   setFooterVisibility({commit}, show) {
      commit("mutate", {property: "hideFooter", value: !show});
   },
   // Localization
   async changeLocale({commit, dispatch}, locale) {
      commit("mutate", {property: "currentLanguage", value: locale});
      let changed = locale !== this.$i18n.locale;
      this.$i18n.setLocale(locale);
      // update options in store
      if (changed) dispatch("resetOptions");
   },
   // Pages
   async getMenus({commit}) {
      const res = await this.$axios.$get("/menus");
      commit("mutate", {property: "menus", value: res});
   },

   async getStaticPages({commit}) {
      let static_pages;

      if (localStorage.getItem('static_pages')) {
         static_pages = localStorage.getItem('static_pages');
         commit("mutate", {property: "staticPages", value: JSON.parse(static_pages)});
      } else {
         const res = await this.$axios.$get("/get_static_pages");
         commit("mutate", {property: "staticPages", value: res});
         localStorage.setItem('static_pages', JSON.stringify(res));
      }
   },

   setPageRefs({commit}, {index, path}) {
      commit("mutate", {property: "pageRefs", key: index, value: path});
   },
   setPageRef({commit}, path) {
      commit("mutate", {property: "pageRef", value: path});
   },

   async getNotifications({commit}, page = null) {
      const data = await this.$axios.$get(
         "/notifications?with_pagination=true&" + page
      );
      commit("mutate", {property: "notifications", value: data});
   },
   // Messages
   async getMessages({commit, state}, groupId) {
      const res = await this.$axios.$get("/profile/messages");
      let messages = [];
      if (groupId) {
         messages = await this.$axios.$get(
            "/profile/group/" + groupId + "/messages"
         );
      }

      commit("mutate", {property: "messages", value: res});
      commit("appendMessagesToGroup", {setAllEmpty: true});

      if (groupId && messages.length) {
         let groupIndex = state.messages.findIndex(group => group.id == groupId);

         if (groupIndex !== -1) {
            if (!state.messages[groupIndex].messages_loaded) {
               commit("appendMessagesToGroup", {groupIndex, messages});
            }
         }
      }
   },
   async getGroupMessages({commit, state}, groupId) {
      let groupIndex = state.messages.findIndex(group => group.id == groupId);

      if (groupIndex !== -1) {
         if (!state.messages[groupIndex].messages_loaded) {
            const messages = await this.$axios.$get("/profile/group/" + groupId + "/messages");
            commit("appendMessagesToGroup", {groupIndex, messages});
         }
      }
   },
   async getSuggestedMessages({commit, state}) {
      if (objectNotEmpty(state, commit, "suggestedMessages")) return;
      const res = await this.$axios.$get("/profile/suggestedMessages");
      commit("mutate", {property: "suggestedMessages", value: res});
   },
   async sendMessage({commit}, data) {
      const res = await this.$axios.$post("/profile/messages", data.form);
      commit("appendToMessage", {group: data.activeGroup, message: res});
   },
   async createMessagesGroup({commit}, data) {
      const res = await this.$axios.$post("/profile/messages/" + data.recipientId, {id_unique: data.announceId});
      commit("appendMessageToGroup", {group: res});
      return res;
   },
   async removeMessageGroup({commit}, id) {
      await this.$axios.$get("/profile/messages/" + id + "/remove");
      commit("removeGroup", {groupId: id});
   },
   markAsRead({commit}, id) {
      this.$axios.$get("/profile/messages/" + id + "/read");
      commit("markAsRead", {groupId: id});
   },
   async blockUser({}, data) {
      await this.$axios.$post("/profile/messages/" + data.id + "/block");
   },
   // Favorites
   async getFavorites({commit}) {
      const res = await this.$axios.$get("/announce/favorites");
      commit("mutate", {property: "favorites", value: res});
   },
   async addToFavorites({commit}, id) {
      commit("addToFavorites", {id});
      await this.$axios.$post(`/announce/${id}/favorite`);
   },
   async getFavoriteAnnouncements({commit}, data = {}) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/me/bookmarks?page=${data.page || 1}`);
      commit("mutate", {property: "favoriteAnnouncements", value: res});
   },
   async getNotViewedFavorites({commit}) {
      const res = await this.$axios.$get(`/announce/saved/not-viewed-count`);
      commit("mutate", {property: "notViewedFavorites", value: res.data});
   },
   async markViewedFavorites({commit}) {
      const res = await this.$axios.$get(`/announce/saved/mark-viewed`);
      commit("mutate", {property: "notViewedFavorites", value: res.data});
   },
   // Saved search
   async getSavedSearch({commit}) {
      const res = await this.$axios.$get("/saved-search");
      commit("mutate", {property: "savedSearchList", value: res});
   },
   async createSavedSearch({commit}, data) {
      const res = await this.$axios.$post("/saved-search", data);
      commit("mutate", {property: "singleSavedSearch", value: res});
   },
   async fetchSavedSearch({commit}, data) {
      const res = await this.$axios.$post("/one-saved-search", data);
      commit("mutate", {property: "singleSavedSearch", value: res || {}});
   },
   async deleteSavedSearch({commit, state}, id) {
      await this.$axios.$delete(`/saved-search/${id}`);
      const list = state.savedSearchList.filter(search => search.id !== id);
      commit("mutate", {property: "savedSearchList", value: list});
      commit("mutate", {property: "singleSavedSearch", value: {}});
   },
   async deleteSavedSearchMultiple({commit, state}, data) {
      await this.$axios.$post(`/saved-search/delete_all`, data);
      const list = state.savedSearchList.filter(
         search => !data.ids.includes(search.id)
      );
      commit("mutate", {property: "savedSearchList", value: list});
      commit("mutate", {property: "singleSavedSearch", value: {}});
   },
   async updateSavedSearchNotificationsInterval({commit, state}, data) {
      await this.$axios.$post("/saved-search-notification-interval", data);
      const list = state.savedSearchList.map(search =>
         !data.id.includes(search.id)
            ? search
            : {...search, notification_interval: data.type}
      );

      commit("mutate", {property: "savedSearchList", value: list});
      commit("mutate", {
         property: "singleSavedSearch",
         key: "notification_interval",
         value: data.type
      });
   },
   clearSavedSearch({commit}) {
      commit("mutate", {property: "singleSavedSearch", value: {}});
   },
   async getNotViewedSavedSearch({commit}) {
      const res = await this.$axios.$get(`/saved-search/not-viewed-count`);
      commit("mutate", {property: "notViewedSavedSearch", value: res.data});
   },
   async markViewedSavedSearch({commit}) {
      const res = await this.$axios.$get(`/saved-search/mark-viewed`);
      commit("mutate", {property: "notViewedSavedSearch", value: res.data});
   },
   // Services
   async getMyActives({commit}) {
      const res = await this.$axios.$get(`/my/actives`);
      commit("mutate", {property: "actives", value: res});
   },
   // Brands
   async getBrands({commit, state}) {
      if (objectNotEmpty(state, commit, "brands")) return;
      const res = await this.$axios.$get("/brands");
      commit("mutate", {property: "brands", value: res});
   },

   async getBrandsOnlyExists({commit, state}) {
      if (objectNotEmpty(state, commit, "existsBrands")) return;
      const res = await this.$axios.$get("/brands?whereHas=1");
      commit("mutate", {property: "existsBrands", value: res});
   },
   async getCommercialBrands({commit}, data) {
      const res = await this.$axios.$get(
         `/commercial/get_brands/${data.category}`
      );
      commit("mutate", {
         property: "commercialBrands",
         value: res,
         key: data.index || 0
      });
   },
   // Models
   async getModels({commit}, name) {
      const res = await this.$axios.$get(`/brand/${name}/models`);
      commit("mutate", {property: "models", value: res});
   },
   async getCommercialModels({commit}, data) {
      const res = await this.$axios.$get(
         `/commercial/type/${data.category}/brand/${data.id}/models`
      );
      commit("mutate", {
         property: "commercialModels",
         value: res,
         key: data.index || 0
      });
   },
   async getMotoModels({dispatch}, data) {
      if (data.category == 1)
         await dispatch("getMotorcycleModels", {
            id: data.id,
            index: data.index || 0
         });
      else if (data.category == 2)
         await dispatch("getScooterModels", {
            id: data.id,
            index: data.index || 0
         });
      else if (data.category == 3)
         await dispatch("getAtvModels", {id: data.id, index: data.index || 0});
   },
   async getMotorcycleModels({commit}, data) {
      const res = await this.$axios.$get(`/moto/brand/${data.id}/models`);
      commit("mutate", {
         property: "motorcycleModels",
         value: res,
         key: data.index || 0
      });
   },
   async getMotoModelsV2({commit}, data) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/moto/${data.value}/brand/${data.id}/models?whereHas=${data.whereHas || 1}`);
      commit("mutate", {
         property: "motoModelsV2",
         value: res,
      });
   },
   async getAtvModels({commit}, data) {
      const res = await this.$axios.$get(`/moto/atv/brand/${data.id}/models`);
      commit("mutate", {
         property: "atvModels",
         value: res,
         key: data.index || 0
      });
   },
   async getScooterModels({commit}, data) {
      const res = await this.$axios.$get(`/moto/scooter/brand/${data.id}/models`);
      commit("mutate", {
         property: "scooterModels",
         value: res,
         key: data.index || 0
      });
   },
   //Parts
   async getPartCategories({commit}) {
      const res = await this.$axios.$get(`/part/categories`);
      commit("mutate", {
         property: "partCategories",
         value: res
      });
   },
   async getPartFilters({commit}, id) {
      const res = await this.$axios.$get(`/part/category/${id}/filters`);
      commit("mutate", {
         property: "partFilters",
         value: res
      });
   },
   async popularComments({commit}) {
      let data = await this.$axios.$get("/get-popular-comments");
      commit("mutate", {
         property: "popularComments",
         value: data
      });
   },
   // Generations
   async getGenerations({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generations`
      );
      commit("mutate", {property: "generations", value: res.generations});
      commit("mutate", {
         property: "modelDescription",
         value: res.model.description
      });
   },

   async getOfferGenerations({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generations`
      );

      commit("setOfferGenerations", {index: data.index, data: res.generations});
   },

   async getFirstGeneration({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}`
      );
      commit("mutate", {property: "firstGeneration", value: res});
   },
   async getModelGenerations({commit}, slug) {
      const res = await this.$axios.$get(`/model/${slug}/generations`);
      commit("mutate", {property: "generations", value: res.generations});
   },
   async getModelsArray({commit}, data) {
      const res = data.value
         ? await this.$axios.$get(`/brand/${data.value}/models`)
         : [];
      commit("mutate", {
         property: "carModels",
         value: res || [],
         key: data.index
      });
   },
   async getModelsArrayExclude({commit}, data) {
      const res = data.value
         ? await this.$axios.$get(`/brand/${data.value}/models`)
         : [];
      commit("mutate", {
         property: "carModelsExclude",
         value: res || [],
         key: data.index
      });
   },
   async getModelGenerationsArray({commit}, data) {
      const res = data.value
         ? await this.$axios.$get(
            `/brand/${data.brand_slug}/model/${data.value}/generations`
         )
         : [];
      commit("mutate", {
         property: "carGenerations",
         value: res.generations || [],
         key: data.index
      });
   },
   async getModelGenerationsArrayExclude({commit}, data) {
      const res = data.value
         ? await this.$axios.$get(
            `/brand/${data.brand_slug}/model/${data.value}/generations`
         )
         : [];
      commit("mutate", {
         property: "carGenerationsExclude",
         value: res.generations || [],
         key: data.index
      });
   },
   async getGenerationTypes({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_types`
      );
      commit("mutate", {property: "generationTypes", value: res});
   },
   async getCarTypeName({commit}, id) {
      const res = await this.$axios.$get(`/car_type_id/${id}`);
      commit("mutate", {property: "carTypeName", value: res});
   },
   // Body
   async getBody({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}/body/${data.body}`
      );
      commit("mutate", {property: "firstGeneration", value: res});
   },
   async getModificationsList({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_type/${data.body}`
      );
      commit("mutate", {property: "modificationsList", value: res});
   },
   async getBodyModification({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${
            data.generation
         }/body/${data.body}${
            data.modification ? `/catalog/${data.modification}` : ""
         }`
      );
      commit("mutate", {property: "firstGeneration", value: res});
   },
   async getEquipmentsList({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}/get_type/${data.body}/equipments`
      );
      commit("mutate", {property: "equipmentsList", value: res});
   },
   async getBodyEquipments({commit}, data) {
      const res = await this.$axios.$get(
         `/brand/${data.brand}/model/${data.model}/generation/${data.generation}/body/${data.body}/catalog/${data.equipment}/equipments`
      );
      commit("mutate", {property: "firstGenerationEquipments", value: res});
   },
   // Options
   async getOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "sellOptions")) return;
      const res = await this.$axios.$get("/config/get_options");
      commit("mutate", {property: "sellOptions", value: res});
   },
   async getAllOtherOptions({state, commit}, suffix = "") {
      if (objectNotEmpty(state, commit, "allSellOptions" + suffix)) return;
      const res = await this.$axios.$get("/config/get_all_options" + suffix);
      commit("mutate", {property: "allSellOptions" + suffix, value: res});
   },
   async getPopularOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "popularOptions")) return;
      const res = await this.$axios.$get("/config/get_popular_options");
      commit("mutate", {property: "popularOptions", value: res});
   },
   async getBodyOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "bodyOptions")) return;
      const res = await this.$axios.$get("/get_body_options");
      commit("mutate", {property: "bodyOptions", value: res});
   },
   async getMotoOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "motoOptions")) return;
      const res = await this.$axios.$get(`/moto/search_options`);
      commit("mutate", {property: "motoOptions", value: res});
   },
   async getMotoOptionsV2({state, commit}) {
      if (objectNotEmpty(state, commit, "motoOptionsV2")) return;
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/moto/types`);
      commit("mutate", {property: "motoOptionsV2", value: res});
   },
   async getMotoBrandsV2({state, commit}, data) {
      // if (objectNotEmpty(state, commit, "motoBrands")) return;
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/moto/${data.value}/brands?whereHas=${data.whereHas || 1}`);
      commit("mutate", {property: "motoBrands", value: res});
   },
   async getScooterOptions({commit}) {
      const data = await this.$axios.$get(`/moto/scooter_options`);
      commit("mutate", {
         property: "scooterOptions",
         value: data
      });
   },
   async getColors({state, commit}) {
      if (objectNotEmpty(state, commit, "colors")) return;
      const res = await this.$axios.$get(`/config/get_colors?formatted=false`);
      commit("mutate", {property: "colors", value: res});
   },
   async getComplaintOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "complaintOptions")) return;
      const res = await this.$axios.$get(`/complaint-options`);
      commit("mutate", {property: "complaintOptions", value: res.data});
   },
   async getBadges({state, commit}) {
      if (objectNotEmpty(state, commit, "badges")) return;
      const res = await this.$axios.$get(`/additional/get_badges`);
      commit("mutate", {property: "badges", value: res});
   },
   // Commercial Options
   async getCommercialAllOptions({state, commit}) {
      if (objectNotEmpty(state, commit, "commercialAllOptions")) return;
      const res = await this.$axios.$get(`/commercial/get_all_options`);
      commit("mutate", {property: "commercialAllOptions", value: res});
   },
   async getCommercialFilters({commit}, id) {
      // console.log("getCommercialFilters");
      const res = await this.$axios.$get(`/commercial/type/${id}/get_filters`);
      commit("mutate", {property: "commercialFilters", value: res});
   },
   async getCommercialSearchFilters({commit}, id) {
      const res = await this.$axios.$get(
         `/commercial/type/${id}/get_search_filters`
      );
      commit("mutate", {property: "commercialSearchFilters", value: res});
   },
   async getCommercialTypes({state, commit}) {
      if (objectNotEmpty(state, commit, "commercialTypes")) return;
      const res = await this.$axios.$get("/commercial/all_types");
      commit("mutate", {property: "commercialTypes", value: res});
   },
   // Reset Options
   resetOptions({state, commit}, property = false) {
      let arr = [
         "sellOptions",
         "allSellOptions2",
         "bodyOptions",
         "colors",
         "complaintOptions",
         "badges",
         "brands",
         "popularOptions",
         "allSellOptions",
         "motoOptions",
         "commercialAllOptions",
         "commercialTypes",
         "suggestedMessages",
         "messages"
      ];
      if (property) {
         arr = state["needResetOptions"].filter(p => p !== property);
         commit("mutate", {property: "needResetOptions", value: arr});
      } else {
         commit("mutate", {property: "needResetOptions", value: arr});
      }
   },

   async fetchInfiniteMainMonetized({commit}, data = {}) {
      const res = await this.$axios.$post(`/grid/monetized-${data.type}`, data.data);
      commit("mutate", {property: "mainMonetized", value: res});
   },

   async getInfiniteMainSearchWithoutMutate({commit, dispatch}, data = {}) {
      const res = await this.$axios.$get(
         `/grid/home_page_all?page=${data.page || 1}`
      );
      commit("mutate", {property: "temporaryLazyData", value: res});
   },

   async getInfiniteMainPartsSearchWithoutMutate({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/grid/home_page_parts?per_page=4&page=${data.page || 1}`
      );
      commit("mutate", {property: "temporaryLazyDataB", value: res});
   },
   async getInfiniteMainPartsSearch({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/grid/home_page_parts?per_page=4&page=${data.page || 1}`
      );
      commit("mutate", {property: "mainPartsAnnouncements", value: res});
   },

   async getInfiniteMainPartsPageSearchWithoutMutate({commit}, payload = {}) {
      const body = payload ? {...payload} : {};
      if (body.announce_type) {
         body.is_new = body.announce_type === 1 ? true : false;
      }
      delete body.announce_type;

      const config = {
         params: {
            ...(payload.params ? payload.params : {}),
            page: payload?.page || 1
         }
      };
      const res = await this.$axios.$post(`/grid/part`, body, config);

      commit("mutate", {property: "temporaryLazyData", value: res});
   },

   async getGridSearch({commit, dispatch}, data) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}${data.url}?page=${data.page || 1}`, data.post);
      commit("mutate", {property: data.prefix + "Announcements", value: res});
   },
   // Announcements
   async getRelativeAnnouncements({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/car/similar/${id}`);
      commit("mutate", {property: "relativeAnnouncements", value: res});
   },
   async getRelativeAnnouncementsWithoutMutate({commit, state}, data) {
      const res = await this.$axios.$get(
         `/grid/same/announcements_new/${data.id ||
         state.announcement.id_unique}?page=${data.page || 1}`
      );
      commit("mutate", {property: "temporaryLazyData", value: res});
   },
   async getShopOtherAnnouncements({commit, state}, data) {
      const res = await this.$axios.$get(
         `/grid/shop/announcements/${data.id ||
         state.announcement.id_unique}?page=${data.page || 1}`
      );
      commit("mutate", {property: "shopAnnouncements", value: res});
   },
   async getShopOtherAnnouncementsWithoutMutate({commit, state}, data) {
      const res = await this.$axios.$get(
         `/grid/shop/announcements/${data.id ||
         state.announcement.id_unique}?page=${data.page || 1}`
      );
      commit("mutate", {property: "temporaryLazyData", value: res});
   },
   async getUserAnnouncements({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/all-announcements/user/${id}`);
      commit("mutate", {property: "userAnnouncements", value: res});
   },
   async getMyAllAnnouncements({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/my/all-announce-paginated?page=${data.page || 1}${
            [0, 1, 2, 3].includes(data.status) ? `&status=${data.status}` : ""
         }${data.shop ? `&${data.shop}=true` : ""}`
      );
      commit("mutate", {property: "myAnnouncements", value: res});
   },
   async getMyAllAnnouncementsV2({commit}, data = {}) {
      const res = await this.$axios.$get(
         `${this.$env().API_SECRET}/me/announcements?status=${data.status}&sorting=${data.sorting}`
      );
      commit("mutate", {property: "myAnnouncementsV2", value: res});
   },


   async getAnnouncementInner({commit}, id) {
      const res = await this.$axios.$get(`/announce/${id}`);
      commit("mutate", {property: "announcement", value: res});
   },

   async getMotoInnerV2({commit}, payload) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/moto/${payload.type}/${payload.id}`);
      commit("mutate", {property: "announcement", value: res});
   },

   async motoRelativesV2({commit}, payload) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/moto/${payload.type}/similar/${payload.id}`);
      commit("mutate", {property: "motoRelatives", value: res});
   },

   async getPartsInnerV2({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/parts/${id}`);
      commit("mutate", {property: "announcement", value: res});
   },

   async getMyAnnouncement({commit}, id) {
      const res = await this.$axios.$get(`/announcement/edit/${id}`);
      commit("mutate", {property: "myAnnouncement", value: res});
   },
   async deactivateMyAnnounement({commit}, id) {
      await this.$axios.$delete(`/announcement/${id}/delete`);
      commit("mutate", {property: "myAnnouncement", value: {}});
   },
   async deleteMyAnnounement({commit}, id) {
      await this.$axios.$delete(`/announcement/${id}/remove`);
      commit("mutate", {property: "myAnnouncement", value: {}});
   },
   async deleteMyAnnounementV2({commit}, id) {
      await this.$axios.$delete(`/announcement/${id}/remove`);
      commit("mutate", {property: "myAnnouncement", value: {}});
   },
   // Car announcements
   async getCarAnnouncement({commit}, data) {
      const res = await this.$axios.$get(`/announcement/${data.id}`);
      commit("mutate", {property: "announcement", value: res});
   },
   async getMyCarAnnouncement({commit}, id) {
      const res = await this.$axios.$get(`/edit_announce/${id}`);
      commit("mutate", {property: "myAnnouncement", value: res});
   },
   // Commercial Announcements
   async getCommercialAnnouncement({commit}, data) {
      const res = await this.$axios.$get(
         `/commercial/get_single_announce/${data.id}`
      );
      commit("mutate", {property: "announcement", value: res});
   },
   async getMyCommercialAnnouncement({commit}, id) {
      const res = await this.$axios.$get(`/commercial/edit_announce/${id}`);
      commit("mutate", {property: "myAnnouncement", value: res});
   },
   // Moto Announcements
   async getMotoAnnouncement({commit}, data) {
      const res = await this.$axios.$get(`${data.path}/get_announce/${data.id}`);
      commit("mutate", {property: "announcement", value: res});
   },
   async getMyMotoAnnouncement({commit}, data) {
      const res = await this.$axios.$get(
         `/moto/edit_announce/${data.id}?type=${data.type}`
      );
      commit("mutate", {property: "myAnnouncement", value: res});
   },
   // Catalog
   async getCatalogSearch({commit}, data) {
      if (data.params.brand) data.params.name = data.params.brand;
      if (data.params.generation)
         data.params.generation = "g_" + data.params.generation;
      if (data.params.body) data.params.body = "body_" + data.params.body;

      let filteredData = {};
      console.log('1', data.post)
      for (let key in data.post) {
         if (["kolichestvo-mest", "privod", "tip-dvigatelya", "korobka", "body"].includes(key)) {
            filteredData[key] = { key, value: data.post[key] };
            console.log('2', filteredData[key])
         } else if (key.includes("max_")) {
            let rangeKey = key.replace("max_", "");
            filteredData[rangeKey] = `${data.post["min_" + rangeKey] || 0}-${data.post["max_" + rangeKey] || 0}`;
            console.log('3', filteredData[rangeKey])
         } else if (key.includes("min_")) {
            let rangeKey = key.replace("min_", "");
            filteredData[rangeKey] = `${data.post["min_" + rangeKey] || 0}-${data.post["max_" + rangeKey] || 0}`;
            // continue;
         } else {
            filteredData[key] = data.post[key];
            console.log('5', filteredData[key])
         }
      }

      const res = await this.$axios.$post(
         `/search_catalog?page=${data.page || 1}`,
         {filteredData, params: data.params}
      );

      commit("mutate", {property: "catalogItems", value: res.items});
      if (data.totalCount !== false)
         commit("mutate", {property: "catalogTotal", value: res.total});
   },
   async getCatalogAnnouncements({commit}, id) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/car-catalog/${id}/announcements`);
      commit("mutate", {property: "catalogAnnouncements", value: res});
   },
   // Sell
   async checkSellTokens({commit}, phone) {
      const res = await this.$axios.$post("/check/user/by/phone", {phone});
      commit("mutate", {
         property: "sellTokens",
         value: res.data && {
            cars: res.data.announce_left_car,
            commercial: res.data.announce_left_commercial,
            moto: res.data.announce_left_moto,
            parts: res.data.part_announce_count,
            parts_unlimited: true, //res.data.part_unlimited,
            salon_unlimited: res.data.salon_unlimited
         }
      });
      commit("mutate", {
         property: "sellPhoneRegistered",
         value: res.data && res.data.have_account
      });
      commit("mutate", {
         property: "sellSalonRights",
         value: res.data && res.data.is_autosalon
      });
      commit("mutate", {
         property: "sellPartsShopRights",
         value: res.data && res.data.is_part_salon
      });
   },
   resetSellTokens({commit}) {
      commit("mutate", {property: "sellTokens", value: false});
      commit("mutate", {property: "sellPhoneRegistered", value: false});
      commit("mutate", {property: "sellSalonRights", value: false});
      commit("mutate", {property: "sellPartsShopRights", value: false});
      commit("mutate", {property: "sellPhoneEntered", value: ""});
   },
   setSellProgress({commit}, value) {
      commit("mutate", {property: "sellProgress", value});
   },
   setSellPreviewData({commit}, {value, key}) {
      commit("mutate", {property: "sellPreviewData", value, key});
   },
   // Sell Options
   async getSellYears({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/get_years`
      );
      commit("mutate", {property: "sellYears", value: res});
   },
   async getSellBody({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/year/${data.year}`
      );
      commit("mutate", {property: "sellBody", value: res});
   },
   async getSellGenerations({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/year/${data.year}/body/${data.body}/generations`
      );
      commit("mutate", {property: "sellGenerations", value: res});
   },
   async getSellGenerationsV2({commit}, data) {
      const res = await this.$axios.$get(
         `${this.$env().API_SECRET}/${data.brand}/${data.model}/year/${data.year}/body/${data.body}/generations`
      );
      commit("mutate", {property: "sellGenerationsV2", value: res});
   },
   async getSellEngines({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/year/${data.year}/body/${data.body}/generation/${data.generation}/engines`
      );
      commit("mutate", {property: "sellEngines", value: res});
   },
   async getSellGearing({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing`
      );
      commit("mutate", {property: "sellGearing", value: res});
   },
   async getSellTransmissions({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing/${data.gearing}/transmissions`
      );
      commit("mutate", {property: "sellTransmissions", value: res});
   },
   async getSellModifications({commit}, data) {
      const res = await this.$axios.$get(
         `/sell/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing/${data.gearing}/trns/${data.transmission}/modifications`
      );
      commit("mutate", {property: "sellModifications", value: res});
   },
   async getSellModificationsV2({commit}, data) {
      const res = await this.$axios.$get(
         `${this.$env().API_SECRET}/car-catalog/${data.brand}/${data.model}/body/${data.body}/generation/${data.generation}/engine/${data.engine}/gearing/${data.gearing}/trns/${data.transmission}/modifications`
      );
      commit("mutate", {property: "sellModificationsV2", value: res});
   },
   // Services
   async getServices({commit}) {
      const res = await this.$axios.$get(`/marketing/getServices`);
      commit("mutate", {property: "services", value: res});
   },
   async getMyServices({commit}) {
      const res = await this.$axios.$get(`/my/actives`);
      commit("mutate", {property: "myServices", value: res});
   },
   async getMyServiceOptions({commit}, type) {
      const res = await this.$axios.$get(`/my/actives/${type}`);
      commit("mutate", {property: "myServiceOptions", value: res});
   },
   async getMyServiceHistory({commit}) {
      const res = await this.$axios.$get(`/my/actives/history`);
      commit("mutate", {property: "myServiceHistory", value: res});
   },
   async getMyBalanceHistory({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/payment/getHistory?page=${data.page || 1}&type=${data.type || 0}`
      );
      commit("mutate", {property: "myBalanceHistory", value: res});
   },
   async getMyBalanceHistoryWithoutMutate({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/payment/getHistory?page=${data.page || 1}&type=${data.type || 0}`
      );
      commit("mutate", {property: "temporaryLazyData", value: res});
   },
   async updatePromotion({commit}, {key, value}) {
      commit("mutate", {property: "promotion", key, value});
   },
   async updatePaidStatus({commit}, value) {
      commit("mutate", {property: "paidStatusData", value});
   },
   // Salons
   async getSalonsList({commit}, {type, params}) {
      const res = await this.$axios.$get(
         `/auto_salon_list/${type}${params || ""}`
      );
      if (!params || params === "?part=true") {
         commit("mutate", {property: "salonsList", value: res});
      }
      commit("mutate", {property: "salonsSearched", value: res});
      commit("mutate", {property: "salonsFiltered", value: res});
   },
   async getSalonById({commit}, data) {
      const res = await this.$axios.$get(`/auto_salon/${data.slug}?page=${(data.page || 1)}`);
      // const res = await this.$axios.$get("/auto_salon/" + data.slug + "?page=" + (data.page || 1) + '&sorting: '+ data.sorting);
      commit("mutate", {property: "salonSingle", value: res});
   },
   async getMySalon({commit}, {id}) {
      const res = await this.$axios.$get(`/my/autosalon/${id}/edit`);
      commit("mutate", {property: "mySalon", value: res});
   },
   async getHomePageSliders({commit}) {
      const res = await this.$axios.$get(`/home_page_slider`);
      commit("mutate", {property: "homePageSliders", value: res});
   },
   async updateMySalon({}, {id, form}) {
      await this.$axios.$post(`/my/autosalon/${id}/edit`, form);
   },
   async getServicePackages({commit}) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/promotion/list`);
      commit("mutate", {property: "servicePackages", value: res});
   },

   //SELL POSTS
   async plateNumbersPost({}, {form, isMobile}) {
         const res = await this.$axios.$post(`${this.$env().API_SECRET}/plate-numbers/post?is_mobile=${isMobile}`, form);
         return res;
   },
   async partsPost({}, form) {
         const res = await this.$axios.$post(`/sell/part/post/publish`, form);
         return res;
   },
   async carsPost({}, {form, isMobile}) {
      const res = await this.$axios.$post(`/sell/post/publish?is_mobile=${isMobile}`, form);
      return res;
   },
   async motoPost({}, {form, isMobile}) {
      const res = await this.$axios.$post(`/sell/moto/post/publish?is_mobile=${isMobile}`, form);
      return res;

   },
   async motoEdit({}, {id, isMobile, form}) {
      await this.$axios.$post(`sell/moto/post/edit/${id}?is_mobile=${isMobile}`, form);
   },
   async carEdit({}, {id, isMobile, form}) {
      await this.$axios.$post(`sell/post/edit/${id}?is_mobile=${isMobile}`, form);
   },
   async partEdit({}, {id, form}) {
      await this.$axios.$post(`/sell/part/edit/${id}`, form);
   },
   async registrationMarkEdit({}, {id, form}) {
      await this.$axios.$post(`/sell/plate/edit/${id}`, form);
   },


   updateSalonsFilters({commit}, form) {
      commit("mutate", {property: "salonsFilters", value: form});
   },
   updateSalonsSearchFilters({commit}, form) {
      commit("mutate", {property: "salonsSearchFilters", value: form});
   },
   async getAnnouncementCalls({commit}, data = {}) {
      const res = await this.$axios.$get(
         `/my/call-announces/${data.id}?page=${data.page || 1}`
      );
      commit("mutate", {property: "myAnnouncementCalls", value: res});
   },
   async incrementAnnouncementCalls({}, id) {
      await this.$axios.$get(`/announce/${id}/show/phone`);
   },
   async getAnnouncementStats({commit}, data) {
      const res = await this.$axios.$get(`/my/dashboard/statistics/${data?.id}${data.params ? data.params : ''}`);
      commit("mutate", {property: "myAnnouncementStats", value: res});
   },
   updateSalonsFiltered({commit}, list) {
      commit("mutate", {property: "salonsFiltered", value: list});
   },
   updateSalonsInBounds({commit}, list) {
      commit("mutate", {property: "salonsInBounds", value: list});
   },
   setMapView({commit}, visible) {
      commit("mutate", {property: "mapView", value: visible});
   },
   // Reset Data on Logout
   resetUserData({commit}) {
      commit("reset", [
         "myServices",
         "myServiceHistory",
         "myServiceOptions",
         "messages",
         "notViewedFavorites",
         "notViewedSavedSearch"
      ]);
   },
   async getAllOffers({commit}, param = "all") {
      var url = `/offer/salon/offer`;

      if (Object.keys(param).length > 0) {
         url += "?param=" + param.param;
      } else {
         url += "?param=all";
      }

      if (param.query) {
         url += "&query=" + param.query;
      }
      const data = await this.$axios.$get(url);
      commit("mutate", {property: "offers", value: data.data});

      commit("mutate", {property: "newOfferCount", value: data.count});
      commit("mutate", {
         property: "user_deleted_auto_salon_offers",
         value: data.user_deleted_auto_salon_offers
      });
   },
   async getOffer({commit}, payload) {
      const {data} = await this.$axios.get(
         "/offer/offer-detail/" + payload.id + "/" + payload.type
      );
      commit("mutate", {property: "offer", value: data});

      if (data.data.id) {
         commit("mutate", {property: "current_offer_id", value: data.data.id});
      } else {
         commit("mutate", {
            property: "current_offer_id",
            value: data.data.offer.id
         });
      }
   },

   async salonAcceptOffer({}, {id}) {
      const {data} = await this.$axios.$post("/offer/salon/offer/accept/" + id);
   },
   async userAcceptOffer({}, {id}) {
      const {data} = await this.$axios.$post("/offer/user/offer/accept/" + id);
   },
   async offerAddFavorite({commit}, id) {
      const data = await this.$axios.$post(
         `/offer/salon/offer/add-favorite/` + id
      );

      commit('offerAddFavorite')

   },
   async OffersAcceptedByAutoSalon({commit}, param = "all") {
      var url = "/offer/user/offers_accepted_by_auto_salon?param=";

      if (param.param) {
         url += param.param;
      }
      if (param.query) {
         url += "&query=" + param.query;
      }

      const data = await this.$axios.$get(url);

      commit("mutate", {
         property: "OffersAcceptedByAutoSalon",
         value: data.data
      });
      commit("mutate", {property: "newOfferCount", value: data.count});
   },

   async offerPartners({commit}, page = 1) {
      const data = await this.$axios.get("/offer/partners?page=" + page);

      commit("setOfferPartners", data.data);

      commit("mutate", {property: "offerPartnersMeta", value: data.data.meta});
   },
   async offerItemValidation({commit, state}, object) {
      try {
         const data = await this.$axios
            .post("/offer/validation", object.form)
            .then(async res => {
               if (res.data.status == "success") {
                  if (state.offer_announcements.length < 2) {
                     commit("appendOfferAnnouncement", object);
                  }

                  if (object.isSubmit) {

                     try {
                        await this.$axios
                           .post("/offer", state.offer_announcements)
                           .then(res => {
                              // console.log('Post error')
                              commit("openOfferPaymentModal", {status: true});
                              commit("setOfferId", {offer_id: res.data.offer_id});
                           });
                     } catch (e) {

                        commit("setOfferAddLoader", {status: false});
                     }

                  } else {
                     commit("incrementAnnouncementsCount");
                  }
               }
            });
      } catch (e) {
         commit("setOfferAddLoader", {status: false});
      }
   },

   async offerFaq({commit, state}) {
      const data = await this.$axios.$get("/offer/faq");
      commit("setOfferFaq", {data: data});
   },
   async activeMyOffers({commit, state}) {
      const {data} = await this.$axios.$get("/offer/user/active-my-offers");

      commit("mutate", {property: "active_my_offers", value: data});
   },

   async readOfferMessage({commit, state}, payload) {
      await this.$axios.$post("/offer/message/read/" + payload.id);
   },

   async UserCabinetCarsAdd({commit, state}, payload) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/me/cars/create`, payload);
      // commit("mutate", {property: "userCabinetCars", value: res});
   },
   async UserCabinetCarsEdit({commit, state}, payload) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/me/cars/${payload.id}/update?brand_id=${payload.brand_id}&model_id=${payload.model_id}&generation_id=${payload.generation_id}&car_type_id=${payload.car_type_id}&car_catalog_id=${payload.car_catalog_id}&vin=${payload.vin}&car_number=${payload.car_number}`);
   },
   async UserCabinetCarsGetAll({commit, state}, payload) {
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/me/cars?page=${payload}`);
      const newData = res.data; // Data from the current page

      commit("append", {property: "userCabinetCars", value: newData});
   },
   async UserCabinetCarDelete({commit, state}, payload) {
      const res = await this.$axios.$post(`${this.$env().API_SECRET}/me/cars/${payload.id}/delete`);
   },

   async getMonetizationPriceList({commit, state}, payload) {
      const res = await this.$axios.$get('/monetization/price/list')
      commit("mutate", {property: "monetizationPriceList", value: res});

   }  ,

   async getAutosalonStatistics({commit, state}, id) {
      const res = await this.$axios.$get(`/my/dashboard/statistics/${id}`)
      commit("mutate", {property: "autosalonStatistics", value: res});

   },

   async getSettingsV2({commit,state}){
      const res = await this.$axios.$get(`${this.$env().API_SECRET}/common/settings`);
      commit("mutate", {property: "settingsV2", value: res});
   }

};
export const mutations = {
   mutate: mutate(),
   reset: reset(getInitialState()),

   append(state, {property, value}) {
      state[property] = state[property].concat(value);
   },

   offerAddFavorite(state) {
      state.offer.data.isFavorite = !state.offer.data.isFavorite
   },

   setOpenDropdown(state, dropdownId) {
      state.openDropdownId = dropdownId;
   },
   closeDropdown(state) {
      state.openDropdownId = null;
   },

   // messages
   appendToMessage(state, payload) {
      let groupIndex = state.messages.findIndex(
         group => group.id == payload.group.id
      );

      if (groupIndex === -1) {
         payload.group.messages = [];
         state.messages.unshift(payload.group);
         groupIndex = 0;
      }

      state.messages[groupIndex] = {
         ...state.messages[groupIndex],
         is_read: false,
         messages: [...state.messages[groupIndex].messages, payload.message],
         last_message: payload.message
      };

      let group = state.messages[groupIndex];
      let isChatBot = group.sender_id == 3;
      state.messages.splice(groupIndex, 1);
      state.messages.splice(isChatBot ? 0 : 1, 0, group);
   },
   appendMessageToGroup(state, payload) {
      let groupIndex = state.messages.findIndex(
         group => group.id == payload.group.id
      );

      if (groupIndex === -1) {
         payload.group.messages = [];
         state.messages.unshift(payload.group);
         groupIndex = 0;
      }
   },
   appendMessagesToGroup(state, payload) {
      if (payload.setAllEmpty) {
         state.messages.map(item => {
            item.messages_loaded = false;
            item.messages = [];
         });
         return;
      }
      state.messages[payload.groupIndex].messages_loaded = true;
      state.messages[payload.groupIndex].messages = payload.messages;
   },
   markAsRead(state, payload) {
      let groupIndex = state.messages.findIndex(
         group => group.id == payload.groupId
      );

      state.messages[groupIndex].is_read = true;

      if (state.messages[groupIndex].last_message) {
         state.messages[groupIndex].last_message.is_read = true;
      }
   },
   removeGroup(state, payload) {
      let groupIndex = state.messages.findIndex(
         group => group.id == payload.groupId
      );

      if (groupIndex !== -1) {
         state.messages.splice(groupIndex, 1);
      }
   },
   // favorites
   addToFavorites(state, payload) {
      let index = state.favorites.indexOf(payload.id);
      // let announcementIndex = state.favoriteAnnouncements.data
      //   .findIndex(announcement => announcement.id_unique === payload.id);
      if (index >= 0) {
         state.favorites.splice(index, 1);
      } else {
         state.favorites.push(payload.id);
      }
   },
   // banner
   closeSmartBanner(state, payload) {
      state.smartBanner = payload;
   },
   // edit
   changeEditPath(state, payload) {
      state.editPath = payload;
   },
   changeEditing(state, payload) {
      state.editing = payload;
   },
   changeEditPostAuthor(state, payload) {
      state.editingPostAuthor = payload;
   },
   // garage
   changeSelectedVehiclesPrice(state, payload) {
      state.selectedVehiclesPrice = payload;
   },
   changeSelectedVehicleList(state, payload) {
      state.selectedVehicleList = payload;
   },
   setOfferMessages(state, payload) {
      state.offerMessages = payload;
   },
   IncrementMessageCount(state, payload) {
      if (this.$auth.user.autosalon) {
         var offerIndex = state.offers.findIndex(
            item => item.id == payload.offer_id
         );

         Vue.set(
            state.offers[offerIndex],
            "unread_messages",
            state.offers[offerIndex]["unread_messages"] + 1
         );

         let firstOffer = state.offers[offerIndex];

         state.offers.splice(offerIndex, 1);

         Vue.set(state, "offers", [firstOffer, ...state.offers]);
      } else {
         var offerIndex = state.OffersAcceptedByAutoSalon.findIndex(
            item => item.offer.id == payload.offer_id
         );

         Vue.set(
            state.OffersAcceptedByAutoSalon[offerIndex],
            "unread_messages",
            state.OffersAcceptedByAutoSalon[offerIndex]["unread_messages"] + 1
         );
         let firstOffer = state.OffersAcceptedByAutoSalon[offerIndex];
         state.OffersAcceptedByAutoSalon.splice(offerIndex, 1);
         Vue.set(state, "OffersAcceptedByAutoSalon", [
            firstOffer,
            ...state.OffersAcceptedByAutoSalon
         ]);
      }
   },
   readAllMessage(state, payload) {
      if (this.$auth.user.autosalon) {
         var offerIndex = state.offers.findIndex(
            item => item.id == payload.offer_id
         );

         Vue.set(
            state.offers[offerIndex],
            "unread_messages",
            (state.offers[offerIndex]["unread_messages"] = 0)
         );
      } else {
         var offerIndex = state.OffersAcceptedByAutoSalon.findIndex(
            item => item.auto_salon_offer_id == payload.offer_id
         );

         Vue.set(
            state.OffersAcceptedByAutoSalon[offerIndex],
            "unread_messages",
            (state.OffersAcceptedByAutoSalon[offerIndex]["unread_messages"] = 0)
         );
      }
   },

   appendOfferMessage(state, payload) {
      state.offerMessages.push(payload);
   },
   setOffers(state, payload) {
      state.offers = payload;
   },
   setIsFavorite(state, payload) {
   },
   setOfferPartners(state, payload) {
      for (let i = 0; i < payload.data.length; i++) {
         state.offerPartners.push(payload.data[i]);
      }
   },
   setNewMessage(state, id) {
      const emil = state.offers.find(offer => offer.id == id);
   },
   setNullModels(state) {
      state.models = [];
   },
   incrementAnnouncementsCount(state) {
      state.offer_announcement_count[0].collapsed = true;
      state.offer_announcement_count.push({collapsed: false, key: uuid.v4()});
   },
   decrementAnnouncementsCount(state) {
      state.offer_announcement_count--;
   },
   appendOfferAnnouncement(state, payload) {
      if (typeof state.offer_announcements[payload.index] != undefined) {
         state.offer_announcements.splice(payload.index, 1);
      }

      state.offer_announcements.push(JSON.parse(JSON.stringify(payload.form)));
   },
   appendOfferSelectedModels(state, payload) {
      Vue.set(state.offer_selected_models, payload.index, {
         img: payload.data.img
            ? payload.data.img
            : state.offer_selected_models[payload.index].img,
         logo: payload.data.logo
            ? payload.data.logo
            : state.offer_selected_models[payload.index].logo,
         brand: payload.data.brand
            ? payload.data.brand
            : state.offer_selected_models[payload.index].brand,
         model: payload.data.model
            ? payload.data.model
            : state.offer_selected_models[payload.index].model,
         price: payload.data.price
            ? payload.data.price
            : state.offer_selected_models[payload.index].price,
         year: payload.data.year
            ? payload.data.year
            : state.offer_selected_models[payload.index].year
      });
   },
   deleteOfferAnnouncement(state, payload) {
      let index = payload.index;
      if (index > -1) {
         state.offer_announcements.splice(index, 1);
         state.offer_announcement_count.splice(index, 1);
         state.offer_selected_models[index] = {
            logo: null,
            img: null,
            brand: "",
            model: "",
            price: null,
            year: null
         };
      }
   },
   openOfferPaymentModal(state, payload) {
      state.showOfferPaymentModal = payload.status;
   },
   setOfferId(state, payload) {
      state.offer_id = payload.offer_id;
   },
   setOfferAnnouncement(state, payload) {
      let form = JSON.parse(JSON.stringify(payload.form[payload.index]));

      Vue.set(state.offer_announcements, payload.index, form);
   },
   setOfferAddLoader(state, payload) {
      state.offer_add_is_loader = payload.status;
   },
   resetOfferState(state) {
      state.offer_announcement_count = [{collapsed: false}];
      state.offer_announcements = [];
      state.offer_selected_models = [
         {
            logo: null,
            img: null,
            brand: "",
            model: "",
            price: null,
            year: null
         },
         {
            logo: null,
            img: null,
            brand: "",
            model: "",
            price: null,
            year: null
         }
      ];
   },
   setOfferAnnouncementCount(state, payload) {
      state.offer_announcement_count[payload.index].collapsed = payload.status;
   },
   setOfferFaq(state, payload) {
      state.offer_faq = payload.data;
   },

   setOfferGenerations(state, payload) {
      Vue.set(state.offer_generations, payload.index, payload.data);
   },
   //  moderator
   setSavedImageUrls(state, data) {
      state.savedImageUrls = state.savedImageUrls.concat(data);
   },
   resetSavedImages(state) {
      Vue.set(state, "savedImageUrls", []);
   },
   setSavedImageUrlWithKey(state, data) {
      Vue.set(state.savedImageUrls, data.key, data.value);
   },
   deleteSavedImageUrlWithKey(state, key) {
      state.savedImageUrls.splice(key, 1);
   },
   mutateSavedImageUrls(state, payload) {
      state[payload.property] = payload.with;
   },

};
