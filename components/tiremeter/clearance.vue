<template>
  <div class="ma-tiremeter__speedometer">
    <h6 class="ma-tiremeter-small-title">
      {{ $t('clearance_change') }}
    </h6>
    <div class="ma-tiremeter__clearance--image">
      <img src="/tiremeter/car2.png" alt="" />
      <svg
        width="7"
        height="16"
        viewBox="0 0 7 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ma-tiremeter__clearance--arrow-vertical"
      >
        <path d="M3.5 1L3.5 14" stroke="#081A3E" stroke-linecap="round" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.40873 3.69202C6.23755 3.86287 5.96002 3.86287 5.78884 3.69202L3.46884 1.37648L1.14883 3.69202C0.977652 3.86287 0.70012 3.86287 0.528944 3.69202C0.357767 3.52117 0.357767 3.24418 0.528944 3.07333L3.15889 0.448447C3.33007 0.277601 3.6076 0.277601 3.77878 0.448447L6.40873 3.07333C6.5799 3.24418 6.5799 3.52117 6.40873 3.69202Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.528773 12.1283C0.69995 11.9574 0.977482 11.9574 1.14866 12.1283L3.46866 14.4438L5.78867 12.1283C5.95985 11.9574 6.23738 11.9574 6.40856 12.1283C6.57973 12.2991 6.57973 12.5761 6.40856 12.747L3.77861 15.3719C3.60743 15.5427 3.3299 15.5427 3.15872 15.3719L0.528773 12.747C0.357597 12.5761 0.357597 12.2991 0.528773 12.1283Z"
          fill="#081A3E"
        />
      </svg>
      <svg
        width="100%"
        height="7"
        viewBox="0 0 196 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ma-tiremeter__clearance--arrow-horizontal"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.37171 0.128382C3.54255 0.299559 3.54255 0.577091 3.37171 0.748267L1.05617 3.06827L3.37171 5.38828C3.54255 5.55946 3.54255 5.83699 3.37171 6.00817C3.20086 6.17934 2.92386 6.17934 2.75302 6.00817L0.128135 3.37822C-0.0427117 3.20704 -0.0427117 2.92951 0.128135 2.75833L2.75302 0.128382C2.92386 -0.0427941 3.20086 -0.0427941 3.37171 0.128382Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M192.128 6.00834C191.957 5.83716 191.957 5.55963 192.128 5.38845L194.444 3.06844L192.128 0.748438C191.957 0.577262 191.957 0.299729 192.128 0.128553C192.299 -0.0426236 192.576 -0.0426235 192.747 0.128553L195.372 2.7585C195.543 2.92968 195.543 3.20721 195.372 3.37839L192.747 6.00834C192.576 6.17951 192.299 6.17951 192.128 6.00834Z"
          fill="#081A3E"
        />
        <path d="M1 3L194 2.99998" stroke="#081A3E" stroke-linecap="round" />
      </svg>
    </div>
    <h6 class="ma-tiremeter-small-title mt-1">
      {{ value }} {{ $t('char_millimetre') }}
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style></style>
