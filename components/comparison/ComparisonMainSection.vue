<template>
   <div>
      <div id="comparison" class="comparison" @mousedown="startDragging" v-if="!showNotFound">
         <comparison-announcements v-if="filter.compareType === 'announcements'"/>
         <comparison-models v-else/>
      </div>

      <no-results
         v-else
         :text="$t('no_cars_found')"
      >
         <nuxt-link :to="$localePath('/')" class="btn btn--green mt-2 mt-lg-3" v-html="$t('to_add_an_advert')"/>
      </no-results>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';
   import ComparisonAnnouncements from '~/components/comparison/ComparisonAnnouncements'
   import ComparisonModels from '~/components/comparison/ComparisonModels'
   import NoResults from '~/components/elements/NoResults'

   export default {
      components: {
         ComparisonAnnouncements,
         ComparisonModels,
         NoResults
      },

      computed: {
         ...mapGetters({
            filter: 'comparison/filter',
            announcements: 'comparison/announcementIds',
            modelsList: 'comparison/modelsList',
         }),

         showNotFound() {
            return this.filter.compareType === 'announcements' && !this.announcements.length
         }
      },

      methods: {
         updateCompareType() {
            if (['announcements', 'models'].includes(this.$route.hash?.replace('#', ''))) {
               this.$store.commit('comparison/mutate', {
                  property: 'filter',
                  key: 'compareType',
                  value: this.$route.hash.replace?.('#', '')
               });
            }
         },

         startDragging(event) {
            event.preventDefault(); // Disable content selection while dragging
            event.stopPropagation();
            const container = event.currentTarget;
            let startX = event.clientX;
            let scrollLeft = container.scrollLeft;

            const scrollByDragging = (event) => {
               const distance = event.clientX - startX;
               container.scrollLeft = scrollLeft - distance;
            };

            const stopDragging = () => {
               document.removeEventListener('mousemove', scrollByDragging);
               document.removeEventListener('mouseup', stopDragging);
               container.style.userSelect = ''; // Restore default content selection behavior
            };

            document.addEventListener('mousemove', scrollByDragging);
            document.addEventListener('mouseup', stopDragging);
            container.style.userSelect = 'none'; // Disable content selection during dragging
         }
      },

      watch: {
         '$route'(val) {
            this.updateCompareType()
         }
      },

      mounted() {
         this.updateCompareType();
      }
   }
</script>
