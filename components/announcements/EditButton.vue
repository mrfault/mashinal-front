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
import { mapGetters, mapActions, mapMutations } from 'vuex';
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
    ...mapGetters(['editPath']),
  },
  methods: {
    ...mapMutations(['changeEditPath', 'changeEditing','changeEditPostAuthor']),
    gotoPath(){
      if (!this.$auth.loggedIn) {

      }
    },
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
      }
      //--------------------------
      else {
        // this.changeEditPath(this.$route.params.id);
        // this.changeEditing(true);
        // this.changeEditPostAuthor(this.announcement.user_id);
        this.changeEditPostAuthor(this.announcement.user_id);
        this.$router.push(this.$route.path+'?ref='+this.path)
        this.$emit('openModal', true)
      }
    },
  },
}
</script>
