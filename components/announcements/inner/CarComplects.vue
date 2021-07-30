<template>
  <div class="car-complects">
    <h2 class="title-with-line full-width">
      <span>{{ $t('Комплектация') }}</span>
    </h2>
    <template v-for="(group, index) in filteredSellOptions">
      <collapse-content
        :title="getTitle(group, index)"
        :first-collapsed="false"
        :key="index"
      >
        <p v-for="(option, index) in getOptions(group)" :key="index">
          {{ getOptionValue(option, options[option.name]) }}
        </p>
      </collapse-content>
      <hr v-if="index !== filteredSellOptions.length - 1" :key="'hr-'+index" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CollapseContent from '~/components/elements/CollapseContent';

export default {
  props: {
    options: {}
  },
  components: {
    CollapseContent
  },
  data() {
    return {
      titles: [
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
  computed: {
    ...mapGetters(['allSellOptions']),
    
    filteredSellOptions() {
      return this.allSellOptions.filter(group => !!this.getOptions(group).length);
    }
  },
  methods: {
    getTitle(group, index) {
      let len = this.getOptions(group).length;
      return `${this.titles[index]} (${len})`;
    },
    getOptions(group) {
      return group.filter((option) => this.options && this.options[option.name] !== undefined);
    },
    getOptionValue(item, value) {
      if (item.type === 'select') {
        if (value instanceof Array && value.length > 0) {
          let options = [];
          let selected = this.$t(item.placeholder) + ': ';
          for (let i in value) {
            let option = item.options.find(option => option.key == value[i]);
            options[i] = option && this.$t(option.name);
          }
          return selected + options.filter(i => i).join(', ');
        } else if (item.options.find(option => option.key === value)) {
          return this.$t(item.placeholder) + ': ' + this.$t(item.options.find(option => option.key === value).name);
        } else {
          return this.$t(item.placeholder) + ': ' + this.$t(item.options[1].name);
        }
      }
      return this.$t(item.label);
    },
  }
}
</script>