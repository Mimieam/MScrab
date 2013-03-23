$(window).load(function(){
	// jQuery functions to initialize after the page has loaded.
});


$(document).ready(function() {

var CSSs = new (function  () {
	this.spacing = 5;
	this.cell_w = 70;
	this.cell_h = 70;
	this.ChipColor = '#F2F2F2';
	this.TilesColor ='';
	this.left = 0;
	this.top =0;
	this.Chip = { zIndex:"0", position: "relative", "float":"left",top: 10 + this.spacing,left: 10 + this.spacing, width: this.cell_w,height: this.cell_h,background: this.ChipColor };
	this.Tile = {zIndex:"0", position: "absolute", width: this.cell_w,height: this.cell_h,background: this.TilesColor, top: this.top ,left: this.left };
}) ();

/*================================================================================================*/
// only one copy of this object - add function here to describe other object
Game = {};
	Game.droppedInId;
	Game.draggedChipId;
	Game.selectedChip;
	Game.tileCnt = 0;
	Game.chipCnt = 0;

/*display*/
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
		"height":winH
	};

	return dim;
};

Game.viewport = Game.getBrowserDimension();
Game.setWorldDim = function () {
	$('.world').css({"width":Game.viewport.width,"height":Game.viewport.height});
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
								.addClass("ui-draggable")
								.text(this.content)
								.data({

												"type": this.type,
												"content": this.content,
												"row": this.row,
												"col": this.col,
												"droppedIn": ""
								})
								.draggable({
										containment: '#board,#rack',
										cursor: 'move',
								revert: "invalid"
							});

							//private
	function pGetSelf () {
		return self;
	}

				//priviledged
	this.GetSelf = function() {
		return pGetSelf();
	};

	this.SetRowAndCol = function(row,col){
		this.row = row;
		this.col = col;
	};

	this.ToJson = function(){
		return {"type":this.type,"content":this.content, "status":this.status, "row":this.row, "col":this.col};
	};



}

