<template>
  <div class="multiselect" :class="selectedKey">
    <multiselect-moderator
      :tabindex="tabindex"
      :class="{'error': hasError }"
      v-model="value"
      @select="handleSelect"
      :options="options"
      :multiple="multiple"
      :hide-placeholder="hidePlaceholder"
      :custom-prop-label="$t(customLabel)"
      :close-on-select="!multiple"
      :clear-on-select="false"
      :preserve-search="false"
      :placeholder="placeholder"
      :suffix="suffix"
      :allow-empty="multiple"
      :searchable="searchable"
      :disabled="disabled"
      :withAllOption="withAllOption"
      :hasTranslation="hasTranslation"
      :label="label"
      :track-by="trackBy"
      :select-key="selectedKey"
      :preselect-first="false"
    >
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single"
              v-if="multiple && values.length > 1"><template v-if="!hidePlaceholder && ['currency', 'sell_store'].indexOf(selectedKey) === -1">{{ placeholder }}: </template><template v-if="!showNamesInLabel">({{ values.length }})</template><template v-else>{{ getCSNames(values) }}</template></span>
        <span class="multiselect__single"
              v-else-if="values.length  ===  1 && hasTranslation"><template v-if="!hidePlaceholder && ['currency', 'sell_store'].indexOf(selectedKey) === -1">{{ placeholder }}: </template>{{ $t(values[0].name) }}</span>
        <span class="multiselect__single"
              v-else-if="values.length  ===  1 && !hasTranslation"><template v-if="!hidePlaceholder && ['currency', 'sell_store'].indexOf(selectedKey) === -1">{{ placeholder }}: </template>{{ values[0].short_name || values[0].name }}</span>
      </template>
    </multiselect-moderator>
    <!-- <div :id="selectedKey" v-if="hasError" class="tooltip-class" style="top:38%">
      <div class="error-svg" @mouseover="showToolTip = true" @mouseout="showToolTip = false">
        <svg-icon name="nida" style="width: 20px; height: 20px;"/>
      </div>
      <transition name="fade">
        <div v-if="showToolTip" class="error-tooltip"> {{$t('not_all_fields_completed')}}</div>
      </transition>
    </div> -->
  </div>
</template>

