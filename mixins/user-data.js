import { mapGetters } from 'vuex';

export const UserDataMixin = {
  computed: {
    ...mapGetters(['countNewMessages']),
    
    getUserAvatar() {
      if (!this.loggedIn) return undefined;
      else if (this.user.avatar?.includes('/logo.jpg')) 
        return `/img/salon-logo-${this.colorMode}.jpg`;
      else if (this.user.avatar)
        return this.$withBaseUrl(`/storage/${this.user.avatar}`);
      return '/img/user.jpg';
    },
    getUserSettingsLink() {
      if (!this.loggedIn) return this.$localePath('/login');
      return '/profile';
    }
  },
  methods: {
    async logout() {
      this.$router.push(this.$localePath('/') + '?logout=true', async () => {
        this.$router.push(this.$localePath('/'));
        this.$auth.setUser(false);
        await this.$auth.logout();
        this.$nuxt.$emit('login', false);
      });
    }
  },
}