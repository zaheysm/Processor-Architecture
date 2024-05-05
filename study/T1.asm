; Grades.asm
;
; Author:               Shahram A
;
; Student Number:       040-971-488
;
; Date:                  Nov 12 2021
;
; Purpose:               Reading values from a Marks.txt file.
;


; Program Constants

FIFTY    equ      50
NINETY   equ      90
EIGHTY   equ      80
SEVENTY  equ      70
SIXTY    equ      60



;Program data goes here

         org      $1000

Marks                      ; Array starts here
#include Marks.txt      ; including the text file.
EndMarks               ; This is used for one value past(after) the last given array element. Marks+1.
                       ; Marks goes up to $1015 which means EndMarks = $1016. (one value past the last given array element).

; Expected Result

; C F F B A B D B D C F F D A A F   ; According to the values provided in the Marks.txt file.
                                    ; The marks in the txt file needs to match the flowchart for
                                    ; Grades.asm.




; Grades array origin is $1030.
         org     $1030

Grades   ds      EndMarks-Marks  ; this will define the length of the data array. EndMarks = $1016 - $1015 = Marks, which = 1 for (ds).





;Program instruction goes here

         org      $2000       ; Program instruction area
Start    lds      #$2000      ; stack location
         ldx      #Marks      ; Point to starting address of Marks (pointer x pointing to #Marks array)
         ldy      #Grades     ; Point to starting address of Grades (pointer y pointing to #Grades destination)
         ;ldab     #$00

Loop     ldaa     1,x+        ;this will load accumular (a) into the starting memory address $1000 (#Marks) and stores the
                                     ;value into accumulator (a) then will advance to the next address $1001 and so on.




Check90  cmpa     #NINETY    ; Shouldn't this be cmpx, since pointer (x) is pointing to #Marks array.
          bhs      AssignA

Check80  cmpa     #EIGHTY
          bhs      AssignB

Check70  cmpa     #SEVENTY
          bhs      AssignC

Check60  cmpa     #SIXTY
          bhs      AssignD

;Check60  cmpa     #SIXTY
         ; blo      AssignF
Fgrade    bra      AssignF     ; If the value from Marks.txt is anything else other then the conditions above then assign grade F.

AssignA   ldab      #'A'       ; Why is this ldab  (load accumulator b)?
           bra      Next

AssignB   ldab      #'B'
           bra      Next

AssignC   ldab      #'C'
           bra      Next

AssignD   ldab      #'D'
	   bra 	    Next

AssignF   ldab      #'F'
Next	  stab      1,y+


           cpx     #EndMarks   ; Since, (x) pointer is pointing to #Marks array
                               ; due to it being declared above; ldx #Marks.
                               ; Then, line 100, will compare the last memory address at
                               ; pointer x (#Marks) and if the memory address value in pointer
                               ; x is one address past the last source address (in this case if
                               ; its $1016) then if the subtraction $1016 - 1016 = 0, then I finish the loop and will execute the next line of
                               ; code after line 100. This is the (All - Marks processed - Yes) part of the flowchart.



	   bne      Loop      ; if line 100 of the code does not equal to 0, then repeat the loop again. In this case, I have
			      ; setup a label called Loop, which starts at ldaa 1,x+ then it will follow the next lines of codes sequentially.
		       	      ; This is the (All - Marks processed - No) part of the flowchart.


           swi
           end

