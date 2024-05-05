;; Take the squareroot of a value using Newton's method.
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
;;
;; The variable val must be initialized before starting the
;; program.
#include registers.inc
        org     RAMSTART
val     ds      4       ; value of which to take the square root
sqrt    ds      4       ; the square root
        org     PRSTART
start:  lds     #RAMEND
        movw    val sqrt ; first estimate
        movw    val+2 sqrt+2
        ldaa    #7              ; 7 iterations
loop:   psha                    ; save iteration count
        movw    val+2 2,-sp     ; calculate val/sqrt
        movw    val 2,-sp
        movw    sqrt+2 2,-sp
        movw    sqrt 2,-sp
        jsr     fpDivide
        movw    sqrt+2 2,-sp    ; val/sqrt + sqrt
        movw    sqrt 2,-sp
        jsr     fpAdd
        movw    #0 2,-sp        ; 0.5
        movw    #$3f00 2,-sp
        jsr     fpMultiply
        movw    2,sp+ sqrt      ; new sqrt = (val/sqrt + sqrt)*0.5
        movw    2,sp+ sqrt+2
        pula                    ; iteration count
        dbne    a loop
        swi			; finished - return to the debugger
#include fplib.asm
        end
