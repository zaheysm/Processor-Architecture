; 68HC12 Floating Point Library
;; Copyright (c) 2000, Thomas Almy. All rights reserved. 
;; Thomas Almy makes no representation about the suitability
;; of this software for any purpose. It is provided as is without
;; warranty of any kind, expressed or implied.

; This library implements the following IEEE short
; floating point operations (except for NANs other than +INF and -INF):
; fpFloat -- convert integer to floating point
; fpFix -- convert floating point to 32 bit integer. Sets V condition
;          code if value doesn't fit.
; fpNegate -- negate a floating point number. Note that there are both
;             positive and negative zeroes.
; fpAdd -- add two floating point values
; fpMultiply -- multiply two floating point values
; fpDivide -- divide two floating point values
; fpCompare -- compare two floating point values, setting condition codes
;              for a following signed comparison instruction.
;              note that +0 and -0 compare as equal.
; fpTest -- set N,V,Z condition codes based on fp value.
;           note that N=1,V=1 for negative infinity
;                     N=0,V=1 for positive infinity
;                     N=1,Z=1 for negative zero

; All arguments and results are 32 bits and passed on stack, 
; with the stack pointer adjusted automatically by the functions. 
; The second argument pushed on the stack is the divisor in the case of
; fpDivide, and the second comparand (equivalent to the memory argument)
; in the case of fpCompare. 

; No registers are preserved by any function.

FSIGN:  equ     0       ; Offset to byte with sign bit
FEXPO:  equ     1       ; Offset to byte with exponent
FHIGH:  equ     2       ; offset to high word of fraction
FLOW:   equ     4       ; offset to low word of fraction
FPSIZE: equ     6       ; Size of an unpacked floating point value
FPOFF:  equ     FPSIZE*2+2 ; offset to function arguments if two unpacked
                        ; FP values have been pushed on the stack


fpFloat: ; Convert integer to floating point
        ldy     #0
        ldx     4,sp    ; LSW of integer value (on stack)
        ldd     2,sp    ; MSW of integer value (on stack)
        bmi     fpFloatMi       ; value is negative
        bne     fpFloatPl       ; value is positive
        cpx     #0
        beq     fpFloatZer      ; value is zero -- we are done
        bra     fpFloatPl
fpFloatMi:
        ldy     #$8000
        coma                    ; Negate value
        comb
        exg     D X
        coma
        comb
        addb    #1
        adca    #0
        exg     D X
        adcb    #0
        adca    #0
fpFloatPl:
        pshx            ; Push low fraction then high fraction
        pshd
        movb    #150 1,-SP      ; Push exponent value 150
        tfr     Y D
        psha                    ; push sign
        tfr     SP X    ; unpacked value is at SP
        leay    8,SP    ; result to go to location of 32 bit integer
        jsr     fpPack
        leas    FPSIZE,SP ; Reset stack to point at start of function

fpFloatZer:     
        rts



fpFix:  ; Convert floating point to integer
        ; Set V flag if overflow occurs
        leax    2,SP    ; Check for zero and NAN
        jsr     fpSetCC
        bne     fpFixNonZero
	clr	2,SP	; clear sign bit if set
fpFixRet:
        rts             ; If zero, we are done
fpFixNonZero:
        bvs     fpFixRet ; if NAN, we are done (OV)
        leas    -FPSIZE,SP      ; Allow space on stack for unpacked value
        leax    8,SP    ; Address of value to convert
        tfr     SP Y    ; Address of unpacked value
        jsr     fpExtract
        ldaa    #150    ; Convert to integer
        tfr     SP X
        jsr     fpAdj
        bvs     fpFixOV ; Overflow      
        tst     FSIGN,SP ; Result Negative?
        bmi     fpFixNeg
        tst     FHIGH,SP ; High bit set?
        bmi     fpFixNAN ;  then overflow
        movw    FHIGH,SP FPSIZE+2,SP    ; Got result
        movw    FLOW,SP FPSIZE+4,SP
