<template>
  <div class="chat-messages">
    <div class="d-flex">
      <div class="chat-inner-info">
        <img :class="['chat-avatar', {'is-online': !isChatBot && chatUser.is_online}]" :src="chatAvatar" alt="" />
        <span class="username">{{ chatUser.full_name }}</span>
        <template v-if="!isChatBot">
          <span class="cursor-pointer text-dark-blue-2">
            <icon name="block" />
          </span>
          <span class="cursor-pointer text-red">
            <icon name="garbage" />
          </span>
        </template>
      </div>
      <template v-if="!isChatBot && group.announce">
        <span class="divider"></span>
        <div class="chat-inner-announcement">
          <img :src="chatAnnouncementThumb" alt="" />
          <span>
            {{ getAnnouncementTitle(chatAnnouncement) }}<br/>
            <span class="text-dark-blue-2">{{ chatAnnouncement.price || '' }}</span>
          </span>
        </div>
      </template>
    </div>
    <hr class="mt-0 mb-0" />
    <div class="messages_msg-list">
      
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    group: {},
    chatUser: {},
    blocked: {},
    blockedBy: {},
    messagePin: {}
  },
  computed: {
    chatAvatar() {
      return this.chatUser.avatar ? this.$withBaseUrl(`/storage/${this.chatUser.avatar}`) : '/img/user.jpg';
    },
    chatAnnouncementThumb() {
      return this.chatAnnouncement.media?.thumb_100x100?.[0];
    },
    chatAnnouncement() {
      return this.group.announce || {};
    },
    isChatBot() {
      return this.chatUser.id == 3;
    },
  },
  methods: {
    ...mapActions(['markAsRead'])
  },
  created() {
    this.markAsRead(this.group.id);
  }
}
</script>