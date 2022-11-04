<template>
  <div class="form-gallery mb-n2 mb-lg-n3">
    <draggable
      v-model="files"
      class="row full-width"
      draggable=".draggable"
    >
      <!-- Images -->
      <div
        v-for="file in files"
        :key="file.key"
        :class="itemClass"
        class="draggable"
      >
        <div class="form-gallery_thumbnail">
          <loader v-if="file.loading" />
          <template v-else>
            <img :src="file.preview"/>
            <div class="overlay">
              <button
                v-if="rotatable"
                class="btn-transparent"
                type="button"
                @click.prevent="rotateFile(file.key)"
              >
                <!-- <icon name="reset" /> -->
                <inline-svg src="/icons/reset-new.svg" height="14"/>
              </button>
              <button
                class="btn-transparent ml-auto"
                type="button"
                @click.stop="deleteFile(file.key)"
              >
                <icon name="cross" />
                <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
              </button>
            </div>
          </template>
        </div>
      </div>
      
      <!-- File input -->
      <div :class="itemClass" v-if="files.length < this.maxFiles">
        <label class="form-gallery_thumbnail add-image cursor-pointer" for="upload-input">
          <input
            id="upload-input"
            class="sr-only"
            type="file"
            accept="image/*"
            multiple
            @change="handleFiles"
          />
          <div class="overlay">
            <!-- <icon name="camera" /> -->
            <inline-svg src="/icons/camera.svg" :height="14" />
            <p>{{ $t('add_image')}}</p>
          </div>
        </label>
      </div>

      <!-- Header -->
      <template slot="header">
        <slot name="header"/>
      </template>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { ToastErrorsMixin } from '~/mixins/toast-errors';
import { ImageResizeMixin } from '~/mixins/img-resize';

export default {
  mixins: [ToastErrorsMixin, ImageResizeMixin],
  components:{
    Draggable
  },
  props: {
    itemClass: {
      type: [String, Array, Object],
      required: false,
      default: 'col-4 col-lg-1-5 mb-lg-3 mb-2'
    },
    rotatable: {
      type: Boolean,
      required: false,
      default: false
    },
    maxFiles: {
      type: Number,
      required: true
    },
    uploadPath: {
      required: false
    },
    initialFiles: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      files: [],
      date: Math.floor(Date.now() / 1000),
    }
  },
  mounted() {
    this.files = JSON.parse(JSON.stringify(this.initialFiles))
  },
  methods: {
    async handleFiles(event) {
      let files = [...event.target.files];

      if (this.files.length + files.length >= this.maxFiles) {
        files = files.slice(0, this.maxFiles - this.files.length)
        this.$toast.error(this.$t('you_can_add_a_maximum_of_count_photos', { count: this.maxFiles }))
      }

      for (const file of files) {
        let isImage = file.type.match('image.*');
        if (!isImage) break;

        const fileUniqueKey = String(Math.random()).split('.')[1]
        this.files.push({
          key: fileUniqueKey,
          preview: null,
          blob: null,
          loading: true
        })

        this.getResizedImage(file).then(resizedFile => {
          this.fileLoaded(resizedFile, fileUniqueKey)
        });
      }

      event.target.value = '';
    },
    async fileLoaded (file, key) {
      const currentFile = this.files.find(f => f.key === key);
      currentFile.preview = URL.createObjectURL(file);
      currentFile.blob = file;
      currentFile.loading = true;

      if (this.uploadPath) {
        const uploadedFile = await this.uploadFile(file)

        if (uploadedFile) {
          this.setFilePropertyByKey(key, 'id', uploadedFile.id)
          this.setFilePropertyByKey(key, 'preview', uploadedFile.path)
        } else {
          this.deleteFile(key)
        }
      }

      this.setFilePropertyByKey(key, 'loading', false)
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('temp_id', this.date)
      formData.append('images[]', file);

      try {
        const data = await this.$axios.$post(this.uploadPath, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return {
          id: data.ids[0],
          path: data.images[0]
        }
      } catch (error) {
        const response = error.response.data
        if (response.data && Object.keys(response.data).length) {
          for (let key in response.data) {
            this.$toast.error(response.data[key][0])
          }
        }
      }

    },
    async rotateFile(key) {
      const file = this.files.find(f => f.key === key)
      if (file) {
        this.setFilePropertyByKey(key, 'loading', true)
        try {
          const { data } = await this.$axios.$get(`/media/${file.id}/rotate/right`);
          this.setFilePropertyByKey(key, 'preview', data.thumb)
        } catch({response: {data: {data}}}) {
          this.clearErrors();
          for (let key in data) {
            this.$toasted.error(data[key]);
          }
        }
        this.setFilePropertyByKey(key, 'loading', false)
      }
    },
    deleteFile(key) {
      const deletedFile = this.files.find(file => file.key === key)
      this.files = this.files.filter(file => file.key !== key)
      this.$emit('fileDeleted', {
        deletedFile,
        files: this.files
      })
    },
    setFilePropertyByKey(key, property, value) {
      const file = this.files.find(f => f.key === key)
      if (file) {
        file[property] = value
      }
      this.$forceUpdate()
    } 
  },
  computed: {
    loading() {
      return Boolean(this.files.filter(f => f.loading).length)
    }
  },
  watch: {
    initialFiles: {
      deep: true,
      handler(value) {
        this.files = JSON.parse(JSON.stringify(value))
      }
    },
    files: {
      deep: true,
      handler(value) {
        this.$emit('change', value)
      }
    },
    loading(value) {
      this.$emit('loading', value)
    }
  }
}
</script>