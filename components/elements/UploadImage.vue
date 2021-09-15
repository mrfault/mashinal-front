<template>
  <div class="upload-image" :class="{ 'dragover': onDragover }">
    <form :id="'upload-image_form--' + inputId" enctype="multipart/form-data" novalidate>
      <div class="swiper-container" v-swiper:uploadSwiper="swiperOps">
        <div class="swiper-wrapper upload-image_form__thumbnails">
          <div class="swiper-slide" v-for="(key, index) in orderdedKeys" :key="key">
            <div class="upload-image_form__thumbnail" @click.stop="fileClick(key, index)">
              <img v-if="image[key]" :src="image[key]" alt="" />
              <div class="overlay">
                <button type="button" :class="['btn-sq', {'disabled': loading[key]}]" @click.stop="fileRotate(key, index)">
                  <icon name="reset" />
                </button>
                <button type="button" :class="['btn-sq ml-auto', {'disabled': loading[key]}]" @click.stop="fileDelete(key, index)">
                  <icon name="cross" />
                </button>
              </div>
            </div>
          </div>
          <template v-if="isMobileBreakpoint || !helpers || (helpers.length <= filesLoadedLength)">
            <div class="swiper-slide" key="loading" v-if="filesLength !== filesLoadedLength">
              <div class="upload-image_form__thumbnail">
                <loader />
              </div>
            </div>
            <div class="swiper-slide" key="add-image" v-if="canUpload">
              <div class="upload-image_form__thumbnail add-image" @click.stop="input.click()">
                <div class="overlay">
                  <icon name="camera" />
                  <p>{{ $t('add_image') }}</p>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-for="(img, index) in helpers.slice(filesLoadedLength)">
              <div class="swiper-slide" :key="img">
                <div class="upload-image_form__thumbnail" v-if="(index + 1) <= (filesLength - filesLoadedLength)">
                  <loader />
                </div>
                <div class="upload-image_form__thumbnail helper" @click.stop="input.click()" v-else>
                  <img :src="img" alt=""/>
                </div>
              </div>
            </template>
            <template v-if="(filesLength - filesLoadedLength) > helpers.length">
              <div class="swiper-slide" :key="'loading_'+i" v-for="i in (filesLength - filesLoadedLength - helpers.length)">
                <div class="upload-image_form__thumbnail">
                  <loader />
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <input type="file" :id="'upload-image_form__input--' + inputId" accept="image/*" hidden multiple />
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      defaultFiles: {
        default: false
      },
      inputId: {
        type: String,
        required: false,
        default: 'default'
      },
      name: {
        type: String,
        required: false,
        default: 'images[]'
      },
      minFiles: {
        type: Number,
        required: false,
        default: 3
      },
      maxFiles: {
        type: Number,
        required: false,
        default: 20
      },
      maxFileSize: {
        type: Number,
        required: false,
        default: 25600
      },
      helpers: Array
    },
    data() {
      return {
        form: null,
        input: null,
        add: null,
        index: this.defaultFiles 
          ? (this.defaultFiles instanceof Array && this.defaultFiles[0]?.key 
            ? (this.$maxInArray(this.defaultFiles.map(file => file.key)) + 1)
            : Object.keys(this.defaultFiles).length) 
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
              spaceBetween: 20
            }
          }
        }
      }
    },
    created() {
      if (this.defaultFiles) {
        this.disableUpload = true;
      }
    },
    mounted() {

      this.form = document.getElementById('upload-image_form--' + this.inputId);
      this.input = document.getElementById('upload-image_form__input--' + this.inputId);

      ['drag', 'dragstart', 'dragend',
        'dragover', 'dragenter', 'dragleave', 'drop'].forEach(event => this.form.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }));

      ['dragover', 'dragenter'].forEach(event => this.form.addEventListener(event, this.dragEnter));
      ['dragleave', 'dragend', 'drop'].forEach(event => this.form.addEventListener(event, this.dragLeave));
      ['drop'].forEach(event => this.form.addEventListener(event, this.fileDrop));
      ['change'].forEach(event => this.input.addEventListener(event, this.fileDrop));
      
      if (this.defaultFiles) {
        let keys = Object.keys(this.defaultFiles);
        for(let i in keys) {
          let file = this.defaultFiles[keys[i]];
          let key = this.$notUndefined(file.key, i);
          this.$set(this.files, key, { file: new Blob(), name: file.name || file.split('/').pop(), loaded: true });
          this.$set(this.image, key, file.image || this.$withBaseUrl(file));
          this.$set(this.orderdedKeys, this.orderdedKeys.length, key);
        }
        this.disableUpload = false;
      }

      this.$nuxt.$on('delete-image-by-key', this.deleteImageByKey);
      this.$nuxt.$on('hide-image-preloader-by-key', this.hideImagePreloaderByKey);
      this.$nuxt.$on('image-uploaded', this.handleImageUpload);

      this.$emit('files-changed', this.imagesLoaded);
    },
    beforeDestroy() {
      this.$nuxt.$off('delete-image-by-key', this.deleteImageByKey);
      this.$nuxt.$off('hide-image-preloader-by-key', this.hideImagePreloaderByKey);
      this.$nuxt.$off('image-uploaded', this.handleImageUpload);
    },
    methods: {
      dragEnter(e) {
        e.preventDefault();
        this.onDragover = true;
      },
      dragLeave(e) {
        e.preventDefault();
        this.onDragover = false;
      },
      fileDrop(e) {
        e.preventDefault();

        let newFiles = e.target.files || e.dataTransfer.files;
        let filesToUpload = [];

        for (let i = 0; i < newFiles.length; i++) {
          let isImage = newFiles[i].type.match('image.*');
          if (!isImage || this.filesLength === this.maxFiles) break;
          
          let key = this.index;

          filesToUpload.push({ file: newFiles[i], key });
          this.$set(this.files, key, { name: newFiles[i].name, file: newFiles[i], loaded: false });
          this.$set(this.loading, key, true);

          if ((newFiles[i].size * 0.001) > this.maxFileSize) {
            this.$set(this.files[key], 'bad_size', true);
          }

          this.$set(this.image, key, '');

          this.index++;
        }
        this.$emit('files-dropped', filesToUpload);
        e.target.value = '';
      },
      fileRead(key) {
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.$set(this.image, key, reader.result);
          this.$set(this.files[key], 'loaded', true);
          this.$emit('file-loaded', this.files[key]);
          if (this.filesLoadedLength === this.filesLength) {
            this.moveToSlide(this.filesLength, 500, 100);
          }
        });
        reader.readAsDataURL(this.files[key].file);
      },
      fileDelete(key, index) {
        this.$emit('file-deleted', index);

        this.$delete(this.files, key);
        this.$delete(this.image, key);
        this.$delete(this.loading, key);
        this.$delete(this.orderdedKeys, this.orderdedKeys.indexOf(key));
        
        // if (e !== null) {
        //   index = this.orderdedKeys.indexOf(key);
        //   let active_index = this.uploadSwiper.activeIndex;        
        //   let slide_to = active_index === this.orderdedKeys.length ? index : false;

        //   if (index < active_index && slide_to !== false) {
        //     this.moveToSlide(slide_to);
        //   }
        // }

        this.$emit('files-changed', this.imagesLoaded);
      },
      fileRotate(key, index) {
        if (this.loading[key]) return;
        this.$emit('file-rotated', index, key);
        this.$set(this.loading, key, true);
      },
      fileClick(key, index) {
        this.$emit('file-clicked', this.files[key]);
      },
      fileIsLoading(key) {
        return this.loading[key] === true;
      },
      moveToSlide(index, duration = 0, timeout = 0) {
        clearTimeout(this.swiperTimeout);
        setTimeout(() => {
          this.uploadSwiper.slideTo(index, duration);
        }, timeout);
      },
      deleteImageByKey(key) {
        Object.keys(this.files).map((k, i) => {
          if (k == key) this.fileDelete(key, i);
        });
      },
      hideImagePreloaderByKey(key) {
        this.$set(this.loading, key, false);
      },
      handleImageUpload(key, url, rotated = false) {
        this.$set(this.image, key, url);
        if (!rotated) this.$set(this.files[key], 'loaded', true);
        if (!rotated) this.$set(this.orderdedKeys, this.orderdedKeys.length, key);
        this.$emit('files-changed', this.imagesLoaded);
        // move to the last slide
        if (!rotated) this.moveToSlide(this.filesLoadedLength, 500, 0);
      }
    },
    computed: {
      filesLength() {
        return Object.keys(this.files).length;
      },
      filesLoadedLength() {
        return Object.keys(this.files).map(key => this.files[key]).filter(file => file.loaded).length;
      },
      canUpload() {
        if (this.disableUpload) return false;
        return (this.filesLoadedLength === this.filesLength) && (this.filesLength < this.maxFiles);
      },
      imagesLoaded() {
        return this.orderdedKeys.map(key => ({ 
          key, 
          name: this.files[key].name, 
          image: this.image[key] 
        }));
      }
    }
  }
</script>