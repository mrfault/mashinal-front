<template>
  <div class="chat-messages">
    <div class="d-flex">
      <div class="chat-inner-info">
        <div :class="{'is-online': isOnline}">
          <img class="chat-avatar" :src="chatAvatar" alt="" />
        </div>
        <span class="username">
          {{ chatUser.full_name }}
          <template v-if="isMobileBreakpoint">
            <br/>
            <span class="username-subtitle">
              <span class="text-truncate">{{ getAnnouncementTitle(chatAnnouncement) }}</span>
              <span class="text-dark-blue-2">{{ chatAnnouncement.price || '' }}</span>
            </span> 
          </template>
        </span>
        <template v-if="!isChatBot">
          <span class="cursor-pointer text-dark-blue-2" @click.stop="$emit('block-chat', group)">
            <icon :name="blocked ? 'unblock' : 'block'" />
          </span>
          <span class="cursor-pointer text-red" @click.stop="$emit('delete-chat', group)">
            <icon name="garbage" />
          </span>
        </template>
      </div>
      <template v-if="!isMobileBreakpoint && !isChatBot && group.announce">
        <span class="divider"></span>
        <div class="chat-inner-announcement user-select-none">
          <img class="cursor-pointer" :src="chatAnnouncementThumb" alt="" @click.stop="$emit('go-to-announcement', group)" />
          <span class="cursor-pointer" @click.stop="$emit('go-to-announcement', group)">
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
          @click="useSuggestedMessage(title)"
          :key="i" 
          v-html="title"
        />
      </div>
      <div :class="['messages-list', {'attachments-preview-active': !!Object.keys(files).length}]">
        <div class="scroll-container">
          <vue-scroll class="white-scroll-bg" ref="chat">
            <div class="messages-list-items">
              <div class="messages-list-items_group" v-for="(messages, date) in messagesByDate(group.id)" :key="date">
                <div class="text-center">
                  <span class="btn btn--grey pointer-events-none">
                    {{ $formatDate(date, '[day], D MMM', $t('days-short'), true)[locale] }}
                  </span>
                </div>
                <message-item 
                  v-for="message in messages" 
                  :key="message.id"
                  :message="message"
                  :raw-html="isChatBot"
                  @show-image="openLightbox"
                />
              </div>
            </div>
          </vue-scroll>
        </div>
        <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
          <FsLightbox
            :toggler="toggleFsLightbox"
            :sources="attachments"
            :slide="currentSlide + 1"
            :key="lightboxKey"
            :onClose="refreshLightbox"
            :onBeforeClose="onBeforeClose"
            :showThumbsOnMount="!isMobileBreakpoint"
            :disableThumbs="isMobileBreakpoint"
            :onSlideChange="changeLightboxSlide"
          />
          <transition-group name="fade">
            <div v-if="showLightbox" class="fslightbox-blur-bg" :key="0">
              <img :src="$withBaseUrl(attachments[currentSlide])" alt="" />
            </div>
          </transition-group>
        </div>
        <div class="messages-list-send" v-if="!isChatBot">
          <hr class="mb-0 mt-0" />
          <message-send
            @type="handleTyping"
            @attach="handleFiles"
            @send="submitMessage"
            :disabled="disabledTexting"
            :sending="sendingFiles"
            :blocked="blocked || blockedBy"
            :message="textareaMessage"
            v-model="text"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SocketMixin } from '~/mixins/socket';

import FsLightbox from 'fslightbox-vue';

