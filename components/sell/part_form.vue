<template>
   <div class="part_form">
      <div class="divider">
         <form-select
            :label="$t('category')"
            :options="partCategories.map((part) => ({...part, name: part.name[locale]}))"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            :object-in-value="true"
            v-model="form.category"
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
               :object-in-value="true"
               v-model="form.sub_category"
               @change="onChangeSubCategory()"
            />
            <form-select
               v-if="partFilters?.brands.length"
               :label="$t('mark')"
               :options="partFilters?.brands"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :object-in-value="true"
               v-model="form.brand"
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
            radio-value="new"
         />
         <form-radio
            :id="'2'"
            :label="$t('s_h')"
            input-name="is_new"
            v-model="form.is_new"
            radio-value="s_h"
         />
      </div>
      <div class="divider">
         <form-radio
            :id="'3'"
            :label="$t('original')"
            input-name="is_original"
            v-model="form.is_original"
            radio-value="original"
         />
         <form-radio
            :id="'4'"
            :label="$t('duplicate')"
            input-name="is_original"
            v-model="form.is_original"
            radio-value="duplicate"
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
            :object-in-value="true"
            v-model="form.thorns"
         />
         <form-select
            v-if="hasComponent('height')"
            :label="$t('height')"
            :options="partFilters?.filters.find((f) => f.key === 'height').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            :object-in-value="true"
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
            :object-in-value="true"
            v-model="form.number_of_mounting_holes"
         />
         <form-select
            v-if="hasComponent('shine_width')"
            :label="$t('shine_width')"
            :options="partFilters?.filters.find((f) => f.key === 'shine_width').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            :object-in-value="true"
            v-model="form.shine_width"
         />
         <form-select
            v-if="hasComponent('diameter')"
            :label="$t('diameter')"
            :options="partFilters?.filters.find((f) => f.key === 'diameter').values"
            :clear-placeholder="true"
            :clear-option="false"
            :new-label="false"
            :object-in-value="true"
            v-model="form.diameter"
         />
      </div>
      <div class="divider">
         <form-checkbox
            v-model="form.delivery"
            :label="$t('have_delivery')"
            input-name="have_delivery"
            transparent
         />
         <form-checkbox
            v-model="form.warranty"
            :label="$t('have_warranty')"
            input-name="have_warranty"
            transparent
         />
      </div>
      <div class="divider">
         <form-numeric-input
            :placeholder="$t('price')"
            v-model="form.price"
         />
         <!--            @change="announcement.price = $event ? $event + (form.currency.name?.[locale] || 'AZN') : 0"-->
         <div class="price_types">
            <toggle-group :items="priceTypes" v-slot="{ item }" @change="($event) => form.currency = $event">
               <div class="price_item">
                  <p>{{ item.name[locale] }}</p>
               </div>
            </toggle-group>
         </div>
      </div>
      <form-checkbox
         v-model="form.negotiable_price"
         :label="$t('negotiable_price')"
         input-name="negotiable_price"
         transparent
      />
      <form-select v-if="Object.values(partFilters).length" :label="$t('region')" :options="partFilters?.regions"
                   v-model="form.region_id"
                   has-search
      />
      <div class="part_form_with_info">
         <form-textarea
            v-model="form.comment"
            :placeholder="$t('additional_info')"
            :maxlength="600"
         />
         <div class="part_form_with_info_inner">
            <inline-svg class="comment_svg" :src="'/icons/info.svg'"/>
            <p>{{ $t("additional_info_warning") }}</p>
         </div>
      </div>
      <div class="part_form_with_info">
         <form-textarea
            v-model="form.keywords"
            :placeholder="$t('enter_keywords')"
            :maxlength="600"
         />
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

export default {
   components: {ImageComponent, ToggleGroup},
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
            category: "",
            sub_category: "",
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
            delivery: "",
            warranty: "",
            negotiable_price: "",
            comment: "",
            saved_images: [],
            name: "",
            email: "",
            phone: ""
         }
      }
   },
   methods: {
      ...mapActions(['getPartFilters']),
      async onChangeCategory() {
         await this.getPartFilters(this.form.category.id);
      },
      onChangeSubCategory() {
         console.log('miyau2')
      },
      hasComponent(key) {
         return this.partFilters?.filters?.map((ftr) => ftr.key).includes(key)
      }
   },
   updated() {
      console.log(this.form.category)
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
