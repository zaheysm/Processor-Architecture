; Add_5_Plus_11.asm
;
; Author:               D. Haley
; Student Number:       nnn-nnn-nnn
; Date:                 13 Oct 2020
;
; Purpose:              Add the following values: 5 + 11
        org     $2000   ; Start Porogram Code
        ldaa    #5      ; first number to add
        ldab    #11     ; second number
        aba             ; a <- a + b with contents of a destroyed
        swi
        end
        
        