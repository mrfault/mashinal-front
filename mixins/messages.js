import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const MessagesMixin = {
  methods: {
    configSocket() {
      if (window.Echo) return;
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
        authEndpoint: this.$env.broadcastUrl,
        auth: {
          headers: {
            Authorization: this.$auth.$storage.getUniversal('_token.laravelJWT')
          },
        },
      });
    },
    connectEcho(channel = false) {
      return window.Echo.private(channel || ('user.'+ this.$auth.user.id));
    },
    toggleEchoListening(toggle) {
      if (toggle) {
        this.connectEcho().listen('SendMessage', this.appendToMessage);
      } else if(window.Echo) {
        this.connectEcho().stopListening('SendMessage');
      }
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
  }
}