import Vue from 'vue';

import { mapGetters, mapActions, mapMutations } from 'vuex';

Vue.use({
  install(Vue) {
    Vue.mixin({
      methods: {
        ...mapMutations(['mutate']),
        ...mapActions(['setPageRef']),

        // messages
        async createMessagesGroup(recipientId = false, announceId = false){
          if (!recipientId && !announceId) return;
          let data = await this.$store.dispatch('createMessagesGroup', { recipientId, announceId });
          this.$router.push(`${this.$localePath('/profile/messages')}?group=${data.id}`);
        },
        // tracking events with fb pixel
        fbTrack(eventName, options) {
          if (this.$env.DEV) {
            console.log('fb pixel track "' + eventName + '"', options ? JSON.stringify(options) : '');
          } else {
            if (!this.$fb) console.warn('fb pixel not setted');
            else if (options) this.$fb.track(eventName, options);
            else this.$fb.track(eventName);
          }
        },
        // tracking events with gtag manager
        gtagTrack(eventKey) {
          if (this.$env.DEV) {
            console.log('gtag track "' + eventKey + '"');
          } else {
            if (!this.$gtag) console.warn('gtag not setted');
            else this.$gtag('event', 'conversion', { send_to: eventKey });
          }
        },
        // copy text to clipboard
        copyToClipboard(text) {
          try {
            navigator.clipboard.writeText(text);
            this.$toasted.success(this.$t('copied_to_clipboard'));
          } catch(error) {
            console.error(error);
            try {
              let tempInput = document.createElement('input');
              tempInput.type = 'text';
              tempInput.value = text;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('Copy');
              document.body.removeChild(tempInput);
              this.$toasted.success(this.$t('copied_to_clipboard'));
            } catch(error) {
              console.error(error);
            }
          }
        },
        // other
        scrollTo(el, offset = 0, duration = 500, container = 'body') {
          if (document.body.classList.contains('mobile-screen-open')) 
            container = '.mobile-screen';
          if (el === 0) el = 'body';
          if (typeof el === 'string' && !document.querySelector(el)) return;
          if (typeof offset === 'object') offset = this.isMobileBreakpoint ? offset[0] : offset[1];
          offset += (this.isMobileBreakpoint ? -60 : -141);
          this.$scrollTo(el, duration, { offset, container });
        },
        scrollReset() {
          window.scrollTo(0, 0);
        },
        setBodyOverflow(value = 'auto', className) {
          let bodyEl = document.querySelector('body');
          let scrollBarWidth = window.innerWidth - bodyEl.clientWidth;
          let mobileScreenOpen = bodyEl.classList.contains('mobile-screen-open') && className !== 'mobile-screen-open';
          let mobileScreen = document.querySelector('.mobile-screen');
          if (className) bodyEl.classList[value === 'hidden' ? 'add' : 'remove'](className);
          if (mobileScreenOpen && !mobileScreen) return;
          (mobileScreenOpen ? mobileScreen : bodyEl).style.paddingRight = `${value === 'hidden' ? scrollBarWidth : 0}px`;
          (mobileScreenOpen ? mobileScreen : bodyEl).style.overflowX = value === 'scroll' ? 'auto' : value;
          (mobileScreenOpen ? mobileScreen : bodyEl).style.overflowY = value;
        },
        getParentByClassName(el, className) {
          el = typeof el === 'string' ? document.querySelector(el) : el;
          for( ; el && el !== document; el = el.parentNode) {
            if (el.classList.contains(className)) return el;
          }
          return null;
        },
        getAnnouncementBrandName(item) {
          if (item.car_catalog) return (item.car_catalog.brand || item.brand).name;
          else if (item.scooter_brand) return item.scooter_brand.name;
          else if (item.moto_atv_brand) return item.moto_atv_brand.name;
          else if (item.moto_brand) return item.moto_brand.name;
          else if (item.commercial_brand) return this.$translateSoft(item.commercial_brand.name);
          else if (item.brand) return item.brand.name;
          return '';
        },
        getAnnouncementModelName(item) {
          if (item.car_catalog) return this.$translateHard((item.car_catalog.model || item.model).name);
          else if (item.scooter_model) return item.scooter_model.name;
          else if (item.moto_atv_model) return item.moto_atv_brand.name;
          else if (item.moto_model) return item.moto_model.name;
          else if (item.commercial_model) return this.$translateSoft(item.commercial_model.name);
          else if (item.model) return this.$translateHard(item.model.name);
          return '';
        },
        getAnnouncementTitle(item) {
          if (item.title) return item.title;
          let brand = this.getAnnouncementBrandName(item);
          let model = this.getAnnouncementModelName(item);
          if (!brand && !model) return '';
          return (brand || '') + ' ' + (model || '');
        },
        getAnnouncementContact(item) {
          return {
            type: 'user',
            user: item.user,
            id: item.user.id,
            name: item.user.full_name,
            phone: item.user.phone,
            address: item.address,
            img: item.user.avatar ? this.$withBaseUrl(`/storage/${item.user.avatar}`) : '',
            lat: item.latitude ? parseFloat(item.latitude) : 0,
            lng: item.longitude ? parseFloat(item.longitude) : 0,
            link: item.is_autosalon ? this.$localePath(`/salons/${item.user.autosalon.id}`) : false
          };
        },
        getAnnouncementImage(item) {
          return item.media.main_inner ? item.media.main_inner[0] : item.media[Object.keys(item.media)[0]][0];
        },
        canSendMessage(item) {
          return !this.loggedIn || (item.user.id !== this.user.id);
        },
        userIsOwner(item) {
          return this.loggedIn && item.user.id === this.user.id;
        }
      },
      computed: {
        ...mapGetters(['loggedIn', 'user', 'colorMode', 'breakpoint', 'pageRef']),

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
          if (!navigator.userAgent) return false;
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