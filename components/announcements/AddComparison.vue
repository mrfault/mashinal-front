<template>
   <div class="white-background" v-if="template === 'icon'">
      <button
         class="btn-compare btn-transparent"
         :class="{ 'btn-compare-active': isActive }"
         @click.prevent.stop="handleClick()"
      ></button>
   </div>

   <div
      v-else-if="template === 'btn'"
      class="compare-btn"
      :class="[`btn--${btnClass}`]"
      @click.stop="handleClick()"
   >
      <span>{{ text }}</span>

      <button
         v-if="template === 'btn'"
         class="btn-compare btn-transparent"
         :class="{'btn-compare-active': isActive}"
      />
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';

   export default {
      props: {
         id: {
            type: [Number, String],
            required: false
         },

         type: {
            type: String,
            required: false,
            default: 'announcement',
            validator(val) {
               return ['announcement', 'model'].includes(val)
            }
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
         }
      },

      methods: {
         async handleClick() {
            if (this.type === 'announcement') {
               if (this.announcementsList.findIndex(a => a.id_unique === this.id) >= 0) {
                  this.$toasted.success(this.$t('comparison_removed'))
               } else {
                  if (this.limit === this.announcementsList.length) {
                     this.$toasted.error(this.$t('reached_the_limit_announcement'))
                  } else {
                     this.$toasted.success(this.$t('comparison_added'))
                  }
               }
               await this.$store.dispatch('comparison/toggleAnnouncement', this.id)
            } else {
               if (this.modelsList.findIndex(a => a.id === this.id) >= 0) {
                  this.$toasted.success(this.$t('comparison_removed'))
               } else {
                  if (this.limit === this.modelsList.length) {
                     this.$toasted.error(this.$t('reached_the_limit_model'))
                  } else {
                     this.$toasted.success(this.$t('comparison_added'))
                  }
               }
               await this.$store.dispatch('comparison/toggleModel', this.id)
            }
         }
      },

      computed: {
         ...mapGetters({
            announcementsList: 'comparison/announcementsList',
            announcementIds: 'comparison/announcementIds',
            modelsList: 'comparison/modelsList',
            limit: 'comparison/limit',
         }),
         isActive() {
            if (this.type === 'announcement') {
               return this.announcementIds.findIndex(aId => aId === this.id) >= 0
            } else {
               return this.modelsList.findIndex(model => model.id === this.id) >= 0
            }
         }
      }
   }
</script>

<style lang="scss">
   .compare-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-radius: 8px;
      transition: all .3s;
      cursor: pointer;

      span {
         font-size: 14px;
         color: #364152;
         margin-right: 7px;
      }

      &:hover {
         button {
            background-image: url('../../static/icons/compare-active.svg');
         }
      }
   }

   .btn-compare {
      pointer-events: all;
      border: none;
      outline: none;
      width: 24px;
      height: 24px;
      background-image: url('../../static/icons/compare-icon.svg');
      background-size: contain;
      background-repeat: no-repeat;

      span {
         width: 100%;
         height: 100%;
      }

      &:hover {
          background-image: url('../../static/icons/compare-active.svg');
       }
   }

   .btn-compare-active {
      background-image: url('../../static/icons/compare-active.svg');
   }

   .dark-mode {
      .compare-btn {
         border-color: #1B2434;
         background-color: #1B2434;

         span {
            color: #EEF2F6;
         }

         .btn-compare {
            background-image: url('../../static/icons/compare-icon-white.svg');

            &.btn-compare-active {
               background-image: url('../../static/icons/compare-active.svg');
            }
         }

         &:hover {
            button {
               background-image: url('../../static/icons/compare-active.svg') !important;
            }
         }
      }
   }
</style>
