<template>
  <div :class="{ dragover: onDragover }" class="upload-image">
    <draggable
      v-model="orderdedKeys"
      :handle="isMobileBreakpoint ? '.handle' : ''"
      :sort="true"
      class="row"
      draggable=".draggable"
      group="people"
      @end="dragFile"
    >
      <div
        v-for="(key, index) in orderdedKeys"
        :key="key"
        class="col-6 col-lg-1-5 mb-2 mb-lg-3 draggable"
      >
        <div class="upload-image_thumbnail">
          <img v-if="image[key]" :src="image[key]" alt=""/>
          <div class="overlay overlay-with-image" @click.prevent="openImageSlider(image,key)">
            <div class="overlay-top-actions">
              <button
                :class="{ disabled: loading[key], 'button-new-tab' : isModeationPage, 'btn-transparent' : !isModeationPage }"
                type="button"
                @click.stop="fileRotate(key, index)"
              >
                <!-- <icon name="reset" /> -->
                <inline-svg height="14" src="/icons/reset-new.svg"/>
              </button>
              <button
                v-if="isModeationPage"
                :class="['button-new-tab', { disabled: loading[key] }]"
                type="button"
                @click.stop="toggleModal(image, key, true)"
              >
                <icon name="edit"/>
              </button>
              <button
                v-if="isModeationPage"
                :class="['button-new-tab', { disabled: loading[key] }]"
                type="button"
                @click.stop="openInNewTab(key)"
              >
                D
              </button>
              <button
                :class="{ disabled: loading[key], 'button-new-tab' : isModeationPage, 'btn-transparent' : !isModeationPage }"
                type="button"
                @click.stop="fileDelete(key, index)"
              >
                <icon name="cross"/>

                <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
              </button>
            </div>
            <button
              v-if="isMobileBreakpoint"
              :class="['btn-transparent-drag handle']"
              type="button"
            >
              <icon name="burger" style="color: #fff;"/>
            </button>
          </div>
        </div>
      </div>
      <template v-if="isMobileBreakpoint">
        <div
          v-if="filesLength !== filesLoadedLength"
          key="loading"
          class="col-6 col-lg-1-5 mb-2 mb-lg-3"
        >
          <div class="upload-image_thumbnail">
            <loader/>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-for="(img, index) in helpers.slice(filesLoadedLength)">
          <div :key="img" class="col-6 col-lg-1-5 mb-2 mb-lg-3">
            <div
              v-if="index + 1 <= filesLength - filesLoadedLength"
              class="upload-image_thumbnail"
            >
              <loader/>
            </div>
            <div
              v-else
              class="upload-image_thumbnail helper"
              @click.stop="input.click()"
            >
              <img :src="img" alt=""/>
            </div>
          </div>
        </template>
        <template v-if="filesLength > helpers.length">
          <div
            v-for="i in (filesLength - filesLoadedLength - helpers.slice(filesLoadedLength).length)"
            :key="'loading_' + i"
            class="col-6 col-lg-1-5 mb-2 mb-lg-3"
          >
            <div class="upload-image_thumbnail">
              <loader/>
            </div>
          </div>
        </template>
      </template>
      <template
        v-if="
          canUpload && (isMobileBreakpoint || filesLength >= helpers.length)
        "
      >
        <div key="add-image" class="col-6 col-lg-1-5 mb-2 mb-lg-3">
          <div
            class="upload-image_thumbnail add-image"
            @click.stop="input.click()"
          >
            <div class="overlay">
              <!-- <icon name="camera" /> -->
              <inline-svg :height="14" src="/icons/camera.svg"/>
              <p>{{ $t('add_image') }}</p>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <input
      :id="'upload-image_input--' + inputId"
      accept="image/*"
      hidden
      multiple
      type="file"
    />
    <modal-popup
      :modal-class="'wider'"
      :title="$t('edit_image')"
      :toggle="modal.isOpen"
      @close="toggleModal(false)"
    >
      <h1>salam</h1>
      <!--      <car-view-for-croppa-->
      <!--        v-if="modal.image"-->
      <!--        :announce="modal.image"-->
      <!--        :key="modal.image"-->
      <!--        :image="modal.image"-->
      <!--        :saved_images="modal.image"-->
      <!--        :croppaSelectedKey="modal.image"-->
      <!--        @newThumb="newThumb"-->
      <!--      />-->
    </modal-popup>
    <!--    ---------------------------   -->
    <transition-group name="fade">
      <template v-if="(slider.showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && slider.showImagesSlider)">
