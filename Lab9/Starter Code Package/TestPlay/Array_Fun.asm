; Array_Fun.asm
; Author: D. Haley, Faculty, 26 Nov 2021
;
; Student Name(s):
; Student Number(s):
; Modification Date:
;
;
; Purpose:      The purpose of this program is to gain further experience with
;               the use of Arrays in 68HCS12 Assembly Language by performing
;               the following Tasks:
;
;               a. Determine the Maximum value in the Array and store the
;                  value at Max
;               b. Determine the Minumum value in the Array and store the
;                  value at Min
;               c. Using the value stored at Max, determine how often that
;                  value occurs in the Array and store that value at NumMax
;               d. Using the value stored at Min, determine how often that
;                  value occurs in the Array and store that value at NumMin
;               e. Range tells how far apart the Max and Min numbers are in a set
;                  It is the positive difference between the two values
;                  Using the values in Max and Min, subtract those two
;                  values a store the result at Range
;               f. MidRange is the Average of the Range - e.g. Range / 2
;                  Using the Values of Range and DIVISOR, calculate the
;                  MidRange using idiv (mandatory) and store an 8-bit version of
;                  the Answer at MidRange and an 8-bit version of the Reminder
;                  at MidRange+1
;               g. Display NumMax and NumMin on the two right-most HEX Displays
;                  (like you did with the Counter), alternating their
;                  displayed values every 250 ms. This coding is provided for you.
;                  NOTE: API.s19 must be loaded in order for this feature to work.
;               h. Code must run correctly for more than one program run
;                  e.g. File -> Reset, the GO on Simulator must give same results

; --- Do Not Change Code marker ---
; Library Routines used in this software
;
Config_Hex_Displays         equ        $2117
Delay_Ms                    equ        $211F
Hex_Display                 equ        $2139

                                ; Port P (PPT) Display Selection Values
DIGIT1_PP2      equ     %1011   ; 2nd from Right-most display MSB
DIGIT0_PP3      equ     %0111   ; Right-most display LSB

; Delay Subroutine Values
DVALUE  equ     #250            ; Delay value (base 10) 0 - 255 ms
                                ; 125 = 1/8 second <- good for Dragon12 Board

DIVISOR equ     $02

        org     $1000
Array
#include 21F_Array.txt
EndArray

        org     $1030
Max     ds      1
Min     ds      1

        org     $1040
NumMax  ds      1
NumMin  ds      1

        org     $1050
Range           ds      1
MidRange        ds      2

        org     $2000
        lds     #$2000

; --- End of Do Not Change Code marker ---

; your code goes here (as many lines at it takes)
	clr     NumMax
        clr     NumMin
        ldx     #Array
loop    maxa    1,x+
        cmpa    #Max
        bhs     next
        bra     tomin
next	staa    Max
tomin   mina    -1,x
        cmpa    #Min
        blo     save
save	staa    Min
	cpx     #EndArray
        bne     loop
        
        ldx     #Array
loop1   ldaa    1,x+
        cmpa    Max
        beq     countMax
        cmpa    Min
        beq     countMin
        bra     continue1
countMax	inc     NumMax
        bra     continue1
countMin  	inc     NumMin
continue1       cpx     #EndArray
        bne     loop1
        clra
        ldaa    EndArray-Array
        psha
        ldx     #DIVISOR
        idiv
        stx     MidRange
        std     MidRange+1
        pula
        staa    Range
        bra     toend
; --- Do Not Change Code marker ---

        ; Output Results to Hex Displays

        ; NOTE 1 : API.s19 must be loaded in order for this feature
        ; NOTE 2 : Once you STOP the execution of the code in simulator,
        ;          you will be able to see the calculated values in memory
        ;          at the memory locations specified in the assignment.

        jsr     Config_HEX_Displays ; Use the Hex Displays to display the count
Display ldaa    NumMax
        ldab    #DIGIT1_PP2     ; select 2nd from Right Most HEX Display
        jsr     HEX_Display     ; Display the value
        ldaa    #DVALUE         ; delay for DVALUE milliseconds
        jsr     Delay_ms
        ldaa    NumMin
        ldab    #DIGIT0_PP3     ; select Right Most HEX Display
        jsr     HEX_Display     ; Display the value
        ldaa    #DVALUE         ; delay for DVALUE milliseconds
        jsr     Delay_ms
        bra     Display
toend   swi
        end
; --- End of Do Not Change Code marker ---




