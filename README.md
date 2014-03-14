MScrab
======
 First of Mscrab is still in its early stages. I have only been prototyping different features to make sure that i can actually do them.


#####Background
The idea was actually inspired by the  game banana gram.. ( but Mscrab sounded so much better that banana Mgram ...) when I was learning english I used to play this game with my adoptive Mom (I adopted her :P ) and i could only make those very crappy 3 to 4 letters words while she would pull off those weird 8 to 10 letter words that i had never heard off... and apparently using french words was cheating because i was supposed to be improving my english... needless to say that defeats after defeats I needed to find a way to beat her. So one day I took a marquer and wrote a number in the back of each chip. Then suggested that we play a game of 'banana gram' with the  rule being that, we take piece from the bag at random and line them up without looking and no matter what we get we would have to use it. Her facial expression was priceless lol and I told her "welcome to my world now". You will be making equations without unknown (aka equalities... but the goal was to get her confused by the rules :D ) instead of words today. Any letter that you have would be equivalent to a parenthesis (whichever) and we used 'N' as equal signs. It was great fun, and needless to say that ... she beats me... 

So i decided to actually make an actually game out of it to beable to one day beat DiA !!! So that's my motivation in short...


#####Basic Squeleton
'->'  is used to describe the ' has a ' relationship 
for instance a Player has a home, or a Board has a Tiles and each tile has a weight.
<pre>
World
  Player -> currentScore
         -> tileHolder
         -> timer
         -> home

  Chip   -> type 
         -> value

  Board
         -> Grid 
         -> Tile(s)
               -> Type
               -> Coodinates
               -> weight
         -> placeHolder



  Other -> Menu (boostrap)
        -> Minimap
        -> debug Menu
             /
</pre>
    
#####Tile types:
* num
* sign (operator & <del>parenteses</del>) 
* equal
    an equal tile whill keep 2 running totals the vertical and horizontal 


#####placeHolder types:
* single - num
* double - num
* triple - eq
  
##To play

select a tiles from your deck to make an equality.
mm

## So Far ^^
![ScreenShot](https://raw.github.com/Mimieam/MScrab/master/img/First%20Millestone.png)
as of  (01-04-13 04:22)
![ScreenShot](https://raw.github.com/Mimieam/MScrab/master/img/2nd%20Stone.png)
as of (6/30/2013) interesting bug... 9 became 9000... 
![ScreenShot](https://raw.github.com/Mimieam/MScrab/master/img/hahaBugFound.png)
