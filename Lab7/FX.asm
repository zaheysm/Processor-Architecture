; FX.asm
;
; Author:
; Course:
; Student Number:
; Date:
;
; Purpose:      To illustrate how to solve an equation such as:
;               f(x) = 5x + 3 for x = 0 to 9, using 8-bit Multiplication
;               The calculated x in f(x) values will be placed into the X_Values array
;               The calculated f(x) values will be placed into the Results array
;
ARRAY_LEN       equ     10      ; Number of values to calculate (10): x = 0 to 9
                                ; Need two arrays of length ARRAY_LEN
                                ; - one holds x = 0 to 9
                                ; - one holds f(x) results

        org                     ; org as per assignment instructions
X_Values
        ds                      ; Complete this line of code
                                ; Value of x used in calculation stored here
End_X_Values

        org                     ; org as per assignment instructions
        
Results
        ds                      ; Complete this line of code
                                ; Result of f(x) calculation stored here
End_Results

; Expected Results

;


        org     $2000



        swi
        end