; Author:               Zahi Masarwa
; Student Number:       040985420
; Date:                 15 Oct 2021

Stack	equ        $2000

        org     $1000
Numbers db      $01, $55, $22, $fe, $08
Result  ds            1
HST     db      15

        org     $2000
        lds     #Stack
        ldx     #Numbers
        ldaa    HST
        ldaa    3,x
        ldab    3,x+
        std     Result
        swi
        end
        