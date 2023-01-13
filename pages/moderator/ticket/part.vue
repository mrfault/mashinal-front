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
        <div v-if="single_announce.change_log && single_announce.change_log.length"
             class="col-12 col-lg-3 d-flex justify-content-end">
          <button
            :class="{ button_loading: button_loading }"
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
          <form-text-input v-model="form.product_code" placeholder="product_code"/>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <form-text-input v-model="form.title" :placeholder="$t('title_max_character', { max: 25 })"/>
        </div>
        <div class="col-12 mt-3">
          <form-textarea v-model="form.description" :maxlength="3000"
                         placeholder="description_placeholder_part"/>
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
        <div v-if="partCategories && partCategories.length && form.category_id" id="anchor-category_id"
             class="col-lg-4 mb-3 mb-lg-0">
          <form-select
            v-model="form.category_id"
            :clear-option="false"
            :invalid="isInvalid('category_id')"
            :label="$t('category')"
            :options="partCategories.map((o) => ({
                name: o.name,
                key: o.id,
              }))"
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
            :clear-option="false"
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
            :clear-option="false"
            :invalid="isInvalid('brand_id')"
            :label="$t('select_brand')"
            :options="filter_data.brands.map((o) => ({
                name: o.name,
                key: o.id,
              }))"
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
              <pre>{{ filter[0] }}</pre>
              <!-- Select -->
              <form-select
                v-if="filter.component === 'multiselect-component'"
                v-model="form.filter[filter.key]"
                :clear-option="!filter.is_required"
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
                :invalid="isInvalid(filter.key)"
                :label="$t(filter.key)"
                @change="removeError(filter.key)"
              />

              <!-- Input -->
              <form-numeric-input
                v-if="filter.component === 'filter-single-input'"
                :invalid="isInvalid(filter.key)"
                :placeholder="
                  $t(
                    filter.key === 'capacity' ? 'battery_capacity' : filter.key,
                  )
                "
                :value="form.filter[Number(filter.key)]"
                @change="removeError(filter.key)"
                @input="
                  ;(form[filter.key] = String($event)),
                    dynamicFilterOnChange(filter.key, $event)
                "
              />
            </div>
            <!-- Price -->
            <div class="col-12 mb-3">
              <div class="row">
                <div class="col-auto">
                  <form-price-input
                    id="anchor-price"
                    v-model="form.price"
                    :invalid="isInvalid('price')"
                    :maxlength="9"
                    :placeholder="$t('price')"
                    float
                    @change="removeError('price')"
                  />
                </div>
                <div class="col-auto">
                  <form-switch
                    v-model="form.currency"
                    :options="getCurrencyOptions"
                    @change="updatePreview('currency')"
                  />
                </div>
                <div class="col-auto">
                  <form-checkbox
                    id="anchor-is_negotiable"
                    v-model="form.is_negotiable"
                    :invalid="isInvalid('is_negotiable')"
                    :label="$t('is_negotiable')"
                    checked-value="is_negotiable"
                    @change="
                  removeError('price', true), removeError('is_negotiable')
                "
                  />
                </div>
                <!-- Commercial Size -->
                <div class="col-auto">
                  <div
                    v-if="form.commercial_part"
                    id="anchor-commercial_size"
                    style="align-items: center;"
                  >
                    <form-text-input
                      v-model="form.commercial_size"
                      :clear-option="false"
                      :invalid="isInvalid('commercial_size')"
                      :maxlength="50"
                      :placeholder="$t('commercial_size')"
                      @change="removeError('commercial_size')"
                    />
                  </div>
                </div>
              </div>
            </div>


            <!-- Region -->
            <div
              v-if="regions.length"
              id="anchor-region_id"
              class="col-lg-4 mb-3"
            >
              <form-select
                v-model="form.region_id"
                :clear-option="false"
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
                :invalid="isInvalid('have_warranty')"
                :label="$t('have_warranty')"
                checked-value="warranty"
                @change="removeError('have_warranty')"
              />
            </div>
          </div>
        </div>

        <div class="col-12">
          <form-keywords v-model="form.tags" class="w-100"/>
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
                v-if="form.media.length"
                :disabled-value="true"
                rejectKey="image"
                @change="changeReason"
              />
            </div>

          </title-with-line-and-reject-reason>
          <transition name="fade">
            <photo-reject-reason
              v-if="imageModal.isOpen"
              :default_data="rejectObj.rejectArray"
              :modal__title="$t('image_reject_reason')"
              :type="'car'"
              @close="imageModal.isOpen = false"
              @save="savePhotoIssues"
            />
          </transition>
        </div>
        <upload-image-moderator
          :announce="single_announce"
          :changePosition="saved_images.length === imagesBase64.length"
          :default-images="single_announce.media"
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


      <!-------------------------------ACTIONS---------------------------------->
      <!--      actions-->
      <div class="row mt-5">
        <section v-if="user.admin_group === 1" class="container"> <!--supervisor-->
          <div class="row">
            <div class="col-12">
              <button v-if="rejectArray.length === 0" :class="{'button_loading':button_loading}"
                      class="btn btn--green w-50"

                      @click.prevent="sendData(1)">{{ $t('confirm') }}
              </button>
              <button :class="{'button_loading':button_loading}" class="btn btn--red w-50 ml-1"

                      @click.prevent="sendData(0)">{{ $t('reject') }}
              </button>
              <button :class="{'button_loading':button_loading}" class="btn btn--pale-red w-50 ml-1"

                      @click.prevent="sendData(3)"
              >
                {{ $t('deactive_announce') }}
              </button>
              <button class="btn btn--yellow w-50 ml-1" @click="handleBackToList">
                {{ $t('back_to_list') }}
              </button>
            </div>
          </div>
        </section>
        <section v-else-if="user.admin_group === 2" class="container"> <!--moderator-->
          <div class="row">
            <div class="col-6 col-lg-2">
            <span class="timer">
              {{ getTimer.data }}
            </span>
            </div>
            <div class="col-auto">
              <form-text-input v-if="getTimer.unix > 60*2" v-model="form.delay_comment"
                               :placeholder="$t('delay_comment')"
                               type="text"/>
            </div>

            <div class="col-auto">
            <span v-if="getTimer.unix < 60*2 || (getTimer.unix > 60*2 && form.delay_comment.length)">
              <button v-if="rejectArray.length === 0" :class="{'button_loading':button_loading}"
                      class="btn btn--green w-50"

                      @click.prevent="sendData(1)">{{ $t('confirm') }}</button>

              <!-- sendData(0) -->
              <button v-else :class="{'button_loading':button_loading}" class="btn btn--red w-50 ml-5"


                      @click.prevent="transferToSupervisor(true)">{{ $t('reject') }}</button>
            </span>

              <button :class="{'button_loading':button_loading}" class="btn btn--green w-50"

                      @click.prevent="transferModal = true">{{ $t('comment_to_supervisor') }}
              </button>
            </div>
          </div>
        </section>
        <section v-else-if="user.admin_group === 3" class="container"> <!--call center-->
          <div class="row">
            <div class="col-12">
              <button :class="{'button_loading':button_loading}" class="btn btn--green w-50"

                      @click.prevent="sendData(2)">{{ $t('send_to_moderate') }}
              </button>

              <button :class="{'button_loading':button_loading}" class="btn btn--pale-red w-50 ml-1"

                      @click.prevent="sendData(3)"
              >
                {{ $t('deactive_announce') }}
              </button>

              <button class="btn btn--yellow w-50 ml-1" @click="handleBackList">
                {{ $t('back_to_list') }}
              </button>

              <button class="btn btn--green w-50"
                      @click.prevent="transferModal = true">{{ $t('Transfer to Supervisor') }}
              </button>

            </div>
          </div>
        </section>
      </div>


    </div>
    <!--    EMPTY Announce-->
    <div v-else>
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
            :class="{'button_loading':button_loading}"
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
import FormKeywords from '~/components/forms/FormKeywords'
import ChangeLog from "~/components/moderator/changeLog";
export default {

  name: 'parts-pages-moderation',

  layout: 'ticket',

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
    FormKeywords,
    ChangeLog,
  },


  data() {
    return {
      loading: false,
      button_loading: false,
      openLog: false,
      transferModal: false,
      transferComment: '',
      getTimer: {
        data: '',
        unix: 0
      },
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
      },
      announceId: null,
      admin_user: {},
      moderator: {},
      imagesBase64: [],
      commercialPartDisabledOptions: [
        'diameter',
        'height',
        'shine_width',
        'run_flat',
      ],
      //  image
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
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
    }
  },

  async created() {
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)

    if (this.user.admin_group == 2) {
      setInterval(() => {
        let timer = moment().diff(moment(this.moderator.created_at));
        var duration = moment.duration(timer);
        var days = duration.days(),
          hrs = duration.hours(),
          mins = duration.minutes(),
          secs = duration.seconds();

        if (hrs.toString().length === 1) hrs = '0' + hrs;
        if (mins.toString().length === 1) mins = '0' + mins;
        if (secs.toString().length === 1) secs = '0' + secs;
        let _return = '';

        if (days > 0) _return += days + 'd. ';

        _return += hrs + ':' + mins + ':' + secs;

        this.getTimer.data = _return;
        this.getTimer.unix = timer / 1000;
      }, 1000);
    }


  },

  beforeDestroy() {
    this.$toasted.clear();
  },

  methods: {
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


        const partCategories = await this.$axios.$get('/part/categories');

        this.$store.commit('mutate', {
          property: 'partCategories',
          value: partCategories,
        })

        let announce = JSON.parse(JSON.stringify(this.single_announce));

        if (announce.category_id) {
          this.getFilters(announce.category_id)
          this.filter_data = this.getPartFilters(announce.category_id);
        }

        this.announceId = announce.id;
        this.form.delay_comment = "";
        this.form.category_id = announce.category_id;
        this.form.sub_category_id = announce.sub_category_id;
        this.form.region_id = announce.region_id;
        this.form.brand_id = announce.brand_id;
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
        this.saved_images = announce.mediaIds;
        if (announce.filters) {
          this.form.filter = announce.filters
        }
        announce.all_tags.forEach(e => this.form.tags(e.text))


        // if (announce.filters) {
        //   for (let key in announce.filters) {
        //     this.form.filter[key] = announce.filters[key];
        //   }
        // }

        this.admin_user = admin_user.user;
        this.moderator = data ? data.moderator : {};
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
        this.showPhotoReject = true;
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
      if (this.form.saved_images[index]) {
        this.deleteArr.push(this.form.saved_images[index])
      } else {
        await this.$axios.$post('/remove_temporary_image/' + this.form.saved_images[index]);
      }
      this.form.saved_images.splice(index, 1);
    },
    async addFiles(v) {
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
            this.form.saved_images = this.form.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images);
            this.$nuxt.$emit('remove_image_loading_by_index', this.form.saved_images.length);
          } catch ({response: {data: {data}}}) {
            this.$nuxt.$emit('remove_image_by_index', this.form.saved_images.length);
            this.$nuxt.$emit('remove_image_on_catch');
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
    getCurrency(v) {
      this.form.currency = v.key;
    },
    async handleChange(object) {
      if (object.key === 'category_id') {
        const data = await this.$axios.$get(`/part/category/${object.value.id}/filters`)
        this.filter_data = data;
      }
      this.$set(this.form, object.key, object.value.id);
    },

    passBase64Images(val) {
      this.imagesBase64 = val;
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
      if (this.form.saved_images.length !== this.imagesBase64.length) {
        this.$toast.error(this.$t('please_wait_for_all_image_loading'))
        return false;
      }


      for (const [key, value] of Object.entries(this.form.filter)) {
        console.log(`${key}: ${value}`);
        this.form[key] = value;
      }

      let formData = new FormData();
      this.form.status = status;
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
      if (this.form.saved_images.length !== this.imagesBase64.length) return;
      this.imagesBase64 = object.images;
      this.move(this.form.saved_images, object.v.oldIndex, object.v.newIndex);
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
    categorySelected(id) {
      console.log("categorySelected")
      this.form = {
        ...this.form,
        is_new: true,
        is_original: true,
        commercial_size: '',
      }

      delete this.form.sub_category_id
      delete this.form.brand_id
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
    }),
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
  },

  mounted() {
    this.getAnnounceData();
    if (this.single_announce.category_id) {
      this.filter_data = this.getPartFilters();
    }
    if (this.single_announce.category_id) {
      this.getFilters(this.single_announce.category_id)
    }

  }


}
</script>

