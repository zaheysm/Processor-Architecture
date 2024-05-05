;; Mixed Addition Example
;; Add a byte unsigned variable to a word variable.
;; Add a byte signed variable to a word variable.
;; See the results for different values.
;; Copyright (c) 2005, Thomas Almy. All rights reserved. 
	org	$1000	; DATA RAM
C1:	ds	1	; Unsigned byte variable
C2:	ds	1	; Signed byte variable
I1:	ds	2	; Word variable (signed or unsigned)
I2:	ds	2	; Result: I2 = C1 + I1
I3:	ds	2	; Result: I3 = C2 + I1

	org	$2000	; PROGRAM RAM
; Initialize the variables
 	movb	#$10 C1		; Initialize C1 to $10 (16)
	movb	#$10 C2		; Initialize C2 to $10 (16)
	movw	#$1000 I1	; Initialize I1 to $1000 (4096)
; First set of calculations
	ldab	C1		; Get C1 and convert to word
	clra
	addd	I1		; Add I1 and store in I2
	std	I2
	ldab	C2		; Get C2 and convert to word
	sex	B D
	addd	I1		; Add I1 and store in I3
	std	I3
	bgnd			; Stops the simulator
; Initialize the variables again
 	movb	#$F0 C1		; Initialize C1 to $F0 (240)
	movb	#$F0 C2		; Initialize C2 to $F0 (-16)
	movw	#$1000 I1	; Initialize I1 to $1000 (4096)
; Repeat the calculations
	ldab	C1		; Get C1 and convert to word
	clra
	addd	I1		; Add I1 and store in I2
	std	I2
	ldab	C2		; Get C2 and convert to word
	sex	B D
	addd	I1		; Add I1 and store in I3
	std	I3
	bgnd			; Stops the simulator
; Initialize the variables again. Consider I1,I2,I3 to be signed words!
 	movb	#$F0 C1		; Initialize C1 to $10 (240)
	movb	#$F0 C2		; Initialize C2 to $F0 (-16)
	movw	#$FFF0 I1	; Initialize I1 to $FFF0 (-16)
; Repeat the calculations
	ldab	C1		; Get C1 and convert to word
	clra
	addd	I1		; Add I1 and store in I2
	std	I2
	ldab	C2		; Get C2 and convert to word
	sex	B D
	addd	I1		; Add I1 and store in I3
	std	I3
	bgnd			; Stops the simulator

