<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" :bar-title="title" height-auto>
    <div class="sell_last-step">
      <sell-select-modification v-if="type === 'cars'"
        :form="form"
        @update-form="handleModification"
      />
      <div v-if="showAllOptions" :class="{'disabled-content': type === 'cars' && !form.car_catalog_id}">
        <h2 class="title-with-line" ref="saved_images">
          <span>{{ $t('photos') }} <span class="star"> *</span></span>
        </h2>
        <upload-image
          :maxFiles="maxFiles"
          :minFiles="minFiles"
          :defaultFiles="announcement ? announcement.media : files"
          :helpers="helperImages"
          @files-changed="updateImages"
          @files-dropped="addImages"
          @file-deleted="deleteImage"
          @file-rotated="rotateImage"
        />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="youtube">
          <span>{{ $t('video') }}</span>
        </h2>
        <add-video :value="form.youtube.id" @input="$set(form, 'youtube', $event)" />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="selectedColor">
          <span>{{ $t('color') }} <span class="star"> *</span></span>
        </h2>
        <color-options v-model="form.selectedColor" :limit="2" :multiple="type === 'cars'"
          @change-matt="form.is_matte = $event" :matt="form.is_matte" :hide-matt="type !== 'cars'" />
        <h2 class="title-with-line mt-2 mt-lg-3" ref="mileage">
          <span>{{ $t('mileage') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <div class="row">
              <div class="col-auto flex-grow-1">
                <form-numeric-input :placeholder="$t('mileage')" v-model="form.mileage" 
                  :invalid="isInvalid('mileage')" />
              </div>
              <div class="col-auto">
                <form-switch :options="getMileageOptions" v-model="form.mileage_measure" />
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <form-select :label="$t('data')" custom custom-checkboxes :allow-clear="false"
              :values="{ count: ['is_new','beaten','guaranty','customs_clearance','tradeable'].filter(a => form[a]).length }">
              <div class="form-merged">
                <form-checkbox :label="$t('is_new')" v-model="form.is_new" input-name="is_new" @change="updateMileage"/>
                <form-checkbox :label="$t('bitie')" v-model="form.beaten" input-name="beaten">
                  <popover :message="$t('with_significant_damage_to_body_elements_that_do_not_move_on_their_own')" :width="175" />
                </form-checkbox>
                <form-checkbox :label="$t('in_garanty')" v-model="form.guaranty" input-name="guaranty" />
                <form-checkbox :label="$t('not_cleared')" v-model="form.customs_clearance" input-name="customs_clearance"
                  @change="removeError('car_number', true), removeError('vin', true)" />
                <form-checkbox :label="$t('tradeable')" v-model="form.tradeable" input-name="tradeable" />
              </div>
            </form-select>
          </div>
        </div>
        <template v-if="type === 'cars'">
          <h2 class="title-with-line mt-2 mt-lg-3" ref="body-parts">
            <span>{{ $t('body_condition') }}</span>
          </h2>
          <damage-options 
            :selected="form.part"
            @update-car-damage="updateCarDamage"
            @update-car-damage-part="updateCarDamagePart"
          />
        </template>
        <h2 class="title-with-line mt-2 mt-lg-3" ref="region">
          <span>{{ $t('region_and_place_of_inspection') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <template v-if="!isAutosalon">
            <div class="col-12 col-lg-4 mb-2 mb-lg-0">
              <form-select :label="$t('region')" :options="sellOptions.regions" v-model="form.region_id" has-search 
                @change="removeError('region_id')" />
            </div>
            <div class="col-12 col-lg-4 mb-2 mb-lg-0">
              <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address" />
            </div>
          </template>
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                @change-address="updateAddress" @change-latlng="updateLatLng">
              <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address" />
            </pick-on-map-button>
          </div>
        </div>
        <h2 class="title-with-line mt-2 mt-lg-3" ref="price">
          <span>{{ $t('price') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input :placeholder="$t('price')" v-model="form.price" 
                  :invalid="isInvalid('price')" />
              </div>
              <div class="col-auto">
                <form-switch :options="getCurrencyOptions" v-model="form.currency" />
              </div>
            </div>
          </div>
        </div>
        <h2 class="title-with-line mt-2 mt-lg-3" ref="price">
          <span>{{ $t('license_plate_number_vin_or_carcase_number') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <form-text-input v-model="form.car_number" input-class="car-number-show-popover" 
                :mask="type === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'"
                :placeholder="type === 'cars' ? '__ - __ - ___' : '__ - _ - ___'" @focus="showCarNumberDisclaimer">
              <popover :message="$t('real-car-number-will-make-post-faster')" :width="190" 
                  name="car-number" @click="readCarNumberDisclaimer = true" />
            </form-text-input>
            <form-checkbox :label="$t('show_on_site')" v-model="form.show_car_number" input-name="show_car_number" 
              transparent class="mt-2 mt-lg-3"/>
          </div>
          <div class="col-12 col-lg-4 mb-2 mb-lg-0">
            <form-text-input v-model="form.vin" 
                :mask="'*****************'"
                :placeholder="$t('vin_carcase_number')">
              <popover name="vin" :width="240">
                <inline-svg src="/img/car-cert.svg"/>
              </popover>
            </form-text-input>
            <form-checkbox :label="$t('show_on_site')" v-model="form.show_vin" input-name="show_vin" 
              transparent class="mt-2 mt-lg-3"/>
          </div>
        </div>
        <h2 class="title-with-line mt-2 mt-lg-3" ref="description">
          <span>{{ $t('description_placeholder') }}</span>
        </h2>
        <form-textarea v-model="form.comment" :placeholder="$t('description_placeholder')" 
          :maxlength="3000" />
        <p class="info-text full-width less-pd mt-2">
          {{ $t('it_is_forbidden_to_give_links_indicate_email_addresses_mail_address_of_the_place_of_inspection_telephones_price_offer_services')}}
        </p>
        <hr/>
        <div class="row mt-4 mb-4">
          <div class="service-banner col-6 col-lg-4" v-for="banner in ['vip','premium']" :key="banner">
            <img :src="`/img/card-${banner}${isMobileBreakpoint ? '-mobile' : ''}-${locale}.png`" alt="banner"
              @click="publishPost(banner)" />
          </div>
        </div>
        <p class="info-text full-width mt-2">
          <icon name="alert-circle" /> {{ $t('by_posting_an_ad_you_confirm_your_agreement_with_the_rules')}}: 
          <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`" @click.native.prevent="showRules = true" event="">
            <strong>{{ $t('general_rules') }}</strong>
          </nuxt-link>
        </p>
        <p class="info-text full-width less-pd mt-2">
          <span class="star">*</span> - {{ $t('starred_fields_are_required')}}
        </p>
        <div class="text-right">
          <button class="btn btn--green">{{ $t('post_for_free') }}</button>
        </div>
        <modal-popup
          :modal-class="'wider'"
          :toggle="showRules"
          :title="getRulesPage.title[locale]"
          @close="showRules = false"
        >
          <div v-html="getRulesPage.text[locale]"></div>
        </modal-popup>
      </div>
    </div>
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { ToastErrorsMixin } from '~/mixins/toast-errors';

import SellSelectModification from '~/components/sell/SellSelectModification';
import UploadImage from '~/components/elements/UploadImage';
import ColorOptions from '~/components/options/ColorOptions';
import DamageOptions from '~/components/options/DamageOptions';
import AddVideo from '~/components/elements/AddVideo';
import PickOnMapButton from '~/components/elements/PickOnMapButton';

export default {
  components: { 
    SellSelectModification,
    UploadImage,
    ColorOptions,
    DamageOptions,
    AddVideo,
    PickOnMapButton
  },
  props: {
    edit: Boolean,
    title: String,
    type: String,
    initialForm: {},
    announcement: {}
  },
  mixins: [ToastErrorsMixin],
  data() {
    return {
      form: this.$clone(this.initialForm),
      date: Math.floor(Date.now() / 1000),
      files: [],
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      savedFiles: [...this.initialForm.saved_images],
      deletedFiles: [],
      uploading: 0,
      publishing: false,
      showAllOptions: this.type !== 'cars',
      readCarNumberDisclaimer: false,
      showRules: false
    }
  },
  computed: {
    ...mapGetters(['sellOptions', 'sellAutosalonRights', 'staticPages']),

    progress() {
      let progress = 30;
      if (this.form.car_catalog_id) progress += 10;
      return progress;
    },

    helperImages() {
      let imgs = this.type === 'cars' ? [1,2,3,4,5] : (this.type === 'commercial' ? [1,2,3,4] : [1,2,3]);
      return imgs.map(n => `/img/sell-helpers/${this.type}_${n}.png`);
    },

    isAutosalon() {
      return !!((this.loggedIn && this.user.autosalon) || this.sellAutosalonRights);
    },
    getRulesPage() {
      return this.staticPages.find(page => page.id == 1);
    },

    getCurrencyOptions() {
      return [
        { key: 1, name: 'AZN', sign: '₼'	},
        { key: 2, name: 'USD', sign: '$'	},
        { key: 3, name: 'EUR', sign: '€'	}
      ];
    },
    getMileageOptions() {
      return [
        { key: 1, name: this.$t('char_kilometre')	},
        { key: 2, name: this.$t('char_mile')	}
      ];
    },
  },
  methods: {
    ...mapActions(['setSellProgress', 'setSellPreviewData']),

    handleModification({ key, value }) {
      this.$set(this.form, key, value);
      if (!this.showAllOptions && key === 'car_catalog_id' && value) {
        this.showAllOptions = true;
        if (!this.isMobileBreakpoint) return;
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(this.$refs['saved_images'], -34, 500, '.mobile-screen');
          }, 0);
        });
      }
    },
    // image upload
    async addImages(images) {
      // passed min limit
      if((images.length + this.savedFiles.length + this.uploading) >= this.minFiles)
        this.removeError('saved_images'); 
      // upload images
      this.uploading += images.length;
      await Promise.all(
        images.map(async (image) => {
          let formData = new FormData();
          formData.append('temp_id', this.date);
          formData.append('images[]', image.file);
          try {
            const data = await this.$axios.$post('/upload_temporary_images', formData, {
              progress: false,
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            this.uploading--;
            this.$nuxt.$emit('image-uploaded', image.key, data.images[0]);
            this.$nuxt.$emit('hide-image-preloader-by-key', image.key);
            this.savedFiles = [...this.savedFiles, ...data.ids];
          } catch({response: {data: {data}}}) {
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
        if (this.edit && this.form.saved_images.includes(this.savedFiles[index]))
          this.deletedFiles.push(this.savedFiles[index]);
        else this.$axios.$post('/remove_temporary_image/' + this.savedFiles[index]);
        this.$delete(this.savedFiles, index);
      }
    },
    async rotateImage(index, key) {
      if (this.savedFiles[index]) {
        try {
          this.$nuxt.$loading.start();
          const { data } = await this.$axios.$get(`/media/${this.savedFiles[index]}/rotate/right`);
          this.$nuxt.$loading.finish();
          this.$nuxt.$emit('image-uploaded', key, data.thumb, true);
          this.$nuxt.$emit('hide-image-preloader-by-key', key);
        } catch({response: {data: {data}}}) {
          this.$nuxt.$emit('hide-image-preloader-by-key', key);
          this.$nuxt.$loading.finish();
          this.clearErrors();
          for (let key in data) {
            this.$toasted.error(data[key]);
          }
        }
      }
    },
    updateImages(files) {
      this.files = files;
      this.setSellPreviewData({ value: files[0]?.image, key: 'image' });
    },
    updateMileage(is_new) {
      if(!is_new) {
        this.isInvalid('mileage') && this.removeError('mileage');
      } else {
        let mileage = this.form.mileage;
        this.form.mileage = mileage > 500 || !mileage ? 0 : mileage;
      }
    },
    updateAddress(address) {
      this.form.address = address;
      this.removeError('address');
    },
    updateLatLng({ lat, lng }) {
      this.form.lat = lat;
      this.form.lng = lng;
    },
    updateCarDamage(part) {
      this.form.part = part;
    },
    updateCarDamagePart(index) {
      this.$nuxt.$emit('update-car-damage-part', this.form.part[index] || {});
    },
    showCarNumberDisclaimer() {
      if(this.readCarNumberDisclaimer) {
        this.$nuxt.$emit('close-popover', 'car-number');
      } else {
        this.$nuxt.$emit('show-popover', 'car-number');
        this.readCarNumberDisclaimer = true;
      }
    }
  },
  watch: {
    progress(value) {
      this.setSellProgress(value);
    }
  },
  created() {
    ['sellBody','sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications']
      .map(property => { this.mutate({ property, value: [] }); });
  },
  beforeDestroy() {
    this.setSellPreviewData({ value: {} });
  }
}
</script>