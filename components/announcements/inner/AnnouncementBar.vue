<template>
   <div class="announcementBar">
      <call-button-multiple
          v-if="announcement?.is_auto_salon"
          :phones="announcement?.user?.auto_salon?.phones"
          :announcement="announcement"
      />

      <call-button
          v-else
          :phone="contact?.phone"
          :announcement-id="announcement?.id_unique"
      />

      <chat-button :announcement="announcement" has-after-login />

      <add-favorite
          :template="'btn'"
          :text="$t('add_favorite')"
          :announcement="announcement"
          v-if="![0, 2, 3, 4].includes(announcement.status)"
      />
   </div>
</template>

<script>
   import CallButton from "~/components/announcements/CallButton.vue";
   import CallButtonMultiple from "~/components/announcements/CallButtonMultiple.vue";
   import {mapGetters} from "vuex";
   import ChatButton from "~/components/announcements/ChatButton.vue";
   import AddFavorite from "~/components/announcements/AddFavorite.vue";

   export default {
      components: {AddFavorite, ChatButton, CallButton, CallButtonMultiple },

      props: {
         announcement: {
            type: Object,
            default() { return {} }
         }
      },

      computed: {
         contact() {
            return this.getAnnouncementContact(this.announcement);
         }
      }
   }
</script>

<style lang="scss">
   .announcementBar {
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 80px;
      gap: 12px;
      padding: 12px 16px;
      background-color: #FFFFFF;
      z-index: 100;

      .chat-button,
      .favorite-btn{
         width: 56px;
         height: 100%;

         span {
            display: none;
         }
      }

      .chat-button {
         background-color: #2970FF;

         i {
            color: #FFFFFF;
         }
      }

      .favorite-btn {
         border: none;
         background-color: #EEF2F6;
      }
   }

   .dark-mode {
      .announcementBar {
         background-color: #1b2434;

         .favorite-btn {
            background-color: #121926;
         }
      }
   }
</style>
