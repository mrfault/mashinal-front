import {mapGetters} from 'vuex';
import Asan_login from "~/mixins/asan_login";

export const UserDataMixin = {
   mixins: [Asan_login],
   computed: {
      ...mapGetters(['countNewMessages', 'countNewNotifications']),

      getUserAvatar() {
         if (!this.loggedIn) return undefined;
         else if (this.user.avatar?.includes('/logo.jpg'))
            return `/img/salon-logo-${this.colorMode}.jpg`;
         else if (this.user.avatar)
            return this.$withBaseUrl(this.user.avatar, '/storage/');
         return '/img/user.jpg';
      },
      getUserSettingsLink() {
         if (!this.loggedIn) return this.$localePath('/login');
         // if (this.user.autosalon) {
         //    return '/profile/announcements'
         // }
         // if (this.user.part_salon) {
         //    return '/profile/announcements'
         // }
         // if (this.user.external_salon) {
         //    return '/profile/announcements'
         // }
         return '/profile/announcements';
      }
   },
   methods: {
      async logoutToParent() {
         this.$axios
            .$post('/logout_sub_account')
            .then(async (data) => {
               // track conversion
               this.$auth.setUser(data.user.original)

               await this.$auth.setUserToken(data.meta.token)
               this.$emit('setFinished', true)
               this.$nuxt.$emit('login', true)

               this.$nuxt.$emit('closeModal')

               this.$router.push('/my-autosalons')
            })
            .catch((err) => {
               this.pending = false
            })
      },
      async logout() {
         console.log('logout')
         this.$router.push(this.$localePath('/') + '?logout=true', async () => {
            this.$router.push(this.$localePath('/'));
            this.$auth.setUser(false);
            await this.$auth.logout();
            this.$nuxt.$emit('login', false);
            await localStorage.removeItem('registrationCount');
            await localStorage.removeItem('selectedPackage');
         });
      }
   },
}
