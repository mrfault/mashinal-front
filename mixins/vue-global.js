import Vue from 'vue';

import { mapState } from 'vuex';

Vue.use({
  install(Vue) {
    Vue.mixin({
      methods: {
        connectEcho(channel = false) {
          return window.Echo.private(channel || ('user.'+ this.$auth.user.id));
        },
        // messages
        async createMessagesGroup(recipientId = false, announce = false){
          if (!recipientId && !announce) return;
          if (!announce.announceType && !announce.announceSecondType && !announce.announceId) return;
          let data = await this.$store.dispatch('createMessagesGroup', { recipientId, announce });
          this.$router.push(this.$localePath('profile-messages') + '?group=' + data.id);
        },
        // tracking events with fb pixel
        fbTrack(eventName, options) {
          if(this.$env.isDev) {
            console.log('fb pixel track "' + eventName + '"', options ? JSON.stringify(options) : '');
          } else {
            if(!this.$fb) console.warn('fb pixel not setted');
            else if(options) this.$fb.track(eventName, options);
            else this.$fb.track(eventName);
          }
        },
        // tracking events with gtag manager
        gtagTrack(eventKey) {
          if(this.$env.isDev) {
            console.log('gtag track "' + eventKey + '"');
          } else {
            if(!this.$gtag) console.warn('gtag not setted');
            else this.$gtag('event', 'conversion', { send_to: eventKey });
          }
        },
        // masks
        maskPhone(inline = false) {
          let mask = '+\\9\\94 (99) 999-99-99';
          return inline ? mask : { mask, showMaskOnHover: false };
        },
        maskEmail() {
          return {
            alias: 'email',
            showMaskOnHover: false, 
            showMaskOnFocus: false
          }
        },
      },
      computed: {
        ...mapState(['loggedIn', 'user']),

        routeName() {
          return this.getRouteBaseName();
        },
        locale() {
          return this.$i18n.locale;
        },
        locales() {
          return this.$i18n.locales.map(locale => locale.code);
        },
        currentYear() {
          return new Date().getFullYear();
        }
      },
      filters: {
        truncate(text, length, suffix = '...') {
          if (text.length > length) return text.substring(0, length) + suffix;
          return text;
        },
      }
    })
  }
});