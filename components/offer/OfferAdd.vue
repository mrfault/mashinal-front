<template>
  <div class=" mt-3 mb-5">


    <div class="row" v-if="index!=0">
      <div class="col-md-6">
        <h2 class="title-with-line full-width">
          <span>{{ $t('mark') }} <span class="star"> *</span></span>
        </h2>
        <offer-form-select
          slug-in-value
          :label="$t('mark')"
          :options="brands"
          v-model="form[index].brand"
          @change="setBrand($event, brand)"
          has-search
          class="get-offer-select"
        />
      </div>
      <div class="col-md-6">
        <h2 class="title-with-line full-width">
          <span>{{ $t('model') }} <span class="star"> *</span></span>
        </h2>
        <offer-form-select
          slug-in-value
          :label="$t('model')"
          :options="models.length > 0 ? models : []"
          v-model="form[index].model"
          has-search
          @change="setModel($event,model)"
          class="get-offer-select"
          :disabled="!form[index].brand"
        />
      </div>
    </div>

    <div class="mt-3 mb-5">
      <Generations :selected="form.generations" :generations="generations" @change="changeGenerations"
                   v-if="index==0 || (brand_object && model_object) "/>
    </div>
    <div class="mb-3 box " ref="sell-modification">
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
    <div class="mb-3 box" ref="sell-modification">
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
      <color-options v-model="form[index].selectedColors" :limit="4" :multiple=true
                     @change-matt="form.is_matte = $event" :matt="form.is_matte"
                     @change="removeError('selectedColor')"/>
      <div class="row">
        <div class="col-md-12">
          <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor">
            <span>Salon rengi <span class="star"> *</span></span>
          </h2>
          <interior-color-options v-model="form[index].selectedInteriorColor" :limit="2" :multiple=false
                                  @change="removeError('selectedColor')"/>
        </div>

        <div class="col-md-12">
          <div class="row">
            <div class="col-lg-6 col-12">
              <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor3">
                <span>Alış şərtləri <span class="star"> *</span></span>
              </h2>
              <div class="d-inline-flex ">


                <form-radio :id="`${index}credit`" :label="'Kredit'" input-name="buy_condition"
                            v-model="form[index].buy_condition"
                            radio-value="credit"/>
                <form-radio :id="`${index}cash`" :label="'Nağd'" input-name="buy_condition"
                            v-model="form[index].buy_condition" radio-value="cash"
                            class="ml-2"/>
              </div>
            </div>
            <div class="col-lg-6 col-12">
              <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-selectedColor2">
                <span>Qiymət aralıqı <span class="star"> *</span></span>
              </h2>
              <div class="priceBeetwen">
                <div class=" mr-5">

                  <label for="minPrice">Min.</label>
                  <form-numeric-input id="minPrice" type="number"
                                      v-model="form[index].minPrice" class="priceInput"/>
                </div>
                <div class="">

                  <label for="maxPrice">Max.</label>
                  <form-numeric-input id="maxPrice" type="number"
                                      v-model="form[index].maxPrice" class="priceInput" @change="changeMaxPrice()"/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-comment">
        <span>Almaq istədiyin maşının təsviri</span>
      </h2>
      <form-textarea v-model="form[index].comment" :placeholder="'Təsvir'"
                     :maxlength="3000"/>
      <p class="mt-5 mb-5">
        Təsvirdə linklərinin göstərilməsi, elektron poçt ünvanının, baxış keçirmə məkanın ünvanının, telefon
        nömrəsinin, qiymətin və xidmətlərin təklifi qadağandır.
      </p>
      <div class="col-md-12  offerAddButtons">
        <div>
          <button @click="addCarAnnouncement()" v-if="offerAnnouncementsCount.length==1" class="btn  offer-button">
            <icon name="plus"></icon>
            2. Maşın əlavə et
          </button>
        </div>
        <div>
          <button class=" btn  btn--green " @click="submitOffer" :disabled="offerAddIsLoader"
                  v-if="(index==0 && offerAnnouncementsCount.length==1) || (index==1 && offerAnnouncementsCount.length==2 )">
            <img src="/icons/offer/load.svg" width="50px" v-if="offerAddIsLoader">
            <span v-else> Təsdiq və ödəniş et</span>
          </button>
        </div>

      </div>
    </div>

  </div>


</template>

<script>

import {ToastErrorsMixin} from "~/mixins/toast-errors";
import OfferFormButtons from "~/components/offer/OfferFormButtons";
import Generations from "~/components/offer/Generations";
import SellPreview from "~/components/sell/SellPreview";
import SellProgress from "~/components/sell/SellProgress";
import SellSelectedModel from "~/components/sell/SellSelectedModel";
import OfferSlider from "~/components/offer/OfferSlider";
import YearOptions from "~/components/options/YearOptions";
import SellSelectModification from "~/components/sell/SellSelectModification";
import ColorOptions from "~/components/options/ColorOptions";
import InteriorColorOptions from "~/components/options/InteriorColorOptions";
import FormCheckbox from "~/components/forms/FormCheckbox";
import {mapGetters} from "vuex";
import OfferFormSelect from "~/components/offer/OfferFormSelect";

