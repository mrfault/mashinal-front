<template>
   <div class="pages-profile-messages pt-3 pb-0 pb-lg-5">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>

      <component
         :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
         :bar-title="$t('messages')"
         @back="$router.push(pageRef || $localePath('/profile/messages'))"
         height-auto>

         <div :class="['messages', {'empty': !messages.length, 'no-send-input': activeGroupInterlocutor.id == 3}]">
            <div class="row flex-lg-nowrap">
               <div class="col-auto" v-if="!isMobileBreakpoint || activeGroupId === false">
                  <div class="card messages-card">
                     <template>
                        <div class="pl-2 pr-2 pb-2 pt-2 pl-lg-3 pb-lg-0 pr-lg-3 pt-lg-3">
                           <form-text-input
                              v-model="searchValue"
                              icon-name="search"
                              block-class="placeholder-lighter"
                              :placeholder="isMobileBreakpoint ? $t('search') : $t('message_or_name')"
                           />
                        </div>
                        <div class="chat-list-switch cursor-pointer"
                             @click="showBlockedGroups = !showBlockedGroups">
                           <template v-if="showBlockedGroups">
                              <span class="switch-icon"><icon name="chat"/></span>
                              <span class="switch-text">{{ $t('chat_list') }}</span>
                              <span class="switch-count text-dark-blue-3">{{ countGroups(false) }}</span>
                           </template>
                           <template v-else>
                              <span class="switch-icon text-dark-blue-2">
                                 <inline-svg src="/icons/block-user.svg"/>
                              </span>
                              <span class="switch-text text-dark-blue-2">{{ $t('blocked_users') }}</span>
                              <span class="switch-count text-dark-blue-3">{{ countGroups(true) }}</span>
                           </template>
                        </div>
                     </template>
                     <div class="messages_chat-list">
                        <client-only>
                           <vue-scroll class="white-scroll-bg">
                              <div class="chat-list-items" v-if="messages.length">
                                 <chat-item v-for="group in filteredGroups"
                                            @select-group="selectActiveGroup"
                                            @show-modal="activeModalGroup = group, showControlsModal = true;"
                                            :group="messagesByGroup(group.id)"
                                            :blocked="isBlocked(group)"
                                            :active="activeGroupId == group.id"
                                            :key="group.id"/>
                                 <template v-if="!filteredGroups.length">
                                    <div class="pl-4 pr-1">
                                       <p class="text-center mt-2">
                                          {{ searchValue ? $t('no_results_found') : $t('no_blocked_users') }}
                                       </p>
                                    </div>
                                 </template>
                              </div>
                              <template v-else>
                                 <div v-if="isMobileBreakpoint" class="no-messages">
                                    <div class="row">
                                       <div class="col-md-12 d-flex justify-content-center align-items-center">
                                          <inline-svg src="/icons/no-message.svg"/>
                                       </div>
                                       <div class="col-md-12 no-messages-content">
                                          <h3>{{$t('no_message')}}</h3>
                                          <p>{{$t('no_message_text')}}</p>
                                       </div>
                                    </div>
                                 </div>
                              </template>
                           </vue-scroll>
                        </client-only>
                     </div>
                  </div>
               </div>
               <div class="col-auto" v-if="!isMobileBreakpoint || activeGroupId !== false">
                  <div class="card messages-card">
                     <chat-messages
                        v-if="messages.length && activeGroupId !== false && messagesByGroup(activeGroupId)"
                        :group="messagesByGroup(activeGroupId)"
                        :chat-user="activeGroupInterlocutor"
                        :blocked="getBlockedUserIds.includes(activeGroupInterlocutor.id)"
                        :blocked-by="getBlockedByUserIds.includes(activeGroupInterlocutor.id)"
                        :message-pin="activeMessage"
                        @go-back="activeGroupId = false"
                        @go-to-announcement="goToAnnouncement"
                        @block-chat="blockChat"
                        @delete-chat="deleteChat"
                     />
                  </div>
               </div>
            </div>
            <modal-popup
               v-if="getInterlocutor(activeModalGroup)"
               :toggle="showControlsModal"
               :title="getInterlocutor(activeModalGroup).full_name"
               @close="showControlsModal = false"
            >
               <ul class="list-line-separated">
                  <li class="cursor-pointer" key="block" @click="blockChat()">
                     <icon class="text-dark-blue-2" :name="getUserBlock"/>
                     {{ $t(getUserBlock + '_user') }}
                  </li>
                  <li class="cursor-pointer" key="clear" @click="deleteChat()">
                     <icon name="garbage"/>
                     <!-- <inline-svg src="/icons/garbage.svg" :height="14" /> -->
                     {{ $t('clear_chat') }}
                  </li>
               </ul>
            </modal-popup>
         </div>

      </component>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import {SocketMixin} from '~/mixins/socket';
