; Author:               Zahi Masarwa
; Student Number:       040985420
; Date:                 02 Nov 2021

;constants for the if statements
NINETY  equ      90
EIGHTY  equ      80
SEVENTY equ      70
SIXTY   equ      60



        org $1000       	; memory origin
Marks                   	; define the array name marks
#include Marks.txt      	; load the file marks.txt
End_Marks               	; end of the array
	org     $1030   	; memory origing
Grades  ds      $20     	; store grades in the memory with size $20
;Expected Result
;                   D C C C F F F A C A C B A B A F
; as shown in the sumilator

        org     $2000   	; memory origin
        ldx     #Marks  	;load marks into x
        ldy     #Grades 	;load grade into y
loop    ldaa    1,x+    	;load x[0] to and incrament x by 1 after
        cmpa    #NINETY 	;comare a to constant NINETY
        bhs     AssignA 	;if a>=90 branch to AssignA
        cmpa    #EIGHTY 	;comare a to constant EIGHTY
        bhs     AssignB 	;if a>=80 branch to AssignB
        cmpa    #SEVENTY	;comare a to constant SEVENTY
        bhs     AssignC 	;if a>=70 branch to AssignC
        cmpa    #SIXTY  	;comare a to constant SIXTY
        bhs     AssignD 	;if a>=60 branch to AssignD
        cmpa    #SIXTY  	;comare a to constant SIXTY
        blo     AssignF 	;if a<60 branch to AssignF
        bra     save    	;else branch to cont
AssignA ldab    #'A'    	;load the letter for the grade to B
        bra     save    	;branch to save
AssignB ldab    #'B'    	;load the letter for the grade to B
        bra     save    	;branch to save
AssignC ldab    #'C'    	;load the letter for the grade to B
        bra     save    	;branch to save
AssignD ldab    #'D'    	;load the letter for the grade to B
        bra     save    	;branch to save
AssignF ldab    #'F'    	;load the letter for the grade to B
        bra     save    	;branch to save
save    stab    1,y+    	;save the letter in Y and incrament after
   	cpx     #End_Marks      ;compare  X to end of the array
	bne     loop            ;if X not equal to end of array then keep looping
        swi                     ;software intruput to end the machine
        end                     ;End of the system

        