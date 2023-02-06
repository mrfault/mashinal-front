<template>
  <div v-if="loading">
    <elements-loader></elements-loader>
  </div>
  <div
    v-else-if="!single_announce.id && !loading"
    class="d-flex flex-column justify-content-center h-300"
  >
    <h1 class="text-center">Baxılmayanlar mövcud deyil</h1>
  </div>
  <div v-else class="container">
    <!--    breadcrumbs-->
    <breadcrumbs id="brdcrmbs1" :crumbs="crumbs"/>

    <!--    empty announce-->
    <div v-if="!single_announce.id">
      <div style="text-align: center">
        <br><br>
        <h2>{{ $t('not_have_pending') }} {{ $route.query.type }}</h2>
        <!--<a :href="$route.fullPath">
          <button class="section-post__btn add_announce">Get car ticket</button>
        </a>
        &nbsp;&nbsp;-->
        <a href="javascript:void(0);">
          <button class="btn btn--yellow w-50" @click="handleBackList">{{ $t('back_to_list') }}</button>
        </a>
        <br><br>
      </div>
    </div>
    <!----------------------------------------Announce------------------------------------------------------------------------------------------------------------------------------------------->
    <!----------------------------------------Announce------------------------------------------------------------------------------------------------------------------------------------------->

    <!--    details-->
    <div class="card w-100">

      <!--        userdata-->
      <section class="row">
        <div class="col-12 col-md-6 col-lg-9">
          <user-details
            :brand="form.brandObj"
            :createdAt="single_announce.created_at"
            :is-autosalon="single_announce.is_autosalon"
            :is-external-salon="single_announce.is_external_salon"
            :userData="single_announce.user"
          />
        </div>
        <div
          class="col-12 col-md-6 col-lg-3 d-flex justify-content-end">
          <show-comment
            v-if="user.admin_group === 1 && single_announce.transferred"
            :single_announce="single_announce"
          />
          <button
            v-if="single_announce.change_log && single_announce.change_log.length"
            :class="{ button_loading: button_loading }"
            class="'btn btn--green px-2 py-1"
            @click.prevent="openLog = true"
          >
            {{ $t('show_logs') }}
          </button>

        </div>
      </section>

      <!--    category  -->
      <section class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!isAdmin"
            :oldValue="getOldCategory"
            rejectKey="brand"
            title="category"
            @change="changeReason"
          />
        </div>
        <div v-if="commercial_types && commercial_types.length" class="col-12 col-lg-3">
          <form-select
            v-model="form.commercial_type_id"
            :allow-clear="false"
            :clearOption="false"
            :disabled="isModerator"
            :label="$t('category')"
            :options="commercial_types.map((o) => ({
                name: o.name,
                key: o.id,
              }))"
            has-search
            @change="handleCategoryChange($event)"
          />
        </div>
      </section>

      <!--        brand-->
      <section v-if="form.commercial_type_id" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
            rejectKey="brand"
            title="mark"
            @change="changeReason"
          />
        </div>
        <div v-if="com_brands && com_brands[0].length" class="col-12 col-lg-3">
          <form-select
            v-model="form.brand"
            :allow-clear="false"
            :clearOption="false"
            :disabled="isModerator"
            :label="$t('mark')"
            :options="com_brands[0].map((o) => ({
                name: o.name,
                key: o.id,
              }))"
            :value="form.brand"
            has-search
            @change="handleBrandChange($event)"
          />
        </div>
      </section>

      <!--        model-->
      <section v-if="form.brand" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
            rejectKey="model"
            title="model"
            @change="changeReason"
          />
        </div>
        <div v-if="com_models && com_models[0].length" class="col-12 col-lg-3">
          <form-select
            v-model="form.model"
            :allow-clear="false"
            :clearOption="false"
            :disabled="isModerator"
            :label="$t('model')"
            :options="com_models[0].map((o) => ({
                name: o.name,
                key: o.id,
              }))"
            :value="form.model"
            has-search
            @change="handleChange($event)"
          />
        </div>
      </section>

      <!--    year  -->
      <section v-if="form.model" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!isAdmin"
            :old-value="(admin_user.admin_group !== 2 &&  single_announce.old_year) ? single_announce.old_year : ''"
            rejectKey="year"
            title="year"
            @change="changeReason"
          />
        </div>
        <div v-if="commercial_types && commercial_types.length" class="col-12 col-lg-3">
          <form-select
            v-model="form.year"
            :allow-clear="false"
            :clearOption="false"
            :disabled="isModerator"
            :label="$t('year')"
            :options="getYears"
            :value="form.year"
            has-search
            @change="handleChange($event)"
          />
        </div>
      </section>

      <!--       photo-->
      <section>


        <title-with-line-and-reject-reason
          :subtitle="
                      $t('at_least_3_photos', {
                        min: minFiles,
                        max: maxFiles,
                      }).toLowerCase()
                    "
          hideRejectReason
          title="photos"
        >
          <div class="mb-2 ml-2" style="display: inline-block; z-index: 0;">
            <reject-reason
              :disabled-value="true"
              rejectKey="image"
              @change="changeReason"
            />
          </div>

        </title-with-line-and-reject-reason>
        <transition name="fade">
          <photo-reject-reason
            v-if="imageModal.isOpen"
            :default_data="rejectArray"
            :modal__title="$t('image_reject_reason')"
            :type="'car'"
            @close="imageModal.isOpen = false"
            @save="savePhotoIssues"
          />
        </transition>
        <upload-image-moderator
          :announce="single_announce"
          :changePosition="saved_images.length === imagesBase64.length"
          :default-images="single_announce.media"
          :imageCount="imagesBase64.length"
          :imageIsUploading="imageIsUploading"
          :is-edit="false"
          :load-croppa="true"
          :max_files="30"
          :saved_images="saved_images"
          :stopUploading="imagesBase64.length >= 20"
          page="sell"
          url="/"
          @addFiles="addFiles"
          @change="addImages"
          @deletedIndex="deleteByIndex"
          @passBase64Images="passBase64Images"
          @replaceImage="replaceImage"
        />

      </section>

      <!--       color-->
      <section class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
            rejectKey="color"
            title="color"
            @change="changeReason"
          />
        </div>

        <div v-if="colors.length" class="col-12">
          <color-options v-model="form.selectedColor" :limit="2"
                         :multiple="type === 'cars'" hide-matt @change="removeError('selectedColor')"
                         @change-matt="form.is_matte = $event"/>
        </div>
      </section>

      <!--      mileage-->
      <section class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            no-approval
            reject-key="mileage"
            required
            title="mileage"
            @change="changeReason"
          />
        </div>
        <div class="col-auto">
          <form-numeric-input
            v-model="form.mileage"
            :disabled="isModerator"
            :invalid="isInvalid('mileage')"
            :min="0"
            :placeholder="$t('mileage')"
            input-class="w-133"
            @change="getChange($event,'mileage')"
          />
        </div>
        <div class="col-auto">
          <form-switch
            v-model="form.mileage_measure"
            :disabled="isModerator"
            :options="getMileageOptions"
            @change="updatePreview('mileage_measure')"
          />
        </div>
        <div class="col-auto">
          <form-checkbox
            v-model="form.is_new"
            :disabled="isModerator"
            :label="$t('is_new')"
            :value="single_announce.is_new"
            input-name="is_new"
            transparent
            @change="checkboxChanged"
          />
        </div>
        <div class="col-auto">
          <form-checkbox
            v-if="!single_announce.is_external_salon"
            v-model="form.guaranty"
            :disabled="isModerator"
            :label="$t('in_garanty')"
            :value="single_announce.guaranty"
            input-name="guaranty"
            transparent
            @change="checkboxChanged"
          />
        </div>
        <div class="col-auto">
          <form-checkbox
            v-if="!single_announce.is_external_salon"
            v-model="form.customs_clearance"
            :disabled="isModerator"
            :label="$t('not_cleared')"
            :value="single_announce.customed"
            input-name="customs_clearance"
            transparent
            @change="checkboxChanged"
          />
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <form-checkbox
            :disabled="isModerator"
            :label="$t('bitie')"
            :value="single_announce.status_id"
            input-name="bitie"
            transparent
            @change="checkboxChanged"
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
        </div>
      </section>


      <!--      region-->
      <section ref="form_region_field" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            description="it_will_not_be_possible_to_change_the_city_after_accommodation"
            no-approval
            title="region_and_place_of_inspection"/>
        </div>

        <div v-if="!single_announce.is_external_salon" class="col-4 col-md-6 col-lg-3">
          <form-select
            id="region_id"
            :key="refresh+1"
            v-model="form.region_id"
            :allow-clear="false"
            :clearOption="false"
            :disabled="isModerator"
            :has-error="errors.includes('region_id')"
            :label="$t('region')"
            :options="sell_options.regions"
            :value="single_announce.region_id"
            has-search
            selected-key="region_id"
            @change="removeError('region_id'), updatePreview('region')"
          />
        </div>
        <div v-if="single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
          <form-select
            v-model="form.country_id"
            :allow-clear="false"
            :clear-option="false"
            :clearOption="false"
            :disabled="isModerator"
            :invalid="isInvalid('region_id')"
            :label="$t('sale_region_country')"
            :options="sell_options.countries"
            has-search
            @change="removeError('region_id'), updatePreview('region')"
          />
        </div>
        <div v-if="!single_announce.is_external_salon" class="col-4 col-md-6 col-lg-3">
          <pick-on-map-button
            :address="form.address"
            :lat="Number(form.lat)"
            :lng="Number(form.lng)"
            @change-address="updateAddress"
            @change-latlng="updateLatLng"
          >
            <form-text-input
              v-model="form.address"
              :disabled="isModerator"
              :placeholder="$t('address')"
              icon-name="placeholder"
            />
          </pick-on-map-button>
        </div>
      </section>

      <!--      price-->
      <section ref="form_price_field" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            no-approval
            title="price"/>
        </div>

        <div class="col-auto">
          <form-numeric-input
            v-model="form.price"
            :disabled="isModerator"
            :invalid="isInvalid('price')"
            :placeholder="$t('price')"
            input-class="w-133"
            @change="removeError('price'), updatePreview('price')"
          />
        </div>
        <div class="col-auto">
          <form-switch
            v-model="form.currency"
            :disabled="isModerator"
            :options="getCurrencyOptions"
            @change="updatePreview('currency')"
          />
        </div>
      </section>

      <!--      owner-->
      <section v-if="false" class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            no-approval
            title="first_owner_question"/>
        </div>

        <div v-if="false" class="col-auto">
          <form-switch
            v-model="form.owner_type"
            :disabled="isModerator"
            :options="getOwnerOptions"
            :value="single_announce.owners"
            autoWidth
            translated
            @change="getChange($event,'owner_type')"
          />
        </div>
      </section>

      <!--      number/vin-->
      <section v-if="false" id="number-section-commercial">
        <div>
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
            :title=" 'license_plate_number_vin_or_carcase_number'"
            img-src="/img/flag.svg"
            spanId="anchor-vin"
            @change="changeReason"
          />
        </div>
        <div
          id="anchor-car_number"
          class="row"
        >
          <div
            v-if="form.customs_clearance"
            class="col-lg-4 mb-2 mb-lg-0"
          >
            <template>

              <form-textarea
                key="vin"
                v-model="form.vin"
                :disabled="isModerator"
                :mask="$maskAlphaNumeric('*****************')"
                :placeholder="$t('vin_carcase_number')"
                class="textfield-like-textarea"
                @change="removeError('vin')"
              >
                <popover :width="240" name="vin">
                  <inline-svg src="/img/car-cert.svg"/>
                </popover>
              </form-textarea>
            </template>
            <form-checkbox
              v-model="form.show_vin"
              :disabled="isModerator"
              :label="$t('show_vin_on_site')"
              class="mt-2 mt-lg-3"
              input-name="show_vin"
              transparent
            />
          </div>
          <div
            v-if="!form.customs_clearance == true"
            class="col-lg-4 mb-2 mb-lg-0"
          >
            <form-text-input
              ref="moderation-car-number-input-1"
              v-model="form.car_number"
              :disabled="isModerator"
              :mask="'99 - A{1,2} - 999'"
              :placeholder="'__ - _ - ___'"
            />
          </div>

        </div>
      </section>

      <!--      sell filters-->
      <section class="row mt-3">
        <div class="col-12">
          <div class="sell-filters">
            <div class="mt-2 mt-lg-3 car-filters_row">
              <div class="d-flex mb-2 mb-lg-3" @click="collapsed = !collapsed;">
                <h2 class="title-with-line full-width">
                  <span>{{ $t('other_options') }}</span>
                </h2>
                <icon :name="collapsed ? 'chevron-up' : 'chevron-down'" class="cursor-pointer"/>
              </div>
            </div>
            <transition-expand>
              <div v-if="collapsed" class="w-100">
                <!--                power-->
                <div v-if="form.commercial_type_id !== 43" class="row">
                  <div class="col-12">
                    <title-with-line-and-reject-reason no-approval title="horse_power"/>
                  </div>
                  <div class="col-auto">
                    <form-numeric-input
                      v-model="form.power"
                      :disabled="isModerator"
                      :invalid="hasError(item)"
                      placeholder="horse_power"
                      @change="handleChange($event)"
                    />
                  </div>
                </div>
                <!--                capacity -->
                <div v-if="form.commercial_type_id !== 43" class="row">
                  <div class="col-12">
                    <title-with-line-and-reject-reason no-approval title="volume"/>
                  </div>
                  <div class="col-auto">
                    <form-numeric-input
                      v-model="form.capacity"
                      :disabled="isModerator"
                      placeholder="volume"
                    />
                  </div>
                </div>
                <!--                sell filters radio-->
                <div v-for="(item,indx) in com_filters" :key="indx">
                  <title-with-line-and-reject-reason v-if="com_filters[indx].values && com_filters[indx].values.length"
                                                     :required="item.required" :title="item.type_key" no-approval/>
                  <div v-if="com_filters[indx].values" class="row">
                    <div v-for="(input,index)  in com_filters[indx].values" :key="input.name"
                         class="col-lg-4 mb-2 mb-lg-3">
                      <form-radio
                        :id="`${input.name}-box-${index}`"
                        v-model="form[item.search_key]"
                        :disabled="isModerator"
                        :input-name="getKey(item)"
                        :invalid="hasError(item)"
                        :label="input.name[locale] || $t(input.name)"
                        :radio-value="$notUndefined(input.id,input.key)"
                      />
                    </div>
                  </div>

                </div>


                <!--                comment-->
                <div class="row">
                  <div class="col-12">
                    <title-with-line-and-reject-reason no-approval title="comment"/>
                  </div>
                  <div class="col-12 col-lg-8">
                    <form-textarea v-model="form.comment" :disabled="isModerator"/>
                  </div>
                </div>
              </div>
            </transition-expand>
          </div>
        </div>
      </section>


      <!-------------------------------ACTIONS---------------------------------->
      <!--      actions-->
      <moderator-actions
        :id="single_announce.id"
        :announcement="form"
        :button_loading="button_loading"
        :imageCount="imagesBase64.length"
        :notValid="notValid"
        :rejectArray="rejectArray"
        :saved-images="saved_images"
        :single_announce="single_announce"
        type="commercial"
        @formChanged="(e) => (form = e)"
        @handleLoading="handleLoading"
        @openTransferModal="transferModal = true"
        @sendData="sendData"
        @transferToSupervisor="transferToSupervisor"
      />


    </div>
    <!----------------------------------------Announce------------------------------------------------------------------------------------------------------------------------------------------->
    <!----------------------------------------Announce------------------------------------------------------------------------------------------------------------------------------------------->

    <!--    logs-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('logs')}`"
      :toggle="openLog"
      @close="openLog = false"
    >
      <change-log
        :btl="single_announce.btl_announces"
        :logs="single_announce.change_log"
        :user-id="single_announce.user_id"
      />
    </modal-popup>
    <!--    transfer modal 1-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('transfer_comment')}`"
      :toggle="transferModal"
      closeable
      @close="transferModal = false"
    >
      <div class="body">
        <textarea
          key="ma-moderation-comment-2"
          v-model="transferComment"
          :placeholder="$t('transfer_comment')"
          class="ma-input"
        />
        <div class="row justify-content-center">
          <button
            :class="{'pending':button_loading, 'disabled': (transferComment == '' || notValid)}"
            :disabled="notValid || (transferComment == null) || (transferComment === '')"
            class="btn btn--green  mt-1"
            @click.prevent="transferToSupervisor()"
          >
            {{ $t('transfer_to_supervisor') }}
          </button>
        </div>
      </div>
    </modal-popup>
  </div>
