;; NOTE -- configured for 8 MHz crystal
;; D-BUG12 Emulator
;; Copyright (c) 1998, Thomas Almy. All rights reserved. 
;; Revised October 1999.
;; Revised August 2003 for 68HCS12
;; Thomas Almy makes no representation about the suitability
;; of this software for any purpose. It is provided as is without
;; warranty of any kind, expressed or implied.

;; ***How to use the D-BUG12 Emulator***
; The D-BUG12 Emulator is a minimal implementation which has the following
; functionality:
; 1. Handles the reset vector.
; 2. Implements GetChar, Putchar
; 3. Allows SWI to end program execution
; 4. Initializes PLL to 24 MHz with 8 MHz crystal, set stack pointer, 
;    sets PPAGE to $30,
;    initializes SCI 0 to 9600bps, and clears X bit as part of initialization.
; 
; Naturally a full D-BUG12 emulation is not necessary, because the 68HC12
; simulator has the capabilities of the D-BUG12 user interface.
;
; To use this routine, first assemble it. Then:
; 1. From the Simulator, load DBUG12.S19.
; 2. Load your program.
; 3. Do a reset, then "go". Execution will stop at a BGND instruction.
; 4. Set the PC to the start of your program, if not at $2000.
; 5. Use "go" or "trace" normally.
; 6. If execution stops with a D-BUG12 BGND instruction with the next 
;    instruction displayed being a "BRA", register X contains the vector
;    number of the interrupt that occured (i.e., 27 ($1b) would be an SWI
;    instruction.)
; 7. If execution stops with a D-BUG12 BGND instruction where the next 
;    instruction displayed being a "RTS", this is an un-implemented D-BUG12
;    routine. Feel free to write it for extra credit.


#include registers.inc
        ORG     VECTORTABLE    ; RAM interrupt table
tabledb ds      $80
tabenddb  equ     *
;; Routine Vector table
        ORG     $EE84
        dw      getchardb
        dw      putchardb
        dw      diedb		; printf
        dw      diedb,0		; getcmdline
        dw      diedb,0		; sscanhex
        dw      diedb		;isxdigit
        dw      diedb		;toupper
        dw      diedb		;isalpha
        dw      diedb		;strlen
        dw      diedb		;strcpy
        dw      diedb,0		;out2hex
        dw      diedb,0		;out4hex
        dw      diedb		;setuservector
        dw      diedb,0		;writeeebyte
        dw      diedb,0		;eraseee
        dw      diedb,0		;readmem
        dw      diedb,0		;writemem
        ORG     $FF80   ; Vector table
	dw	int0DB
	dw	int1DB
	dw	int2DB
	dw	int3DB
	dw	int4DB
	dw	int5DB
	dw	int6DB
	dw	int7DB
	dw	int8DB
	dw	int9DB
	dw	int10DB
	dw	int11DB
	dw	int12DB
	dw	int13DB
	dw	int14DB
	dw	int15DB
	dw	int16DB
	dw	int17DB
	dw	int18DB
	dw	int19DB
	dw	int20DB
	dw	int21DB
	dw	int22DB
	dw	int23DB
	dw	int24DB
	dw	int25DB
	dw	int26DB
	dw	int27DB
	dw	int28DB
	dw	int29DB
	dw	int30DB
	dw	int31DB
	dw	int32DB
	dw	int33DB
	dw	int34DB
	dw	int35DB
	dw	int36DB
	dw	int37DB
	dw	int38DB
	dw	int39DB
	dw	int40DB
	dw	int41DB
	dw	int42DB
	dw	int43DB
	dw	int44DB
	dw	int45DB
	dw	int46DB
	dw	int47DB
	dw	int48DB
	dw	int49DB
	dw	int50DB
	dw	int51DB
	dw	int52DB
	dw	int53DB
	dw	int54DB
	dw	int55DB
	dw	int56DB
	dw	int57DB
	dw	int58DB
	dw	int59DB
	dw	int60DB
        dw      coprstDB
        dw      clkrstDB
        dw      rstrstDB	; Can't really specify this one!
        
        ORG     $F000   ; Start of "ROM"
diedb:    bgnd            ; We can't handle call
        rts             ; so stop then return
clkrstDB:
coprstDB:
rstrstDB: ; actions on reset
	movb    #2,SYNR      ; Set multiplier to 3x
xxdb:	brclr	CRGFLG,#$8,xxdb
	bset    CLKSEL,#$80  ; Enable the PLL.
        ldx     #tabledb     ; clear interrupt tabledb
