; ATD Test Program: Convert from PAD3 and average the conversions
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
#include registers.inc
        org     DATASTART       ; Data memory (Internal RAM)
reading ds      2               ; Voltage reading goes here

        org     PRSTART         ; Program Memory
entry:  ; Initialization code
        movb    #$80 ATD0CTL2   ; Power up the ATD
        ldaa    #240/3          ; 10 microsecond delay
wait:   dbne    a wait
	movb	#$20 ATD0CTL3	; Sets 4 conversions
	movb	#5 ATD0CTL4	; Sets divider to x12, 10 bit conversion

        ; Start the ATD sequence
        movb    #$83 ATD0CTL5      ; PAD03, 4 conversions, rigt justified
wait2:  brclr   ATD0STAT0 #$80 wait2      ; Wait for SCF=1

        ; Read and average the four measurements
        ldd     ADR00H
        addd    ADR01H
        addd    ADR02H
        addd    ADR03H
        lsrd            ; divide by 4
        lsrd
        adcb    #0      ; And round result
	adca	#0
        std     reading
        swi             ; Return to Monitor
        end
