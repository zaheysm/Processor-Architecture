;
; Frequency Meter
; Input on PT7, frequency shown on LCD display
; Designed for Dragon12-plus development board
;
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
;; Thomas Almy makes no representation about the suitability
;; of this software for any purpose. It is provided as is without
;; warranty of any kind, expressed or implied.

        
; Modified to go in EEPROM
;
#include        registersee.inc
REG_SEL:        equ     %00000001       ; 0=reg, 1=data (LCD)
ENABLE:         equ     %00000010
LCDBUFLEN:      equ     32              ; Size of LCD output buffer

                org     DATASTART       ; Data starts here
frequency:      ds   4          ; Measured Frequency
saved:          ds   4          ; Saved frequency value
doneflg:        ds   1          ; Measurement has been made
count:          ds   2          ; PA overflow counter
mscnt:          ds   2          ; millisecond counter
result:         ds   7          ; Frequency text string
sttext:         ds   3
TEXTLEN         equ *-result
lcdbuf:         ds   LCDBUFLEN  ; LCD output buffer
lcdbufin:       ds   2          ; Pointer to buffer input
lcdbufout:      ds   2          ; pointer to buffer output
lcdstate:       ds   2          ; LCD state machine state
lcddelay:       ds   1          ; LCD state machine delay counter

                org     PRSTART         ; program code starts here
start:
        ; Initialize the stack and the PLL
        lds     #DATAEND
        movb    #2 SYNR                 ; set up PLL rate
xxdb:   brclr   CRGFLG #$8 xxdb
        bset    CLKSEL #$80             ; turn on PLL
        ; Initialize RAM variables for Frequency measurment and display
        movw    #0 frequency            ; all variables set to zero
        movw    #0 frequency+2
        movw    #0 count
        movw    #0 mscnt
        clr     doneflg
        movb    #' sttext               ; static (unchanging) display text
        movb    #'H sttext+1
        movb    #'z sttext+2
        ; Initilize LCD driver data RAM
        movw    #lcdbuf lcdbufin          ; buffer pointers
        movw    #lcdbuf lcdbufout
        movw    #LCDCLEARDELAY lcdstate   ; 15 msec delay before using LCD
        movb    #14 lcddelay              ; gives 15 msec delay (one more than value)
        ; Initialize microcontroller interface to LCD
        movb    #$ff DDRK       ; port K = output
        clr     PORTK
        ; Initialize microcontroller for frequency measurements
        movw    #0 PACN3        ; Pulse Accumulator counter = 0
        movw    #tc6int UserTimerCh6
        movw    #paovint UserPAccOvf
        movb    #$80 TSCR       ; Set TEN and TFFCA
        bset    TIOS #$40       ; Channel 6 is Output compare
        bset    TMSK1 #$40      ; Channel 6 will cause interrupt
        ldd     #8000           ; Next Channel 6 interrupt in 1ms
        addd    TCNT
        std     TC6
        bset    PACTL #$42      ; Set PAEN, PAOVI
        movb    #8 DDRS         ; PS2=input, PS3=output
        clr     PTS             ; make PS3=0 to xmit IR light Runs generator
        cli                     ; Enable interrupts
        jsr     lcd_ini         ; initialize the LCD (must be done with interrupts enabled)
back:   tst     doneflg
        beq     back
        clr     doneflg
        movw    frequency saved
        movw    frequency+2 saved+2
        ldaa    saved           ; Are all bits 0?
        oraa    saved+1
        oraa    saved+2
        oraa    saved+3
        beq     nomeasure       ; then there is no measurement
        ldy     #result+6       ; Convert to 7 digit frequency string     
loop:   pshy
        ldd     saved           ; divide 32 bit value at saved by 10, storing
        ldx     #10             ; quotient back in saved and keeping remainder
        idiv                    ; division of upper 16 bits, d has remainder, x has quotient
        stx     saved
        tfr     d y             ; prepare for second divide
        ldd     saved+2
        ldx     #10
        ediv                    ; quotient in y, remainder in D
        sty     saved+2
        addb    #'0             ; convert remainder to ASCII digit
        puly
        stab    1,y-            ; put digit in character array
        ldd     saved           ; see if quotient is zero -- if not, continue converting
        bne     loop
        ldd     saved+2
        bne     loop
        cpy     #result         ; blank fill leading characters
        blo     done
again:  movb    #'  1,y-
        cpy     #result
        bhs     again
done:   ldx     #result         ; display frequency text
        ldab    #TEXTLEN
        jsr     lcd_line1
        jmp     back
nomeasure:                      ; display text that there is no signal
        ldx     #nomeas
        ldab    #10
        jsr     lcd_line1
        jmp     back
nomeas: fcc     'No Signal '

paovint:        ; Interrupt service routine -- PACNT overflow
        ldx     count           ; increment overflow count
        inx
        stx     count
        bclr    PAFLG #~2       ; reset PAOVF
        rti

tc6int:         ; Interrupt service routine -- Timer Channel 6
        ldd     TC6             ; Next interrupt in 1 ms
        addd    #24000
        std     TC6
        bclr    TFLG1 #~$40     ; Reset C6F
        ldx     mscnt           ; Increment millisecond counter
        inx
        cpx     #1000           ; One second elapsed?
        beq     onesecond
        stx     mscnt           ; store count
        bra     lcdgo           ; process LCD
onesecond:
        ldx     PACN3           ; get pulse count
        movw    #0 PACN3        ;   then reset count
        ldy     count           ; get upper (overflow) count
        movw    #0 count        ;   then reset count
        brclr   PAFLG #2 noov   ; branch if no PAOV yet
        bclr    PAFLG #~2       ;  reset PAOV
