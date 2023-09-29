<template>
   <div class="comparison-filter">
      <div class="row">
         <div class="col-12 col-md-3 mr-auto mb-2 mb-md-0">
            <form-buttons
               class="comparison-filter__types"
               v-model="compareType"
               :options="options"
               :group-by="0"
            />
         </div>

         <div class="col-12 col-lg-1-5 mt-2 mt-lg-0" v-if="models.length < 5 && (compareType === 'models' && models.length)">
<!--            <button-->
<!--               :class="['btn full-width btn&#45;&#45;pale-green', { disabled: models.length >= 5 }]"-->
<!--               @click.stop="addModel()"-->
<!--            >-->
<!--               <icon name="plus-circle"/>-->
<!--               <span>{{ $t('add_car_model') }}</span>-->
<!--            </button>-->
         </div>

         <div class="comparison-filter__checkboxes">
            <form-checkbox
               v-model="hideEmptyCells"
               :label="$t('comparison_hide_empty_cells')"
               :checked="hideEmptyCells"
               input-name="hide_empty_cells"
            />

            <form-checkbox
               v-model="showDifferences"
               :label="$t('comparison_show_differences')"
               :checked="showDifferences"
               input-name="show_differences"
            />
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';

   export default {
      computed: {
         ...mapGetters({
            models: 'comparison/modelsList'
         }),

         options() {
            return [
               {
                  name: this.$t('comparison_announcements'),
                  key: 'announcements'
               },
               {
                  name: this.$t('autocatalog'),
                  key: 'models'
               },
            ]
         },

         compareType: {
            get() {
               return this.$store.getters['comparison/filter'].compareType
            },
            set(val) {
               this.$store.commit('comparison/mutate', {
                  property: 'filter',
                  key: 'compareType',
                  value: val
               })
            }
         },

         showDifferences: {
            get() {
               return this.$store.getters['comparison/filter'].showDifferences
            },
            set(val) {
               if (val) this.$cookies.set('showDifferences', true);
               else this.$cookies.remove('showDifferences');

               this.$store.commit('comparison/mutate', {
                  property: 'filter',
                  key: 'showDifferences',
                  value: val
               })
            }
         },

         hideEmptyCells: {
            get() {
               return this.$store.getters['comparison/filter'].hideEmptyCells
            },
            set(val) {
               if (val) this.$cookies.set('hideEmptyCells', true);
               else this.$cookies.remove('hideEmptyCells');

               this.$store.commit('comparison/mutate', {
                  property: 'filter',
                  key: 'hideEmptyCells',
                  value: val
               })
            }
         }
      },

      methods: {
         addModel() {
            this.$store.commit('comparison/mutate', {
               property: 'showAddModelPopup',
               value: true
            })
         }
      },

      mounted() {
         this.showDifferences = !!this.$cookies.get('showDifferences');
         this.hideEmptyCells = !!this.$cookies.get('hideEmptyCells');
      }
   }
</script>

<style lang="scss">
   .comparison-filter {
      &__types {
         .form-group {
            .btn {
               border: none;
               border-bottom: 1px solid transparent;
               border-radius: 0;
               background-color: transparent;
               height: 44px;

               span {
                  color: #4B5565;
                  overflow: visible;
               }

               &:hover {
                  background-color: unset;
               }

               &.active {
                  border-bottom: 1px solid #155EEF;

                  span {
                     color: #121926;
                  }
               }
            }
         }
      }

      &__checkboxes {
         .form-group {
            .checkbox-input {
               label {
                  border: none;
               }
            }
         }
      }
   }
</style>
