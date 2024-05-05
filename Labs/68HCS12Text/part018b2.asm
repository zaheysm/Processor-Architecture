; Asymmetric Square Wave Generator
; For DRAGON12, or simulator if DBUG12.S19 loaded.
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
        org     DATASTART       ; Data Memory (internal RAM)
state:  ds      2               ; State pointer
lotime: ds      2               ; Time (in TCNT counts) for low level
hitime: ds      2               ; TIme (in TCNT counts) for high level

        org     PRSTART         ; Program memory
entry:
        ; Initialization code
        lds     #DATAEND        ; Initialize stack pointer
        movw    #state1 state   ; Initialize data memory
        movw    #10*24 lotime   ; Low for 10 microseconds
        movw    #20*24 hitime   ; High for 20 microseconds
        movw    #tc0int UserTimerCh0 ; Set interrupt vector using D-BUG12
        bset    TIOS #1         ; Set IOS0 bit
        bset    TSCR1 #$90      ; Set TEN and TFFCA bits
        bset    TIE #$1         ; Set C0I bit
        bset    TCTL2 #$3       ; Set OM0 OL0 so compare sets PT0 to 1
        ldd     TCNT            ; Set initial count
        addd    lotime
        std     TC0
        cli                     ; allow interrupts

        ; Idle process
idle:   wai
        bra     idle

        ; Interrupt Service Routine
tc0int:
        ldx     state           ; Jump to current state
        jmp     0,x
state1:                         ; Changed to High
        bclr    TCTL2 #$1       ; Clear OL0 so next match changes PT0 to 0
        ldd     TC0             ; Set time for next match
        addd    hitime
        std     TC0
        movw    #state2 state   ; Set next state
        rti
state2:                         ; Changed to Low
        bset    TCTL2 #$1       ; Set OL0 so next match changes PT0 to 1
        ldd     TC0             ; Set time for next match
        addd    lotime
        std     TC0
        movw    #state1 state   ; Set next state
        rti
