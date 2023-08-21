<template>
   <div class="part_form">
      <div class="divider mobile-column">
         <form-select
            :label="$t('category')"
            :options="partCategories.filter((part) => ![18, 39].includes(part.id)).map((part) => ({...part, name: part.name[locale]}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.category_id"
            :class="{full_grid: !(form.category_id && Object.values(partFilters).length)}"
            @change="onChangeCategory"
         />
         <template v-if="form.category_id && Object.values(partFilters).length">
            <form-select
               v-if="form.category_id && partFilters?.sub_categories.length"
               :label="$t('sub_category')"
               :options="partFilters?.sub_categories"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.sub_category_id"
               @change="onChangeSubCategory()"
            />
            <form-select
               v-if="form.category_id && partFilters?.brands.length"
               :label="$t('mark')"
               :options="partFilters?.brands"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.brand_id"
               @change="onChangeSubCategory()"
            />
         </template>
      </div>
      <template v-if="form.brand_id || form.sub_category_id">
         <form-text-input
            key="title"
            v-model="form.title"
            :placeholder="$t('title_max_character', {max: 25})"
            :class="{form_error: $v.form.title.$error}"
            :invalid="$v.form.title.$error"
         />
         <form-text-input
            key="product_code"
            v-model="form.product_code"
            :placeholder="$t('product_code_not_required')"
         />
         <div class="divider">
            <form-radio
               :id="'1'"
               :label="$t('new')"
               input-name="is_new"
               v-model="form.is_new"
               :radio-value="1"
            />
            <form-radio
               :id="'2'"
               :label="$t('s_h')"
               input-name="is_new"
               v-model="form.is_new"
               :radio-value="0"
            />
         </div>
         <div class="divider">
            <form-radio
               :id="'3'"
               :label="$t('original')"
               input-name="is_original"
               v-model="form.is_original"
               :radio-value="1"
            />
            <form-radio
               :id="'4'"
               :label="$t('duplicate')"
               input-name="is_original"
               v-model="form.is_original"
               :radio-value="0"
            />
         </div>
         <form-checkbox
            v-if="hasComponent('run_flat')"
            v-model="form.run_flat"
            :label="$t('run_flat')"
            input-name="run_flat"
            transparent
         />
         <template v-if="form.category_id === 27">
            <form-numeric-input
               :placeholder="$t('starting_current')"
               v-model="form.starting_current"
            />
            <div class="divider">
               <form-numeric-input
                  :placeholder="$t('length')"
                  v-model="form.length"
               />
               <form-numeric-input
                  :placeholder="$t('width')"
                  v-model="form.width"
               />
            </div>
            <div class="divider">
               <form-numeric-input
                  :placeholder="$t('height')"
                  v-model="form.height"
               />
               <form-numeric-input
                  :placeholder="$t('weight')"
                  v-model="form.weight"
               />
            </div>
         </template>
         <div class="divider" v-if="hasComponent('thorns') || (form.category_id !== 27 && hasComponent('height'))">
            <form-select
               v-if="hasComponent('thorns')"
               :label="$t('thorns')"
               :options="partFilters?.filters.find((f) => f.key === 'thorns').values.map((v) => ({...v, name: $t(v.name)}))"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.thorns"
            />
            <form-select
               v-if="form.category_id !== 27 && hasComponent('height')"
               :label="$t('height')"
               :options="partFilters?.filters.find((f) => f.key === 'height').values"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.height"
               :class="{form_error: $v.form.height.$error}"
               :invalid="$v.form.height.$error"
            />
         </div>
         <div class="divider"
              v-if="hasComponent('number_of_mounting_holes') || hasComponent('shine_width') || hasComponent('diameter')">
            <form-select
               v-if="hasComponent('number_of_mounting_holes')"
               :class="{form_error: $v.form.number_of_mounting_holes.$error}"
               :label="$t('number_of_mounting_holes')"
               :options="partFilters?.filters.find((f) => f.key === 'number_of_mounting_holes').values"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.number_of_mounting_holes"
               :invalid="$v.form.number_of_mounting_holes.$error"
            />
            <form-select
               v-if="hasComponent('shine_width')"
               :class="{form_error: $v.form.shine_width.$error}"
               :label="$t('shine_width')"
               :options="partFilters?.filters.find((f) => f.key === 'shine_width').values"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.shine_width"
               :invalid="$v.form.shine_width.$error"
            />
            <form-select
               v-if="hasComponent('diameter')"
               :class="{form_error: $v.form.diameter.$error}"
               :label="$t('diameter')"
               :options="partFilters?.filters.find((f) => f.key === 'diameter').values"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.diameter"
               :invalid="$v.form.diameter.$error"
            />
         </div>
         <div class="divider mobile-column">
            <form-checkbox
               v-model="form.have_delivery"
               :label="$t('have_delivery')"
               input-name="have_delivery"
               transparent
            />
            <form-checkbox
               v-model="form.have_warranty"
               :label="$t('have_warranty')"
               input-name="have_warranty"
               transparent
            />
         </div>
         <div class="divider mobile-column">
            <form-numeric-input
               :placeholder="$t('price')"
               v-model="form.price"
               :class="{form_error: $v.form.price.$error}"
               :invalid="$v.form.price.$error"
               @change="form.is_negotiable = false"
            />
            <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
            <div class="price_types">
               <toggle-group :items="priceTypes" v-slot="{ item }" @change="form.currency = $event.id">
                  <div class="price_item">
                     <p>{{ item.name[locale] }}</p>
                  </div>
               </toggle-group>
            </div>
         </div>
         <form-checkbox
            v-model="form.is_negotiable"
            :label="$t('negotiable_price')"
            input-name="is_negotiable"
            transparent
            @change="$event && (form.price = '')"
         />
         <form-select v-if="Object.values(partFilters).length"
                      :label="$t('region')"
                      :options="partFilters?.regions"
                      v-model="form.region_id"
                      :clear-placeholder="true"
                      :clear-option="false"
                      :new-label="false"
                      has-search
                      :invalid="$v.form.region_id.$error"
         />
         <div class="part_form_with_info">
            <form-textarea
               v-model="form.description"
               :placeholder="$t('additional_info')"
               :maxlength="600"
            />
            <div class="part_form_with_info_inner">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p>{{ $t("additional_info_warning") }}</p>
            </div>
         </div>
         <div class="part_form_with_info">
            <form-keywords v-model="form.keywords"/>
            <div class="part_form_with_info_inner">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p>{{ $t("sell_parts_keywords_info") }}</p>
            </div>
         </div>
         <div class="part_form_with_info" :class="{form_error: $v.form.saved_images.$error}">
            <image-component :type="'parts'" :initial-form="form"/>
            <div class="part_form_with_info_inner">
               <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
               <p :class="{isInvalid: $v.form.saved_images.$error}">{{ $t("part_images_info") }}</p>
            </div>
         </div>
      </template>
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import ImageComponent from "~/pages/sell/image-component.vue";
import {maxLength, minLength, required, requiredIf} from "vuelidate/lib/validators";
import FormKeywords from "~/components/forms/FormKeywords.vue";

