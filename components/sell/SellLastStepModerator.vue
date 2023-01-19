<template>
  <div v-if="single_announce">
    <div
      v-if="showAllOptions"
      :class="{
          'disabled-content': type === 'cars' && !form.car_catalog_id && !edit,
        }"
    >

      <slot name="form-inputs"/>

      <section name="media">
        <slot name="image"></slot>
        <template v-if="!no360">

          <title-with-line-and-reject-reason
            :no-approval="!single_announce.images_360.length"
            title="360_exterior"
            @change="changeReason"
          />

          <slot v-if="form.images_360" name="360_exterior_input"></slot>
          <slot v-if="form.images_360 && form.images_360.length" name="360_exterior_content"></slot>
          <title-with-line-and-reject-reason
            :no-approval="!form.interior_360_url"
            title="360_interior"
            @change="changeReason"
          />

          <section class="mb-4">
            <div
              class="section-part__container"
            >
              <div class="row justify-content-between align-items-center">

                <div class="col-auto">
                  <input class="btn" type="file" v-on:change="add360Interior"/>
                </div>
                <div class="col-auto mt-2 mt-lg-0">
                  <button
                    v-if="single_announce.interior_360"
                    class="btn btn-danger mb-2"
                    style="float: right;"
                    @click="handleRemoveInterior"
                  >
                    360 İnteryeri sil
                  </button>
                </div>


              </div>
            </div>
          </section>
          <Interior360Viewer
            v-if="single_announce.interior_360 && !no360 && !interior360removed"
            :url="single_announce.interior_360"
            class="mb-4"

          />
        </template>
      </section>

      <!--      color-->
      <section name="color">
        <title-with-line-and-reject-reason
          :id="'anchor-selectedColor'"
          reject-key="color"
          required
          title="color"
          @change="changeReason"
        />
        <div v-if="form.selectedColor && colors.length" class="row">
          <div class="col-12 col-lg-10">
            <color-options
              v-model="form.selectedColor"
              :limit="2"
              :matt="form.is_matte"
              multiple
              @change="removeError('selectedColor')"
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
      </section>


      <!--      mileage-->
      <section id="mileage-section-1">
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
                  v-model="form.mileage"
                  :invalid="isInvalid('mileage')"
                  :placeholder="$t('mileage')"
                  input-class="w-133" @change="removeError('mileage'), updatePreview('mileage')"/>
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
        <div v-if="type === 'cars'">
          <damage-options
            v-if="false"
            :imageIsActive="true"
            :selected="form.part"
            @update-car-damage="updateCarDamage"
          />
        </div>

      </section>

      <!--      price-->
      <section id="price-section-1">
        <title-with-line-and-reject-reason
          :id="'anchor-price'"
          no-approval
          required
          title="price"
        />
        <div class="row">
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="row flex-nowrap">
              <div class="col-auto flex-grow-1">
                <form-numeric-input
                  v-model="form.price"
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
        <div v-if="single_announce.is_external_salon">
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
                    ref="form_end_date"
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
        </div>
      </section>

      <!--      owner-->
      <section id="owner-section-1" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            no-approval
            title="first_owner_question"/>
        </div>

        <div class="col-auto">
          <form-switch
            v-model="form.owner_type"
            :options="getOwnerOptions"
            :value="single_announce.owner_type"
            autoWidth
            translated
            @change="getChange($event,'owner_type')"
          />
        </div>
      </section>

      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!--      region-->
      <section ref="region_section_1" id="region-section-1">
        <div v-if="!isAutosalon && !user.external_salon">
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
                :allow-clear="false"
                :clear-option="false"
                :invalid="isInvalid('region_id')"
                :label="$t('region')"
                :options="sellOptions.regions"
                has-search
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
            <div v-if="single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
              <form-select
                v-model="form.country_id"
                :allow-clear="false"
                :clear-option="false"
                :invalid="isInvalid('region_id')"
                :label="$t('sale_region_country')"
                :options="sellOptions.countries"
                has-search
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
            <div v-if="!single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
              <!---------------------------------------------------------------------------------------------------------------------------------------------->

              <input
                ref="moderation-adress-input-1"
                v-model="form.address"
                :auto-focus="false"
                :placeholder="$t('address')"
                class="ma-input"
                icon-name="placeholder"
              />
              <!---------------------------------------------------------------------------------------------------------------------------------------------->
            </div>
            <div v-if="!single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
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
        </div>
      </section>
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!--      number plate-->
      <section v-if="!form.customs_clearance && !user.external_salon" id="number-section-1">
        <div v-if="type === 'cars' || (type !== 'parts' && user.external_salon)">
          <title-with-line-and-reject-reason
            v-if="
              !loggedIn ||
              (loggedIn && !user.autosalon) ||
              (loggedIn && user.autosalon && user.autosalon.is_official) ||
              user.external_salon
            "
            id="anchor-car_or_vin"
            :reject-key="'car_number'"
            :required="user.external_salon"
            spanId="anchor-vin"
            title="vehicle_id_sign"
            @change="changeReason"
          />
        </div>
        <div v-if="(!user.is_autosalon) || (type !== 'parts' && user.external_salon)"
             id="anchor-car_number" class="row">
          <div v-if="!form.customs_clearance && !user.external_salon" class="col-12 col-lg-2 mb-2 mb-lg-0">
            <!---------------------------------------------------------------------------------------------------------------------------------------------->
            <form-text-input
              ref="moderation-car-number-input-1"
              v-model="form.car_number"
              :mask="'99 - AA - 999'"
              :placeholder="'__ - __ - ___'"
            />
            <!--              class="ma-input"-->


            <!---------------------------------------------------------------------------------------------------------------------------------------------->

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
          <div v-if="!form.customs_clearance && !user.external_salon" class="col-12 mt-2 ">
            <form-checkbox
              v-model="form.show_car_number"
              :label="$t('show_car_number_on_site')"
              class="mt-0 pl-0"
              input-name="show_car_number"
              transparent
            />
          </div>
        </div>
      </section>
      <!--      vin-->
      <section id="vin-section-1">
        <div v-if="type === 'cars' || (type !== 'parts' && user.external_salon)">
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
            spanId="anchor-vin"
            title="vin_carcase_number"
            @change="changeReason"
          />
        </div>
        <div class="col-lg-4 mb-2 mb-lg-0 pl-0">
          <form-textarea
            key="vin"
            v-model="form.vin"
            :mask="$maskAlphaNumeric('*****************')"
            :placeholder="$t('vin_carcase_number')"
            class="textfield-like-textarea"
            @change="removeError('vin')"
          >
            <popover :width="240" name="vin">
              <inline-svg src="/img/car-cert.svg"/>
            </popover>
          </form-textarea>
          <form-checkbox
            v-model="form.show_vin"
            :label="$t('show_vin_on_site')"
            class="mt-2 mt-lg-3"
            input-name="show_vin"
            transparent
          />
        </div>
      </section>
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->
      <!---------------------------------------------------------------------------------------------------------------------------------------------->

      <!--      popular,comment-->
      <section name="popular">
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
      </section>


      <hr/>
      <modal-popup
        :modal-class="'wider'"
        :title="getRulesPage.title[locale]"
        :toggle="showRules"
        @close="showRules = false"
      >
        <div v-html="getRulesPage.text[locale]"></div>
      </modal-popup>

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
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'

