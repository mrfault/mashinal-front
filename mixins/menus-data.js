import { mapGetters } from 'vuex';

export const MenusDataMixin = {
  data(){
    return {
      topbarMenus: [
        { title: 'comparisons', route: '/comparison', icon: 'compare' },
        { title: 'favorites', route: '/my/favorites', icon: 'star' },
        { title: 'templates', route: '/my/templates', icon: 'template' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' }
      ],
      bottomMenus: [
        { title: 'search', route: '/', icon: 'search' },
        { title: 'favorites', route: '/my/favorites', icon: 'star' },
        { title: 'new_announce', route: '/sell', icon: 'plus' },
        { title: 'messages', route: '/profile/messages', icon: 'chat' },
        { title: 'my_account', route: '/profile/settings', icon: 'user', hide: !this.loggedIn || this.user?.autosalon },
        { title: 'dashboard', route: '/profile/dashboard', icon: 'user', hide: !this.loggedIn || !this.user?.autosalon },
        { title: 'login', route: '/login', icon: 'user', hide: this.loggedIn }
      ],
      userMenus: [
        { title: 'settings', route: '/profile/settings' },
        { title: 'my_announcements', route: '/my/announcements' },
        { title: 'comparisons', route: '/comparison' },
        { title: 'messages', route: '/profile/messages' },
        { title: 'payments', route: '/profile/payments' }
      ],
      autosalonMenus: [
        { title: 'dashboard', route: '/profile/dashboard' },
        { title: 'my_announcements', route: '/my/announcements' },
        { title: 'messages', route: '/profile/messages' },
        { title: 'statistics', route: '/profile/statistics' },
        // { title: 'pricing', route: '/profile/pricing' },
        { title: 'my_profile', route: '/profile/autosalon' },
        { title: 'payments', route: '/profile/payments' }
      ]
    }
  },
  computed: {
    ...mapGetters(['navbarMenus']),

    getUserMenus() {
      return this.user?.autosalon ? this.autosalonMenus : this.userMenus;
    }
  }
}