import {MessagesMixin} from '~/mixins/messages';

import ChatItem from '~/components/profile/messages/ChatItem';
import ChatMessages from '~/components/profile/messages/ChatMessages';

export default {
   name: 'pages-profile-messages',
   middleware: 'auth_general',
   mixins: [SocketMixin, MessagesMixin],
   components: {
      ChatItem,
      ChatMessages
   },
   layout: 'profileFullWidthLayout',
   nuxtI18n: {
      paths: {
         az: '/profil/mesajlar'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('messages')
      });
   },
   async asyncData({store, route}) {
      await Promise.all([
         store.dispatch('getMessages', route.query.group),
         store.dispatch('getSuggestedMessages')
      ]);

      if (store.state.messages.length) {
         await store.dispatch('getGroupMessages', store.state.messages[0].id);
      }

      return {
         activeGroupId: route.query.group || false,
         activeMessage: false,
         activeModalGroup: false,
         showBlockedGroups: false,
         searchValue: '',
         showControlsModal: false,
         showDeleteModal: false,
         showBlockModal: false,
         pending: false
      }

   },
   computed: {
      ...mapGetters(['messages', 'messagesByGroup']),

      crumbs() {
         return [
            {name: this.$t('messages')}
         ]
      },

      filteredGroups() {
         return this.messages.filter((group) => {
            return this.filterByBlock(group) && (this.searchValue.length ? this.filterByGroupName(group).length : true);
         });
      },

      activeGroupInterlocutor() {
         let group = this.messagesByGroup(this.activeGroupId);
         return !group ? {} : group.sender_id == this.user.id ? group.recipient : group.sender;
      },

      getBlockedUserIds() {
         return this.user.blocked_users?.map(u => u.block_to) || [];
      },
      getBlockedByUserIds() {
         return this.user.blocked_by_users?.map(u => u.blocked_by) || [];
      },
      getUserBlock() {
         if (!this.activeModalGroup) return false;
         return this.getBlockedUserIds.includes(this.getInterlocutor(this.activeModalGroup).id) ? 'unblock' : 'block';
      }
   },
   methods: {
      ...mapActions(['getGroupMessages', 'removeMessageGroup', 'blockUser']),

      filterByMessageText(groupId) {
         if (!this.searchValue.length) return [];
         return this.messages
            .find(group => group.id == groupId).messages
            .filter((message) => this.$search(message.text, this.searchValue))
            .reverse()
            .filter((_, i) => i < 5);
      },
      filterByGroupName(group) {
         if (!this.searchValue.length) return [];
         return [this.getInterlocutor(group).full_name, this.getAnnouncementTitle(group.announce || {})]
            .filter(name => this.$search(name, this.searchValue));
      },
      filterByBlock(group, blocked) {
         if (blocked === undefined) blocked = this.showBlockedGroups;
         let isBlocked = this.getBlockedUserIds.includes(this.getInterlocutor(group).id);
         return blocked ? isBlocked : !isBlocked;
      },

      countGroups(blocked = true) {
         return this.messages.filter((group) => {
            return this.filterByBlock(group, blocked) && (this.searchValue.length ? this.filterByGroupName(group).length : true);
         }).length;
      },

      async selectActiveGroup(groupId, messageId = false) {
         await this.getGroupMessages(groupId);
         await this.$router.push({query: {group: groupId}});
         this.activeMessage = messageId;
      },

      isBlocked(group) {
         return [...this.getBlockedUserIds, ...this.getBlockedByUserIds].includes(this.getInterlocutor(group).id);
      },

      goToAnnouncement(group) {
         let announcement = group.announce;
         if (announcement.status !== 1) return;
         let type = group.announce_type.replace('App\\', '').toLowerCase();

         // get inner link
         if (type === 'announcement') type = 'cars';
         else if (['motorcycle', 'scooter', 'motoatv'].includes(type)) type = 'moto';
         else if (type === 'commercial') type = 'commercial';
         else if (type === 'part') type = 'parts';
         if (group.announce.type === 6) {
            type = 'registration-marks';
            this.$router.push(this.$localePath(`/${type}/${announcement.id_unique}`));
         } else {
            this.$router.push(this.$localePath(`/${type}/announcement/${announcement.id_unique}`));

         }
      },

      async deleteChat(group) {
         if (group) this.activeModalGroup = group;
         if (this.pending) return;
         this.pending = true;
         try {
            await this.removeMessageGroup(this.activeModalGroup.id);
            if (this.activeGroupId) {
               this.$router.push({query: null});
            }
            this.setActiveFirstGroup();
            this.$toasted.success(this.$t('message_removed'));
            this.showControlsModal = false;
            this.pending = false;
         } catch (err) {
            this.pending = false;
         }
      },
      async blockChat(group) {
         if (group) this.activeModalGroup = group;
         if (this.pending) return;
         this.pending = true;
         try {
            let userId = this.getInterlocutor(this.activeModalGroup).id;
            let successMessage = this.$t(`you_${this.getUserBlock}ed_this_user`);
            await this.blockUser({id: userId});
            await this.$auth.fetchUser();
            this.showControlsModal = false;
            this.connectEcho('user.' + userId).whisper('action', {
               userId: this.user.id,
               action: this.getUserBlock
            });
            this.$toasted.success(successMessage);
            this.pending = false;
         } catch (err) {
            this.pending = false;
         }
      },
      setActiveFirstGroup() {
         setTimeout(() => {
            if (!this.isMobileBreakpoint && this.messages.length && !this.activeGroupId) {
               this.activeGroupId = this.messages[0].id || false;
            }
         }, 0);
      }
   },
   watch: {
      $route(route) {
         this.activeGroupId = route.query.group || false;
      }
   },
   mounted() {

      this.$nextTick(() => {
         setTimeout(() => {
            this.connectEcho().listenForWhisper('action', (data) => {
               if (data.userId != this.user.id) {
                  this.$auth.fetchUser();
               }
            });
            if (!this.isMobileBreakpoint) {
               this.setActiveFirstGroup();
            }
         }, 0);
      });
   }
}
</script>

