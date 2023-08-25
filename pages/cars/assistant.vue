<template>
   <div class="pages-cars-assistant">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <car-guide :class="{'mb-5':  result.announcements?.length > 0 || result.monetized?.length > 0}" @onSubmit="onGuideSubmit" @reset="resetForm" :pending="pending"/>
      </div>
      <no-results
         v-if="result.announcements?.length === 0 && result.monetized?.length === 0"/>
      <div class="overflow-hidden" v-if="result.monetized?.length">
         <grid
            :announcements="result.monetized"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('featured_ads') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/featured-ads')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>
      <div class="overflow-hidden bg-white" v-if="result.announcements?.length">
         <grid
            :announcements="result.announcements"
            :itemDetailsDark="true"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('recent_uploads') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/cars')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>
   </div>
</template>

<script>
import CarSearchForm from '~/components/cars/CarSearchForm';
import CarGuide from "~/components/cars/CarGuide.vue";
import {mapActions, mapGetters} from "vuex";
import Grid from "~/components/announcements/Grid.vue";
import Cap from "~/components/elements/Cap.vue";
import NoResults from "~/components/elements/NoResults.vue";

export default {
   name: 'pages-cars-assistant',
   layout: 'search',
   components: {
      NoResults,
      Cap, Grid,
      CarGuide,
      CarSearchForm
   },
   nuxtI18n: {
      paths: {
         az: '/masinlar/beledci'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('helper_search')
      });
   },
   data() {
      return {
         result: {
            monetized: null,
            announcements: null
         },
         pending: false
      }
   },
   async asyncData({store}) {
      await Promise.all([
         store.dispatch('getBodyOptions'),
         store.dispatch('getOptions'),
         store.dispatch('getAllOtherOptions', '2'),
      ]);

      return {
         pending: false
      }
   },

   computed: {
      ...mapGetters([
         'mainAnnouncements',
         'monetizedCars',
      ]),
      crumbs() {
         return [
            {name: this.$t('cars'), route: '/cars'},
            {name: this.$t('helper_search')}
         ]
      }
   },
   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   },
   methods: {
      ...mapActions(['fetchMonetizedCarsSearch', 'getGridSearch']),
      async onGuideSubmit(form) {
         this.pending = true
         try {
            await this.fetchMonetizedCarsSearch(form)
            await this.getGridSearch({url: '/car', post: form, prefix: 'main'})
            this.result = {
               monetized: this.monetizedCars,
               announcements: this.mainAnnouncements?.data
            }
         } catch (e) {

         } finally {
            this.pending = false
         }
      },
      resetForm() {
         this.result = {
            monetized: null,
            announcements: null
         }
      }
   }
}
</script>

<style lang="scss">
.pages-cars-assistant {
   padding-bottom: 120px;
}
</style>
