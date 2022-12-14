<template>
  <div
    :tabindex="searchable ? -1 : tabindex"
    :class="{ 'multiselect--active': isOpen, 'multiselect--disabled': disabled, 'multiselect--above': isAbove }"
    @focus="activate()"
    @blur="searchable ? false : deactivate()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keypress.enter.tab.stop.self="addPointerElement($event)"
    @keyup.esc="deactivate()"
    class="multiselect">
    <slot name="caret" :toggle="toggle">
      <div @mousedown.prevent.stop="toggle()" class="multiselect__select"></div>
    </slot>
    <slot name="clear" :search="search"></slot>
    <div ref="tags" class="multiselect__tags"
         @mousedown.prevent="toggle"
         :class="{'active': internalValue.length && Object.keys(internalValue[0]).length && internalValue[0].value!=='' }">
      <slot
        name="selection"
        :search="search"
        :remove="removeElement"
        :values="visibleValues"
        :is-open="isOpen"
       >
        <div class="multiselect__tags-wrap" v-show="visibleValues.length > 0">

          <template v-for="(option, index) of visibleValues" @mousedown.prevent>
            <slot name="tag" :option="option" :search="search" :remove="removeElement">
                <span class="multiselect__tag" :key="index">
                  <span v-text="getOptionLabel(option)"></span>
                  <i aria-hidden="true" tabindex="1" @keypress.enter.prevent="removeElement(option)"
                     @mousedown.prevent="removeElement(option)" class="multiselect__tag-icon"></i>
                </span>
            </slot>
          </template>
        </div>
        <template v-if="internalValue && internalValue.length > limit">
          <slot name="limit">
            <strong class="multiselect__strong" v-text="limitText(internalValue.length - limit)"/>
          </slot>
        </template>
      </slot>
      <transition name="multiselect__loading">
        <slot name="loading">
          <div v-show="loading" class="multiselect__spinner"/>
        </slot>
      </transition>
      <input
        ref="search"
        v-if="searchable"
        :name="name"
        :id="id"
        type="text"
        autocomplete="nope"
        :placeholder="placeholder"
        :style="inputStyle"
        :value="search"
        :disabled="disabled"
        :tabindex="tabindex"
        @input="updateSearch($event.target.value)"
        @focus.prevent="activate()"
        @blur.prevent="deactivate()"
        @keyup.esc="deactivate()"
        @keydown.down.prevent="pointerForward()"
        @keydown.up.prevent="pointerBackward()"
        @keypress.enter.prevent.stop.self="addPointerElement($event)"
        @keydown.delete.stop="removeLastElement()"
        class="multiselect__input"
      />
      <span
        v-if="isSingleLabelVisible && currentOptionLabel"
        class="multiselect__single"
      >
          <slot name="singleLabel" :option="singleValue">
            <template v-if="hasTranslation"><template v-if="['currency', 'sell_store'].indexOf(selectKey) === -1 && !hidePlaceholder">{{ placeholder }}: </template>{{ $t(currentOptionLabel) }} {{ suffix }}</template>
            <template v-else><template v-if="['currency', 'sell_store'].indexOf(selectKey) === -1 && !hidePlaceholder">{{ placeholder }}: </template>{{ currentOptionLabel }} {{ suffix }}</template>
          </slot>
        </span>
      <span
        v-if="isPlaceholderVisible && (!hidePlaceholder || placeholder)"
        class="multiselect__placeholder"
      >
          <slot name="placeholder" >
            {{ placeholder }}
          </slot>
        </span>
    </div>

    <transition name="multiselect">
      <div
        class="multiselect__content-wrapper"
        v-show="isOpen"
        @focus="activate"
        tabindex="-1"
        @mousedown.prevent
        :style="{ maxHeight: optimizedHeight + 'px' }"
        ref="list"
      >
        <ul class="multiselect__content" :style="contentStyle"
            :class="{ 'mini': (ops.disable || optionKeys.length < 7) }"
            style="max-height: 245px;">
         <vuescroll :ops="ops" class="hasVBar" ref="multiselect_scroll">
            <slot name="beforeList"></slot>
            <li v-if="multiple && max === internalValue.length">
                <span class="multiselect__option">
                  <slot name="maxElements">Maximum of {{ max }} options selected. First remove a selected option to select another.</slot>
                </span>
            </li>
            <template v-if="!max || internalValue.length < max">

                <li class="multiselect__element" v-if="withAllOption" @click="clearList">
                  <span  class="multiselect__option">
                    <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 5 48 48" version="1.1">
                        <g id="surface220107">
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(26.27451%,62.745098%,27.843137%);fill-opacity:1;" d="M 40.601562 12.101562 L 17 35.699219 L 7.398438 26.101562 L 4.601562 29 L 17 41.300781 L 43.398438 14.898438 Z M 40.601562 12.101562 "/>
                        </g>
                    </svg>
                      {{customPropLabel}}
                  </span>
                </li>
                <li v-if="(option.name && option.name !=='not_set') || !option.name" class="multiselect__element" v-for="(option, index) of filteredOptions" :key="index" :class="optionHighlight(index, option)">
                    <span
                      v-if="!(option && (option.$isLabel || option.$isDisabled))"
                      :class="optionHighlight(index, option)"
                      @click.stop="select(option)"
                      :data-select="option && option.isTag ? tagPlaceholder : selectLabelText"
                      class="multiselect__option">
                       <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 5 48 48" version="1.1">
                          <g id="surface220107">
                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(26.27451%,62.745098%,27.843137%);fill-opacity:1;" d="M 40.601562 12.101562 L 17 35.699219 L 7.398438 26.101562 L 4.601562 29 L 17 41.300781 L 43.398438 14.898438 Z M 40.601562 12.101562 "/>
                          </g>
                       </svg>
                        <slot name="option" :option="option" :search="search">
                          <span v-if="!hasTranslation">{{ (getOptionLabel(option)) }} {{ suffix }}</span>
                          <span v-else >{{ $t(getOptionLabel(option)) }} {{ suffix }}</span>
                        </slot>
                    </span>
                  <span
                    v-if="option && (option.$isLabel || option.$isDisabled)"
                    @mouseenter.self="groupSelect && pointerSet(index)"
                    @mousedown.prevent="selectGroup(option)"
                    class="multiselect__option">
                        <slot name="option" :option="option" :search="search">
                          <span>{{ getOptionLabel(option) }}</span>
                        </slot>
                    </span>
                </li>
            </template>
            <li v-show="showNoResults && (filteredOptions.length === 0 && search && !loading)">
                <span class="multiselect__option">
                  <slot name="noResult" :search="search"></slot>
                </span>
            </li>
           <!-- <li v-show="showNoOptions && (options.length === 0 && !search && !loading)">
                <span class="multiselect__option">
                  <slot name="noOptions">List is empty.</slot>
                </span>
            </li>-->
            <slot name="afterList"></slot>
         </vuescroll>
        </ul>
      </div>

    </transition>

  </div>
