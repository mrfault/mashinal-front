<template>
  <portal to="modals">
    <backdrop @click="$emit('close')" v-if="toggle">
      <template #default="{ show }">
        <transition name="translate-fade">
          <div class="modal-popup" v-if="show" @click.stop>
            <div class="modal-popup_content">
              <div class="title d-flex align-content-center">
                <h4 v-if="title">{{ title }}</h4>
                <span class="cursor-pointer close" @click="$emit('close')">
                  <icon name="cross" />
                </span>
              </div>
              <vue-scroll>
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
    title: String
  }
}
</script>