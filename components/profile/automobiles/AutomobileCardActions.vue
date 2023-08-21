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

                  <div class="announcement-actions__content--item w-100"
                       @click="openEditModal(options[0])">
                     <inline-svg :src="`/new-icons/grid/${options[0].icon}`"/>
                     <p>{{ $t(options[0].name) }}</p>
                  </div>
                  <div class="announcement-actions__content--item w-100"
                       @click="openDeleteModal(options[1])">
                     <inline-svg :src="`/new-icons/grid/${options[1].icon}`"/>
                     <p>{{ $t(options[1].name) }}</p>
                  </div>
               </div>

            </div>

            <!--         options-->
         </modal-popup>

         <!--      delete-->
         <modal-popup
            :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
            :title="$t(selectedItem.modalTitle)"
            :toggle="showDeleteModal"
            @close="closeModal">
            <div class="remove-vehicle-modal">
               <div class="protocol-payment-modal__actions">
                  <button
                     :class="{ 'pointer-events-none': pending }"
                     class="btn btn--white btn-dark-text"
                     type="button"
                     @click="showDeleteModal = false"
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
      dropdownId: Number,
   },
   data() {
      return {
         pending: false,
         showDeleteModal: false,
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
      isOpen() {
         return this.$store.state.openDropdownId === this.dropdownId;
      },
      options() {
         return [
            // {
            //    name: 'details_of_search',
            //    icon: 'eye.svg',
            //    method: this.openDetails,
            //    modalTitle: 'are_you_sure_you_want_to_deactivate_the_announcement',
            //
            // },
            {
               name: 'edit',
               icon: 'fi_check-square.svg',
               method: this.openEditModal,
            },
            {
               name: 'remove_bookmark',
               icon: 'trash.svg',
               show: true,
               method: this.openDeleteModal,
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
            const isOpen = this.$store.state.openDropdownId === this.dropdownId;
            this.$store.commit(isOpen ? 'closeDropdown' : 'setOpenDropdown', this.dropdownId);
            if (!isOpen) {
               document.addEventListener('click', this.onClickOutside);
            }
         }
      },
      onClickOutside(event) {
         if (!this.$refs.actionsRef.contains(event.target)) {
            this.$store.commit('closeDropdown');
            document.removeEventListener('click', this.onClickOutside);
         }
      },

      openDeleteModal(item) {
         this.showOptions = false;
         this.selectedItem = item;
         this.showDeleteModal = true;
      },
      closeModal() {
         this.showDeleteModal = false;
         this.modal = {
            title: '',
            buttonText: '',
            method: null,
         }
      },

      openEditModal(item) {
         this.showOptions = false;
         this.$emit('openEditModal', true);
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
.automobile-card-actions {
   position: relative;

   .announcement-actions {
      height: 100%;
      position: initial;
      border: none;


      &__button {
         border: none;
         padding: 10px 0;
         height: 50px;
         width: 100%;
         cursor: pointer;
         z-index: 0 !important;

         svg {
            path {
               stroke: #1B2434 !important;
            }
         }

         &:hover {
            background: #cacaca;
         }
      }

      &__content {
         position: absolute;
         top: 0;
         left: calc(-100% - 180px);
         z-index: 2 !important;
         width: 200px;

         background: #fff;
      }

      .btn-transparent {
         width: 44px;
         height: 44px;
         border: none !important;

         &:hover {
            background: #cacaca;
         }
      }
   }
}


.dark-mode {
   .automobile-card-actions {
      .announcement-actions__button {
         background: #1b2434 !important;

         svg {
            path {
               stroke: #fff !important;
            }
         }
      }
   }
}


</style>
