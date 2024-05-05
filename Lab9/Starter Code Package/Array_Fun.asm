; Array_Fun.asm
; Author: D. Haley, Faculty, 26 Nov 2021
; Modified by:          Zahi Masarwa, Ahmad Hodroj,Mohamad Rezk
; Student Number(s):     040985420  , 041018443    ,040960130
; Lab Section(s):       302
; Course:               CST8216 Fall 2021
; Date:                 11-12-2021
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
Config_Hex_Displays    equ     $2117
Delay_Ms               equ     $211F
Hex_Display            equ     $2139

                                       ; Port P (PPT) Display Selection Values
DIGIT1_PP2                    equ     %1011   ; 2nd from Right-most display MSB
DIGIT0_PP3             equ     %0111   ; Right-most display LSB

                                       ; Delay Subroutine Values
DVALUE                 equ     #250    ; Delay value (base 10) 0 - 255 ms
                                       ; 125 = 1/8 second <- good for Dragon12 Board

DIVISOR                 equ     $02    ; Values in supplied array will be divided by
                                       ; this value

                               org     $1000
Array
#include 21F_Array.txt
EndArray

                        org     $1030
Max                     ds      1
Min                     ds      1

                        org     $1040
NumMax                  ds      1
NumMin                  ds      1

                        org     $1050
Range                   ds      1
MidRange                ds      2

                        org     $2000
                        lds     #$2000

; --- End of Do Not Change Code marker ---

; your code goes here (as many lines at it takes)
                        clr     NumMax    ;clear the contents in the following memory address
                        clr     NumMin    ;clear the contents in the following memory address
                        ldx     #Array+1  ;Point X to Memory Address designated by the Label "Array"+1 which is 1001
                        ldaa    -1,x      ; Using constant offset ,load into accumlator a the value where x is pointing to memory address 1000 which is the first value in array
                        staa    Max       ;store the value into accumlator a which is $24 in Max
                        staa    Min       ;store the value into accumlator a which is $24 in Min
loop                    ldaa    1,x+      ;load into accumlator a the value stored where x is pointing in the array and after executing increment x
                        cmpa    Max       ;compare the value in accumlator a with the value stored in Max and check if it is higher than max
                        bhi     Maximum   ;if the value in accumlator a is higher than max branch to Maximum label
                        ldab    0,x       ; Using constant offset ,load into accumlator b the value where x is pointing to memory address 1000 which is the first value in array
                        cmpb    Min       ;compare the value in accumlator b with the value stored in Min and check if it is lower than max
                        bls     minimum   ;if the value in accumlator b is lower than min branch to Minumum label
                        bra     continue  ;branch to the label continue
minimum                 stab    Min       ;store the value into accumlator b  in Min
                        bra     continue  ;branch to the label continue
Maximum                 staa    Max       ;store the value into accumlator a in Max
continue                cpx     #EndArray ;Check if we processed all the elements in the array
                        bne     loop      ;if not equal branch to loop to continue processing the elements in the array and checking the max and min
        
                        ldx     #Array    ;Point X to Memory Address designated by the Label "Array" which is 1000
loop1                   ldaa    1,x+      ;load into accumlator a the value stored where x is pointing in the array and after executing increment x
                        cmpa    Max       ;compare the value in accumlator a with the value stored in Max and check if it is higher than max
                        beq     countMax  ;if equal branch to the countMax label.
                        cmpa    Min       ;compare the value in accumlator a with the value stored in Min and check if it is lower than min
                        beq     countMin  ;if equal branch to countMin label to increment the minimum value counters
                        bra     continue1 ;branch to the label continue1
countMax                inc     NumMax    ;increment the NumMax counter by 1 to increase the count of max numbers
                        bra     continue1 ;branch to the label continue1
countMin                inc     NumMin    ;increment the NumMin counter by 1 to increase the count of min numbers
continue1               cpx     #EndArray  ;Check if we processed all the elements in the array
                        bne     loop1      ;if not equal branch to the loop1 again.
                        ;clra               ;clear the accumlator a
                        ldab    Max        ;load into accumlator b the value stored at Memory Address designated by the label Max
                        SUBb    Min        ;Subtract into accumlator b the value stored into accumlator b which is the max by min
                        stab    Range      ;store the value into accumlator b in Range
                        ldx     #DIVISOR   ;Load X with the value stored at Memory Address designated by the Label DIVISOR which is 2
                        idiv               ;divide b by the value stored in x
                        tfr     x,a        ;transfer the value stored in pointer X to a
                        std     MidRange   ;store the value into accumlator d in MidRange


; --- Do Not Change Code marker ---

                                                ; Output Results to Hex Displays

                                                ; NOTE 1 : API.s19 must be loaded in order for this feature
                                                ; NOTE 2 : Once you STOP the execution of the code in simulator,
                                                ;you will be able to see the calculated values in memory
                                                ;at the memory locations specified in the assignment.

                        jsr     Config_HEX_Displays ; Use the Hex Displays to display the count
Display                 ldaa    NumMax
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
                        swi
                        end
                                                ; --- End of Do Not Change Code marker ---

