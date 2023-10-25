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
   </div>
</template>

<script>
   import CallButton from "~/components/announcements/CallButton.vue";
   import CallButtonMultiple from "~/components/announcements/CallButtonMultiple.vue";

   export default {
      components: { CallButton, CallButtonMultiple },

      props: {
         announcement: {}
      }

   }
</script>

<style lang="scss" scoped>
   .announcementBar {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 72px;
      gap: 12px;
      padding: 12px 16px;
      background-color: #FFFFFF;
   }
</style>
