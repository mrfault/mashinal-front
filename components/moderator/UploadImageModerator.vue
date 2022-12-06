<template>
  <div class="vue_component__upload--image" v-bind:class="{ 'dragover': onDragover }">

    <div v-if="page === 'sell'" class="row sell-page">

      <div :style="loadCroppa ? 'width: 85%;padding:0;' : ''" class="component-add-photo">
        <form v-bind:id="'upload_image_form--' + input_id" enctype="multipart/form-data">
          <div class="hologram cursor-pointer d-flex mt-0" @click="handleFormClick">

            <a v-for="i in sellImageCount"
               class="single-hologram announcement-category__overlay__generation__item announcement-category__photo"
               href="javascript:void(0);" style="justify-content: end;">
              <div class="icon"
                   style="height: 88px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <img v-if="isCar" :src="'/images/sell/car_'+i+'.png'" alt="" style="width: auto;height: auto;">
                <img v-else-if="isMoto" :src="'/images/sell/moto_'+i+'.png'" alt="" style="width: auto;height: auto;">
                <img v-else-if="isCommetcial" :src="'/images/sell/comm_'+i+'.png'" alt=""
                     style="width: auto;height: auto;">
              </div>
              <div style="margin-top: 13px; font-size: 13px;">{{ $t('add_image_name_' + i) }}</div>
            </a>

          </div>

          <div :class="{'disable': !draggableEnabled}" class="image-load-content" @click="handleDisabledContentClick">
            <draggable v-model="setSavedImageUrls" :sort="true" :style="loadCroppa ? 'margin-left: 0px;' : ''"
                       class="upload_image_form__thumbnails announcement-category__overlay__generation row"

                       group="people"
                       @end="handleMove"
            >
              <span v-for="(value, key) in image" :key="(new Date().getTime()+key)"
                    :class="{'loadCroppa':loadCroppa}"
                    :style="imagePreloaderContainer[imagePreloaderContainer.length-1] === false ? 'cursor: move' : ''"
                    class="announcement-category__overlay__generation__item announcement-category__photo mb-20 cursor-pointer"

              >
                <div
                  :class="{'imagePreloaderContainer':imagePreloaderContainer[key]}"
                  :style="'background-image:url('+((imagePreloaderContainer[key] === undefined || !imagePreloaderContainer[key]) ? setSavedImageUrls[key] : '')+')'"
                  class="upload_image_form__thumbnail upload_image_form__thumbnail_fixed"
                >
                  <div class="imagePreloader"></div>
                  <div class="w-100 d-flex justify-content-between p-2">
                    <span v-if="loadCroppa" @click="findOriginalImage(setSavedImageUrls[key], key)"
                       class="cursor-pointer button-new-tab" target="_blank"
                       style="background: #dadada !important"
                       @click.stop>
                                            <icon name="image"/>
                    </span>
                    <span v-if="!imagePreloaderContainer[key]" class="cursor-pointer button-new-tab"
                          @click.stop="rotateLeft($event,key)">
                         <icon name="reset" style="transform: scaleX(-1)"/>
                    </span>
                    <span v-if="!imagePreloaderContainer[key]" class="cursor-pointer button-new-tab"
                          @click.stop="rotateRight($event,key)">
