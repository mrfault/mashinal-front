<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" :bar-title="title" action-icon="reset"
             @action="$emit('clean')" @back="$emit('close')">
    <h2 v-if="title && !isMobileBreakpoint && !isModeration" class="title-with-line full-width">
      <span>{{ title }}</span>
    </h2>
    <title-with-line-and-reject-reason
      v-if="title && !isMobileBreakpoint && isModeration"
      :title="title"
      rejectKey="body_type"
      @change="changeReason"
    />
    <div class="year-options">
      <div :class="isMobileBreakpoint ? 'pt-3' : ''" @click.stop>
        <form-buttons v-model="yearsValue" :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 3 : 10"
                      :options="options"/>
      </div>
    </div>
  </component>
</template>

<script>
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

export default {
  components: {
    TitleWithLineAndRejectReason
  },
  props: {
    value: {},
    title: String,
    years: Object,
    isModeration: Boolean,
    rejectKey: String,
  },
  computed: {
    yearsValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },

    options() {
      let years = [];
      if (this.years.years) {
        years = this.years.years;
      } else {
        for (let i = this.years.max; i >= this.years.min; i--) {
          years.push(i);
        }
      }
      return years.map(year => ({key: year, name: year}));
    }
  },
  methods: {
    changeReason() {
      this.$emit('changeReason', this.rejectKey)
    }
  }
}
</script>
