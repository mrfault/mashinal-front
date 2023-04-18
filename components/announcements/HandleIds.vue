<template>

</template>

<script>
   export default {
      props: {
         type: {
            type: String,
            default: 'car'
         },

         single: {
            type: Boolean,
            default: false
         },

         items: {
            type: Array,
            default() { return [] }
         },

         watchIds: {
            type: Boolean,
            default: true
         }
      },

      mounted() {
         this.$store.dispatch('fetchHandleIds', { single: this.single, type: this.type, ids: this.items });
      },

      watch: {
         'items'(newVal) {
            if (!this.single && this.watchIds) this.$store.dispatch('fetchHandleIds', { type: this.type, ids: newVal });
         }
      }
   }
</script>
