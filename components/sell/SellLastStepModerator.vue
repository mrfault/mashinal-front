<template>
  <component
    :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
    :bar-title="title"
    action-icon="reset"
    height-auto
    @action="$emit('clean')"
    @back="$emit('close')"
  >
    <div class="sell_last-step">
      <div
        v-if="showAllOptions"
        :class="{
          'disabled-content': type === 'cars' && !form.car_catalog_id && !edit,
        }"
      >

        <title-with-line-and-reject-reason
          v-if="announcement.media.length"
          id="360"
          :imageRejected="imageRejected"
          :modalToggled="imageModal.modalToggled"
          :rejectArray="imageModal.rejectArray"
          :subtitle="
            $t('at_least_5_photos', {
              min: minFiles,
              max: maxFiles,
            }).toLowerCase()
          "
          imageReject
          reasonOptions
          reject-key="image"
          required
          title="photos"
          @change="changeReason"
        />
        <transition name="fade">
          <photo-reject-reason
            v-if="imageModal.isOpen"
            :default_data="rejectObj.rejectArray"
            :modal__title="$t('image_reject_reason')"
            :type="'car'"
            @close="closeImageRejectModal"
            @save="saveImageRejects"
          />
        </transition>
<!--        <upload-image-->
<!--          ref="sellLastStepUploadImage"-->
<!--          :announce="single_announce"-->
<!--          :default-files="files"-->
<!--          :helpers="helperImages"-->
<!--          :max-files="announcement.media.length"-->
<!--          :min-files="minFiles"-->
<!--          isModeationPage-->
<!--          load-croppa-->
<!--          @files-changed="updateImages"-->
<!--          @files-dropped="addImages"-->
<!--          @file-deleted="deleteImage"-->
<!--          @file-rotated="rotateImage"-->
<!--          @order-changed="changeOrder"-->
<!--        />-->
        <title-with-line-and-reject-reason
          v-if="form.images_360 && form.images_360.length"
          reject-key="360"
          title="360 camera"
          @change="changeReason"
        />

        <vue-three-sixty
          v-if="form.images_360 && form.images_360.length"
          :amount="form.images_360 && form.images_360.length"
          :files="form.images_360"
          buttonClass="d-none"
          class="mb-4"
          disableZoom
        />

        <title-with-line-and-reject-reason
          v-if="form.interior_360"
          reject-key="360_interior"
          title="360_interior"
          @change="changeReason"
        />

        <Interior360Viewer
          v-if="form.interior_360"
          :url="form.interior_360"
          class="mb-4"
        />
        <title-with-line-and-reject-reason
          :id="'anchor-selectedColor'"
          reject-key="color"
          required
          title="color"
          @change="changeReason"
        />
        <div v-if="form.selectedColor && colors.length" class="row">
          <div class="col-12 col-lg-10">
            <color-options v-model="form.selectedColor" :hide-matt="type !== 'cars'" :limit="2"
                           :matt="form.is_matte" :multiple="type === 'cars'" @change="removeError('selectedColor')"
                           @change-matt="form.is_matte = $event"/>
          </div>
          <div class="col-12 col-lg-2">
                  <span
                    v-if="smsRadarData && smsRadarData.color"
                    class="ma-smsradar"
                  >
                  <strong>SMSRadar: </strong>   <p>{{ smsRadarData.color }}</p>
               </span>
          </div>
        </div>
        <title-with-line-and-reject-reason
          no-approval
          reject-key="mileage"
          required
          title="mileage"
          @change="changeReason"
        />
        <div class="row">
          <div class="col-lg-3 mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input
                  v-model="announcement.mileage"
                  :invalid="isInvalid('mileage')"
                  :placeholder="$t('mileage')"
                  input-class="w-133"
                  @change="removeError('mileage'), updatePreview('mileage')"
                />
              </div>
              <div class="col-auto">
                <form-switch
                  v-model="form.mileage_measure"
                  :options="getMileageOptions"
                  @change="updatePreview('mileage_measure')"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="d-flex flex-wrap flex-lg-nowrap">
              <form-checkbox
                v-model="form.is_new"
                :label="$t('is_new')"
                input-name="is_new"
                transparent
                @change="updateMileage"
              />
              <form-checkbox
                v-model="form.beaten"
                :label="$t('bitie')"
                has-popover
                input-name="beaten"
                transparent
              >
                <popover
                  :message="
                    $t(
                      'with_significant_damage_to_body_elements_that_do_not_move_on_their_own',
                    )
                  "
                  :width="175"
                  class="white-space-pre-wrap-span"
                />
              </form-checkbox>
              <form-checkbox
                v-if="!single_announce.is_external_salon"
                v-model="form.customs_clearance"
                :label="$t('not_cleared')"
                input-name="customs_clearance"
                transparent
                @change="
                  removeError('car_number', true),
                    removeError('vin', true),
                    (form.car_number = '')
                "
              />
              <form-checkbox
                v-if="!single_announce.is_external_salon"
                v-model="form.guaranty"
                :label="$t('in_garanty')"
                input-name="guaranty"
                transparent
              />
            </div>
          </div>
        </div>
        <template v-if="type === 'cars'">
          <damage-options
            v-if="false"
            :imageIsActive="true"
            :selected="form.part"
            @update-car-damage="updateCarDamage"
          />
        </template>
        <template v-if="!isAutosalon && !user.external_salon">
          <title-with-line-and-reject-reason
            id="anchor-region_id"
            noApproval
            required
            title="region_and_place_of_inspection"
          />
          <div class="row">
            <div v-if="!single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
              <form-select
                v-model="form.region_id"
                :clear-option="false"
                :invalid="isInvalid('region_id')"
                :label="$t('region')"
                :options="sellOptions.regions"
                has-search
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
<<<<<<< HEAD
            <div class="col-lg-4 mb-2 mb-lg-0" v-if="!single_announce.is_external_salon">