<script>
import MultiselectModerator from '~/components/moderator/multiselectModerator.vue'
export default {
  components:{
    MultiselectModerator
  },
  props: {
    tabindex: {
      type: Number,
      default: 0
    },
    customLabel: {
      default:  'any',
    },
    hasError: {
      type: Boolean,
      default: false
    },
    trackBy: {
      default: 'name'
    },
    label: {
      default: 'name'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    allowEmpty: {
      default: true,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    withAllOption: {
      type: Boolean,
      default: true,
    },
    hasTranslation: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      default: false,
    },
    setDefaultValueOnCreate: {
      default: false
    },
    suffix: {
      default: ''
    },
    selectedKey: {
      default: null,
    },
    placeholder: {
      default: 'in props'
    },
    hidePlaceholder: {
      default: false
    },
    showNamesInLabel: {
      default: false
    },
    multiple: {
      default: true
    },
    small: {
      default: ''
    },
    selectKey: {},
    options: {
      default: [],
    }
  },
  data() {
    return {
      showToolTip: false,
      value: ''
    }
  },
  created() {
    if(this.setDefaultValueOnCreate && this.defaultValue)
      this.setDefaultValue(this.defaultValue);
  },
  mounted() {

    if(!this.setDefaultValueOnCreate && this.defaultValue)
      this.setDefaultValue(this.defaultValue);
    this.$nuxt.$on('clear-buttons', () => {
      this.value = '';
    });

    if (this.selectedKey === 'min_year') {
      this.$nuxt.$on('change_min_year', (year) => {
        this.value = {
          key: year,
          name: year,
        };
      })
    }
  },
  methods: {
    handleSelect(v) {
      if (!this.multiple) {
        if (!v.value.id && !v.value.name && v.value) {
          this.value = '';
        }
      }
      this.$emit('select-changed', v);
    },
    setDefaultValue(value) {

      if (this.multiple && Array.isArray(value) && typeof value[0] === 'object') {
        this.value = [];
        let i = 0;
        this.options.map((option,index) => {
          if(value.find(v => v.key === option.key)) {
            this.$set(this.value,i,option);
            i++;
          }
        });
      }

      else if (this.multiple && Array.isArray(value)) {
        this.value = this.options.filter(option => value.includes(option.key || option.name));
      }
      else if(value[0] !== undefined && value[0].hasOwnProperty('key')){
        let keys = value.map((item) => {
          return item.key || item.name;
        });

        this.value = this.options.filter(option => keys.includes(option.key || option.name));
      }
      else {

        if (value.hasOwnProperty('id')) {
          if(value.id !== undefined) {
            this.value = this.options.find(option => (option.id || option.key) === value.id);
          }
        } else if (value.hasOwnProperty('name') && value.name !== undefined) {
          this.value = this.options.find(option => (option.name) === value.name);
        } else if (value !== false && value !== undefined)
          this.value = this.options.find(option => (option.key) === value);
      }
    },
    getCSNames(values) {
      return values
        .sort((a,b) => a.key - b.key)
        .map(v => v.short_name || v.name)
        .join(', ');
    }
  },

  watch: {
    defaultValue(value) {
      //if(value) this.setDefaultValue(value);
    },
    options(options) {
      if (this.selectedKey === 'model' || this.selectedKey === 'generation') {
        if (this.value) {
          let selectedOption = options.find(option => option.id === this.value.id);
          if (!selectedOption) this.value = '';
        }
      }

      if (!options.length) {
        this.value = '';
      }
    }
  }
}
</script>
<style lang="scss">

.error-tooltip {
  width: 140px;
  height: 25px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 20px;
  top: -12px;
  margin-left: 10px;
  border-radius: 2px;
  border: solid 1px #4787c4;
  background-color: #f7fbff;
  font-size: 10px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.8;
  letter-spacing: normal;
  text-align: center;
  color: #1e5d98;
}

.error {
  margin-right: 20px;

  .multiselect__tags {
    border: solid 1px #ec0030 !important;
    background-color: #fff !important;

    span {
      color: #ec0030;
    }

  }
}

span.multiselect__option.multiselect__option--highlight:after {
  background: none !important;
}

.multiselect__tags-wrap {
  display: none;
}

.multiselect.region_id {
  max-width: 290px;
}

.multiselect {
  width: 100%;
  -webkit-appearance: none;
  border-radius: 2px;
  color: #050B26;
  font-weight: 400;
  line-height: 18px;
  height: 30px;
  background-position: 95% 50%;
  background-repeat: no-repeat;
  font-size: 12px;
}

.multiselect__tags {
  position: relative;
  cursor: pointer;
  width: 100%;
  -webkit-appearance: none;
  border-radius: 2px;
  border: 1px solid #E6E8F2;
  color: #050B26;
  font-weight: 400;
  line-height: 12px;
  height: 30px;
  background-color: #FFFFFF;
  background-position: 95% 50%;
  background-repeat: no-repeat;
  font-size: 12px;
  min-height: auto;
  display: flex;
  align-items: center;
}

.multiselect__tags:after {
  transition: 0.3s;
  content: '';
  position: absolute;
  width: 7px;
  height: 6px;
  top: 10px;
  right: 7px;
  background-image: url('/images/select_bg.svg');
  background-repeat: no-repeat;
  background-size: contain;
}

.multiselect--active .multiselect__tags:after {
  transition: 0.3s;
  top: 11px;
  transform: rotate(-180deg);
  background-image: url('/images/select__bg__active.svg');
}

.multiselect__input, .multiselect__single {
  background-color: transparent;
}

.multiselect__select {
  display: none;
}

.multiselect__placeholder {
  font-size: 12px;
  opacity: 1 !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.multiselect.currency{
  .multiselect__placeholder{
    overflow: unset;
  }
}

.multiselect__input::placeholder, .multiselect__single::placeholder {
  font-size: 12px !important;
}

.multiselect__single {
  margin-bottom: 0;
  font-size: 12px;
}

.multiselect__element .multiselect__option--selected path {
  fill: rgb(67, 160, 71) !important;
}
</style>