; If there is an overflow, it may have occurred before the
; PACNT value we are looking at
        cpx     #0              ; Is PACNT large?
        bmi     noov            ; Then no adjustment
        iny                     ; else adjust upper count
noov:   stx     frequency+2     ; store the frequency
        sty     frequency
        movw    #0 mscnt        ; reset millisecond counter
        movb    #1 doneflg
lcdgo:  ; Process LCD
        ldx     lcdstate        ; go to current state
        jmp     0,x
LCDIDLE: ; Wait for next character
        ldx     lcdbufout
        cpx     lcdbufin
        beq     lcdfin
        ldaa    1,x+ 
        cpx     #lcdbuf+LCDBUFLEN
        bne     lcdin2
        ldx     #lcdbuf
lcdin2: stx     lcdbufout
        cmpa    #-1
        beq     iscmd
        psha            ; save temporarily
        anda   #$f0                     ; mask out 4 low bits.           
        lsra
        lsra                            ; 4 MSB bits go to pk2-pk5                              
        bsr     lcdnibble
        pula
        lsla                            ; move low bits over.
        lsla
        bsr     lcdnibble
lcdfin: rti

LCDCLEARDELAY: ; waiting on clear delay
        dec     lcddelay
        bne     lcdfin
        movw    #LCDIDLE lcdstate
        rti

LCDRESETDELAY: ; waiting on reset delay
        dec     lcddelay
        bne     lcdfin
        ldaa    #$0c                    ; reset lower nibble shifted left
        bsr     lcdnibble
        bset    PORTK #REG_SEL          ; select data
        movw    #LCDIDLE lcdstate
        rti

iscmd:  movw    #LCDCMD lcdstate
LCDCMD:   ; Wait for command
        ldx     lcdbufout
        cpx     lcdbufin
        beq     lcdfin
        ldaa    1,x+ 
        cpx     #lcdbuf+LCDBUFLEN
        bne     lcdcin2
        ldx     #lcdbuf
lcdcin2: stx    lcdbufout
        psha                            ; save the command
        bclr    PORTK #REG_SEL          ; select instruction
        anda   #$f0                     ; mask out 4 low bits.           
        lsra
        lsra                            ; 4 MSB bits go to pk2-pk5                              
        bsr     lcdnibble
        pula
        cmpa    #$33                    ; Reset requires a 5msec delay
        beq     lcdreset
        psha
        lsla                            ; move low bits over.
        lsla
        bsr     lcdnibble
        bset    PORTK #REG_SEL  ; select data
        pula
        cmpa    #$03                    ; clear requires 5 msec delay
        bls     lcdclear
        movw    #LCDIDLE lcdstate
        rti
lcdreset: movw #LCDRESETDELAY lcdstate   ; must delay before second part
        movb    #5 lcddelay             ; gives 5 msec delay
        rti
lcdclear: movw #LCDCLEARDELAY lcdstate   ; must delay before next command
        movb    #1 lcddelay             ; gives 2 msec delay (one more than value)
        rti

lcdnibble: ; nibble to send is in a
        psha                            ; save nibble value.
        ldaa   PORTK                    ; get LCD port image.
        anda   #$03                     ; need low 2 bits.
        oraa   1,sp+                    ; add in low 4 bits. 
        staa   PORTK                    ; output data          
        bset    PORTK #ENABLE   ; ENABLE=high
        nop
        nop                     ; make pulse 250nsec wide
        bclr    PORTK #ENABLE   ; ENABLE=low
        rts

putlcd: ; Write character in register A to LCD
        pshx
        tfr     d x             ; save A:B in X, X on stack
putlcd2: ldd     lcdbufin       ; calculate # characters in buffer
        subd    lcdbufout
        bpl     putlcd3
        addd    #LCDBUFLEN      ; If negative, adjust (circular arithmetic)
putlcd3: cpd     #LCDBUFLEN-1   ; Is there room?
        bne     putlcd4
        wai                     ; no room -- wait and try again 
        bra     putlcd2
putlcd4: tfr     x d            ; a has character 
        ldx     lcdbufin        ; get bufin again
        staa    1,x+            ; store character, increment buffer position
        cpx     #lcdbuf+LCDBUFLEN ; check for wrap
        bne     putlcd5         ; not needed?
        ldx     #lcdbuf         ; wrap to start
putlcd5: stx    lcdbufin        ; save new bufin value
        pulx
        rts

lcd_line1: ; write the character string at X, B characters long, to the first line
        ldaa    #$ff                    ; indicate instruction
        bsr     putlcd
        ldaa    #$80                    ; starting address for the line1
        bsr     putlcd
        bra     lcdline3
lcd_line2: ; write the character string at X, B characters long, to the second line
        ldaa    #$ff                    ; indicate instruction
        bsr     putlcd
        ldaa    #$C0                    ; starting address for the line2
        bsr     putlcd
lcdline3: pshy
        tfr     b y
msg_out:
        ldaa    1,x+
        bsr     putlcd
        dbne    y msg_out
        puly
        rts
; Initialize the LCD display module. All registers preserved
lcd_ini:
        ldx     #inidsp
        ldab    #6
lcd_ini_loop:
        ldaa    #$ff            ; $ff means following byte is command
        jsr     putlcd
        ldaa    1,X+
        jsr     putlcd
        dbne    b lcd_ini_loop
        rts
inidsp: 
        db     $33             ; reset (4 nibble sequence)  
        db     $32             ; reset 
        db     $28             ; 4bit, 2 line, 5X7 dot
        db     $06             ; cursor increment, disable display shift
        db     $0c             ; display on, cursor off, no blinking
        db     $01             ; clear display memory, set cursor to home pos
        end