=======
            <div v-if="single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
              <form-select
                v-model="form.country_id"
                :clear-option="false"
                :invalid="isInvalid('region_id')"
                :label="$t('sale_region_country')"
                :options="sellOptions.countries"
                has-search
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-0">
>>>>>>> 1fe89e34e23a7a51bc36b662c5b8496131733a27
              <form-text-input
                v-model="form.address"
                :placeholder="$t('address')"
                icon-name="placeholder"
              />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-0" v-if="!single_announce.is_external_salon">
              <pick-on-map-button
                :address="form.address"
                :lat="form.lat"
                :lng="form.lng"
                @change-address="updateAddress"
                @change-latlng="updateLatLng"
              >
                <form-text-input
                  v-model="form.address"
                  :placeholder="$t('address')"
                  icon-name="placeholder"
                />
              </pick-on-map-button>
            </div>
          </div>
        </template>
        <title-with-line-and-reject-reason
          :id="'anchor-price'"
          no-approval
          required
          title="price"
          @change="changeReason"
        />
        <div class="row">
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input
                  v-model="announcement.price"
                  :invalid="isInvalid('price')"
                  :placeholder="$t('price')"
                  input-class="w-133"
                  @change="removeError('price'), updatePreview('price')"
                />
              </div>
              <div class="col-auto">
                <form-switch
                  v-model="form.currency"
                  :options="getCurrencyOptions"
                  @change="updatePreview('currency')"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="d-flex flex-wrap flex-lg-nowrap">
              <form-checkbox
                v-if="!single_announce.is_external_salon"
                v-model="form.tradeable"
                :label="$t('tradeable')"
                input-name="tradeable"
                transparent
              />
              <form-checkbox
                v-if="!single_announce.is_external_salon"
                v-model="form.credit"
                :label="$t('credit_possible')"
                input-name="credit"
                transparent
              />
            </div>
          </div>
        </div>
        <template v-if="!single_announce.is_external_salon">
          <title-with-line-and-reject-reason
            :id="'anchor-price'"
            :title="`${$t('auction')} / ${$t('end_date')}`"
            reject-key="price"
            required
          />
          <div class="row">
            <div class="col-lg-auto mb-2 mb-lg-0">
              <div class="row">
                <div
                  :style="
                    isMobileBreakpoint
                      ? '    max-width: 57%; margin-bottom:10px;'
                      : ''
                  "
                  class="col-lg-auto flex-grow-1"
                >
                  <form-switch
                    v-model="form.auction"
                    :options="[
                      { name: $t('auction'), key: 1 },
                      { name: $t('sell'), key: 0 },
                    ]"
                    auto-width
                    style="width: fit-content !important;"
                    @change="removeError('end_date')"
                  />
                </div>
                <div v-if="form.auction === 1" class="col-auto">
                  <form-text-input
                    v-model="form.end_date"
                    :placeholder="$t('announcement_end_date')"
                    date-format="DD.MM.YYYY HH:00"
                    date-type="datetime"
                    input-date
                    value-type="datetime"
                    @change="removeError('end_date')"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template
          v-if="type === 'cars' || (type !== 'parts' && user.external_salon)"
        >
          <title-with-line-and-reject-reason
            v-if="
              !loggedIn ||
              (loggedIn && !user.autosalon) ||
              (loggedIn && user.autosalon && user.autosalon.is_official) ||
              user.external_salon
            "
            id="anchor-car_or_vin"
            :reject-key="form.car_number ? 'car_number' : 'vin'"
            :required="
              type === 'cars' || (type !== 'parts' && user.external_salon)
            "
            :title="
              form.customs_clearance || user.external_salon
                ? 'vin_carcase_number'
                : 'license_plate_number_vin_or_carcase_number'
            "

            spanId="anchor-vin"
            @change="changeReason"
          />
          <title-with-line-and-reject-reason
            v-else
            id="anchor-car_or_vin"
            :title="
              form.customs_clearance || user.external_salon
                ? 'vin_carcase_number'
                : 'license_plate_number_vin_or_carcase_number'
            "
            reject-key="price"
            spanId="anchor-vin"
          />
        </template>

        <div
          v-if="
            (type === 'cars' && !user.is_autosalon) ||
            (type !== 'parts' && user.external_salon)
          "
          id="anchor-car_number"
          class="row"
        >
          <div
            v-if="!form.customs_clearance && !user.external_salon"
            class="col-lg-4 mb-2 mb-lg-0"
          >
            <form-text-input
              v-model="form.car_number"
              :mask="type === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'"
              :placeholder="type === 'cars' ? '__ - __ - ___' : '__ - _ - ___'"
              img-src="/img/flag.svg"
              input-class="car-number-show-popover"
              @change="removeError('car_number')"
              @focus="showCarNumberDisclaimer"
            >
              <popover
                :message="$t('real-car-number-will-make-post-faster')"
                :width="190"
                name="car-number"
                text-class="text-red"
                @click="readCarNumberDisclaimer = true"
              />
            </form-text-input>
            <form-checkbox
              v-model="form.show_car_number"
              :label="$t('show_car_number_on_site')"
              class="mt-2 mt-lg-3"
              input-name="show_car_number"
              transparent
            />
          </div>
          <div v-if="form.customs_clearance" class="col-lg-4 mb-2 mb-lg-0">
            <form-text-input
              key="vin"
              v-model="form.vin"
              :mask="$maskAlphaNumeric('*****************')"
              :placeholder="$t('vin_carcase_number')"
              @change="removeError('vin')"
            >
              <popover :width="240" name="vin">
                <inline-svg src="/img/car-cert.svg"/>
              </popover>
            </form-text-input>
            <form-checkbox
              v-model="form.show_vin"
              :label="$t('show_vin_on_site')"
              class="mt-2 mt-lg-3"
              input-name="show_vin"
              transparent
            />
          </div>
          <div class="col-12 col-lg-8">
                  <span
                    v-if="smsRadarData && (smsRadarData.carNumber || smsRadarData.bodyNumber)"
                    class="ma-smsradar"
                  >
                  <strong>SMSRadar: </strong>   <p>{{
                      smsRadarData.carNumber
                    }} | {{ smsRadarData.bodyNumber ? smsRadarData.bodyNumber : '' }}</p>
               </span>
          </div>
        </div>
        <div class="mt-2 mt-lg-3">
          <template v-if="(type === 'cars') && popularOptions && popularOptions.length">
            <car-filters
              :collapsedByDefault="true"
              :values="form.all_options"
              popular
              @change-filter="updateCarFilter"
            />
            <div class="car-filters_row"></div>
          </template>
          <template v-else>
            <sell-filters
              :errors="errors"
              :selected="form.filters || form"
              :type="type"
              @remove-error="removeError"
              @add-form-keys="form = { ...$event, ...form }"
              @update-sell-filter="updateSellFilter"
            />
          </template>
        </div>
        <title-with-line-and-reject-reason
          :id="'anchor-comment'"
          noApproval
          reject-key="description"
          title="description_placeholder"
          @change="changeReason"
        />

        <form-textarea
          v-model="form.comment"
          :maxlength="3000"
          :placeholder="$t('description_placeholder_transport')"
        />
        <p class="info-text full-width less-pd mt-2">
          {{
            $t(
              'it_is_forbidden_to_give_links_indicate_email_addresses_mail_address_of_the_place_of_inspection_telephones_price_offer_services',
            )
          }}
        </p>
        <hr/>
        <modal-popup
          :modal-class="'wider'"
          :title="getRulesPage.title[locale]"
          :toggle="showRules"
          @close="showRules = false"
        >
          <div v-html="getRulesPage.text[locale]"></div>
        </modal-popup>

        <backdrop v-if="showLoginPopup" @click="showLoginPopup = false">
          <template #default="{ show }">
            <transition name="translate-fade">
              <login-tabs
                v-if="show"
                :action-text="{
                  login: $t('login_and_publish'),
                  register: $t('register_and_publish'),
                  confirm: $t('confirm_and_publish'),
                }"
                :force-sell-phone="true"
                :popup="true"
                :skip-sign-in="true"
                @close="showLoginPopup = false"
              />
            </transition>
          </template>
        </backdrop>
        <div id="anchor-finish" class="publish-post mb-4">
          <div v-if="showBanners && !isAlreadySold" class="row mt-4 mb-4">
            <div
              v-for="banner in ['vip', 'premium']"
              :key="banner"
              class="service-banner col-6 col-lg-4"
            >
              <img
                :src="`/img/card-${banner}${
                  isMobileBreakpoint ? '-mobile' : ''
                }-${locale}.png`"
                alt="banner"
                @click="publishPost"
              />
            </div>
          </div>
          <p class="info-text full-width mt-2">
            <icon name="alert-circle"/>
            {{
              $t('by_posting_an_ad_you_confirm_your_agreement_with_the_rules')
            }}:
            <nuxt-link
              :to="`/page/${getRulesPage.slug[locale]}`"
              event=""
              @click.native.prevent="showRules = true"
            >
              <strong>{{ $t('general_rules') }}</strong>
            </nuxt-link>
          </p>
          <p class="info-text full-width less-pd mt-2">
            <span class="star">*</span>
            — {{ $t('starred_fields_are_required') }}
          </p>
          <p v-if="isAlreadySold" class="info-text full-width less-pd text-red">
            {{
              $t(
                'this_car_already_added_last_90_days_for_new_added_need_payment',
              )
            }}
          </p>
          <p v-else-if="restore" class="info-text full-width less-pd">
            {{ $t('edit_or_restore') }}
          </p>

        </div>
      </div>
    </div>
  </component>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'

import {ToastErrorsMixin} from '~/mixins/toast-errors'
import {ImageResizeMixin} from '~/mixins/img-resize'
import {PaymentMixin} from '~/mixins/payment'

import SellSelectModification from '~/components/sell/SellSelectModificationModerator'
import UploadImage from '~/components/elements/UploadImage'
import ColorOptions from '~/components/options/ColorOptions'
import DamageOptions from '~/components/options/DamageOptions'
import AddVideo from '~/components/elements/AddVideo'
import PickOnMapButton from '~/components/elements/PickOnMapButton'
import SellFilters from '~/components/sell/SellFilters'
import CarFilters from '~/components/cars/CarFilters'
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

import Interior360Viewer from '~/components/Interior360Viewer'
import PhotoRejectReason from "~/pages/moderator/photoReject/PhotoRejectReason";


export default {
  components: {
    PhotoRejectReason,
    TitleWithLineAndRejectReason,
    SellSelectModification,
    UploadImage,
    ColorOptions,
    DamageOptions,
    AddVideo,
    PickOnMapButton,
    SellFilters,
    CarFilters,
    Interior360Viewer,
  },
  props: {
    edit: Boolean,
    restore: Boolean,
    title: String,
    type: String,
    announcement: {},
    colors: Array,
    generations: Array,
    sell_bodies: Array,
    smsRadarData: Object,
    single_announce: Object,
  },
  mixins: [ToastErrorsMixin, ImageResizeMixin, PaymentMixin],
  data() {
    return {
      now: new Date().toLocaleDateString('en-US'),
      collapsed: false,
      form: this.$clone(this.announcement),
      date: Math.floor(Date.now() / 1000),
      files: (this.announcement?.media || []).map((media, i) => ({
        media,
        key: this.announcement.media[i],
      })),
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      savedFiles: [...this.announcement.saved_images],
      deletedFiles: [],
      uploading: 0,
      publishing: false,
      showAllOptions: this.type !== 'cars' || this.edit,
      readCarNumberDisclaimer: false,
      showRules: false,
      showBanners: false,
      isAlreadySold: false,
      showLoginPopup: false,
      pending: false,
      comment: 'test',
      rejectObj: {
        show360Reject: false,
        showPhotoReject: false,
        rejectArray: [],
        reject360: ['360_photo_reject_1'],
      },
      imageModal: {
        isOpen: false,
        options: [
          'front_error',
          'back_error',
          'left_error',
          'right_error',
          'interior_error',
          'not_this_car_error',
          'logo_on_the_picture',
        ],
        initialOptions: [
          'front_error',
          'back_error',
          'left_error',
          'right_error',
          'interior_error',
          'not_this_car_error',
          'logo_on_the_picture',
        ],
        rejectArray: ['front_error',
          'back_error',
          'left_error',],
        modalToggled: false,
      }
    }
  },
  computed: {
    ...mapState(['sellPhoneEntered']),
    ...mapGetters(['sellOptions', 'sellSalonRights', 'staticPages', 'popularOptions',]),
    helperImages() {
      let imgs =
        this.type === 'cars'
          ? [1, 2, 3, 4, 5]
          : this.type === 'commercial'
            ? [1, 2, 3, 4]
            : [1, 2, 3]
      return imgs.map((n) => `/img/sell-helpers/${this.type}_${n}.png`)
    },
    isAutosalon() {
      return !!(
        (this.loggedIn &&
          this.user.autosalon &&
          this.user.autosalon.status === 1) ||
        this.sellSalonRights
      )
    },
    getRulesPage() {
      return this.staticPages.find((page) => page.id == 1)
    },
    getCurrencyOptions() {
      return [
        {key: 1, name: 'AZN', sign: '₼'},
        {key: 2, name: 'USD', sign: '$'},
        {key: 3, name: 'EUR', sign: '€'},
      ]
    },
    getMileageOptions() {
      return [
        {key: 1, name: this.$t('char_kilometre')},
        {key: 2, name: this.$t('char_mile')},
      ]
    },
    getOwnerOptions() {
      return [
        {key: 0, name: this.$t('yes')},
        {key: 1, name: this.$t('no')},
      ]
    },
    images() {
      const arr = []
      this.announcement.media.forEach((elem) => arr.push({name: elem}))
      return arr
    },
    modification() {
      return {
        year: this.announcement.year,
        brand: this.announcement.brand.slug,
        model: this.announcement.model.slug,
      }
    },
    imageRejected() {
      // if(
      return
      this.rejectObj.rejectArray.includes('front_error')
      // this.rejectObj.rejectArray.includes('back_error') ||
      // this.rejectObj.rejectArray.includes('left_error') ||
      // this.rejectObj.rejectArray.includes('right_error') ||
      // this.rejectObj.rejectArray.includes('interior_error') ||
      // this.rejectObj.rejectArray.includes('not_this_car_error') ||
      // this.rejectObj.rejectArray.includes('logo_on_the_picture')
      // ){
      //   return true
      // }else{
      //   return  false
      // }
    }

  },
  methods: {
    ...mapActions([
      'setSellProgress',
      'setSellPreviewData',
      'resetSellTokens',
      'getMyAllAnnouncements',
    ]),

    handleModification({key, value}) {
      this.$set(this.form, key, value)
      if (!this.showAllOptions && key === 'car_catalog_id' && value) {
        this.showAllOptions = true
        if (!this.isMobileBreakpoint) return
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(this.$refs['saved_images'], -34, 500)
          }, 0)
        })
      }
    },
    showCarNumberDisclaimer() {
      if (this.readCarNumberDisclaimer) {
        this.$nuxt.$emit('close-popover', 'car-number')
      } else {
        this.$nuxt.$emit('show-popover', 'car-number')
        this.readCarNumberDisclaimer = true
      }
    },
    updatePreview(key) {
      if (!key || key === 'region')
        this.setSellPreviewData({
          value: this.announcement.region_id,
          key: 'region',
        })
      if (!key || key === 'price')
        this.setSellPreviewData({value: this.form.price, key: 'price'})
      if (!key || key === 'currency')
        this.setSellPreviewData({
          value: this.getCurrencyOptions.find(
            (o) => o.key === this.form.currency,
          )?.sign,
          key: 'currency',
        })
      if (!key || key === 'mileage')
        this.setSellPreviewData({value: this.form.mileage, key: 'mileage'})
      if (!key || key === 'mileage_measure')
        this.setSellPreviewData({
          value: this.getMileageOptions.find(
            (o) => o.key === this.form.mileage_measure,
          )?.name,
          key: 'mileage_measure',
        })
      return
    },
    updateMileage(is_new) {
      if (!is_new) {
        this.isInvalid('mileage') && this.removeError('mileage')
      } else {
        let mileage = this.form.mileage
        this.form.mileage =
          mileage > (this.form.mileage_measure === 2 ? 310.686 : 500) ||
          !mileage
            ? 0
            : mileage
      }
      this.updatePreview('mileage')
    },
    updateAddress(address) {
      this.form.address = address
      this.removeError('address')
    },
    updateLatLng({lat, lng}) {
      this.form.lat = lat
      this.form.lng = lng
    },
    updateCarDamage(part) {
      this.form.part = part
    },
    updateCarFilter(key, value) {
      if (
        value === false ||
        value === '' ||
        (typeof value === 'object' && !Object.keys(value).length)
      )
        this.$delete(this.form.all_options, key)
      else this.$set(this.form.all_options, key, value)
      this.$nuxt.$emit('change-car-filters')
    },
    updateSellFilter(key, value) {
      if (value === '') this.$delete(this.form, key)
      else this.$set(this.form, key, value)
    },
    // image upload
    updateImages(files) {
      this.files = files
      this.setSellPreviewData({value: files[0]?.image, key: 'image'})
    },
    async addImages(images) {
      // passed min limit
      if (
        images.length + this.savedFiles.length + this.uploading >=
        this.minFiles
      )
        this.removeError('saved_images')
      // upload images
      this.uploading += images.length
      await Promise.all(
        images.map(async (image) => {
          let formData = new FormData()
          let file = await this.getResizedImage(image.file)
          formData.append('temp_id', this.date)
          formData.append('images[]', file)
          try {
            const data = await this.$axios.$post(
              '/upload_temporary_images',
              formData,
              {
                progress: false,
                headers: {'Content-Type': 'multipart/form-data'},
              },
            )
            this.uploading--
            this.$nuxt.$emit(
              'image-uploaded',
              image.key,
              false,
              data.images[0],
              data.ids[0],
            )
            this.$nuxt.$emit('hide-image-preloader-by-key', image.key)
            this.savedFiles = [...this.savedFiles, ...data.ids]
          } catch ({
            response: {
              data: {data},
            },
          }) {
            this.uploading--
            this.$nuxt.$emit('delete-image-by-key', image.key)
            this.clearErrors()
            for (let key in data) {
              this.$toasted.error(data[key])
            }
          }
        }),
      )
    },
    async deleteImage(index) {

      this.$emit('imageDeleted', index)
      if (this.savedFiles[index]) {
        if (
          this.edit &&
          this.form.saved_images.includes(this.savedFiles[index])
        )
          this.deletedFiles.push(this.savedFiles[index])
        else
          this.$axios.$post('/remove_temporary_image/' + this.savedFiles[index])
        this.$delete(this.savedFiles, index)
      }
    },
    async rotateImage(index, key) {
      if (this.savedFiles[index]) {
        try {
          this.$nuxt.$loading.start()
          const {data} = await this.$axios.$get(
            `/media/${this.savedFiles[index]}/rotate/right`,
          )
          this.$nuxt.$loading.finish()
          this.$nuxt.$emit('image-uploaded', key, true, data.thumb)
          this.$nuxt.$emit('hide-image-preloader-by-key', key)
        } catch ({
          response: {
            data: {data},
          },
        }) {
          this.$nuxt.$emit('hide-image-preloader-by-key', key)
          this.$nuxt.$loading.finish()
          this.clearErrors()
          for (let key in data) {
            this.$toasted.error(data[key])
          }
        }
      }
    },
    changeOrder(sorted, preview) {
      this.$set(this, 'savedFiles', sorted)
      this.setSellPreviewData({value: preview, key: 'image'})
    },
    // post announcement
    async publishPost() {
      if (this.pending) return
      // wait till all images uploaded
      if (this.uploading) {
        this.$toasted.error(this.$t('please_wait_for_all_image_loading'))
        return
      }
      this.form.saved_images = this.savedFiles
      this.form.is_autosalon = this.isAutosalon
      if (this.isAlreadySold) this.form.can_pay = true
      // generate post data
      let formData = new FormData()
      formData.append('data', JSON.stringify(this.form))
      formData.append('phone', this.sellPhoneEntered.replace(/[^0-9]+/g, ''))
      if (this.deletedFiles.length)
        formData.append('deletedImages', JSON.stringify(this.deletedFiles))
      // generate post link
      let postUrl = '/sell/'
      postUrl += this.type !== 'cars' ? this.type + '/' : ''
      postUrl += this.type !== 'commercial' || !this.edit ? 'post/' : ''
      postUrl += this.edit
        ? 'edit/' + this.$route.params.id.slice(0, -1)
        : 'publish'
      postUrl += `?is_mobile=${this.isMobileBreakpoint}`
      // post
      this.pending = true
      try {
        // publish or update post
        const res = await this.$axios.$post(postUrl, formData)
        if (this.loggedIn) await this.$auth.fetchUser()
        // track event
        if (!this.edit) {
          this.fbTrack('Lead Api')
          this.gtagTrack('AW-600951956/ccUSCJT25_IBEJSZx54C')
        }
        // redirect to payment if action was to restore
        if (res?.data?.redirect_url) {
          this.handlePayment(res, this.$localePath('/profile/announcements'))
        } else {
          this.$router.push(this.$localePath('/profile/announcements'), () => {
            if (this.restore) {
              this.updatePaidStatus({
                type: 'success',
                text: this.$t('announcement_restored'),
                title: this.$t('success_payment'),
              })
            } else if (this.isAlreadySold) {
              this.updatePaidStatus({
                type: 'success',
                text: this.$t('announcement_paid'),
                title: this.$t('success_payment'),
              })
            } else {
              this.$toasted.success(this.$t('saved_changes'))
            }
          })
        }
      } catch ({
        response: {
          status,
          data: {data, message},
        },
      }) {
        this.clearErrors()
        this.pending = false

        if (status === 420) {
          this.$toasted.error(this.$t(message))
          if (data.need_pay) {
            this.isAlreadySold = true
            this.scrollTo('.publish-post')
          }
        } else {
          // find errors
          let dataLength = data && Object.keys(data).length
          if (dataLength) {
            let count = 0
            for (let key in data) {
              // key = Object.keys(data)[dataLength - Object.keys(data).indexOf(key) - 1];
              let errorKey = key
              if (errorKey === 'car_or_vin')
                errorKey = this.form.customs_clearance ? 'vin' : 'car_number'
              this.errors.push(errorKey)
              let errorIndex = this.errors.indexOf(errorKey)
              let errorText = `(${dataLength - errorIndex}/${dataLength}) ${
                data[key][0]
              }`
              // show error
              this.showError(
                errorKey,
                errorText,
                {fieldView: key, offset: this.isMobileBreakpoint ? 30 : -20},
                count === 0,
              )
              count++
            }
          } else if (message && status !== 499) {
            this.$toasted.error(this.$t(message))
          }
        }

        // check if user logged in
        if (!this.showLoginPopup && status === 499) this.showLoginPopup = true
      }
    },
    handleAfterLogin() {
      this.resetSellTokens()
      this.showLoginPopup = false
      this.publishPost()
    },
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.openImageRejectModal()
      } else if (rejectKey === '360') {
        this.rejectObj.show360Reject = true
      } else {
        if (this.rejectObj.rejectArray.includes(rejectKey)) {
          this.rejectObj.rejectArray.splice(this.rejectObj.rejectArray.indexOf(rejectKey), 1)
        } else {
          this.rejectObj.rejectArray.push(rejectKey)
        }
      }
    },

    //image reject


    openImageRejectModal() {

      this.imageModal.isOpen = true;


      var opts = this.imageModal.options;
      var arr = this.rejectObj.rejectArray;
      var tempArr = this.imageModal.rejectArray;

      for (var i = 0; i < opts.length; i++) {
        console.log(i, opts[i])
      }
    },
    closeImageRejectModal() {
      this.imageModal.isOpen = false
      this.imageModal.rejectArray = [];
      this.removeDuplicates()
    },

    //fills temporary array
    changeImageRejectReason(rejectKey) {
      var oldArr = this.imageModal.rejectArray;
      var editingArr = this.imageModal.rejectArray;
      if (editingArr.includes(rejectKey)) {
        editingArr.splice(editingArr.indexOf(rejectKey), 1)
      } else {
        editingArr.push(rejectKey)
      }
    },
    saveImageRejects() {
      this.rejectObj.rejectArray = this.rejectObj.rejectArray.concat(this.imageModal.rejectArray);
      this.removeDuplicates()
      this.closeImageRejectModal();
      this.imageModal.rejectArray = [];
    },
    removeDuplicates() {
      var arr = this.rejectObj.rejectArray
      this.rejectObj.rejectArray = [...new Set(arr)]
    },

  },
  watch: {
    progress(value) {
      this.setSellProgress(value)
    },
    rejectObj: {
      deep: true,
      handler() {
        this.$emit('getRejectObj', this.rejectObj)
      }
    },
    form: {
      deep: true,
      handler() {
        this.$emit("formChanged", this.form)
      }
    }
  },
  created() {
    ;[
      'sellBody',
      'sellGenerations',
      'sellEngines',
      'sellGearing',
      'sellTransmissions',
      'sellModifications',
    ].map((property) => {
      this.mutate({property, value: []})
    })

    this.$nuxt.$on('login', this.handleAfterLogin)
    if (this.user.external_salon) {
      this.form.customs_clearance = true
    }
    this.updatePreview()
    this.$store.dispatch('getOptions')
  },
  beforeDestroy() {
    this.$nuxt.$off('login', this.handleAfterLogin)
  },
  mounted() {
    this.$store.dispatch('getPopularOptions');
  },
}
</script>

<style lang="scss">
.white-space-pre-wrap-span span {
  white-space: pre-wrap !important;
}
</style>
