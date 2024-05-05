; Multiple-precision Multiplication Example
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
        org     $1000    ; DATA RAM
A1:     ds      1       ; Variable AB is multiplicand
B1:     ds      1
C1:     ds      1       ; Variable CD is multiplier
D1:     ds      1
E1:     ds      1       ; Variable EFGH is product
F1:     ds      1
G1:     ds      1
H1:     ds      1
        org     $2000   ; PROGRAM RAM
        ldaa    B1      ; Multiply B by D
        ldab    D1
        mul
        std     G1      ; Product goes in GH
        ldaa    A1      ; Multiply A by C
        ldab    C1
        mul
        std     E1      ; product goes in EF
        ldaa    B1      ; Multiply B by C
        ldab    C1      
        mul
        addd    F1      ; Product added to FG
        std     F1
        ldaa    E1      ; Add carry into E
        adca    #0
        staa    E1
        ldaa    A1      ; Multiply A by D
        ldab    D1
        mul
        addd    F1      ; Product added to FG
        std     F1
        ldaa    E1      ; Add carry into E
        adca    #0
        staa    E1
	swi
