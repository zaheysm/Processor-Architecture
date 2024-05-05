; Exam.asm
;
; Name:                 Zahi Masarwa
; Student Number:       040985420
;
; NOTE:                 No credit will be given if the above information is missing
;
; Final Exam Quiz instructions and this starter code
; provides instructions on what this program must do

; Program Constants

OFFSET          equ	 15                    ; <== Calculate Constant Offset Addressing Mode
                                        ;     offset value from the Array to Index_Number_Array
                                        ;     using the appropriate adddresses.
                                        ;      You may HARD CODE this value.

DIVISOR         equ	16                     ; <== Determine the divisor used with the
                                        ;     idiv instruction from Final Exam Quiz instructions
ARRAY_LEN       equ     End_Array-Array ; dynamic array size calculation
Index           equ     $00             ; Starting Array index
ORIG_ZERO       equ     $CC             ; if original Array value = 0, store this value
NON_ZERO        equ     $FF             ; if idiv results not equal to zero, store this value


        org     $1000
Array   db	128,145,159,176,192,208,0,0,0,0,31,49,64,81,95,112                ; cut and paste the array provided to you
                                        ; in the Final Exam Quiz instructions here
End_Array

              org    $1010                  ; <== Final Exam Quiz instructions contains
                                        ;     this value. Use this address to
                                        ;     calculate your offset for
                                        ;     CONSTANT OFFSET ADDRESSING mode
Index_Number_Array
                ds      End_Array-Array
End_Index_Number_Array
                org     $1030

counter          ds      1

                org     $2000
                lds     #$2000
                ldaa    Index_Number_Array-Array+1
; your code goes here
                ldy    	#Array
loop		ldab    1,y+
                cmpb    #0
                beq     store
                ldx     #DIVISOR
                idiv
                cmpb    #0
                beq     storeR
                ldaa    #NON_ZERO
                staa    OFFSET,y
                bra     continue
storeR          ldaa    counter
		staa    OFFSET,y
                bra     continue
store           ldaa    #ORIG_ZERO
           	staa    OFFSET,y
continue        inc     counter
		cpy     #End_Array
                bne     loop
                swi
                end