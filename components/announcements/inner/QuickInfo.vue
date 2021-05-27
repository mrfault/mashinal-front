<template>
  <div class="quick-info card mb-lg-3">
    <h1>{{ getAnnouncementTitle(announcement) }}</h1>
    <div class="price">
      <span>{{ announcement.price }}</span>
      <span><icon name="exchange" /> {{ announcement.price_converted }}</span>
    </div>
    <template v-if="isMobileBreakpoint">
      <div class="more-data d-flex">
        <span class="text-data">
          № {{ announcement.id_unique }}
        </span>
        <span class="text-data">
          <icon name="eye" />
          {{ announcement.open_count }}
        </span>
        <span class="text-data">
          <icon name="calendar" />
          {{ announcement.humanize_created_at }}
        </span>
      </div>
      <div class="status" v-if="announcement.status == 2">
        <template v-if="announcement.system_paid_announce && !announcement.system_paid_announce.is_paid">
          {{ $t('need_pay') }}
        </template>
        <template v-else>
          {{ $t('announcement_pending') }}
        </template>
      </div>
      <div class="d-flex">
        <share-it type="publish" />
        <button class="btn btn--dark-blue-2-outline full-width" @click.stop="copyToClipboard($env.WEBSITE_URL + $route.path)">
          <icon name="link" /> {{ $t('copy_to_clipboard') }}
        </button>
      </div>
    </template>
    <hr />
    <div class="contact">
      <div class="img">
        <img :src="contact.img" alt="" />
      </div>
      <div class="info">
        <h2>{{ contact.name }}</h2>
        <address>{{ contact.address }}</address>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <show-map-button :lat="contact.lat" :lng="contact.lng" /> 
      </div>
      <div class="col" v-if="canSendMessage(announcement)" >
        <chat-button :announcement="announcement" has-after-login />
      </div>
      <div class="col-12 mt-2 mt-lg-3" v-if="!isMobileBreakpoint">
        <call-button :phone="contact.phone" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ChatButton from '~/components/announcements/ChatButton';
import CallButton from '~/components/announcements/CallButton';
import ShowMapButton from '~/components/elements/ShowMapButton';

export default {
  components: {
    ChatButton,
    CallButton,
    ShowMapButton
  },
  computed: {
    ...mapGetters(['announcement']),
    
    contact() {
      return this.getAnnouncementContact(this.announcement);
    }
  },
  methods: {
    // copy text to clipboard
    copyToClipboard(text) {
      try {
        navigator.clipboard.writeText(text);
        this.$toasted.success(this.$t('copied_to_clipboard'));
      } catch(error) {
        console.error(error);
        try {
          let tempInput = document.createElement('input');
          tempInput.type = 'text';
          tempInput.value = text;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('Copy');
          document.body.removeChild(tempInput);
          this.$toasted.success(this.$t('copied_to_clipboard'));
        } catch(error) {
          console.error(error);
        }
      }
    }
  }
}
</script>