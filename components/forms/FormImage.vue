<template>
  <div class="form-image">
    <input class="sr-only" type="file" accept="image/*" @change="filesDrop"/>
    <loader v-if="preview === '' && !initialImage" />
    <img :src="preview || initialImage" alt="" v-else />
    <span class="drop-file">
      <icon name="camera" />
    </span>
  </div>
</template>

<script>
import { ImageResizeMixin } from '~/mixins/img-resize';

export default {
  props: {
    value: {},
    initialImage: {}
  },
  mixins: [ImageResizeMixin],
  data() {
    return {
      preview: ''
    }
  },
  methods: {
    async filesDrop(e) {
      e.preventDefault();
      
      let droppedFiles = e.target.files || e.dataTransfer.files;

      for (let i = 0; i < droppedFiles.length; i++) {
        let isImage = droppedFiles[i].type.match('image.*');
        if(!isImage) break;
        
        let resizedFile = await this.getResizedImage(droppedFiles[i]);
        this.$emit('input', resizedFile);
        this.preview = URL.createObjectURL(resizedFile);
      }
    }
  },
}
</script>