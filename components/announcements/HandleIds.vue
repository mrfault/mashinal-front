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
         }
      },

      mounted() {
         this.$store.dispatch('fetchHandleIds', { type: this.type, ids: this.items });
      },

      watch: {
         'items'(newVal) {
            if (!this.single) this.$store.dispatch('fetchHandleIds', { type: this.type, ids: newVal });
         }
      }
   }
</script>
