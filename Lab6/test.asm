; Author:               Zahi Masarwa
; Student Number:       040985420
; Date:                 02 Nov 2021










STACK           equ     $2000
FIRSTNUM        equ     $16
SECONDNUM       equ     16
THIRDNUM        equ     #%00111100

                org     $1000
MyArray         db      $F9, $62, $18, $D9, $04
Result          ds      2

                org     $2000
Start           lds     #STACK

                ldaa    #FIRSTNUM
                ldab    #SECONDNUM
                adda    MyArray+2
                staa    Result
                stab    Result+1
                ldaa    MyArray+4
                ldab    Result
                decb
                ldaa    #THIRDNUM
                coma
                std     Result
                swi
                end
                