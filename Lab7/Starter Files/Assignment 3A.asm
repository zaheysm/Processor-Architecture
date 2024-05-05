




        org     $1000
MyArray db      $15, $26, $95, $54, $66, $22, $F3
EndArray

Result  ds      4

        org     $2000
        lds     #$2000
        ldx     #MyArray
        ldd     MyArray
        exg     b,a
        ldaa    2,x
        inx
        ldab    3,x
        ldaa    3,x+
        ldy     #Result
        staa    3,y
        tfr     a,b
        stab    1,y+
        end