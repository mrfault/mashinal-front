import { mapGetters } from 'vuex';
import Asan_login from "~/mixins/asan_login";

export const UserDataMixin = {
  mixins:[Asan_login],
  computed: {
    ...mapGetters(['countNewMessages','countNewNotifications']),

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
      return '/profile/settings';
    }
  },
  methods: {
    async logout() {
      this.$router.push(this.$localePath('/') + '?logout=true', async () => {
        this.$router.push(this.$localePath('/'));
        this.$auth.setUser(false);
        await this.$auth.logout();
        await this.asanLogout();
        this.$nuxt.$emit('login', false);
      });
    }
  },
}
