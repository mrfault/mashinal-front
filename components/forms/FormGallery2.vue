<template>
  <div class="form-gallery mb-n2 mb-lg-n3">
    <div
      v-for="file in files"
      :key="file.key"
      :class="itemClass"
    >
      <div class="form-gallery_thumbnail">
        <template>
          <img :src="file.preview"/>
          <div class="overlay">
            <button
              v-if="rotatable"
              class="btn-sq"
              type="button"
              @click.prevent="rotateFile(file.key)"
            >
              <icon name="reset" />
            </button>
            <button
              class="btn-sq ml-auto"
              type="button"
              @click.stop="deleteFile(file.key)"
            >
              <icon name="cross" />
            </button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- File input -->
    <!-- dynamic class -->
    <div class="col-4 col-lg-1-5 mb-lg-3 mb-2">
      <label class="form-gallery_thumbnail add-image" for="upload-input">
        <input
          id="upload-input"
          class="sr-only"
          type="file"
          accept="image/*"
          multiple
          @change="handleFiles"
        />
        <div class="overlay">
          <icon name="camera" />
          <p>{{ $t('add_image')}}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
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
    }
  },
  data() {
    return {
      files: [
        // {
        //   id,
        //   key,
        //   preview,
        //   blob,
        //   loading,
        // }
      ],
      date: Math.floor(Date.now() / 1000),
    }
  },
  methods: {
    handleFiles(event) {
      const files = event.target.files;

      for (const file of files) {
        let isImage = file.type.match('image.*');
        if (!isImage || this.files.length === this.maxFiles) break;

        const fileUniqueKey = String(Math.random()).split('.')[1]

        let reader = new FileReader();
        reader.addEventListener('load', async () => {
          this.files.push({
            key: fileUniqueKey,
            preview: reader.result,
            loading: true
          })
          
          if (this.uploadPath) {
            const { id, path } = await this.uploadFile(file)
            const file = this.files.find(f => f.key === fileUniqueKey);
            file['id'] = id;
            file['preview'] = path;
          }
          
          this.files.find(f => f.key === fileUniqueKey).loading = false
        });
        reader.readAsDataURL(file)
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('temp_id', this.date)
      formData.append('images[]', file);

      const data = await this.$axios.$post(this.uploadPath, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        id: data.ids[0],
        path: data.images[0]
      }
    },
    rotateFile(key) {
      //
    },
    deleteFile(key) {
      const deletedFile = this.files.find(file => file.key === key)
      this.files = this.files.filter(file => file.key !== key)
      this.$emit('fileDeleted', {
        deletedFile,
        files: this.files
      })
    },
  }
}

// addFile
// deleteFile
// rotateFile
// drag
</script>