<template>
  <div class="sell_parts-form">
    <form class="form" novalidate>
      <!-- General Information -->
      <h2 class="title-with-line mt-3 mt-lg-0" id="anchor-general-information">
        <span>{{ $t('general_informations') }} <span class="star"> *</span></span>
      </h2>
      <div class="row">
        <div class="col-lg-4 mb-3">
          <form-text-input
            :placeholder="$t('product_code')"
            v-model="form.product_code"
          />
        </div>
        <div class="col-lg-4 mb-3">
          <form-text-input
            :placeholder="$t('title_max_character', { max: 20 })"
            v-model="form.title"
            :invalid="$v.form.title.$error"
          />
        </div>
        <div class="col-12 mb-2">
          <form-textarea
            :placeholder="$t('description_placeholder', { max: 20 })"
            v-model="form.description"
          />
        </div>
        <div class="col-12">
          <p class="px-2">
            {{ $t('sell_parts_description_warning') }}
          </p>
        </div>
      </div>

      <!-- Specifications -->
      <h2 class="title-with-line mt-3 mt-lg-0" id="anchor-specification">
        <span>{{ $t('parts') }} <span class="star"> *</span></span>
      </h2>
      <div class="row">
        <!-- Category -->
        <div class="col-lg-4 mb-3 mb-lg-0">
          <form-select
            :label="$t('category')"
            :options="categories"
            v-model="form.category_id"
            @change="categorySelected"
            :invalid="$v.form.category_id.$error"
          />
        </div>

        <!-- Subcategory -->
        <div class="col-lg-4 mb-3 mb-lg-0" v-if="subcategories.length">
          <form-select
            :label="$t('subcategory')"
            :options="subcategories"
            v-model="form.sub_category_id"
            :invalid="$v.form.sub_category_id.$error"
          />
        </div>

        <!-- Brand -->
        <div class="col-lg-4 mb-3 mb-lg-0" v-if="brands.length">
          <form-select
            :label="$t('select_brand')"
            :options="brands"
            v-model="form.brand_id"
          />
        </div>
        
        <div v-if="form.category_id" class="col-12 mt-3">
          <div class="row">

            <!-- Condition -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                :label="`${$t('new')}/${$t('S_H')}`"
                v-model="form.is_new"
                :options="conditionButtons"
                btn-class="primary-outline"
                :group-by="2"
              />
            </div>

            <!-- Originality -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                :label="`${$t('original')}/${$t('duplicate')}`"
                v-model="form.is_original"
                :options="originalityButtons"
                btn-class="primary-outline"
                :group-by="2"
              />
            </div>

            <!-- Dynamic filters -->
            <div
              class="col-lg-4 mb-3"
              v-for="filter in dynamicFilters"
              :key="'filter-' + filter.id"
            >
              <!-- Select -->
              <form-select
                v-if="filter.component === 'multiselect-component'"
                v-model="form[filter.key]"
                :label="$t(filter.key)"
                :options="filter.values"
                @change="dynamicFilterOnChange(filter.key, $event)"
                has-search
                translateOptions
              />

              <!-- Checkbox -->
              <form-checkbox
                v-if="filter.component === 'checkbox-component'"
                v-model="form[filter.key]"
                :label="$t(filter.key)"
                :checked-value="form[filter.key]"
                :id="'dynamic-filter-' + filter.key"
              />
            </div>

            <!-- Price -->
            <div class="col-lg-8 mb-3 price-input-group">
              <form-numeric-input
                :placeholder="$t('price')"
                v-model="form.price"
              />
              <form-checkbox
                v-model="form.is_negotiable"
                :label="$t('is_negotiable')"
                checked-value="is_negotiable"
                id="is_negotiable"
              />
            </div>

            <!-- Region -->
            <div class="col-lg-4 mb-3" v-if="regions.length">
              <form-select
                v-model="form.region_id"
                :label="$t('region')"
                :options="regions"
                has-search
              />
            </div>

            <!-- Delivery -->
            <div class="col-lg-4 mb-3">
              <form-checkbox
                v-model="form.have_delivery"
                :label="$t('have_delivery')"
                checked-value="delivery"
                id="delivery"
              />
            </div>

            <!-- Warranty -->
            <div class="col-lg-4 mb-3">
              <form-checkbox
                v-model="form.have_warranty"
                :label="$t('have_warranty')"
                checked-value="warranty"
                id="warranty"
              />
            </div>
          </div>
        </div>

        <div class="col-12">
          <form-keywords v-model="form.keywords"/>
        </div>

        <div class="col-12">
          <p class="px-2">
            {{ $t('sell_parts_keywords_info') }}
          </p>
        </div>
      </div>

      <!-- Upload image -->
      <h2 class="title-with-line mt-3 mt-lg-0" id="anchor-image">
        <span>{{ $t('image') }} <span class="star"> *</span></span>
      </h2>
      <div class="row parts_image-upload">
        <div class="col-12">
          <form-gallery
            :maxFiles="maxFiles"
            :initialImages="files.map(({file}) => file)"
            :initialKeys="files.map(({key}) => key)"
            :files="files"
            itemClass="col-4 col-lg-1-5 mb-lg-3 mb-2"
            rotatable
            @addFiles="addFiles"
            @removeFile="removeFile"
            @dragEnd="onDragEnd"
            @file-rotated="rotateImage"
          >
            <template v-slot:pre >
              <div class="col-12 col-lg-3-5 mb-lg-3 mb-2">
                <div class="upload-rules">
                  <div class="upload-rules__image">
                    <img src="/img/parts_upload_rules.png">
                  </div>
                  <div class="upload-rules__content">
                    <div class="upload-rules__content__title">
                      {{ $t('terms_of_image_attachment') }}
                    </div>
                    <ul class="upload-rules__content__list">
                      <li>{{ $t('min_image_count', { count: 1 })}}</li>
                      <li>{{ $t('max_image_count', { count: 22 }) }}</li>
                      <li>{{ $t('min_image_size', { w: 500, h: 500 }) }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
          </form-gallery>
        </div>
      </div>

      <div class="row d-flex justify-content-end">
        <div class="col-12 col-lg-1-5">
          <button class="btn btn--green mt-3" type="button" @click="submit">
            {{ $t('place_announcement') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { required, requiredIf, minLength, maxLength } from 'vuelidate/lib/validators';
import FormKeywords from '~/components/forms/FormKeywords.vue'
import FormGallery from '~/components/forms/FormGallery.vue'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    initialForm: {
      type: Object,
      required: false,
      default: null
    }
  },
  components: {
    FormKeywords,
    FormGallery
  },
  async fetch() {
    await this.$store.dispatch('parts/getCategories')
  },
  data() {
    return {
      form: {
        product_code: '',
        title: '',
        description: '',
        category_id: '',
        sub_category_id: '',
        region_id: 1,
        brand_id: '',
        is_new: true,
        is_original: true,
        have_delivery: false,
        have_warranty: false,
        price: '',
        is_negotiable: false,
        keywords: []
      },
      filters: {
        sub_categories: [],
        brands: [],
        regions: [],
        filters: [],
      },
      maxFiles: 22,
      files: [],
      date: Math.floor(Date.now() / 1000),
      upload_ended: true
    }
  },
  mounted() {
    if (this.initialForm) {
      this.form = {
        ...this.form,
        ...this.initialForm
      }

      this.getFilters(this.initialForm.category_id)

      this.files = this.initialForm.defaultImages.map((image, index) => {
        return {
          file: image,
          id: this.initialForm.defaultImageIds[index],
          key: this.initialForm.defaultImageIds[index],
        }
      })
    }
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      category_id: {
        required
      },
      sub_category_id: {
        required: requiredIf(function() {return this.filters.sub_categories.length})
      },
    }
  },
  methods: {
    ...mapActions(['setSellPreviewData']),
    categorySelected(id) {
      this.form = {
        ...this.form,
        sub_category_id: '',
        brand_id: '',
        region_id: 1,
        is_new: true,
        is_original: true,
      }

      this.filters = {
        sub_categories: [],
        brands: [],
        regions: [],
        filters: [],
      }

      if (id) {
        this.getFilters(id)
      }
    },
    async getFilters(category_id) {
      this.filters = await this.$axios.$get(`/part/category/${category_id}/filters`)

      const defaults = {
        'multiselect-component': '',
        'checkbox-component': false,
      }
      
      this.filters.filters.forEach(filter => {
        if (!Object.keys(this.form).includes(filter.key)) {
          this.form[filter.key] = defaults[filter.component]
        }
      })
    },
    dynamicFilterOnChange(key, value) {
      this.form = {...this.form}
    },
    async submit() {
      this.$v.$touch();

      if (!this.upload_ended) {
        this.$toasted.error(this.$t('please_wait_for_all_image_loading'));
        return false;
      }
      
      if (!this.files.length) {
        this.$toasted.error(this.$t('content_component_error_image'));
        return false;
      }

      if (!(this.$v.$pending || this.$v.$error)) {
        let data = {...this.form}
        data = this.removeEmptyKeys({
          ...this.form,
          tags: this.form.keywords.map(keyword => ({ text: keyword })),
          saved_images: this.files.map(({ id }) => id),
          deletedIds: []
        })

        delete data.keywords;

        const formData = new FormData()
        formData.append('data', JSON.stringify(data))

        try {
          let requestURL;
          if (this.isEdit) {
            requestURL= '/sell/part/edit/' + this.form.id;
          } else {
            requestURL= '/sell/part/post/publish';
          }
          const response = await this.$axios.post(requestURL, formData)
          this.$router.push(this.$localePath('/profile/announcements'))
        } catch(error) {
          console.error(error)
        }
      }
    },
    addFiles(files) {
      this.upload_ended = false;
      const file = files[0];

      

      this.uploadFile(file.file).then(uploadedFile => {
        this.files.push({
          id: uploadedFile.id,
          key: file.key,
          file: uploadedFile.path,
        })
        
        // Recursion for sequential insert
        const newFiles = [...files];
        newFiles.shift()
        if (newFiles.length) {
          this.addFiles(newFiles)
        } else {
          this.upload_ended = true;
        }
      }).catch(error => {
        this.upload_ended = true;
      })
    },
    removeFile(key) {
      this.files = this.files.filter(file => file.key !== key)
    },
    onDragEnd(e) {
      if (this.upload_ended) {
        const [file] = this.files.splice(e.oldDraggableIndex, 1)
        this.files.splice(e.newDraggableIndex, 0, file)
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('temp_id', this.date)
      formData.append('images[]', file);

      const data = await this.$axios.$post('/upload_temporary_images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        id: data.ids[0],
        path: data.images[0]
      }
    },
    removeEmptyKeys(obj) {
      const result = {};
      
      Object.entries(obj).map((obj) => {
        const key = obj[0]
        const value = obj[1]
        if (!(value === null || value === undefined || value === '')) {
          result[key] = value
        }
      })

      return result
    },
    updatePreview() {
      if (this.form.region_id && this.regions.length) {
        this.setSellPreviewData({
          key: 'region',
          value: this.regions.find(r => r.id === this.form.region_id)?.name
        });
      }
      if (this.form.price) {
        this.setSellPreviewData({
          key: 'price',
          value: this.form.price
        });
      }
      this.setSellPreviewData({
        key: 'is_negotiable',
        value: this.form.is_negotiable
      });
      this.setSellPreviewData({
        key: 'title',
        value: this.form.title
      });
      this.setSellPreviewData({
        key: 'image',
        value: this.files[0]?.file
      });

      // For tyres and rims
      if (this.form.shine_width) {
        this.setSellPreviewData({
          key: 'shine_width',
          value: this.dynamicFilters
            .find(f => f.key === 'shine_width')
            .values
            .find(v => v.id === this.form.shine_width)
            .name
        });
      }
      if (this.form.diameter) {
        this.setSellPreviewData({
          key: 'diameter',
          value: this.dynamicFilters
            .find(f => f.key === 'diameter')
            .values
            .find(v => v.id === this.form.diameter)
            .name
        });
      }
      if (this.form.height) {
        this.setSellPreviewData({
          key: 'height',
          value: this.dynamicFilters
            .find(f => f.key === 'height')
            .values
            .find(v => v.id === this.form.height)
            .name
        });
      }
    },
    async rotateImage(index, key) {
      if (this.files[index]) {
        try {
          this.$nuxt.$loading.start();
          const { data } = await this.$axios.$get(`/media/${this.files[index].id}/rotate/right`);
          this.files.find(f => f.key === key).file = data.thumb
          this.$nuxt.$loading.finish();
        } catch({response: {data: {data}}}) {
          this.$nuxt.$loading.finish();
          this.clearErrors();
          for (let key in data) {
            this.$toasted.error(data[key]);
          }
        }
      }
    }
  },
  computed: {
    conditionButtons() {
      return [
        {
          key: true,
          name: this.$t('new')
        },{
          key: false,
          name: this.$t('S_H')
        }
      ]
    },
    originalityButtons() {
      return [
        {
          key: true,
          name: this.$t('original')
        },{
          key: false,
          name: this.$t('duplicate')
        }
      ]
    },
    categories() {
      return this.$store.getters['parts/categories'].filter(c => c.show_on_form)
    },
    subcategories() {
      return this?.filters?.sub_categories || []
    },
    regions() {
      return this?.filters?.regions || []
    },
    brands() {
      return this?.filters?.brands || []
    },
    dynamicFilters() {
      return this?.filters?.filters || []
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.updatePreview()
      }
    },
    files: {
      deep: true,
      handler() {
        this.updatePreview()
      }
    }
  }
}
</script>