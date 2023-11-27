<template>
   <div class="part_form">
      <div class="head_section divider mobile-column">
         <div class="inner_left">
            <form-select
               v-model="form.category_id"
               :class="{full_grid: !(form.category_id && Object.values(partFilters).length)}"
               :clear-option="false"
               :clear-placeholder="true"
               :label="$t('category')"
               :new-label="false"
               :options="partCategories.filter((part) => ![18, 39].includes(part.id)).map((part) => ({...part, name: part.name[locale]}))"
               @change="onChangeCategory"
            />
            <form-select
               v-if="!form.category_id"
               :clear-option="false"
               :clear-placeholder="true"
               :label="$t('mark')"
               :new-label="false"
               :options="[]"
               :value="null"
               disabled
            />
            <template v-if="form.category_id && Object.values(partFilters).length">
               <form-select
                  v-if="form.category_id && partFilters?.sub_categories.length"
                  v-model="form.sub_category_id"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :label="$t('sub_category')"
                  :new-label="false"
                  :options="partFilters?.sub_categories"
                  @change="onChangeSubCategory()"
               />
               <form-select
                  v-if="form.category_id && partFilters?.brands.length"
                  v-model="form.brand_id"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :label="$t('mark')"
                  :new-label="false"
                  :options="partFilters?.brands"
                  @change="onChangeSubCategory()"
               />
            </template>
            <form-text-input
               key="title"
               v-model="form.title"
               :class="{form_error: $v.form.title.$error}"
               :disabled="!readyAllParameters"
               :invalid="$v.form.title.$error"
               :maxlength="25"
               :placeholder="$t('title_max_character', {max: 25})"
            />
            <form-text-input
               key="product_code"
               v-model="form.product_code"
               :disabled="!readyAllParameters"
               :maxlength="32"
               :placeholder="$t('product_code_not_required')"
            />
            <div class="divider">
               <form-radio
                  :id="'1'"
                  v-model="form.is_new"
                  :disabled="!readyAllParameters"
                  :label="$t('new')"
                  :radio-value="1"
                  input-name="is_new"
               />
               <form-radio
                  :id="'2'"
                  v-model="form.is_new"
                  :disabled="!readyAllParameters"
                  :label="$t('part_used')"
                  :radio-value="0"
                  input-name="is_new"
               />
            </div>
            <div class="divider">
               <form-radio
                  :id="'3'"
                  v-model="form.is_original"
                  :disabled="!readyAllParameters"
                  :label="$t('original')"
                  :radio-value="1"
                  input-name="is_original"
               />
               <form-radio
                  :id="'4'"
                  v-model="form.is_original"
                  :disabled="!readyAllParameters"
                  :label="$t('duplicate')"
                  :radio-value="0"
                  input-name="is_original"
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
                  v-model="form.starting_current"
                  :placeholder="$t('starting_current')"
               />
               <div class="divider">
                  <form-numeric-input
                     v-model="form.length"
                     :placeholder="$t('length')"
                  />
                  <form-numeric-input
                     v-model="form.width"
                     :placeholder="$t('width')"
                  />
               </div>
               <div class="divider">
                  <form-numeric-input
                     v-model="form.height"
                     :placeholder="$t('height')"
                  />
                  <form-numeric-input
                     v-model="form.weight"
                     :placeholder="$t('weight')"
                  />
               </div>
            </template>
            <div v-if="hasComponent('thorns') || (form.category_id !== 27 && hasComponent('height'))"
                 class="divider">
               <form-select
                  v-if="hasComponent('thorns')"
                  v-model="form.thorns"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :label="$t('thorns')"
                  :new-label="false"
                  :options="partFilters?.filters.find((f) => f.key === 'thorns').values.map((v) => ({...v, name: $t(v.name)}))"
               />
               <form-select
                  v-if="form.category_id !== 27 && hasComponent('height')"
                  v-model="form.height"
                  :class="{form_error: $v.form.height.$error}"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :invalid="$v.form.height.$error"
                  :label="$t('height')"
                  :new-label="false"
                  :options="partFilters?.filters.find((f) => f.key === 'height').values"
               />
            </div>
            <div v-if="hasComponent('number_of_mounting_holes') || hasComponent('shine_width') || hasComponent('diameter')"
                 class="divider">
               <form-select
                  v-if="hasComponent('number_of_mounting_holes')"
                  v-model="form.number_of_mounting_holes"
                  :class="{form_error: $v.form.number_of_mounting_holes.$error}"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :invalid="$v.form.number_of_mounting_holes.$error"
                  :label="$t('number_of_mounting_holes')"
                  :new-label="false"
                  :options="partFilters?.filters.find((f) => f.key === 'number_of_mounting_holes').values"
               />
               <form-select
                  v-if="hasComponent('shine_width')"
                  v-model="form.shine_width"
                  :class="{form_error: $v.form.shine_width.$error}"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :invalid="$v.form.shine_width.$error"
                  :label="$t('shine_width')"
                  :new-label="false"
                  :options="partFilters?.filters.find((f) => f.key === 'shine_width').values"
               />
               <form-select
                  v-if="hasComponent('diameter')"
                  v-model="form.diameter"
                  :class="{form_error: $v.form.diameter.$error}"
                  :clear-option="false"
                  :clear-placeholder="true"
                  :invalid="$v.form.diameter.$error"
                  :label="$t('diameter')"
                  :new-label="false"
                  :options="partFilters?.filters.find((f) => f.key === 'diameter').values"
               />
            </div>
            <div class="divider mobile-column">
               <form-checkbox
                  v-model="form.have_delivery"
                  :disabled="!isEdit && !readyAllParameters"
                  :label="$t('have_delivery')"
                  input-name="have_delivery"
                  transparent
               />
               <form-checkbox
                  v-model="form.have_warranty"
                  :disabled="!isEdit && !readyAllParameters"
                  :label="$t('have_warranty')"
                  input-name="have_warranty"
                  transparent
               />
            </div>
            <div v-if="form.category_id !== 27 && form.category_id !== 19" class="divider mobile-column">
               <form-numeric-input
                  v-model="form.price"
                  :class="{form_error: $v.form.price.$error}"
                  :disabled="!isEdit && !readyAllParameters"
                  :invalid="$v.form.price.$error"
                  :placeholder="$t('price')"
               />
               <div class="price_types">
                  <toggle-group v-slot="{ item }" :default-value="form.currency || 1" :disabled="!isEdit && !readyAllParameters"
                                :items="priceTypes"
                                @change="toggleCurrency">
                     <div class="price_item">
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </toggle-group>
               </div>
            </div>
            <form-checkbox
               v-if="form.category_id !== 27 && form.category_id !== 19 && form.category_id !== 20"
               v-model="form.is_negotiable"
               :disabled="!isEdit && !readyAllParameters"
               :label="$t('negotiable_price')"
               input-name="is_negotiable"
               transparent
               @change="toggleIsNegotiation"
            />
         </div>
         <div class="inner_right">
            <div v-if="form.category_id === 27 || form.category_id === 19" class="divider mobile-column">
               <form-numeric-input
                  v-model="form.price"
                  :class="{form_error: $v.form.price.$error}"
                  :invalid="$v.form.price.$error"
                  :placeholder="$t('price')"
               />
               <div class="price_types">
                  <toggle-group v-slot="{ item }" :default-value="form.currency || 1" :disabled="!isEdit && !readyAllParameters"
                                :items="priceTypes"
                                @change="toggleCurrency">
                     <div class="price_item">
                        <p>{{ item.name[locale] }}</p>
                     </div>
                  </toggle-group>
               </div>
            </div>
            <form-checkbox
               v-if="form.category_id === 27 || form.category_id === 19 || form.category_id === 20"
               v-model="form.is_negotiable"
               :disabled="!isEdit && !readyAllParameters"
               :label="$t('negotiable_price')"
               input-name="is_negotiable"
               transparent
               @change="toggleIsNegotiation"
            />
            <div class="part_form_with_info">
               <form-textarea
                  v-model="form.description"
                  :disabled="!isEdit && !readyAllParameters"
                  :maxlength="1200"
                  :placeholder="$t('additional_info')"
               />
               <div class="part_form_with_info_inner">
                  <inline-svg :src="'/icons/info.svg'" class="comment_svg"/>
                  <p>{{ $t("additional_info_warning") }}</p>
               </div>
            </div>
            <div class="part_form_with_info">
               <form-keywords v-model="form.keywords" :disabled="!isEdit && !readyAllParameters"/>
               <div class="part_form_with_info_inner">
                  <inline-svg :src="'/icons/info.svg'" class="comment_svg"/>
                  <p>{{ $t("sell_parts_keywords_info") }}</p>
               </div>
            </div>
         </div>
      </div>
      <div :class="{form_error: $v.form.saved_images.$error}" class="part_form_with_info">
         <client-only>
            <image-component
               :announcement="announcement"
               :deletedFiles="deletedFiles"
               :initial-form="form"
               :type="'parts'"
               :key="imageComponentKey"
            />
         </client-only>
         <div class="part_form_with_info_inner">
            <inline-svg :src="'/icons/info.svg'" class="comment_svg"/>
            <div class="warning_texts">
               <p :class="{isInvalid: $v.form.saved_images.$error}">{{ $t("add_image_minmax_part_warning") }}</p>
            </div>
         </div>
      </div>
      <!--      <template v-if="form.brand_id || form.sub_category_id">-->


      <!--         <form-select v-if="Object.values(partFilters).length"-->
      <!--                      :label="$t('region')"-->
      <!--                      :options="partFilters?.regions"-->
      <!--                      v-model="form.region_id"-->
      <!--                      :clear-placeholder="true"-->
      <!--                      :clear-option="false"-->
      <!--                      :new-label="false"-->
      <!--                      has-search-->
      <!--                      :invalid="$v.form.region_id.$error"-->
      <!--         />-->

      <!--      </template>-->
   </div>
