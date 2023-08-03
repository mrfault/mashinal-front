<template>
   <div class="announcement-actions" ref="actionsRef">
      <div class="announcement-actions__button" @click.prevent="toggleOpen">
         <inline-svg src="/new-icons/fi_more-horizontal.svg" />
      </div>
      <div class="announcement-actions__content" v-if="isOpen">
         <div class="announcement-actions__content--item" v-for="(item, index) in options" :key="index">
            <inline-svg :src="`/new-icons/grid/${item.icon}`" />
            <p>{{ $t(item.name) }}</p>
         </div>
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
         options: [
            {
               name: 'inactive_make',
               icon: 'fi_minus-circle.svg',
            },
            {
               name: 'restore_free',
               icon: 'fi_check-square.svg',
            },

            {
               name: 'edit',
               icon: 'notification.svg',
            },
            {
               name: 'remove_announcement',
               icon: 'trash.svg',
            },
         ],
      };
   },
   methods: {
      toggleOpen() {
         this.isOpen = !this.isOpen;
         if (this.isOpen) {
            // Add a click event listener to the document when the content is open
            document.addEventListener('click', this.onClickOutside);
         }
      },
      onClickOutside(event) {
         // Check if the click target is outside of the component's element
         if (!this.$refs.actionsRef.contains(event.target)) {
            this.isOpen = false;
            document.removeEventListener('click', this.onClickOutside);
         }
      },
   },
};
</script>



<style lang="scss">
.announcements-grid__item {
   .announcement-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 49;

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
