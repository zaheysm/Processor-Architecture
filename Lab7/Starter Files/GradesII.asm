; GradesII.asm
;
; Author: Zahi Masarwa
; Course: CST8216
; Student Number: 040985420
; Date: 2021-11-15
;
; Purpose:              To Tally up the number of As, Bs, Cs, Ds and Fs
;                       from a Grades Array as per 21F Flowchart for GradesII
;                       which uses a Nested-IF structure

STACK   ds      $2000   ;constant to load stack
A       equ     'A'     ;contant of char A
B       equ     'B'     ;contant of char B
C       equ     'C'     ;contant of char C
D       equ     'D'     ;contant of char D
F       equ     'F'     ;contant of char F

        org     $1020   ;org to use as the assignment
IF_F    db      0       ;to store the count of each letter
IF_D    db      0
IF_C    db      0
IF_B    db      0
IF_A    db      0


        org        $1000            ; as per assignment instructions
Grades
#include Grades.txt     ; Grades file supplied for assignment
End_Grades              ;the end of the array





; Expected Result
        ;1020   1021    1022    1023    1024
        ;04     01      03      04      04
;

        org     $2000   ;org to start code
        lds     #STACK  ;load the stack
        clr     IF_F
	clr	IF_D
	clr	IF_C
	clr	IF_B
	clr	IF_A
        ldx     #Grades ;load the array to x
loop    ldaa    1,x+    ;load the first element of array to A
        cmpa    #F      ;if accumulator A = to F
        beq     GotoF   ;branch to GotoF
        cmpa    #D      ;if accumulator A = to D
        beq     GotoD   ;branch to GotoD
        cmpa    #C      ;if accumulator A = to C
        beq     GotoC   ;branch to GotoC
        cmpa    #B      ;if accumulator A = to B
        beq     GotoB   ;branch to GotoB
        cmpa    #A      ;if accumulator A = to A
        beq     GotoA   ;branch to GotoA
        bra     check   ;if no match branch to check
GotoF   inc     IF_F    ;incrament IF_F by 1
        bra     check   ;branch to check
GotoD   inc     IF_D    ;incrament IF_D by 1
        bra     check   ;branch to check
GotoC   inc     IF_C    ;incrament IF_C by 1
        bra     check   ;branch to check
GotoB   inc     IF_B    ;incrament IF_B by 1
        bra     check   ;branch to check
GotoA   inc     IF_A    ;incrament IF_A by 1
        bra     check   ;branch to check
check   cpx     #End_Grades     ;compare x to end of array
        bne     loop    ;branch to loop if not equal to x
        swi             ; forces program to quit executing in memory
        end