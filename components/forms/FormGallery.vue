<template>
  <div class="form-gallery mb-n2 mb-lg-n3">
    <draggable
      v-model="fileKeys"
      @end="dragFile"
      draggable=".draggable"
      :sort="true"
      group="people"
      class="row"
    >
      <div :class="itemClass" class="draggable" v-for="key in fileKeys" :key="key">
        <div class="form-gallery_thumbnail">
          <loader v-if="showLoader(key)" />
          <template v-else>
            <img :src="previews[key]" alt="" />
            <div class="overlay">
              <button v-if="rotatable" class="btn-sq" type="button" @click.prevent="fileRotate(key, getFileIndex(key))">
                <icon name="reset" />
              </button>
              <button class="btn-sq ml-auto" type="button" @click.stop="fileDelete(key)">
                <icon name="cross" />
              </button>
            </div>
          </template>
        </div>
      </div>
      <div :class="itemClass" v-if="filesCount < maxFiles">
        <label class="form-gallery_thumbnail add-image" for="upload-input">
          <input class="sr-only" type="file" id="upload-input" multiple accept="image/*" @change="filesDrop"/>
          <div class="overlay">
            <icon name="camera" />
            <p>{{ $t('add_image')}}</p>
          </div>
        </label>
      </div>
      <template slot="header">
        <slot name="header"/>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

import { ImageResizeMixin } from '~/mixins/img-resize';

export default {
  props: {
    maxFiles: {
      type: Number,
      default: 21
    },
    initialImages: Array,
    initialKeys: Array,
    itemClass: {
      type: [String, Array, Object]
    },
    files: {
      type: Array,
      required: false
    },
    rotatable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [ImageResizeMixin],
  components: {
    draggable
  },
  data() {
    return {
      index: 0,
      previews: {},
      fileBlobs: {},
      fileKeys: [],
      loading: {},
    }
  },
  computed: {
    filesCount() {
      return Object.keys(this.previews).length;
    }
  },
  methods: {
    async filesDrop(e) {
      e.preventDefault();
      
      let droppedFiles = e.target.files || e.dataTransfer.files;
      const newFiles = []

      for (let i = 0; i < droppedFiles.length; i++) {
        let isImage = droppedFiles[i].type.match('image.*');
        if(!isImage || this.filesCount === this.maxFiles) break;
        
        let key = 'new_' + String(Math.random()).split('.')[1];
        
        this.$set(this.fileBlobs, key, droppedFiles[i]);
        this.$set(this.previews, key, '');

        this.fileKeys.push(key);

        let resizedFile = await this.getResizedImage(droppedFiles[i]);
        this.$set(this.fileBlobs, key, resizedFile);
        this.$set(this.previews, key, URL.createObjectURL(resizedFile));

        newFiles.push({ file: resizedFile, key });
      }

      this.passSortedBlobs();
      this.$emit('addFiles', newFiles);

      e.target.value = '';
    },
    hasFile(key) {
      return this.previews[key] !== '';
    },
    isNewFile(key) {
      return typeof key === 'string' && key.includes('new');
    },
    fileDelete(key) {
      this.$delete(this.previews, key);
      this.$delete(this.fileBlobs, key);

      this.fileKeys.splice(this.fileKeys.indexOf(key), 1);

      this.$emit('removeFile', key);
      if (!this.isNewFile(key)) 
        this.$emit('delete', key);
      this.passSortedBlobs();
    },
    dragFile(e) {
      this.$emit('dragEnd', e)
      this.passSortedBlobs();
      this.$forceUpdate();
    },
    passSortedBlobs() {
      this.$emit('change-saved', this.fileKeys
        .filter(key => this.isNewFile(key))
        .map(key => this.fileBlobs[key])
      );
      this.$emit('change-ids', this.fileKeys
        .map((key, index) => ({ position: index, id: key }))
        .filter(obj => !this.isNewFile(obj.id))
      );
    },
    updateInitialData() {
      Object.assign(this.$data, this.$options.data.apply(this));
      this.initialKeys?.map((key, index) => {
        this.$set(this.fileBlobs, key, null);
        this.$set(this.previews, key, this.$withBaseUrl(this.initialImages[index]));
        this.$set(this.fileKeys, index, key);
      });
    },
    showLoader(key) {
      if (this.hasFile(key)) {
        if (this.files) {
          return !this.files.find(f => f.key === key)?.id
        }
      } else {
        return true
      }
      return false
    },
    getFileIndex(key) {
      return this.fileKeys.findIndex(fKey => fKey === key);
    },
    fileRotate(key, index) {
      if (this.loading[key]) return;
      this.$emit('file-rotated', index, key);
      this.$set(this.loading, key, true);
    },
  },
  created() {
    this.updateInitialData();
    this.$nuxt.$on('gallery-update', this.updateInitialData);
    this.passSortedBlobs();
  },
  watch: {
    initialKeys() {
      this.updateInitialData();
    }
  }
}
</script>