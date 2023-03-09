<template>
  <div
    v-if="announcementIsAvailable && !loading"
    class="pages-announcement-edit"
  >
    <div class="container">
      <breadcrumbs id="brdcrmbs1" :crumbs="crumbs"/>
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <div ref="page-top-ae" class="mb-5">

              <!--              header-->
              <template>
                <moderation-header
                  :button_loading="button_loading"
                  :form="form"
                  :single_announce="single_announce"
                  :smsRadarData="smsRadarData"
                />
              </template>


              <!--     sell last step ------  -->
              <sell-last-step
                :key="lastStepKey"
                :announcement="JSON.parse(JSON.stringify(form))"
                :colors="colors"
                :edit="true"
                :restore="form.status == 3"
                :showPhotoReject="rejectObj.showPhotoReject"
                :single_announce="single_announce"
                :smsRadarData="smsRadarData"
                :title="$t('moderator')"
                type="cars"
                @changeReason="changeReason"
                @formChanged="(e) => (form = e)"
                @getRejectObj="getSellLastStepRejectObj"
                @imageDeleted="addDeletedImagesToList"
                @interior_360_id_changed="(e) => (form.interior_360_id = e)"
                @smsRadarDataChanged="smsRadarDataChanged"
              >
                <template v-slot:form-inputs>
                  <div>

                    <!--              brand -->
                    <div class="row mt-5">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          rejectKey="brand"
                          required
                          title="mark"
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.brand_id"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('mark')"
                          :options="brands"
                          has-search
                          @change="changeBrand($event)"
                        />
                      </div>
                      <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.marka"
                    class="ma-smsradar"
                  >
                    <strong>SMSRadar:</strong>
                    <p>{{ smsRadarData.marka }}</p>
                  </span>
                      </div>
                    </div>
                    <!--              model -->
                    <div v-if="data.models && form.brand_id" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          rejectKey="model"
                          required
                          title="model"
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3  ">
                        <form-select
                          v-model="form.model_id"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('model')"
                          :options="data.models"
                          :value="form.model_id"
                          has-search
                          @change="changeModel($event)"
                        />
                      </div>
                    </div>
                    <!--              year -->
                    <div v-if="data.sellYears && form.model_id" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          rejectKey="years"
                          required
                          title="prod_year"
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.year"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('prod_year')"
                          :options="data.sellYears"
                          :value="form.year"
                          has-search
                          @change="changeYear($event)"
                        />
                      </div>
                      <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.manufactYear"
                    class="ma-smsradar"
                  >
                    <strong>SMSRadar:</strong>
                    <p>{{ smsRadarData.manufactYear }}</p>
                  </span>
                      </div>
                    </div>
                    <!--              body-->
                    <div v-if="data.sellBodies && data.sellBodies.length && form.year" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          rejectKey="body_type"
                          required
                          title="body_type"
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.car_body_type"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('body_type')"
                          :options="data.sellBodies"
                          has-search
                          @change="changeBodyType($event)"
                        />
                      </div>
                      <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.vehBodyType"
                    class="ma-smsradar"
                  >
                    <strong>SMSRadar:</strong>
                    <p>{{ smsRadarData.vehBodyType }}</p>
                  </span>
                      </div>
                    </div>
                    <!--              generations-->
                    <div v-if="data.generations && form.car_body_type" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          :oldGeneration="form.generation_id"
                          :title="$t('generation')"
                          rejectKey="generation"
                          required
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 mb-1">
                        <small
                          v-if="single_announce.generation.id !== form.generation_id"
                          class="mb-1"
                          style="color: #081A3E"
                        >
                          {{ $t('old_value_2') }}: {{ single_announce.generation.name[locale] }}
                        </small>
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.generation_id"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('generation')"
                          :options="data.generations"
                          has-search
                          @change="changeGeneration($event)"
                        />
                      </div>
                    </div>
                    <!--              engines-->
                    <div v-if="data.engines && form.generation_id" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          :title="$t('engine')"
                          rejectKey="engine"
                          required
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.engine"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('engine')"
                          :options="
                      data.engines.map((o) => ({
                        name: $t('engine_values')[o.engine],
                        key: o.engine,
                      }))
                    "
                          has-search
                          @change="changeEngine($event)"
                        />
                      </div>
                    </div>
                    <!--              gearing-->
                    <div v-if="data.gearings && form.engine" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          :title="$t('type_of_drive')"
                          rejectKey="transmission"
                          required
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3">
                        <form-select
                          v-model="form.gearing"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('type_of_drive')"
                          :options="data.gearings.map((o) => ({
                        name: $t('type_of_drive_values')[o.type_of_drive] || '',
                        key: o.type_of_drive,
                      }))"
                          @change="changeGearing($event)"
                        />

                      </div>
                    </div>
                    <!--              transmission-->
                    <div v-if="data.transmissions && data.transmissions.length && form.gearing" class="row">
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          :title="$t('box')"
                          rejectKey="gearing"
                          required
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3 ">
                        <form-select
                          v-model="form.transmission"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('box')"
                          :options="
                      data.transmissions.map((o) => ({
                        name: $t('box_values')[o.box],
                        key: o.box,
                      }))
                    "
                          has-search
                          @change="changeTransmission($event)"
                        />
                      </div>
                    </div>
                    <!--              modification-->
                    <div
                      v-if="data.modifications && data.modifications.length && form.transmission" class="row"
                    >
                      <div class="col-12">
                        <title-with-line-and-reject-reason
                          v-if="sellModifications"
                          :title="$t('modification')"
                          rejectKey="modification"
                          required
                          @change="changeReason"
                        />
                      </div>
                      <div class="col-12 col-lg-3">
                        <form-select
                          v-model="form.car_catalog_id"
                          :allow-clear="false"
                          :clearOption="false"
                          :disabled="isModerator"
                          :label="$t('modification')"
                          :options="
                            data.modifications.map((o) => ({
                              name: getModificationName(o),
                              key: o.id,
                            }))
                          "
                          @change="changeModification($event)"
                        />
                      </div>
                      <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.engincapacity"
                    class="ma-smsradar"
                  >
                    <strong>SMSRadar:</strong>
                    <p>{{ smsRadarData.engincapacity / 1000 }}</p>
                  </span>
                      </div>
                    </div>
                  </div>
                </template>

                <!--                image-->
                <template v-slot:image>


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
                  <div style="padding-left: 7px">
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
                </template>
                <!--                360 exterior-->
                <!--                 --------------(add input)-->
                <template v-slot:360_exterior_input
                >
                  <div
                    class="mb-4"
                  >
                    <div class="section-exterior_360__container">
                      <div class="col-md-4 pl-0 d-flex align-items-center">
                        <input class="btn" style="width: 200px;" type="file" v-on:change="add360Video"/>
                        <div v-if="uploadPercentage > 0 && uploadPercentage < 100">
                          {{ uploadPercentage }}%
                        </div>
                        <div v-if="uploadPercentage === 100">
                          <span class="ml-2" style="margin-bottom: 4px;"><icon name="check-circle"
                                                                               style="color:green;font-size: 20px;"/></span>
                        </div>

                      </div>
                    </div>
                  </div>
                </template>
                <!--                 --------------(exterior 360 view)-->
                <template v-slot:360_exterior_content>
                  <div>
                    <div id="video360section">
                      <vue-three-sixty
                        :id="single_announce.id"
                        :amount="single_announce.images_360.length"
                        :files="single_announce.images_360"
                        buttonClass="d-none"
                        disable-zoom
                        putMainImage
                        @mainSelected="selectMainImage"
                        @remove360="remove360"
                      />
                    </div>
                  </div>
                </template>
                <!--                  ------------------------    ------------------------    ------------------------    ------------------------    ------------------------    -------------------------->
                <!--                  ------------------------    ------------------------    ------------------------    ------------------------    ------------------------    -------------------------->
              </sell-last-step>

              <!--      actions-->
              <moderator-actions
                :id="single_announce.id"
                :announcement="form"
                :button_loading="button_loading"
                :imageCount="imagesBase64.length"
                :notValid="notValid"
                :rejectArray="rejectObj.rejectArray"
                :single_announce="single_announce"
                type="cars"
                @formChanged="(e) => (form = e)"
                @handleLoading="handleLoading"
                @openTransferModal="transferModal = true"
                @sendData="sendData"
                @transferToSupervisor="transferToSupervisor"
              />

            </div>
          </div>
        </div>
      </div>
    </div>

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
  <div
    v-else-if="!announcementIsAvailable && !loading"
    class="d-flex flex-column justify-content-center h-300"
  >
    <h1 class="text-center">Baxılmayanlar mövcud deyil</h1>
  </div>
  <div v-else>
    <elements-loader></elements-loader>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import moment from 'moment'
