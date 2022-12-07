<template>
  <div
    v-if="announcementIsAvailable && !loading"
    class="pages-announcement-edit"
  >
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <div class="mb-5">
              <!--              user details -->
              <template v-if="form.brand">
                <user-details
                  :createdAt="single_announce.created_at"
                  :is-autosalon="single_announce.is_autosalon"
                  :is-external-salon="single_announce.is_external_salon"
                  :smsRadarData="smsRadarData"
                  :userData="form.user"
                  is-moto
                />
              </template>
              <!--              brand -->
              <div class="row mt-5">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="brand"
                    title="mark"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <pre>{{ options }}</pre>
                  <form-select
                    v-model="form.brand_id"
                    :disabled="isModerator"
                    :label="$t('mark')"
                    :options="options.brands.filter((b) => b.models_count)"
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
                    title="model"
                    @change="changeReason"
                  />
                </div>
                <div v-if="showModelOptions" class="col-12 col-lg-3">
                  <form-select
                    v-model="form.model_id"
                    :disabled="isModerator"
                    :label="$t('model')"
                    :options="options.brands.filter((b) => b.models_count)"
                    :value="form.model_id"
                    has-search
                    @change="changeModel($event)"
                  />
                </div>
              </div>

              <!-- actions   ------------------------>
              <div class="moderator-comment mt-5">
                <!--  moderator-->
                <div v-if="user.admin_group == 2" class="row">
                  <div class="col-8">
                    <form-textarea
                      v-model="form.delay_comment"
                      :maxlength="3000"
                      :placeholder="$t('comment')"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      v-if="
                        !rejectObj.rejectArray.length &&
                        !sellLastStepRejectObj.rejectArray.length
                      "
                      :class="[
                        'btn btn--green w-50',
                        { pending },
                        { disabled: form.comment.length == 0 },
                      ]"
                      :disabled="form.comment.length == 0"
                      class="mb-2"
                      type="button"
                      @click.prevent="sendData(1)"
                    >
                      {{ $t('confirm') }}
                    </button>
                    <button
                      v-else
                      :class="[
                        'btn btn--green w-50',
                        { pending },
                        { disabled: form.comment.length == 0 },
                      ]"
                      :disabled="form.comment.length == 0"
                      class="mb-2"
                      type="button"
                      @click.prevent="sendData(0)"
                    >
                      {{ $t('reject') }}
                    </button>
                    <button
                      v-if="!transfer.isOpen"
                      :class="['btn btn--green', { pending }]"
                      class="mb-2"
                      type="button"
                      @click="transfer.isOpen = true"
                    >
                      {{ $t('transfer_to_supervisor') }}
                    </button>
                    <div
                      v-if="getTimer && getTimer.data"
                      class="moderator-timer"
                    >
                      {{ getTimer.data.replace('d', $t('day')) }}
                    </div>
                  </div>
                </div>

                <!--  supervisor-->
                <div v-if="user.admin_group == 1" class="row">
                  <div class="col float-right">
                    <button
                      v-if="
                        rejectObj.rejectArray.filter(
                          (item) => !rejectObj.reject360.includes(item),
                        ).length === 0 &&
                        !sellLastStepRejectObj.rejectArray.length
                      "
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--green mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(1)"
                    >
                      {{ $t('confirm') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--red mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(0)"
                    >
                      {{ $t('reject') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--pale-red mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(3)"
                    >
                      {{ $t('deactive_announce') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--grey mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="gotoList()"
                    >
                      {{ $t('back_to_list') }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- actions   ------------------------>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import UserDetails from '~/components/moderator/brand.vue'
import EditButton from '~/components/announcements/EditButton'
import ModelOptions from '~/components/options/ModelOptions'
import TitleWithLine from '~/components/global/titleWithLine.vue'
import ButtonOptions from '~/components/moderator/buttonOptions'
import UploadImage from '~/components/elements/UploadImage'
import RejectReason from '~/components/moderator/rejectReason'
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'
import UploadImageModerator from '~/components/moderator/UploadImageModerator'
import PhotoRejectReason from '~/pages/moderator/photoReject/PhotoRejectReason'

export default {
  layout: 'ticket',
  components: {
    TitleWithLineAndRejectReason,
    RejectReason,
    SellPreview,
    UserDetails,
    EditButton,
    ModelOptions,
    TitleWithLine,
    ButtonOptions,
    UploadImage,
    SellLastStep,
    UploadImageModerator,
    PhotoRejectReason,
  },
  data() {
    return {
      announcementIsAvailable: false,
      loading: false,
      showModal: false,
      lastStepKey: 1,
      show: {
        brands: false,
        models: false,
        years: false,
      },
      type: 'moto',
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
      main_image: null,
      saved_images: [],
      deleteArr: [],
      files: {},

      //  image
      date: Math.floor(Date.now() / 1000),
      minFiles: this.type === 'moto' ? 2 : 3,
      maxFiles: 20,
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
        rejectArray: ['front_error', 'back_error', 'left_error'],
        modalToggled: false,
      },

      //  moto
      default_data: {},
      admin_user: null,

      //  toggle
      showModelOptions: false,
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
      getTimer: 'moderator/getTimer',
      modificationsModerator: 'moderator/modifications',
      modificationsGeneral: 'sellModifications',

      motoOptions: 'motoOptions',
      motorcycleModels: 'motorcycleModels',
      scooterModels: 'scooterModels',
      atvModels: 'atvModels',
    }),
    ...mapActions(['getMotoModels']),
    isModerator() {
      return this.user.admin_group && this.user.admin_group == 2
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
    isMorderator() {
      return this.user.admin_group == 2
    },

    //moto
    options() {
      if (this.form.category == 1) {
        return {
          brands: this.motoOptions.brands,
          models: this.motorcycleModels[0],
        }
      } else if (this.form.category == 2) {
        return {
          brands: this.motoOptions.scooter_brands,
          models: this.scooterModels[0],
        }
      } else if (this.form.category == 3) {
        return {
          brands: this.motoOptions.atv_brands,
          models: this.atvModels[0],
        }
      }
      return {brands: [], models: []}
    },
  },
  async asyncData({store, route}) {
    await Promise.all([
      store.dispatch('getMotoOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
    ])
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
      this.loading = true
      await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`)
      const admin_user = await this.$axios.$get('/user')
      this.$auth.setUser(admin_user.user)
      //timer
      let data
      try {
        data = await this.$axios.$get(
          `/ticket/moto?type=${this.$route.query.type}`,
        )
        this.$store.commit('moderator/moderatorMutator', {
          with: data.announce,
          property: 'single_announce',
        })

        let default_data = {}
        // let s_ann = this.$store.state.single_announce;
        let s_ann = data.announce
        let brand
        let model
        let type
        default_data['engine'] = s_ann.engine_type_id
        default_data['volume'] = s_ann.capacity
        default_data['power'] = s_ann.power
        default_data['cylinders'] = s_ann.cylinders
        default_data['box'] = s_ann.box_id
        default_data['cylinder_placement'] = s_ann.cylinder_type_id
        default_data['number_of_vehicles'] = s_ann.tact
        default_data['drive'] = s_ann.gear_id
        default_data['capacity'] = s_ann.capacity

        if (s_ann.moto_brand !== undefined) {
          default_data['category'] = '1'
          await this.$store.dispatch('getMotoModels', {
            id: s_ann.moto_brand.id,
            index: 0,
          })
          brand = s_ann.moto_brand
          model = s_ann.moto_model
          /*  type  = s_ann.moto_type_id;*/
        }
        if (s_ann.scooter_brand !== undefined) {
          default_data['category'] = '2'
          await this.$store.dispatch('getScooterModels', {
            id: s_ann.scooter_brand.id,
            index: 0,
          })
          brand = s_ann.scooter_brand
          model = s_ann.scooter_model
        }
        if (s_ann.moto_atv_brand !== undefined) {
          default_data['category'] = '3'
          await this.$store.dispatch('getMotoAtvModels', {
            id: s_ann.moto_atv_brand.id,
            index: 0,
          })
          brand = s_ann.moto_atv_brand
          model = s_ann.moto_atv_model
          /*  type  = s_ann.moto_atv_type_id;*/
        }

        this.form = default_data
        this.admin_user = admin_user.user
        this.form.user = data.announce.user
        this.form.brand_id = data.announce.moto_brand_id
        this.form.brandObj = default_data.moto_brand
        this.form.old_brand = brand.name
        this.form.old_model = model.name
        this.form.old_type = type
        this.form.brand = brand.id
        this.form.model = model.id
        this.form.year = s_ann.year
        this.form.moderator = data ? data.moderator : {}

        // return {
        /*type,*/
        //old_model: data.announce.model.name,
        // }

        this.loading = false
        this.getColors()
        this.announcementIsAvailable = true

        // this.getGenerations();
      } catch (e) {
        console.log('error', e)
        this.$store.commit('moderator/moderatorMutator', {
          with: {},
          property: 'form',
        })
        this.announcementIsAvailable = false
        this.loading = false
      }
    },


    // handle lists
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.imageModal.isOpen = true
      } else if (rejectKey === '360') {
        this.rejectObj.show360Reject = true
      } else {
        if (this.rejectObj.rejectArray.includes(rejectKey)) {
          this.rejectObj.rejectArray.splice(
            this.rejectObj.rejectArray.indexOf(rejectKey),
            1,
          )
        } else {
          this.rejectObj.rejectArray.push(rejectKey)
        }
      }
    },
    handleYears(obje) {
      var obj = JSON.parse(JSON.stringify(obje))
      var arr = []
      for (var i = obj.min; i <= obj.max; i++) {
        arr.push({key: i, name: i})
      }

      this.data.sellYears = arr
    },
    handleBody(obje) {
      var obj = JSON.parse(JSON.stringify(obje))
      var arr = []
      for (var i = obj.min; i <= obj.max; i++) {
        arr.push({key: i, name: i})
      }
      this.data.sellYears = arr
    },
    gotoList() {
      window.location.href =
        'https://dev.mashin.al/alvcp/resources/announcements'
    },
    getSellLastStepRejectObj(value) {
      this.sellLastStepRejectObj = value
      value.show360Reject = this.rejectObj.show360Reject
      value.showPhotoReject = this.rejectObj.showPhotoReject
      value.reject360 = this.rejectObj.reject360
    },
    handleEngines(obj) {
      var arr = []
      for (var el in obj) {
        arr.push(obj[el])
      }
      this.data.engines = arr
    },
    handleGearings(obj) {
      var arr = []
      for (var el in obj) {
        arr.push(obj[el])
      }
      this.data.gearings = arr
    },
    handleTransmissions(obj) {
      var arr = []
      for (var el in obj) {
        arr.push(obj[el])
      }
      this.data.transmissions = arr
    },
    handleModificationsData(obj) {
      var arr = []
      for (var i = 0; i < Object.keys(obj).length; i++) {
        var item = obj[Object.keys(obj)[i]]
        arr.push(item)
      }
      this.data.modifications = arr
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
            this.$nuxt.$emit(
              'remove_image_loading_by_index',
              this.saved_images.length,
            )
          } catch ({
            response: {
              data: {data},
            },
          }) {
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

    // handle image reject
    saveImageRejects() {
      this.rejectObj.rejectArray = this.rejectObj.rejectArray.concat(
        this.imageModal.rejectArray,
      )
      this.removeDuplicates()
      this.closeImageRejectModal()
      this.imageModal.rejectArray = []
    },
    removeDuplicates() {
      var arr = this.rejectObj.rejectArray
      this.rejectObj.rejectArray = [...new Set(arr)]
    },
    savePhotoIssues(v) {
      var validCheckbox = true
      Object.keys(v.data).map((key) => {
        if (this.rejectObj.rejectArray.includes(key)) {
          this.rejectObj.rejectArray.splice(
            this.rejectObj.rejectArray.indexOf(key),
            1,
          )
        }

        if (v.data[key]) {
          validCheckbox = false
          this.rejectObj.rejectArray.push(key)
        }
      })

      this.$nuxt.$emit('image-checkbox-change', validCheckbox)
    },

    //handle change
    async handleBrand(id = '') {
      this.form.brand_id = id;
      if (id) {
        await this.getMotoModels({category: `${this.form.category}`, id});
        this.showModelOptions = true;
      }
      this.scrollReset();
    },

    // post
    async transferToSupervisor(withRejectReason = false) {
      this.button_loading = true

      if (withRejectReason) {
        this.transferComment = this.rejectArray
      }

      await this.$store.dispatch('moderator/transferToSupervisor', {
        id: this.form.id,
        comment: this.form.comment,
      })

      if (this.user.admin_group == 2) {
        this.$router.push({path: this.localePath('/e-services')})
      } else {
        // location.href = '/alvcp/resources/announcements'
        this.$router.push($t('e-services'))
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
      this.form.id = this.single_announce.id
      this.form.month = this.single_announce.month || ''
      this.form.sell_store = this.single_announce.sell_store || 0
      this.form.video_360_id = this.single_announce.video_360_id || ''
      this.form.modification = ''
      // this.form.model = this.form.model_slug;

      delete this.form.model_slug
      delete this.form.brand_slug
      this.form.id_unique = this.single_announce.id
      this.form.interior_360_id = this.single_announce.interior_360_id || ''
      this.form.main_image = this.form.main_image || null
      // this.form.generation = this.generation
      // this.form.car_catalog_id = this.modification
      this.form.rejectArray = this.rejectObj.rejectArray
      this.form.main_image = this.main_image
      this.form.saved_images = this.saved_images
      let formData = new FormData()
      formData.append('data', JSON.stringify(this.form))
      formData.append('deletedImages', JSON.stringify(this.deleteArr))

      this.loading = true
      this.button_loading = true
      try {
        await this.$axios.$post(
          '/ticket/car/' + this.single_announce.id,
          formData,
        )

        if (this.user.admin_group == 2) {
          location.href = 'https://dev.mashin.al/alvcp/resources/announcements'
        } else {
          location.href = 'https://dev.mashin.al/alvcp/resources/announcements'
        }
      } catch ({
        response: {
          data: {data},
        },
      }) {
        this.loading = false
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
              action: {
                text: 'Go to fix',
                onClick: (e, toastObject) => {
                  if (document.querySelector('#' + key))
                    document
                      .querySelector('#' + key)
                      .scrollIntoView({behavior: 'smooth', block: 'center'})
                  toastObject.goAway(0)
                },
              },
            })
          })
      }
    },
    addComment(e) {
      if (form.comment === null) form.comment = ''
      form.comment = form.comment + e + ' '
    },

    // moto
    updateSellFilter() {
      return
    },
  },
  mounted() {
    this.getAnnounceData()
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (this.form.brandObj == {}) {
          this.form.model_id = null
          // this.form.model = {};
        }
        if (this.form.brand_id == null) {
          this.form.model_id = null
          // this.form.model = {};
        }
        if (this.form.brand == null) {
          this.form.model_id = null
          // this.form.model = {};
        }
        if (this.form.model_id == null || this.form.model == {}) {
          this.form.year = null
        }
        if (this.form.year == null) {
          this.form.car_body_type = null
        }
        if (this.form.car_body_type == null) {
          this.form.generation_id = null
        }
        if (this.form.generation_id == null) {
          this.form.engine = null
        }
        if (this.form.engine == null) {
          this.form.gearing = null
        }
        if (this.form.gearing == null) {
          this.form.transmission = null
        }
        if (this.form.transmission == null) {
          this.form.modification = null
        }
      },
    },
  },
}
</script>