/*================================================================================================*/
function Tile(T, L, status, type) {
		'use strict';
		Game.tileCnt++;
		this.id = 'tile_' + Game.tileCnt;
		this.type = type || "normal";
		// this.content = value||0 ;
		this.col = L; // tile coordinate on the board ( top, left)
		this.row = T;
		this.status = status || "free";
		var self = $('<div />').addClass("tile").css(CSSs.Tile).addClass("ui-droppable").attr({
				"id": this.id,
				"type": this.type,
				"status": this.status,
				"row": this.row,
				"col": this.col
		});
		//.text(this.id)
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
				//if ( this.col + 1)
		};

		this.makeAllTileDroppable = function(divs, client) {
				$(divs).droppable({
						accept: 'div.chip',
						hoverClass: 'hovered',
						drop: function(event, ui) {

								ui.draggable.attr('data-droppedIn', this.id);
								ui.draggable.attr('data-row', $(this).attr('row'));
								ui.draggable.attr('data-col', $(this).attr('col'));
								console.log(ui.draggable.attr("id") + " with value: " + ui.draggable.data("content") + " is in " + ui.draggable.attr('data-droppedIn'));
								console.log(ui.draggable.attr("data-row") + " - " + ui.draggable.attr('data-col'));
								console.log($(this).attr('col'));
								console.log($(this).attr('row'));
								console.log(client.name);

								if ($.inArray(ui.draggable, client.usedChip) == -1){
									client.usedChip.push(ui.draggable);
								}
								console.log(client.usedChip.length);
								console.log(client.usedTile.length);
								// if(!$(this).hasClass("transform-h-x"))  // just messing around with 2.5D
								//$(".tile").addClass('transform-h-x');

								//on double click of a chip on the board, remove is from the board and place it back on the rack  --need to be moved somewhere else
								// $('.chip').bind('dblclick ', function(ev, ui) {
								// 	var $chip = $(this);
								// 	if($chip.attr("data-status")!="disabled") {
								// 			$chip.attr("data-status","active")
								// 				 .attr("data-row",null)
								// 				 .attr("data-col",null);
								// 			$('#rack').append($(this).css({ position: "relative" }).detach());
								// 			client.usedChip = client.usedChip.filter(function(v) { return v.attr('id') == $chip.attr('id') ? false: true;}); //remove from usedChip if we remove the chip from the board
								// 		}
								// });

								$("#board").on('dblclick','.chip', function() {
									var $chip = $(this);
									if($chip.attr("data-status")!="disabled") {
											$chip.attr("data-status","active")
												 .attr("data-row",null)
												 .attr("data-col",null);
											$('#rack').append($(this).css({ position: "relative" }).detach());
											client.usedChip = client.usedChip.filter(function(v) { return v.attr('id') == $chip.attr('id') ? false: true;}); //remove from usedChip if we remove the chip from the board
										}
								});

								if ($(this).children().length == 0) {
										ui.draggable.css({
												position: "absolute",
												left: 0 + "px",
												top: 0 + "px",
												zIndex: 1
										});
										ui.draggable.detach();
										$(this).append(ui.draggable);
								}
								else {
										console.log(ui.draggable.data());
										ui.draggable.draggable('option', 'revert', true);
								}
						},
						out: function(event, ui) {
								//$(this).droppable('enable');
						},
						over: function(event, ui) {
								//$(this).droppable('enable');
								$(this).css({
										//opacity: 0.9
								});

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
/*
0 = empty
1 = double number score
2 = triple number score
3 = double equation score
4 = triple equation scores
5 = star
*/

/*
board (div, row, column,  cell height, cell width ,  width -pixel , height -pixel)
*/
function Board (divName,r,c,ch,cw,w,h) {
		'use strict';
			this.width = w || $(divName).width();
			this.height = h || $(divName).height();
			CSSs.cell_h = ch || CSSs.cell_h;
			CSSs.cell_w = cw || CSSs.cell_w;
			this.cnt = 0;
			this.tileSet = [];
			this.patternStr = "";
			this.cols = c || Math.floor(this.height / CSSs.cell_h);
			this.rows = r || Math.floor(this.width / CSSs.cell_w);
			this.pattern =[[4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
				           [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
				           [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
				           [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
				           [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
				           [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
				           [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
				           [4,0,0,1,0,0,0,5,0,0,0,1,0,0,4],
				           [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
				           [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],
				           [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0],
				           [1,0,0,3,0,0,0,1,0,0,0,3,0,0,1],
				           [0,0,3,0,0,0,1,0,1,0,0,0,3,0,0],
				           [0,3,0,0,0,2,0,0,0,2,0,0,0,3,0],
				           [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4]];

			this.top_left_corner =  {
				"x":0,
				"y":0
			};

			this.bottom_left_corner =  {
				"x": 0,
				"y": r*(CSSs.cell_w + CSSs.spacing)
			};

			this.vertical_marker =  {
				"x": (this.bottom_left_corner.x - this.top_left_corner.x)/2,
				"y": 0
			};

			this.top_right_corner =  {
				"x": c*(CSSs.cell_w + CSSs.spacing),
				"y": 0
			};

			this.bottom_right_corner =  {
				"x": c*(CSSs.cell_w + CSSs.spacing),
				"y": r*(CSSs.cell_w + CSSs.spacing)
			};

			this.horizontal_marker =  {
				"x": 0,
				"y": (this.bottom_left_corner.y - this.top_left_corner.y)/2
			};

}

Board.prototype = {
	buildGrid:function(divName,CSSs) {
		var t ;
		var grid = [];
		// console.log(console.memory.usedJSHeapSize);
		// console.time("Testing Grid build");
		for (var i = 0; i < this.rows; i ++) {
				for (var j = 0; j < this.cols; j ++) {
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
		$(divName)[0].innerHTML = grid.join ('');
	},
	applyPattern:function (tile,x,y) {
		//var r = x%14;  // 15 -1 = # of columns of pattern -1 to wrap onto the next
		//var c = y%14; //  well here its the number of row
		for (var row in this.pattern){
		   for  (var cell in row ){
		   		switch (this.pattern[x%14][y%14]){
		   			case 0:
		   				$(tile).addClass("pattern");
		   			break;

		   			case 1:
		   				$(tile).addClass("dbl_number").text("x2");
		   			break;

		   			case 2:
		   				$(tile).addClass("tpl_number").text("x3");
		   			break;

		   			case 3:
		   				$(tile).addClass("dbl_equation").text("+4");
		   			break;

		   			case 4:
		   				$(tile).addClass("tpl_equation").text("+2");
		   			break;

		   			case 5:
		   				$(tile).addClass("star").text("x10");
		   			break;

		   		}
		   }
		}
	},
	update:function(event, ui) {  //board drag function handler

//this here reference the jquery draggable object - the board div and not the the board object as defined above. So to access the markers i need to use a global variable - could be improved like by putting the all the board markers, into data-attribute and getting them from ui

		console.log("horizontal_marker: "+ myBoard.horizontal_marker.y );
		console.log(ui.position);


		// if(ui.position.top < this.horizontal_marker.y ){
		// 	console.log("generate more map above");
		// }
		// if(ui.position.top > this.horizontal_marker.y ){
		// 	console.log("generate more map bellow");
		// }
		


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
	$(this.DOM_element).css("background-color","red").droppable({accept: 'div.chip' ,   hoverClass: 'hovered',    // need to be somewhere else...
            drop: function (event, ui) {
							ui.draggable.css({});
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
			NewOpChip(new Chip("Op", Game.getRandomSign()));
		}

		for (var k = _Eq; k > 0; k--) {
			NewEqChip(new Chip("Eq", "="));
		}
	};

/* push the new chips onto the rack*/
	this.getChips = function( ) {

		for (var i = number.length - 1; i >= 0; i--) {
			$(this.DOM_element).append(number[i].GetSelf()[0]);
		}

		for (var x in opSign) {
			$(this.DOM_element).append(opSign[x].GetSelf()[0]);
		}

		for (var y in eqSign) {
			$(this.DOM_element).append(eqSign[y].GetSelf()[0]);
		}
	};

	//for all new symbols to be added. this function will return a new chip with the appropriate symbol
	this.getSymbols = function(symbol) {
	if (symbol == "left-parenthesis"){
		// for (var k = _Eq; k > 0; k--) {
		// 	NewEqChip(new Chip("Eq", "="));
		// }
		return ((new Chip("left-parenthesis","(")).GetSelf()[0]);
	}
	if (symbol == "right-parenthesis" )
		return ((new Chip("right-parenthesis",")")).GetSelf()[0]);
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
	this.home = homeTile;
	this.Move = "";
	this.equation = "";
	this.equationChip = [];
	this.usedChip = [];
	this.usedTile = [];
	this.rack = new ChipHolder('#rack');
	this.rack.makeNewSet(5,2,1);  //5 numbers, 2 ops, 1 equal sign
	//$(this.rack.DOM_element)

	this.rack.getChips();
	$("#rack").append(this.rack.getSymbols("left-parenthesis"));
	$("#rack").append(this.rack.getSymbols("right-parenthesis"));

	function pGetScore () { //private (pName) functions - not accessible anywhere but in here
		return score;
	}

	function pSetScore(num) {
		score +=num;
	}

	this.getScore = function() {  // priviledge function - will access my private function - don't work with prototype... sigh..
		return "you've got "+ pGetScore() + " points" ;
	};

	this.setScore = function(num) {
		pSetScore(num);
	};

	this.findHome = function() {
		return this.home;
	};

	this.printUsedTile = function (argument) {
		var currChip="";
		for (var i = this.usedChip.length - 1; i >= 0; i--) {
			currChip +=" "+ $(this.usedChip[i]).html();
		}
		return currChip;
	};

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
    this.degradingRadiant = function  (argument,_time) {
    	var red1 = parseInt(argument,16) >> 16;
    	var green1 = (parseInt(argument,16) >> 8) & 0xFF;
    	var blue1  =  parseInt(argument,16) & 0xFF;

	    var time = _time; // This should be between 0 and 1
	    var red2 = 0xFFFFFF >> 16;
	    var green2 = (0xFFFFFF >> 8) & 0xFF;
	    var blue2  = 0xFFFFFF & 0xFF;

	    var outred = time * red1 + (1-time) * red2;
	    var outgreen = time * green1 + (1-time) * green2;
	    var outblue = time * blue1 + (1-time) * blue2;
	    var hexColor = "#"+((1 << 24) + (outred << 16) + (outgreen << 8) + outblue).toString(16).substr(1);
		return  hexColor ;

	};

	this.lpcnt = 0;
	this.traverseUsedChip = function (direction,orientation,chip) {
		var neighbor = chip;
    	this.lpcnt += 0.3;
		//console.log(neighbor);
		if (neighbor[0] === undefined)
			return 0 ;
		else
			{var col ;
				if (direction == "horizontal"){
		          // console.log( col = this.degradingRadiant("7B3F00 ",this.lpcnt));
		          // neighbor.css({"background-color":col});
		          neighbor.css({"background-color":"chocolate"}); //evaluation color
		          console.log("orientation " + orientation);
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

		// console.log(this.printUsedTile());
		if (this.usedChip.length === 0)
			return -1;
		else {
			var direction = "";
			var LN = getChipNeighbor('left',(this.usedChip[this.usedChip.length -1 ]))	||null;//all available neighbor for the last chip
			var RN = getChipNeighbor('right',(this.usedChip[this.usedChip.length -1 ]))	||null;
			var TN = getChipNeighbor('top',(this.usedChip[this.usedChip.length -1 ]))	||null;
			var BN = getChipNeighbor('bottom',(this.usedChip[this.usedChip.length -1 ]))||null;

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
		console.log("let's parse the equation: ");
		var equation = this.equation.replace(/\|/g,'')
		console.log(equation);
		var result = this.parseEquation(equation);
		console.log(result);
		if (1){//  vadiation condition
			this.rack.reset();
			this.disable_on_validation();
			this.rack.makeNewSet(5,2,1);
			this.rack.getChips();
		}
		this.equation = "";
		console.log(this.equationChip);
		this.equationChip = [];
	};
	this.disable_on_validation = function () {
		for (var i = 0; i < this.equationChip.length; i++) {
			this.equationChip[i].draggable("disable").css({opacity: 0.9 ,"background-color":"gray","border-color":"dark-gray"});  // prevent validated tiles to be moved
			this.equationChip[i].attr("data-status","disabled");
			this.equationChip[i].unbind('dblclick'); // remove dblclick event
		};
	}
	this.parseEquation = function (_myEquation) {
		// return module.exports.parse(_myEquation);  //Peg.js generated grammar parser
		return EquationParser.parse(_myEquation);  //Peg.js generated grammar parser
	 }
};
/*================================================================================================*/

// board (div, row, column,  cell height, cell width ,  width -pixel , height -pixel)
//test("ChipHolder Test", function () {
	Mimi = new Client("Mimi");
	var myBoard = new Board("#board",15,35);
	myBoard.buildGrid("#board",CSSs);
	Game.setWorldDim();
	$('#board').draggable({ //will be move into Board class soon
		drag: myBoard.update
	});
	(new Tile(0,0)).makeAllTileDroppable('.tile', Mimi);

		// equal(Mimi.getLength(), 1 , "should be 6");
//});

});