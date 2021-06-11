export const ToastErrorsMixin = {
  data() {
    return {
      errors: [],
      toasts: {},
    }
  },
  methods: {
    showError(key, message, options = {}, scroll = false) {
      this.toasts[key] = this.$toasted.error(message, this.getToastOptions);
      this.toasts[key].el.addEventListener('click', () => {
        this.scrollTo(this.$refs[options.fieldView]);
      });
      if(scroll) this.scrollTo(this.$refs[options.fieldView]);
    },
    removeError(field, force = false) {
      if(!force && (!this.form[field] || this.form[field] === '')) return;
      if(this.errors.includes(field)) {
        this.errors = this.errors.filter(key => key !== field);
        this.toasts[field].goAway(100);
      }
    },
    clearErrors() {
      this.errors = [];
      this.toasts = {};
      this.$toasted.clear();
    },
    hasError(field) {
      return {'invalid': this.errors.includes(field), [`field--${field}`]: true };
    },
    hasValue(field, key) {
      let formEl = key !== undefined ? this.form[field][key] :  this.form[field];
      return {'has-value': formEl !== undefined && formEl !== null && (formEl.length || formEl !== '') };
    }
  },
  computed: {
    getToastOptions() {
      return {
        duration: 0,
        action: {text: this.$t('update')}
      }
    }
  },
  beforeDestroy() {
    this.$toasted.clear();
  }
}