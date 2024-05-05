// clock -- An alarm clock example
//   NOTE - Except for most significant bit, DIP Switches must be up (open)
//    MSB of DIP Switch sets AM/PM or 24-hour display mode
//    Switch SW2 -- toggles alarm arming (indicated by right decimal point LED), also
//    stops the alarm (without disarming) if it is sounding. Also used to view alarm
//    time and (when held down) will allow setting the alarm time.
//    Switch SW3 -- Depress and hold while setting the time.
//    Switch SW4 -- In combination with SW2 sets the alarm hour and with SW3 set the time hour
//    Switch SW5 -- In combination with SW2 sets the alarm minute and with SW3 sets the alarm hour
// Setting the time minutes or hours will also reset the internal seconds counter to zero. The
// buttons are debounced and the hour/minute setting have auto-repeat after 1/2 second every 1/4 second.
// The Left decimal point LED indicates "pm". The center decimal point LEDs flash once per second.
// The right decimal point LED indicates the alarm is armed.

/* This demo program is copyrighted by Tom Almy and is 
licensed for free use under the GNU Public License. 
*/

#define INTERRUPT __attribute__((interrupt))
#include"vectors12.h"
#include"ioregs12.h"

// Defines for push buttons -- these are masks that will match is the
// button is depressed (which gives a value of 0)

#define PB_MASK         (0x0f)          // Mask for the push buttons
#define ALARM_SW        (PB_MASK & ~8)  // Alarm switch
#define TIME_SW         (PB_MASK & ~4)  // Time set switch
#define HOUR_SW         (PB_MASK & ~2)  // Hour switch
#define MINUTE_SW       (PB_MASK & ~1)  // Minute Switch


// The AMPM switch 
#define AMPM_SW  (0x80)

// Decimal point bit in disptdp and dispadp.
#define POINT (0x80)
// Blank display value
#define BLANK (0x20) 

// Time constants
#define TB1MS   ((unsigned)24000)       // 1ms time base of 24,000 instruction cycles
                                        // 24,000 x 1/24MHz = 1ms at 24 MHz bus speed
#define INITIAL_REPEAT_DELAY (500)      // 500ms to initial repeat
#define REPEAT_DELAY (250)              // 250 ms repeat interval
#define DEBOUNCE_DELAY (10)             // 10 ms debounce time


// Data
unsigned char select = 0; // current digit index being displayed
unsigned char dispt[8] = {BLANK, BLANK, BLANK, BLANK};  // Time display digits
#define disptdp ((unsigned char *)&dispt[4]) // decimal points defined in last 4 locations
unsigned char dispa[8] = {0, 1, 0, 0, 0, POINT, POINT, 0}; // Alarm display digits
#define dispadp ((unsigned char *)&dispa[4]) // decimal points defined in last 4 locations
#define HOUR10    (0) // Some convenient aliases
#define HOUR1     (1)
#define MIN10     (2)
#define MIN1      (3)
#define PM        (4)
#define flashsec  disptdp[1]
#define flashsec2 disptdp[2]
#define alarmon   disptdp[3]
#define alarmon2  dispadp[3]
unsigned short millisecs;   // Millisecond counter (reset every second)
unsigned char  seconds;     // Seconds counter, reset every minute
unsigned char  debounce;    // time for debounce
unsigned char  lastButtons; // last button values
signed short   repeat;      // repeat time
signed short   repeatDelay; // Delay of next repeat
unsigned char  ledFraction; // counter for turning display on and off for brightness control
unsigned char  buzzing;     // The alarm is sounding

//  Segment conversion table:
// 
//  Binary number:                  0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F
//  Converted to 7-segment char:    0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F
// 
//  Binary number:                  10,11,12,13,14,15,16,17
//  Converted to 7-segment char:    G  H  h  J  L  n  o  o
// 
//  Binary number:                  18,19,1A,1B,1C,1D,1E,1F,20
//  Converted to 7-segment char:    P  r  t  U  u  y  _  -- Blank

const unsigned char segm_ptrn[] = {
    0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,
    0x7f,0x6f,0x77,0x7c,0x39,0x5e,0x79,0x71,
    0x3d,0x76,0x74,0x1e,0x38,0x54,0x63,0x5c,
    0x73,0x50,0x78,0x3e,0x1c,0x6e,0x08,0x40,
    0x00,0x01,0x48,0x41,0x09,0x49
};

