<template>
  <div class="pages-announcement-edit">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div :class="{ card: !isMobileBreakpoint }">
            <div class="mb-5">
              <table>
                <tr>
                  <td><h3>Qeyd edilib:</h3></td>
                  <td><brand :brand="single_announce.brand" /></td>
                  <td>
                    <button
                      :class="['btn full-width', `btn--dark-blue`]"
                      @click="openModal('brands')"
                    >
                      <icon name="edit" />
                      {{ $t('edit') }}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><h3>Qeyd edilib:</h3></td>
                  <td>
                    <brand :brand="single_announce.model" cover />
                  </td>
                  <td>
                    <button
                      :class="['btn full-width', `btn--dark-blue`]"
                      @click="openModal('models')"
                    >
                      <icon name="edit" />
                      {{ $t('edit') }}
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <modal-popup :toggle="showModal" @close="showModal = false">
        <model-options
          key="model"
          :options="brands"
          :title="$t('mark')"
          :status-title="$t('select_model')"
          :input-title="$t('model_name')"
          :value="form.brand"
          :sort-alphabetically="true"
          :img-key="'transformed_media'"
          :img-placeholder="`/logos/car-${colorMode}.svg`"
          :considerPopular="false"
          highlightSelected
          enlarge-columns
        />
      </modal-popup>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

// ./././././././././././
import SellLastStep from '~/components/sell/SellLastStep'
import SellPreview from '~/components/sell/SellPreview'
import Brand from '~/components/moderator/brand.vue'
import EditButton from '~/components/announcements/EditButton'
import ModelOptions from '~/components/options/ModelOptions'

