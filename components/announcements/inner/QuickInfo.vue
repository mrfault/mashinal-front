<template>
  <div class="quick-info card mb-lg-3">
    <h1>{{ getAnnouncementTitle(announcement) }}</h1>
    <div class="price">
      <span>{{ announcement.price }}</span>
      <span v-if="type !== 'parts'"><icon name="exchange" /> {{ announcement.price_converted }}</span>
    </div>
    <template v-if="isMobileBreakpoint">
      <div class="more-data d-flex">
        <span class="text-data">
          № {{ announcement.id_unique }}
        </span>
        <span class="text-data">
          <icon name="eye" />
          {{ announcement.view_count }}
          <icon name="cursor" />
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
        <share-it type="publish" class="btns" />
        <button class="btn btn--dark-blue-2-outline full-width" @click.stop="copyToClipboard($env.WEBSITE_URL + $route.path)">
          <icon name="link" /> {{ $t('copy_to_clipboard') }}
        </button>
      </div>
    </template>
    <hr />
    <div :class="['contact', {'cursor-pointer': !!contact.link }]" @click.stop="handleContactClick">
      <div class="img">
        <img :src="contact.img" alt="" />
      </div>
      <div class="info">
        <h2>{{ contact.name }}</h2>
        <address>{{ contact.address }}</address>
      </div>
    </div>
    <div class="row">
      <div class="col mt-2 mt-lg-3">
        <show-map-button :lat="contact.lat" :lng="contact.lng" /> 
      </div>
      <div class="col mt-2 mt-lg-3" v-if="canSendMessage(announcement)" >
        <chat-button :announcement="announcement" has-after-login />
      </div>
      <div class="col-12 mt-2 mt-lg-3" v-if="!isMobileBreakpoint">
        <call-button :phone="contact.phone" />
      </div>
    </div>
    <template v-if="(userIsOwner(announcement) && announcement.status != 2) || (announcement.status == 3 && !announcement.is_autosalon)">
      <hr />
      <div class="row mt-n2 mt-lg-n3">
        <div class="col mt-2 mt-lg-3">
          <restore-button :announcement="announcement" v-if="announcement.status == 3" />
          <deactivate-button :announcement="announcement" v-else />
        </div>
        <div class="col mt-2 mt-lg-3" v-if="announcement.status != 3 && announcement.can_edit">
          <edit-button :announcement="announcement" :type="type" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import RestoreButton from '~/components/announcements/RestoreButton';
import DeactivateButton from '~/components/announcements/DeactivateButton';
import EditButton from '~/components/announcements/EditButton';
import ChatButton from '~/components/announcements/ChatButton';
import CallButton from '~/components/announcements/CallButton';
import ShowMapButton from '~/components/elements/ShowMapButton';

export default {
  props: {
    type: String
  },
  components: {
    RestoreButton,
    DeactivateButton,
    EditButton,
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
    handleContactClick() {
      if (this.contact.link) {
        this.$router.push(this.contact.link);
      }
    }
  }
}
</script>