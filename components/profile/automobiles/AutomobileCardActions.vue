<template>
   <div class="automobile-card-actions">
      <div ref="actionsRef" class="announcement-actions ">
         <div class="announcement-actions__button" @click="toggleOpen">
            <inline-svg src="/new-icons/dots-vertical-new.svg"/>
         </div>
         <div v-if="isOpen" class="announcement-actions__content">
            <template v-for="(item, index) in options">
               <div :key="index" class="announcement-actions__content--item" @click="item.method(item)">
                  <inline-svg :src="`/new-icons/grid/${item.icon}`"/>
                  <p>{{ $t(item.name) }}</p>
               </div>
            </template>
         </div>

         <modal-popup
            :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
            :title="$t(modal.title)"
            :toggle="showOptions"
            @close="showOptions = false">
            <div>
               <div class="w-100">
                  <template v-for="(item, index) in options">

                     <div v-if="item.show" :key="index" class="announcement-actions__content--item w-100"
                          @click="item.method(item)">
                        <inline-svg :src="`/new-icons/grid/${item.icon}`"/>
                        <p>{{ $t(item.name) }}</p>
                     </div>
                  </template>
               </div>

            </div>

            <!--         options-->
         </modal-popup>

         <!--      delete-->
         <modal-popup
            :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
            :title="$t(selectedItem.modalTitle)"
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
                     @click="deleteAnnounce"
                  >
                     {{ $t('delete') }}
                  </button>
               </div>

            </div>
         </modal-popup>
      </div>
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
         showOptions: false,
         modal: {
            title: '',
            buttonText: '',
            method: null,
         },
         selectedItem: {}
      };
   },
   computed: {
      options() {
         return [
            {
               name: 'details_of_search',
               icon: 'eye.svg',
               method: this.openDetails,
               modalTitle: 'are_you_sure_you_want_to_deactivate_the_announcement',

            },
            {
               name: 'edit',
               icon: 'fi_check-square.svg',
               method: this.editAnnounce,
            },
            {
               name: 'remove_bookmark',
               icon: 'trash.svg',
               show: true,
               method: this.openModal,
               modalTitle: 'are_you_sure_you_want_to_delete_the_car'
            },
         ]
      },
   },
   methods: {
      //dropdown
      toggleOpen(event) {
         event.stopPropagation();
         if (this.isMobileBreakpoint) {
            this.showOptions = true;
         } else {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
               document.addEventListener('click', this.onClickOutside);
            }else{
               this.isOpen = false;
            }
         }
      },
      onClickOutside(event) {
         this.isOpen = false;
         if (!this.$refs.actionsRef.contains(event.target)) {
            this.isOpen = false;
            document.removeEventListener('click', this.onClickOutside);
         }
      },

      openModal(item) {
         this.selectedItem = item;
         this.showModal = true;
      },
      closeModal() {
         this.showModal = false;
         this.modal = {
            title: '',
            buttonText: '',
            method: null,
         }
      },

      editAnnounce() {
         return
      },

      openDetails() {
         return;
      },
      async deleteAnnounce() {
         await this.$store.dispatch('UserCabinetCarDelete', {id: this.announcement.id})
         this.$toasted.success(this.$t('car_deleted'));
         this.closeModal();
         this.$nuxt.refresh();
         this.isOpen = false;
      }

   },
};
</script>


<style lang="scss">



</style>