</template>

<script>
  import multiselectMixin from './multiselectMixin'
  import pointerMixin from './pointerMixin'

  export default {
    name: 'vue-multiselect',
    data() {
      return {
        dataSearch: '',
        ops: {
          disable: false,
          vuescroll: {},
          scrollPanel: {},
          rail: {
              size: '12px',
          },
          bar: {
            size: '7px',
            minSize:0.1,
            keepShow: true,
            onlyShowBarOnScroll: true,
            background: '#8e98a7',
          }
        }
      }
    },
    mixins: [multiselectMixin, pointerMixin],
    props: {
        customPropLabel:{},
        suffix:{
            default:''
        },
      /**
       * name attribute to match optional label element
       * @default ''
       * @type {String}
       */
      name: {
        type: String,
        default: ''
      },
      /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
      selectLabel: {
        type: String,
        default: 'Press enter to select'
      },
      /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
      selectGroupLabel: {
        type: String,
        default: 'Press enter to select group'
      },
      /**
       * String to show next to selected option
       * @default 'Selected'
       * @type {String}
       */
      selectedLabel: {
        type: String,
        default: 'Selected'
      },
      hidePlaceholder: {
        default: false
      },
      /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
      deselectLabel: {
        type: String,
        default: 'Press enter to remove'
      },
      /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
      deselectGroupLabel: {
        type: String,
        default: 'Press enter to deselect group'
      },
      /**
       * Decide whether to show pointer labels
       * @default true
       * @type {Boolean}
       */
      showLabels: {
        type: Boolean,
        default: true
      },
      /**
       * Limit the display of selected options. The rest will be hidden within the limitText string.
       * @default 99999
       * @type {Integer}
       */
      limit: {
        type: Number,
        default: 99999
      },
      /**
       * Sets maxHeight style value of the dropdown
       * @default 300
       * @type {Integer}
       */
      maxHeight: {
        type: Number,
        default: 300
      },
      /**
       * Function that process the message shown when selected
       * elements pass the defined limit.
       * @default 'and * more'
       * @param {Int} count Number of elements more than limit
       * @type {Function}
       */
      limitText: {
        type: Function,
        default: count => `and ${count} more`
      },
      /**
       * Set true to trigger the loading spinner.
       * @default False
       * @type {Boolean}
       */
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * Disables the multiselect if true.
       * @default false
       * @type {Boolean}
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Fixed opening direction
       * @default ''
       * @type {String}
       */
      openDirection: {
        type: String,
        default: ''
      },
      /**
       * Shows slot with message about empty options
       * @default true
       * @type {Boolean}
       */
      showNoOptions: {
        type: Boolean,
        default: true
      },
      showNoResults: {
        type: Boolean,
        default: true
      },
      tabindex: {
        type: Number,
        default: 0
      },
      selectKey: {
        default: null,
      },
    },

    computed: {
      isSingleLabelVisible() {
        return (
          (this.singleValue || this.singleValue === 0) &&
          (!this.isOpen || !this.searchable) &&
          !this.visibleValues.length
        )
      },
      isPlaceholderVisible() {
        return !this.internalValue.length && (!this.searchable || !this.isOpen)
      },
      visibleValues() {
        return this.multiple ? this.internalValue.slice(0, this.limit) : []
      },
      singleValue() {
        return this.internalValue[0]
      },
      deselectLabelText() {
        return this.showLabels ? this.deselectLabel : ''
      },
      deselectGroupLabelText() {
        return this.showLabels ? this.deselectGroupLabel : ''
      },
      selectLabelText() {
        return this.showLabels ? this.selectLabel : ''
      },
      selectGroupLabelText() {
        return this.showLabels ? this.selectGroupLabel : ''
      },
      selectedLabelText() {
        return this.showLabels ? this.selectedLabel : ''
      },
      inputStyle() {
        if (
          this.searchable ||
          (this.multiple && this.value && this.value.length)
        ) {
          // Hide input by setting the width to 0 allowing it to receive focus
          return this.isOpen
            ? {width: '100%'}
            : {width: '0', position: 'absolute', padding: '0'}
        }
      },
      contentStyle() {
        return this.options.length
          ? {display: 'inline-block'}
          : {display: 'block'}
      },
      isAbove() {
        if (this.openDirection === 'above' || this.openDirection === 'top') {
          return true
        } else if (
          this.openDirection === 'below' ||
          this.openDirection === 'bottom'
        ) {
          return false
        } else {
          return this.preferredOpenDirection === 'above'
        }
      },
      showSearchInput() {
        return (
          this.searchable &&
          (this.hasSingleSelectedSlot &&
          (this.visibleSingleValue || this.visibleSingleValue === 0)
            ? this.isOpen
            : true)
        )
      }
    },
    mounted() {
      this.$nuxt.$on('clear-buttons',() => {
          while (this.internalValue.length > 0) {
              this.internalValue.pop();
          }
          if(this.valueKeys) {
              while (this.valueKeys.length > 0) {
                  this.valueKeys.pop();
              }
          }
          if(this.singleValue) {
              this.$emit('value', {});
          }
      })
    },
      watch:{
          filteredOptions(options) {
                  this.ops.disable = options.length < 7;
          }
   /*       options(val) {
              while (this.internalValue.length > 0) {
                  this.internalValue.pop();
              }
              if(this.valueKeys) {
                  while (this.valueKeys.length > 0) {
                      this.valueKeys.pop();
                  }
              }
              if(this.singleValue) {
                  this.value = {};
              }
        }*/
      },
    methods: {

      clearList() {
          this.isOpen = false;
          while (this.internalValue.length > 0) {
              this.internalValue.pop();
          }
          if(this.valueKeys) {
              while (this.valueKeys.length > 0) {
                  this.valueKeys.pop();
              }
          }
           this.$emit('select', { key:this.selectKey,value:{} }, this.id)
      }
    }
  }
