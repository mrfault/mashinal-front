<template>
  <div class="part-search-form mb-5">
    <div class="card">
      <div class="row">
        <!-- Mileage options -->
        <div class="col-lg-4 mb-3 mb-lg-3" v-if="showMilageOptions">
          <form-buttons
            :options="getMileageOptions"
            :group-by="3"
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
          <div class="row vertical-gap">
            <!-- Part name -->
            <div class="col">
              <form-text-input
                :placeholder="$t('part_name')"
                v-model="form.text"
              />
            </div>
            <!-- Subcategory -->
            <div class="col-lg-2" v-if="showSubcategories">
              <form-select
                :label="$t('category')"
                v-model="form.sub_category_id"
                :options="subcategories"
                has-search
              />
            </div>
            <!-- Sort -->
            <!-- <div class="col-lg-2" v-if="showSorting">
              <form-select
                :label="$t('sorting')"
                v-model="form.sort"
                :options="getSortingOptions"
              />
            </div> -->
            <!-- Price -->
            <div class="col-lg-2">
              <form-select
                :label="$t('price')"
                custom
                :suffix="getOptionValue('Currency', form.currency)"
                :values="{from: form.price_from, to: form.price_to, suffix: form.currency === 2 ? '$' : '₼' }"
                @clear="form.price_from = '', form.price_to = ''"
              >
                <div class="form-merged">
                  <form-numeric-input
                    :placeholder="$t('from')"
                    v-model="form.price_from"
                  />
                  <form-numeric-input
                    :placeholder="$t('to')"
                    v-model="form.price_to"
                  />
                  <form-select
                    :label="'AZN'"
                    :options="getCurrencyOptions"
                    v-model="form.currency"
                    :allow-clear="false"
                    :clear-option="false" 
                    in-select-menu
                  />
                </div>
              </form-select>
            </div>

            <div class="col-12" v-if="showDynamicFilter">
              <transition-expand>
                <div v-if="!collapsed" class="row">
                  <!-- Dynamic filters -->
                  <div class="col-lg-12 mb-3" v-if="showDynamicFilter">
                    <hr/>

                    <div class="row">
                      <div
                        v-for="filter in dynamicFilters"
                        :key="filter.id"
                        class="col-lg-2 mb-3"
                      >
                        <!-- Select -->
                        <form-select
                          v-if="filter.component === 'multiselect-component'"
                          v-model="form[filter.key]"
                          :label="$t(filter.key)"
                          :options="filter.values"
                          translateOptions
                          multiple
                        />

                        <!-- Checkbox -->
                        <form-checkbox
                          v-if="filter.component === 'checkbox-component'"
                          v-model="form[filter.key]"
                          :label="$t(filter.key)"
                          :checked-value="form[filter.key]"
                          :id="'dynamic-filter-' + filter.key"
                        />

                        <!-- Input -->
                        <form-text-input
                          v-if="filter.component === 'filter-single-input'"
                          v-model="form[filter.key]"
                          :id="'dynamic-filter-' + filter.key"
                          :placeholder="$t(filter.key)"
                        />
                      </div>
                    </div>

                    <!-- Brands -->
                    <div class="checkboxes-box">
                      <div class="row">
                        <!-- Brand checkboxes -->
                        <div class="col-lg-2"
                          v-for="brand in visibleBrands"
                          :key="brand.id"
                        >
                          <form-checkbox
                            :label="brand.name"
                            :value="form.brand_ids.includes(brand.id)"
                            :checked-value="brand.id"
                            :id="'brand-' + brand.id" 
                            @change="brandsOnChange(brand.id)"
                          />
                        </div>
                        <!-- Show more/less -->
                        <div class="col-lg-2">
                          <button
                            v-if="!showAllBrands"
                            class="btn btn--link show-more"
                            @click="showAllBrands = true"
                          >
                            {{ $t('show_all') }}
                            <icon name="chevron-down" />
                          </button>
                          <button
                            v-else
                            class="btn btn--link show-more"
                            @click="showAllBrands = false"
                          >
                            {{ $t('show_less') }}
                            <icon name="chevron-up" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition-expand>
            </div>
            <!-- Gap if dynamic filter is active-->
            <div class="col-lg-8" v-if="showDynamicFilter"></div>
            <!-- Reset button -->
            <div class="col-lg-2" :class="{'mt-3': collapsed && showDynamicFilter}">
              <button
                type="button"
                :class="['btn', 'full-width', 'btn--red-outline']"
                @click="resetForm"
              >
                <icon name="reset" />
                {{ $t('clear_search') }}
              </button>
            </div>
            <!-- Search button -->
            <div class="col-lg-2" :class="{'mt-3': collapsed && showDynamicFilter}">
              <button
                type="button"
                :class="['btn', 'full-width', 'btn--green']"
                @click="submitForm"
              >
                <icon name="search" />
                {{ $t('find') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="collapse-toggle" v-if="showDynamicFilter">
        <button type="button" class="btn btn-circle" @click="collapsed = !collapsed">
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchMixin } from '~/mixins/search';
import { RoutesMixin } from '~/mixins/routes';

export default {
  mixins: [SearchMixin, RoutesMixin],
  props: {
    pending: {
      type: Boolean,
      required: true
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
        text: '',
        sort: '',
        ...additionalProperties
      },
      wheelCategoryType: 0,
      wheelCategoryTypes: [
        {
          key: 0,
          name: this.$t('tyres'),
          path: '/parts/' + this.$t('slug_tyres')
        },{
          key: 1,
          name: this.$t('rims'),
          path: '/parts/' + this.$t('slug_rims')
        }
      ],
      showAllBrands: false
    }
  },
  mounted() {
    this.wheelCategoryType = this.wheelCategoryTypes.find(t => this.$localePath(t.path) === this.$route.path)?.key || 0
  },
  methods: {
    wheelCategoryTypeOnChange(value) {
      const path = this.wheelCategoryTypes.find(({ key }) => key === value).path
      this.$router.push(this.$localePath(path))
    },
    brandsOnChange(id) {
      if (this.form.brand_ids.includes(id)) {
        const index = this.form.brand_ids.findIndex(brand => brand.id === id)
        this.form.brand_ids.splice(index, 1)
      } else {
        this.form.brand_ids.push(id)
      }
    }
  },
  computed: {
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
    }
  }
}
</script>