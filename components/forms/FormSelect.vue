<template>
  <div class="form-group">
    <div :class="['select-menu',{'no-bg': hasNoBg}]">
      <span :class="['select-menu_label', {'selected': hasSelectedValue, 'disabled': disabled, 'active': showOptions}]" 
        @click="showOptions = disabled ? false : !showOptions">
        <span :class="['text-truncate', {'full-width': hasSearch}]">
          <template v-if="hasSearch && showOptions && !isMobileBreakpoint">
            <span class="search-input">
              <span class="placeholder">{{ label }}: </span>
              <input type="text" @click.stop v-model="search" ref="searchInput" />
            </span>
          </template>
          <template v-else>{{ getLabelText }}</template>
        </span>
        <span class="counter" v-if="multiple && selectValue.length > 1">{{ selectValue.length }}</span>
        <icon name="cross" v-if="allowClear && !hasNoValue" @click.native.stop="clearSelect" class="cursor-pointer" />
        <icon :name="iconName" v-else />
      </span>
      <icon :class="['select-menu_triangle', `anchor-${anchor}`]" name="triangle" v-if="showOptions"/>
      <action-bar 
        :title="getActionBarText"
        v-if="showOptions && isMobileBreakpoint && !inSelectMenu" 
        @back="showOptions = false" 
        @accept="showOptions = false"
        :show-check="(custom || multiple) && !hasNoValue"
      />
      <div :class="['select-menu_dropdown', `anchor-${anchor}`, {'show': showOptions, custom, 'responsive': isMobileBreakpoint}]" ref="dropdownOptions">
        <template v-if="showOptions">
          <div class="mt-3" v-if="hasSearch && isMobileBreakpoint" @click.stop>
            <div class="container">
              <form-text-input :placeholder="$t('search')" iconName="search" v-model="search"/>
            </div>
          </div>
          <div :class="{'container': isMobileBreakpoint}" v-if="custom">
            <slot />
          </div>
          <vue-scroll :ops="scrollOps" ref="vs" v-else :key="vsKey">
            <div :class="{'container': isMobileBreakpoint}">
              <template v-for="(option, index) in getFilteredOptions">
                <div :key="index" :class="['select-menu_dropdown-option', {'selected': isSelected(option), 'anchor': isAnchor(index)}]" 
                    @click.stop="selectValue = option">
                  <div class="text-truncate">
                    <span>{{ getOptionName(option) }}</span>
                  </div>
                  <icon name="check" v-if="isSelected(option)" />
                </div>
              </template>
              <div class="select-menu_dropdown-option disabled" v-if="!getFilteredOptions.length">
                <div class="text-truncate">
                  <span>{{ $t('no_results_found') }}</span>
                </div>
              </div>
            </div>
          </vue-scroll>
        </template>
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
      custom: Boolean,
      anchor: {
        type: String,
        default: 'left'
      },
      multiple: Boolean,
      disabled: Boolean,
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
        default: true
      },
      nameInValue: Boolean,
      objectInValue: Boolean,
      slugInValue: Boolean,
      skipSelect: Boolean,
      skipSelectFirst: Boolean,
      translateOptions: Boolean,
      clearOnDisable: {
        type: Boolean,
        default: true
      },
      suffix: {
        type: String,
        default: ''
      },
      hideOptions: Boolean,
      showLabelOnSelect: {
        type: Boolean,
        default: true
      },
      inSelectMenu: Boolean,
      hasSearch: Boolean,
      hasNoBg: Boolean
    },
    data() {
      return {
        search: '',
        blockClick: false,
        showOptions: false,
        vsKey: 0
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
      getOptionKey(option) {
        const value = this.getValue(option);
        return this.getKey(value);
      },
      isSelected(option) {
        const value = this.getValue(option);
        const hasSameKey = this.nameInValue ? this.selectValue.key === value.key : this.selectValue === value;
        const hasSameObj = this.selectValue instanceof Array && (this.nameInValue ? this.selectValue.findIndex(val => val && val.key == value.key) !== -1 : this.selectValue.includes(value));
        return hasSameKey || hasSameObj;
      },
      isAnchor(index) {
        return this.isSelected(this.getFilteredOptions[(index !== this.getFilteredOptions.length - 1) ? (index + 1) : index]);
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
      getFilteredOptions() {
        if(!this.search || !this.hasSearch) return this.getOptions;
        return this.options.filter(option => this.$search(option.name, this.search));
      },
      getLabelText() {
        if(this.custom) {
          let value;
          let read = this.values.read !== false;
          if (this.values.from && this.values.to) value = `${this.$readNumber(this.values.from, read)} - ${this.$readNumber(this.values.to, read)}`;
          else if (this.values.from || this.values.to) value = `${this.$t(!this.values.from ? 'to' : 'from')} ${this.$readNumber(this.values.from || this.values.to, read)}`;
          else if (this.values.from === 0 || this.values.to === 0) value = `${this.$t(this.values.to === 0 ? 'to' : 'from')} 0`;
          let suffix = this.values.suffix || this.suffix;
          if (value && suffix) value += ` ${suffix}`;
          else suffix = this.suffix || this.values.suffix;
          return value && this.values.showLabel ? `${this.label}: ${value}` : (value || `${this.label}${suffix ? (', '+suffix) : ''}`);
        }
        let selected = this.options.filter(this.isSelected);
        return selected.length === 1
          ? `${(this.showLabelOnSelect && this.allowClear) ? this.label + ': ' : (this.suffix ? (', '+this.suffix) : '')}${this.getOptionName(selected[0])}`
          : this.label;
      },
      getActionBarText() {
        if (this.hasNoValue) return this.getLabelText;
        else if (this.multiple) return this.value.length > 1 ? `${this.label} (${this.value.length})` : this.getLabelText;
        return `${(this.showLabelOnSelect && this.allowClear && !(this.custom && !this.values.showLabel)) ? '' : this.label + ': '}${this.getLabelText}`;
      },
      hasNoValue() {
        if(this.custom) 
          return this.label === this.getLabelText.replace(`, ${this.suffix}`, '');
        if(this.selectValue instanceof Array) {
          for(let i in this.selectValue)
            if(this.options.map(option => this.getValue(option, true)).indexOf(this.getKey(this.selectValue[i])) !== -1)
              return false;
          return true;
        } else return this.selectValue === '' || this.selectValue === null;
      },
      hasSelectedValue() {
        return !this.hasNoValue && !this.skipSelect && !(this.skipSelectFirst && (this.getKey(this.selectValue) === this.getOptionKey(this.getOptions[0])));
      },
      scrollOps() {
        return  {
          scrollPanel: {
            maxHeight: this.isMobileBreakpoint ? undefined : 238
          }
        }
      }
    },
    watch: {
      breakpoint() {
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
          this.$nextTick(() => {
            if(this.hasSearch && !this.isMobileBreakpoint) {
              this.$refs.searchInput?.focus();
            }
            // scroll to the selected option
            if(!this.hasNoValue && !this.isMobileBreakpoint) {
              if(!this.$refs.vs) return;
              this.$refs.vs.scrollIntoView('.select-menu_dropdown-option.anchor', 0);
            }
            // focus on first input
            if(this.custom) {
              this.$el.querySelector('.text-input input')?.focus();
            }
          });
        } else {
          this.search = '';
        }
        // hide overflow when selected
        if(!this.inSelectMenu) {
          document.querySelector('body').classList[val ? 'add' : 'remove']('select-menu-open');
        }
      },
      getFilteredOptions() {
        this.vsKey++;
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