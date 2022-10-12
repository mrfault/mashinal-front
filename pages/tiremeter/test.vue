<template></template>

<script>
export default {
  methods: {
    calculateParameters() {
      var f =
        Math.round((this.form.tireWidth.old * this.form.profile.old) / 100) / 10
      var g =
        Math.round((this.form.tireWidth.new * this.form.profile.new) / 100) / 10
      var b =
        Math.round(
          25.4 * this.form.radius.old +
            (this.form.tireWidth.old * this.form.profile.old * 2) / 100,
        ) / 10
      var c =
        Math.round(
          25.4 * this.form.radius.new +
            (this.form.tireWidth.new * this.form.profile.new * 2) / 100,
        ) / 10
      var h = Math.round(25.4 * this.form.radius.old) / 10
      var k = Math.round(25.4 * this.form.radius.new) / 10
      // this.oldProfileHeight = Math.round(25.4 * this.form.radius.old) / 10
      // this.newProfileHeight = Math.round(25.4 * this.form.radius.new) / 10

      var oldA = this.form.tireWidth.old
      var oldB = 10 * f
      var oldC = 10 * h
      var oldD = 10 * b
      var newA = this.form.tireWidth.new
      var newB = 10 * g
      var newC = 10 * k
      var newD = 10 * c

      var diffA = Math.round(this.form.tireWidth.old - this.form.tireWidth.new)
      var diffB = Math.round(10 * (f - g))
      var diffC = Math.round(10 * (h - k))
      var diffD = Math.round(10 * (b - c))
    },
  },
}
</script>

<style></style>
