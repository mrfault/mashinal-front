<template>
   <div :class="['form-group', className]">
      <div :class="['select-menu', { 'no-bg': hasNoBg, wider, 'invalid' : invalid }]">
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
                  <span v-if="getSelectedOptions[0]" class="d-flex align-items-center">
                     <img
                        :alt="getSelectedOptions[0].brand"
                        :src="getSelectedOptions[0].icon"
                        class="mr-1"
                        height="16"
                        width="32"
                     />
                     <span class="placeholder">{{ getSelectedOptions[0].name.slice(10) }}</span>
                  </span>
               </template>

               <template v-else-if="hasCards">{{ clearOptionText }}</template>

               <template v-else-if="hasSearch && showOptions && !isMobileBreakpoint">
                  <span class="search-input">
                     <input
                        ref="searchInput"
                        v-model="search"
                        :maxlength="searchInputLength"
                        :placeholder="inputPlaceholder"
                        type="text"
                        @input="handleInput"
                        @keyup.enter="handleSearchSubmit"
                        @click.stop
                     />
                  </span>
               </template>

               <template v-else>
                  <template v-if="newLabel">
                     <span v-if="label !== getLabelText" class="label">{{ label }}</span>

                     <span
                        v-if="multiple && selectValue.length > 1 && !shortNamesLabel"
                        class="counter"
                     >
                        {{ $t('selected') }}:
                        <template v-if="colorInput">{{ getColorNames(selectValue) }}</template>
                        <template v-else>{{ selectValue.length }}</template>
                     </span>

                     <span
                        v-else
                        :class="['value', {'top' : label !== getLabelText}]"
                     >{{ getLabelText }}</span>
                  </template>

                  <template v-else>
                     <span class="text">{{ getLabelText }}</span>
                  </template>
               </template>
            </span>

<!--            {{!hasNoValue}}-->
           <icon
              v-if="allowClear && !hasNoValue"
              class="cursor-pointer"
              name="cross"
              @click.native.stop="clearSelect"
           />
           <icon v-if="hasNoValue || !allowClear" :name="iconName"/>
         </span>
         <!--         dropdown mobile-->
         <portal v-if="isMobileBreakpoint" to="mobile-dropdown">
