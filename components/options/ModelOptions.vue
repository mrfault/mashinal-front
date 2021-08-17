<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="goBack" :bar-title="statusTitle" hide-container>
    <h2 class="title-with-line full-width" v-if="title && !isMobileBreakpoint">
      <span>{{ title }}</span>
    </h2>
    <div class="model-options">
      <div :class="isMobileBreakpoint ? 'mt-3' : `row ${search || !popularOptions ? 'mb-1' : ''}`" @click.stop>
        <div :class="isMobileBreakpoint ? 'container' : 'col-4'">
          <form-text-input :placeholder="inputTitle" icon-name="search" v-model="search"/>
        </div>
      </div>
      <component :is="isMobileBreakpoint ? 'vue-scroll' : 'div'">
        <div :class="isMobileBreakpoint ? 'container' : 'row'">
          <template v-if="popularOptions && !search">
            <div class="row pt-3">
              <template v-for="(option, index) in getPopularOptions">
                <div v-if="index === 10" :key="'break-' +option.id" class="full-width d-none d-lg-block"></div>
                <div :key="option.id" :class="['popular-option', isMobileBreakpoint ? 'col-4' : 'col']" @click.stop="optionsValue = option">
                  <div class="img" v-if="imgKey && option[imgKey]">
                    <img :src="option[imgKey]" :alt="getOptionName(option)" />
                  </div>
                  <div class="text-truncate">
                    <span>{{ getOptionName(option) }}</span>
                  </div>
                </div>
              </template>
            </div>
            <div class="col-lg-12" v-if="!isMobileBreakpoint">
              <hr class="mt-0 mb-3" />
            </div>
          </template>
          <template v-if="isMobileBreakpoint">
            <template v-for="(option, index) in getFilteredOptions">
              <div :key="index" class="model-options_option" @click.stop="optionsValue = option">
                <div class="img" v-if="imgKey && option[imgKey]">
                  <img :src="option[imgKey]" :alt="getOptionName(option)" />
                </div>
                <div class="text-truncate">
                  <span>{{ getOptionName(option) }}</span>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="col-lg-2" v-for="(col, i) in $chunk(getFilteredOptions, Math.ceil(getFilteredOptions.length / 6))" :key="i">
              <template v-for="(option, index) in col">
                <div :key="index" class="model-options_option mb-n1" @click.stop="optionsValue = option">
                  <div class="img" v-if="imgKey && option[imgKey]">
                    <img :src="option[imgKey]" :alt="getOptionName(option)" />
                  </div>
                  <div class="text-truncate">
                    <span :class="{'text-bold': option.popular === 1}">{{ getOptionName(option) }}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div :class="['model-options_option disabled', { 'pl-1 pr-1 mb-n1': !isMobileBreakpoint}]" v-if="!getFilteredOptions.length">
            <div class="text-truncate">
              <span>{{ $t('no_results_found') }}</span>
            </div>
          </div>
        </div>
      </component>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    value: {},
    title: String,
    inputTitle: String,
    statusTitle: String,
    options: Array,
    popularOptions: Array,
    imgKey: String
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    optionsValue: {
      get() {
        return this.value;
      },
      set(option) {
        this.$emit('input', option);
      }
    },
    getFilteredOptions() {
      if (!this.search) return this.options;
      return this.options.filter(option => this.$search(option.name, this.search));
    },
    getPopularOptions() {
      if (!this.popularOptions) return [];
      if (!this.isMobileBreakpoint) 
        return this.options.filter(a => a.popular === 1).slice(0, 20);
      return this.$sortBy(this.options, (a, b) => {
        return this.popularOptions.indexOf(b.id) - this.popularOptions.indexOf(a.id)
      }).slice(0, 6);
    }
  },
  methods: {
    goBack() {
      this.$emit('close');
    },
    getOptionName(option) {
      return option.name[this.locale] || option.name;
    }
  }
}
</script>