; Add_5_Plus_6.asm
;
; Author:               D. Haley
; Student Number:       nnn-nnn-nnn
; Date:                 13 Oct 2020
;
; Purpose:              Add the following values: 5 + 6
        org     $2000   ; Program Code location
        ldaa    #5      ; first number to add
        ldab    #6      ; second number to add
        aba             ; a <- a + b with contents of a destroyed
        swi             ; stop simulator
        end