<template>
  <div class="popover-wrapper">
    <div class="popover-title" @click.stop="showThis">
      <icon :name="icon" />
    </div>
    <div class="popover-content" :class="{show}" :style="{width: `${width}px`}">
      <span class="popover-content_triangle">
        <icon name="triangle" />
      </span>
      <p :class="['popover-message', textClass || '']">
        {{ message }}
        <slot />
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      message: String,
      textClass: String,
      width: Number,
      name: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: 'info-circle'
      }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
      showThis() {
        this.$nuxt.$emit('close-all-popover');
        this.$emit('click');
        this.show = true;
      },
      handleClick(e) {
        let hide = true;
        let isPopoverClicked = ['popover-message','popover-content']
          .filter(c => e.target.classList.contains(c) || this.getParentByClassName(e.target, c)).length;
        if (isPopoverClicked || e.target.classList.contains(this.name+'-show-popover')) hide = false;
        if (hide) this.show = false;
      },
      showPopover(name) {
        if (this.name === name) this.showThis();
      },
      closePopover(name) {
        if (!name || this.name === name) this.show = false;
      }
    },
    watch: {
      show(value) {
        if (value) {
          this.$nuxt.$on('modal-popup-click', this.handleClick);
          document.addEventListener('click', this.handleClick);
        } else {
          this.$nuxt.$off('modal-popup-click', this.handleClick);
          document.removeEventListener('click', this.handleClick);
        }
      }
    },
    mounted() {
      this.$nuxt.$on('show-popover', this.showPopover);
      this.$nuxt.$on('close-popover', this.closePopover);
      this.$nuxt.$on('close-all-popover', this.closePopover);
    },
    beforeDestroy() {
      this.$nuxt.$off('show-popover', this.showPopover);
      this.$nuxt.$off('close-popover', this.closePopover);
      this.$nuxt.$off('close-all-popover', this.closePopover);
      document.removeEventListener('click', this.handleClick);
    }
  }
</script>