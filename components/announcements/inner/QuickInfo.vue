<template>
  <div class="quick-info card mb-2 mb-lg-3 mt-2 mt-lg-0">
    <h1>{{ getAnnouncementTitle(announcement) }}</h1>
    <div class="price">
      <span>{{ announcement.price }}</span>
      <span><icon name="exchange" /> {{ announcement.price_converted }}</span>
    </div>
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
      <div class="col order-lg-2" v-if="canSendMessage(announcement)">
        <chat-button :announcement="announcement" has-after-login />
      </div>
      <div class="col col-lg-12 order-lg-3 mt-lg-3">
        <call-button :phone="contact.phone" />
      </div>
      <div class="col-12 col-lg order-lg-1 mt-2 mt-lg-0">
        <show-map-button :lat="contact.lat" :lng="contact.lng" /> 
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ChatButton from '~/components/announcements/inner/ChatButton';
import CallButton from '~/components/announcements/inner/CallButton';
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
      return {
        type: 'user',
        user: this.announcement.user,
        id: this.announcement.user.id,
        name: this.announcement.user.full_name,
        phone: this.announcement.user.phone,
        address: this.announcement.address,
        img: this.announcement.user.avatar ? `${this.$env.BASE_URL}/storage/${this.announcement.user.avatar}` : '',
        lat: this.announcement.latitude ? parseFloat(this.announcement.latitude) : 0,
        lng: this.announcement.longitude ? parseFloat(this.announcement.longitude) : 0,
        link: this.announcement.is_autosalon ? this.$localePath(`/salons/${this.announcement.user.autosalon.id}`) : false
      };
    }
  }
}
</script>