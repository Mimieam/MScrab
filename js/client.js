$(document).ready(function() {

(function( $ ) {

    $.support.touch = typeof Touch === 'object';

    if (!$.support.touch) {
        return;
    }

    var proto =  $.ui.mouse.prototype,
    _mouseInit = proto._mouseInit;

    $.extend( proto, {
        _mouseInit: function() {
            this.element
            .bind( "touchstart." + this.widgetName, $.proxy( this, "_touchStart" ) );
            _mouseInit.apply( this, arguments );
        },

        _touchStart: function( event ) {
            if ( event.originalEvent.targetTouches.length != 1 ) {
                return false;
            }

            this.element
            .bind( "touchmove." + this.widgetName, $.proxy( this, "_touchMove" ) )
            .bind( "touchend." + this.widgetName, $.proxy( this, "_touchEnd" ) );

            this._modifyEvent( event );

            $( document ).trigger($.Event("mouseup")); //reset mouseHandled flag in ui.mouse
            this._mouseDown( event );

            return false;
        },

        _touchMove: function( event ) {
            this._modifyEvent( event );
            this._mouseMove( event );
        },

        _touchEnd: function( event ) {
            this.element
            .unbind( "touchmove." + this.widgetName )
            .unbind( "touchend." + this.widgetName );
            this._mouseUp( event );
        },

        _modifyEvent: function( event ) {
            event.which = 1;
            var target = event.originalEvent.targetTouches[0];
            event.pageX = target.clientX;
            event.pageY = target.clientY;
        }

    });

})( jQuery );

$('#info').hover(function() {
    $('#stats').stop(true, true).slideDown("fast");
}, function() {
    $('#stats').stop(true, true).slideUp("fast");
});


var CSSs = new (function  () { /*will be moved to the .css*/
	this.spacing = 5;
	this.cell_w = 150;
	this.cell_h = 150;
	this.ChipColor = '#F2F2F2';
	this.TilesColor = '';
	this.left = 0;
	this.top =0;
	this.Chip = {zIndex:"0", position: "relative","max-width":this.cell_w/2, "max-height":this.cell_h/2,background: this.ChipColor };
	this.Tile = {zIndex:"0", position: "absolute", "max-width": this.cell_w, "max-height": this.cell_h,background: this.TilesColor, top: this.top ,left: this.left };
}) ();

/*================================================================================================*/
// only one copy of this object - add function here to describe other object
Game = {};
	Game.droppedInId;
	Game.draggedChipId;
	Game.selectedChip;
	Game.tileCnt = 0;
	Game.chipCnt = 0;
	Game.stop_update = 0;

var world = $('#world'),
	rack = $('#rack'),
	board = $('#board');


Game.show_props = function (obj, objName) {
	var result = "";
		for (var prop in obj) {
		result += objName + "." + prop + " = " + obj[prop] + "\n";
	}
		return result;
};

Game.validateBoard = function(client){
		Mimi.equation = "";
		Mimi.equationChip = [];
		Mimi.validate();
 };

Game.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
Game.getRandomSign = function() {
	var Signs = "+/*-";
	var aSign;
	aSign = Signs.charAt(Math.floor(Math.random() * Signs.length));
	return aSign;
};
Game.getParentheses = function (orientation) {
	if (orientation == "left")
		return "(";
	if (orientation == "right")
		return ")";
};
/* thanks to http://www.javascripter.net/faq/browserw.htm */
Game.getBrowserDimension = function  (argument) {
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
	 winW = document.body.offsetWidth;
	 winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
	    document.documentElement &&
	    document.documentElement.offsetWidth ) {
	 winW = document.documentElement.offsetWidth;
	 winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
	 winW = window.innerWidth;
	 winH = window.innerHeight;
	}
	var  dim = {
		"width":winW,
		"height":winH,
		"x":document.body.left,
		"y":document.body.top
	};

	return dim;
};


/*================================================================================================*/
/* This class is in charge of the validation, it will check all the rules and return true or false*/
/*an equation is true if
   ☐ it is make use of a previously used and disabled tile/chip.
   ☐ if the equation contain at least one  '=' sign
   ☐ if the left right hand side of the equation are equal....
Arr is the array of chips to be evaluated.
*/
Game.rulesValidator = function (Arr, ArrValues_str , name) {
	name !== undefined ? this.name = name : this.name ="general";
	this.Arr = Arr;
	var linked, gotEqual, res;
	if (this.name == "general") {
		//check if make use of a previously disabled 
		(linked = is_linked(this.Arr))?(  // == true ? console.log("passed check1: is linked"):console.log("not linked");
			(gotEqual = hasEqualSign(this.Arr))?(  // == true ? console.log("passed check2: has = sign" ):console.log("no equal sign");
				(res = checkEquation(ArrValues_str))? //!= false ? console.log("passed check3: equalities hold" ):console.log("failed equalities");
				console.log(res): console.log("trouble with evaluation of the expression")
			): console.log('no =')
		): console.log('not linked')
		/*
			FOR TESTING ONLY - REMOVE THAT IN PRODUCTION
		*/
		// linked = is_linked(this.Arr) == true ? console.log("passed check1: is linked"):console.log("not linked");
		// gotEqual = hasEqualSign(this.Arr) == true ? console.log("passed check2: has = sign" ):consolnolog("no equal sign");
		// (res = checkEquation(ArrValues_str)) != false ? console.log("passed check3: equalities hold" ):console.log("failed equalities");
		// linked = true;
		// gotEqual =true;
		return (linked && gotEqual && (res!="FAILED")) ? res: undefined;
	}

	// this function generate a string from the Array of used chips and check if they form a valid equation
	function checkEquation(ArrValues_str){
		// non linked equations 
			var equation = ArrValues_str; // convert array to string
		console.log(equation);
			equation = equation.replace(/<\/?[^>]+(>|$)/g, ""); //remove span tags
		console.log(equation);
			equation = equation.replace(/\|/g,''); //remove | delimiter
			equation = equation.replace(/\,/g,''); //remove | delimiter
		console.log(equation);
		try{
			// return EquationParser.parse(_myEquation);  //Peg.js generated grammar parser
			console.log("equation Left handside"+equation.split('=')[0])
			  //return the left handside of the equation - EVIL EVAL - I will change this monstruositywhen i'm rested ...
			return (EquationParser.parse(equation) ? eval(equation.split('=')[0]):"FAILED");  //Peg.js generated grammar parser
		
		}catch(e){
			console.error(e);
		}

	}

	function hasEqualSign (Arr) {
		var i = Arr.length,
			res = false;

		while (i-- && res == false) {
			$chip = Arr[i][0];
			//this.usedChip[i][0] -> goes down to the dom element
			if ($chip.firstChild.innerHTML == "=") {
				res =true;
			};
		}
		return res;	
	}

	function is_linked (Arr) {
		var i = Arr.length,
			res = false;

		while (i-- && res == false) {
			$chip = Arr[i];
			if (($chip.parent().attr("data-status")== "home" || $chip.attr("data-status") == "disabled")) { // probably a redundant condition - actually i know it's redundant
				res =true;
			};
		}
		return res;	
	}

};


Game.viewport = Game.getBrowserDimension();
Game.setWorldDim = function () {
	$('.world').css({"width":Game.viewport.width,"height":Game.viewport.height});
	// $('#board').css({"width":Game.viewport.width,"height":Game.viewport.height});
}
/*================================================================================================*/
function Chip(type,value) {
	'use strict';
	Game.chipCnt++;
	this.type = type || "regular";
	this.content = value || 0;
	this.row = null;  //row and col of the current used tile
	this.col = null;
	this.status = "active"; // active or desactivated if accepted by validation
	var self = $('<div />').addClass("chip")
							.css(CSSs.Chip)
								.attr('id', 'chip_' + Game.chipCnt)
								.html('<p>' +this.content +'</p>')
								.data({

												"type": this.type,
												"content": this.content,
												"row": this.row,
												"col": this.col,
												"droppedIn": ""
								})
								.draggable({
										// containment: '#board,#rack',
									cursor: 'move',
									revert: "invalid",
									cancel:false // make a button draggable
							});

	//private
	function pGetSelf () {
		return self;
	}

	//priviledged
	this.GetSelf = function() {
		return pGetSelf();
	};

	// this.SetRowAndCol = function(row,col){
	// 	this.row = row;
	// 	this.col = col;
	// };

	// this.ToJson = function(){
	// 	return {"type":this.type,"content":this.content, "status":this.status, "row":this.row, "col":this.col};
	// };



}

/*================================================================================================*/
function Tile(T, L, status, type) {
	'use strict';
	Game.tileCnt++;
	this.id = 'tile_' + Game.tileCnt;
	this.type = type || "normal";
	this.col = L; // tile coordinate on the board ( top, left)
	this.row = T;
	this.status = status || "free";
	var self = $('<div />').addClass("tile").css(CSSs.Tile).attr({
			"id": this.id,
			"type": this.type,
			"status": this.status,
			"row": this.row,
			"col": this.col
	});

	//private
	function pGetSelf() {
			return self;
	}
	//priviledged
	this.GetSelf = function() {
			return pGetSelf();
	};

	this.getFullNeighbor = function() {
			var neighbor = [];
	};

		this.makeAllTileDroppable = function(divs, client) {
			$("#board").find(divs).droppable({
				accept: 'div.chip',
				hoverClass: 'hovered',
				drop: function(event, ui) {
					ui.draggable.css({
						"width": CSSs.cell_w,
						"height": CSSs.cell_h
					})
						.attr({
						'data-droppedIn': this.id,
						'data-row': $(this).attr('row'),
						'data-col': $(this).attr('col')
					});

					console.log(ui.draggable.attr("id")+ "was dropped at "+$(this).attr('row')+ " - "+$(this).attr('col'));
					// ui.draggable.attr();
					// ui.draggable.attr();
					// console.log(ui.draggable.attr('data-row'));
					// ui.draggable.css({"width":"200px", "height":"200px"});
					// console.log(ui.draggable.attr("id") + " with value: " + ui.draggable.data("content") + " is in " + ui.draggable.attr('data-droppedIn'));
					// console.log(ui.draggable.attr("data-row") + " - " + ui.draggable.attr('data-col'));
					// console.log($(this).attr('col'));
					// console.log($(this).attr('row'));
					// console.log(client.name);

					if ($.inArray(ui.draggable, client.usedChip) == -1) {
						client.usedChip.push(ui.draggable);
					}
					// console.log(client.usedChip.length);
					// console.log(client.usedTile.length);
					// if(!$(this).hasClass("transform-h-x"))  // just messing around with 2.5D
					//$(".tile").addClass('transform-h-x');

					// $('#board').on('dblclick', '.chip p', function() {
					$("#board").on('dblclick','.chip p', function() {	
						var $chip = $(this).parent();
						// Mimi.rack.sendInvalidBackToRack([$chip])
						console.log($chip +"-status- :"+$chip.attr("data-status"));
						if ($chip.attr("data-status") != "disabled") {
							$chip.attr("data-status", "active")
								.attr("data-row", null)
								.attr("data-col", null);

							$chip.removeAttr("style");
							$chip.addClass("is-BackOnRack").css('background','rgb(242, 242, 242)').removeClass("is-OnBoard").detach()
							// console.log($chip.data('type'));
							if ($chip.data('type') == "num") $('#rack ul li:nth-child(1)').append($chip);
							if ($chip.data('type') == "op") $('#rack ul li:nth-child(2)').append($chip);
							if ($chip.data('type') == ("eq"||"symbol")) $('#rack ul li:nth-child(3)').append($chip);

							client.usedChip = client.usedChip.filter(function(v) {
								return v.attr('id') == $chip.attr('id') ? false : true;
							}); //remove from usedChip if we remove the chip from the board
						}
					});

					

					if ($(this).children('div').length == 0) {
						// ui.draggable.css({
						// 					position: "absolute",
						// 					left: 0 + "px",
						// 					top: 0 + "px",
						// 					zIndex: 1,
						// 					width:"200px",
						// 					height:"200px"
						// 			});
						ui.draggable.removeAttr("style");
						ui.draggable.addClass("is-OnBoard").css({width:CSSs.cell_w,height:CSSs.cell_h});
						ui.draggable.detach();
						$(this).append(ui.draggable);
					} else {
						console.log(ui.draggable.data()); // check minor bug with data row and col bein null if we drag to a busy tile
						// console.log(ui.draggable.parent());
						// ui.draggable.css({
						// 	"width": "200px",
						// 	"height": "200px"
						// });

						// console.log("Rejected !! line 301");
						// console.log($(this).children('div').length);
						// console.log(ui.draggable.parent()[0].id);
						var $parentId = ui.draggable.parent().parent().parent()[0].id;

						if ($(this).children('div').length == 1 && $parentId == 'rack') { // revert if going to rack
							ui.draggable.removeAttr("style");
							console.log(ui.draggable);
							ui.draggable.addClass("is-BackOnRack");
							// console.log("Rejected !! line 305");
						}
						ui.draggable.draggable('option', 'revert', true);
					}
				}

			});
		};


	}

/*================================================================================================*/
function Region(name, startPt, endPt, Rule){
	this.name = name;
	this.startPt = startPt;
	this.endPt = endPt;
	this.Rule = Rule;

}




/*================================================================================================*/
/* a simple visual feedback showing the number of point after validating the equation*/
function visualFeedback(res, val, ui){
	'use strict';
	var color,
		value="",
		target = ui.parent().position(); // the visual feedback will be positioned according to the occupied tile and not the chip
	res==true? (color = 'green', value = "+"+val) : (color='red',value = "-"+val );
	var $self = $('#vfb').css({"color":color, "display":"block","top":target.top,"left":target.left,'opacity':1}).text(value);
	// $self = $('<span/>').addClass('visualFeedback').css({"color":this.color}).text(val);

	function r_set(){
		$('#vfb').removeAttr('style');

	};

	this.reset = function() {
			// return r_set();
		$self.css({"font-size":"4em"}).text("");

	};

	function pGetSelf() {
			return $self;
	}

	this.GetSelf = function() {
			return pGetSelf();
	};

	// this.animate = function () {
	// 	$self.animate({
	// 			'top': '-='+ (CSSs.cell_h +100)+'px',
	// 			'opacity':"0",
	// 			'font-size':'20em',
	// 			'position':"absolute"
	// 		},2500, function() {
	// 		    // Animation complete - reset visualFB.
	// 		   $(this).css({"font-size":"4em"}).text("");
	// 		});
	// }

	// return this;
}
// visualFeedback.prototype.reset = function  () {
// 	return r_set();
// }
/*================================================================================================*/
/*
0 = empty
1 = double number score
2 = triple number score
3 = double equation score
4 = triple equation scores
5 = star

board (div, row, column,  cell height, cell width ,  width -pixel , height -pixel)
*/
function Board (divName,r,c,ch,cw,w,h) {
		'use strict';
			$(divName).css({"width":Game.viewport.width,"height":Game.viewport.height});
			// this.width =$(divName).width();
			// this.height =$(divName).height();
			// CSSs.cell_h = ch || CSSs.cell_h;
			// CSSs.cell_w = cw || CSSs.cell_w;
			// this.cnt = 0;
			// this.DOM_element = divName;
			// this.tileSet = [];
			// this.patternStr = "";
			// this.cols =  Math.ceil(this.width / CSSs.cell_w);
			// this.rows = Math.ceil(this.height / CSSs.cell_h);

//			console.log(this.width);

			this.width = w || $(divName).width();
			this.height = h || $(divName).height();
			CSSs.cell_h = ch || CSSs.cell_h;
			CSSs.cell_w = cw || CSSs.cell_w;
			this.cnt = 0;
			this.DOM_element = divName;
			this.tileSet = [];
			this.patternStr = "";
			this.cols = c || Math.floor(this.height / CSSs.cell_h);
			this.rows = r || Math.floor(this.width / CSSs.cell_w);
			// this.pattern =[[4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
			// 	           [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
			// 	           [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
			// 	           [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
			// 	           [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
			// 	           [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
			// 	           [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
			// 	           [4,0,0,1,0,0,0,5,0,0,0,1,0,0,4],
			// 	           [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
			// 	           [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
			// 	           [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
			// 	           [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
			// 	           [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
			// 	           [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
			// 	           [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4]];

			this.pattern =[[4,0,0,0,0,0,0,4,0,0,0,0,0,0,4],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [4,0,0,0,0,0,0,5,0,0,0,0,0,0,4],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				           [4,0,0,0,0,0,0,4,0,0,0,0,0,0,4]];

			this.top_left_corner =  {
				"x":0,
				"y":0
			};

			this.bottom_left_corner =  {
				"x": 0,
				"y": Game.viewport.height//r*(CSSs.cell_w + CSSs.spacing)
			};


			this.top_right_corner =  {
				"x": Game.viewport.width,//c*(CSSs.cell_w + CSSs.spacing),
				"y": 0
			};

			this.bottom_right_corner =  {
				"x": Game.viewport.width,//c*(CSSs.cell_w + CSSs.spacing),
				"y": Game.viewport.height//r*(CSSs.cell_w + CSSs.spacing)
			};

			this.horizontal_marker =  {
				"x": 0,
				"y": (this.bottom_left_corner.y - this.top_left_corner.y)/4
			};

			this.vertical_marker =  {
				"x": (this.top_right_corner.x - this.top_left_corner.x)/4,
				"y": 0
			};

}

Board.prototype = {
	buildGrid:function(divName,CSSs,startCol,startRow ) {
		var t ;
		var grid = [];
		// console.log(console.memory.usedJSHeapSize);
		// console.time("Testing Grid build");
		for (var i = startRow; i < this.rows; i ++) {
				for (var j = startCol; j < this.cols; j ++) { //TODO : change the 2 following lines to not use the global css
					CSSs.Tile['top'] =  i * (CSSs.cell_w + CSSs.spacing);
					CSSs.Tile['left']  = j * (CSSs.cell_w + CSSs.spacing);
					t = (new Tile(i,j)).GetSelf() ;
					this.applyPattern(t,i,j);
					grid.push(t[0].outerHTML);
					this.cnt++;
				}
			}
		// console.timeEnd("Testing Grid build");
		// console.log(console.memory.usedJSHeapSize);

			//background of the board
		var board_width  =  this.cols * (CSSs.cell_w + CSSs.spacing) - CSSs.spacing +2;  // - CSSs.spacing +2px of border fix margin of board constrasting with tile
		var board_height =  this.rows * (CSSs.cell_h + CSSs.spacing) - CSSs.spacing +2;
		 $(divName).css({"width":board_width,"height":board_height});
		$(divName)[0].innerHTML += grid.join ('');
	},
	updateGrid:function(divName,CSSs,startingRow,endingRow, startingCol, endingCol ) {
		var t ;
		var grid = [];
		var rows = Math.abs(startingRow - endingRow);
		var cols = Math.abs(startingCol - endingCol);
		for (var i = startingRow; i < endingRow; i ++) {
				for (var j = startingCol; j < endingCol; j ++) { //TODO : change the 2 following lines to not use the global css
					CSSs.Tile['top'] =  i * (CSSs.cell_w + CSSs.spacing);
					CSSs.Tile['left']  = j * (CSSs.cell_w + CSSs.spacing);
					t = (new Tile(i,j)).GetSelf() ;
					this.applyPattern(t,i,j);
					grid.push(t[0].outerHTML);
					this.cnt++;
				}
			}
			//background of the board

		var board_width = $(divName).width() + cols * (CSSs.cell_w + CSSs.spacing) - CSSs.spacing +2;  // - CSSs.spacing +2px of border fix margin of board constrasting with tile
		var board_height = $(divName).height() + rows * (CSSs.cell_h + CSSs.spacing) - CSSs.spacing +2;
		// $(divName).css({"width":board_width,"height":board_height});
		// $(divName).append(grid.join (''));
		$(grid.join("")).prependTo(divName);
		// $(divName).append(grid.join (''));
		//(new Tile(0,0)).makeAllTileDroppable('.tile', Mimi);
	},
	applyPattern:function (tile,x,y) {
		var x = Math.abs(x);
		var y = Math.abs(y);
		// console.log(y%14);
		//var r = x%14;  // 15 -1 = # of columns of pattern -1 to wrap onto the next
		//var c = y%14; //  well here its the number of row
		for (var row in this.pattern){
		   for  (var cell in row ){
		   		switch (this.pattern[x%14][y%14]){
		   			case 0:
		   				$(tile).addClass("pattern");
		   			break;

		   			case 1:
		   				$(tile).addClass("dbl_number").html("<span> x2 </span>");
		   			break;

		   			case 2:
		   				$(tile).addClass("tpl_number").html("<span> x3 </span>");
		   			break;

		   			case 3:
		   				$(tile).addClass("dbl_equation").html("<span> +4 </span>");
		   			break;

		   			case 4:
		   				$(tile).addClass("tpl_equation").html("<span> +2 </span>");
		   			break;

		   			case 5:
		   				$(tile).addClass("star").html("<span> x10 </span>");
		   			break;

		   		}
		   }
		}
	},
	/*
	on drop, a chip register the tile row and col on which it has been dropped,
	we use those to calculate if the tiles was a special one with a weight.

	this function will return the chip with it's appropirate weigth ( the chip returned is a Jquery object) 
	
	*/
	applyPatternForValidation : function  ($chip) { // will be renamed : Add_tile_weight
		var rawChip = $chip[0]; // the dom element

		var x = rawChip.getAttribute('data-row'),
			y = rawChip.getAttribute('data-col'),
			chipValue = (parseInt(rawChip.firstChild.innerHTML));
			if (isNaN(chipValue)){
				console.log("a sign was on a special tile "+ rawChip.firstChild.innerHTML);
				// return rawChip.firstChild.innerHTML;
				return $chip;
			}
		var r = x%14;  // 15 -1 = # of columns of pattern -1 to wrap onto the next
		var c = y%14; //  well here its the number of row
		console.log(x+" - "+y);
		for (var row in this.pattern){
		   for  (var cell in row ){
		   		switch (this.pattern[r][c]){
		   			case 0:
		   				return $chip;
		   				// return chipValue;
		   			break;

		   			case 1:
		   				$chip[0].firstChild.innerHTML = chipValue*2; 
		   				return $chip; 
		   				// return chipValue*2; //dbl_number
		   				// $(tile).addClass("").html("<span> x2 </span>");
		   			break;

		   			case 2:
		   				// $(tile).addClass("tpl_number").html("<span> x3 </span>");
		   				$chip[0].firstChild.innerHTML =chipValue*3; //tpl_number
		   				return $chip;
		   			break;

		   			case 3:
		   				$chip[0].firstChild.innerHTML = chipValue+4; //dbl_equation
		   				// $(tile).addClass("dbl_equation").html("<span> +4 </span>");
						return $chip;		   			
		   			break;

		   			case 4:
		   				$chip[0].firstChild.innerHTML = chipValue+2; //tpl_equation
		   				// $(tile).addClass("tpl_equation").html("<span> +2 </span>");
						return $chip;		   			
		   			break;

		   			case 5:
		   				$chip[0].firstChild.innerHTML = chipValue*10; //star
		   				// $(tile).addClass("star").html("<span> x10 </span>");
						return $chip;		   			
		   			break;
		   		}
		    }
		}
	},
	update:function(event, ui) {  //board drag function handler - wrapped in a anonymous function :D

		//this here reference the jquery draggable object - the board div and not the the board object as defined above. So to access the markers i need to use a global variable - could be improved like by putting the all the board markers, into data-attribute and getting them from ui

		console.log(ui.position);

		var top_left = {
			"x": ui.position.left,
			"y": ui.position.top
			},

			bottom_left = {
				"x": ui.position.left,
				"y": ui.position.top + Game.viewport.height
			},

			top_right = {
				"x": ui.position.left + Game.viewport.width,
				"y": ui.position.top
			},

			bottom_right = {
				"x": ui.position.left + Game.viewport.width,
				"y": ui.position.top + Game.viewport.height
			};

			this.horizontal_marker =  {
				"x": 0,
				"y": (bottom_left.y - top_left.y)/4
			};

			this.vertical_marker =  {
				"x": (top_right.x - top_left.x)/4,
				"y": 0
			};

			// default bottom > marker - so check the opposite
		if(bottom_left.y < this.horizontal_marker.y ){
			console.log("bottom_left> marker");
		}
			// default top < marker
		if(top_left.y > this.horizontal_marker.y ){
			console.log("top_left> marker");
		}
			//default right > marker
		if(top_right.x < this.vertical_marker.x ){
			console.log("top_right > marker");
		}
			//default left < marker
		if(top_left.x > this.vertical_marker.x ){
			top_left = {
			"x": ui.position.left,
			"y": ui.position.top
			};

			bottom_left = {
				"x": ui.position.left,
				"y": ui.position.top + Game.viewport.height
			};

			top_right = {
				"x": ui.position.left + Game.viewport.width,
				"y": ui.position.top
			};

			bottom_right = {
				"x": ui.position.left + Game.viewport.width,
				"y": ui.position.top + Game.viewport.height
			};

			// console.log(top_left.x%Game.viewport.width==Math.ceil(Game.viewport.width/3));
			// console.log(top_left.x%Game.viewport.width+ " = " +Math.ceil(Game.viewport.width/3));
			var checkpoint = (top_left.x%Game.viewport.width),
			lastCol = 0,
			startingCol = -Math.floor(ui.position.left/(CSSs.cell_h + CSSs.spacing)),
			endingCol = -Math.floor((ui.position.left - this.vertical_marker.x)/(CSSs.cell_h + CSSs.spacing));
			// if (Game.stop_update == 0){
			if (( Math.floor(Game.viewport.width/3)< checkpoint < Math.floor(Game.viewport.width/3))&& ( lastCol!= startingCol)){
			// if ( (Math.ceil(Game.viewport.width/3)-1 < checkpoint) || (checkpoint < Math.ceil(Game.viewport.width/3))) 	{
				// updateGrid:function(divName,CSSs,startingRow,endingRow, startingCol, endingCol )
				console.log("star : "+startingCol+ "ENd "+ endingCol);
				lastCol = startingCol;
				this.updateGrid("#board",CSSs,0,5,startingCol,endingCol);
				Game.stop_update++;
			}
			//console.log("top_left > marker ");
		}
	}
};
/*================================================================================================*/
function ChipHolder(_DOM_element) {
	'use strict';
	var number = [];  // public on purpose here... in production will be private
	var opSign = [];
	var eqSign = [];
	var Symbols;
	this.DOM_element = _DOM_element;
	// $(this.DOM_element).addClass("bluePrint").css({"background-color":"#282828" }).droppable({accept: 'div.chip' ,   hoverClass: 'hovered',    // need to be somewhere else...
	$(this.DOM_element).droppable({accept: 'div.chip' ,   hoverClass: 'hovered',    // need to be somewhere else...
            drop: function (event, ui) {
							// ui.draggable.css({});
							// $(this).css({opacity: 0.8});
							event.preventDefault();
						}
				});

	function NewNumChip (numChip) {
		number.push(numChip);
		// console.log(number[number.length-1]);
		//return number.length;
	}

	function NewOpChip (opChip) {
		opSign.push(opChip);
	}

	function NewEqChip (EqChip) {
		if (EqChip)
			eqSign.push(EqChip);
		else
			return eqSign.length;
	}

	/* prepare the new chips*/
	this.makeNewSet = function(_num,_op,_Eq) {
		for (var i = number.length|| _num; i > 0; i--) {
			//NewNumChip( new Chip("num", Game.getRandomInt(-9,9)));  //-- give negative numbers
			NewNumChip( new Chip("num", Game.getRandomInt(0,9)));
		}

		for (var j = opSign.length || _op; j > 0; j--) {
			NewOpChip(new Chip("op", Game.getRandomSign()));
		}

		for (var k = _Eq; k > 0; k--) {
			NewEqChip(new Chip("eq", "="));
		}
	};

	// /* push the new chips onto the rack*/
	// this.getChips = function( ) {
	// 	for (var i = number.length - 1; i >= 0; i--) {
	// 		$(this.DOM_element).append(number[i].GetSelf()[0]);
	// 	}

	// 	for (var x in opSign) {
	// 		$(this.DOM_element).append(opSign[x].GetSelf()[0]);
	// 	}

	// 	for (var y in eqSign) {
	// 		$(this.DOM_element).append(eqSign[y].GetSelf()[0]);
	// 	}
	// };

	/* push the new chips onto the rack*/
	this.getChips = function( ) {
		var num = $('<li/>'),
			op  = $('<li/>'),
			eq  = $('<li/>'),
			rack = $('<ul/>');

		for (var i = number.length - 1; i >= 0; i--) {
			$(num).append(number[i].GetSelf()[0]);
		}
		rack.append(num);

		for (var x in opSign) {
			$(op).append(opSign[x].GetSelf()[0]);
		}
		rack.append(op);

		for (var y in eqSign) {
			$(eq).append(eqSign[y].GetSelf()[0]);
		}
		rack.append(eq);

		$(this.DOM_element).append(rack);
	};




	// for all new symbols to be added. this function will return a new chip with the appropriate symbol
	this.getSymbols = function(symbol) {
		if (symbol == "left-parenthesis"){
			return ((new Chip("left-parenthesis","(")).GetSelf()[0]);
		}
		if (symbol == "right-parenthesis" )
			return ((new Chip("right-parenthesis",")")).GetSelf()[0]);
	}

	this.sendInvalidBackToRack = function (Arr) {
		var $chip;
		// for (var i = 0; i < Arr.length; i++) {
		var i = 0;
		while(Arr.length!=0) {
			$chip = Arr[i];
			if ($chip.attr("data-status") != "disabled") {
					$chip.attr("data-status", "active")
						.attr("data-row", null)
						.attr("data-col", null);
					//reset css of chips 

					$chip.removeAttr("style");
					$chip.addClass("is-BackOnRack").css('background','rgb(242, 242, 242)').removeClass("is-OnBoard").detach()
					// console.log($chip.data('type'));
					if ($chip.data('type') == "num") $('#rack ul li:nth-child(1)').append($chip);
					if ($chip.data('type') == "op") $('#rack ul li:nth-child(2)').append($chip);
					if ($chip.data('type') == ("eq"||"symbol")) $('#rack ul li:nth-child(3)').append($chip);

					Arr = Arr.filter(function(v) {
						return v.attr('id') == $chip.attr('id') ? false : true;
					}); //remove from usedChip if we remove the chip from the board
			};
			i = Arr.length - 1;
		}
	}

	this.reset = function () {
		number = [];
		opSign = [];
		eqSign = [];
		Symbols = null;
		$(this.DOM_element).empty();
	}

}


/*================================================================================================*/

var Client = function (name,homeTile) {
	'use strict';
	this.name=name;
	var score = 0;
	this.home = beMyHome(homeTile);

	this.Move = "";
	this.equation = "";
	this.equationChip = [];
	this.usedChip = [];
	this.usedTile = [];
	this.rack = new ChipHolder('#rack');
	this.rack.makeNewSet(7,4,1);  //5 numbers, 2 ops, 1 equal sign
	//$(this.rack.DOM_element)

	this.rack.getChips();
	// $("#rack ul li:nth-child(3)").append(this.rack.getSymbols("left-parenthesis"));
	// $("#rack ul li:nth-child(3)").append(this.rack.getSymbols("right-parenthesis"));

	function pGetScore () { //private (pName) functions - not accessible anywhere but in here
		return score;
	}

	function pSetScore(num) {
		if(!isNaN(num))
			score += parseInt(num);
	}

	this.getScore = function() {  // priviledge function - will access my private function - don't work with prototype... sigh..
		console.log("you've got "+ pGetScore() + " points") ;
		return pGetScore();
	};

	this.setScore = function(num) {
		pSetScore(num);
	};

	this.findHome = function() {
		return this.home;
	};


	function beMyHome() { // TODO: add condition to be a home tile
		var self = $(homeTile);
		self.removeClass("pattern").addClass("home").attr({"data-status":"home"});
		console.log(self);
		return self;		
	};


	// this.printUsedTile = function (argument) {
	// 	var currChip="";
	// 	for (var i = this.usedChip.length - 1; i >= 0; i--) {
	// 		currChip +=" "+ $(this.usedChip[i]).html();
	// 	}
	// 	return currChip;
	// };

	function getChipNeighbor (orientation,element){
		var Row = parseInt($(element).attr('data-row'), 10);    // (10) here is the radix parameter for parseInt
		var Col = parseInt($(element).attr('data-col'), 10);
		// console.log ("orientation "+orientation);
			switch(orientation){  // for future reference - this ugly selector get the chip at the specify posotion given by Row and Col
				case 'left':
							return  $('.chip[data-row='+ Row +'][data-col='+ (Col - 1) +']');
				case 'right':
							return  $('.chip[data-row='+ Row +'][data-col='+ (Col + 1) +']');
				case 'top':
							return  $('.chip[data-row='+ (Row - 1) +'][data-col='+ Col +']');
				case 'bottom':
							return  $('.chip[data-row='+ (Row + 1) +'][data-col='+ Col +']');
			}
	}


  	// inspired by http://stackoverflow.com/a/4580171/623546
 //    this.degradingRadiant = function  (argument,_time) {
 //    	var red1 = parseInt(argument,16) >> 16;
 //    	var green1 = (parseInt(argument,16) >> 8) & 0xFF;
 //    	var blue1  =  parseInt(argument,16) & 0xFF;

	//     var time = _time; // This should be between 0 and 1
	//     var red2 = 0xFFFFFF >> 16;
	//     var green2 = (0xFFFFFF >> 8) & 0xFF;
	//     var blue2  = 0xFFFFFF & 0xFF;

	//     var outred = time * red1 + (1-time) * red2;
	//     var outgreen = time * green1 + (1-time) * green2;
	//     var outblue = time * blue1 + (1-time) * blue2;
	//     var hexColor = "#"+((1 << 24) + (outred << 16) + (outgreen << 8) + outblue).toString(16).substr(1);
	// 	return  hexColor ;

	// };

	//this.lpcnt = 0;
	/* this function will traverse the usedChip array by looking a chip neighbor */
	this.traverseUsedChip = function (direction,orientation,chip) {
		var neighbor = chip;
    	//this.lpcnt += 0.3;
		//console.log(neighbor);
		if (neighbor[0] === undefined)
			return 0 ;
		else
			{//var col ;
				if (direction == "horizontal"){
		          // console.log( col = this.degradingRadiant("7B3F00 ",this.lpcnt));
		          // neighbor.css({"background-color":col});
		          neighbor.css({"background-color":"green"}); //evaluation color
		         // console.log("orientation " + orientation);
          			if (orientation == "left"){

						this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
						console.log(this.equation += neighbor.html()+"|");
						this.equationChip.push(neighbor);

          			}
          			if (orientation == "right"){

						this.equationChip.push(neighbor);
						console.log(this.equation += neighbor.html()+"|");
          				this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
          			}
				}
				else{
					if (direction == "vertical") {
						if (orientation == "top"){

							this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
							this.equationChip.push(neighbor);
							console.log(this.equation += neighbor.html()+"|");

	          			}
	          			if (orientation == "bottom"){
	          				// console.log(" else orientation is right: -?" + orientation);
							this.equationChip.push(neighbor);
							console.log(this.equation += neighbor.html()+"|");
	          				this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
	          			}
					}
				}
			}
		};

	/* we are going from the last chip*/
	this.validate = function() {

		//
		if (this.usedChip.length === 0)
			return -1;
		else {
			var  direction = "",
						LN = getChipNeighbor('left',(this.usedChip[this.usedChip.length -1 ]))	||null,//all available neighbor for the last chip
						RN = getChipNeighbor('right',(this.usedChip[this.usedChip.length -1 ]))	||null,
						TN = getChipNeighbor('top',(this.usedChip[this.usedChip.length -1 ]))	||null,
						BN = getChipNeighbor('bottom',(this.usedChip[this.usedChip.length -1 ]))||null;

			console.log("last used CHip :"+this.usedChip[this.usedChip.length -1 ].html());
			if ((LN.length === 0 ? (RN.length === 0 ? false : true) : true )){
				direction = "horizontal";
				this.traverseUsedChip (direction,"left",LN);

				//collect the chip for validation
				this.equationChip.push(this.usedChip[this.usedChip.length -1 ]);
				console.log(this.equation += $(this.usedChip[this.usedChip.length -1 ]).html()+"|");

				this.traverseUsedChip (direction,"right",RN);
			}
			else {
					if ((TN.length === 0 ? (BN.length === 0 ? false : true) : true )){
					direction = "vertical";
					this.traverseUsedChip (direction,"top",TN);

					this.equationChip.push(this.usedChip[this.usedChip.length -1 ]);
					console.log(this.equation += $(this.usedChip[this.usedChip.length -1 ]).html()+"|");

					this.traverseUsedChip (direction,"bottom",BN);
				}
			}

		}
// console.log(this.equation);
		console.log(this.usedChip);
		var $weightedEquation = [];
		for (var i = 0; i < this.equationChip.length; i++) {
			 $weightedEquation.push(myBoard.applyPatternForValidation(this.equationChip[i]));
		};
			 console.log($weightedEquation);

		console.log("let's parse the equation: ");

		var equation = this.equation.replace(/<\/?[^>]+(>|$)/g, ""); //remove span tags
		// console.log(equation);
		// 	equation = equation.replace(/\|/g,''); //remove | delimiter
		console.log(equation);
		
			// console.log(this.equationChip.toString());
			var chipStr = printChips(this.equationChip);
			// printChips($weightedEquation[0]);
			// printChips($weightedEquation);
			// console.log(this.equationChip.toString());
			// var result = this.parseEquation(equation);
			// var result = this.parseEquation($weightedEquation[0]);
			// console.log(this.parseEquation("3=3=3"));
			// console.log(this.parseEquation("3+2*2=7+9-8-1=2*3+1"));
			// console.log(this.parseEquation("2=2=2+1"));
			// console.log(result);
		try{

		}catch(e){
			console.error(e);
			this.rack.sendInvalidBackToRack (this.usedChip);
		}

		// console.log(result);
		console.log($(this.usedChip[this.usedChip.length -1 ]));
			var result = 0;
		if ( (result = Game.rulesValidator ($weightedEquation,chipStr)) != undefined ){//  validation condition
			// if(isNaN(result))
			this.setScore(result);
			$('#info span').text(this.getScore());
			var visualFB = new visualFeedback(true ,result, $(this.usedChip[this.usedChip.length -1 ]))
			visualFB.GetSelf().animate({
				'top': '-='+ (CSSs.cell_h +100)+'px',
				'opacity':"0",
				'font-size':'20em',
				'position':"absolute"
			},2500, function() {
			    // Animation complete - reset visualFB.
			   $(this).css({"font-size":"4em"}).text("");
			});
			this.rack.reset();
			this.disable_on_validation();
			this.rack.makeNewSet(7,4,1);
			this.rack.getChips();
			// visualFB.reset();
		}else{  // invalid equation
			result ="Yo mama would be ashamed!!!"
			var visualFB = new visualFeedback(false ,result, $(this.usedChip[this.usedChip.length -1 ]))
			visualFB.GetSelf().animate({
				'top': '-='+ (CSSs.cell_h +100)+'px',
				'opacity':"0",
				'font-size':'20em',
				'position':"absolute"
			},2500, function() {
			    // Animation complete - reset visualFB.
			   $(this).css({"font-size":"4em"}).text("");
			});
		}
		this.equation = "";
		this.usedChip =[];
		// console.log(this.equationChip);
		this.equationChip = [];
	};
	this.disable_on_validation = function () {
		for (var i = 0; i < this.equationChip.length; i++) {
			this.equationChip[i].draggable("disable").css({opacity: 0.9 ,"background-color":"gray","border-color":"dark-gray"});  // prevent validated tiles to be moved
			this.equationChip[i].attr("data-status","disabled");
			this.equationChip[i].unbind('dblclick'); // remove dblclick event
		};
	};
	this.parseEquation = function (_myEquation) {
		var equation = _myEquation.toString(); // convert array to string
		console.log(equation);
			equation = equation.replace(/<\/?[^>]+(>|$)/g, ""); //remove span tags
		console.log(equation);
			equation = equation.replace(/\|/g,''); //remove | delimiter
			equation = equation.replace(/\,/g,''); //remove | delimiter
		console.log(equation);

		// return EquationParser.parse(_myEquation);  //Peg.js generated grammar parser
		return EquationParser.parse(equation);  //Peg.js generated grammar parser
	};
};

/*print the values of a array of DOM - used to print the Chips to be served to the equation parser*/
function printChips (Arr) {
	var res = "";
	for (var i = 0; i < Arr.length; i++) {
		res += Arr[i][0].innerHTML;
	};
	console.log(res);
	return res;	
}
/*================================================================================================*/

// board (div, row, column,  cell height, cell width ,  width -pixel , height -pixel)
	var myBoard = new Board("#board",15,15);
	myBoard.buildGrid("#board",CSSs,0,0);
	Mimi = new Client("Mimi","#tile_34"); //tile_34 = home tile
	Game.setWorldDim();
	$('#board').draggable({ //will be move into Board class soon
		// drag: function (event, ui) {
		// 			//myBoard.update(event , ui);
		// 		}
	});
	(new Tile(0,0)).makeAllTileDroppable('.tile', Mimi);

	document.onselectstart = function () { return false; }

});