import MessageItem from '~/components/profile/messages/MessageItem';
import MessageSend from '~/components/profile/messages/MessageSend';

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
    FsLightbox,
    MessageItem,
    MessageSend
  },
  data() {
    return {
      text: '',
      files: [],
      typing: false,
      sending: false,
      timeout: -1,
      sendingFiles: false,
      toggleFsLightbox: false,
      showLightbox: false,
      lightboxKey: 0,
      currentSlide: 0
    }
  },
  computed: {
    ...mapGetters(['suggestedMessages','messagesByDate']),

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
      if (this.blocked || this.blockedBy) return false;
      return !this.group.messages.length && this.group.announce && this.filteredSuggestedMessages.length && !this.isChatBot;
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
    ...mapActions(['markAsRead', 'sendMessage']),

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
        if (remove) {
          list[i].removeEventListener(event, fn, false);
        } else {
          list[i].addEventListener(event, fn, false);
        }
      }
    },
    handleScrollToMessage(pin = false, duration = 300) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (pin !== false) {
            this.$refs.chat?.scrollIntoView(`#message-${this.messagePin}`, duration, 'easeInQuad');
          } else {
            this.$refs.chat?.scrollTo({y: '100%'}, duration, 'easeInQuad');
          }
        }, 0);
      });
    },
    handleMessageLinkClick(e) {
      e.preventDefault();
      this.$router.push(e.srcElement.pathname);
    },
    handleTyping() {
      this.toggleTypingStatus();
    },
    handleFiles(files) {
      this.$set(this, 'files', files);
    },
    async useSuggestedMessage(text) {
      this.$set(this, 'text', text);
      await this.submitMessage();
    },
    async submitMessage() {
      if (this.disabledTexting) return;
      let hasAttachments = this.files.length > 0;
      if (hasAttachments || (this.text && this.text.replace(/\s/g, '') !== '')) {
        let formData = new FormData();
        // include form data
        formData.append('recipient_id', this.chatUser.id);
        formData.append('group_id', this.group.id);
        formData.append('text', this.text);
        // include attachments
        this.files.map(file => {formData.append('files[]', file);});
        // before send
        if (hasAttachments) {
          this.toggleSendingStatus(true);
        } else this.text = '';
        // after send
        const afterSendActions = () => {
          window.scrollTo(0,0);
          if (hasAttachments) {
            this.text = '';
            this.$nuxt.$emit('clear-message-attachments');
            this.toggleSendingStatus(false);
          } else {
            this.toggleTypingStatus(true);
            this.toggleTypingStatus(false);
          }
        }
        // send
        try {
          await this.sendMessage({ form: formData, activeGroup: this.group });
          this.markAsRead(this.group.id);
          console.log({...this.group})
          afterSendActions();
          this.lightboxKey++;
        } catch({ response: { data: { data }}}) {
          if (data.type === 2)
            await this.$auth.fetchUser();
          afterSendActions();
        }
      }
    },
    // lightboz
    openLightbox(src) {
      let index = this.attachments.indexOf(src);
      if (index !== -1) this.currentSlide = index;
      this.showLightbox = true;
      this.toggleFsLightbox = !this.toggleFsLightbox;
      this.setBodyOverflow('hidden');
    },
    refreshLightbox() {
      this.onBeforeClose();
      this.lightboxKey++;
    },
    onBeforeClose() {
      this.showLightbox = false;
      this.setBodyOverflow('scroll');
    },
    changeLightboxSlide(fsBox) {
      this.currentSlide = fsBox.stageIndexes.current;
    },
    closeLightbox() {
      if (this.showLightbox) {
        this.toggleFsLightbox = !this.toggleFsLightbox;
      }
    },
    handleSwipeTop() {
      if (document.querySelector('body').classList.contains('zooming')) return;
      this.closeLightbox();
    }
  },
  watch: {
    '$route.query.group'() {
      this.checkIfRead();
      this.handleScrollToMessage(this.messagePin, 0);
    },
    'files.length'(val, old) {
      if (val === 1 && old === 0) {
        this.handleScrollToMessage(false);
      }
    },
    'group.messages.length'(len) {
      this.handleScrollToMessage(false);
    },
    breakpoint() {
      this.refreshLightbox();
    }
  },
  mounted() {
    this.checkIfRead();
    this.updateEventListenerList(this.messageLinks, 'click', this.handleMessageLinkClick);
    this.handleScrollToMessage(this.messagePin, false);
    this.$nextTick(()=>{
      this.connectEcho('typing.'+this.user.id).listenForWhisper('typing', (data) => {
        // check if announcement is relevant
        if (data.announceId && (data.announceId !== this.group.announce_id)) return;
        // check interlocutor
        if (data.userId == this.chatUser.id) {
          if (data.sendingAttachment) {
            this.sending = data.typing;
            return;
          } else {
            this.typing = data.typing;
            clearTimeout(this.timeout);
            if (this.typing) {
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