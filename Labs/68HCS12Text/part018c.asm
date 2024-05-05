; OC7 Multiple Square Wave Generator
; For DRAGON12, or simulator if DBUG12.S19 loaded.
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
        org     PRSTART         ; Program memory
entry:
        ; Initialization code
        lds     #RAMEND         ; Initialize stack pointer
        movw    #tc7int UserTimerCh7   ; Set interrupt vector using D-BUG12
        bset    TIOS #$ff       ; Set all TIOS bits 
                                ;  (all pins will be driven)
        bset    OC7M #$ff       ; Set all OC7M bits
                                ;  (drive from OC7)
        bset    TSCR1 #$90      ; Set TEN and TFFCA bits
        bset    TIE #$80        ; Set C7I bit
        ldd     TCNT            ; Set initial count
        addd    #10*24
        std     TC7
        cli                     ; allow interrupts

        ; Idle process
idle:   wai
        bra     idle

        ; Interrupt Service Routine
tc7int:
        inc     OC7D            ; Increment OC7D
        ldd     TC7             ; Set time for next match
        addd    #10*24
        std     TC7
        rti
