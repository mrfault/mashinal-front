<template>
   <div ref="actionsRef" class="announcement-actions">
      <div class="announcement-actions__button" @click.prevent="toggleOpen">
         <inline-svg src="/new-icons/fi_more-horizontal.svg"/>
      </div>
      <div v-if="isOpen" class="announcement-actions__content">
         <template v-for="(item, index) in options">

            <div v-if="item.show" :key="index" class="announcement-actions__content--item" @click="item.method(item)">
               <inline-svg :src="`/new-icons/grid/${item.icon}`"/>
               <p>{{ $t(item.name) }}</p>
            </div>
         </template>
      </div>

      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :title="$t(modal.title)"
         :toggle="showModal"
         @close="closeModal">
         <div class="remove-vehicle-modal">
            <div class="protocol-payment-modal__actions">
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="showModal = false"
               >
                  {{ $t('reject') }}
               </button>
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
               >
                  {{ $t(modal.buttonText) }}
               </button>
            </div>

         </div>
      </modal-popup>
   </div>
</template>

<script>
export default {
   props: {
      announcement: Object,
   },
   data() {
      return {
         isOpen: false,
         pending: false,
         showModal: false,
         modal: {
            title: '',
            buttonText: '',
            method: null,
         }
      };
   },
   computed: {
      options() {
         return [
            {
               name: 'inactive_make',
               icon: 'fi_minus-circle.svg',
               show: this.announcement.status == 1,
               method: this.openModal,
               modalTitle: 'are_you_sure_you_want_to_deactivate_the_announcement',

            },
            {
               name: 'restore_free',
               icon: 'fi_check-square.svg',
               show: this.announcement.status == 3,
               method: this.restore,
               modalTitle: 'restore_announcement'
            },

            {
               name: 'edit',
               icon: 'notification.svg',
               show: this.announcement.status == 1,
               method: this.edit,
            },
            {
               name: 'remove_announcement',
               icon: 'trash.svg',
               show: true,
               method: this.openModal,
               modalTitle: 'are_you_sure_you_want_to_delete_the_car'
            },
         ]
      },
      type() {
         switch (this.announcement.type) {
            case 'motorcycle':
               return 'moto'
            default:
               this.announcement.type
         }
      }
   },
   methods: {
      toggleOpen() {
         this.isOpen = !this.isOpen;
         if (this.isOpen) {
            document.addEventListener('click', this.onClickOutside);
         }
      },
      onClickOutside(event) {
         if (!this.$refs.actionsRef.contains(event.target)) {
            this.isOpen = false;
            document.removeEventListener('click', this.onClickOutside);
         }
      },

      openModal(item) {
         if (item.openDirectyly){
            item.method();
         }else{
            this.modal.title = item.modalTitle;
            this.modal.method = item.method;
            this.modal.buttonText = item.name;
            this.showModal = true;
         }

      },
      closeModal(){
         this.showModal = false;
         this.modal = {
            title: '',
            buttonText: '',
            method: null,
         }
      },

      async deactivate() {
         try {
            await this.$store.dispatch('deactivateMyAnnounement', this.announcement.id_unique);
            await this.$nuxt.refresh();
            this.$emit('deactivateMyAnnounement');
            this.$toasted.success(this.$t('vehicle_deactivated'))
         } catch (e) {
            this.$toasted.error(this.$t('something_went_wrong'))
         }

      },
      async delete() {
         try {
            await this.$store.dispatch('deactivateMyAnnounement', this.announcement.id_unique);
            await this.$nuxt.refresh();
            this.$emit('deleteMyAnnounement');
            this.$toasted.success(this.$t('vehicle_deleted'))
         } catch (e) {
            this.$toasted.error(this.$t('something_went_wrong'))
         }
      },
      async restore() {
         try {
            await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`)
            await this.$nuxt.refresh();
            this.$emit('restoredMyAnnounement');
            this.$toasted.success(this.$t('announcement_restored'))
         } catch (e) {
            this.$toasted.error(this.$t('something_went_wrong'))
         }
      },
      edit() {
         this.$router.push(this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`))
      }

   },
};
</script>


<style lang="scss">
.announcements-grid__item {
   .announcement-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 2;

      &__button {
         background: #fff;
         border-radius: 4px;
         width: 28px;
         height: 24px;
         display: flex;
         justify-content: center;
         align-items: center;
      }

      &__content {
         position: absolute;
         top: calc(100% + 10px);
         border-radius: 8px;
         background: #fff;
         padding: 8px;
         min-width: 152px;

         &--item {
            padding: 12px 8px;
            background: #fff;
            display: flex;
            align-items: center;
            border-radius: 8px;

            svg {
               margin-right: 8px;
               width: 20px;
               height: 20px;
            }

            p {
               font: 500 16px/20px 'TTHoves';
               color: #364152;
            }

            &:hover {
               background: #E3E8EF;
            }
         }
      }

   }
}
</style>
