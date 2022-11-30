<template>
  <div v-if="announcementIsAvailable && !loading" class="pages-announcement-edit">
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <div class="mb-5">
              <!--              user details-->
              <template v-if="form.brand">
                <user-details
                  :brand="form.brandObj"
                  :smsRadarData="smsRadarData"
                  :userData="form.user"
                  :createdAt="single_announce.created_at"
                  :is-autosalon="single_announce.is_autosalon"
                  :is-external-salon="single_announce.is_external_salon"
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
                  <form-select
                    v-model="form.brand_id"
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
                  <strong>SMSRadar: </strong>   <p>{{ smsRadarData.marka }}</p>
                  </span>
                </div>
              </div>
              <!--              model -->
              <div v-if="data.models  && form.brand_id" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="model"
                    title="model"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="form.model_id"
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
              <div v-if="data.sellYears &&  form.model_id" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="years"
                    title="prod_year"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="form.year"
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
                  <strong>SMSRadar: </strong>   <p>{{ smsRadarData.manufactYear }}</p>
                  </span>
                </div>
              </div>
              <!--              body-->
              <div v-if="data.sellBodies &&  form.year" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="body_type"
                    title="body_type"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="form.car_body_type"
                    :disabled="isModerator"
                    :label="$t('body_type')"
                    :options="data.sellBodies"
                    :value="form.car_body_type"
                    has-search
                    @change="changeBodyType($event)"
                  />
                </div>
                <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.vehBodyType"
                    class="ma-smsradar"
                  >
                  <strong>SMSRadar: </strong>   <p>{{ smsRadarData.vehBodyType }}</p>
               </span>
                </div>
              </div>
              <!--              generations-->
              <div v-if="data.generations && form.car_body_type" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    :title="$t('generation')"
                    rejectKey="generation"
                    required
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="form.generation_id"
                    :disabled="isModerator"
                    :label="$t('body_type')"
                    :options="data.generations"
                    :value="form.generation_id"
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
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="form.engine"
                    :disabled="isModerator"
                    :label="$t('engine')"
                    :options="
                      data.engines.map((o) => ({
                        name: $t('engine_values')[o.engine],
                        key: o.engine,
                      }))
                    "
                    :value="form.engine"
                    has-search
                    @change="changeEngine($event)"
                  />
                </div>
              </div>
              <!--              gearing-->
              <div v-if="data.gearings && form.engine" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    :title="$t('box')"
                    rejectKey="gearing"
                    required
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3 pl-0">
                  <form-select
                    v-model="form.gearing"
                    :disabled="isModerator"
                    :label="$t('box')"
                    :options="
                    data.gearings.map((o) => ({
                      name: $t('box_values')[o.type_of_drive],
                      key: parseInt(o.type_of_drive),
                    }))
                    "
                    :value="form.gearing"
                    has-search
                    @change="changeGearing($event)"
                  />
                </div>


              </div>
              <!--              transmission-->
              <div v-if="data.transmissions && form.gearing" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    :title="$t('type_of_drive')"
                    rejectKey="transmission"
                    required
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3 pl-0">
                  <form-select
                    v-model="form.transmission"
                    :disabled="isModerator"
                    :label="$t('type_of_drive')"
                    :options="
                      data.transmissions.map((o) => ({
                        name: $t('type_of_drive_values')[o.box],
                        key: o.box,
                      }))
                    "
                    :value="form.transmission"
                    @change="changeTransmission($event)"
                  />
                </div>
              </div>

              <!--              modification-->
              <div v-if="data.modifications && data.modifications.length && form.transmission" class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    v-if="sellModifications"
                    :title="$t('modification')"
                    rejectKey="modification"
                    required
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3 pl-0">
                  <form-select
                    v-model="form.modification"
                    :disabled="user.admin_group == 2"
                    :label="$t('modification')"
                    :options="
                    sellModifications.map((o) => ({
                      name: getModificationName(o),
                      key: parseInt(o.id),
                    }))
                  "
                    :value="form.modification"
                    @change="changeModification($event)"
                  />

                </div>
                <div class="col-12 col-lg-9">
                  <span
                    v-if="smsRadarData && smsRadarData.engincapacity"
                    class="ma-smsradar"
                  >
                  <strong>SMSRadar: </strong>   <p>{{ smsRadarData.engincapacity / 1000 }}</p>
               </span>
                </div>
              </div>

              <!--              --------------------------------------------------- --------------------  ----------------->
