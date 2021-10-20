<template>
  <div :class="['form-image', {'position-relative': autoSizing}]">
    <croppa :class="['croppa-image', {'auto-size': autoSizing}]" 
      v-if="croppable"
      v-model="croppaValue" placeholder="" 
      :initial-image="initialImage"
      :accept="'image/*'"
      :canvas-color="'transparent'"
      :zoom-speed="15" 
      :width="width || 200"
      :height="height || 200"
      :quality="1"
      :prevent-white-space="true" 
      :show-remove-button="false"
      :replace-drop="true"
      :auto-sizing="autoSizing"
    >
      <span class="placeholder" v-if="!croppaValue || !croppaValue.imageSet">
        <icon name="img" />
      </span>
      <span class="drop-file" @click="croppaValue.chooseFile()">
        <icon name="camera" />
      </span>
    </croppa>
    <template v-else>
      <input class="sr-only" type="file" accept="image/*" @change="filesDrop"/>
      <loader v-if="preview === '' && !initialImage" />
      <img :src="preview || initialImage" alt="" v-else />
      <span class="drop-file">
        <icon name="camera" />
      </span>
    </template>
  </div>
</template>

<script>
import { ImageResizeMixin } from '~/mixins/img-resize';

export default {
  props: {
    value: {},
    initialImage: {},
    autoSizing: Boolean,
    croppable: Boolean,
    width: Number,
    height: Number
  },
  mixins: [ImageResizeMixin],
  data() {
    return {
      preview: '',
    }
  },
  computed: {
    croppaValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
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
  mounted() {
    this.$nextTick(() => {
      if (this.croppable) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    });
  }
}
</script>