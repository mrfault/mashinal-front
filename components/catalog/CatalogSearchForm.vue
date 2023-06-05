<template>
   <div class="catalog-search-form form">
      <div class="card p-2 p-sm-3 pt-2 pt-lg-4">
         <div class="row d-none d-md-flex">
            <div class="col-12 col-md-4 mb-2 mb-lg-3">
               <form-buttons
                  :options="getCollapseOptions"
                  :group-by="2"
                  :btn-class="'blue-new'"
                  v-model="collapse"
                  @change="collapsed = !!collapse"
               />
            </div>

            <div class="col-12 col-md-3 mb-2 mb-lg-3 offset-md-5">
               <div class="clearSearch" @click="resetForm(true)">
                  <span>{{ $t('clear_search2') }}</span>

                  <inline-svg :src="'/icons/close.svg'" />
               </div>
            </div>
         </div>
         <div class="row mb-n2 mb-lg-n3">
            <div class="col-6 col-md-3 col-lg-1-5 mb-2 mb-lg-3-5">
               <form-select :label="$t('mark')" :options="brands" v-model="form.name"
                            :clear-option-text="$t('anyone')"
                            @change="form.model = '', form.generation = '', submitForm(true, false)" has-search
                            :clear-option="false"
                            :popular-options="isMobileBreakpoint ? [129,483,8,1,767,117] : undefined" slug-in-value
                            :img-key="isMobileBreakpoint ? 'transformed_media' : ''"
                            :img-placeholder="`/logos/car-${colorMode}.svg`"
               />
            </div>
            <div class="col-6 col-md-3 col-lg-1-5 mb-2 mb-lg-3-5">
               <form-select :label="$t('model')" :options="models" v-model="form.model"
                            :clear-option-text="$t('anyone')"
                            :clear-option="false"
                            :disabled="!form.name || !$route.params.brand"
                            @change="form.generation = '', submitForm(true, false)" has-search slug-in-value/>
            </div>
            <div
               class="col-6 col-md-2 col-lg-1-5 mb-2 mb-lg-3-5"
               :class="{'col-md-3' : !collapse}"
            >
               <form-select :label="$t('generation')" :options="generations" :clear-option-text="$t('anyone_other')"
                            v-model="form.generation"
                            :disabled="!form.model || !$route.params.model" @change="submitForm(true, false)" has-search
                            has-generations
                            :clear-option="false"
               />
            </div>
            <div
               class="col-6 col-md-2 col-lg-1-5 mb-2 mb-lg-3-5"
               :class="{'col-md-3' : !collapse}"
            >
               <form-select :label="$t('body_type')" v-model="form['body']" :clear-option-text="$t('anyone_other2')"
                            :options="bodyOptions.main.default_options['body'].values"
                            multiple name-in-value object-in-value translate-options @change="submitForm()"
                            :clear-option="false"
               />
            </div>

            <template v-if="!collapsed">
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('korobka')" v-model="form['korobka']"
                               :options="bodyOptions.main.default_options['korobka'].values"
                               multiple name-in-value object-in-value translate-options @change="submitForm()"/>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('fuel')" v-model="form['tip-dvigatelya']"
                               :options="bodyOptions.main.default_options['tip-dvigatelya'].values"
                               multiple name-in-value object-in-value translate-options @change="submitForm()"/>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('privod')" v-model="form['privod']"
                               :options="bodyOptions.main.default_options['privod'].values"
                               multiple name-in-value object-in-value translate-options @change="submitForm()"/>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('capacity')" custom :suffix="$t('char_litre')"
                               :values="{from: form.min_capacity, to: form.max_capacity }"
                               @clear="form.min_capacity = '', form.max_capacity = '', submitForm()"
                  >
                     <div class="form-merged">
                        <form-select :label="$t('from')" v-model="form.min_capacity"
                                     :options="bodyOptions.main.custom_options['capacity'].values"
                                     @change="submitForm()"
                                     :show-label-on-select="false" :clear-option="false" in-select-menu
                                     :suffix="$t('char_litre')"/>
                        <form-select :label="$t('to')" v-model="form.max_capacity"
                                     :options="bodyOptions.main.custom_options['capacity'].values"
                                     @change="submitForm()"
                                     :show-label-on-select="false" :clear-option="false" in-select-menu
                                     :suffix="$t('char_litre')"/>
                     </div>
                  </form-select>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('years')" custom
                               :values="{from: form.min_years, to: form.max_years, read: false }"
                               @clear="form.min_years = '', form.max_years = '', submitForm()"
                  >
                     <div class="form-merged">
                        <form-select :label="$t('from')" v-model="form.min_years" @change="submitForm()"
                                     :options="getYearOptions(false, form.max_years)" :show-label-on-select="false"
                                     :clear-option="false" in-select-menu/>
                        <form-select :label="$t('to')" v-model="form.max_years" @change="submitForm()"
                                     :options="getYearOptions(form.min_years, false)" :show-label-on-select="false"
                                     :clear-option="false" in-select-menu/>
                     </div>
                  </form-select>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('acceleration')" custom anchor="right" :suffix="$t('char_second')"
                               :values="{from: form.min_racing, to: form.max_racing }"
                               @clear="form.min_racing = '', form.max_racing = '', submitForm()"
                  >
                     <div class="form-merged">
                        <form-numeric-input :placeholder="$t('from')" v-model="form.min_racing"
                                            :suffix="$t('char_second')"
                                            @change="submitForm()"/>
                        <form-numeric-input :placeholder="$t('to')" v-model="form.max_racing"
                                            :suffix="$t('char_second')"
                                            @change="submitForm()"/>
                     </div>
                  </form-select>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('power')" custom anchor="right" :suffix="$t('char_h_power')"
                               :values="{from: form.min_power, to: form.max_power }"
                               @clear="form.min_power = '', form.max_power = '', submitForm()"
                  >
                     <div class="form-merged">
                        <form-numeric-input :placeholder="$t('from')" v-model="form.min_power"
                                            :suffix="$t('char_h_power')"
                                            @change="submitForm()"/>
                        <form-numeric-input :placeholder="$t('to')" v-model="form.max_power"
                                            :suffix="$t('char_h_power')"
                                            @change="submitForm()"/>
                     </div>
                  </form-select>
               </div>
               <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
                  <form-select :label="$t('kolichestvo-mest')" v-model="form['kolichestvo-mest']"
                               :options="bodyOptions.specifications['kolichestvo-mest'].values"
                               name-in-value object-in-value translate-options @change="submitForm()"/>
               </div>
            </template>

            <div class="col-6 col-md-2 mb-2 mb-lg-3-5 d-md-none">
               <div class="clearSearch" @click="resetForm(true)">
                  <span>{{ $t('clear_search2') }}</span>

                  <inline-svg :src="'/icons/close.svg'" />
               </div>
            </div>
            <div class="col-6 col-md-2 mb-2 mb-lg-3-5 d-md-none">
               <div class="moreSearch" @click="!collapse ? collapse = 1 : collapse = 0">
                  <span v-if="collapse">{{ $t('advanced_search2') }}</span>
                  <span v-else>{{ $t('regular_search') }}</span>

                  <inline-svg :src="'/icons/filter.svg'" />
               </div>
            </div>
            <div
               class="col-12 col-md-2 col-lg-1-5 mb-2 mb-lg-3-5"
               :class="{'col-md-6 offset-md-3 offset-lg-0' : !collapse}"
            >
               <button type="button" :class="['btn','full-width','btn--green',{pending}]" @click="submitForm(true)">
                  {{ $t('find') }}
               </button>
            </div>