// port value to select each LED digit                  
const unsigned char dspmap[] = {0x0e, 0x0d, 0x0b, 0x07};

// Timer 5 operates the speaker 
// Pin PT5 is enabled to sound the alarm, but
// interrupts occur constantly
void INTERRUPT timer5(void) {
    TFLG1 &= 0x20; // clear flag
    TC5 += TB1MS*2;
}

// Timer 6 keeps the display refreshed
void INTERRUPT timer6(void) {
    TFLG1 &= 0x40;                  // Next interrupt in 1ms
    TC6 += TB1MS;
    __asm__  __volatile__ (" cli ");    /* Enable interrupts */
    select = (select+1) & 3; // Go to next digit
    PORTB = 0; // While we change, at least, we want display off
    if (ledFraction + ADR00H > 255) { // display
        PTP = (PTP & 0xf0) | dspmap[select];
        if ((PTH & PB_MASK & ~ALARM_SW) == 0) { // Display Alarm Value
            PORTB = segm_ptrn[dispa[select]] | dispadp[select];
        } else { // Display current value
            PORTB = segm_ptrn[dispt[select]] | disptdp[select];
        }
    } 
    if (select==0) ledFraction += ADR00H; // Save updated fraction
}


// Increment minutes of the given display array
// returns a "1" if a carry into hours is necessary
int incrementM(unsigned char *disp) {
    if (++disp[MIN1] == 10) {
        disp[MIN1] = 0;
        if (++disp[MIN10] == 6) {
            disp[MIN10] = 0;
            return 1; // carry into next digit
        }
    }
    return 0;
}

// Increment hours of the given display array
void incrementH(unsigned char *disp) {
    if (++disp[HOUR1] == 10) {
        disp[HOUR1] = 0;
        if (PTH & AMPM_SW) {
            disp[HOUR10] = (disp[HOUR10]+1) & 0x0f; // we want blank to go to 1, 1 to 2
        } else {
            disp[HOUR10]++;
        }
    }
    if (PTH & AMPM_SW) {
        if (disp[HOUR1] == 3 && disp[HOUR10] == 1) { // Wrap at 13 o'clock
            disp[HOUR10] = BLANK;
            disp[HOUR1] = 1;
        } else if (disp[HOUR1] == 2 && disp[HOUR10] == 1) { // AMPM switches at 12
            disp[PM] ^= POINT; // Toggle AMPM indicator
        }
    } else {
        if (disp[HOUR1] == 4 && disp[HOUR10] == 2) { // wrap at 2400
            disp[HOUR10] = 0;
            disp[HOUR1] = 0;
        }
    }
}

// On the half-second we flash the colon and (if clock not set) the
// display.
void halfSecond(void) {
    flashsec2 = (flashsec ^= POINT); // flash the colon
    if (dispt[MIN10] == BLANK || dispt[MIN10] == 8) { // clock not set (flashing 8's)
        dispt[HOUR10] ^= (BLANK ^ 8);
        dispt[HOUR1] ^= (BLANK ^ 8);
        dispt[MIN10] ^= (BLANK ^ 8);
        dispt[MIN1] ^= (BLANK ^ 8);
    }
}

// Turn off the alarm
void alarmOff(void) {
    TCTL1 |= 8;  // turn off alarm sound
    buzzing = 0;
}

// Turn on the alarm if the alarm is enabled and the alarm time reached
// Also, turn off the alarm if the time has passed. This function is
// only called once per minute.
void alarmCheck(void) {
    if (alarmon &&
          dispa[HOUR10]==dispt[HOUR10] &&
          dispa[HOUR1]==dispt[HOUR1] &&
          dispa[MIN10] == dispt[MIN10] &&
          dispa[MIN1] == dispt[MIN1] &&
          ((PTH&AMPM_SW) == 0 || dispa[PM] == dispt[PM])) {
        TCTL1 &= ~8; // turn on alarm sound
        buzzing++;
    } else {
        alarmOff();
    }
}

// If the clock isn't set, this function will set the time to 1AM or
// 00:00 if 24 hour time
void powerOnCheck(void) {
    if (dispt[MIN10] == BLANK || dispt[MIN10] == 8) { // clock not set
        if (PTH & AMPM_SW) {
            dispt[HOUR10] = BLANK;
            dispt[HOUR1] = 1;
        } else {
            dispt[HOUR10] = 0;
            dispt[HOUR1] = 1;
        }
        dispt[MIN10] = 0;
        dispt[MIN1] = 0;
    }
}

