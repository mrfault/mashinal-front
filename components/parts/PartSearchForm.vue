<template>
   <div :class="['part-search-form', { 'pb-2': showDynamicFilter }]">
      <div class="card p-2 p-sm-3 p-md-4">
         <div class="row">
            <!-- Mileage options -->
            <div class="col-12 col-md-5 mb-3 mb-lg-3" v-if="showMilageOptions">
               <form-buttons
                  :options="getMileageOptions"
                  :group-by="3"
                  :btn-class="'blue-new'"
                  v-model="form.announce_type"
               />
            </div>
            <!-- Tyres or Rims -->
            <div class="col-lg-3 mb-3 mb-lg-3" v-if="showWheelCategoryTypes">
               <form-buttons
                  :options="wheelCategoryTypes"
                  :group-by="2"
                  v-model="wheelCategoryType"
               />
            </div>
            <div class="col-12">
               <div class="row">
                  <!-- Part name -->
                  <div class="col-12 col-md-6" :class="{'mb-3': isMobileBreakpoint}">
                     <form-text-input
                        v-if="isMobileBreakpoint"
                        :placeholder="$t('part_name')"
                        v-model="form.title"
                        icon-name="search"
                        @keyup.native.enter="submitForm"
                     />

                     <form-text-input
                        v-else
                        :placeholder="$t('part_name')"
                        v-model="form.title"
                        @keyup.native.enter="submitForm"
                     />
                  </div>

                  <div class="col-6 col-md-3">
                     <MinMaxSearch
                        :options="minMaxOptions"
                        :selectedValue="{ min: form.price_from, max: form.price_to }"
                        @change="minMaxValue"
                     />
                  </div>

                  <div class="col-6 col-md-3">
                     <button
                        type="button"
                        :class="['btn h-52', 'full-width', 'btn--new-dark-green', {pending}]"
                        @click="submitForm"
                     >{{ $t('find') }}</button>
                  </div>
               </div>
            </div>
         </div>

         <div class="collapse-toggle" v-if="showDynamicFilter">
            <button type="button" class="btn" @click="collapsed = !collapsed">
               <span>{{ $t(`search_${collapsed ? 'more' : 'less'}`) }}</span>
               <icon :name="`chevron-${collapsed ? 'down' : 'up'}`"/>
            </button>
         </div>
      </div>
   </div>
</template>

<script>
   import { SearchMixin } from '~/mixins/search';
   import { RoutesMixin } from '~/mixins/routes';
   import MinMaxSearch from "~/components/elements/MinMaxSearch.vue";

   export default {
      mixins: [SearchMixin, RoutesMixin],

      components: {MinMaxSearch},

      props: {
         pending: {
            type: Boolean,
            required: true
         },
         sorting: {
            type: Object,
            default() { return {} }
         },
         category: {
            type: Object,
            required: false,
            default: null
         },
         filters: {
            type: Object,
            required: false,
            default: null
         }
      },

      data() {
         let additionalProperties = {}
         if (this.filters) {
            const defaults = {
               'multiselect-component': [],
               'checkbox-component': false,
            }
            this.filters.filters.forEach(filter => {
               additionalProperties[filter.key] = defaults[filter.component]
            })

            if (this.filters.sub_categories.length) {
               additionalProperties['sub_category_id'] = ''
            }
            if (this.filters.brands.length) {
               additionalProperties['brand_ids'] = []
            }
         }

         return {
            form: {
               announce_type: 0,
               price_from: '',
               price_to: '',
               currency: 1,
               title: '',
               sort: '',
               ...additionalProperties
            },
            wheelCategoryType: 0,
            wheelCategoryTypes: [
               {
                  key: 0,
                  name: this.$t('tyres'),
                  path: '/parts/' + this.$t('slug_tyres')
               }, {
                  key: 1,
                  name: this.$t('rims'),
                  path: '/parts/' + this.$t('slug_rims')
               }
            ],
            showAllBrands: false,

            minMaxOptions: [
               { id: 1, placeholder: this.$t('price_from'), value: '' },
               { id: 2, placeholder: this.$t('price_to'), value: '' }
            ]
         }
      },

      mounted() {
         this.wheelCategoryType = this.wheelCategoryTypes.find(t => this.$localePath(t.path) === this.$route.path)?.key || 0

         if (this.$route.query?.parts_filter) {
            let filters = JSON.parse(this.$route.query.parts_filter)

            for (const key in filters) {
               for (const form in this.form) {
                  if (key === form) {
                     this.form[form] = filters[key]
                  }
               }
            }
         }
      },

      methods: {
         wheelCategoryTypeOnChange(value) {
            const path = this.wheelCategoryTypes.find(({key}) => key === value).path
            this.$router.push(this.$localePath(path))
         },

         brandsOnChange(id) {
            if (this.form.brand_ids.includes(id)) {
               this.form.brand_ids = this.form.brand_ids.filter(brand => brand.id !== id)
            } else {
               this.form.brand_ids.push(id)
            }
         },

         reset() {
            this.resetForm()
            this.$store.dispatch('parts/setSearchActive', false)
         },

         minMaxValue(val) {
            this.form.price_from = val[0].value;
            this.form.price_to = val[1].value;
         }
      },

      computed: {
         pagination() {
            return this.$store.getters.partAnnouncements;
         },

         getSuffix() {
            switch (this.form.currency) {
               case 1:
                  return '₼';
               case 2:
                  return '$';
               case 3:
                  return '€';
            }
         },

         // meta data
         meta() {
            return {
               type: 'parts',
               path: `/parts${this.category ? '/' + this.category.slug[this.locale] : ''}`,
               param: 'parts_filter'
            }
         },

         subcategories() {
            if (this.filters) {
               return this.filters.sub_categories || []
            }
            return []
         },

         dynamicFilters() {
            if (this.filters) {
               return this.filters.filters || []
            }
            return []
         },

         brands() {
            if (this.filters) {
               return this.filters.brands || []
            }
            return []
         },

         visibleBrands() {
            if (!this.showAllBrands) {
               return this.brands.slice(0, 23)
            } else {
               return this.brands
            }
         },

         isWheelCategory() {
            // Category ids of tyres and rims
            return [18, 19, 20].includes(this.category?.id)
         },

         showMilageOptions() {
            return !this.isWheelCategory
         },

         showWheelCategoryTypes() {
            return this.isWheelCategory
         },

         showSubcategories() {
            return Boolean(this.subcategories.length)
         },

         showSorting() {
            return this.isWheelCategory
         },

         showDynamicFilter() {
            return this.dynamicFilters.length
         }
      },

      watch: {
         wheelCategoryType(val) {
            if (val !== null) {
               this.wheelCategoryTypeOnChange(val)
            }
         },

         sorting(val) {
            this.form.sort_by = val.key.split('_')[0];
            this.form.sort_order = val.value;
            this.submitForm();
         }
      }
   }
</script>

<style lang="scss">
   .part-search-form {
      margin-top: 32px;

      .form-group {
         .text-input {
            i {
               color: #9AA4B2;
            }
         }
      }
   }
</style>
