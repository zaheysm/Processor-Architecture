;; Buffered I/O demonstration program
;; For DRAGON12 or simulator if DBUG12.S19 is loaded
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
BUFSIZE EQU     64
        org     RAMSTART
bufin   ds      2       ; Buffer pointer (input)
bufout  ds      2       ; Buffer pointer (output)
buffer  ds      BUFSIZE
charin  ds      1       ; Character read, 0 means none
        org     PRSTART
        lds     #RAMEND
;;Initialize buffers
        movw    #buffer bufin   ; Set buffer pointers
        movw    #buffer bufout
        clr     charin          ; no character
;; Initialize serial port
        movw    #serint,UserSCI1
        movb    #156 SC1BDL      ; Set 9600 BPS
        movb    #$2c SC1CR2     ; Interrupt RIE, enable TE RE

        cli                     ; enable interrupts
;; Test Program
loop:   bsr     getchara
        bsr     putchara
        bra     loop

;; Subroutines

; Getchar -- get a character from the keyboard and return it in A
getchara:
        ldaa    charin  ; Is there a character?
        bne     getchar1
        wai             ; Wait for next interrupt
        bra     getchara ; try again
getchar1:
        clr     charin  ; no character anymore
        rts

; Putchar sends the character in register A to the display
putchara:
        pshx
        tfr     d x     ; save A:B in X, X on stack
putch2: ldd     bufin   ; calculate # chars in buffer
        subd    bufout
        bpl     putch3
        addd    #BUFSIZE ; If negative, adjust (circular arithmetic)
putch3: cpd     #BUFSIZE-1 ; Is there room?
        bne     putch4
        wai             ; no room -- wait and try again 
        bra     putch2
putch4: tfr     x d     ; a has character, x has buffer address
	ldx     bufin   ; get bufin again
        staa    1,x+    ; store character, increment buffer position
        cpx     #buffer+BUFSIZE ; check for wrap
        bne     putch5  ; not needed?
        ldx     #buffer ; wrap to start
putch5: stx     bufin
        pulx            ; restore register X
        bset    SC1CR2 $80 ; Make sure transmitter interrupt enabled
        rts

;; Interrupt routines
serint:
        brclr   SC1SR1 $20 serint2      ; check RDRF, branch if clear
        movb    SC1DRL charin   ; get character into buffer
serint2:
        brclr   SC1SR1 $80 serint3      ; check TDRE, branch if clear
        ldx     bufout          ; see if character to send
        cpx     bufin
        bne     serint4
        bclr    SC1CR2 $80      ; disable transmitter interrupt
                                ; because no characters to send
serint3:
        rti
serint4:
        movb    1,x+ SC1DRL     ; put buffer character into xmitter
        cpx     #buffer+BUFSIZE ; buffer not past end?
        bne     serint5
        ldx     #buffer
serint5:
        stx     bufout
        rti
