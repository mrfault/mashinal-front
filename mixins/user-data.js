export const UserDataMixin = {
  computed: {
    getUserAvatar() {
      if (!this.loggedIn) return undefined;
      else if (this.user.avatar?.includes('/logo.jpg')) 
        return '/img/autosalon-logo.jpg';
      else if (this.user.avatar)
        return `${this.$env.BASE_URL}/storage/${this.user.avatar}`;
      return '/img/user.jpg';
    },
    getUserSettingsLink() {
      if (!this.loggedIn) return this.$localePath('/login');
      return this.$localePath(this.user.autosalon ? '/profile/dashboard' : '/profile');
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push(this.$localePath('/'), () => {
        this.$nuxt.$emit('login', false);
      });
    }
  },
}