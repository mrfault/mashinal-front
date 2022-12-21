export default {
  data() {
    return {
      checkSearchWithoutSearchable: false,
      interval: false,
      pointer: 0,
      pointerDirty: false
    }
  },
  props: {
    /**
     * Scroll to selected index when dropdown opens
     * @type {Boolean}
     * @default false
     */
    scrollToSelected: {
      type: Boolean,
      default: true
    },
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: true
    },
    optionHeight: {
      type: Number,
      default: 34 /* old 40 */
    }
  },
  computed: {
    pointerPosition() {
      return this.pointer * this.optionHeight
    },
    visibleElements() {
      return this.optimizedHeight / this.optionHeight
    }
  },
  watch: {
    filteredOptions() {
      this.pointerAdjust()
    },
    isOpen(value) {
      if (value) {
        if (this.scrollToSelected) {
          this.pointer = this.filteredOptions.indexOf(this.value) < 0 ? 0 : this.filteredOptions.indexOf(this.value);
          if (this.$refs.list) {
            this.$nextTick(() => {
              this.$refs.multiselect_scroll.scrollTo({
                y: this.pointerPosition
              });
            })
          }
        }
      }

      if (value && !this.searchable) {
        window.addEventListener('keyup', this.keyUpEventHandler);
        //this.searchWithoutSearchable += searchWithoutSearchable;
      } else {
        window.removeEventListener('keyup', this.keyUpEventHandler);
      }

      this.pointerDirty = false
    }
  },
  methods: {
    keyUpEventHandler(e) {
      if (e.key.length !== 1) return true;
      this.checkSearchWithoutSearchable = true;
      this.search += e.key;

      if (this.interval !== false){
        clearTimeout(this.interval);
        this.interval = false;
      }

      this.interval = setTimeout(() => {
        this.search = '';
        this.checkSearchWithoutSearchable = false;
      }, 1000);
    },
    optionHighlight(index, option) {
      return {
        'multiselect__option--selected': this.isSelected(option), 'change--selected': this.pointer === index
      }
    },
    groupHighlight(index, selectedGroup) {
      if (!this.groupSelect) {
        return ['multiselect__option--group', 'multiselect__option--disabled']
      }

      const group = this.options.find(option => {
        return option[this.groupLabel] === selectedGroup.$groupLabel
      })

      return group && !this.wholeGroupDisabled(group) ? [
        'multiselect__option--group',
        {'multiselect__option--highlight': index === this.pointer && this.showPointer},
        {'multiselect__option--group-selected': this.wholeGroupSelected(group)}
      ] : 'multiselect__option--disabled'
    },
    addPointerElement({key} = 'Enter') {
      /* istanbul ignore else */
      if (this.filteredOptions.length > 0) {
        this.select(this.filteredOptions[this.pointer], key)
      }
      this.pointerReset()
    },
    pointerForward() {
      /* istanbul ignore else */
      if (this.pointer < this.filteredOptions.length - 1) {
        this.pointer++
        /* istanbul ignore next */
        if (this.$refs.multiselect_scroll.getPosition().scrollTop <= this.pointerPosition - (this.visibleElements - 4) * this.optionHeight) {
          this.$refs.multiselect_scroll.scrollTo({
            y: this.pointerPosition - (this.visibleElements - 4) * this.optionHeight
          });
        }
        /* istanbul ignore else */
        if (
          this.filteredOptions[this.pointer] &&
          this.filteredOptions[this.pointer].$isLabel &&
          !this.groupSelect
        ) this.pointerForward()
      }
      this.pointerDirty = true
    },
    pointerBackward() {
      if (this.pointer > 0) {
        this.pointer--
        /* istanbul ignore else */
        if (this.$refs.multiselect_scroll.getPosition().scrollTop >= this.pointerPosition) {
          this.$refs.multiselect_scroll.scrollTo({
            y: this.pointerPosition
          });
        }
        /* istanbul ignore else */
        if (
          this.filteredOptions[this.pointer] &&
          this.filteredOptions[this.pointer].$isLabel &&
          !this.groupSelect
        ) this.pointerBackward()
      } else {
        /* istanbul ignore else */
        if (
          this.filteredOptions[this.pointer] &&
          this.filteredOptions[0].$isLabel &&
          !this.groupSelect
        ) this.pointerForward()
      }
      this.pointerDirty = true
    },
    pointerReset() {
      /* istanbul ignore else */
      if (!this.closeOnSelect) return
      this.pointer = 0
      /* istanbul ignore else */
      if (this.$refs.list) {
        this.$refs.list.scrollTop = 0
      }
    },
    pointerAdjust() {
      /* istanbul ignore else */
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length
          ? this.filteredOptions.length - 1
          : 0
      }

      if (this.filteredOptions.length > 0 &&
        this.filteredOptions[this.pointer].$isLabel &&
        !this.groupSelect
      ) {
        this.pointerForward()
      }
    },
    pointerSet(index) {
      this.pointer = index
      this.pointerDirty = true
    }
  }
}
