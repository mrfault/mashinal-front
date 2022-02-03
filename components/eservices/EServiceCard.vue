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
        <img :src="`/images/${item.image}.png`" />
      </div>
      <div class="e-service__body--description">
        <p class="key" v-if="item.description">{{ item.description }}</p>
        <span class="value" v-if="item.value">{{ item.value }}</span>
      </div>
    </div>
    <div class="e-service__actions">
      <span class="e-service__actions--left">
        <letter-of-attorney-button href="#" tag="a" classes=""  v-if="item.hasAction"/>
      </span>
      <nuxt-link :to="$localePath(item.url)" class="e-service__actions--right">
         {{ $t('detail') }}
        <icon name="chevron-right" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import LetterOfAttorneyButton from "~/components/garage/loa/LetterOfAttorneyButton";
export default {
  components: {LetterOfAttorneyButton},
  props:{
        item: Object
    }
}
</script>

<style></style>
