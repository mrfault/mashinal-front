<template>
  <div style="margin: 10px 0 20px 0;">
    <h1>part</h1>
  </div>
</template>
<script>
import {mapGetters} from "vuex";


export default {
  layout:'ticket',


  async asyncData({store, $axios, $auth, route}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`);
    const admin_user = await $axios.$get('/user');
    if (!admin_user.user.is_admin) {
      return false;
    }
    let data;
    try {
      data = await $axios.$get('/ticket/part');
      store.commit('mutate', {
        with: data.announce,
        property: 'single_announce'
      })



      const partCategories = await $axios.$get('/part/categories');

      let announce = JSON.parse(JSON.stringify(store.getters.single_announce));

      let announceId  = announce.id;
      let saved_images = announce.mediaIds;
      let form = {};
      form.delay_comment = '';
      form.category_id = announce.category_id;
      form.sub_category_id = announce.sub_category_id;
      form.region_id = announce.region_id;
      form.brand_id = announce.brand_id;
      form.is_new = announce.is_new;
      form.is_original = announce.is_original;
      form.is_negotiable = announce.is_negotiable;
      form.have_delivery = announce.have_delivery;
      form.have_warranty = announce.have_warranty;
      form.price = announce.price_int;
      form.product_code = announce.product_code;
      form.title = announce.title;
      form.description = announce.description;
      form.tags = announce.all_tags;

      const filter_data = await $axios.$get(`/part/category/${form.category_id}/filters`)

      if (announce.filters) {
        for(let key in announce.filters){
          form[key] = announce.filters[key];
        }
      }

      return {
        announceId,
        saved_images,
        form,
        filter_data,
        partCategories:partCategories,
        admin_user: admin_user.user,
        moderator: data ? data.moderator : {},
      }
    } catch (e) {
      return;
      store.commit('mutate', {
        with: {},
        property: 'single_announce'
      })
    }

    return {
      admin_user: admin_user.user,
      moderator: data ? data.moderator : {},
    }

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
      popup: false,
      deleteArr:[],
      errors:[],
      selectedBadges:[],
      modalIsActive:false,
      files:{},
      imagesBase64: [],
      showStoreSelect: false,

      filter_data:{
        brands:[],
        filters:[],
        regions:[],
        sub_categories:[]
      },
      tag: '',
      tags: [],

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


  },

  mounted() {

  },
  beforeDestroy() {

    this.$toasted.clear();
  },
  methods: {

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
      await this.$axios.$post('/ticket/detach/'+this.announceId+'/parts')
      location.href = '/alvcp/resources/parts';
    },
    handleBackList() {
      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/announcements';
      }
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
    addComment(e){
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
    getCurrency(v) {
      this.form.currency = v.key;
    },
    async handleChange(object) {
      if(object.key === 'category_id') {
        const data =  await this.$axios.$get(`/part/category/${object.value.id}/filters`)
        this.filter_data = data;
      }
      this.$set(this.form,object.key,object.value.id);
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

    handleAllOptions(v,key) {
      this.form[key] = v;
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

      await this.$axios.$post('/ticket/transfer/part/' + this.announceId, {comment:this.transferComment});

      if(this.admin_user.admin_group == 2){
        location.href = '/alvcp/resources/announce-moderators';
      }else{
        location.href = '/alvcp/resources/parts';
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
      this.form.price = (this.form.price == '' ? 0 : this.form.price);

      this.form.saved_images = this.saved_images;
      formData.append('data',JSON.stringify(this.form));
      formData.append('deletedImages',JSON.stringify(this.deleteArr));
      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/part/' + this.announceId,
          formData
        );

        if(this.admin_user.admin_group == 2){
          location.href = '/alvcp/resources/announce-moderators';
        }else{
          location.href = '/alvcp/resources/parts';
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
  },

  computed:{
    ...mapGetters([
      'single_announce',
      'sell_options',
      'all_sell_options',
    ]),
    getBtlUserName() {
      return this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name
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
