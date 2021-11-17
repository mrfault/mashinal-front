<template>
  <div class="comparison-filter">
    <div class="card">
      <div class="row">
        <div class="col-12 mb-2 mb-lg-0 col-lg-auto mr-auto">
          <form-buttons
            class="comparison-filter__types"
            v-model="compareType"
            :options="options"
            :group-by="0"
          />
        </div>
        <div class="col-12 mb-2 mb-lg-0 col-lg-1-5">
          <button
            v-if="compareType === 'models' && models.length"
            :class="['btn full-width btn--pale-green', { disabled: models.length >= 5 }]"
            @click.stop="addModel()"
          >
            <icon name="plus-circle" /> 
            <span>{{ $t('add_car_model') }}</span>
          </button>
        </div>
        <div class="col-6 col-lg-1-5">
          <form-checkbox
            v-model="showDifferences" 
            :label="$t('comparison_show_differences')"
            :checked="showDifferences"
            input-name="show_differences"
          />
        </div>
        <div class="col-6 col-lg-1-5">
          <form-checkbox
            v-model="hideEmptyCells" 
            :label="$t('comparison_hide_empty_cells')"
            :checked="hideEmptyCells"
            input-name="hide_empty_cells"
          />
        </div>
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
          name: this.$t('comparison_models'),
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
  }
}
</script>