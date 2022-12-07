<template>
  <div style="z-index:2;position: fixed;left: 50%;top: 170px;padding: 20px;background: rgb(242, 242, 242);margin-left: -175px;box-shadow: 0px 0px 13px 4px;border-radius: 7px;">
    <div class="item" style="width: 307px;margin: 0;">
      <span class="d-block">
        <div class="swiper-container js-inner__slider swiper-container-initialized swiper-container-horizontal" style="position: relative;">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <vue-cropper
                style="width: 308px;height: 210px;"
                :viewMode="3"
                :minCropBoxWidth="308"
                :minCropBoxHeight="210"
                :cropBoxResizable="false"
                ref="cropper"
                :src="findOriginalImage"
                alt="Source Image"
              >
              </vue-cropper>
            </div>
          </div>

          <div class="swiper-row" style="width: auto; padding: 0; top: 10px; left: 10px;">
            <div class="myPrice" @mouseenter="changeToggle" @mouseleave="changeToggle" v-if="false">
              <span class="swiper-row__cost" v-if="toggle" >{{ announce.price }}</span>
              <span class="swiper-row__cost" v-else>{{ announce.price_converted }}</span>
            </div>
            <span>
              <div style="display: flex" v-if="false">
              <span v-if="announce.credit" class="credit" :hover-title="$t('credit')" style="width:30px;height: 30px; margin: 0 5px 0 0;">%</span>
              <span v-if="announce.exchange_possible || announce.tradeable" :hover-title="$t('exchange_possible')" class="barter" style="width:30px;height: 30px; margin: 0 5px 0 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="13.642" height="13.56" viewBox="0 0 13.642 13.56">
                  <g id="Group_4745" data-name="Group 4745" transform="translate(10180.279 -2675.72)">
                    <path id="Path_3919" data-name="Path 3919" d="M6.5.736a5.8,5.8,0,0,1,2.977.844,6.446,6.446,0,0,1,1.553,1.307L9.494,2.837a.327.327,0,1,0-.021.654l2.126.07a.327.327,0,0,0,.427-.427l-.07-2.126a.327.327,0,0,0-.654.015s0,0,0,.007l.04,1.226A7.134,7.134,0,0,0,9.814,1.019,6.454,6.454,0,0,0,6.5.082,6.325,6.325,0,0,0,1.746,2.208,6.752,6.752,0,0,0,0,6.582a.327.327,0,1,0,.654,0A6.081,6.081,0,0,1,2.233,2.646,5.679,5.679,0,0,1,6.5.736Zm0,0" transform="translate(-10180 2675.918)" fill="#fff" stroke="#fff" stroke-width="0.56"/>
                    <path id="Path_3920" data-name="Path 3920" d="M51.16,236.012a.327.327,0,0,0-.327.327,6.081,6.081,0,0,1-1.578,3.936,5.679,5.679,0,0,1-4.268,1.91,5.8,5.8,0,0,1-2.977-.844,6.451,6.451,0,0,1-1.553-1.307l1.537.051a.327.327,0,0,0,.021-.654l-2.126-.07a.327.327,0,0,0-.427.427l.07,2.126a.327.327,0,0,0,.654-.015s0,0,0-.007l-.04-1.226a7.138,7.138,0,0,0,1.528,1.237,6.453,6.453,0,0,0,3.314.937,6.325,6.325,0,0,0,4.754-2.126,6.752,6.752,0,0,0,1.746-4.374.327.327,0,0,0-.327-.327Zm0,0" transform="translate(-10218.404 2446.161)" fill="#fff" stroke="#fff" stroke-width="0.56"/>
                  </g>
                </svg>
              </span>
            </div>
            </span>
          </div>
          <div class="catalog-result__text">
            <div>
              <div v-if="!dayOfMonth && false">
                <span class="catalog-result__text-day">{{ day }}</span>
              </div>
              <div v-else style="display: flex;flex-direction: column;">
                <span class="catalog-result__text-day-of-month">{{ day }}</span>
                <span class="catalog-result__text-month">{{ month }}</span>
              </div>
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-bullets" style="cursor: default; bottom: 14px !important; height: 3px !important; display: flex; justify-content: center;" v-if="false">
            <span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span>
          </div>
        </div>

        <div class="swiper-description" v-if="false">
          <div class="swiper-description__row">
            <div class="swiper-description__img" v-if="announce.brand && announce.brand.transformed_media != ''">
              <img style="width:50px" :src="$env.baseUrl+announce.brand.transformed_media" :alt="brand(announce,'')">
            </div>
            <div class="swiper-description__img" v-if="announce.moto_brand && announce.moto_brand.transformed_media != ''">
              <img style="width:50px" :src="$env.baseUrl+announce.moto_brand.transformed_media" :alt="brand(announce,'moto_')">
            </div>
            <div class="swiper-description__img" v-if="announce.scooter_brand && announce.scooter_brand.transformed_media != ''">
              <img style="width:50px" :src="$env.baseUrl+announce.scooter_brand.transformed_media" :alt="brand(announce,'scooter_')">
            </div>
            <div class="swiper-description__img" v-if="announce.moto_atv_brand && announce.moto_atv_brand.transformed_media != ''">
              <img style="width:50px" :src="$env.baseUrl+announce.moto_atv_brand.transformed_media" :alt="brand(announce,'moto_atv_')">
            </div>
            <div class="swiper-description__img" v-if="announce.commercial_brand && announce.commercial_brand.transformed_media != ''">
              <img style="width:50px" :src="$env.baseUrl+announce.commercial_brand.transformed_media" :alt="brand(announce,'commercial_')">
            </div>
            <div class="overlay-description">
              <div class="swiper-description__text" v-if="announce.brand">
                {{brand(announce,'').toUpperCase()}}
              </div>
              <div class="swiper-description__text" v-if="announce.moto_brand">
                {{brand(announce,'moto_').toUpperCase()}}
              </div>
              <div class="swiper-description__text" v-if="announce.scooter_brand">
                {{brand(announce,'scooter_').toUpperCase()}}
              </div>
              <div class="swiper-description__text" v-if="announce.moto_atv_brand">
                {{brand(announce,'moto_atv_').toUpperCase()}}
              </div>
              <div class="swiper-description__text" v-if="announce.commercial_brand">
                {{brand(announce,'commercial_').toUpperCase()}}
              </div>
              <div class="swiper-description__subtext">
                <span> {{ description(announce) }} </span>
                <div style="position: absolute; right: 7px; display: flex; top: 50%;">
                    <span v-if="types.includes('Premium')" class="premium-type">P</span>
                    <span v-if="types.includes('Vip')" class="vip-type">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12.841" height="10.682" viewBox="0 0 12.841 10.682">
                          <g id="diamond" transform="translate(0.421 -44.778)">
                            <g id="Group_5059" data-name="Group 5059" transform="translate(-0.001 45.178)">
                              <g id="Group_5058" data-name="Group 5058" transform="translate(0)">
                                <path id="Path_4000" data-name="Path 4000" d="M11.94,48.513l-1.961-3.15a.392.392,0,0,0-.333-.185H2.352a.392.392,0,0,0-.333.185L.059,48.513a.392.392,0,0,0,.048.476l5.608,5.948a.392.392,0,0,0,.571,0l5.608-5.947A.392.392,0,0,0,11.94,48.513ZM6,54.1.884,48.671,2.57,45.962H9.429l1.686,2.709Z" transform="translate(0.001 -45.178)" fill="#fff" stroke="#fff" stroke-width="0.8"/>
                              </g>
                            </g>
                          </g>
                      </svg>
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </div>

    <div class="cropper_buttons">
      <span @click="cropperCrop" :class="{'button_loading':button_loading}">crop</span>
    </div>

  </div>