<!--                      <icon name="reset"></icon>-->
                      <icon name="reset"></icon>
                    </span>
                    <span v-if="!imagePreloaderContainer[key] && loadCroppa" class="cursor-pointer button-new-tab"
                          @click.stop="openCroppa($event, key)">
                     <icon name="edit"/>
                    </span>
                    <span v-if="!imagePreloaderContainer[key]"
                          class="cursor-pointer button-new-tab"
                          @click.stop="fileDelete($event, setSavedImageUrls[key],key)">
                      <icon name="cross"/>
                    </span>
                  </div>
                  <img :class="{ 'show': setSavedImageUrls[key] }" :src="setSavedImageUrls[key]"
                       style="opacity: 0" @click.stop="openFancyBox(key)">
                </div>
              </span>
              <a
                v-if="!stopUploading"
                key="add_photo"
                class=" announcement-category__photo announcement-category__photo-1 mb-20 cursor-pointer"
                @click="handleFormClick" @drag.prevent.stop="" @dragstart.prevent.stop="">
                <div class="no-photo">
                  <img src="/img/sell-helpers/cars_4.png" alt="">

                </div>
              </a>
            </draggable>

          </div>
          <input :id="'upload_image_form__input--' + input_id" hidden multiple type="file"/>
        </form>
      </div>
    </div>

    <form v-else v-bind:id="'upload_image_form--' + input_id" enctype="multipart/form-data">
      <div :style="loadCroppa ? 'margin-left: 0px;' : ''"
           class="upload_image_form__thumbnails announcement-category__overlay__generation row"
      >
        <span v-for="(value, key) in image" v-if="value" :key="`form_`+(new Date().getTime()+key)"
              :class="{'loadCroppa':loadCroppa}"
              :style="imagePreloaderContainer[imagePreloaderContainer.length-1] === false ? 'cursor: move' : ''"
              class="announcement-category__overlay__generation__item announcement-category__photo mb-20 cursor-pointer"
              style="margin-right: 16px;"
        >
          <div
            :class="{'imagePreloaderContainer':imagePreloaderContainer[key]}"
            :style="'background-image:url('+((imagePreloaderContainer[key] === undefined || !imagePreloaderContainer[key]) ? setSavedImageUrls[key] : '')+')'"
            class="upload_image_form__thumbnail upload_image_form__thumbnail_fixed"
          >
            <div class="imagePreloader"></div>
            <div style="position: absolute;right: 0px;display: flex;top: 5px;">
              <a v-if="loadCroppa" :href="findOriginalImage(setSavedImageUrls[key], key)" class="button-new-tab"

                 target="_blank" @click.stop>
                  D
              </a>
              <span v-if="!imagePreloaderContainer[key]" class="cursor-pointer"
                    style="margin-right:10px;position:relative;top:unset;left:unset;"
                    @click.stop="rotateLeft($event,key)">
                <span style="transform: scaleX(-1);">
                 <icon name="reset"></icon>
                </span>
              </span>
              <span v-if="!imagePreloaderContainer[key]" class="cursor-pointer"
                    style="margin-right:10px;position:relative;top:unset;left:unset;"
                    @click.stop="rotateRight($event,key)">
                <icon name="rotate_right" style="width: 16px; height: 16px;"/>
              </span>
              <span v-if="!imagePreloaderContainer[key] && loadCroppa" class="cursor-pointer"
                    @click.stop="openCroppa($event, key)">
                    <icon name="edit"/>
              </span>
              <span v-if="!imagePreloaderContainer[key]" class="cursor-pointer button-new-tab"

                    @click.stop="fileDelete($event, setSavedImageUrls[key],key)">
                    <icon name="cross"/>
              </span>
            </div>
            <img :class="{ 'show': setSavedImageUrls[key] }" :src="setSavedImageUrls[key]"
                 style="opacity: 0" @click.stop="openFancyBox(key)">
          </div>
        </span>
        <a v-if="!stopUploading"
           class="announcement-category__overlay__generation__item announcement-category__photo mb-20 cursor-pointer"
           @click="fileView($event, image.length+1)">
          <div class="no-photo">
            <div class="announcement-category__photo__circle">
              <span>+</span>
            </div>
            <div class="announcement-category__photo__text">
              <span>﻿{{ $t('add_photos') }}</span>
              <p>﻿{{ $t('no_less_5_item') }}</p>
            </div>
          </div>
        </a>
      </div>
      <input :id="'upload_image_form__input--' + input_id" hidden multiple type="file"/>
    </form>

    <div v-if="isOpenCroppa && loadCroppa" class="custom_modal">
      <div style="position: fixed; left: 0; top: 0; width: 100%; overflow: hidden; height: 100vh;z-index: 1"
           @click="isOpenCroppa = false"></div>
      <car-view-for-croppa
        v-if="announce"
        :key="announce.id"
        :announce="announce"
        :croppaSelectedKey="croppaSelectedKey"
        :image="savedImageUrls"
        :saved_images="saved_images"
        @newThumb="newThumb"
      />
    </div>

    <no-ssr>
      <LightBox v-if="active_box" :key="'LB'+lbIndex" :media="fancyBoxMedia" :showLightBox="active_box"
                :startAt="LighBoxStart" @onClosed="active_box = false"
                @onOpened="toggleFancyBox"/>
    </no-ssr>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import {mapState} from "vuex";
import CarViewForCroppa from "~/components/moderator/carViewForCroppa";


