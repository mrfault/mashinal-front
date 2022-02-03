<template>
  <div class="e-service">
    <div class="e-service__header">
      <h5 class="e-service__header--title">{{ item.title }}</h5>
      <span class="e-service__header--icon">
        <icon :name="item.icon" />
      </span>
    </div>
    <div class="e-service__body">
      <div class="e-service__body--image">
        <img :src="`images/${item.image}.png`" />
      </div>
      <div class="e-service__body--description">
        <p class="key" v-if="item.description">{{ item.description }}</p>
        <span class="value" v-if="item.value">{{ item.value }}</span>
      </div>
    </div>
    <div class="e-service__actions">
      <span class="e-service__actions--left">
        <nuxt-link to="#" v-if="item.hasAction">Etibarnamə ver</nuxt-link>
      </span>
      <nuxt-link :to="$localePath(item.url)" class="e-service__actions--right">
        Ətraflı
        <icon name="chevron-right" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        item: Object
    }
}
</script>

<style></style>
