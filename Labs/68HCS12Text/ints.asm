; Multiple interrupts example
; Copyright 2005 by Thomas Almy
; This program is intended for the simulator, running in student mode.

#include "registers.inc"
; Vectors
        org     $FFF0
        dw      rtiisr
        org     $FFF2
        dw      irqisr
        org     $FFF4
        dw      xirqisr
        org     $FFFE
        dw      start
; Variables to hold counts
        org     DATASTART
ticks:  ds      2
irqs:   ds      2
xirqs:  ds      2
        org     PRSTART
start:  lds     #DATAEND
        movw    #0 ticks                ; reset all counters
        movw    #0 irqs
        movw    #0 xirqs
        movb    #$23 RTICTL  ; M=2, N=3, 1 KHz rate (roughly)
        bset    CRGINT #$80     ; RTIE = 1
        andcc   #~$50           ; Clear X and I bits in CCR
loop:   wai                     ; Everything happens in
        bra     loop            ; an ISR

rtiisr: bclr    CRGFLG #~$80    ; Clear RTIF by writing a 1 to it
        ldd     ticks
        addd    #1
        std     ticks
        rti

irqisr: ; IRQ in the simulator resets automatically!
        ldd     irqs
        addd    #1
        std     irqs
        rti

xirqisr: ; XIRQ in the simulator resets automatically!
        ldd     xirqs
        addd    #1
        std     xirqs
        rti
        end
