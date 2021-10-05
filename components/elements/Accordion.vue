<template>
  <div class="accordion">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="accordion__item"
      :class="{'accordion__item--active': activeAccordionIndex === index}"
    >
      <div class="accordion__header" @click="toggleAccordion(index)">
        <div class="accordion__header__title">
          {{ item.title }}
        </div>
        <div
          class="accordion__header__toggle"
          :class="{'accordion__header__toggle--active': activeAccordionIndex === index}"
        >
          <icon name="chevron-up" />
        </div>
      </div>
      <transition-expand>
        <div v-if="activeAccordionIndex === index">
          <div class="accordion__body">
            {{ item.text }}
          </div>
        </div>
      </transition-expand>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeAccordionIndex: null,
    }
  },
  methods: {
    toggleAccordion(index) {
      if (this.activeAccordionIndex === index) {
        this.activeAccordionIndex = null
      } else {
        this.activeAccordionIndex = index
      }
    }
  }
}
</script>