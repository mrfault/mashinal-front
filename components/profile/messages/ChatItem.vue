<template>
  <div :class="active ? 'chat-item active' : 'chat-item'" @click="$emit('select-group', group.id)">

    <div class="d-flex">
      <div :class="{'is-online': isOnline}">
         <template v-if="chatAnnouncementThumb">
            <img
               v-if="group.announce.type !== 6 && chatAnnouncementThumb"
               class="chat-avatar"
               :src="chatAnnouncementThumb"
               alt="img"
               @click.stop="$emit('go-to-announcement', group)"
            />
         </template>
         <img class="chat-avatar" :src="chatAvatar" v-else alt=""/>
      </div>
      <div class="chat-info">
        <div class="chat-first-line">
          <span class="text-medium text-truncate">{{ chatUser.full_name }}</span>
          <span class="text-dark-blue-3">{{ lastMessage ? $moment(lastMessage.created_at).format('HH:mm') : '' }}</span>
          <span class="dots" @click.stop="$emit('show-modal', group)" v-if="!isChatBot && isMobileBreakpoint">
            <i v-for="i in 3" :key="i"></i>
          </span>
        </div>
        <div class="chat-announcement">
          <span v-if="isChatBot">{{ $t('bot') }}</span>
          <span class="text-truncate" v-else>{{ getAnnouncementTitle(chatAnnouncement) || chatAnnouncement.car_number }}</span>
          <span class="text-dark-blue-2">
            <template v-if="!chatAnnouncement.is_negotiable">{{ chatAnnouncement.price || '' }}</template>
            <icon name="handshake" v-else />
          </span>
          <span class="text-right" v-if="notReadCount">
            <span class="badge-counter">{{ notReadCount }}</span>
          </span>
        </div>
        <div class="chat-details text-dark-blue-3">
          <template v-if="lastMessage && (lastMessage.text || lastMessage.attachments.length)">
            <span :class="['delivery-info', {'text-dark-blue-2': lastMessage.is_seen}]" v-if="lastMessage.sender_id == user.id">
              <icon name="check1" />
            </span>
            <span class="text-truncate" v-if="isChatBot && lastMessage.text" v-html="lastMessage.text.split('<br>')[0]"></span>
            <span class="text-truncate" v-else-if="lastMessage.text">{{ lastMessage.text }}</span>
            <span class="attachment-info d-flex" v-else-if="lastMessage.attachments.length">
              <!-- <icon name="camera" /> -->
              <inline-svg style="    margin-right: 5px;height: 12px;" src="/icons/camera.svg" :height="14" />
              {{ $t('image') }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    group: {},
    blocked: Boolean,
    active: Boolean
  },
  computed: {
    notRead() {
      if (!this.group.last_message) return false;
      return !this.group.is_read && this.group.last_message.sender_id != this.user.id;
    },
    notReadCount() {
      if (this.group?.last_message?.is_read) return 0;
      return this.group?.messages?.filter(m => !m.is_read).length || 0;
    },
    chatAnnouncement() {
      return this.group.announce || {};
    },
     chatAnnouncementThumb() {
        return this.chatAnnouncement.media?.thumb_100x100?.[0];
     },
    chatUser() {
      return this.group.sender_id == this.user.id ? this.group.recipient : this.group.sender;
    },
    chatAvatar() {
      let isUserAvatar = this.group.sender_id == this.user.id;
      let avatar = isUserAvatar ? this.chatAnnouncement.media?.thumb_100x100?.[0] : this.group.sender.avatar;
      return avatar ? this.$withBaseUrl(`${!isUserAvatar ? '/storage/' : ''}${avatar}`) : '/img/user.jpg';
    },
    isOnline() {
      return !this.isChatBot && this.chatUser.is_online;
    },
    isChatBot() {
      return this.chatUser.id == 3;
    },
    lastMessage() {
      if (!this.group.messages || !this.group.messages.length)
        return this.group.last_message || false;
      return this.group.messages[this.group.messages.length - 1];
    },
  },
  methods: {

  }
}
</script>
