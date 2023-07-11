<template>
   <div class="pages-parts-category">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <categories class="d-none d-lg-flex" />

         <part-search-form
            :filters="filters"
            :category="category"
            :pending="pending"
            @pending="pending = true"
            @submit="searchParts"
         />

         <div class="announcements-content">
            <grid
               v-if="getMainMonetized.length"
               :announcements="getMainMonetized"

               :show-title="true"
               escape-duplicates
            />
<!--            :title="$t('featured_ads')"-->
         </div>

         <div class="announcements-content">
            <grid
               v-if="announcements.length"
               :announcements="announcements"
               :paginate="$paginate(pagination)"
               :pending="pending"

               :show-title="true"
               @change-page="searchParts"
               escape-duplicates
            />
<!--            :title="$t('announcements')"-->

            <no-results v-else type="part"/>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {RoutesMixin} from '~/mixins/routes'

import Grid from '~/components/announcements/Grid'
import Categories from '~/components/parts/Categories'
import Banners from '~/components/parts/Banners'
import PartSearchForm from '~/components/parts/PartSearchForm'
import NoResults from '~/components/elements/NoResults'

export default {
   name: 'pages-parts-categories',
   layout: 'search',
   mixins: [RoutesMixin],
   nuxtI18n: {
      paths: {
         az: '/ehtiyat-hisseleri/:category'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_parts_category', {
            category: this.$t('meta-words_part-categories')[0]
         }),
         description: ''
      })
   },
   components: {
      Grid,
      Categories,
      Banners,
      PartSearchForm,
      NoResults
   },
   async asyncData({$axios, store, app, route, error}) {
      const slug = ({
         'zapcasti': 'parts',
         'siny': 'tyres',
         'diski': 'rims',
         'masla-i-avtoximiya': 'oil_and_auto_chemistry',
         'akkumulyatory': 'batteries',
         'aksessuary': 'auto_accessories',
         'avtoinstrumenty': 'repair_tools',
         'ehtiyyat-hisseleri': 'parts',
         'sinler': 'tyres',
         'diskler': 'rims',
         'yag-ve-avto-kimya': 'oil_and_auto_chemistry',
         'akkumulyatorlar': 'batteries',
         'avtoaksesuarlar': 'auto_accessories',
         'temir-aletleri': 'repair_tools'
      })[route.params.category];

      if (!slug) return error({statusCode: 404});

      await store.dispatch('i18n/setRouteParams', {
         az: {category: app.i18n.t('slug_' + slug, 'az')},
         ru: {category: app.i18n.t('slug_' + slug, 'ru')}
      });

      const categories = await $axios.$get('/part/categories');
      const category = categories.find(item => Object.values(item.slug).includes(route.params.category) && item.id !== 18);
      const filters = await $axios.$get(`/part/category/${category.id}/filters`)

      await store.dispatch('parts/getAnnouncements', {
         body: {
            category_id: category.id,
            sub_category_id: route.query.id || 0
         }
      });

      return {
         category,
         filters
      }
   },
   data() {
      return {
         pending: false
      }
   },
   mounted() {
      this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'parts' });

      if (this.$route.query.parts_filter) {
         this.searchParts()
      }
   },
   methods: {
      async searchParts(page) {
         page = this.$route.query.page || 1;
         const data = JSON.parse(this.$route.query.parts_filter || '{}');
         data.category_id = this.category.id
         this.pending = true;
         await this.$store.dispatch('parts/getAnnouncements', {
            body: data,
            params: {page}
         })
         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'parts', data: data });
         this.pending = false;
         this.scrollTo('.announcements-content', [0, -30]);
      }
   },
   computed: {
      ...mapGetters({
         announcements: 'parts/announcements',
         pagination: 'parts/pagination',
         getMainMonetized: 'getMainMonetized'
      }),
      crumbs() {
         return [
            {name: this.$t('all_parts'), route: '/parts'},
            {name: this.partsRoutes.find(route => route.slug === this.$route.params.category)?.localeTitle}
         ]
      }
   }
}
</script>
