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
            if(el.classList.contains(className)) return el;
          }
          return null;
        },
        getAnnouncementBrandName(item) {
          if (item.car_catalog) return (item.car_catalog.brand || item.brand).name;
          else if (item.scooter_brand) return item.scooter_brand.name;
          else if (item.moto_atv_brand) return item.moto_atv_brand.name;
          else if (item.moto_brand) return item.moto_brand.name;
          else if (item.commercial_brand) return this.$translateSoft(item.commercial_brand.name);
          return '';
        },
        getAnnouncementModelName(item) {
          if (item.car_catalog) return (item.car_catalog.model || item.model).name;
          else if (item.scooter_model) return item.scooter_model.name;
          else if (item.moto_atv_model) return item.moto_atv_brand.name;
          else if (item.moto_model) return item.moto_model.name;
          else if (item.commercial_model) return this.$translateSoft(item.commercial_model.name);
          return '';
        },
        getAnnouncementTitle(item) {
          if (item.title) return item.title;
          return this.getAnnouncementBrandName(item) + ' ' + this.getAnnouncementModelName(item);
        },
        getAnnouncementContact(item) {
          return {
            type: 'user',
            user: item.user,
            id: item.user.id,
            name: item.user.full_name,
            phone: item.user.phone,
            address: item.address,
            img: item.user.avatar ? `${this.$env.BASE_URL}/storage/${item.user.avatar}` : '',
            lat: item.latitude ? parseFloat(item.latitude) : 0,
            lng: item.longitude ? parseFloat(item.longitude) : 0,
            link: item.is_autosalon ? this.$localePath(`/salons/${item.user.autosalon.id}`) : false
          };
        },
        getAnnouncementImage(item) {
          if (item.media.main_inner) {
            return item.media.main_inner[0]
          } else if (item.media[0] instanceof Object) {
            return item.media[0][Object.keys(item.media[0])[0]];
          } else {
            return item.media[Object.keys(item.media)[0]][0];
          }
        },
        getAnnouncementType(item) {
          if(item.moto_brand) return 'Motorcycle';
          else if(item.scooter_brand) return 'Scooter';
          else if(item.moto_atv_brand) return 'Atv';
          else if(item.commercial_brand) return 'Commercial';
          else if(item.car_catalog) return 'Car';
          else if(item.title) return 'Part';
          return '';
        },
        getAnnouncementTextLine(announcement) {
          if (['Part'].includes(this.getAnnouncementType(announcement))) return announcement.description;
          let text = `${announcement.year} ${this.$t('plural_forms_year')[0]}`;
          if (this.getAnnouncementCapacity(announcement)) text += `, ${this.getAnnouncementCapacity(announcement)}`;
          text += `, ${this.$readNumber(announcement.mileage)} ${this.$t('char_kilometre')}`;
          return text;
        },
        getAnnouncementCapacity(item) {
          if(item.car_catalog && (!item.car_catalog.capacity || item.car_catalog.capacity === '0')) 
            return false;
          let capacity = item.car_catalog 
            ? item.car_catalog.capacity // show 0.1 L if value less than 50 sm3
            : (item.capacity && item.capacity > 50) ? (((item.capacity) / 1000).toFixed(1)) : item.capacity; 
          let show_litres = item.car_catalog || (item.capacity && item.capacity > 50);
          return capacity ? `${capacity} ${this.$t(show_litres ? 'char_litre' : 'char_sm_cube')}` : false;
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