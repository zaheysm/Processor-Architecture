; Counter_HEX_Display.asm
;
; Author:               D. Haley, Professor, for CST8216
; Modified by:          <place your Name(s) here>
; Student Number(s):    <place your Student Number(s) here>
; Lab Section(s):       <place your Lab Section Number(s) here>
; Course:               CST8216 Fall 2021
; Date:                 <include the code completion date here>

; Description   This counter counts from START_COUNT to END_COUNT as defined
;               in the program's equ statements

;               Behaviour:
;               This counter continually counts until Stop is pressed
;                on the simulator, as follows:
;
;               do
;                  count in HEX mode
;                  count in BCD mode
;               while (Stop not pressed on the simulator)
;
;               The speed of the counter is adjusted by changing DVALUE,
;               which changes the delay of displaying values in
;               the Delay Subroutine Value
;
; Other info:   The counter will use the Hex Displays to display the count.
;
;               The count must be in a single register, Accumulator A.
;
;               The range of the count can be altered by stopping the program,
;               changing the START_COUNT and END_COUNT values, re-assembling
;               and loading/running the program in the Simulator again.
;
;               START_COUNT must be >=0 and END_COUNT must be <= 99

; ***** DO NOT CHANGE ANY CODE BETWEEN THESE MARKERS *****
; Library Routines used in this software - you must load API.s19 into the
; Simulator to use the following subroutines as detailed in the API Booklet
;
Config_Hex_Displays         equ        $2117
Delay_Ms                    equ        $211F
Hex_Display                 equ        $2139
Extract_Msb                 equ        $2144
Extract_Lsb                 equ        $2149

; Program Constants
STACK           equ     $2000

                                ; Port P (PPT) Display Selection Values
DIGIT1_PP2      equ     %1011   ; 2nd from Right-most display MSB
DIGIT0_PP3      equ     %0111   ; Reft-most display LSB

                org     $1000
Count_Mode      db      1       ; if Count_Mode = $00
;                                     count in HEX
;                                 if Count_Mode = $FF
;                                     count in BCD
;                                 endif
;
; ***** END OF DO NOT CHANGE ANY CODE BETWEEN THESE MARKERS *****

; Delay Subroutine Value
DVALUE  equ     #250            ; Delay value (base 10) 0 - 255 ms
                                ; 125 = 1/8 second <- good for Dragon12 Board

; Changing these values will change the Starting and Ending count
START_COUNT      equ     $00     ; Starting count
END_COUNT        equ     $15     ; Ending count

        org     $2000           ; program code
Start   lds     #STACK          ; stack location

        jsr     Config_HEX_Displays ; Use the Hex Displays to display the count
; Continually Count. Start as HEX counter, then switch to BCD, then HEX ...


























        end ; your solution should fit between Assembler Lines 74 and 101
            ; +/- 5 lines of code