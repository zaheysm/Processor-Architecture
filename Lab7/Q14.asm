




        org     $1000
Result  ds      1

        org     $2000
        ldaa    #$10
        cmpa    #$0F
        bls     Here
        ldaa    #$88
        bra     There
Here    ldaa    #$44
There   staa    Result
        end