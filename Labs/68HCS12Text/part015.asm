; Simple interrupt example
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
;	org     $FFFE		; Set starting location if a standalone application
;       dw      entry
;       org     $FFF0           ; Set interrupt vector (no D-BUG12)
;       dw      rtiint

        org     RAMSTART        ; Data Memory (internal RAM at $1000)
count:  ds      2               ; Counter of RTIs

        org     PRSTART         ; Program memory (internal RAM at $2000, 
				; but could be ROM)
entry:                          ; Program starts here
        ; Initialization code
        lds     #RAMEND         ; Initialize stack pointer
        movw    #0 count        ; Initialize count
        movb    #$23 RTICTL	; Set rate to 1.024ms (8 MHz Crystal frequency)
	bset	CRGINT #$80     ; Enable Real time interrupts
        movw    #rtiint UserRTI ; Set the RTI interrupt vector to rtiint

        cli                     ; Enable interrupts

        ; Main routine -- Idle Process
idle:   wai
        bra     idle

; RTI Interrupt Service Routine
rtiint: bclr    CRGFLG #~$80    ; clear the RTI flag
        ldd     count           ; increment the count
        addd    #1
        std     count
        rti



