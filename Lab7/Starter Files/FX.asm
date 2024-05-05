; FX.asm
;
; Author: Zahi Masrwa
; Course: CST8216
; Student Number: 040985420
; Date: 2021-11-15
;
; Purpose:      To illustrate how to solve an equation such as:
;               f(x) = 5x + 3 for x = 0 to 9, using 8-bit Multiplication
;               The calculated x in f(x) values will be placed into the X_Values array
;               The calculated f(x) values will be placed into the Results array
;
ARRAY_LEN       equ     10      ; Number of values to calculate (10): x = 0 to 9
STACK           equ     $2000   ; Need two arrays of length ARRAY_LEN
Five            equ     5       ;constants
Three           equ     3
Start           equ     0
                                ; - one holds x = 0 to 9
                                ; - one holds f(x) results

        org        $1020                    ; org as per assignment instructions

X_Values                ; Complete this line of code
        ;db      0, 1, 2, 3, 4, 5, 6, 7, 8, 9                             ; Value of x used in calculation stored here
        ds      ARRAY_LEN
End_X_Values

        org        $1030                     ; org as per assignment instructions
        
Results
        ds        ARRAY_LEN                      ; Complete this line of code
                                ; Result of f(x) calculation stored here
End_Results

; Expected Results
         ;1020   1021    1022    1023    1024    1025    1026    1027    1028    1029
         ;0      1       2       3       4       5       6       7       8       9
         ;1030  1031    1032    1033    1034    1035    1036    1037    1038    1039
         ;$03    $08     $0d     $12     $17     $1c     $21     $26     $2b     $30
;


        org     $2000           ;org to start code
        lds     #STACK          ;load the stack
        ldaa    #start          ;load number to start from
        ldx     #X_Values       ;load the array to x
loop0   staa    1,x+            ;store num in A
        inca                    ;incarment A
        cpx     #End_X_Values   ;the end of the array
        bne     loop0           ;if not equal branch to loop0
        ldx     #Results        ;load x with the array saved
loop    ldaa    -16,x            ;load a on where x poninting
        ldab    #Five           ;load b with 5
        mul                     ;multply B*A
        addb    #Three          ;add 3 to B
        stab    0,x             ;store result in x
        inx			;incrament x
        cpx     #End_Results    ;the end of the array
        bne     loop            ;if not equal branch to loop

        swi                     ;intrupt
        end                     ;End of program