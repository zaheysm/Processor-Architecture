; BNE_Version1.asm
; Author         David Haley, Professor
; Date           6 June 2021
; Purpose        A simple program that illustrates a Branch Equal Zero statement
;                after SBA, the instruction for "Subtract A from B"
;
        org     $2000

        ldaa    #$05
        ldab    #$05
        sba
        bne     Result1
Result2 ldaa    #$AA
        bra Finish
Result1 ldaa  #$FF
Finish  ; some code
        swi
        end
        
        