<template>
   <div class="visual-tire-calculator container">
      <div class="row">
         <div class="col-md-12">
            <breadcrumbs :crumbs="crumbs">
               <share-it type="publish" v-if="$route.params.body"/>
            </breadcrumbs>
         </div>
      </div>

      <div class="row" v-if="showInformation">
         <div class="col-md-12 col-xs-12 p-1 pl-lg-1 pr-lg-1">
            <div class="card">
               <div class="row">
                  <div class="col-md-12">
                     <h4 class="card-title small">{{ $t('visual_tire_calculator_how_to_title') }}</h4>
                  </div>
                  <div class="clearfix"></div>
               </div>
               <div class="row mt-3">
                  <div class="col-md-7 info">
                     <p class="mb-3">{{ $t('visual_tire_calculator_how_to_description') }}</p>
                     <p>{{ $t('how_to_outer_diameter_of_the_tire') }} "D"</p>
                     <p>{{ $t('how_to_rim_diameter') }} "R"</p>
                     <p>{{ $t('how_to_tire_profile_height') }} "H"</p>
                     <p>{{ $t('how_to_tire_width') }} "L"</p>
                     <p>{{ $t('how_to_clearance_change') }}</p>
                     <p>{{ $t('how_to_speedometer_error') }}</p>
                  </div>
                  <div class="col-md-5 mt-3 mt-lg-0">
                     <div class="image-box">
                        <svg viewBox="0 0 370 263" fill="none" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" class="back-svg">
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
                                 <use xlink:href="#image0_10097_58869" transform="scale(0.00125)"/>
                              </pattern>
                           </defs>
                        </svg>
                        <div class="image">
                           <img src="/tiremeter/tire-left-large.png" alt="."/>
                        </div>
                     </div>
                  </div>
                  <div class="clearfix"></div>
               </div>
            </div>
         </div>
      </div>

      <div class="row">
         <div class="col-md-5 col-xs-12 p-1 pl-lg-1 pr-lg-1">
            <div class="card">
               <div class="row">
                  <div class="col-md-12">
                     <h4 class="card-title">{{ $t('visual_tire_calculator') }}</h4>
                  </div>
               </div>
               <div class="row mt-3">
                  <div class="col-md-12">
                     <div class="form-group">
                        <label>{{ $t('size_of_old_tire') }}</label>
                        <div class="row mt-1">
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.tireWidth.old"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="tireWidth"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.profile.old"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="profileWidth"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.radius.old"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="radiusOptions"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="row mt-3">
                  <div class="col-md-12">
                     <div class="form-group">
                        <label>{{ $t('size_of_new_tire') }}</label>
                        <div class="row mt-1">
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.tireWidth.new"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="tireWidth"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.profile.new"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="profileWidth"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                           <div class="col-md-4">
                              <form-select
                                 v-model="form.radius.new"
                                 :allowClear="false"
                                 :clearOption="false"
                                 :options="radiusOptions"
                                 :new-label="false"
                                 class="mb-2 mb-lg-0"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="row mt-5">
                  <div class="col-md-12">
                     <div class="form-group">
                        <button class="btn btn--green full-width" @click="submit()">
                           {{ $t('calculate') }}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="col-md-7 col-xs-12 p-1 pl-lg-1 pr-lg-1">
            <div class="card">
               <div class="row mb-2">
                  <div class="col-md-12">
                     <tires
                        :newDiscDiameter="newDiscDiameter / 10"
                        :newExternalDiameter="newExternalDiameter"
                        :newProfileHeight="newProfileHeight"
                        :newTireWidth="form.tireWidth.new / 10"
                        :oldDiscDiameter="oldDiscDiameter / 10"
                        :oldExternalDiameter="oldExternalDiameter"
                        :oldProfileHeight="oldProfileHeight"
                        :oldTireWidth="form.tireWidth.old / 10"
                     ></tires>
                  </div>
                  <div class="clearfix"></div>
               </div>
               <div class="row mt-5">
                  <div class="col-md-6 mt-2">
                     <div class="mini-card">
                        <div class="mini-card-icon">
                           <img src="/tiremeter/speedometer.png" alt="" />
                        </div>
                        <div class="mini-card-content">
                           <p class="mini-card-content-title">{{ $t('speedometer_error_percentage') }}</p>
                           <p class="mini-card-content-result">
                              <template v-if="(speedometerErrorPercentage * -1) > 0">+</template>{{speedometerErrorPercentage * -1}} %
                           </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-6 mt-2">
                     <div class="mini-card">
                        <div class="mini-card-icon">
                           <img src="/tiremeter/car2.png" alt="" />
                        </div>
                        <div class="mini-card-content">
                           <p class="mini-card-content-title">{{ $t('clearance_change') }}</p>
                           <p class="mini-card-content-result">
                              <template v-if="(clearanceChange / 10) > 0"> + </template> {{ (clearanceChange / 10) }} {{ $t('cm') }}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="row mb-3" id="resultTiremeter" v-if="showResults">
         <div class="col-md-12 col-xs-12 p-1 pl-lg-1 pr-lg-1">
            <div class="card">
               <div class="row">
                  <div class="col-md-12">
                     <h4 class="card-title medium">{{ $t('result_of_calculation') }}</h4>
                  </div>
               </div>
               <div class="row mt-3">
                  <div class="col-md-12">
                     <table class="table table-bordered">
                        <thead>
                        <tr>
                           <th>{{ $t('dimensions_tire') }}</th>
                           <th>{{ $t('previous_version') }}</th>
                           <th>{{ $t('new_1') }}</th>
                           <th>{{ $t('change_noun') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                           <td>{{ $t('width_of_tire') }}</td>
                           <td>{{ form.tireWidth.old }} {{ $t('char_millimetre') }}</td>
                           <td>{{ form.tireWidth.new }} {{ $t('char_millimetre') }}</td>
                           <td>
                              {{ form.tireWidth.old - form.tireWidth.new }}
                              {{ $t('char_millimetre') }}
                           </td>
                        </tr>
                        <tr>
                           <td>{{ $t('height_of_profile') }}</td>
                           <td>
                              {{ oldProfileHeight * 10 }}
                              {{ $t('char_millimetre') }}
                           </td>
                           <td>
                              {{ newProfileHeight * 10 }}
                              {{ $t('char_millimetre') }}
                           </td>
                           <td>
                              {{ profileHeightDifference }}
                              {{ $t('char_millimetre') }}
                           </td>
                        </tr>
                        <tr>
                           <td>{{ $t('disc_diameter') }}</td>
                           <td>{{ oldDiscDiameter }} {{ $t('char_millimetre') }}</td>
                           <td>{{ newDiscDiameter }} {{ $t('char_millimetre') }}</td>
                           <td>
                              {{ oldDiscDiameter - newDiscDiameter }}
                              {{ $t('char_millimetre') }}
                           </td>
                        </tr>
                        <tr>
                           <td>{{ $t('external_diameter_of_tire') }}</td>
                           <td>
                              {{ oldExternalDiameter * 10 }}
                              {{ $t('char_millimetre') }}
                           </td>
                           <td>
                              {{ newExternalDiameter * 10 }}
                              {{ $t('char_millimetre') }}
                           </td>
                           <td>
                              {{ externalDiameterDifference }}
                              {{ $t('char_millimetre') }}
                           </td>
                        </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
               <div class="row mt-5" v-if="lists.d.length || lists.h.length || lists.l.length">
                  <div class="col-md-12">
                     <h4 class="card-title medium">{{ $t('result_of_tire_size_change') }}</h4>
                  </div>
               </div>
               <div class="row mt-3">
                  <div class="col-md-12">
                     <div class="row">
                        <div class="col-md-4 col-xs-12" v-if="lists.d.length">
                           <h5 class="result-title mt-3 mt-lg-0">
                              <span class="result-title-inner">
                                 <template v-if="lists.increase.d">
                                    {{$t('result_of_tire_size_change_title_1').replace('INCREASE', $t('will_increase')) }}
                                 </template>
                                 <template v-else>
                                    {{$t('result_of_tire_size_change_title_1').replace('INCREASE', $t('will_diminish')) }}
                                 </template>
                                 <span class="ma-tiremeter__results-text--title-d">"D"</span>
                                 <template v-if="lists.increase.d">
                                    {{$t('result_of_tire_size_change_title_2').replace('INCREASE', $t('will_increase')) }}
                                 </template>
                                 <template v-else>
                                    {{$t('result_of_tire_size_change_title_2').replace('INCREASE', $t('will_diminish')) }}
                                 </template>
                              </span>
                           </h5>
                           <ul class="result-list">
                              <li v-for="(item, index) in lists.d" :key="index + 5465">
                                 <div class="result-list-icon">
                                    <inline-svg :src="'/icons/check5.svg'" :size="22" v-if="item.isPositive"/>
                                    <inline-svg :src="'/icons/uncheck5.svg'" :size="22" v-else/>
                                 </div>
                                 <div class="result-list-content">
                                    {{$t(item.text).replace('PERCENTAGE', `${Math.abs(errorPercentage)}%`) }}
                                 </div>
                              </li>
                           </ul>
                        </div>
                        <div class="col-md-4 col-xs-12" v-if="lists.h.length">
                           <h5 class="result-title mt-3 mt-lg-0">
                              <span class="result-title-inner">
                                 <template v-if="lists.increase.h">
                                    {{$t('result_of_tire_size_change_h').replace('INCREASE', $t('will_increase')) }}
                                 </template>
                                 <template v-else>
                                    {{$t('result_of_tire_size_change_h').replace('INCREASE', $t('will_diminish')) }}
                                 </template>
                                 <span class="ma-tiremeter__results-text--title-h">"H"</span>
                              </span>
                           </h5>
                           <ul class="result-list">
                              <li v-for="(item, index) in lists.h" :key="index + 5465">
                                 <div class="result-list-icon">
                                    <inline-svg :src="'/icons/check5.svg'" :size="22" v-if="item.isPositive"/>
                                    <inline-svg :src="'/icons/uncheck5.svg'" :size="22" v-else/>
                                 </div>
                                 <div class="result-list-content">
                                    {{ $t(item.text) }}
                                 </div>
                              </li>
                           </ul>
                        </div>
                        <div class="col-md-4 col-xs-12" v-if="lists.l.length">
                           <h5 class="result-title mt-3 mt-lg-0">
                              <span class="result-title-inner">
                                 <template v-if="lists.increase.l">
                                    {{$t('result_of_tire_size_change_l').replace('INCREASE', $t('will_increase')) }}
                                 </template>
                                 <template v-else>
                                    {{$t('result_of_tire_size_change_l').replace('INCREASE', $t('will_diminish')) }}
                                 </template>
                                 <span class="ma-tiremeter__results-text--title-l">"L"</span>
                              </span>
                           </h5>
                           <ul class="result-list">
                              <li v-for="(item, index) in lists.l" :key="index + 5465">
                                 <div class="result-list-icon">
                                    <inline-svg :src="'/icons/check5.svg'" :size="22" v-if="item.isPositive"/>
                                    <inline-svg :src="'/icons/uncheck5.svg'" :size="22" v-else/>
                                 </div>
                                 <div class="result-list-content">
                                    {{ $t(item.text) }}
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </div>
</template>

<script>
import Tires from '~/components/tiremeter/tires.vue'
import Speedometer from '~/components/tiremeter/speedometer.vue'
import Clearance from '~/components/tiremeter/clearance.vue'
import TextResults from '~/components/tiremeter/textResults.vue'
import HowTo from '~/components/tiremeter/howTo.vue'

export default {
   components: {
      Tires,
      Speedometer,
      Clearance,
      TextResults,
      HowTo,
   },
   head() {
      return this.$headMeta({
         title: this.$t('visual_tire_calculator'),
      })
   },
   data() {
      return {
         showResults: false,
         showTextResults: false,
         showInformation: true,
         tireWidth: [
            {
               name: '30',
               key: 30,
            },
            {
               name: '31',
               key: 31,
            },
            {
               name: '32',
               key: 32,
            },
            {
               name: '33',
               key: 33,
            },
            {
               name: '125',
               key: 125,
            },
            {
               name: '135',
               key: 135,
            },
            {
               name: '145',
               key: 145,
            },
            {
               name: '155',
               key: 155,
            },
            {
               name: '165',
               key: 165,
            },
            {
               name: '175',
               key: 175,
            },
            {
               name: '185',
               key: 185,
            },
            {
               name: '195',
               key: 195,
            },
            {
               name: '205',
               key: 205,
            },
            {
               name: '215',
               key: 215,
            },
            {
               name: '225',
               key: 225,
            },
            {
               name: '235',
               key: 235,
            },
            {
               name: '245',
               key: 245,
            },
            {
               name: '255',
               key: 255,
            },
            {
               name: '265',
               key: 265,
            },
            {
               name: '275',
               key: 275,
            },
            {
               name: '280',
               key: 280,
            },
            {
               name: '285',
               key: 285,
            },
            {
               name: '295',
               key: 295,
            },
            {
               name: '305',
               key: 305,
            },
            {
               name: '315',
               key: 315,
            },
            {
               name: '325',
               key: 325,
            },
            {
               name: '335',
               key: 335,
            },
            {
               name: '345',
               key: 345,
            },
            {
               name: '365',
               key: 365,
            },
            {
               name: '385',
               key: 385,
            },
            {
               name: '425',
               key: 425,
            },
            {
               name: '435',
               key: 435,
            },
            {
               name: '445',
               key: 445,
            },
         ],
         profileWidth: [
            {
               name: '9',
               key: 9,
            },
            {
               name: '9.5',
               key: 9.5,
            },
            {
               name: '10',
               key: 10,
            },
            {
               name: '11',
               key: 11,
            },
            {
               name: '12',
               key: 12,
            },
            {
               name: '25',
               key: 25,
            },
            {
               name: '30',
               key: 30,
            },
            {
               name: '35',
               key: 35,
            },
            {
               name: '40',
               key: 40,
            },
            {
               name: '45',
               key: 45,
            },
            {
               name: '50',
               key: 50,
            },
            {
               name: '55',
               key: 55,
            },
            {
               name: '60',
               key: 60,
            },
            {
               name: '65',
               key: 65,
            },
            {
               name: '70',
               key: 70,
            },
            {
               name: '75',
               key: 75,
            },
            {
               name: '80',
               key: 80,
            },
            {
               name: '85',
               key: 85,
            },
            {
               name: '90',
               key: 90,
            },
         ],
         radiusOptions: [
            {key: 12, name: 'R12'},
            {key: 13, name: 'R13'},
            {key: 14, name: 'R14'},
            {key: 15, name: 'R15'},
            {key: 16, name: 'R16'},
            {key: 17, name: 'R17'},
            {key: 17.5, name: 'R17.5'},
            {key: 18, name: 'R18'},
            {key: 19, name: 'R19'},
            {key: 19.5, name: 'R19.5'},
            {key: 20, name: 'R20'},
            {key: 21, name: 'R21'},
            {key: 22, name: 'R22'},
            {key: 22.5, name: 'R22.5'},
            {key: 24, name: 'R24'},
         ],
         results: {
            table: {
               tireWidth: {
                  old: null,
                  new: null,
                  difference: null,
               },
               profileHeight: {
                  old: null,
                  new: null,
                  difference: null,
               },
               discDiameter: {
                  old: null,
                  new: null,
                  difference: null,
               },
               externalDiameter: {
                  old: null,
                  new: null,
                  difference: null,
               },
            },
         },
         oldSpeed: 100,
         form: {
            secondHeight: null,
            length: null,
            diameter: {
               old: null,
               new: null,
            },
            tireWidth: {
               old: 165,
               new: 165,
            },
            profile: {
               old: 70,
               new: 70,
            },
            radius: {
               old: 13,
               new: 13,
            },
            old: {
               radius: null,
            },
         },
         lists: {
            d: [],
            h: [],
            l: [],
            increase: {
               d: false,
               h: false,
               l: false,
            },
         },
         tiremeterModels: {
            a1: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_1',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_2',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_3',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_4',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_5',
               },
            ],
            a2: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_6',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_7',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_8',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_9',
               },
            ],
            c1: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_10',
               },
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_11',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_12',
               },
            ],

            c2: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_13',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_14',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_15',
               },
            ],

            d1: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_16',
               },
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_17',
               },
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_18',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_19',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_20',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_21',
               },
            ],

            d2: [
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_22',
               },
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_23',
               },
               {
                  isPositive: true,
                  text: 'visual_tire_size_change_result_24',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_25',
               },
               {
                  isPositive: false,
                  text: 'visual_tire_size_change_result_26',
               },
            ],
         },
         speedometerErrorPercentageForTextResults: null,
      }
   },
   computed: {
      crumbs() {
         return [
            {name: this.$t('eservices2'), route: '/e-services'},
            {name: this.$t('visual_tire_calculator')}
         ]
      },
      isRussian() {
         if (this.$i18n.locale == 'ru') {
            return true
         } else {
            return false
         }
      },
      oldExternalDiameter() {
         return (
            Math.round(
               this.form.tireWidth.old * this.form.profile.old * 0.02 +
               this.form.radius.old * 25.4,
            ) / 10
         )
      },
      newExternalDiameter() {
         return (
            Math.round(
               this.form.tireWidth.new * this.form.profile.new * 0.02 +
               this.form.radius.new * 25.4,
            ) / 10
         )
      },
      externalDiameterDifference() {
         return (
            (Math.round(
                  this.oldExternalDiameter * 10 - this.newExternalDiameter * 10,
               ) /
               10) *
            10
         )
      },

      // C
      oldDiscDiameter() {
         return Math.round(this.form.radius.old * 25.4)
      },
      newDiscDiameter() {
         return Math.round(this.form.radius.new * 25.4)
      },

      // D
      oldD() {
         return Math.round(
            this.oldExternalDiameter * this.oldDiscDiameter * 0.02 +
            this.form.radius.old * 25.4,
         )
      },
      newD() {
         return Math.round(
            this.newExternalDiameter * this.newDiscDiameter * 0.02 +
            this.form.radius.new * 25.4,
         )
      },

      //B
      oldProfileHeight() {
         return (
            Math.round((this.form.tireWidth.old * this.form.profile.old) / 100) / 10
         )
      },
      newProfileHeight() {
         return (
            Math.round((this.form.tireWidth.new * this.form.profile.new) / 100) / 10
         )
      },
      oldB() {
         return this.oldProfileHeight * 10
      },
      newB() {
         return this.newProfileHeight * 10
      },
      profileHeightDifference() {
         return Math.round((this.oldB - this.newB) * 10) / 10
      },

      clearanceChange() {
         return (
            (Math.round(
                  this.form.tireWidth.new * this.form.profile.new * 0.02 +
                  this.form.radius.new * 25.4,
               ) -
               Math.round(
                  this.form.tireWidth.old * this.form.profile.old * 0.02 +
                  this.form.radius.old * 25.4,
               )) /
            2
         )
      },
      newSpeed() {
         return (
            ((Math.round(
                     this.form.tireWidth.new * this.form.profile.new * 0.02 +
                     this.form.radius.new * 25.4,
                  ) /
                  Math.round(
                     this.form.tireWidth.old * this.form.profile.old * 0.02 +
                     this.form.radius.old * 25.4,
                  )) *
               this.oldSpeed *
               100) /
            100
         )
      },
      speedometerErrorPercentage() {
         return Math.round(Math.round((this.newSpeed - this.oldSpeed) * 100) / 100)
      },
   },
   methods: {
      findTextResults() {
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

         if (g > f) {
            this.lists.h = this.tiremeterModels.c1
            this.lists.increase.h = true
         } else if (f > g) {
            this.lists.h = this.tiremeterModels.c2
            this.lists.increase.h = false
         } else {
            this.lists.h = []
         }

         if (c < b) {
            this.lists.d = this.tiremeterModels.a2
            this.lists.increase.d = false
         } else if (c > b) {
            this.lists.d = this.tiremeterModels.a1
            this.lists.increase.d = true
         } else {
            this.lists.d = []
         }

         if (this.form.tireWidth.old > this.form.tireWidth.new) {
            this.lists.l = this.tiremeterModels.d2
            this.lists.increase.l = false
         } else if (this.form.tireWidth.new > this.form.tireWidth.old) {
            this.lists.l = this.tiremeterModels.d1
            this.lists.increase.l = true
         } else {
            this.lists.l = []
         }
      },
      async submit() {
         await this.findTextResults()
         this.showInformation = false;
         this.showResults = true;

         this.speedometerErrorPercentageForTextResults = this.speedometerErrorPercentage
         if (this.isMobileBreakpoint) {
            setTimeout(() => {
               const el = document.querySelector('#resultTiremeter')
               el.scrollIntoView({block: 'start', behavior: 'smooth'})
            }, 500)
         } else {
            setTimeout(() => {
               const el = document.querySelector('#resultTiremeter')
               el.scrollIntoView({block: 'start', behavior: 'smooth'})
               window.scrollTo({top: 560, behavior: 'smooth'})
            }, 500)
         }

         if (
            !this.lists.d.length &&
            !this.lists.h.length &&
            !this.lists.l.length &&
            this.speedometerErrorPercentage == 0
         ) {
            this.showTextResults = false
         } else {
            this.showTextResults = true
         }
      },
   },
   watch: {
      form: {
         deep: true,
         handler() {
            this.showResults = false;
            this.showTextResults = false;
         },
      },
   },
}
</script>


