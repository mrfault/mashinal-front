<template>
  <div class="form-group">
    <div :class="['select-menu', { 'no-bg': hasNoBg, invalid, wider }]">
      <span
        :class="[
          'select-menu_label',
          {
            selected: hasSelectedValue,
            disabled: disabled,
            active: showOptions,
          },
        ]"
        @click="displayMenuOptions"
      >
        <span :class="['text-truncate', { 'full-width': hasSearch }]">
          <template v-if="hasCards && getSelectedOptions[0]">
            <span
              class="d-flex align-items-center"
              v-if="getSelectedOptions[0]"
            >
              <img
                :src="getSelectedOptions[0].icon"
                :alt="getSelectedOptions[0].brand"
                width="32"
                height="16"
                class="mr-1"
              />
              <span class="placeholder">
                {{ getSelectedOptions[0].name.slice(10) }}
              </span>
            </span>
          </template>
          <template v-else-if="hasCards">{{ clearOptionText }}</template>
          <template v-else-if="hasSearch && showOptions && !isMobileBreakpoint">
            <span class="search-input">
              <span class="placeholder">{{ label }}:</span>
              <input
                type="text"
                @click.stop
                v-model="search"
                ref="searchInput"
                @keyup.enter="handleSearchSubmit"
              />
            </span>
          </template>
          <template v-else>{{ getLabelText }}</template>
        </span>
        <span
          class="counter"
          v-if="multiple && selectValue.length > 1 && !shortNamesLabel"
        >
          {{ selectValue.length }}
        </span>
        <span class="counter" v-else-if="custom && values.count">
          {{ values.count }}
        </span>
        <icon
          name="cross"
          v-if="allowClear && !hasNoValue"
          @click.native.stop="clearSelect"
          class="cursor-pointer"
        />
        <!-- <inline-svg src="/icons/cross.svg" height="14" v-if="allowClear && !hasNoValue" @click.native.stop="clearSelect" class="cursor-pointer" /> -->
        <icon :name="iconName" v-else />
      </span>
      <icon
        :class="[
          'select-menu_triangle',
          `anchor-${anchor} anchor-${placeOptionsAbove ? 'top' : 'bottom'}`,
        ]"
        name="triangle"
        v-if="showOptions"
      />
      <portal to="mobile-dropdown" v-if="isMobileBreakpoint">
        <action-bar
          class="priority-1"
          :title="getActionBarText"
          :useBack="false"
          v-if="showOptions && isMobileBreakpoint && !inSelectMenu"
          @back="showOptions = false"
          @accept="showOptions = false"
          :show-check="(custom || multiple) && !hasNoValue"
        />
        <div
          :class="[
            'select-menu_dropdown responsive',
            `anchor-${anchor}`,
            {
              show: showOptions,
              custom,
              'custom-checkboxes': customCheckboxes,
            },
          ]"
        >
          <template v-if="showOptions">
            <div class="my-3" v-if="hasSearch && !hasGenerations" @click.stop>
              <div class="container">
                <form-text-input
                  v-model="search"
                  :placeholder="$t('search')"
                  icon-name="search"
                  block-class="placeholder-lighter"
                />
              </div>
            </div>
            <div class="container" v-if="custom">
              <slot />
            </div>
            <vue-scroll
              :ops="scrollOps"
              ref="vsMob"
              v-else
              :key="vsKey"
              @handle-scroll-complete="handleScroll"
              @handle-scroll="handleScroll"
            >
              <div class="container">
                <div class="row pt-3" v-if="popularOptions && !search">
                  <div
                    v-for="option in $sortBy(
                      getFilteredOptions,
                      (a, b) =>
                        popularOptions.indexOf(b.id) -
                        popularOptions.indexOf(a.id),
                    ).slice(0, 6)"
                    :key="option.id"
                    class="col-4 popular-option"
                    @click.stop="selectValue = option"
                  >
                    <div class="img" v-if="imgKey">
                      <img
                        :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                        :alt="getOptionName(option)"
                      />
                    </div>
                    <div class="text-truncate">
                      <span>{{ getOptionName(option) }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-2"
                  v-if="hasGenerations && getFilteredOptions.length"
                >
                  <form-buttons
                    v-model="selectGeneration"
                    :options="getFilteredOptions"
                    :btn-class="'primary-outline select-generation'"
                    :group-by="2"
                  >
                    <template #custom="{ button }">
                      <div
                        :style="getGenerationStyle(button)"
                        :class="[
                          'generation-bg',
                          { 'no-img': !!getGenerationStyle(button).noImg },
                        ]"
                      ></div>
                      <div class="generation-info">
                        <span>
                          {{ button.start_year }} —
                          {{ button.end_year || currentYear }}
                        </span>
                        <span>{{ button.short_name[locale] }}</span>
                      </div>
                    </template>
                  </form-buttons>
                </div>
                <template v-else-if="getFilteredOptions.length">
                  <template v-for="(option, index) in getFilteredOptions">
                    <div
                      :key="index"
                      :class="[
                        'select-menu_dropdown-option',
                        {
                          selected: isSelected(option),
                          anchor: isAnchor(index),
                          'card-option': hasCards && option.brand,
                        },
                      ]"
                      @click.stop="selectValue = option"
                    >
                      <div
                        class="img"
                        v-if="
                          imgKey && (!hasCards || (hasCards && option[imgKey]))
                        "
                      >
                        <img
                          :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                          :alt="getOptionName(option)"
                        />
                      </div>
                      <div class="text-truncate">
                        <span>{{ getOptionName(option) }}</span>
                      </div>
                      <icon name="check" v-if="isSelected(option)" />
                    </div>
                  </template>
                </template>
                <div class="select-menu_dropdown-option disabled" v-else>
                  <div class="text-truncate">
                    <span>{{ $t('no_results_found') }}</span>
                  </div>
                </div>
              </div>
            </vue-scroll>
          </template>
        </div>
      </portal>
      <template v-else>
        <div
          :class="[
            'select-menu_dropdown',
            `anchor-${anchor} anchor-${placeOptionsAbove ? 'top' : 'bottom'}`,
            {
              show: showOptions,
              custom,
              'custom-checkboxes': customCheckboxes,
            },
          ]"
          ref="dropdownOptions"
          @mouseenter="addScrollStopToBody()"
          @mouseleave="removeScrollStopToBody()"
        >
          <template v-if="showOptions">
            <div v-if="custom">
              <slot />
            </div>
            <vue-scroll
              :ops="scrollOps"
              ref="vs"
              v-else
              :key="vsKey"
              @handle-scroll-complete="handleScroll"
              @handle-scroll="handleScroll"
            >
              <div class="row pt-3" v-if="popularOptions && !search">
                <div
                  v-for="option in $sortBy(
                    getFilteredOptions,
                    (a, b) =>
                      popularOptions.indexOf(b.id) -
                      popularOptions.indexOf(a.id),
                  ).slice(0, 6)"
                  :key="option.id"
                  class="col-4 popular-option"
                  @click.stop="selectValue = option"
                >
                  <div class="img" v-if="imgKey">
                    <img
                      :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                      :alt="getOptionName(option)"
                    />
                  </div>
                  <div class="text-truncate">
                    <span>{{ getOptionName(option) }}</span>
                  </div>
                </div>
              </div>
              <template v-for="(option, index) in getFilteredOptions">
                <template v-if="hasCards && index !== 0">
                  <div
                    :class="{
                      'pl-2 pr-2': index !== getFilteredOptions.length - 1,
                    }"
                    :key="`hr_${index}`"
                  >
                    <hr class="mb-0 mt-0" />
                  </div>
                </template>
                <div
                  :key="index"
                  :class="[
                    'select-menu_dropdown-option',
                    {
                      selected: isSelected(option),
                      anchor: isAnchor(index),
                      'card-option': hasCards && option.brand,
                    },
                  ]"
                  @click.stop="selectValue = option"
                >
                  <template v-if="hasCards">
                    <div class="d-flex full-width">
                      <div
                        class="card-brand-img mr-1"
                        v-if="imgKey && option.brand"
                      >
                        <div class="img">
                          <img
                            :src="$withBaseUrl(option[imgKey])"
                            :alt="getOptionName(option)"
                          />
                        </div>
                      </div>
                      <div
                        :class="[
                          'text-truncate',
                          { 'full-width text-center': !option.brand },
                        ]"
                      >
                        <span v-if="option.brand">{{ option.brand }}</span>
                        <span>{{ getOptionName(option) }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="img" v-if="imgKey">
                      <img
                        :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                        :alt="getOptionName(option)"
                      />
                    </div>
                    <div class="text-truncate">
                      <span>{{ getOptionName(option) }}</span>
                    </div>
                  </template>
                  <icon name="check" v-if="isSelected(option)" />
                </div>
              </template>
              <div
                class="select-menu_dropdown-option disabled"
                v-if="!getFilteredOptions.length"
              >
                <div class="text-truncate">
                  <span>{{ $t('no_results_found') }}</span>
                </div>
              </div>
            </vue-scroll>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    values: {
      type: Object,
      default: () => ({}),
    },
    id: String,
    options: {
      type: Array,
      default: () => [],
    },
    custom: Boolean,
    customCheckboxes: Boolean,
    anchor: {
      type: String,
      default: 'left',
    },
    multiple: Boolean,
    disabled: Boolean,
    label: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'chevron-down',
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    clearOption: {
      type: Boolean,
      default: true,
    },
    clearOptionText: String,
    clearOptionPullDown: Boolean,
    nameInValue: Boolean,
    objectInValue: Boolean,
    slugInValue: Boolean,
    skipSelect: Boolean,
    skipSelectFirst: Boolean,
    translateOptions: Boolean,
    clearOnDisable: {
      type: Boolean,
      default: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    hideOptions: Boolean,
    showLabelOnSelect: {
      type: Boolean,
      default: true,
    },
    showLabelOnlyOnActionBar: Boolean,
    inSelectMenu: Boolean,
    hasSearch: Boolean,
    hasNoBg: Boolean,
    hasGenerations: Boolean,
    popularOptions: Array,
    imgKey: String,
    imgPlaceholder: String,
    invalid: Boolean,
    shortNamesLabel: Boolean,
    checkOptionsOffset: Boolean,
    wider: Boolean,
    hasCards: Boolean,
  },
  data() {
    return {
      search: '',
      blockClick: false,
      showOptions: false,
      placeOptionsAbove: false,
      vsKey: 0,
      scrolStopTrigger: true,
    }
  },
  methods: {
    handleScroll(v, h, event) {
      event.stopPropagation()
    },
    displayMenuOptions() {
      this.showOptions = this.disabled ? false : !this.showOptions
    },
    getValue(option, onlykey = false) {
      const name = option.name[this.locale] || option.name.ru || option.name
      const key = this.$notUndefined(option.id, option.key)
      if (!onlykey && this.slugInValue) return option.slug || key
      if (!onlykey && this.nameInValue) {
        return { key: key, name: name }
      }
      return this.$notUndefined(key, name)
    },
    getKey(value) {
      return value.key !== undefined ? value.key : value
    },
    getOptionName(option) {
      return `${
        this.$translateHard(option.name?.[this.locale]) ||
        (this.translateOptions
          ? this.$t(option.name)
          : this.$translateHard(option.name))
      }${this.suffix ? ' ' + this.suffix : ''}`
    },
    getOptionKey(option) {
      const value = this.getValue(option)
      return this.getKey(value)
    },
    isSelected(option) {
      const value = this.getValue(option)
      const hasSameKey = this.nameInValue
        ? this.selectValue.key === value.key
        : this.selectValue === value
      const hasSameObj =
        this.selectValue instanceof Array &&
        (this.nameInValue
          ? this.selectValue.findIndex((val) => val && val.key == value.key) !==
          -1
          : this.selectValue.includes(value))
      return hasSameKey || hasSameObj
    },
    isAnchor(index) {
      return this.isSelected(
        this.getFilteredOptions[
          index !== this.getFilteredOptions.length - 1 ? index + 1 : index
          ],
      )
    },
    clearSelect() {
      this.selectValue = undefined
      this.showOptions = false
      this.$emit('clear')
    },
    handleSearchSubmit() {
      if (this.search && this.getFilteredOptions.length) {
        this.selectValue = this.getFilteredOptions[0]
      }
    },
    handleDocClick(e) {
      if (this.isMobileBreakpoint) return
      let clickedInsideDropdown = this.$refs.dropdownOptions.contains(e.target)
      if (!clickedInsideDropdown && !this.blockClick) {
        this.showOptions = false
      }
    },
    getGenerationStyle(o) {
      const getImage = (media) =>
        media && media.length > 0 ? this.$withBaseUrl(media[0]) : false
      let imgUrl = getImage(o.car_type_generation?.[0]?.transformed_media.thumb)
      return imgUrl ? { backgroundImage: `url('${imgUrl}')` } : { noImg: true }
    },
    addScrollStopToBody() {
      const body = document.body
      //body.classList.add('ma-stop-scroll')
    },
    removeScrollStopToBody() {
      const body = document.body
      //body.classList.remove('ma-stop-scroll')
    },
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(option) {
        if (this.disabled) return
        let value
        if (option === undefined) {
          value = this.multiple ? [] : ''
        } else {
          value = this.getValue(option)
          if (this.clearOption && this.getKey(value) === -1) {
            this.clearSelect()
            return
          } else {
            value = this.isSelected(option)
              ? this.multiple
                ? (this.value || []).filter(
                  (v) => this.getKey(v) !== this.getKey(value),
                )
                : value
              : this.multiple
                ? [...(this.value || []), value]
                : value
          }
        }
        if (!this.multiple) this.showOptions = false
        // emit changes
        this.$emit('input', value)
        this.$emit('change', value)
      },
    },
    selectGeneration: {
      get() {
        return this.selectValue ? this.getKey(this.selectValue) : ''
      },
      set(value) {
        this.selectValue = this.getOptions.find(
          (option) => this.getOptionKey(option) == value,
        )
      },
    },
    getOptions() {

      if (this.hasGenerations && this.isMobileBreakpoint) return this.options

      return this.clearOptionPullDown ? [...this.options] : [ ...this.options]
    },
    getSelectedOptions() {
      return this.options.filter(this.isSelected)
    },
    getFilteredOptions() {
      if (!this.search || !this.hasSearch) return this.getOptions
      return this.options.filter((option) =>
        this.$search(this.getOptionName(option), this.search),
      )
    },
    getLabelText() {
      if (this.custom) {
        let value
        let read = this.values.read !== false
        if (this.values.from && this.values.to)
          value = `${this.$readNumber(
            this.values.from,
            read,
          )} — ${this.$readNumber(this.values.to, read)}`
        else if (this.values.from || this.values.to)
          value = `${
            this.values.showPreposition
              ? this.$t(!this.values.from ? 'to' : 'from') + ' '
              : ''
          }${this.$readNumber(this.values.from || this.values.to, read)}`
        else if (this.values.from === 0 || this.values.to === 0)
          value = `${this.$t(this.values.to === 0 ? 'to' : 'from')} 0`
        let suffix = this.values.suffix || this.suffix
        if (value && suffix) value += ` ${suffix}`
        else suffix = this.suffix || this.values.suffix
        return value && this.values.showLabel
          ? `${this.label}${
            this.values.count ? ` (${this.values.count})` : `: ${value}`
          }`
          : value || `${this.label}${suffix ? ', ' + suffix : ''}`
      }

      let selected = this.getSelectedOptions

      if (this.shortNamesLabel) {
        return selected.length
          ? `${this.label}: ${selected
            .map((option) => option.nameShort)
            .join(', ')}`
          : this.label
      }

      return selected.length === 1
        ? `${
          this.showLabelOnSelect && this.allowClear
            ? this.label + ': ' + (this.suffix ? ', ' + this.suffix : '')
            : ''
        }${this.getOptionName(selected[0])}`
        : this.label
    },
    getActionBarText() {
      if (this.hasNoValue) return this.getLabelText
      if (this.showLabelOnlyOnActionBar) return this.label
      else if (this.multiple)
        return this.value.length > 1
          ? `${this.label} (${this.value.length})`
          : this.getLabelText
      else if (this.custom && this.values.count)
        return `${this.label} (${this.values.count})`
      return `${
        this.showLabelOnSelect &&
        this.allowClear &&
        !(this.custom && !this.values.showLabel)
          ? ''
          : this.label
            ? this.label + ': '
            : ''
      }${this.getLabelText}`
    },
    hasNoValue() {
      if (this.custom)
        return this.values?.count
          ? false
          : this.label === this.getLabelText.replace(`, ${this.suffix}`, '')
      if (this.selectValue instanceof Array) {
        for (let i in this.selectValue)
          if (
            this.options
              .map((option) => this.getValue(option, true))
              .indexOf(this.getKey(this.selectValue[i])) !== -1
          )
            return false
        return true
      } else return this.selectValue === '' || this.selectValue === null
    },
    hasSelectedValue() {
      return (
        !this.hasNoValue &&
        !this.skipSelect &&
        !(
          this.skipSelectFirst &&
          this.getKey(this.selectValue) ===
          this.getOptionKey(this.getOptions[0])
        )
      )
    },
    scrollOps() {
      return {
        scrollPanel: {
          maxHeight: this.isMobileBreakpoint ? undefined : 238,
        },
      }
    },
  },
  watch: {
    breakpoint() {
      this.showOptions = false
      document?.body?.classList.remove('select-menu-open')
    },
    disabled(disabled) {
      if (disabled && this.clearOnDisable) this.clearSelect()
    },
    value(value) {
      if (this.value === undefined) this.selectValue = undefined
    },
    showOptions(val) {
      this.scrolStopTrigger = val
      if (val) {
        this.blockClick = true
        setTimeout(() => {
          this.blockClick = false
        }, 0)
        this.$nextTick(() => {
          // check window offset
          if (this.checkOptionsOffset && !this.isMobileBreakpoint) {
            let emptySpace =
              window.innerHeight -
              this.$refs.dropdownOptions.getBoundingClientRect().bottom
            this.placeOptionsAbove = emptySpace < 20
          }
          // auto focus
          if (this.hasSearch && !this.isMobileBreakpoint) {
            this.$refs.searchInput?.focus()
          }
          // scroll to the selected option
          if (!this.hasNoValue && !this.isMobileBreakpoint) {
            if (!this.$refs.vs) return
            this.$refs.vs.scrollIntoView(
              '.select-menu_dropdown-option.anchor',
              0,
            )
          }
          // focus on first input
          if (this.custom) {
            this.$el?.querySelector('.text-input input')?.focus()
          }
        })
      } else {
        this.removeScrollStopToBody()
        this.placeOptionsAbove = false
        this.search = ''
      }
      // hide overflow when selected
      if (!this.inSelectMenu) {
        document?.body?.classList[val ? 'add' : 'remove']('select-menu-open')
      }
    },
    getFilteredOptions() {
      this.vsKey++
    },
  },
  created() {
    if (this.value === undefined) this.selectValue = undefined
  },
  mounted() {
    document.addEventListener('click', this.handleDocClick)
    this.$nuxt.$on('modal-popup-click', this.handleDocClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocClick)
    this.$nuxt.$off('modal-popup-click', this.handleDocClick)
  },
}
</script>