<style lang="scss">
.pages-profile-messages {
   .registrationMarks__number {
      display: flex;
      align-items: center;
      margin-right: 20px;
      height: 42px;
      padding: 0 8px;
      border-radius: 5px;
      border: 3px solid #000000;

      .divider {
         height: unset;
         border: unset;
         margin: 0;

         img {
            width: 20px;
            height: unset;
            margin: 0;
            border-radius: unset;
         }

         &:first-child {
            margin-right: 7px;
         }
      }

      h3 {
         font-family: 'DinMittelschriftgepraegt', sans-serif;
         font-weight: 400;
         font-size: 35px;
         line-height: 44px;
         letter-spacing: -1px;
         color: #1B2434;
         margin: 0;
      }
   }

   .messages-card {
      border-radius: 12px;
      border: 1px solid #eee;
   }

   .placeholder-lighter {
      width: 100%;
   }

   .messages-list-items_group .btn--grey {
      border-radius: 8px;
      background: var(--gray-400, #9AA4B2);
   }

   .placeholder-lighter input {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      border-radius: 8px;
      background: var(--gray-100, #EEF2F6);
      padding: 12px 16px 12px 50px;
      color: var(--gray-500, #697586);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
   }

   .placeholder-lighter .icon-search {
      width: 20px;
      height: 20px;
      font-size: 20px;
      position: absolute;
      left: 15px;
   }

   .placeholder-lighter .icon-search:before {
      font-size: 20px;
   }

   .chat-inner-info i {
      width: 24px;
      height: 24px;
      font-size: 24px;
   }

   .no-messages {
      min-height: 500px;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
   }

   .no-messages-content h3 {
      font-size: 24px;
      font-weight: 600;
      line-height: 28px;
      letter-spacing: 0em;
      text-align: center;
      color: #121926;
      margin-top: 15px;
      margin-bottom: 15px;
   }

   .no-messages-content p {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
      color: #697586;
   }
}

.dark-mode .mobile-screen {
   .chat-item {
      border-bottom: 1px solid #484e56;
      background: #121926;
   }
}

.mobile-screen {

   overflow: hidden;

   .placeholder-lighter input {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      border-radius: 8px;
      background: #FFF;
      padding: 12px 50px 12px 16px;
      color: var(--gray-500, #697586);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
   }

   .placeholder-lighter .icon-search {
      width: 20px;
      height: 20px;
      font-size: 20px;
      position: absolute;
      right: 15px;
   }

   .placeholder-lighter .icon-search:before {
      font-size: 20px;
   }

   .messages-card {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
   }

   .messages_msg-list {
      height: calc(100% - 66px);
   }

   .container {
      height: 100% !important;
   }

   .container .messages {
      height: 100%;
   }

   .chat-messages {
      height: 100%;
   }

   .messages-list .scroll-container {
      min-height: calc(100% - 84px);
      max-height: 100%;
      height: 100%;
      overflow: hidden;
   }

   .row.flex-lg-nowrap {
      height: 100%;
      overflow: hidden;
   }
}

@media (max-width: 1250px) {
   .pages-profile-messages {
      .registrationMarks__number {
         height: 40px;

         .divider {
            img {
               width: 17px;
            }
         }

         h3 {
            font-size: 30px;
         }
      }
   }
}

@media (max-width: 960px) {
   .messages {
      margin-left: -15px;
      margin-right: -15px;
   }
   .chat-inner-info {
      border-radius: 0;
   }
   .message-textarea {
      border-radius: 0;
   }

   .dark-mode {
      .action-bar {
         background: #121926 !important;
      }
   }

   .dark-mode .mobile-screen {
      .action-bar {
         background: #121926 !important;
      }

      .chat-item:first-child {
         border-top: 1px solid #484e56;;
      }

      .chat-inner-info, .chat-inner-announcement {
         background: #121926 !important;
      }

      .message-textarea {
         background: #121926 !important;
      }

      .chat-inner-info .username span:first-child {
         color: #FFF;
      }

      .message-textarea .textarea-text textarea {
         border: 1px solid #1b2434;
         background: #1b2434;
         color: #FFF;
      }
   }
}

.dark-mode {
   .pages-profile-messages {
      .chat-item {
         background: #1b2434;
         border-bottom: 1px solid #1C1C1E;
      }

      .chat-item.active {
         background: #121926;
         border-bottom: 1px solid #1C1C1E;
      }

      .messages-card {
         border: 1px solid #1C1C1E;
      }

      .chat-inner-info, .chat-inner-announcement {
         background: #1b2434;
         border: 1px solid #1b2434;
      }

      .chat-inner-info .username span:first-child {
         color: #FFF;
      }

      .message-content.sent-by-me {
         background-color: #697586;
      }

      .message-content {
         background-color: #484e56;
      }

      .message-textarea {
         background: #1b2434;
         border: 1px solid #1b2434;
      }

      .message-textarea .textarea-text textarea {
         border: 1px solid #121926;
         background: #121926;
         color: #FFF;
      }

      .message-textarea .textarea-text textarea::placeholder {
         color: #454d5a;
         opacity: 1;
         font-size: 16px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px;
      }

      .message-textarea .textarea-text textarea:-ms-input-placeholder {
         color: #454d5a;
         font-size: 16px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px;
      }

      .message-textarea .textarea-text textarea::-ms-input-placeholder {
         color: #454d5a;
         font-size: 16px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px;
      }

      hr {
         background-color: transparent !important;
      }

      .chat-item:first-child {
         border-top: 1px solid #484e56;;
      }

      .chat-inner-info {
         background: #1b2434 !important;
         border-bottom: 1px solid #484e56 !important;
      }

      .message-textarea {
         border-top: 1px solid #484e56 !important;
         background: #1b2434 !important;
      }
      .swiper-slide{
         background: transparent!important;
      }
   }
   .chat-list-switch .switch-text,
   .chat-list-switch .switch-icon{
      color: #FFF;
   }
}

.mobile-screen{
   .no-messages{
      padding: 50px 0;
   }
   .no-messages-content{
      padding: 50px!important;
      text-align: center!important;
   }
}
</style>
