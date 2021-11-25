import { mapGetters } from 'vuex';
import { RoutesMixin } from './routes';

export const MenusDataMixin = {
  mixins: [RoutesMixin],
  computed: {
    ...mapGetters(['commercialTypes']),

    searchMenus() {
      return [
        { title: 'cars', route: '/cars', icon: 'car-1' },
        { title: 'moto', route: '/moto', children: this.motoMenus, icon: 'moto-1' },
        { title: 'commercial', route: '/commercial', children: this.commercialMenus, icon: 'commercial-1' },
        { title: 'parts', route: '/parts', children: this.partsMenus, icon: 'parts' }
      ];
    },

    pageMenus() {
      return [
        { title: 'contact_us', route: '/contact-us', icon: 'phone-call' },
        { title: 'policy', route: '/policy', icon: 'policy' }
      ];
    },

    navbarMenus() {
      let announcementCategories = [
        { title: 'cars', route: '/cars', children: [{ title: 'car_plural', route: '/cars', icon: 'car-1' }] },
        { title: 'moto', route: '/moto', children: this.motoMenus },
        { title: 'commercial', route: '/commercial', children: this.commercialMenus }
      ]
      return [
        { title: 'announcements', route: '/cars', children: [], categories: announcementCategories },
        { title: 'parts', route: '/parts', children: this.partsSubMenus },
        { title: 'autocatalog', route: '/catalog' },
        { title: 'salons', route: '/salons' }
      ]
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
        { title: 'my_account', route: '/profile', icon: 'user', hide: !this.loggedIn },
        { title: 'login', route: '/login', icon: 'user', hide: this.loggedIn }
      ];
    },

    userMenus() {
      if (!this.loggedIn) return [];

      let menus = [
        { title: 'user_information', route: '/profile', showOnCard: false },
        { title: 'my_announces', route: '/profile/announcements', showOnCard: true },
        { title: 'balans', route: '/profile/balance', showOnCard: true }
      ];

      if (this.user.autosalon)
        menus.push({ title: 'dashboard_salon', route: '/dashboard/1', showOnCard: true });
      if (this.user.part_salon)
        menus.push({ title: 'dashboard_shop', route: '/dashboard/2', showOnCard: true });

      return menus;
    },

    sidebarMenus() {
      return [
        { title: 'home_page', route: '/', icon: 'home' },
        { title: 'garage', route: '/garage', icon: 'garage', dev: true },
        { title: 'salons', route: '/salons', icon: 'store' },
        { title: 'autocatalog', route: '/catalog', icon: 'book' },
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'helper_search', route: '/cars/assistant', icon: 'flag' },
        { title: 'my_searches', route: '/profile/templates', icon: 'template', auth: true },
        ...this.pageMenus
      ].filter(menu => menu.dev && this.$env.DEV || !menu.dev)
    },

    commercialMenus() {
      return this.commercialTypes.map(type => ({ 
        title: `commercial_${type.param}`, 
        route: '/commercial/'+this.$t(`slug_${type.param}`), 
        icon: `commercial-${type.param}`,
        id: type.id
      }));
    },

    motoMenus() {
      return [
        { title: 'motorcycles', route: '/moto/'+this.$t('slug_motorcycles'), icon: 'moto-1', id: 1 },
        { title: 'scooters', route: '/moto/'+this.$t('slug_scooters'), icon: 'moto-2', id: 2 },
        { title: 'atvs', route: '/moto/'+this.$t('slug_atvs'), icon: 'moto-3', id: 3 }
      ];
    },

    partsMenus() {
      return this.partsRoutes.filter(r => r.showOnMenu);
    },
    
    partsSubMenus() {
      return [
        { title: 'parts', route: '/parts', icon: 'parts' },
        { title: 'shops', route: '/parts/shops', icon: 'store' }
      ]
    },

    hasSearchNav() {
      return [
        'index', 'cars', 'cars-vip', 'cars-premium', 'cars-assistant', 'cars-advanced-search',
        'moto', 'moto-moto', 'commercial','commercial-commercial','parts','parts-category'
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
