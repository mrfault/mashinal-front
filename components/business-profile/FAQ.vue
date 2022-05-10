<template>
  <div class="business-profile__faq">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2 :class="['section-title','heading-dots',{'heading-dots--left': isMobileBreakpoint}]">
        {{ $t('faq') }}
      </h2>
    </div>
    <accordion :list="visibleList" />
    <button class="btn btn--dark-blue-2-outline mt-5 show-more" @click="showAll = !showAll" v-if="faq.length > defaultVisibleItemCount">
      {{ showAll ? $t('less') : $t('More') }}
      <icon :name="showAll ? 'arrow-top' : 'arrow-bottom'" />
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Accordion from '~/components/elements/Accordion';

export default {
  components: {
    Accordion
  },
  data() {
    return {
      showAll: false,
      defaultVisibleItemCount: 5
    }
  },
  computed: {
    ...mapGetters({
      faq: 'packages/faq'
    }),

    list() {
      return this.faq.map(item => ({ title: item.question[this.locale], text: item.answer[this.locale]}));
    },
    visibleList() {
      if (!this.showAll) {
        return this.list.slice(0, this.defaultVisibleItemCount);
      }
      return this.list;
    }
  }
}
</script>