<!--        <div :key="0" class="blur-bg">-->
<!--          <img :src="$withBaseUrl(attachments[slider.currentSlide])" alt=""/>-->
<!--        </div>-->
<!--        <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">-->
<!--          <images-slider-->
<!--            :current-slide="slider.currentSlide"-->
<!--            :slides="{ main: slider.allSlides }"-->
<!--            @close="slider.showLightbox = false"-->
<!--            @slide-change="slider.currentSlide = $event"-->
<!--          />-->
<!--        </div>-->

      </template>
    </transition-group>
<!--    <pre>-->
<!--      {{slider}}-->
<!--    </pre>-->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// import carViewForCroppa from '../../moderator/carViewForCroppa.vue'

export default {
  props: {
    defaultFiles: {
      default: false,
    },
    inputId: {
      type: String,
      required: false,
      default: 'default',
    },
    name: {
      type: String,
      required: false,
      default: 'images[]',
    },
    minFiles: {
      type: Number,
      required: false,
      default: 3,
    },
    maxFiles: {
      type: Number,
      required: false,
      default: 20,
    },
    maxFileSize: {
      type: Number,
      required: false,
      default: 25600,
    },
    helpers: Array,
    isModeationPage: Boolean,
  },
  components: {
    draggable,
    // carViewForCroppa
  },
  data() {
    return {
      form: null,
      input: null,
      add: null,
      index: this.defaultFiles
        ? this.defaultFiles instanceof Array && this.defaultFiles[0]?.key
          ? this.$maxInArray(this.defaultFiles.map((file) => file.key)) + 1
          : Object.keys(this.defaultFiles).length
        : 0,
      files: {},
      image: {},
      loading: {},
      orderdedKeys: [],
      onDragover: false,
      disableUpload: false,
      swiperTimeout: null,
      swiperOps: {
        slidesPerView: 'auto',
        spaceBetween: 15,
        roundLengths: true,
        breakpoints: {
          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        },
      },
      modal: {
        isOpen: false,
        image: null,
        croppaSelectedKey: false,
        saved_images: [],
      },
      slider: {
        showLightbox: false,
        showImagesSlider: false,
        currentSlide: 0,
        allSlides: [],
      }
    }
  },
  created() {
    if (this.defaultFiles) {
      this.disableUpload = true
    }
  },
  mounted() {
    this.input = document.getElementById('upload-image_input--' + this.inputId)

    this.input.addEventListener('change', this.fileDrop)

    if (this.defaultFiles) {
      let keys = Object.keys(this.defaultFiles)
      for (let i in keys) {
        let file = this.defaultFiles[keys[i]]
        let key = this.$notUndefined(file.key, i)
        this.$set(this.files, key, {
          file: new Blob(),
          name: file.name || file.media?.split('/').pop(),
          loaded: true,
          id: key,
        })
        this.$set(this.image, key, file.image || this.$withBaseUrl(file.media))
        this.$set(this.orderdedKeys, this.orderdedKeys.length, key)
      }
      this.disableUpload = false
    }

    this.$nuxt.$on('delete-image-by-key', this.deleteImageByKey)
    this.$nuxt.$on('hide-image-preloader-by-key', this.hideImagePreloaderByKey)
    this.$nuxt.$on('image-uploaded', this.handleImageUpload)

    this.$emit('files-changed', this.imagesLoaded)
  },
  beforeDestroy() {
    this.$nuxt.$off('delete-image-by-key', this.deleteImageByKey)
    this.$nuxt.$off('hide-image-preloader-by-key', this.hideImagePreloaderByKey)
    this.$nuxt.$off('image-uploaded', this.handleImageUpload)
  },
  methods: {
    dragFile(e) {
      let sorted = this.orderdedKeys.map((key) => this.files[key].id)
      let preview = this.image[this.orderdedKeys[0]]
      this.$emit('order-changed', sorted, preview)
    },
    fileDrop(e) {
      e.preventDefault()

      let droppedFiles = e.target.files || e.dataTransfer.files
      let newFiles = []

      for (let i = 0; i < droppedFiles.length; i++) {
        let isImage = droppedFiles[i].type.match('image.*')
        if (!isImage || this.filesLength === this.maxFiles) break

        let key = this.index

        newFiles.push({file: droppedFiles[i], key})
        this.$set(this.files, key, {
          name: droppedFiles[i].name,
          file: droppedFiles[i],
          loaded: false,
        })
        this.$set(this.loading, key, true)
        this.$set(this.image, key, '')

        this.index++
      }
      this.$emit('files-dropped', newFiles)
      e.target.value = ''
    },
    fileDelete(key, index) {
      this.$emit('file-deleted', index)

      this.$delete(this.files, key)
      this.$delete(this.image, key)
      this.$delete(this.loading, key)
      this.$delete(this.orderdedKeys, this.orderdedKeys.indexOf(key))

      this.$emit('files-changed', this.imagesLoaded)
    },
    fileRotate(key, index) {
      if (this.loading[key]) return
      this.$emit('file-rotated', index, key)
      this.$set(this.loading, key, true)
    },
    fileClick(key, index) {
      this.$emit('file-clicked', this.files[key])
    },
    fileIsLoading(key) {
      return this.loading[key] === true
    },
    deleteImageByKey(key) {
      Object.keys(this.files).map((k, i) => {
        if (k == key) this.fileDelete(key, i)
      })
    },
    hideImagePreloaderByKey(key) {
      this.$set(this.loading, key, false)
    },
    handleImageUpload(key, rotated, url, id) {
      this.$set(this.image, key, url)
      if (!rotated) this.$set(this.files[key], 'loaded', true)
      if (id) this.$set(this.files[key], 'id', id)
      if (!rotated) this.$set(this.orderdedKeys, this.orderdedKeys.length, key)
      this.$emit('files-changed', this.imagesLoaded)
    },
    openInNewTab(url) {
      window.open(url, '_blank').focus();
    },
    toggleModal(image, key, toggle) {
      this.modal.isOpen = toggle;
      this.modal.image = image[key];
    },
    newThumb(newThumb) {
      // this.isOpenCroppa = false;
      this.$store.commit('setSavedImageUrlWithKey', {
        key: this.croppaSelectedKey,
        value: newThumb
      })
      this.$set(this.image, this.croppaSelectedKey, newThumb);
    },

    //slider
    openImageSlider(image,key) {
      if (this.isModeationPage){
        var arr = [];
        this.defaultFiles.forEach(el =>{
          arr.push(el.key);
        })
        console.log(arr)
        this.slider.allSlides = arr
        this.slider.currentSlide = image[key];
        this.slider.showLightbox = true;
        this.showImagesSlider = true;
      }

      else return
    },
    onSwiper() {
      console.log(swiper);
    },
    onSlideChange(){
      console.log('slide change');
    },
  },
  computed: {
    filesLength() {
      return Object.keys(this.files).length
    },
    filesLoadedLength() {
      return Object.keys(this.files)
        .map((key) => this.files[key])
        .filter((file) => file.loaded).length
    },
    canUpload() {
      if (this.disableUpload) return false
      return (
        this.filesLoadedLength === this.filesLength &&
        this.filesLength < this.maxFiles
      )
    },
    imagesLoaded() {
      return this.orderdedKeys.map((key) => ({
        key,
        name: this.files[key].name,
        image: this.image[key],
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-image_thumbnail {
  .overlay {
    &-with-image {
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &-top-actions {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
