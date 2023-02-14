<template>
    <!-- <div>
      <button
        :class="['btn-sq btn-sq--color-dark-blue', { active: isAdded }]"
        @click.stop="handleClick()"
        v-if="announcement.status !== 2"
      >
        <icon name="star-favorite" />
      </button> -->
    <!--  <div class="white-background">-->
    <button
        class="btn-favorite btn-transparent"
        :class="{ 'btn-favorite-active': isAdded }"
        @click.stop="handleClick()"
        v-if="announcement.status !== 2"
    >
        <span v-if="text">{{ text }}</span>

        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.449 5.12803C16.449 2.83564 14.8818 1.91667 12.6253 1.91667H7.32623C5.1391 1.91667 3.5 2.77298 3.5 4.97515V17.245C3.5 17.8498 4.15079 18.2308 4.67794 17.9351L9.99624 14.9518L15.2686 17.93C15.7966 18.2274 16.449 17.8465 16.449 17.2408V5.12803Z" stroke="#364152" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!--        <i></i>-->
    </button>
    <!--  </div>-->

    <!-- </div> -->
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        props: {
            announcement: {},
            text: {
                type: String
            },
            img: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            ...mapActions(['addToFavorites', 'getNotViewedFavorites']),

            async handleClick(skipIfAdded = false) {
                if (skipIfAdded && this.isAdded) return
                if (!this.loggedIn) {
                    this.$nuxt.$emit(
                        'login-popup',
                        'favorite' + this.announcement.id_unique,
                    )
                } else {
                    await this.addToFavorites(this.announcement.id_unique)
                    this.getNotViewedFavorites()
                    this.$store.dispatch(
                        'getAnnouncementInner',
                        this.announcement.id_unique,
                    )
                    this.$nuxt.$emit('favorites-updated')
                    if (this.isAdded) {
                        this.$toasted.success(this.$t('my_favorites_added'), {
                            action: !this.routeName === 'profile-favorites' && {
                                text: this.$t('show'),
                                onClick: () => {
                                    this.$router.push(this.$localePath('/profile/favorites'))
                                },
                            },
                        })
                    } else {
                        this.$toasted.success(this.$t('my_favorites_removed'))
                    }
                }
            },
            handleAfterLogin(key) {
                if (key === 'favorite' + this.announcement.id_unique)
                    this.handleClick(true)
            },
        },
        computed: {
            ...mapGetters(['favorites']),

            isAdded() {
                return this.favorites.includes(this.announcement.id_unique)
            },
        },
        mounted() {
            this.$nuxt.$on('after-login', this.handleAfterLogin)
        },
        beforeDestroy() {
            this.$nuxt.$off('after-login', this.handleAfterLogin)
        },
    }
</script>
