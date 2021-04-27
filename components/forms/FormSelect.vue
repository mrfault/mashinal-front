<template>
  <div class="form-group">
    <div class="select-menu">
      <span :class="['select-menu_label', {'selected': hasSelectedValue, 'disabled': disabled, 'active': showOptions}]" 
        @click="showOptions = !showOptions">
        <span class="text-truncate">{{ getLabelText }}</span>
        <span class="counter" v-if="multiple && selectValue.length > 1">{{ selectValue.length }}</span>
        <icon name="cross" v-if="allowClear && !hasNoValue" @click.native.stop="clearSelect"/>
        <icon :name="iconName" v-else />
      </span>
      <icon class="select-menu_triangle" name="triangle" v-if="showOptions"/>
      <go-back :title="label" v-if="showOptions && isMobileBreakpoint && !inSelectMenu" @go="showOptions = false" />
      <div :class="['select-menu_dropdown', {'show': showOptions, custom, 'responsive': isMobileBreakpoint}]" ref="dropdownOptions">
        <div :class="{'container': isMobileBreakpoint}">
          <slot v-if="custom" />
          <vue-scroll :ops="scrollOps" ref="vs" v-else-if="showOptions">
            <div :class="['select-menu_dropdown-option', {'selected': isSelected(option)}]" v-for="(option, index) in getOptions" :key="index"
                @click.stop="selectValue = option">
              <div class="text-truncate">
                <span>{{ $translateHard(option.name[locale]) || (translateOptions ? $t(option.name) : $translateHard(option.name)) }}{{ suffix ? ' ' + suffix : '' }}</span>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      values: {
        type: Object,
        default: () => ({})
      },
      id: String,
      options: {
        type: Array,
        default: () => ([])
      },
      custom: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      iconName: {
        type: String,
        default: 'chevron-down'
      },
      allowClear: {
        type: Boolean,
        default: true
      },
      clearOption: {
        type: Boolean,
        default: false
      },
      nameInValue: {
        type: Boolean,
        default: false
      },
      objectInValue: {
        type: Boolean,
        default: false
      },
      slugInValue: {
        type: Boolean,
        default: false
      },
      skipSelect: {
        type: Boolean,
        default: false
      },
      skipSelectFirst: {
        type: Boolean,
        default: false
      },
      translateOptions: {
        type: Boolean,
        default: false
      },
      clearOnDisable: {
        type: Boolean,
        default: true
      },
      suffix: {
        type: String,
        default: ''
      },
      hideOptions: {
        type: Boolean,
        default: false
      },
      showLabelOnSelect: {
        type: Boolean,
        default: true
      },
      inSelectMenu: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        blockClick: false,
        showOptions: false
      }
    },
    methods: {
      getValue(option, onlykey = false) {
        const name = option.name[this.locale] || option.name.ru || option.name;
        const key = this.$notUndefined(option.id,option.key);
        if(!onlykey && this.slugInValue)
          return option.slug || key;
        if(!onlykey && this.nameInValue) {
          return { key: key, name: name }
        }
        return this.$notUndefined(key,name);
      },
      getKey(value) {
        return value.key !== undefined ? value.key : value;
      },
      getOptionName(option) {
        return `${this.$translateHard(option.name?.[this.locale]) || (this.translateOptions ? this.$t(option.name) : this.$translateHard(option.name))}${this.suffix ? ' ' + this.suffix : ''}`;
      },
      isSelected(option) {
        const value = this.getValue(option);
        const hasSameKey = this.nameInValue ? this.selectValue.key === value.key : this.selectValue === value;
        const hasSameObj = this.selectValue instanceof Array && (this.nameInValue ? this.selectValue.findIndex(val => val && val.key == value.key) !== -1 : this.selectValue.includes(value));
        return hasSameKey || hasSameObj;
      },
      clearSelect() {
        this.selectValue = undefined;
        this.showOptions = false;
        this.$emit('clear');
      },
      handleDocClick(event) {
        let clickedInsideDropdown = this.$refs.dropdownOptions.contains(event.target);
        if(!clickedInsideDropdown && !this.blockClick) {
          this.showOptions = false;
        }
      }
    },
    computed: {
      selectValue: {
        get() {
          return this.value;
        },
        set(option) {
          if (this.disabled) return;
          let value;
          if (option === undefined) {
            value = this.multiple ? [] : '';
          } else {
            value = this.getValue(option);
            if(this.clearOption && this.getKey(value) === -1) {
              this.clearSelect();
              return;
            } else {
              value = this.isSelected(option) 
                ? (this.multiple ? (this.value || []).filter((v) => this.getKey(v) !== this.getKey(value)) : value)
                : (this.multiple ? [...(this.value || []), value] : value);
            }
          }
          if (!this.multiple) this.showOptions = false;
          // emit changes
          this.$emit('input', value);
          this.$emit('change', value);
        }
      },
      getOptions() {
        let addons = this.clearOption ? [{ key: -1, name: this.$t('any') }] : []
        return [...addons, ...this.options];
      },
      getLabelText() {
        if(this.custom) {
          let value;
          let read = this.values.read !== false;
          if (this.values.from && this.values.to) value = `${this.$readNumber(this.values.from, read)} - ${this.$readNumber(this.values.to, read)}`;
          else if (this.values.from || this.values.to) value = `${this.$t(!this.values.from ? 'to' : 'from')} ${this.$readNumber(this.values.from || this.values.to, read)}`;
          else if (this.values.from === 0 || this.values.to === 0) value = `${this.$t(this.values.to === 0 ? 'to' : 'from')} 0`;
          if (value && this.values.suffix) value += ` ${this.values.suffix}`;
          return value || this.label;
        }
        let selected = this.options.filter(this.isSelected);
        return selected.length === 1
          ? `${(this.showLabelOnSelect && this.allowClear) ? this.label + ': ' : ''}${this.getOptionName(selected[0])}`
          : this.label;
      },
      hasNoValue() {
        if(this.custom) 
          return this.label === this.getLabelText;
        if(this.selectValue instanceof Array) {
          for(let i in this.selectValue)
            if(this.options.map(option => this.getValue(option, true)).indexOf(this.getKey(this.selectValue[i])) !== -1)
              return false;
          return true;
        } else return this.selectValue === '' || this.selectValue === null;
      },
      hasSelectedValue() {
        return !this.hasNoValue && !this.skipSelect && !(this.skipSelectFirst && this.getKey(this.selectValue) === -1);
      },
      scrollOps() {
        return {
          scrollPanel: {
            scrollingX: false,
            maxHeight: this.isMobileBreakpoint ? undefined : 238
          },
          rail: {
            background: this.colorMode === 'dark' ? '#1C1C1E' : (this.isMobileBreakpoint ? '#FFFFFF' : '#ECF2F9'),
            opacity: 1,
          },
          bar: {
            background: this.colorMode === 'dark' ? '#606061' : (this.isMobileBreakpoint ? '#ECF2F9' : '#FFFFFF')
          }
        }
      }
    },
    watch: {
      breakpoint(breakpoint) {
        this.showOptions = false;
      },
      disabled(disabled) {
        if(disabled && this.clearOnDisable) this.clearSelect();
      },
      value() {
        if(this.value === undefined) 
          this.selectValue = undefined;
      },
      showOptions(val) {
        if(val) {
          this.blockClick = true;
          setTimeout(() => {
            this.blockClick = false;
          }, 0);
          // scroll to the selected option
          if(!this.hasNoValue) {
            this.$nextTick(() => {
              if(!this.$refs.vs) return;
              this.$refs.vs.scrollIntoView('.select-menu_dropdown-option.selected', 0);
            });
          }
        }
        // hide overflow when selected
        if(!this.inSelectMenu) {
          document.querySelector('body').classList[val ? 'add' : 'remove']('select-menu-open');
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.handleDocClick);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleDocClick);
    }
  }
</script>

<style lang="scss">
  
</style>