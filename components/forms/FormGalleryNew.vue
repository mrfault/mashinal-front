<template>
   <div class="form-gallery-new">
      <div class="row full-width p-0 m-0">
         <div class="col-md-12">
            <h2 class="form-gallery-new-title">{{$t('upload_other_photos')}}</h2>
         </div>
         <div class="col-md-12">
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
                      <icon name="camera" />
                     <p>{{ $t('add_image')}}</p>
                  </div>
               </label>
            </div>
         </div>
         <div class="col-md-12">
            <draggable v-model="files" class="row" draggable=".draggable">
               <div class="col-md-6 draggable" v-for="file in files" :key="file.key" :class="itemClass">
                  <loader v-if="file.loading" />
                  <template v-else>
                     <div class="form-gallery-new-item">
                        <div class="form-gallery-new-item-image">
                           <img :src="file.preview" class="img-fluid" alt="test">
                        </div>
                        <div class="form-gallery-new-item-content">
                           <button class="form-gallery-new-item-remove" @click.stop="deleteFile(file.key)">
                              <inline-svg src="/icons/delete.svg"/>
                           </button>
                           <div>
                              <button class="form-gallery-new-item-rotate" v-if="rotatable" @click.prevent="rotateFile(file.key, 'left')">
                                 <inline-svg src="/icons/left-rotate.svg"  size="20"/>
                              </button>
                              <button class="form-gallery-new-item-rotate mirror-icon" v-if="rotatable" @click.prevent="rotateFile(file.key, 'right')">
                                 <inline-svg src="/icons/left-rotate.svg"  size="20"/>
                              </button>
                           </div>
                        </div>
                     </div>
                  </template>
               </div>
               <!-- Header -->
               <template slot="header">
                  <slot name="header"/>
               </template>
            </draggable>
         </div>
      </div>
   </div>
</template>
<script>
import Draggable from 'vuedraggable';
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import {ImageResizeMixin} from '~/mixins/img-resize';

export default {
   mixins: [ToastErrorsMixin, ImageResizeMixin],
   components:{
      Draggable
   },
   props: {
      itemClass: {
         type: [String, Array, Object],
         required: false,
         default: ''
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
      getName(path) {
         return path.split("/").pop();
      },
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
      async rotateFile(key, position = 'left') {
         const file = this.files.find(f => f.key === key)
         if (file) {
            this.setFilePropertyByKey(key, 'loading', true)
            try {
               const { data } = await this.$axios.$get(`/media/${file.id}/rotate/${position}`);
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

<style>
.form-gallery-new{
   border-radius: 12px;
   border: 1px solid var(--gray-300, #CDD5DF);
   background: #FFF;
   display: flex;
   padding: 24px;
   flex-direction: column;
   align-items: flex-start;
   gap: 20px;
   align-self: stretch;
}
.form-gallery-new-title{
   color: #374151;
   font-size: 18px;
   font-style: normal;
   font-weight: 600;
   line-height: 22px;
   margin-bottom: 20px;
}

.form-gallery-new-item{
   cursor: move;
   margin-bottom: 20px;
}

.form-gallery-new-item-remove{
   background: none;
   border: 0;
}
.form-gallery-new-item-remove svg{
   height: 20px;
   width: 20px;
   margin: 0;
   padding: 0;
   display: flex;
   justify-content: center;
   align-items: center;
}

.form-gallery-new-item-rotate{
   background: none;
   border: 0;
}
.form-gallery-new-item-rotate svg{
   height: 16px;
   width: 16px;
   margin: 0;
   padding: 0;
   display: flex;
   justify-content: center;
   align-items: center;
}

.form-gallery-new-item-remove:hover,
.form-gallery-new-item-remove:focus{
   background: none;
   border: 0;
}

.form-gallery-new-item-rotate:hover,
.form-gallery-new-item-rotate:focus{
   background: none;
   border: 0;
}

.form-gallery-new-item-image{
   border-radius: 12px;
   border: 1px solid var(--gray-300, #CDD5DF);
}

.form-gallery-new-item-image img{
   border-radius: 12px;
   width: 100%;
   object-fit: cover;
   height: 122px;
}
.form-gallery_thumbnail {
   padding: 35px;
   border-radius: 12px;
   margin-bottom: 20px;
}
.form-gallery-new-item-content{
   display: flex;
   justify-content: space-between;
   align-items: center;
   border-radius: 6px;
   background:  #E5E7EB;
   padding: 4px 12px;
   gap: 10px;
   align-self: stretch;
   margin-top: 10px;
}

.mirror-icon svg{
   transform: scaleX(-1);
}
.form-gallery-new-item-information{

}

.form-gallery-new-item-name{
   color: #374151;
   font-size: 14px;
   font-style: normal;
   font-weight: 500;
   line-height: 16px;
   padding: 0;
   margin-bottom: 10px;
}
.form-gallery-new-item-size{
   color: #64748B;
   font-size: 13px;
   font-style: normal;
   font-weight: 400;
   line-height: 16px;
   padding: 0;
}

.dark-mode{
   .form-gallery-new{
      border: 1px solid var(--gray-800, #1B2434);
      background: var(--gray-800, #1B2434);
   }
   .form-gallery-new-title{
      color: #bcc2c9;
   }
   .form-gallery-new-item-content{
      background-color: #3A3A3C;
      border: 1px solid #3A3A3C;
   }
   .form-gallery-new-item-name{
      color: #fff;
   }
   .form-gallery-new-item-size{
      color: #9AA4B2;
   }
   .form-gallery-new-item-remove svg path{
      fill: #fff;
      stroke: #fff;
   }

   .form-gallery-new-item-rotate svg path{
      fill: red;
      stroke: red;
   }
   .form-gallery_thumbnail{
      background-color: #3a3a3d;
      color: #FFF;
   }
   .form-gallery_thumbnail:hover,
   .form-gallery_thumbnail:focus{
      background-color: #606061;
      border-color: #606061;
   }
   .form-gallery_thumbnail.add-image .overlay i,
   .form-gallery_thumbnail.add-image .overlay p{
      color: #FFF;
   }
}
</style>
