; Part017b.asm ----  Example program 3 for the Ep9S12DP256 board (c)2002, EVBplus.com
;                Written by Wayne Chu
;                Modified by Tom Almy to optimize for HC12 instruction set and be
;                fully interrupt driven
;
;     Function: Displays the word 'HELP' on the 7 segment LED display,
;               the 7-segment is multiplexed at about 250Hz refresh rate
;
#include        registers.inc   ; include register equates and memory map

        org     DATASTART
;
char:          ds      1        ; Character last displayed (index 0, 1, 2, 3)
disptn:        ds      4        ; These four bytes will be displayed
                                ; Using the segment values shown below in segm_ptrn

        org     PRSTART
;
start:
        lds     #DATAEND
        movw    #rtiisr UserRTI ; initialize the int vetctor
        ldaa    #$ff            ; 
        staa    DDRB            ; portb = output
        staa    DDRP            ; portp = output
        staa    PTP             ; turn off 7-segment display

        movb    #$17 RTICTL     ; RTI divider is 8192, about 1 mSec
        bset    CRGINT #$80     ; enable RTI interrupts

        ldx     #disptn         ; Address of display field
        movb    #$11+$80 1,X+ ; binary code for the letter 'H' 
				; (set decimal point as well)
        movb    #$0E 1,x+       ; binary code for the letter 'E'
        movb    #$14 1,X+       ; binary code for the letter 'L'
        movb    #$18 0,x        ; binary code for the letter 'P'
  
        cli                     ; Start interrupts

idle:   wai                     ; idle process
        jmp     idle

rtiisr:
        bclr    CRGFLG #~$80     ; clear RTI flag
        ldab    char            ; character selection
        cli                     ; allow other interrupts to occur 
        incb                    ; char+1 modulo 4
        andb    #3
        stab    char
        tfr     b x             ; character selection in X
        ldaa    disptn,x        ; get desired display value
        tfr     a b
        anda    #$7f            ; mask of the decimal point
        ldy     #segm_ptrn      
        ldaa    a,y             ; look up segments to light in table
        andb    #$80            ; mask off all but the decimal point
        aba                     ; merge decimal point into segment value
        staa    PORTB           ; light the segments
        ldaa    PTP             ; only alter port p bits we are using
        anda    #$f0
        oraa    dspmap,x        ; light up correct char
        staa    PTP
        rti

dspmap: db      $0e,$0d,$0b,$07 ; Selects the correct character for lighting

segm_ptrn:                                              ; segment pattern
        db     $3f,$06,$5b,$4f,$66,$6d,$7d,$07          ; 0-7
;                0,  1,  2,  3,  4,  5,  6,  7
        db     $7f,$6f,$77,$7c,$39,$5e,$79,$71          ; 8-15
;                8,  9,  A,  b,  C,  d,  E,  F
        db     $3d,$76,$74,$1e,$38,$54,$63,$5c          ; 16-23
;                G,  H,  h,  J   L   n   o   o
        db     $73,$50,$78,$3e,$1c,$6e,$08,$40          ; 24-31
;                P,  r,  t,  U,  u   Y   _   -
        db     $00                                      ; 32
;               blk
;
        end
