<template>
  <div class="container">
    <!--    breadcrumbs-->
    <breadcrumbs id="brdcrmbsTicketParts" :crumbs="crumbs"/>
    <!--    loading-->
    <div v-if="loading">
      <elements-loader></elements-loader>
    </div>


    <!--    ANNOUNCE-->
    <div v-else-if="single_announce && single_announce.id && !loading" class="card w-100">
      <!--        userdata-->
      <section class="row">
        <div class="col-12 col-md-6 col-lg-9">
          <user-details
            :createdAt="single_announce.created_at"
            :is-autosalon="single_announce.is_autosalon"
            :is-external-salon="single_announce.is_external_salon"
            :userData="single_announce.user"
          />
        </div>
        <div v-if="single_announce.change_log && single_announce.change_log.length && (user.admin_group !== 2)"
             class="col-12 col-lg-3 d-flex justify-content-end">
          <button
            :class="{ pending: button_loading }"
            class="'btn btn--green"
            @click.prevent="openLog = true"
          >
            {{ $t('show_logs') }}
          </button>
        </div>
      </section>

      <!--      general info-->
      <section class="row mb-4">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :no-approval="!isAdmin"
            title="general_informations"
            @change="changeReason"
          />
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <label>{{ $t('product_code') }}</label>
          <form-text-input v-model="form.product_code" :disabled="isModerator" :placeholder="$t('product_code')"/>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <label>{{ $t('headline') }}</label>
          <form-text-input v-model="form.title" :disabled="isModerator" :maxlength="25"
                           :placeholder="$t('title_max_character', { max: 25 })"/>
        </div>
        <div class="col-12 mt-3">
          <label>{{ $t('description_placeholder_part') }}</label>
          <form-textarea v-model="form.description" :disabled="isModerator" :maxlength="3000"
                         :placeholder="$t('description_placeholder_part')"/>
        </div>
        <div class="col-12">
          <small class="px-2">
            {{ $t('sell_parts_description_warning') }}
          </small>
        </div>
      </section>


      <!--      special filters-->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <h2 id="anchor-specification" class="title-with-line mt-3 mt-lg-0">
        <span>
          {{ $t('parts') }}
          <span class="star">*</span>
        </span>
      </h2>
      <div class="row">
        <!-- Category -->
        <div v-if="categories && categories.length" id="anchor-category_id"
             class="col-lg-4 mb-3 mb-lg-0">
          <form-select
            v-model="form.category_id"
            :allow-clear="false"
            :clear-option="false"
            :disabled="isModerator"
            :invalid="isInvalid('category_id')"
            :label="$t('category')"
            :options="categories"
            @change="
              categorySelected($event),
                removeError('category_id'),
                (form.commercial_part = false)
            "
          />
        </div>
        <!-- Subcategory -->
        <div
          v-if="filter_data.sub_categories && filter_data.sub_categories.length"
          id="anchor-sub_category_id"
          class="col-lg-4 mb-3 mb-lg-0"
        >
          <form-select
            v-model="form.sub_category_id"
            :allow-clear="false"
            :clear-option="false"
            :disabled="isModerator"
            :invalid="isInvalid('sub_category')"
            :label="$t('sub_category')"
            :options="filter_data.sub_categories.map((o) => ({
                name: o.name,
                key: o.id,
              }))"
            @change="removeError('sub_category')"
          />
        </div>

        <!-- Brand -->
        <div
          v-if="filter_data.brands && filter_data.brands.length"
          id="anchor-brand_id"
          class="col-lg-4 mb-3 mb-lg-0"
        >
          <form-select
            v-model="form.brand_id"
            :allow-clear="false"
            :clear-option="false"
            :disabled="isModerator"
            :invalid="isInvalid('brand_id')"
            :label="$t('select_brand')"
            :options="[{ id: 0, name: $t('other') }, ...brands]"
            has-search
            @change="removeError('brand_id')"
          />
        </div>
        <div
          v-if="[19, 20].includes(form.category_id)"
          class="col-lg-4 mb-3 mb-lg-0"
        >
          <form-checkbox
            id="commercial_part"
            v-model="form.commercial_part"
            :checked-value="form.commercial_part"
            :disabled="isModerator"
            :label="$t('commercial_part')"
            @change="!$event ? (form.commercial_size = '') : ''"
          />
        </div>
        <div v-if="form.category_id" class="col-12 mt-3">
          <div class="row">
            <!-- Condition -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                id="anchor-is_new"
                v-model="form.is_new"
                :disabled="isModerator"
                :group-by="2"
                :invalid="isInvalid('is_new')"
                :label="`${$t('new')}/${$t('S_H')}`"
                :options="conditionButtons"
                btn-class="primary-outline"
                @change="removeError('is_new')"
              />
            </div>

            <!-- Originality -->
            <div class="col-lg-4 mb-3">
              <form-buttons
                id="anchor-is_original"
                v-model="form.is_original"
                :disabled="isModerator"
                :group-by="2"
                :invalid="isInvalid('is_original')"
                :label="`${$t('original')}/${$t('duplicate')}`"
                :options="originalityButtons"
                btn-class="primary-outline"
                @change="removeError('is_original')"
              />
            </div>


            <!-- Dynamic filters -->
            <div
              v-for="filter in dynamicFilters"
              v-if="
                form.commercial_part
                  ? !commercialPartDisabledOptions.includes(filter.key)
                  : true
              "
              :id="'anchor-' + filter.key"
              :key="'filter-' + filter.id"
              class="col-lg-4 mb-3"
            >
              <label>{{ $t(filter.key) }}</label>
              <!-- Select -->
              <form-select
                v-if="filter.component === 'multiselect-component'"
                v-model="form.filter[filter.key]"
                :allow-clear="false"
                :clear-option="!filter.is_required"
                :disabled="isModerator"
                :invalid="isInvalid(filter.key)"
                :label="$t(filter.key)"
                :options="filter.values"
                :translateOptions="(typeof filter.values[0].name !== 'number')"
                has-search
                @change="
                  removeError(filter.key),
                    dynamicFilterOnChange(filter.key, $event)
                "
              />


              <!-- Checkbox -->
              <form-checkbox
                v-if="filter.component === 'checkbox-component'"
                :id="filter.key"
                v-model="form.filter[filter.key]"
                :checked-value="form.filter[filter.key]"
                :disabled="isModerator"
                :invalid="isInvalid(filter.key)"
                :label="$t(filter.key)"
                @change="removeError(filter.key)"
              />

              <!-- Input -->
              <form-numeric-input
                v-if="filter.component === 'filter-single-input'"
                v-model="form.filter[filter.key]"
                :disabled="isModerator"
                :invalid="isInvalid(filter.key)"
                :placeholder="
                  $t(
                    filter.key === 'capacity' ? 'battery_capacity' : filter.key,
                  )
                "
                @change="removeError(filter.key)"
                @input="
                  ;(form[filter.key] = String($event)),
                    dynamicFilterOnChange(filter.key, $event)
                "
              />
            </div>
            <div
              v-if="form.commercial_part"
              id="anchor-commercial_size"
              class="col-lg-4 mb-3"
              style="align-items: center;"
            >
              <form-text-input
                v-model="form.commercial_size"
                :clear-option="false"
                :disabled="isModerator"
                :invalid="isInvalid('commercial_size')"
                :maxlength="50"
                :placeholder="$t('commercial_size')"
                @change="removeError('commercial_size')"
              />
            </div>
            <!-- Price -->
            <div class="col-12 mb-3">
              <div class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    no-approval
                    title="price"
                    @change="changeReason"
                  />
                </div>
                <div class="col-auto">
                  <form-price-input
                    id="anchor-price"
                    v-model="form.price"
                    :disabled="isModerator"
                    :invalid="isInvalid('price')"
                    :maxlength="5"
                    :placeholder="$t('price')"
                    float
                    @change="removeError('price')"
                  />
                </div>
                <div class="col-auto">
                  <form-switch
                    v-model="form.currency_id"
                    :disabled="isModerator"
                    :options="getCurrencyOptions"
                    @change="updatePreview('currency')"
                  />
                </div>
                <div class="col-auto">
                  <form-checkbox
                    id="anchor-is_negotiable"
                    v-model="form.is_negotiable"
                    :disabled="isModerator"
                    :invalid="isInvalid('is_negotiable')"
                    :label="$t('is_negotiable')"
                    checked-value="is_negotiable"
                    @change=" changeIsNegotiable($event), removeError('is_negotiable')"
                  />
                </div>
                <!-- Commercial Size -->
                <div class="col-auto">

                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="row">

                <div class="col-12">
                  <title-with-line-and-reject-reason
                    no-approval
                    title="region"
                    @change="changeReason"
                  />
                </div>

                <!-- Region -->
                <div
                  v-if="regions.length"
                  id="anchor-region_id"
                  class="col-lg-4 mb-3"
                >
                  <form-select
                    v-model="form.region_id"
                    :allow-clear="false"
                    :clear-option="false"
                    :disabled="isModerator"
                    :invalid="isInvalid('region_id')"
                    :label="$t('region')"
                    :options="regions"
                    has-search
                    @change="removeError('region_id')"
                  />
                </div>

                <!-- Delivery -->
                <div class="col-lg-4 mb-3">
                  <form-checkbox
                    id="anchor-have_delivery"
                    v-model="form.have_delivery"
                    :disabled="isModerator"
                    :invalid="isInvalid('have_delivery')"
                    :label="$t('have_delivery')"
                    checked-value="delivery"
                    @change="removeError('have_delivery')"
                  />
                </div>

                <!-- Warranty -->
                <div class="col-lg-4 mb-3">
                  <form-checkbox
                    id="anchor-have_warranty"
                    v-model="form.have_warranty"
                    :disabled="isModerator"
                    :invalid="isInvalid('have_warranty')"
                    :label="$t('have_warranty')"
                    checked-value="warranty"
                    @change="removeError('have_warranty')"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="col-12">
          <form-keywords-moderator v-model="form.tags" :disabled="isModerator" class="w-100" is-moderator/>
        </div>

        <div class="col-12">
          <p class="px-2">
            {{ $t('sell_parts_keywords_info') }}
          </p>
        </div>
      </div>
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->
      <!--      -------------------------------------------------------------------------------------------------------------------------------------->

      <!--      image-->
      <section class="row">
        <div class="col-12">
          <title-with-line-and-reject-reason
            :subtitle="
                      $t('at_least_5_photos', {
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
              type="part"
              @close="imageModal.isOpen = false"
              @save="savePhotoIssues"
            />
          </transition>
        </div>
        <div class="col-12 pl-2">
          <upload-image-moderator
            :announce="single_announce"
            :changePosition="saved_images.length === imagesBase64.length"
            :default-images="single_announce.media"
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
            @delete="removeImage"
            @deletedIndex="deleteByIndex"
            @passBase64Images="passBase64Images"
            @replaceImage="replaceImage"
          />
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
        type="part"
        @formChanged="(e) => (form = e)"
        @handleLoading="handleLoading"
        @openTransferModal="transferModal = true"
        @sendData="sendData"
        @transferToSupervisor="transferToSupervisor"
      />

    </div>
    <!--    EMPTY Announce-->

    <div v-else>
      <div style="text-align: center">
        <br><br>
        <h2>{{ $t('Baxılmayanlar mövcud deyil') }} {{ $route.query.type }}</h2>
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
    <!--    logs-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('logs')}`"
      :toggle="(user.admin_group !== 2) && openLog"
      @close="openLog = false"
    >
      <template v-if="single_announce && single_announce.btl_announces">
        <change-log
          :btl="single_announce.btl_announces"
          :logs="single_announce.change_log"
          :user-id="single_announce.user_id"
        />
      </template>
    </modal-popup>
    <!--    transfer modal-->
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
import FormKeywordsModerator from '~/components/moderator/FormKeywordsModerator'
import ChangeLog from "~/components/moderator/changeLog";
import ModeratorActions from '~/components/moderator/actions.vue'

export default {

  name: 'parts-pages-moderation',

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
    SellFilters,
    PopularComments,
    FormRadioGroup,
    ChangeLog,
    ModeratorActions,
    FormKeywordsModerator
  },


  data() {
    return {
      imageIsUploading: false,
      loading: false,
      button_loading: false,
      openLog: false,
      transferModal: false,
      transferComment: '',
      rejectArray: [],
      refresh: 1,
      date: Math.floor(Date.now() / 1000),
      popup: false,
      deleteArr: [],
      errors: [],
      selectedBadges: [],
      modalIsActive: false,
      files: {},
      showStoreSelect: false,

      filter_data: {
        brands: [],
        filters: [],
        regions: [],
        sub_categories: []
      },
      tag: '',
      tags: [],
      saved_images: [],
      showPhotoReject: false,
      form: {
        category_id: null,
        commercial_part: false,
        rejectArray: [],
        tags: [],
        delay_comment: '',
        sub_category_id: null,
        region_id: null,
        brand_id: null,
        is_new: false,
        is_original: false,
        is_negotiable: false,
        have_delivery: false,
        have_warranty: false,
        price: null,
        product_code: '',
        title: '',
        description: '',
        filter: {},
        media: [],
        saved_images: [],
        currency_id: 1,
      },
      newForm: {},
      announceId: null,
      admin_user: {},
      imagesBase64: [],
      commercialPartDisabledOptions: [
        'diameter',
        'height',
        'shine_width',
        'run_flat',
      ],
      //  image
      minFiles: 1,
      maxFiles: 20,
      imageModal: {
        isOpen: false,
        options: [
          "part_photo_reject_1",
          "part_photo_reject_2",
          "part_photo_reject_3",
          "part_photo_reject_4",
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
      category: {
        selected: {},
        hasChild: false,
      }
    }
  },

  async created() {
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)


  },

  beforeDestroy() {
    this.$toasted.clear();
  },

  methods: {

    changeIsNegotiable(e) {
      if (e == true) {
        this.form.price = 0;
      }
    },
    handleLoading(e) {
      this.loading = e;
    },
    async getAnnounceData() {
      this.loading = true;
      await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);

      const admin_user = await this.$axios.$get('/user');

      if (!admin_user.user.is_admin) {
        return false;
      }

      let data;

      try {
        this.loading = true;
        data = await this.$axios.$get('/ticket/part');
        this.$store.commit('mutate', {
          property: 'single_announce',
          value: data.announce,
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.moderator,
          property: 'moderator',
        })


        const partCategories = await this.$axios.$get('/part/categories');

        this.$store.commit('mutate', {
          property: 'partCategories',
          value: partCategories,
        })

        let announce = JSON.parse(JSON.stringify(this.single_announce));

        this.checkCategoryValidation(parseInt(announce.category_id))

        if (announce.category_id) {
          this.getFilters(announce.category_id)
          this.filter_data = this.getPartFilters(announce.category_id);
        }

        this.announceId = announce.id;
        this.form.delay_comment = "";
        this.form.category_id = parseInt(announce.category_id);
        this.form.sub_category_id = announce.sub_category_id;
        this.form.region_id = announce.region_id;
        this.form.brand_id = announce.brand_id;
        if (this.category.hasChild) {
          this.form.brand_id = null
        }
        this.form.is_new = announce.is_new;
        this.form.is_original = announce.is_original;
        this.form.is_negotiable = announce.is_negotiable;
        this.form.have_delivery = announce.have_delivery;
        this.form.have_warranty = announce.have_warranty;
        this.form.price = announce.price_int;
        this.form.product_code = announce.product_code;
        this.form.title = announce.title;
        this.form.description = announce.description;
        this.form.media = announce.mediaIds;
        this.form.saved_images = announce.mediaIds;
        this.form.commercial_part = parseInt(announce.commercial_size) > 0;
        this.form.commercial_size = announce.commercial_size;
        this.saved_images = announce.mediaIds;
        if (announce.filters) {
          this.form.filter = announce.filters
        }
        // this.form.tags = announce.all_tags.map(item => item.text);

        this.form.tags = announce.all_tags;


        // if (announce.filters) {
        //   for (let key in announce.filters) {
        //     this.form.filter[key] = announce.filters[key];
        //   }
        // }

        this.admin_user = admin_user.user;
        this.loading = false;


      } catch (e) {
        this.loading = false;
        return;
        this.$store.commit('mutate', {
          value: {},
          property: 'single_announce'
        })
      }
    },

    getPartFilters(id = this.form.category_id) {
      return this.$axios.$get(`/part/category/${id}/filters`)
    },

    handleCheck(object) {
      let key = Object.keys(object)[0]
      this.handleChange({
        key: key,
        value: {
          id: object[key]
        }
      })
    },
    handleInput(object) {
      this.handleCheck(object);
    },

    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/' + this.announceId + '/parts')
      location.href = '/alvcp/resources/parts';
    },
    handleBackList() {
      if (this.user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/announcements';
      }
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
      } else {
        if (this.rejectArray.includes(rejectKey)) {
          this.rejectArray.splice(this.rejectArray.indexOf(rejectKey), 1);
        } else {
          this.rejectArray.push(rejectKey);
        }
      }
    },
    addComment(e) {
      if (this.form.comment === null) this.form.comment = '';
      this.form.comment = this.form.comment + e + ' ';
    },
    numericPrice() {
      return this.single_announce.price_int;
    },

    removeFromError(type) {
      var index = this.errors.indexOf(type);
      if (index !== -1) this.errors.splice(index, 1);
    },
    async deleteByIndex(index) {
      if (this.saved_images[index]) {
        this.deleteArr.push(this.saved_images[index])
      } else {
        await this.$axios.$post(
          '/remove_temporary_image/' + this.saved_images[index],
        )
      }
      this.saved_images.splice(index, 1)
    },
    async addFiles(v) {
      this.imageIsUploading = true;
      await Promise.all(
        v.map(async (image) => {
          let formData = new FormData()
          formData.append('temp_id', this.date)
          formData.append('images[]', image)
          try {
            const data = await this.$axios.$post(
              '/upload_temporary_images',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
            this.imageIsUploading = false;
            this.saved_images = this.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images)
            this.$nuxt.$emit(
              'remove_image_loading_by_index',
              this.saved_images.length,
            )
          } catch ({
            response: {
              data: {data},
            },
          }) {
            this.imageIsUploading = false;
            this.$nuxt.$emit('remove_image_by_index', this.saved_images.length)
            this.$nuxt.$emit('remove_image_on_catch')
            this.errors = []
            this.$toasted.clear()
            Object.keys(data).map((key) => {
              this.$toasted.show(data[key], {type: 'error'})
            })
          }
        }),
      )
    },
    progressing(i) {
      if (i === 0) this.progress_width = 0;
      else this.progress_width = (100 / 10) * i;
    },
    async handleChange(object) {
      if (object.key === 'category_id') {
        const data = await this.$axios.$get(`/part/category/${object.value.id}/filters`)
        this.filter_data = data;
      }
      this.$set(this.form, object.key, object.value.id);
    },

    passBase64Images(val) {
      this.imagesBase64 = val
    },
    replaceImage(object) {
      if (this.saved_images.length !== this.imagesBase64.length) return
      this.imagesBase64 = object.images
      this.move(this.saved_images, object.v.oldIndex, object.v.newIndex)
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

      await this.$axios.$post('/ticket/transfer/part/' + this.announceId, {comment: this.transferComment});

      if (this.user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/parts';
      }
    },
    async sendData(status = 2) {
      if (this.saved_images.length !== this.imagesBase64.length) {
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {
          type: 'error',
        })
        return false
      }
      for (const [key, value] of Object.entries(this.form.filter)) {
        this.form[key] = value;
      }
      let formData = new FormData();
      this.form.status = status;
      this.form.saved_images = this.saved_images;
      delete this.form['filter-undefined']
      formData.append('data', JSON.stringify(this.form));
      formData.append('deletedImages', JSON.stringify(this.deleteArr));
      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/part/' + this.announceId,
          formData
        );
        if (this.user.admin_group == 2) {
          location.href = '/alvcp/resources/announce-moderators';
        } else {
          location.href = '/alvcp/resources/parts';
        }
      } catch ({response: {data: {data}}}) {
        this.$nuxt.$emit('loading_status', false);
        this.button_loading = false;
        this.errors = [];
        this.$toasted.clear();
        if (data) {
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
        } else return
      }
      // this.$router.push('/')
    },
    addImages(v) {
      this.files = v
      this.getInfo()
      this.$nuxt.$emit('progress_change', {
        type: 'images',
        count: Object.keys(this.files).length,
      })
    },
    move(input, from, to) {
      let numberOfDeletedElm = 1;
      const elm = input.splice(from, numberOfDeletedElm)[0];
      numberOfDeletedElm = 0;
      input.splice(to, numberOfDeletedElm, elm);
    },


    //  --------------
    isInvalid(field) {
      return this.errors.includes(field);
    },
    removeError(field, force = false) {
      if (!force && (!this.form[field] || this.form[field] === "")) return;
      if (this.errors.includes(field)) {
        this.errors = this.errors.filter(key => key !== field);
        this.toasts[field].goAway(100);
      }
    },
    checkCategoryValidation(id) {
      this.categories.forEach(obj => {
        if (obj.id == id) {
          this.category.selected = obj;
          if (obj.child.length) {
            this.category.hasChild = true
          } else this.category.hasChild = false
        }
      })
    },
    categorySelected(id) {
      delete this.form.brand_id
      // delete this.form.sub_category_id
      this.checkCategoryValidation(id)
      this.form = {
        ...this.form,
        is_new: true,
        is_original: true,
        commercial_size: '',
      }

      if (this.filter_data.filters && this.filter_data.filters.length) {
        this.filter_data.filters.forEach((filter) => {
          delete this.form[filter.key]
        })
      }

      this.filter_data = {
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
      this.filter_data = await this.$axios.$get(
        `/part/category/${category_id}/filters`,
      )

      if (this.filter_data.sub_categories.length) {
        const value = this.filter_data.sub_categories.find(
          (c) => c.id === this.initialForm?.sub_category_id,
        )?.id
        // this.$set(this.form, 'sub_category_id', value || null)
      } else {
        // delete this.form.sub_category_id
      }

      if (this.filter_data.brands.length) {
        const value = this.filter_data.brands.find(
          (c) => c.id === this?.initialForm?.brand_id,
        )?.id
        // this.$set(this.form, 'brand_id', value || null)
      } else {
        // delete this.form.brand_id
      }

      const defaults = {
        'multiselect-component': '',
        'checkbox-component': false,
        'filter-single-input': '',
      }

      this.filter_data.filters.forEach((filter) => {
        if (!Object.keys(this.form).includes(filter.key)) {
          this.form[filter.key] = defaults[filter.component]
        }
      })
    },
    dynamicFilterOnChange(key, value) {
      this.form = {...this.form}

      if (this.errors.includes(key) && value) {
        this.errors = this.errors.filter((item) => item !== key)
      }
    },

    //image
    removeImage(v) {
      this.files = v
      this.$nuxt.$emit('progress_change', {
        type: 'images',
        count: Object.keys(this.files).length,
      })
      this.getInfo()
    },
    getInfo() {
      let i = -3
      Object.keys(this.form).map((key) => {
        if (typeof this.form[key] !== 'object') {
          if (this.form[key] !== '') {
            if (key !== 'currency') i++
          }
        } else {
          // if(Object.keys(this.form[key]).length) i++;
        }
      })
      if (this.files.length) i += 1

      this.$nuxt.$emit('progress_change', {type: 'all', count: i, all: 33})
    },
  },

  computed: {
    ...mapGetters({
      single_announce: 'single_announce',
      sell_options: 'sellOptions',
      all_sell_options: 'allSellOptions',
      partCategories: 'partCategories',
      moderator: 'moderator/moderator',
    }),
    notValid() {
      if (
        !this.form.title ||
        !this.form.category_id
        // || (this.category.hasChild && !this.form.sub_category_id)
        // || (!this.category.hasChild && !this.form.brand_id)
      ) {
        return true
      } else return false
    },
    crumbs() {
      return [
        {name: this.$t('moderation')},
      ]
    },
    isAdmin() {
      return (this.user.admin_group == 1 || this.user.admin_group == 2)
    },
    isModerator() {
      return this.user.admin_group && (this.user.admin_group == 2);
    },
    conditionButtons() {
      return [
        {
          key: true,
          name: this.$t('new'),
        },
        {
          key: false,
          name: this.$t('S_H'),
        },
      ]
    },
    originalityButtons() {
      return [
        {
          key: true,
          name: this.$t('original'),
        },
        {
          key: false,
          name: this.$t('duplicate'),
        },
      ]
    },
    dynamicFilters() {
      return this?.filter_data.filters || []
    },
    getCurrencyOptions() {
      return [
        {key: 1, name: 'AZN', sign: '₼'},
        {key: 2, name: 'USD', sign: '$'},
        {key: 3, name: 'EUR', sign: '€'},
      ]
    },
    regions() {
      return this?.filter_data?.regions || []
    },
    categories() {
      return this.$store.getters['parts/categories'].filter(
        (c) => c.show_on_form,
      )
    },
    brands() {
      return this?.filter_data?.brands || []
    },
  },

  mounted() {
    this.getAnnounceData();
    if (this.single_announce.category_id) {
      this.filter_data = this.getPartFilters();
    }
    if (this.single_announce.category_id) {
      this.getFilters(this.single_announce.category_id)
    }

  },

  async fetch() {
    await this.$store.dispatch('parts/getCategories')
  },


}
</script>

