	//(new Tile(0,0)).makeAllTileDroppable('tile', Mimi);
 	$('#board').on("mouseover",".tile",function() {
             if (!$(this).data("init")) {
                $(this).data("init", true).droppable({
					accept: 'div.chip',
					hoverClass: 'hovered',
					drop: function(event, ui) {

							ui.draggable.attr('data-droppedIn', this.id);
							ui.draggable.attr('data-row', $(this).attr('row'));
							ui.draggable.attr('data-col', $(this).attr('col'));
							ui.draggable.css({"width":"200px", "height":"200px"});
							if ($.inArray(ui.draggable, client.usedChip) == -1){
								client.usedChip.push(ui.draggable);
							}

							$("#board").on('dblclick','.chip', function() {
								var $chip = $(this);
								if($chip.attr("data-status")!="disabled") {
										$chip.attr("data-status","active")
											 .attr("data-row",null)
											 .attr("data-col",null);
										$('#rack').append($(this).css({ position: "relative", "width":"70px", "height":"70px"}).detach()); 
										client.usedChip = client.usedChip.filter(function(v) { return v.attr('id') == $chip.attr('id') ? false: true;}); //remove from usedChip if we remove the chip from the board
									}
							});

							if ($(this).children().length == 0) {
									ui.draggable.css({
											position: "absolute",
											left: 0 + "px",
											top: 0 + "px",
											zIndex: 1,
											width:"200px",
											height:"200px"
									});
									ui.draggable.detach();
									$(this).append(ui.draggable);
							}
							else {
									console.log(ui.draggable.data());
									// console.log(ui.draggable.parent());
									ui.draggable.css({"width":"200px", "height":"200px"});

									if($(this).children().length == 1 && ui.draggable.parent()[0].id =='rack' ){ // revert if going to rack
										ui.draggable.css({ position: "relative", "width":"70px", "height":"70px"});
									}
									ui.draggable.draggable('option', 'revert', true );
							}
					}
			});
	};
	);
             }
          });
		// equal(Mimi.getLength(), 1 , "should be 6");
//});

