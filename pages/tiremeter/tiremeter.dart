double f = (oldWidth * oldProfile / 100).roundToDouble() / 10;
double g = (newWidth * newProfile / 100).roundToDouble() / 10;
double b = (25.4 * oldRadius + oldWidth * oldProfile * 2 / 100).roundToDouble() / 10;
double c = (25.4 * newRadius + newWidth * newProfile * 2 / 100).roundToDouble() / 10;
double h = (25.4 * oldRadius).roundToDouble() / 10;
double k = (25.4 * newRadius).roundToDouble() / 10;

double oldA = oldWidth;
double oldB = 10 * f;
double oldC = 10 * h;
double oldD = 10 * b;
double newA = newWidth;
double newB = 10 * g;
double newC = 10 * k;
double newD = 10 * c;



double diffA = (oldWidth - newWidth).roundToDouble();
double diffB = (10 * (f - g)).roundToDouble();
double diffC = (10 * (h - k)).roundToDouble();
double diffD = (10 * (b - c)).roundToDouble();