<template>
   <div ref="actionsRef" :class="{'isNumberPlate':isNumberPlate}" class="announcement-actions">
      <div class="announcement-actions__button" @click.prevent="toggleOpen">
         <inline-svg src="/new-icons/fi_more-horizontal.svg"/>
      </div>
      <div v-if="isOpen" class="announcement-actions__content">
         <template v-for="(item, index) in options">

            <div v-if="item.show" :key="index" class="announcement-actions__content--item"
                 @click.stop="item.method(item, $event)">
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

      <modal-popup
         :modal-class="'wider'"
         :toggle="showRestore"
         :title="$t('restore_popup_alert', {count: settingsV2.settings.restore_price})"
         @close="showRestore = false"
      >
         <div>
            <button :class="['btn', 'full-width', 'btn--blue-new', 'active', { pending }]" @click.stop="user.autosalon || user.external_salon ? restore() : restoreAnnouncement()">{{ user.autosalon || user.external_salon ? $t('restore_free') : $t('pay') }}</button>
         </div>
      </modal-popup>

      <!--      delete,deactivate-->
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
                  v-if="selectedItem.name == 'inactive_make'"
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="deactivate"
               >
                  {{ $t(selectedItem.name) }}
               </button>
               <button
                  v-else
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="deleteCar"
               >
                  {{ $t(selectedItem.name) }}
               </button>
            </div>

         </div>
      </modal-popup>
   </div>
</template>

<script>
import {mapGetters} from "vuex";
import {PaymentMixin} from "~/mixins/payment";

export default {
   props: {
      announcement: Object,
      dropdownId: {
         type: String,
         required: true,
      },
      isNumberPlate: Boolean,
   },
   mixins: [PaymentMixin],
   data() {
      return {
         pending: false,
         showModal: false,
         showOptions: false,
         showRestore: false,
         modal: {
            title: '',
            buttonText: '',
            method: null,
         },
         type: 'cars',
         selectedItem: {}
      };
   },
   mounted() {
      console.log(this.options)
   },
   computed: {
      ...mapGetters(['settingsV2']),
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
               show: (this.announcement.status == 3 || (!(this.user.autosalon || this.user.external_salon) && this.announcement.status == 4)) && !this.isNumberPlate,
               method: () => this.showRestore = true,
               modalTitle: 'restore_announcement'
            },
            {
               name: 'edit',
               icon: 'fi_edit.svg',
               show: this.announcement.status == 1 || this.announcement.status == 0,
               method: this.editVehicle,
            },
            {
               name: 'remove_announcement',
               icon: 'trash.svg',
               show: this.announcement.status == 3 || this.announcement.status == 0 || this.announcement.status == 4,
               method: this.openModal,
               modalTitle: 'are_you_sure_you_want_to_delete_the_car'
            },
         ]
      },
      isOpen() {
         return this.$store.state.openDropdownId === this.dropdownId;
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

      openModal(item) {
         this.$store.commit('closeDropdown');
         this.showOptions = false;
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
      async restoreAnnouncement() {
         if (this.pending) return;
         this.pending = true;
         try {
            const res = await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`);
            this.showRestore = false
            this.$store.commit('closeDropdown');
            if (!res?.data?.redirect_url) {
               await this.$nuxt.refresh();
               this.updatePaidStatus({
                  type: 'success',
                  text: this.$t('announcement_restored'),
                  title: this.$t('success_payment')
               });
               this.pending = false;
            } else {
               this.pending = false;
               this.handlePayment(res, false, this.$t('announcement_restored'));
            }
         } catch (err) {
            this.pending = false;
         }
      },
      async deactivate(event) {
         this.$store.commit('closeDropdown');
         this.pending = true;
         try {
            await this.$store.dispatch('deactivateMyAnnounement', this.announcement.id_unique);
            this.$emit('refreshData');
            this.$toasted.success(this.$t('vehicle_deactivated'))
            this.closeModal();
            this.pending = false;
            this.$store.commit('closeDropdown');
         } catch (e) {
            this.$toasted.error(this.$t(e))
            this.pending = false;
         }

      },
      async deleteCar(event) {
         event.stopPropagation();
         this.pending = true;
         try {
            await this.$store.dispatch('deleteMyAnnounementV2', this.announcement.id_unique);
            this.$emit('refreshData');
            this.$emit('deleteMyAnnounement');
            this.$toasted.success(this.$t('vehicle_deleted'))
            this.closeModal();
            this.pending = false;
            this.$store.commit('closeDropdown');
         } catch (e) {
            this.pending = false;
            this.$toasted.error(this.$t(e.message))
         }
      },
      async restore() {
         try {
            await this.$axios.$get(`/restore/${this.announcement.id_unique}?is_mobile=${this.isMobileBreakpoint}`)
            this.$emit('refreshData');

            this.$emit('restoredMyAnnounement');
            this.$toasted.success(this.$t('announcement_restored'))
            this.showRestore = false
            this.$store.commit('closeDropdown');
         } catch (e) {
            this.$toasted.error(this.$t(e.message))
         }
      },

      editVehicle() {
         this.$store.commit('closeDropdown');
         if (this.isNumberPlate) {
            this.$router.push(this.$localePath(`/plates/${this.announcement.id_unique}/edit`))
         }
         if (!this.isNumberPlate) {




            if (this.announcement.type == 'motorcycle' || this.announcement.type == 'scooter' || this.announcement.type == 'atv') {
               this.type = 'moto'
               this.$router.push(this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`))
            } else if (this.announcement.type == 'commercial') {
               this.type = 'commercial'
               this.$router.push(this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`))
            } else if (this.announcement.type == 'part') {
               this.type = 'parts'
               this.$router.push(this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`))
            } else {
               this.type = 'cars'
               this.$router.push(this.$localePath(`/${this.type}/announcement/${this.announcement.id_unique}/edit`))
            }


         }
      }

   },
};
</script>


<style lang="scss">

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
      border: 1px solid #CDD5DF;
   }

   &__content {
      position: absolute;
      top: calc(100% + 10px);
      border-radius: 8px;
      background: #fff;
      padding: 8px;
      min-width: 152px;
      left: 0;

      box-shadow: 8px 16px 32px 0px rgba(17, 17, 51, 0.15);
      -webkit-box-shadow: 8px 16px 32px 0px rgba(17, 17, 51, 0.15);
      -moz-box-shadow: 8px 16px 32px 0px rgba(17, 17, 51, 0.15);

      &--item {
         padding: 12px 8px;
         background: #fff;
         display: flex;
         align-items: center;
         border-radius: 8px;
         cursor: pointer;

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

@media (max-width: 599px) {
   .announcement-actions {
      top: 0;
      right: 0;
      padding: 12px;
      width: 50px;
      height: 50px;

      &__content {
         left: calc(-100% - 59px);
         top: calc(100% - 10px);

         &--item {
            width: 100%;
            background: #E3E8EF;
            justify-content: center;
            margin-bottom: 10px;
         }
      }
   }
}

.right-0 {
   left: auto;
   right: 0;
}

.right-aligned-dropdown {
   .announcement-actions__content {
      left: auto;
      right: 0;
   }
}

.isNumberPlate {
   //
   //position: relative;
   top: 65px;
   right: 16px;

   .announcement-actions__content {
      top: -27px;
      left: -161px;
   }
}

@media (max-width: 599px){
   .isNumberPlate{
      top: 50px;
      right: 6px;
   }
}
@media (max-width: 425px){
   .isNumberPlate{
      top: 44px;
      right: 0px;
   }
}
</style>
