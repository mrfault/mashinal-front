export const ToastErrorsMixin = {
  data() {
    return {
      errors: [],
      toasts: {},
    }
  },
  methods: {
    showError(key, message, options = {}, scroll = false) {
      this.toasts[key] = this.$toasted.error(message, {
        duration: 0,
        action: { text: this.$t('update') }
      });
      this.toasts[key].el.addEventListener('click', () => {
        this.scrollTo(`#anchor-${options.fieldView || key}`, options.offset || 0);
      });
      if (scroll) this.scrollTo(`#anchor-${options.fieldView || key}`, options.offset || 0);
    },
    removeError(field, force = false) {
      if (!force && (!this.form[field] || this.form[field] === '')) return;
      if (this.errors.includes(field)) {
        this.errors = this.errors.filter(key => key !== field);
        this.toasts[field].goAway(100);
      }
    },
    clearErrors() {
      this.errors = [];
      this.toasts = {};
      this.$toasted.clear();
    },
    isInvalid(field) {
      return this.errors.includes(field);
    },
    hasValue(field, key) {
      let formEl = key !== undefined ? this.form[field][key] :  this.form[field];
      return {'has-value': formEl !== undefined && formEl !== null && (formEl.length || formEl !== '') };
    }
  },
  beforeDestroy() {
    this.$toasted.clear();
  }
}