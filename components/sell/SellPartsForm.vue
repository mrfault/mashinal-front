<template>
  <div class="sell_parts-form">
    <form class="form" novalidate @submit.prevent>
      <!-- General Information -->
      <h2 class="title-with-line mt-3 mt-lg-0" id="anchor-general-information">
        <span>{{ $t('general_informations') }} <span class="star"> *</span></span>
      </h2>
      <div class="row">
        <div class="col-lg-4 mb-3">
          <form-text-input
            v-model="form.product_code"
            id="anchor-product_code"
            :placeholder="$t('product_code')"
            :invalid="isInvalid('product_code')"
            @change="removeError('product_code')"
          />
        </div>
        <div class="col-lg-4 mb-3">
          <form-text-input
            v-model="form.title"
            :placeholder="$t('title_max_character', { max: 20 })"
            id="anchor-title"
            :invalid="isInvalid('title')"
            @change="removeError('title')"
          />
        </div>
        <div class="col-12 mb-2">
          <form-textarea
            v-model="form.description"
            id="anchor-description"
            :placeholder="$t('description_placeholder_part', { max: 20 })"
            :invalid="isInvalid('description')"
            @change="removeError('description')"
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
        <div class="col-lg-4 mb-3 mb-lg-0" id="anchor-category_id">
          <form-select
            v-model="form.category_id"
            :label="$t('category')"
            :options="categories"
            :invalid="isInvalid('category_id')"
            :clear-option="false"
            @change="categorySelected($event), removeError('category_id')"
          />
        </div>

        <!-- Subcategory -->
        <div
          class="col-lg-4 mb-3 mb-lg-0"
          v-if="subcategories.length"
          id="anchor-sub_category_id"
        >
          <form-select
            v-model="form.sub_category_id"
            :label="$t('sub_category')"
            :options="subcategories"
            :invalid="isInvalid('sub_category')"
            :clear-option="false"
            @change="removeError('sub_category')"
          />
        </div>

        <!-- Brand -->
        <div
          class="col-lg-4 mb-3 mb-lg-0"
          v-if="brands.length"
          id="anchor-brand_id"
        >
          <form-select
            v-model="form.brand_id"
            :label="$t('select_brand')"
            :options="brands"
            :invalid="isInvalid('brand_id')"
            :clear-option="false"
            @change="removeError('brand_id')"
          />
        </div>

        <div v-if="form.category_id" class="col-12 mt-3">
          <div class="row">

            <!-- Condition -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                v-model="form.is_new"
                id="anchor-is_new"
                btn-class="primary-outline"
                :label="`${$t('new')}/${$t('S_H')}`"
                :options="conditionButtons"
                :group-by="2"
                :invalid="isInvalid('is_new')"
                @change="removeError('is_new')"
              />
            </div>

            <!-- Originality -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                v-model="form.is_original"
                id="anchor-is_original"
                btn-class="primary-outline"
                :label="`${$t('original')}/${$t('duplicate')}`"
                :options="originalityButtons"
                :group-by="2"
                :invalid="isInvalid('is_original')"
                @change="removeError('is_original')"
              />
            </div>

            <!-- Dynamic filters -->
            <div
              class="col-lg-4 mb-3"
              v-for="filter in dynamicFilters"
              :key="'filter-' + filter.id"
              :id="'anchor-' + filter.key"
            >
              <!-- Select -->
              <form-select
                v-if="filter.component === 'multiselect-component'"
                v-model="form[filter.key]"
                has-search
                :translateOptions="(typeof filter.values[0].name !== 'number')"
                :label="$t(filter.key)"
                :options="filter.values"
                :invalid="isInvalid(filter.key)"
                :clear-option="!filter.is_required"
                @change="removeError(filter.key), dynamicFilterOnChange(filter.key, $event)"
              />

              <!-- Checkbox -->
              <form-checkbox
                v-if="filter.component === 'checkbox-component'"
                v-model="form[filter.key]"
                :id="filter.key"
                :label="$t(filter.key)"
                :checked-value="form[filter.key]"
                :invalid="isInvalid(filter.key)"
                @change="removeError(filter.key)"
              />

              <!-- Input -->
              <form-numeric-input
                v-if="filter.component === 'filter-single-input'"
                :value="form[filter.key]"
                :placeholder="$t(filter.key === 'capacity' ? 'battery_capacity': filter.key)"
                :invalid="isInvalid(filter.key)"
                @input="form[filter.key] = String($event), dynamicFilterOnChange(filter.key, $event)"
                @change="removeError(filter.key)"
              />
            </div>

            <!-- Price -->
            <div class="col-lg-8 mb-3 price-input-group">
              <div class="col-auto pl-0">
                <form-numeric-input
                  v-model="form.price"
                  id="anchor-price"
                  :placeholder="$t('price')"
                  :invalid="isInvalid('price')"
                  @change="removeError('price')"
                />
              </div>
              <div class="col-2">
                <form-switch :options="getCurrencyOptions" v-model="form.currency"
                             @change="updatePreview('currency')"/>
              </div>
              <form-checkbox
                v-model="form.is_negotiable"
                id="anchor-is_negotiable"
                checked-value="is_negotiable"
                :label="$t('is_negotiable')"
                :invalid="isInvalid('is_negotiable')"
                @change="removeError('price', true), removeError('is_negotiable')"
              />
            </div>

            <!-- Region -->
            <div
              class="col-lg-4 mb-3"
              v-if="regions.length"
              id="anchor-region_id"
            >
              <form-select
                v-model="form.region_id"
                has-search
                :label="$t('region')"
                :options="regions"
                :invalid="isInvalid('region_id')"
                @change="removeError('region_id')"
                :clear-option="false"
              />
            </div>

            <!-- Delivery -->
            <div class="col-lg-4 mb-3">
              <form-checkbox
                v-model="form.have_delivery"
                id="anchor-have_delivery"
                checked-value="delivery"
                :label="$t('have_delivery')"
                :invalid="isInvalid('have_delivery')"
                @change="removeError('have_delivery')"
              />
            </div>

            <!-- Warranty -->
            <div class="col-lg-4 mb-3">
              <form-checkbox
                v-model="form.have_warranty"
                id="anchor-have_warranty"
                checked-value="warranty"
                :label="$t('have_warranty')"
                :invalid="isInvalid('have_warranty')"
                @change="removeError('have_warranty')"
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

          <!-- Gallery -->
          <form-gallery
            itemClass="col-4 col-lg-1-5 mb-lg-3 mb-2"
            uploadPath="/upload_temporary_images"
            rotatable
            :maxFiles="22"
            :initialFiles="initialFiles"
            @change="filesOnChange"
            @loading="upload_loading = $event"
          >
            <template v-slot:header >
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

    <backdrop @click="showLoginPopup = false" v-if="showLoginPopup">
      <template #default="{ show }">
        <transition name="translate-fade">
          <login-tabs v-if="show"
            :popup="true"
            :skip-sign-in="true"
            :action-text="{
              login: $t('login_and_publish'),
              register: $t('register_and_publish'),
              confirm: $t('confirm_and_publish')
            }"
            :force-sell-phone="true"
            @close="showLoginPopup = false"
          />
        </transition>
      </template>
    </backdrop>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import { ToastErrorsMixin } from '~/mixins/toast-errors';

