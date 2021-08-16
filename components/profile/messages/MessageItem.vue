<template>
  <div :class="['message-item', {'pull-right': sentByMe}]" :id="`message-${message.id}`">
    <div :class="['message-content', {'sent-by-me': sentByMe}]">
      <div class="message-attachments" v-if="message.attachments.length">
        <div v-for="(image, i) in message.attachments" :key="image.src" 
            :class="{'half-width': !(message.attachments.length % 2 === 1 && i === message.attachments.length - 1)}">
          <img :src="$withBaseUrl(image.thumb)" alt="" @click="openLightbox($withBaseUrl(image.src))" />
          <span class="message-time">
            {{ $moment(message.created_at).format('hh:mm') }}
          </span>
        </div>
      </div>
      <div class="message-text_wrapper" v-if="message.text">
        <span class="message-text">
          <span v-if="rawHtml" v-html="message.text || ''"></span>
          <span v-else>{{ message.text || '' }}</span>
        </span>
        <span :class="['message-time', {'text-dark-blue-3': !sentByMe}]">
          <icon name="check1" v-if="sentByMe" />
          {{ $moment(message.created_at).format('hh:mm') }}
        </span>
      </div>
    </div>
    <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
      <FsLightbox
        :toggler="toggleFsLightbox"
        :sources="groupAttachments"
        :slide="currentSlide + 1"
        :key="lightboxKey"
        :onClose="refreshLightbox"
        :onBeforeClose="onBeforeClose"
        :showThumbsOnMount="!isMobileBreakpoint"
        :disableThumbs="isMobileBreakpoint"
        :onSlideChange="changeLightboxSlide"
      />
      <transition-group name="fade">
        <div v-if="showLightbox" class="fslightbox-blur-bg" :key="0">
          <img :src="$withBaseUrl(groupAttachments[currentSlide])" alt="" />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import FsLightbox from 'fslightbox-vue';

export default {
  props: {
    message: {},
    groupAttachments: {},
    rawHtml: Boolean
  },
  components: {
    FsLightbox
  },
  data() {
    return {
      toggleFsLightbox: false,
      showLightbox: false,
      lightboxKey: 0,
      currentSlide: 0
    }
  },
  computed: {
    sentByMe() {
      return this.message.recipient_id != this.user.id;
    }
  },
  methods: {
    openLightbox(src) {
      let index = this.groupAttachments.indexOf(src);
      if (index !== -1) this.currentSlide = index;
      this.showLightbox = true;
      this.toggleFsLightbox = !this.toggleFsLightbox;
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
      if (this.showLightbox) {
        this.toggleFsLightbox = !this.toggleFsLightbox;
      }
    },
    handleSwipeTop() {
      if (document.querySelector('body').classList.contains('zooming')) return;
      this.closeLightbox();
    }
  },
  watch: {
    breakpoint() {
      this.refreshLightbox();
    }
  }
}
</script>