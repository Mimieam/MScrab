
// // sort the set by y
// [{x:2,y:3},{x:4,y:5},{x:6,y:7},{x:5,y:5}].sort(function(a,b){return (a.y >= b.y)?1:-1 });

// // sort the set by x
// [{x:2,y:3},{x:4,y:5},{x:6,y:7},{x:5,y:5}].sort(function(a,b){return (a.x >= b.x)?1:-1 });


// the 2 following functions _checkVertical && _checkHorizontal are to be used with the function Array.every();

// check if the tiles are aligned verically - that is if all x's are the same
function _checkVertical(element, index, array){
  if (index > 0 && element.x != array[index-1].x) {  
    return false;
  }
  return true
}

// check if the tiles are aligned Horizontally - that is if all y's are the same
function _checkHorizontal(element, index, array){
  if (index > 0 && element.y != array[index-1].y) {  
    return false;
  }
  return true
}

/*
  Input: Set array of tiles
  Output: the direction of the equation , horizontal , vertical or null
*/
function getOrientation (Set) {
  if (Set.length == 0)
    return null;
  if( Set.every(_checkHorizontal) == true )
    return "horizontal";
  else if( Set.every(_checkVertical) == true )
    return "vertical";   
  else
    return null;
}

/*
  This function get compare the row or col of each tile and determines he higest and lowerst
  Input : Set array of tiles, and x or y axis depending on orienation
  Output: The first and last tile and the axis of comparison
*/
function _getStartAndEndTiles(Set , orientation){
  if(orientation!="vertical"&&orientation!="horizontal") // should never be the case... but just to be safe^^
    return null;
  var highest = Set[0];
  var lowest   = Set[0];
  var Axis = (orientation[0]=='v' ? 'y' :'x');   // ok i did get lazy here... hey it's 1:25 AM.. well this says: if direction is vertical we check the y's
    // the start of the equation is the lowest end...  most right or bottom ...  ( but in the actuall evaluation it doesn't matter because the parser doesn't care of the direction of the equation only he oriendation) 
  for(var i=1;i<Set.length;i++) {
    lowest   = (Math.min(lowest[Axis] , Set[i][Axis]) == lowest[Axis]  ? lowest  : Set[i] );     //Starting tile
    highest     = (Math.max(highest[Axis], Set[i][Axis]) == highest[Axis] ? highest : Set[i] );  //Ending tile
  }
  return{"Start":lowest,"End":highest,"Axis":Axis};
}

/* Generate the an equation (or rather a list of the used tiles involve in the equation) from a set of tile

  equaion {
   Start   - starting coordinate of an equation
   end     - ending coordinate of an equation
   Axis    - changing component of the coordinate
   otherAxis - non changing component of the cordinate
   orientation - horizontal or vertical
   ActualSet - set of coordinate between Start and End, included.
  }
*/

function genEquation (Set) {
    var equation = {},
        orientation = getOrientation(Set);
    
    if (orientation == null)
      return null;
    
    // get Starting and ending tiles
    var tmp = _getStartAndEndTiles(Set,orientation); 
    equation = tmp;   // get Start , End & Axis from here
    equation.ActualSet = [];
    equation.orientation = orientation;
    var otherAxis = (equation.Axis == 'x')?'y':'x';   // the one whose value do not change in the tiles.

    //get all tiles between Start and End  -  basically we collect the coordinate of each tile to be involve in the evaluation   // this way we can collect innactive tiles and also check them if there are used in the equation.
    var newTile = {};

    for (var i = equation.Start[equation.Axis]; i <= equation.End[equation.Axis]; i++) {
      newTile = {};      //NUKE THE REFERENCE !!!! stupid shallow copy >_<  spent 30 min wondering why all the value where the same in equation.ActualSet --' --> see answer here : http://stackoverflow.com/questions/8660901/do-objects-pushed-into-an-array-in-javascript-deep-or-shallow-copy
      newTile[equation.Axis] = i;
      newTile[otherAxis] = equation.Start[otherAxis]; // Start[otherAxis]  == End[otherAxis] since those tiles are on the same axis.. or orientation
      equation.ActualSet.push(newTile); 
    };
    equation.otherAxis = otherAxis;
    return equation;
}

// TEST _getStartAndEndTiles
_getStartAndEndTiles([{x:2,y:5},{x:4,y:5},{x:6,y:5},{x:5,y:5}],"horizontal")  ; //  should return ["Start":{x:2,y:5},"End":{x:6,y:5}, Axis: x]
_getStartAndEndTiles([{x:3,y:2},{x:3,y:2},{x:3,y:2},{x:3,y:5}],"vertical") ;  // should return ["Start":{x:3,y:2},"End":{x:3,y:5}, Axis: y]
_getStartAndEndTiles([{x:3,y:2},{x:3,y:2},{x:3,y:2},{x:3,y:5}],"alksdfjlk") ;  // should return null

//Open your console for dirty testing :)

