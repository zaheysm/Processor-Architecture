




        org     $1000
Result  ds      1

        org     $2000
        ldaa    #$0A
        cmpa    #$0B
        beq     Here
        ldaa    #$AA
        bra     There
Here    ldaa    #$FF
There   staa    Result
        end