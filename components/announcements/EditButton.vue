<template>
  <button
    :class="['btn full-width', `btn--${className} `]"
    @click="gotoRoute()"
  >
    <icon name="edit" />
    {{ $t('edit') }}
  </button>
</template>

<script>
export default {
  props: {
    announcement: {},
    type: String,
    className: {
      default: 'dark-blue',
    },
  },
  computed: {
    path() {
      return this.$localePath(
        `/${this.type}/announcement/${this.$route.params.id}/edit`,
      )
    },
  },
  methods: {
    gotoRoute() {
        if (
          this.$auth.loggedIn && 
          this.announcement.status != 3 &&
          this.announcement.user_id === this.$auth.user.id
        ) {
          console.log(this.announcement.user_id, this.$auth.user.id)
          this.$router.push(this.path)
        } else {
          this.$toasted.error('Sizin düzəliş etmə hüququnuz yoxdur')
        }
    },
  },
}
</script>
