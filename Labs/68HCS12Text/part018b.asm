; Program to generate square wave
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
#include registers.inc
    org     PRSTART
    bset    TSCR1 #$90      ; Set TEN and TFFCA bits
    bset    TIOS #$8        ; Set IOS3 (channel 3 is output compare)
    bset    TCTL2 #$40      ; Set OL3 (Toggle PT3 on successful compare)
    ldd     TCNT            ; Get current time
    addd    #5*24           ; add 5 microseconds of counts
    std     TC3             ; Flag sets in 5 microseconds
L1: brclr   TFLG1 #$8 L1    ; "Wait" until C3F flag sets.
    addd    #5*24           ; Calculate time for next transition
    std     TC3             ; Set time and reset flag.
    bra     L1
