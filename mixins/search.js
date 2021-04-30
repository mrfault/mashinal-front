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
      if(keys.length) this.counter = [...keys];
    },
    submitForm() {
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
              this.scrollTo('.announcements-grid', [-15, -20]);
            }, 100);
          }
          // look for a saved search
          if(this.loggedIn && this.meta.type === 'cars') {
            this.fetchSavedSearch({ search_url: `${this.meta.path}?${searchQuery}` });
          } 
        });
      }
    },
    resetForm() {
      this.setFormData({});
      this.submitForm();
    },
    getOptionValue(name, key) {
      return this[`get${name}Options`].find(option => option.key === key)?.name || '';
    },
    addSearchRow(key) {
      if (this.counter.length === 5) return;
      let keys = Object.keys(this.form.additional_brands);
      let index = this.counter.indexOf(key);
      this.counter.splice(index + 1, 0, keys.filter(key => this.counter.indexOf(key) === -1)[0]);
    },
    removeSearchRow(key) {
      if (this.counter.length === 1) return;
      let index = this.counter.indexOf(key);
      this.setBrand('', key);
      this.counter.splice(index, 1);
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
      return ['/', '/moto', '/commercial'].map(path => this.$localePath(path)).includes(this.$route.path);
    },
    filtersApplied() {
      let hasBrand = this.counter.filter(key => this.form.additional_brands[key].brand).length;
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
    },
    getGroupTitles() {
      return [
        this.$t('accordeon_view'),
        this.$t('accordeon_exterior_elements'),
        this.$t('accordeon_theft_protection'),
        this.$t('accordeon_multimedia'),
        this.$t('accordeon_cabin'),
        this.$t('accordeon_comfort'),
        this.$t('accordeon_security'),
        this.$t('accordeon_other')
      ]
    }
  },
  created() {
    this.parseFormData();
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