<template>
  <portal to="modals">
    <backdrop :class="backdropClass" @click="handleBackdropClick" v-if="toggle">
      <template #default="{ show }">
        <transition name="translate-fade">
          <div :class="['modal-popup white-scroll-bg', {[modalClass]: modalClass}]" v-if="show" 
               @click.stop="$nuxt.$emit('modal-popup-click', $event)">
            <div class="modal-popup_content">
              <div class="title d-flex">
                <h4 v-if="title" v-html="title"></h4>
                <span class="cursor-pointer close" @click="$emit('close')">
                  <icon name="cross" />
                  <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
                </span>
              </div>
              <slot v-if="!overflowHidden" />
              <vue-scroll v-else>
                <div class="modal-popup_scrollview">
                  <slot />
                </div>
              </vue-scroll>
            </div>
          </div>
        </transition>
      </template>
    </backdrop>
  </portal>
</template>

<script>
export default {
  props: {
    toggle: Boolean,
    title: String,
    backdropClass: String,
    modalClass: String,
    overflowHidden: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleEscapeKey(e) {
      if (this.toggle && e.key === 'Escape'){
        this.$emit('close');
      }
    },
    handleBackdropClick() {
      if (this.isMobileBreakpoint) {
        this.$emit('close');
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleEscapeKey);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEscapeKey);
  }
}
</script>