l1db:   clr     1,X+
        cpx     #tabenddb
        bne     l1db
	movw	#156 SC0BDH	; setup serial port
	movb	#$0c SC0CR2
        andcc   #$bf
        lds     #$2000
        bgnd            ; Stop, then proceed to $2000
        jmp	PRSTART
int0DB:	ldx	#0*2
	bra	hnd2db
int1DB:	ldx	#1*2
	bra	hnd2db
int2DB:	ldx	#2*2
	bra	hnd2db
int3DB:	ldx	#3*2
	bra	hnd2db
int4DB:	ldx	#4*2
	bra	hnd2db
int5DB:	ldx	#5*2
	bra	hnd2db
int6DB:	ldx	#6*2
	bra	hnd2db
int7DB:	ldx	#7*2
	bra	hnd2db
int8DB:	ldx	#8*2
	bra	hnd2db
int9DB:	ldx	#9*2
	bra	hnd2db
int10DB:	ldx	#10*2
	bra	hnd2db
int11DB:	ldx	#11*2
	bra	hnd2db
int12DB:	ldx	#12*2
	bra	hnd2db
int13DB:	ldx	#13*2
	bra	hnd2db
int14DB:	ldx	#14*2
	bra	hnd2db
int15DB:	ldx	#15*2
	bra	hnd2db
int16DB:	ldx	#16*2
	bra	hnd2db
int17DB:	ldx	#17*2
	bra	hnd2db
int18DB:	ldx	#18*2
hnd2db:	jmp	handlerdb
int19DB:	ldx	#19*2
	bra	hnd2db
int20DB:	ldx	#20*2
	bra	hnd2db
int21DB:	ldx	#21*2
	bra	hnd2db
int22DB:	ldx	#22*2
	bra	hnd2db
int23DB:	ldx	#23*2
	bra	hnd2db
int24DB:	ldx	#24*2
	bra	hnd2db
int25DB:	ldx	#25*2
	bra	hnd2db
int26DB:	ldx	#26*2
	bra	hnd2db
int27DB:	ldx	#27*2
	bra	hnd2db
int28DB:	ldx	#28*2
	bra	hnd2db
int29DB:	ldx	#29*2
	bra	hnd2db
int30DB:	ldx	#30*2
	bra	hnd2db
int31DB:	ldx	#31*2
	bra	hnd2db
int32DB:	ldx	#32*2
	bra	hnd2db
int33DB:	ldx	#33*2
	bra	hnd2db
int34DB:	ldx	#34*2
	bra	hnd2db
int35DB:	ldx	#35*2
	bra	handlerdb
int36DB:	ldx	#36*2
	bra	handlerdb
int37DB:	ldx	#37*2
	bra	handlerdb
int38DB:	ldx	#38*2
	bra	handlerdb
int39DB:	ldx	#39*2
	bra	handlerdb
int40DB:	ldx	#40*2
	bra	handlerdb
int41DB:	ldx	#41*2
	bra	handlerdb
int42DB:	ldx	#42*2
	bra	handlerdb
int43DB:	ldx	#43*2
	bra	handlerdb
int44DB:	ldx	#44*2
	bra	handlerdb
int45DB:	ldx	#45*2
	bra	handlerdb
int46DB:	ldx	#46*2
	bra	handlerdb
int47DB:	ldx	#47*2
	bra	handlerdb
int48DB:	ldx	#48*2
	bra	handlerdb
int49DB:	ldx	#49*2
	bra	handlerdb
int50DB:	ldx	#50*2
	bra	handlerdb
int51DB:	ldx	#51*2
	bra	handlerdb
int52DB:	ldx	#52*2
	bra	handlerdb
int53DB:	ldx	#53*2
	bra	handlerdb
int54DB:	ldx	#54*2
	bra	handlerdb
int55DB:	ldx	#55*2
	bra	handlerdb
int56DB:	ldx	#56*2
	bra	handlerdb
int57DB:	ldx	#57*2
	bra	handlerdb
int58DB:	ldx	#58*2
	bra	handlerdb
int59DB:	ldx	#59*2
	bra	handlerdb
int60DB:	ldx	#60*2
;	bra	handlerdb
handlerdb: 
	ldy    tabledb,X         ; See if there is a vector
        beq     noHandlerdb
        jmp     0,Y
noHandlerdb:
        xgdx
        lsrd
        xgdx
        bgnd                    ; Stop because no handler
                                ; X has table index
        bra     noHandlerdb

getchardb:
	brclr	SC0SR1 #$20 getchardb	; wait for character available
	ldab	SC0DRL
	rts

putchardb:
	brclr	SC0SR1 #$80 putchardb   ; wait until buffer clear
	stab	SC0DRL
	rts

