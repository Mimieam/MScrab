'use strict'
/**
 * Infinite tile map ADT
 * inifite map uses an internal matrix board of indices.
 * each entry is a tile with 2 sets of coordinates - the viewport coordinates
 * and the world coordinates - all coordinate refers to indices of rows and cols
 * Terminologies:
 *   viewport Map = Visible part of the map defined by the Device Screen
 *   World Map = the entire map of the game
 *
 * Even handling must be implemented by the dev :) we will not be messing with that here
 *
 * 
 *  for mini map- https://pmlomb.wordpress.com/2022/10/23/code-an-infinite-grid/
 *   */


function _Tile(r, c, vp_map_w, vp_map_h, tile_w, tile_h, status, UI) {
    this.r = r,
    this.c = c,
    this.x = c*tile_w - Math.ceil(vp_map_w/2),
    this.y = r*tile_h - Math.ceil(vp_map_h/2),
    this.id = "" + r + "x" + c,
    this.status = "free",
    this.content = this.id

    this.updateRowCol = function updateRowCol(r, c){
        this.r = r
        this.c = c
        this.x = c * tile_w - Math.ceil(vp_map_w/2)
        this.y = r * tile_h - Math.ceil(vp_map_h/2)
        this.id = "" + r + "x" + c
        this.content = this.id
        this._updateUI()
        return this
    },
    this._updateUI = function updateUI (){
        // this function manipulates the dom element
        // UPDATE the UI tile
        var label = this.UINode.getComponentInChildren(cc.Label);
        label.string = this.id;
        // console.log(this.id)
        this.UINode.setPosition(cc.p(this.x, this.y));
        return this
    },
    this._generateTileUI = UI.generateNewTile

    this.inspect = function(){ return this.id; }
    this.UINode = this._generateTileUI(this.x, this.y, this.content, UI); // UI representation of a tile, this will depend on the underlying rendering scheme ( divs, canvas ??)
    return this
}

function MapUIProxy(UI) {
    return UI
}

