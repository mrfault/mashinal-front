<template>
  <div style="margin: 10px 0 20px 0;">
    <h1>Commercial</h1>
  </div>
</template>
<script>


export default {
  layout:'ticket',


  async asyncData({store, $axios, $auth, route}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`);
    const admin_user = await $axios.$get('/user');
    if (!admin_user.user.is_admin) {
      return false;
    }
    let _return = false;
    let data;
    try {
      data = await $axios.$get('/ticket/commercial');
      store.commit('mutate', {
        with: data.announce,
        property: 'single_announce'
      })

      if (!store.getters.single_announce.id) return;

      await store.dispatch('getComFilters',data.announce.commercial_type_id);

      await store.dispatch('getComBrands',{id:data.announce.commercial_type_id});
      await store.dispatch('getComModels',{
        index:0,
        type:data.announce.commercial_type_id,
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
      store.commit('mutate', {
        with: {},
        property: 'single_announce'
      })

      return {
        admin_user: admin_user.user,
        moderator: data ? data.moderator : {},
      }
    }

  },

  async fetch({ store,route }) {
    await store.dispatch('getComAllOptions');
    await store.dispatch('getCommercialTypes');
    await store.dispatch('getOptions');
    await store.dispatch('getAllOtherOptions');
    await store.dispatch('getColors');
    await store.dispatch('getBadges');
  },


  data() {
    return {
      button_loading: false,
      openLog:false,
      transferModal:false,
      transferComment:'',
      getTimer: {
        data: '',
        unix: 0
      },
      rejectArray: [],
      refresh: 1,


      date:Math.floor(Date.now() / 1000),
      saved_images:[],
      popup: false,
      deleteArr:[],
      errors:[],
      progress_width: 0,
      progress_index:0,
      color_selected:0,
      price_selected:0,
      status_selected:0,
      complect_selected:0,
      desc_selected:0,
      images_selected:0,
      progress: [this.$t('make_and_model'), this.$t('photo_and_video'), this.$t('color_and_mileage'), this.$t('price_and_contacts'), this.$t('condition'), this.$t('equipment'), this.$t('description')],
      mmm: '',
      cookie_keys: ['engine', 'generation', 'year'],
      breadcrumbs:[],
      show:{},
      category:"1",
      address:'',
      selectedIndex:{},
      option_toggle:1,
      cars_parts: [
        {
          name: this.$t('front_bamp'),
          classes:'state__front'
        },
        {
          name: this.$t('front_left_door'),
          classes:'state__FrontLeftDoor'
        },
        {
          name: this.$t('back_left_door'),
          classes:'state__FrontRearRight'
        },
        {
          name: this.$t('front_right_door'),
          classes:'state__FrontRightDoor'
        },
        {
          name: this.$t('back_right_door'),
          classes:'state__FrontRearLeft'
        },
        {
          name: this.$t('roof'),
          classes:'state__roof'
        },
        {
          name: this.$t('back_bamp'),
          classes:'state__rear'
        },
      ],
      titles:[
        this.$t('overview'),
        this.$t('exterior_elements'),
        this.$t('theif_protection'),
        this.$t('multimedia'),
        this.$t('salon'),
        this.$t('comfort'),
        this.$t('safety'),
        this.$t('other')
      ],
      selectedBadges:[],
      modalIsActive:false,
      files:{},
      imagesBase64: [],
      showStoreSelect: false,
      form: {
        auction:'',
        end_date:'',
        country_id:'',
        delay_comment: '',
        lat:'',
        comment:'',
        lng:'',
        tradeable:0,
        beaten:0,
        guaranty:0,
        category:1,
        volume:'',
        power:'',
        box_id: '',
        wheel_formula: '',
        capacity:'',
        seat_counts:'',
        engine_id: '',
        truck_type_id: '',
        gear_id: '',
        cabin_type_id: '',
        bus_type_id: '',
        trailer_type_id: '',
        machinery_type_id: '',
        construction_type_id: '',
        forklift_type_id: '',
        excavator_type_id: '',
        utility_type_id: '',
        bulldozer_type_id: '',

        car_number:'',
        show_car_number: false,
        show_vin: false,
        selectedColor:'',
        all_options:{},
        badges:{},
        phone_number:'',
        address:'',
        name:'',
        email:'',
        region_id:'',
        year:'',
        month:'',
        mileage:'',
        vin:'',
        is_new:0,
        customs_clearance:0,
        passport:0,
        price:'',
        new_badges:[],
        owner_type:0,
        currency:0,
        youtube: {
          id:'',
          thumb:''
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
      this.announceId  = announce.id;
      this.saved_images = announce.mediaIds;
      this.form.id = announce.id;
      this.form.id_unique = announce.id_unique;
      this.form.selectedColor = announce.color_id;
      this.form.mileage = announce.mileage;
      this.form.address = announce.address;
      this.form.beaten  = announce.beaten;
      this.form.is_new  = announce.is_new;
      this.form.customs_clearance  = announce.customed;
      this.form.region_id  = announce.region_id;
      this.form.lat = parseFloat(announce.latitude);
      this.form.lng = parseFloat(announce.longitude);
      this.form.price = this.numericPrice();
      this.form.currency = announce.currency_id;
      this.form.tradeable = announce.tradeable;
      this.form.passport = announce.passport;
      this.form.owner_type = announce.owner || 0;
      this.form.guaranty = announce.guaranty;
      this.form.car_number = announce.car_number;
      this.form.show_car_number = announce.show_car_number;
      this.form.show_vin = announce.show_vin;
      this.form.vin = announce.vin;
      this.form.power = announce.power;
      this.form.comment = announce.comment;
      this.form.sell_store = announce.store_id;
      if(announce.youtube_id)  this.getYoutube(announce.youtube_id)
      this.com_filters.map( (item) => {
        let value = announce[item.search_key];
        this.$set(this.form, item.search_key, value);
      });

    }
  },

  mounted() {

  },
  beforeDestroy() {

    this.$toasted.clear();
  },
  methods: {
    nonRequiredField(item) {
      if (!item.required && item.component_add === 'any-type-selector')
        return [...item.values, {'key':null, 'name':this.$t('not_set')}];
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/'+this.announceId+'/commercials')
      location.href = '/alvcp/resources/commercials';
    },
    handleBackList() {
      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/announcements';
      }
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
    addComment(e){
      if (this.form.comment === null) this.form.comment = '';
      this.form.comment = this.form.comment + e + ' ';
    },
    numericPrice() {
      return this.single_announce.price.replace(/\D/g, '');
    },

    removeFromError(type) {
      var index = this.errors.indexOf(type);
      if (index !== -1) this.errors.splice(index, 1);
    },
    async deleteByIndex(index) {
      if (this.saved_images[index]) {
        this.deleteArr.push(this.saved_images[index])
      }else {
        await this.$axios.$post('/remove_temporary_image/'+this.saved_images[index]);
      }
      this.saved_images.splice( index,1);
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
    progressing(i) {
      if(i ===0 ) this.progress_width = 0;
      else this.progress_width = (100/10) * i;
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
          await this.$store.dispatch('getComBrands',{id:v.value.key})
          await this.$store.dispatch('getComFilters',v.value.key)
          this.$set(this.form,v.key,v.value.key);
          break;
        case 'brand':
          this.brand = v.value.key;
          this.model = 0;
          this.year = 0;
          await this.$store.dispatch('getComModels',{
            index:0,
            type:this.com_cat,
            id: v.value.key
          });
          this.$set(this.form,v.key,v.value.key);
          break;
        case 'model':
          this.model = v.value.key;
          this.year = 0;
          this.$set(this.form,v.key,v.value.key);
          break;
        case 'year':
          this.year = v.value.key;
          this.$set(this.form,v.key,v.value.key);
          break;
      }
      if(!v.value)  this.$set(this.form,item,v);

      this.refresh +=15;
    },
    Sections(col ,items ) {

      return items.slice(col * Math.ceil(items.length / 4), (col+1) * Math.ceil(items.length / 4));
    },
    passBase64Images(val) {
      this.imagesBase64 = val;

    },

    getColor() {
      return this.colors.find(item => item.id===this.form.selectedColor);
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

    handleAllOptions(v,key) {
      this.form[key] = v;
      this.changeProgressSingle('all_options')
    },

    showSellModal(index) {
      this.show = {};
      this.show[index] = index;
    },

    _can_upload_file(key) {
      let file = this.files[key];

      if(file.attempted || file.bad_size){
        return false;
      }
      return true;
    },
    async transferToSupervisor(withRejectReason = false){
      this.button_loading = true;

      if (withRejectReason){
        this.transferComment = this.rejectArray;
      }

      await this.$axios.$post('/ticket/transfer/commercial/' + this.announceId, {comment:this.transferComment});

      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/commercials';
      }
    },
    async sendData(status = 2) {
      if (this.saved_images.length !== this.imagesBase64.length){
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {type: 'error'});
        return false;
      }

      let formData = new FormData();

      this.form.status = status;
      this.form.category = this.com_cat;
      this.form.rejectArray = this.rejectArray;
      this.form.brand = this.brand;
      this.form.model = this.model;
      this.form.year  = this.year;

      this.form.saved_images = this.saved_images;
      formData.append('data',JSON.stringify(this.form));
      formData.append('deletedImages',JSON.stringify(this.deleteArr));
      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/commercial/' + this.announceId,
          formData
        );

        if(this.admin_user.admin_group == 2){
          location.href = '/alvcp/resources/announce-moderators';
        }else{
          location.href = '/alvcp/resources/commercials';
        }
      }
      catch ({response:{data:{data}}}) {
        this.$nuxt.$emit('loading_status', false);
        this.button_loading = false;

        this.errors = [];
        this.$toasted.clear();
        Object.keys(data).reverse().map( (key) => {
          this.errors.push(key);

          this.$toasted.show(data[key][0],{
            type:'error',
            duration:0,
            action : {
              text : 'Go to fix',
              onClick : (e, toastObject) => {
                if(document.querySelector('#'+key))
                  document.querySelector('#'+key).scrollIntoView({ behavior:'smooth',block:'center' });
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
      this.$nuxt.$emit('progress_change',{type:'images', count: Object.keys(this.files).length});
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
    getChangeOption(v) {
      if(v) this.option_toggle = 0;
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
    getChange(v,type) {

      this.form[type] = v;
      if(type === 'mileage' || type === 'selectedColor')
        this.changeProgress('mileage','selectedColor');
      if (type ==='price' || type === 'name')
        this.changeProgress('price','name');
    },
    changeProgressSingle(key) {
      let status = 0;
      if(Object.keys(this.form[key]).length) {
        status = 2;
      }
      this.$nuxt.$emit('progress_change',{ type:key, count: status })
    },
    changeProgress(key1,key2) {
      let status = 0;

      if(this.form[key1]) {
        status = 1;

      }
      if(this.form[key2]) {
        status = 1;

      }
      if(this.form[key1] && this.form[key2]) {
        status = 2;

      }
      this.$nuxt.$emit('progress_change',{ type:key1+'_'+key2, count: status })
    },
    getYoutube(val) {
      this.form.youtube.id = val;
      this.form.youtube.thumb = `https://img.youtube.com/vi/${val}/hqdefault.jpg`
    },
  },

  computed:{
    ...mapGetters([
      'com_filters',
      'com_all_options',
      'colors',
      'com_brands',
      'com_models',
      'commercial_types',
      'single_announce',
      'com_brands',
      'sell_options',
      'all_sell_options',
      'badges',
      'getPopularComments'
    ]),
    getBtlUserName() {
      return this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name
    },
    getBrands() {
      let dates = [];
      for (const key in this.com_brands) {
        dates.push({
          key: this.com_brands[key].id,
          name: this.com_brands[key].name,
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
          name: this.commercial_types[key].name[this.locale],
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
        car_catalog:{
          brand:this.single_announce.commercial_brand,
          model:this.single_announce.commercial_model,
          comm_options: this.sell_options
        },
        commercial_types:this.commercial_types,
        com_filters:this.com_filters,
        com_all_options:this.com_all_options,
        commercial_type:this.single_announce.commercial_type,
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

      if(el && !this.form.selectedModel) {
        this.progressing(1/2);
        return true;
      }

      else if(!el) {
        this.progressing(0);
        return false;
      }
      return el;
    },
    exactlyActiveModel() {
      let el =  this.form.selectedBrand;

      if(el && this.form.selectedModel) {
        this.progressing(1);
        return true;
      }
      return false;
    },
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
