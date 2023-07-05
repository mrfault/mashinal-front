import {mapGetters, mapActions} from 'vuex';

export const SearchMixin = {
   data() {
      return {
         collapsed: true
      }
   },
   methods: {
      ...mapActions(['fetchSavedSearch', 'createSavedSearch', 'deleteSavedSearch', 'getNotViewedSavedSearch']),

      getFormData() {
         let requiredKeys = [];
         if (this.meta.type === 'cars') requiredKeys.push('all_options');
         let form = {};
         for (let property in this.form) {
            let value = this.form[property];
            if (property === 'additional_brands') {
               let brands = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}}
               for (let index in value)
                  for (let key in value[index])
                     if (value[index][key])
                        brands[index][key] = value[index][key];
               this.$set(form, property, brands);
            } else {
               const notFalse = value !== false || value === true;
               const notEmptyString = !(value instanceof Array) && value !== '';
               const notEmptyArray = value instanceof Array && value.length > 0;
               if (notFalse && ((notEmptyString || notEmptyArray) || requiredKeys.includes(property)))
                  this.$set(form, property, value);
            }
         }
         return form;
      },
      setFormData(form = {}) {
         // set initial data
         let collapsed = this.collapsed;
         Object.assign(this.$data, this.$options.data.apply(this));
         this.collapsed = collapsed;
         // get values from route query
         for (let property in this.form) {
            if (!form.hasOwnProperty(property))
               continue;
            let value = form[property];
            this.$set(this.form, property, value);
         }
         // update dynamic filter values
         this.$nextTick(() => {
            if (this.meta.type === 'cars') {
               this.$nuxt.$emit('change-car-filters');
            } else if (this.meta.type === 'commercial') {
               this.$nuxt.$emit('change-commercial-filters');
            }
         });
      },
      parseFormData() {
         this.setFormData(JSON.parse(this.$route.query[this.meta.param] || '{}'));
         if (this.form.additional_brands) {
            let keys = Object.keys(this.form.additional_brands).filter(key => this.form.additional_brands[key].category || this.form.additional_brands[key].brand);
            if (keys.length) this.rows = [...keys];
         }
         if (this.form.exclude_additional_brands) {
            let keys = Object.keys(this.form.exclude_additional_brands).filter(key => this.form.exclude_additional_brands[key].category || this.form.exclude_additional_brands[key].brand);
            if (keys.length) this.excludeRows = [...keys];
         }
      },
      beforeSubmitForm() {
         if (['cars-assistant'].includes(this.routeName)) {
            this.$set(this.form, 'currency', 1);
            // reset brands
            this.rows.map(this.removeSearchRow);
            this.setBrand('', this.rows[0]);
            // reset other options
            [
               'min_year', 'max_year', 'price_from', 'price_to', 'region', 'min_capacity',
               'max_capacity', 'mileage_from', 'mileage_to', 'damage', 'customs'
            ].map(key => {
               this.$set(this.form, key, '');
            });

            ['body', 'korobka', 'engine_type', 'gearing', 'n_of_seats', 'colors']
               .map(key => {
                  this.$set(this.form, key, []);
               });

            ['credit', 'exchange_possible', 'is_matte', 'in_garanty', 'with_video']
               .map(key => {
                  this.$set(this.form, key, false);
               });
            ['all_options']
               .map(key => {
                  this.$set(this.form, key, {});
               });
            // update price range
            this.$set(this.form, 'price_from', this.formAssistant.price[0]);
            this.$set(this.form, 'price_to', this.formAssistant.price[1]);
            // update body options
            let bodyValues = [];
            for (let i in this.formAssistant.body)
               bodyValues = [...bodyValues, ...this.formAssistant.body[i]];
            let bodyOptions = this.bodyOptions.main.default_options.body.values
               .filter(item => bodyValues.includes(item.key));
            this.$set(this.form, 'body', bodyOptions);
            // update pack options
            let packsOptions = [{
               trunk_volume_from: 500,
               n_of_seats: this.allSellOptions2.n_of_seats.options.filter(option => [3, 4, 5, 6, 7].includes(option.key))
            }, {
               clearance_from: 20,
               gearing: this.bodyOptions.main.default_options['privod'].values.filter(option => [3].includes(option.key))
            }, {
               fuel_rate_to: 7
            }, {
               acceleration_to: 7
            }];
            this.formAssistant.packs.map(i => {
               Object.keys(packsOptions[i]).map(key => {
                  this.$set(this.form, key, packsOptions[i][key]);
               });
            })
         }
      },
      async submitForm(scroll = true) {
         this.beforeSubmitForm();

         try {
            // tracking
            this.fbTrack('Search Api');
            this.gtagTrack('AW-600951956/Qeu4CILAyPIBEJSZx54C');
         } catch (e) {}

         // update route query params and search announcements
         let searchQuery = `${this.meta.param}=${encodeURI(JSON.stringify(this.getFormData()))}`;
         let searchUrl = `${this.$localePath(this.meta.path)}?${searchQuery}`;
         let searchSame = decodeURIComponent(searchUrl) === decodeURIComponent(this.$route.fullPath);

         this.$emit('pending');
         if (searchSame) {
            this.$emit('submit');
         } else {
            let prevRouteName = this.routeName;
            this.$router.push(searchUrl, () => {
               this.$emit('submit');
               // for ex. when routing from / to /cars
               if (this.routeName !== prevRouteName) {
                  if (scroll) {
                     setTimeout(() => {
                        this.scrollTo('.announcements-sorting');
                     }, 100);
                  }
               }
               // look for a saved search
               if (this.loggedIn && this.meta.type === 'cars') {
                  this.fetchSavedSearch({search_url: `${this.meta.path}?${searchQuery}`});
               }
            });
         }

         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'cars', data: this.getFormData() });
      },
      resetForm(submit = false) {
         this.setFormData({});
         if (submit) this.submitForm();
      },
      getOptionValue(name, key) {
         return this[`get${name}Options`].find(option => option.key === key)?.name || '';
      },
      canAddRow(index) {
         return this.rows.length < 5 && index === this.rows.length - 1;
      },
      canRemoveRow() {
         return this.rows.length > 1;
      },
      addSearchRow(key) {
         if (this.rows.length === 5) return;
         let keys = Object.keys(this.form.additional_brands);
         let index = this.rows.indexOf(key);
         this.rows.splice(index + 1, 0, keys.filter(key => this.rows.indexOf(key) === -1)[0]);
      },
      removeSearchRow(key) {
         if (this.rows.length === 1) return;
         let index = this.rows.indexOf(key);
         if (['commercial', 'moto'].includes(this.meta.type) && !this.category.id) {
            this.setCategory('', key);
         } else {
            this.setBrand('', key);
         }
         this.rows.splice(index, 1);
      },

      canAddRowExclude(index) {
         return this.excludeRows.length < 5 && index === this.excludeRows.length - 1;
      },
      canRemoveRowExclude() {
         return this.excludeRows.length > 1;
      },
      addSearchRowExclude(key) {
         if (this.excludeRows.length === 5) return;
         let keys = Object.keys(this.form.additional_brands);
         let index = this.excludeRows.indexOf(key);
         this.excludeRows.splice(index + 1, 0, keys.filter(key => this.excludeRows.indexOf(key) === -1)[0]);
      },
      removeSearchRowExclude(key) {
         if (this.excludeRows.length === 1) return;
         let index = this.excludeRows.indexOf(key);
         if (['commercial', 'moto'].includes(this.meta.type) && !this.category.id) {
            this.setCategory('', key);
         } else {
            this.setBrandExclude('', key);
         }
         this.excludeRows.splice(index, 1);
      },
      getYearOptions(min, max) {
         let years = [], j = 0;
         for (let i = (max || this.currentYear); i >= (min || 1886); i--) {
            years[j] = {name: i, key: i};
            j++;
         }
         return years;
      },
      goToSearch(path) {


         this.$router.push(`${path}?${this.meta.param}=${encodeURI(JSON.stringify(this.getFormData()))}`);

      },
      extendOptions() {
         this.collapsed = false;
         this.scrollTo(this.$refs.searchForm);
      },
      async handleAfterLogin(key) {
         if (key === 'saved-search' && this.meta.type === 'cars') {
            this.savedSearch = true;
         }
         this.scrollTo(0);
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
      }
   },
   computed: {
      ...mapGetters(['singleSavedSearch']),

      savedSearch: {
         get() {
            return !!this.singleSavedSearch.id;
         },
         set() {
            if (!this.loggedIn) return;
            if (this.singleSavedSearch.id) {
               this.deleteSavedSearch(this.singleSavedSearch.id)
                  .then(() => {
                     this.getNotViewedSavedSearch();
                     this.$toasted.success(this.$t('my_templates_removed'));
                  });
            } else {
               let searchFilter = JSON.stringify(this.getFormData());
               // save search
               this.createSavedSearch({
                  search_type: this.meta.type,
                  search_key: this.meta.param,
                  search_filter: searchFilter,
                  search_url: `${this.meta.path}?${this.meta.param}=${encodeURI(searchFilter)}`,
                  lang: this.locale
               }).then(() => {
                  this.$nuxt.$emit('saved-search-created')
                  this.getNotViewedSavedSearch();
                  this.$toasted.success(this.$t('search_saved'));
               });
            }
         }
      },
      isStarterPage() {
         return ['index', 'moto', 'commercial'].includes(this.routeName);
      },
      filtersApplied() {
         let hasBrand = this.rows.filter(key => this.form.additional_brands[key].brand).length;
         let hasAllOptions = this.form.all_options && Object.keys(this.form.all_options).length;
         let hasOptions = Object.keys(this.getFormData()).length > 5 || (this.form.announce_type !== 1);
         return !!(hasBrand || hasAllOptions || hasOptions);
      },
      searchApplied() {
         return this.routeName !== 'index' && !!this.$route.query[this.meta.param];
      },

      getMileageOptions() {
         let zeroFirst = this.meta.type !== 'cars';
         return [
            {name: this.$t('all2'), key: zeroFirst ? 0 : 1},
            {name: this.$t('new'), key: zeroFirst ? 1 : 2},
            {name: this.$t('S_H'), key: zeroFirst ? 2 : 3}
            // {name: this.$t(this.meta.type === 'parts' ? 'S_H' : 'with_mileage'), key: zeroFirst ? 2 : 3}
         ];
      },

      getSearchTabs() {
         return [
            { name: this.$t('auto'), key: 1 },
            { name: this.$t('category_moto'), key: 2 }
         ];
      },

      getCurrencyOptions() {
         return [
            {key: 1, name: 'AZN', sign: '₼'},
            {key: 2, name: 'USD', sign: '$'},
            {key: 3, name: 'EUR', sign: '€'}
         ];
      },
      getDamageOptions() {
         return [
            {name: this.$t('without_beaten'), key: 1},
            {name: this.$t('broken'), key: 2}
         ];
      },
      getCustomsOptions() {
         return [
            {name: this.$t('cleared'), key: 1},
            {name: this.$t('not_cleared'), key: 2}
         ];
      },
      getSortingOptions() {
         return [
            {name: this.$t('show_by_date'), key: 'created_at_desc'},
            {name: this.$t('show_expensive_first'), key: 'price_desc'},
            {name: this.$t('show_cheap_first'), key: 'price_asc'},
            {name: this.$t('show_by_mileage'), key: 'mileage_asc'},
            {name: this.$t('show_by_year'), key: 'year_desc'}
         ];
      }
   },
   watch: {
      '$route.query'(query) {
         if (this.routeName === 'index') return;
         if (!Object.keys(query || {}).length) {
            this.resetForm(true);
         }
      }
   },
   created() {

      var route = this.$route.path.split('/');
      if (!this.routeName !== 'index') {
         this.parseFormData();
      }
   },
   mounted() {
      this.togglePopStateListener(true);
      this.$nuxt.$on('prevent-popstate', this.togglePopStateListener);
      this.$nuxt.$on('after-login', this.handleAfterLogin);
      if (['moto', 'commercial'].includes(this.meta.type)) {
         this.$nuxt.$on('extend-options', this.extendOptions);
      }
   },
   beforeDestroy() {
      this.togglePopStateListener(false);
      this.$nuxt.$off('prevent-popstate', this.togglePopStateListener);
      this.$nuxt.$off('after-login', this.handleAfterLogin);
      if (['moto', 'commercial'].includes(this.meta.type)) {
         this.$nuxt.$off('extend-options', this.extendOptions);
      }
   }
}
