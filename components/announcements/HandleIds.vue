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
            required: true
            // type: Array,
            // default() { return [] }
         },

         watchIds: {
            type: Boolean,
            default: true
         }
      },

      mounted() {
         this.$store.dispatch('fetchHandleIds', { single: this.single, data: this.items });
      },

      watch: {
         items(newVal) {
            if (!this.single && this.watchIds) this.$store.dispatch('fetchHandleIds', { type: this.items.type, data: newVal });
         }
      }
   }
</script>