<!--              <pre>-->
<!--                {{form}}-->
<!--              </pre>-->
              <!--     sell last step ------  -->
              <div v-if="form && form.media && form.media.length">
                <sell-last-step
                  :key="lastStepKey"
                  :announcement="JSON.parse(JSON.stringify(form))"
                  :colors="colors"
                  :edit="user.admin_group !== 2"
                  :restore="form.status == 3"
                  :smsRadarData="smsRadarData"
                  :title="$t('moderator')"
                  type="cars"
                  @changeReason="changeReason"
                  @close="$router.push(pageRef || $localePath('/profile/announcements'),)"
                  @formChanged="(e) => form = e"
                  @getRejectObj="getSellLastStepRejectObj"
                />
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
                      v-if="!rejectObj.rejectArray.length && !sellLastStepRejectObj.rejectArray.length"
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
                        rejectObj.rejectArray.filter((item) => !rejectObj.reject360.includes(item)).length === 0 && (!sellLastStepRejectObj.rejectArray.length)
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
    <modal-popup
      :modal-class="'offer-payment-modal'"
      :title="$t('transfer_to_supervisor')"
      :toggle="transfer.isOpen"
      @close="transfer.isOpen = false"
    >
      <div class="row">
        <div class="col-12 mt-2">
          <form-textarea
            v-model="transfer.comment"
            :maxlength="3000"
            :placeholder="$t('transfer_comment')"
          />
        </div>
        <div class="col-12 mt-2">
          <button
            v-if="user.admin_group && user.admin_group == 2"
            :class="['btn btn--green', { pending }]"
            class="mb-2"
            type="button"
            @click="transferToSupervisor()"
          >
            {{ $t('transfer_to_supervisor') }}
          </button>

        </div>
      </div>

    </modal-popup>
  </div>
  <div v-else-if="!announcementIsAvailable && !loading" class="d-flex flex-column justify-content-center h-300">
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
      deleteArr:[]
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
    files() {
      return (this.form?.media || []).map((media, i) => ({
        media,
        key: this.form.media[i],
      }))
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
      setInterval(() => {
        let timer = moment().diff(moment(admin_user.user.created_at))
        var duration = moment.duration(timer)
        var days = duration.days(),
          hrs = duration.hours(),
          mins = duration.minutes(),
          secs = duration.seconds()

        if (hrs.toString().length === 1) hrs = '0' + hrs
        if (mins.toString().length === 1) mins = '0' + mins
        if (secs.toString().length === 1) secs = '0' + secs
        let _return = ''

        if (days > 0) _return += days + 'd. '

        _return += hrs + ':' + mins + ':' + secs
        this.$store.commit('moderator/changeTimerData', {
          data: _return,
          unix: timer / 1000,
        })
      }, 1000)
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
          property: 'boxes',
        })

        this.handleTransmissions(this.boxes);
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
        this.data.sellBodies = this.sellBodiesModerator;

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
          gearing: data.announce?.car_catalog?.box_id, // engines
          modification: data.announce.car_catalog.main[' ']['box'],
          transmission: data.announce?.car_catalog?.main[' ']['type_of_drive'], // gearing
          capacity: data.announce?.car_catalog?.capacity,
          power: data.announce?.car_catalog?.power,
          year: data.announce?.year,
          auction: data.announce?.auction,
          end_date: moment(data.announce?.end_date).format('DD.MM.YYYY HH:mm'),
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
          price: data.announce?.price_int || '',
          owner_type: parseInt(data.announce?.owner_type) || 0,
          currency: data.announce?.currency_id || 1,
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
          customs_clearance: data.announce?.customs_clearance || false,
          tradeable: data.announce?.exchange_possible,
          credit: data.announce?.credit,
          guaranty: data.announce?.in_garanty,
          saved_images: data.announce?.mediaIds,
          media: data.announce.media,
          engine: data.announce?.car_catalog.engine_id,
          message: "test",
          user: data.announce.user,
          status: data.announce.status,
          rejectArray: this.rejectObj.rejectArray,
        };
        this.getColors();
        this.announcementIsAvailable = true;
        this.loading = false;
        this.checkWithVin()

        // this.getGenerations();
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
          model: this.form.model_slug,
        })
        this.handleYears(this.sellYears);
      }
    },
    async getSellBodies() {
      if (this.form.year) {
        await this.$store.dispatch('getSellBody', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug,
          year: this.form.year,
        })
        this.data.sellBodies = this.sellBodies;
      }
    },
    async getGenerations() {
      if (this.form.car_body_type) {
        await this.$store.dispatch('getSellGenerations', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug,
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
          model: this.form.model_slug,
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
          model: this.form.model_slug,
          year: this.form.year,
          body: this.form.car_body_type,
          generation: this.form?.generation_id,
          engine: this.form?.engine,
        })
        this.data.gearings = this.sellGear;
      }
    },
    async getSellTransmissions() {
      if (this.form.engine) {
        await this.$store.dispatch('getSellTransmissions', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug,
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
      if (this.form.transmission) {
        await this.$store.dispatch('getSellModifications', {
          brand: this.form.brand_slug || this.form.brandObj.slug,
          model: this.form.model_slug,
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

    // handle lists
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
      let generation = this.sellGenerations.find(
        (o) => o.id === this.form?.generation_id,
      )
      let name = `${this.$t('box_mode_values')[o.box]}/${
        generation.start_year
      } - ${generation.end_year || this.currentYear}`
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
    async handleChange(value, action, keys, props, nextKey) {
      // if (this.user.admin_group == 2) {
      //   return
      // } else {
      //   if (!this.disableScroll) {
      //     if (keys[0] === 'car_catalog_id' && !this.isMobileBreakpoint) {
      //       setTimeout(() => {
      //         window.scrollTo({top: 1000, behavior: 'smooth'})
      //       }, 500)
      //     } else if (keys[0] === 'car_catalog_id' && this.isMobileBreakpoint) {
      //       window.scrollTo({top: 1200, behavior: 'smooth'})
      //       setTimeout(() => {
      //         // window.location.href = '#sellLastStepUploadImage'
      //         const el = document.querySelector('#anchor-saved_images')
      //         el.scrollIntoView({block: 'start', behavior: 'smooth'})
      //       }, 500)
      //     }
      //   }
      //
      //   clearTimeout(this.timeout)
      //   let $container
      //   if (this.isMobileBreakpoint) {
      //     $container = document.querySelector('.mobile-screen .container')
      //     if (action) $container.style.minHeight = `${$container.scrollHeight}px`
      //   }
      //   // clean store props
      //   props.map((property) => {
      //     this.mutate({property, value: []})
      //   })
      //   // update form prop
      //   this.$emit('update-form', {key: keys[keys.length - 1], value})
      //   // skip step for the last input
      //   if (!action) return // clean form props
      //     ;
      //   [
      //     'car_body_type',
      //     'generation_id',
      //     'gearing',
      //     'transmission',
      //     'modification',
      //     'car_catalog_id',
      //   ].map((key) => {
      //     if (!keys.includes(key)) this.$emit('update-form', {key, value: ''})
      //   })
      //   // get values for the next input
      //   let values = this.getFormValues([...keys, 'brand', 'model', 'year'])
      //   await this[action](values)
      //   // move next if only one option available
      //   this.$nextTick(() => {
      //     let options = this[action.replace('getSell', 'sell')]
      //     if (options.length === 1 && nextKey !== 'car_catalog_id') {
      //       let nextValue =
      //         options[0].engine ||
      //         options[0].type_of_drive ||
      //         options[0].box ||
      //         options[0].id
      //       this.$emit('update-form', {key: nextKey, value: nextValue})
      //     } else if (this.isMobileBreakpoint) {
      //       this.timeout = setTimeout(() => {
      //         this.scrollTo(this.$refs[`sell-${nextKey}`], -34, 500)
      //         $container.style.minHeight = ''
      //       }, 100)
      //     }
      //     if (!this.isMobileBreakpoint) {
      //       this.timeout = setTimeout(() => {
      //         this.scrollTo(this.$refs[`sell-${nextKey}`], -20, 500)
      //       }, 100)
      //     }
      //   })
      //
      // }
    },

    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.rejectObj.showPhotoReject = true
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
      this.sellLastStepRejectObj = value;
      value.show360Reject = this.rejectObj.show360Reject;
      value.showPhotoReject = this.rejectObj.showPhotoReject;
      value.reject360 = this.rejectObj.reject360;
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
        console.log(item)
        arr.push(item);
      }
      this.data.modifications = arr;

    },

    //handle change
    async changeBrand(e) {
      this.form.model_id = null;
      this.form.model = {};
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
      console.log("change year")
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
      this.form.modification = null;
      this.getSellModifications();
    },

    async changeModification(e) {
      return e;
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
        this.$router.push({path: this.localePath('/e-services')});
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

      let formData = new FormData()

      this.form.status = status
      // this.form.brand = this.brand
      // this.form.model = this.form.model_id
      // this.form.year = this.year
      // this.form.generation = this.generation
      // this.form.car_catalog_id = this.modification
      // this.form.rejectArray = this.rejectArray
      // this.form.main_image = this.main_image
      // this.form.saved_images = this.saved_images
      formData.append('data', JSON.stringify(this.form))
      formData.append('deletedImages', JSON.stringify(this.deleteArr))

      this.loading = true;
      this.button_loading = true
      try {
        await this.$axios.$post('/ticket/car/' + this.single_announce.id, formData)

        if (this.user.admin_group == 2) {
          location.href = '/'
        } else {
          location.href = '/'
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
  },
  mounted() {
    this.getAnnounceData()
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (this.form.brandObj == {}) {
          this.form.model_id = null;
          this.form.model = {};
        }
        if (this.form.brand_id == null) {
          this.form.model_id = null;
          this.form.model = {};
        }
        if (this.form.brand == null) {
          this.form.model_id = null;
          this.form.model = {};
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
          this.form.modification = null;
        }
      }
    }
  }
}
</script>
