export const MenusDataMixin = {
  computed: {
    searchMenus() {
      return [
        { title: 'cars', route: '/cars' },
        { title: 'moto', route: '/moto', children: this.motoMenus },
        { title: 'commercial', route: '/commercial', children: this.commercialMenus }
      ]
    },

    navbarMenus() {
      return [
        ...this.searchMenus
      ]
    },

    topbarMenus() {
      return [
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'favorites', route: '/my/favorites', icon: 'star' },
        { title: 'templates', route: '/my/templates', icon: 'template' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' }
      ]
    },

    bottomMenus() {
      return [
        { title: 'search', route: '/', icon: 'search' },
        { title: 'favorites', route: '/my/favorites', icon: 'star' },
        { title: 'new_announce', route: '/sell', icon: 'plus' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' },
        { title: 'my_account', route: '/profile/settings', icon: 'user', hide: !this.loggedIn || this.user?.autosalon },
        { title: 'dashboard', route: '/profile/dashboard', icon: 'settings', hide: !this.loggedIn || !this.user?.autosalon },
        { title: 'login', route: '/login', icon: 'user', hide: this.loggedIn }
      ]
    },

    userMenus() {
      return this.user?.autosalon 
        ? [
          { title: 'dashboard', route: '/profile/dashboard' },
          { title: 'my_announcements', route: '/my/announcements' },
          { title: 'messages', route: '/profile/messages' },
          { title: 'statistics', route: '/profile/statistics' },
          // { title: 'pricing', route: '/profile/pricing' },
          { title: 'my_profile', route: '/profile/autosalon' },
          { title: 'payments', route: '/profile/payments' }
        ]  
        : [
          { title: 'settings', route: '/profile/settings' },
          { title: 'my_announcements', route: '/my/announcements' },
          { title: 'comparisons', route: '/comparison' },
          { title: 'messages', route: '/profile/messages' },
          { title: 'payments', route: '/profile/payments' }
        ];
    },

    sidebarMenus() {
      return [
        ...this.navbarMenus
      ]
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
        { title: 'commercial_utilities', route: '/commercial/'+this.$t('slug_utilities'), icon: 'commercial-12' }
      ]
    },

    motoMenus() {
      return [
        { title: 'motorcycles', route: '/moto/'+this.$t('slug_motorcycles'), icon: 'moto-1' },
        { title: 'scooters', route: '/moto/'+this.$t('slug_scooters'), icon: 'moto-2' },
        { title: 'atvs', route: '/moto/'+this.$t('slug_atvs'), icon: 'moto-3' }
      ]
    }
  }
}