</template>

<script>
// import AddToCompareButton from "./AddToCompareButton";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios'
export default {

  components: {
    // AddToCompareButton,
    VueCropper
  },
  props: ['announce', 'image', 'croppaSelectedKey', 'saved_images'],

  data() {
    return {
      types:[],
      toggle:true,
      button_loading: false,
    }
  },
  methods: {
    changeToggle() {
      this.toggle = !this.toggle;
    },
    brand(announce,prefix) {
      return announce[prefix+'brand'].name
        + ' ' + announce[prefix+'model'].name
    },
    description(announce) {
      let capacity = '';
      let year = '';
      let mileage = '';
      if (announce['capacity']!==undefined) {
        if (announce['capacity']!==null) {
          capacity = announce['capacity'] + ' '+ this.$t('sm3') +', ';
        }
      } else if (announce['car_catalog'] && announce['car_catalog']['capacity']!==undefined) {
        if (announce['car_catalog']['capacity']!==null) {
          capacity = announce['car_catalog']['capacity'] + ' ' + this.$t('l') + ', ';
        }
      }
      year = announce.year? announce.year + ' ' + this.$t('year') + ', ' : '';
      mileage = announce.humanize_mileage + ' ' + this.$t('km');
      return capacity + year + mileage;
    },
    getType(){
      if (this.announce.type[1] !== undefined) this.types.push('Vip');
      if (this.announce.type[2] !== undefined) this.types.push('Premium');
    },
    cropperCrop(){
      let getData = this.$refs.cropper.getData();
      this.button_loading = true;
      console.log( this.$route.query.token);
      axios.post(this.$env.API_BASE_URL+'/ticket/media/'+this.saved_images[this.croppaSelectedKey]+'/manipulate', getData,{
          headers:{
            Authorization:'Bearer '+ this.$route.query.token
          }
        })
        .then( (data) => {
          this.$emit('newThumb', data.data.thumb);
          this.button_loading = false;
        })
        .catch((data) => {
          this.button_loading = false;
          this.$toasted.error(this.$t('Высота не может быть меньше 210, Ширина не может быть меньше 308. Вы отправили Высоту: 188.61 Ширину: 276.63'));
        });
    },
    imageExists(image_url) {
      var http = new XMLHttpRequest();
      http.open('GET', image_url.replace('?','?'+new Date().getTime()), false);
      try {
        http.send();
        return http.status !== 404 && http.status !== 403;
      }catch (e) {
        return false;
      }
    },
  },
  computed: {
    findOriginalImage() {
      let original = this.images[this.croppaSelectedKey].replace('/conversions', '').replace('-thumb', '').replace('-upload_thumb', '');
      if(!this.imageExists(original)) original = original.replace('.jpg','.png')
      return original;
    },
    day() {
      let str = this.announce.humanize_created_at.toString().split(' ')[0].toString().split('');
      if (str[0] === '0') {return str[1];}
      return str.join('');
    },

    dayOfMonth() {
      let str = this.announce.humanize_created_at.toString().split(' ');
      return str.length > 1;
    },

    month() {
      return this.announce.humanize_created_at.toString().split(' ')[1];
    },

    images() {
      return this.image;
    }
  },
  mounted() {
    this.getType();
  },

  watch:{
  },

}
</script>
<style lang="scss" scoped>

.cropper_buttons{
  span{
    margin-top: 20px;
    background: rgb(41, 165, 62);
    display: inline-block;
    padding: 4px 10px 7px 10px;
    color: #fff;
    cursor: pointer;
  }
}

.premium-type {
  width: 20px;
  height: 20px;
  display: flex;
  margin-right: 5px;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 50%;
  background-color: #3a9b35;
}
.vip-type {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #b90026;
}
.swiper-row {
  z-index: 11;
  justify-content: flex-start;

  &__status {
    position: absolute;
    top: 10px;
    right: 0;
  }

  .myPrice {
    margin-right: 5px;
  }
}


.catalog-result__text p {
  text-shadow: 0 5px 5px rgba(0, 0, 0, 1);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  line-height: 15px;
  text-align: right;
}

.catalog-result__text p span {
  font-size: 18px;
}

.catalog-result__text {
  top: 72%;
}

.swiper-lazy {
  height: 210px;
}
</style>
