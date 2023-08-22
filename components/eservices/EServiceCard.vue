<template>
   <nuxt-link class="e-service e-service__card" :to="$localePath(item.url)">
      <div class="e-service__header">
         <inline-svg :src="`/card-icons/new/${item.image}.svg`" />
      </div>

      <div class="e-service__body">

         <!--<div class="e-service__card--image">
            <img :src="`/card-icons/new/${item.image}.svg`" alt="">
         </div>-->
         <h5 class="e-service__title">{{ $t(item.title) }}</h5>

         <p class="e-service__description">{{ $t(item.description) }}</p>

<!--         <div class="e-service__body&#45;&#45;image">-->
<!--            <img :src="`/card-icons/${item.image}.svg`"/>-->
<!--         </div>-->
<!--         <div class="e-service__body&#45;&#45;description" v-if="item.description">-->
<!--            <p class="key">{{ item.description }}</p>-->
<!--            <span class="value">{{ item.value }}</span>-->
<!--         </div>-->
<!--         <div class="e-service__body&#45;&#45;description" v-if="item.isContract">-->
<!--            <p class="key">-->
<!--               <span class="description-red-7">"{{ item.contractName }}"</span>-->
<!--               {{ $t('end_time_of_package') }}-->
<!--               <span>-->
<!--            <b>{{ item.contractEndDate }}</b>-->
<!--          </span>-->
<!--            </p>-->
<!--         </div>-->
<!--         <div class="e-service__body&#45;&#45;description" v-if="item.isMessage">-->
<!--            <div class="e-service__body&#45;&#45;image"></div>-->
<!--            <ol>-->
<!--               <li>{{ $t('vsego') }} : {{ item.messageCounts[0] }}</li>-->
<!--               <li>{{ $t('notread_messages') }} : {{ item.messageCounts[1] }}</li>-->
<!--            </ol>-->
<!--         </div>-->
      </div>

<!--      <div class="e-service__actions">-->
<!--         <div class="e-service__actions&#45;&#45;left">-->
<!--            &lt;!&ndash;        <a class="text-green e-service__actions&#45;&#45;button" href="javascript:void(0);" @click="$emit('showPayment')" v-if="item.key === 'contract' &&  shouldExtendContract && $route.params.type != 3">-->
<!--                      {{ $t('extend_subscription') }}-->
<!--                    </a>-->
<!--                    <nuxt-link class="text-green" :to="$localePath('/business-profile') + '?type=1&scrollto=packages'" v-else-if="item.key === 'contract' && $route.params.type == 1">-->
<!--                      {{ $t('to_change_package') }}-->
<!--                    </nuxt-link>&ndash;&gt;-->
<!--            <letter-of-attorney-button-->
<!--               href="#"-->
<!--               tag="a"-->
<!--               classes=""-->
<!--               v-if="item.hasAction && item.isAttorney"-->
<!--            />-->

<!--            <button-->
<!--               v-if="item.hasActionMethod"-->
<!--               @click="setStoreBalance(item.actionLink)"-->
<!--               class="e-service__actions&#45;&#45;button pl-0"-->
<!--            >-->
<!--               {{ item.actionName }}-->
<!--            </button>-->

<!--            <nuxt-link v-else :to="$localePath(item.actionLink)">-->
<!--               <template>-->
<!--                  {{ item.actionName }}-->
<!--               </template>-->
<!--            </nuxt-link>-->
<!--         </div>-->

<!--&lt;!&ndash;         <div class="e-service__actions&#45;&#45;right">&ndash;&gt;-->
<!--&lt;!&ndash;            <nuxt-link :to="$localePath(item.url)" class="">&ndash;&gt;-->
<!--&lt;!&ndash;               {{ $t('detail') }}&ndash;&gt;-->
<!--&lt;!&ndash;               <icon name="chevron-right"/>&ndash;&gt;-->
<!--&lt;!&ndash;               &lt;!&ndash; <inline-svg src="/icons/chevron-right.svg" :height="14" /> &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;            </nuxt-link>&ndash;&gt;-->
<!--&lt;!&ndash;         </div>&ndash;&gt;-->
<!--      </div>-->
   </nuxt-link>
</template>

<script>
   import LetterOfAttorneyButton from '~/components/garage/loa/LetterOfAttorneyButton';

   export default {
      components: { LetterOfAttorneyButton },

      props: {
         shouldExtendContract: Boolean,
         item: Object,
      },

      computed: {
         isSafari() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
         }
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
         }
      }
   }
</script>
