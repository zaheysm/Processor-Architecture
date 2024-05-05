/* This demo program is copyrighted by Tom Almy and is 
licensed for free use under the GNU Public License. 
*/

/* Buffered serial port 1 example (same as part022c.asm ) */

#include"vectors12.h"
#include"ioregs12.h"

/* Output buffer -- 64 byte circular FIFO buffer */
#define BUFSIZE 64
unsigned char buffer[BUFSIZE];
unsigned char * volatile bufin = buffer;
unsigned char * volatile bufout = buffer;

volatile unsigned char charin = 0; /* Input buffer -- single byte */

#define INTERRUPT __attribute__((interrupt))

void INTERRUPT serint(void) {
    if ( SC1SR1 & 0x20 ) {
        /* RDRF is set */
        charin = SC1DRL;
    }
    if ( SC1SR1 & 0x80 ) {
        /* TDRE is set */
        if ( bufin == bufout ) {
            /* Done -- disable transmitter interrupt */
            SC1CR2 &= ~0x80;
        } else {
            SC1DRL = *bufout++;
            if ( bufout == buffer+BUFSIZE ) {
                bufout = buffer;
            }
        }

    }

}

unsigned char getchar(void) {
    unsigned char result;
    while ( (result = charin) == 0 ) {
        __asm__ __volatile__ (" wai ");
    }
    charin = 0;
    return result;
}

void putchar(unsigned char val) {
    do {
        int used = bufin - bufout;
        if ( used < 0 ) used += BUFSIZE;
        if ( used < BUFSIZE-1 ) {
            break;
        }
        __asm__  __volatile__ (" wai ");
    } while ( 1 ); /* loop until break */
    *bufin++ = val;
    if ( bufin == buffer+BUFSIZE ) {
        bufin = buffer;
    }
    SC1CR2 |= 0x80; /* Make sure transmitter interrupt enabled */
}

int main(void) {
    UserSCI1 = (unsigned int)&serint;
    SC1BDL = 156; /* Set 9600 BPS */
    SC1CR2 = 0x2c; /* Set RIE, TE, RE bits */
    __asm__  __volatile__ (" cli ");    /* Enable interrupts */
    while (1) { /* Repeat forever */
        /* Read a character and echo it 40 times on a line */
        unsigned char val = getchar();
        int i;
        for (i = 0; i < 40; i++)
            putchar(val);
        putchar('\r'); /* carriage return */
        putchar('\n'); /* line feed */
    }
}
