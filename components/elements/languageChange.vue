<template>
   <div class="languageChange" @click="changeLanguage">
      <span>{{ locale === 'az' ? 'RU' : 'AZ' }}</span>
   </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
   methods: {
      ...mapActions(['changeLocale']),

      changeLanguage() {
         (this.locale === 'az') ? this.changeLocale('ru') : this.changeLocale('az');
      }
   }
}
</script>

<style lang="scss" scoped>
   .languageChange {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #9AA4B2;
      cursor: pointer;

      span {
         font-weight: 500;
         font-size: 16px;
         color: #FFFFFF;
      }
   }
</style>
