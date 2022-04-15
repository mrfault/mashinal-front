<template>
  <div :class="['form-image', {'position-relative': autoSizing}]">
    <croppa :class="['croppa-image', {'auto-size': autoSizing, 'prevent-move': noImage}]"
      v-if="croppable"
      :key="refreshCroppa"
      v-model="croppaValue" placeholder=""
      :initial-image="initialImage"
      :accept="'image/*'"
      :canvas-color="'transparent'"
      :zoom-speed="15"
      :width="width || 200"
      :height="height || 200"
      :quality="2"
      :prevent-white-space="true"
      :show-remove-button="false"
      :replace-drop="true"
      :auto-sizing="autoSizing"
      :disable-drag-to-move="noImage"
      :disable-scroll-to-zoom="noImage"
      @new-image="$emit('new-image')"
    >
      <span @click="removeCover" v-if="showRemoveButton && $store.getters.mySalon.cover" class="drop-file" style="right: 40px;font-size: 13px;">
            <icon name="garbage"/>
      </span>
      <span class="drop-file" @click="croppaValue.chooseFile()">

        <!-- <icon name="camera" /> -->
        <inline-svg src="/icons/camera.svg" :height="14" />
      </span>
    </croppa>
    <template v-else>
      <input class="sr-only" type="file" accept="image/*" @change="filesDrop"/>
      <loader v-if="preview === '' && !initialImage" />
      <img :src="preview || initialImage" alt="" v-else />

      <span class="drop-file">

        <inline-svg src="/icons/camera.svg" :height="14" />
      </span>
    </template>
  </div>
</template>

<script>
import { ImageResizeMixin } from '~/mixins/img-resize';

export default {
  props: {
    refreshCroppa: 0,
    value: {},
    type:"",
    initialImage: {},
    autoSizing: Boolean,
    croppable: Boolean,
    width: Number,
    height: Number,
    noImage: Boolean
  },
  mixins: [ImageResizeMixin],
  data() {
    return {
      preview: '',
      showRemoveButton: true,
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
    removeCover() {
      if(confirm(this.$t('are_you_sure'))) {
        this.showRemoveButton = false;
        this.$emit('removeImage',this.type);
      }
    },
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
