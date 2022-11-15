<template>
  <div style="margin: 10px 0 20px 0;">
    <h1>moto </h1>
  </div>
</template>
<script>

export default {
  layout: 'ticket',

  async fetch({store}) {
    await store.dispatch('getOptions');
    await store.dispatch('getScooterOptions');
    await store.dispatch('getAllOtherOptions');
    await store.dispatch('getColors');
    await store.dispatch('getBadges');
  },

  async asyncData({route, store, $auth, $axios}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`);
    const admin_user = await $axios.$get('/user');
    if (!admin_user.user.is_admin) {
      return false;
    }

    await store.dispatch('getMotoOptions');

    let data;
    try {
      data = await $axios.$get(`/ticket/moto?type=${route.query.type}`);
      store.commit('mutate', {
        with: data.announce,
        property: 'single_announce'
      })

      let default_data = {};
      let s_ann = store.state.single_announce;
      let brand;
      let model;
      let type;
      default_data['engine'] = s_ann.engine_type_id;
      default_data['volume'] = s_ann.capacity;
      default_data['power'] = s_ann.power;
      default_data['cylinders'] = s_ann.cylinders;
      default_data['box'] = s_ann.box_id;
      default_data['cylinder_placement'] = s_ann.cylinder_type_id;
      default_data['number_of_vehicles'] = s_ann.tact;
      default_data['drive'] = s_ann.gear_id;
      default_data['capacity'] = s_ann.capacity;

      if (s_ann.moto_brand !== undefined) {
        default_data['category'] = "1";
        await store.dispatch('getMotoModels', {id: s_ann.moto_brand.id, index: 0})
        brand = s_ann.moto_brand;
        model = s_ann.moto_model;
        /*  type  = s_ann.moto_type_id;*/
      }
      if (s_ann.scooter_brand !== undefined) {
        default_data['category'] = "2";
        await store.dispatch('getScooterModels', {id: s_ann.scooter_brand.id, index: 0})
        brand = s_ann.scooter_brand;
        model = s_ann.scooter_model;
      }
      if (s_ann.moto_atv_brand !== undefined) {
        default_data['category'] = "3";
        await store.dispatch('getMotoAtvModels', {id: s_ann.moto_atv_brand.id, index: 0})
        brand = s_ann.moto_atv_brand;
        model = s_ann.moto_atv_model;
        /*  type  = s_ann.moto_atv_type_id;*/
      }
      return {
        admin_user: admin_user.user,
        default_data: default_data,
        old_brand: brand.name,
        old_model: model.name,
        old_type: type,
        brand: brand.id,
        model: model.id,
        year: s_ann.year,
        /*type,*/
        moderator: data ? data.moderator : {},
        //old_model: data.announce.model.name,
      }
    } catch (e) {
      store.commit('mutate', {
        with: {},
        property: 'single_announce'
      })
    }
    return {
      admin_user: admin_user.user,
      moderator: data ? data.moderator : {},
    }
    // await store.dispatch('editMoto',{ id:route.params.edit, type:route.query.type });

  },

  data() {
    return {
      button_loading: false,
      openLog:false,
      transferModal:false,
      transferComment:'',
      announceId: false,
      getTimer: {
        data: '',
        unix: 0
      },
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
        auction:'',
        end_date:'',
        country_id:'',
        delay_comment:'',
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
        owner_type: 0,
        currency: 0,
        youtube: {
          id: '',
          thumb: ''
        },
      },
      showPhotoReject: false
    }
  },

  async created() {
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)

    if (this.admin_user.admin_group == 2) {
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
    if (this.single_announce.id) {

      let announce = JSON.parse(JSON.stringify(this.single_announce));

      this.form.end_date = announce.end_date;
      this.form.auction = announce.auction;
      this.form.country_id = announce.country_id;
      this.announceId = announce.id;
      this.form.id = announce.id;
      this.form.id_unique = announce.id_unique;
      this.form.category = this.default_data.category;
      this.category = this.default_data.category;
      /*   this.form = this.default_data;
         this.form.youtube =  { id:'', thumb:'' };*/
      this.saved_images = announce.mediaIds;
      this.form.selectedColor = announce.color_id;
      this.form.mileage = announce.mileage;
      this.form.address = announce.address;
      this.form.beaten = announce.status_id;
      this.form.is_new = announce.is_new;
      this.form.customs_clearance = announce.customed_id;
      this.form.region_id = announce.region_id;
      this.form.lat = parseFloat(announce.latitude);
      this.form.lng = parseFloat(announce.longitude);
      this.form.price = this.numericPrice();
      this.form.currency = announce.currency_id;
      this.form.tradeable = announce.tradeable;

      this.form.owner_type = announce.owners;
      this.form.year = announce.year;

      this.form.guaranty = announce.guaranty;
      this.form.car_number = announce.car_number;
      this.form.show_car_number = announce.show_car_number;
      this.form.show_vin = announce.show_vin;
      this.form.vin = announce.vin;
      /*this.form.selectedBrand = announce.moto_brand.slug;
      this.form.selectedModel = announce.moto_model.slug;*/
      this.form.engine = announce.engine_type_id;
      this.form.power = announce.power;
      this.form.comment = announce.comment;


      this.form.engine = this.default_data['engine']
      this.form.volume = this.default_data['volume'];
      this.form.power = this.default_data['power'];
      this.form.cylinders = this.default_data['cylinders'];
      this.form.box = this.default_data['box'];
      this.form.cylinder_placement = this.default_data['cylinder_placement'];
      this.form.number_of_vehicles = this.default_data['number_of_vehicles'];
      this.form.drive = this.default_data['drive'];
      this.form.capacity = this.default_data['capacity'];

      if (announce.youtube_id) this.getYoutube(announce.youtube_id);

    }
  },

  mounted() {

    this.$nuxt.$on('custom_modal_open', (val) => {

      if (val) {
        this.popup = true;
        document.querySelector('body').classList.add('popup_open')
      } else {
        this.popup = false;
        document.querySelector('body').classList.remove('popup_open')
      }
    });
    document.body.addEventListener('click', () => {
      this.show = {};
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('publish_post')
    this.$toasted.clear();
  },
  methods: {
    handleBackList() {
      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/announcements';
      }
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/'+this.announceId+'/'+this.getRedirectUrl)
      location.href = '/alvcp/resources/'+this.getRedirectUrl;
    },

    ifPopularCommentsEmpty(){
      return _.isEmpty(this.getPopularComments);
    },
    getValue(key, value){
      if(key === 'status'){
        let status = [this.$t('rejected'), this.$t('active'), this.$t('pending')];
        return status[value];
      }else{
        return value;
      }
    },
    addComment(e) {
      if (this.form.comment === null) this.form.comment = '';
      this.form.comment = this.form.comment + e + ' ';
    },
    async deleteByIndex(index) {
      if (this.saved_images[index]) {
        this.deleteArr.push(this.saved_images[index])
      } else {
        await this.$axios.$post('/remove_temporary_image/' + this.saved_images[index]);
      }
      this.saved_images.splice(index, 1);
    },
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.showPhotoReject = true;
      }
      else {
        if (this.rejectArray.includes(rejectKey)) {
          this.rejectArray.splice(this.rejectArray.indexOf(rejectKey), 1);
        } else {
          this.rejectArray.push(rejectKey);
        }
      }
    },
    async addFiles (v) {
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
            this.saved_images = this.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images);
            this.$nuxt.$emit('remove_image_loading_by_index', this.saved_images.length);
          } catch ({response: {data: {data}}}) {
            this.$nuxt.$emit('remove_image_by_index', this.saved_images.length);
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
    deleteArrHandler(v) {
      this.deleteArr = v;
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
    changeCategory(v) {
      this.form.category = v;
      this.breadcrumbs = [];
      this.form.selectedBrand = '';
      this.form.selectedModel = '';
      this.form.selectedType = '';
    },
    async componentValueChange(id,item) {
      this.form[item] = id;
    },
    async handleChange(v) {
      switch (v.key) {
        case 'brand':
          this.brand = 0;
          if(this.default_data.category === "1")
            await this.$store.dispatch('getMotoModels',{id:v.value.key,index:0})
          else if(this.default_data.category === "2")
            await this.$store.dispatch('getScooterModels',{id:v.value.key,index:0})
          else
            await this.$store.dispatch('getMotoAtvModels',{id:v.value.key,index:0})
        case 'model':
          this.model = 0;
        case 'type':
          this.type = 0;
        case 'year':
          this.year = 0;
      }
      this[v.key] = v.value.key;
      this.refresh+=15;
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
    getLatLng(latLng) {
      this.form.lat = latLng.lat;
      this.form.lng = latLng.lng;
      this.lat = latLng.lat;
      this.lng = latLng.lng;
    },
    getAddress(address) {
      this.removeFromError('address');
      this.form.address = address;
      this.address = address;

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

    handleMultiselect(v) {
      this.removeFromError(v.key);
      this.form[v.key] = v.value.key;

    },

    saveToData(v) {
      this.selectedIndex[v.index] = v.index;
      this.form.part[v.index] = v.data;
      this.changeProgressSingle('part')

    },

    removeFromData(v) {
      delete this.selectedIndex[v.index];
      delete this.form.part[v.index];
      this.changeProgressSingle('part')
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

    handleAllOptions(v) {
      let key = Object.keys(v)[0];
      if (v[key] || (v.value && v.value.key)) {
        if (v.key) this.form.all_options[v.key] = v.value.key;
        else this.form.all_options[key] = v[key];
      } else {
        if (v.key) delete this.form.all_options[v.key];
        else delete this.form.all_options[key];
      }

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
    async transferToSupervisor(withRejectReason = false){
      this.button_loading = true;

      if (withRejectReason){
        this.transferComment = this.rejectArray;
      }

      await this.$axios.$post('/ticket/transfer/moto/' + this.announceId+'/'+this.$route.query.type, {comment:this.transferComment});

      let moto = {
        'moto' : 'motorcycles',
        'scooters' : 'scooters',
        'moto_atv' : 'moto-atvs',
      };

      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/'+moto[this.$route.query.type];
      }
    },
    async sendData(status = 2) {
      if (this.saved_images.length !== this.imagesBase64.length){
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {type: 'error'});
        return false;
      }
      let formData = new FormData();

      this.form.status = status;
      this.form.brand = this.brand;
      this.form.model = this.model;
      this.form.year = this.year;
      this.form.type = this.type;
      this.form.rejectArray = this.rejectArray;

      this.form.saved_images = this.saved_images;
      formData.append('data', JSON.stringify(this.form));
      formData.append('deletedImages', JSON.stringify(this.deleteArr));

      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/moto/' + this.announceId+'/'+this.$route.query.type,
          formData
        );
        let moto = {
          'moto' : 'motorcycles',
          'scooters' : 'scooters',
          'moto_atv' : 'moto-atvs',
        };

        if(this.admin_user.admin_group == 2){
          location.href = '/alvcp/resources/announce-moderators';
        }else{
          location.href = '/alvcp/resources/'+moto[this.$route.query.type];
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
      if (this.saved_images.length !== this.imagesBase64.length) return; this.imagesBase64 = object.images;
      this.move(this.saved_images,object.v.oldIndex,object.v.newIndex);
    },
    removeImage(v) {
      this.files = v;
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
    removeFromError(type) {
      var index = this.errors.indexOf(type);
      if (index !== -1) this.errors.splice(index, 1);
    },
    getChange(v, type) {
      this.removeFromError(type);
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

    numericPrice() {
      return this.single_announce.price.replace(/\D/g, '');
    }
  },

  computed: {
    getBrands() {
      let types = {
        moto: '',
        moto_atv: 'atv_',
      }
      let dates = [];
      let brands = this.moto_options[types[this.$route.query.type] + 'brands'] || this.scooter_options.brands;
      for (const key in brands) {
        dates.push({
          key: brands[key].id,
          name: brands[key].name,
        });
      }
      return dates;
    },
    getBtlUserName() {
      return this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name
    },

    getModels() {
      let types = {
        moto: 'moto_',
        scooters: 'scooter_',
        moto_atv: 'moto_atv_',
      }
      let dates = [];
      let models = this[types[this.$route.query.type] + 'models'][0];
      for (const key in models) {
        dates.push({
          key: models[key].id,
          name: models[key].name,
        });
      }
      return dates;
    },
    getOldType() {
      return this.getTypes.find(item => item.key === this.old_type)
    },
    getYears() {
      let dates = [];
      for (let i = (new Date().getFullYear()); i >= 1900; i--) {
        dates.push({
          key: i,
          name: i,
        });
      }
      return dates
    },
    getTypes() {
      let types = {
        moto: '',
        moto_atv: 'atv_',
      }
      let dates = [];
      let moto_types = this.moto_options[types[this.$route.query.type] + 'types'];
      for (const key in moto_types) {
        dates.push({
          key: moto_types[key].id,
          name: moto_types[key].name[this.locale],
        });
      }
      return dates;
    },
    item() {
      return {
        ...this.form, color: this.getColor(), car_catalog: {
          brand: this.single_announce.moto_brand || this.single_announce.scooter_brand || this.single_announce.moto_atv_brand,
          model: this.single_announce.moto_model || this.single_announce.scooter_model || this.single_announce.moto_atv_model,
          moto_options: this.moto_options.config
        }
      };
    },
    getTitle() {
      if (this.single_announce.moto_brand) return this.single_announce.moto_brand.name + ' ' + this.single_announce.moto_model.name;
      if (this.single_announce.scooter_brand) return this.single_announce.scooter_brand.name + ' ' + this.single_announce.scooter_model.name;
    },
    semiActiveModel() {
      return this.form.selectedBrand && !this.form.selectedModel
    },
    exactlyActiveModel() {

      return this.form.selectedBrand && this.form.selectedModel
    },
    getRedirectUrl() {
      let moto = {
        'moto' : 'motorcycles',
        'scooters' : 'scooters',
        'moto_atv' : 'moto-atvs',
      };

      return moto[this.$route.query.type];
    },
    ...mapGetters(['colors',
      'sell_options',
      'all_sell_options',
      'badges',
      'moto_options',
      'scooter_options',
      'single_announce',
      'moto_models',
      'scooter_models',
      'moto_atv_models',
      'getPopularComments'
    ]),

    color() {
      return this.getColor();
    },
  },
}
</script>


<style lang="scss" scoped>
section{
  position: relative;
  &.disable:before{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}
.timer {
  font-family: 'Aldrich', sans-serif;
  font-size: 27px;
  color: green;
  letter-spacing: 2px;
  background: #050a25;
  padding: 6px 10px 0 10px;
  display: inline-block;
}

.old_value {
  position: relative;
  left: -16px;
  font-size: 14px;
}

.logs{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  .log{
    background: #fff;
    display: inline-block;
    margin-top: 20px;
    max-height: 80%;
    overflow-y: auto;

    &> div{
      padding: 10px;
    }

    .title{
      position: relative;
      span{
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px 10px;
        cursor: pointer;
        color: #b90026;
      }
    }
    .body{
      border-top: 1px solid rgba(0, 0, 0, 0.5);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      text-align: left;

      &> div{
        border-bottom: 1px dashed #000000;
        margin: 5px 0;
        padding: 5px 0;
      }
    }
    .foot{
      .closeBtn{
        display: inline-block;
        padding: 5px 22px;
        background: #b90026;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
