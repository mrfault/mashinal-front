<template>
   <button
      v-if="template === 'icon'"
      class="btn-transparent btn-favorite"
      :class="{'btn-favorite-active': isAdded, 'white-border' : whiteBorder}"
      @click.stop="handleClick()"
   >
   </button>

   <div
      v-else-if="template === 'btn'"
      class="favorite-btn btn"
      :class="[`btn--${btnClass}`]"
      @click.stop="handleClick()"
   >
      <span v-if="text">{{ text }}</span>

      <button
         v-if="template === 'btn'"
         class="btn-transparent btn-favorite white-border"
         :class="{'btn-favorite-active': isAdded, 'white-border' : whiteBorder}"
      />
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex';

   export default {
      props: {
         announcement: {},

         type: {
            type: String,
            default: 'announcement'
         },

         btnClass: {
            type: String,
            default: 'white'
         },

         template: {
            type: String,
            default: 'icon'
         },

         text: {
            type: String
         },

         whiteBorder: {
            type: Boolean,
            default: true
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
               await this.addToFavorites(this.announcement.id_unique);
               this.getNotViewedFavorites();
               // if (this.type === 'announcement') await this.$store.dispatch('getAnnouncementInnerV2', this.announcement.id);
               // await this.$store.dispatch('fetchMySavedPlates');
               // await this.$store.dispatch('fetchMySavedParts')
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
            // console.log('this.favorites', this.favorites)
            // console.log('this.announcement.id_unique', this.announcement.id_unique)
            return this.favorites.includes(this.announcement.id_unique);
         },
      },

      mounted() {
         this.$nuxt.$on('after-login', this.handleAfterLogin);
      },

      beforeDestroy() {
         this.$nuxt.$off('after-login', this.handleAfterLogin);
      }
   }
</script>

<style lang="scss">
   .btn-favorite {
      pointer-events: all;
      border: none;
      outline: none;
      width: 24px;
      height: 24px;
      background-image: url('../../static/icons/star-favorite2.svg');
      background-position: center;
      background-repeat: no-repeat;

      &.white-border {
         background-image: url('../../static/icons/star-favorite2-white-border.svg');

         &:hover {
            background-image: url('../../static/icons/star-favorite2-active.svg');
         }
      }

      &.btn-favorite-active {
         background-image: url('../../static/icons/star-favorite2-active.svg');
      }

      span {
         width: 100%;
         height: 100%;
      }
   }

   .favorite-btn {
      width: 100%;
      border-radius: 8px;

      span {
         font-size: 14px;
         color: #364152;
         margin-right: 5px;
         text-wrap: wrap;
         text-align: center;
      }

      button {
         &.white-border {
            background-image: url('../../static/icons/star-favorite2-black-border.svg');
         }

         &.btn-favorite-active {
            background-image: url('../../static/icons/star-favorite2-active-min.svg');
         }
      }

      &:hover {
         button {
            background-image: url('../../static/icons/star-favorite2-active-min.svg') !important;
         }
      }
   }

   .dark-mode {
      .favorite-btn {
         border-color: #1B2434;
         background-color: #1B2434;

         span {
            color: #EEF2F6;
         }

         .btn-favorite {
            background-image: url('../../static/icons/star-favorite2-white-border-min.svg');
         }

         &:hover {
            button {
               background-image: url('../../static/icons/star-favorite2-active-min.svg') !important;
            }
         }

         button {
            &.btn-favorite-active {
               background-image: url('../../static/icons/star-favorite2-active-min.svg') !important;
            }
         }
      }
   }
</style>
