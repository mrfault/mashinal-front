<template>
   <button
      :class="['edit-btn btn full-width', `btn--${className} `]"
      @click="gotoRoute()"
   >
      <span>{{ $t('change_it_2') }}</span>

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
            // console.log('this.$route.params', this.type)
            if (this.type === 'plates') {
               // console.log('1')
               return this.$localePath(`/${this.type}/${this.$route.params.id}/edit`);
            } else {
               // console.log('2')
               return this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`);
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
               console.log('this.announcement', this.announcement)
               // this.changeEditPath(this.$route.params.id);
               // this.changeEditing(true);
               // this.changeEditPostAuthor(this.announcement.user_id);
               this.changeEditPostAuthor(this.announcement.user.id);
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
