; Reverse.asm

; Author:               D. Haley, Professor, for CST8216
; Modified by:          <place your Name(s) here>
; Student Number(s):    <place your Student Number(s) here>
; Lab Section(s):       <place your Lab Section Number(s) here>
; Course:               CST8216 Fall 2021
; Date:                 <include the code completion date here>

; Purpose       To copy and reverse an array using the supplied
;               Flowchart while performing the following:
;               additional operations to decrypt the Secret Message.
;               After reading in an 8-bit value from the Source Array,
;               we decrypt the value by
;               a. dividing the value by 2
;               b. then adding 32 to the value
;               c. then storing the value in the Destination Array
;
; Decryption Constants
DIVISOR         equ     2        ; Values in supplied array will be divided by
                                ; this value
ADDED_VALUE     equ     32      ; Dividend value will have 32 added to it

                org     $1000
Source_Array
#include A3B_Array.txt
End_Source_Array
                org    $1020    ; Secret Message will appear
                                ; starting here
Destination_Array
                ds      End_Source_Array-Source_Array   ; auto calculate Array Size
End_Destination_Array


;expected output
          ;input $46,$4A,$48,$0,$2A,$22,$0,$66,$52,$0,$5A,$42,$70,$4A
          ;output $4A,$70,$42....   $46
          
;

                org     $2000
                lds     #$2000        ; Initialize Stack
                clr     $102E
                clra
                clrb
                ldx     #End_Source_Array-1
                ldy     #Destination_Array


                
                ldab    1,x-
loop            pshx
            	ldx     #DIVISOR
        	idiv
                tfr     x,d
                pshb
                bra     SubRoutine
loop1           pulx
                ldab    1,x-
                bra     loop


SubRoutine      pulb
                addb    #ADDED_VALUE
                stab    0,y
                iny
                cpy     #End_Destination_Array
                beq     goToENd
                bra     loop1
                
goToENd         swi
                end