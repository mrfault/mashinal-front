import { mapGetters, mapActions } from 'vuex';

export const SearchMixin = {
  data() {
    return {
      collapsed: true
    }
  },
  methods: {
    ...mapActions(['fetchSavedSearch', 'createSavedSearch', 'deleteSavedSearch']),

    getFormData() {
      let requiredKeys = ['additional_brands'];
      if (this.meta.type === 'cars') requiredKeys.push('all_options');

      let form = {};
      for (let property in this.form) {
        let value = this.form[property];
        const notFalse = value !== false || value === true;
        const notEmptyString = !(value instanceof Array) && value !== '';
        const notEmptyArray = value instanceof Array && value.length > 0;
        if (notFalse && ( (notEmptyString || notEmptyArray) || requiredKeys.includes(property)) )
          this.$set(form, property, value);
      }
      return form;
    },
    setFormData(form = {}) {
      // set initial data
      Object.assign(this.$data, this.$options.data.apply(this));
      // get values from route query
      for (let property in this.form) {
        if (!form.hasOwnProperty(property)) 
          continue;
        let value = form[property];
        this.$set(this.form, property, value);
      }
    },
    parseFormData() {
      this.setFormData(JSON.parse(this.$route.query.car_filter || '{}'));
      let keys = Object.keys(this.form.additional_brands).filter(key => this.form.additional_brands[key].brand);
      if( keys.length) this.rows = [...keys];
    },
    beforeSubmitForm() {
      if (['cars-assistant'].includes(this.routeName)) {
        this.$set(this.form, 'currency', 1);
        // reset brands
        this.rows.map(this.removeSearchRow);
        this.setBrand('', this.rows[0]);
        // reset other options
        ['min_year','max_year','price_from','price_to','region',
         'min_capacity','max_capacity','mileage_from','mileage_to','damage','customs']
          .map(key => { this.$set(this.form, key, ''); });
        ['body','korobka','engine_type','gearing','n_of_seats','colors']
          .map(key => { this.$set(this.form, key, []); });
        ['credit','exchange_possible','is_matte','in_garanty','with_video']
          .map(key => { this.$set(this.form, key, false); });
        ['all_options']
          .map(key => { this.$set(this.form, key, {}); });
      }
    },
    submitForm() {
      this.beforeSubmitForm();
      // tracking
      this.fbTrack('Search Api');
      this.gtagTrack('AW-600951956/Qeu4CILAyPIBEJSZx54C');
      // update route query params and search announcements
      let searchQuery = `${this.meta.param}=${encodeURI(JSON.stringify(this.getFormData()))}`;
      let searchUrl = `${this.$localePath(this.meta.path)}?${searchQuery}`;
      let searchSame = decodeURIComponent(searchUrl) === decodeURIComponent(this.$route.fullPath);
      this.$emit('pending');
      if(searchSame) {
        this.$emit('submit');
      } else {
        let prevRouteName = this.routeName;
        this.$router.push(searchUrl, () => {
          this.$emit('submit');
          // for ex. when routing from / to /cars
          if(this.routeName !== prevRouteName) {
            setTimeout(() => {
              this.scrollTo('.announcements-sorting');
            }, 100);
          }
          // look for a saved search
          if(this.loggedIn && this.meta.type === 'cars') {
            this.fetchSavedSearch({ search_url: `${this.meta.path}?${searchQuery}` });
          } 
        });
      }
    },
    resetForm(submit = false) {
      this.setFormData({});
      if (submit) this.submitForm();
    },
    getOptionValue(name, key) {
      return this[`get${name}Options`].find(option => option.key === key)?.name || '';
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
      this.setBrand('', key);
      this.rows.splice(index, 1);
    },
    goToSearch(path) {
      this.$router.push(`${path}?${this.meta.param}=${encodeURI(JSON.stringify(this.getFormData()))}`);
    },
    async handlePopState() {
      // refresh page's async data
      await this.$nuxt.refresh();
      // update form
      this.parseFormData();
      this.scrollTo(0);
    },
    async handleAfterLogin(key) {
      if (key === 'saved-search' && this.meta.type === 'cars') {
        this.savedSearch = true;
      }
      this.scrollTo(0);
    }
  },
  computed: {
    ...mapGetters(['singleSavedSearch']),

    savedSearch: {
      get() {
        return !!this.singleSavedSearch.id;
      },
      set() {
        if(!this.loggedIn) return;
        if(this.singleSavedSearch.id) {
          this.deleteSavedSearch(this.singleSavedSearch.id)
            .then(() => {
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
      let hasAllOptions = Object.keys(this.form.all_options).length;
      let hasOptions = Object.keys(this.getFormData()).length > 5 || (this.form.announce_type !== 1);
      return !!(hasBrand || hasAllOptions || hasOptions);
    },
    searchApplied() {
      return !this.isStarterPage && !!this.$route.query[this.meta.param];
    },
    // static data
    getYearOptions() {
      let years = [], j = 0;
      for (let i = this.currentYear; i >= 1886; i--) {
        years[j] = { name: i, key: i }; j++;
      }
      return years;
    },
    getMileageOptions() {
      let zeroFirst = this.meta.type !== 'cars';
      return [
        { name: this.$t('all'), key: zeroFirst ? 0 : 1 },
        { name: this.$t('new'), key: zeroFirst ? 1 : 2 },
        { name: this.$t('with_mileage'), key: zeroFirst ? 2 : 3 }
      ];
    },
    getCurrencyOptions() {
      return [
        { key: 1, name: 'AZN'	},
        { key: 2, name: 'USD'	}
      ];
    },
    getDamageOptions() {
      return [
        { name: this.$t('without_beaten'), key: 1 },
        { name: this.$t('broken'), key: 2 }
      ];
    },
    getCustomsOptions() {
      return [
        { name: this.$t('cleared'), key: 1 },
        { name: this.$t('not_cleared'), key: 2 }
      ];
    },
    getSortingOptions() {
      return [
        { name: this.$t('show_by_date'), key: 'created_at_desc' },
        { name: this.$t('show_expensive_first'), key: 'price_desc' },
        { name: this.$t('show_cheap_first'), key: 'price_asc' },
        { name: this.$t('show_by_mileage'), key: 'mileage_asc' },
        { name: this.$t('show_by_year'), key: 'year_desc' }
      ];
    }
  },
  created() {
    if(!this.isStarterPage) {
      this.parseFormData();
    }
  },
  mounted() {
    this.$nuxt.$on('after-login', this.handleAfterLogin);
    // history (back/forward)
    window.addEventListener('popstate', this.handlePopState);
  },
  beforeDestroy() {
    this.$nuxt.$off('after-login', this.handleAfterLogin);
    // history (back/forward)
    window.removeEventListener('popstate', this.handlePopState);
  }
}