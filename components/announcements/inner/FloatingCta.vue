<template>
  <div
    v-if="
      !userIsOwner(announcement) ||
      showMonetization(announcement) ||
      announcement.has_monetization
    "
  >
    <div class="floating-cta fixed-to-bottom" ref="floating">
      <div class="row">
        <div class="col" v-if="showMonetization(announcement)">
          <monetization-button
            @openModal="openModal"
            :announcement="announcement"
            class-name="red-outline"
          />
        </div>
        <div
          class="col"
          v-if="userIsOwner(announcement) && announcement.has_monetization"
        >
          <monetization-stats-button :announcement="announcement" />
        </div>
        <div class="col" v-if="!userIsOwner(announcement)">
          <call-button :phone="contact.phone" />
        </div>
      </div>
    </div>
    <!-- <div ref="floatingBefore"></div>
    <div ref="floatingAfter"></div> -->
    <modal-popup :toggle="showModal" @close="showModal = false">
      <login-tabs></login-tabs>
    </modal-popup>
  </div>
</template>

<script>
import CallButton from '~/components/announcements/CallButton'
import MonetizationButton from '~/components/announcements/MonetizationButton'
import MonetizationStatsButton from '~/components/announcements/MonetizationStatsButton'

export default {
  props: {
    announcement: {},
  },
  data() {
    return {
      showModal: false,
    }
  },
  components: {
    CallButton,
    MonetizationButton,
    MonetizationStatsButton,
  },
  computed: {
    contact() {
      return this.getAnnouncementContact(this.announcement)
    },
  },
  methods: {
    handleScroll() {
      let bounds = this.$refs.floatingAfter.getBoundingClientRect()
      this.$refs.floating.classList[bounds.top < 108 ? 'add' : 'remove'](
        'fixed-to-top',
      )
      this.$refs.floating.classList[
        bounds.top - window.innerHeight > -82 ? 'add' : 'remove'
      ]('fixed-to-bottom')
    },
    openModal() {
      this.showModal = true
    },
  },
  mounted() {
    // this.handleScroll();
    // window.addEventListener('scroll', this.handleScroll);
    // window.addEventListener('resize', this.handleScroll);
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll);
    // window.removeEventListener('resize', this.handleScroll);
  },
}
</script>