</template>


<script>
import {mapActions, mapGetters} from "vuex";
import UserDetails from '~/components/moderator/brand.vue'
import MultiselectComponent from '~/components/moderator/multiselectComponent.vue'
import RejectReason from '~/components/moderator/rejectReason'
import PhotoRejectReason from "~/pages/moderator/photoReject/PhotoRejectReason";
import UploadImageModerator from '~/components/moderator/UploadImageModerator'
import PopularComments from '~/components/moderator/popularComments'
import ColorOptions from '~/components/options/ColorOptions'
import PickOnMapButton from '~/components/elements/PickOnMapButton'
import moment from "moment";
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'
import SellFilters from '~/components/sell/SellFilters'
import TitleWithLine from "~/components/global/titleWithLine";
import FormRadioGroup from "~/components/forms/FormRadioGroup";
import SellLastStep from '~/components/sell/SellLastStep';
import ChangeLog from "~/components/moderator/changeLog";
import ModeratorActions from '~/components/moderator/actions.vue';
import showComment from '~/components/moderator/showComment'

export default {

  name: 'commercial-pages-moderation',

  layout: 'moderator',

  components: {
    TitleWithLine,
    UserDetails,
    TitleWithLineAndRejectReason,
    MultiselectComponent,
    RejectReason,
    PhotoRejectReason,
    UploadImageModerator,
    ColorOptions,
    PickOnMapButton,
    SellLastStep,
    SellFilters,
    PopularComments,
    FormRadioGroup,
    ChangeLog,
    ModeratorActions,
    showComment,
  },


  async fetch({store, route}) {
    await store.dispatch('getCommercialAllOptions');
    await store.dispatch('getCommercialTypes');
    await store.dispatch('getOptions');
    await store.dispatch('getAllOtherOptions');
    await store.dispatch('getColors');
    await store.dispatch('getBadges');
  },

  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  async asyncData({store, $axios, $auth, route}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`);
    const admin_user = await $axios.$get('/user');
    if (!admin_user.user.is_admin) {
      return false;
    }
    let _return = false;
    let data = {};
    try {
      data = await $axios.$get('/ticket/commercial');
      store.commit('moderator/moderatorMutator', {
        with: data.announce,
        property: 'single_announce',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.moderator,
        property: 'moderator',
      })

      store.commit('moderator/moderatorMutator', {
        with: data.moderator,
        property: 'moderator',
      })

      if (!store.getters.single_announce.id) return;

      await store.dispatch('getCommercialFilters', data.announce.commercial_type_id);

      await store.dispatch('getCommercialBrands', {category: data.announce.commercial_type_id});
      await store.dispatch('getCommercialModels', {
        index: 0,
        type: data.announce.commercial_type_id,
        id: data.announce.commercial_brand.id
      })


      return {
        com_cat: data.announce.commercial_type_id,
        brand: data.announce.commercial_brand.id,
        model: data.announce.commercial_model.id,
        year: data.announce.year,
        old_year: data.announce.year,
        old_brand: data.announce.commercial_brand.name,
        old_model: data.announce.commercial_model.name,
        old_category: data.announce.commercial_type_id,
        admin_user: admin_user.user,
        moderator: data ? data.moderator : {},
      }
    } catch (e) {
      store.commit('moderator/moderatorMutator', {
        with: data.announce,
        property: 'single_announce',
      })

      return {
        admin_user: admin_user.user,
        moderator: data ? data.moderator : {},
      }
    }

  },
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  data() {
    return {
      imageIsUploading: false,
      loading: false,
      button_loading: false,
      openLog: false,
      transferModal: false,
      transferComment: '',
      announceId: false,
      rejectArray: [],
      refresh: 1,
      date: Math.floor(Date.now() / 1000),
      saved_images: [],
      popup: false,
      deleteArr: [],
      errors: [],
      progress_width: 0,
      progress_index: 0,
      color_selected: 0,
      price_selected: 0,
      status_selected: 0,
      complect_selected: 0,
      desc_selected: 0,
      images_selected: 0,

      progress: [this.$t('make_and_model'), this.$t('photo_and_video'), this.$t('color_and_mileage'), this.$t('price_and_contacts'), this.$t('condition'), this.$t('equipment'), this.$t('description')],
      mmm: '',
      cookie_keys: ['engine', 'generation', 'year'],
      breadcrumbs: [],
      show: {},
      category: "1",
      address: '',
      selectedIndex: {},
      option_toggle: 1,
      cars_parts: [
        {
          name: this.$t('front_bamp'),
          classes: 'state__front'
        },
        {
          name: this.$t('front_left_door'),
          classes: 'state__FrontLeftDoor'
        },
        {
          name: this.$t('back_right_door'),
          classes: 'state__FrontRearRight'
        },
        {
          name: this.$t('front_right_door'),
          classes: 'state__FrontRightDoor'
        },
        {
          name: this.$t('back_left_door'),
          classes: 'state__FrontRearLeft'
        },
        {
          name: this.$t('roof'),
          classes: 'state__roof'
        },
        {
          name: this.$t('back_bamp'),
          classes: 'state__rear'
        },
      ],
      titles: [
        this.$t('overview'),
        this.$t('exterior_elements'),
        this.$t('theif_protection'),
        this.$t('multimedia'),
        this.$t('salon'),
        this.$t('comfort'),
        this.$t('safety'),
        this.$t('other')
      ],
      selectedBadges: [],
      modalIsActive: false,
      files: {},
      imagesBase64: [],
      form: {
        capacity: null,
        com_cat: null,
        auction: '',
        end_date: '',
        country_id: '',
        delay_comment: '',
        brand: null,
        bulldozer_type_id: "",
        bus_type_id: "",
        cabin_type_id: "",
        address: '',
        lat: '',
        comment: '',
        lng: '',
        tradeable: 0,
        beaten: 0,
        guaranty: 0,
        category: '1',
        volume: '',
        power: '',
        car_number: '',
        show_car_number: false,
        show_vin: false,
        selectedColor: '',
        all_options: {},
        badges: {},
        region_id: '',
        year: '',
        month: '',
        mileage: '',
        is_new: 0,
        customs_clearance: 0,
        passport: 0,
        vin: '',
        number_of_vehicles: -1,
        cylinders: -1,
        cylinder_placement: -1,
        drive: -1,
        engine: -1,
        used_ones: -1,
        customed_ones: -1,
        box: -1,
        price: '',
        new_badges: [],
        owner_type: null,
        currency: 0,
        youtube: {
          id: '',
          thumb: ''
        },
        saved_images: [],
        fuel_type: null,
        is_autosalon: false,
        mileage_measure: 0,
        selectedYear: null,
        btl_cookie: "",
        credit: false,
        media: [],
        email: "",
        excavator_type_id: '',
        forklift_type_id: "",
        gear_id: null,
        machinery_type_id: "",
        model: null,
        phone_number: "",
        seat_counts: '',
        trailer_type_id: "",
        truck_type_id: "",
        utility_type_id: "",
        wheel_formula: "",
        construction_type_id: "",
        name: "",
      },
      showPhotoReject: false,
      minFiles: this.$route.query.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      readCarNumberDisclaimer: false,
      collapsed: true,
      admin_user: {},
      rejectObj: {
        rejectArray: [],
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
      },
      showLastStep: false,
      lastStepKey: 132,

    }
  },

  async created() {
    this.admin_user = await this.$axios.$get('/user');
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)


    if (this.single_announce.id) {
      let announce = JSON.parse(JSON.stringify(this.single_announce));
      this.form.end_date = announce.end_date;
      this.form.auction = announce.auction;
      this.form.country_id = announce.country_id;
      this.announceId = announce.id;
      this.saved_images = announce.mediaIds;
      this.form.id = announce.id;
      this.form.id_unique = announce.id_unique;
      this.form.selectedColor = announce.color_id;
      this.form.is_new = announce.is_new;
      this.form.mileage = announce.mileage;
      this.form.address = announce.address;
      this.form.beaten = announce.beaten;

      this.form.customs_clearance = announce.customed;
      this.form.region_id = announce.region_id;
      this.form.lat = parseFloat(announce.latitude);
      this.form.lng = parseFloat(announce.longitude);
      this.form.price = this.numericPrice();
      this.form.currency = announce.currency_id;
      this.form.tradeable = announce.tradeable;
      this.form.passport = announce.passport;
      this.form.owner_type = announce.owner.toString() || '0';
      this.form.guaranty = announce.guaranty;
      this.form.car_number = announce.car_number;
      this.form.show_car_number = announce.show_car_number;
      this.form.show_vin = announce.show_vin;
      this.form.vin = announce.vin;
      this.form.power = announce.power ? Number(announce.power) : 0;
      this.form.capacity = parseInt(announce.capacity)
      this.form.comment = announce.comment;
      this.form.sell_store = announce.store_id;
      this.form.commercial_type_id = announce.commercial_type_id;
      this.form.brand = announce.commercial_brand_id;
      this.form.model = announce.commercial_model_id;
      this.form.year = announce.year;
      this.form.mileage_measure = announce.mileage_measure;
      if (announce.youtube_id) this.getYoutube(announce.youtube_id)
      this.com_filters.map((item) => {
        let value = announce[item.search_key];
        this.$set(this.form, item.search_key, value);
      });

    }
  },


  beforeDestroy() {

    this.$toasted.clear();
  },

  methods: {
    ...mapActions([
      'setSellPreviewData',
    ]),
    handleLoading(e) {
      this.loading = e;
    },
    nonRequiredField(item) {
      if (!item.required && item.component_add === 'any-type-selector')
        return [...item.values, {'key': null, 'name': this.$t('not_set')}];
    },
    updateSellFilter(key, value) {
      if (value === '')
        this.$delete(this.form, key);
      else this.$set(this.form, key, value);
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/' + this.announceId + '/commercials')
      location.href = '/alvcp/resources/commercials';
    },
    handleBackList() {
      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/announcements';
      }
    },
    ifPopularCommentsEmpty() {
      return _.isEmpty(this.getPopularComments);
    },
    getValue(key, value) {
      if (key === 'status') {
        let status = [this.$t('rejected'), this.$t('active'), this.$t('pending')];
        return status[value];
      } else {
        return value;
      }
    },
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.imageModal.isOpen = true
      } else if (rejectKey === '360') {
        this.rejectObj.show360Reject = true
      } else {
        if (this.rejectArray.includes(rejectKey)) {
          this.rejectArray.splice(this.rejectArray.indexOf(rejectKey), 1)
        } else {
          this.rejectArray.push(rejectKey)
        }
      }
    },
    removeBagde(badgeId) {
      for (let key in this.selectedBadges) {
        if (this.selectedBadges[key] === badgeId) {
          this.selectedBadges.splice(key, 1);
        }
      }

      for (let key in this.form.badges) {
        if (this.form.badges[key] === badgeId) {
          delete this.form.badges[key];
        }
      }
    },
    addComment(e) {
      if (this.form.comment === null) this.form.comment = '';
      this.form.comment = this.form.comment + e + ' ';
    },
    numericPrice() {
      return this.single_announce.price.replace(/\D/g, '');
    },
    isInvalid(field) {
      return this.errors.includes(field);
    },
    removeFromError(type) {
      var index = this.errors.indexOf(type);
      if (index !== -1) this.errors.splice(index, 1);
    },
    async deleteByIndex(deleteIndex) {
      if (this.saved_images[deleteIndex]) {
        this.deleteArr.push(this.saved_images[deleteIndex])
      } else {
        await this.$axios.$post('/remove_temporary_image/' + this.saved_images[deleteIndex]);
      }
      this.saved_images.splice(deleteIndex, 1);
    },
    async addFiles(v) {
      this.imageIsUploading = true;
      await Promise.all(
        v.map(async (image) => {
          let formData = new FormData()
          formData.append('temp_id', this.date)
          formData.append('images[]', image);
          try {
            const data = await this.$axios.$post('/upload_temporary_images', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.imageIsUploading = false;
            this.saved_images = this.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images);
            this.$nuxt.$emit('remove_image_loading_by_index', this.saved_images.length);
          } catch ({response: {data: {data}}}) {
            this.$nuxt.$emit('remove_image_by_index', this.saved_images.length);
            this.$nuxt.$emit('remove_image_on_catch');
            this.imageIsUploading = false;
            this.errors = []
            this.$toasted.clear()
            Object.keys(data).map((key) => {
              this.$toasted.show(data[key], {type: 'error'});
            })
          }
        })
      )
    },
    progressing(i) {
      if (i === 0) this.progress_width = 0;
      else this.progress_width = (100 / 10) * i;
    },

    getOldYears(first, second) {
      let dates = [];
      for (let i = (new Date().getFullYear()); i >= 1900; i--) {
        dates.push(i);
      }
      return dates.slice(first, second);
      if (first === 11) {
        return dates.slice(first, dates.length);
      }
    },
    async handleChange(v, item = false) {

      /*if (item){
        this.$set(this.form,item,v);
        this.refresh +=15;
        return true;
      }*/

      switch (v.key) {
        case 'com_cat':
          this.com_cat = v.value.key;
          this.brand = 0;
          this.model = 0;
          this.year = 0;
          await this.$store.dispatch('getComBrands', {id: v.value.key})
          await this.$store.dispatch('getComFilters', v.value.key)
          this.$set(this.form, v.key, v.value.key);
          break;
        case 'brand':
          this.brand = v.value.key;
          this.model = 0;
          this.year = 0;
          await this.$store.dispatch('getComModels', {
            index: 0,
            type: this.com_cat,
            id: v.value.key
          });
          this.$set(this.form, v.key, v.value.key);
          break;
        case 'model':
          this.model = v.value.key;
          this.year = 0;
          this.$set(this.form, v.key, v.value.key);
          break;
        case 'year':
          this.year = v.value.key;
          this.$set(this.form, v.key, v.value.key);
          break;
      }
      if (!v.value) this.$set(this.form, item, v);

      this.refresh += 15;
    },
    Sections(col, items) {

      return items.slice(col * Math.ceil(items.length / 4), (col + 1) * Math.ceil(items.length / 4));
    },
    passBase64Images(val) {
      this.imagesBase64 = val;

    },

    getColor() {
      return this.colors.find(item => item.id === this.form.selectedColor);
    },
    deleteArrHandler(v) {
      this.deleteArr = v;
    },
    getAddress(address) {
      this.removeFromError('address')
      this.form.address = address;
      this.address = address;
    },
    getLatLng(latLng) {
      this.form.lat = latLng.lat;
      this.form.lng = latLng.lng;
      this.lat = latLng.lat;
      this.lng = latLng.lng;
    },
    closeModal() {
      this.modalIsActive = false;
    },
    openModal() {
      this.modalIsActive = true;
    },
    closePopup() {
      this.showPhotoReject = false;
      this.show = {};
    },
    savePhotoIssues(v) {
      var validCheckbox = true;
      Object.keys(v.data).map((key) => {
        if (this.rejectArray.includes(key)) {
          this.rejectArray.splice(this.rejectArray.indexOf(key), 1);
        }

        if (v.data[key]) {
          validCheckbox = false;
          this.rejectArray.push(key);
        }
      })

      this.$nuxt.$emit('image-checkbox-change', validCheckbox);
    },
    handleMultiselect(v) {
      this.removeFromError(v.key);
      this.form[v.key] = v.value.key;
    },

    handleAllOptions(v, key) {
      this.form[key] = v;
      this.changeProgressSingle('all_options')
    },

    showSellModal(index) {
      this.show = {};
      this.show[index] = index;
    },

    _can_upload_file(key) {
      let file = this.files[key];

      if (file.attempted || file.bad_size) {
        return false;
      }
      return true;
    },
    async transferToSupervisor(withRejectReason = false) {
      this.button_loading = true;

      if (withRejectReason) {
        this.transferComment = this.rejectArray;
      }

      await this.$axios.$post('/ticket/transfer/commercial/' + this.announceId, {comment: this.transferComment});

      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/commercials';
      }
    },
    //sendData
    //sendData
    //sendData
    async sendData(status = 2) {
      this.loading = false;
      if (this.saved_images.length !== this.imagesBase64.length) {
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {type: 'error'});
        return false;
      }

      let formData = new FormData();

      this.form.status = status;
      this.form.category = this.form.commercial_type_id;
      this.form.rejectArray = this.rejectArray;

      delete this.form.box;
      delete this.form.btl_cookie;
      delete this.form.com_cat;
      // delete this.form.commercial_type_id;
      delete this.form.credit;
      delete this.form.customed_ones;
      delete this.form.cylinder_placement;
      delete this.form.cylinders;
      delete this.form.drive;
      delete this.form.engine;
      delete this.form.fuel_type;
      delete this.form.is_autosalon;
      delete this.form.media;
      delete this.form.mileage_measure;
      delete this.form.number_of_vehicles;
      delete this.form.saved_images;
      delete this.form.selectedYear;
      delete this.form.used_ones;
      delete this.form.false;

      this.form.saved_images = this.saved_images;
      formData.append('data', JSON.stringify(this.form));
      formData.append('deletedImages', JSON.stringify(this.deleteArr));
      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/commercial/' + this.announceId,
          formData
        );

        if (this.user.admin_group == 2) {
          location.href = '/alvcp/resources/announce-moderators';
        } else {
          location.href = '/alvcp/resources/commercials';
        }

      } catch ({response: {data: {data}}}) {
        this.$nuxt.$emit('loading_status', false);
        this.button_loading = false;

        this.errors = [];
        this.$toasted.clear();
        Object.keys(data).reverse().map((key) => {
          this.errors.push(key);

          this.$toasted.show(data[key][0], {
            type: 'error',
            duration: 0,
            action: {
              text: 'Go to fix',
              onClick: (e, toastObject) => {
                if (document.querySelector('#' + key))
                  document.querySelector('#' + key).scrollIntoView({behavior: 'smooth', block: 'center'});
                toastObject.goAway(0);

              }
            }
          })
        })
      }
      // this.$router.push('/')
    },
    //sendData
    //sendData
    //sendData
    addImages(v) {
      this.files = v;

      this.$nuxt.$emit('progress_change', {type: 'images', count: Object.keys(this.files).length});
    },
    move(input, from, to) {
      let numberOfDeletedElm = 1;
      const elm = input.splice(from, numberOfDeletedElm)[0];
      numberOfDeletedElm = 0;
      input.splice(to, numberOfDeletedElm, elm);
    },
    replaceImage(object) {
      if (this.saved_images.length !== this.imagesBase64.length) return;
      this.imagesBase64 = object.images;
      this.move(this.saved_images, object.v.oldIndex, object.v.newIndex);
    },
    getChangeOption(v) {
      if (v) this.option_toggle = 0;
      else this.option_toggle = 1;
    },
    checkboxChanged(v) {
      let key = Object.keys(v)[0];
      this.form[key] = v[key];
      if (key === 'customs_clearance') this.form.car_number = '';
    },
    getCurrency(v) {
      this.form.currency = v.key;
    },
    addNewBadge(v) {
      this.selectedBadges.push(...v);
      this.form.new_badges = v;
    },
    changeBadge(v) {
      this.selectedBadges.push(...v);
      this.form.badges = v;
    },
    getChange(v, type) {

      this.form[type] = v;
      if (type === 'mileage' || type === 'selectedColor')
        this.changeProgress('mileage', 'selectedColor');
      if (type === 'price' || type === 'name')
        this.changeProgress('price', 'name');
    },
    changeProgressSingle(key) {
      let status = 0;
      if (Object.keys(this.form[key]).length) {
        status = 2;
      }
      this.$nuxt.$emit('progress_change', {type: key, count: status})
    },
    changeProgress(key1, key2) {
      let status = 0;

      if (this.form[key1]) {
        status = 1;

      }
      if (this.form[key2]) {
        status = 1;

      }
      if (this.form[key1] && this.form[key2]) {
        status = 2;

      }
      this.$nuxt.$emit('progress_change', {type: key1 + '_' + key2, count: status})
    },
    getYoutube(val) {
      this.form.youtube.id = val;
      this.form.youtube.thumb = `https://img.youtube.com/vi/${val}/hqdefault.jpg`
    },
    formatDate(dte) {
      return moment(dte).format('DD.MM.YYYY HH:mm')
    },
    updateAddress(address) {
      this.form.address = address
      this.removeError('address')
    },
    updateLatLng({lat, lng}) {
      this.form.lat = lat
      this.form.lng = lng
    },
    removeError(field, force = false) {
      if (!force && (!this.form[field] || this.form[field] === '')) return;
      if (this.errors.includes(field)) {
        this.errors = this.errors.filter(key => key !== field);
        this.toasts[field].goAway(100);

      }
    },
    updatePreview(key) {
      if (!key || key === 'region')
        this.setSellPreviewData({
          value: this.form.region_id,
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


    showCarNumberDisclaimer() {
      if (this.readCarNumberDisclaimer) {
        this.$nuxt.$emit('close-popover', 'car-number')
      } else {
        this.$nuxt.$emit('show-popover', 'car-number')
        this.readCarNumberDisclaimer = true
      }
    },
    hasError(item) {
      let field = this.getKey(item);
      return this.errors.includes(field);
    },
    getKey(item) {
      return item.search_key || item.field;
    },
    async handleCategoryChange(e) {
      if (this.form.commercial_type_id) {

        await this.$store.dispatch('getCommercialBrands', {category: this.form.commercial_type_id})
        this.form.brand = null;
        this.form.model = null;
      } else return
    },
    async handleBrandChange(e) {
      await this.$store.dispatch('getCommercialModels', {
        index: 0,
        category: this.form.commercial_type_id,
        id: this.form.brand,
      })
      this.form.model = null;
    },

  },

  computed: {
    ...mapGetters({
      com_filters: 'commercialFilters',
      com_all_options: 'commercialAllOptions',
      colors: 'colors',
      com_brands: 'commercialBrands',
      com_models: 'commercialModels',
      commercial_types: 'commercialTypes',
      single_announce: 'moderator/single_announce',
      sell_options: 'sellOptions',
      all_sell_options: 'allSellOptions',
      badges: 'badges',
      moderator: 'moderator/moderator',
      getPopularComments: 'getPopularComments',
    }),
    isAdmin() {
      return (this.user.admin_group == 1 || this.user.admin_group == 2)
    },
    isModerator() {
      return this.user.admin_group && (this.user.admin_group == 2);
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
    getBtlUserName() {
      return this.single_announce.btl_announces.length ? this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name : ''
    },
    getBrands() {
      let dates = [];
      for (const key in this.com_brands) {
        dates.push({
          key: this.com_brands[key].id,
          name: this.com_brands[key]?.name || '',
        });
      }
      return dates;
    },
    getModels() {
      let dates = [];
      for (const key in this.com_models[0]) {
        dates.push({
          key: this.com_models[0][key].id,
          name: this.com_models[0][key].name,
        });
      }
      return dates;
    },
    getYears() {
      let dates = [];
      for (let i = new Date().getFullYear(); i >= 1900; i--) {
        dates.push({
          key: i,
          name: i,
        });
      }
      return dates;
    },
    getCategory() {
      let dates = [];
      for (const key in this.commercial_types) {
        dates.push({
          key: this.commercial_types[key].id,
          name: this.commercial_types[key].name,
        });
      }
      return dates;
    },
    getOldCategory() {
      return this.getCategory.find(item => item.key === this.old_category)
    },
    item() {
      return {
        ...this.form,
        color: this.getColor(),
        car_catalog: {
          brand: this.single_announce.commercial_brand,
          model: this.single_announce.commercial_model,
          comm_options: this.sell_options
        },
        commercial_types: this.commercial_types,
        com_filters: this.com_filters,
        com_all_options: this.com_all_options,
        commercial_type: this.single_announce.commercial_type,
      };
    },
    sumItems() {
      return (this.color_selected +
        this.price_selected +
        this.status_selected +
        this.complect_selected +
        this.desc_selected +
        this.images_selected) || 4
    },
    semiActiveModel() {
      let el = this.form.selectedBrand;

      if (el && !this.form.selectedModel) {
        this.progressing(1 / 2);
        return true;
      } else if (!el) {
        this.progressing(0);
        return false;
      }
      return el;
    },
    exactlyActiveModel() {
      let el = this.form.selectedBrand;

      if (el && this.form.selectedModel) {
        this.progressing(1);
        return true;
      }
      return false;
    },
    color() {
      return this.getColor();
    },
    crumbs() {
      return [
        {name: this.$t('moderation'), route: '/'},
      ]
    },
    type() {
      if (this.single_announce) {
        return this.single_announce.commercial_type.name.az || this.single_announce.commercial_type.name.ru || ""
      } else return ""
    },
    notValid() {
      if (
        !this.form.commercial_type_id ||
        !this.form.brand ||
        !this.form.model ||
        !this.form.year
      ) return true
      else return false
    },
  },


  mounted() {
    if (Object.keys(this.single_announce).length !== 0) {
      this.$store.dispatch('getCommercialBrands', {category: this.single_announce.commercial_type_id});
      this.$store.dispatch('getCommercialBrands', {category: this.single_announce.commercial_type_id});
      this.$store.dispatch('getCommercialModels', {
        index: 0,
        category: this.single_announce.commercial_type_id,
        id: this.single_announce.commercial_brand.id
      })
      this.$store.dispatch('getCommercialFilters', this.single_announce.commercial_type_id);
    }
    ;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000)
  },

  watch: {
    'form.is_new': {
      deep: true,
      handler() {
        if (this.form.is_new) {
          this.form.mileage = 0;
        }
      }
    }
  }

}
</script>


