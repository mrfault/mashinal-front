import { mapGetters } from 'vuex';
import { RoutesMixin } from './routes';

export const MenusDataMixin = {
  mixins: [RoutesMixin],
  computed: {
    ...mapGetters(['staticPages']),

    searchMenus() {
      return [
        { title: 'cars', route: '/cars', icon: 'car-1' },
        { title: 'moto', route: '/moto', children: this.motoMenus, icon: 'moto-1' },
        { title: 'commercial', route: '/commercial', children: this.commercialMenus, icon: 'commercial-1' }
      ];
    },

    announcementsMenus() {
      return [
        ...this.searchMenus,
        { title: 'parts', route: '/parts', children: this.partsMenus, icon: 'parts' }
      ];
    },

    pageMenus() {
      return [{
        title: 'contact_us',
        route: '/contact-us',
        icon: 'phone-call'
      }].concat(this.staticPages.map(page => ({
        title: page.title, 
        route: '/page/'+page.slug[this.locale],
        icon: 'policy'
      })));
    },

    navbarMenus() {
      return [
        ...this.searchMenus,
        { title: 'parts', route: '/parts', children: this.$env.DEV ? this.partsSubMenus : false },
        { title: 'autocatalog', route: '/catalog' },
        { title: 'salons', route: '/salons', dev: true }
      ].filter(item => !item.dev || this.$env.DEV);
    },

    topbarMenus() {
      return [
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'favorites', route: '/profile/favorites', icon: 'star' },
        { title: 'templates', route: '/profile/templates', icon: 'template' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' }
      ];
    },

    bottomMenus() {
      return [
        { title: 'search', route: '/', icon: 'search' },
        { title: 'favorites', route: '/profile/favorites', icon: 'star' },
        { title: 'new_announce', route: '/sell', icon: 'plus' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' },
        { title: 'my_account', route: '/profile', icon: 'user', hide: !this.loggedIn || this.user?.autosalon },
        { title: 'dashboard_brief', route: '/profile/dashboard', icon: 'settings', hide: !this.loggedIn || !this.user?.autosalon },
        { title: 'login', route: '/login', icon: 'user', hide: this.loggedIn }
      ];
    },

    userMenus() {
      return this.user?.autosalon 
        ? [
          { title: 'dashboard', route: '/profile/dashboard', showOnCard: false },
          { title: 'my_announces', route: '/profile/announcements', showOnCard: true },
          { title: 'messages', route: '/profile/messages', showOnCard: false },
          { title: 'statistics', route: '/profile/statistics', showOnCard: false },
          { title: 'my_profile', route: '/profile/salon', showOnCard: false },
          { title: 'payment_history', route: '/profile/payments', showOnCard: true },
          { title: 'balans', route: '/profile/balance', showOnCard: true }
        ]  
        : [
          { title: 'settings', route: '/profile/settings', showOnCard: false },
          { title: 'my_announces', route: '/profile/announcements', showOnCard: true },
          { title: 'comparisons', route: '/comparison', showOnCard: false },
          { title: 'messages', route: '/profile/messages', showOnCard: false },
          { title: 'payment_history', route: '/profile/payments', showOnCard: true },
          { title: 'balans', route: '/profile/balance', showOnCard: true }
        ];
    },

    sidebarMenus() {
      return [
        { title: 'salons', route: '/salons', icon: 'store', dev: true },
        { title: 'parts', route: '/parts', icon: 'parts' },
        { title: 'autocatalog', route: '/catalog', icon: 'book' },
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'helper_search', route: '/cars/assistant', icon: 'flag' },
        { title: 'my_searches', route: '/profile/templates', icon: 'template', auth: true },
        ...this.pageMenus
      ].filter(item => !item.dev || this.$env.DEV);
    },

    commercialMenus() {
      return [
        { title: 'commercial_light', route: '/commercial/'+this.$t('slug_light'), icon: 'commercial-1' }, 
        { title: 'commercial_trucks', route: '/commercial/'+this.$t('slug_trucks'), icon: 'commercial-2' }, 
        { title: 'commercial_tractors', route: '/commercial/'+this.$t('slug_tractors'), icon: 'commercial-3' }, 
        { title: 'commercial_bus', route: '/commercial/'+this.$t('slug_bus'), icon: 'commercial-4' }, 
        { title: 'commercial_trailers', route: '/commercial/'+this.$t('slug_trailers'), icon: 'commercial-5' }, 
        { title: 'commercial_agricultural', route: '/commercial/'+this.$t('slug_agricultural'), icon: 'commercial-6' }, 
        { title: 'commercial_building', route: '/commercial/'+this.$t('slug_building'), icon: 'commercial-7' }, 
        { title: 'commercial_autoloader', route: '/commercial/'+this.$t('slug_autoloader'), icon: 'commercial-8' }, 
        { title: 'commercial_cranes', route: '/commercial/'+this.$t('slug_cranes'), icon: 'commercial-9' }, 
        { title: 'commercial_excavators', route: '/commercial/'+this.$t('slug_excavators'), icon: 'commercial-10' }, 
        { title: 'commercial_bulldozers', route: '/commercial/'+this.$t('slug_bulldozers'), icon: 'commercial-11' }, 
        { title: 'commercial_utilities', route: '/commercial/'+this.$t('slug_utilities'), icon: 'commercial-13' }
      ];
    },

    motoMenus() {
      return [
        { title: 'motorcycles', route: '/moto/'+this.$t('slug_motorcycles'), icon: 'moto-1' },
        { title: 'scooters', route: '/moto/'+this.$t('slug_scooters'), icon: 'moto-2' },
        { title: 'atvs', route: '/moto/'+this.$t('slug_atvs'), icon: 'moto-3' }
      ];
    },

    partsMenus() {
      return this.partsRoutes.filter(r => r.showOnMenu);
    },
    
    partsSubMenus() {
      return [
        { title: 'parts', route: '/parts', dev: true },
        { title: 'shops', route: '/parts/shops', dev: true }
      ].filter(item => !item.dev || this.$env.DEV);
    },

    hasSearchNav() {
      return [
        'index', 'cars', 'cars-vip', 'cars-premium', 'cars-assistant', 'cars-advanced-search',
        'moto', 'moto-moto', 'commercial','commercial-commercial'
      ].includes(this.routeName);
    },
    
    hasProfileData() {
      return [
        'profile', 'profile-settings'
      ].includes(this.routeName);
    },
    
    hasDashboardPanel() {
      return [
        'profile', 'profile-settings', 'profile-dashboard', 'profile-calls', 'profile-statistics'
      ].includes(this.routeName);
    },

    hasSearchFilters() {
      return [
        'salons', 'parts-shops'
      ].includes(this.routeName);
    },

    hasShops() {
      return [
        'parts', 'parts-category'
      ].includes(this.routeName);
    }
  }
}
