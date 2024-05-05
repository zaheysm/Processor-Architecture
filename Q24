

                org     $1000
Marks         	db      $95,$87,$92,$55,$38,$0,$88,$52,$63,$99
EndMarks

                org     $1010
passes          db      $25, $21, $15, $33
EndPasses

                org     $1020
Dest            ds      EndMarks-Marks


                org     $2000
	        lds     #$2000
	        
                ldx    #Marks
                
                ldaa    5,x
                
                ldab    3,x+
                
                ldy    	#Dest

                std     4,y+

                staa    -2,y
                
                swi
                end