import {ToastErrorsMixin} from '~/mixins/toast-errors'
import {ImageResizeMixin} from '~/mixins/img-resize'
import {PaymentMixin} from '~/mixins/payment'

import UploadImage from '~/components/elements/UploadImage'
import ColorOptions from '~/components/options/ColorOptions'
import DamageOptions from '~/components/options/DamageOptions'
import AddVideo from '~/components/elements/AddVideo'
import PickOnMapButton from '~/components/elements/PickOnMapButton'
import SellFilters from '~/components/sell/SellFilters'
import CarFilters from '~/components/cars/CarFilters'
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

import Interior360Viewer from '~/components/Interior360Viewer'


export default {
  components: {

    TitleWithLineAndRejectReason,
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
    showPhotoReject: Boolean,
    no360: Boolean,
    isCommercial: Boolean,
  },
  mixins: [ToastErrorsMixin, ImageResizeMixin, PaymentMixin],
  data() {
    return {
      interior360removed: false,
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
      savedFiles: (this.announcement.saved_images?.length) ? [...this.announcement.saved_images] : [],
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
        {key: "0", name: 'first',},
        {key: "1", name: 'second_and_more',},
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
      'setSellPreviewData',
      'resetSellTokens',
      'getMyAllAnnouncements',
    ]),
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
      if (rejectKey === '360') {
        this.rejectObj.show360Reject = true
      } else {
        if (this.rejectObj.rejectArray.includes(rejectKey)) {
          this.rejectObj.rejectArray.splice(this.rejectObj.rejectArray.indexOf(rejectKey), 1)
        } else {
          this.rejectObj.rejectArray.push(rejectKey)
        }
      }
    },

    removeDuplicates() {
      var arr = this.rejectObj.rejectArray
      this.rejectObj.rejectArray = [...new Set(arr)]
    },


    //  ----------
    add360Interior(val) {
      var formData = new FormData()
      formData.append('image', val.target.files[0])

      this.$axios
        .post('/upload_temporary_interior_image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.success(this.$t('interior_360_successfully_upload'))
            this.form['interior_360_id'] = res.data.data.id
            this.form['interior_360_url'] = res.data.data.url
            this.$emit("interior_360_id_changed", res.data.data.id)
          }
        })
    },
    async handleRemoveInterior() {
      try {
        this.button_loading = true
        await this.$axios.$post('/announce/remove_360_interior', {
          announcement_id: this.single_announce.id,
        })
        this.$emit('remove360', 'success')
        let data = await this.$axios.$get('/ticket/car')
        this.$store.commit('mutate', {
          with: data.announce,
          property: 'single_announce',
        })
        this.$toasted.success('Silindi')
        this.interior360removed = true;
      } catch (e) {
        this.$toasted.error('Silinmede problem yarandi')
      }
      this.button_loading = false
    },
    async remove360(param) {
      if (param == 'success') {
        let data = await this.$axios.$get('/ticket/car')

        let video360section = document.getElementById('video360section')
        video360section.remove()

        this.$store.commit('mutate', {
          with: data.announce,
          property: 'single_announce',
        })
      }
    },

  },
  watch: {
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
      },

    },
    'form.mileage':{
      deep:true,
      handler(){
        if (this.form.mileage == null){
          this.form.mileage = 0
        }
      }
    },
  },
  created() {
    // this.$nuxt.$on('login', this.handleAfterLogin)
    if (this.user.external_salon) {
      this.form.customs_clearance = true
    }
    this.updatePreview()
    this.$store.dispatch('getOptions')
  },
  beforeDestroy() {
    this.$nuxt.$off('login', this.handleAfterLogin);
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
