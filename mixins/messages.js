export const MessagesMixin = {
  methods: {
    appendToMessage(data) {
      this.$store.commit('appendToMessage', { group: data.group, message: data.message });
      if(this.routeName === 'profile-messages') return;
      // show notification
      this.$toasted.success(this.$t('you_have_got_a_message'), { 
        action: { 
          text: this.$t('read'),
          onClick : (e, toast) => {
            let groupId = data.group.recipient_id == this.user.id ? data.group.sender_id : data.group.recipient_id;
            let announceId = data.group.announce_id_unique;
            this.createMessagesGroup(groupId, announceId);
            toast.goAway(0);
          }
        }
      });
    },
    showUnreadMessagesToast() {
      if(!this.routeName === 'profile-messages' && this.unreadMessageGroupCount > 0) {
        this.$toasted.success(this.$t('you_have_got_a_message'), { 
          action: { 
            text: this.$t('read'),
            onClick: (e, toast) => {
              this.$router.push(this.$localePath('profile-messages'));
              toast.goAway(0);
            }
          }
        });
      }
    }
  }
}