//TEST _checkVertical
[{x:3,y:2},{x:3,y:2},{x:3,y:2},{x:3,y:5}].every(_checkVertical) ; // should be true
[{x:3,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:5}].every(_checkVertical) ; // should be false

//TEST _checkHorizontal
[{x:2,y:5},{x:4,y:5},{x:6,y:5},{x:5,y:5}].every(_checkHorizontal) ;   // should be true
[{x:2,y:5},{x:4,y:5},{x:6,y:5},{x:5,y:2}].every(_checkHorizontal);   // should be false

// TEST getOrienation
getOrientation([{x:3,y:5},{x:3,y:5},{x:3,y:5},{x:4,y:4}]) ;  // should be null
getOrientation([{x:2,y:5},{x:4,y:5},{x:6,y:5},{x:5,y:5}]) ;  // should be Horizontal
getOrientation([{x:3,y:2},{x:3,y:2},{x:3,y:2},{x:3,y:5}]) ;  // should be vertical
getOrientation([{x:3,y:3},{x:3,y:3},{x:3,y:3},{x:3,y:3}]) ;  // should be horizontal -- > because it's priority( checked first) is given to horizontal equations.. for obvious reasons..  

// TEST genEquation
genEquation([{x:1,y:3},{x:3,y:5},{x:2,y:4}]);;  // should be null
genEquation([{x:1,y:3}])  ;// should be {x:1,y:3}
genEquation([{x:2,y:3},{x:2,y:5}]) ; // should be {x:2,y:3},{x:2,y:4},{x:2,y:5}


/*  !!! - This function efficiency can be altered depending on how the DOM elements are accessed...
  This function will expand an equation to capture all
  used and disabled tile that are connected to the new equation 
  we capture from ]= to Start] && [ End till =[       that is we
  expand to before the starting coordinates until an equal sign 
  is met ( and we don't take the equal sign) or there is no more connected tiles,
  same for the End coordinates.
  Input: Start, End  - obtain from genEquation
  output: newStart, newEnd - expended equation will all tiles connected to it.
  Testing: make use of _getFakeTileState() and global fake Board ^^ 
*/
function _getExtendedStartAndEndTiles(Start, End) {
  if((orientation = getOrientation([Start,End])) == null){
    console.log("Wrong orientation... no diagonal equation allowed as of now... sorry")
    return null
  }
  
  var newStart = Start,
    newEnd = End,
    totalEquals = 0;
    newStart.type = "Start";
    newEnd.type = "End";

  //get find new Start / End coordinate

  [newStart, newEnd].forEach(function(T){ 
    var inc = T.type == "Start"? -1 : 1;   // if Start then get element before, else get element after tile T
    console.log(T.type + " began");
    var tile = {
      x: (orientation == "horizontal") ? T.x + inc : T.x,
      y: (orientation == "vertical")   ? T.y + inc : T.y
    };
    // var res = _getTileState(tile.x,tile.y);   // DOM access to check value of tile.
    var res = _getFakeTileState(tile.x,tile.y,board);   // DOM access to check value of tile.
    
    var tmp = tile;    
    while(res.state == "disabled" && (res.content != '=' || totalEquals != 2)) {
      console.log(res.content+res.state+orientation);
        console.log(tile);
      (T.type == "Start") ? newStart = tile : newEnd = tile;
      tmp = tile;
      tile = {};
  
      // increment loop..
      inc = T.type == "Start"? -1 : 1;
      tile = { 
        x: (orientation == "horizontal") ? tmp.x + inc : tmp.x,
        y: (orientation == "vertical")   ? tmp.y + inc : tmp.y
      };
      if (res.content == '=') totalEquals++;
      // res = _getTileState(tile.x,tile.y); 
      res = _getFakeTileState(tile.x,tile.y,board); 
    }
    console.log(T.type + " ended");
  });
  var Axis = (orientation[0]=='v' ? 'y' :'x');
  return{"Start":newStart,"End":newEnd,"Axis":Axis};
}
/*
  return state of a tile on a board.
*/
function _getTileState(x,y) {
  //TODO: find tile in DOM with corresponding x and y
  // var board =  getFakeBoard()
  // for now just randomly return a state  
  var res = {"state": (Math.floor(Math.random()*2) == 0) ? null : "disabled" ,  "content":(Math.floor(Math.random()*6) == 5) ? 'x' : "="};
  return res;
}

function validate (Set) {
  /*gen primary equation
    extend primary equation 
      if extended !true
        Done - the equation is invalid
      else
        forEach tile in primaryEquation 
          gen secondary equation from the tile
          extend secondary equation
            if extended !true
              Done - the extended { ---} was not valid therefore primary equation is not valid
        when we get here that mean that all secondary are good.
        Equation valid

    return _computePoints([set of all equations])
*/

}

//===================================================4 TESTING ONLY ===================================================================

// ALL THe Following functions are FAKE and used to test _getExtendedStartAndEndTiles()