fpFixOV:
        leas    FPSIZE,SP       ; restore stack
        rts                     ; return with V flag set if there was overflow
fpFixNeg:
        leas    2,SP    ; Toss sign and exponent fields
        puld            ; high order result
        pulx            ; low order result
        coma            ; negate result
        comb
        exg     X D
        coma
        comb
        addb    #1
        adca    #0
        std     4,SP    ; store low order
        tfr     X D     ; get high order in  D
        adcb    #0      ; and continue negating
        adca    #0
        std     2,SP    ; store high order
        clv
        rts             ; done
fpFixNAN:
        sev             ; set overflow flag
        bra     fpFixOV ;  and indicate overflow
        

fpNegate: ; Negate floating point value
        ldaa    2,sp    ; Get MSB of value
        eora    #$80    ; Toggle Sign bit
        staa    2,sp
        rts

fpAdd:  ; Add Two floating point values
        leax    6,SP    ; first value on stack
        jsr     fpSetCC ; see if zero or NAN
        lbeq    fpMul2AdjRet    ; zero -- return other
        lbvs    fpMulAdjRet     ; OV -- return this
        leax    2,SP    ; second value on stack
        jsr     fpSetCC ; see if zero or NAN
        lbeq    fpMulAdjRet     ; zero -- return other
        lbvs    fpMul2AdjRet    ; OV -- return this
        leas    -FPSIZE*2,SP    ; Reserve space for two unpacked fp values
        leay    FPSIZE,SP       ; Unpack values
        jsr     fpExtract
        leax    FPSIZE*2+6,SP
        tfr     SP Y
        jsr     fpExtract
        ldaa    FEXPO,SP ; Which exponent is smaller?
        cmpa    FEXPO+FPSIZE,SP
        beq     fpAddNoAdj ; same
        blo     fpAddAdj1  ; first is smaller
                           ; second is smaller
        leax    FPSIZE,SP  ; adjust exponent to match
        jsr     fpAdj
        bra     fpAddNoAdj
fpAddAdj1:
        ldaa    FEXPO+FPSIZE,SP ; adjust exponent to match
        tfr     SP X
        jsr     fpAdj
fpAddNoAdj:                ; exponent in first value
        staa    FEXPO,SP
        ldaa    FSIGN,SP   ; add or really subtract?
        eora    FSIGN+FPSIZE,SP
        bmi     fpAddSubtract   ; signs differ so subtract
        ldd     FLOW,SP         ; Add fractions
        addd    FLOW+FPSIZE,SP
        std     FLOW,SP
        ldaa    FHIGH+1,SP
        adca    FHIGH+1+FPSIZE,SP
        staa    FHIGH+1,SP
        ldaa    FHIGH,SP
        adca    FHIGH+FPSIZE,SP
        staa    FHIGH,SP
fpAddJoin:
        tfr     SP X            ; now pack result
        leay    FPSIZE*2+6,SP
        jsr     fpPack
        leas    FPSIZE*2,SP     ; remove local variables from stack
        pulx                    ; get return address
        leas    4,SP            ; remove second fp argument
        pshx                    ; push return address back on stack
        rts                     ; and return
fpAddSubtract:                  ; Really do subtract
        ldd     FLOW,SP         ; Subtract fractions
        subd    FLOW+FPSIZE,SP
        std     FLOW,SP
        ldaa    FHIGH+1,SP
        sbca    FHIGH+1+FPSIZE,SP
        staa    FHIGH+1,SP
        ldaa    FHIGH,SP
        sbca    FHIGH+FPSIZE,SP
        staa    FHIGH,SP
        bge     fpAddJoin       ; sign is correct, so rejoin add code
        ldd     FHIGH,SP        ; 2's complement value
        ldx     FLOW,SP
        coma
        comb
        exg     D X
        coma
        comb
        addb    #1
        adca    #0
        std     FLOW,SP
        tfr     X D
        adcb    #0
        adca    #0
        std     FHIGH,SP
        ldaa    FSIGN+FPSIZE,SP ; Use other sign
        staa    FSIGN,SP
        bra     fpAddJoin

