




        org     $1000
Result  ds      1

        org     $2000
        ldaa    #$10
        cmpa    #$0F
        blo     Here
        ldaa    #$8E
        bra     There
Here    ldaa    #$E8
There   staa    Result
        end