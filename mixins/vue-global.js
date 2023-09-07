import Vue from 'vue';

import {mapGetters, mapActions, mapMutations} from 'vuex';

Vue.use({
   install(Vue) {
      Vue.mixin({
         methods: {
            ...mapMutations(['mutate']),
            ...mapActions(['setPageRef']),

            // messages
            async createMessagesGroup(recipientId = false, announceId = false) {
               if (!recipientId && !announceId) return;
               let data = await this.$store.dispatch('createMessagesGroup', {recipientId, announceId});
               this.$router.push(`${this.$localePath('/profile/messages')}?group=${data.id}`);
            },
            // tracking events with fb pixel
            fbTrack(eventName, options) {
               try {
                  if (this.$env.DEV) {
                     // console.log('fb pixel track "' + eventName + '"', options ? JSON.stringify(options) : '');
                  } else {
                     if (!this.$fb) console.warn('fb pixel not setted');
                     else if (options) this.$fb.track(eventName, options);
                     else this.$fb.track(eventName);
                  }
               } catch (e) {
               }

            },
            // tracking events with gtag manager
            gtagTrack(eventKey) {
               if (this.$env.DEV) {
                  // console.log('gtag track "' + eventKey + '"');
               } else {
                  if (!this.$gtag) console.warn('gtag not setted');
                  else this.$gtag('event', 'conversion', {send_to: eventKey});
               }
            },
            // copy text to clipboard
            copyToClipboard(text) {
               text = window.document.URL;
               try {
                  navigator.clipboard.writeText(text);
                  this.$toasted.success(this.$t('copied_to_clipboard'));
               } catch (error) {
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
                  } catch (error) {
                     console.error(error);
                  }
               }
            },
            // other
            scrollTo(el, offset = 0, duration = 500, container = 'body') {
               if (document.body.classList.contains('mobile-screen-open')) container = '.mobile-screen > .container';

               if (el === 0) el = 'body';

               if (typeof el === 'string' && !document.querySelector(el)) return;

               if (typeof offset === 'object') offset = this.isMobileBreakpoint ? offset[0] : offset[1];

               // offset = (this.isMobileBreakpoint ? -60 : -141);
               this.$scrollTo(el, duration, {offset, container});
            },

            scrollReset() {
               window.scrollTo(0, 0);
            },

            setBodyOverflow(value = 'auto', className) {
               let bodyEl = document.body;
               if (!bodyEl) return;
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
               for (; el && el !== document; el = el.parentNode) {
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
               else if (item.moto_atv_model) return item.moto_atv_model.name;
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
               // console.log('item', item)
               let img = item?.user?.avatar,
                   name = item?.user?.full_name,
                   link = false;

               if (item?.is_auto_salon) {
                  console.log('1')
                  img = item?.user?.is_auto_salon?.logo;
                  link = this.$localePath(`/salons/${item?.user?.auto_salon?.slug}`);
                  name = item?.user?.is_auto_salon?.name || item?.user?.full_name;
               } else if (item?.is_external_salon) {
                  console.log('2', item)
                  img = item?.user?.external_salon?.logo;
                  link = this.$localePath(`/external-salons/${item?.user?.external_salon?.slug}`);
                  name = item?.user?.external_salon?.name || item?.user?.full_name;
               } else if (item?.is_part_salon) {
                  console.log('3')
                  img = item?.user?.part_salon?.logo;
                  link = this.$localePath(`/parts/shops/${item?.user?.part_salon?.slug}`);
                  name = item?.user?.part_salon?.name || item?.user?.full_name;
               } else if (item?.user?.active_announcements_count > 1) {
                  console.log('4')
                  link = this.$localePath(`/user/${item?.user?.id}/announcements`);
               } else {
                  console.log('5')
                  link = this.$localePath(`/user/${item?.user?.id}/announcements`);
               }

               return {
                  type: 'user',
                  user: item?.user,
                  id: item?.user?.id,
                  name: name,
                  link: link,
                  phone: item?.user?.phone,
                  address: item?.address,
                  img: (item?.is_auto_salon || item?.is_part_salon || item?.is_external_salon)
                     ? (!img || img?.includes('/images/') ? `/img/salon-logo-${this.colorMode}.jpg` : this.$withBaseUrl(img))
                     : (this.$withBaseUrl(img, '/storage/') || '/img/user.jpg'),
                  lat: item.latitude ? parseFloat(item.latitude) : 0,
                  lng: item.longitude ? parseFloat(item.longitude) : 0
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
               if (item.moto_brand) return 'Motorcycle';
               else if (item.scooter_brand) return 'Scooter';
               else if (item.moto_atv_brand) return 'Atv';
               else if (item.commercial_brand) return 'Commercial';
               else if (item.car_catalog) return 'Car';
               else if (item.title) return 'Part';
               else if (item.type === 6) return 'Plate';
               return '';
            },
            getAnnouncementTextLine(item) {
               if (['Part'].includes(this.getAnnouncementType(item))) return item.description;
               let text = `${item.year} ${this.$t('plural_forms_year')[0]}`;
               if (this.getAnnouncementCapacity(item)) text += `, ${this.getAnnouncementCapacity(item)}`;
               text += `, ${this.$readNumber(item.mileage)} ${this.$t('char_kilometre')}`;
               return text;
            },
            getAnnouncementCapacity(item) {
               let type = this.getAnnouncementType(item);
               let capacity = item.car_catalog?.capacity || item.capacity;
               let showLitres = ['Car', 'Commercial'].includes(type);
               if (!capacity || capacity == '0') return false;
               if (showLitres && capacity > 50) capacity = (capacity / 1000).toFixed(1);
               return `${capacity} ${this.$t(showLitres ? 'char_litre' : 'char_sm_cube')}`;
            },
            canSendMessage(item) {
               return !this.loggedIn || (item?.user?.id !== this.user?.id);
            },
            userIsOwner(item) {
               return this.loggedIn && (item?.user?.id === this.user?.id);
            },
            salonIsOwner(item) {
               return this.loggedIn && (item.id === this.user.autosalon?.id || item.id === this.user.part_salon?.id);
            },
            showMonetization(item) {
               return item.status == 1;
            }
         },
         computed: {
            ...mapGetters(['loggedIn', 'user', 'colorMode', 'breakpoint', 'pageRef']),
            interiorOptions() {
               return [
                  {key: false, name: this.$t('exterior')},
                  {key: true, name: this.$t('interior')},
               ];
            },
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
               return ['xs', 'sm'].includes(this.breakpoint);
               // return ['xs', 'sm', 'md'].includes(this.breakpoint);
            },
            isMobileDevice() {
               if (!navigator.userAgent) return false;
               return [/iPhone/i, /iPad/i, /iPod/i, /Android/i, /BlackBerry/i, /Windows Phone/i]
                  .some(os => navigator.userAgent.match(os));
            },
            isPortraitOrientation() {
               return window?.matchMedia('(orientation: portrait)').matches || false;
            },
            isDarkMode() {
               return this.colorMode === 'dark';
            },
            btlCookie() {
               return this.$cookies.get('btl');
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
