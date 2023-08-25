import {mapGetters} from 'vuex';
import {RoutesMixin} from './routes';

export const MenusDataMixin = {
   mixins: [RoutesMixin],
   computed: {
      ...mapGetters(['commercialTypes']),

      searchMenus() {
         return [
            {id: 1, title: 'cars', api_key: "getBrands", route: '/cars', icon: 'car-1'},
            {id: 2, title: 'registration_marks', api_key: "fetchRegionNumbers", route: '/plates', icon: '/icons/registration_marks.svg'},
            {id: 3, title: 'commercial', api_key: "getBrands", route: '/commercial', children: this.commercialMenus, icon: 'commercial-1'},
            {id: 4, title: 'moto', api_key: "getMotoOptionsV2", route: '/moto', children: this.motoMenus, icon: 'moto-1'},
            {id: 5, title: 'parts', api_key: "getPartCategories", route: '/parts', children: this.partsMenus, icon: 'parts'}
         ];
      },

      pageMenus() {
         return [
            { title: 'feedback', route: '/contact-us', icon: 'contact-tab' },
            { title: 'policy', route: '/policy', icon: 'policy', showOnCard: true }
         ];
      },

      navbarMenus() {
         let announcementCategories =
            [
               {
                  title: 'cars',
                  route: '/cars',
                  children: [
                     { title: 'car_plural', route: '/cars', icon: 'car-1' },
                     { title: '360', route: '/cars?with_panorama=true', icon: 'camera360' }
                  ]
               },
               {title: 'moto', route: '/moto', children: this.motoMenus},
               {title: 'commercial', route: '/commercial', children: this.commercialMenus},
               {title: 'parts', route: '/parts', children: this.partsSubMenus},
            ];

         return [
            {
               icon: 'car-manat',
               title: 'dealer_all_announcements',
               route: '/cars',
               // children: [],
               // categories: announcementCategories
            },
            { icon: 'salons-tab', title: 'auto_salons', route: '/salons' },
            { icon: 'shops-tab', title: 'shops', route: '/parts/shops' },
            { title: 'registration_marks_min', route: '/plates' },
            { icon: '', title: 'parts', route: '/parts' },
            // {icon: 'catalog-tab', title: 'autocatalog', route: '/catalog'},
            // {icon: 'external-tab', title: 'external-salons', route: '/external-salons', with_badge: true},
            { icon: 'globe', title: 'eservices', route: '/e-services' }
         ]
      },

      footerMenus() {
         return [
            { title: 'announcements', route: '/cars' },
            { title: 'salons', route: '/salons' },
            { title: 'shops', route: '/parts/shops' },
            { title: 'autocatalog', route: '/catalog' },
            { title: 'eservices', route: '/e-services' },
            { title: 'external_salon', route: '/external-salons' },
            { title: 'policy', route: '/policy' },
            { title: 'feedback', route: '/contact-us' }
         ]
      },

      topbarMenus() {
         return [
            { title: 'comparisons', route: '/comparison', icon: 'compare-icon-new.svg' },
            { title: 'favorites', route: '/profile/favorites', icon: 'favorite.svg' },
            { title: 'templates', route: '/profile/templates', icon: 'receipt-search.svg' },
            { title: 'messages', route: '/profile/messages', icon: 'chat' },
            { title: 'notifications', route: '/notifications', icon: 'bell' }
         ];
      },

      bottomMenus() {
         return [
            {title: 'main', route: '/', icon: '/icons/home_2.svg'},
            {title: 'favorites', route: '/profile/favorites', icon: '/icons/favorites.svg'},
            {title: 'new_announce', route: '/sell', icon: '/icons/plus-circle-2.svg'},
            {title: 'messages', route: '/profile/messages', icon: '/icons/message.svg'},
            {title: 'garage', route: '/garage-services', icon: '/icons/user_2.svg', hide: !this.loggedIn},
            {title: 'login', route: '/login', icon: '/icons/user_2.svg', hide: this.loggedIn}
         ];
      },

      userMenus() {
         if (!this.loggedIn) return [];

         let menus = [
            {
               title: 'garage',
               route: '/profile/announcements',
               icon: 'garage-tab',
               showOnCard: !this.isMobileBreakpoint,
               isAvailable: true
            },
            // {
            //    title: 'control_panel_title', route: this.getUserSettingsLink, icon: 'user',
            //    showOnCard: this.isMobileBreakpoint,
            //    isAvailable: !!(this.user && (this.user.autosalon || this.user.part_salon || this.user.external_salon))
            // },
            // { title: 'my_announces', route: '/profile/announcements', icon: 'speaker', showOnCard: true },
            // { title: 'balans', route: '/profile/balance', icon: 'wallet', showOnCard: true }
         ];

         if (this.isMobileBreakpoint)
            menus.push(this.pageMenus.find(menu => menu.title === 'policy'));

         return menus;
      },

      sidebarMenus() {
         return [
            {title: 'garage', route: '/garage-services', icon: 'garage-tab'},
            {title: 'eservices', route: '/e-services', icon: 'globe'},
            {title: 'registration_marks', route: '/plates', with_badge: true},
            {title: 'salons', route: '/salons', icon: 'salons-tab'},
            {title: 'shops', route: '/parts/shops', icon: 'shops-tab'},
            {title: 'autocatalog', route: '/catalog', icon: 'catalog-tab'},
            {title: 'favorites', route: '/profile/favorites', icon: 'favorite.svg'},

            {title: 'comparisons', route: '/comparison', icon: 'compare-icon-white.svg'},
            {title: 'my_searches', route: '/profile/templates', icon: 'template', auth: true},
            {title: 'helper_search', route: '/cars/assistant', icon: 'helper-tab'},

            this.pageMenus.find(menu => menu.title === 'feedback')
         ].filter(menu => menu.dev && this.$env.DEV || !menu.dev)
      },

      commercialMenus() {
         return this.commercialTypes.map(type => ({
            title: `commercial_${type.param}`,
            route: '/commercial/' + this.$t(`slug_${type.param}`),
            icon: `commercial-${type.param}`,
            id: type.id
         }));
      },

      motoMenus() {
         return [
            {title: 'motorcycles', route: '/moto/' + this.$t('slug_motorcycles'), icon: 'moto-1', id: 1},
            {title: 'scooters', route: '/moto/' + this.$t('slug_scooters'), icon: 'moto-2', id: 2},
            {title: 'atvs', route: '/moto/' + this.$t('slug_atvs'), icon: 'moto-3', id: 3}
         ];
      },

      partsMenus() {
         return this.partsRoutes.filter(r => r.showOnMenu);
      },

      partsSubMenus() {
         return this.partsMenus.filter(r => r.slug !== '/');
      },

      hasSearchNav() {
         return [
            'index', 'cars', 'cars-vip', 'cars-premium', 'cars-assistant', 'cars-advanced-search',
            'moto', 'moto-moto', 'commercial', 'commercial-commercial', 'parts', 'parts-category'
         ].includes(this.routeName);
      },

      exceptions() {
         return [
            'calculator-customs', 'parts-shops-id'
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
            // 'parts-shops',
            '',
         ].includes(this.routeName);
      },

      hasShops() {
         return ['parts-category'
         ].includes(this.routeName);
      }
   }
}
