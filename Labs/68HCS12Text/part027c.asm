;
; part027c.asm  ---- Example program 4 for the Ep9S12DP256 board (c)2002, EVBplus.com
;                Written by Wayne Chu
;                Modified by Tom Almy to optimize for HC12 instruction set and be
;                  fully interrupt driven
;
;     Function: It initially displays the word 'SCAn" on the 7 segment LED display,
;     then each following key press will insert the key value in the display on
;     the right, shifting all the characters to the left.
;
;     Instruction: Connect a 4 x 4 keypad to the keypad header J29.
;
#include        registers.inc   ; include register equates

        org     DATASTART       ; variable declarations
;
char:           ds      1       ; character last displayed (index 0,1,2 or 3)
disptn:         ds      4       ; These four bytes will be displayed
keybuf:         ds      1       ; Keypad value or -1 if no keystroke available

colmask:        ds      1       ; Column mask - $f7, $fb, $fd, or $fe
colindx:        ds      1       ; Column index (column being scanned - 3, 2, 1, or 0)
lastval:        ds      1       ; last value returned from port A
debcnt:         ds      1       ; debouncing counter (check keys every 10mSec)

        org     PRSTART         ; possibly nonvolatile memory
        bra     start           ; branch to start of program
; Constant table declarations
valtbl: ; Each table column represents a keyboard scan row, while the table rows represent
        ; the scan values (colums of keys) - only rows 7, 11, 13, and 14 are valid
        ;       (A321)(B654)(C987)(D#0*)
        db      -1,-1,-1,-1     ; scan values 0 through 6 are invalid
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      $a,$b,$c,$d     ; scan value 7 (0111) A B C D
        db      -1,-1,-1,-1     ; scan values 8 through 10 are invalid
        db      -1,-1,-1,-1
        db      -1,-1,-1,-1
        db      3,6,9,$11       ; scan value 11 (1011) 3 6 9 #
        db      -1,-1,-1,-1     ; scan value 12 is invalid
        db      2,5,8,0         ; scan value 13 (1101) 2 5 8 0
        db      1,4,7,$1f       ; scan value 14 (1110) 1 4 7 *
        db      -1,-1,-1,-1     ; scan value 15 is invalid

dspmap: db      $0e,$0d,$0b,$07 ; Selects the correct character for lighting 
segm_ptrn:                                              ; segment pattern
        db     $3f,$06,$5b,$4f,$66,$6d,$7d,$07         ; 0-7
;                0,  1,  2,  3,  4,  5,  6,  7
        db     $7f,$6f,$77,$7c,$39,$5e,$79,$71         ; 8-15
;                8,  9,  A,  b,  C,  d,  E,  F
        db     $3d,$76,$74,$1e,$38,$54,$63,$5c         ; 16-23
;                G,  H,  h,  J   L   n   o   o
        db     $73,$50,$78,$3e,$1c,$6e,$08,$40         ; 24-31
;                P,  r,  t,  U,  u   Y   -   -
        db     $00,$01,$48,$41,$09,$49                 ; 32-37
;               blk, -,  =,  =,  =,  =


start:  lds     #DATAEND
        movw    #rtiisr UserRTI ; initialize the int vetctor
        ldaa    #$ff            ; turn off 7-segment display
        staa    PTP             ; portp = 11111111
;
        staa    DDRB            ; portb = output
        staa    DDRP            ; portp = output

        movb    #$23 RTICTL     ; RTI divider is 8192, about 1 mSec
        bset    CRGINT #$80     ; enable RTI interrupts

        movb    #$0f DDRA       ; pa0 to pa3 are outputs while 4 to 7 are inputs

        movb    #-1 keybuf      ; no key
        ldaa    #$f7            ; template for msb of output being low
        staa    PORTA
        staa    colmask         ; save it
        staa    lastval         ; good "lastval" since it looks like nothing pressed
        movb    #3 colindx      ; counter
        movb    #10 debcnt      ; poll every 10mSec for good debouncing
        movb    #5 disptn       ; letter 'S' -- initialize LED display
        movb    #$0C disptn+1   ; letter 'C'
        movb    #$0A disptn+2   ; letter 'A'
        movb    #$15 disptn+3   ; letter 'n'

        cli
; Main Process writes keystrokes to the display segements
loop:   bsr     getkey
        ldx     #disptn+1       ; shift display to left
        ldy     #disptn
        ldab    #3
shlp:   movb    1,x+ 1,y+
        dbne    b shlp
        staa    disptn+3        ; then store the key
        bra     loop


getkey: ; Get character from keypad and place in accumulator A
        ; If none available, wait.
        ldaa    keybuf
        bge     gotone          ; branch if key available
        wai                     ; wait if not
        bra     getkey          ; then try again
gotone: movb    #-1 keybuf      ; mark buffer as empty
        rts

rtiisr: ; RTI Interrupt Service Routine
	bclr    CRGFLG #~$80     ; clear RTI interrupt flag
        cli                     ; allow other interrupts to occur 
        ;handle display first
        bsr     leds
        ;now handle the keypad
        bsr     kpd
        ; done!
        rti

leds:   ; subroutine to perform LED display update
        ldab    char
        incb
        andb    #3
        stab    char
        tfr     b x             ; select value in X
        ldaa    disptn,x
        tfr     a b
        anda    #$7f
        ldy     #segm_ptrn
        ldaa    a,y
        andb    #$80
        aba
        staa    PORTB
        ldaa    PTP             ; only alter port p bits we are using
        anda    #$f0
        oraa    dspmap,x
        staa    PTP
        rts

kpd:    ; subroutine to scan the keypad
        dec     debcnt
        bne     noval           ; don't do a thing 9 of 10 times
        movb    #10 debcnt
        ldaa    PORTA           ; check keyboard
        cmpa    lastval
        beq     samelast        ; might mean to go to next row
        staa    lastval
        anda    #$f0            ; get only upper bits
        lsra
        lsra
        adda    colindx         ; table index
        cmpa    #28             ; values less than 28 are invalid
        blt     noval
        tfr     a x
        ldaa    valtbl,x        ; get value
        bmi     noval           ; no value so do nothing
        staa    keybuf          ; represents next keystroke!
noval:  rts
samelast:       ; if no depression, then go to next row for next interrupt
        anda    #$f0
        cmpa    #$F0            ; any depression?
        bne     noval           ; then do nothing for now
        ldaa    colmask
        asra                    ; shift mask
        dec     colindx
        bge     nowrap
        movb    #3 colindx
        ldaa    #$f7            ; reset mask
nowrap: staa    colmask
        staa    lastval
        staa    PORTA
        rts


        end
