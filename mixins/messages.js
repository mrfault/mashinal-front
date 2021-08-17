import { mapGetters, mapActions, mapMutations } from 'vuex';

export const MessagesMixin = {
  computed: {
    ...mapGetters(['countNewMessages'])
  },
  methods: {
    ...mapActions(['markAsRead']),
    ...mapMutations(['appendToMessage']),

    addNewMessage({ group, message }) {
      this.appendToMessage({ group, message });
      if (this.routeName === 'profile-messages') {
        if (this.$route.query.group == group.id) {
          this.markAsRead(group.id);
        }
      } else {
        // show notification
        this.$toasted.success(this.$t('you_have_got_a_message'), { 
          action: { 
            text: this.$t('read'),
            onClick : (e, toast) => {
              let groupId = group.recipient_id == this.user.id ? group.sender_id : group.recipient_id;
              let announceId = group.announce_id_unique;
              this.createMessagesGroup(groupId, announceId);
              toast.goAway(0);
            }
          }
        });
      }
    },
    showNotReadMessagesToast() {
      if (!this.routeName === 'profile-messages' && this.countNewMessages > 0) {
        this.$toasted.success(this.$t('you_have_got_a_message'), { 
          action: { 
            text: this.$t('read'),
            onClick: (e, toast) => {
              this.$router.push(this.$localePath('/profile/messages'));
              toast.goAway(0);
            }
          }
        });
      }
    },
    getInterlocutor(group) {
      return group.sender_id == this.user.id ? group.recipient : group.sender;
    }
  }
}