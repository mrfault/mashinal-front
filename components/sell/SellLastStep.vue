<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" @action="$emit('clean')" action-icon="reset" :bar-title="title" height-auto>
    <div class="sell_last-step">
      <sell-select-modification v-if="!edit && type === 'cars'"
        :form="form"
        @update-form="handleModification"
      />
      <div v-if="showAllOptions" :class="{'disabled-content': type === 'cars' && !form.car_catalog_id}">
        <h2 class="title-with-line mt-3 mt-lg-0" id="anchor-saved_images">
          <span>{{ $t('photos') }} ({{ $t('at_least_5_photos', { min: minFiles, max: maxFiles }).toLowerCase() }}) <span class="star"> *</span></span>
        </h2>
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
        />
<!--        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-youtube">-->
<!--          <span>{{ $t('video') }}</span>-->
<!--        </h2>-->
<!--        <add-video :value="form.youtube.id" @input="$set(form, 'youtube', $event)"-->
<!--           :thumb="form.youtube.thumb" />-->
        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
          <span>{{ $t('color') }} <span class="star"> *</span></span>
        </h2>
        <color-options v-model="form.selectedColor" :limit="2" :multiple="type === 'cars'"
          @change-matt="form.is_matte = $event" :matt="form.is_matte" :hide-matt="type !== 'cars'"
          @change="removeError('selectedColor')" />
        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-mileage">
          <span>{{ $t('mileage') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <div class="col-lg-3 mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input :placeholder="$t('mileage')" v-model="form.mileage" input-class="w-133"
                  :invalid="isInvalid('mileage')" @change="removeError('mileage'), updatePreview('mileage')" />
              </div>
              <div class="col-auto">
                <form-switch :options="getMileageOptions" v-model="form.mileage_measure"
                  @change="updatePreview('mileage_measure')" />
              </div>
            </div>
          </div>
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="d-flex flex-wrap flex-lg-nowrap">
              <form-checkbox  transparent :label="$t('is_new')" v-model="form.is_new" input-name="is_new" @change="updateMileage"/>
              <form-checkbox  transparent :label="$t('bitie')" v-model="form.beaten" input-name="beaten" has-popover>
                <popover class="white-space-pre-wrap-span" :message="$t('with_significant_damage_to_body_elements_that_do_not_move_on_their_own')" :width="175" />
              </form-checkbox>
              <form-checkbox v-if="!user.external_salon" transparent :label="$t('not_cleared')" v-model="form.customs_clearance" input-name="customs_clearance"
                @change="removeError('car_number', true), removeError('vin', true), form.car_number = ''" />
              <form-checkbox v-if="!user.external_salon" transparent :label="$t('in_garanty')" v-model="form.guaranty" input-name="guaranty" />
            </div>
          </div>
        </div>
        <template v-if="type === 'cars'">
          <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-body-parts" v-if="false">
            <span>{{ $t('body_condition') }}</span>
          </h2>
          <damage-options :selected="form.part" @update-car-damage="updateCarDamage" :imageIsActive="true" v-if="false"/>
        </template>
        <template v-if="!isAutosalon && !user.external_salon">
          <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-region_id">
            <span>{{ $t('region_and_place_of_inspection') }} <span class="star"> *</span></span>
          </h2>
          <div class="row">
            <div class="col-lg-4 mb-2 mb-lg-0">
              <form-select :label="$t('region')" :options="sellOptions.regions" v-model="form.region_id" has-search
                :invalid="isInvalid('region_id')" @change="removeError('region_id'), updatePreview('region')"
                :clear-option="false" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-0">
              <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-0">
              <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                  @change-address="updateAddress" @change-latlng="updateLatLng">
                <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address" />
              </pick-on-map-button>
            </div>
          </div>
        </template>
        <template v-if="user.external_salon">
          <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-region_id">
            <span>{{ $t('country') }} <span class="star"> *</span></span>
          </h2>
          <div class="row">
            <div class="col-lg-4 mb-2 mb-lg-0">
              <form-select :label="$t('country')" :options="sellOptions.countries" v-model="form.country_id" has-search
                           :invalid="isInvalid('region_id')" @change="removeError('region_id'), updatePreview('region')"
                           :clear-option="false" />
            </div>
          </div>
        </template>
        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-price">
          <span>{{ $t('price') }} <span class="star"> *</span></span>
        </h2>
        <div class="row">
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input :placeholder="$t('price')" v-model="form.price" input-class="w-133"
                  :invalid="isInvalid('price')" @change="removeError('price'), updatePreview('price')" />
              </div>
              <div class="col-auto">
                <form-switch :options="getCurrencyOptions" v-model="form.currency"
                  @change="updatePreview('currency')"/>
              </div>
            </div>
          </div>
          <div v-if="!user.external_salon" class="col-lg-auto mb-2 mb-lg-0">
            <div class="d-flex flex-wrap flex-lg-nowrap">
              <form-checkbox transparent :label="$t('tradeable')" v-model="form.tradeable" input-name="tradeable" />
              <form-checkbox transparent :label="$t('credit_possible')" v-model="form.credit" input-name="credit" />
            </div>
          </div>
        </div>
        <template v-if="user.external_salon">
          <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-price">
            <span>{{ $t('auction') }} / {{ $t('end_date') }} <span class="star"> *</span></span>
          </h2>
          <div class="row">
            <div class="col-lg-auto mb-2 mb-lg-0">
              <div class="row flex-nowrap">
                <div class="col-lg-auto flex-grow-1 col-6">
                    <form-switch @change="removeError('end_date')" auto-width v-model="form.auction" :options="[{ name:$t('auction'), key:1 }, { name:$t('sell'), key:2 }]"/>
                </div>
                <div class="col-auto" v-if="form.auction === 1">
                  <form-text-input
                    @change="removeError('end_date')"
                    date-type="datetime"
                    value-type="datetime"
                    date-format="DD.MM.YYYY HH:mm"
                    v-model="form.end_date"
                    :placeholder="$t('announcement_end_date')"
                    input-date
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
<!--        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-owner_type">-->
<!--          <span>{{ $t('first_owner_question') }}</span>-->
<!--        </h2>-->
<!--        <div class="row">-->
<!--          <div class="col-auto mb-2 mb-lg-0">-->
<!--            <form-switch :options="getOwnerOptions" v-model="form.owner_type" auto-width />-->
<!--          </div>-->
<!--        </div>-->
        <h2 v-if="type === 'cars'" class="title-with-line mt-2 mt-lg-3" id="anchor-car_or_vin">
          <span>{{ $t(form.customs_clearance || user.external_salon ? 'vin_carcase_number' : 'license_plate_number_vin_or_carcase_number') }}
            <template v-if="!loggedIn || (loggedIn && !user.autosalon) || (loggedIn && user.autosalon && user.autosalon.is_official)">
               <span class="star" v-if="type === 'cars'"> *</span>
            </template>
          </span>
        </h2>
        <div class="row" v-if="type === 'cars' && !user.is_autosalon">
          <div class="col-lg-4 mb-2 mb-lg-0" v-if="!form.customs_clearance && !user.external_salon">
            <form-text-input v-model="form.car_number" input-class="car-number-show-popover" img-src="/img/flag.svg"
                :mask="type === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'"
                :placeholder="type === 'cars' ? '__ - __ - ___' : '__ - _ - ___'" @focus="showCarNumberDisclaimer"
                @change="removeError('car_number')">
              <popover :message="$t('real-car-number-will-make-post-faster')" text-class="text-red" :width="190"
                  name="car-number" @click="readCarNumberDisclaimer = true" />
            </form-text-input>
            <form-checkbox :label="$t('show_car_number_on_site')" v-model="form.show_car_number" input-name="show_car_number"
              transparent class="mt-2 mt-lg-3"/>
          </div>
          <div class="col-lg-4 mb-2 mb-lg-0">
            <form-text-input v-model="form.vin"
                :mask="$maskAlphaNumeric('*****************')"
                :placeholder="$t('vin_carcase_number')" @change="removeError('vin')">
              <popover name="vin" :width="240">
                <inline-svg src="/img/car-cert.svg"/>
              </popover>
            </form-text-input>
            <form-checkbox :label="$t('show_vin_on_site')" v-model="form.show_vin" input-name="show_vin"
              transparent class="mt-2 mt-lg-3"/>
          </div>
        </div>
        <div class="mt-2 mt-lg-3">
          <template v-if="type === 'cars'">
            <car-filters :values="form.all_options" @change-filter="updateCarFilter" popular key="popular" :collapsedByDefault="true"/>
            <div class="car-filters_row">
              <div class="d-flex mb-2 mb-lg-3" @click="collapsed = !collapsed">
                <h2 class="title-with-line full-width">
                  <span>{{ $t('other_options') }}</span>
                </h2>
                <icon :name="`chevron-${!collapsed ? 'up' : 'down'}`" class="cursor-pointer" />
              </div>
              <transition-expand>
                <div v-if="collapsed">
                  <car-filters :show-icon="false" :values="form.all_options" @change-filter="updateCarFilter" key="all" collapsed-by-default />
                </div>

              </transition-expand>
            </div>
          </template>
          <template v-else>
            <sell-filters
              :type="type"
              :selected="form.filters || form"
              :errors="errors"
              @remove-error="removeError"
              @add-form-keys="form = {...$event, ...form}"
              @update-sell-filter="updateSellFilter"
            />
          </template>
        </div>
        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-comment">
          <span>{{ $t('description_placeholder') }}</span>
        </h2>
        <form-textarea v-model="form.comment" :placeholder="$t('description_placeholder_transport')"
          :maxlength="3000" />
        <p class="info-text full-width less-pd mt-2">
          {{ $t('it_is_forbidden_to_give_links_indicate_email_addresses_mail_address_of_the_place_of_inspection_telephones_price_offer_services')}}
        </p>
        <hr/>
        <modal-popup
          :modal-class="'wider'"
          :toggle="showRules"
          :title="getRulesPage.title[locale]"
          @close="showRules = false"
        >
          <div v-html="getRulesPage.text[locale]"></div>
        </modal-popup>
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
        <div class="publish-post mb-4" id="anchor-finish">
          <div class="row mt-4 mb-4" v-if="showBanners && !isAlreadySold">
            <div class="service-banner col-6 col-lg-4" v-for="banner in ['vip','premium']" :key="banner">
              <img :src="`/img/card-${banner}${isMobileBreakpoint ? '-mobile' : ''}-${locale}.png`" alt="banner" @click="publishPost" />
            </div>
          </div>
          <p class="info-text full-width mt-2">
            <icon name="alert-circle" /> {{ $t('by_posting_an_ad_you_confirm_your_agreement_with_the_rules')}}:
            <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`" @click.native.prevent="showRules = true" event="">
              <strong>{{ $t('general_rules') }}</strong>
            </nuxt-link>
          </p>
          <p class="info-text full-width less-pd mt-2">
            <span class="star">*</span> — {{ $t('starred_fields_are_required')}}
          </p>
          <p class="info-text full-width less-pd text-red" v-if="isAlreadySold">
            {{ $t('this_car_already_added_last_90_days_for_new_added_need_payment') }}
          </p>
          <p class="info-text full-width less-pd" v-else-if="restore">
            {{ $t('edit_or_restore') }}
          </p>
          <div class="text-right">
            <button type="button" @click="publishPost" :class="['btn btn--green', { pending }]">
              {{ isAlreadySold ? `${$t('place_and_pay')} 5 ₼` : (edit ? (restore ? $t('restore') : $t('edit_ad')) : $t('place_an_ad')) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex';

import { ToastErrorsMixin } from '~/mixins/toast-errors';
import { ImageResizeMixin } from '~/mixins/img-resize';
import { PaymentMixin } from '~/mixins/payment';

import SellSelectModification from '~/components/sell/SellSelectModification';
import UploadImage from '~/components/elements/UploadImage';
import ColorOptions from '~/components/options/ColorOptions';
import DamageOptions from '~/components/options/DamageOptions';
import AddVideo from '~/components/elements/AddVideo';
import PickOnMapButton from '~/components/elements/PickOnMapButton';
import SellFilters from '~/components/sell/SellFilters';
import CarFilters from '~/components/cars/CarFilters';

export default {
  components: {
    SellSelectModification,
    UploadImage,
    ColorOptions,
    DamageOptions,
    AddVideo,
    PickOnMapButton,
    SellFilters,
    CarFilters
  },
  props: {
    edit: Boolean,
    restore: Boolean,
    title: String,
    type: String,
    initialForm: {},
    announcement: {}
  },
  mixins: [ToastErrorsMixin, ImageResizeMixin, PaymentMixin],
  data() {
    return {
      collapsed: false,
      form: this.$clone(this.initialForm),
      date: Math.floor(Date.now() / 1000),
      files: (this.announcement?.media || []).map((media, i) => ({ media, key: this.initialForm.saved_images[i]  })),
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      savedFiles: [...this.initialForm.saved_images],
      deletedFiles: [],
      uploading: 0,
      publishing: false,
      showAllOptions: this.type !== 'cars' || this.edit,
      readCarNumberDisclaimer: false,
      showRules: false,
      showBanners: false,
      isAlreadySold: false,
      showLoginPopup: false,
      pending: false
    }
  },
  computed: {
    ...mapState(['sellPhoneEntered']),
    ...mapGetters(['sellOptions', 'sellSalonRights', 'staticPages']),

    progress() {
      let progress = 30;
      if (this.form.mileage !== '' && ((this.form.selectedColor instanceof Array) ? (this.form.selectedColor.length) : (this.form.selectedColor !== ''))) progress += 10;
      if (this.form.vin || this.form.car_number) progress += 10;
      if (this.savedFiles.length >= this.minFiles) progress += 10;
      if (this.form.price) progress += 10;
      if (this.form.comment) progress += 10;
      if (this.type === 'cars' && this.form.car_catalog_id) progress += 10;
      if (this.type === 'cars' && Object.keys(this.form.all_options).length > 0) progress += 10;
      if (this.type !== 'cars') progress += 20;
      return progress;
    },

    helperImages() {
      let imgs = this.type === 'cars' ? [1,2,3,4,5] : (this.type === 'commercial' ? [1,2,3,4] : [1,2,3]);
      return imgs.map(n => `/img/sell-helpers/${this.type}_${n}.png`);
    },

    isAutosalon() {
      return !!((this.loggedIn && this.user.autosalon && this.user.autosalon.status === 1) || this.sellSalonRights);
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
    getOwnerOptions() {
      return [
        { key: 0, name: this.$t('yes')	},
        { key: 1, name: this.$t('no')	}
      ];
    }
  },
  methods: {
    ...mapActions(['setSellProgress', 'setSellPreviewData', 'resetSellTokens', 'getMyAllAnnouncements']),

    handleModification({ key, value }) {
      this.$set(this.form, key, value);
      if (!this.showAllOptions && key === 'car_catalog_id' && value) {
        this.showAllOptions = true;
        if (!this.isMobileBreakpoint) return;
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(this.$refs['saved_images'], -34, 500);
          }, 0);
        });
      }
    },
    showCarNumberDisclaimer() {
      if (this.readCarNumberDisclaimer) {
        this.$nuxt.$emit('close-popover', 'car-number');
      } else {
        this.$nuxt.$emit('show-popover', 'car-number');
        this.readCarNumberDisclaimer = true;
      }
    },
    updatePreview(key) {
      if (!key || key === 'region')
        this.setSellPreviewData({ value: this.sellOptions.regions
          .find(o => o.key === this.form.region_id)?.name[this.locale], key: 'region' });
      if (!key || key === 'price')
        this.setSellPreviewData({ value: this.form.price, key: 'price' });
      if (!key || key === 'currency')
        this.setSellPreviewData({ value: this.getCurrencyOptions
          .find(o => o.key === this.form.currency)?.sign, key: 'currency' });
      if (!key || key === 'mileage')
        this.setSellPreviewData({ value: this.form.mileage, key: 'mileage' });
      if (!key || key === 'mileage_measure')
        this.setSellPreviewData({ value: this.getMileageOptions
          .find(o => o.key === this.form.mileage_measure)?.name, key: 'mileage_measure' });
    },
    updateMileage(is_new) {
      if (!is_new) {
        this.isInvalid('mileage') && this.removeError('mileage');
      } else {
        let mileage = this.form.mileage;
        this.form.mileage = mileage > (this.form.mileage_measure === 2 ? 310.686 : 500) || !mileage ? 0 : mileage;
      }
      this.updatePreview('mileage');
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
    updateCarFilter(key, value) {
      if (value === false || value === '' || (typeof value === 'object' && !Object.keys(value).length))
        this.$delete(this.form.all_options, key);
      else this.$set(this.form.all_options, key, value);
      this.$nuxt.$emit('change-car-filters');
    },
    updateSellFilter(key, value) {
      if (value === '')
        this.$delete(this.form, key);
      else this.$set(this.form, key, value);
    },
    // image upload
    updateImages(files) {
      this.files = files;
      this.setSellPreviewData({ value: files[0]?.image, key: 'image' });
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
          let file = await this.getResizedImage(image.file);
          formData.append('temp_id', this.date);
          formData.append('images[]', file);
          try {
            const data = await this.$axios.$post('/upload_temporary_images', formData, {
              progress: false,
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            this.uploading--;
            this.$nuxt.$emit('image-uploaded', image.key, false, data.images[0], data.ids[0]);
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
          this.$nuxt.$emit('image-uploaded', key, true, data.thumb);
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
    changeOrder(sorted, preview) {
      this.$set(this, 'savedFiles', sorted);
      this.setSellPreviewData({ value: preview, key: 'image' });
    },
    // post announcement
    async publishPost() {
      if (this.pending) return;
      // wait till all images uploaded
      if (this.uploading) {
        this.$toasted.error(this.$t('please_wait_for_all_image_loading'));
        return;
      }
      this.form.saved_images = this.savedFiles;
      this.form.is_autosalon = this.isAutosalon;
      if (this.isAlreadySold)
        this.form.can_pay = true;
      // generate post data
      let formData = new FormData();
      formData.append('data', JSON.stringify(this.form));
      formData.append('phone',this.sellPhoneEntered.replace(/[^0-9]+/g, ''));
      if (this.deletedFiles.length)
        formData.append('deletedImages', JSON.stringify(this.deletedFiles));
      // generate post link
      let postUrl = '/sell/';
      postUrl += (this.type !== 'cars' ? this.type + '/' : '');
      postUrl += (this.type !== 'commercial' || !this.edit ? 'post/' : '');
      postUrl += (this.edit ? ('edit/' + this.$route.params.id.slice(0, -1)) : 'publish');
      postUrl += (`?is_mobile=${this.isMobileBreakpoint}`);
      // post
      this.pending = true;
      try {
        // publish or update post
        const res = await this.$axios.$post(postUrl, formData);
        if (this.loggedIn)
          await this.$auth.fetchUser();
        // track event
        if (!this.edit) {
          this.fbTrack('Lead Api');
          this.gtagTrack('AW-600951956/ccUSCJT25_IBEJSZx54C');
        }
        // redirect to payment if action was to restore
        if (res?.data?.redirect_url) {
          this.handlePayment(res, this.$localePath('/profile/announcements'));
        } else {
          this.$router.push(this.$localePath('/profile/announcements'), () => {
            if (this.restore) {
              this.updatePaidStatus({
                type: 'success',
                text: this.$t('announcement_restored'),
                title: this.$t('success_payment')
              });
            } else if (this.isAlreadySold) {
              this.updatePaidStatus({
                type: 'success',
                text: this.$t('announcement_paid'),
                title: this.$t('success_payment')
              });
            } else {
              this.$toasted.success(this.$t('saved_changes'));
            }
          });
        }
      } catch ({response: {status, data: {data, message}}}) {
        this.clearErrors();
        this.pending = false;

        if (status === 420) {
          this.$toasted.error(this.$t(message));
          if (data.need_pay) {
            this.isAlreadySold = true;
            this.scrollTo('.publish-post');
          }
        } else {
          // find errors
          let dataLength = data && Object.keys(data).length;
          if (dataLength) {
            let count = 0;
            for (let key in data) {
              // key = Object.keys(data)[dataLength - Object.keys(data).indexOf(key) - 1];
              let errorKey = key;
              if (errorKey === 'car_or_vin') errorKey = this.form.customs_clearance ? 'vin' : 'car_number';
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
        if (!this.showLoginPopup && status === 499)
          this.showLoginPopup = true;
      }
    },
    handleAfterLogin() {
      this.resetSellTokens();
      this.showLoginPopup = false;
      this.publishPost();
    },
  },
  watch: {
    progress(value) {
      this.setSellProgress(value);
    }
  },
  created() {
    ['sellBody','sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications']
      .map(property => { this.mutate({ property, value: [] }); });

    this.$nuxt.$on('login', this.handleAfterLogin);
    this.updatePreview();
  },
  beforeDestroy() {
    this.$nuxt.$off('login', this.handleAfterLogin);
  }
}
</script>
<style lang="scss" >
.white-space-pre-wrap-span span {
  white-space: pre-wrap !important;
}
</style>
