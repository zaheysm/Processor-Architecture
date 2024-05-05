; Program to measure time PT7 is high
; For DRAGON12, or simulator if DBUG12.S19 loaded.
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
        org     DATASTART       ; Data memory (Internal RAM)
highTime: ds    4               ; Time (in 2 2/3 microsecond units)

        org     PRSTART         ; Program Memory
entry:  ; Initialization code
        lds     #DATAEND        ; Initialize stack pointer
        movw    #0 highTime     ; Set highTime to zero
        movw    #0 highTime+2
        movw    #paeint UserPAccEdge  ; Set interrupt vectors using D-BUG12
        movw    #paovint UserPAccOvf
        bset    TSCR1 #$80      ; Set TEN (enables clock)
        bset    PACTL #$63      ; Set PAEN, PAMOD, PAOVI, and PAI
        cli                     ; enable interrupts

idle:   wai                     ; Idle routine
        bra     idle

paeint: ; Pulse Accumulator Edge Interrupt Service Routine
        ; Input has gone low, so add count to time and
        ; reset the count for the next high input
        ldd     PACN3           ; Add PACN3 to highTime and
        movw    #0 PACN3        ;  reset PACN3
        addd    highTime+2
        std     highTime+2
        bcc     noC             ; Branch if no carry into high order
        ldd     highTime        ; Increment high order
        addd    #1
        std     highTime
noC:    bclr    PAFLG #~$1      ; Reset PAIF flag
        rti

paovint: ; Pulse Accumulator Overflow Interrupt Service Routine
        ; PACN3 has overflowed during a period when input is high.
        ; We need to record the overflow, which is done by 
        ; incrementing the high order highTime count.
        bclr    PAFLG #~$2      ; Reset PAOVF flag
        ldd     highTime        ; Increment high order
        addd    #1
        std     highTime
        rti
