<template>
   <div :class="['form-image', {'position-relative': autoSizing}]">

      <croppa :class="['croppa-image', {'auto-size': autoSizing, 'prevent-move': noImage}]"
              v-if="croppable"
              :key="refreshCroppa"
              v-model="croppaValue" placeholder=""
              :initial-image="image+'?v=2'"
              :accept="'image/*'"
              :canvas-color="'transparent'"
              :zoom-speed="15"
              :width="width || 72"
              :height="height || 72"
              :quality="2"
              :prevent-white-space="true"
              :show-remove-button="true"
              :replace-drop="true"
              :auto-sizing="autoSizing"
              :disable-drag-to-move="noImage"
              :disable-scroll-to-zoom="noImage"
              @new-image="$emit('new-image')">

      <span class="drop-file">

         <button class="btn btn-white bg-white" @click="removeCover" v-if="showRemoveButton && $store.getters.mySalon[type]">
            <inline-svg src="/icons/trash.svg" :height="18"/>
         </button>

         <!--TODO-->
         <button @click="removeImage" v-if="false">
            <inline-svg src="/icons/trash.svg" :height="18"/>
         </button>

         <button class="btn btn-white bg-white ml-1" v-if="type === 'cover'" @click="croppaValue.chooseFile()">
            Örtük şəklini dəyiş
         </button>

         </span>
      </croppa>

      <template v-else>
         <input class="sr-only" type="file" accept="image/*" @change="filesDrop"/>
         <loader v-if="preview === '' && !image"/>
         <img :src="preview || image" alt="" v-else/>

         <span class="drop-file">

        <inline-svg src="/icons/camera.svg" :height="14"/>
      </span>
      </template>

      <modal-popup
         :toggle="showConfirm"
         :title="$t('remove_image')"
         @close="showConfirm = false"
      >
         <p>{{ $t('are_you_sure') }}</p>
         <hr/>
         <form class="form" @submit.prevent="removeImage" novalidate>
            <div class="row">
               <div class="col">
                  <button type="button" class="btn btn--primary-outline full-width" @click="showConfirm = false">
                     {{ $t('no') }}
                  </button>
               </div>
               <div class="col">
                  <button type="submit" :class="['btn btn--green full-width']">
                     {{ $t('yes') }}
                  </button>
               </div>
            </div>
         </form>
      </modal-popup>
   </div>
</template>

<script>
import {ImageResizeMixin} from '~/mixins/img-resize';
export default {
   created() {
      this.$root.$refs.FormImage = this;
   },

   props: {
      refreshCroppa: 0,
      value: {},
      type: "",
      initialImage: {},
      autoSizing: Boolean,
      croppable: Boolean,
      width: Number,
      height: Number,
      noImage: Boolean,
   },
   mixins: [ImageResizeMixin],
   data() {
      return {
         preview: '',
         showRemoveButton: true,
         showConfirm: false,
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
      },
      image() {
         if (this.initialImage ) {
            return (this.initialImage.includes('http') ? '' : 'https://dev.mashin.al/') + this.initialImage;
         }

         return this.initialImage;
      }
   },
   methods: {
      removeCover() {
         this.showConfirm = true;
      },
      removeImage() {
         this.showRemoveButton = false;
         this.$emit('removeImage', this.type);
         this.showConfirm = false;
      },
      async filesDrop(e) {
         e.preventDefault();
         let droppedFiles = e.target.files || e.dataTransfer.files;

         for (let i = 0; i < droppedFiles.length; i++) {
            let isImage = droppedFiles[i].type.match('image.*');
            if (!isImage) break;

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

<style>
.btn-white{
   display: flex;
   padding: 8px 10px;
   align-items: center;
   gap: 6px;
   border-radius: 8px;
   background: #FFF;
}
.btn--primary-outline{
   height: 52px;
   padding: 14px 16px 14px 16px;
   border-radius: 8px;
   gap: 8px;
}
</style>