import SellLastStep from '~/components/sell/SellLastStepModerator'
import SellPreview from '~/components/sell/SellPreview'

import ModeratorActions from '~/components/moderator/actions.vue'
import EditButton from '~/components/announcements/EditButton'
import ModelOptions from '~/components/options/ModelOptions'
import TitleWithLine from '~/components/global/titleWithLine.vue'
import ButtonOptions from '~/components/moderator/buttonOptions'
import UploadImage from '~/components/elements/UploadImage'
import RejectReason from '~/components/moderator/rejectReason'
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'
import UploadImageModerator from '~/components/moderator/UploadImageModerator'
import PhotoRejectReason from "~/pages/moderator/photoReject/PhotoRejectReason";
import Interior360Viewer from "~/components/Interior360Viewer";
import ModerationHeader from '~/components/moderator/moderationHeader'


export default {
  name: 'moderatorCar',
  head() {
    return this.$headMeta({
      title: `${this.$t('moderation')}`,
    });
  },
  layout: 'moderator',
  components: {
    TitleWithLineAndRejectReason,
    RejectReason,
    SellPreview,
    EditButton,
    ModelOptions,
    TitleWithLine,
    ButtonOptions,
    UploadImage,
    SellLastStep,
    UploadImageModerator,
    PhotoRejectReason,
    Interior360Viewer,
    ModeratorActions,
    ModerationHeader,
  },
  data() {
    return {
      announcementIsAvailable: false,
      uploadPercentage: 0,
      loading: false,
      showModal: false,
      lastStepKey: 1,
      show: {
        brands: false,
        models: false,
        years: false,
      },
      type: 'cars',
      pending: false,
      //reject reason
      rejectObj: {
        show360Reject: false,
        showPhotoReject: false,
        rejectArray: [],
        reject360: ['360_photo_reject_1'],
      },
      transfer: {
        comment: '',
        isOpen: false,
      },
      button_loading: false,
      itemForm: {},
      sellLastStepRejectObj: {
        rejectArray: [],
      },
      form: {
        brand: null,
        brand_id: null,
        brandObj: {},
        slug: null,
        model: {},
        model_id: null,
        sellBody: null,
        car_body_type: null,
        year: null,
        generation_id: null,
        engine: null,
        gearing: null,
        transmission: null,
        modification: null,
        media: [],
        images_360: [],
        video_360_url: null,
        video_360_id: null,
        interior_360_id: null,
        interior_360_url: null,
        main_image: null,
      },
      data: {
        models: [],
        sellYears: [],
        sellBodies: [],
        generations: [],
        engines: [],
        gearings: [],
        transmissions: [],
        modifications: [],
      },
      models: [],
      smsRadarData: {},
      // send data
      errors: [],
      imagesBase64: [],
      saved_images: [],
      deleteArr: [],
      files: {},
      transferModal: false,
      //  image
      date: Math.floor(Date.now() / 1000),
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      imageIsUploading: false,
      //  image reject
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


      //  360
      showInterior: true,
      uploadedVideo360: null,
      uploadedInterior360: null,
      uploadedInterior360id: null,
      transferComment: '',
      //  timer

    }
  },
  computed: {
    ...mapGetters({
      single_announce: 'moderator/single_announce',
      brands: 'moderator/brands',
      boxes: 'moderator/boxes',
      engines: 'sellEngines',
      enginesModerator: 'moderator/engines',
      sellGenerations: 'sellGenerations',
      sellGear: 'sellGearing',
      generations: 'sellGenerations',
      generationsModerator: 'moderator/generations',
      modelsGeneral: 'models',
      modelsModerator: 'moderator/models',
      moderator: 'moderator/moderator',
      sellModifications: 'sellModifications',
      sellBodiesModerator: 'moderator/sell_bodies',
      sellBodies: 'sellBody',
      type_of_drives: 'moderator/type_of_drives',
      sellYears: 'sellYears',
      sellYearsModerator: 'moderator/sellYears',
      colors: 'colors',
      sellTransmissions: 'sellTransmissions',
      moderatorTransmissions: 'moderator/transmissions',
      modificationsModerator: "moderator/modifications",
      modificationsGeneral: "sellModifications",
    }),
    isModerator() {
      return this.user.admin_group && (this.user.admin_group == 2);
    },
    crumbs() {
      return [
        // { name: this.$t('my_announces'), route: `/profile/announcements` },
        // { name: `#${this.myAnnouncement.id_unique}`, route: `/cars/announcement/16642054490` },
        {name: this.$t('moderator')},
      ]
    },
    modificationsList() {
      let arr = []
      for (const prop in this.modifications) {
        arr.push({id: prop, obj: this.modifications[prop]})
      }
      return arr
    },
    boxesList() {
      let arr = []
      for (const prop in this.boxes) {
        arr.push({id: prop, obj: this.boxes[prop]})
      }
      return arr
    },
    enginesList() {
      let arr = []
      for (const prop in this.engines) {
        arr.push({id: prop, obj: this.engines[prop]})
      }
      return arr
    },
    type_of_drivesList() {
      let arr = []
      for (const prop in this.type_of_drives) {
        arr.push({id: prop, obj: this.type_of_drives[prop]})
      }
      return arr
    },
    helperImages() {
      let imgs =
        this.type === 'cars'
          ? [1, 2, 3, 4, 5]
          : this.type === 'commercial'
            ? [1, 2, 3, 4]
            : [1, 2, 3]
      return imgs.map((n) => `/img/sell-helpers/${this.type}_${n}.png`)
    },
    notValid() {
      if (
        !this.form.brand ||
        !this.form.model ||
        !this.form.year ||
        !this.form.car_body_type ||
        !this.form.generation_id ||
        !this.form.engine ||
        !this.form.gearing ||
        !this.form.transmission ||
        !this.form.car_catalog_id
      ) return true
      else return false
    }
  },
  methods: {
    // ui

    openModal(type) {
      this.showModal = true
      if (type == 'models') {
        this.getModels()
      } else return
    },
    toggleOptions(opt) {
      var obj = this.show
      for (const key in obj) {
        obj[key] = false
      }
      if (obj[opt] == true) {
        obj[opt] = false
      } else {
        obj[opt] = true
      }
    },

    // get
    async getAnnounceData() {
      this.loading = true;
      await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`)
      const admin_user = await this.$axios.$get('/user')
      this.$auth.setUser(admin_user.user)
      //timer

      let data
      try {
        data = await this.$axios.$get('/ticket/car');

        this.$store.commit('moderator/moderatorMutator', {
          with: data.announce,
          property: 'single_announce',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.brands,
          property: 'brands',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.boxes,
          property: 'transmissions',
        })

        this.handleTransmissions(this.moderatorTransmissions);

        this.$store.commit('moderator/moderatorMutator', {
          with: data.models,
          property: 'models',
        })
        this.data.models = this.modelsModerator;

        this.$store.commit('moderator/moderatorMutator', {
          with: data.generations,
          property: 'generations',
        })
        this.data.generations = this.generationsModerator;

        this.$store.commit('moderator/moderatorMutator', {
          with: data.engines,
          property: 'engines',
        })
        this.handleEngines(this.enginesModerator);

        this.$store.commit('moderator/moderatorMutator', {
          with: data.moderator,
          property: 'moderator',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.modifications,
          property: 'modifications',
        })
        this.handleModificationsData(this.modificationsModerator);

        this.$store.commit('moderator/moderatorMutator', {
          with: data.sellYears,
          property: 'sellYears',
        })
        this.handleYears(this.sellYearsModerator)

        this.$store.commit('moderator/moderatorMutator', {
          with: data.sell_bodies,
          property: 'sell_bodies',
        })
        this.data.sellBodies = data.sell_bodies;

        this.$store.commit('moderator/moderatorMutator', {
          with: data.type_of_drives,
          property: 'type_of_drives',
        })
        this.handleGearings(this.type_of_drives);


        this.form = {
          delay_comment: '',
          car_catalog_id: data.announce?.car_catalog_id,
          brandObj: data.announce.brand,
          brand: data.announce?.brand.slug,
          brand_id: data.announce?.brand.id,
          model: data.announce?.model.slug,
          model_id: data.announce?.model.id,
          generation_id: data.announce?.car_catalog?.generation_id,
          generation: data.announce?.car_catalog?.generation_id,
          car_body_type: data.announce?.car_catalog?.car_type.id,
          gearing: data.announce.car_catalog.gearing_id.toString(), // engines
          modification: data.announce.car_catalog.id,
          transmission: (data.announce.car_catalog.box_id == 4) ? "1" : data.announce.car_catalog.box_id.toString(),
          capacity: data.announce?.car_catalog?.capacity,
          power: data.announce?.car_catalog?.power,
          year: data.announce?.year,
          auction: data.announce?.auction,
          end_date: moment(data.announce?.end_date).format('DD.MM.YYYY HH:mm') || null,
          country_id: data.announce?.country_id,
          youtube: {
            id: data.announce?.youtube_link,
            thumb: `https://img.youtube.com/vi/${data.announce?.youtube_link}/hqdefault.jpg`,
          },


          selectedColor: data.announce?.colors,
          is_matte: data.announce?.is_matte,
          mileage: parseInt(data.announce?.mileage) || 0,

          mileage_measure: data.announce?.mileage_measure || 1,
          region_id: data.announce?.region_id || 1,
          address: data.announce?.address,

          lat: parseFloat(data.announce?.latitude || 0),
          lng: parseFloat(data.announce?.longitude || 0),
          vin: data.announce?.vin || "",
          //-------------------------------------------------------------------
          //-------------------------------------------------------------------
          //-------------------------------------------------------------------
          price: data.announce?.price_int.toString() || '',
          // owner_type: (data.announce?.owner_type).toString() || '0',
          currency: data.announce?.currency_id || 1,

          //-------------------------------------------------------------------
          //-------------------------------------------------------------------
          //-------------------------------------------------------------------
          car_number: data.announce?.car_number,
          show_car_number: data.announce?.show_car_number,
          show_vin: data.announce?.show_vin,


          part: data.announce?.car_body_health
            ? JSON.parse(data.announce?.car_body_health.options)
            : {},
          all_options: data.announce?.options,
          badges: data.announce?.stickers?.map((item) => item.id),
          new_badges: [],
          comment: data.announce?.comment || '',
          is_new: data.announce?.is_new || false,
          beaten: data.announce?.broken,
          customs_clearance: data.announce?.customs_clearance || 0,
          tradeable: data.announce?.exchange_possible,
          credit: data.announce?.credit,
          guaranty: data.announce?.in_garanty,
          // saved_images: data.announce?.mediaIds,
          saved_images: data.announce.mediaIds,
          media: data.announce.media,
          engine: data.announce?.car_catalog.engine_id.toString(),
          engine_id: data.announce?.car_catalog.engine_id.toString(),
          images_360: data.announce.images_360,
          message: "test",
          user: data.announce.user,
          status: data.announce.status,
          rejectArray: this.rejectObj.rejectArray,
        };
        this.saved_images = data.announce.mediaIds;

        this.getColors();

        this.checkWithVin()
        this.getGenerations();
        this.loading = false;
        this.announcementIsAvailable = true;
      } catch (e) {
        this.$store.commit('moderator/moderatorMutator', {
          with: {},
          property: 'form',
        })
        this.announcementIsAvailable = false;
        this.loading = false;

      }


    },
    async checkWithVin() {
      let vin = this.form.vin
      let car_number = this.form.car_number.replace(/[^0-9a-zA-Z]+/g, '')

      let sendData = {
        announce_id: this.single_announce.id,
      }
      let send = false
      if (vin.length === 17) {
        sendData.vin = vin
        send = true
      }
      if (car_number.length === 7) {
        sendData.car_number = car_number
        send = true
      }

      if (!send) return false

      this.$nuxt.$emit('loading_status', true)
      this.$axios.$post('/ticket/checkSmsRadar', sendData).then((data) => {
        data = data.data

        if (data) {
          //data.carNumber = data.carNumber.slice(0, 2) + '-' + data.carNumber.slice(2, 4) + '-' + data.carNumber.slice(4, 7);

          this.smsRadarData = data

          //if (data.bodyNumber && data.bodyNumber.toString().length === 17) this.getChange(data.bodyNumber, 'vin');
        }

        // this.$nuxt.$emit('loading_status', false)
        this.loading = false;
      })
    },
    async getColors() {
      await this.$store.dispatch('getColors')
    },
    async getModels(slug) {
      if (this.form.brand_id) {

        await this.$store.dispatch('getModels', slug);
        this.data.models = this.modelsGeneral;
      }
    },
    async getSellYears() {
      if (this.form.model_id) {
        await this.$store.dispatch('getSellYears', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
        })
        this.handleYears(this.sellYears);
      }
    },
    async getSellBodies() {
      if (this.form.year) {
        await this.$store.dispatch('getSellBody', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
        })
        this.data.sellBodies = this.sellBodies;
      }
    },
    async getGenerations() {
      if (this.form.car_body_type) {
        await this.$store.dispatch('getSellGenerations', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
          body: this.form.car_body_type,
        })
        this.data.generations = this.sellGenerations;
      }
    },
    async getSellEngines() {
      if (this.form.generation_id) {
        await this.$store.dispatch('getSellEngines', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
          body: this.form.car_body_type,
          generation: this.form?.generation_id,
        })
        this.data.engines = this.engines;
      }
    },
    async getSellGearing() {
      if (this.form.engine) {
        await this.$store.dispatch('getSellGearing', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
          body: this.form.car_body_type,
          generation: this.form?.generation_id,
          engine: this.form?.engine,
        })
        this.data.gearings = this.sellGear;
      }
    },
    async getSellTransmissions() {
      if (this.form.gearing && this.form.engine) {
        await this.$store.dispatch('getSellTransmissions', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
          body: this.form.car_body_type,
          generation: this.form?.generation_id,
          engine: this.form?.engine,
          gearing: this.form?.gearing,
        })
        this.data.transmissions = this.sellTransmissions;
      }
    },
    async getSellModifications() {
      if (this.form.transmission && this.form.gearing) {
        await this.$store.dispatch('getSellModifications', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug || this.form.model,
          year: this.form.year,
          body: this.form.car_body_type,
          generation: this.form?.generation_id,
          engine: this.form?.engine,
          gearing: this.form?.gearing,
          transmission: this.form?.transmission
        })
        this.data.modifications = this.modificationsGeneral;
      }
    },
    async getValue(key, value) {
      if (key === 'status') {
        let status = [
          this.$t('rejected'),
          this.$t('active'),
          this.$t('pending'),
        ]
        return status[value]
      } else {
        return value
      }
    },

    // handle lists
    handleLoading(e) {
      this.loading = e;
    },
    getIcon(key, value) {
      return {
        engine: {
          1: 'fuel-station',
          2: 'battery-charge',
          3: 'diesel',
          4: 'gas',
          5: 'plug',
        },
        type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
        box: {
          1: 'mechanical',
          2: 'automatic',
          3: 'robot',
          4: 'variator',
          5: 'reductor',
        },
      }[key][value]
    },
    getModificationName(o) {
      let generation = this.data.generations.find(
        (o) => o.id === this.form.generation_id,
      )
      let name = `${this.$t('box_mode_values')[o.box]}/${
        generation?.start_year || this.data.sellYears[0].key
      } - ${generation?.end_year || this.currentYear}`
      if (o.capacity) name = `${o.capacity} ${name}`
      if (o.power) name = `${o.power} ${this.$t('char_h_power')}/${name}`
      if (o.complect_type) name += `/${o.complect_type}`
      return name
    },
    getFormValues(keys) {
      let form = {}
      keys.map((key) => {
        let formKey = key
          .replace('car_body_type', 'body')
          .replace('generation_id', 'generation')
          .replace('gearing', 'engine')
          .replace('transmission', 'gearing')
          .replace('modification', 'transmission')
        form[formKey] = form[key]
      })
      return form
    },

    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.imageModal.isOpen = true
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
    handleYears(obje) {
      var obj = JSON.parse(JSON.stringify(obje))
      var arr = [];
      for (var i = obj.min; i <= obj.max; i++) {
        arr.push({key: i, name: i})
      }


      this.data.sellYears = arr;

    },
    handleBody(obje) {
      var obj = JSON.parse(JSON.stringify(obje))
      var arr = [];
      for (var i = obj.min; i <= obj.max; i++) {
        arr.push({key: i, name: i})
      }
      this.data.sellYears = arr;

    },
    gotoList() {
      window.location.href = "https://dev.mashin.al/alvcp/resources/announcements"
    },
    getSellLastStepRejectObj(value) {
      console.log('value', value)
      console.log('this.rejectObj.rejectArray', this.rejectObj.rejectArray)
      if (!this.rejectObj.rejectArray.includes(value)) {
        this.rejectObj.rejectArray.push(value)
      } else {
        const index = this.rejectObj.rejectArray.indexOf(value);
        this.rejectObj.rejectArray.splice(index, 1);
      }
      // this.sellLastStepRejectObj = value;
      // value.show360Reject = this.rejectObj.show360Reject;
      // value.showPhotoReject = this.rejectObj.showPhotoReject;
      // value.reject360 = this.rejectObj.reject360;
    },
    handleEngines(obj) {
      var arr = [];
      for (var el in obj) {
        arr.push(obj[el]);
      }
      this.data.engines = arr;
    },
    handleGearings(obj) {
      var arr = [];
      for (var el in obj) {
        arr.push(obj[el]);
      }
      this.data.gearings = arr;
    },
    handleTransmissions(obj) {
      var arr = [];
      for (var el in obj) {
        arr.push(obj[el]);
      }
      this.data.transmissions = arr;
    },
    handleModificationsData(obj) {
      var arr = []
      for (var i = 0; i < Object.keys(obj).length; i++) {
        var item = obj[Object.keys(obj)[i]];
        arr.push(item);
      }
      this.data.modifications = arr;

    },

    smsRadarDataChanged(obj) {
      this.smsRadarData = obj;
    },
    //handle actions
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
    addDeletedImagesToList(e) {
      this.deleteArr.push(e)
    },


    //handle image
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
            this.saved_images = this.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images)
            this.imageIsUploading = false;
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
    addImages(v) {
      this.files = v
      this.getInfo()
      this.$nuxt.$emit('progress_change', {
        type: 'images',
        count: Object.keys(this.files).length,
      })
    },
    passBase64Images(val) {
      this.imagesBase64 = val
    },
    replaceImage(object) {
      if (this.saved_images.length !== this.imagesBase64.length) return
      this.imagesBase64 = object.images
      this.move(this.saved_images, object.v.oldIndex, object.v.newIndex)
    },
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
    move(input, from, to) {
      let numberOfDeletedElm = 1
      const elm = input.splice(from, numberOfDeletedElm)[0]
      numberOfDeletedElm = 0
      input.splice(to, numberOfDeletedElm, elm)
    },


    //    handle 360
    add360Video(val) {
      var formData = new FormData()
      formData.append('video', val.target.files[0])
      // this.uploadedVideo360 = formData;
      this.$axios
        .post('' + '/upload_temporary_video', formData, {
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          }.bind(this),
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.success(this.$t('video_360_successfully_upload'))
            console.log(" res.data.url", res.data.data.id)
            console.log(" res.data.id", res.data.data.url)
            this.form.video_360_url = res.data.data.url
            this.form.video_360_id = res.data.data.id
          }
        })
    },
    selectMainImage(param) {
      this.form.main_image = param
    },
    async remove360(param) {

      if (param == 'success') {
        let data = await this.$axios.$get('/ticket/car');

        let video360section = document.getElementById('video360section');
        video360section.remove();


        this.$store.commit('mutate', {
          with: data.announce,
          property: 'single_announce'
        })


      }
    },


