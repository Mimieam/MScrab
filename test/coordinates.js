'use strict';

/*
Coordinate system

ScreenPoint = device point Coordinate
Coordinate = game world Coordinate

Map - world map  - uses coordinates relative to the tiles
viewport - device - uses pixel points

*/

var TILE_SIZE = { width: 100, height: 100 }; //px
var SYSTEM_ISO = false; // isomorphic map flag
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 400;
var SCREEN_CENTER = new Coordinate(0, 0); // current world coordinate of the device center, changes as the user moves

var BUFFER_PX = 100;  // pixel offset from the edge of the screen = buffer margin

function Coordinate(x, y) {
  this.xIndex = x;
  this.yIndex = y;
}

Coordinate.prototype.add = function add(p2) {
  var newXIndex = this.xIndex + p2.xIndex;
  var newYIndex = this.yIndex + p2.yIndex;
  return new Coordinate(newXIndex, newYIndex);
};

/* return the screenPoint position of a map coordinate*/
Coordinate.prototype.toPosition = function toPosition() {
  var sp = new ScreenPoint(this.xIndex * TILE_SIZE.width, this.yIndex * TILE_SIZE.height)
  // console.log(sp)
  if (SYSTEM_ISO){
    return new ScreenPoint(sp.x + sp.y, (sp.y - sp.x)/2)
  }
  return sp
}

Coordinate.prototype.isOnScreen = function isOnScreen() {
  var maxDist = {
    width: SCREEN_WIDTH/2 + BUFFER_PX,
    height: SCREEN_HEIGHT/2 + BUFFER_PX
  }

  var screenToWorldCenter = new Coordinate(0, 0); // the map point corresponding to the center of the device screen
  var offset_x = this.xIndex - SCREEN_CENTER.add(screenToWorldCenter).xIndex;
  var offset_y = this.yIndex - SCREEN_CENTER.add(screenToWorldCenter).yIndex;
  var offset = new Coordinate(offset_x, offset_y);

  console.log(screenToWorldCenter, offset.toPosition().x, offset.toPosition().y)

  var dist_x = offset.toPosition().x - screenToWorldCenter.toPosition().x + TILE_SIZE.width / 2;
  var dist_y = offset.toPosition().y - screenToWorldCenter.toPosition().y + TILE_SIZE.height / 2;
  var dist = new ScreenPoint(dist_x, dist_y);

  return Math.abs(dist.x) < maxDist.width && Math.abs(dist.y) < maxDist.height
}


function ScreenPoint (x, y) {
  this.x = x;
  this.y = y;
}


// if (Math.abs(endEv._x - beginEv._x) > viewport.width/4 ){
//     console.log("updated stuff")
//     if (true) {
//         console.log("lastcol = ", lastColIndex)
//         var lastCol = this.getLastColumn(this.board, lastColIndex)
//         firstColIndex += -1
//         lastColIndex += -1
//         lastCol.map(function(tile) {
//             firstColIndex
//             tile.updateRowCol(tile.r, firstColIndex )
//             tile.updateUI()
//         })
//     }
// }

// checks if we are close (withing a threshold) to the edges of the world
function goingToTheWorldsEnd(ev, map, margin) {
  if (ev.x < margin) {
    // going logeft
  } else if (ev.x > map.width - margin) {
    // going right
  }
  if (ev.y < margin) {
    // going up
  } else if (ev.y > map.height - margin) {
    // going down
  }
}

  // func willWrapAroundWorldY(newPos: Coordinate, worldSize: MapSize, threshold: UInt) -> Bool {
  //   return (newPos.y < threshold && self.y >= worldSize.height - threshold) ||
  //     (newPos.y >= worldSize.height - threshold && self.y < threshold)
  // }

  // func willWrapAroundWorld(newPos: Coordinate, worldSize: MapSize, threshold: UInt) -> Bool {
  //   return self.willWrapAroundWorldX(newPos, worldSize: worldSize, threshold: threshold) ||
  //     self.willWrapAroundWorldY(newPos, worldSize: worldSize, threshold: threshold)
  // }

function dragCheck(startEv, endEv) {
  vx = viewport.position.x
  vy = viewport.position.y
  cx = content.position.x
  cy = content.position.y

  deltaX = content.position.x - viewport.position.x
  deltaY = content.position.y - viewport.position.y


}

/* =================TESTING================= */
function test_coordinate_add_function() {
  var p1 = new Coordinate(3,6);
  var p2 = new Coordinate(2,2);
  var p3 = p1.add(p2)
  return p3.xIndex == 5 &&  p3.yIndex == 8
}

function test_coordinate_toPosition_function() {
  var p1 = new Coordinate(3,6);
  TILE_SIZE = { width: 50, height: 50 }; // intentionally override 'global here for testing'
  var sp = p1.toPosition();
  if (SYSTEM_ISO){

    return sp.x == 450 &&  sp.y == 75
  }
  return sp.x == 150 &&  sp.y == 300
}

function test_coordinate_isOnScreen_function() {
  var p1 = new Coordinate(-1, 3);
  return p1.isOnScreen()
}


console.log("***NON ISOMORPHIC TESTS***")
console.log("test_coordinate_add_function =", test_coordinate_add_function())
console.log("test_coordinate_toPosition_function =", test_coordinate_toPosition_function())
console.log("test_coordinate_isOnScreen_function =", test_coordinate_isOnScreen_function())

console.log("\n*** ISOMORPHIC TESTS***", (SYSTEM_ISO = true)?"":"") // changing map type

// console.log("test_coordinate_add_function =", test_coordinate_add_function())
// console.log("test_coordinate_toPosition_function =", test_coordinate_toPosition_function())


