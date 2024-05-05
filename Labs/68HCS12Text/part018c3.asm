; 10kHz PWM square wave on PT0
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
#include registers.inc
        org     PRSTART
        bset    TIOS #$81       ; Enable channel 7, 0 output compares
        bset    OC7M #$1        ; Channel 7 compare drives PT0 high
        bset    OC7D #$1
        bset    TCTL2 #$2       ; Channel 0 compare drives PT0 low
        movw    #2399 TC7       ; Reset at count 2399 (2400 counts total)
        movw    #1199 TC0       ; Toggle at count 1199 (50% duty cycle)
        bset    TSCR2 #$8       ; Set TCRE
        bset    TSCR1 #$80      ; Turn on timer module
; At this point we can do anything, and the square wave will be 
; continuously generated
idle:   nop
        nop
        nop
        bra     idle
