<template>
  <div>
    <div class="floating-cta" ref="floating">
      <div class="row">
        <div class="col">
          <call-button :phone="contact.phone" />
        </div>
      </div>
    </div>
    <div ref="floatingBefore"></div>
    <div ref="floatingAfter"></div>
  </div>
</template>

<script>
import CallButton from '~/components/announcements/CallButton';

export default {
  props: {
    announcement: {}
  },
  components: {
    CallButton
  },
  computed: {
    contact() {
      return this.getAnnouncementContact(this.announcement);
    },
  },
  methods: {
    handleScroll() {
      let bounds = this.$refs.floatingAfter.getBoundingClientRect();
      this.$refs.floating.classList[bounds.top < 108 ? 'add' : 'remove']('fixed-to-top');
      this.$refs.floating.classList[(bounds.top - window.innerHeight) > -82 ? 'add' : 'remove']('fixed-to-bottom');
    }
  },
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }
}
</script>