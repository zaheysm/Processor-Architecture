




        org     $1000
Result  ds      1

        org     $2000
        ldaa    #$23
        cmpa    #$44
        bne     Here
        ldaa    #$66
        bra     There
Here    ldaa    #$33
There   staa    Result
        end