// handle image reject
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
    savePhotoIssues(v) {
      var validCheckbox = true
      Object.keys(v.data).map((key) => {
        if (this.rejectObj.rejectArray.includes(key)) {
          this.rejectObj.rejectArray.splice(this.rejectObj.rejectArray.indexOf(key), 1)
        }

        if (v.data[key]) {
          validCheckbox = false
          this.rejectObj.rejectArray.push(key)
        }
      })

      this.$nuxt.$emit('image-checkbox-change', validCheckbox)
    },

//handle change
    async changeBrand(e) {
      this.form.model_id = null;
      this.form.model = "";
      this.brands.find(f => {
        if (f.id == e) {
          // this.$store.dispatch('getModels', )
          this.getModels(f.slug)
          this.form.brand_slug = f.slug;
          this.form.brand_id = f.id;
          this.form.brandObj = f;

        }
      })
    },
    async changeModel(e) {
      this.form.year = null;
      await this.data.models.find(f => {
        if (f.id == e) {
          this.form.model = f.slug
          this.form.year = null;
          this.form.model_slug = f.slug;
        }
      })
      this.getSellYears();
    },
    async changeYear(e) {
      this.form.car_body_type = null;
      // await this.data.models.find(f => {
      //   if (f.id == e) {
      //     this.form.year = null;
      //     this.form.model_slug = f.slug;
      //   }
      // })
      this.getSellBodies();
    },
    async changeBodyType(e) {
      this.form.generation_id = null;
      this.getGenerations();
    },
    async changeGeneration(e) {
      this.form.engine = null;
      this.getSellEngines()
    },
    async changeEngine(e) {
      this.form.gearing = null;
      this.getSellGearing()
    },
    async changeGearing(e) {
      this.form.transmission = null;
      this.getSellTransmissions()
    },
    async changeTransmission(e) {
      this.form.car_catalog_id = null;
      this.getSellModifications();
    },
    async changeModification(e) {
      return e;
    },


