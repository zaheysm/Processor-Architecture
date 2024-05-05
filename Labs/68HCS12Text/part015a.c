/* RTI Example in C */
/* Copyright 2005 by Thomas Almy */
#include "ioregs12.h"
#include "vectors12.h"
static volatile int count;

void __attribute__((interrupt)) rtiint(void) {
    CRGFLG = 0x80; /* clear the RTI flag */
    count++;
}

int main() {
     /* Initialize the RTI */
     count = 0;
     RTICTL = 0x23;   /* Set RTI Rate to 1.024ms */
     CRGINT |= 0x80;  /* Enable RTI interrupts */
     /* Initialize the interrupt vector */
     UserRTI = (unsigned int)&rtiint;
     __asm__ __volatile__ (" cli "); /* enable interrupts */
     while (1) { /* repeat forever */
           __asm__ __volatile__ (" wai ");
     }
     return 0; /* We never reach this */
}
