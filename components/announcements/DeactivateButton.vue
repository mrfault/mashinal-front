<template>
   <button :class="['deactivate-btn btn full-width', `btn--${className} `]" @click.stop="showDeactivateModal = true">
      {{ $t('inactive_make') }}

      <icon name="minus-circle"/>

      <modal-popup
         :modal-class="'deactivate'"
         :toggle="showDeactivateModal"
         :title="$t('are_you_sure_you_want_to_deactivate_the_announcement')"
         @close="showDeactivateModal = false"
      >
         <form class="form" @submit.prevent="deactivateAnouncement" novalidate>
            <div class="protocol-payment-modal__actions">
               <button
                  type="button"
                  class="btn btn--white btn-dark-text"
                  @click.stop="showDeactivateModal = false"
               >{{ $t('reject') }}</button>

               <button
                  type="submit"
                  class="btn btn--white btn-dark-text"
               >{{ $t('inactive_make') }}</button>
            </div>

<!--            <button type="button" class="btn btn&#45;&#45;white btn-dark-text">-->
<!--               İmtina et-->
<!--            </button>-->
<!--            -->
<!--            <button type="submit" :class="['btn btn&#45;&#45;green full-width', { pending }]">-->
<!--               {{ $t('confirm') }}-->
<!--            </button>-->
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
         ...mapActions(['deactivateMyAnnounement', 'deactivateMyAnnouncementV2']),

         async deactivateAnouncement() {
            if (this.pending) return;
            this.pending = true;
            try {

               if (this.announcement.type === 'plate_number') {
                  await this.deactivateMyAnnouncementV2(this.announcement.id);
               } else {
                  await this.deactivateMyAnnounement(this.announcement.id_unique);
               }

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
