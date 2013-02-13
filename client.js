$(document).ready(function() {
	// Handler for .ready() called.
$(function() { // some randome ruler ....

	 var option = ' <li class = "config">' +
				 '<select id="spacing">' +
					'<option>1cm</option>' +
					'<option>2cm</option>' +
					'<option>1in</option>' +
					'<option>1em</option>' +
					'<option>70px</option>' +
			 ' </select>' +
	 ' </li>' ;


		// Build "dynamic" rulers by adding items
		$(".ruler[data-items]").each(function() {
				var ruler = $(this).empty(),
						len = Number(ruler.attr("data-items")) || 0,
						item = $(document.createElement("li")),
						i;
				for (i = 0; i < len; i++) {
						ruler.append(item.clone().text(i +1));
				}
			//ruler.append(option);
		});
		// Change the spacing programatically
		function changeRulerSpacing(spacing) {
				$(".ruler").
					css("padding-right", spacing).
					find("li").
						css("padding-left", spacing);
			$("#config").hide();
		}
		$("#spacing").change(function() {
				//changeRulerSpacing($(this).val());
				$(".ruler").attr("data-items","50");
			$(".ruler[data-items]").empty();
			$(".ruler[data-items]").each(function() {
				var ruler = $(this).empty(),
						len = Number(ruler.attr("data-items")) || 0,
						item = $(document.createElement("li")),
						i;
				for (i = 0; i < len; i++) {
						ruler.append(item.clone().text(i +1));
				}
			//ruler.append(option);
		});

			 changeRulerSpacing($(this).val());
		});

	/* hover the rulers and diplay the metric options  (M.O.)
		 on exit of the M.O, hide it
	*/
	$("#config").hide();
	$(".ruler").hover(function () {
			$("#config").show();
	}, function () {
			$("#config").hover(function () {
					$("#config").show();
			}, function () {
					$("#config").hide();
			});

	});


});
var CSSs = new (function  () {
	this.spacing = 5;
	this.cell_w = 70;
	this.cell_h = 70;
	this.ChipColor = '#F2F2F2';
	this.TilesColor ='';
	this.left = 0;
	this.top =0;
	this.Chip = { zIndex:"0", position: "relative", float:"left",top: 10 + this.spacing,left: 10 + this.spacing, width: this.cell_w,height: this.cell_h,background: this.ChipColor };
	this.Tile = {zIndex:"0", position: "absolute", width: this.cell_w,height: this.cell_h,background: this.TilesColor, top: this.top ,left: this.left };

		this.SetTop = function(x) {
			this.top = x;
		};

}) ();

// only one copy of this object - add function here to describe other object
Game = {};
	Game.droppedInId;
	Game.draggedChipId;
	Game.selectedChip;
	Game.tileCnt = 0;
	Game.chipCnt = 0;

Game.show_props = function (obj, objName) {
	var result = "";
		for (var prop in obj) {
		result += objName + "." + prop + " = " + obj[prop] + "\n";
	}
		return result;
};

Game.validateBoard = function(client){
		Mimi.validate();
 };
Game.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
};
Game.getRandomSign = function() {
			var Signs = "+/*-";
			var aSign;

					aSign = Signs.charAt(Math.floor(Math.random() * Signs.length));
			console.log(aSign);
			return aSign;
};

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
					 //      var lN = client.getChipNeighborCoordinate('left',client.usedChip[client.usedChip.length -1 ]);

					 //       console.log (client.getChipNeighborCoordinate('right',ui.draggable));
					 //       console.log (client.getChipNeighborCoordinate('top',ui.draggable));
					 //       console.log (client.getChipNeighborCoordinate('bottom',ui.draggable));

								console.log(client.usedChip.length);
								console.log(client.usedTile.length);
								// if(!$(this).hasClass("transform-h-x"))  // just messing around with 2.5D
								//$(".tile").addClass('transform-h-x');

								//on double click of a chip on the board, remove is from the board and place it back on the rack  --need to be moved somewhere else
								$('.chip').bind('dblclick ', function(ev, ui) {
									var $chip = $(this);
									$chip.attr("data-status","active")
										 .attr("data-row",null)
										 .attr("data-col",null);
										$('#rack').append($(this).css({ position: "relative" }).detach());
										client.usedChip = client.usedChip.filter(function(v) { return v.attr('id') == $chip.attr('id') ? false: true;}); //remove from usedChip if we remove the chip from the board

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
function Region(name, startPt, endPt, Rule){
	this.name = name;
	this.startPt = startPt;
	this.endPt = endPt;
	this.Rule = Rule;

}

function Board (divName,w ,h) {
			this.width = w || $(divName).width();
			this.height = h || $(divName).height();
			this.cnt = 0;
			this.tileSet = [];
			this.patternStr = "";
			this.cols = Math.floor(this.height / CSSs.cell_h);
			this.rows = Math.floor(this.width / CSSs.cell_w);

}

Board.prototype = {
	buildGrid:function(divName,CSSs) {
		var t ;
		var grid = "";
		for (var i = 0; i < this.rows; i ++) {
				for (var j = 0; j < this.cols; j ++) {
				CSSs.Tile['top'] =  i * (CSSs.cell_w + CSSs.spacing);
								CSSs.Tile['left']  = j * (CSSs.cell_w + CSSs.spacing);
								t = (new Tile(i,j)).GetSelf() ;
								grid += t[0].outerHTML;
							this.cnt++;
				}
			}
			$(divName)[0].innerHTML = grid;
	}

};

function ChipHolder() {
	var number = [];  // public on purpose here... in production will be private
	var opSign = [];
	var eqSign = [];

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

	this.makeNewSet = function(_num,_op,_Eq) {
		for (var i = _num; i > 0; i--) {
			NewNumChip( new Chip("num", Game.getRandomInt(-9,9)));
		}

		for (var j = _op; j > 0; j--) {
			NewOpChip(new Chip("Op", Game.getRandomSign()));
		}

		for (var k = _Eq; k > 0; k--) {
			NewEqChip(new Chip("Eq", "="));
		}
	};

	this.getChips = function( divName) {

		for (var i = number.length - 1; i >= 0; i--) {
					$(divName).append(number[i].GetSelf()[0]);
		}

		for (var x in opSign) {
			$(divName).append(opSign[x].GetSelf()[0]);
		}

		for (var y in eqSign) {
			$(divName).append(eqSign[y].GetSelf()[0]);
		}
	};

	this.getLength = function() {
		return NewEqChip();
	};
}



var Client = function (name,homeTile) {
		'use strict';
		this.name=name;
		var score = 0;
		this.home = homeTile;
		this.Move="";
		this.equation ="";
		this.usedChip = [];
		this.usedTile = [];
		this.rack = new ChipHolder();
		this.rack.makeNewSet(5,2,1);  //5 numbers, 2 ops, 1 equal sign
		$('#rack').css("background-color","red").droppable({accept: 'div.chip' ,   hoverClass: 'hovered',    // need to be somewhere else...
            drop: function (event, ui) {
							ui.draggable.css({});
							$(this).css({opacity: 0.8});
							event.preventDefault();
						}
				});
	this.rack.getChips('#rack');

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
		//console.log ("R "+ Row + " C "+Col);
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
    console.log(argument);
      var red1 = parseInt(argument,16) >> 16;
      var green1 = (parseInt(argument,16) >> 8) & 0xFF;
      var blue1  =  parseInt(argument,16) & 0xFF;

      var time = 0.3; // This should be between 0 and 1

      var outred =  red1 * (time) ;
      var outgreen =  green1 * (time) ;
      var outblue =  blue1 *(time) ;
      // var red2 = 0xFFFFFF >> 16;
      // var green2 = (0xFFFFFF >> 8) & 0xFF;
      // var blue2  = 0xFFFFFF & 0xFF;

      // var outred = time * red1 + (1-time) * red2;
      // var outgreen = time * green1 + (1-time) * green2;
      // var outblue = time * blue1 + (1-time) * blue2;
       var hexColor = ((1 << 24) + (outred << 16) + (outgreen << 8) + outblue).toString(16).substr(1);
return  hexColor ;
  };
this.lpcnt = 0;
this.radCol = '7B3F00';
	this.traverseUsedChip = function (direction,orientation,chip) {
		var neighbor = chip;
     this.lpcnt += 0.3;
		//console.log(neighbor);
		if (neighbor[0] === undefined)
			return 0 ;
		else
			{var col ;
				if (direction == "horizontal"){
					console.log(this.equation += neighbor.html());
          console.log( col = this.degradingRadiant(this.radCol ,this.lpcnt));
          this.radCol = col;
          neighbor.css({"background-color":"#"+this.radCol});
					this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
				}
				else{
					if (direction == "vertical") {
						console.log(this.equation += neighbor.html());
						this.traverseUsedChip (direction, orientation,getChipNeighbor(orientation, chip));
					}
				}

			}

	};

/* we are going from the last chip*/
	this.validate = function() {

		console.log(this.printUsedTile());
		if (this.usedChip.length === 0)
			return -1;
		else {
			var direction = "";
			var LN = getChipNeighbor('left',(this.usedChip[this.usedChip.length -1 ]))	||null;//all available neighbor for the last chip
			var RN = getChipNeighbor('right',(this.usedChip[this.usedChip.length -1 ]))	||null;
			var TN = getChipNeighbor('top',(this.usedChip[this.usedChip.length -1 ]))	||null;
			var BN = getChipNeighbor('bottom',(this.usedChip[this.usedChip.length -1 ]))||null;

			if ((LN.length === 0 ? (RN.length === 0 ? false : true) : true )){
				direction = "horizontal";
				this.traverseUsedChip (direction,"left",LN);
				console.log(this.equation += $(this.usedChip[this.usedChip.length -1 ]).html());
				this.traverseUsedChip (direction,"right",RN);
			}
			else {
					if ((TN.length === 0 ? (BN.length === 0 ? false : true) : true )){
					direction = "horizontal";
					this.traverseUsedChip (direction,"left",LN);
					console.log(this.equation += $(this.usedChip[this.usedChip.length -1 ]).html());
					this.traverseUsedChip (direction,"right",RN);
				}
			}

		}
	};

};


test("ChipHolder Test", function () {
	Mimi = new Client("Mimi");
	var myBoard = new Board("#board",1000,1000);
	myBoard.buildGrid("#board",CSSs);
	$('#board').draggable();
	(new Tile(0,0)).makeAllTileDroppable('.tile', Mimi);

		equal(Mimi.getLength(), 1 , "should be 6");
});



// $("#board").bind("mousedown touchstart MozTouchDown", function(e) {
//     if(e.originalEvent.touches && e.originalEvent.touches.length) {
//         e = e.originalEvent.touches[0];
//     } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
//         e = e.originalEvent.changedTouches[0];
//     }
// });


// $(".Chip").bind("mousedown touchstart MozTouchDown", function(e) {
//     if(e.originalEvent.touches && e.originalEvent.touches.length) {
//         e = e.originalEvent.touches[0];
//     } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
//         e = e.originalEvent.changedTouches[0];
//     }
// });



// // TESTING SESSION
// test("Client and Chip Test", function () {

//      width = $('.world').width();
//      height = $('.world').height();
//      cell_w = 70;
//      cell_h = 70;
//      spacing = 5;
//      cnt = 0;
//      TOTALCOLUMN = Math.round(height / cell_h);
//      TOTALROW = Math.round(width / cell_w);

//     var Miezan = new Client('Miezan',null);
//     var css = { position: "relative", float:"left",top: 10 + spacing,left: 10 + spacing, width: cell_w,height: cell_h,background: '#B1ADED'};

//    var Home = new Chip(css,null)
//     deepEqual(Miezan, new Client('Miezan',null), 'good');
//     equal(Miezan.getScore(), "you've got "+ 0 + " points" , "should be 0")
//     Miezan.setScore(4);
//     console.log(Game.show_props(Miezan,'Miezan'));
//     console.log(Game.show_props(Home,'Chip'));
//     console.log(Home.GetSelf());
//     equal(Miezan.getScore(), "you've got "+ 4 + " points" , "should be 0")
//     equal(Miezan.lastLogin, undefined , "should be undefined")
//     equal(Miezan.draggedChipId, '0098' , "should be 0098")

// });
// test("Tile and board Test", function () {

//      width = $('.world').width();
//      height = $('.world').height();
//      cell_w = 70;
//      cell_h = 70;
//      spacing = 5;
//      cnt = 0;
//      TOTALCOLUMN = Math.round(height / cell_h);
//      TOTALROW = Math.round(width / cell_w);

//     var Miezan = new Client('Miezan',null);
//     var css = { position: "relative", float:"left",top: 10 + spacing,left: 10 + spacing, width: cell_w,height: cell_h,background: '#B1ADED'};

//    var Home = new Chip(css,null, '001')
//     deepEqual(Miezan, new Client('Miezan',null), 'good');
//     equal(Miezan.getScore(), "you've got "+ 0 + " points" , "should be 0")
//     Miezan.setScore(4);
//     console.log(Game.show_props(Miezan,'Miezan'));
//     console.log(Game.show_props(Home,'Chip'));
//     console.log(Home.GetSelf());
//     equal(Miezan.getScore(), "you've got "+ 4 + " points" , "should be 0")
//     equal(Miezan.lastLogin, undefined , "should be undefined")
//     equal(Miezan.draggedChipId, '0098' , "should be 0098")

// });

});