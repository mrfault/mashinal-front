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
          :maxFiles="maxFiles"
          :minFiles="minFiles"
          :defaultFiles="announcement ? announcement.media : files"
          :helpers="helperImages"
          @files-changed="updateImages"
          @files-dropped="addImages"
          @file-deleted="deleteImage"
          @file-rotated="rotateImage"
        />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="youtube">
          <span>{{ $t('video') }}</span>
        </h2>
        <add-video :value="form.youtube.id" @input="$set(form, 'youtube', $event)" />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="selectedColor">
          <span>{{ $t('color') }}</span>
        </h2>
        <color-options v-model="form.selectedColor" :limit="2" :multiple="type === 'cars'"
          @change-matt="form.is_matte = $event" :matt="form.is_matte" :hide-matt="type !== 'cars'" />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="mileage">
          <span>{{ $t('mileage') }}</span>
        </h2>
        <div class="row">
          <div class="col-12 col-lg-4 mb-2 mb-lg-0 text-uppercase">
            <form-numeric-input :placeholder="$t('char_kilometre')" v-model="form.mileage" :invalid="isInvalid('mileage')" />
          </div>
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <form-select :label="$t('data')" custom custom-checkboxes
              :values="{ count: ['is_new','beaten','guaranty','customs_clearance','tradeable'].filter(a => form[a]).length }"
              @clear="form.year_from = '', form.year_to = ''"
            >
              <div class="form-merged">
                <form-checkbox :label="$t('is_new')" v-model="form.is_new" input-name="is_new" />
                <form-checkbox :label="$t('bitie')" v-model="form.beaten" input-name="beaten">
                  <popover :message="$t('with_significant_damage_to_body_elements_that_do_not_move_on_their_own')" :width="175" />
                </form-checkbox>
                <form-checkbox :label="$t('in_garanty')" v-model="form.guaranty" input-name="guaranty" />
                <form-checkbox :label="$t('not_cleared')" v-model="form.customs_clearance" input-name="customs_clearance" />
                <form-checkbox :label="$t('tradeable')" v-model="form.tradeable" input-name="tradeable" />
              </div>
            </form-select>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { ToastErrorsMixin } from '~/mixins/toast-errors';

import SellSelectModification from '~/components/sell/SellSelectModification';
import UploadImage from '~/components/elements/UploadImage';
import ColorOptions from '~/components/options/ColorOptions';
import AddVideo from '~/components/elements/AddVideo';

export default {
  components: { 
    SellSelectModification,
    UploadImage,
    ColorOptions,
    AddVideo
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
      showAllOptions: this.type !== 'cars'
    }
  },
  computed: {
    progress() {
      let progress = 30;
      if (this.form.car_catalog_id) progress += 10;
      return progress;
    },

    helperImages() {
      let imgs = this.type === 'cars' ? [1,2,3,4,5] : (this.type === 'commercial' ? [1,2,3,4] : [1,2,3]);
      return imgs.map(n => `/img/sell-helpers/${this.type}_${n}.png`);
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