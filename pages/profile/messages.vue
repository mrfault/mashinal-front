<template>
  <div class="pages-profile-messages pt-0 pt-lg-5 pb-0 pb-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div :class="['messages', {'empty': !messages.length, 'no-send-input': activeGroupInterlocutor.id == 3}]">
        <div class="row flex-lg-nowrap">
          <div class="col-auto" v-if="!isMobileBreakpoint || activeGroupId === false">
            <div class="card messages-card">
              <template v-if="messages.length">
                <div class="pl-3 pr-3 pt-2 pb-2 pl-lg-4 pr-lg-4 pt-lg-3 pb-lg-3">
                  <form-text-input
                    v-model="searchValue"
                    icon-name="search"
                    block-class="placeholder-lighter"
                    :placeholder="$t('message_or_name')"
                  />
                </div>
                <hr class="mt-0 mb-0" />
              </template>
              <div class="messages_chat-list">
                <client-only>
                  <vue-scroll class="white-scroll-bg">
                    <div class="chat-list-switch cursor-pointer" @click="showBlockedGroups = !showBlockedGroups">
                      <template v-if="showBlockedGroups">
                        <span class="switch-icon"><icon name="chat" /></span>
                        <span class="switch-text">{{ $t('chat_list') }}</span>
                        <span class="switch-count text-dark-blue-3">{{ countGroups(false) }}</span>
                      </template>
                      <template v-else>
                        <span class="switch-icon text-dark-blue-2"><icon name="block" /></span>
                        <span class="switch-text text-dark-blue-2">{{ $t('blocked_users') }}</span>
                        <span class="switch-count text-dark-blue-3">{{ countGroups(true) }}</span>
                      </template>
                    </div>
                    <div class="chat-list-items">
                      <template v-if="messages.length">
                        <chat-item v-for="group in filteredGroups"
                          @select-group="selectActiveGroup"
                          @show-modal="activeModalGroup = group, showControlsModal = true;"
                          :group="messagesByGroup(group.id)"
                          :blocked="isBlocked(group)"
                          :active="activeGroupId == group.id"
                          :key="group.id"
                        />
                        <template v-if="!filteredGroups.length">
                          <div class="pl-4 pr-1">
                            <hr class="mt-0"/>
                            <p class="text-center mt-2">
                              {{ searchValue ? $t('no_results_found') : $t('no_blocked_users') }}
                            </p>
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <nuxt-link :to="$localePath('/')" class="chat-item d-block">
                          <div class="d-flex">
                            <img class="chat-avatar" src="/img/user.jpg" :alt="$t('no_messages')" />
                            <div class="chat-info">
                              <div class="chat-first-line">
                                <span class="text-medium">{{ $t('no_messages') }}</span>
                              </div>
                              <div class="chat-details">
                                <span>{{ $t('start_conversation_from_announcement') }}</span>
                              </div>
                            </div>
                          </div>
                        </nuxt-link>
                      </template>
                    </div>
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
              <icon class="text-dark-blue-2" :name="getUserBlock" />
              {{ $t(getUserBlock + '_user') }}
            </li>
            <li class="cursor-pointer" key="clear" @click="deleteChat()">
              <!-- <icon name="garbage" /> -->
              <inline-svg src="/new-icons/garbage.svg" :height="14" />
              {{ $t('clear_chat') }}
            </li>
          </ul>
        </modal-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { SocketMixin } from '~/mixins/socket';
  import { MessagesMixin } from '~/mixins/messages';

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
      ...mapGetters(['messages','messagesByGroup']),

      crumbs() {
        return [
          { name: this.$t('messages') }
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
      ...mapActions(['getGroupMessages','removeMessageGroup','blockUser']),

      filterByMessageText(groupId) {
        if (!this.searchValue.length) return [];
        return this.messages
          .find(group => group.id == groupId).messages
          .filter((message) => this.$search(message.text, this.searchValue))
          .reverse()
          .filter((_,i) => i < 5);
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
        this.$router.push({query: { group: groupId } });
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
        else if (['motorcycle','scooter','motoatv'].includes(type)) type = 'moto';
        else if (type === 'commercial') type = 'commercial';
        else if (type === 'part') type = 'parts';
        this.$router.push(this.$localePath(`/${type}/announcement/${announcement.id_unique}`));
      },

      async deleteChat(group) {
        if (group) this.activeModalGroup = group;
        if (this.pending) return;
        this.pending = true;
        try {
          await this.removeMessageGroup(this.activeModalGroup.id);
          if (this.activeGroupId) {
            this.$router.push({ query: null });
          }
          this.setActiveFirstGroup();
          this.$toasted.success(this.$t('message_removed'));
          this.showControlsModal = false;
          this.pending = false;
        } catch(err) {
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
          await this.blockUser({ id: userId });
          await this.$auth.fetchUser();
          this.showControlsModal = false;
          this.connectEcho('user.' + userId).whisper('action', {
            userId: this.user.id,
            action: this.getUserBlock
          });
          this.$toasted.success(successMessage);
          this.pending = false;
        } catch(err) {
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
