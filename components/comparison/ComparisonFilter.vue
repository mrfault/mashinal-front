<template>
  <div class="comparison-filter">
    <div class="card">
      <form-buttons
        class="comparison-filter__types"
        v-model="compareType"
        :options="options"
        :group-by="0"
      />
      <div class="comparison-filter__checkboxes">
        <button
          v-if="compareType === 'models'"
          class="btn full-width btn--pale-green"
          @click.stop="addModel()"
        >
            <icon name="plus-circle" /> 
            <span>{{ $t('add_car_model') }}</span>
        </button>
        <form-checkbox
          v-model="showDifferences" 
          :label="$t('comparison_show_differences')"
          :checked="showDifferences"
          input-name="show_differences"
        />
        <form-checkbox
          v-model="hideEmptyCells" 
          :label="$t('comparison_hide_empty_cells')"
          :checked="hideEmptyCells"
          input-name="hide_empty_cells"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
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