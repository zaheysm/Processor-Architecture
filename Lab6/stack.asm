
STACK   equ	$2000
        org     $1000
Data    db      $93, $53, $21, $11, $10
        
        org     $2000
        lds     #STACK
        ldd     #$0000
        ldaa    Data
        tfr     a,b
        ldx     #Data+1
        psha
        ldaa    #$02
        ldab    a,x
        pshb
        pshx
        jsr     Here
        pulx
        pula
        pulb
        bra     Finsih
Here    ldaa    Data+2
        clrb
        dex
        rts
Finsih  swi
        end
        