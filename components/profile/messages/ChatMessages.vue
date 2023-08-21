<template>
   <div class="chat-messages">
      <div class="d-flex">
         <div class="chat-inner-info">
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
            <span class="username">
               <span>{{ chatUser.full_name }}</span>

               <span class="typing-status text-dark-blue-3" v-if="sending || typing">
                 <template v-if="sending">{{ $t('is_sending') }}</template>
                 <template v-else-if="typing">{{ $t('is_typing') }}</template>
               </span>

               <template>
                  <br/>
                  <span class="username-subtitle" style="cursor:pointer" @click.stop="$emit('go-to-announcement', group)">
                    <span class="text-truncate">{{ getAnnouncementTitle(chatAnnouncement) }}</span>
                    <span class="text-dark-blue-2">{{ chatAnnouncement.price || '' }}</span>
                  </span>
               </template>
            </span>

            <template v-if="!isChatBot">
               <span class="cursor-pointer"
                     v-b-tooltip="blocked ? $t('unblock_user') : $t('block_user')"
                     @click.stop="$emit('block-chat', group)">
                  <icon :name="blocked ? 'unblock' : 'block'"/>
               </span>

               <span class="cursor-pointer"
                     v-b-tooltip="$t('remove_message')"
                     @click.stop="removeItem = group; showRemoveModal = true;">
                  <icon name="garbage"/>
               </span>
            </template>
         </div>

         <!--<template v-if="!isMobileBreakpoint && !isChatBot && group.announce">
            <span class="divider"></span>

            <div class="chat-inner-announcement user-select-none">
               <img
                  v-if="group.announce.type !== 6"
                  class="cursor-pointer"
                  :src="chatAnnouncementThumb"
                  alt="img"
                  @click.stop="$emit('go-to-announcement', group)"
               />

               <span
                  :class="['cursor-pointer', {'d-flex align-items-center' : group.announce.type === 6 }]"
                  @click.stop="$emit('go-to-announcement', group)"
               >
                  <span v-if="group.announce.type !== 6">{{ getAnnouncementTitle(chatAnnouncement) }}</span>
                  <br v-if="group.announce.type !== 6" />

                  <div class="registrationMarks__number" v-if="group.announce.type === 6">
                     <div class="divider">
                        <img src="/icons/registrationMarks_icons.svg" alt="icons">
                     </div>

                     <div class="divider">
                        <h3>{{ group.announce.car_number.replace(/\s/g, '') }}</h3>
                     </div>
                  </div>

                  <span
                     :class="['text-dark-blue-2', {'style' : group.announce.type === 6}]"
                     style="white-space: nowrap"
                  >{{ chatAnnouncement.price || '' }}</span>
               </span>
            </div>
         </template>-->
      </div>

      <hr class="mt-0 mb-0"/>

      <div class="messages_msg-list">
         <div :class="['messages-list', {'attachments-preview-active': !!Object.keys(files).length}]">
            <div class="scroll-container" id="chat">
               <client-only>
                  <vue-scroll class="white-scroll-bg" ref="chat">
                     <div class="messages-list-items">
                        <div class="messages-list-items_group" v-for="(messages, date) in messagesByDate(group.id)"
                             :key="date">
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
               </client-only>
            </div>
            <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
               <template v-if="isMobileBreakpoint">
                  <FsLightbox
                     :toggler="toggleFsLightbox"
                     :sources="attachments"
                     :slide="currentSlide + 1"
                     :key="lightboxKey"
                     :onClose="refreshLightbox"
                     :onBeforeClose="onBeforeClose"
                     :disableThumbs="true"
                     :onSlideChange="changeLightboxSlide"/>
               </template>

               <transition-group name="fade">
                  <template v-if="(showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && showImagesSlider)">
                     <div class="blur-bg" :key="0">
                        <img :src="$withBaseUrl(attachments[currentSlide])" alt=""/>
                     </div>
                     <div class="blur-bg_slider" :key="1" v-if="!isMobileBreakpoint">
                        <image-slider-message
                           :current-slide="currentSlide"
                           :slides="{ main: attachments }"
                           @close="closeLightbox"
                           @slide-change="currentSlide = $event"/>
                     </div>
                  </template>
               </transition-group>
            </div>
            <div class="messages-list-send" v-if="!isChatBot">
               <hr class="mb-0 mt-0"/>
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
         <div class="suggested-messages" v-if="showSuggestedMessages">
            <button class="btn btn--primary-outline"
                    v-for="(title, i) in filteredSuggestedMessages"
                    @click="useSuggestedMessage(title)"
                    :key="i"
                    v-html="title"/>
         </div>
      </div>

      <modal-popup
         :toggle="showRemoveModal"
         :title="$t('are_you_sure_you_want_to_delete_the_message')"
         @close="showRemoveModal = false">
         <form class="form" @submit.prevent="deleteGroup" novalidate>
            <button type="submit" :class="['btn btn--green full-width', { pending }]">
               {{ $t('confirm') }}
            </button>
         </form>
      </modal-popup>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import {SocketMixin} from '~/mixins/socket';