<style lang="scss" scoped>
.mini-card{
   width: 100%;
   height: 80px;
   padding: 16px;
   border-radius: 12px;
   gap: 12px;
   background: #EEF2F6;
   display: flex;
   justify-content: space-between;
   align-items: center;
}
.mini-card-icon{
   width: 48px;
   height: 48px;
   display: flex;
   justify-content: center;
   align-items: center;
}
.mini-card-icon img{
   width: 48px;
   height: 48px;
   object-fit: cover;
   object-position: center right;
}
.mini-card-content{
   height: 48px;
   width: 100%;
}
.mini-card-content p{
   padding: 0;
   margin: 0;
}
.mini-card-content-title{
   font-size: 14px;
   font-weight: 400;
   line-height: 16px;
   letter-spacing: 0;
   text-align: left;
   color: #364152;
}
.mini-card-content-result{
   font-size: 18px;
   font-weight: 500;
   line-height: 22px;
   letter-spacing: 0;
   text-align: left;
   color: #121926;
   margin-top: 13px!important;
}

.card {
   padding: 32px;
   min-height: 425px;
}

.card-title {
   font-size: 28px;
   font-weight: 700;
   line-height: 32px;
   letter-spacing: 0;
   text-align: left;
}

.card-title.small {
   font-size: 24px;
   font-weight: 600;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;
}

