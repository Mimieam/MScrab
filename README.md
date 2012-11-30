MScrab
======

#####Basic Squeleton
<pre>
World
	Player -> currentScore
     	   -> tileHolder
 	Board 
    	   -> Grid 
           		-> placeHolder
           -> Coordinate ruler (only 4 debugging)		
                
    Tile
    	   -> Type
           -> Coodinates
           -> value
           -> direction
                      
    Other -> Menu
    	  -> Minimap
          -> debug Menu
             
</pre>
    
#####Tile types:
* num
* sign (operator & parenteses) 
* equal
	-> keep 2 running totals , vertical/horizontal 
    