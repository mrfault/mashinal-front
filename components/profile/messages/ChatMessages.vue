<template>
  <div class="chat-messages">
    <div class="d-flex">
      <div class="chat-inner-info">
        <div :class="{'is-online': isOnline}">
          <img class="chat-avatar" :src="chatAvatar" alt="" />
        </div>
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
      <div class="suggested-messages" v-if="showSuggestedMessages">
        <button class="btn btn--primary-outline" 
          v-for="(title, i) in filteredSuggestedMessages" 
          @click="sendSuggestedMessage(title)"
          :key="i" 
          v-html="title"
        />
      </div>
      <div class="messages-list" v-else>
        <div class="scroll-container">
          <vue-scroll class="white-scroll-bg" ref="chat">
            <div class="messages-list-items">
              <div class="messages-list-items_group mt-2 mt-lg-3" v-for="(messages, date) in messagesByDate" :key="date">
                <div class="text-center">
                  <span class="btn btn--grey pointer-events-none">
                    {{ $formatDate(date, '[day], D MMM', $t('days-short'), true)[locale] }}
                  </span>
                </div>
                <message-item 
                  v-for="message in group.messages" 
                  :key="message.id"
                  :message="message"
                  :group-attachments="attachments"
                  :raw-html="isChatBot"
                />
              </div>
            </div>
          </vue-scroll>
        </div>
        <div class="messages-list-send">
          <hr class="mb-0 mt-0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SocketMixin } from '~/mixins/socket';

import MessageItem from '~/components/profile/messages/MessageItem';

