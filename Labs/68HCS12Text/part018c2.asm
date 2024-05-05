; 1 Mhz Square Wave
;; Copyright (c) 2007, Thomas Almy. All rights reserved. 
#include registers.inc
       org     PRSTART
       bset    TIOS #$80       ; Enable channel 7 output compare
       bset    TCTL1 #$40      ; Set OL7 for toggle output on PT7
       movw    #11 TC7          ; Reset at count 11 (12 counts total)
       bset    TSCR2 #$8       ; Set TCRE
       bset    TSCR1 #$80      ; Turn on timer module
; At this point we can do anything, and the square wave will be 
; continuously generated
idle:  nop
       nop
       nop
       bra idle
