	org	$1000		; Set current location to start of RAM
p:	db	$25		; First addend is at location p
q:	db	$37		; Second addend is at location q
r:	ds	1		; Sum will be stored at location r
	org	$2000		; Set current location to start in ROM
	ldaa	p		; load value at p into accumulator a
	adda	q		; add value at q into accumulator a
	deca			; decrement a
	staa	r		; store accumulator a at location r
	end