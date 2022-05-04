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
        <img :src="`/card-icons/${item.image}.svg`" />
      </div>
      <div class="e-service__body--description" v-if="item.description">
        <p class="key">{{ item.description }}</p>
        <span class="value">{{ item.value }}</span>
      </div>
      <div class="e-service__body--description" v-if="item.isContract">
        <p class="key">
          <span class="description-red-7">"{{ item.contractName }}"</span>
          {{ $t('end_time_of_package') }}
          <span>
            <b>{{ item.contractEndDate }}</b>
          </span>
        </p>
      </div>
      <div class="e-service__body--description" v-if="item.isMessage">
        <div class="e-service__body--image"></div>
        <ol>
          <li>{{ $t('vsego') }} : {{ item.messageCounts[0] }}</li>
          <li>{{ $t('notread_messages') }} : {{ item.messageCounts[1] }}</li>
        </ol>
      </div>
    </div>
    <div class="e-service__actions">
      <div class="e-service__actions--left">
        <a class="text-green e-service__actions--button" href="javascript:void(0);" @click="$emit('showPayment')" v-if="item.key === 'contract' && shouldExtendContract">
          {{ $t('extend_subscription') }}
        </a>
        <letter-of-attorney-button
          href="#"
          tag="a"
          classes=""
          v-if="item.hasAction && item.isAttorney"
        />
        <button
          v-if="item.hasActionMethod"
          @click="setStoreBalance(item.actionLink)"
          class="e-service__actions--button pl-0"
        >
          {{ item.actionName }}
        </button>
        <nuxt-link v-else :to="$localePath(item.actionLink)">
          <template>
            {{ item.actionName }}
          </template>
        </nuxt-link>
      </div>
      <div class="e-service__actions--right">

        <nuxt-link :to="$localePath(item.url)" class="">
          {{ $t('detail') }}
          <icon name="chevron-right"/>
          <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import LetterOfAttorneyButton from '~/components/garage/loa/LetterOfAttorneyButton'

export default {
  components: { LetterOfAttorneyButton },
  props: {
    shouldExtendContract: Boolean,
    item: Object,
  },
  computed: {
    isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    },
  },
  methods: {
    setStoreBalance(link) {
      this.$store.commit('mutate', {
        property: 'balanceHasAnimation',
        value: true,
      })
      this.$router.push(link)
    },
    checkIfSafari(link) {
      if (this.isSafari) {
        this.setStoreBalance(link)
      } else {
        alert('hayhuy')
      }
    },
  },
}
</script>
