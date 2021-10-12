<template>
  <div class="business-profile__faq">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2
        :class="{
          'section-title': true,
          'heading-dots': true,
          'heading-dots--left': isMobileBreakpoint
        }"
      >
        Tez-tez verilən suallar
      </h2>
    </div>

    <accordion
      :list="visibleList"
    />

    <button class="btn btn--dark-blue-2-outline mt-5 show-more" @click="showAll = !showAll" v-if="defaultVisibleItemCount">
      {{ showAll ? $t('less') : $t('More') }}
      <icon :name="showAll ? 'arrow-top' : 'arrow-bottom'" />
    </button>
  </div>
</template>

<script>
import Accordion from '~/components/elements/Accordion';

export default {
  components: {
    Accordion
  },
  data() {
    return {
      list: [
        {
          title: 'Lorem 1',
          text: 'lorem ipsum dolor horse amet'
        },
        {
          title: 'Lorem 2',
          text: 'lorem ipsum dolor horse amet'
        },
        {
          title: 'Lorem 3',
          text: 'lorem ipsum dolor horse amet'
        },
        {
          title: 'Lorem 4',
          text: 'lorem ipsum dolor horse amet'
        },
        {
          title: 'Lorem 5',
          text: 'lorem ipsum dolor horse amet'
        },
        {
          title: 'Lorem 6',
          text: 'lorem ipsum dolor horse amet'
        },
      ],
      showAll: false,
      defaultVisibleItemCount: 5
    }
  },
  computed: {
    visibleList() {
      if (!this.showAll) {
        if (this.defaultVisibleItemCount) {
          return this.list.slice(0, this.defaultVisibleItemCount)
        }
      }
      return this.list
    }
  }
}
</script>Accordion