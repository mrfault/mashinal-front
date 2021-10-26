<template>
  <div class="keywords" v-if="keywords.length">
    <h3 v-if="title">{{ title }}</h3>
    <div class="keywords__list">
      <div
        v-for="(keyword, index) in keywords"
        :key="index"
        class="keyword"
        :class="{'keyword--clickable': clickable}"
        @click="$emit('click', keyword)"
      >
        {{ keyword[label] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    keywords: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: 'name'
    },
    clickable: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>