.card-title.medium {
   font-size: 24px;
   font-weight: 600;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;
}

.image-box {
   height: 262px;
   padding-bottom: 19px;
   padding-left: 16px;
   position: relative;
}

.image {
   bottom: 0;
   height: 77%;
   left: -86px;
   position: absolute;
   width: 100%;
   z-index: 1;
}

.image img {
   height: 100%;
   -o-object-fit: contain;
   object-fit: contain;
   width: 100%;
}

.back-svg {
   bottom: 0;
   height: 100%;
   left: 0;
   position: absolute;
   width: 100%;
   z-index: 2;
}

.info p {
   font-size: 18px;
   font-weight: 400;
   line-height: 38px;
   letter-spacing: 0em;
   text-align: left;
}

.info p:first-child {
   line-height: 20px;
}

.table {
   border-collapse: separate;
   border: solid #CDD5DF 1px;
   border-radius: 12px;
   width: 100%;
}

.table td, .table th {
   border-top: 1px solid #CDD5DF;
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   text-align: left;
   padding: 24px;
}

.table thead tr th:first-child,
.table tbody tr td:first-child {
   width: 66%;
}

.table td:last-child, .table th:last-child {
   text-align: right;
}

.table th {
   border-top: none;
}

.table td:first-child, .table th:first-child {
   border-left: none;
}

