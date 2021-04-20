export const UserDataMixin = {
  computed: {
    getUserAvatar() {
      if (!this.loggedIn) return undefined;
      else if (this.user.avatar?.includes('/logo.jpg')) 
        return '/img/autosalon-logo.jpg';
      else if (this.user.avatar)
        return `${this.$env.baseUrl}/storage/${this.user.avatar}`;
      return '/img/user.jpg';
    },
    getUserSettingsLink() {
      if (!this.loggedIn) return this.$localePath('/login');
      return this.$localePath(this.user.autosalon ? '/profile/dashboard' : '/profile/settings');
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    }
  }
}