<!--            <div class="col-6 col-lg-1-5 mb-2 mb-lg-3" v-if="!isMobileBreakpoint">-->
<!--               <div class="form-info text-green">-->
<!--                  {{ $readPlural(totalCount, $t('plural_forms_' + (catalogItems.length ? 'carcase' : 'model'))) }}-->
<!--               </div>-->
<!--            </div>-->
<!--            <div :class="['col-6 col-lg-1-5 mb-2 mb-lg-3', {'offset-lg-3-5': collapsed }]">-->
<!--               <button type="button" :class="['btn','full-width','btn&#45;&#45;red-outline',{'pointer-events-none': pending}]"-->
<!--                       @click="resetForm(true)">-->
<!--                  <icon name="reset"/>-->
<!--                  {{ $t('clear_search') }}-->
<!--               </button>-->
<!--            </div>-->
         </div>
      </div>

<!--      <div class="ml-n1 mr-n1" v-if="isMobileBreakpoint">-->
<!--         <div class="row">-->
<!--            <div class="col-6 mt-3 mb-n6">-->
<!--               <div class="form-info no-bg text-green">-->
<!--                  {{ $readPlural(totalCount, $t('plural_forms_' + (catalogItems.length ? 'carcase' : 'model'))) }}-->
<!--               </div>-->
<!--            </div>-->
<!--         </div>-->
<!--      </div>-->
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
   props: {
      totalCount: {
         type: Number,
         default: 0
      },
      pending: Boolean
   },
   data() {
      return {
         collapse: 1,
         collapsed: true,
         timeout: -1,
         form: {
            'name': '',
            'model': '',
            'generation': '',
            'min_capacity': '',
            'max_capacity': '',
            'min_power': '',
            'max_power': '',
            'min_racing': '',
            'max_racing': '',
            'min_years': '',
            'max_years': '',
            'body': [],
            'korobka': [],
            'privod': [],
            'tip-dvigatelya': [],
            'kolichestvo-mest': '',
         }
      }
   },
   computed: {
      ...mapGetters(['brands', 'models', 'generations', 'bodyOptions', 'catalogItems']),

      searchApplied() {
         return !!this.$route.query.filter;
      },

      getCollapseOptions() {
         return [
            {key: 1, name: this.$t('simple')},
            {key: 0, name: this.$t('detailed')}
         ]
      },
   },
   methods: {
      ...mapActions([]),

      getFormData() {
         let paramKeys = ['name', 'model', 'generation'];
         let form = {};
         for (let property in this.form) {
            let value = this.form[property];
            const notFalse = value !== false || value === true;
            const notEmptyString = !(value instanceof Array) && value !== '';
            const notEmptyArray = value instanceof Array && value.length > 0;
            if (paramKeys.includes(property)) continue;
            if (notFalse && (notEmptyString || notEmptyArray))
               this.$set(form, property, value);
         }
         return form;
      },
      setFormData(form = {}) {
         // set initial data
         let collapsed = this.collapsed;
         Object.assign(this.$data, this.$options.data.apply(this));
         this.collapse = collapsed ? 1 : 0;
         this.collapsed = collapsed;
         // get values from route query
         for (let property in this.form) {
            if (!form.hasOwnProperty(property))
               continue;
            let value = form[property];
            this.$set(this.form, property, value);
         }
      },
      parseFormData() {
         let {brand, model, generation, body} = {...this.$route.params};
         let form = JSON.parse(this.$route.query.filter || '{}');
         this.setFormData({
            ...form,
            name: brand || '',
            model: model || '',
            generation: parseInt(generation) || '',
            body: form.body || (body ? [this.bodyOptions.main.default_options['body'].values.find(o => o.key == body)] : [])
         });
      },
      submitForm(force = false, scroll = true) {
         // throttle submission
         clearTimeout(this.timeout);
         this.timeout = setTimeout(() => {
            let joinedParams = ['name', 'model', 'generation'].map(key => this.form[key]).filter(o => o).join('/');
            // if (((this.form.model || this.form.generation) && !this.form.name) || (this.form.generation && !this.form.model)) joinedParams = '';
            // update route query params and search announcements
            let form = this.getFormData();
            let searchQuery = `filter=${encodeURI(JSON.stringify(form))}`;
            let pageUrl = `${this.$localePath('/catalog')}${joinedParams.length ? ('/' + joinedParams) : ''}`;
            let searchUrl = `${pageUrl}${Object.keys(form).length ? ('?' + searchQuery) : ''}`
            let searchSame = decodeURIComponent(searchUrl) === decodeURIComponent(this.$route.fullPath);
            let pageSame = pageUrl === this.$route.path;
            if (searchSame || pageSame) this.$emit('pending');
            if (searchSame) {
               this.$emit('submit', 1, force);
            } else {
               this.$router.push(searchUrl, () => {
                  if (pageSame) this.$emit('submit', 1, force);
                  else if (scroll) this.scrollTo('.catalog-grid', [-15, -20]);
               });
            }
         }, force ? 100 : 1000);
      },
      resetForm(submit = false) {
         this.setFormData({});
         if (submit) this.submitForm(true);
      },
      async handlePopState() {
         // refresh page's async data
         await this.$nuxt.refresh();
         // update form
         this.parseFormData();
         this.scrollTo(0);
      },
      togglePopStateListener(listen = false) {
         if (listen) window.addEventListener('popstate', this.handlePopState);
         else window.removeEventListener('popstate', this.handlePopState);
      },
      getYearOptions(min, max) {
         let years = [], j = 0;
         for (let i = (max || this.currentYear); i >= (min || 1886); i--) {
            years[j] = {name: i, key: i};
            j++;
         }
         return years;
      }
   },
   watch: {
      '$route.params'() {
         this.parseFormData();
      }
   },
   created() {
      this.parseFormData();
   },
   mounted() {
      this.togglePopStateListener(true);
      this.$nuxt.$on('prevent-popstate', this.togglePopStateListener);
   },
   beforeDestroy() {
      this.togglePopStateListener(false);
      this.$nuxt.$off('prevent-popstate', this.togglePopStateListener);
   }
}
</script>