.result-title{
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   height: 60px;
   display: flex;
   justify-content: start;
   align-items: center;
   border-bottom: 1px solid #eee;
   text-align: left;
   margin-bottom: 20px;
}
.result-list{
   padding: 0;
   margin: 0;
}
.result-list li{
   display: flex;
   justify-content: start;
   align-items: center;
   padding: 10px 0;
   border-bottom: 1px solid #eee;
   min-height: 70px;
}
.result-list-content{
   font-size: 16px;
   font-weight: 400;
   line-height: 20px;
   letter-spacing: 0;
   text-align: left;
   color: #1B2434;
}
.result-list li svg{
   margin-right: 15px;
   width: 22px;
   height: 22px;
   object-fit: contain;
}
.dark-mode {
   .back-svg path {
      stroke: #fff;
   }

   table {
      border-collapse: separate;
      border: 1px solid #364152;
      border-radius: 12px;
      width: 100%;
      background: #1B2434;
   }

   .table td, .table th {
      border-top: 1px solid #364152;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0;
      text-align: left;
      color: #CDD5DF;
   }

   .table td:last-child, .table th:last-child {
      text-align: right;
   }

   .table th {
      border-top: none;
   }

   .table td:first-child, .table th:first-child {
      border-left: none;
   }
   .result-title{
      border-bottom: 1px solid #364152;
   }
   .result-list-content{
      color: #CDD5DF;
   }
   .result-list li{
      border-bottom: 1px solid #364152;
   }
   .mini-card {
      background-color: #121926;
   }
   .mini-card-content-title{
      color: #CDD5DF;
   }
   .mini-card-content-result{
      color: #CDD5DF;
   }
}


@media (max-width: 1250px) {
   .table tbody td, .table thead th {
      padding: 12px;
      font-size: 12px;
   }
   .table thead tr th:first-child,
   .table tbody tr td:first-child {
      width: auto;
   }
}

@media (max-width: 1150px) {
}

@media (max-width: 992px) {
   .table tbody td, .table thead th {
      padding: 12px;
      font-size: 12px;
   }
   .table thead tr th:first-child,
   .table tbody tr td:first-child {
      width: auto;
   }
}

@media (max-width: 768px) {
   .info p {
      font-size: 15px;
      line-height: 22px;
   }
   .card-title.small {
      font-size: 20px;
      line-height: 24px;
   }
   .card-title.medium {
      font-size: 20px;
      line-height: 24px;
   }
   .table tbody td, .table thead th {
      padding: 12px;
      font-size: 12px;
   }
   .table thead tr th:first-child,
   .table tbody tr td:first-child {
      width: auto;
   }
}

@media (max-width: 540px) {
}

@media (max-width: 422px) {

}
</style>
