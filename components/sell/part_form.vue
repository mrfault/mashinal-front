<template>
   <div class="part_form">
      <div class="divider">
         <form-select
            :label="$t('category')"
            :options="partCategories.map((part) => ({...part, name: part.name[locale]}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.category_id"
            @change="onChangeCategory()"
         />
         <template v-if="Object.values(partFilters).length">
            <form-select
               v-if="partFilters?.sub_categories.length"
               :label="$t('sub_category')"
               :options="partFilters?.sub_categories"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               v-model="form.brand_id"
               @change="onChangeSubCategory()"
            />
            <form-select
               v-if="partFilters?.brands.length"
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
      <form-text-input
         key="title"
         v-model="form.title"
         :placeholder="$t('title_max_character', {max: 25})"
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
      <div class="divider">
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
            v-if="hasComponent('height')"
            :label="$t('height')"
            :options="partFilters?.filters.find((f) => f.key === 'height').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.height"
         />
      </div>
      <div class="divider">
         <form-select
            v-if="hasComponent('number_of_mounting_holes')"
            :label="$t('number_of_mounting_holes')"
            :options="partFilters?.filters.find((f) => f.key === 'number_of_mounting_holes').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.number_of_mounting_holes"
         />
         <form-select
            v-if="hasComponent('shine_width')"
            :label="$t('shine_width')"
            :options="partFilters?.filters.find((f) => f.key === 'shine_width').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.shine_width"
         />
         <form-select
            v-if="hasComponent('diameter')"
            :label="$t('diameter')"
            :options="partFilters?.filters.find((f) => f.key === 'diameter').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            v-model="form.diameter"
         />
      </div>
      <div class="divider">
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
      <div class="divider">
         <form-numeric-input
            :placeholder="$t('price')"
            v-model="form.price"
            :invalid="$v.form.price.$error"
         />
         <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
         <div class="price_types">
            <toggle-group :items="priceTypes" v-slot="{ item }" @change="form.currency = $event">
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
      />
      <form-select v-if="Object.values(partFilters).length" :label="$t('region')" :options="partFilters?.regions"
                   v-model="form.region_id"
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
      <div class="part_form_with_info">
         <image-component :type="'parts'" :initial-form="form"/>
         <div class="part_form_with_info_inner">
            <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
            <p>{{ $t("part_images_info") }}</p>
         </div>
      </div>
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
   computed: {
      ...mapGetters(['partCategories', 'partFilters']),
   },
   data() {
      return {
         priceTypes: [
            {
               id: 1,
               name: {az: "AZN", ru: "AZN ru", en: "AZN en"},
            },
            {
               id: 2,
               name: {az: "USD", ru: "USD ru", en: "USD en"},
            },
            {
               id: 3,
               name: {az: "EUR", ru: "EUR ru", en: "EUR en"},
            },
         ],
         form: {
            category_id: "",
            brand_id: "",
            brand: "",
            title: "",
            product_code: "",
            is_new: "",
            is_original: "",
            run_flat: "",
            thorns: "",
            number_of_mounting_holes: "",
            diameter: "",
            height: "",
            shine_width: "",
            have_delivery: "",
            have_warranty: "",
            price: "",
            currency: 1,
            is_negotiable: false,
            region_id: "",
            description: "",
            keywords: [],
            saved_images: [],
         }
      }
   },
   methods: {
      ...mapActions(['getPartFilters']),
      async onChangeCategory() {
         this.$emit('changeType', this.form.category_id)
         await this.getPartFilters(this.form.category_id);
      },
      onChangeSubCategory() {
         console.log('miyau2')
      },
      hasComponent(key) {
         return this.partFilters?.filters?.map((ftr) => ftr.key).includes(key)
      }
   },
   watch: {
      isReady() {
         this.$v.form.$touch()
         const newForm = {
            product_code: this.form.product_code,
            title: this.form.title,
            description: this.form.description,
            category_id: this.form.category_id,
            region_id: this.form.region_id,
            currency: this.form.currency,
            is_new: this.form.is_new === 1,
            is_original: this.form.is_original === 1,
            have_delivery: this.form.have_delivery,
            have_warranty: this.form.have_warranty,
            price: this.form.is_negotiable ? 0 : this.form.price,
            is_negotiable: this.form.is_negotiable,
            brand_id: this.form.brand_id,
            diameter: this.form.diameter,
            shine_width: this.form.shine_width,
            height: this.form.height,
            number_of_mounting_holes: this.form.number_of_mounting_holes,
            tags: this.form.keywords.map((k) => ({text: k})),
            saved_images: this.form.saved_images
         }
         const formData = new FormData()
         formData.append('data', JSON.stringify(newForm))
         this.$emit("getForm", formData)
      }
// {"product_code":"eewrwe","title":"wq","commercial_part":true,"commercial_size":"245x45x18","description":"gretgertertt","category_id":20,"region_id":1,"currency":1,"is_new":true,"is_original":true,"have_delivery":true,"have_warranty":true,"price":"123","is_negotiable":false,"btl_cookie":"","brand_id":258,"diameter":6,"number_of_mounting_holes":5,"tags":[{"text":"qunduz"},{"text":"miyau"}],"saved_images":[1512771,1512770],"deletedIds":[]}

// {"data":{"category":{"id":19,"parent_id":0,"name":"Şinlər","slug":{"az":"sinler","ru":"siny"},"show_on_search":false,"show_on_form":true,"created_at":"2021-06-29T10:19:13.000000Z","updated_at":"2021-06-29T10:19:13.000000Z","deleted_at":null,"child":[]},"sub_category":"","brand":{"id":4,"name":"Advan"},"title":"wder","product_code":"reth","is_new":"new","is_original":"original","run_flat":true,"thorns":2,"number_of_mounting_holes":"","diameter":10,"height":3,"shine_width":3,"delivery":true,"warranty":true,"price":15,"currency":1,"is_negotiable":false,"region_id":1,"comment":"2wert","keywords":[{"text":"wqregb"},{"text":"t5 b"},{"text":"ytry"},{"text":"grggr"}],"saved_images":[1512784,1512785]}}:
   },
   props: {
      isReady: {
         type: Boolean,
         default: false
      }
   },
   validations: {
      form: {
         // category: "",
         // sub_category: "",
         // brand: "",
         title: {maxLength: maxLength(25)},
         // product_code: "",
         is_new: {required},
         is_original: {required},
         // run_flat: "",
         // thorns: "",
         // number_of_mounting_holes: "",
         // diameter: "",
         // height: "",
         // shine_width: "",
         price: {
            required: requiredIf(function () {
               return !this.form.is_negotiable
            })
         },
         region_id: {required},
         // negotiable_price: "",
         // delivery: "",
         // warranty: "",
         // comment: "",
         // saved_images: [],
         // comment: {required},
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

         svg {
            min-width: 24px;
            min-height: 24px;
         }
      }
   }
}
</style>