fpMul2AdjRet:
        movw    2,SP 6,SP       ; move second to first
        movw    4,SP 8,SP
fpMulAdjRet:
        movw    0,SP 4,SP       ; shift return address over
        leas    4,SP    ; adjust stack pointer
        rts

fpMultiply:     ; Multiply two floating point values
        leax    6,SP    ; First value on stack
        jsr     fpSetCC
        beq     fpMulAdjRet ; return first value (zero)
        bvs     fpMulAdjRet ; return first value (NAN)
        leax    2,SP    ; Second value on stack
        jsr     fpSetCC
        beq     fpMul2AdjRet    ; return second
        bvs     fpMul2AdjRet    ; return second
        leas    -FPSIZE*2,SP    ; Reserve space for two unpacked fp values
        leay    FPSIZE,SP       ; unpack values
        jsr     fpExtract
        leax    FPOFF+4,SP
        tfr     SP Y
        jsr     fpExtract
        ldd     FLOW,SP         ; lower product
        ldy     FLOW+FPSIZE,SP
        emul
        std     FPOFF+4,SP              ; save product
        sty     FPOFF+2,SP
        ldd     FHIGH,SP        ; first cross product
        ldy     FLOW+FPSIZE,SP
        emul
        addd    FPOFF+2,SP              ; partial sum
        std     FPOFF+2,SP
        tfr     Y D
        adcb    #0
        adca    #0
        std     FPOFF,SP
        ldd     FLOW,SP         ; second cross product
        ldy     FHIGH+FPSIZE,SP
        emul
        addd    FPOFF+2,SP              ; partial sum
        std     FPOFF+2,SP
        tfr     Y D
        adcb    #0
        adca    #0
        addd    FPOFF,SP                ; we can't get a carry out here
        std     FPOFF,SP
        ldd     FHIGH,SP        ; high order product
        ldy     FHIGH+FPSIZE,SP
        emul
        addd    FPOFF,SP                ; partial sum
        std     FPOFF,SP                ; no carry possible
        ldab    FEXPO,SP        ; get exponent of product
        clra
        std     FPOFF+6,SP              ; save first exponent
        ldab    FEXPO+FPSIZE,SP
        clra
        addd    FPOFF+6,SP              ; Sum of exponents
        subd    #126            ; correct offset and product decimal point loc
fpMulJoin:
        ble     fpMulTooSmall   ; negative or zero means small result
        tst     FPOFF,SP                ; maybe normalize
        bmi     fpMulNormDone
fpMulNorm:
        subd    #1              ; adjust exponent
        beq     fpMulZero       ; product too small
        asl     FPOFF+5,SP      ; shift product
        rol     FPOFF+4,SP
        rol     FPOFF+3,SP
        rol     FPOFF+2,SP
        rol     FPOFF+1,SP
        rol     FPOFF,SP
        bpl     fpMulNorm
fpMulNormDone:
        leax    FPOFF,SP                ; move fraction into place
        leay    FHIGH,SP
        clr     1,Y+            ; first byte zero
        movb    1,X+ 1,Y+       ; second byte
        movw    0,X  0,Y        ; 3rd and 4th bytes
        cpd     #254            ; Is value not too high?
        ble     fpMulNormOK
        ldab    #255            ; Then indicate NAN
fpMulNormOK:
        stab    FEXPO,SP
        ldaa    FSIGN,SP        ; calculate sign
        eora    FSIGN+FPSIZE,SP
        staa    FSIGN,SP
        tfr     SP X
        leay    FPOFF+4,SP
        jsr     fpPack          ; pack up result
        leas    FPSIZE*2,SP     ; restore stack
        jmp     fpMulAdjRet
