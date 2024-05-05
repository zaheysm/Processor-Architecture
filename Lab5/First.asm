; Firs.asm
;
; Author:               Zahi Masarwa
; Student Number:       040985420
; Date:                 15 Oct 2021

; Purpose:              Program to add up the following values: $26 + $37 - $01
;
        org     $1000   ; Origin for Program data
p:      db      $81     ; first addend is at memory location p
q:      db      $37     ; second addend is memory location q
r:      ds      1       ; sum will be stored at memory location r

        org     $2000   ; Origing for Program Instructions
        ldaa    p       ; load value at p into accumulator a
        adda    q       ; load value at q into accumulator a
        deca            ; subtract 1: A = A - 1
        staa    r       ; store accumulator A at location r
        end             ; stop program exucation
