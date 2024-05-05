;; SPI Example using interrupts
;; Drives simulated external device in its default configuration
;; Value stored in device will increment at maximum rate.
;; DBUG12 is assumed.
;; Copyright 2007, Thomas Almy. All rights reserved.
#include "registers.inc"
	org	DATASTART
val:	ds	1		; value to send
	org	PRSTART
	lds	#DATAEND	; initialize stack pointer
	movw	#spiisr UserSPI0	; set interrupt vector
	movb	#$7A SPI0CR1	; set SPE SPTIE MSTR CPOL SSOE
	movb	#$10 SPI0CR2	; set MODFEN
	movb	#$51 SPI0BR	; 1MHz SPI clock.
	clrb	val		; initialize val
	cli			; enable interrupts
loop:	wai
	bra	loop
spiisr:	; we get here whenever SPTEF is set (transmitter empty)
	ldaa	SPI0SR		; read the status register so flag can be cleared
	movb	val SPI0DR	; send next byte, clears SPTEF
	inc	val		; increment val for next time
	rti
	end
