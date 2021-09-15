<template>
  <label class="form-keywords" for="keywords">
    <div class="keywords">
      <span
        v-for="(keyword, index) in keywords"
        :key="keyword"
        class="keyword"
        :class="{'keyword--highlighted': highlightLastKeyword && index === keywords.length - 1}"
        @click="removeKeyword(index)"
      >
        <icon name="cross" />
        {{ keyword }}
      </span>
    </div>
    <input
      id="keywords"
      type="text"
      @keyup="inputHandler"
      ref="keywordInput"
      :placeholder="$t('add_keywords')"
    />
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      highlightLastKeyword: false,
    }
  },
  methods: {
    inputHandler(e) {
      if (e.key === 'Backspace' && e.target.value === '') {
        if (this.highlightLastKeyword) {
          this.keywords.pop()
          this.highlightLastKeyword = false
        } else {
          this.highlightLastKeyword = true
        }
      } else {
        if (['Enter', ' '].includes(e.key)) {
          this.addKeyword(e)
        }
        this.highlightLastKeyword = false
      }

    },
    addKeyword(e) {
      const value = e.target.value.trim();

      if (value) {
        if (!this.keywords.includes(value)) {
          this.keywords.push(value)
        }
      }
      this.$refs.keywordInput.value = ''
    },
    removeKeyword(index) {
      this.keywords.splice(index, 1)
    }
  },
  computed: {
    keywords: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>