import {mapActions, mapGetters} from 'vuex'
import {ColorModeMixin} from '~/mixins/color-mode'
import {SocketMixin} from '~/mixins/socket'
import {MessagesMixin} from '~/mixins/messages'

export const LayoutMixin = {
  mixins: [ColorModeMixin, SocketMixin, MessagesMixin],
  data() {
    return {
      vhVariableSet: false,
      showLoginPopup: false,
      loginActionKey: '',
      windowWidth: null,
      loginInitialForm: {},
      scrollTimeout: null,
      latestScroll: 0,
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'messages',
      'paidStatusData',
      'hideFooter',
      'notifications',
      'notificationsNew',
    ]),
  },
  watch: {
    $route() {
      this.checkEmitting++;
      this.$store.commit('mutate', {
        property: 'timestamp',
        value: new Date().getTime()
      })
      this.handleHideMenu();
    }
  },
  methods: {
    ...mapActions([
      'setLoading',
      'setGridBreakpoint',
      'getMessages',
      // 'getNotifications',
      'getNotificationsNew',
      'getFavorites',
      'resetSellTokens',
      'resetUserData',
      'updatePaidStatus',
      'getNotViewedSavedSearch',
      'getNotViewedFavorites',
    ]),

    handleResize() {
      // update grid breakpoint
      this.windowWidth = window.innerWidth;
      let breakpoint = false
      ;['xs', 'sm', 'md', 'lg', 'xl'].map((name) => {
        let value = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--breakpoint-' + name)
        if (window.matchMedia('(min-width: ' + value + ')').matches) {
          breakpoint = name
        }
      })
      if (breakpoint !== this.breakpoint) {
        this.setGridBreakpoint(breakpoint)
      }
      // set calculated vh variable
      if (this.vhVariableSet && this.isMobileDevice) return
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      this.vhVariableSet = true

    },
    completelyHide(el) {
      var position = el.getBoundingClientRect();

      // checking whether fully visible
      if (position.top >= 0 && position.bottom <= window.innerHeight) {
        el.classList.add('d-none');
      }
    },
    showMenu(el) {
      if(el) {
        el.style.top = "0px";
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          el.classList.remove('z-index-1')
          // el.classList.remove('d-none')
        }, 400);
      }
    },
    hideMenu(el) {
      el.classList.add('z-index-1')
      el.style.top = '-90px'
      clearTimeout(this.scrollTimeout);
      // this.scrollTimeout = setTimeout(() => el.classList.add('d-none') ,400);
    },
    handleHideMenu() {
      let cordY = window.scrollY;
      let headerElDesktopWhite = document.querySelector('.navbar-white')
      if (cordY > 350) {
        if (this.latestScroll > cordY)
          this.showMenu(headerElDesktopWhite)
        else
          this.hideMenu(headerElDesktopWhite)

      } else {
        this.showMenu(headerElDesktopWhite)
      }

      this.latestScroll = cordY;
    },
    handleBnScroll() {
      if (window.scrollY > 110 && !this.$store.state.bnFixed) {

        this.$store.commit('mutate', {
          property: 'bnFixed',
          value: true,
        })

      } else if (window.scrollY < 111 && this.$store.state.bnFixed) {
        this.$store.commit('mutate', {
          property: 'bnFixed',
          value: true,
        })
      }
    },
    handleScroll() {

      let scrolled = window.scrollY
      this.handleHideMenu()
      let layout = document.querySelector('.layout')
      // header

      let promotionEl = document.querySelector('.top-promotion-row')

      promotionEl?.classList[window.scrollY > 0 ? 'add' : 'remove']('d-none')
      // setTimeout(() => {
      //   headerElDesktopWhite?.classList[window.scrollY > 0 ? 'add' : 'remove'](
      //     'd-none',
      //   )
      // }, 2000)

      // header white desktop
      // footer
      let footerEl = document.querySelector('.page-footer')
      if (footerEl) {
        this.$nextTick(() => {
          let reachedFooter =
            window.pageYOffset + window.innerHeight >= footerEl.offsetTop
          let noScroll =
            document.documentElement.clientHeight === window.innerHeight
          layout.classList[
            (scrolled > 0 || noScroll) && reachedFooter ? 'add' : 'remove'
            ]('reached-footer')
          layout.classList[scrolled > 0 ? 'add' : 'remove']('scrolled')
        })
      }
    },
    // login
    toggleEchoListening(toggle) {
      if (toggle) {
        this.connectEcho().listen('SendMessage', this.addNewMessage)
        this.connectEcho('offer-user.' + this.$auth.user.id).listen('OfferMessageSendEvent', ({message}) => {
          if (message.offer_id !=  this.$store.state.current_offer_id){
            this.$store.commit('IncrementMessageCount', message)
          }

          if (message.offer_id ==  this.$store.state.current_offer_id) {
            this.$store.commit('appendOfferMessage', message)

            this.$store.dispatch('readOfferMessage',{id:message.id})



          }


          if (message.files.length > 1) {
            const sleep = () => {
              this.scrollTo('.his:last-child >.message-files:last-child >.message-file', 300, 500, '.offerDetail')
            }
            setTimeout(sleep, 100)
          } else {
            setTimeout(() => {
              this.scrollTo('.his:last-child', 0, 500, '.offerDetail')
            }, 1000)

          }

        })
        this.connectEcho('global-channel.' + this.$auth.user.id).listen(
          'GlobalFrontEndEvent',
          ({data}) => {
            data.map((value) => {
              this.$store.dispatch(value)
            })
          },
        )
      } else if (window.Echo) {
        this.connectEcho('offer-user.' + this.$auth.user.id).stopListening('OfferMessageSendEvent')
        this.connectEcho().stopListening('SendMessage')
      }
    },
    async getUserData() {
      if (!this.loggedIn) return
      if (!this.messages.length) await this.getMessages()
      if (!this.notificationsNew.length) await this.getNotificationsNew()
      await Promise.all([
        this.getNotViewedSavedSearch(),
        this.getNotViewedFavorites(),
      ])
    },
    closeLogin() {
      this.showLoginPopup = false
      this.loginActionKey = ''
    },
    handleAfterLogin() {
      let key = this.loginActionKey
      this.closeLogin()
      this.resetSellTokens()
      if (key) this.$nuxt.$emit('after-login', key)
    },
    // registerSW() {
    //   if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('./sw.js');
    //   }
    // }
  },
  created() {
    //this.getUserData();

    this.$nuxt.$on('login', (auth) => {
      this.getUserData()
      if (!auth) {
        // reset store auth data
        this.resetUserData()
      }
    })
  },
  mounted() {


    this.$nextTick(() => {
      this.handleHideMenu();
      this.configSocket()
      if (this.loggedIn) this.toggleEchoListening(true)

      this.$nuxt.$on('login', (auth) => {
        if (auth) this.handleAfterLogin()
        this.toggleEchoListening(auth)
      })

      this.$nuxt.$on('login-popup', (key, form = {}) => {
        if (this.loggedIn) return
        this.showLoginPopup = true
        this.loginActionKey = key
        this.$set(this, 'loginInitialForm', form)
      })
      window.addEventListener('scroll', this.handleBnScroll)
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('resize', this.handleScroll)
      window.addEventListener('scroll', this.handleScroll)
      // window.addEventListener('load', this.registerSW);
       this.handleResize()
      setTimeout(() => {

        this.handleScroll()
        this.pickColorMode()
        // check payment status
        if (['true', 'false'].includes(this.$route.query.success)) {
          let type = this.$route.query.success === 'true' ? 'success' : 'error'
          this.updatePaidStatus({
            type,
            title: this.$t(`${type}_payment`),
            text: '', //this.$t(`${type}_payment_msg`)
          })
        }
        // strange behavior of loading prop which is not updating
        // in v-show directive without changing key sometimes
        this.setLoading(false)
      }, 0)
      //
      //
      // var observer = new IntersectionObserver(function(entries) {
      //   console.log('run')
      //   // if(entries[0].isIntersecting !== true)
      //   //   entries[0].target.style.display = "none"
      // }, { threshold: [0] });
      //
      // observer.observe(document.querySelector(".navbar-white"));
    })
  },
  beforeDestroy() {
    if (this.loggedIn) this.toggleEchoListening(false)

    this.$nuxt.$off(['login', 'login-popup'])

    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('resize', this.handleScroll)
    window.removeEventListener('scroll', this.handleScroll)
    // window.removeEventListener('load', this.registerSW);
  },
}