var board = makeFakeBoard(9, 20);
    getFakeBoard(board);
    // layItAllDown(direction,row,col,"a=b+c",board)
    layItAllDown('vertical',2,3,"2=8-6",board)
    layItAllDown('horizontal',3,0,"2=1+1",board)
    layItAllDown('horizontal',5,7,"2=2",board)
    layItAllDown('vertical',1,0,"2=1+1",board)
    layItAllDown('horizontal',4,0,"23=3-3+3=3",board)
var StartH = {x:3,y:4},
    EndH = {x:4,y:4},
    StartV = {x:4,y:3},
    EndV = {x:4,y:5};
_getExtendedStartAndEndTiles({y:3,x:0},{y:3,x:1});
_getExtendedStartAndEndTiles({y:3,x:0},{y:4,x:1},"horizontal");

function _getFakeTileState(x,y,board) {  
  //x = columns & y = row

  if(board[y] == undefined || board[y][x] == undefined) return {"state": undefined ,  "content": undefined}; 
  var res = {"state": board[y][x].state ,  "content":board[y][x].content};
  return res;
}

/*
  Input: # of rows and #of columns
  Output: a rows*columns , board 

                            BOARD
     0   1   2   3   4   5   6   7   8  
     --|---|---|---|---|---|---|---|--->     X  = col  | 
  0 | 
    - 
  1 |    1   +   2   =   3
    -    
  2 |     
    -     
  3 |     
    - 
  4 |
    - 
  5 |
    - 
  6 |
    - 
  7 |
    -   
  8 |
    v

    Y = row


so {x,y} = {col , row} and NOT {row, col} !!!!!  

I choose to use {row, col} notation  that is ==> {y,x}   - make this so much easier....

*/

function makeFakeBoard (MaxR,MaxC) {
  if(MaxC == undefined) MaxC = MaxR; 
  var board = [];
  for (var r = 0; r < MaxR ; r++) {         // create row first
    var col = [];
    for (var c = 0; c < MaxC ; c++) {       // then columns 
      col.push(
        {
          x:c,
          y:r ,
          state: null,
          content: "."
        }
      );
    };
    board.push(col);
  };
  getFakeBoard(board,'No');
  return board;
}


// this is printing cols in rows...  need to print the transpose to be accurate.
function getFakeBoard (board, noCoordinate) {
  // var board = makeFakeBoard(Max);
  var b = "";
  board.every(function (row, index, array){
  // console.log(row) 
    row.every(function (obj, i, a){
      if(noCoordinate != undefined)
      b+= obj.content+' ';
      else         
      b+='{'+obj.y+','+obj.x+'} '+obj.content+' ';
      // console.log(obj);
      return true;
    });
    b+='\n';
    return true
  });
  console.log(b);
}


function putOnBoard (row,col,_content,board) {
  board[row][col] = {
          x:col,
          y:row ,
          state: "disabled",
          content: _content
        }
}
/*
  lay down an equation on our fake board
  input : orientation, starting row and column, the string to be placed and the board on which t goes on
  return: board
*/
function layItAllDown (orientation, row,col, str,board) {
  while(str!="")
  {
    if(str[0]==' ') 
      str = str.slice(1);   // discard whitespace
    if(orientation[0]=='h'){     // all on same row...
      putOnBoard(row,col,str[0],board);
      col++;
    } else {   // vertical - all on same column
      putOnBoard(row,col,str[0],board);
      row++;
    }
    str = str.slice(1); // first element has been consumed.
  }
  getFakeBoard(board);
}


// {0,0} . {0,1} 2 {0,2} + {0,3} 2 {0,4} = {0,5} 4 {0,6} . {0,7} . {0,8} . 
// {1,0} . {1,1} . {1,2} . {1,3} . {1,4} . {1,5} . {1,6} . {1,7} . {1,8} . 
// {2,0} . {2,1} . {2,2} . {2,3} 2 {2,4} . {2,5} . {2,6} . {2,7} . {2,8} . 
// {3,0} . {3,1} . {3,2} . {3,3} = {3,4} . {3,5} . {3,6} . {3,7} . {3,8} . 
// {4,0} . {4,1} . {4,2} . {4,3} 1 {4,4} . {4,5} . {4,6} . {4,7} . {4,8} . 
// {5,0} . {5,1} . {5,2} . {5,3} + {5,4} . {5,5} . {5,6} . {5,7} . {5,8} . 
// {6,0} . {6,1} . {6,2} . {6,3} 1 {6,4} . {6,5} . {6,6} . {6,7} . {6,8} . 
// {7,0} . {7,1} . {7,2} . {7,3} . {7,4} . {7,5} . {7,6} . {7,7} . {7,8} . 
// {8,0} . {8,1} . {8,2} . {8,3} . {8,4} . {8,5} . {8,6} . {8,7} . {8,8} . 

// FAKE TESTING BOARD Functions




//     console.log(orientation);
//     console.log(tmp);
//       console.log( newTile[primary.Axis] +"=="+ i+ "==" + primary.ActualSet[primary.ActualSet.length-1][primary.Axis] );
//     console.log(primary.ActualSet);