fpMulTooSmall:
        addd    #1              ; adjust exponent
        lsr     FPOFF,SP                ; shift result right
        ror     15,SP
        ror     FPOFF+2,SP
        cpd     #1
        bne     fpMulTooSmall
        bra     fpMulNormDone


fpMulZero:
        ldd     #1              ; Minimum exponent
        bra     fpMulNormDone

fpDivide:       ; Divide two floating point values
        leax    6,SP            ; dividend (numerator)
        jsr     fpSetCC
        lbeq    fpMulAdjRet     ; zero -- return it
        bvs     fpDivNAN        ; NAN -- return it in correct sign
        leax    2,SP    ; divisor
        jsr     fpSetCC
        bne     fpDivNotInf     ; not division by zero
        ldaa    2,SP    ; Set sign bit propery
        eora    6,SP
        oraa    #$7f    ; indicate NAN
        ldab    #$80
        std     6,SP
        movw    #0 8,SP
        jmp     fpMulAdjRet     ; return first value on stack
fpDivNAN:                       ; INF divided by anything
        ldaa    2,SP
        anda    #$80            ; get sign of divisor
        eora    6,SP            ; correct sign of product
        staa    6,SP
        jmp     fpMulAdjRet
fpDivZER:                       ; Anything divided by infinity
        ldaa    2,SP            ; correct sign
        eora    6,SP
        anda    #$80            ; zero other bits
        clrb
        std     6,SP
        clra
        std     8,SP
        jmp     fpMulAdjRet
fpDivNotInf:
        bvs     fpDivZER        ; NAN -- return zero
        leas    -FPSIZE*2,SP    ; Reserve space for two unpacked fp values
        leax    FPOFF+4,SP
        leay    FPSIZE,SP       ; unpack values (dividend)
        jsr     fpExtract
        leax    FPOFF,SP                ; and divisor
        tfr     SP Y
        jsr     fpExtract

; Algorithm says that to do divide, qh:ql = nh:nl/dh, then subtract 
; qh*dl/dh. We need to start with normalized denominator for this to work,
; which means we need to normalize any gradual underflowed denominators.
        ldab    FEXPO,SP
        clra
fpDivNorm:
        tst     FHIGH+1,SP      ; normalized?
        bmi     fpDivNormDone
        asl     FLOW+1,SP       ; shift left
        rol     FLOW,SP
        rol     FHIGH+1,SP
        subd    #1              ; decrement exponent
        bra     fpDivNorm
fpDivNormDone:
        std     FPOFF+6,SP              ; save exponent for later
        ldab    FEXPO+FPSIZE,SP ; is numerator normalized?
        clra
fpDivNormNum:
        tst     FHIGH+1+FPSIZE,SP
        bmi     fpDivNormND
        asl     FLOW+1+FPSIZE,SP
        rol     FLOW+FPSIZE,SP
        rol     FHIGH+1+FPSIZE,SP
        subd    #1
        bra     fpDivNormNum
fpDivNormND:
        subd    FPOFF+6,SP              ; difference between exponents
        addd    #127            ; correct offset
        std     FPOFF+6,SP
        ldd     FHIGH+1+FPSIZE,SP       ; nh, and shift right by 1
        lsrd
        tfr     D Y
        ldaa    FLOW+1+FPSIZE,SP        ; nl
        rora
        rorb
        andb    #$80            ; only msb here
        ldx     FHIGH+1,SP      ; dh
        ediv
        sty     FPOFF,SP                ; qh
        tfr     D Y             ; remainder is high order for second divide
        ldd     #0              ; low order is zero
        ldx     FHIGH+1,SP      ; dh
        ediv
        sty     FPOFF+2,SP              ; ql
        ldy     FPOFF,SP                ; qh
        ldaa    FLOW+1,SP       ; dl
        clrb
        emul
        ldx     FHIGH+1,SP      ; dh
        ediv
        sty     FPOFF+4,SP              ; save this
        ldd     FPOFF+2,SP              ; do the subtract
        subd    FPOFF+4,SP
        std     FPOFF+2,SP
        ldd     FPOFF,SP
        sbcb    #0
        sbca    #0
        std     FPOFF,SP
        ldd     FPOFF+6,SP              ; get exponent
        jmp     fpMulJoin       ; join multiply routine