export default {
  layout: 'ticket',
  components: {
    SellLastStep,
    SellPreview,
    Brand,
    EditButton,
    ModelOptions,
  },
  watch: {
    'form.comment'(v) {
      if (v) this.$nuxt.$emit('progress_change', { type: 'desc', count: 2 })
      else this.$nuxt.$emit('progress_change', { type: 'desc', count: 0 })
      this.getInfo()
    },
  },
  async asyncData({ store, $axios, $auth, route }) {
    await $auth.setUserToken(`Bearer ${route.query.token}`)

    const admin_user = await $axios.$get('/user')

    if (!admin_user.user.is_admin) {
      return false
    }
    $auth.setUser(admin_user.user)
    let data
    console.log(',.,.,.,.data............', data)
    try {
      data = await $axios.$get('/ticket/car')
      store.commit('moderator/moderatorMutator', {
        with: data.announce,
        property: 'single_announce',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.brands,
        property: 'brands',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.models,
        property: 'models',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.sellYears,
        property: 'years',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.sell_bodies,
        property: 'sell_body',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.generations,
        property: 'sell_generations',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.engines,
        property: 'sell_engines',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.type_of_drives,
        property: 'sell_gearing',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.boxes,
        property: 'transmissions',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.modifications,
        property: 'modifications',
      })

      return {
        other_vin_value: 'https://ru.vindecoder.pl/' + data.announce.vin,
        brand: data.announce.brand.slug,
        model: data.announce.model.slug,
        year: data.announce.year,
        body: data.announce.car_catalog.car_type_id,
        generation: data.announce.generation.id,
        engine: data.announce.car_catalog.engine_id,
        gearing: data.announce.car_catalog.gearing_id,
        transmission: data.announce.car_catalog.box_id,
        modification: data.announce.car_catalog.id,

        old_brand: data.announce.brand.name,
        old_model: data.announce.model.name,
        old_year: data.announce.year,
        old_body: data.announce.car_catalog.car_type.name,
        old_generation: data.announce.generation.name,
        old_engine: data.announce.car_catalog.engine_id,
        old_gearing: data.announce.car_catalog.gearing_id,
        old_transmission: data.announce.car_catalog.box_id,
        old_modification:
          data.announce.car_catalog.power +
          ' - ' +
          data.announce.car_catalog.capacity +
          ' ' +
          data.announce.car_catalog.complect_type,

        admin_user: admin_user.user,
        moderator: data ? data.moderator : {},
      }
    } catch (e) {
      store.commit('moderator/moderatorMutator', {
        with: {},
        property: 'single_announce',
      })
    }

    return {
      admin_user: admin_user.user,
      moderator: data ? data.moderator : {},
    }
  },
  async fetch({ store }) {
    await store.dispatch('getOptions')
    await store.dispatch('getAllOtherOptions')
    await store.dispatch('getPopularOptions')
    await store.dispatch('getColors')
    await store.dispatch('getBadges')
    await store.dispatch('moderator/setSellSavedItems')
  },
  data() {
    return {
      button_loading: false,
      smsRadarData: false,
      openLog: false,
      transferModal: false,
      transferComment: '',
      getTimer: {
        data: '',
        unix: 0,
      },
      rejectArray: [],
      reject360: ['360_photo_reject_1'],
      show_option: false,
      refresh: 1,
      show: {},
      selectedIndex: {},
      errors: [],
      option_toggle: 1,
      cars_parts: [
        {
          name: this.$t('front_bamp'),
          classes: 'state__front',
        },
        {
          name: this.$t('front_left_door'),
          classes: 'state__FrontLeftDoor',
        },
        {
          name: this.$t('back_right_door'),
          classes: 'state__FrontRearRight',
        },
        {
          name: this.$t('front_right_door'),
          classes: 'state__FrontRightDoor',
        },
        {
          name: this.$t('back_left_door'),
          classes: 'state__FrontRearLeft',
        },
        {
          name: this.$t('roof'),
          classes: 'state__roof',
        },
        {
          name: this.$t('back_bamp'),
          classes: 'state__rear',
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
        this.$t('other'),
      ],
      selectedBadges: [],
      saved_images: [],
      modalIsActive: false,
      files: {},
      date: Math.floor(Date.now() / 1000),
      imagesBase64: [],
      deleteArr: [],
      showStoreSelect: false,
      announceId: false,
      form: {
        auction: '',
        end_date: '',
        country_id: '',
        video_360_id: '',
        interior_360_id: '',
        delay_comment: '',
        comment: '',
        is_matte: false,
        part: {},
        generation_id: '',
        model: '',
        brand: '',
        show_car_number: false,
        show_vin: false,
        gearing: '',
        car_body_type: '',
        modification: '',
        transmission: '',
        car_number: '',
        selectedColor: [],
        year: '',
        all_options: {},
        badges: {},
        address: '',
        region_id: '',
        month: '',
        mileage: '',
        lat: '',
        lng: '',
        vin: '',
        is_new: 0,
        customs_clearance: 0,
        price: '',
        new_badges: [],
        owner_type: 0,
        currency: 0,
        status: 2,
        youtube: {
          id: '',
          thumb: '',
        },
      },
      showPhotoReject: false,
      show360Reject: false,
      video360: null,
      main_image: null,
      // ./././
      showModal: false,
      lastStepKey: 0,
      showBrands: false,
      showModels: false,
    }
  },
  async created() {
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`)
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)
    if (this.admin_user.admin_group == 2) {
      this.$nextTick(() => {
        setInterval(() => {
          let timer = moment().diff(moment(this.moderator.created_at))
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

          this.getTimer.data = _return
          this.getTimer.unix = timer / 1000
        }, 1000)
      })
    }

    if (this.single_announce.id) {
      //this.$cookies.set('sell_years', this.single_announce.brand.slug);

      let announce = JSON.parse(JSON.stringify(this.single_announce))

      this.announceId = announce.id
      this.video360 = announce.video360
      this.form.id = announce.id
      this.form.id_unique = announce.id_unique
      this.form.is_matte = announce.is_matte
      this.saved_images = announce.mediaIds
      this.form.selectedColor = announce.colors
      this.form.mileage = announce.mileage
      this.form.address = announce.address
      this.form.beaten = announce.broken
      this.form.is_new = announce.is_new
      this.form.customs_clearance = announce.customs_clearance
      this.form.region_id = announce.region_id
      this.form.lat = announce.latitude
      this.form.lng = announce.longitude
      this.form.price = this.numericPrice()
      this.form.end_date = announce.end_date
      this.form.auction = announce.auction
      this.form.country_id = announce.country_id
      this.form.currency = announce.currency_id
      this.form.tradeable = announce.exchange_possible
      this.form.credit = announce.credit
      this.form.owner_type = announce.owner_type
      this.form.show_car_number = announce.show_car_number
      this.form.show_vin = announce.show_vin
      this.form.guaranty = announce.in_garanty
      this.form.car_number = announce.car_number
      this.form.vin = announce.vin

      this.form.modification = this.$t('box_values')[
        announce.car_catalog.main[' ']['box']
      ]
      this.form.gearing = this.$t('engine_values')[
        announce.car_catalog.main['  ']['engine']
      ]
      this.form.transmission = this.$t('type_of_drive_values')[
        announce.car_catalog.main[' ']['type_of_drive']
      ]

      this.form.brand = announce.brand.slug
      this.form.model = announce.model.slug
      this.form.capacity = announce.car_catalog.capacity + ' л'
      this.form.power = announce.car_catalog.power + 'л.с.'
      this.form.comment = announce.comment
      this.getYoutube(announce.youtube_id)
      this.form.generation_id = announce.car_catalog.generation_id
      this.form.car_body_type = announce.car_catalog.car_type.id
      this.form.part =
        announce.car_body_health == null
          ? {}
          : JSON.parse(announce.car_body_health.options)
      this.$set(
        this.form,
        'all_options',
        Array.isArray(announce.options) ? {} : announce.options,
      )
      this.form.sell_store = announce.store_id
      this.form.status = announce.status

      Object.keys(this.form.part).map((key) => {
        this.selectedIndex[key] = key
      })
      announce.stickers.map((item, key) => {
        this.form.badges[key] = item.id
        this.selectedBadges[key] = item.id
      })

      await this.checkWithDin()
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('publish_post')
    this.$toasted.clear()
  },
  methods: {
    openModal(type) {
      this.showModal = true
      if (type == 'models') {
        this.getModels()
      } else return
    },

    // /././././././././././
    async handleRemoveInterior() {
      try {
        this.button_loading = true
        await this.$axios.$post('/announce/remove_360_interior', {
          announcement_id: this.single_announce.id,
        })
        this.$emit('remove360', 'success')
        let data = await this.$axios.$get('/ticket/car')
        console.log('data 1', data)
        this.$store.commit('moderator/moderatorMutator', {
          with: data.announce,
          property: 'single_announce',
        })
        this.$toasted.success('Silindi')
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

        this.$store.commit('moderator/moderatorMutator', {
          with: data.announce,
          property: 'single_announce',
        })
      }
    },
    selectMainImage(param) {
      this.main_image = param
    },
    add360Video(val) {
      var formData = new FormData()
      formData.append('video', val.target.files[0])

      this.$axios
        .post('' + '/upload_temporary_video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.success(this.$t('video_360_successfully_upload'))
            this.form.video_360_id = res.data.data.id
          }
        })
    },

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
            this.form.interior_360_id = res.data.data.id
          }
        })
    },

    checkOrherVin() {
      window.open(this.other_vin_value, '_blank')
    },
    checkWithDin() {
      let vin = this.form.vin
      let car_number = this.form.car_number.replace(/[^0-9a-zA-Z]+/g, '')

      let sendData = {
        announce_id: this.announceId,
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

        this.$nuxt.$emit('loading_status', false)
      })
    },
    ifPopularCommentsEmpty() {
      return _.isEmpty(this.getPopularComments)
    },
    getValue(key, value) {
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
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.showPhotoReject = true
      } else if (rejectKey === '360') {
        this.show360Reject = true
      } else {
        if (this.rejectArray.includes(rejectKey)) {
          this.rejectArray.splice(this.rejectArray.indexOf(rejectKey), 1)
        } else {
          this.rejectArray.push(rejectKey)
        }
      }
    },
    async handleChange(v, calledMethod) {
      switch (v.key) {
        case 'brand':
          this.brand = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'models',
            with: [],
          })
        case 'model':
          this.model = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'years',
            with: '',
          })
        case 'year':
          this.year = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'sell_body',
            with: [],
          })
        case 'body':
          this.body = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'sell_generations',
            with: [],
          })
        case 'generation':
          this.generation = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'sell_engines',
            with: [],
          })
        case 'engine':
          this.engine = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'sell_gearing',
            with: [],
          })
        case 'gearing':
          this.gearing = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'transmissions',
            with: [],
          })
        case 'transmission':
          this.transmission = 0
          this.$store.commit('moderator/moderatorMutator', {
            property: 'modifications',
            with: [],
          })
        case 'modification':
          this.modification = 0
      }
      if (calledMethod) this[calledMethod](v.value.key)
      else {
        this.modification = v.value.key
      }
      this.refresh += 15
    },
    async getYear(model) {
      this.model = model
      await this.$store.dispatch('getSellYears', {
        model: this.brand,
        years: model,
      })
    },
    async getBody(item) {
      this.year = item
      await this.$store.dispatch('getSellBody', {
        model: this.brand,
        years: this.model,
        body: item,
      })
    },
    async getGeneration(body) {
      this.body = body
      this.$store.dispatch('removeSellGenerations')
      await this.$store.dispatch('getSellGeneration', {
        model: this.brand,
        years: this.model,
        body: this.year,
        generation: body,
      })
    },
    async getEngine(generation) {
      this.generation = generation
      await this.$store.dispatch('getSellEngine', {
        model: this.brand,
        years: this.model,
        body: this.year,
        generation: this.body,
        own_generation: generation,
      })
    },
    async getSellGearing(engine) {
      this.engine = engine
      await this.$store.dispatch('getSellGearing', {
        model: this.brand,
        years: this.model,
        gearing: engine,
        engine: this.generation,
        generation: this.body,
      })
    },
    async getSellTransmission(gearing) {
      this.gearing = gearing
      await this.$store.dispatch('getSellTransmission', {
        model: this.brand,
        years: this.model,
        gearing: this.engine,
        engine: this.generation,
        generation: this.body,
        transmission: gearing,
      })
    },
    async getSellModifications(transmission) {
      this.transmission = transmission
      await this.$store.dispatch('getSellModifications', {
        model: this.brand,
        years: this.model,
        gearing: this.engine,
        engine: this.generation,
        generation: this.body,
        transmission: this.gearing,
        modification: transmission,
      })
    },
    removeBagde(badgeId) {
      for (let key in this.selectedBadges) {
        if (this.selectedBadges[key] === badgeId) {
          this.selectedBadges.splice(key, 1)
        }
      }

      for (let key in this.form.badges) {
        if (this.form.badges[key] === badgeId) {
          delete this.form.badges[key]
        }
      }
    },
    addComment(e) {
      if (this.form.comment === null) this.form.comment = ''
      this.form.comment = this.form.comment + e + ' '
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
    passBase64Images(val) {
      this.imagesBase64 = val
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

      this.$nuxt.$emit('progress_change', { type: 'all', count: i, all: 33 })
    },
    getColor() {
      return this.colors.find((item) => item.id === this.form.selecttedColor)
    },
    getLatLng(latLng) {
      this.form.lat = latLng.lat
      this.form.lng = latLng.lng
    },
    getAddress(address) {
      this.form.address = address
      this.address = address
      this.getInfo()
    },
    closeModal() {
      this.modalIsActive = false
    },

    closePopup() {
      this.showPhotoReject = false
      this.show = {}
    },
    close360Popup() {
      this.show360Reject = false
      this.show = {}
    },

    handleMultiselect(v) {
      this.removeFromError(v.key)
      this.form[v.key] = v.value.key
      this.getInfo()
    },

    saveToData(v) {
      this.selectedIndex[v.index] = v.index
      this.form.part[v.index] = v.data
      this.changeProgressSingle('part')
      this.getInfo()
    },

    removeFromData(v) {
      delete this.selectedIndex[v.index]
      delete this.form.part[v.index]
      this.changeProgressSingle('part')
      this.getInfo()
    },

    savePhotoIssues(v) {
      var validCheckbox = true
      Object.keys(v.data).map((key) => {
        if (this.rejectArray.includes(key)) {
          this.rejectArray.splice(this.rejectArray.indexOf(key), 1)
        }

        if (v.data[key]) {
          validCheckbox = false
          this.rejectArray.push(key)
        }
      })

      this.$nuxt.$emit('image-checkbox-change', validCheckbox)
    },
    save360Issues(v) {
      var validCheckbox = true
      console.log(v.data, this.rejectArray)
      Object.keys(v.data).map((key) => {
        if (this.rejectArray.includes(key)) {
          this.rejectArray.splice(this.rejectArray.indexOf(key), 1)
        }

        if (v.data[key]) {
          validCheckbox = false
          this.rejectArray.push(key)
        }
      })

      this.$nuxt.$emit('360-checkbox-change', validCheckbox)
    },
    handleShortcut(obj) {
      this.$nuxt.$emit('accordion-change')
      let key = Object.keys(obj.event)[0]
      let toggle = obj.event[key]
      if (!toggle) {
        if (Array.isArray(this.form.all_options[key])) {
          const index = this.form.all_options[key].indexOf(obj.selected_key)
          return this.form.all_options[key].splice(index, 1)
        } else return this.$delete(this.form.all_options, key)
      }

      if (this.getMultiple(key)) {
        let exists_arr = this.form.all_options[key]
          ? this.form.all_options[key]
          : []
        return this.handleAllOptions({
          value: [obj.selected_key, ...exists_arr],
          key: key,
        })
      }

      return this.handleAllOptions({
        value: { key: obj.selected_key || 1 },
        key: key,
      })
    },
    handleAllOptions(v) {
      const key = Object.keys(v)[0]
      if (
        v[key] ||
        (v.value && v.value.key) ||
        (v.value && Array.isArray(v.value))
      ) {
        if (Array.isArray(v.value)) {
          if (v.value.length) this.$set(this.form.all_options, v.key, v.value)
          else this.$delete(this.form.all_options, v.key)
        } else if (
          typeof v.value === 'object' &&
          Object.keys(v.value).length === 0
        ) {
          this.$delete(this.form.all_options, v.key)
        } else if (v.key) {
          this.$set(this.form.all_options, v.key, v.value.key)
        } else {
          this.$set(this.form.all_options, key, v[key])
        }
      } else if (v.key) {
        this.$delete(this.form.all_options, v.key)
      } else {
        this.$delete(this.form.all_options, key)
      }
      this.getInfo()
      this.changeProgressSingle('all_options')
    },
    handleBackList() {
      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators'
      } else {
        location.href = '/alvcp/resources/announcements'
      }
    },
    showSellModal(index) {
      this.show = {}
      this.show[index] = index
    },

    _can_upload_file(key) {
      let file = this.files[key]

      return
      if (file.attempted || file.bad_size) {
        return false
      }
      return true
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/' + this.announceId + '/car')
      return (location.href = '/alvcp/resources/announcements')
    },
    async transferToSupervisor(withRejectReason = false) {
      this.button_loading = true

      if (withRejectReason) {
        this.transferComment = this.rejectArray
      }

      await this.$axios.$post('/ticket/transfer/car/' + this.announceId, {
        comment: this.transferComment,
      })

      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators'
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

      let formData = new FormData()

      this.form.status = status
      this.form.brand = this.brand
      this.form.model = this.model
      this.form.year = this.year
      this.form.generation = this.generation
      this.form.car_catalog_id = this.modification
      this.form.rejectArray = this.rejectArray
      this.form.main_image = this.main_image
      this.form.saved_images = this.saved_images
      formData.append('data', JSON.stringify(this.form))
      formData.append('deletedImages', JSON.stringify(this.deleteArr))

      this.$nuxt.$emit('loading_status', true)
      this.button_loading = true
      try {
        await this.$axios.$post('/ticket/car/' + this.announceId, formData)

        if (this.admin_user.admin_group == 2) {
          location.href = '/alvcp/resources/announce-moderators'
        } else {
          location.href = '/alvcp/resources/announcements'
        }
      } catch ({
        response: {
          data: { data },
        },
      }) {
        this.$nuxt.$emit('loading_status', false)
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
                      .scrollIntoView({ behavior: 'smooth', block: 'center' })
                  toastObject.goAway(0)
                },
              },
            })
          })
      }
    },
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
              data: { data },
            },
          }) {
            this.$nuxt.$emit('remove_image_by_index', this.saved_images.length)
            this.$nuxt.$emit('remove_image_on_catch')
            this.errors = []
            this.$toasted.clear()
            Object.keys(data).map((key) => {
              this.$toasted.show(data[key], { type: 'error' })
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
    move(input, from, to) {
      let numberOfDeletedElm = 1
      const elm = input.splice(from, numberOfDeletedElm)[0]
      numberOfDeletedElm = 0
      input.splice(to, numberOfDeletedElm, elm)
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

    getChangeOption(v) {
      if (v) this.option_toggle = 0
      else this.option_toggle = 1
    },
    checkboxChanged(v) {
      let key = Object.keys(v)[0]
      this.form[key] = v[key]
      if (key === 'customs_clearance') this.form.car_number = ''
      this.getInfo()
    },
    getCurrency(v) {
      this.form.currency = v.key
      this.getInfo()
    },
    addNewBadge(v) {
      this.selectedBadges.push(...v)
      this.form.new_badges = v
      this.getInfo()
    },
    changeBadge(v) {
      this.selectedBadges.push(...v)
      this.form.badges = v
      this.getInfo()
    },
    removeFromError(type) {
      var index = this.errors.indexOf(type)
      if (index !== -1) this.errors.splice(index, 1)
    },
    getChange(v, type) {
      this.removeFromError(type)
      if (type === 'selectedColor') {
        if (this.form[type].includes(v))
          this.form[type] = this.form[type].filter((ids) => ids !== v)
        else {
          if (this.form[type].length !== 2)
            this.form[type] = [...this.form[type], v]
        }
      } else {
        this.form[type] = v
      }
      this.getInfo()
      if (type === 'mileage' || type === 'selectedColor')
        this.changeProgress('mileage', 'selectedColor')
      else if (type === 'price' || type === 'name')
        this.changeProgress('price', 'name')
    },
    changeProgressSingle(key) {
      let status = 0
      if (Object.keys(this.form[key]).length) {
        status = 2
      }
      this.$nuxt.$emit('progress_change', { type: key, count: status })
    },
    changeProgress(key1, key2) {
      let status = 0

      if (this.form[key1]) {
        status = 1
      }
      if (this.form[key2]) {
        status = 1
      }
      if (this.form[key1] && this.form[key2]) {
        status = 2
      }
      this.$nuxt.$emit('progress_change', {
        type: key1 + '_' + key2,
        count: status,
      })
    },

    getYoutube(val) {
      this.form.youtube.id = val
      this.form.youtube.thumb = `https://img.youtube.com/vi/${val}/hqdefault.jpg`
      this.getInfo()
    },

    numericPrice() {
      return this.single_announce.price.replace(/\D/g, '')
    },

    async getModels() {
      await this.$store.dispatch('getModels', this.single_announce.brand.slug)
    },
  },
  computed: {
    ...mapState([
      'brands',
      'models',
      'years',
      'sell_body',
      'sell_generations',
      'sell_engines',
      'sell_gearing',
      'transmissions',
      'modifications',
    ]),
    ...mapGetters([
      'colors',
      'sell_options',
      'all_sell_options',
      'badges',
      'moderator/single_announce',
      'getPopularComments',
      'sell_saved_items',
    ]),
    ...mapGetters({
      single_announce: 'moderator/single_announce',
    }),

    getBtlUserName() {
      return this.single_announce.btl_announces.find(
        (item) => item.announce_id === this.single_announce.id,
      ).get_user.full_name
    },

    getBrands() {
      let dates = []
      for (const key in this.brands) {
        dates.push({
          key: this.brands[key].slug,
          name: this.brands[key].name,
        })
      }
      return dates
    },
    getYears() {
      let dates = []
      for (let i = this.years.max; i >= this.years.min; i--) {
        dates.push({
          key: i,
          name: i,
        })
      }
      return dates
    },
    getBodies() {
      let dates = []
      for (const key in this.sell_body) {
        dates.push({
          key: this.sell_body[key].id,
          name: this.sell_body[key].name[this.locale],
        })
      }
      return dates
    },
    getGenerations() {
      let dates = []
      for (const key in this.sell_generations) {
        dates.push({
          key: this.sell_generations[key].id,
          name: this.sell_generations[key].name[this.locale],
        })
      }
      return dates
    },
    getEngines() {
      let dates = []
      for (const key in this.sell_engines) {
        dates.push({
          key: parseInt(key),
          name: this.$t('engine_values')[key],
        })
      }
      return dates
    },
    getGearing() {
      let dates = []
      for (const key in this.sell_gearing) {
        dates.push({
          key: parseInt(key),
          name: this.$t('type_of_drive_values')[key],
        })
      }
      return dates
    },
    getTransmission() {
      let dates = []
      for (const key in this.transmissions) {
        dates.push({
          key: parseInt(key),
          name: this.$t('box_values')[key],
        })
      }
      return dates
    },

    getModifications() {
      let dates = []
      for (const key in this.modifications) {
        let value =
          this.modifications[key].power +
          ' - ' +
          this.modifications[key].capacity +
          ' - ' +
          this.$t(this.$t('box_values')[this.modifications[key].box]) +
          ' ' +
          this.modifications[key].complect_type
        dates.push({
          key: parseInt(this.modifications[key].id),
          name: value,
        })
      }
      return dates
    },

    getSelectedGeneration() {
      return (
        this.sell_generations.filter((gen) => {
          return gen.id === this.engine
        })[0] || {}
      )
    },
    item() {
      return {
        ...this.form,
        color: this.getColor(),
        car_catalog: this.single_announce.car_catalog,
      }
    },
    carTypeText() {
      return this.single_announce.car_catalog.car_type.name[this.locale]
    },
    color() {
      return this.getColor()
    },
    computedStore() {
      return this.$store
    },

    crumbs() {
      return [
        // { name: this.$t('my_announces'), route: `/profile/announcements` },
        // { name: `#${this.myAnnouncement.id_unique}`, route: `/cars/announcement/16642054490` },
        { name: this.$t('moderator') },
      ]
    },
  },
  mounted() {
    console.log(this.$store)
    this.getModels()
  },
}
</script>