</template>

<script>
   import {mapActions, mapGetters} from "vuex";
   import ToggleGroup from "~/components/elements/ToggleGroup.vue";
   import ImageComponent from "~/pages/sell/image-component.vue";
   import {maxLength, minLength, minValue, required, requiredIf} from "vuelidate/lib/validators";
   import FormKeywords from "~/components/forms/FormKeywords.vue";

   export default {
      components: {FormKeywords, ImageComponent, ToggleGroup},

      props: {
         announcement: {
            type: Object
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
         ...mapGetters(['partCategories', 'partFilters']),
         readyAllParameters() {
            return this.form.brand_id || this.form.sub_category_id
         },
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
            deletedFiles: [],
            imageComponentKey: 0,
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
               price: 0,
               currency: 1,
               is_negotiable: false,
               region_id: 1,
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
            if (this.form.category_id) {
               await this.getPartFilters(this.form.category_id);
            }
            this.resetImages()
         },
         toggleIsNegotiation(val) {
            if (val) {
               this.form.price = 0
            }
         },
         toggleCurrency(currency) {
            this.form.currency = currency.id
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
         },
         resetImages() {
            // return;
            this.form.saved_images = [];
            this.savedFiles = [];
            this.imageComponentKey ++;
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
            this.form.number_of_mounting_holes = this.announcement.number_of_mounting_holes
            this.form.shine_width = this.announcement.shine_width
            this.form.price = this.announcement.price
            this.form.currency = this.announcement.currency_id
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
         'form.price'() {
            if (this.form.price > 0) {
               this.form.is_negotiable = false
            }
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
            let filteredForm = this.partFilters?.sub_categories.length ? {
               ...newForm,
               sub_category_id: this.form.sub_category_id
            } : {...newForm, brand_id: this.form.brand_id}

            this.$emit("getForm", {
               form: filteredForm,
               deletedImages: (this.isEdit && this.deletedFiles.length) ? this.deletedFiles : []
            })
         }
      },

      updated() {
         const announceDescription = ['title',
               'price',].every((key) => this.form[key]) &&
            (this.hasComponent('diameter') ? this.form.diameter : true) &&
            (this.form.category_id !== 27 && this.hasComponent('height') ? this.form.height : true) &&
            (this.hasComponent('shine_width') ? this.form.shine_width : true) &&
            (this.hasComponent('number_of_mounting_holes') ? this.form.number_of_mounting_holes : true)
         this.$emit("navigationProgress", {id: 2, status: announceDescription})
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
                  }),
                  minValue: minValue(!this.form.is_negotiable && 1)
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

<style lang="scss">
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

      .head_section {
         .inner_left, .inner_right {
            display: flex;
            flex-direction: column;
            gap: 20px
         }
      }

      &_with_info {
         position: relative;
         flex: 1;
         display: flex;
         flex-direction: column;

         .form-group {
            flex: 1;

            .textarea, textarea, input {
               height: 100%;
            }

            textarea {
               min-height: 200px;
            }
         }

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

   @media (max-width: 992px) {
      .part_form {
         .divider {
            grid-template-columns: repeat(1, 1fr);
         }
      }
   }
</style>
