var oldWidth = widthValues.elementAt(oldWidthIndex);
var oldProfile = profileValues.elementAt(oldProfileIndex);
var oldRadius = radiusValues.elementAt(oldRadiusIndex);
var newWidth = widthValues.elementAt(newWidthIndex);
var newProfile = profileValues.elementAt(newProfileIndex);
var newRadius = radiusValues.elementAt(newRadiusIndex);

var oldA = oldWidth;
var newA = newWidth;
var diffA = newA - oldA;

// var oldC = (oldRadius * 25.4).roundToDouble();
// var newC = (newRadius * 25.4).roundToDouble();
// var diffC = newC - oldC;

// var oldD = (oldWidth * oldProfile * 0.02 + oldRadius * 25.4).roundToDouble();
// var newD = (newWidth * newProfile * 0.02 + newRadius * 25.4).roundToDouble();
// var diffD = newD - oldD;
  
// var oldB = ((oldD - oldC) / 2).roundToDouble();
// var newB = ((newD - newC) / 2).roundToDouble();
// var diffB = newB - oldB;

// var clearance = ((newWidth * newProfile * 0.02 + newRadius * 25.4).roundToDouble() - (oldWidth * oldProfile * 0.02 + oldRadius * 25.4).roundToDouble()) / 2;

// var oldSpeed = 100;
// var newSpeed = (((newWidth * newProfile * 0.02 + newRadius * 25.4).roundToDouble() / (oldWidth * oldProfile * 0.02 + oldRadius * 25.4).roundToDouble()) * oldSpeed * 100) / 100;
// var speed = (((newSpeed - oldSpeed) * 100).roundToDouble() / 100).round();

var f = oldB / 10;
var g = newB / 10;
var c = (25.4 * newRadius + newWidth * newProfile * 2 / 100).roundToDouble() / 10;
var b = (25.4 * oldRadius + oldWidth * oldProfile * 2 / 100).roundToDouble() / 10;

List<TireSizeChangesModel> d = [];
List<TireSizeChangesModel> h = [];
List<TireSizeChangesModel> l = [];

if (g > f) {
  h = c1;
}
//
else if (f > g) {
  h = c2;
}

if (c > b) {
  d = a1(speed);
}
//
else if (b > c) {
  d = a2(speed);
}

if (oldWidth > newWidth) {
  l = d2;
}
//
else if (newWidth > oldWidth) {
  l = d1;
}

var oldValues = TireValuesModel(a: oldA, b: oldB, c: oldC, d: oldD);
var newValues = TireValuesModel(a: newA, b: newB, c: newC, d: newD);
var diffValues = TireValuesModel(a: diffA, b: diffB, c: diffC, d: diffD);

var result = VisualTireResultModel(
  oldValues: oldValues,
  newValues: newValues,
  diffValues: diffValues,
  clearance: clearance,
  speed: speed,
  d: d,
  l: l,
  h: h,
);

List<TireSizeChangesModel> a1(int speedometerErrorPercentage) {
    return [
      TireSizeChangesModel(
        isPositive: true,
        text: 'visual_tire_size_change_result_1',
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_2',
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_3',
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_4'.translate.replaceFirst(r'$PERCENTAGE', '$speedometerErrorPercentage'),
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_5'.translate.replaceFirst(r'$PERCENTAGE', '$speedometerErrorPercentage'),
      ),
    ];
  }

  List<TireSizeChangesModel> a2(int speedometerErrorPercentage) {
    return [
      TireSizeChangesModel(
        isPositive: true,
        text: 'visual_tire_size_change_result_6',
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_7',
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_7'.translate.replaceFirst(r'$PERCENTAGE', '$speedometerErrorPercentage'),
      ),
      TireSizeChangesModel(
        isPositive: false,
        text: 'visual_tire_size_change_result_8'.translate.replaceFirst(r'$PERCENTAGE', '$speedometerErrorPercentage'),
      ),
    ];
  }

  final List<TireSizeChangesModel> c1 = [
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_10',
    ),
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_11',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_12',
    ),
  ];

  final List<TireSizeChangesModel> c2 = [
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_13',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_14',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_15',
    ),
  ];

  final List<TireSizeChangesModel> d1 = [
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_16',
    ),
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_17',
    ),
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_18',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_19',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_20',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_21',
    ),
  ];

  final List<TireSizeChangesModel> d2 = [
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_22',
    ),
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_23',
    ),
    TireSizeChangesModel(
      isPositive: true,
      text: 'visual_tire_size_change_result_24',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_25',
    ),
    TireSizeChangesModel(
      isPositive: false,
      text: 'visual_tire_size_change_result_26',
    ),
  ];