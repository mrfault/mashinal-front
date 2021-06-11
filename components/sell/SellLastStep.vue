<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" :bar-title="title" height-auto>
    <div class="sell_last-step">
      <sell-select-modification v-if="type === 'cars'"
        :form="form"
        @update-form="handleModification"
      />
      <template v-if="showAllOptions">
        <h2 class="title-with-line" ref="saved_images">
          <span>{{ $t('photos') }}</span>
        </h2>
        <upload-image
          :class="hasError('saved_images')"
          :maxFiles="maxFiles"
          :minFiles="minFiles"
          :defaultFiles="announcement ? announcement.media : files"
          @files-changed="updateImages"
          @files-dropped="addImages"
          @file-deleted="deleteImage"
          @file-rotated="rotateImage"
        />
        <h2 class="title-with-line mt-2 mt-lg-3">
          <span>{{ $t('video') }}</span>
        </h2>
      </template>
    </div>
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { ToastErrorsMixin } from '~/mixins/toast-errors';

import SellSelectModification from '~/components/sell/SellSelectModification';
import UploadImage from '~/components/elements/UploadImage';

export default {
  components: { 
    SellSelectModification,
    UploadImage
  },
  props: {
    edit: Boolean,
    title: String,
    type: String,
    initialForm: {},
    announcement: {}
  },
  mixins: [ToastErrorsMixin],
  data() {
    return {
      form: this.$clone(this.initialForm),
      date: Math.floor(Date.now() / 1000),
      files: [],
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      savedFiles: [...this.initialForm.saved_images],
      deletedFiles: [],
      uploading: 0,
      publishing: false,
      showAllOptions: false
    }
  },
  computed: {
    progress() {
      let progress = 30;
      if (this.form.car_catalog_id) progress += 10;
      return progress;
    }
  },
  methods: {
    ...mapActions(['setSellProgress', 'setSellPreviewData']),

    handleModification({ key, value }) {
      this.$set(this.form, key, value);
      if (!this.showAllOptions && key === 'car_catalog_id' && value) {
        this.showAllOptions = true;
        if (!this.isMobileBreakpoint) return;
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(this.$refs['saved_images'], -34, 500, '.mobile-screen');
          }, 0);
        });
      }
    },
    // image upload
    async addImages(images) {
      // passed min limit
      if((images.length + this.savedFiles.length + this.uploading) >= this.minFiles)
        this.removeError('saved_images'); 
      // upload images
      this.uploading += images.length;
      await Promise.all(
        images.map(async (image) => {
          let formData = new FormData();
          formData.append('temp_id', this.date);
          formData.append('images[]', image.file);
          try {
            const data = await this.$axios.$post('/upload_temporary_images', formData, {
              progress: false,
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            this.uploading--;
            this.$nuxt.$emit('image-uploaded', image.key, data.images[0]);
            this.$nuxt.$emit('hide-image-preloader-by-key', image.key);
            this.savedFiles = [...this.savedFiles, ...data.ids];
          } catch({response: {data: {data}}}) {
            this.uploading--;
            this.$nuxt.$emit('delete-image-by-key', image.key);
            this.clearErrors();
            for (let key in data) {
              this.$toasted.error(data[key]);
            }
          }
        })
      );
    },
    async deleteImage(index) {
      if (this.savedFiles[index]) {
        if (this.edit && this.form.saved_images.includes(this.savedFiles[index]))
          this.deletedFiles.push(this.savedFiles[index]);
        else this.$axios.$post('/remove_temporary_image/' + this.savedFiles[index]);
        this.$delete(this.savedFiles, index);
      }
    },
    async rotateImage(index, key) {
      if (this.savedFiles[index]) {
        try {
          this.$nuxt.$loading.start();
          const { data } = await this.$axios.$get(`/media/${this.savedFiles[index]}/rotate/right`);
          this.$nuxt.$loading.finish();
          this.$nuxt.$emit('image-uploaded', key, data.thumb, true);
          this.$nuxt.$emit('hide-image-preloader-by-key', key);
        } catch({response: {data: {data}}}) {
          this.$nuxt.$emit('hide-image-preloader-by-key', key);
          this.$nuxt.$loading.finish();
          this.clearErrors();
          for (let key in data) {
            this.$toasted.error(data[key]);
          }
        }
      }
    },
    updateImages(files) {
      this.files = files;
      this.setSellPreviewData({ value: files[0]?.image, key: 'image' });
    }
  },
  watch: {
    progress(value) {
      this.setSellProgress(value);
    }
  },
  created() {
    ['sellBody','sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications']
      .map(property => { this.mutate({ property, value: [] }); });
  },
  beforeDestroy() {
    this.setSellPreviewData({ value: {} });
  }
}
</script>