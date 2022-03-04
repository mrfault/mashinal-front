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
    // gotoRoute() {
    //   if (this.announcement.user_id === this.$auth.user.id) {
    //     if (this.$auth.loggedIn && this.announcement.status != 3) {
    //       // console.log(this.announcement.user_id, this.$auth.user.id)
    //       this.$router.push(this.path)
    //     } else {
    //       this.$toasted.error('Sizin düzəliş etmə hüququnuz yoxdur')
    //     }
    //   } else {
    //     // this.$emit('openModal', true)
    //   }
    // },
    gotoRoute() {
      if (this.$auth.loggedIn) {
        if (
          this.announcement.user_id === this.$auth.user.id &&
          this.announcement.status != 3
        ) {
          this.$router.push(this.path)
        } else {
          this.$toasted.error('Sizin düzəliş etmə hüququnuz yoxdur')
        }
      } else {
        this.$emit('openModal', true)
      }
    },
  },
}
</script>
