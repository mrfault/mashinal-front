<template>
  <div class="car-complects">
    <h2 class="title-with-line full-width"  v-if="hasAnyOption">
      <span>{{ $t('Комплектация') }}</span>
    </h2>
    <template v-if="tagSellOptions.length">
      <collapse-content
        :title="$t('popular_options')"
        :first-collapsed="false"
        key="popular"
      >
        <keywords
          class="p-0"
          :keywords="tagSellOptions"
          label="label"
        />
      </collapse-content>
      <hr v-if="filteredSellOptions.length" :key="'hr-popular'" />
    </template>
<!--    <template v-if="getOptions(group).length" v-for="(group, index) in filteredSellOptions">-->
<!--      <collapse-content-->
<!--        :title="getTitle(group, index)"-->
<!--        :first-collapsed="!!tagSellOptions.length || index !== 0"-->
<!--        :key="index"-->
<!--      >-->
<!--        <p v-for="(option, index) in getOptions(group)" :key="index">-->
<!--          {{ getOptionValue(option, options[option.name]) }}-->
<!--        </p>-->
<!--      </collapse-content>-->
<!--      <hr v-if="index !== filteredSellOptions.length - 1" :key="'hr-'+index" />-->
<!--    </template>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CollapseContent from '~/components/elements/CollapseContent';
import Keywords from '~/components/announcements/inner/Keywords';

export default {
  props: {
    options: {}
  },
  components: {
    CollapseContent,
    Keywords
  },
  data() {
    return {
      hasAnyOption: false,
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
    ...mapGetters(['allSellOptions', 'popularOptions']),

    filteredSellOptions() {
      return this.allSellOptions;//.filter(group => !!this.getOptions(group).length);
    },
    tagSellOptions() {
      return this.popularOptions.filter((option) => {
        let value = this.options?.[option.name];
        return value instanceof Array ? value.includes(option.selected_key) : value;
      }).map(option => ({...option, label: this.$t(option.label)}) );
    }
  },
  methods: {
    getTitle(group, index) {
      let len = this.getOptions(group).length;
      return `${this.titles[index]} (${len})`;
    },
    getOptions(group) {
      return group.filter((option) => {
        let cur_option = this.options[option.name];
        if(option.type === 'checkbox') {

          if(this.options && cur_option) {
            this.hasAnyOption = true;
            return true;
          }
          return false;
        }
        else if(this.options && cur_option !== undefined) {
          this.hasAnyOption = true;
          return true;
        }

        return false;
      });
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
