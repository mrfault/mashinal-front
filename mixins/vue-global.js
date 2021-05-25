import Vue from 'vue';

import { mapGetters } from 'vuex';

Vue.use({
  install(Vue) {
    Vue.mixin({
      methods: {
        // messages
        async createMessagesGroup(recipientId = false, announce = false){
          if (!recipientId && !announce) return;
          if (!announce.announceType && !announce.announceSecondType && !announce.announceId) return;
          let data = await this.$store.dispatch('createMessagesGroup', { recipientId, announce });
          this.$router.push(this.$localePath('profile-messages') + '?group=' + data.id);
        },
        // tracking events with fb pixel
        fbTrack(eventName, options) {
          if(this.$env.DEV) {
            console.log('fb pixel track "' + eventName + '"', options ? JSON.stringify(options) : '');
          } else {
            if(!this.$fb) console.warn('fb pixel not setted');
            else if(options) this.$fb.track(eventName, options);
            else this.$fb.track(eventName);
          }
        },
        // tracking events with gtag manager
        gtagTrack(eventKey) {
          if(this.$env.DEV) {
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
        // other
        scrollTo(el, offset = 0, duration = 500) {
          if(el === 0) el = 'body';
          if (typeof el === 'string' && !document.querySelector(el)) return;
          if (typeof offset === 'object') offset = this.isMobileBreakpoint ? offset[0] : offset[1];
          offset += (this.isMobileBreakpoint ? -60 : -141);
          this.$scrollTo(el, duration, { offset });
        },
        setBodyOverflow(value = 'auto') {
          let bodyEl = document.querySelector('body');
          let scrollBarWidth = window.innerWidth - bodyEl.clientWidth;
          bodyEl.style.paddingRight = `${value === 'hidden' ? scrollBarWidth : 0}px`;
          bodyEl.style.overflowX = value === 'scroll' ? 'auto' : value;
          bodyEl.style.overflowY = value;
        },
        getAnnouncementTitle(item) {
          if (item.car_catalog)
            return item.car_catalog.brand.name + ' ' + this.$translateHard(item.car_catalog.model.name);
          else if (item.scooter_brand)
            return item.scooter_brand.name + ' ' + item.scooter_model.name;
          else if (item.moto_atv_brand)
            return item.moto_atv_brand.name + ' ' + item.moto_atv_model.name;
          else if (item.moto_brand)
            return item.moto_brand.name + ' ' + item.moto_model.name;
          else if (item.commercial_brand)
            return this.$translateSoft(item.commercial_brand.name) + ' ' + this.$translateSoft(item.commercial_model.name);
          else if (item.part_category?.name)
            return this.$translateSoft(item.part_category.name);
          return '';
        },
        canSendMessage(item) {
          return !this.loggedIn || (item.user.id === this.user.id);
        }
      },
      computed: {
        ...mapGetters(['loggedIn', 'user', 'colorMode', 'breakpoint']),

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
        },
        isMobileBreakpoint() {
          return ['xs', 'sm', 'md'].includes(this.breakpoint);
        },
        isMobileDevice() {
          if(!navigator.userAgent) return false;
          return [/iPhone/i,/iPad/i,/iPod/i,/Android/i,/BlackBerry/i,/Windows Phone/i]
            .some(os => navigator.userAgent.match(os));
        },
        isDarkMode() {
          return this.colorMode === 'dark';
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