const myPad = document.getElementById('myPad');
const paper = myPad.getContext('2d');


var point = {};

var curve = [
    [400,200,10],
    [500,100,9],
    [600,100,8],
    [700,200,7]
];

// paper.beginPath();
// paper.moveTo(curve[0][0], curve[0][1]);
// // reference size dependent on the last point on the curve
// paper.lineWidth = curve[3][2];
// paper.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
// paper.stroke();
// paper.closePath();
//
//
// var curve = [
//     [400,0,10],
//     [500,-100,9],
//     [600,-100,8],
//     [700, 0,7]
// ];

paper.beginPath();
paper.lineWidth = 10;

paper.moveTo(curve[0][0], curve[0][1]);
// reference size dependent on the last point on the curve
var c1, d1, c2, d2;
c1 = (curve[1][0] + curve[2][0]) / 2;
d1 = (curve[1][1] + curve[2][1]) / 2;
paper.quadraticCurveTo(curve[1][0], curve[1][1], c1, d1);

paper.stroke();
paper.closePath();


paper.beginPath();
paper.lineWidth = 15;
paper.moveTo(c1, d1);
c2 = (curve[2][0] + curve[3][0]) / 2;
d2 = (curve[2][1] + curve[3][1]) / 2;
paper.quadraticCurveTo(curve[2][0], curve[2][1], c2, d2);


paper.quadraticCurveTo(c2, d2, curve[3][0], curve[3][1]);

paper.stroke();
paper.closePath();

// LINE TO METHOD

var curve = [
    [50,200,10],
    [150,100,9],
    [250,100,8],
    [350,200,7]
];


paper.beginPath();
paper.moveTo(curve[0][0], curve[0][1]);
// reference size dependent on the last point on the curve
paper.lineWidth = curve[3][2];
paper.lineTo(curve[1][0], curve[1][1]);
paper.stroke();
paper.closePath();

paper.beginPath();
paper.moveTo(curve[1][0], curve[1][1]);
// reference size dependent on the last point on the curve
paper.lineWidth = curve[3][2];
paper.lineTo(curve[2][0], curve[2][1]);
paper.stroke();
paper.closePath();

paper.beginPath();
paper.moveTo(curve[2][0], curve[2][1]);
// reference size dependent on the last point on the curve
paper.lineWidth = curve[3][2];
paper.lineTo(curve[3][0], curve[3][1]);
paper.stroke();
paper.closePath();






// paper.beginPath();
// paper.moveTo(curve[0][0], curve[0][1]);
//
// for (var i = 1; i < curve.length - 2; i++) {
//
//
//
//     var c = (curve[i][0] + curve[i + 1][0]) / 2;
//     var d = (curve[i][1] + curve[i + 1][1]) / 2;
//     paper.lineWidth = curve[i][2];
//     paper.quadraticCurveTo(curve[i][0], curve[i][1], c, d);
//     paper.stroke();
//     paper.closePath();
//     paper.beginPath();
//     paper.moveTo(curve[i][0], curve[i][1]);
//
// }
//
// // For the last 2 points
// paper.lineWidth = curve[i].s;
// paper.quadraticCurveTo(
//     curve[i][0],
//     curve[i][1],
//     curve[i + 1][0],
//     curve[i + 1][1]
// );
// paper.stroke();
// paper.closePath();