import {ImageResizeMixin} from '~/mixins/img-resize';

import FsLightbox from 'fslightbox-vue';

import MessageItem from '~/components/profile/messages/MessageItem';
import MessageSend from '~/components/profile/messages/MessageSend';
import ImageSliderMessage from '~/components/elements/ImageSliderMessage';
import ImageSlider from '~/components/elements/ImagesSlider';

export default {
   props: {
      group: {},
      chatUser: {},
      blocked: {},
      blockedBy: {},
      messagePin: {}
   },
   mixins: [SocketMixin, ImageResizeMixin],
   components: {
      FsLightbox,
      MessageItem,
      MessageSend,
      ImageSlider,
      ImageSliderMessage
   },
   created() {
      this.$root.$refs.ChatMessages = this;
   },
   data() {
      return {
         pending: false,
         showRemoveModal: false,
         removeItem: null,
         text: '',
         files: [],
         typing: false,
         sending: false,
         timeout: -1,
         sendingFiles: false,
         toggleFsLightbox: false,
         showLightbox: false,
         showImagesSlider: false,
         lightboxKey: 0,
         currentSlide: 0,
         sendingMessage: false
      }
   },
   computed: {
      ...mapGetters(['suggestedMessages', 'messagesByDate']),

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
         return this.chatUser.id === 3;
      },
      filteredSuggestedMessages() {
         return this.suggestedMessages
            .filter(m => m.title[this.locale])
            .map(m => m.title[this.locale]);
      },
      showSuggestedMessages() {
         if (this.blocked || this.blockedBy) return false;
         return !this.group.messages.length && this.group.announce?.status === 1 && this.filteredSuggestedMessages.length && !this.isChatBot;
      },
      attachments() {
         return this.group.messages
            .reduce((attachments, message) => ([...attachments, ...(message.attachments || [])]), [])
            .map(attachment => this.$withBaseUrl(attachment.src));
      },
      messageLinks() {
         return document?.querySelectorAll('.message-text a');
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
      scrollToBottom (id) {
         const element = document.getElementById(id);
         ///element.scrollTop = element.scrollHeight;
         //element.animate({scrollTop: element.scrollHeight});
         element.lastElementChild.scrollIntoView({  block: "end", behavior: 'smooth' });
      },
      deleteGroup() {
         this.$emit('delete-chat', this.removeItem)
      },
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
         this.$router.push(this.$localePath(e.srcElement.pathname + e.srcElement.search));
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
         if (this.disabledTexting || this.sendingMessage) return;
         this.sendingMessage = true;
         try {
            let hasAttachments = this.files.length > 0;
            if (hasAttachments || (this.text && this.text.replace(/\s/g, '') !== '')) {
               let formData = new FormData();
               // include form data
               formData.append('recipient_id', this.chatUser.id);
               formData.append('group_id', this.group.id);
               formData.append('text', this.text);
               // include attachments
               await Promise.all(this.files.map(async (file) => {
                  let resizedFile = await this.getResizedImage(file);
                  formData.append('files[]', resizedFile);
               }));
               // before send
               if (hasAttachments) {
                  this.toggleSendingStatus(true);
               } else this.text = '';
               // after send
               const afterSendActions = () => {
                  this.scrollToBottom('chat');
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
                  await this.sendMessage({form: formData, activeGroup: this.group});
                  this.sendingMessage = false;
                  this.markAsRead(this.group.id);
                  afterSendActions();
                  this.lightboxKey++;
               } catch ({response: {data: {data}}}) {
                  this.sendingMessage = false;
                  if (data.type === 2)
                     await this.$auth.fetchUser();
                  afterSendActions();
               }
            } else {
               this.sendingMessage = false;
            }
         } catch {
            this.sendingMessage = false;
         }
      },
      // lightbox
      openLightbox(src) {
         let index = this.attachments.indexOf(src);
         if (index !== -1) this.currentSlide = index;
         if (this.isMobileBreakpoint) {
            this.showLightbox = true;
            this.toggleFsLightbox = !this.toggleFsLightbox;
         } else {
            this.showImagesSlider = true;
         }
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
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         } else {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }
      },
      handleSwipeTop() {
         if (document?.body?.classList.contains('zooming')) return;
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
      //console.log(this.attachments);
      this.checkIfRead();
      this.handleScrollToMessage(this.messagePin, false);
      this.$nextTick(() => {
         this.updateEventListenerList(this.messageLinks, 'click', this.handleMessageLinkClick);
         this.connectEcho('typing.' + this.user.id).listenForWhisper('typing', (data) => {
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

      setTimeout(() => {
         this.scrollToBottom('chat');
         console.log('ok');
      }, 1000);
   },
   ready() {

   },
   beforeDestroy() {
      this.connectEcho('typing.' + this.user.id).stopListeningForWhisper('typing');
      this.updateEventListenerList(this.messageLinks, 'click', this.handleMessageLinkClick, true);
   }
}
</script>
