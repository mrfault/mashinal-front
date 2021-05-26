<template>
  <button :class="['btn full-width', `btn--${className} `]" @click.stop="handleClick">
    <icon name="chat" /> {{ $t('write') }}
  </button>
</template>

<script>
export default {
  props: {
    announcement: {},
    hasAfterLogin: Boolean,
    className: {
      default: 'dark-blue-2-outline'
    }
  },
  methods: {
    handleClick() {
      if (!this.canSendMessage(this.announcement)) return;
      if(!this.loggedIn) {
        this.$nuxt.$emit('login-popup', 'chat')
      } else {
        this.createMessagesGroup(this.announcement.user.id, this.announcement.id_unique);
      }
    },
    handleAfterLogin(key) {
      if (key === 'chat') this.handleClick();
    }
  },
  mounted() {
    if(this.hasAfterLogin) 
      this.$nuxt.$on('after-login', this.handleAfterLogin);
  },
  beforeDestroy() {
    if(this.hasAfterLogin) 
      this.$nuxt.$off('after-login', this.handleAfterLogin);
  }
}
</script>