</script>

<style>
  .mini {
    height: auto !important;
  }
  .multiselect__tags:hover {
    background-color: #fff !important;
    color: #1E5D98;
    border: 1px solid #B8BED9
  }
  .multiselect__tags.active {
    background-color: #F7FBFF !important;
    color: #4787C4;
    border: 1px solid #4787C4;
  }
  .multiselect__tags.active::after {
    background-image: url(/images/select__bg__active.svg);
  }
  fieldset[disabled] .multiselect {
    pointer-events: none;
  }

  .multiselect__spinner {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 48px;
    height: 35px;
    background: #fff;
    display: block;
  }


  .multiselect__spinner:before {
    animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
    animation-iteration-count: infinite;
  }

  .multiselect__spinner:after {
    animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
    animation-iteration-count: infinite;
  }

  .multiselect__loading-enter-active,
  .multiselect__loading-leave-active {
    transition: opacity 0.4s ease-in-out;
    opacity: 1;
  }

  .multiselect__loading-enter,
  .multiselect__loading-leave-active {
    opacity: 0;
  }

  .multiselect,
  .multiselect__input,
  .multiselect__single {
    font-family: inherit;
    font-size: 16px;
    touch-action: manipulation;
  }

  .multiselect {
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    min-height: 40px;
    text-align: left;
    color: #35495e;
  }

  .multiselect * {
    box-sizing: border-box;
  }

  .multiselect:focus {
    outline: none;
  }

  .multiselect--disabled {
    pointer-events: none;
  }
  .multiselect--disabled .multiselect__tags{
    pointer-events: none;
    color: #E7E9F2 !important;
    border-radius: 2px;
    background-color: #FFFFFF;
    border: 1px solid #E6E8F2;
  }

  .multiselect--active {
    z-index: 50;
  }

  .multiselect--active:not(.multiselect--above) .multiselect__current,
  .multiselect--active:not(.multiselect--above) .multiselect__input,
  .multiselect--active:not(.multiselect--above) .multiselect__tags {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .multiselect--active .multiselect__select {
    transform: rotateZ(180deg);
  }
  .multiselect--active .multiselect__tags {
    background-color: transparent;
  }
  .multiselect--above.multiselect--active .multiselect__current,
  .multiselect--above.multiselect--active .multiselect__input,
  .multiselect--above.multiselect--active .multiselect__tags {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .multiselect__input,
  .multiselect__single {
    position: relative;
    display: inline-block;
    min-height: 25px;
    line-height: 25px;
    border: none;
    border-radius: 5px;
    background: #fff;
    padding: 0 0 0 5px;
    width: calc(100%);
    transition: border 0.1s ease;
    box-sizing: border-box;
    vertical-align: top;
    font-size: 12px;
  }

  .multiselect__input::placeholder {
    color: #35495e;
  }

  .multiselect__tag ~ .multiselect__input,
  .multiselect__tag ~ .multiselect__single {
    width: auto;
  }

  .multiselect__input:hover,
  .multiselect__single:hover {
    border-color: #cfcfcf;
  }

  .multiselect__input:focus,
  .multiselect__single:focus {
    border-color: #a8a8a8;
    outline: none;
  }

  .multiselect__single {
    margin-bottom: 8px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .multiselect__tags-wrap {
    display: inline;
  }

  .multiselect__tags {
    min-height: 40px;
    display: block;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
  }

  .multiselect__tags > * {
    padding: 0px 20px 0 12px;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 29px;
  }


  .multiselect__tag-icon {
    cursor: pointer;
    margin-left: 7px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-weight: 700;
    font-style: initial;
    width: 22px;
    text-align: center;
    line-height: 22px;
    transition: all 0.2s ease;
    border-radius: 5px;
  }


  .multiselect__current {
    line-height: 16px;
    min-height: 40px;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    padding: 8px 12px 0;
    padding-right: 30px;
    white-space: nowrap;
    margin: 0;
    text-decoration: none;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
  }

  .multiselect__select {
    line-height: 16px;
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 40px;
    height: 38px;
    right: 1px;
    top: 1px;
    padding: 4px 8px;
    margin: 0;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .multiselect__select:before {
    position: relative;
    right: 0;
    top: 65%;
    color: #999;
    margin-top: 4px;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #999999 transparent transparent transparent;
    content: "";
  }


  .multiselect--active .multiselect__placeholder {
    /*display: none;*/
  }

  .multiselect__content-wrapper {

    position: absolute;
    display: block;
    background-color: #fff;

    min-width: 100%;
    max-height: 240px;
    overflow: auto;
    border: 1px solid #e8e8e8;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 50;
    -webkit-overflow-scrolling: touch;
  }

  .multiselect__content-wrapper {
    border: 2px solid #E6E8F2;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.18039);
  }

  .multiselect__content {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 0;
    min-width: 100%;
    vertical-align: top;
  }

  .multiselect--above .multiselect__content-wrapper {
    bottom: 100%;
    border-radius: 3px;

    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.18039);

  }

  .multiselect__content::webkit-scrollbar {
    display: none;
  }

  .multiselect__element {
    display: block;
    margin: 2px 0;
  }

  .multiselect__element:hover {
    color: #1E5D98;
    background-color: #F7FBFF;
  }

  .multiselect__element:first-of-type {
    margin-top:2px;
  }
  .multiselect__option {

    display: block;
    padding: 5px 20px 5px 0;
    line-height: 1;
    min-height: 20px;
    text-decoration: none;
    text-transform: none;
    vertical-align: middle;
    position: relative;
    cursor: pointer;
    white-space: nowrap;

  }
  .multiselect__option svg {
      visibility:hidden;
  }
  .multiselect__option--selected svg {
      visibility:visible;
  }
  .multiselect__option--selected:hover path {
    fill:#fff !important;
  }
  .multiselect__option:after {
    top: 0;
    right: 0;
    position: absolute;
    line-height: 40px;
    padding-right: 12px;
    padding-left: 20px;
    font-size: 13px;
  }
  .multiselect__option {
    margin-right: 13px;
    margin-left: 5px;
    border: 1px solid transparent;
  }
  .__rail-is-vertical {

    top: 5px !important;
    bottom: 8px !important;
    right: 5px !important;
  }
  .multiselect__option--selected, .change--selected{
    background-color: #F7FBFF;
    color: #4787C4;
    line-height: 1;
    font-weight: bold !important;
  }
  .change--selected{
    font-weight: normal;
  }

/*  .multiselect__option--selected:before {
    content: '*';
    background-image: url("/images/icons8-checkmark.svg");
    background-size: cover;
    background-repeat: no-repeat;
    position: static;
    background-position: center;
    color: transparent;
    display: inline-flex;
    margin-right: 10px;
    width: 20px;
    height: inherit;
  }*/


  .multiselect--disabled .multiselect__current,
  .multiselect--disabled .multiselect__select {
    background: #ededed;
    color: #a6a6a6;
  }

  .multiselect__option--disabled {
    background: #ededed !important;
    color: #a6a6a6 !important;
    cursor: text;
    pointer-events: none;
  }

  .multiselect.multiselect--disabled .multiselect__tags:after{
    background-image: url('/images/select__bg__disbled.svg');
  }

  .multiselect__option--group {
    background: #ededed;
    color: #35495e;
  }


  .multiselect-enter-active,
  .multiselect-leave-active {
    animation: .3s ease-in select-open;
    opacity: 1 !important;
  }


  .multiselect-enter,
  .multiselect-leave-active {
    animation: .3s ease-out select-close;
    opacity: 0 !important;
  }

  .multiselect__strong {
    margin-bottom: 8px;
    line-height: 20px;
    display: inline-block;
    vertical-align: top;
  }

  *[dir="rtl"] .multiselect {
    text-align: right;
  }

  *[dir="rtl"] .multiselect__select {
    right: auto;
    left: 1px;
  }

  *[dir="rtl"] .multiselect__tags {


  }

  *[dir="rtl"] .multiselect__content {
    text-align: right;
  }

  *[dir="rtl"] .multiselect__option:after {
    right: auto;
    left: 0;
  }

  .multiselect__option--selected.multiselect__option--highlight {
    background: inherit !important;
    color: inherit !important;
    font-weight: inherit !important;
  }

  *[dir="rtl"] .multiselect__clear {
    right: auto;
    left: 12px;
  }

  *[dir="rtl"] .multiselect__spinner {
    right: auto;
    left: 1px;
  }

  @keyframes spinning {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(2turn);
    }
  }
  .multiselect__content-wrapper{
    overflow: hidden !important;
  }
  .multiselect__content{
    height: 245px;
  }

  .menu-block__header__buttons a span{
    color: #050B26 !important;
  }


  @keyframes select-open {
    from{
      max-height: 0;
    }
    to {
      max-height: 500px;
    }
  }
  @keyframes select-close {
    from{

    }
    to {
      max-height: 0;
    }
  }

</style>