// post
    async transferToSupervisor(withRejectReason = false) {
      console.log('transferToSupervisor')
      this.button_loading = true

      if (withRejectReason) {
        this.transferComment = this.rejectObj.rejectArray
      }

      await this.$store.dispatch('moderator/transferToSupervisor', {
        id: this.single_announce.id,
        comment: this.transferComment,
      })

      if (this.user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/announcements'
      }
    },
    async sendData(status = 2) {
      if (this.saved_images.length !== this.imagesBase64.length) {
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {
          type: 'error',
        })
        return false
      }


      this.form.status = status
      this.form.id = this.single_announce.id;
      this.form.month = this.single_announce.month || "";
      this.form.sell_store = this.single_announce.sell_store || 0;
      this.form.id_unique = this.single_announce.id.toString();
      this.form.rejectArray = this.rejectObj.rejectArray;
      this.form.saved_images = this.saved_images;
      this.form.end_date = null;


      this.form.owner_type = 1;
      // this.form.youtube_link  = ""
      // this.form.angle         = null;
      // this.form.owner_type    = 1;
      // this.form.national_number = 1;
      // this.form.not_registered = false;
      // this.form.type      = 0;
      // this.form.guarantee = false;
      // this.form.color_id  = 0;
      // this.form.phone_number = "";
      // this.form.fullname   = "fullname";
      // this.form.email      = "email";
      // this.form.store_id   = "store_id";
      // this.form.is_free    = "is_free";
      // this.form.youtube_id = "youtube_id";

      this.form.generation = this.form.generation_id;

      delete this.form.model_slug;
      delete this.form.brand_slug;
      delete this.form.user;
      delete this.form.brandObj
      delete this.form.brand_id

      let newForm = this.form;
      newForm.car_body_type = this.single_announce.car_catalog.car_type.id;
      let formData = new FormData()

      formData.append('data', JSON.stringify(newForm))
      formData.append('deletedImages', JSON.stringify(this.deleteArr))

      this.loading = true;
      this.button_loading = true

      try {

        await this.$axios.$post('/ticket/car/' + this.single_announce.id, formData)

        if (this.user.admin_group == 2) {
          location.href = '/alvcp/resources/announce-moderators';
        } else {
          location.href = '/alvcp/resources/announcements';
        }

        if (status == 0) {
          this.$toasted.show(this.$t('your_announce_rejected'), {
            type: 'success',
          })
        }


      } catch ({
        response: {
          data: {data},
        },
      }) {
        this.loading = false;
        this.button_loading = false
        this.errors = []
        this.$toasted.clear()
        Object.keys(data)
          .reverse()
          .map((key) => {
            this.errors.push(key)
            this.$toasted.show(data[key][0], {
              type: 'error',
              duration: 0,

            })
          })

      }

    },
    addComment(e) {
      if (form.comment === null) form.comment = ''
      form.comment = form.comment + e + ' '
    },


  },
  mounted() {
    this.getAnnounceData();
  },
  beforeMount() {
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (this.form.brandObj == {}) {
          this.form.model_id = null;
          // this.form.model = {};
        }
        if (this.form.brand_id == null) {
          this.form.model_id = null;
          // this.form.model = {};
        }
        if (this.form.brand == null) {
          this.form.model_id = null;
          // this.form.model = {};
        }
        if ((this.form.model_id == null) || (this.form.model == {})) {
          this.form.year = null;
        }
        if (this.form.year == null) {
          this.form.car_body_type = null;
        }
        if (this.form.car_body_type == null) {
          this.form.generation_id = null;
        }
        if (this.form.generation_id == null) {
          this.form.engine = null;
        }
        if (this.form.engine == null) {
          this.form.gearing = null;
        }
        if (this.form.gearing == null) {
          this.form.transmission = null;
        }
        if (this.form.transmission == null) {
          this.form.car_cata = null;
        }
      }
    },
    'form.brandObj': {
      deep: true,
      handler() {
        this.form.brand = this.form.brandObj.slug
      }
    }
  }
}
</script>


