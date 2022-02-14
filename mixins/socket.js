import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const SocketMixin = {
  methods: {
    configSocket() {
      if (window.Echo) return;
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'c4c2102447c08b6c126a',
        cluster: 'eu',
        //wsHost: this.$env.WS_HOST,
        forceTLS: true,
        authEndpoint: this.$env.BROADCAST_URL,
        auth: {
          headers: {
            Authorization: this.$auth.$storage.getUniversal('_token.local')
          },
        },
      });
    },
    connectEcho(channel = false, isPrivate = true) {
      return window.Echo[isPrivate ? 'private' : 'channel'](channel || ('user.'+ this.$auth.user.id));
    }
  }
}