// Process the buttons
void buttonCheck(void) {
    unsigned char temp = PTH & PB_MASK; // only look at bottom switches
    if (lastButtons != temp) { // new button combination
        lastButtons = temp;
        debounce = DEBOUNCE_DELAY; // wait before processing
        repeat = -1;  // signify initial depression
        repeatDelay = INITIAL_REPEAT_DELAY;
        return;
    }
    if (debounce != 0) { // we are debouncing
        debounce--;
        return;
    }
    if (temp == (TIME_SW & MINUTE_SW)) { // Minute Time set
        if (repeat > 0) { // waiting for repeat
            repeat--;
        } else {
            repeat = repeatDelay;
            repeatDelay = REPEAT_DELAY;
            powerOnCheck();
            seconds = 0;    // reset seconds
            incrementM(dispt);
        }
    } else if (temp == (TIME_SW & HOUR_SW)) { // Hour Time set
        if (repeat > 0) { // waiting for repeat
            repeat--;
        } else {
            repeat = repeatDelay;
            repeatDelay = REPEAT_DELAY;
            powerOnCheck();
            seconds = 0;    // reset seconds
            incrementH(dispt);
        }
    } else if (temp == (ALARM_SW & MINUTE_SW)) { // Minute Alarm set
        if (repeat > 0) { // waiting for repeat
            repeat--;
        } else {
            repeat = repeatDelay;
            repeatDelay = REPEAT_DELAY;
            incrementM(dispa);
        }
    } else if (temp == (ALARM_SW & HOUR_SW)) { // Hour Alarm set
        if (repeat > 0) { // waiting for repeat
            repeat--;
        } else {
            repeat = repeatDelay;
            repeatDelay = REPEAT_DELAY;
            incrementH(dispa);
        }
    } else if (temp == TIME_SW) { // Just the Time button
        powerOnCheck();
    } else if (temp == ALARM_SW) { // Just the Alarm button
        if (repeat < 0) { // don't allow repeats
            repeat = 0;
            if (buzzing) {
                alarmOff();
            } else {
                alarmon2 = (alarmon ^= POINT);
            }
        }
    }
}

// Timer 7 updates the time and handles the user input interface (the buttons)
void INTERRUPT timer7(void) {
    TFLG1 &= 0x80;                  // Next interrupt in 1ms
    TC7 += TB1MS;
    __asm__  __volatile__ (" cli ");    /* Enable interrupts */
    millisecs++;     // Increment miliseconds
    if (millisecs == 500) { // On the half second
        halfSecond();
    } else if (millisecs == 1000) { // On the second
        millisecs = 0;
        if (dispt[MIN10] != BLANK && dispt[MIN10] != 8) { // clock is set
            if (++seconds == 60) {  // On the minute
                seconds = 0;
                if (incrementM(dispt)) incrementH(dispt);
                alarmCheck();
            }
        }
        halfSecond();
    }
    buttonCheck();
}

// Main function does initialization and returns to idle process
// (waits for interrupts) which is in startup code.
int main(void) {
    __asm__  __volatile__ (" sei ");    /* Disable interrupts */

    // Setup PLL if in EEPROM
    SYNR = 2;               /* Use 5 for DRAGON12 */
    while ((CRGFLG & 0x8) == 0);
    CLKSEL = 0x80;

    // Set the interrupt vectors
    UserTimerCh5 = (unsigned int) &timer5;
    UserTimerCh6 = (unsigned int) &timer6;
    UserTimerCh7 = (unsigned int) &timer7;

    PTP = 0xff;   // Turn off 7 segment display

    DDRB = 0xff;  // portb = output
    DDRP = 0xff;  // portp = output
    DDRH = 0x00;  // porth = input

    TSCR = 0x80;  // enable the timer
    TIOS = 0xe0;  // select t5, t6, t7 as an output compares
    TMSK1 = 0xe0; // enable interrupts for t5, t6, t7
    TCTL1 = 0x0c; // configure t5 for eventual toggling of PT5
                  // when alarm sounds
    ATD0CTL2 = 0x80; // Enable ATD operation
    ATD0CTL3 = 0x08; // single conversion performed
    ATD0CTL4 = 0x80; // 8 bit conversion
    ATD0CTL5 = 0x27; // Continuously (SCAN=1) read channel 7

    __asm__  __volatile__ (" cli ");    /* Enable interrupts */

    // We are done initializing, so return to "idle process"
}
