<template>
   <div class="">
      <upload-image
         :max-files="maxFiles"
         :min-files="minFiles"
         :default-files="files"
         :helpers="helperImages"
         @files-changed="updateImages"
         @files-dropped="addImages"
         @file-deleted="deleteImage"
         @file-rotated="rotateImage"
         @order-changed="changeOrder"
         ref="sellLastStepUploadImage"
      />
   </div>
</template>

<script>
import UploadImage from "~/components/elements/UploadImage.vue";
import {mapActions} from "vuex";
import {ToastErrorsMixin} from "~/mixins/toast-errors";
import {ImageResizeMixin} from "~/mixins/img-resize";
import {PaymentMixin} from "~/mixins/payment";

export default {
   components: {UploadImage},
   mixins: [ToastErrorsMixin, ImageResizeMixin, PaymentMixin],
   props: {
      initialForm: {},
      announcement: {},
      type: String,
      deletedFiles: []
   },
   data() {
      return {
         form: this.$clone(this.initialForm),
         files: ((this.type === 'parts' ? this.announcement?.defaultImages : this.announcement?.media) || []).map((media, i) => ({
            media,
            key: this.initialForm.saved_images[i]
         })),
         minFiles: 3,
         maxFiles: 20,
         savedFiles: [...this.initialForm.saved_images],
         uploading: 0,
         date: Math.floor(Date.now() / 1000)
      }
   },
   computed: {
      helperImages() {
         let imgs = [1, 2, 3];
         return this.type === 'parts' ? [] : imgs.map(n => {
            return {
               url: `/img/sell-helpers/${this.type}_${n}.png`,
               name: this.$t(`sell_item_${this.type}_${n}`)
            }
         });
      }
   },
   methods: {
      ...mapActions(['setSellPreviewData']),
      updateImages(files) {
         this.files = files;
         this.setSellPreviewData({value: files[0]?.image, key: 'image'});
      },
      async addImages(images) {
         // passed min limit
         if ((images.length + this.savedFiles.length + this.uploading) >= this.minFiles)
            this.removeError('saved_images');
         // upload images
         this.uploading += images.length;
         await Promise.all(
            images.map(async (image) => {
               let formData = new FormData();
               // let file = await this.getResizedImage(image.file);
               let file = image.file;
               formData.append('temp_id', this.date);
               formData.append('images[]', file);
               try {
                  const data = await this.$axios.$post(`${this.$env().API_SECRET}/media/upload/images`, formData, {
                     progress: false,
                     headers: {'Content-Type': 'multipart/form-data'}
                  });
                  this.uploading--;
                  this.$nuxt.$emit('image-uploaded', image.key, false, data.images[0], data.ids[0]);
                  this.$nuxt.$emit('hide-image-preloader-by-key', image.key);
                  this.savedFiles = [...this.savedFiles, ...data.ids];
                  this.initialForm.saved_images = this.savedFiles;
               } catch ({response: {data: {data}}}) {
                  this.uploading--;
                  this.$nuxt.$emit('delete-image-by-key', image.key);
                  this.clearErrors();
                  for (let key in data) {
                     this.$toasted.error(data[key]);
                  }
               }
            })
         );
      },
      async deleteImage(index) {
         if (this.savedFiles[index]) {
            if (this.form.saved_images.includes(this.savedFiles[index]))
               this.deletedFiles.push(this.savedFiles[index]);
            else this.$axios.$post('/remove_temporary_image/' + this.savedFiles[index]);
            this.$delete(this.savedFiles, index);
         }
         this.initialForm.saved_images.filter((image) => image !== this.savedFiles[index])
         if (this.files.length) {
            this.$nuxt.$emit('get-main-image', '');
         }
      },
      async rotateImage(index, key) {
         if (this.savedFiles[index]) {
            try {
               this.$nuxt.$loading.start();
               const {data} = await this.$axios.$get(`/media/${this.savedFiles[index]}/rotate/right`);
               this.$nuxt.$loading.finish();
               this.$nuxt.$emit('image-uploaded', key, true, data.thumb);
               this.$nuxt.$emit('hide-image-preloader-by-key', key);
            } catch ({response: {data: {data}}}) {
               this.$nuxt.$emit('hide-image-preloader-by-key', key);
               this.$nuxt.$loading.finish();
               this.clearErrors();
               for (let key in data) {
                  this.$toasted.error(data[key]);
               }
            }
         }
      },
      changeOrder(sorted, preview) {
         this.$set(this, 'savedFiles', sorted);
         this.initialForm.saved_images = sorted
         this.$nuxt.$emit('get-main-image', preview);
         this.setSellPreviewData({value: preview, key: 'image'});
      },
   },

   watch: {
      files() {
         if (this.files.length) {
            this.$nuxt.$emit('get-main-image', this.files[0].image);
         }
         // else {
         //    this.$nuxt.$emit('get-main-image', '');
         // }
      }
   }
}
</script>

<style lang="scss" scoped>

</style>
