; Sine table interpolation
;; Copyright (c) 2004, Thomas Almy. All rights reserved. 
; To Test, store angle (0 to 90) into location $1000, run program at $2000,
; Then check result which is stored at location $1001
        org     $1000
angle:  ds      1             ; Angle (in degrees, 0 to 90)
val:    ds      1             ; Calculated Sine (*256)
        org     $2000
start:  ldaa    angle         ; calculate angle*256/10
        clrb                  ; D has angle * 256 (because angle is in high
                              ; order byte)
        ldx     #10           ; Divide by 10
        idiv                  ; Now X has angle*256/10
        tfr     x d           ; A has integer part of angle/10, 
                              ; B has fractional part
        ldx     #sine
        tbl     a,x           ; Fetch interpolated value into A
        staa    val
        swi                   ; Return to D-BUG12 Monitor
sine:   db  0
        db  44
        db  87
        db  127
        db  163
        db  195
        db  220
        db  239
        db  251
        db  255
        end
