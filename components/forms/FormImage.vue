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
export default {
  props: {
    value: {},
    initialImage: {}
  },
  data() {
    return {
      preview: ''
    }
  },
  methods: {
    filesDrop(e) {
      e.preventDefault();
      
      let droppedFiles = e.target.files || e.dataTransfer.files;

      for (let i = 0; i < droppedFiles.length; i++) {
        let isImage = droppedFiles[i].type.match('image.*');
        if(!isImage) break;
        
        this.$emit('input', droppedFiles[i]);

        let reader = new FileReader();

        reader.addEventListener('load', () => {
          this.preview = reader.result;
        });

        reader.readAsDataURL(droppedFiles[i]);
      }

      // e.target.value = '';
    }
  },
}
</script>