export default {
   components: {FormKeywords, ImageComponent, ToggleGroup},
   props: {
      announcement: {
         type: Object,
         required: true
      },
      isReady: {
         type: Boolean,
         default: false
      },
      isEdit: {
         type: Boolean,
         default: false
      }
   },
   computed: {
      ...mapGetters(['partCategories', 'partFilters'])
   },
   data() {
      return {
         priceTypes: [
            {
               id: 1,
               name: {az: "AZN", ru: "AZN"},
            },
            {
               id: 2,
               name: {az: "USD", ru: "USD"},
            },
            {
               id: 3,
               name: {az: "EUR", ru: "EUR"},
            },
         ],
         form: {
            category_id: "",
            brand_id: "",
            sub_category_id: "",
            brand: "",
            title: "",
            product_code: "",
            is_new: 1,
            is_original: 1,
            run_flat: false,
            thorns: "",
            number_of_mounting_holes: "",
            diameter: "",
            height: "",
            shine_width: "",
            starting_current: "",
            length: "",
            width: "",
            weight: "",
            have_delivery: false,
            have_warranty: false,
            price: "",
            currency: 1,
            is_negotiable: false,
            region_id: "",
            description: "",
            keywords: [],
            saved_images: [],
         },
         initialForm: {}
      }
   },
   methods: {
      ...mapActions(['getPartFilters']),
      async onChangeCategory() {
         this.clearFields(['brand_id', 'sub_category_id'])
         this.$emit('changeType', this.form.category_id)
         if (this.form.category_id) {
            await this.getPartFilters(this.form.category_id);
         }
      },
      onChangeSubCategory() {
         this.form = {
            ...this.initialForm,
            category_id: this.form.category_id,
            brand_id: this.form.brand_id,
            sub_category_id: this.form.sub_category_id
         }
      },
      hasComponent(key) {
         return this.partFilters?.filters?.map((ftr) => ftr.key).includes(key)
      },
      clearFields(keys) {
         keys.forEach((key) => {
            this.form[key] = ""
         })
      }
   },
   mounted() {
      this.initialForm = {...this.form}
      if (this.isEdit) {
         this.getPartFilters(this.announcement.category_id);
         this.form.category_id = this.announcement.category_id
         this.form.brand_id = this.announcement.brand_id
         this.form.sub_category_id = this.announcement.sub_category_id
         this.form.title = this.announcement.title
         this.form.product_code = this.announcement.product_code
         this.form.is_new = this.announcement.is_new ? 1 : 0
         this.form.is_original = this.announcement.is_original ? 1 : 0
         this.form.run_flat = this.announcement.run_flat
         this.form.thorns = this.announcement.thorns
         this.form.height = this.announcement.height
         this.form.starting_current = this.announcement.starting_current
         this.form.length = this.announcement.length
         this.form.width = this.announcement.width
         this.form.weight = this.announcement.weight
         this.form.diameter = this.announcement.diameter
         this.form.shine_width = this.announcement.shine_width
         this.form.price = this.announcement.price
         this.form.have_delivery = this.announcement.have_delivery
         this.form.have_warranty = this.announcement.have_warranty
         this.form.is_negotiable = this.announcement.is_negotiable
         this.form.region_id = this.announcement.region_id
         this.form.description = this.announcement.description
         this.form.saved_images = this.announcement.defaultImageIds
         this.form.keywords = this.announcement.tags.map((tag) => tag.text)
      }
   },
   watch: {
      'form.brand_id'() {
         this.$emit("navigationProgress", {id: 1, status: !!this.form.brand_id})
         this.$emit("done", !!((this.form.brand_id) && Object.values(this.partFilters).length))
      },
      'form.sub_category_id'() {
         this.$emit("navigationProgress", {id: 1, status: !!this.form.sub_category_id})
         this.$emit("done", !!((this.form.sub_category_id) && Object.values(this.partFilters).length))
      },
      isReady() {
         this.$v.form.$touch()
         setTimeout(() => {
            this.scrollTo('.form_error', -190)
         });
         if (this.$v.form.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }
         const newForm = {
            product_code: this.form.product_code,
            title: this.form.title,
            description: this.form.description,
            category_id: this.form.category_id,
            region_id: this.form.region_id,
            currency: this.form.currency,
            is_new: this.form.is_new ? 1 : 0,
            is_original: this.form.is_original ? 1 : 0,
            have_delivery: this.form.have_delivery ? 1 : 0,
            have_warranty: this.form.have_warranty ? 1 : 0,
            price: this.form.is_negotiable ? 0 : this.form.price,
            is_negotiable: this.form.is_negotiable,
            diameter: this.form.diameter,
            shine_width: this.form.shine_width,
            height: this.form.height,
            starting_current: this.form.starting_current,
            length: this.form.length,
            width: this.form.width,
            weight: this.form.weight,
            number_of_mounting_holes: this.form.number_of_mounting_holes,
            tags: this.form.keywords.map((k) => ({text: k})),
            saved_images: this.form.saved_images
         }
         const filteredForm = this.partFilters?.sub_categories.length ? {
            ...newForm,
            sub_category_id: this.form.sub_category_id
         } : {...newForm, brand_id: this.form.brand_id}

         this.$emit("getForm", filteredForm)
      }
   },

   validations() {
      return {
         form: {
            title: {
               required,
               maxLength: maxLength(25)
            },
            description: {maxLength: maxLength(3000)},
            price: {
               required: requiredIf(function () {
                  return !this.form.is_negotiable
               })
            },
            region_id: {required},
            diameter: {
               required: requiredIf(function () {
                  return this.hasComponent('diameter')
               })
            },
            height: {
               required: requiredIf(function () {
                  return this.form.category_id !== 27 && this.hasComponent('height')
               })
            },
            shine_width: {
               required: requiredIf(function () {
                  return this.hasComponent('shine_width')
               })
            },
            number_of_mounting_holes: {
               required: requiredIf(function () {
                  return this.hasComponent('number_of_mounting_holes')
               })
            },
            saved_images: {
               required
            }
         }
      }
   }
}
</script>

<style lang="scss" scoped>
.part_form {
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   gap: 20px;


   .divider {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 8px));
      gap: 20px;

      .full_grid {
         grid-column: 1/3;
      }

      .price_types {
         .price_item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            padding: 0 16px;
         }
      }
   }

   &_with_info {
      position: relative;

      &_inner {
         display: flex;
         margin-top: 12px;
         align-items: center;
         gap: 10px;

         .isInvalid {
            color: red
         }

         svg {
            min-width: 24px;
            min-height: 24px;
         }
      }
   }
}
</style>
