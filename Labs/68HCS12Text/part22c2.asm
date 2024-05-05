;; Line Buffering Example
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 

#include registers.inc
TDRE    equ     $80     ; Bits in SC1SR1
RDRF    equ     $20
TIEb    equ     $80     ; Bits in SC1CR2
RIE     equ     $20
TE      equ     $08
RE      equ     $04
BUFSIZE equ     32
LINESIZE equ    64
        org     RAMSTART
bufin   ds      2       ; Buffer pointer (input)
bufout  ds      2       ; Buffer pointer (output)
buffer  ds      BUFSIZE
linep   ds      2       ; Line buffer pointer
linebuf ds      LINESIZE
        org     PRSTART
        lds     #RAMEND
;;Initialize buffers
        movw    #buffer bufin   ; Set buffer pointers
        movw    #buffer bufout
        movw    #linebuf linep
;; Initialize serial port
        movw    #serint UserSCI1 ; Set interrupt vector
        movb    #156 SC1BDL      ; Set 9600 BPS
        movb    #RIE|TE|RE SC1CR2     ; Interrupt RIE, enable TE RE

        cli                     ; enable interrupts
;; Test Program
loop:   wai                     ; do nothing but loop
        bra     loop

;; Subroutines

; Putchara sends the character in register A to the display
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
        bset    SC1CR2 TIEb ; Make sure transmitter interrupt enabled
        rts

;; Interrupt routines
serint:
        ldaa    SC1CR2          ; save interrupt settings
        bclr    SC1CR2 TIEb|RIE  ; disable this interrupts
        nop
        cli                     ; so we can enable higher priority 
        clrb                    ; assume no character in
        bita    #RIE            ; if receiver was disabled, don't check it
        beq     serint2         ; (solves re-entrancy problem)
        brclr   SC1SR1 RDRF serint2      ; check RDRF, branch if clear
        ldab    SC1DRL            ; get character into register b
serint2:
        bita    #TIEb            ; If transmitter was disabled, don't check TDRE
        beq     serint3         ;  (just to speed things up)
        brclr   SC1SR1 TDRE serint3      ; check TDRE, branch if clear
        ldx     bufout          ; see if character to send
        cpx     bufin
        bne     serint4
        anda    #~TIEb           ; disable transmitter interrupt
                                ; because no characters to send
        bra     serint3
serint4:
        movb    1,x+ SC1DRL     ; put buffer character into xmitter
        cpx     #buffer+BUFSIZE ; buffer not past end?
        bne     serint5
        ldx     #buffer
serint5:
        stx     bufout          ; save buffer address
serint3:
        psha                    ; save original SC1CR2 contents
        anda    #TIEb            ; enable serial port transmitter, if necessary
        oraa    SC1CR2
        anda    #~RIE           ; make certain receiver is still off
        staa    SC1CR2          ; Now routine can be reentered, for transmitting
        tba                     ; set condition codes, is there a character?
        bne     serint6         ;  then handle input into line buffer
serintend:
        pula                    ; retrieve original SC1CR2 contents
        anda    #RIE            ; Was receiver enabled?
        oraa    SC1CR2          ;  then enable it now
        staa    SC1CR2
        rti
serint6:
        ldx     linep           ; get address for next character
        cmpa    #13             ; Check for carrage return
        beq     serintline      ; Yes -- finish up and process
        cmpa    #8              ; check for backspace
        bne     serint7         ; no -- branch
        cpx     #linebuf        ; At start of line already?
        beq     serintbeep      ;  then give error (line empty)
        jsr     putchara         ; otherwise erase on display
        ldaa    #'              ; backspace, space, backspace
        jsr     putchara
        ldaa    #8
        jsr     putchara
        dex                     ; remove from buffer
        stx     linep
        bra     serintend
serint7:
        cpx     #linebuf+LINESIZE-2  ; See if there is room
        beq     serintbeep      ; no room for character
        stab    1,x+            ; room -- save it
        jsr     putchara         ; and echo it
        stx     linep
        bra     serintend
serintbeep:   
        ldaa    #7              ; beep to indicate an error
        jsr     putchara
        bra     serintend
serintline:
        jsr     putchara         ; echo CR and LF
        ldaa    #10
        jsr     putchara
        ldaa    #0              ; delimit string
        staa    0,x
        movw    #linebuf linep  ; Ready to accept new line
;; Action to take on complete line goes here
;; We will just echo the line for now
        ldx     #linebuf
serl1:  ldaa    1,x+
        beq     serl3           ; none left
        jsr     putchara
        bra     serl1
serl3:  ldaa    #13             ; Do CRLF sequence
        jsr     putchara
        ldaa    #10
        jsr     putchara
        bra     serintend