export default {
  name: 'upload-image',
  props: {
    changePosition: {
      type: Boolean,
      default: false
    },
    isMoto: {
      type: Boolean,
      default: false
    },
    isCar: {
      type: Boolean,
      default: false
    },
    isCommetcial: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    defaultImages: {},
    input_id: {
      type: String,
      required: false,
      default: "default"
    },
    name: {
      type: String,
      required: false,
      default: 'images[]'
    },
    max_filesize: {
      type: Number,
      required: false,
      default: 25600
    },
    stopUploading: {
      type: Boolean,
      default: false
    },
    page: {
      type: String,
      required: false,
      default: ''
    },
    loadCroppa: {
      type: Boolean,
      default: null
    },
    announce: {
      type: Object,
      default: null
    },
    saved_images: {
      type: Array,
      default: () => [],
      required: false
    },
  },
  components: {
    CarViewForCroppa,
    draggable,
  },
  data: function () {
    return {
      isOpenCroppa: false,
      croppaSelectedKey: 0,
      imagePreloaderContainer: [],
      list: [],
      deleteArr: [],
      max_files: 5,
      form: null,
      input: null,
      index: 0,
      total: 0,
      files: [],
      image: [],
      batch: {},
      onDragover: false,
      onUploading: false,
      drag: false,
      lbIndex: 0,
      active_box: false,
      LighBoxStart: 0
    }
  },
  beforeDestroy() {
    this.$store.commit('mutateSavedImageUrls', {
      property: 'savedImageUrls',
      with: []
    })
  },
  mounted: function () {
    this.$nuxt.$on('remove_image_by_index', (index) => {
      this.index--;
      this.$store.commit('deleteSavedImageUrlWithKey', index);
      this.image.splice(index, 1);
      this.files.splice(index, 1);
      this.$emit('passBase64Images', this.image);
    });
    this.$nuxt.$on('remove_image_loading_by_index', (index) => {
      this.$set(this.imagePreloaderContainer, index - 1, false);
    });
    this.$nuxt.$on('remove_image_on_catch', () => {
      this.$set(this, 'imagePreloaderContainer', []);
      this.setSavedImageUrls.map((item, key) => {
        this.$set(this.imagePreloaderContainer, key, false);
      })
    });

    if (this.defaultImages) {
      this.index = Object.keys(this.defaultImages).length;
      this.max_files = Object.keys(this.defaultImages).length + 1;
      this.image = Object.keys(this.defaultImages).map((item) => {
        // return this.$env.API_BASE_URL + this.defaultImages[item];
        return this.defaultImages[item];
      });
      this.$store.commit('setSavedImageUrls', this.image);
      this.$emit('passBase64Images', this.image);
    }

    this.form = document.getElementById('upload_image_form--' + this.input_id);
    this.input = document.getElementById('upload_image_form__input--' + this.input_id);

    /*    ['drag', 'dragstart', 'dragend',
          'dragover', 'dragenter', 'dragleave', 'drop'].forEach(event => this.form.addEventListener(event, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }));*/

    /*
          ['dragover', 'dragenter']
            .forEach(event => this.form.addEventListener(event, this.dragEnter));

          ['dragleave', 'dragend', 'drop']
            .forEach(event => this.form.addEventListener(event, this.dragLeave));

          ['drop']
            .forEach(event => this.form.addEventListener(event, this.fileDrop));
    */

    if (this.input) {
      ['change']
        .forEach(event => this.input.addEventListener(event, this.fileDrop));
    }
    //this.form.addEventListener('click', this.handleFormClick);

  },
  watch: {
    stopUploading(toggle) {
      this.form.removeEventListener('click', this.handleFormClick);
      if (!toggle) this.form.addEventListener('click', this.handleFormClick);
    }
  },
  computed: {
    ...mapState(['savedImageUrls']),
    fancyBoxMedia() {
      if (!this.active_box) return [];
      console.log('active box')
      let _return = [];
      let img = this.savedImageUrls;
      for (const key in this.savedImageUrls) {

        let original = img[key].replace('/conversions', '').replace('-thumb', '').replace('-upload_thumb', '');
        if (!this.imageExists(original)) original = original.replace('.jpg', '.png')
        /*
        if (img[key].includes('-upload_thumb')){
          let original = img[key].replace('-upload_thumb', '-thumb');
        }else{
          let original = this.img[key].replace('/conversions', '').replace('-thumb', '');
        }*/

        _return.push({
          thumb: img[key],
          src: original
        });
      }

      return _return;
    },
    sellImageCount() {
      if (this.isCar) return [1, 2, 3, 4, 5];
      else if (this.isMoto) return [1, 2, 3];
      else if (this.isCommetcial) return [1, 2, 3, 4];
    },
    draggableEnabled() {
      return !this.imagePreloaderContainer.find(item => item === true)
    },
    setSavedImageUrls: {
      set(value) {
        this.$store.commit('mutateSavedImageUrls', {
          property: 'savedImageUrls',
          with: value
        })
      },
      get() {
        return this.savedImageUrls;
      }
    },

  },
  methods: {
    imageExists(image_url) {
      var http = new XMLHttpRequest();
      http.open('GET', image_url.replace('?', '?' + new Date().getTime()), false);
      try {
        http.send();
        return http.status !== 404 && http.status !== 403;
      } catch (e) {
        return false;
      }
    },
    findOriginalImage(value, key) {
      if (this.saved_images[key] !== undefined) {
        let imageId = this.saved_images[key];

        if (this.announce.original_media[imageId] !== undefined) {
          return this.announce.original_media[imageId]
        }
      }

      return value;
    },
    newThumb(newThumb) {
      this.isOpenCroppa = false;
      this.$store.commit('setSavedImageUrlWithKey', {
        key: this.croppaSelectedKey,
        value: newThumb
      })
      this.$set(this.image, this.croppaSelectedKey, newThumb);
    },
    rotateLeft(e, key) {
      this.$set(this.imagePreloaderContainer, key, true);
      this.$axios
        .$get('/media/' + this.saved_images[key] + '/rotate/left')
        .then((data) => {
          this.$store.commit('setSavedImageUrlWithKey', {
            key: key,
            value: data.data.thumb
          })
          this.$set(this.imagePreloaderContainer, key, false);
        })
        .catch((data) => {
          this.$set(this.imagePreloaderContainer, key, false);
        });
    },
    rotateRight(e, key) {
      this.$set(this.imagePreloaderContainer, key, true);
      this.$axios
        .$get('/media/' + this.saved_images[key] + '/rotate/right')
        .then((data) => {
          this.$store.commit('setSavedImageUrlWithKey', {
            key: key,
            value: data.data.thumb
          })

          this.$set(this.imagePreloaderContainer, key, false);
        })
        .catch((data) => {
          this.$set(this.imagePreloaderContainer, key, false);
        });
    },
    openCroppa(e, key) {
      this.isOpenCroppa = true;
      this.croppaSelectedKey = key;
    },
    openFancyBox(i) {
      this.LighBoxStart = i;
      this.active_box = true;
      this.lbIndex++;
    },
    toggleFancyBox(v) {
      //this.active_box = v;
    },


    handleMove(v) {
      this.$emit('replaceImage', {
        v: v,
        images: this.savedImageUrls,
        key: v.newIndex,
        changeTo: v.newIndex > v.oldIndex ? 'right' : 'left'

      });

      this.move(this.imagePreloaderContainer, v.oldIndex, v.newIndex);
    },
    move(input, from, to) {
      let numberOfDeletedElm = 1;
      const elm = input.splice(from, numberOfDeletedElm)[0];
      numberOfDeletedElm = 0;
      input.splice(to, numberOfDeletedElm, elm);
    },

    handleFormClick() {
      this.input.click();

    },
    handleDisabledContentClick() {
      if (!this.draggableEnabled)
        this.input.click();
    },

    dragEnter: function (e) {
      e.preventDefault();
      this.onDragover = true;
    },
    dragLeave: function (e) {
      e.preventDefault();
      this.onDragover = false;
    },
    fileDrop: function (e) {
      e.preventDefault();
      let newFiles = e.target.files || e.dataTransfer.files;
      let filesToUpload = [];

      for (let i = 0; i < newFiles.length; i++) {
        if (this.files.length + 1 > 20) {
          break;
        }
        this.$set(this.imagePreloaderContainer, this.index, true);
        this.$set(this.files, this.index, newFiles[i]);

        if (newFiles[i].type.match(/image.*/)) {
          filesToUpload.push(newFiles[i]);
          this.fileInit(this.index);
          this.fileRead(this.index);

          this.index++;
          if (this.files.length >= 5) {
            this.max_files++;
          }
        }
      }

      this.$emit('passBase64Images', this.image);
      this.$emit('change', this.files);
      this.$emit('addFiles', filesToUpload);
      e.target.value = '';
    },

    fileInit: function (key) {
      let file = this.files[key];

      this.files[key] = {
        name: this.files[key].name,
        file: this.files[key]
      };

      if ((file.size * 0.001) > this.max_filesize) {
        this.$set(this.files[key], 'bad_size', true);
      }
    },
    fileRead: function (key) {
      let reader = new FileReader();

      reader.addEventListener("load", (e) => {
        this.$set(this.image, key, reader.result);
      });

      reader.readAsDataURL(this.files[key].file);
    },
    fileDelete: function (e, value, key) {
      this.LighBoxStart = 0;
      this.lbIndex++;
      this.active_box = false;

      this.index--;
      this.imagePreloaderContainer.splice(key, 1);
      if (this.isEdit) {
        let id = value.match(/storage\/(.*)\//);
        this.deleteArr.push(parseInt(id[1]));
      }
      this.$emit('deletedIndex', key);
      this.$delete(this.files, key);
      this.$delete(this.image, key);
      this.$store.commit('deleteSavedImageUrlWithKey', key);
      this.$emit('delete', this.files);
      this.$emit('deletedArr', this.deleteArr)
    },
    fileView: function (e, key) {
      if (this.savedImageUrls[key]) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../node_modules/vue-croppa/dist/vue-croppa.css";

.image-load-content {
  &.disable {
    position: relative;
  }

  &.disable:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}

.mb-20 {
  margin-bottom: 20px;
  margin-right: 20px;
}

.no-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

}

.upload_image_form__thumbnail_fixed {
  border-radius: 2.5px;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  /* margin: 10px; */

  justify-content: center;
  align-items: center;
  background-position: center;
  background-size: cover;
}

.announcement-category__overlay__generation {
  justify-content: flex-start;
}

.vue_component__upload--image {
  padding: 5px;
  min-height: 80px;
  border-radius: 5px;
}

.vue_component__upload--image.dragover {
}

.vue_component__upload--image form > div {
  text-align: center;
}

.vue_component__upload--image .upload_image_form__thumbnails {
  margin-left: 27px;
  margin-bottom: 1em;
}


.vue_component__upload--image .upload_image_form__thumbnail img {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  width: auto;
  min-height: 100%;
  max-height: 100%;
  opacity: 0;
  transform: translateX(-50%) translateY(-50%);
  transition: 1s opacity;
}

.vue_component__upload--image .upload_image_form__thumbnail img.show {
  opacity: 1;
}

.vue_component__upload--image .upload_image_form__thumbnail.bad-size img {
  filter: grayscale(100%);
}

.vue_component__upload--image .upload_image_form__thumbnail.uploaded img {
  opacity: 0.1;
}

.vue_component__upload--image .upload_image_form__thumbnail span {
  width: 30px;
  height: 30px;
  z-index: 1;
  padding: 0 1px;
  border-radius: 2px;
  background-color: #dadada;

  &:hover {
    color: #e6e6e6;
    border: 1px solid #fff;
    background-image: none;
    background-color: #fff;

    svg {
      fill: #e6e6e6;
    }
  }

  &.open-croppa-pencil {
    right: 30px !important;
  }
}

.sell-page {
  .component-description {
    display: inline-flex;
    flex-direction: column;
    padding: 20px 15px 0 10px;

    h2 {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.6;
      color: #050b26;
    }

    p {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.36;
      color: #d7d7d7;
    }
  }

  .component-add-photo {
    display: inline-block;
    flex-wrap: wrap;
    width: 78.2%;
    padding: 0 0 0 20px;

    .hologram {
      margin-top: 0;
      margin-left: 27px;
      position: absolute;
      z-index: 0;

      .single-hologram {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 149px;
        margin-right: 16px;
        border: solid 1px #f2f2f2;
        background-color: var(--white);

        &:hover {
          border: solid 1px #1e5d98;

          svg {
            path {
              opacity: 1 !important;
              fill: #1e5d98 !important;
            }

            g {
              opacity: 1 !important;

              path {
                fill: #1e5d98 !important;
              }
            }
          }
        }
      }
    }

    .announcement-category__overlay__generation__item {
      width: 149px;
      margin-top: unset;

      &.loadCroppa {
        width: 308px;
        height: 210px;
        max-width: 308px;
        max-height: 210px;
      }
    }
  }

}

.announcement-category__photo-1{
  width: 308px;
  background: #dadada;
  border-radius: 6px;
  height: 210px;
}

</style>