<!--            v-if="showOptions && isMobileBreakpoint && !inSelectMenu"-->
            <action-bar
               v-if="showOptions && isMobileBreakpoint"
               :show-check="(custom || multiple) && !hasNoValue"
               :title="getActionBarText"
               :useBack="false"
               class="priority-1"
               @accept="showOptions = false"
               @back="showOptions = false"
            />

            <div
               :class="[
               'select-menu_dropdown responsive',
               `anchor-${anchor}`,
               {
                 show: showOptions,
                 custom,
                 'custom-checkboxes': customCheckboxes,

               }]"
            >
               <template v-if="showOptions">
                  <div v-if="hasSearch && !hasGenerations" class="my-3" @click.stop>
                     <div class="container">
                        <form-text-input
                           v-model="search"
                           :placeholder="$t('search')"
                           block-class="placeholder-lighter"
                           icon-name="search"
                        />

                     </div>
                  </div>
                  <div v-if="custom" class="container">
                     <slot/>
                  </div>
                  <vue-scroll
                     v-else
                     :key="vsKey"
                     ref="vsMob"
                     :ops="scrollOps"
                     @handle-scroll-complete="handleScroll"
                     @handle-scroll="handleScroll"
                  >
                     <div class="container">
                        <!--                        marat-->
                        <!--                        <div class="select-menu_dropdown-option clear-search" @click="selectGeneration = ''">-->
                        <!--                           <div class="text-truncate">-->
                        <!--                              <inline-svg :src="'/icons/close.svg'" :width="'10px'" :height="'10px'"/>-->
                        <!--                              <span>{{ $t('clear_search') }}</span>-->
                        <!--                           </div>-->
                        <!--                        </div>-->

                        <div v-if="popularOptions && !search" class="row pt-3">
                           <div
                              v-for="option in $sortBy(getFilteredOptions, (a, b) =>
                                    popularOptions.indexOf(b.id) -
                                    popularOptions.indexOf(a.id),
                              ).slice(0, 6)"
                              :key="option.id"
                              class="col-4 popular-option"
                              @click.stop="selectValue = option"
                           >
                              <div v-if="imgKey" class="img">
                                 <img
                                    :alt="getOptionName(option)"
                                    :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                                 />
                              </div>
                              <div class="text-truncate">
                                 <span>{{ getOptionName(option) }}</span>
                              </div>
                           </div>
                        </div>

                        <div
                           v-if="hasGenerations && getFilteredOptions.length"
                           class="mt-2"
                        >
                           <form-buttons
                              v-model="selectGeneration"
                              :btn-class="'primary-outline select-generation'"
                              :group-by="2"
                              :options="getFilteredOptions"
                              class="generation"
                           >
                              <template #custom="{ button }">
                                 <div
                                    :class="['generation-bg',{ 'no-img': !!getGenerationStyle(button).noImg }]"
                                    :style="getGenerationStyle(button)"
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
                           <div
                              v-for="(option, index) in getFilteredOptions"
                              :key="index"
                              :class="['select-menu_dropdown-option',
                                 {
                                   selected: isSelected(option),
                                   anchor: isAnchor(index),
                                   'card-option': hasCards && option.brand,
                                 }
                               ]"
                              @click.stop="selectValue = option"
                           >
                              <div
                                 v-if="option?.code"
                                 :style="{ backgroundColor: `${option.code }`}"
                                 class="color"
                              ></div>
                              <div
                                 v-if="imgKey && (!hasCards || (hasCards && option[imgKey]))"
                                 class="img"
                              >
                                 <img
                                    :alt="getOptionName(option)"
                                    :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                                 />
                              </div>
                              <div class="text-truncate">
                                 <span>{{ getOptionName(option) }}</span>
                              </div>
                              <icon v-if="isSelected(option)" name="check"/>
                           </div>
                        </template>
                        <div v-else class="select-menu_dropdown-option disabled">
                           <div class="text-truncate">
                              <span>{{ $t('no_results_found') }}</span>
                           </div>
                        </div>
                     </div>
                  </vue-scroll>
               </template>
            </div>
         </portal>

         <!--         dropdown desktop-->
         <template v-else>
            <div ref="dropdownOptions"
                 :class="['select-menu_dropdown',
               {
                 show: showOptions,
                 custom,
                 'custom-checkboxes': customCheckboxes,
                       'showMenuUp' :showMenuUp
               }
            ]"
                 @mouseenter="addScrollStopToBody()"
                 @mouseleave="removeScrollStopToBody()"
            >
               <template v-if="showOptions">
                  <div v-if="custom">
                     <slot/>
                  </div>

                  <vue-scroll
                     v-else
                     :key="vsKey"
                     ref="vs"
                     :ops="scrollOps"
                     @handle-scroll-complete="handleScroll"
                     @handle-scroll="handleScroll"
                  >


                     <div v-if="popularOptions && !search" class="row pt-3">
                        <div
                           v-for="option in $sortBy(
                             getFilteredOptions,
                             (a, b) => popularOptions.indexOf(b.id) - popularOptions.indexOf(a.id)).slice(0, 6)"
                           :key="option.id"
                           class="col-4 popular-option"
                           @click.stop="selectValue = option"
                        >
                           <div v-if="imgKey" class="img">
                              <img
                                 :alt="getOptionName(option)"
                                 :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
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
                              :key="`hr_${index}`"
                              :class="{'pl-2 pr-2': index !== getFilteredOptions.length - 1}"
                           >
                              <hr class="mb-0 mt-0"/>
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
                                  'multiselect-menu-item': multiple
                                },
                              ]"
                           @click.stop="selectValue = option"
                        >
                           <template v-if="hasCards">
                              <div class="d-flex full-width">
                                 <div
                                    v-if="imgKey && option.brand"
                                    class="card-brand-img mr-1"
                                 >
                                    <div class="img">
                                       <img
                                          :alt="getOptionName(option)"
                                          :src="$withBaseUrl(option[imgKey])"
                                       />
                                    </div>
                                 </div>
                                 <div
                                    :class="['text-truncate', { 'full-width text-center': !option.brand }]"
                                 >
                                    <span v-if="option.brand">{{ option.brand }}</span>
                                    <span>{{ getOptionName(option) }}</span>
                                 </div>
                              </div>
                           </template>

                           <template v-else>
                              <div v-if="imgKey" class="img">
                                 <img
                                    :alt="getOptionName(option)"
                                    :src="$withBaseUrl(option[imgKey]) || imgPlaceholder"
                                 />
                              </div>

                              <div
                                 v-if="option?.code"
                                 :style="{ backgroundColor: `${option.code }`}"
                                 class="color"
                              ></div>

                              <div class="text-truncate">
                                 <span>{{ getOptionName(option) }}</span>
                              </div>
                           </template>
                           <icon v-if="isSelected(option)" name="check"/>
                           <span v-if="multiple" class="multiselect-menu-item--checkbox">
                              <inline-svg src="icons/checkbox/checkbox-active.svg" v-if="isSelected(option)"/>
                              <inline-svg src="icons/checkbox/checkbox-null.svg" v-else/>
                           </span>
                        </div>
                     </template>

                     <div
                        v-if="!getFilteredOptions.length"
                        class="select-menu_dropdown-option disabled"
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
import {mapGetters} from "vuex";

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
      className: {
         type: String
      },
      custom: Boolean,
      customCheckboxes: Boolean,
      anchor: {
         type: String,
         default: 'left',
      },
      valueType: {
         type: String,
         default: '',
      },
      multiple: Boolean,
      disabled: Boolean,
      label: {
         type: String,
         default: '',
      },
      clearPlaceholder: {
         type: Boolean,
         default: false,
      },
      newLabel: {
         type: Boolean,
         default: true,
      },
      inputPlaceholder: {
         type: String,
         default: ''
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
      clearOptionMin: {
         type: Boolean,
         default: false,
      },
      searchInputLength: {
         type: Number,
         default: 10,
      },
      inputSearchType: {
         type: String,
         default: '',
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
      checkOptionsOffset: Boolean,
      shortNamesLabel: Boolean,
      wider: Boolean,
      hasCards: Boolean,
      limit: Number,
      showMenuUp: Boolean,
      colorInput: Boolean,
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
            return {key: key, name: name}
         }
         if (this.objectInValue) {
            return option
         }
         return this.$notUndefined(key, name)
      },
      getKey(value) {
         return value.key !== undefined ? value.key : value
      },
      getOptionName(option) {
         return `${this.$translateHard(option.name?.[this.locale]) || (this.translateOptions
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

         if (!this.multiple && this.objectInValue && this.selectValue instanceof Object) {
            let key = Object.keys(this.selectValue)[0];

            return value[key] === this.selectValue[key];
         }
         const hasSameObj =
            this.selectValue instanceof Array &&
            (this.nameInValue || this.objectInValue ?
               this.selectValue.findIndex((val) => val && val.key == value.key) !== -1
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
         return imgUrl ? {backgroundImage: `url('${imgUrl}')`} : {noImg: true}
      },
      addScrollStopToBody() {
         const body = document.body
         //body.classList.add('ma-stop-scroll')
      },
      removeScrollStopToBody() {
         const body = document.body
         //body.classList.remove('ma-stop-scroll')
      },
      handleInput() {
         if (this.inputSearchType === 'text') {
            this.search = this.search.replace(/[^a-zA-Z]/g, '');
         } else if (this.inputSearchType === 'number') {
            this.search = this.search.replace(/\D/g, '');
         }
      },
      getColorNames(selectedValues) {


         const selectedColors = this.colors
            .filter(color => selectedValues.includes(color.id))
            .map(color => color.name[this.locale]);

         return selectedColors.join(', ');
      }

   },
   computed: {
      ...mapGetters(['colors']),
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
                        ? this.limit && [...(this.value || [])].length === this.limit ? [...(this.value || [])] : [...(this.value || []), value]
                        : value
               }
            }
            if (!this.multiple) this.showOptions = false
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
         let addons = this.clearOption ? [{key: -1, name: this.clearOptionText || this.$t('clear_search')}] : []
         if (this.hasGenerations && this.isMobileBreakpoint) return this.options
         return this.clearOptionPullDown ? [...this.options, ...addons] : [...addons, ...this.options]
      },
      getSelectedOptions() {
         return this.options.filter(this.isSelected)
      },
      getFilteredOptions() {
         if (!this.search || !this.hasSearch) return this.getOptions;

         return this.options.filter((option) =>
            this.$search(this.getOptionName(option), this.search),
         )

         // console.log('this.search', this.search)
         // let searchLength = this.search.length;
         // return this.options?.filter(item => {
         //    let itemName = item?.name.toLowerCase().split('').slice(0, searchLength).join('');
         //    if (itemName === this.search.toLowerCase()) return item?.name;
         //    // console.log('itemName', itemName)
         // })
      },
      getLabelText() {
         if (this.objectInValue) {
            const selectKey = this.value?.title ? "title" : "name"
            if (!this.multiple) {
               return this.value ? this.$t(this.value[selectKey]) : this.label
            }
         }
         if (this.custom) {
            let value;
            let read = this.values.read !== false;

            if (this.values.from && this.values.to)
               value = `${this.$readNumber(this.values.from, read)} — ${this.$readNumber(this.values.to, read)}`
            else if (this.values.from || this.values.to)
               value = `${this.values.showPreposition
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

         if (this.clearPlaceholder) {
            if (!selected.length) {
               return this.label
            } else {
               if (typeof selected[0]?.name === 'object') {
                  return selected[0]?.name[this.locale];
               } else {
                  return this.getOptionName(selected[0])
               }
            }
         }

         return selected.length === 1
            ? `${this.showLabelOnSelect && this.allowClear
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
         if (this.objectInValue && this.getSelectedOptions?.length) return false

         if (this.custom)
            return this.values?.count
               ? false
               : this.label === this.getLabelText.replace(`, ${this.suffix}`, '');

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
               maxHeight: this.isMobileBreakpoint ? undefined : 260,
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


<style lang="scss">
.multiselect-menu-item {
   position: relative;

   &--checkbox {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
   }
}
</style>

