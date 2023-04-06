<template>
  <!-- <div>
    <button
      :class="['btn-sq btn-sq--color-dark-blue', { active: isAdded }]"
      @click.stop="handleClick()"
      v-if="announcement.status !== 2"
    >
      <icon name="star-favorite" />
    </button> -->
  <div class="white-background">
<!--     <pre>{{announcement}}</pre>-->
    <button
      class="btn-transparent btn-favorite"
      :class="{ 'btn-favorite-active': isAdded }"
      @click.stop="handleClick()"
      v-if="announcement.status !== 2"
    ><i></i></button>
  </div>

  <!-- </div> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    announcement: {},
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
        await this.addToFavorites(this.announcement.id_unique);
        await this.getNotViewedFavorites();
        await this.$store.dispatch('getAnnouncementInner', this.announcement.id_unique);
        await this.$store.dispatch('fetchMySavedPlates');
        this.$nuxt.$emit('favorites-updated');
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
