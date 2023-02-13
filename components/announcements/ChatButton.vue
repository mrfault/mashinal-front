<template>
    <button :class="['chat-button btn full-width', `btn--${className} `]" @click.stop="handleClick">
<!--        <icon name="chat"/>-->
        {{ $t('write') }}
        <img src="/icons/chat_new.svg" alt="chat_icon">
    </button>
</template>

<script>
    export default {
        props: {
            announcement: {},
            hasAfterLogin: Boolean,
            className: {
                default: ''
            }
        },
        methods: {
            handleClick() {
                if (!this.canSendMessage(this.announcement)) return;
                if (!this.loggedIn) {
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
            if (this.hasAfterLogin)
                this.$nuxt.$on('after-login', this.handleAfterLogin);
        },
        beforeDestroy() {
            if (this.hasAfterLogin)
                this.$nuxt.$off('after-login', this.handleAfterLogin);
        }
    }
</script>

<style lang="scss" scoped>
    .chat-button {
        height: 56px;
        background: #EFF4FF;
        border-radius: 6px;
        img {
            margin-left: 10px;
        }
    }
</style>