fpCompare:      ; Compare two floating point values and
                ; set the Z and N flags appropriately to
                ; allow a following conditional branch
        ldaa    2,SP            ; check sign bit of second
        bmi     fpComp2neg      ; it's negative
        ldd     6,SP            ; check sign bit of first
        bmi     fpCompLT        ; negative -- first is less
        subd    2,SP            ; subtract second
        bne     fpCompJoin      ; if not equal, condition codes set
        ldd     8,SP            ; compare lower words
        subd    4,SP
        bra     fpCompJoin      ; condition codes are set
fpComp2neg:
        ldaa    6,SP            ; check sign bit of first
        bpl     fpCompGT        ; if positive, first is greater
        anda    #$7f
        staa    6,SP
        ldd     2,SP            ; compare (after clearing sign bits)
        anda    #$7f
        subd    6,SP
        bne     fpCompJoin
        ldd     4,SP            ; compare lower words
        subd    8,SP
        bra     fpCompJoin
fpCompLT:       ; first is less, check for comparing zeroes first
        ldaa    6,SP            ; get negative value
        anda    #$7f            ; clear sign bit
        bne     fpCompLT2       ; any non-zero means it's not a zero
        tst     7,SP
        bne     fpCompLT2
        ldd     2,SP
        bne     fpCompLT2
        ldd     4,SP
        bne     fpCompLT2
        ldd     8,SP
        beq     fpCompJoin
fpCompLT2:
        ldaa    #-1             ; set condition codes for "less"
fpCompJoin:
        movw    0,SP 8,SP       ; shift return address over
        leas    8,SP            ; adjust stack pointer
        rts
fpCompGT:       ; first greater, check for comparing zeroes first
        ldaa    2,SP            ; get negative value
        anda    #$7f            ; clear sign bit
        bne     fpCompGT2       ; any non-zero means it's not a zero
        tst     3,SP
        bne     fpCompGT2
        ldd     6,SP
        bne     fpCompGT2
        ldd     4,SP
        bne     fpCompGT2
        ldd     8,SP
        beq     fpCompJoin
fpCompGT2:
        ldaa    #1              ; set condition codes for "greater"
        bra     fpCompJoin


fpTest:         ; Set Z, N, and V flags based on value
        leax    2,SP    ; address of fp value
        jsr     fpSetCC
        movw    0,SP 4,SP       ; shift return address over
        leas    4,SP    ; adjust stack pointer
        rts


fpExtract:      ; Extract IEEEFP fields.
                ; X - address of IEEE FP value
                ; Y - address of Unpacked value 
        ldd     0,X     ; MSW of IEEE value
        asld            ; Shift to left, A has exponent
        ldab    #0
        rorb            ; Shift sign bit into b
        stab    FSIGN,Y ; Save sign and exponent
        staa    FEXPO,Y
        beq     fpExZer ; Exponent is zero -- branch
        ldd     0,X     ; Get MSW again
        clra
        orab    #$80    ; Set hidden msb of fraction
        bra     fpExZerJoin
fpExZer:
	inc	FEXPO,Y	; Exponent=1
        ldd     0,X     ; Get MSW again
        clra            ; clear exponent and sign bits
        andb    #~$80
fpExZerJoin:
        std     FHIGH,Y ; Store high order fraction
        movw    2,X FLOW,Y ; Move low order 
        rts

fpPack:         ; Pack into IEEE FP
                ; X - address of unpacked value
                ; Y - address of IEEE FP value
        ldaa    FEXPO,X ; Is this a NAN?
        cmpa    #255
        beq     fpPackOV
        tst     FHIGH,X ; Is MSByte of fraction non-zero?
        bne     fpPackRS
