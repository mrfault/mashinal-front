<template>

  <div>
    <OfferSlider/>

    <div class="container">
      <div class="row">

        <breadcrumbs :crumbs="crumbs"/>
        <div class="col-md-12 background-white p-5">
          <sell-progress :form="form"/>
          <sell-selected-model
          :brand="brand"
          :model="model"
          />

          <div class="mt-3 mb-5">
            <Generations :selected="form.generations" :generations="generations" @change="changeGenerations"        />
          </div>
          <div :key="5" class="mb-3 box " ref="sell-modification"   >
            <h2 class="title-with-line full-width">
              <span>{{ $t('box') }} <span class="star"> *</span></span>
            </h2>
            <offer-form-buttons v-model="form.box"
                                :options="boxValues"
                                :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 5"
                                @change="changeGearBox">
              <template #icon="{ button }">
                <icon :name="getIcon('box', button.key)" :class="`box-${button.key}`"/>
              </template>

            </offer-form-buttons>
          </div>
          <div :key="5" class="mb-3 box" ref="sell-modification">
            <h2 class="title-with-line full-width">
              <span>{{ $t('fuel') }} <span class="star"> *</span></span>
            </h2>
            <offer-form-buttons v-model="form.engine"
                                :options="engineValues"
                                :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 5"
                                @change="changeFuelTypes">
              <template #icon="{ button }">
                <icon :name="getIcon('engine', button.key)" :class="`box-${button.key}`"/>
              </template>

            </offer-form-buttons>
          </div>


          <div>
            <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
              <span>{{ $t('color') }} <span class="star"> *</span></span>
            </h2>
            <color-options v-model="form.selectedColors" :limit="4" :multiple=true
                           @change-matt="form.is_matte = $event" :matt="form.is_matte"
                           @change="removeError('selectedColor')"/>
            <div class="row">
              <div class="col-md-12">
                <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
                  <span>Salon rengi <span class="star"> *</span></span>
                </h2>
                <interior-color-options v-model="form.selectedInteriorColor" :limit="2" :multiple=false

                                        @change="removeError('selectedColor')"/>
              </div>

              <div class="col-md-12">
                <div class="row">
                  <div class="col-lg-6 col-12">
                    <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
                      <span>Alış şərtləri <span class="star"> *</span></span>
                    </h2>
                    <div class="d-inline-flex ">
                      <form-radio :label="'Kredit'" input-name="buy_condition" v-model="form.buy_condition"
                                  :value="'credit'" radio-value="credit"/>
                      <form-radio :label="'Nağd'" input-name="buy_condition" v-model="form.buy_condition"
                                  :value="'cash'"
                                  radio-value="cash" class="ml-2"/>
                    </div>
                  </div>
                  <div class="col-lg-6 col-12">
                    <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
                      <span>Qiymət aralıqı <span class="star"> *</span></span>
                    </h2>
                    <div class="priceBeetwen">
                      <div class=" mr-5">

                        <label for="minPrice">Min.</label>
                        <form-numeric-input id="minPrice" type="number"
                                         v-model="form.minPrice" class="priceInput"/>

                      </div>
                      <div class="">

                        <label for="maxPrice">Max.</label>
                        <form-numeric-input :invalid="$v.form.maxPrice.$error" id="maxPrice" type="number"

                                         v-model="form.maxPrice" class="priceInput"/>
                      </div>


                    </div>
                  </div>
                </div>

              </div>
            </div>

            <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-comment">
              <span>Almaq istədiyin maşının təsviri</span>
            </h2>
            <form-textarea v-model="form.comment" :placeholder="'Təsvir'"
                           :maxlength="3000"/>
            <p class="mt-5 mb-5">
              Təsvirdə linklərinin göstərilməsi, elektron poçt ünvanının, baxış keçirmə məkanın ünvanının, telefon
              nömrəsinin, qiymətin və xidmətlərin təklifi qadağandır.
            </p>
            <div class="col-md-12  text-right">
              <button class=" btn  btn--green" @click="submitOffer" >
                <img src="/icons/offer/load.svg" width="50px" v-if="isLoader" >
               <span v-else> Əlavə et</span>
              </button>
            </div>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import YearOptions from '~/components/options/YearOptions';
import ColorOptions from '~/components/options/ColorOptions';
import InteriorColorOptions from '~/components/options/InteriorColorOptions';
import SellSelectModification from '~/components/sell/SellSelectModification';
import OfferSlider from "~/components/offer/OfferSlider";
import SellSelectedModel from "~/components/sell/SellSelectedModel";
import SellProgress from "~/components/sell/SellProgress";
import SellPreview from "~/components/sell/SellPreview";
import FormCheckbox from "~/components/forms/FormCheckbox";
import Generations from "~/components/offer/Generations";
import OfferFormButtons from "~/components/offer/OfferFormButtons";
import {required} from 'vuelidate/lib/validators';

