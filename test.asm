; Author:               Zahi Masarwa
; Student Number:       040985420
; Date:                 02 Nov 2021










STACK           equ     $2000
FIRSTNUM        equ     64
SECONDNUM       equ     $64


                org     $1000
myArray         db     	$1c,$44,$18,$ec,$cf
Result          ds      2


                org     $2000
Start           lds     #STACK

                ldaa    FIRSTNUM
                ldab    SECONDNUM
                ldy     myArray
                negb
                ldaa     myArray+3

                std    Result
                swi
                end
                