function _Map ( width, height, buffer, UI) {
    /* Internal properties
      these should not be accessed directly.*/
    this._board = [];
    this._board.inspect =  function(){ return utils_printBoard(this) }
    this._homeXY = [0,0];  // current location on the world map - this will be mapped to the 0,0 of the viewport
    this.margin = buffer;
    this.evHandlers = []
    this.UI = MapUIProxy(UI);
    this._activeTileTable = {
      /* "worldRol, worldCol" = {someStatus+Info}*/
    } // a hashmap of occupied tiles - usefull if we are setting up tile which fall off the viewport
    /* external properties */
    this.viewport = {
        w: width,
        h: height,
        MaxR: 0,
        MaxC: 0,
    };

    // this is the loaded world map
    this.worldMap = {
        w: width + this.margin * 2,
        h: height + this.margin * 2,

        firstRowIdx: 0,
        firstColIdx: 0,

        lastRowIdx: 0,
        lastColIdx: 0,
    }

    this.tileInfo = {
      w: 0,
      h: 0,
    };


    this.init = function init() {
        var vp_map_w = this.viewport.w,
            vp_map_h = this.viewport.h,
            tile_w = this.tileInfo.w,
            tile_h = this.tileInfo.h;

        for (var r = 0; r < this.viewport.MaxR ; r++) { // create row first
            var row = [];
            for (var c = 0; c < this.viewport.MaxC ; c++) {       // then columns
                var tile = new _Tile(r, c, vp_map_w, vp_map_h, tile_w, tile_h, "", this.UI)
                row.push(tile);
            }
            this._board.push(row);
        }
        return this
    }

    this._initViewport = function _initViewport() {
        this.viewport.MaxC = Math.ceil((this.viewport.w + this.margin * 2) / this.tileInfo.w)
        this.viewport.MaxR = Math.ceil((this.viewport.h + this.margin * 2) / this.tileInfo.h)

        this.worldMap.lastRowIdx = this.viewport.MaxR - 1
        this.worldMap.lastColIdx = this.viewport.MaxC - 1

        return this
    }

    this.bindEventHandlers = function setupEventHandlers() {
        for (handler in this.evHandlers){
          this.evHandlers[handler]()
        }
    }

    /* setters */
    this.setHomeLocation = function setHomeLocation(x,y) {
        this._homeXY = [x,y];
        return this;
    }

    this.setTileSize = function setTileSize(w, h) {
        // guard against tile of w & h 0 -_-
        this.tileInfo.w = w < 1? 1: w ;
        this.tileInfo.h = h < 1? 1: h ;
        this._initViewport();
        return this;
    }

    this.setMapBufferingMargin = function setMapBufferingMargin(bufferSize) {
        this.margin = bufferSize
        return this;
    }

    this.setUIComponent = function setUIComponent(UI) {
        this.UI = UI
        return this;
    }

    this.setWorldMap =  function setWorldMap (w, h, buffer){
        this.margin = buffer;
        this.worldMap.w = w;
        this.worldMap.h = h;
        return this;
    }

    /* getters */
    this.get = function () {
        return this._board
    }

    /**
     * hey hey hey, hmm This little function is actually one of the most important.
     * It gets the column ( and in particular the first and last columns) corresponding to
     * the viewport sliding accross the world Map.
     * The colIdx a the world Map Index ( c ) so it can be of any value -infi to infi i.e : -6493
     * this function converts the worldColIdx into its corresponding viewportColIdx and will use this "viewport column"
     * to extend the board and contain information about this worldColIdx ( so as we slide the viewport across the world
     * the same vp column will be used for different world column)
     * the same login will apply to the getRow fct :)
     * now get some cheese and GET BACK TO WORK !
     */
    this.getColumn = function(colIdx){
        var that = this
        var vpColIdx = ( colIdx + this._board[0].length ) % this._board[0].length
        var transposeMatrix =  this._board[0].map(function(row, i) {
          return that._board.map(function(col) {
            return col[i]
          })
        });
        console.log("Infi Map >> " + colIdx, " = ", vpColIdx )
        return transposeMatrix[vpColIdx];
    }

    /* helpers */
    this.viewportToWorldCoodinate = function viewportToWorldCoodinate(r, c) {
        this.viewport.w
        return [r, c]
    }


    function utils_printBoard(_board, noCoordinate) {
          var b = "";
          var colHeader = [];
          _board.every(function (row, index, array){
            b += index + " | "
            row.every(function (obj, i, a){
                // b += i + " |"
              colHeader.push(i)
              if(noCoordinate != undefined)
              b+= obj.content+' ';
              else
              // b+='{'+obj.x+','+obj.y+'} '+obj.content+' ';
              b += obj.content + ' ';
              // b +=' .';

              return true;
            });
            b+='\n';
            colHeader = colHeader.slice(0, row.length)
            return true
          });
          // var colH = "\t | " + colHeader.join(" ")
          // b = colH +'\n' + b
          return b
    }

    // this.Handlers = {}
    // this.Handlers.mapRef = this
    // this.Handlers.onMouseDown = function onMouseDown (event, cb) {
    //         this.mapRef._input.isMouseOrTouchDown = true
    //         this.mapRef.world_offset_x =

    //         this.beginEv = event
    //         this.beginEv.x = event.getLocationX()
    //         this.beginEv.y = event.getLocationY()
    //         // get the initial offset of the background to the click/touch event
    //         // translate it down to canvas 0,0 - bottom left it seems

    //         world_offset_x = event.getLocationX() - this.world.x - viewport.width/2
    //         world_offset_y = event.getLocationY() - this.world.y - viewport.height/2

    // }
    // return this;
}



// Map.override_me_generateTileUI = function function_name(argument) {
// }
var myMap = exports.Map = new _Map(960, 460, 200)
            .setTileSize(100,100)
            // .init()

console.log(myMap)

// module.exports = {Map, _Tile}


