<template>
  <div class="ma-tiremeter__how-to">
    <h2 class="title-with-line full-width mb-2">
      <span>{{ $t('visual_tire_calculator_how_to_title') }}</span>
    </h2>
    <div class="ma-tiremeter__how-to--picture">
      <svg
        viewBox="0 0 370 263"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M329.674 167L326.704 161.96C327.478 161.69 328.09 161.204 328.576 160.538C329.062 159.872 329.314 159.116 329.314 158.306C329.314 157.226 328.936 156.308 328.162 155.552C327.388 154.778 326.47 154.4 325.39 154.4H320.35V167H322.024V162.176H324.994L327.82 167H329.674ZM325.39 155.966C326.02 155.966 326.542 156.2 326.974 156.65C327.424 157.1 327.64 157.658 327.64 158.306C327.64 158.954 327.424 159.512 326.974 159.98C326.542 160.43 326.02 160.664 325.39 160.664H322.024V155.966H325.39Z"
          fill="#081A3E"
        />
        <path
          d="M205.024 3.4H203.35V16H210.46V14.416H205.024V3.4Z"
          fill="#081A3E"
        />
        <path
          d="M358.35 154.4V167H363.264C364.974 167 366.396 166.388 367.53 165.182C368.664 163.958 369.24 162.464 369.24 160.7C369.24 158.936 368.664 157.442 367.53 156.236C366.396 155.012 364.974 154.4 363.264 154.4H358.35ZM360.024 165.416V155.984H363.264C364.542 155.984 365.604 156.434 366.414 157.334C367.224 158.234 367.638 159.35 367.638 160.7C367.638 162.05 367.224 163.166 366.414 164.066C365.604 164.966 364.542 165.416 363.264 165.416H360.024Z"
          fill="#081A3E"
        />
        <path
          d="M328.144 76.746H322.024V71.4H320.35V84H322.024V78.33H328.144V84H329.8V71.4H328.144V76.746Z"
          fill="#081A3E"
        />
        <path
          d="M178.5 260C146.191 260 120 216.124 120 162C120 107.876 146.191 64 178.5 64"
          stroke="white"
          stroke-width="5"
          stroke-linecap="round"
        />
        <path
          d="M178.5 260C146.191 260 120 216.124 120 162C120 107.876 146.191 64 178.5 64"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 260C202.967 260 177 216.124 177 162C177 107.876 202.967 64 235 64"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M236 260C268.033 260 294 216.124 294 162C294 107.876 268.033 64 236 64"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235.145 231.519C212.421 231.519 194 200.394 194 161.998C194 123.602 212.421 92.4766 235.145 92.4766"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235.855 231.519C258.579 231.519 277 200.394 277 161.998C277 123.602 258.579 92.4766 235.855 92.4766"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M179 64H235.5"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M179 260H235.5"
          stroke="#219058"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 64H358"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M179 64L179 17"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 64L235 17"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 92H319"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 232H319"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M235 260H358"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M347 67L347 258"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M309 95L309 229"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M352.28 71.195C351.987 71.4873 351.513 71.4873 351.22 71.195L347.25 67.233L343.28 71.195C342.987 71.4873 342.513 71.4873 342.22 71.195C341.927 70.9026 341.927 70.4287 342.22 70.1364L346.72 65.645C347.013 65.3527 347.487 65.3527 347.78 65.645L352.28 70.1364C352.573 70.4287 352.573 70.9026 352.28 71.195Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M314.28 98.7692C313.987 99.0615 313.513 99.0615 313.22 98.7692L309.25 94.8072L305.28 98.7692C304.987 99.0615 304.513 99.0615 304.22 98.7692C303.927 98.4769 303.927 98.0029 304.22 97.7106L308.72 93.2192C309.013 92.9269 309.487 92.9269 309.78 93.2192L314.28 97.7106C314.573 98.0029 314.573 98.4769 314.28 98.7692Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M304.22 225.219C304.513 224.927 304.987 224.927 305.28 225.219L309.25 229.181L313.22 225.219C313.513 224.927 313.987 224.927 314.28 225.219C314.573 225.511 314.573 225.985 314.28 226.278L309.78 230.769C309.487 231.061 309.013 231.061 308.72 230.769L304.22 226.278C303.927 225.985 303.927 225.511 304.22 225.219Z"
          fill="#081A3E"
        />
        <path
          d="M309 67L309 90"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M314.28 70.7692C313.987 71.0615 313.513 71.0615 313.22 70.7692L309.25 66.8072L305.28 70.7692C304.987 71.0615 304.513 71.0615 304.22 70.7692C303.927 70.4769 303.927 70.0029 304.22 69.7106L308.72 65.2192C309.013 64.9269 309.487 64.9269 309.78 65.2192L314.28 69.7106C314.573 70.0029 314.573 70.4769 314.28 70.7692Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M304.22 85.2191C304.513 84.9268 304.987 84.9268 305.28 85.2191L309.25 89.1811L313.22 85.2191C313.513 84.9268 313.987 84.9268 314.28 85.2191C314.573 85.5114 314.573 85.9854 314.28 86.2777L309.78 90.769C309.487 91.0614 309.013 91.0614 308.72 90.769L304.22 86.2777C303.927 85.9854 303.927 85.5114 304.22 85.2191Z"
          fill="#081A3E"
        />
        <path
          d="M181.744 27L231.744 27"
          stroke="#081A3E"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M185.769 21.9619C186.062 22.2548 186.062 22.7296 185.769 23.0225L181.807 26.9922L185.769 30.9619C186.062 31.2547 186.062 31.7296 185.769 32.0225C185.477 32.3154 185.003 32.3154 184.711 32.0225L180.219 27.5225C179.927 27.2296 179.927 26.7548 180.219 26.4619L184.711 21.9619C185.003 21.669 185.477 21.669 185.769 21.9619Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M228.219 32.0225C227.927 31.7296 227.927 31.2548 228.219 30.9619L232.181 26.9922L228.219 23.0225C227.927 22.7296 227.927 22.2548 228.219 21.9619C228.511 21.669 228.985 21.669 229.278 21.9619L233.769 26.4619C234.061 26.7548 234.061 27.2296 233.769 27.5225L229.278 32.0225C228.985 32.3154 228.511 32.3154 228.219 32.0225Z"
          fill="#081A3E"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M342.22 253.465C342.513 253.173 342.987 253.173 343.28 253.465L347.25 257.427L351.22 253.465C351.513 253.173 351.987 253.173 352.28 253.465C352.573 253.758 352.573 254.231 352.28 254.524L347.78 259.015C347.487 259.307 347.013 259.307 346.72 259.015L342.22 254.524C341.927 254.231 341.927 253.758 342.22 253.465Z"
          fill="#081A3E"
        />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlink:href="#image0_10097_58869" transform="scale(0.00125)" />
          </pattern>
        </defs>
      </svg>
      <div class="image">
        <img
          src="/tiremeter/tire-left-large.png"
          alt="."
          class="ma-tiremeter__tires--left"
        />
      </div>
    </div>

      <div class="ma-tiremeter__how-to--text">
    <h6 class="ma-tiremeter__how-to--text--title">
      {{ $t('visual_tire_calculator_how_to_description') }}
    </h6>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_outer_diameter_of_the_tire')}}  "D"
    </p>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_rim_diameter') }}  "R"
    </p>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_tire_profile_height') }} "H"
    </p>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_tire_width') }} "L"
    </p>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_clearance_change') }}
    </p>
    <p class="ma-tiremeter__how-to--text--item">
      {{ $t('how_to_speedometer_error') }}
    </p>
  </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
