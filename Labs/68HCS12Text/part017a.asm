; Traffic Light State Machine -- Example for Part 017a of text
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
;; Note -- Light durations sped up 10x to make simulations run faster

#include registers.inc          ; Equates for addresses of hardware registers
; We will use Port H to to connect to the side street car sensor
SENSOR  equ     %1              ; Sensor will be LSB
; We will use port B to connect to the traffic light
REDM    equ       %100000       ; Red light on main street
YELM    equ        %10000       ; Yellow light on main street
GRNM    equ         %1000       ; Green light on main street
REDS    equ          %100       ; Red light on side street
YELS    equ           %10       ; Yellow light on side street
GRNS    equ            %1       ; Green light on side street
; Light durations (expressed in multiples of of the 65.536 msec interrupt rate)
MAXMAIN equ     60*100000/65536 ; 60 seconds maximum for main green
MINMAIN equ     20*100000/65536 ; 20 seconds minimum for main green
MAXSIDE equ     30*100000/65536 ; 30 seconds maximum for side green
MINSIDE equ     15*100000/65536 ; 15 seconds minimum for side green
BMPTIME equ      5*100000/65536 ; New minimum time if car hits sensor on side green
MAXYELL equ      5*100000/65536 ; Yellow time
        org     DATASTART       ; Data Memory (internal RAM)
; State information of traffic light control process
state:  ds      2               ; Current state pointer
maxctr: ds      2               ; Maximum time counter
minctr: ds      2               ; Minimum time counter

        org     PRSTART         ; Program memory (external, could be ROM)
entry:  ; Program starts here
        ; Initialization code
        lds     #DATAEND        ; Initialize stack pointer
        movw    #GREENRED state ; Initialize state machine state
        movw    #MAXMAIN maxctr
        movw    #MINMAIN minctr
	bset    CRGINT #$80       ; Enable RTI (RTIE=1)
        movb    #%01110111 RTICTL ; Enable Real time interrupts, set rate to 65.536ms
        movw    #rtiint UserRTI   ; Set interrupt vector using D-BUG12
        movb    #(REDM|YELM|GRNM|REDS|YELS|GRNS) DDRB ; Set Port B output pins
	movb	#2 DDRJ		; MOD for Rev E dragon12 boards
        cli                     ; Enable interrupts
; Idle process (justs waits for interrupts)
idle:   wai
        bra     idle
; RTI Interrupt -- steps the traffic light state machine
rtiint: movb    #$80 CRGFLG     ; clear the RTI flag
        ldx     state           ; jump to current state
        jmp     0,x

GREENRED:       ; State where Main is green and side is red
        movb    #GRNM|REDS PORTB ; Make sure correct lights are on
        ldd     maxctr          ; Decrement maxctr and see if it is zero
        subd    #1
        std     maxctr
        beq     gotoYELLOWRED   ; If zero, change state
        ldd     minctr          ; Decrement minctr and see if it is <=0
        subd    #1
        std     minctr
        bgt     finished        ; Greater -- stay in this state
        brclr   PTIH #SENSOR finished ; Also stay if sensor off
gotoYELLOWRED:  ; Advance to YELLOWRED state
        movw    #YELLOWRED state        ; Set next state
        movw    #MAXYELL maxctr         ; Reset maxctr for yellow time
finished:
        rti

YELLOWRED:      ; Main is Yellow, Side is Red
        movb    #YELM|REDS PORTB ; Make sure correct lights are on
        ldd     maxctr          ; Decrement maxctr and see if it is zero
        subd    #1
        std     maxctr
        bne     finished        ; more time -- stay in state
        movw    #REDGREEN state ; No more time, set next state
        movw    #MAXSIDE maxctr ; Reset maxctr and minctr
        movw    #MINSIDE minctr
        rti

REDGREEN:       ; Main is Red, Side is Green
        movb    #REDM|GRNS PORTB ; Make sure correct lights are on
        ldd     maxctr          ; Decrement maxctr and see if it is zero
        subd    #1
        std     maxctr
        beq     gotoREDYELLOW   ; If zero, change state
        ldd     minctr          ; Decrement mincnt
        subd    #1
        std     minctr
        ; Check for presence of car and adjust
        ; minctr if necessary
        cpd     BMPTIME         ; If minctr>BMPTIME then don't do anything
        bgt     finished
        brclr   PTIH #SENSOR noadj     ; If sensor on, then adjust time, stay in state
        movw    #BMPTIME minctr
        rti
noadj:  cpd     #0              ; Mintime not yet reached?
        bgt     finished        ; Then stay in state
gotoREDYELLOW: ; Advance to REDYELLOW state
        movw    #REDYELLOW state        ; Set next state
        movw    #MAXYELL maxctr         ; Reset maxctr for yellow time
        rti

REDYELLOW: ; Main is Red, Side is Yellow
        movb    #REDM|YELS PORTB ; Make sure correct lights are on
        ldd     maxctr          ; Decrement maxctr and see if it is zero
        subd    #1
        std     maxctr
        bne     finished        ; more time -- stay in state
        movw    #GREENRED state ; Set next state
        movw    #MAXMAIN maxctr ; Reset maxctr and minctr for new times
        movw    #MINMAIN minctr
        rti
