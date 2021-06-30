<template>
  <div class="popover-wrapper">
    <div class="popover-title" @click.stop="showThis">
      <icon :name="icon" />
    </div>
    <div class="popover-content" :class="{show}" :style="{width: `${width}px`}">
      <icon name="triangle" class="popover-content_triangle" />
      <p class="popover-message">
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
        this.$emit('handle-click');
        this.show = true;
      },
      handleClick(e) {
        let hide = true;
        let isPopoverClicked = ['popover-message','popover-content']
          .filter(c => e.target.classList.contains(c) || this.getParentByClassName(e.target, c)).length;
        if (isPopoverClicked || e.target.classList.contains(this.name+'-show-popover')) hide = false;
        if (hide) this.show = false;
      }
    },
    watch: {
      show(value) {
        if(value) document.addEventListener('click', this.handleClick);
        else document.removeEventListener('click', this.handleClick);
      }
    },
    mounted() {
      this.$nuxt.$on('show-popover', (name) => {
        if(this.name === name) this.showThis();
      });
      this.$nuxt.$on('close-popover', (name) => {
        if(this.name === name) this.show = false;
      });
      this.$nuxt.$on('close-all-popover', () => {
        this.show = false;
      });
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClick);
      this.$nuxt.$off(['close-all-popover','show-popover','close-popover']);
    }
  }
</script>