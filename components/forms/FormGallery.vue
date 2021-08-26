<template>
  <div class="form-gallery mb-n2 mb-lg-n3">
    <draggable v-model="fileKeys" @end="dragFile" draggable=".draggable" :sort="true" group="people" class="row">
      <div class="col-4 col-lg-1-8 mb-2 mb-lg-3 draggable" v-for="key in fileKeys" :key="key">
        <div class="form-gallery_thumbnail">
          <template v-if="hasFile(key)">
            <img :src="previews[key]" alt="" />
            <div class="overlay">
              <!-- <button class="btn-sq" @click.stop="fileRotate(key, getFileIndex(key))">
                <icon name="reset" />
              </button> -->
              <button class="btn-sq ml-auto" @click.stop="fileDelete(key)">
                <icon name="cross" />
              </button>
            </div>
          </template>
          <loader v-else />
        </div>
      </div>
      <div class="col-4 col-lg-1-8 mb-2 mb-lg-3" v-if="filesCount < maxFiles">
        <label class="form-gallery_thumbnail add-image" for="upload-input">
          <input class="sr-only" type="file" id="upload-input" multiple accept="image/*" @change="filesDrop"/>
          <div class="overlay">
            <icon name="camera" />
            <p>{{ $t('add_image')}}</p>
          </div>
        </label>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  props: {
    maxFiles: {
      type: Number,
      default: 21
    },
    initialImages: Array,
    initialKeys: Array
  },
  components: {
    draggable
  },
  data() {
    return {
      index: 0,
      previews: {},
      fileBlobs: {},
      fileKeys: []
    }
  },
  computed: {
    filesCount() {
      return Object.keys(this.previews).length;
    },
    filesLoaded() {
      return !Object.keys(this.previews).filter(preview => !preview).length;
    }
  },
  methods: {
    filesDrop(e) {
      e.preventDefault();
      
      let droppedFiles = e.target.files || e.dataTransfer.files;

      for (let i = 0; i < droppedFiles.length; i++) {
        let isImage = droppedFiles[i].type.match('image.*');
        if(!isImage || this.filesCount === this.maxFiles) break;
        
        let key = 'new_' + this.index;
        this.index++;
        
        this.$set(this.fileBlobs, key, droppedFiles[i]);
        this.$set(this.previews, key, '');

        this.fileKeys.push(key);

        let reader = new FileReader();

        reader.addEventListener('load', () => {
          this.$set(this.previews, key, reader.result);
          if(this.filesLoaded) this.passSortedBlobs();
        });
        reader.readAsDataURL(this.fileBlobs[key]);
      }

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

      if (!this.isNewFile(key)) 
        this.$emit('delete', key);
      this.passSortedBlobs();
    },
    dragFile() {
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
      this.initialKeys.map((key, index) => {
        this.$set(this.fileBlobs, key, null);
        this.$set(this.previews, key, this.$withBaseUrl(this.initialImages[index]));
        this.$set(this.fileKeys, index, key);
      });
    }
  },
  created() {
    this.updateInitialData();
    this.$nuxt.$on('gallery-update', this.updateInitialData);
    this.passSortedBlobs();
  }
}
</script>