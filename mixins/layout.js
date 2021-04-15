import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const LayoutMixin = {
  data() {
    return {
      isMobileDevice: false,
      vhVariableSet: false
    }
  },
  methods: {
    configSocket() {
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'any',
        wsHost: this.$env.socketIp,
        wsPort: 6001,
        wssPort: 6001,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        forceTLS: true,
        auth: {
          headers: {
            Authorization: this.$auth.$storage.getUniversal('_token.laravelJWT')
          },
        },
      });
      window.Echo.connector.pusher.config.authEndpoint = this.$env.broadcastUrl;
    },
    appendToMessage(data) {
      this.$store.commit('appendToMessage', { group: data.group, message: data.message });
      if(this.routeName === 'profile-messages') return;
      // show notification
      this.$toasted.success(this.$t('you_have_got_a_message'), { 
        action: { 
          text: this.$t('read'),
          onClick : (e, toast) => {
            let groupId = data.group.recipient_id == this.user.id ? data.group.sender_id : data.group.recipient_id;
            let announceId = data.group.announce_id;
            let announceType, announceSecondType, type = data.group.announce_type;
            if(type === 'App\\Announcement') announceType='car';
            if(type === 'App\\Motorcycle') announceSecondType='moto';
            if(type === 'App\\Scooter') announceSecondType='scooters';
            if(type === 'App\\MotoAtv') announceSecondType='moto_second';
            if(type === 'App\\Commercial') announceType='commercial';
            if(!announceSecondType) announceSecondType = announceType;
            if(!announceType) announceType = 'moto';
            this.createMessagesGroup(groupId, { announceId, announceType, announceSecondType });
            toast.goAway(0);
          }
        }
      });
    },
    toggleEchoListening(toggle) {
      if (toggle) {
        if (!window.Echo) this.configSocket();
        this.connectEcho().listen('SendMessage', this.appendToMessage);
      } else if (window.Echo) {
        this.connectEcho().stopListening('SendMessage');
      }
    },
    async getUserData() {
      if(!this.$store.state.messages.length)
        await this.$store.dispatch('getMessages');
      await this.$store.dispatch('getSavedAnnouncements');
    },
    handleResize() {
      if(this.vhVariableSet && this.isMobileDevice) return;
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      this.vhVariableSet = true;
    },
    showUnreadMessagesToast() {
      if(!this.routeName === 'profile-messages' && this.unreadMessageGroupCount > 0) {
        this.$toasted.success(this.$t('you_have_got_a_message'), { 
          action: { 
            text: this.$t('read'),
            onClick: (e, toast) => {
              this.$router.push(this.$localePath('profile-messages'));
              toast.goAway(0);
            }
          }
        });
      }
    }
  },
  watch: {
    async userLoggedIn(auth) {
      this.toggleEchoListening(auth);
      if(auth) {
        await this.getUserData();
        this.showUnreadMessagesToast();
      }
    }
  },
  async mounted() {
    this.isMobileDevice = [
      /iPhone/i,/iPad/i,/iPod/i,
      /Android/i,/BlackBerry/i,/Windows Phone/i
    ].some(os => navigator.userAgent.match(os));

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    if (this.userLoggedIn) {
      this.toggleEchoListening(true);
      await this.getUserData();
    }
  },
  beforeDestroy() {
    this.toggleEchoListening(false);
    window.removeEventListener('resize', this.handleResize);
  }
}