<template>
  <portal to="modals">
    <backdrop @click="$emit('close')" v-if="toggle">
      <template #default="{ show }">
        <transition name="translate-fade">
          <div :class="['modal-popup', {[modalClass]: modalClass}]" v-if="show" @click.stop>
            <div class="modal-popup_content">
              <div class="title d-flex">
                <h4 v-if="title">{{ title }}</h4>
                <span class="cursor-pointer close" @click="$emit('close')">
                  <icon name="cross" />
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
    modalClass: String,
    overflowHidden: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleEscapeKey(e) {
      if (e.key === 'Escape'){
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