import FormKeywords from '~/components/forms/FormKeywords'
import FormGallery from '~/components/forms/FormGallery'

export default {
  mixins: [ToastErrorsMixin],
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
    FormGallery,
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
        region_id: 1,
        currency: 1,
        is_new: true,
        is_original: true,
        have_delivery: false,
        have_warranty: false,
        price: '',
        is_negotiable: false,
        keywords: [],
        btl_cookie: this.$cookies.get('btl') || ''
      },
      filters: {
        sub_categories: [],
        brands: [],
        regions: [],
        filters: [],
      },
      initialFiles: [],
      files: [],
      upload_loading: false,
      showLoginPopup: false,
      pending: false
    }
  },
  created() {
    this.$nuxt.$on('login', this.handleAfterLogin);
  },
  mounted() {
    if (this.initialForm) {
      this.form = {
        ...this.form,
        ...this.initialForm,
        keywords: this.initialForm.tags.map(t => t.text)
      }

      this.getFilters(this.initialForm.category_id)

      this.initialFiles = this.initialForm.defaultImages.map((image, index) => {
        return {
          preview: image,
          id: this.initialForm.defaultImageIds[index],
          key: this.initialForm.defaultImageIds[index],
        }
      })
    }
  },
  methods: {
    ...mapActions(['setSellPreviewData', 'resetSellTokens']),
    categorySelected(id) {
      this.form = {
        ...this.form,
        is_new: true,
        is_original: true,
      }

      delete this.form.sub_category_id;
      delete this.form.brand_id;

      this.filters.filters.forEach(filter => {
        delete this.form[filter.key]
      })

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

      if (this.filters.sub_categories.length) {
        const value = this.filters.sub_categories.find(c => c.id === this.initialForm?.sub_category_id)?.id
        this.$set(this.form, 'sub_category_id', value || null )
      } else {
        delete this.form.sub_category_id
      }

      if (this.filters.brands.length) {
        const value = this.filters.brands.find(c => c.id === this?.initialForm?.brand_id)?.id
        this.$set(this.form, 'brand_id', value || null)
      } else {
        delete this.form.brand_id
      }

      const defaults = {
        'multiselect-component': '',
        'checkbox-component': false,
        'filter-single-input': '',
      }

      this.filters.filters.forEach(filter => {
        if (!Object.keys(this.form).includes(filter.key)) {
          this.form[filter.key] = defaults[filter.component]
        }
      })
    },
    dynamicFilterOnChange(key, value) {
      this.form = {...this.form}

      if (this.errors.includes(key) && value) {
        this.errors = this.errors.filter(item => item !== key)
      }
    },
    submit() {
      const validated = this.validate()
      if (validated) {
        this.publish()
      }
    },
    validate() {
      if (this.upload_loading) {
        this.$toasted.error(this.$t('please_wait_for_all_image_loading'));
        return false;
      }

      if (!this.files.length) {
        this.$toasted.error(this.$t('content_component_error_image'));
        return false;
      }

      return true
    },
    async publish() {
        const saved_images = this.files.map(({ id }) => id)
        const deletedIds = []
        this.initialFiles.forEach(({id}) => {
          if (!saved_images.includes(id)) {
            deletedIds.push(id)
          }
        })

      let data = {
        ...this.form,
        tags: this.form.keywords.map(keyword => ({ text: keyword })),
        saved_images,
        deletedIds,
        price: this.form.is_negotiable ? 0 : this.form.price
      }
      delete data.keywords;

      if (!data.brand_id) delete data.brand_id

      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      formData.append('phone',this.sellPhoneEntered.replace(/[^0-9]+/g, ''));
      this.pending = true;
      try {
        let requestURL;
        if (this.isEdit) {
          requestURL= '/sell/part/edit/' + this.form.id;
        } else {
          requestURL= '/sell/part/post/publish';
        }
        await this.$axios.post(requestURL, formData)
        if (this.loggedIn)
          await this.$auth.fetchUser();
        this.$router.push(this.$localePath('/profile/announcements'), () => {
          this.$toasted.success(this.$t('saved_changes'));
        });
      } catch ({response: {status, data: {data, message}}}) {
        this.clearErrors();
        this.pending = false;

        if (status === 420) {
          this.$toasted.error(this.$t(message));
        } else {
          // find errors
          let dataLength = data && Object.keys(data).length;
          if (dataLength) {
            let count = 0;
            for (let key in data) {
              let errorKey = key;
              this.errors.push(errorKey);
              let errorIndex = this.errors.indexOf(errorKey);
              let errorText = `(${dataLength - errorIndex}/${dataLength}) ${data[key][0]}`;
              // show error
              this.showError(errorKey, errorText, { fieldView: key, offset: this.isMobileBreakpoint ? 30 : -20 }, count === 0);
              count++;
            }
          } else if (message && status !== 499) {
            this.$toasted.error(this.$t(message));
          }
        }

        // check if user logged in
        if (!this.showLoginPopup && status === 499) {
          this.showLoginPopup = true;
        }
      }
    },
    updatePreview() {
      if (this.form.region_id && this.regions.length) {
        this.setSellPreviewData({
          key: 'region',
          value: this.regions.find(r => r.id === this.form.region_id)?.name
        });
      }
      this.setSellPreviewData({
        key: 'price',
        value: this.form.price
      });
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
        value: this.files[0]?.preview
      });

      // For tyres and rims
      if (this.form.shine_width) {
        this.setSellPreviewData({
          key: 'shine_width',
          value: this.dynamicFilters
            .find(f => f.key === 'shine_width')
            ?.values
            ?.find(v => v.id === this.form.shine_width)
            ?.name || ''
        });
      }
      if (this.form.diameter) {
        this.setSellPreviewData({
          key: 'diameter',
          value: this.dynamicFilters
            .find(f => f.key === 'diameter')
            ?.values
            ?.find(v => v.id === this.form.diameter)
            ?.name || ''
        });
      }
      if (this.form.height) {
        this.setSellPreviewData({
          key: 'height',
          value: this.dynamicFilters
            .find(f => f.key === 'height')
            ?.values
            ?.find(v => v.id === this.form.height)
            ?.name || ''
        });
      }
    },
    handleAfterLogin() {
      this.resetSellTokens();
      this.showLoginPopup = false;
      this.publish();
    },
    filesOnChange(files) {
      this.files = files
    }
  },
  computed: {
    ...mapState(['sellPhoneEntered']),
    getCurrencyOptions() {
      return [
        { key: 1, name: 'AZN', sign: '₼'	},
        { key: 2, name: 'USD', sign: '$'	},
        { key: 3, name: 'EUR', sign: '€'	}
      ];
    },
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
  },
  beforeDestroy() {
    this.$nuxt.$off('login', this.handleAfterLogin);
    this.setSellPreviewData({ value: {} });
  }
}
</script>