fpPack2:
        tst     FHIGH+1,X ; Is Bit 23 of fraction non-zero?
        bmi     fpPackDone
fpPackLS:
        ldaa    FEXPO,X   ; Is exponent 1?
        cmpa    #1
        beq     fpPackSmall
        deca              ; Decrement exponent and shift fraction
        staa    FEXPO,X
        asl     FLOW+1,X
        rol     FLOW,X
        rol     FHIGH+1,X
        bpl     fpPackLS  ; If bit 23 zero, repeat
fpPackDone:
        movw    FLOW,X 2,Y      ; Move low fraction
        ldab    FHIGH+1,X       ; Get high fraction
        ldaa    FEXPO,X         ; and exponent
        rolb                    ; juggle some bits
        lsrd 
        anda    #~$80           ; clear sign bit
        oraa    FSIGN,X         ; ANd insert correct bit
        std     0,Y             ; store upper word of IEEE value
        rts
fpPackSmall:
        clr     FEXPO,X         ; Make exponent 0
        bra     fpPackDone      ;  small unnormalized result
fpPackRS:
        ldd     FHIGH,X         ; Shift to right
        lsrd
        std     FHIGH,X
        ror     FLOW,X
        ror     FLOW+1,X
        ldaa    FEXPO,X         ; increment exponent
        inca
        staa    FEXPO,X
        cmpa    255             ; Overflow?
        beq     fpPackOV
        tst     FHIGH,X         ; Is MSByte still non zero?
        bne     fpPackRS
        bra     fpPackDone


fpPackOV:       ; Set IEEE value pointed to by Y to NAN (Overflow)
        ldd     #$7f80          ; High order
        oraa    FSIGN,X         ; maybe set sign
        std     0,Y
        movw    #0 2,Y          ; low order is zero
        rts

fpAdj:          ; Adjust exponent to value in A. Unpacked value
                ; pointed to by X. Returns V CCF set if overflow
                ; occurs
        cmpa    FEXPO,X         ; See how we are doing
        bhi     fpAdjRS         ; Exponent too low -- shift right
        blo     fpAdjLS         ; Exponent too high -- shift left
        rts                     ; Everything is fine
fpAdjRS:
        inc     FEXPO,X         ; increment exponent
        lsr     FHIGH+1,X       ; shift to right (must be <=24 bits)
        ror     FLOW,X
        ror     FLOW+1,X
        cmpa    FEXPO,X         ; how are we doing?
        bhi     fpAdjRS         ; shift some more
        rts                     ; Done
fpAdjLS:
        dec     FEXPO,X         ; decrement exponent
        asl     FLOW+1,X        ; shift to left
        rol     FLOW,X
        rol     FHIGH+1,X
        rol     FHIGH,X
        bcs     fpAdjOV         ; trouble if carry out
        cmpa    FEXPO,X         ; how are we doing?
        blo     fpAdjLS         ;  shift some more
        rts                     ; done
fpAdjOV:
        sev                     ; set overflow
        rts                     ; and return

fpSetCC:        ; Set condition codes based on fp number
                ; pointed to by X register
        ldd     0,X     ; get MSW of value
        beq     fpSetMaybeZero
        cpd     #$8000  ; perhaps negative zero?
        beq     fpSetMaybeZeroN
        asld            ; get exponent
        cmpa    #255    ; check for overflow
        beq     fpSetOV
        ldd     0,X     ; Set N=sign, V=0, Z=0
        rts
fpSetMaybeZero:
        ldd     2,X     ; set or clear Z
        andcc   #~$8    ; clear N
        rts
fpSetMaybeZeroN:
        ldd     2,X     ; set or clear Z
        orcc    #$8     ; set N (V is clear)
        rts
fpSetOV:
        ldd     0,x     ; set or clear N, clear Z
        sev             ; set V
        rts
