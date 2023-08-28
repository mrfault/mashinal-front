<template>
   <button :class="['deactivate-btn btn full-width', `btn--${className} `]" @click.stop="showDeactivateModal = true">
      {{ $t('inactive_make') }}

      <icon name="minus-circle"/>

      <modal-popup
         :modal-class="'deactivate'"
         :toggle="showDeactivateModal"
         :title="$t('are_you_sure_you_want_to_delete_the_announcement')"
         @close="showDeactivateModal = false"
      >
         <form class="form" @submit.prevent="deactivateAnouncement" novalidate>
            <button type="submit" :class="['btn btn--green full-width', { pending }]">
               {{ $t('confirm') }}
            </button>
         </form>
      </modal-popup>
   </button>
</template>

<script>
   import { mapActions } from 'vuex';

   export default {
      props: {
         announcement: {},
         className: {
            default: 'white'
         }
      },

      data() {
         return {
            showDeactivateModal: false,
            pending: false
         }
      },

      methods: {
         ...mapActions(['deactivateMyAnnounement']),

         async deactivateAnouncement() {
            if (this.pending) return;
            this.pending = true;
            try {
               await this.deactivateMyAnnounement(this.announcement.id_unique);
               await this.$nuxt.refresh();
               this.pending = false;
               this.showDeactivateModal = false;
            } catch (err) {
               this.pending = false;
            }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .deactivate-btn {
      height: 52px;
   }

   .dark-mode {
      .deactivate-btn {
         border-color: #1B2434;
         background-color: #1B2434;
      }
   }
</style>
