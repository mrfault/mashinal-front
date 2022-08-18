<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      form: {

      }
    }
  },
  methods: {
    calculate() {
      var $form = $('#calc');
      $form.find("select").on("change", function () {
        var d = a(this).closest("div");
        d.find('select[name="width"] option:selected').text();
        d.find('select[name="profile"] option:selected').text();
        d.find('select[name="radius"] option:selected').text().substr(1);
        d = parseInt(a("#old-width").val());
        var l = parseInt(a("#old-profile").val()),
          m = parseInt(a("#old-radius").val()),
          e = parseInt(a("#width").val()),
          n = parseInt(a("#profile").val()),
          p = parseInt(a("#radius").val()),
          f = Math.round((d * l) / 100) / 10,
          g = Math.round((e * n) / 100) / 10,
          b = Math.round(25.4 * m + (d * l * 2) / 100) / 10,
          c = Math.round(25.4 * p + (e * n * 2) / 100) / 10,
          h = Math.round(25.4 * m) / 10,
          k = Math.round(25.4 * p) / 10;
        d != e ? a("#result_d").html(d / 10 + " см <span>&laquo;L&raquo;</span> " + e / 10 + " см") : a("#result_d").html("<span>&laquo;L&raquo;:</span>  " + e / 10 + " см");
        f != g ? a("#result_c").html(f + " см <span>&laquo;H&raquo;</span> " + g + " см") : a("#result_c").html("<span>&laquo;H&raquo;:</span>  " + f + " см");
        b != c
          ? (a("#result_a").html(b + " см <span>&laquo;D&raquo;</span> " + c + " см"),
            a("#result_s").html((c < b ? "+ " : "– ") + Math.abs(Math.round((100 * (c - b)) / b)) + "%"),
            a("#tab_s").html((c < b ? "+ " : "– ") + Math.abs(Math.round((100 * (c - b)) / b)) + "%"),
            a(".result_s2").html(Math.abs(Math.round((100 * (c - b)) / b)) + "% "))
          : (a("#result_a").html("<span>&laquo;D&raquo;:</span>  " + b + " см"), a("#result_s").html(""), a("#tab_s").html(""));
        h != k ? a("#result_b").html(h + " см <span>&laquo;R&raquo;</span> " + k + " см") : a("#result_b").html("<span>&laquo;R&raquo;:</span>  " + h + " см");
        b != c
          ? (a("#result_k").html((0 < c - b ? "+ " : "– ") + Math.abs(Math.round(10 * (c - b)) / 20) + " см"),
            a("#tab_k").html((0 < c - b ? "+ " : "– ") + 10 * Math.abs(Math.round(10 * (c - b)) / 20) + " мм"))
          : (a("#result_k").html(""), a("#tab_k").html(""));
        a("#result_header").css("display", "none");
        a("#a1").css("display", "none");
        a("#a2").css("display", "none");
        a("#c1").css("display", "none");
        a("#c2").css("display", "none");
        a("#d1").css("display", "none");
        a("#d2").css("display", "none");
        if (l != n || d != e || m != p) a("#result_table").css("display", "block"), a("#result_header").css("display", "block");
        g > f && a("#c1").css("display", "block");
        f > g && a("#c2").css("display", "block");
        c > b && a("#a1").css("display", "block");
        b > c && a("#a2").css("display", "block");
        d > e && a("#d2").css("display", "block");
        e > d && a("#d1").css("display", "block");
        a("#old-width-tab").html(d + " мм");
        a("#old-height-tab").html(10 * f + " мм");
        a("#old-disk-tab").html(10 * h + " мм");
        a("#old-diametr-tab").html(10 * b + " мм");
        a("#new-width-tab").html(e + " мм");
        a("#new-height-tab").html(10 * g + " мм");
        a("#new-disk-tab").html(10 * k + " мм");
        a("#new-diametr-tab").html(10 * c + " мм");
        a("#dif-width-tab").html(Math.round(d - e) + " мм");
        a("#dif-height-tab").html(Math.round(10 * (f - g)) + " мм");
        a("#dif-disk-tab").html(Math.round(10 * (h - k)) + " мм");
        a("#dif-diametr-tab").html(Math.round(10 * (b - c)) + " мм");
      });
      $form.find("#old-radius, #radius").change();
    }
  }
}
</script>

<style scoped>

</style>
