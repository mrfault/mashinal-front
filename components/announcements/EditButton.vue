<template>
   <button
      :class="['edit-btn btn full-width', `btn--${className} `]"
      @click="gotoRoute()"
   >
      <span>{{ $t('edit') }}</span>

      <inline-svg src="/icons/edit.svg" />
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
         }
      },

      computed: {
         ...mapGetters(['editPath']),

         path() {
            if (this.type === 'plates') {
               return this.$localePath(`/${this.type}/${this.$route.params.id}/edit`);
            } else {
               return this.$localePath(`/${this.type}/announcement/${this.$route.params.id}/edit`);
            }
         }
      },

      methods: {
         ...mapMutations(['changeEditPath', 'changeEditing', 'changeEditPostAuthor']),

         // gotoPath() {
         //    if (!this.$auth.loggedIn) {
         //
         //    }
         // },

         gotoRoute() {
            if (this.$auth.loggedIn) {
               if (this.announcement.user.id === this.$auth.user.id && this.announcement.status != 3) {
                  this.$router.push(this.path)
               } else {
                  this.$toasted.error('Sizin düzəliş etmə hüququnuz yoxdur')
               }
            } else {
               // this.changeEditPath(this.$route.params.id);
               // this.changeEditing(true);
               // this.changeEditPostAuthor(this.announcement.user_id);
               this.changeEditPostAuthor(this.announcement.user_id);
               this.$router.push(this.$route.path + '?ref=' + this.path)
               this.$emit('openModal', true)
            }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .edit-btn {
      border-radius: 8px;
   }

   .dark-mode {
      .edit-btn {
         border-color: #1B2434;
         background-color: #1B2434;

         span {
            color: #EEF2F6;
         }
      }
   }
</style>