export default {
  name: "offer-add",
  mixins: [ToastErrorsMixin],
  components: {
    OfferFormSelect,
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
  async asyncData({store, app, route}) {
    await store.dispatch('getColors')
    await store.dispatch('getBrands')
    await store.dispatch('getModels', app.$parseSlug(route.query.brand))

    await store.dispatch('getGenerations', {
      brand: route.query.brand,
      model: route.query.model
    })
  },
  props: {
    index: null
  },
  data() {
    return {
      buy_condition: '',
      brand_object: null,
      model_object: null,
      form: [
        {
          brand: null,
          model: null,
          gearBoxes: [],
          fuelTypes: [],
          comment: '',
          buy_condition: '',
          minPrice: '',
          maxPrice: '',
          selectedInteriorColor: null,
          selectedColors: [],
          is_matte: false,
          generations: []
        },
        {
          brand: null,
          model: null,
          gearBoxes: [],
          fuelTypes: [],
          comment: '',
          minPrice: '',
          buy_condition: '',
          maxPrice: '',
          selectedInteriorColor: null,
          selectedColors: [],
          is_matte: false,
          generations: []
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['brands', 'models', 'generations', 'offerAnnouncementsCount', 'offerAddIsLoader']),

    brand() {
      return this.brands?.find(brand => this.$parseSlug(brand.slug) === this.$route.query.brand);
    },
    model() {
      return this.models?.find(model => this.$parseSlug(model.slug) === this.$route.query.model);

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

  },
  methods: {
    changeGearBox(values) {
      this.form[this.index].gearBoxes = values;

    },

    changeFuelTypes(values) {
      this.form[this.index].fuelTypes = values

    },
    getIcon(key, value) {
      return ({
        engine: {1: 'fuel-station', 2: 'battery-charge', 3: 'diesel', 4: 'gas', 5: 'plug'},
        type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
        box: {1: 'mechanical', 2: 'automatic', 3: 'robot', 4: 'variator', 5: 'reductor'}
      })[key][value];
    },


    addCarAnnouncement() {

      this.$store.dispatch('offerItemValidation', {isSubmit: false, form: this.form[this.index], index: this.index})

    },

    submitOffer() {
      this.$store.commit('setOfferAddLoader', {status: true})
      this.$store.dispatch('offerItemValidation', {isSubmit: true, form: this.form[this.index]})
    },

    setBrand(slug) {
      if (slug) {
        this.brand_object = this.brands.find((option) => option.slug === slug)
        this.form[this.index].brand = this.brand_object.slug
        this.$store.commit('appendOfferSelectedModels', {
          index: this.index,
          data: {
            logo: this.brand_object.transformed_media,
            img: null,
            brand: this.brand_object.name,
            model: null,
            price: null
          }
        })


        this.$store.dispatch('getModels', slug)
      }

      this.$store.commit('resetGenerations')
      this.generations = [];
    },
    async setModel(slug) {
      await this.$store.dispatch('getGenerations', {
        brand: this.brand_object.slug,
        model: slug
      })
      this.model_object = this.models.find((option) => option.slug === slug)
      this.form[this.index].model = this.model_object.slug


      this.$store.commit('appendOfferSelectedModels', {
        index: this.index,
        data: {
          logo: this.brand_object.transformed_media,
          img: null,
          brand: this.brand_object.name,
          model: this.model_object.name,
          price: null

        }
      })


    },
    changeMaxPrice() {
      this.$store.commit('appendOfferSelectedModels', {
        index: this.index,
        data: {
          price: this.form[this.index].maxPrice,
        }
      })
    },
    changeGenerations(values) {
      this.form[this.index].generations = values

      this.generations.find((option) => option.id === values[0]).car_type_generation[0].transformed_media.main[0]

      this.$store.commit('appendOfferSelectedModels', {
        index: this.index,
        data: {
          img: this.generations.find((option) => option.id === values[0]).car_type_generation[0].transformed_media.main[0],
          year: this.generations.find((option) => option.id === values[0]).start_year + ' - ' + this.generations.find((option) => option.id === values[0]).end_year
        }
      })

    }

  },

  async created() {
    this.$store.commit('setOfferAddLoader', {status: false})
    this.$store.commit('openOfferPaymentModal', {status: false})
    if (this.generations.length == 1) {
      this.form[this.index].generations.push(this.generations[0].id)
    }

    if (this.index == 0) {

      await this.$store.dispatch('getModels', this.$parseSlug(this.$route.query.brand))


      let brand = this.brands.find((option) => option.slug === this.$route.query.brand)
      let model = this.models.find((option) => option.slug === this.$route.query.model)

      this.form[this.index].brand = brand.slug;
      this.form[this.index].model = model.slug;

      this.$store.commit('appendOfferSelectedModels', {
        index: this.index,
        data: {
          logo: brand.transformed_media,
          img: null,
          brand: brand.name,
          model: model.name,
          price: null,
          year: null
        }
      })
    }
    if (this.index == 0) {

      await this.$store.dispatch('getSellYears', {
        brand: this.$route.query.brand,
        model: this.$route.query.model
      })

    }
  },
  watch: {
    form: {
      deep: true,
      handler(newVal) {
        this.$store.commit('setOfferAnnouncement', {index: this.index, form: newVal})
      }
    }
  }

}

</script>

<style scoped>

</style>
