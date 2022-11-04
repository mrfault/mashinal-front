import FsLightbox from 'fslightbox-vue';
import ImagesSlider from '~/components/elements/ImagesSlider';

export const offerImageView={
  data(){
    return {
      showLightbox: false,
      showImagesSlider: false,
      toggleFsLightbox: false,
      lightboxKey: 0,
      currentSlide: 0,
      sendingMessage: false
    }
  },
  components:{
    FsLightbox, ImagesSlider,
  },
  methods:{
    closeLightbox() {
      if (this.isMobileBreakpoint) {
        if (this.showLightbox) {
          this.toggleFsLightbox = !this.toggleFsLightbox;
        }
      } else {
        this.setBodyOverflow('scroll');
        this.showImagesSlider = false;
      }
    },
    handleSwipeTop() {
      if (document?.body?.classList.contains('zooming')) return;
      this.closeLightbox();
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
    openLightbox(src) {
      let index = this.attachments.indexOf(src);

      if (index !== -1) this.currentSlide = index;


      if (this.isMobileBreakpoint) {
        this.showLightbox = true;
        this.toggleFsLightbox = !this.toggleFsLightbox;
      } else {
        this.showImagesSlider = true;
      }
      this.setBodyOverflow('hidden');
    },
  },
  computed:{
    attachments() {
      return this.offerMessages
        .reduce((attachments, message) => ([...attachments, ...(message.files || [])]), [])
        .map(attachment => this.$withBaseUrl(attachment));
    },
  }
}
