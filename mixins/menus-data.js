import { mapGetters } from 'vuex';

export const MenusDataMixin = {
  computed: {
    ...mapGetters(['navbarMenus']),

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
    }
  }
}