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
    	  -> validation
             
</pre>
    
Tile types:

* num
* sign
* equal
	-> keep 2 running totals , vertical/horizontal 
    