export default {
  name: "add.vue",
  components: {
    OfferFormButtons,
    Generations,
    SellPreview,
    SellProgress,
    SellSelectedModel,
    OfferSlider,
    YearOptions,
    SellSelectModification,
    ColorOptions,
    InteriorColorOptions,
    FormCheckbox
  },
  mixins: [ToastErrorsMixin],
  data() {
    return {
      showModelOptions: false,
      refresh: 0,
      isLoader:false,
      form: {
        brand: null,
        model: null,
        gearBoxes: [],
        fuelTypes: [],
        comment: '',
        minPrice: '',
        maxPrice: '',
        selectedInteriorColor: null,
        selectedColors: [],
        is_matte: false,
        generations: []

      },
    }
  },
  validations: {
    form: {
      maxPrice: {required},
    }

  },
  async asyncData({store, app, route}) {

    await store.dispatch('getColors')
    await store.dispatch('getBrands')
    await store.dispatch('getModels',app.$parseSlug(route.query.brand))

    await store.dispatch('getGenerations', {
      brand: route.query.brand,
      model: route.query.model
    })

  },
  computed: {
    ...mapGetters(['brands', 'models', 'generations']),

    OnlyMin: {
      get() {
        return this.form.minPrice;
      },
      set(value) {
        this.form.minPrice = value.replace(/[^0-9.]/g, '')
      }
    },
    boxValues() {
      return [{"name": "Mexaniki", "key": "1"}, {"name": "Avtomat", "key": "2"}]
    },
    engineValues() {
      return [
        {"name": "Benzin", "key": "1"},
        {"name": "Hibrid", "key": "2"},
        {"name": "Dizel", "key": "3"},
        {"name": "Qaz", "key": "4"},
        {"name": "Elektro", "key": "5"},
      ]
    },
    brand() {
      console.log(this.brands?.find(brand => this.$parseSlug(brand.slug) === this.$route.query.brand))

      return this.brands?.find(brand => this.$parseSlug(brand.slug) === this.$route.query.brand);
    },
    model() {
      return this.models?.find(model => this.$parseSlug(model.slug) === this.$route.query.model);

    },
    crumbs() {
      return [
        {name: 'Super təklif', route: '/offer'},
        {name: this.$t('cars')}
      ]
    }

  },
  async created() {

    this.form.brand = this.$route.query.brand;
    this.form.model = this.$route.query.model;

    await this.$store.dispatch('getSellYears', {
      brand: this.form.brand,
      model: this.form.model
    })
    if (this.generations.length == 1) {
      this.form.generations.push(this.generations[0].id)
    }

  },
  methods: {
    onlyNumberMaxPrice($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode == 46 || this.form.maxPrice.length > 6 ) {
        $event.preventDefault();
      }

    },
    onlyNumberMinPrice($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode == 46 || this.form.minPrice.length > 6 ) {
        $event.preventDefault();
      }
    },
    submitOffer() {
      this.$v.$touch();

      if (this.$v.$error) return;
      this.isLoader=true
      this.$axios.$post('offer', {
        data: this.form
      }).then((res) => {
        if (res.status && res.status == 'success') {

          this.$toast.success('Əlavə olundu')
          setTimeout(() => {
            this.$router.push('/offer')
          }, 2000);

        }
      }).catch((error)=>{
        this.isLoader=false
      });
    },
    changeGenerations(values) {
      this.form.generations = values

    },
    changeGearBox(values) {
      this.form.gearBoxes = values;

    },
    changeFuelTypes(values) {
      this.form.fuelTypes = values

    },
    getIcon(key, value) {
      return ({
        engine: {1: 'fuel-station', 2: 'battery-charge', 3: 'diesel', 4: 'gas', 5: 'plug'},
        type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
        box: {1: 'mechanical', 2: 'automatic', 3: 'robot', 4: 'variator', 5: 'reductor'}
      })[key][value];
    },
    getTitle(item) {
      const {brand, model, generation} = {...this.$route.query};
      if (model) {
        if (generation)
          return item?.car_type.name[this.locale];
        else
          return `${this.$translateHard(item.short_name)}<br/>${item.start_year} — ${item.end_year || this.currentYear}`;
      } else {
        return (!brand ? (item.parent.name + ' ') : '') + this.$translateHard(item.name);
      }
    },
    getLink(item) {
      const {brand, model, generation} = {...this.$route.query};
      const {filter} = {...this.$route.query}
      let path = model
        ? (generation ? `/catalog/${brand}/${model}/${generation}/${item.car_type_id}` : `/catalog/${brand}/${model}/${item.id}`)
        : (`/catalog/${item.parent.slug}/${item.slug}`);
      return filter ? `${path}?filter=${filter}` : path;
    },
    getImage(item) {
      const {model, generation} = {...this.$route.query};
      if (!model) {
        return item?.transformed_media ? this.$withBaseUrl(item.thumb || item.transformed_media) : false;
      } else {
        let media = generation ? item?.transformed_media?.thumb : (item?.car_type_generation?.find(type => type.car_type_id === item.fav_car_type_id) || item.car_type_generation[0])?.transformed_media?.thumb;
        return media?.length ? this.$withBaseUrl(media[0]) : false;
      }
    },
    async handleYear(year = '') {
      this.form.year = year;
      if (year) {
        this.showLastStep = true;
      } else {
        this.form.model = '';
        this.showYearOptions = false;
      }
      this.refresh++;
    },
    handleModification({key, value}) {
      this.$set(this.form, key, value);
      if (!this.showAllOptions && key === 'car_catalog_id' && value) {
        this.showAllOptions = true;
        if (!this.isMobileBreakpoint) return;
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTo(this.$refs['saved_images'], -34, 500);
          }, 0);
        });
      }
    },
    buyConditionHandleChange(value) {
      this.form.buy_condition = 'cash'
    },
  },



}
</script>

<style scoped>

</style>
