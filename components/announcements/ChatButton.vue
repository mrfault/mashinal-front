<template>
   <button :class="['chat-button btn full-width', `btn--${className}`]" @click.stop="handleClick">
      {{ $t('write') }}
      <icon name="chat" />
   </button>
</template>

<script>
   export default {
      props: {
         announcement: {},
         hasAfterLogin: Boolean,
         className: {
            default: 'blue-new-light-3'
         }
      },

      methods: {
         handleClick() {
            if (!this.canSendMessage(this.announcement)) return;

            if (!this.loggedIn) {
               this.$nuxt.$emit('login-popup', 'chat');
            } else {
               this.createMessagesGroup(this.announcement.user.id, this.announcement.id_unique);
            }
         },

         handleAfterLogin(key) {
            if (key === 'chat') this.handleClick();
         }
      },

      mounted() {
         if (this.hasAfterLogin) this.$nuxt.$on('after-login', this.handleAfterLogin);
      },

      beforeDestroy() {
         if (this.hasAfterLogin) this.$nuxt.$off('after-login', this.handleAfterLogin);
      }
   }
</script>

<style lang="scss" scoped>
   .chat-button {
      font-size: 13px;
      height: 56px;
   }

   .dark-mode {
      .chat-button {
         color: #EEF2F6;
         border-color: #121926;
         background-color: #121926;

         &:hover {
            border-color: #155EEF;
         }
      }
   }
</style>
