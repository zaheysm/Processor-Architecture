; Direct Frequency Measuring Program
; Measures the number of rising edges on PT7 in 1 second
; Uses timer channel 6 to measure 1 second interval
; For DRAGON12, or simulator if DBUG12.s19 is loaded
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
        org     DATASTART       ; Data memory
frequency:                      ; Frequency is 32 bit integer
        ds      4
count:  ds      2               ; counter overflow count
mscnt:  ds      2               ; millisecond counter
val:    ds      4
chars:  ds      7               ; display characters
        org     PRSTART         ; Program Memory
        lds     #DATAEND        ; Initialize stack pointer
        movw    #0 frequency    ; initialize RAM
        movw    #0 frequency+2
        movw    #0 count
        movw    #0 mscnt
        movw    #0 PACN0        ; Pulse Accumulator counter = 0
        movw    #paovint UserPAccOvf ; Interrupt for counter overflow
        movw    #tc6int UserTimerCh6 ; Interrupt for channel 6
        bset    TSCR1 #$80      ; Set TEN (enables clock)
        bset    TIOS #$40       ; Channel 6 is Output compare
        bset    TIE #$40        ; Channel 6 will cause interrupt
        ldd     #24000          ; Next Channel 6 interrupt in 1ms
        addd    TCNT
        std     TC6
        bset    PACTL #$42      ; Set PAEN, PAOVI
        cli                     ; enable interrupts

        ; Idle process -- continuously prints frequency
idle:   
        ldx     frequency               ; high order word
        stx     val
        movw    frequency+2 val+2       ; low order word
        cpx     frequency               ; did high change?
        bne     idle                    ; then try again
        ldy     #chars+7                ; Convert to 7 digit number
chloop: ldd     val             ; We have to divide a 32 digit number
        ldx     #10             ; by 10, but a 32 digit product is
        idiv                    ; possible -- we need two divide steps
        stx     val             ; Divide of upper word completed
        pshy
        tfr     d y
        ldd     val+2           ; Divide (remainder 1st divide : low order)
        ldx     #10             ; by 10
        ediv
        sty     val+2           ; Divide of lower word completed
        puly
        addb    #'0             ; Final remainder is digit index
        stab    1,-y            ; goes into character array 
        cpy     #chars          ; repeat 6 times
        bne     chloop
prloop: ldab    1,y+            ; Now print the characters
        pshy
        jsr     [PutChar-*-4,pc]
        puly
        cpy     #chars+7
        bne     prloop
        ldab    #$0d            ; followed by CR and LF
        jsr     [PutChar-*-4,pc]
        ldab    #$0a
        jsr     [PutChar-*-4,pc]
        bra     idle            ; repeat process forever...

paovint:        ; Interrupt service routine -- PACN0 overflow
        ldx     count           ; increment overflow count
        inx
        stx     count
        bclr    PAFLG #~2       ; reset PAOVF
        rti

tc6int:         ; Interrupt service routine -- Timer Channel 6
        ldd     TC6             ; Next interrupt in 1 ms
        addd    #24000
        std     TC6
        bclr    TFLG1 #~$40     ; Reset C6F
        ldx     mscnt           ; Increment millisecond counter
        inx
        cpx     #1000           ; One second elapsed?
        beq     onesecond
        stx     mscnt           ; store count
        rti                     ; wait for next millisecond
onesecond:
        ldx     PACN3           ; get count
        movw    #0 PACN3        ;   then reset count
        ldy     count           ; get upper count
        movw    #0 count        ;   then reset count
        brclr   PAFLG #2 noov   ; branch if no PAOV yet
        bclr    PAFLG #~2       ;  reset PAOV
; If there is an overflow, it may have occured before the
; PACN0 value we are looking at
        cpx     #0              ; Is PACN0 large?
        bmi     noov            ; Then no adjustment
        iny                     ; else adjust upper count
noov:   stx     frequency+2     ; store the frequency
        sty     frequency
        movw    #0 mscnt        ; reset counter
        rti