export default {
  props: {
    group: {},
    chatUser: {},
    blocked: {},
    blockedBy: {},
    messagePin: {}
  },
  mixins: [SocketMixin],
  components: {
    MessageItem
  },
  data() {
    return {
      text: '',
      files: [],
      typing: false,
      sending: false,
      timeout: -1,
      sendingFiles: false
    }
  },
  computed: {
    ...mapGetters(['suggestedMessages']),

    chatAvatar() {
      return this.chatUser.avatar ? this.$withBaseUrl(`/storage/${this.chatUser.avatar}`) : '/img/user.jpg';
    },
    chatAnnouncementThumb() {
      return this.chatAnnouncement.media?.thumb_100x100?.[0];
    },
    chatAnnouncement() {
      return this.group.announce || {};
    },
    isOnline() {
      return !this.isChatBot && this.chatUser.is_online;
    },
    isChatBot() {
      return this.chatUser.id == 3;
    },
    filteredSuggestedMessages() {
      return this.suggestedMessages
        .filter(m => m.title[this.locale])
        .map(m => m.title[this.locale]);
    },
    showSuggestedMessages() {
      return !this.group.messages.length && this.filteredSuggestedMessages.length && !this.isChatBot;
    },
    messagesByDate() {
      return this.$groupBy(this.group.messages, (m) => this.$moment(m.created_at).format('YYYY-MM-DD'));
    },
    attachments() {
      return this.group.messages
        .reduce((attachments, message) => ([...attachments, ...(message.attachments || [])]), [])
        .map(attachment => this.$withBaseUrl(attachment.src));
    },
    messageLinks() {
      return document?.querySelectorAll('.message-text a[href*="mashin.al"]');
    },
    announcementNotFound() {
      return this.chatAnnouncement.status !== 1;
    },
    disabledTexting() {
      return this.blocked || this.blockedBy || this.announcementNotFound || this.sendingFiles || this.isChatBot;
    },
    textareaMessage() {
      if (this.blocked) return this.$t('you_blocked_this_user');
      else if (this.blockedBy) return this.$t('you_were_blocked_by_this_user');
      else if (this.announcementNotFound) return this.$t('announcement_not_found');
      return false;
    },
  },
  methods: {
    ...mapActions(['markAsRead']),

    checkIfRead() {
      let message = this.group.last_message;
      if (message === null || message?.is_read) return;
      this.markAsRead(this.group.id);
    },
    goBack() {
      if (this.$route.query.group) 
        this.$router.replace({query: null});
      this.$emit('go-back');
    },
    toggleTypingStatus(status = true, sending = false) {
      this.connectEcho('typing.' + this.chatUser.id).whisper('typing', JSON.stringify({ 
        typing: status, 
        userId: this.user.id,
        sendingAttachment: sending,
        announceId: this.group.announce_id 
      }));
    },
    toggleSendingStatus(status = true) {
      this.sendingFiles = status;
      this.toggleTypingStatus(status, true);
    },
    updateEventListenerList(list, event, fn, remove = false) {
      for (let i = 0; i < list.length; i++) {
        if(remove) {
          list[i].removeEventListener(event, fn, false);
        } else {
          list[i].addEventListener(event, fn, false);
        }
      }
    },
    handleScrollToMessage(pin = false) {
      if(pin !== false) {
        this.$refs.chat.scrollIntoView(`#message-${this.messagePin}`, 150, 'easeInQuad');
      } else {
        this.$refs.chat.scrollTo({y: '100%'}, 150, 'easeInQuad');
      }
    },
    handleMessageLinkClick(e) {
      e.preventDefault();
      let path = $event.srcElement.pathname;
      if(path.match(/muqaise|comparison/))
        window.open(`https://mashin.al${path}`, '_blank');
      else this.$router.push(e.srcElement.pathname);
    },
    handleTyping() {
      this.toggleTypingStatus();
    },
    handleFiles(files) {
      this.$set(this, 'files', files);
    },
    sendSuggestedMessage(title) {
      this.text = title;
      this.sendMessage();
    },
    async sendMessage() {
      if (this.disabledTexting) return;
      let hasAttachments = this.files.length > 0;
      if (hasAttachments || (this.text && this.text.replace(/\s/g, '') !== '')) {
        let formData = new FormData();
        // include form data
        formData.append('recipient_id', this.interlocutor.id);
        formData.append('group_id', this.group.id);
        formData.append('text', this.text);
        // include attachments
        this.files.map(file => {formData.append('files[]', file);});
        // before send
        if(hasAttachments) {
          this.toggleSendingStatus(true);
        } else this.text = '';
        // after send
        const afterSendActions = () => {
          window.scrollTo(0,0);
          if(hasAttachments) {
            this.text = '';
            this.$nuxt.$emit('clearMessageAttachments');
            this.toggleSendingStatus(false);
          } else {
            this.toggleTypingStatus(true);
            this.toggleTypingStatus(false);
          }
        }
        // send
        try {
          await this.$store.dispatch('profile/sendMessage', { form: formData, activeGroup: this.group });
          afterSendActions();
          this.handleScrollToMessage(false);
          this.lightboxKey++;
        } catch({ response: { data: { data }}}) {
          if (data.type === 2)
            await this.$auth.fetchUser();
          afterSendActions();
        }
      }
    }
  },
  watch: {
    $route(route) {
      this.checkIfRead();
    },
    'files.length'(val, old) {
      if(val === 1 && old === 0) {
        this.$nextTick(this.handleScrollToMessage);
      }
    }
  },
  mounted() {
    this.checkIfRead();
    this.updateEventListenerList(this.messageLinks, 'click', this.handleMessageLinkClick);
    this.handleScrollToMessage(this.messagePin);
    this.$nextTick(()=>{
      this.connectEcho('typing.'+this.user.id).listenForWhisper('typing', (data) => {
        // check if announcement is relevant
        if(data.announceId && (data.announceId !== this.group.announce_id)) return;
        // check interlocutor
        if(data.userId == this.interlocutor.id) {
          if(data.sendingAttachment) {
            this.sending = data.typing;
            return;
          } else {
            this.typing = data.typing;
            clearTimeout(this.timeout);
            if(this.typing) {
              this.timeout = setTimeout(() => {
                this.typing = false;
              }, 1000);
            }
          }
        }
      });
    });
  },
  beforeDestroy() {
    this.connectEcho('typing.'+this.user.id).stopListeningForWhisper('typing');
    this.updateEventListenerList(this.messageLinks, 'click', this.handleMessageLinkClick, true);
  }
}
</script>