<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      genders: ['m', 'f'],
      drinkTypes: [{
        name: 'Vodka',
        value: 40,
      }],
      diagramValues: [
        0.01, 0.154, 0.6, 1.2, 2.5, 6, 10
      ],
      timeToDrive:0,
      concentration: 0,
      concentrProm:0,
      form: {
        gender: 'm',
        mass: 85,
        time: 0.5,
        drinkValue1: 50,
        drinkType1: 0,
        drinkValue2: 0,
        drinkType2: 0,
        drinkValue3: 0,
        drinkType3: 0,
      }
    }
  },
  methods: {
    doTest() {
      let r;
      if (this.form.gender === 'm') {
        r = 0.68;
      } else if (this.form.gender === "f") {
        r = 0.55;
      }


      let M = parseFloat(this.form.mass);
      if (isNaN(M) || !M) {
        this.form.mass = 70;
      }
      var T = parseFloat(this.form.time);
      if (isNaN(T) || !T) {
        this.form.time = 0;
      }
      var v = parseInt(this.form.drinkValue1);
      var k = parseInt(this.form.drinkType1);
      var A = 0;

      if (isNaN(v) || !v) v = 0;
      if (isNaN(k) || !k) k = 0;
      A += v * k / 100;

      v = parseInt(this.form.drinkValue2);
      k = parseInt(this.form.drinkType2);
      if (isNaN(v) || !v) v = 0;
      if (isNaN(k) || !k) k = 0;
      A += v * k / 100;

      v = parseInt(this.form.drinkValue3);
      k = parseInt(this.form.drinkType3);
      if (isNaN(v) || !v) v = 0;
      if (isNaN(k) || !k) k = 0;
      A += v * k / 100;
      A *= 0.79384;
      var C = 0.68 * (A / M / r - 0.13 * T);
      if (C < 0) C = 0;
      this.concentration = this.nrm(C, 1000);
      this.concentrProm = this.nrm(C / 0.45, 1000);
       this.diag(C);

      var rul = 0;
      var Cor = C;
      while (C > this.diagramValues[1]) {
        rul++;
        C = 0.8 * (A / M / r - 0.13 * (T + rul));
      }
      this.timeToDrive = rul;
      //if (Cor > 8) f.rul.value = f.rul.value + '';
    },
    nrm(val, to) {
      var t = Math.round(val * to);
      var tt = t / to;
      return tt.toFixed(2);
    },
    diag(doza) {
      for (var i = 0; i < this.diagramValues.length; i++) {
        if (doza <= this.diagramValues[i]) return //  diag2[i] speedometer image ;
      }
      return //diag2[6] speedometer image ;
    }
  }
}
</script>

<style scoped>

</style>
