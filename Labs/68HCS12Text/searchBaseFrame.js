//----------------------------------------------------------------------------
//
//   rainer eschen web.solutions
//                 _      __    __       __  _            ____  _
//                | | /| / /__ / /  ___ / /_(_)__ ___ ____ | |\/|
//                | |/ |/ / -_) _ \/ -_) __/ (_-</ -_) __/
//                |__/|__/\__/_.__/\__/\__/_/___/\__/_/
//
//                                            More sex appeal for the Web.
//
//
//
//   Copyright (c) 1997-2003 by rainer eschen web.solutions
//                 All rights reserved.
//
//   Frame Version 7.0 (02/21/2002)
//
//   Code can be changed. But it is not recommended - to be compatible 
//   with future releases. Use searchDefinitions.js for new or overwriting of
//   existing definitions instead.
//
//   You are not allowed to change the mechanism to create the copyright 
//   line at the end of the hitlist (variables "lastupdate", 
//   "lastUpdateString", "copyrightString", function "footer()" - although, 
//   translation is allowed).
// 
//----------------------------------------------------------------------------
//
// indexHTML: consts
var index_max = 131;
var glossaryMode = false;
var lastupdate = "6/29/2011, 5:47:01 PM";  // Created by Webetiser(tm) indexHTML 3.0 (Wine, Fast-hack 5), Thomas Almy

// Hitlist output
var textColor                 = "#000000";          // <Body> definition
var linkColor                 = "#000000";
var vLinkColor                = "#606060";
var aLinkColor                = "#C0C0C0";
var backgroundColor           = "#FFFFFF";
var backgroundImage           = "background.gif";
var tableWidth                = "640";              // Table
var tableColor                = "#D6D6D6";
var tableOuterColor           = "#EEEEEE";
var charset                   = "Verdana,geneva,ARIAL,HELVETICA,Helv,Swiss";
var charNormal                = "2";                // Size of chars
var charSmaller               = "1";
var outputWindowRef           = "parent.searchoutput.";
                                                    // Reference to output
                                                    // window
var linkTarget                = '';                 // Target definitions for
var linkTarget2               = '';                 // links in hitlist                                   
var run                       = 0;                  // Number of searches

// Localization strings
var orNotExpectedString       = "OR, NOT, search term or '(' expected";
var ParenthesisExpectedString = "')' expected";
var keywordExpectedString     = "Keyword expected";
var wrongInputString          = "Wrong input: ";
var lookString                = " (look <).";
var beginCaseString           = "Begin of word, Case-sensitive";
var caseString                = "Case-sensitive";
var beginString               = "Begin of word";
var hitlistTitleString        = "Hitlist client-side search engine";
var perCentString             = "Hits per cent";
var keywordString             = "Keyword";
var descriptionString         = "Description";
var noEntriesString           = "No entries found.";
var enterKeywordString        = "Please, enter a keyword first.";
var lastUpdateString          = "Last updated: ";
var copyrightString           = '.<br>Powered by <A HREF="http://www.Webetiser.com" TARGET="_blank">Webetiser&#153;</A>: Copyright &copy; 1997-2003 by Rainer Eschen.';
var searchString              = "search";

// Token Strings (These strings can't be keywords. Adapt your stopword list, first.)
var orTokenString             = "OR"
var andTokenString            = "AND"
var notTokenString            = "NOT"

// Index definition  
var entry                     = new arrayCreate();  // Database
var g;                                              // Glossary database

// Input frame
var cInputRef                 = null;               // Reference to edit field
var cInput                    = "";                 // Input string
var cHitlist                  = false;              // true == keep hitlist
var cBeginOfWord              = true;               // true == compare with begin 
var cCaseSensitive            = false;              // true == case-sensitive comparison 
var cNoInputForm              = false;              // true == no input form after link klick  

// Scanner variables
var cLiteral                  = "";                 // Keyword in input string
var input                     = "";                 // Rest of input string
var token                     = "";                 // Last found token

// Scanner tokens
var tEOF                      = 0; 
var tOr                       = 1; 
var tAnd                      = 2; 
var tNot                      = 3; 
var tParenthesisOpen          = 4; 
var tParenthesisClose         = 5;
var tLiteral                  = 6;

// Parser variables
var error                     = false;             // Error found, stop analysis

// Converting umlaute
var charsSmall                = "\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5\u00E6\u00E7\u00E8\u00E9\u00EA\u00EB\u00EC\u00ED\u00EE\u00EF\u00F0\u00F1\u00F2\u00F3\u00F4\u00F5\u00F6\u00F8\u00F9\u00FA\u00FB\u00FC\u00FD\u00FE";
var charsLarge                = "\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5\u00C6\u00C7\u00C8\u00C9\u00CA\u00CB\u00CC\u00CD\u00CE\u00CF\u00D0\u00D1\u00D2\u00D3\u00D4\u00D5\u00D6\u00D8\u00D9\u00DA\u00DB\u00DC\u00DD\u00DE";

//----------------------------------------------------------- Array handling -

function arrayCreate() {
// ***************************************************************************
// * Function...: arrayCreate
// * Description: Array object for entries
// ***************************************************************************

  this.item     = new Array();
  this.length   = aLength;    // Return length
  this.add      = aAdd;       // Add element
  this.concat   = aConcat;    // Concatenate two arrays and add the
                              // argument array to yourself 			 
  this.sort     = aSort;      // Sort array
}

function aLength() {
// ***************************************************************************
// * Function...: arrayCreate.length
// * Description: Return number of entries
// ***************************************************************************

  return this.item.length;
}

function aAdd(entry) {
// ***************************************************************************
// * Function...: arrayCreate.add
// * Description: Add entry to array
// ***************************************************************************

  this.item[this.item.length] = entry;
}

function aConcat(array) {
// ***************************************************************************
// * Function...: arrayCreate.concat
// * Description: Concatenate the array with yourself and return the
// *              self reference
// ***************************************************************************

  if (array != this) {
    for (var i = 0; i < array.length(); i++) {
      this.item[this.item.length] = array.item[i];
    }
  }
  return this;
}

function aSort(inFunction) {
// ***************************************************************************
// * Function...: arrayCreate.sort
// * Description: Set sort function
// ***************************************************************************

  this.item.sort(inFunction);
}

//----------------------------------------------------------- Array elements -

function entryCreate() {
// ***************************************************************************
// * Function...: entryCreate
// * Description: Database constructor
// ***************************************************************************

  this.keywords;            // All keywords
  this.page;                // URL of page
  this.description;         // Topic description of the page
}

function foundCreate() {
// ***************************************************************************
// * Function...: foundCreate
// * Description: "Keywords found" constructor
// ***************************************************************************

  this.position;                 // Corresponding position in database
  this.perCent    = 100;         // Percent of equal characters
  this.keywords   = "Klick";     // Found keywords (equal characters 
                                 // marked)
  this.exists     = false;       // true == entry already exists in array
  this.addPerCent = gAddPerCent; // Calculate percentage
  this.addKeyword = gAddKeyword; // Add keyword to list
}

function gAddPerCent(perCent) {
// ***************************************************************************
// * Function...: foundCreate.addPercent
// * Description: Calculate percentage (new keyword concatenation)
// ***************************************************************************

  this.perCent = Math.round((this.perCent + perCent) / 2);
}

function gAddKeyword(keyword) {
// ***************************************************************************
// * Function...: foundCreate.addKeyword
// * Description: Add new keyword
// ***************************************************************************

  if (this.keywords == "Klick") {
    this.keywords = keyword; 
  }
  else {
    if ((keyword == "Klick") && (this.keywords != "")) {
      // ignorieren
    }
    else { 
      if (this.keywords != keyword) {
        this.keywords = this.keywords + "<br>" + keyword;
      }
    }
  }
}

function sortPerCent(x,y) {
// ***************************************************************************
// * Function...: sortPercent
// * Description: Sort function for foundCreate.sort (according to
//                percentage)
// ***************************************************************************

  if (x.perCent < y.perCent) {return -1};
  if (x.perCent > y.perCent) {return 1};
  return 0;
}

//----------------------------------------------------------------- Database -

function init() {
// ***************************************************************************
// * Function...: init
// * Description: Init database
// ***************************************************************************

  for (var i = 0; i <= index_max; i++) {
    entry.add(new entryCreate());
  }
// indexHTML: glossary

// indexHTML: array
entry.item[0].keywords = "Answer,binary,bits,byte,data,digits,eight,memory," +
                         "microprocessor,processed,Question,smallest," +
                         "stored,unit";
entry.item[0].page = "ans01.html";
entry.item[0].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[1].keywords = "$7FFD,$7FFE,$8002,add,Answer,bit,bits,complement," +
                         "don,get,integer,negative,Question,represents," +
                         "signed,significant,two,unsigned,value";
entry.item[1].page = "ans02.html";
entry.item[1].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[2].keywords = "add,Added,Answer,back,binary,bit,complement," +
                         "Convert,decimal,get,problem,Question,Show,step," +
                         "sum,two,values,work";
entry.item[2].page = "ans03.html";
entry.item[2].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[3].keywords = "address,Answer,contain,contains,counter,executed," +
                         "executing,execution,following,instruction,memory," +
                         "phase,program,Question,read,register";
entry.item[3].page = "ans04.html";
entry.item[3].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[4].keywords = "Accumulator,accumulators,Answer,bit,byte,HCS12," +
                         "Question,relationship,upper";
entry.item[4].page = "ans05.html";
entry.item[4].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[5].keywords = "$10,$12,$2328,$2345,$4567,and/or,Answer,Assume," +
                         "changes,decimal,eight,first,following,gets," +
                         "hexadecimal,initial,location,memory,new,Question," +
                         "questions,register,staa,tell,value,values";
entry.item[5].page = "ans06.html";
entry.item[5].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[6].keywords = "$1000,access,addressing,Answer,asr,bytes,clock," +
                         "code,cycles,detail,execute,extended,four," +
                         "instruction,long,manual,mode,object,Question," +
                         "reference,rPWO,S12CPUV2,shows,take,three";
entry.item[6].page = "ans07.html";
entry.item[6].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[7].keywords = "$1000,Answer,clra,contains,index,instruction," +
                         "ldab,load,location,Memory,Question,register," +
                         "sequence,tfr,unsigned,value";
entry.item[7].page = "ans08.html";
entry.item[7].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[8].keywords = "Accumulator,Answer,considered,contains,Question," +
                         "range,signed,unsigned,value,values";
entry.item[8].page = "ans09.html";
entry.item[8].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[9].keywords = "$1020,$1021,$1022,$1023,adca,add,adda,Answer," +
                         "big-endian,byte,carry,code,four,increment,ldaa," +
                         "location,order,Question,sequence,staa,stored," +
                         "value,Write";
entry.item[9].page = "ans10.html";
entry.item[9].description = "An Answwer for Designing with " +
                            "Microcontrollers -- The 68HCS12";
entry.item[10].keywords = "#16,$2000,$200F,accumulator,address,addressing," +
                          "alternative,Answer,auto-increment,bls,bytes," +
                          "clear,clearing,clr,code,control,counter,cpx," +
                          "dbne,decrements,doesn,indexed,instance,inx," +
                          "iterate,iteration,ldaa,ldx,locations,memory," +
                          "mode,movb,number,Question,repeat,sequence," +
                          "slower,staa,starting,storing,structure,use,uses," +
                          "using,value,Write,zero";
entry.item[10].page = "ans11.html";
entry.item[10].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[11].keywords = "#A0,#T0,Answer,array,bit,blo,byte,clra,control," +
                          "copy,cpx,instruction,integers,iterative,ldab," +
                          "ldx,ldy,named,Question,sequence,signed," +
                          "signed/unsigned,std,structure,table,unsigned," +
                          "using,value,values,word,words,Write";
entry.item[11].page = "ans12.html";
entry.item[11].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[12].keywords = "#10,accumulator,Answer,bhi,bra,clra,cmpa,code," +
                          "equal,greater,integer,isHigh,ldaa,less,Question," +
                          "replace,sequence,unsigned,value,Write";
entry.item[12].page = "ans13.html";
entry.item[12].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[13].keywords = "Answer,correct,destination,example,exchange," +
                          "exchanging,Give,psha,pshb,pula,pulb,pull,pulled," +
                          "push,Question,register,stack,two,using,value," +
                          "values";
entry.item[13].page = "ans14.html";
entry.item[13].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[14].keywords = "accumulator,Answer,byte,bytes,contents," +
                          "effectively,garbage,least,PULD,pulled,pushed," +
                          "Question,significant,stack,two,using,value";
entry.item[14].page = "ans15.html";
entry.item[14].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[15].keywords = "Answer,baud,belong,case,control,data,definition," +
                          "device,documentation,I/O,Interface,List,Look," +
                          "meets,module,names,Peripheral,Question,rate," +
                          "register,registers,say,Serial,SPI,SPI0BR," +
                          "SPI0CR1,SPI0CR2,SPI0DR,SPI0SR,status,type";
entry.item[15].page = "ans16.html";
entry.item[15].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[16].keywords = "Answer,Assuming,breaking,clock,devices,edge," +
                          "edges,equal,gives,hold,input,interface,less," +
                          "maximum,MHz,minimum,occur,output,period,plus," +
                          "possible,propagation,Question,rate,setup,skew," +
                          "specification,synchronous,time,timing";
entry.item[16].page = "ans17.html";
entry.item[16].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[17].keywords = "Answer,bclr,branch,brset,configure,ddrm,foo," +
                          "input,instruction,instructions,insure,internal," +
                          "location,logical,operation,perm,pin,Port,ptim," +
                          "pullup/pulldown,Question,sequence,test,used";
entry.item[17].page = "ans18.html";
entry.item[17].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[18].keywords = "Answer,assuming,bclr,both,bset,clock,configured," +
                          "cycles,execute,generate,initially,instruction," +
                          "instructions,low,MHz,output,pin,point,port," +
                          "positive,ptj,pulse,Question,sequence,state," +
                          "system,takes,time,width,written";
entry.item[18].page = "ans19.html";
entry.item[18].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[19].keywords = "Answer,distinctive,execution,expected,interrupt," +
                          "jump,left,locations,makes,performs,Question," +
                          "reset,Resets,specified,table,trap,vector";
entry.item[19].page = "ans20.html";
entry.item[19].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[20].keywords = "Answer,bit,clear,CLI,code,condition,default," +
                          "enable,enabled,execute,initialization," +
                          "instruction,interrupt,IRQ,necessary,pin," +
                          "Question,register";
entry.item[20].page = "ans21.html";
entry.item[20].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[21].keywords = "Answer,clock,COP,crystal,divisor,failure," +
                          "frequency,gives,here,interrupt,matters,MHz," +
                          "minimum,period,Question,smallest,system,timeout";
entry.item[21].page = "ans22.html";
entry.item[21].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[22].keywords = "Answer,applied,Capture,channel,clock,clr,code," +
                          "configure,default,desired,divide,don,edges,get," +
                          "handle,interrupt,IOS0,long,maximum,measure,MHz," +
                          "module,movb,operation,Optional,overflow,period," +
                          "pin,polling,port,prescaler,purpose,Question," +
                          "rather,require,resolution,rising,seconds," +
                          "sequence,signal,system,TCNT,TCTL4,TEN,time," +
                          "timer,TIOS,TSCR1,TSCR2,use,used,using";
entry.item[22].page = "ans23.html";
entry.item[22].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[23].keywords = "$04,Answer,Assuming,Based,channel,clock,create," +
                          "crystal,divider,get,give,going,maximum,MHz," +
                          "microseconds,modulator,period,PLL,positive," +
                          "PPOL2,prescaler,problem,pulse,PWM,PWMDTY2,PWME," +
                          "PWME2,PWMPER2,PWMPOL,Question,range,Register," +
                          "registers,setting,settings,sufficient,system," +
                          "using,width";
entry.item[23].page = "ans24.html";
entry.item[23].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[24].keywords = "Answer,applied,assuming,ATD,bit,bits,code," +
                          "conversion,equation,expected,get,given,high," +
                          "input,low,measurement,Question,reference," +
                          "right-justified,round,Substituting,text,values," +
                          "voltage,volts,V-V";
entry.item[24].page = "ans25.html";
entry.item[24].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[25].keywords = "ADDR0,address,Answer,byte,connecting,considered," +
                          "control,decoding,ECLK,external,harm,high-order," +
                          "instructions,lines,listed,LSTRB,memory,needed," +
                          "Question,read,requested,ROM,signals,used,word";
entry.item[25].page = "ans26.html";
entry.item[25].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[26].keywords = "$1002,$39,$8000,$9002,$E5002,access,added," +
                          "address,Answer,binary,bits,clarity,location," +
                          "lower,need,offset,page,physical,PPAGE,problem," +
                          "Question,reference,six,Spaces,starting,upper," +
                          "visible,window";
entry.item[26].page = "ans27.html";
entry.item[26].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[27].keywords = "Answer,bit,communcation,low,Question,range," +
                          "receiver,represent,represents,RS-232,say,space," +
                          "voltage,voltages,volts";
entry.item[27].page = "ans28.html";
entry.item[27].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[28].keywords = "Answer,appear,back,bit,bits,bythe,captured,data," +
                          "device,devices,effective,explain,first,four," +
                          "interfaced,last,least,length,lower,LSBFE," +
                          "microcontroller,multiple,needs,Question," +
                          "reasoning,received,register,shift,shifted," +
                          "shifting,shows,significant,single,SPI,text," +
                          "transmitted,upper";
entry.item[28].page = "ans29.html";
entry.item[28].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[29].keywords = "$10,$11,$30,address,Answer,append,argument," +
                          "binary,bit,bus,bytes,Call,calls,gives,IICSTART," +
                          "IICSTOP,IICTRANSMIT,library,operation,Question," +
                          "sequence,subroutine,supplied,using,write";
entry.item[29].page = "ans30.html";
entry.item[29].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[30].keywords = "Answer,BDLC,BDM,busses,clock,data,derived," +
                          "explicit,has/have,IIC,interfaces,MSCAN,Question," +
                          "rather,SCI,SCK,SCL,serial,signal,SPI,Wire";
entry.item[30].page = "ans31.html";
entry.item[30].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[31].keywords = "$0000,$00FF,ADC,Answer,bit,calculation,carry," +
                          "code,counts,factor,five,get,input,integer," +
                          "larger,means,measured,millivolts,mode,multiply," +
                          "need,Note,produces,Question,represent,scale," +
                          "seen,times,unitless,units,value,values,voltage," +
                          "volts";
entry.item[31].page = "ans32.html";
entry.item[31].description = "An Answwer for Designing with " +
                             "Microcontrollers -- The 68HCS12";
entry.item[32].keywords = "$1f,$20,$7f,ACK,ASCII,backspace,BEL,bell," +
                          "carriage,Character,Chart,Code,Codes,DC1,DC2,DC3," +
                          "DC4,DEL,DLE,ENQ,EOT,ESC,escape,ETB,ETX,feed," +
                          "functions,horizontal,ignored,line,NAK," +
                          "non-printing,Notes,NUL,null,prints,represent," +
                          "return,SOH,space,special,STX,SUB,SYN,tab,used";
entry.item[32].page = "ascii.html";
entry.item[32].description = "ASCII Character Chart";
entry.item[33].keywords = "advanced,advisor,Almy,analysis,ASIC,assembly," +
                          "Author,automated,Basic,circuit,circuits," +
                          "controllers,controls,Cornell,courses,Credence," +
                          "data,degree,Design,designed,designing,designs," +
                          "digital,disk,Distinction,drivers,eight,employed," +
                          "Engineer,environmental,equipment,floppy,Forth," +
                          "Freescale,HC11,HC12,HC16,holds,implementation," +
                          "included,Industries,Institute,integrated,Intel," +
                          "interpreters,involved,keyboard,language," +
                          "mainframes,Microcontroller,microcontrollers," +
                          "microprocessor,microprocessors,minicomputers," +
                          "motor,MSEE,Oregon,patents,pertaining,Principal," +
                          "Prior,processor,programming,programs,project," +
                          "received,Senior,sensors,servo,Stanford,stepper," +
                          "Systems,taught,Technology,Tektronix,test," +
                          "testing,Tom,University,using,variety,Veris," +
                          "written,x86,years,Z-80,Zilog";
entry.item[33].page = "author.html";
entry.item[33].description = "About the Author";
entry.item[34].keywords = "$0000,$30,$38,$3A,$3C,$3D,$3E,$3F,$4000,$7FFF," +
                          "$8000,access,accessed,adding,additional," +
                          "Additionally,address,addresses,allow,allowed," +
                          "allows,alternatives,amount,appears,Appendix," +
                          "application,applications,architecture,area,aren," +
                          "Arts,ATD,ATDDIEN,attempts,based,BDLC,BDM,BFFF," +
                          "bit,bits,Breakpoints,brings,brought,bus,byte," +
                          "bytes,C128,C32,C64,C96,channel,channels,ChipS12," +
                          "clock,code,command,commands,components," +
                          "configuration,configured,connected,consist," +
                          "consult,contains,convenient,converter,cost," +
                          "count,CPU,crystal,Data,D-Bug12,DD2,DDRAD," +
                          "debugger,debugging,default,defaulting,described," +
                          "design,details,determine,develop,developed," +
                          "Development,device,differ,Differences,different," +
                          "difficult,digital,discussed,DP256,DPI," +
                          "DRAGONfly12,easy,ECLK,EEPROM,Elektronik,enabled," +
                          "enables,enhanced,enhancements,example,Except," +
                          "exclusively,expense,extended,external,fairly," +
                          "families,Family,far,features,few,Fewer,FFF," +
                          "filling,First,Flash,flexability,following,four," +
                          "Freescale,full,fully,function,functions,GC128," +
                          "GC16,GC32,GC64,GC96,general,HALT,having,HCS12," +
                          "header,Here,I/O,IIC,immediately,implement," +
                          "implemented,implmemented,important,Index," +
                          "initialized,input,inputs,inserting,instead," +
                          "instruction,interface,interfacing,internal," +
                          "interrupt,interrupts,Introduction,invisible,IRQ," +
                          "issue,key,Laden,latency,least,list,load,loading," +
                          "locations,lost,low,lower,LSTRB,makes,making," +
                          "matter,MC9S12C,MC9S12C128,MC9S12C32,MC9S12DP256," +
                          "measure,meets,members,Memory,microcontroller," +
                          "microcontrollers,minimize,minimum,MISO,missing," +
                          "MODA,MODB,MODRR,modular,module,modules,modulo," +
                          "monitor,MOSI,mounted,much,multiplexed," +
                          "multiplexer,NanoCore12,Next,none,non-volatile," +
                          "Note,number,occur,odd,omitted,omitting," +
                          "operation,output,outputs,PA0,PA1,PA2,package," +
                          "packages,Page,Pages,part,PB4,PERAD,performed," +
                          "pin,Pinout,pins,pod,popular,port,PORTAD,Ports," +
                          "position,positions,possible,power,PPAGE,PPSAD," +
                          "presence,probably,produce,products,program," +
                          "projects,provided,provides,PS2,PS3,PTAD,PTIAD," +
                          "pulldown,Pullup,pull-ups,purpose,PWM,quantity," +
                          "RAM,range,RDRAD,read,reading/writing,reason," +
                          "reduced,redundant,reference,regain,register," +
                          "registers,relocating,remaining,remains," +
                          "requirements,requiring,resources,Return," +
                          "re-vectoring,rewriting,ROMHM,ROMON,route,run," +
                          "run/load,RXCAN,RXD,SCI,SCK,Search,section,sees," +
                          "select,selected,selecting,selection,selects," +
                          "Semiconductor,settings,Sheet,should,signals," +
                          "significant,simultaneously,single,Size,small," +
                          "smaller,software,source,space,SPI,SS2,start," +
                          "still,storage,support,supported,supports,switch," +
                          "system,systems,Technology,temporary,Text,Timer," +
                          "Tools,trace,traditionally,Two,TXCAN,TXD," +
                          "unavailable,unlike,upper,usable,Use,used,useful," +
                          "uses,using,variation,variations,vectors,Version," +
                          "versions,visable,visible,voltage,way,whether," +
                          "wide,Window,windows,work,Wytec,XADDR,XCLKS,XIRQ";
entry.item[34].page = "c32.html";
entry.item[34].description = "MC9S12C Family";
entry.item[35].keywords = "Agreement,Alarm,Almy,Appendices,Application," +
                          "Arithmetic,Arrays,ASCII,Assembler,Binary," +
                          "Branching,Bus,Central,Characteristics,Chart," +
                          "Circuit,Clock,Clocks,Communications,contents," +
                          "convenience,Converter,COP,Copyright,CPU," +
                          "De-bounced,Decision,Designing,Development," +
                          "Digital,Displays,document,Documentation," +
                          "educational,EEPROM,EEPROM/ROM,Electrical," +
                          "Example,except,External,Family,Floating," +
                          "Freescale,Frequency,Fuzzy,General,HC12,http,I/O," +
                          "Implementing,Index,indicated,Information," +
                          "Input/Output,Instruction,Instructions,Integer," +
                          "Interface,Interfaces,Interfacing," +
                          "Inter-Integrated,Internal,Interrupts," +
                          "Introduction,Iteration,Keyboard,License,Load," +
                          "Logic,Machines,Mapping,MC9S12C,Memory," +
                          "Memory/Peripheral,Meter,Microcontroller," +
                          "Microcontrollers,Modulation,Module,Move," +
                          "Multiple,NOTICE,Number,obtain,Overview,Parallel," +
                          "Peripheral,Pins,Point,Ports,Processes," +
                          "Processing,Program,Programs,provided,Pulse," +
                          "Purpose,Putting,Questions,Representation,Resets," +
                          "Resource,RTI,Sample,Scaled,Search,Sections," +
                          "Semiconductor,Serial,should,Software,Stack," +
                          "State,Store,Study,Subroutines,System,Tables," +
                          "Template,Text,Thomas,Time-Multiplexed,Timer,Tom," +
                          "Tools,Traps,Trees,Unit,use,Using,versions," +
                          "Warranty,website,Width,www";
entry.item[35].page = "index.html";
entry.item[35].description = "Designing with Microcontrollers -- The 68HCS12";
entry.item[36].keywords = "access,accessible,achieve,agree,Agreement," +
                          "agrees,Almy,AsmIDE,Assembler,assembly,author," +
                          "book,bottom,case,charge,class,com/errata," +
                          "commercial,Company,computer,computers,Consult," +
                          "contents,copies,copy,Copyright,copyrighted," +
                          "corrections,Datasheets,days,defective,Designing," +
                          "destroys,details,domain,DRAGON12,educational," +
                          "Engler,Eric,errata,errors,expensive,expressed," +
                          "fairly,figures,file,files,free,freeware,further," +
                          "given,HCS12,hcs12text,his/her,html,http,implied," +
                          "inc,including,indicated,installed,items," +
                          "language,less,liability,License,licensed," +
                          "limited,line,listed,long,make,manufacturers," +
                          "Microcontrollers,Mozilla,much,multiple,new," +
                          "non-commercial,Notice,obligation,part,person," +
                          "personal,persons,placed,price,priced,printed," +
                          "probably,program,Public,purchase,purchaser," +
                          "reasonably,redistributed,registers,replaced," +
                          "restrictions,resulting,Revision,rights," +
                          "Ruletwister,Sabram,sell,server,setting," +
                          "shareware,shipment,simulator,single,sole,source," +
                          "Steve,terms,text,Thomas,time,trademark,treat," +
                          "under,Unless,use,used,using,Warranty,words," +
                          "Wytec";
entry.item[36].page = "info.html";
entry.item[36].description = "Designing with Microcontrollers";
entry.item[37].keywords = "ABA,ABX,ABY,ADCA,ADCB,ADDA,ADDB,ADDD,aliases," +
                          "alphabetical,ANDA,ANDB,ANDCC,ASL,ASLA,ASLB,ASLD," +
                          "ASR,ASRA,ASRB,Background,based,BCLR,BGND,BITA," +
                          "BITB,BRA,branches,BRCLR,BRN,browser,BRSET,BSET," +
                          "BSR,Bxx,CALL,CBA,check,CLC,CLI,CLR,CLRA,CLRB," +
                          "CLV,CMPA,CMPB,COM,COMA,COMB,compatibility," +
                          "conditional,CPD,CPS,CPU,CPX,CPY,DAA,DBEQ,DBNE," +
                          "Debug,DEC,DECA,DECB,DES,DEX,DEY,discussed," +
                          "earlier,EDIV,EDIVS,EMACS,EMAXD,EMAXM,EMIND," +
                          "EMINM,EMUL,EMULS,EORA,EORB,ETBL,EXG,FDIV,find," +
                          "first,function,grouped,HC11,HC12,IBEQ,IBNE,IDIV," +
                          "IDIVS,INC,INCA,INCB,including,Index,INS," +
                          "Instruction,instructions,interested,INX,INY," +
                          "italics,JMP,JSR,LBRA,LBRN,LBXX,LDAA,LDAB,LDD," +
                          "LDS,LDX,LDY,LEAS,LEAX,LEAY,links,long,LSL,LSLA," +
                          "LSLB,LSLD,LSR,LSRA,LSRB,LSRD,Manual,MAXA,MAXM," +
                          "MEM,MINA,MINM,mnemonic,mnemonics,Mode,MOVB,MOVW," +
                          "MUL,NEG,NEGA,NEGB,NOP,ORAA,ORAB,ORCC,order,page," +
                          "processor,provided,PSHA,PSHB,PSHC,PSHD,PSHX," +
                          "PSHY,PULA,PULB,PULC,PULD,PULX,PULY,Reference," +
                          "REV,REVW,ROL,ROLA,ROLB,ROR,RORA,RORB,RTC,RTI," +
                          "RTS,S12CPUV2,SBA,SBCA,SBCB,search,SEC,SEI,SEV," +
                          "SEX,STAA,STAB,STD,STOP,STS,STX,STY,SUBA,SUBB," +
                          "SUBD,SWI,TAB,TAP,TBA,TBEQ,TBL,TBNE,text,TFR,TPA," +
                          "TRAP,TST,TSTA,TSTB,TSX,TSY,TXS,TYS,upward,Use," +
                          "WAI,WAV,XGDX,XGDY";
entry.item[37].page = "instindx.html";
entry.item[37].description = "68HC12 CPU Instruction Index";
entry.item[38].keywords = "accessing,addition,addressing,advanced,Alarm," +
                          "Almy,ALU,appendices,appendix,Application," +
                          "applications,approach,approaching,arithmetic," +
                          "Arrays,Assembler,assembly,assignments,ATD," +
                          "attention,base,based,basic,basically,basics," +
                          "BDLC,BDM,best,Binary,bit,board,book,Boolean," +
                          "both,Branching,buffering,campus,cannot,Central," +
                          "chapters,Characteristics,chip,choosing,Circuit," +
                          "clarify,classes,classified,clock,Clocks,CMOS," +
                          "codes,combination,communication,Communications," +
                          "Computer,condition,confusing,considerations," +
                          "constraints,control,controller,convenience," +
                          "conversion,Converter,COP,corresponds,cover," +
                          "covered,covering,covers,CPU,cross,data," +
                          "Debounced,Decision,defining,description,design," +
                          "designing,designs,development,difficult,digit," +
                          "Digital,digits,display,Displays,Documentation," +
                          "don,DRAGON12,Dragon12-Plus,driven,drives," +
                          "earlier,editor,EEPROM,effectively,Electrical," +
                          "emulator,engage,entries,example,examples," +
                          "expansion,experience,External,failure,family," +
                          "fear,features,final,first,Floating,flowcharts," +
                          "following,format,found,four,fractional," +
                          "Freescale,Frequency,frequent,function,functions," +
                          "Fuzzy,General,generic,get,given,ground," +
                          "Handshaking,handy,hard,hardware,HC12,HCS12,here," +
                          "history,HTML,human,I/O,IDE,IEEE,impementation," +
                          "Implementing,included,index,Individual," +
                          "information,input,Input/Output,Institute," +
                          "Instruction,instructions,Integer,integers," +
                          "intended,interaction,interface,Interfaces," +
                          "Interfacing,Inter-Integrated,Internal," +
                          "Interpolating,interrupt,interrupts,Introduction," +
                          "involving,IRQ,issues,Iteration,key,Keyboard," +
                          "keypad,know,language,LCD,lead,library,light," +
                          "line-oriented,Load,Logic,loop,loops,Machines," +
                          "mainly,makes,Mapping,marked,material,matrix," +
                          "meaningful,members,memory,Memory/Peripheral," +
                          "Meter,MHz,Microcontroller,microcontrollers," +
                          "modes,modular,Modulation,Module,modules,monitor," +
                          "Move,Multiple,multiplexed,multiprocessing," +
                          "multitasking,Negative,next,no-nonsense,nothing," +
                          "Number,Operating,operation,Oregon,organize," +
                          "output,Overview,own,panel,Parallel,parameters," +
                          "Passing,peripheral,pertaining,phase-locked,Pins," +
                          "placed,Point,poll,popular,Portland,ports," +
                          "post-test,power,Practical,practice,predecessor," +
                          "pre-test,Processes,Processing,Program," +
                          "programming,programs,project,Properly,provided," +
                          "Pulse,purchase,Purpose,put,Putting,PWM,quick," +
                          "reading,Real,reason,recommended,reference," +
                          "references,registers,Representation,request," +
                          "Resets,resolution,Resource,resulting,results," +
                          "returns,revisions,routine,routines,RS232,RTI," +
                          "Scaled,scaling,search,section,sections,segment," +
                          "selection,selects,sequence,Serial,service,short," +
                          "showing,simple,simpler,simulator,single,skipped," +
                          "software,specifically,specifics,SPI,Stack," +
                          "stacks,standard,State,still,storage,Store," +
                          "stretch,strongly,structures,student,students," +
                          "Subroutines,summary,supporting,survey,switch," +
                          "System,Systems,Tables,teach,techniques," +
                          "Technology,telegraph,Template,term,terminal," +
                          "terse,text,time,Time-Multiplexed,Timer,timing," +
                          "Tom,Tools,topics,traffic,Traps,Trees,TTL,two," +
                          "understood,unit,units,use,used,useful,using," +
                          "utilized,view,wake-ups,wanted,watchdog,way,ways," +
                          "week,weeks,Width,Wytec,XIRQ";
entry.item[38].page = "intro.html";
entry.item[38].description = "Designing with Microcontrollers -- The 68HCS12";
entry.item[39].keywords = "$1000,$1002,$1004,appear,assert,boxes,browser," +
                          "cause,check,code,controls,counts,disabled," +
                          "execution,exited,file,generating,happens," +
                          "interrupt,interrupts,IRQ,loading,location,log," +
                          "number,occurs,page,program,rate,reset,routine," +
                          "RTI,run,running,separate,service,Simulator," +
                          "snapshot,Step,stop,taking,Use,window,word,XIRQ," +
                          "zeroed";
entry.item[39].page = "intsx.html";
entry.item[39].description = "Multiple Interrupt Sources";
entry.item[40].keywords = "ability,Access,AD0,AD1,ADC,adding,additional," +
                          "address,address/data,addressing,advanced," +
                          "advantage,alarm,allows,amount,appendix,approach," +
                          "approaching,Architecture,architectures,Area," +
                          "arithmetic,ASCII,aspects,assist,assume," +
                          "Asynchronous,Atmel,attached,automatic," +
                          "automobiles,automotive,AVR,Background,based," +
                          "BDLC,bells,binary,bit,bits,bitwise,block,board," +
                          "Boolean,both,Breakpoint,built,bus,buses,byte," +
                          "byte-addressable,bytes,byte-sized,calculations," +
                          "calculators,calibration,called,cannot,capable," +
                          "case,cases,Central,change,changed,changes," +
                          "character,charge,chip,chips,classifications," +
                          "clock,clocks,close,collection,combination," +
                          "combinations,command,Communication,compete," +
                          "complete,complexity,computer,computers," +
                          "conditions,configuration,conflicts,connect," +
                          "connected,connecting,connection,connections," +
                          "considered,consists,contain,contains,contents," +
                          "control,controllable,controller,controllers," +
                          "converters,cost,costs,count,counted,Counters," +
                          "courtesy,covered,CPU,crystal,customer,Data," +
                          "Debug,debugging,decisions,design,designed," +
                          "designs,determined,development,device,devices," +
                          "diagram,differ,different,differs,difficulty," +
                          "digit,digital,Direct,discover,discussed," +
                          "displays,DMA,down-side,dozens,Dragon12-plus," +
                          "dynamic,early,easily,ECT,EEPROM,eight," +
                          "Electrical-mechanical,electro-mechanical," +
                          "electronic,Electronically,electrostatic," +
                          "elements,elevated,eliminating,engine," +
                          "engineering,entirety,environments,EPROM," +
                          "equipment,Erasable,erased,erasing,essential," +
                          "event,events,expensive,exposing,external," +
                          "externally,false,Family,far,features,few,fewer," +
                          "field,fields,find,first,Flash,following,forget," +
                          "forgotten,found,Freescale,functions,gates," +
                          "gauges,general,generation,generic,goals,Good," +
                          "grouped,groups,Guide,handle,Harvard,having,HC12," +
                          "HCS12,heating,help,high,High-end,hold,holding," +
                          "holds,hostile,human,humans,I/O,ideal,IIC," +
                          "immunity,implemented,implementing,important," +
                          "include,included,increases,increasing," +
                          "independent,Index,indicators,individual,input," +
                          "Input/Output,Inputs,instruction,instructional," +
                          "instructions,integer,Intel,inter-device," +
                          "interface,interfaces,Inter-IC,internal," +
                          "interrupt,Interrupts,intervention,isn,issue," +
                          "kilobyte,kilobytes,knobs,known,large,larger," +
                          "learning,least,less,light,lights,limited,Link," +
                          "liquid,list,listed,little,loaded,loading," +
                          "location,locations,long,look,loop,lost,low," +
                          "lower,lsb,Luxury,machinery,machines,made,major," +
                          "make,makes,making,manufacture,manufactured," +
                          "manufacturing,Mask,MC9S12C,MC9S12C32," +
                          "MC9S12DG256B,MC9S12DP256B,meaning,meanings," +
                          "means,meant,measure,mechanical," +
                          "mechanical/hydraulic,megabyte,megabytes,memory," +
                          "memory/peripheral,microcontoller," +
                          "Microcontroller,microcontrollers,microprocessor," +
                          "Microprocessors,microwave,milliseconds," +
                          "miniaturized,missing,modern,Modified,modular," +
                          "Modulators,modules,monitor,motors,mounted,msb," +
                          "much,multiple,multiplexer,name,need,needed," +
                          "needs,Network,networks,Neumann,Next," +
                          "non-volatile,Note,now,number,numbered,numerous," +
                          "occurred,often,older,operated,operating," +
                          "operation,operations,ordered,organized,OTP," +
                          "output,Outputs,ovens,overcame,Overview,own," +
                          "package,page,pairs,Parallel,part,parts,perform," +
                          "performing,performs,period,periodic,peripheral," +
                          "peripherals,personal,phase-locked,physical,pins," +
                          "placed,placing,popular,port,ports,position," +
                          "positioners,power,predefined,presents,preserved," +
                          "prevalent,price,primarily,printer,prioritized," +
                          "problems,Processing,processor,produces,program," +
                          "Programmable,programmed,programmer,programs," +
                          "PROM,properly,provide,provided,provides,Pulse," +
                          "pulses,pumps,purpose,PWM,quantity,question," +
                          "Questions,quickly,radio,RAM,Random,rate,Read," +
                          "reads,receiver,receivers,reduce,reduces," +
                          "reducing,Reference,referred,refreshed," +
                          "refreshing,relations,relays,reliability," +
                          "remainder,remote,removed,replaced,replacing," +
                          "represent,Representation,represented," +
                          "representing,represents,required,resolve," +
                          "respects,result,results,Return,revision," +
                          "re-writing,ROM,ROMs,routed,SCI,Search,second," +
                          "Section,seen,selected,sender,sensors,serial," +
                          "servo,several,signal,signals,signed,significant," +
                          "Significantly,silicon,simply,single,size,sizes," +
                          "slower,small,smaller,smallest,software," +
                          "Specialized,specific,specifically,Specifics," +
                          "specified,specify,speed,SPI,state,stated,states," +
                          "static,storage,store,stored,stores,strain,study," +
                          "subject,supplanted,support,switches,synchronize," +
                          "Synchronous,system,systems,tables,tachometers," +
                          "take,tasks,tech,telephones,temperature,tend," +
                          "terminal,terms,Text,thermometers,thermostats," +
                          "things,thought,three,ticks,time,Timers,times," +
                          "toasters,transfer,transferred,transmissions," +
                          "travels,true,turned,two,two-valued,type," +
                          "ubiquitous,ultraviolet,under,understanding,unit," +
                          "units,unless,unsigned,USB,use,used,useful,user," +
                          "Users,uses,using,utilizing,value,values,valves," +
                          "variation,variations,varieties,versions,viewed," +
                          "virtually,volatile,voltages,volumes,Von," +
                          "watchdog,ways,width,wire,word,words,working," +
                          "write,writes,writing,written,Wytec,years";
entry.item[40].page = "part001.html";
entry.item[40].description = "Microcontroller Overview";
entry.item[41].keywords = "$11,$114E,$1157,$1769,$1B8,$1BB,$273,$28,$2C," +
                          "$30,$39,$3A58,$3E,$5E34,accepted,accomplish," +
                          "accomplished,account,action,add,added,Addend," +
                          "addends,Adding,Addition,affected,Alas,algorithm," +
                          "algorithms,allowing,amazing,Analogous,answer," +
                          "appears,applied,approach,approaches,Arabic," +
                          "argument,arithmetic,ASCII,attempts,avoid,back," +
                          "basically,BCD,best,big,Binary,bit,bits,Boolean," +
                          "borrow,borrowed,borrows,both,byte,bytes," +
                          "calculate,calculated,calculation,calculations," +
                          "calculator,call,called,cannot,capability," +
                          "carries,carry,case,Central,Certainly,Change," +
                          "character,characters,chart,Check,Checking," +
                          "circumstances,cleverer,Coded,column,compare," +
                          "comparisons,Complement,complemented," +
                          "complementing,complete,completion,computer," +
                          "computers,confusing,Consider,considered," +
                          "consists,constructed,contained,containing," +
                          "Conversion,convert,converted,converting,correct," +
                          "covered,Create,data,dealing,Decimal,described," +
                          "detected,determine,didn,difference,different," +
                          "difficult,digit,Digits,display,displayed,divide," +
                          "divided,dividend,divides,Division,divisor," +
                          "dollar,don,down,E34,E34H,earlier,easier,easiest," +
                          "easily,easy,eight,elementary,encoded,encoding," +
                          "end,entering,enters,entirely,equation,erroneous," +
                          "evaluating,example,except,exist,fact,familiar," +
                          "fashion,feature,final,fine,fingers,Finished," +
                          "first,five,floating,following,four,fours," +
                          "Freescale,get,gets,give,given,gives,grade," +
                          "greater,group,grouped,half,hand,handle,handled," +
                          "handy,happen,hardware,having,help,Here," +
                          "Hexadecimal,high,hold,human,humans,hundred," +
                          "hundreds,identical,important,in-between," +
                          "incorrect,increasing,incremented,Index,indicate," +
                          "indicated,indicates,indicating,indication," +
                          "indicators,individual,inefficient,Initialize," +
                          "input,instance,instead,instructions,Integer," +
                          "Integers,Intel,involved,iteration,Keep,keyboard," +
                          "keypad,know,Knowing,language,large,larger,last," +
                          "later,LCD,leading,least,left,left-most,less,Let," +
                          "Lets,letter,letters,limitation,long,look," +
                          "looking,looks,low,LSB,magnitude,magnitude-1," +
                          "makes,manner,maximum,meanings,means,memory," +
                          "method,microcontroller,Microsoft,Minuend,mode," +
                          "modern,MSB,much,Multiplication,multiplies," +
                          "multiply,multiplying,N-1,namely,necessary,need," +
                          "negate,negated,negation,Negative,neighbors,Next," +
                          "non-zero,normally,Note,Now,Number,Numbers," +
                          "numerals,numeric,occupied,occurred,Octal,odd," +
                          "often,operands,operation,opposite,original," +
                          "Output,overflow,overflowed,overflows,own,panel," +
                          "partial,pattern,patterns,people,perform," +
                          "performed,performing,person,pitfalls,point," +
                          "position,Positive,possible,power,practice," +
                          "problem,process,Processing,processor,processors," +
                          "produce,produced,produces,producing,product," +
                          "programmer,put,Questions,quotient,radix,range," +
                          "rarely,rather,read,readable,Realizing,reason," +
                          "recognize,related,rely,remainder,remaining," +
                          "remember,repeat,represent,Representation," +
                          "representations,represented,representing," +
                          "represents,requires,respectively,result,results," +
                          "Return,review,right,right-most,rule,said,Say," +
                          "school,screen,Search,second,Section,seen," +
                          "selected,sensible,sent,seven,several,shift," +
                          "shifted,shifting,should,sign,Sign/Magnitude," +
                          "Signed,Significance,significant,signs,simple," +
                          "simplifies,simplify,sixteen,size,slightly," +
                          "smaller,space,special,start,starting,state," +
                          "stated,step,still,store,stored,string,Subtopics," +
                          "subtract,subtracting,Subtraction,Subtrahend," +
                          "suffers,sum,summarized,supplanted,surprise," +
                          "system,table,take,takes,taking,task,technique," +
                          "techniques,tedious,tells,tens,terms,Text,thing," +
                          "third,three,times,toggling,toughest,traditional," +
                          "trailing,treat,trivial,two,Twos,underflows," +
                          "understand,unit,units,unless,Unsigned,upper,use," +
                          "used,uses,using,valid,Value,values,via,way," +
                          "weight,Windows,wonder,word,work,works,worst," +
                          "wrong,x5e34,zero";
entry.item[41].page = "part002.html";
entry.item[41].description = "Binary Number Representation";
entry.item[42].keywords = "access,accessed,accumulator,Add,addition," +
                          "additional,Address,addressed,addresses," +
                          "addressing,ALU,Arithmetic-Logic,back,bandwidth," +
                          "based,bidirectional,bit,bits,bitwise,bold," +
                          "Boolean,branch,Bus,busses,byte,bytes," +
                          "calculations,called,capable,case,Central," +
                          "certain,changes,circuit,clock,code,communicate," +
                          "comparisons,Complement,components,concept," +
                          "confusing,connected,considerations,consists," +
                          "constant,contents,Control,controlled,controls," +
                          "corresponds,Counter,CPU,CPUs,crystal,data," +
                          "Decode,Decrement,Demonstration,design," +
                          "determined,devices,different,driven,drives," +
                          "emphasized,entire,examined,Examples,Execute," +
                          "executed,executing,execution,exist,expects," +
                          "external,fast,Faster,fetch,first,following," +
                          "given,HC12,held,high,hold,holding,holds,I/O," +
                          "ignored,implementation,include,increase," +
                          "Increment,incremented,Index,indicates," +
                          "indicating,Instruction,instructions,integrated," +
                          "Interface,internal,introduction,latch,later," +
                          "left,length,line,lines,load,loading,location," +
                          "locations,long,longer,look,low,lowers,makes," +
                          "manipulated,MAR,MDR,Memory,MHz,microcontroller," +
                          "microcontrollers,modern,multiplexed,necessary," +
                          "Negate,new,Next,normally,notably,Note,number," +
                          "numerous,obtains,often,opcode,operand,operands," +
                          "operation,operations,overlap,Overview,pad,page," +
                          "pages,paths,perform,performed,performing," +
                          "performs,peripheral,peripherals,phases,pins," +
                          "port,possible,Processing,processor,Program," +
                          "programmer,provided,purposes,Questions,raises," +
                          "read,reading,register,Registers,remaining," +
                          "requested,require,result,results,Return,right," +
                          "save,scratch,Search,Section,sections,select," +
                          "sends,sequence,sequences,several,Shift,shifting," +
                          "showing,signal,Signals,simple,single," +
                          "sophisticated,specific,Specifics,specified," +
                          "specify,split,start,still,stored,studying," +
                          "Subtract,subtraction,supplied,synchronize," +
                          "system,systems,table,tells,temporarily," +
                          "Temporary,Text,three,thus,time,transfer," +
                          "transferred,transfers,two,under,Unit,use,used," +
                          "user,values,wide,wider,word,write,writing," +
                          "written";
entry.item[42].page = "part003.html";
entry.item[42].description = "Central Processing Unit";
entry.item[43].keywords = "$00,$01,$02,$10,$1000,$1001,$1002,$2000,$2001," +
                          "$2002,$2003,$2004,$2005,$2006,$2007,$2008,$2009," +
                          "$25,$37,$43,$5B,$7A,$B6,$BB,accumulator,action," +
                          "add,ADDA,added,adding,address,addresses,ALU," +
                          "assumed,big-endian,block,byte,bytes,called,care," +
                          "case,Central,complete,completed,completion," +
                          "configured,contain,containing,contains,contents," +
                          "control,copied,CPU,cycle,data,DECA,decode," +
                          "decodes,decremented,decrements,Demonstration," +
                          "design,diagram,direct,don,effective,enter," +
                          "example,Executing,execution,fetch,fetched," +
                          "fetches,fetching,final,first,format,Freescale," +
                          "get,goal,half,HC12,Here,high,including," +
                          "incremented,Index,initialize,initially,input," +
                          "inputs,instruction,instructions,Intel,latched," +
                          "LDAA,least,left,little-endian,load,loads," +
                          "location,locations,long,low,MAR,MDR,memory,name," +
                          "namely,Next,now,opcode,operand,operands," +
                          "operation,order,Overview,pass,path,perform," +
                          "phase,place,placed,point,portion,Processing," +
                          "processor,processors,Program,Questions,RAM,read," +
                          "recognized,recognizes,register,registers,result," +
                          "Return,right-hand,ROM,Sample,Search,second," +
                          "Section,should,show,shown,signals,significant," +
                          "single,Specifics,specified,STAA,start,starting," +
                          "starts,store,stored,stores,subtracts,system," +
                          "takes,Text,third,three,transferred,travel,two," +
                          "unaltered,Unit,unknown,used,using,value,values," +
                          "write";
entry.item[43].page = "part003a.html";
entry.item[43].description = "Central Processing Unit";
entry.item[44].keywords = "$1000,$1001,$1002,$2000,$2003,$25,$37,$802," +
                          "ABCDEF,access,accessible,accumulator," +
                          "accumulators,ADDA,additional,Addr,address," +
                          "addresses,advanced,align,aligned,allows," +
                          "alternative,appear,Appendix,arithmetic," +
                          "automatically,b00,based,basics,BGND,bit,bits," +
                          "Boolean,bottom,Branch,branching,button,byte," +
                          "bytes,c00,calculate,calculations,carry,Central," +
                          "change,chapters,close,Code,Codes,complete," +
                          "complex,concatenated,Condition,conditional," +
                          "connections,consecutive,contain,containing," +
                          "contains,contents,control,converts,copied," +
                          "counter,courtesy,CPU,data,DECA,default," +
                          "Demonstration,described,descriptions,details," +
                          "Develoment,disable,discussed,display,ease,Edit," +
                          "eight,enable,enables,end,equal,Example,execute," +
                          "Execution,Expanded,feature,fetch,fields,File," +
                          "final,first-in,five,flags,following,follows," +
                          "found,Freescale,functions,glossary,half,handled," +
                          "HC12,HCS12,hexadecimal,higher,hold,implement," +
                          "implemented,important,independently,Index," +
                          "indicates,individual,initialized,instruction," +
                          "instructions,Interface,interfaces,internal," +
                          "interrupt,last-out,latches,LDAA,line,lines,link," +
                          "loaded,location,locations,lower,LSTRB,mainly," +
                          "Manual,maximum,Memory,menu,mode,Model,Narrow," +
                          "need,negative,Next,Normal,Note,now,observe,odd," +
                          "opcode,operation,optimal,organized,overflow," +
                          "Overlap,overlaps,Overview,own,paths,performance," +
                          "performs,Phase,pointer,possible,Press," +
                          "Processing,processor,Program,programmer," +
                          "Programming,programs,provides,Questions,queue," +
                          "rate,read,reads,Reference,references,register," +
                          "registers,repeat,represent,requests,Reset," +
                          "resets,responsibility,results,Return,Revisited," +
                          "routine,run,S12CPUV2,Search,Section,select," +
                          "selecting,sequential,shared,show,shows," +
                          "simplicity,simulates,simulation,simulator," +
                          "single,Snapshot,Specifics,speed,STAA,stack," +
                          "Start,starting,starts,state,Step,STOP,storage," +
                          "Store,stored,structures,subroutine,SX-I---," +
                          "temporary,Text,textbook,three,time,times,tool," +
                          "Tools,trade,twice,two,Unit,unused,upper,use," +
                          "used,using,value,values,via,viewing,wants,Wide," +
                          "window,wish,word,words,write,writing,written," +
                          "zero";
entry.item[44].page = "part003b.html";
entry.item[44].description = "Central Processing Unit";
entry.item[45].keywords = "#include,$10,$1000,$1001,$2000,$25,$37,$c123," +
                          "@10,accumulator,add,adda,added,addend,Addition," +
                          "additional,addresses,addressing,adoption," +
                          "advanced,advances,aid,algebraic,Allocate," +
                          "Allocates,allow,allowed,allows,alphabetic," +
                          "alphanumeric,alter,Alternatives,amount,appear," +
                          "appears,applications,apply,architecture," +
                          "arithmetic,AS12,ASCII,assemble,assembled," +
                          "Assembler,Assemblers,assembly,assign,assigned," +
                          "assumes,asterisk,automatically,bar,based,basic," +
                          "binary,bit,bits,Bitwise,blank,Boards,bold,built," +
                          "byte,bytes,c123,calculations,call,cannot," +
                          "capability,case,center,changes,char,character," +
                          "characters,code,codes,colon,column,combine," +
                          "commas,Comment,Comments,communicating,compact," +
                          "compiler,Compilers,Complement,complete,complex," +
                          "computers,consist,consists,constant,constants," +
                          "constructs,contain,contents,convenient," +
                          "convention,converts,Core,correctly,cost,counter," +
                          "covering,CPU,cross-assemblers,data,Debuggers," +
                          "deca,decimal,decrement,deferred,defined," +
                          "described,details,Development,difficult,digit," +
                          "digits,directive,directives,disadvantage," +
                          "Division,document,documentation,doesn,dollars," +
                          "dozen,earlier,easier,editor,efficiency," +
                          "emphasized,Emulation,encoding,end,ends," +
                          "engineering,Engler,entire,Environment,equ,equal," +
                          "equivalent,Eric,evaluate,evaluated,evaluates," +
                          "Evaluation,example,examples,except,Exclusive," +
                          "exist,existed,expand,expense,experienced,expr," +
                          "Expression,expressions,facility,fact,familiar," +
                          "far,faster,features,field,fields,file,filename," +
                          "files,find,First,Flowcharts,followed,following," +
                          "Foo,format,formats,formatted,free,Freescale," +
                          "Freeware,frightened,full-line,generate," +
                          "generated,generates,get,gets,gives,giving,good," +
                          "Guide,hand,having,HC12,HCS12,Here,hexadecimal," +
                          "high,IDE,important,inc,In-circuit,include," +
                          "incorporates,Index,initialized,insensitive," +
                          "installed,instance,instead,instruction," +
                          "instructions,Integrated,interesting," +
                          "Interpreters,invalid,invocation,involve,isn," +
                          "justified,know,knowing,knowledgeable,lab,label," +
                          "labeled,labels,language,large,larger,later," +
                          "latter,ldaa,least,left,length,level,limited," +
                          "line,lines,linker,literal,load,location," +
                          "locations,long,look,looked,low,machine,macro," +
                          "macros,mainly,maintain,makes,mandates,Manual," +
                          "Marks,means,medium,memorized,Memory,menu,method," +
                          "microcontroller,microcontrollers,Minus,mnemonic," +
                          "mnemonics,modes,move,moves,Multiple," +
                          "Multiplication,name,named,need,needless," +
                          "negatives,Next,nor,nuisance,number,numeral," +
                          "numeric,occasionally,octal,often,opcodes," +
                          "Operand,operands,operation,operations,Operator," +
                          "operators,optional,order,org,originally,output," +
                          "page,pages,Parentheses,part,parts,per,perfectly," +
                          "personal,placed,point,possible,processor," +
                          "processors,program,programmer,programming," +
                          "programs,projects,provided,provides,Pseudocode," +
                          "q-1,Questions,RAM,rarely,rather,read,real," +
                          "realize,reasons,recalculated,redef,redefined," +
                          "reduce,reduced,Reference,references,referred," +
                          "registers,relaxed,remainder,Remember," +
                          "represented,represents,required,resolve," +
                          "restriction,Return,right,ROM,run,runs,sales," +
                          "saved,saves,saving,say,scale,Search,Second," +
                          "Section,sections,seen,semicolon,separate," +
                          "separated,separator,several,show,showing,shown," +
                          "signify,simple,Simulators,single,slow,small," +
                          "software,source,space,spaces,special,split,staa," +
                          "start,starts,statement,statements,store,stored," +
                          "string,Subtraction,Sum,symbol,symbolic," +
                          "symbolically,Symbols,syntax,system,systems,tab," +
                          "table,take,taken,takes,target,terminal,Text," +
                          "thousands,time,time-critical,Tools,truncated," +
                          "two,Unary,underlying,use,used,useful,Users,uses," +
                          "Using,valid,value,values,variable,variables," +
                          "vary,volume,wasn,way,website,won,word,work," +
                          "write,writing,written,x25,x37,years";
entry.item[45].page = "part004.html";
entry.item[45].description = "Development Tools";
entry.item[46].keywords = "Ability,accessing,addition,address,aid,allows," +
                          "altering,application,approach,arithmetic," +
                          "assemble,assembled,assembler,Assemblers,BASIC," +
                          "Boards,breakpoints,byte,bytes,calculation," +
                          "calculators,called,classic,code,combines," +
                          "commands,communication,compile,compiled," +
                          "compiler,Compilers,composition,computer," +
                          "connected,contents,convert,cover,CPU,D-Bug12," +
                          "debugger,Debuggers,debugging,defines,definition," +
                          "delivered,design,Development,different," +
                          "disassemble,download,EEPROM,Emulation," +
                          "environment,error-free,Evaluation,example," +
                          "execute,executed,execution,features,fetches," +
                          "Flowcharts,following,Forth,found,Freescale," +
                          "functionality,functions,further,Guide,HC12," +
                          "HCS12,impossible,In-circuit,Index,information," +
                          "initial,installed,instruction,interactive," +
                          "interfaces,internal,Interpreter,Interpreters," +
                          "interpretive,issued,keyboard,Language,library," +
                          "listing,locations,machine,major,memory," +
                          "microcontroller,microcontrollers,models,monitor," +
                          "moving,Next,occupies,operations,original,page," +
                          "perform,period,personal,ports,PostScript," +
                          "primitive,print,printing,prints,program," +
                          "programming,programs,providing,Pseudocode," +
                          "Questions,RAM,read,Reference,register,registers," +
                          "requires,result,return,ROM,run,save,scientific," +
                          "Search,Section,selected,serial,Simulators," +
                          "software,space,stack,start,statements,stepping," +
                          "stop,store,stores,subtracts,system,taking," +
                          "target,terminal,test,tested,testing,Text,three," +
                          "time,Tools,top,trace,Two,used,uses,using,value," +
                          "values,VARIABLE,variables,viewing,virtually," +
                          "wanted,way,word,words,write,written";
entry.item[46].page = "part004a.html";
entry.item[46].description = "Development Tools";
entry.item[47].keywords = "accurate,adapter,add,additional,advantage,allow," +
                          "allows,alternatives,application,approach,area," +
                          "Assemblers,at-speed,Background,BDM,behavior," +
                          "Board,Boards,breadboard,breadboarding,brought," +
                          "cannot,character,circuit,circuits,Compilers," +
                          "computer,configured,connected,connection," +
                          "connector,connectors,connects,contains,contents," +
                          "controller,converter,Core,cost,cover,CPU,custom," +
                          "D-Bug12,debug,debugger,debugger/monitor," +
                          "Debuggers,Debugging,delivery,described,designs," +
                          "Details,develop,developed,Development,devices," +
                          "digit,digital,DIP,discussed,display," +
                          "Documentation,DRAGON12,Dragon12-Plus,drives," +
                          "easier,easy,EEPROM,Emulation,emulator,Emulators," +
                          "engineer,environment,evaluating,Evaluation," +
                          "examine,except,execution,expensive,fast,feature," +
                          "features,final,first,Flash,Flowcharts,following," +
                          "found,Freescale,Guide,hardware,HC12,HCS12," +
                          "headers,high,In-circuit,Index,input,installed," +
                          "instance,Instructions,interface,interfaces," +
                          "Interpreters,intervene,keeps,lab,LCD,LED,low," +
                          "lower,made,makes,making,manufacturer," +
                          "manufacturers,manufactures,MC9S12DG256," +
                          "measurements,memory,menu,MHz,microcontroller," +
                          "Mode,models,monitored,monitoring,necessary,Next," +
                          "offer,often,operation,page,Pentium,peripheral," +
                          "personal,physical,Physically,pins,plugged,plugs," +
                          "pod,port,ports,possible,Power,powerful,prices," +
                          "probe,problem,processor,product,products," +
                          "program,Programs,projects,promote,provided," +
                          "provides,providing,Pseudocode,purchase," +
                          "Pushbuttons,Questions,RAM,real,real-time," +
                          "receiver,referred,register,regulator,removed," +
                          "replaced,Return,ROM,room,roughly,routines,run," +
                          "running,Search,second,Section,segment,sells," +
                          "serial,several,signals,simulate,simulates," +
                          "simulation,Simulator,Simulators,single,socket," +
                          "software,solution,solutions,sophisticated," +
                          "Speaker,special,speed,start,state,stop,supplied," +
                          "Supply,switches,system,systems,target,test," +
                          "testing,Text,third-party,time,time-critical," +
                          "timers,times,timing,too,tool,Tools,track," +
                          "traditional,transmitter,Two,use,used,Users," +
                          "version,volume,wire,workstation,Wytec,x16";
entry.item[47].page = "part004b.html";
entry.item[47].description = "Development Tools";
entry.item[48].keywords = "aid,algorithm,algorithms,answer,arrows," +
                          "assembler,Assemblers,assembly,assignment,basic," +
                          "beginning,blocks,Boards,capable,case,code," +
                          "compiled,Compilers,complex,complicated," +
                          "conceptualize,conditional,conversion,converted," +
                          "Debuggers,decision,decisions,denotes,depends," +
                          "design,develop,Developing,Development,diamond," +
                          "difficult,difficulty,digit,document,earlier," +
                          "Emulation,end,entry,equals,especially," +
                          "Evaluation,execution,exit,familiar,features," +
                          "flow,flowchart,Flowcharts,following,four,full," +
                          "HC12,help,high,human,illustrate,In-circuit," +
                          "increases,Index,indicate,input/output,instance," +
                          "Instruction,int,Interpreters,iterative,language," +
                          "level,looks,manually,mark,Next,occasionally," +
                          "often,operation,operations,Output,oval,overview," +
                          "parallelogram,path,paths,poised,processing," +
                          "program,programs,Pseudocode,question,Questions," +
                          "radix,rectangular,reference,represented," +
                          "represents,Return,routine,Search,Section,seen," +
                          "separate,shape,shapes,shows,sign,significance," +
                          "Simulators,single,start,step,symbol,symbols," +
                          "taken,techniques,Text,Tools,true/false,two," +
                          "unsigned,use,used,Using,value,valueToConvert," +
                          "written,yes/no";
entry.item[48].page = "part004c.html";
entry.item[48].description = "Development Tools";
entry.item[49].keywords = "accumulator,accumulators,Add/Subtract,addition," +
                          "address,Addressing,allow,allowing,allows," +
                          "Appendix,appropriate,Arithmetic,back,based," +
                          "basic,Bit,bits,bold,Boolean,Branch,byte,bytes," +
                          "calculation,called,calling,carry/borrow,case," +
                          "categories,category,CCR,changed,Classes,Clear," +
                          "clearing,code,codes,combine,Compare,compares," +
                          "complement,concatenated,condition,conditional," +
                          "conditions,considered,constant,contents,control," +
                          "copied,copy,cover,covers,data,decision," +
                          "decrement,decremented,described,desired," +
                          "destination,detail,detailed,discussed," +
                          "discussion,divide,easier,emphasized,end,equal," +
                          "Examples,Exchange,exchanging,Exclusive,execute," +
                          "executed,execution,exist,extracting,fall,fields," +
                          "finding,finished,first,five,following,form," +
                          "fuzzy,greater,hardware,HC12,HCS12,hold," +
                          "implement,implementing,important,include," +
                          "increment,Increment/Decrement,incremented," +
                          "incrementing/decrementing,Index,individual," +
                          "inserting,Instruction,Instructions,integer," +
                          "Interrupt,invoked,Iteration,Jump,jumped,know," +
                          "known,Later,LEAS,LEAX,LEAY,left,length,less," +
                          "limited,linear,lists,Load,location,locations," +
                          "Logic,Long,lookup,loops,make,manipulate," +
                          "manipulation,Manual,memory,microcontroller," +
                          "mnemonic,Modes,Move,multi-byte,multiply,Negate," +
                          "negative,never,Next,non-zero,no-op,Normally," +
                          "number,occur,often,operand,operands,operate," +
                          "operation,operations,Oriented,overflow,Overview," +
                          "own,page,pages,per,performed,place,placed," +
                          "places,point,pointer,positions,powers,primarily," +
                          "primary,processing,processor,program," +
                          "programming,Questions,rather,Reference,referred," +
                          "reflects,register,registers,restored,result," +
                          "results,return,right,Rotate,roughly,S12CPUV2," +
                          "save,saved,Search,Section,sections,Separate," +
                          "sequential,setting,several,Shift,Shifting," +
                          "showing,signed,simple,Single,size,software," +
                          "sophisticated,source,space,special,specify," +
                          "specifying,split,Stack,start,state,Store," +
                          "structure,structures,Subroutine,Subroutines," +
                          "sufficient,systems,table,tabular,taken,takes," +
                          "target,Test,tested,Text,Timing,Transfer," +
                          "transferred,transferring,treated,trees,two," +
                          "unchanged,unsigned,used,useful,using,value," +
                          "values,version,ways,word,works,zero";
entry.item[49].page = "part005.html";
entry.item[49].description = "68HC12 Instruction Set Overview";
entry.item[50].keywords = "#123,#25,#AB1,#ABC,#BC7,#GHI,#PQR,#XYZ,$3000," +
                          "$8B,$9B,$AB,$BB,$ff,&ABC,&DEF,@PQR,A-5,AB1," +
                          "abbreviation,access,accomplished,Accumulator," +
                          "accumulators,Add,adda,addd,added,addess,adding," +
                          "addition,additional,address,addresses," +
                          "Addressing,advance,algorithms,allowed,allowing," +
                          "allows,appears,Appendix,applicable,applies," +
                          "arithmetic,array,arrays,assembler,automatically," +
                          "based,basic,BC7,behaves,best,bit,bits,brackets," +
                          "branch,branch/jump,byte,bytes,calculate," +
                          "calculated,calculates,calculation,called,case," +
                          "char,character,Classes,code,column,comma," +
                          "confusing,consists,Constant,constants," +
                          "containing,contains,contents,copied,counter," +
                          "create,cryptic,data,DECA,decimal,declaration," +
                          "decoded,Decrement/Increment,decremented," +
                          "decrements,DEF,default,define,depending," +
                          "described,describing,designator,destination," +
                          "determines,difference,differs,Direct," +
                          "Direct/Extended,distinction,distinguish,earlier," +
                          "effective,eight,elements,enclosed,encoded,entry," +
                          "equal/not-equal,equivalent,equivalents,error," +
                          "example,examples,execute,explicitly,expression," +
                          "Extended,fairly,fashion,fetched,fields,figure," +
                          "first,followed,following,follows,Form,format," +
                          "function,general,GHI,given,gives,giving,goes," +
                          "guide,HC12,Here,hexadecimal,IDX,IDX1,IDX2," +
                          "Immediate,immediately,implement,implicitly," +
                          "important,increment/decrement," +
                          "Increment/Decrement/Test,incremented,Index," +
                          "Indexed,Indexing,indicating,Indirect,INDX," +
                          "Inherent,instance,Instruction,Instructions,int," +
                          "integer,involve,jmp,jump,kept,language,last," +
                          "ldaa,ldab,ldd,ldx,ldy,leading,length,Let,lists," +
                          "load,loaded,location,locations,long,Low-order," +
                          "Machine,Manual,meaning,means,memory,message," +
                          "Mode,Modes,movb,move,movw,mysterious,name,names," +
                          "necessary,needed,Next,Note,object,obtain," +
                          "obtained,Offset,often,operand,operands," +
                          "operation,oprx9,org,original,Overview,past," +
                          "picks,points,post-byte,post-decrement," +
                          "post-increment,PQR,Pre/Post,precise," +
                          "pre-decrement,pre-increment,program,PRS," +
                          "Questions,range,rather,reading,realize,reason," +
                          "Reference,References,register,registers," +
                          "representing,respectively,result,Return,row," +
                          "S12CPUV2,say,says,Search,second,Section," +
                          "separated,should,show,shown,shows,sign,signed," +
                          "signified,similarly,single,size,smallest,source," +
                          "specified,specify,square,start,starting,starts," +
                          "stored,subb,subtract,subtracted,sum,Suppose," +
                          "symbolic,table,tables,taken,takes,target,Text," +
                          "third,three,times,Timing,treated,two,type,under," +
                          "understood,unsigned,use,used,useful,Users,uses," +
                          "using,value,variable,verbose,wanted,wants,ways," +
                          "Word,words,xysppc,XYZ,zero";
entry.item[50].page = "part005a.html";
entry.item[50].description = "68HC12 Instruction Set Overview";
entry.item[51].keywords = "access,accessed,accesses,Accessing,accomplished," +
                          "accumulator,ADDA,addition,additional,address," +
                          "Addressing,allow,Assuming,average,basic,behaves," +
                          "best,bit,bits,board,bottom,byte,bytes," +
                          "calculated,cannot,case,character,characters," +
                          "chart,Classes,clock,clocks,conditions,constant," +
                          "copied,counting,CPU,cycle,Cycles,data,depends," +
                          "described,description,descriptions,detail," +
                          "Details,Dragon12-Plus,Earlier,EEPROM,eight," +
                          "examine,example,execution,exist,expressed," +
                          "external,extra,fetch,fetched,fetches,fIfrPf," +
                          "figure,fill,first,Flash,free,Guide,half,HC12," +
                          "HCS12,immediate,important,Index,indexed," +
                          "indicates,indirect,information,instance," +
                          "Instruction,Instructions,Interfacing,interna," +
                          "internal,know,knowing,Let,letter,line,lists," +
                          "little,lmemory,Load,location,locations,long," +
                          "Manual,meet,memory,Memory/Peripheral," +
                          "microcontroller,microcontrollers,microseconds," +
                          "mode,Modes,Move,namely,necessary,Next,odd,often," +
                          "on-chip,operand,optional,Overview,part,place," +
                          "pointer,possible,primary,processor,provided," +
                          "Questions,queue,quickest,RAM,read,reads,reason," +
                          "Reference,references,referencing,required," +
                          "Return,ROM,rPO,run,S12CPUV2,Search,Section," +
                          "shown,shows,single,specifications,speed,starts," +
                          "still,Store,stretch,stretched,system,table,take," +
                          "taken,takes,taking,terms,Text,three,time,times," +
                          "Timing,took,two,types,used,Users,uses,using," +
                          "wide,word,words,worst,write,writes";
entry.item[51].page = "part005b.html";
entry.item[51].description = "68HC12 Instruction Set Overview";
entry.item[52].keywords = "#-20000,#32,#-4,#981,#ABC10,$0032,$0085,$1001," +
                          "$1002,$12,$1224,$1234,$23,$32,$34,$4567,$56," +
                          "$5612,$5634,$67,$7123,$800,$801,$810,$811,$820," +
                          "$85,$880,$FF85,ABC10,abx,aby,accumulator," +
                          "accumulators,Add,address,addresses,addressing," +
                          "advises,affected,aligned,allow,allowed,allows," +
                          "alter,altered,altering,analogous,appear," +
                          "arithmetic,assembler,based,basic,Basically,best," +
                          "Big,bit,bits,both,branch,byte,bytes,called,care," +
                          "case,CCR,character,Clear,cleared,Clearing,clr," +
                          "clra,clrb,code,codes,compatibility,computer," +
                          "concatenated,condition,conditional,confusion," +
                          "consecutive,constant,contain,contained,contains," +
                          "contents,convenience,copied,copies,copy," +
                          "corresponding,counter,counterparts,covered," +
                          "CPU12,data,DEF,defining,depending,described," +
                          "destination,differ,differences,direct,directive," +
                          "directives,don,effect,effective,efficient," +
                          "endian,Endians,ends,EQU,equal,equivalent,error," +
                          "example,examples,exception,exchange,Exchanges," +
                          "executing,execution,exg,exist,expected,explain," +
                          "extended,extending,extension,external,extremely," +
                          "fffe,fifty,final,first,fits,followed,following," +
                          "force,former,Freescale,get,gets,given,Gulliver," +
                          "happens,having,HC11,HCS12,help,hexadecimal," +
                          "hundred,identical,immediate,imply,important," +
                          "includes,increment/decrement,increments,Index," +
                          "indexed,indexing,indicate,indirect,ingenuity," +
                          "Initial,initially,instance,instead,instruction," +
                          "Instructions,Intel,intended,involves,knowing," +
                          "label,labels,later,ldaa,ldab,ldd,lds,ldx,ldy," +
                          "leading,leas,least,leax,leay,length,likewise," +
                          "Little,Load,loaded,loading,loads,location," +
                          "locations,lower,made,Manual,means,Memory," +
                          "microcontroller,microcontrollers,mistake," +
                          "mnemonic,mnemonics,mode,modes,movb,Move,moved," +
                          "movement,Moves,movw,namely,names,negative,never," +
                          "Next,note,number,occurs,offsets,operand," +
                          "operands,operation,order,org,original,perform," +
                          "performance,performing,performs,plus,pointer," +
                          "points,positive,PQR,preceding,predecessor," +
                          "primarily,probably,product,programmer,provided," +
                          "PZ1A,Questions,read,Reference,referenced," +
                          "referred,register,registers,remember," +
                          "responsible,result,Return,Search,second,Section," +
                          "seems,sequence,sets,sex,should,side,Sign,signed," +
                          "significant,single,size,slightly,source," +
                          "specified,specify,staa,stab,stack,starting,std," +
                          "still,storage,Store,stored,stores,sts,STU,stx," +
                          "sty,sum,synonym,synonyms,tab,take,tap,tba,Text," +
                          "tfr,thing,tpa,transfer,transferred,transferring," +
                          "Travels,treated,treating,truly,tsx,tsy,two,txs," +
                          "tys,unless,unsigned,upper,upward,use,used," +
                          "useful,using,value,VALX,wants,way,won,word," +
                          "words,work,work-around,world,xgdx,xgdy,years," +
                          "zero";
entry.item[52].page = "part006.html";
entry.item[52].description = "Load Store and Move Instructions";
entry.item[53].keywords = "#-10,#13,#-13,#23,$1000,$1001,$1002,$1003,$1004," +
                          "$1005,$1006,$1100,$F0,aba,abca,abcb,abx,aby," +
                          "accomplish,accumulator,adca,adcb,add,adda,addb," +
                          "addd,added,adding,Addition,Additional,additions," +
                          "address,addressing,Adjust,advance,advantage," +
                          "affect,affected,allow,Allowed,allowing,allows," +
                          "alter,altered,analogously,approach,arguments," +
                          "Arithmetic,asm,assembler,back,based,BCD,Bit," +
                          "bits,bold,borrow,both,branch,branching,Byte," +
                          "bytes,calculate,calculates,calculation," +
                          "calculations,called,cannot,capability,carry," +
                          "char,choice,Clears,clra,clrb,code,codes," +
                          "combination,comments,Compare,comparing," +
                          "compatible,compiler,complement,complicated," +
                          "condition,Conditional,conditionally,conditions," +
                          "considered,constant,contents,copy,correct," +
                          "correctly,counters,covers,daa,data,dec,deca," +
                          "decb,decide,declarations,declared,decrement," +
                          "Decrements,demonstrates,depending,des," +
                          "destination,dex,dey,different,differing,digit," +
                          "direct,discover,discussed,Division,divisions," +
                          "don,earlier,effect,effective,efficient," +
                          "emphasize,emphasized,end,equal,equivalent," +
                          "Example,Examples,except,exchange,executed," +
                          "executing,execution,exercise,exg,extend," +
                          "extended,extension,first,five,flag,following," +
                          "follows,former,four,function,functions,generate," +
                          "generated,get,gets,good,greater,happens,HC11," +
                          "HC12,here,idea,identical,immediate,immediately," +
                          "implementing,importance,important,impossible," +
                          "inc,inca,incb,increment,increment/decrement," +
                          "Increments,Index,indexed,indicated,indication," +
                          "input,ins,instance,instead,instruction," +
                          "Instructions,int,integer,integers,inx,iny,keep," +
                          "know,knowing,language,later,ldaa,leas,Least," +
                          "leaving,leax,leay,left,length,lengths,less,let," +
                          "limited,load,loaded,location,locations,long," +
                          "look,loop,made,mainly,major,makes,manner,matter," +
                          "means,memory,mentioned,microcontroller,middle," +
                          "mind,mistake,mixes,mnemonic,mode,modes,modified," +
                          "multi-byte,multiple,multiple-precision," +
                          "Multiplication,multiplications,namely,need," +
                          "needed,needs,neg,nega,Negate,negated,negates," +
                          "negative,negb,Next,nonzero,note,now,number," +
                          "numbers,numeric,occurred,operand,operands," +
                          "operation,Operations,original,outside,overflow," +
                          "page,pages,part007,perform,performed,performing," +
                          "place,placing,pointer,positive,possible," +
                          "preceding,problem,processor,produce,produces," +
                          "producing,program,programmer,programming," +
                          "properly,provide,provided,provides,purpose," +
                          "Questions,range,ranges,rather,realize,register," +
                          "registers,representation,representations," +
                          "represented,represents,respectively,responsible," +
                          "result,results,return,runnable,running,sba,sbca," +
                          "sbcb,Search,Section,sections,seen,segment," +
                          "sequence,sets,several,sex,Shifting,shorter," +
                          "showing,shows,sigificant,sign,signed," +
                          "significant,single,situation,size,solution," +
                          "source,specifically,split,staa,stack,start," +
                          "starting,std,stops,Store,stored,storing,student," +
                          "suba,subb,subd,Subtract,SUBTRACTING,Subtraction," +
                          "subtracts,sum,sums,supports,synonyms,table,take," +
                          "taken,Takes,tell,Test,Text,tfr,thereof,thing," +
                          "three,time,top,track,two,types,undersigned," +
                          "unlucky,unsigned,upward,use,used,uses,using," +
                          "Valid,validly,value,values,variable,variables," +
                          "viewing,wanted,way,whether,word,words,work," +
                          "works,zero";
entry.item[53].page = "part007.html";
entry.item[53].description = "Arithmetic Instructions";
entry.item[54].keywords = "$1000,$1003,$2000,$FFFF,accumulator,accurate," +
                          "adca,adcb,Add,addd,added,Addition,additions," +
                          "algorithm,algorithms,allowed,allowing,allows," +
                          "alter,applications,approach,arguments," +
                          "Arithmetic,assembler,assume,attempted,average," +
                          "avoid,bad,based,Bit,bits,Both,breaking,byte," +
                          "Calculate,calculations,carry,case,Celsius," +
                          "change,Clear,code,codes,Compare,complaining," +
                          "condition,constant,contents,Convert,converted," +
                          "converts,correct,create,DATA,demonstrated," +
                          "depending,described,digital,divide,dividend," +
                          "divides,Division,divisor,Don,down,early,ediv," +
                          "edivs,efficiency,EFGH,emul,emuls,End,equals," +
                          "error,especially,evaluation,Example,examples," +
                          "Exchange,executes,execution,exg,expression," +
                          "extend,Fahrenheit,fast,fdiv,filtering,first," +
                          "following,follows,forget,formula,fractional," +
                          "fuzzy,gain,generate,get,gets,give,given,gives," +
                          "goes,hand,handle,hardware,HC11,HC12,here,high," +
                          "idiv,idivs,Ignore,Implementing,important," +
                          "improving,Index,indicate,indicated,instruction," +
                          "Instructions,integer,interrupt,involving,keeps," +
                          "larger,last,ldaa,ldab,ldd,ldx,ldy,Least,leay," +
                          "length,letter,load,loads,location,locations," +
                          "logic,long,low,lower,lsb,maximum,memory,message," +
                          "method,microcontroller,microcontrollers,minimum," +
                          "modern,msb,much,mul,Multiple-precision," +
                          "multiplicand,Multiplication,multiplications," +
                          "multiplied,multiplier,multiplies,multiply," +
                          "Multiplying,multi-precision,named,need,needed," +
                          "negative,Next,note,operation,operations,order," +
                          "org,Overflow,overhead,performed,performing," +
                          "performs,pick,placing,positive,possible,power," +
                          "preceding,precision,predecessor,proceeds," +
                          "producing,product,Program,programs,properly," +
                          "provided,puts,putting,Questions,quickly," +
                          "quotient,RAM,range,rarely,real,reason,register," +
                          "remainder,replaces,represents,result,resulting," +
                          "Return,right,run,Scaled,Search,Section," +
                          "separately,sets,sex,Shifting,shown,sign,signed," +
                          "significant,simply,simulator,single,slowly," +
                          "source,staa,start,std,steps,stop,Store,storing," +
                          "stx,sty,Subtraction,successive,sum,swi," +
                          "temperature,temperatures,Test,Text,thing,three," +
                          "time,two,uninitialized,unsigned,unusual,upper," +
                          "use,used,using,value,values,Variable,wasn,wish," +
                          "Word,words,work,worst,zero";
entry.item[54].page = "part007a.html";
entry.item[54].description = "Arithmetic Instructions";
entry.item[55].keywords = "$1000,$1001,$1002,$1004,appear,browser,bytes," +
                          "change,Click,code,controls,desired,digit," +
                          "disabled,exited,file,generating,loading," +
                          "location,locations,log,multiplicand,multiplier," +
                          "page,product,program,run,runs,separate," +
                          "Simulator,snapshot,stop,Store,taking,type,value," +
                          "window,word";
entry.item[55].page = "part007ax.html";
entry.item[55].description = "Multiplication Example";
entry.item[56].keywords = "$820,$821,$822,$823,accumulator,add,Addition," +
                          "addressing,allow,allows,appropriate,areshifted," +
                          "Arithmetic,Arithmetic/Logical,asl,asla,aslb," +
                          "asld,asr,asra,asrb,based,binary,bit,bits," +
                          "Boolean,both,byte,bytes,cannot,carry,causes," +
                          "code,codes,Compare,condition,contents," +
                          "counterparts,data,Decision,deferred,difference," +
                          "directions,discussion,divide,dividing,Division," +
                          "effect,examples,exist,extended," +
                          "extended-precision,few,Final,flooring,following," +
                          "got,Here,identically,implement,Index,indexed," +
                          "indicate,indicated,individual,Initial," +
                          "instruction,Instructions,integer,last,least," +
                          "Left,location,Logic,Logical,lower,lsl,lsla,lslb," +
                          "lsld,lsr,lsra,lsrb,lsrd,maintain,means,memory," +
                          "mnemonics,modes,moves,Multiplication,multiply," +
                          "multi-precision,necessary,negative,never,Next," +
                          "Nine,Note,operation,original,overflow,perform," +
                          "position,positioning,positive,powers,primarily," +
                          "provided,Questions,quick,quotient,rather,refer," +
                          "register,remaining,represent,represents,result," +
                          "resulting,return,Right,rol,rola,rolb,ror,rora," +
                          "rorb,rotate,Rotates,rule,Search,Section," +
                          "sequential,Shift,shifted,Shifting,Shifts," +
                          "shortly,show,sign,signed,significance," +
                          "significant,solution,start,starting,still," +
                          "stored,Subtraction,Test,Text,Trees,truncated," +
                          "two,type,unsigned,use,used,value,values,word," +
                          "works,zero";
entry.item[56].page = "part007b.html";
entry.item[56].description = "Arithmetic Instructions";
entry.item[57].keywords = "#foo,ab1,acceptable,accomplished,accumulator," +
                          "Addition,address,addressing,allocated,allow," +
                          "allowed,allows,arguments,Arithmetic,array,back," +
                          "both,branch,byte,bytes,case,cba,clra,cmpa,cmpb," +
                          "codes,Compare,comparing,Comparison,Comparisons," +
                          "condition,conditional,considered,constant," +
                          "contents,cover,cpd,cps,cpx,cpy,data,depending," +
                          "difference,direct,Division,doesn,Eight,emaxd," +
                          "emaxm,emind,eminm,equivalent,Example,Examples," +
                          "extend,extended,extending,finding,following,foo," +
                          "full,functions,HC12,immediate,important,Index," +
                          "indexed,indicate,individual,instruction," +
                          "Instructions,intended,Iteration,larger,ldab,ldx," +
                          "load,location,major,maxa,maximum,maxm,memory," +
                          "mina,minimum,minm,modes,Multiplication,Next," +
                          "optionally,perform,Place,placed,plus,pointer," +
                          "problem,provide,purpose,Questions,RAM,range," +
                          "ranges,register,requirement,Return,Search," +
                          "Section,selected,setting,sex,Shifting,sign," +
                          "signed,smaller,specified,stack,std,storage," +
                          "store,stored,subtract,Subtraction,subtracts," +
                          "temp,temporary,Test,Text,thrown,tst,tsta,tstb," +
                          "two,unless,unsigned,usage,uses,using,value," +
                          "value1,value2,values,word,words,work," +
                          "work-around,zero";
entry.item[57].page = "part007c.html";
entry.item[57].description = "Arithmetic Instructions";
entry.item[58].keywords = "$1000,$1001,$1002,$1004,$1006,appear,browser," +
                          "byte,calculates,code,controls,data,disabled," +
                          "exited,file,generating,loading,locations,log," +
                          "need,page,press,program,respectively,run,sample," +
                          "separate,sets,signed,Simulator,snapshot,stop," +
                          "taking,three,unsigned,window,words";
entry.item[58].page = "part007x.html";
entry.item[58].description = "Mixed Addition Example";
entry.item[59].keywords = "$0f,$10,$11,$ff,accumulator,addition,address," +
                          "addressing,affect,allow,allowed,allows,alter," +
                          "altered,alternatives,alters,arithmetic," +
                          "assembler,assumes,based,basic,bcc,Bcs,behave," +
                          "beq,best,bge,bgt,bhi,bhs,bit,bits,BLE,blo,bls," +
                          "blt,Bmi,bne,bold,borrow,Both,bpl,bra,Branch," +
                          "branches,Branching,brn,bvc,Bvs,byte,bytes," +
                          "called,capability,capable,carry,case,cases,cba," +
                          "CCR,certain,Certainly,cetera,chance,changing," +
                          "check,choice,cleared,cmpa,cmpb,code,Codes," +
                          "colored,combinations,compare,compared,comparing," +
                          "comparison,comparisons,complement,Condition," +
                          "Conditional,conditions,confusing,considered," +
                          "Considering,contents,Control,convert,correct," +
                          "cpx,cycle,cycles,dashes,data,decrement,default," +
                          "delay,depending,described,description,Detail," +
                          "determined,determines,Different,discussed," +
                          "division,doesn,downside,easier,effective,eight," +
                          "emphasize,emphasized,end,Equivalent,error," +
                          "examine,examined,example,Examples,except," +
                          "exception,execute,executed,execution,explains," +
                          "extended,extra,fact,false,far,faster,flow," +
                          "following,four,general,gives,goes,good,greater," +
                          "groups,Guide,hand,handled,HC12,helpful,Here," +
                          "High,idea,identically,idiv,implies,important," +
                          "including,increment,increment/decrement,Index," +
                          "indexed,indicate,indicates,instead,instruction," +
                          "Instructions,intended,involved,inx/dex," +
                          "inx/dex/iny/dey,iny/dey,Iteration,iterative,jmp," +
                          "jump,language,Languages,last,later,LBCC,LBCS," +
                          "LBEQ,LBGE,LBGT,LBHI,LBHS,LBLE,LBLO,LBLS,LBLT," +
                          "LBMI,LBNE,LBPL,lbra,LBRN,LBVC,LBVS,left,length," +
                          "less,Level,load,location,logical,Long,longer," +
                          "look,loop,make,Manual,means,memory,mnemonics," +
                          "mode,modes,modular,modulo,much,multi-precision," +
                          "names,nearest,necessary,negative,never,new,Next," +
                          "non-negative,non-zero,no-op,nop,Note,occurrence," +
                          "offer,operand,operation,operations,ordering," +
                          "outcome,overflow,overflowed,page,pages," +
                          "permissible,pick,positive,possible,preceding," +
                          "preference,primarily,program,programming," +
                          "programs,provide,providing,Questions,range,read," +
                          "reason,Reference,register,relational,remember," +
                          "repeatedly,require,respect,respectively,result," +
                          "results,Return,S12CPUV2,save,say,sba,Search," +
                          "Section,sections,seen,Selecting,selection,sense," +
                          "sequence,sequential,sequentially,sets,setting," +
                          "several,shift,shifting,Short,should,showing," +
                          "sign,signed,significant,simple,single,sizes," +
                          "smaller,solution,special,specific,specified," +
                          "specify,split,start,store,structure,structures," +
                          "subroutines,subtract,subtraction,Summary,symbol," +
                          "tab,table,take,taken,takes,target,targets,task," +
                          "tba,Test,tested,testing,Text,time,traditional," +
                          "treated,triangle,true,two,types,unconditional," +
                          "understand,unsigned,use,used,Users,Using,valid," +
                          "value,values,way,word,work,write,written,zero";
entry.item[59].page = "part008.html";
entry.item[59].description = "Branching and Iteration";
entry.item[60].keywords = "#37,#A1,A1-1,accumulator,action,Actions,adca," +
                          "Add,adda,addition,Address,advance,algorithm," +
                          "allowed,allows,alter,altering,approach,Arrays," +
                          "Assembler,assembly,avoid,B1-1,B1-A1,back,base," +
                          "based,beq,best,bhs,bit,block,bne,both,bra," +
                          "branch,branches,Branching,byte,bytes,C1-1,C1-A1," +
                          "careful,carry,case,cases,changed,char,chart," +
                          "check,Clears,clever,cmpa,code,Codes,combine," +
                          "compare,Condition,conditional,conditionally," +
                          "Consider,constant,contains,contents,control," +
                          "controlled,copied,Copy,count,counter,counting," +
                          "cpx,dbeq,dbne,deca,decb,Decrement," +
                          "decrement/increment/test,decrementing,determine," +
                          "dex,differ,discovered,don,eliminate,end,ends," +
                          "equal,equals,equipment,event,example,Examples," +
                          "executed,execution,exercise,exit,exiting," +
                          "external,far,fast,finished,first,flow,flowchart," +
                          "followed,following,Forever,form,goes,gone,HC12," +
                          "here,ibeq,ibne,implement,important,improve,inca," +
                          "incb,incorrect,increment,increment/decrement," +
                          "incrementing,Index,Initialization,initially," +
                          "instance,instruction,Instructions,Iteration," +
                          "iterations,jmp,jump,know,label,language,ldaa," +
                          "ldab,ldx,least,left,level,Load,located,location," +
                          "look,Loop,Looping,loops,made,means," +
                          "microcontroller,movb,Move,multi-precision," +
                          "necessary,need,needed,never,Next,nonzero," +
                          "non-zero,Number,occur,occurring,Often,operand," +
                          "operands,operation,outermost,outside,per," +
                          "perform,performed,performs,point,possibility," +
                          "possible,Post-Test,power,preceding,Pre-Test," +
                          "probably,problem,program,programmer,programs," +
                          "provided,putting,Questions,range,reached," +
                          "rearrange,reason,register,Repeat,repeatedly," +
                          "represented,result,Return,run,running,Search," +
                          "second,Section,sentinel,separate,sequence," +
                          "should,shut,significant,simplest,Six,skip," +
                          "solution,solve,Special,specified,specifies,staa," +
                          "start,state,Still,Store,stored,structure,sum," +
                          "Tables,target,tbeq,tbne,technique,terminating," +
                          "termination,test,Text,too,top,true,tsta,two," +
                          "type,unconditional,unsigned,Use,used,using," +
                          "values,wanted,way,ways,works,zero";
entry.item[60].page = "part008a.html";
entry.item[60].description = "Branching and Iteration";
entry.item[61].keywords = "#10,#a1,#cvt,#sine,#t1,$06,$07,$10,$1000,$1001," +
                          "$20,$2000,$2d,$3F,$40,$4f,$5B,$66,$6d,$6f,$7d," +
                          "$7f,$b3,$b3/255,access,accessed,Accessing," +
                          "accumulator,acts,add,adda,addb,addd,addition," +
                          "address,addresses,addressing,advance,advances," +
                          "algorithm,allocate,allowed,alternative,amounts," +
                          "and/or,angle,angle/10,angles,appears,approaches," +
                          "arbitrary,argument,array,Arrays,aslb,asm," +
                          "assembled,assembler,assembly,assignment,assume," +
                          "assuming,average,bhs,binary,bins,bit,bls,bne," +
                          "Both,boundaries,bra,brackets,branch,byte,bytes," +
                          "calculate,calculated,calculation,calculations," +
                          "calculator,called,cannot,case,cases,change,char," +
                          "character,characters,chart,check,Clear,closest," +
                          "clra,clrb,cmpa,code,collected,Compare,compared," +
                          "compiler,computers,consider,considered,const," +
                          "constant,consume,contain,contains,contents," +
                          "Conversion,correct,correctly,corresponding," +
                          "corresponds,count,cpx,cryptic,cvt,data,deal," +
                          "decimal,decision,declarations,declare,declared," +
                          "define,degrees,delimiter,digit,digits,directive," +
                          "display,displayed,displays,distance,divide," +
                          "divided,dividing,doesn,don,dp/16,driving,easily," +
                          "effective,element,Elements,end,enter,entered," +
                          "entries,entry,equal,equivalent,error,etbl," +
                          "evaluates,evaluating,example,execute,executed," +
                          "executes,execution,expression,expressions," +
                          "extended,fcc,Fetch,file,final,Finally,finished," +
                          "first,flow,following,Format,former,fraction," +
                          "fractional,fractions,full,function,functions," +
                          "generate,generating,get,gets,give,given,great," +
                          "having,HC12,help,helpful,here,high,histogram," +
                          "holds,idiv,implemented,implements,important,inc," +
                          "increment,increments,Index,indexed,indexing," +
                          "instance,instead,instruction,instructions,int," +
                          "integer,integers,intention,interpolated," +
                          "interpolating,Interpolation,isn,knows,label," +
                          "ladder,language,Large,last,later,latter,ldaa," +
                          "ldab,ldd,ldx,ldy,LED,less,Let,linear,link,Load," +
                          "loaded,location,locations,Logic,logical,long," +
                          "look,looked,lookup,look-up,lower,lsra,make," +
                          "makes,mathematics,means,memory,microcontroller," +
                          "mode,modes,movb,move,movw,much,Multiplexed," +
                          "multiply,name,named,necessary,need,needed,Next," +
                          "non-interpolating,non-negative,nor,not0,not1," +
                          "note,now,number,obtain,often,operand,operands," +
                          "operation,order,org,part,part009,past,pattern," +
                          "patterns,performed,place,plus,post-decrement," +
                          "post-increment,preceding,precious,process," +
                          "processed,processor,program,programmer," +
                          "programming,properly,proportional,puts," +
                          "Questions,quotient,RAM,random,range,realize," +
                          "referred,register,registers,repeat,represent," +
                          "representing,represents,resource,result,Return," +
                          "right,ROM,run,runtime,save,saves,scalar,scale," +
                          "scaled,Search,second,Section,segment,segments," +
                          "send,sense,sequence,sequential,seven-segment," +
                          "shift,shifting,shown,shows,signed,simulator," +
                          "sine,single,size,slow,special,specified,square," +
                          "staa,Start,starting,starts,step,steps,still," +
                          "Stop,stops,Store,stored,stores,storing,string," +
                          "strings,structure,style,successive,sum,supposed," +
                          "system,Table,Tables,tabular,take,taken,takes," +
                          "tbl,tedious,testing,Text,tfr,Time,times,tree," +
                          "Trees,turn,two,ugly,unsigned,upper,use,used," +
                          "useful,Using,value,valued,values,variable," +
                          "version,versus,way,word,words,work,write,zero," +
                          "Zwill";
entry.item[61].page = "part009.html";
entry.item[61].description = "Using Tables and Arrays";
entry.item[62].keywords = "$1000,$1001,angle,appear,browser,check,code," +
                          "controls,desired,disabled,exited,file," +
                          "generating,loading,location,log,page,program," +
                          "result,run,separate,Simulator,snapshot,stop," +
                          "Store,stored,taking,window";
entry.item[62].page = "part009x.html";
entry.item[62].description = "Sine Table Interpolation";
entry.item[63].keywords = "$23,$23&,$41,$63,$A6,$A7,$A7&,$BE,$C4,$E7," +
                          "Advanced,allowed,applied,argument,arguments," +
                          "assembler,assignment,back,binary,Bit,bits," +
                          "Bitwise,bold,Boolean,both,byte,calculated," +
                          "calculates,called,character,clear,cleared," +
                          "complement,complemented,complements,Consider," +
                          "constant,contents,Control,corresponding," +
                          "Decision,described,desired,earlier,emphasized," +
                          "EOR,example,examples,exclusive,Exclusive-Or," +
                          "expression,expressions,FALSE,fashion,follows," +
                          "found,freeware,Function,get,give,giving,Here," +
                          "high,Index,instance,Instructions,invalid,least," +
                          "length,limitation,Logic,low,mask," +
                          "microcontroller,Next,often,operand,operands," +
                          "operation,Operations,operator,original,page," +
                          "pages,pair,pointed,preceding,provided,Questions," +
                          "represented,represents,result,Return,Review," +
                          "Search,second,Section,sections,Selection," +
                          "several,showing,significant,split,start," +
                          "Structure,Summary,symbol,table,taken,Text,Trees," +
                          "TRUE,turns,two,unchanged,use,used,using,v&m," +
                          "value,values,wish,words,work,workaround";
entry.item[63].page = "part010.html";
entry.item[63].description = "Decision Trees and Logic Instructions";
entry.item[64].keywords = "#100,#20,#25,#50,#70,#80,action,add,additional," +
                          "Advanced,alarm,algorithm,allow,alternative," +
                          "alternatives,assembler,assembly,back,bad,based," +
                          "bhi,bhs,Bit,Bitwise,blo,block,blocks,bls," +
                          "Boolean,bra,branch,branches,broken,case,cause," +
                          "Celsius,challenging,check,checking,circulating," +
                          "cmpa,code,codes,compare,comparison,comprehend," +
                          "condition,conditional,Conditions,consecutive," +
                          "consecutively,Consider,Considering,constructs," +
                          "Control,cool,coolant,cooling,Decision,degrees," +
                          "different,discussed,down,earlier,easier,easiest," +
                          "Else,end,example,executed,execution,expressed," +
                          "expression,expressions,fact,FALSE,fan,finish," +
                          "finished,First,flash,flowchart,flowcharts," +
                          "following,four,function,functionally,further," +
                          "general,Get,goes,good,greater,green,Handing," +
                          "Handling,heater,holds,identical,If-Then-Else," +
                          "implementation,implemented,implementing," +
                          "implements,important,Index,Indicator," +
                          "instruction,Instructions,involve,involving,Keep," +
                          "ladder,language,ldaa,less,lets,Logic,logical," +
                          "machine,matter,measurement,microcontroller," +
                          "microcontrollers,mind,much,multiple,name,named," +
                          "need,needed,nested,new,Next,nothing,Often," +
                          "operation,Operations,operator,opposed,outcome," +
                          "outcomes,part,paths,performed,point,points," +
                          "preceding,pres,pressure,problem,processing," +
                          "program,pseudocode,pseudo-code,pump,Questions," +
                          "range,rather,reason,RED,redrawn,represent," +
                          "represented,resembles,resume,resumes,Return," +
                          "Review,rises,say,Search,second,Section," +
                          "Selection,sensor,sets,shape,should,shown,Signal," +
                          "simple,simplest,single,skip,statements,still," +
                          "Structure,structures,Summary,system,takes," +
                          "targeting,temp,temperature,test,tests,Text," +
                          "three,tree,tree-like,Trees,true,turn,two,type," +
                          "unconditional,use,used,using,value,variable,via," +
                          "wish,write,writing,written";
entry.item[64].page = "part010a.html";
entry.item[64].description = "Decision Trees and Logic Instructions";
entry.item[65].keywords = "AAA,AAA000,AAABBB,AAABBBCC,aba,accumulator,acts," +
                          "adca,Add,addressing,Advanced,algorithm,aliases," +
                          "allow,allows,alter,anda,andb,andcc,based,BBB," +
                          "Bit,bita,bitb,bits,Bitwise,bne,Boolean,branch," +
                          "byte,bytes,cannot,carry,CCR,character,clc,clear," +
                          "clearing,Clears,cli,clock,clv,code,codes,com," +
                          "coma,comb,combine,compare,complement,condition," +
                          "contents,Control,cycle,Decision,delay,details," +
                          "direct,EOR,eora,eorb,Example,Examples,exception," +
                          "exist,extended,extract,field,fields,first,foo," +
                          "Get,HC12,immediate,Index,indexed,individual," +
                          "insert,instance,instruction,Instructions," +
                          "integer,interrupt,ldaa,ldab,least,leave,left," +
                          "loc1,location,Logic,lsla,lsra,mask,means,memory," +
                          "mode,modes,MSB,Next,non-zero,numbered," +
                          "occasionally,operand,operation,Operations,ORA," +
                          "oraa,orab,orcc,overflow,plus,prefix,Questions," +
                          "referred,register,relationship,remaining," +
                          "requires,result,Return,Review,right,Search,sec," +
                          "Section,sei,selected,Selection,sequence,sets," +
                          "sev,shifting,significant,single,staa,store," +
                          "stored,Structure,subtract,Summary,Test,Text," +
                          "three,toggle,treat,Trees,two,U1&,unchanged,used," +
                          "uses,using,value,values,words";
entry.item[65].page = "part010b.html";
entry.item[65].description = "Decision Trees and Logic Instructions";
entry.item[66].keywords = "$1000,$81,$810,$812,accumulator,addressing," +
                          "Advanced,affects,allowed,alter,anda,bclr,Bit," +
                          "bits,Bitwise,bne,Boolean,Both,Branch,branches," +
                          "brclr,brset,bset,byte,clear,clears,clra,code," +
                          "codes,combine,complement,condition,conditional," +
                          "Control,controlled,convenient,corresponding," +
                          "count,Decision,depending,direct,equivalent," +
                          "example,Examples,extended,extreme,first," +
                          "following,frequently,I/O,immediate,inca," +
                          "increment,Index,indexed,inefficiently,initially," +
                          "instruction,Instructions,ldaa,Let,location," +
                          "locations,Logic,loop,lsb,lsr,mapped,mask,memory," +
                          "mode,Next,number,operand,operands,operation," +
                          "Operations,oraa,perform,placing,Questions," +
                          "result,Return,Review,right,say,Search,second," +
                          "Section,segment,Selection,sequence,sets,Shift," +
                          "specified,staa,Structure,Summary,taken,target," +
                          "test,Text,third,three,Trees,two,use,used,uses," +
                          "value,via,words,zero";
entry.item[66].page = "part010c.html";
entry.item[66].description = "Decision Trees and Logic Instructions";
entry.item[67].keywords = "#120,#15,#B1,#B2,#B3,#B4,#B6,#define,$1000," +
                          "$1002,$1010,aba,accumulator,accumulators,action," +
                          "add,Advanced,allowing,allows,alter,anda,andb," +
                          "applies,arguments,assembler,assigned,back,bar," +
                          "based,BCLR,beq,Bit,bita,bitb,Bits,Bitwise,bne," +
                          "Boolean,both,branch,branches,Branching,brclr," +
                          "brset,BSET,byte,bytes,cannot,case,char,clear," +
                          "cleared,Clearing,code,codes,combine,compiler," +
                          "complement,complementing,condition,Conditional," +
                          "Control,convenient,Decision,Declare,Define," +
                          "descriptions,deserves,directives,discussed," +
                          "easer,eora,eorb,EQU,example,examples,exclusive," +
                          "execute,EXOR,explicitly,extract,Extracting," +
                          "field,Fields,first,followed,following,FOO," +
                          "frequently,get,give,hardware,HC12,immediate," +
                          "Index,indicate,insert,inserted,Inserting," +
                          "instruction,Instructions,justified,Language," +
                          "ldaa,least,left,leftmost,length,load,location," +
                          "Logic,lsla,lsra,making,Manipulation,mask,memory," +
                          "method,mode,names,necessary,need,Next,NOTE," +
                          "number,numbered,operation,Operations,operator," +
                          "oraa,orab,oriented,ORing,perform,performed," +
                          "positions,practical,preceding,present," +
                          "programming,Questions,result,results,Return," +
                          "Review,right,rightmost,Search,Section,segments," +
                          "Selection,set/clear/toggle,Setting,shift,show," +
                          "significant,simplify,special,specified,specify," +
                          "specifying,staa,Stack,step,store,Structure," +
                          "stuff,Subroutines,Summary,supports,symbolic," +
                          "target,test,Testing,Text,times,toggle,toggled," +
                          "Toggling,Trees,two,type,unchanged,unsigned,use," +
                          "used,useful,using,value,way,work,x1010";
entry.item[67].page = "part010d.html";
entry.item[67].description = "Decision Trees and Logic Instructions";
entry.item[68].keywords = "#27,#const,#rp1,#rp2,#rp3,$1000,$1FFE,$1FFF," +
                          "$2000,$21,$32,$800,$802,$EE86,aba,access," +
                          "accessed,Accessing,accomplished,accumulator,add," +
                          "added,adding,additional,address,addresses," +
                          "addressing,advancing,allocate,allocated," +
                          "allocation,allow,allowed,altered,amount," +
                          "approach,aren,assemblers,assembly,assist," +
                          "assuming,avoid,back,balanced,bank,bar,basic," +
                          "basically,behave,best,bit,bits,bottom,bra," +
                          "branch,brings,bsr,byte,bytes,calculated,call," +
                          "called,calling,cannot,care,case,cases,cause," +
                          "certain,change,character,circumstance,clrb,code," +
                          "comment,compiler,compilers,concerned,condition," +
                          "consider,considered,console,const,constant," +
                          "contain,contains,contents,convenient,copy," +
                          "correct,corruption,creation,Data,D-BUG12," +
                          "debugger,debugging,declared,decremented,deleted," +
                          "described,designed,detail,details,determined," +
                          "development,different,difficult,discussed," +
                          "display,doesn,effective,efficient,eliminated," +
                          "embedded,emul,end,entries,equivalent,example," +
                          "execute,execution,exercise,exist,expanded," +
                          "Expansion,explained,External,far,fast,feature," +
                          "features,fetched,fetches,fetching,final,First," +
                          "fit,fits,following,foo,four,frame,Freescale," +
                          "functions,fundamental,general,get,gets,gives," +
                          "good,grows,Guide,haven,having,HC12,HERE,High," +
                          "hold,idiv,illustration,immediate,implement," +
                          "implementation,implemented,Important,including," +
                          "increases,increment/decrement,incremented,Index," +
                          "indexed,indirect,initialize,initialized," +
                          "Input/Output,ins,inside,instruction," +
                          "instructions,interface,Interfacing,internal," +
                          "invoke,involving,jmp,jsr,jump,jumps,keep,kept," +
                          "keyword,language,Languages,Last,later,ldaa,ldab," +
                          "ldd,lds,ldx,ldy,leas,leaving,left,Lets,Level," +
                          "LIFO,Likewise,limited,listed,Load,location," +
                          "locations,lower,lowest,lsla,m54,manage,manner," +
                          "manually,matter,maximum,means,memory," +
                          "Memory/Peripheral,method,methods," +
                          "microcontroller,mode,modern,modes,modify,movb," +
                          "move,moving,movw,mul,multiplies,multiply," +
                          "necessary,need,needed,Next,nibbleswap,none,Note," +
                          "number,obtained,offset,operand,operation," +
                          "opposite,order,original,Overview,overwritten," +
                          "page,pair,parameter,Parameters,part,pass,passed," +
                          "passing,peek,Performing,place,places,plus," +
                          "pointed,pointer,points,pop,position,possible," +
                          "potential,practice,pre/post,present,preserve," +
                          "problem,processor,processors,produce,program," +
                          "programmers,programs,provide,provided,provides," +
                          "psha,pshb,pshc,pshd,pshx,pshy,pula,pulb,pulc," +
                          "puld,pull,pulled,pulling,pulls,pulx,puly," +
                          "purposes,push,pushed,Pushes,Pushing,putting," +
                          "Questions,RAM,range,rather,reason,Reference," +
                          "register,registers,released,remains,remember," +
                          "remove,removed,Removing,repeatedly,require," +
                          "requires,resources,respect,restore,restriction," +
                          "result,Results,return,returned,returning,reused," +
                          "rolb,ROM,routine,Routines,rp1,rp2,rp3,rtc,rts," +
                          "save,saved,saves,saving,say,Search,Section,seen," +
                          "selected,semantics,sequence,should,show,shows," +
                          "simple,single,small,space,special,specified," +
                          "specifying,staa,Stack,start,starting,state,std," +
                          "Storage,Store,stored,storing,stx,Subroutine," +
                          "Subroutines,subtract,subtracting,swaps,system," +
                          "table,taken,target,task,technique,tedious,tell," +
                          "temporarily,Temporary,tends,Text,tfr,thing," +
                          "three,Thus,time,top,topic,topmost,two,unaltered," +
                          "under,Use,used,user,uses,Using,value,values," +
                          "variable,variables,versions/releases,wanted,way," +
                          "word,work,works,write,zero";
entry.item[68].page = "part011.html";
entry.item[68].description = "The Stack and Subroutines";
entry.item[69].keywords = "#include,$20,$FFD6,ability,acceptable,access," +
                          "accessed,accesses,accessing,Accumulator," +
                          "acknowledged,action,additional,address," +
                          "addresses,allowing,allows,alternative," +
                          "alternatives,Analog-to-Digital,appears,approach," +
                          "approaches,Area,array,arrival,arrive,arrived," +
                          "arrives,assembler,assigned,Assuming," +
                          "Asynchronous,attempting,automatically,basic," +
                          "basically,bclr,bit,bits,Block,both,branch,brclr," +
                          "brset,bset,bsr,buffer,buffered,Buffering,bus," +
                          "buses,busses,byte,calculate,call,called,calls," +
                          "cannot,Capabilities,capable,Capture,case,cases," +
                          "cause,causes,CCR,change,changes,channel," +
                          "Channels,Characteristics,chart,check,checked," +
                          "checking,chip,choice,Circuit,Clock,code," +
                          "Communication,Communications,Compare,concerned," +
                          "condition,configuration,configure,configured," +
                          "connected,consider,consideration,consuming," +
                          "contains,contents,Control,controlled,Controller," +
                          "controlling,Converters,covered,CPU,Data," +
                          "dedicated,definitions,depending,depends," +
                          "described,designed,detail,details,device," +
                          "Devices,different,discussed,display,distinct," +
                          "documentation,don,driving,earliest,easier," +
                          "effect,electrical,else,elsewhere,enabled,end," +
                          "equivalent,error,examining,example,exceptions," +
                          "execute,executed,execution,expected,explained," +
                          "External,fail,families,far,fast,few,field," +
                          "fields,file,Finally,finish,First,flag,flow," +
                          "following,forced,form,Freescale,Full,functions," +
                          "general,generating,get,gets,given,good,Guide," +
                          "handle,handling,handshaking,happen,happens," +
                          "hardware,HC12,HCS12,high,I/O,idea,implement," +
                          "important,inc,include,included,incorporated," +
                          "Index,indicate,indicates,indicating,Individual," +
                          "information,initial,initialized,Input," +
                          "Input/Output,inputs,instead,instruction," +
                          "Instructions,interface,interfaces,Interfacing," +
                          "Inter-Integrated,internal,interrupt,Interrupts," +
                          "invoke,invoked,issue,issues,J1850,jsr,keyboard," +
                          "keystroke,know,known,knows,languages,latency," +
                          "later,latter,ldaa,less,Let,lets,level,line,Link," +
                          "location,locations,long,longer,look,loss,lost," +
                          "machinery,makes,manipulation,map,Mapped,mask," +
                          "MC9S12DP256B,meanings,Memory,Memory/Peripheral," +
                          "microcontroller,microcontrollers,minimize," +
                          "Modulators,much,multiple,names,necessary,need," +
                          "needed,needs,Network,new,Next,nothing,Now," +
                          "number,observe,obtain,occur,occurred," +
                          "occurrences,off-chip,often,on-chip,operate," +
                          "operation,original,Output,outside,overflow," +
                          "overhead,Overview,parallel,perform,Performing," +
                          "peripheral,peripherals,pins,place,placed," +
                          "placing,plus,point,points,poll,polled,Polling," +
                          "port,Ports,positioner,present,preserved,prevent," +
                          "probably,process,processed,processor,processors," +
                          "program,programmer,programs,protects,provided," +
                          "provides,psha,pula,Pulse,purpose,pushing," +
                          "Questions,quick,range,rate,rather,RDRF,read," +
                          "reading,read-only,Real-Time,reason,receive," +
                          "received,refer,referred,register,Registers," +
                          "related,request,requesting,requests,require," +
                          "requires,reset,respond,response,responsible," +
                          "Restore,restored,restores,return,returns,risk," +
                          "ROM,room,routine,rti,rts,Save,save/restore," +
                          "saved,SC0DRL,SC0ISR,SC0SR1,Search,Section," +
                          "sections,send,sends,sent,sequentially,Serial," +
                          "service,servicing,servo,setting,short,shown," +
                          "signaled,signals,simplest,single,solution,space," +
                          "special,specified,stack,start,starting,Status," +
                          "still,store,study,subroutine,Suppose,symbol," +
                          "symbolic,Synchronization,taken,takes,task," +
                          "technique,techniques,Text,Things,three,time," +
                          "Timer,too,tradeoffs,transfer,transmitted,travel," +
                          "two,types,understand,unique,Unless,updated," +
                          "usage,use,used,useful,user,Users,using,value," +
                          "values,vector,version,versus,via,wait,waiting," +
                          "waste,wasted,way,whenever,Width,word,worrying," +
                          "write-only,writing,written,yields";
entry.item[69].page = "part012.html";
entry.item[69].description = "Input/Output Overview";
entry.item[70].keywords = "abstract,acceptable,achieve,additional,affect," +
                          "allowed,amount,Appendix,area,arrives,avoid," +
                          "based,batch,behaves,binary,both,bounce,brought," +
                          "buffer,bypass,bypassing,calculate,calculated," +
                          "called,capability,capacitance,capacitive," +
                          "capacitors,captured,case,cases,cause,caused," +
                          "changes,Characteristics,charge,Checking,chip," +
                          "circuit,circuitry,circuits,clock,close,closed," +
                          "closing,CMOS,components,composite,concern," +
                          "concerned,conducting,connect,connected," +
                          "connecting,connections,Considerations," +
                          "constitute,consumed,consumption,contact," +
                          "converters,core,data,decreases,delay,depend," +
                          "described,design,Designs,determine,device," +
                          "diagram,different,digital,disable,distances," +
                          "distribution,dmin,don,draw,draws,drive,driven," +
                          "drives,driving,dynamic,easiest,easily,edge," +
                          "Electrical,enabled,environment,environments," +
                          "example,except,excessive,expense,fail,failure," +
                          "fairly,false,far,fashion,figure,filter," +
                          "filtering,find,first,float,floating,following," +
                          "found,frequency,Frequently,gates,General," +
                          "generated,generation,give,good,greater,Ground," +
                          "grounds,guess,Guide,hard,HCS12,heat,heavy,Here," +
                          "high,hold,I/O,illustration,immunity,impedance," +
                          "implementation,implemented,important,increased," +
                          "increases,Index,indication,input,inputs,insure," +
                          "intensified,interfaced,Interfacing,internal," +
                          "internally,intervals,intervening,Introduction," +
                          "inverted,inverter,kept,know,large,later,less," +
                          "level,levels,Likewise,load,loading,loads,lock," +
                          "logic,long,longer,look,looks,loops,low,Luckily," +
                          "maintained,make,margin,max,maximum,MC9S12DP256," +
                          "MC9S12DP256B,means,mechanical,meet,met," +
                          "microcontroller,Microcontrollers,midrange," +
                          "milliseconds,min,minimized,Minimum,minus,mode," +
                          "much,multiple,n-channel,necessary,need,needs," +
                          "negative,net,Next,noise,Normally,Note,number," +
                          "obtain,occurs,often,ohms,open,operate,operation," +
                          "order,output,overrides,parts,pass,p-channel," +
                          "performance,period,phase,physical,pin,pins,PLL," +
                          "point,points,Port,positive,possible,potential," +
                          "Power,power-up,problem,production,proportional," +
                          "pullup,pull-up,pure,Purpose,Putting,quality," +
                          "Questions,rates,reached,real,reason,received," +
                          "reduce,reduced,reference,referred,regulator," +
                          "relevant,reliable,rely,represented,represents," +
                          "requirement,requirements,requires,reset," +
                          "resistor,result,Return,roughly,run,running,runs," +
                          "said,saturated,saturation,say,schematic,Search," +
                          "second,seconds,Section,seen,sees,sensed," +
                          "separate,separated,series,setting,setup,sheets," +
                          "should,shown,signal,significant,simplest,single," +
                          "sinking,Situations,sized,skew,small,software," +
                          "solution,solve,source,sources,sourcing,spaced," +
                          "specifications,specified,speed,stable,state," +
                          "states,static,structure,supply,switch,switched," +
                          "switches,synchronous,system,systems,Technology," +
                          "tendency,tens,Text,thin,time,times,Timing," +
                          "transfer,transistors,transition,treated,true," +
                          "TTL,turned,two,unlike,Unused,use,used,Users," +
                          "using,valid,value,valued,values,VDD,VDD1,VDD2," +
                          "VDDA,VDDPLL,VDDR,VDDX,volt,voltage,voltages," +
                          "volts,VRH,VRL,VSS,VSS1,VSS2,VSSA,VSSPLL,VSSR," +
                          "VSSX,wafer,wires,work,worst,yield,zero";
entry.item[70].page = "part012a.html";
entry.item[70].description = "Electrical Characteristics";
entry.item[71].keywords = "Additional,allowed,allows,applies,appropriate," +
                          "arbitrary,bclr,behave,bidirectional,bit,Block," +
                          "branch,brclr,brset,bset,called,changing,circuit," +
                          "code,configuration,configure,configured," +
                          "connected,considerations,consume,contain," +
                          "control,controlled,controls,Core,corresponds," +
                          "CPU,data,DDR,DDRA,DDRB,DDRE,DDRH,DDRK,described," +
                          "description,device,devices,direction,discuss," +
                          "discussed,document,draw,drive,drives,driving," +
                          "effect,eight,eight-bit,electrical,enable," +
                          "enabled,enables,entire,external,fashion,figure," +
                          "float,foo2,four,Freescale,full,Functionality," +
                          "General,generate,ground,grouped,Guide,hardware," +
                          "HCS12,high,high-Z,I/O,implementation," +
                          "implemented,independently,Index,information," +
                          "input,instance,instructions,Integration," +
                          "interface,interference,internal,interrupt," +
                          "Interrupts,keep,Key,later,level,logic,low,make," +
                          "manipulate,maximum,MC9S12DP256B,memory," +
                          "microcontroller,Microcontrollers,mode,Module," +
                          "modules,Multiple,named,narrower,never,Next," +
                          "noise,normal,Note,open-collector,open-drain," +
                          "Operation,output,Overridden,overrides,pad,pads," +
                          "Parallel,part,PER,PERH,peripheral,physically," +
                          "pin,Pins,port,PORTA,PORTB,PORTE,PORTK,Ports," +
                          "possible,power,power-up,PPS,preceding,processor," +
                          "programmed,PTH,PTI,PTIH,PTX,PUCR,pull,pull-down," +
                          "pulling,pull-up,pull-up/pull-down,Purpose,PXn," +
                          "Questions,radio,RDR,RDRH,RDRIV,read,Reading," +
                          "read-only,reads,reduce,reduced,register," +
                          "registers,reserved,resistor,resistors," +
                          "respectively,response,Return,save,schematic," +
                          "Search,Section,sets,shorted,should,shown," +
                          "simpler,simulated,simultaneously,single,slower," +
                          "special,still,Text,three-state,trigger,two," +
                          "Unused,usage,Use,used,useful,Users,using,value," +
                          "via,Wakeups,wanted,wired-or,written";
entry.item[71].page = "part013.html";
entry.item[71].description = "General Purpose I/O Pins";
entry.item[72].keywords = "#include,$E0,$E7,aba,accessed,accommodated," +
                          "accompanies,accumulator,acknowledges," +
                          "acknowledgment,add,added,adding,addition," +
                          "additional,address,allowing,anda,andb,appears," +
                          "aren,asserted,asserting,asserts,assign,assigned," +
                          "automatically,availability,avoided,basic,bclr," +
                          "best,bidirectional,binary,bit,Bits,bitwise," +
                          "board,Boolean,both,bottom,bra,brclr,brset,bset," +
                          "built,built-in,bus,busses,busy,byte,called," +
                          "calling,capabilities,capability,capture," +
                          "captures,care,case,cases,change,changed,chip," +
                          "circuit,circuitry,Clocks,clr,code,Combine," +
                          "components,condition,conditions,configuration," +
                          "configured,configures,connected,consider," +
                          "contents,control,copies,Copy,data,DDRA,DDRJ," +
                          "DDRM,de-asserted,de-asserts,decoding,default," +
                          "definitions,description,designed,details,device," +
                          "devices,DIP,direction,display,disturb,don,down," +
                          "Dragon12-Plus,drive,driven,driver,driving," +
                          "earlier,edges,Eight,employing,enabled,end," +
                          "example,execute,executing,exists,external,extra," +
                          "field,figure,Finally,First,floating,following," +
                          "force,former,forms,four,frequently,full,General," +
                          "generate,generated,generates,get,given,handled," +
                          "Handshakes,Handshaking,hardware,HC12,HC812A4," +
                          "held,high,hundreds,I/O,immediately,implemented," +
                          "inc,independently,Index,indicates,indication," +
                          "indicator,individual,initialized,input,instance," +
                          "instruction,Interface,interfaced,Interfacing," +
                          "interrupt,Interrupts,inverse,IRQ,Keep,knows," +
                          "lamps,latch,latching,latter,ldaa,ldab,least,LED," +
                          "left,leftmost,Less,Let,line,load,logical,low," +
                          "lower,lowering,LSB,lsla,lsra,mask,matching," +
                          "MC9S12DP256B,Memory,Memory/Peripheral," +
                          "microcontroller,mode,modified,modules,movb,MSB," +
                          "name,new,Next,notify,now,occurs,operations," +
                          "output,pads,Parallel,part,parts,peripheral,pin," +
                          "Pins,placing,polled,Port,PORTA,Ports,position," +
                          "positions,potential,Potentially,power-up," +
                          "preceding,present,problem,processor,programmed," +
                          "provides,PTI,PTIJ,PTIM,PTJ,PTM,PUCR,pull-up," +
                          "pull-ups,pulse,pulsed,pulses,Purpose,Questions," +
                          "quickly,race,Raise,raising,rarely,rather,RDRM," +
                          "read,reading,reads,realized,receipt,receive," +
                          "received,receiving,recipient,reduced,register," +
                          "registers,relays,removes,request,require," +
                          "requires,reset,resistors,Return,reversed," +
                          "Reviewing,right,roles,running,say,scheme,Search," +
                          "second,Section,seen,select,sending,sent," +
                          "separate,setting,seven,several,Shift,short," +
                          "shown,shows,signal,signals,significant,simple," +
                          "single,size,Sizes,software,solves,sophisticated," +
                          "staa,store,strobe,strobes,supported,switches," +
                          "symbolic,Synchronization,system,takes,taking," +
                          "techniques,test,tests,Text,three,three-state," +
                          "time,top,transferred,transmission,two,unless," +
                          "Unlike,upper,use,used,useful,uses,Using,value," +
                          "values,via,waits,wide,wires,write,writes," +
                          "writing,XIRQ,zero";
entry.item[72].page = "part013a.html";
entry.item[72].description = "Parallel I/O Ports";
entry.item[73].keywords = "accurate,achieve,activity,addition,aditionally," +
                          "adjust,adjusted,affect,altogether,amplifier," +
                          "appears,appendix,applications,assist,battery," +
                          "BDM,behavior,best,bit,block,blocks,board,bus," +
                          "calculates,calculating,calculation,Capacitor," +
                          "Capacitors,Characteristics,chip,circuit," +
                          "circuitry,circuits,CLKSEL,clock,Clocks,CMOS," +
                          "code,Colpitts,communications,complicated," +
                          "computer,condition,configuration,connected," +
                          "consider,considerably,consisting,consumption," +
                          "contains,controlled,COP,CPU,CRG,CRGFLG,crystal," +
                          "Cycles,depending,depends,described,design," +
                          "designs,desired,Detail,determined,Device," +
                          "devices,different,disabled,disabling,divider," +
                          "dividers,divides,documentation,don,down," +
                          "DRAGON12,Dragon12-plus,drives,dual-inline," +
                          "Earlier,EEPROM,Electrical,enabled,ends,exceed," +
                          "excited,executed,execution,expected,experiment," +
                          "EXTAL,external,factor,fallback,filter,Flash," +
                          "former,formula,found,four,Freescale,frequencies," +
                          "frequency,generate,generator,get,given,Guide," +
                          "half,HC12,HCS12,high,I/O,important,inactive," +
                          "Index,input,instruction,instructions,interface," +
                          "interfaces,internal,interrupt,Interrupts,later," +
                          "less,limited,lock,Locked,Loop,low,lower,maximum," +
                          "megohms,memories,memory,MHz,microcontroller," +
                          "microcontrollers,missing,mode,modified,module," +
                          "modules,monitor,multiply,necessary,need,needed," +
                          "Next,non-regulated,Note,nothing,numerator," +
                          "obtain,occurs,older,operating,operation,optimal," +
                          "oscillator,output,package,part,performance," +
                          "perhaps,peripheral,peripherals,Phase," +
                          "phase-locked,picofarads,Pin,PLL,PLLSEL,Port," +
                          "position,power,powered,powers,processor,produce," +
                          "programming,properly,proportional,provide," +
                          "provided,Questions,range,real,reason,reducing," +
                          "REFDV,referred,register,Registers,Remember," +
                          "removing,requires,reset,Resets,resistor,restart," +
                          "result,resumed,Return,robot,robotics,roughly," +
                          "RTI,run,running,sampled,save,saves,schematic," +
                          "Search,Section,selected,selection,serial," +
                          "several,should,shown,shows,shut,signal," +
                          "significant,smallest,source,sources,speed," +
                          "stable,standard,start,stop,stopping,stops," +
                          "switched,switches,SYNR,System,Text,Thus,time," +
                          "timers,timing,Traps,turn,two,undivided,use,used," +
                          "User,Users,uses,using,value,values,voltage,wai," +
                          "Wait,waiting,won,Writing,XFC,XTAL";
entry.item[73].page = "part014.html";
entry.item[73].description = "System Clocks";
entry.item[74].keywords = "#define,#include,#RAMEND,#rtiint,#rtiisr,$1000," +
                          "$2000,$38,$80,$F2,$FF80,$FFF0,$FFF6,$FFF8,$FFFE," +
                          "$FFFF,&rtiint,abort,access,accessed,accomplish," +
                          "accomplished,Accumulator,action,actions,ADC," +
                          "addd,adding,additional,address,addressed," +
                          "addresses,advance,allow,allowed,allowing,alter," +
                          "altering,amount,anticipation,appear,appears," +
                          "application,applications,appropriate," +
                          "appropriately,array,asm,asm_,assembler,assembly," +
                          "assert,assign,assigning,asynchronous,ATD0,ATD1," +
                          "attempting,attribute,attribute_,back,bclr,BDLC," +
                          "BDM,behaves,best,bit,bits,block,blocked,board," +
                          "boot,Both,bra,breakpoint,breakpoints,bset,bug," +
                          "build,button,byte,bytes,call,called,CAN0,CAN1," +
                          "CAN2,CAN3,CAN4,case,catch,cause,caused,causes," +
                          "causing,CCR,challenges,change,Channel,char," +
                          "character,checked,circuit,circuits," +
                          "circumstances,clear,cleared,clearing,clears,cli," +
                          "Clock,clocks,code,committed,compare,compiler," +
                          "Computer,condition,configuration,configure," +
                          "configured,connected,consider,considerably," +
                          "considerations,consumption,containing,control," +
                          "converter,COP,Core,correctly,count,Counter," +
                          "counting,covered,CPU,CPU12,CRG,CRGFLG,CRGINT," +
                          "criteria,critical,crystal,cycle,Data,D-Bug12," +
                          "DBUG-12,debug,debugger,Debuggers,debugging," +
                          "declaration,declare,declared,dedicated,defined," +
                          "definitions,delay,delayed,demonstrate,described," +
                          "description,desirable,desired,detail,details," +
                          "deterministic,development,device,devices," +
                          "different,digital,disabled,disabling,discussed," +
                          "dispatching,distribution,doesn,don,Down," +
                          "Dragon12-Plus,driven,drop,Edge,EEPROM,elsewhere," +
                          "emulation,emulator,enable,enabled,enables," +
                          "enabling,end,entered,entry,error,evaluation," +
                          "event,example,except,exceptions,execute," +
                          "executed,executes,executing,execution,exited," +
                          "expect,expected,extensions,external,extreme," +
                          "Fail,Failure,failures,family,fast,feature," +
                          "features,fetched,FF80,FF8A,FF8C,FF8E,FF90,FF96," +
                          "FF98,FF9E,FFA0,FFA6,FFA8,FFAE,FFB0,FFB6,FFB8," +
                          "FFBA,FFBC,FFBE,FFC0,FFC2,FFC4,FFC6,FFC8,FFCA," +
                          "FFCC,FFCE,FFD0,FFD2,FFD4,FFD6,FFD8,FFDA,FFDC," +
                          "FFDE,FFE0,FFE2,FFE4,FFE6,FFE8,FFEA,FFEC,FFEE," +
                          "FFF0,FFF2,FFF4,FFF6,FFF8,FFFA,FFFC,FFFE,file," +
                          "files,final,Finally,first,flag,flags,Flash," +
                          "following,force,forever,forget,free,Freescale," +
                          "frequency,frequently,frustrated,function,fuzzy," +
                          "general,generate,generated,generating,generator," +
                          "get,given,GNU,good,Guide,halt,handed,handle," +
                          "handled,handles,happens,harming,having,HC12," +
                          "HCS12,HCS12s,here,high,higher,highest,hold," +
                          "HPRIO,I/O,idea,idle,IIC,immediately,implement," +
                          "implementations,implemented,important,INC," +
                          "in-circuit,include,including,increment," +
                          "indeterminate,Index,indicates,indication," +
                          "initial,initialization,initialize,initialized," +
                          "initializes,input,inputs,insert,inserted," +
                          "instance,instead,instruction,instructions,int," +
                          "integrated,integrity,Interesting,interface," +
                          "interfaces,interfacing,internal,Interrupt," +
                          "interrupting,Interrupts,invalid,invoke,IRQ," +
                          "Issues,jump,jumps,keep,Key,keyword,Knowing," +
                          "known,Language,latency,later,latter,ldd,lds," +
                          "least,link,load,loaded,loader,local,located," +
                          "location,locations,Lock,logic,long,loop,lose," +
                          "low,Lower,machine,Macros,Main,maintains,major," +
                          "makes,manual,map,marked,Mask,maskable,masked," +
                          "MC34064,MC34164,MC9S12DP256B,meaningful,means," +
                          "measure,mechanism,meets,members,memory,MHz," +
                          "microcontroller,microcontrollers,microsecond," +
                          "minimize,minimum,missing,Mode,module,modules," +
                          "Modulus,monitor,monitors,movb,movw,msb,Name," +
                          "namely,near,necessary,need,needed,needs,never," +
                          "Next,none,non-standard,NOP,notable,Note,Nothing," +
                          "occupies,occur,occurred,occurs,operands," +
                          "Operating,Operation,order,org,originally," +
                          "overcome,Overflow,own,part,part015,part015a," +
                          "passes,performed,performing,perhaps,Peripheral," +
                          "peripherals,permissible,pin,placed,placing,PLL," +
                          "plus,pod,point,pointer,points,polled,Port," +
                          "portable,Ports,pose,poses,possible,Power," +
                          "power-up,presence,present,preserved,Press," +
                          "Pressing,prioritized,priority,probably,problem," +
                          "problems,proceed,process,processed,processing," +
                          "processor,program,Programming,programs,Properly," +
                          "provided,PRSTART,Pullup,Pulse,pulsing,pushed," +
                          "PWM,Questions,quickly,RAM,RAMSTART,ranges,rate," +
                          "rather,reach,reached,reading,Real,reason,reduce," +
                          "reduced,Refer,reference,references,referred," +
                          "refers,register,registers,related,reliable,rely," +
                          "remove,repeat,repeatedly,replaces,request," +
                          "requesting,requests,Reserved,reserving,Reset," +
                          "Resets,resetting,resistors,respect,response," +
                          "restore,restores,result,return,returns," +
                          "re-vector,ROM,routine,Routines,RTI,RTICTL,RTIE," +
                          "rtiint,rtiisr,RTIs,run,runs,safe,save,saves," +
                          "SCI0,SCI1,Search,second,sectioin,Section," +
                          "sections,select,selected,sequence,serial," +
                          "Service,serviced,servicing,sets,setting,several," +
                          "short,should,shown,Shutdown,side,signaled," +
                          "signaling,signals,signify,simple,simplifies," +
                          "simulation,simulator,single,slowest,small," +
                          "Software,solve,soon,Source,sources,special," +
                          "specific,specified,specify,SPI0,SPI1,SPI2," +
                          "spurious,stabilizes,stack,standalone," +
                          "stand-alone,start,starting,starts,startup,state," +
                          "static,status,std,step,steps,stop,stopped,stops," +
                          "store,stored,student,subroutine,supply,SWI," +
                          "switch,system,systems,Table,takes,target,TCNT," +
                          "technique,term,Text,thing,things,thread,three," +
                          "time,Timer,timing,told,top,trap,Traps,triggered," +
                          "true,truly,try,turned,two,undefined," +
                          "Unfortunately,unimplemented,unless,unsigned," +
                          "usage,Use,used,User,UserAtoD0,UserAtoD1,UserCRG," +
                          "UserDLC,UserEEPROM,UserFLASH,UserIIC,UserIRQ," +
                          "UserModDwnCtr,UserMSCAN0xxxx,UserMSCAN1xxxx," +
                          "UserMSCAN2xxxx,UserMSCAN3xxxx,UserMSCAN4xxxx," +
                          "UserPAccBOv,UserPAccEdge,UserPAccOvf,UserPortH," +
                          "UserPortJ,UserPortP,UserPWMShDn,UserRTI,Users," +
                          "UserSCI0,UserSCI1,UserSCME,UserSPI0,UserSPI1," +
                          "UserSPI2,UserSWI,UserTimerCh0,UserTimerCh1," +
                          "UserTimerCh2,UserTimerCh3,UserTimerCh4," +
                          "UserTimerCh5,UserTimerCh6,UserTimerCh7," +
                          "UserTimerOvf,UserTrap,UserXIRQ,uses,using,value," +
                          "values,variable,variables,variations,Vector," +
                          "vectors,vendor,version,via,Viewing,void," +
                          "volatile,volatile_,voltage,wai,waiting,waits," +
                          "way,ways,whenever,words,work,worry,worst,write," +
                          "Writing,written,x23,x38,x80,XIRQ,xxx,zero";
entry.item[74].page = "part015.html";
entry.item[74].description = "Interrupts, Traps, and Resets";
entry.item[75].keywords = "$1000,appear,browser,Check,code,controls,count," +
                          "counter,counts,disabled,Display,exited,file," +
                          "generating,interrupt,interrupts,loading," +
                          "location,log,number,page,program,rate,RTI,run," +
                          "running,separate,Simulator,snapshot,stop,taking," +
                          "Updates,window,word";
entry.item[75].page = "part015ax.html";
entry.item[75].description = "Simple Interrupt Example";
entry.item[76].keywords = "$1000,appear,browser,button,Check,code,controls," +
                          "count,counter,counts,dbug12,disabled,Display," +
                          "emulator,exited,file,first,generating," +
                          "initializes,interrupt,interrupts,loading," +
                          "location,log,number,page,press,program,rate,RTI," +
                          "run,running,separate,Simulator,snapshot,stop," +
                          "stops,taking,time,Updates,window,word";
entry.item[76].page = "part015x.html";
entry.item[76].description = "Simple Interrupt Example";
entry.item[77].keywords = "#DATAEND,$10,$1000,$1001,$40,$50,$FF8E,$FFCC," +
                          "$FFCE,$FFF0,$FFF2,$FFF4,$FFFE,Abort," +
                          "accidentally,accomplished,accumulator,action," +
                          "addd,addition,additional,allowing,allows,andcc," +
                          "application,assert,asserted,asserting," +
                          "asynchronous,automatically,back,bclr,bit,bits," +
                          "Block,board,boards,both,bra,Branch,brclr,bset," +
                          "busy,byte,called,capable,care,case,cause,causes," +
                          "causing,CCR,changing,check,clear,cleared,clears," +
                          "cli,code,collector,condition,configure," +
                          "configured,configures,connected,consider," +
                          "considered,contains,control,coounters,COP,Core," +
                          "correct,corresponding,count,counters,counts," +
                          "covers,CRGINT,critical,cross-connected,data," +
                          "D-Bug12,DDRH,default,described,desired," +
                          "determine,device,devices,didn,direction," +
                          "discussed,Dragon12-Plus,driver,drivers,drives," +
                          "earlier,easiest,edge,edges,enable,enabled,end," +
                          "evaluation,example,execute,executed,executing," +
                          "execution,extension,External,falling,fast," +
                          "feature,figure,fine,first,flag,flags,flip-flop," +
                          "followed,following,found,full,gate,gates," +
                          "general,generate,generated,generating,Get,goes," +
                          "Guide,hand,handle,handled,handshaking,happens," +
                          "HCS12,here,high,higher,hold,I/O,immediately,inc," +
                          "increment,incremented,Index,initialization," +
                          "initialized,input,inputs,instruction,insures," +
                          "Integration,intended,internal,Interrupt," +
                          "Interrupts,invocation,invoked,IRQ,IRQCR,IRQE," +
                          "IRQEN,irqint,irqisr,irqs,ISR,Key,KHz,kwhint," +
                          "latch,ldaa,ldd,lds,Let,level,location,loop,low," +
                          "lower,lowest,make,mask,maskable,masks," +
                          "MC9S12DP256,MC9S12DP256B,means,microcomputers," +
                          "microcontroller,microcontrollers,mode,Module," +
                          "movb,movw,multiple,named,NAND,need,negative,new," +
                          "Next,NMI,non-maskable,nop,NOR,not0,not4,Note," +
                          "number,occur,occurs,open,operation,org,output," +
                          "parallel,performs,PH0,PH4,PIEH,PIFH,pin,pinouts," +
                          "pins,PJ7,point,polarity,port,Ports,powered,PPSH," +
                          "prevents,priority,problem,procedure,Process," +
                          "program,provisions,PTH,PTIH,PTJ,pull-up,pulse," +
                          "pulsing,purpose,Questions,rate,Real,reason," +
                          "re-enable,reentered,re-entered,Reference," +
                          "register,relying,Remember,remove,removed," +
                          "replaced,replaces,request,requested,requesting," +
                          "requests,reset,resets,resetting,resistor," +
                          "resistors,respective,response,return,revisit," +
                          "rising,roughly,routine,Routines,rti,RTICTL,RTIE," +
                          "rtiisr,safe,Say,Search,second,Section,seen," +
                          "selected,selects,sensed,sensitive,separate," +
                          "service,serviced,servicing,sets,settings," +
                          "shortly,should,shown,signal,simulator,single," +
                          "sources,specifically,start,state,status,std," +
                          "still,switch,system,table,take,taken,Text,three," +
                          "ticks,time,transition,transitions,true,turning," +
                          "two,type,unasserting,unchanged,under,unless,use," +
                          "used,Users,uses,using,variables,vector,vectors," +
                          "via,viewed,wai,waiting,Wakeups,way,wired-OR," +
                          "work,Writing,written,XIRQ,xirqisr,xirqs,zero";
entry.item[77].page = "part016.html";
entry.item[77].description = "External Interrupts";
entry.item[78].keywords = "$55,$AA,$FFC4,$FFF0,$FFFA,$FFFC,ACQ,addition," +
                          "additional,appendix,ARMCOP,assumed,avoid,based," +
                          "begins,Bit,bits,Block,BLUE,bra,called,cannot," +
                          "cause,changes,cleared,clearing,Clock,CME," +
                          "complete,Computer,consolation,contains,control," +
                          "controller,COP,COPCTL,correct,counter,CR0,CR1," +
                          "CR2,CRG,CRGFLG,CRGINT,crystal,cycles,default," +
                          "depending,depends,desired,detect,devices,digit," +
                          "direction,disabled,disabling,discussed," +
                          "discusses,display,Displays,divider,driven," +
                          "driving,enable,enabled,end,ends,examples,except," +
                          "execute,execution,external,fails,Failure," +
                          "failures,field,final,Finding,fixed,flag," +
                          "followed,four,frequency,function,functions,goes," +
                          "GREEN,GREY,guide,handles,HC12,HCS12,idle," +
                          "implement,implementation,Implementing,Index," +
                          "indicated,initialized,input,instruction," +
                          "internal,Interrupt,Interrupts,intervals,keep," +
                          "kilo-Hertz,LED,light,LOCK,LOCKIE,LOCKIF,look," +
                          "loss,machines,made,marked,maximum,method,MHz," +
                          "microcontroller,minimal,mode,modes,modified," +
                          "module,Monitor,movb,Multiplexed,new,Next,night," +
                          "normal,occur,occurs,often,Operating,operation," +
                          "order,Oscillator,PCE,period,periodic,PLL,PLLCTL," +
                          "PLLON,PORF,PRE,problem,process,program,Properly," +
                          "provides,Questions,range,rate,Real,RED," +
                          "Reference,Register,regular,regulate,report," +
                          "request,reset,resets,restored,restriction," +
                          "resume,Return,RSBCK,RTI,RTICTL,RTIE,RTIF,RTR0," +
                          "RTR1,RTR2,RTR3,RTR4,RTR5,RTR6,running,SCM,SCME," +
                          "SCMIE,SCMIF,Search,seconds,Section,setting," +
                          "shows,simply,slow,software,solely,speed," +
                          "standard,start,state,states,stop,supplies," +
                          "system,table,Text,thereafter,Time,time-out," +
                          "Timer,times,TRACK,traffic,tricky,triggered,turn," +
                          "two,Use,used,Users,uses,using,value,values," +
                          "vector,wai,wait,Watchdog,watchperson,WCOP," +
                          "Window,works,write,writing,written";
entry.item[78].page = "part017.html";
entry.item[78].description = "The RTI and COP Interrupts";
entry.item[79].keywords = "#BMPTIME,#DATAEND,#GREENRED,#GRNM,#include," +
                          "#MAXMAIN,#MAXSIDE,#MAXYELL,#MINMAIN,#MINSIDE," +
                          "#REDGREEN,#REDM,#REDYELLOW,#rtiint,#SENSOR," +
                          "#YELLOWRED,#YELM,$FFF0,accepted,address," +
                          "addresses,adjust,advance,affect,allow,Almy," +
                          "Apologies,Appendix,application,applications," +
                          "appropriate,asm,associated,Author,avoid," +
                          "basically,beq,bgt,block,BMPTIME,bne,bra,brclr," +
                          "bset,bulbs,calculate,captured,car,case,change," +
                          "changed,Check,choice,class,clear,clearing,cli," +
                          "clock,code,coding,combinational,comments," +
                          "conditions,connect,considered,consists," +
                          "constants,contents,contrived,control,controlled," +
                          "Controller,COP,correct,counter,counters,cpd," +
                          "CRGFLG,CRGINT,crystal,currents,Data,DATASTART," +
                          "D-Bug12,DDRB,DDRJ,dead,De-bounced,Decrement," +
                          "decremented,defaults,define,defined,dependent," +
                          "description,design,determine,determines,diagram," +
                          "direction,dispatch,dispatched,don,down," +
                          "Dragon12-Plus,drive,driven,durations,easiest," +
                          "edge,EEPROM,emulator,Enable,entered,entry,equ," +
                          "Equates,examine,example,Except,execute,executed," +
                          "execution,exercise,expressed,external,failure," +
                          "faster,finished,first,flag,Flash,follows,four," +
                          "function,general,given,glitches,gotoREDYELLOW," +
                          "gotoYELLOWRED,Greater,green,GREENRED,GRNM,GRNS," +
                          "handle,hardware,held,here,high,hits,idle," +
                          "implement,Implementation,Implementing,inc,Index," +
                          "information,Initialization,Initialize,input," +
                          "inputs,Instead,instruction,interface,internal," +
                          "Interrupt,interrupts,investigate,involved,jmp," +
                          "jump,Keyboard,latched,latches,ldd,lds,ldx,leave," +
                          "LEDs,Light,lights,likes,loaded,location,logic," +
                          "loop,LSB,Machine,Machines,main,maintains,Make," +
                          "making,max,maxctr,maximum,MAXMAIN,MAXSIDE," +
                          "MAXYELL,Memory,MHz,min,mincnt,minctr,minimum," +
                          "MINMAIN,MINSIDE,Mintime,modified,Moore,movb," +
                          "movw,msec,multiples,necessary,need,needs,new," +
                          "Next,noadj,Nobody,nothing,now,occur,occurrence," +
                          "occurs,operation,org,output,outputs,own,Part," +
                          "part017a,PH0,pins,pointer,Port,PORTB,practice," +
                          "presence,present,process,processes,processor," +
                          "program,propagate,PRSTART,PTIH,pushbutton,race," +
                          "RAM,rate,rather,reached,Real,red,REDGREEN,REDM," +
                          "REDS,REDYELLOW,referred,register,registers," +
                          "relays,represent,represented,reset,restart," +
                          "Return,returns,Review,ROM,routine,routines,row," +
                          "RTI,RTICTL,RTIE,rtiint,run,saves,Search,seconds," +
                          "sensible,sensor,service,sets,should,shown,side," +
                          "signals,simulation,simulator,sit,Software,space," +
                          "stack,standard,start,started,starts,State," +
                          "statements,states,stay,std,steps,stored,storing," +
                          "street,study,style,subd,switches,synchronize," +
                          "system,systems,Text,third,three,Time,times,Tom," +
                          "Traffic,two,unchanged,uncommented,use,used," +
                          "UserRTI,uses,using,value,values,variable," +
                          "variables,vector,vehicle,voltages,wai,waiting," +
                          "waits,watchdog,words,yellow,YELLOWRED,YELM,YELS," +
                          "zero";
entry.item[79].page = "part017a.html";
entry.item[79].description = "Implementing State Machines in Software";
entry.item[80].keywords = "appear,browser,car,checked,code,controls,cycle," +
                          "DBUG12,designed,disabled,emulation,example," +
                          "exited,faster,file,generating,LEDs,lights," +
                          "loading,log,page,Parallel,port,present,press," +
                          "reduce,right,row,run,sensor,separate,simulation," +
                          "Simulator,snapshot,stop,street,switch,taking," +
                          "ten,time,times,trafic,twice,unchecked,uses,View," +
                          "window";
entry.item[80].page = "part017ax.html";
entry.item[80].description = "Trafic Light Example";
entry.item[81].keywords = "#DATAEND,#disptn,#include,#rtiisr,#segm_ptrn," +
                          "$00,$06,$07,$08,$0b,$0d,$0e,$17,$1C,$1E,$38,$39," +
                          "$3D,$3E,$3F,$40,$4F,$50,$54,$5B,$5C,$5E,$63,$66," +
                          "$6D,$6E,$6F,$71,$73,$74,$76,$77,$78,$79,$7C,$7D," +
                          "$7F,$80,aba,accomplish,Adding,Address,advance," +
                          "allow,allowing,alter,amount,anda,andb,anode," +
                          "anodes,Appendix,array,back,based,basic,BCD,best," +
                          "binary,bit,bits,blank,blk,board,bset,built-in," +
                          "byte,bytes,careful,cascaded,cases,cathodes," +
                          "central,Certain,change,char,Character," +
                          "characters,clear,cleared,cli,clock,code,colon," +
                          "column,combinations,compensate,condition," +
                          "connected,connection,connections,connects," +
                          "contain,correct,correspond,CRGFLG,CRGINT,CRT," +
                          "crystal,data,DATASTART,DDRB,DDRP,decimal,delay," +
                          "desired,different,digit,digits,diode,diodes," +
                          "Display,displayed,displaying,Displays,disptn," +
                          "divide,divider,dividing,down,Dragon12-12," +
                          "Dragon12-Plus,drive,driven,driving,dspmap," +
                          "easily,easy,Eight,eighth,eliminate,enable,end," +
                          "equates,Example,executed,eyes,fast,features," +
                          "fetch,field,first,flag,flicker,forward-biased," +
                          "four,get,given,gives,good,ground,handled," +
                          "happens,having,HELP,here,high,holds,idle,ight," +
                          "illuminate,imagination,implementing,inc,incb," +
                          "include,incremented,Index,indexing,indicate," +
                          "indicator,indices,individually,information," +
                          "initialization,initialize,initialized," +
                          "instruction,int,interrupt,interrupts,iode,isn," +
                          "jmp,last,ldaa,ldab,lds,ldx,ldy,least,LED,LEDs," +
                          "left-most,letter,light,lighting,limit,lines,lit," +
                          "little,logic,look,low,map,mapping,mask,means," +
                          "memory,merge,merged,MHz,microcontroller," +
                          "millisecond,milliseconds,mitting,modulo,motion," +
                          "movb,movw,mSec,Multiple,Multiplexed,need,needed," +
                          "Next,none,nonetheless,Note,Now,numerals,numeric," +
                          "occur,oraa,org,output,part,pattern,per,perceive," +
                          "pictures,pin,pins,place,plus,point,points,port," +
                          "portb,portp,position,possible,practice," +
                          "principal,problem,process,Processes,Program," +
                          "programming,provided,PRSTART,PTP,raised,rate," +
                          "Real,realize,reason,register,registers," +
                          "remaining,remains,represents,required,resistors," +
                          "return,right-most,roughly,routine,RTI,RTICTL," +
                          "rtiisr,schematic,Search,second,section," +
                          "segm_ptrn,segment,segments,select,selecting," +
                          "selection,Selects,sequentially,Series,service," +
                          "setting,settings,seven,seven-segment,several," +
                          "show,showing,shown,shows,signal,significant," +
                          "simpler,single,solve,staa,stab,stack,start," +
                          "straightforward,switch,table,tables,Text,tfr," +
                          "three,Time,times,turn,two,units,upside,use,used," +
                          "user,UserRTI,users,Using,value,values,vetctor," +
                          "wai,wait,way,weights,word,wrong";
entry.item[81].page = "part017b.html";
entry.item[81].description = "Time Multiplexed Displays";
entry.item[82].keywords = "#timscr,$0020,$0021,$00210020,$0021FFFC,$0022," +
                          "$0022FFFD,$FFFD,Accumulator,accumulators," +
                          "accurate,activity,addd,addition,additional," +
                          "advantage,allows,aren,assume,background,basic," +
                          "bit,bits,Block,bne,bold,buffers,bytes,called," +
                          "cannot,capable,Capture,captured,Case,cause," +
                          "change,changed,Channel,channels,check,circuit," +
                          "clock,clock-driven,clocks,CNTEXT,code,Compare," +
                          "conclusion,configuration,configured,connect," +
                          "Consider,consists,consumption,contents,control," +
                          "Count,counter,counters,cpd,cycles,data,D-BUG12," +
                          "DDRT,debug,debugger,default,described,desirable," +
                          "diagram,difference,difficult,direction,disables," +
                          "discuss,discussed,divide,divider,don,earlier," +
                          "ECT_16B8C,edge,effects,elapsed,emphasized," +
                          "enable,enhanced,execute,executed,executing," +
                          "execution,exercise,extend,extension,external," +
                          "extra,extremely,Factor,failed,family,fashion," +
                          "features,few,find,finish,finished,finish-start," +
                          "first,flag,follow,following,fully,general," +
                          "generate,generating,Get,give,gives,giving,goes," +
                          "Guide,happens,haven,HC12,HCS12,help,here,high," +
                          "higher,hold,holds,I/O,immediately,including," +
                          "incorrect,increment,increments,Index," +
                          "initialized,Input,instruction,instructions," +
                          "interested,internal,interrupt,later,ldd,left," +
                          "length,Let,levels,limitation,long,longer,look," +
                          "lower,matter,matters,measure,measurements," +
                          "measuring,mentioned,MHz,microcontroller," +
                          "microcontrollers,microsecond,mode,modulated," +
                          "modulation,Module,modules,movb,movw,never,Next," +
                          "nor,normally,Note,Now,nsec,occasionally,occur," +
                          "occurs,old,operation,order,original,Output," +
                          "overflows,overrides,page,pages,passed,perform," +
                          "periods,pin,pins,Port,portion,ports,possible," +
                          "power,PR0,PR1,PR2,Prescale,prescaler,preset," +
                          "probably,problems,processor,program," +
                          "programmable,programmer,PTIT,PTT,Pulse,pulses," +
                          "purpose,Questions,range,reach,read,reading," +
                          "reads,reduced,register,registers,Remember," +
                          "repeat,requirement,requires,reset,resulting," +
                          "results,return,Reversing,routine,rti,runs,say," +
                          "Search,second,seconds,Section,sections,segment," +
                          "separate,service,servo,setting,several,showing," +
                          "shows,signal,signals,simultaneously,single,size," +
                          "software,source,Special,specific,split,start," +
                          "status,std,stop,stops,store,student,subd," +
                          "suffice,Suppose,system,table,takes,TCNT,TCRE," +
                          "TEN,Text,TFFCA,TFLG2,time,Timer,timers,times," +
                          "timisr,TMSK2,TOF,TOI,trains,trick,TSCR1,TSCR2," +
                          "TSFRZ,TSWAI,two,units,upper,use,used,useful," +
                          "Users,UserTimerOvf,using,value,values,variable," +
                          "vector,virtual,wai,wait,whenever,wide,width," +
                          "widths,word,worked,writing,written,wrong";
entry.item[82].page = "part018.html";
entry.item[82].description = "The Timer Module";
entry.item[83].keywords = "#tc0isr,$01,$02,Accumulator,adca,addition," +
                          "additional,addressing,affects,allows,alter," +
                          "applications,assume,assuming,bclr,bit,bits," +
                          "block,blue,bmi,both,Branch,brclr,bset,C0F,C0I," +
                          "C1F,C1I,C2F,C2I,C3F,C3I,C4F,C4I,C5F,C5I,C6F,C6I," +
                          "C7F,C7I,Calculate,calculated,called,cannot," +
                          "Capture,Capture/Output,captured,captures," +
                          "capturing,Care,Case,change,changing,Channel," +
                          "channels,chart,Check,choice,clear,clears,clock," +
                          "CNTEXT,code,Compare,Compared,configuration," +
                          "configure,configured,Connect,connected," +
                          "consecutive,control,copy,correct,corrected," +
                          "Count,counts,CPU,cycles,data,D-BUG12,decide," +
                          "default,described,desired,detected,detector," +
                          "deteriorates,devoted,diagram,difference," +
                          "different,differing,disable,disabled,doesn," +
                          "driven,easy,EDG,EDG0A,EDG0B,EDG1A,EDG1B,EDG2A," +
                          "EDG2B,EDG3A,EDG3B,EDG4A,EDG4B,EDG5A,EDG5B,EDG6A," +
                          "EDG6B,EDG7A,EDG7B,edge,edges,efficiency,eight," +
                          "Elevating,enable,end,entered,entire,E-S,examine," +
                          "examples,execute,execution,explicitly,extend," +
                          "extended,Extending,external,falling,fashion," +
                          "feature,fetches,figure,fine,finishes,flag," +
                          "following,function,Get,gets,going,hardware," +
                          "having,HC12,help,high,higher,holds,HPRIO,ideal," +
                          "immediately,important,include,increase," +
                          "increment,incremented,increments,Index," +
                          "initialize,Input,Instead,instruction," +
                          "instructions,interrupt,interrupts,interupt," +
                          "invalid,involved,inx,IOS0,IOS1,IOS2,IOS3,IOS4," +
                          "IOS5,IOS6,IOS7,key,know,known,large,larger," +
                          "LASTTC0,latter,ldd,ldx,leading,least,Lets," +
                          "levels,limit,limitation,limitations,loaded," +
                          "loads,Long,longer,look,Lower,Make,making,manual," +
                          "maximum,means,measure,measurement,measuring,MHz," +
                          "microseconds,minimum,Module,monitor,monitored," +
                          "move,movw,nanoseconds,need,needed,needs,nega," +
                          "negate,Negative,negb,Next,Note,number,obtain," +
                          "occurred,occurs,operation,order,Output,overflow," +
                          "overflowed,overflows,page,pending,percentage," +
                          "performance,period,periods,pin,pins,point," +
                          "polled,Port,positive,possible,PR0,PR1,PR2," +
                          "preceding,prior,priority,problem,program," +
                          "programmed,prudent,PT0,PT1,PTIT,Pulse,Pulses," +
                          "Questions,raise,rate,read,reading,reason," +
                          "reconfigured,red,reduce,re-enable,reference," +
                          "register,registers,requested,reset,resetting," +
                          "Return,rising,routine,rti,safely,save,saved,say," +
                          "says,S-E,Search,second,Section,segment,selected," +
                          "service,several,shared,short,Shortest,should," +
                          "show,shown,shows,sign,signal,signals,single," +
                          "small,Special,specification,square,start,status," +
                          "std,stops,store,stx,subd,Subtract,system,take," +
                          "taken,takes,task,TC0,tc0isr,TC1,TC7,TCNT,TCRE," +
                          "TCTL3,TCTL4,TEN,Text,TFFCA,TFLG1,TFLG2,tfr,Thus," +
                          "TIE,time,Timer,times,timok,TIOS,TMSK1,TMSK2,TOF," +
                          "TOI,too,trailing,trigger,triggering,TSCR1,TSCR2," +
                          "TSFRZ,tsta,TSWAI,two,under,unique,upper,use," +
                          "used,UserTimerCh0,uses,using,value,values," +
                          "variable,variables,vector,version,Wait,wakeups," +
                          "wanted,wave,waveform,way,whenever,width,widths," +
                          "word,work,world,writing";
entry.item[83].page = "part018a.html";
entry.item[83].description = "The Timer Module";
entry.item[84].keywords = "#10,#20,#DATAEND,#include,#state1,#state2," +
                          "#tc0int,$00,ability,Accumulator,action,add,addd," +
                          "addition,additional,allow,alter,alternate," +
                          "alternating,appears,application,applications," +
                          "approach,Asymmetrical,asynchronously,bclr,bit," +
                          "bits,blue,both,box,bra,brclr,bset,button,C0F," +
                          "C0I,C1F,C1I,C2F,C2I,C3F,C3I,C4F,C4I,C5F,C5I,C6F," +
                          "C6I,C7F,C7I,Calculate,cannot,Capture,Case,cause," +
                          "causes,CFORC,change,changed,changes,Channel," +
                          "channels,Check,circumstance,clear,cleared,cli," +
                          "Clock,clocks,code,Compare,compared," +
                          "configurations,configure,considerably,control," +
                          "Count,counts,data,DATASTART,DBUG12,D-BUG12,DDRT," +
                          "default,delay,depending,described,different," +
                          "direction,don,driven,edge,effect,emulator," +
                          "enabled,enables,enter,entry,equal,equals," +
                          "example,examples,except,execute,executed," +
                          "execution,explicit,fast,fetch,first,five,flag," +
                          "FOC0,FOC1,FOC2,FOC3,FOC4,FOC5,FOC6,FOC7," +
                          "following,force,forced,four,Frequency,function," +
                          "future,generate,generates,generating,generation," +
                          "generator,Get,gets,Given,half,happen,happened," +
                          "HC12,here,high,hitime,hold,identical,Idle," +
                          "ignored,immediately,important,inc,Index,initial," +
                          "initialization,Initialize,initialized,Input," +
                          "instruction,instructions,interesting,internal," +
                          "interrupt,interrupts,investigate,IOS,IOS0,IOS1," +
                          "IOS2,IOS3,IOS4,IOS5,IOS6,IOS7,jmp,Jump,kHz," +
                          "labeled,largest,last,ldd,lds,ldx,leave,let," +
                          "level,levels,limited,loaded,Log,longer,loop," +
                          "lotime,low,machine,making,match,maximum,means," +
                          "Memory,mentioned,microsecond,microseconds," +
                          "milliseconds,minimum,miss,Module,movw,need," +
                          "needs,new,Next,Note,nothing,Now,occur,OL0,OL1," +
                          "OL2,OL3,OL4,OL5,OL6,OL7,old,OM0,OM1,OM2,OM3,OM4," +
                          "OM5,OM6,OM7,Optionally,org,originally,Output," +
                          "per,perform,period,periods,pin,pointer,polling," +
                          "Port,possibly,PR0,PR1,PR2,preceding,pressed," +
                          "problem,problems,process,program,provides," +
                          "PRSTART,PT0,PT3,PTT,Pulse,pulses,Questions,RAM," +
                          "reading,reads,red,Register,registers,Remember," +
                          "repeats,requests,reset,respectively,Return," +
                          "reverse,roughly,routine,rti,run,save,Search," +
                          "Section,segment,service,sets,setting,short," +
                          "shown,signal,simulator,small,smaller,source," +
                          "Special,square,stack,start,state,state1,state2," +
                          "states,status,std,still,store,stored,Storing," +
                          "symmetrical,system,T3F,table,taken,TC0,tc0int," +
                          "TC3,TC7,TCNT,TCRE,TCTL1,TCTL2,TEN,Text,TFFCA," +
                          "TFLG1,three,TIE,time,Timer,times,TIOS,TMSK1," +
                          "TMSK2,Toggle,toggled,toggling,TOI,too," +
                          "traditional,transition,TSCR1,TSCR2,TSFRZ,TSWAI," +
                          "twice,twist,two,under,units,unknown,update,use," +
                          "used,useful,UserTimerCh0,uses,using,value," +
                          "values,Variable,vector,wai,Wait,Wave,waveforms," +
                          "way,word,write,writing,zero";
entry.item[84].page = "part018b.html";
entry.item[84].description = "The Timer Module";
entry.item[85].keywords = "appear,box,browser,change,changes,checked," +
                          "checking,code,Console,controls,disabled,Display," +
                          "execution,exited,file,generating,loading,Log," +
                          "measure,Output,page,pin,Port,run,separate," +
                          "Simulator,snapshot,stop,taking,time,Updates," +
                          "viewing,window";
entry.item[85].page = "part018b2x.html";
entry.item[85].description = "Timer Output Compare Example";
entry.item[86].keywords = "appear,breakpoint,browser,change,check,checked," +
                          "code,controls,disabled,Display,execution,exited," +
                          "file,generating,interrupt,interrupts,loading," +
                          "log,measuring,operation,page,pin,Port,routine," +
                          "run,separate,setting,Simulator,snapshot,start," +
                          "stop,taking,time,Updates,window";
entry.item[86].page = "part018bx.html";
entry.item[86].description = "Timer Output Compare Example";
entry.item[87].keywords = "#10,#11,#1199,#2399,#include,#RAMEND,#tc7int," +
                          "ability,Accumulator,actions,addd,additional," +
                          "allow,alter,based,Bit,Bits,blue,both,bra,bset," +
                          "button,C7F,C7I,cannot,capabilities,capability," +
                          "Capture,Case,certain,change,changed,Channel," +
                          "channels,circuit,clear,cli,clocks,code," +
                          "comparator,Compare,compares,configure," +
                          "configured,constant,Control,corresponding,Count," +
                          "counter,counts,covered,cycle,cycles,D-BUG12," +
                          "dedicated,described,discussed,drive,driven," +
                          "drives,duty,easy,emulator,enable,enabled,entry," +
                          "equals,executed,execution,feature,following," +
                          "frequency,function,Functionality,generate," +
                          "generated,generates,generating,generator,half," +
                          "HC12,HCS12,here,high,Idle,important,inc," +
                          "Increment,Index,initial,Initialization," +
                          "Initialize,Input,instance,interrupt,interrupts," +
                          "IOS,IOS0,IOS1,IOS2,IOS3,IOS4,IOS5,IOS6,IOS7,kHz," +
                          "large,ldd,lds,low,magic,make,match,memory,MHz," +
                          "microcontrollers,microseconds,milliseconds,mode," +
                          "modulated,Modulation,Module,movw,necessary," +
                          "never,Next,nop,Note,number,OC0,OC7,OC7D,OC7D0," +
                          "OC7D1,OC7D2,OC7D3,OC7D4,OC7D5,OC7D6,OC7D7,OC7M," +
                          "OC7M0,OC7M1,OC7M2,OC7M3,OC7M4,OC7M5,OC7M6,OC7M7," +
                          "occurs,OL7,OM7,org,originally,Output,overflows," +
                          "overhead,period,pin,pins,point,pointer,Port," +
                          "possible,PR0,PR1,PR2,pressed,priority,process," +
                          "processor,program,programs,proportion,PRSTART," +
                          "PT0,PT1,PT2,PT4,PT5,PT7,Pulse,PWM,Questions," +
                          "range,realize,red,Register,Registers,rely," +
                          "remains,require,reset,resets,restrict,result," +
                          "Return,Routine,rti,run,save,Search,Section," +
                          "Service,servos,sets,signal,signals,simulator," +
                          "simultaneously,single,software,Special," +
                          "specified,specify,spent,square,stack,start," +
                          "state,states,Status,std,symmetrical,systems," +
                          "tasks,TC0,TC7,tc7int,TCNT,TCRE,TCTL1,TCTL2,TEN," +
                          "Text,TFFCA,Thus,TIE,time,Timer,TIOS,TMSK2,TOF," +
                          "toggle,TOI,TSCR1,TSCR2,Turn,twice,under,use," +
                          "used,UserTimerCh7,uses,using,value,values," +
                          "varies,vector,wai,wave,waves,width,zero";
entry.item[87].page = "part018c.html";
entry.item[87].description = "The Timer Module";
entry.item[88].keywords = "appear,browser,change,checked,code,controls," +
                          "DBUG12,disabled,Display,doesn,emulator,example," +
                          "execution,exited,file,generating,interrupts," +
                          "loading,log,page,pin,Port,run,separate," +
                          "Simulator,snapshot,stop,taking,Updates,use,used," +
                          "window";
entry.item[88].page = "part018c2x.html";
entry.item[88].description = "Hardware Generated Squarewave";
entry.item[89].keywords = "appear,browser,change,checked,code,controls," +
                          "DBUG12,disabled,Display,doesn,emulator,example," +
                          "execution,exited,file,generating,interrupts," +
                          "loading,log,page,pin,Port,run,separate," +
                          "Simulator,snapshot,stop,taking,Updates,use,used," +
                          "window";
entry.item[89].page = "part018c3x.html";
entry.item[89].description = "Pulse Width Modulation";
entry.item[90].keywords = "appear,browser,change,checked,code,controls," +
                          "disabled,Display,execution,exited,file," +
                          "generating,loading,log,page,pins,Port,run," +
                          "separate,Simulator,snapshot,stop,taking,Updates," +
                          "window";
entry.item[90].page = "part018cx.html";
entry.item[90].description = "Multiple Square Waves";
entry.item[91].keywords = "#1000,#24000,#DATAEND,#include,#paeint,#paovint," +
                          "#tc6int,$00A2,$40,$FFDA,$FFDC,accessed," +
                          "accumulate,accumulated,Accumulation,Accumulator," +
                          "add,addd,Additionally,adjust,adjustment,adjusts," +
                          "allow,amount,assumes,author,bcc,bclr,behaves," +
                          "beq,bit,bits,block,bmi,both,box,bra,branch," +
                          "brclr,bset,button,byte,C6F,Capture,carry,Case," +
                          "cause,change,Channel,check,circuit,cli,CLK0," +
                          "CLK1,clock,Clock/64,clocks,code,Compare," +
                          "connected,consecutive,contents,control," +
                          "controlled,copies,correct,Count,counted,Counter," +
                          "counting,counts,cpx,data,DATASTART,D-BUG12," +
                          "default,determines,diagram,difference,disabled," +
                          "display,displays,divide,divided,divider,drive," +
                          "driven,Earlier,Edge,edges,elapsed,else,emulator," +
                          "enable,enabled,enables,end,enlarged,entered," +
                          "entry,Event,events,examined,examines,execution," +
                          "extended,external,falling,feature,flag," +
                          "following,four,frequencies,Frequency,gate,Gated," +
                          "get,gives,goes,gone,greater,hardware,HCS12,here," +
                          "high,highTime,Idle,implement,Important,inc," +
                          "increase,increment,incremented,incrementing," +
                          "increments,independently,Index,Initialization," +
                          "Initialize,Input,inputs,instead,integer," +
                          "Internal,interrupt,interrupts,inverse,inx,iny," +
                          "kHz,know,large,larger,ldd,lds,ldx,ldy,limited," +
                          "located,location,look,looking,low,lower,make," +
                          "maximum,means,measure,measurement,Measurements," +
                          "memory,merged,MHz,microsecond,microseconds," +
                          "millisecond,minutes,Mode,modes,modified," +
                          "Modulation,Module,movw,mscnt,multiplexer,namely," +
                          "need,Next,noC,noov,normally,Note,observed,occur," +
                          "occurred,onesecond,operating,operation,order," +
                          "org,Output,overflow,overflowed,overflows,PACN2," +
                          "PACN3,PACTL,paeint,PAEN,PAFLG,PAI,PAIF,PAMOD," +
                          "PAOV,PAOVF,PAOVI,paovint,part,PEDGE,per,period," +
                          "periods,pin,pointer,poor,precision,prescaler," +
                          "pressed,process,program,provided,provides," +
                          "PRSTART,PT6,PT7,Pulse,Questions,RAM,ran,range," +
                          "rate,read,reading,record,recorded,register," +
                          "registers,Remember,request,reset,resets," +
                          "resolution,Return,rising,routine,rti,run," +
                          "running,runs,saw,Search,second,Section,selected," +
                          "selects,service,setting,sheet,shown,signal," +
                          "significant,simply,simulation,simulator,single," +
                          "small,software,source,sources,Special,specified," +
                          "stack,start,status,std,store,stored,stx,sty," +
                          "supply,Sysclk/64,system,TC6,tc6int,TCNT," +
                          "technique,TEN,Text,TFLG1,thousand,thousandth," +
                          "TIE,Time,Timer,TIOS,too,triggered,TSCR1,twice," +
                          "two,units,Unlike,unusual,upper,use,used," +
                          "UserPAccEdge,UserPAccOvf,UserTimerCh6,uses," +
                          "using,value,values,variable,vector,vectors," +
                          "version,wai,wait,waveform,Width,word,work," +
                          "writing,written,zero";
entry.item[91].page = "part018d.html";
entry.item[91].description = "The Timer Module";
entry.item[92].keywords = "$1000,accumulated,appear,browser,byte,code," +
                          "controls,create,disabled,exited,file,generating," +
                          "generator,high,loading,location,log,menu," +
                          "microseconds,need,page,pin,Port,program,run," +
                          "separate,signal,Simulator,snapshot,starting," +
                          "stop,stored,taking,time,units,use,variable,view," +
                          "waveform,window";
entry.item[92].page = "part018dx.html";
entry.item[92].description = "Measuring Accumulated Pulse Widths";
entry.item[93].keywords = "#10,#1000,#12,addition,adjustment,aid,allows," +
                          "application,applications,approach,audio," +
                          "basically,basics,best,bit,bits,Block,CAE,CAE0," +
                          "CAE1,CAE2,CAE3,CAE4,CAE5,CAE6,CAE7,carrier," +
                          "cascaded,case,cause,cellular,centered,changes," +
                          "channel,channels,circuit,circuits,clock,clocks," +
                          "close,code,combined,communication,comparator," +
                          "comparison,CON01,CON23,CON45,CON67,configure," +
                          "configured,connect,Connecting,CONnn,consists," +
                          "constant,control,controlled,conversion," +
                          "Converter,corresponding,cost,counter,counters," +
                          "counters/registers,cover,create,cycle,data," +
                          "default,Density,described,different,digital," +
                          "discussed,discusses,divide,divider,Dividers," +
                          "divides,division,doubled,duty,easily,edges," +
                          "eight,enable,enabled,ends,equals,even-odd," +
                          "factor,fast,Features,field,figure,finer,finest," +
                          "first,following,four,free,Freescale,fully," +
                          "general,generate,generated,generating," +
                          "generation,generator,generators,get,gets,given," +
                          "goes,going,Guide,having,HCS12,here,high,I/O," +
                          "incremented,Index,initialize,input,Instead," +
                          "instructions,Interfaces,involves,large,leading," +
                          "left-aligned,less,Let,Lets,level,limit,low,make," +
                          "maximum,MCUs,MHz,Microcontrollers,microsecond," +
                          "microseconds,middle,millisecond,mode,modulate," +
                          "modulated,Modulation,Modulator,module,movb,movw," +
                          "msec,multiples,necessary,needs,new,Next," +
                          "non-stopping,Note,notes,number,numbered," +
                          "obtaining,occur,odd,operating,operation," +
                          "optional,output,paired,pairs,parts,PCKA0,PCKA1," +
                          "PCKA2,PCKB0,PCKB1,PCKB2,PCLK,PCLK0,PCLK1,PCLK2," +
                          "PCLK3,PCLK4,PCLK5,PCLK6,PCLK7,PDM,percent," +
                          "period,periods,Peripheral,PFRZ,phones,pin,pins," +
                          "polarity,Port,positional,positive,possible," +
                          "power,PPOL,PPOL0,PPOL1,PPOL2,PPOL3,PPOL4,PPOL5," +
                          "PPOL6,PPOL7,Precision,prescaler,proportional," +
                          "provided,provides,providing,PSWAI,Pulse," +
                          "pulse_width/period,pulses,purpose,PWM,PWM_8B8C," +
                          "PWMCAE,PWMCLK,PWMCNT,PWMCTL,PWMDTY,PWMDTY0,PWME," +
                          "PWME0,PWME1,PWME2,PWME3,PWME4,PWME5,PWME6,PWME7," +
                          "PWMPER,PWMPER0,PWMPOL,PWMPRCLK,PWMSCLA,PWMSCLB," +
                          "Questions,range,rate,rather,ratio,reaches," +
                          "Reading,referenced,References,register," +
                          "registers,relation,remain,remaining,remains," +
                          "repeats,representing,represents,Reproduction," +
                          "requires,reset,resets,resolution,Return,revert," +
                          "sawtooth,say,Search,second,Section,sections," +
                          "seen,select,Serial,servo,sets,Setting,should," +
                          "shown,signal,signals,Sine-Wave,single,slower," +
                          "SPI,SPIs,start,starts,stop,storing,Synthesis," +
                          "system,technique,telephone,Text,things,three," +
                          "time,times,timing,tone,transmission,two,units," +
                          "up-down,use,usec,used,useful,Users,using,value," +
                          "values,variation,varied,varies,varying,via," +
                          "viewed,WAI,wide,Width,widths,wire,writing,zero";
entry.item[93].page = "part018e.html";
entry.item[93].description = "Pulse Width Modulation";
entry.item[94].keywords = "#240/3,#atdint,#DATAEND,#include,$0080,$82," +
                          "Accuracy,accurate,achieving,acquisition,ADC," +
                          "adca,adcb,add,addd,added,addition,address,ADPU," +
                          "ADR0,ADR00,ADR00H,ADR01H,ADR02H,ADR03H,ADR07," +
                          "ADR0x,ADR1x,ADT0STAT0,AFFC,affect,allow," +
                          "allowing,allows,alternative,amplifier,Analysis," +
                          "Appendix,application,approach,approximate," +
                          "approximation,Arithmetic,ASCIE,ASCIF,asserted," +
                          "assist,ATD,ATD_10B8C,ATD0CTL2,ATD0CTL3,ATD0CTL4," +
                          "ATD0CTL5,ATD0DIEN,ATD0STAT0,ATD0STAT1,ATD0xxxx," +
                          "ATD1DIEN,ATD1xxxx,atdint,automatically,average," +
                          "averaged,averaging,AWAI,based,bclr,BDM,best," +
                          "binary,bit,bits,black,Block,both,bra,brclr," +
                          "breakpoint,buffer,byte,capacitive,capacitor," +
                          "capture,captures,case,cause,causes,causing,CC0," +
                          "CC1,CC2,CCF,CCF0,CCF1,CCF2,CCF3,CCF4,CCF5,CCF6," +
                          "CCF7,centered,change,changed,changes,Channel," +
                          "chapter,characteristics,charge,Clear,cleared," +
                          "cli,clock,clocks,close,code,combination,command," +
                          "commands,compact,comparing,complete,completed," +
                          "completes,configuration,configure,connected," +
                          "consecutive,consists,consumes,contains,control," +
                          "controls,conversion,conversions,converted," +
                          "Converter,Converters,correct,corresponding," +
                          "cycle,Data,DATASTART,dbne,D-Bug12,debugger," +
                          "decimal,default,defined,delay,depend,described," +
                          "design,desired,determine,Digital,disable," +
                          "disabled,discuss,divide,divider,dividers," +
                          "divides,divisor,divisors,DJM,documentation," +
                          "driven,DSGN,easy,edge,effect,eight,eighth," +
                          "Electrical,enable,enabled,enables,end,entry," +
                          "especially,ETORF,ETRIGE,ETRIGLE,ETRIGP,event," +
                          "example,excessive,executed,executing,execution," +
                          "External,extra,factors,fairly,falling,Fast," +
                          "fastest,feature,FIFO,FIFOR,final,first,Flag," +
                          "flow,followed,following,four,fourth,fraction," +
                          "fractions,Freescale,frequency,FRZ0,FRZ1," +
                          "function,future,general,generate,generated,get," +
                          "gives,giving,goal,goes,greatly,green,ground," +
                          "guaranteed,Guide,having,HCS12,here,high,Idle," +
                          "ignored,immediately,impedence,important,inc," +
                          "inconsistencies,inconsistent,increase," +
                          "incremented,Index,indicate,indicated,indicating," +
                          "initial,Initialization,Initialize,initialized," +
                          "input,Inputs,instead,instruction,instructions," +
                          "integers,interface,Interfacing,internal," +
                          "interrupt,interrupts,justification,justified," +
                          "kHz,labeled,large,largest,later,ldaa,ldd,lds," +
                          "Leakage,left,level,limit,limited,lines,lists," +
                          "loaded,loading,location,logic,long,longer,loop," +
                          "low,lsrd,made,making,manufacture,mask,maximum," +
                          "MC9S12DP256,meaning,means,measure,measured," +
                          "measurement,measurements,measuring,memory," +
                          "Memory/Peripheral,mentioned,MHz,microcontroller," +
                          "microsecond,microseconds,minimum,mirrors,Mode," +
                          "modifying,module,modulo,Monitor,movb,movw,MULT," +
                          "multiplexer,N/256,N-1,named,naming,necessarily," +
                          "needed,new,Next,noise,nonlinearity,Normally," +
                          "Notice,number,obtain,occur,operate,operating," +
                          "operation,order,org,Overflow,overview,PAD00," +
                          "PAD03,PAD07,PAD08,PAD10,PAD15,PAD17,PAD3,pads," +
                          "pausing,per,perform,performed,performing," +
                          "performs,period,periods,pin,Pins,placed,point," +
                          "pointer,Port,PORTAD,PORTAD0,PORTAD1,portion," +
                          "ports,position,possible,potentially,power," +
                          "preceding,precision,prescaler,process,processor," +
                          "program,programmable,proper,PRS,PRS0,PRS1,PRS2," +
                          "PRS3,PRS4,PRSTART,purpose,Questions,RAM,range," +
                          "rather,reach,read,reading,readings,reads,reason," +
                          "red,reduced,reduces,re-entered,reference,refers," +
                          "register,registers,regulated,relies," +
                          "repetitively,represent,represented,represents," +
                          "request,requires,resistive,resistor,resolution," +
                          "result,resulting,results,Return,right,rising," +
                          "roughly,round,routine,rti,run,runs,S1C,S2C,S4C," +
                          "S8C,sample,sampled,sampling,save,Scaled,Scan," +
                          "SCF,scope,Search,second,Section,seen,selected," +
                          "Selection,selections,selects,sensitive,separate," +
                          "sequence,sequences,service,Sets,setting," +
                          "settings,several,should,shown,side,signal," +
                          "signed,simulator,single,slowly,small,smallest," +
                          "SMP0,SMP1,source,sources,specify,speed,SRES8," +
                          "stack,stages,Start,starting,starts,status,std," +
                          "still,stop,stopped,stored,storing,successive," +
                          "swi,switched,switching,system,table,takes," +
                          "technique,test,Text,themeasurement,things,third," +
                          "three,time,times,Timing,trigger,triggered," +
                          "Triggering,turns,two,under,unlike,unsigned," +
                          "unusual,use,used,useful,UserAtoD0,Users,Using," +
                          "utilize,valid,value,Values,variation,VDDA," +
                          "vector,voltage,voltages,volts,Vref,VRH,VRH-VRL," +
                          "VRL,VSSA,V-V,wai,wait,wait2,watch,work,Works," +
                          "wrap,writing,x12";
entry.item[94].page = "part019.html";
entry.item[94].description = "The Analog to Digital Converter";
entry.item[95].keywords = "$1000,ADC,appear,average,browser,code,controls," +
                          "disabled,exited,File,four,generating,loading," +
                          "location,log,make,measurements,menu,page,pin," +
                          "program,reset,restart,run,separate,Simulator," +
                          "snapshot,starting,stop,store,taking,Use,voltage," +
                          "window,word";
entry.item[95].page = "part019x.html";
entry.item[95].description = "Analog to Digital Converter";
entry.item[96].keywords = "$0000,$01,$05,$0FFF,$1000,$20,$27,$3FF,$3FFF," +
                          "$40,$400,$402,$403,$41,$60,$80,$E0,$E00,$E40," +
                          "$E80,$EC0,$F0,$F00,$F1,$F40,$F80,$FC0,$FF,$FFD," +
                          "$FFF,accept,ACCERR,access,accessed,accesses," +
                          "accessible,Accessing,addition,additional," +
                          "address,addressable,addresses,aligned,allow," +
                          "allows,altering,amount,appear,appendix," +
                          "application,applications,Arithmetic,arranged," +
                          "attempting,bank,base,basically,basis,bclr,BDM," +
                          "BEAD,BEADFACE,best,Bit,bits,BLANK,Block,board," +
                          "boot,boundary,brclr,bus,byte,bytes,calibration," +
                          "cannot,capabilities,case,CBEIE,CBEIF,CCIE,CCIF," +
                          "change,changed,changes,changing,check,checked," +
                          "Checks,checksum,chip,cleared,clock,CMDB0,CMDB2," +
                          "CMDB5,CMDB6,code,combinations,command,commands," +
                          "complete,Configuration,configure,Configuring," +
                          "conflicting,constants,contain,contained," +
                          "contains,contents,control,controlled," +
                          "conveniently,Core,correspond,covered,crystal," +
                          "cycles,data,D-Bug12,debug,debugger,default," +
                          "deliverable,depending,description,designed," +
                          "desire,desired,destroy,detailed,detect," +
                          "deterioration,determine,development,Device," +
                          "different,differently,disabled,discussed,divide," +
                          "divider,divides,divisor,Documentation,down," +
                          "Dragon12-Plus,driven,earlier,easier,ECLKDIV," +
                          "ECMD,ECNFG,EDIV,EDIV0,EDIV1,EDIV2,EDIV3,EDIV4," +
                          "EDIV5,EDIVLD,EE11,EE12,EE13,EE14,EE15,EEON," +
                          "EEPROM,EETS4K,effectively,elapsed,enable," +
                          "enabled,enables,end,entire,EP0,EP1,EP2,EPDIS," +
                          "EPOPEN,EPROT,erase,erase/write,erased,Erases," +
                          "erasing,errant,error,ESTAT,evaluation,examined," +
                          "except,external,FACE,fact,fails,failure,fairly," +
                          "family,fewer,FFC,FFF,field,final,finished,first," +
                          "five,flag,Flash,followed,following,four," +
                          "Freescale,FTS256K,give,guaranteed,Guide,HC12," +
                          "HCS12,here,higher,highest,hold,i/o,ignored," +
                          "implemented,important,inadvertent,includes," +
                          "incorporated,increasing,Index,indicated," +
                          "inefficient,inexpensive,infrequent,infrequently," +
                          "INITEE,initially,INITRG,INITRM,instruction," +
                          "Integer,Internal,interrupt,interval,involves," +
                          "issued,Keeping,kHz,least,left,lifetime,limited," +
                          "loaded,loader,location,locations,logging,lower," +
                          "machine,make,manuals,map,Mapping,Mass,MC9S12C," +
                          "MC9S12C32,MC9S12DP256,MC9S12DP256B,means," +
                          "members,memories,Memory,MHz,microcontroller," +
                          "microcontrollers,microseconds,milliseconds," +
                          "minimal,minimum,minutes,mode,modes,Modify," +
                          "module,movb,moved,movw,much,necessary,need," +
                          "needs,Next,non-aligned,None,non-volatile,NOOP," +
                          "normally,number,NV4,NV5,NV6,occupies,occupying," +
                          "occur,odd,offset,often,operation,operations," +
                          "oriented,part,performed,permanently,place," +
                          "places,placing,point,popular,possibly," +
                          "potentially,power,PRDIV8,precedence,preserved," +
                          "primary,priority,problem,program,programmable," +
                          "programmed,programmer,Programming,Programs," +
                          "protect,protected,provides,purpose,PVIOL," +
                          "Questions,quickly,quite,RAM,RAM11,RAM12,RAM13," +
                          "RAM14,RAM15,RAMHAL,range,rate,reading,read-only," +
                          "REG11,REG12,REG13,REG14,region,Register," +
                          "registers,repeatedly,reprogrammed,require," +
                          "requirements,requires,reset,Resource,resources," +
                          "restore,retain,retention,Return,revisions,ROM," +
                          "routine,routines,run,saved,Scaled,scope,Search," +
                          "second,seconds,Section,sector,sectors,seems," +
                          "seen,separate,sequence,sets,setting,should," +
                          "significant,single,size,slower,slows,small," +
                          "solution,space,special,specifies,start,starting," +
                          "starts,state,status,step,still,store,stored," +
                          "stretch,strongly,study,successive,sufficient," +
                          "suggested,system,table,tables,takes,tend,Text," +
                          "thousands,three,Thus,time,times,timing," +
                          "troublesome,true,two,unless,upgrades,upper,use," +
                          "used,useful,Users,Using,valid,value,values," +
                          "Verify,wait,way,ways,wears,word,words,write," +
                          "writes,writing,written,years,zero,zeroes";
entry.item[96].page = "part020.html";
entry.item[96].description = "EEPROM Memory and Internal Resource Mapping";
entry.item[97].keywords = "$0000,$2000,$4000,$6000,$E000,access,accesses," +
                          "actions,ADDR,Address,addressable,addresses," +
                          "allowing,amount,apply,appropriately,assigned," +
                          "assigning,assuming,bank,banks,bits,block,boards," +
                          "bold,bus,Busses,byte,bytes,calculations,cannot," +
                          "case,certain,chart,Chip,clock,complete," +
                          "completed,concerned,configured,consecutive," +
                          "consider,contained,contains,contents,control," +
                          "correct,cycle,Data,decoder,determine,device," +
                          "devices,different,differing,direction,discuss," +
                          "discussed,Documentation,drive,driven,drives," +
                          "ECLK,edge,electrical,emphasized,equal," +
                          "evaluation,events,example,exist,Expanded," +
                          "Expansion,External,falling,fast,feature,FFF," +
                          "figure,first,following,found,Freescale,function," +
                          "generic,gets,give,goes,HC12,HC812A4,HCS12,here," +
                          "high,i/o,identical,important,including,Index," +
                          "indicate,indicates,input,instructions,interface," +
                          "Interfacing,introduce,involves,know,latch,later," +
                          "length,Let,lines,location,locations,look,lower," +
                          "MC9S12DP256B,means,Memory,Memory/Peripheral," +
                          "memory-mapped,microcontroller,Mode,moment," +
                          "multiple,Multiplexed,nanosecond,nanoseconds," +
                          "Narrow,Next,nominally,Normal,number,occupies," +
                          "occupy,offers,Operation,operations,organized," +
                          "page,pages,part,path,perform,perhaps,period," +
                          "peripherals,place,places,point,provides," +
                          "providing,Questions,read,reason,remove,request," +
                          "requested,Return,ROM,say,Search,Section," +
                          "sections,select,selected,Selects,sequence," +
                          "several,shared,should,showing,shows,signal," +
                          "signals,simpler,simplified,size,sizes,slow," +
                          "specific,specification,specify,split,start," +
                          "started,starting,store,stretched,stretching," +
                          "studying,synchronize,system,systems,table,take," +
                          "techniques,Text,three,tight,time,times,Timing," +
                          "transfer,transferred,two,understanding,upper," +
                          "used,uses,Using,value,way,Wide,width,write";
entry.item[97].page = "part021.html";
entry.item[97].description = "External Memory/Peripheral Interfacing";
entry.item[98].keywords = "$8000,$C000,accomplished,account,added,addition," +
                          "additional,ADDR0,ADDR13,ADDR14,ADDR15,Address," +
                          "addressed,allowed,analysis,applies,bank,BDM," +
                          "BGND,bit,bits,blocks,both,brought,bus,Busses," +
                          "byte,bytes,calculating,characteristics,checked," +
                          "Chip,clock,component,components,configure," +
                          "connect,connected,Connection,connections," +
                          "connects,consecutive,consisting,cycle,cycles," +
                          "Data,described,design,detail,device,devices," +
                          "diagram,drive,ECLK,EEPROM,emphasized,enable," +
                          "errors,executed,Expanded,Expansion,expensive," +
                          "explained,External,Failure,fetches,first,force," +
                          "general,get,gets,giving,glue,half,hand,HC12," +
                          "HCS12,here,I/O,increased,Index,input," +
                          "instruction,instructions,interface,Interfacing," +
                          "internal,inverted,kilobyte,less,lines,logic," +
                          "loss,lower,making,mapped,meaning,means," +
                          "mechanism,megabytes,Memory,Memory/Peripheral," +
                          "microcontroller,MODA,MODB,MODC,Mode,modes," +
                          "Multiplexed,Narrow,needs,Next,Normal,occasional," +
                          "operating,Operation,output,paging,part,partial," +
                          "paths,PE5,PE6,penalty,perform,performance," +
                          "peripherals,pins,port,ports,possible,power-up," +
                          "precedence,presented,processor,purpose," +
                          "Questions,RAM,reading,reads,refer,reference," +
                          "references,register,reliant,reset,result,Return," +
                          "ROM,sampled,schematic,Search,second,Section," +
                          "selected,Selects,sent,shows,signal,similarly," +
                          "simpler,single,Single-Chip,space,splitting," +
                          "starting,stretch,subsystem,Summary,system,take," +
                          "Technical,Text,three,time,Timing,transfers,two," +
                          "used,Using,valid,via,Wide,word,words,work,worse," +
                          "write,writes";
entry.item[98].page = "part021a.html";
entry.item[98].description = "External Memory/Peripheral Interfacing";
entry.item[99].keywords = "access,accesses,accomplish,additional,ADDR0," +
                          "Address,addresses,aligned,applies,attempt," +
                          "Attempts,avoided,bank,banks,behave,bit,bits," +
                          "both,bus,Busses,byte,Cannot,capability,capable," +
                          "Care,cause,certain,Chip,complicated,component," +
                          "configures,connected,connects,contains,control," +
                          "correctly,cycle,Data,describes,determine,device," +
                          "devices,discussion,divisible,erroneous,evenly," +
                          "Expanded,Expansion,explicitly,External," +
                          "following,forward,greatly,half,handling,HC12," +
                          "HCS12,high,important,increases,increasing,Index," +
                          "individual,interface,Interfacing,internal," +
                          "involved,last,least,line,lines,locations,low," +
                          "LSTRB,match,matter,Memory,Memory/Peripheral," +
                          "microcontroller,missing,Mode,Multiplexed,Narrow," +
                          "Next,non-aligned,Normal,noticeably,occur,odd," +
                          "Operation,order,pairs,part,paths,perform," +
                          "performance,performed,Peripheral,peripherals," +
                          "placing,port,ports,possible,processor,Questions," +
                          "RAM,ranges,read,Reads,registers,requires,Return," +
                          "ROM,rows,run,safely,Search,Section,Selects," +
                          "separate,should,shown,signals,significant," +
                          "simply,simultaneously,solution,split,store," +
                          "straight,supported,table,taken,Text,time,Timing," +
                          "transfers,two,type,unlikely,used,uses,Using,via," +
                          "Wide,word,words,write,writes,written";
entry.item[99].page = "part021b.html";
entry.item[99].description = "External Memory/Peripheral Interfacing";
entry.item[100].keywords = "$8000,account,addition,Address,addressing," +
                           "amount,appear,application,arrangement,asserted," +
                           "BFFF,bits,bus,Busses,byte,Chip,clock,connect," +
                           "connected,connections,connects,considerations," +
                           "control,Data,described,design,designs,desired," +
                           "details,device,diagram,difficult,drive,ECLK," +
                           "ECS,edge,employed,enable,Expanded,Expansion," +
                           "extended,External,externally,Flash,following," +
                           "giving,HCS12,held,hold,illustration,Index," +
                           "Input,intended,interface,Interfacing,internal," +
                           "large,latch,latched,leading,lines,Looking,low," +
                           "LSTRB,MC9S12DP256,Memory,Memory/Peripheral," +
                           "microcontroller,microcontrollers,Mode," +
                           "multiplex,Multiplexed,Narrow,necessary,new," +
                           "Next,Normal,number,on-chip,Operation," +
                           "operations,order,output,page,part,partial,pins," +
                           "port,presented,primarily,provides,Questions," +
                           "RAM,range,read,reduce,Return,ROM,schematic," +
                           "scheme,Search,Section,Select,selected,Selects," +
                           "shared,shown,shows,signal,signals,significant," +
                           "simply,single,space,Specifications,speed,still," +
                           "stretch,taken,Technical,Text,Timing," +
                           "transparent,true,two,use,used,uses,Using,Wide," +
                           "XCS";
entry.item[100].page = "part021c.html";
entry.item[100].description = "External Memory/Peripheral Interfacing";
entry.item[101].keywords = "$0000,$0013,$003C,$003D,$003E,$003F,$1000,$1FF," +
                           "$200,$2000,$280,$2FF,$300,$380,$3FF,$40,$400," +
                           "$800,$8000,$C0,$C00,$FFF,access,Accessed," +
                           "accesses,additional,Address,addresses," +
                           "addressing,Aligned,allows,apply,arrangement," +
                           "asserted,associated,assume,AT27LV256A-5,Atmel," +
                           "Bank,banks,based,bclr,BFF,Bit,bits,block," +
                           "blocks,bset,bus,Busses,byte,Calculation," +
                           "calculations,called,cannot,case,cause,Chip," +
                           "Clock,Clocks,code,concern,configure,connect," +
                           "connected,consider,control,CPU12,CS0,CS0E,CS1," +
                           "CS1E,CS2,CS2E,CS3,CS3E,CS3EP,CSCTL0,CSCTL1,CSD," +
                           "CSDE,CSDHF,CSP0,CSP0E,CSP1,CSP1E,CSP1FL,CSPA21," +
                           "CSSTR0,CSSTR1,cycle,cycles,Data,DATA0,DATA15," +
                           "DATA7,DATA8,decoding,default,designed," +
                           "determine,device,devices,diagram,dividing,don," +
                           "drive,earlier,easily,ECLK,E-clock,E-clocks," +
                           "edge,EEPROM,enable,enabled,end,EWDIR,Example," +
                           "examples,exceptions,executing,exercise," +
                           "Expanded,Expansion,EXSTR,extended,External," +
                           "fall,falling,faster,features,FFF,FFFF," +
                           "following,follows,forces,forcing,Four," +
                           "generates,gets,give,given,glue,greater,handled," +
                           "HC12,HC812A4,here,higher,hold,increased,Index," +
                           "initialization,input,inputs,instruction," +
                           "intended,Interfacing,internal,interrupt,issue," +
                           "item,key,know,latch,latched,left,less,Let," +
                           "limited,location,logic,long,low,LS374,make," +
                           "manual,map,Mapping,maximum,MC9S12DP256," +
                           "measurements,Memory,Memory/Peripheral,met," +
                           "microcontroller,MISC,Miscellaneous,Mode," +
                           "Multiplexed,Narrow,NDRC,necessary,need,needed," +
                           "new,Next,Normal,Normally,Note,Now,number," +
                           "numbered,occupied,operating,Operation,order," +
                           "output,outputs,outside,overlapping,part," +
                           "partial,paths,perform,performance,performed," +
                           "period,peripheral,Peripherals,pin,plenty,Port," +
                           "preceding,present,primarily,priority,processor," +
                           "program,Propagation,properly,provided," +
                           "providing,Questions,RAM,range,ranges,read," +
                           "reading,reduce,register,registers,required," +
                           "requirements,reset,Return,ROM,running," +
                           "schematic,Search,Section,select,selected," +
                           "Selects,separate,sequence,setting,setup,set-up," +
                           "shown,signaling,single,small,space,SRP0A,SRP0B," +
                           "SRP1A,SRP1B,start,still,STR0A,STR0B,STR1A," +
                           "STR1B,STR2A,STR2B,STR3A,STR3B,STRDA,STRDB," +
                           "Stretch,strobe,student,SxxxA,SxxxB,system," +
                           "table,Text,thus,time,Timing,Two,Unaligned,use," +
                           "used,Using,valid,value,values,wakeup,Wide,wish," +
                           "word,work,write,XCS";
entry.item[101].page = "part021d.html";
entry.item[101].description = "External Memory/Peripheral Interfacing";
entry.item[102].keywords = "$00,$0000,$0034,$0035,$0036,$0037,$0038,$00FF," +
                           "$03FF,$0400,$07FF,$100,$2000,$2F,$30,$3E,$3F," +
                           "$3F0000,$3F6FFF,$3F8000,$3FBFFF,$3FFFFE," +
                           "$3FFFFF,$4000,$6FFF,$7000,$7FFF,$8000,$8100," +
                           "$A000,$BFFF,$C000,$C0000,$F0,$F6,$FE,$FF,$FFFE," +
                           "$FFFF,$FFFFF,A16E,A17E,A18E,A19E,A20,A20E,A21," +
                           "A21E,access,accessed,accessible,Accessing," +
                           "added,additional,Address,addressed,addresses," +
                           "addressing,advantage,allow,allowing,allows," +
                           "and/or,appear,appears,aren,argument,assemblers," +
                           "asserted,assisting,Assuming,attach,automatic," +
                           "automatically,bank,bit,bits,block,blocks," +
                           "built-in,bus,Busses,byte,bytes,call,called," +
                           "calls,case,cause,change,changing,Chip,combined," +
                           "combining,Communication,compilers,complicated," +
                           "configure,connecting,contents,convenient," +
                           "corresponds,CS3,CS3EP,CSCTL1,CSD,CSHDF,CSP0," +
                           "Data,debuggers,default,definition,desired," +
                           "detail,details,determine,devices,difficult," +
                           "direct,disable,disabled,disadvantage,discuss," +
                           "discussed,divided,documentation,DPAGE,DWEN," +
                           "EEPROM,effect,EMK,enable,enabled,entire," +
                           "environment,EPAGE,EWDIR,EWEN,EWIN,Example," +
                           "exclusively,existing,Expanded,Expansion," +
                           "expense,External,Extra,fact,fails,fixed,Flash," +
                           "followed,following,Follows,foo,forced," +
                           "Freescale,generated,handle,handled,Handling," +
                           "HC12,HC812A4,HCS12,high,hold,includes,Index," +
                           "indicate,instead,instruction,instructions," +
                           "Interface,Interfacing,internal,internally," +
                           "interrupt,jmp,jsr,jump,jumping,jumps,languages," +
                           "last,latter,lbra,level,lines,linkers,loaders," +
                           "located,locations,logic,longer,low,lower," +
                           "manipulate,mapped,mapping,maps,matching," +
                           "MC9S12DP256,megabyte,megabytes,Memory," +
                           "Memory/Peripheral,microcontroller,MISC,Mode," +
                           "modern,modes,module,moved,Multiplexed,MXAR," +
                           "Narrow,need,needs,new,Next,Normal,Normally," +
                           "Note,Now,number,numbered,occupies,offset," +
                           "Operation,order,ORG,original,outside," +
                           "overridden,Page,paged,pages,paging,part,PDA12," +
                           "PDA13,PDA14,PDA15,PDA16,PDA17,PDA18,PDA19," +
                           "PEA10,PEA11,PEA12,PEA13,PEA14,PEA15,PEA16," +
                           "PEA17,peripherals,physical,pin,pins,PIX0,PIX1," +
                           "PIX2,PIX3,PIX4,PIX5,placed,port,PortA/B," +
                           "possible,power-up,PPA14,PPA15,PPA16,PPA17," +
                           "PPA18,PPA19,PPA20,PPA21,PPAGE,presented," +
                           "problems,processing,Program,Programming," +
                           "programs,pull-up,pushed,PWEN,Questions,RAM," +
                           "range,rather,reference,references,regardless," +
                           "register,registers,reset,reside,resistors," +
                           "restores,return,returns,ROM,ROMHM,ROMON," +
                           "routines,rtc,running,sampled,Search,second," +
                           "Section,seen,select,selected,Selects,Serial," +
                           "setting,should,shown,single,space,specifies," +
                           "stack,state,still,storing,subroutine," +
                           "Subroutines,succeeds,summary,system,technique," +
                           "Text,third,three,Thus,Timing,two,Unlike,upper," +
                           "use,used,Using,value,values,vector,via," +
                           "virtually,voltage,way,Wide,WINDEF,window," +
                           "windows,writing";
entry.item[102].page = "part021e.html";
entry.item[102].description = "External Memory/Peripheral Interfacing";
entry.item[103].keywords = "Acknowledgment,acting,actuated,added,addition," +
                           "adjustable,allow,allows,and/or,apparently," +
                           "application,applications,applies,apply," +
                           "arriving,ASCII,aspect,aspects,asserted," +
                           "assuming,asynchronous,bad,bar,bars,based," +
                           "battery,behaves,binary,bit,bits,bold,both," +
                           "Break,breaking,broken,Buffering,built-in," +
                           "called,Carrier,carries,carry,case,cause," +
                           "causing,character,characters,chart,Circuit," +
                           "circuits,Clear,click,clock,closed,code,coding," +
                           "combinations,comments,Communication," +
                           "Communications,compared,compatible,complement," +
                           "computer,computers,Configuring,conform,connect," +
                           "connected,connecting,connection,connections," +
                           "connector,connectors,connects,consisted," +
                           "consisting,consists,contents,control,convert," +
                           "converters,cope,CTS,dashes,data,DCE,DCEs," +
                           "decoded,default,defines,depressions,described," +
                           "design,designed,desired,detect,detecting," +
                           "detection,determined,developed,device,devices," +
                           "difficulty,discussed,distances,dots,drive," +
                           "Driven,driver,driver/receiver,drivers,drives," +
                           "D-shell,DSR,DTE,DTEs,DTR,Dual,early/mid,earth," +
                           "EIA-232,EIA-232-F,electrical," +
                           "electro-mechanical,electronic,eliminate," +
                           "embellishment,emphasized,encoded,encoding,end," +
                           "energized,entering,equal,equipment,error," +
                           "errors,established,EVB,events,example,false," +
                           "female,fewer,final,finicky,first,five,fixed," +
                           "following,formed,four,fourth,frame,frames," +
                           "frequently,full,Function,functional," +
                           "functionality,gaps,get,given,ground," +
                           "handshaking,Hardware,having,HC12,HC12EVB,HCS12," +
                           "held,here,high,Highlights,History,hysteresis," +
                           "idle,implement,implementation,important," +
                           "improvement,including,incoming,Index," +
                           "indicating,indicator,input,inputs,Integrated," +
                           "intended,Inter,Interface,Interfacing,interpret," +
                           "interpreted,interrupt,interrupts,invalid," +
                           "invert,key,keyboard,know,knows,last,later," +
                           "least,length,level,levels,limitation,line," +
                           "literate,load,logic,long,longer,look,low,made," +
                           "male,mark,marking,marks,master,MAX232,MAX562," +
                           "maximum,mechanical,mechanism,message,messages," +
                           "modem,modems,modern,Morse,multipoint," +
                           "multi-point,Name,necessary,need,needed,new," +
                           "newer,Next,nine,nominal,normally,Note,null," +
                           "number,occurs,odd,often,ohms,old,open,opens," +
                           "operate,operated,Operation,operational," +
                           "operator,Operators,order,organization,output," +
                           "Overview,page,pages,paper,parity,part,path,per," +
                           "performing,Peripheral,person,pin,place," +
                           "point-to-point,Polled,port,ports,presents," +
                           "pressed,Pressing,printed,printer,printers," +
                           "problem,procedural,produces,properly,protocol," +
                           "protocols,provided,provides,puts,Quadruple," +
                           "Questions,rarely,rate,rather,receive,Received," +
                           "receiver,receivers,receives,receiving,reduced," +
                           "referred,release,remove,removing,replaced," +
                           "represented,representing,represents,Request," +
                           "requesting,require,requirement,requires," +
                           "resistor,respectively,restricted,return," +
                           "revised,revision,Ring,Ringing,roll,RS232," +
                           "RS232-C,RS232-D,RTS,runs,satisfy,Search,second," +
                           "Section,sections,Send,sends,sent,separate," +
                           "separated,sequence,sequences,Serial,serially," +
                           "series,settling,several,short,shorting,showing," +
                           "shown,signal,signaled,signals,significant," +
                           "simple,simplest,single,solenoid,solenoids," +
                           "space,spaces,specification,specifies,split," +
                           "spring,Standard,standards,start,started,starts," +
                           "state,station,stations,still,stop,style,sum," +
                           "supplies,supply,switch,system,systems,table," +
                           "telegraph,telephone,Teletype,Teletypes," +
                           "terminal,terminals,Text,three,Thus,time," +
                           "transferred,transmission,transmissions," +
                           "transmit,transmitted,transmitter,transmitters," +
                           "true,TTL,turned,Two,typewriter-like,use,used," +
                           "uses,using,value,versions,via,vintage,volt," +
                           "voltage,volts,wire,wired,wiring,wishes,work," +
                           "write,years";
entry.item[103].page = "part022.html";
entry.item[103].description = "Serial Communications Interface and Buffering";
entry.item[104].keywords = "#156,additional,address,addressed,allow," +
                           "allowing,allows,appears,arrangement,arrives," +
                           "arriving,automatically,BDH,BDL,bidirectional," +
                           "bit,bits,both,bps,break,BRK13,broadcast," +
                           "Buffering,burst,calculation,called,case,causes," +
                           "chance,checked,checksums,clear,cleared,clears," +
                           "communicate,Communication,Communications," +
                           "complete,concerned,condition,conditions," +
                           "Configuration,configurations,configured," +
                           "Configuring,connect,connected,connection," +
                           "control,conversely,corresponding,CR0,CR1,CR2," +
                           "Data,DDRS,default,described,detection," +
                           "determines,direction,disabled,disables,don," +
                           "drain,DRH,driving,DRL,duplex,eight,enable," +
                           "enabled,enables,end,environments,error,example," +
                           "extended,external,facility,finished,flag," +
                           "following,four,frame,frames,framing,generated," +
                           "good,half,happening,HC12,HC12s,HCS12,Here,idea," +
                           "identical,IDLE,ignore,ignored,ILIE,ILT," +
                           "including,incoming,independently,Index," +
                           "indicate,indicates,inhibiting,initially,input," +
                           "instruction,Interface,Interfaces,interrupt," +
                           "interrupts,isn,left,line,listen,listens,long," +
                           "looking,LOOP,LOOPS,mark,master,Master/Slave," +
                           "matter,MCLK,mechanisms,message,messages,Mhz," +
                           "microcontroller,microcontrollers,mode,modes," +
                           "monitoring,movw,multiple,need,needs,Next,nine," +
                           "ninth,Normal,normally,Note,obtain,occur,odd," +
                           "open,Operation,order,Overview,parity,pin,pins," +
                           "Polled,port,ports,possible,potential,primarily," +
                           "probably,problem,provided,provides,providing," +
                           "PS0,PS1,PS2,PS3,PTIS,PTS,pull-up,Questions," +
                           "R0T0,R1T1,R2T2,R3T3,R4T4,R5T5,R6T6,R7T7,RAF," +
                           "rate,rates,rather,RDRF,reasonable,Receipt," +
                           "Receive,received,receiver,receivers,receiving," +
                           "reception,reduce,regardless,register,registers," +
                           "relies,requires,Reserved,resistor,Return,RIE," +
                           "RS232,RSRC,RWU,SBK,SBR,SBR0,SBR1,SBR10,SBR11," +
                           "SBR12,SBR2,SBR3,SBR4,SBR5,SBR6,SBR7,SBR8,SBR9," +
                           "SC0,SC0BDH,SC0BDL,SC0CR1,SC0CR2,SC0DRH,SC0DRL," +
                           "SC0SR1,SC0SR2,scheme,SCI,SCI0,SCI1,SCISWAI," +
                           "Search,second,Section,selected,selecting,send," +
                           "sending,sends,Serial,setting,should,signal," +
                           "significant,single,single-wire,slave,slaves," +
                           "spaces,SR1,SR2,starts,state,stated,status,stop," +
                           "table,TCIE,TDRE,technique,techniques,testing," +
                           "Text,three,TIE,time,times,transmission," +
                           "Transmit,transmits,transmitted,transmitter," +
                           "transmitters,transmitting,triggered,two,TXDIR," +
                           "types,unless,use,used,uses,using,value,vector," +
                           "via,wait,WAKE,wake-up,wire,wired-or,WOMS,zero";
entry.item[104].page = "part022a.html";
entry.item[104].description = "Serial Communications Interface and Buffering";
entry.item[105].keywords = "accepted,accomplished,accumulator,additional," +
                           "addresses,alternative,approaches,array,arrives," +
                           "avoid,baud,beq,bit,bitb,bits,bne,Both,bps," +
                           "branch,brclr,break,brset,buffer,buffered," +
                           "Buffering,busy,byte,called,cases,cause," +
                           "character,check,checking,clear,clears,clock," +
                           "code,Communications,complete,condition," +
                           "configuration,Configuring,connect,considered," +
                           "consists,contents,control,CR2,data,deemed," +
                           "described,Design,detected,determine,disabled," +
                           "discussed,DRH,DRH/DRL,driven,drives,DRL,easier," +
                           "efficient,eight,enable,enabled,enters,error," +
                           "errors,examine,except,execute,facility,fails," +
                           "fifth,figure,finished,first,flags,followed," +
                           "following,four,Frame,frames,framing," +
                           "frequencies,frequently,full,generator,handle," +
                           "handles,happens,held,Here,I/O,idle,ILIE," +
                           "important,independently,Index,indicates," +
                           "indicating,individual,input,instruction," +
                           "instructions,Interface,interrupt," +
                           "interrupt-driven,interrupts,ldaa,ldab,least," +
                           "level,load,loaded,loads,location,long,looking," +
                           "loop,losing,lost,low,majority,match,means," +
                           "microcontroller,millisecond,much,necessary," +
                           "need,new,Next,ninth,noise,normal,Note,noticed," +
                           "occurs,operate,Operation,output,overrun," +
                           "Overview,Ovr,parallel,parity,period,pin,point," +
                           "poll,Polled,ports,prevent,process,program," +
                           "Questions,R0T0,R1T1,R2T2,R3T3,R4T4,R5T5,R6T6," +
                           "R7T7,RAF,rate,RDR,RDRF,read,reading,reads," +
                           "reason,receipt,receive,received,Receiver," +
                           "Register,registers,reliable,remaining,repeats," +
                           "requested,requests,requirement,reset," +
                           "respectively,Return,RIE,roughly,routine,sample," +
                           "sampled,SBK,SC0DRL,SC0SR1,SCI,SCI0,Search," +
                           "second,Section,sending,sends,sent,sequence," +
                           "Serial,serially,sets,seventh,Several,shift," +
                           "shifted,shifting,shifts,should,shown,single," +
                           "space,SR1,SR2,staa,start,started,starts,state," +
                           "status,still,stop,stops,store,storing,system," +
                           "take,takes,TCIE,TDR,TDRE,tenth,Text,thing," +
                           "third,thousand,three,TIE,time,times,transfer," +
                           "transferred,transfers,transmission,transmit," +
                           "transmits,transmitted,Transmitter,try,two," +
                           "unanimous,under,use,used,uses,value,values," +
                           "Wait,waits,wake-up,wants,writes,writing,wrong," +
                           "zero";
entry.item[105].page = "part022b.html";
entry.item[105].description = "Serial Communications Interface and Buffering";
entry.item[106].keywords = "#10,#13,#156,#buffer,#BUFSIZE,#BUFSIZE-1," +
                           "#define,#include,#linebuf,#RAMEND,#RIE,#serint," +
                           "#TIEb,$04,$08,$20,$80,accept,accumulator," +
                           "action,add,addd,adding,Additionally,address," +
                           "addresses,adjust,allow,allowing,analogous," +
                           "analyze,anda,application,applications," +
                           "arbitrary,area,arithmetic,array,arrive,ASCII," +
                           "asm,asm_,assume,attribute_,avoid,back,backs," +
                           "backspace,basic,Basics,bclr,beep,BEL,bell,beq," +
                           "bigger,bit,bita,bits,block,blocked,blocks,bne," +
                           "boards,Both,bpl,BPS,bra,branch,branches,brclr," +
                           "break,bset,buffer,Buffered,Buffering,buffers," +
                           "bufin,bufout,BUFSIZE,BUFSIZE-1,BUFSIZE-2,bug," +
                           "bulk,byte,bytes,calculate,called,calls,cannot," +
                           "capacity,careful,carriage,case,cause,causes," +
                           "certain,change,char,character,characters," +
                           "charin,chars,check,checking,circular,clear," +
                           "clears,cli,clock,clr,clrb,cmpa,code,codes," +
                           "command,Communications,compiler,complete," +
                           "complicated,concern,condition,Configuring," +
                           "connected,consist,consumed,consumer,consumers," +
                           "contents,control,correct,cpd,cpx,CRLF,cursor," +
                           "data,D-Bug12,deadlock,decide,declarations," +
                           "declared,decrementing,defining,delay,deletes," +
                           "delimit,demonstrates,demonstration,depressed," +
                           "design,desirable,determine,device,devices,dex," +
                           "disable,disabled,display,displayed,displaying," +
                           "don,echo,echoing,edit,editing,else,empties," +
                           "Enable,enabled,end,endless,enter,entered," +
                           "entering,entire,EQU,equal,erase,error," +
                           "evaluation,example,examples,exceeded,exit," +
                           "expecting,faster,feed,figures,filling,fills," +
                           "Finally,finish,Finished,first,flag,flags," +
                           "follow,following,free,frequently,full,function," +
                           "get,Getchar,getchara,getchara1,getcharNB," +
                           "getcharNB1,gets,give,gives,goes,going,handle," +
                           "handled,handling,happens,having,HC12,here," +
                           "higher,hit,hold,human,I/O,idle,implemented," +
                           "implements,important,impression,inc,include," +
                           "increment,incremented,Index,indicate,indicates," +
                           "indicating,initial,initialization,initialize," +
                           "initializing,initially,Input,input/output," +
                           "inputting,inside,instance,instead,instruction," +
                           "instructions,int,interesting,Interface," +
                           "interfacing,interrupt,interrupts,invalid," +
                           "invoked,item,jsr,key,keyboard,keys,keystrokes," +
                           "keyword,keywords,know,last,later,ldaa,ldab,ldd," +
                           "lds,ldx,least,left,Let,Likewise,Line,linebuf," +
                           "linep,LINESIZE,location,lock,long,longer,look," +
                           "loop,loose,lose,made,main,major,make,makes," +
                           "manipulating,mark,match,means,memory,message," +
                           "MHz,microcontroller,modification,modified,movb," +
                           "movw,named,names,necessary,need,needed," +
                           "negative,never,new,Next,non-blocking,none,nop," +
                           "normal,Note,nothing,now,NUL,occur,operating," +
                           "Operation,optimize,oraa,org,original,Output," +
                           "outside,overflowing,overflows,Overview," +
                           "part022c,past,Peripheral,placed,point,pointer," +
                           "pointers,Polled,port,position,possible," +
                           "priority,problem,problems,process,processed," +
                           "processes,processing,producer,program,provided," +
                           "provider,providers,provides,PRSTART,psha,pshx," +
                           "pula,pulx,pushing,put,putch2,putch3,putch4," +
                           "putch5,putchar,putchara,puts,quantity," +
                           "Questions,RAMSTART,rate,rather,RDR,RDRF,reach," +
                           "read,readable,reason,receiver,re-enables," +
                           "reenabling,reentered,re-entered,re-entrancy," +
                           "re-entrant,register,registers,re-implemented," +
                           "Remember,remove,removed,removes,Removing," +
                           "repeatedly,replaced,represent,request,requires," +
                           "reset,restore,result,retrieve,return,returns," +
                           "RIE,ring,room,routine,routines,rti,rts,run," +
                           "safe,save,saved,SC1BDL,SC1CR2,SC1DRL,SC1SR1," +
                           "SCI,SCI0,SCI1,Search,second,Section,send," +
                           "sending,sends,sequence,Serial,serint,serint1," +
                           "serint2,serint3,serint4,serint5,serint6," +
                           "serint7,serintbeep,serintend,serintline,serl1," +
                           "serl3,service,serviced,settings,show,simulator," +
                           "single,situation,slow,small,solution,solves," +
                           "sounded,source,space,speed,staa,stab,stack," +
                           "start,starts,state,status,still,stop,storage," +
                           "store,string,strings,stx,subd,subroutine," +
                           "supply,symbolic,system,take,taken,takes,tasks," +
                           "tba,TDR,TDRE,technique,tend,terminal,Test," +
                           "testing,Text,tfr,things,third,TIE,TIEb,time," +
                           "times,transmit,transmits,transmitted," +
                           "transmitter,transmitting,tricky,try,two,typed," +
                           "unchanged,unsigned,use,used,UserSCI1,using,val," +
                           "value,variable,variables,vector,version,via," +
                           "virtually,void,volatile,volatile_,wai,wait," +
                           "waiting,waits,wants,way,won,worry,wrap,wraps," +
                           "write,writes,writing,x20,x80,xmitter,zero";
entry.item[106].page = "part022c.html";
entry.item[106].description = "Serial Communications Interface and Buffering";
entry.item[107].keywords = "appear,area,browser,Click,code,controls,cursor," +
                           "disabled,display,emulator,example,exited,file," +
                           "generating,loading,log,make,page,run,SCI1," +
                           "separate,Simulator,snapshot,stop,taking," +
                           "terminal,type,used,window";
entry.item[107].page = "part022cx.html";
entry.item[107].description = "Buffered Serial Port";
entry.item[108].keywords = "accumulator,achieve,add,advance,allow," +
                           "alternating,application,applications,asserted," +
                           "asynchronous,basic,baud,bclr,Bidirectional," +
                           "BIDIROE,bit,bits,bit-serial,Block,both,brclr," +
                           "bset,buffer,buffering,Bus,byte,bytes," +
                           "calculated,cannot,capture,captured,captures," +
                           "case,cause,causes,causing,chained,changes," +
                           "charts,checked,circuit,clear,cleared,clears," +
                           "CLK,clock,clocked,clocking,clocks,closing,code," +
                           "command,commence,Communication,complete," +
                           "completion,configurable,configuration," +
                           "configure,configured,connect,connected," +
                           "connecting,connections,connects,consecutively," +
                           "consider,consisting,consists,contains,control," +
                           "controlled,controlling,controls,converts,CPHA," +
                           "CPOL,critical,data,DDRS,decision,defaults," +
                           "definitions,delays,described,design,designated," +
                           "Designing,determines,device,devices,diagrams," +
                           "different,direction,directions,discussed," +
                           "discussion,distributed,divide,divided,divisor," +
                           "drive,driven,driving,easily,edge,edges," +
                           "effective,eight,enable,enabled,enables,end," +
                           "Example,except,exchange,executes,executing," +
                           "expanded,explicitly,Extending,extension," +
                           "external,falling,fashion,feature,figure," +
                           "figures,first,flag,flags,flip-flop,following," +
                           "Freescale,frequency,full,general,generate,get," +
                           "give,going,group,Guide,half,hardware,having," +
                           "HC595,HC595s,HC597,HCS12,held,Here,high," +
                           "highest,hold,I/O,identically,ignored," +
                           "immaterial,inc,increased,increment,incremented," +
                           "Index,initial,initialize,initialized,input," +
                           "instead,instruction,insures,Integrated,Inter," +
                           "Interface,Interfaces,interfacing,interrupt," +
                           "Interrupts,invalid,invoked,know,last,latch," +
                           "latched,latches,ldaa,ldab,leading,least,left," +
                           "Let,limit,line,lines,load,loaded,loads,loop," +
                           "low,lower,lowering,LSBFE,master,MC9S12DP256," +
                           "means,MHz,microcontroller,Microcontrollers," +
                           "minimum,MISO,mode,MODF,MODFEN,Modulator," +
                           "modules,MOSI,movb,MSTR,much,Multiple,need," +
                           "needed,negative,Next,nominal,Note,number," +
                           "operate,operation,opposite,output,outputs," +
                           "outside,parallel,part,partial,perform,period," +
                           "Peripheral,pin,pins,polled,polling,polls,Port," +
                           "position,positive,potential,problem,problems," +
                           "program,propagation,providing,PTS,Pulse,pulses," +
                           "purpose,Questions,rate,rather,RCK,read,reading," +
                           "receive,received,receiver,receiving,register," +
                           "registers,reliable,remote,representing,request," +
                           "requires,respond,response,Return,returning," +
                           "rising,roughly,routine,rti,run,samples," +
                           "sampling,schematic,schemes,SCK,Search,Section," +
                           "segment,select,selected,send,sending,sends," +
                           "sent,sequence,Serial,service,sets,setup,share," +
                           "shift,shifted,shifting,shifts,short,should," +
                           "shown,signal,signals,significant,simpler," +
                           "simulated,simulator,single,slave,solution," +
                           "solve,source,SPC0,SPE,SPI,SPI0,SPI0BR,SPI0CR1," +
                           "SPI0CR2,SPI0DR,SPI0SR,SPI1,SPI2,SPIE,SPIF," +
                           "spiisr,SPIs,SPISWAI,SPPR,SPPR0,SPPR1,SPPR2,SPR," +
                           "SPR0,SPR1,SPR2,SPTEF,SPTIE,SSOE,staa,stab," +
                           "start,starts,state,stated,status,stops,store," +
                           "stored,straightforward,sufficiently," +
                           "Synchronous,system,table,taken,Text,Three,time," +
                           "timing,trailing,transfer,transferred,transfers," +
                           "transmit,transmitter,transmitting,truth,tst," +
                           "Two,under,unusual,updating,upper,use,used," +
                           "useful,Users,uses,Using,val,value,values," +
                           "variable,WAI,wait,whether,Width,Wire,wires," +
                           "wish,write,writes,writing,zero";
entry.item[108].page = "part023.html";
entry.item[108].description = "Serial Peripheral Interface";
entry.item[109].keywords = "$20,aborts,accumulator,ACK,acknowledge," +
                           "acknowledgement,acknowledges,acknowledging," +
                           "acquire,acquiring,active-high,addition," +
                           "additional,address,addressed,addresses,ADR1," +
                           "ADR2,ADR3,ADR4,ADR5,ADR6,ADR7,allowed,allows," +
                           "applications,arbitration,asm,assert,assumes," +
                           "assured,attention,back,back-to-back,base-line," +
                           "Basics,bclr,behaves,best,bit,bits,bits/second," +
                           "Block,both,bra,branch,branching,brclr,brings," +
                           "brset,bset,Bus,buses,busy,byte,bytes,Call," +
                           "called,calling,calls,cannot,case,cases,change," +
                           "changing,chart,check,checks,Circuit,clear," +
                           "cleared,clever,clock,coming,command,completed," +
                           "completes,concerned,configured,connected," +
                           "connection,consisting,contains,contention," +
                           "control,convenient,correct,cost,covered,cycles," +
                           "data,denoted,derived,described,Description," +
                           "details,detected,detection,developed,device," +
                           "devices,differ,direction,Disable,disabling," +
                           "divider,documentation,doesn,down,drive,driven," +
                           "drives,driving,dummy,edge,effective,eight," +
                           "eight-bit,Electrical,emit,enable,enables,end," +
                           "ends,example,examples,executing,exist,extend," +
                           "extended,External,failure,figure,figures,file," +
                           "final,Finally,first,flag,followed,following," +
                           "forces,format,free,frequency,full,general," +
                           "Generate,given,goes,going,good,Guide,halt," +
                           "handle,handled,HCS12,held,help,here,high,I/O," +
                           "IAAS,IASS,IBAD,IBAL,IBB,IBC0,IBC1,IBC2,IBC3," +
                           "IBC4,IBC5,IBC6,IBC7,IBCR,IBDR,IBEN,IBFD,IBIE," +
                           "IBIF,IBSR,IBSWAI,idea,idle,ignored,IIC,IICINIT," +
                           "IICRECEIVE,IICRECEIVELAST,IICRECEIVEM1," +
                           "IICRECEIVEONE,IICRESPONSE,IICRESTART,IICSTART," +
                           "IICSTOP,IICSWRCV,IICTRANSMIT,Implementation," +
                           "important,Index,indicated,indicates,indicating," +
                           "information,initial,initialize,initiate," +
                           "instead,instructing,instruction," +
                           "interconnection,Interface,Interfaces," +
                           "interfacing,Inter-Integrated,internal," +
                           "interprets,interrupt,Interrupts,intervene," +
                           "intervening,involves,Issue,kHz,know,known," +
                           "label,last,later,ldaa,letting,level,library," +
                           "line,lines,long,look,lost,low,maintained," +
                           "manner,master,master/slave,masters,maximum," +
                           "meaning,means,mentioned,MHz,microcontrollers," +
                           "mode,modifications,module,monitor,monitors," +
                           "movb,multibyte,multi-master,nack,NAK,necessary," +
                           "need,needs,negative,never,new,Next,nine,ninth," +
                           "non-zero,normally,number,obtain,obtained," +
                           "occurs,Operation,option,original,overhead," +
                           "passed,perform,performing,performs,period," +
                           "Philips,point,popular,possible,preceding," +
                           "prevents,proceed,properly,provided,pulling," +
                           "pull-up,pull-ups,pulse,pulses,put,Questions," +
                           "rate,read,read/not,Reading,reads,receipt," +
                           "receive,received,receiver,receiving,REENABLE," +
                           "register,registers,reissues,Release,released," +
                           "releases,releasing,relinquish,relinquishes," +
                           "request,requested,requests,requires,reset," +
                           "resistor,resistors,respond,responds,restart," +
                           "return,returned,returning,rising,routine,RSTA," +
                           "rts,run,RXAK,saves,scheme,SCL,SDA,Search," +
                           "Section,seen,select,self-resetting,send," +
                           "sending,sends,sent,separate,sequence,sequences," +
                           "Serial,sets,seven,several,shorthand,should," +
                           "shown,shows,signal,signals,simple," +
                           "simultaneously,single,slave,slowed,slower," +
                           "specification,specifies,SRW,staa,start,starts," +
                           "state,status,stop,storing,subroutine," +
                           "subroutines,successive,switch,system,systems," +
                           "table,target,TCF,technique,tells,Text,think," +
                           "three,Thus,time,times,too,trademark," +
                           "transaction,transfer,transferring,transfers," +
                           "transmission,transmit,transmits,transmitted," +
                           "transmitting,tries,two,TXAK,use,used,uses," +
                           "using,valid,value,values,voltage,WAI,wait," +
                           "wants,winning,wired-or,wires,write,writes," +
                           "Writing,XMIT,yield";
entry.item[109].page = "part023a.html";
entry.item[109].description = "Inter-Integrated Circuit Bus Interface";
entry.item[110].keywords = "#24,#480,#60,#define,$44,$BE,$CC,$FF00,$FFFF," +
                           "accepting,accumulator,accurate,ACK,action," +
                           "actions,addd,adding,addition,additional," +
                           "address,addressing,allow,allowed,allowing," +
                           "allows,American,amount,AN1731,analyzer,anoter," +
                           "appendix,application,applications,approach," +
                           "arbitration,Area,arranged,Array,asm_,assert," +
                           "asserted,asserts,automobile,automobiles," +
                           "Automotive,back,Background,basis,bclr,BDLC,BDM," +
                           "BDSC,bit,bita,bits,BKGD,Block,bne,board,Bosch," +
                           "both,bpl,bra,branch,broadcast,bset,buffers," +
                           "built,bus,Byte,bytes,calculate,calculated," +
                           "calculates,calculating,called,capable,case," +
                           "cause,causes,causing,CCR,Celsius,changes,char," +
                           "characteristics,charge,check,checking,checks," +
                           "checksums,Chip,cli,clock,close,closer,code," +
                           "codes,Collision,collisions,command,commands," +
                           "communication,compare,comparing,comparison," +
                           "compatible,complement,complementary,complex," +
                           "complicated,concentrate,configuration," +
                           "connected,consider,considerably,consist," +
                           "consisting,consists,consume,consuming,contain," +
                           "contention,contents,control,Controller," +
                           "convenience,core,correctly,corresponding," +
                           "counts,covered,cpd,CPU,CRC,create,critical," +
                           "crystal,cyclic,Dallas,data,dbne,D-Bug12,DDRT," +
                           "Debug,debugged,debugger,debugging,defective," +
                           "defined,degrees,delay,delaying,delays," +
                           "delimiter,depending,described,design,designed," +
                           "desired,details,detect,detected,detection," +
                           "detects,determine,determined,device,devices," +
                           "difference,differences,different,differential," +
                           "difficult,digital,direction,directions,disable," +
                           "disabled,discovery,discussed,discusses," +
                           "distributed,document,documented,documents," +
                           "doesn,dominant,don,Dragon12-Plus,drift,drive," +
                           "driven,drives,driving,driving/receiving,DS1820," +
                           "easiest,easily,edge,edges,EEPROM,effect," +
                           "effectively,eight,elapsed,Enable,enabled," +
                           "enables,enabling,end,ending,Engineers,entered," +
                           "entire,environment,environments,EOD,EOF,equal," +
                           "error,errors,especially,Europe,examined," +
                           "example,exchange,execute,executed,executing," +
                           "execution,existence,exited,expected,extensive," +
                           "falling,faster,feature,features,field,fields," +
                           "figures,finish-current,firmware,first,flash," +
                           "followed,following,follows,format,formats," +
                           "found,four,fourth,frame,frames,Freescale," +
                           "frequency,frequently,function,functions," +
                           "further,generate,generated,generates,get,gets," +
                           "give,given,going,greater,guaranteed,Guide,half," +
                           "halted,halts,hand,hardware,hardware-based," +
                           "haven,having,HCS12,header,here,hidden,high," +
                           "higher,highest,HIP7020,host,hostile,hurt,I/O," +
                           "identical,identifier,idle,IFR,IFS,ignored,IIC," +
                           "immunity,implement,implemented,implementing," +
                           "implements,implmented,important,include," +
                           "incoming,increased,increment,Index,indicate," +
                           "indicated,indicating,initialized,initiated," +
                           "input,inserted,instance,Instead,instruction," +
                           "instructions,intended,intent,interface," +
                           "Interfaces,interfacing,interrupt,interrupted," +
                           "interrupts,involve,isn,issue,issued,iteration," +
                           "J1850,Kbps,known,labeled,large,largest,last," +
                           "late,ldaa,ldd,ldx,least,length,lengths,less," +
                           "level,levels,likely,line,Link,links,listening," +
                           "loading,logic,long,longer,loop,loses,low,lsrb," +
                           "lsrd,macro,maintain,make,manner,manufactured," +
                           "marker,markers,marks,master,match,maximum,Mbps," +
                           "means,measurement,memory,mentioned,message," +
                           "Messages,method,MHz,microcontroller," +
                           "microsecond,microseconds,minimum," +
                           "misinterpreted,missing,MODC,Mode,Modulation," +
                           "module,monitor,monitors,MSCAN,much,multiple," +
                           "necessary,need,needed,negative,network,Next," +
                           "nine,ninth,node,nodes,noise,nominal,normally," +
                           "Note,nothing,notifies,number,numbers,obtained," +
                           "occur,occurred,occurs,ohm,operation,optional," +
                           "origins,Overload,ow_read,ow_reset,ow_write," +
                           "pair,parallel,parasite,parity,part,passing," +
                           "passive,PCA82C250,per,perform,period,periods," +
                           "Philips,physical,pin,place,PLL,popular,port," +
                           "poses,position,positive,possible,post,power," +
                           "preceding,Presence,primarily,priority,problem," +
                           "process,processed,Processes,processing," +
                           "processor,produce,program,programming," +
                           "protection,protocols,provide,provided,provides," +
                           "provision,psha,pshb,PT0,PTIT,pula,pulb,pullup," +
                           "pull-up,Pulse,pulses,pulsing,Questions,rate," +
                           "rates,rather,reached,read,readable,reading," +
                           "reads,reasonably,receive,received,receiver," +
                           "receivers,receiving,reception,recessive," +
                           "recognizes,redundancy,reentrancy,Reference," +
                           "references,register,registers,releases,rely," +
                           "remainder,remains,Remote,repeat,repeated," +
                           "repeats,representative,requests,required," +
                           "requires,reserved,reset,resistor,respond," +
                           "responding,Response,restore,rests,result," +
                           "resynchronize,re-synchronize,retransmission," +
                           "Return,returns,right,rising,rloop,ROM,roughly," +
                           "routine,rs1,rts,run,running,runs,SAE,sample," +
                           "sampled,samples,save,saved,SCI,scope," +
                           "scratchpad,Search,second,Section,sees,sei," +
                           "select,selected,Semiconductor,send,sending," +
                           "sends,sent,sequence,Serial,service,sheet,shift," +
                           "shifted,short,show,shown,signal,signed," +
                           "significant,similarly,simplest,single,Skip," +
                           "slave,Slaves,slot,slots,slow,Society,SOF," +
                           "software,Special,specific,Specification," +
                           "specifies,speed,SPI,stack,standard,start," +
                           "starting,starts,state,Stop,stops,stores," +
                           "straightforward,strings,structure,study,stuff," +
                           "stuffing,subroutine,subtraction,suffice," +
                           "sufficiently,support,supported,switch,symbol," +
                           "symbols,synchronize,synchronous,system,tab," +
                           "tagging,take,target,TCNT,TCNT-y,technique,tell," +
                           "temperature,tenths,Text,theory,thermometer," +
                           "third,three,time,timer,times,timing,tolerances," +
                           "tolerated,too,traced,transceiver,transfer," +
                           "transferred,transfers,transition,transmission," +
                           "Transmissions,transmit,transmits,transmitted," +
                           "transmitter,transmitters,transmitting,two,type," +
                           "types,un-driven,unexpectedly,unique,unsigned," +
                           "unstuffed,unusual,use,USEC_DELAY,used,Users," +
                           "uses,using,value,Variable,variation,variations," +
                           "Version,versions,versus,via,void,volatile_," +
                           "voltage,wait,wants,way,whigh,wide,Width,Wire," +
                           "Wire®,wloop,won,wonder,words,work,works," +
                           "writing,written,zero";
entry.item[110].page = "part023b.html";
entry.item[110].description = "Other Serial Interfaces";
entry.item[111].keywords = "appear,browser,code,controls,disabled,example," +
                           "exited,file,first,generating,initializes," +
                           "loading,log,miniDbug12,need,page,Parallel," +
                           "Ports,Press,program,run,separate,Simulator," +
                           "snapshot,start,stop,taking,twice,view,window";
entry.item[111].page = "part023x.html";
entry.item[111].description = "Serial Peripheral Interface";
entry.item[112].keywords = "#1000,#1147,#192,#2000,#2295,#255,#5000," +
                           "#65536/2,#65536/7,#table,A/B,accuracy,accurate," +
                           "ADC,ADCVoltage/2,add,addd,added,adding,adjust," +
                           "adjusting,ADR0H,advance,advanced,amplitudes," +
                           "analogous,answer,appear,application," +
                           "applications,Arithmetic,Arrays,asld,assume," +
                           "averages,back,based,basically,bcc,best,Binary," +
                           "bit,bits,both,built,byte,bytes,calculation," +
                           "calculations,cannot,carried,carry,case,cause," +
                           "Certainly,change,changing,channel,cleared,cnt," +
                           "code,collection,combines,Combining,configured," +
                           "consider,considered,contains,control,controls," +
                           "convenient,conversion,convert,converter," +
                           "converters,correct,corresponding,count,CPU," +
                           "cumulative,cycle,DAC,DACVoltage,dealing," +
                           "decimal,declared,denominator,denominators," +
                           "depends,determines,different,differentiate," +
                           "digital,digits,discarded,divide,dividend," +
                           "divides,Dividing,division,divisor,doesn,don," +
                           "double,down,drive,drops,earlier,easily,easy," +
                           "edge,ediv,effectively,eight,eliminates," +
                           "embedded,emul,emuls,end,error,etbl,example," +
                           "examples,exceptions,execute,experiment," +
                           "exponent,exponents,Expressed,factor,factors," +
                           "far,fdiv,fetch,few,final,fine,finer,first,fit," +
                           "fits,Floating,following,force,form,Forth," +
                           "fraction,Fractional,Fractions,frequency,full," +
                           "function,Fuzzy,generated,generator,get,give," +
                           "given,gives,got,granted,half,halves,hand," +
                           "handled,HC12,here,hold,identical,idiv,ignore," +
                           "imagine,implicit,inca,increase,increases," +
                           "increasing,increment,incrementing,Index,input," +
                           "instance,instead,instruction,Instructions," +
                           "insufficient,Integer,integers,interpolate," +
                           "interpolation,interrupt,introduce,inverse," +
                           "involved,iny,justified,keep,keeping,Knowing," +
                           "known,lab,ladder,language,larger,last,ldaa," +
                           "ldab,ldd,ldx,ldy,least,left,less,lesser,Let," +
                           "listed,location,logical,look,lose,lost,lower," +
                           "lowered,LSB,lsrd,M/768,maintains,making,match," +
                           "matter,maximum,means,measurement,measurements," +
                           "mem,membership,memory,microcontrollers," +
                           "microseconds,milliseconds,millivolts,minimum," +
                           "modes,move,moved,multiplication,multiplied," +
                           "multiplies,multiply,multiply-divide," +
                           "multiplying,N/2,N/65536,nearest,nearly,need," +
                           "negative,never,Next,Normally,note,Now,number," +
                           "numbers,numerators,obtaining,often,operators," +
                           "order,original,output,overflow,pair,parallel," +
                           "parts,perfect,perform,performed,performing," +
                           "physical,point,popular,port,portion,position," +
                           "positions,positive,possible,powers,precise," +
                           "precisely,precision,presents,problem,processor," +
                           "processors,produce,produces,product," +
                           "product/65536,program,programmer,programming," +
                           "promoted,provides,quantity,Questions,Quite," +
                           "quotient,range,ranges,reading,real,reciprocal," +
                           "reduces,reducing,refer,register,relationships," +
                           "remainder,represent,representation,represented," +
                           "representing,represents,requires,resistor," +
                           "result,results,return,returns,right,risks," +
                           "round,rounded,rounding,rounds,routine,rules," +
                           "safely,save,say,scale,Scaled,Scaling,Search," +
                           "Section,seen,segment,sequence,several,shift," +
                           "shifted,shifting,should,signal,signed," +
                           "significant,sign-ness,slightly,slow,small," +
                           "smaller,solution,solve,Solving,staa,stab,Start," +
                           "std,store,stored,storing,stx,sty,subtract," +
                           "support,Supporting,Suppose,switchable,table," +
                           "Tables,take,taken,tbl,technique,Text,tfr," +
                           "thought,three,Thus,time,timer,times,track," +
                           "truncated,twice,two,type,UL/255,unsigned,upper," +
                           "use,used,useful,uses,using,value,values," +
                           "variable,variables,versions,viewed,voltage," +
                           "voltages,volts,wasn,waveform,way,wish,won,word," +
                           "words,work,writing,yields";
entry.item[112].page = "part024.html";
entry.item[112].description = "Scaled Integer Arithmetic";
entry.item[113].keywords = "#32,add,Addition,additional,address,adjusted," +
                           "adjusting,advance,advanced,application," +
                           "Arithmetic,Art,assembles,associated,based,best," +
                           "big-endian,binary,bit,bits,bold,branch,built," +
                           "C1p8,C32,calculating,calculations,calculator," +
                           "called,calls,case,cases,CCR,Celsius,chain," +
                           "chances,claim,code,collection,compare," +
                           "Comparison,Computer,Conclusion,condition," +
                           "conditional,consider,constant,contained," +
                           "containing,contents,convenience,convert," +
                           "Converting,cover,CPU,data,designed,details," +
                           "develop,Developing,development,divide,Donald," +
                           "double,dynamically,emphasized,errors," +
                           "especially,execute,execution,existing,expert," +
                           "experts,exponent,extension,factor,Fahrenheit," +
                           "field,fine,finish,first,fixed,flag,flags," +
                           "Floating,followed,following,forge,Format," +
                           "formats,formula,fpAdd,fpCompare,fpDivide,fpFix," +
                           "fpFloat,fpMultiply,fpNegate,fpTest,fraction," +
                           "function,functions,generic,give,greater," +
                           "greatest,handle,hardware,Having,HC12,Here,hold," +
                           "IEEE,increased,Index,indicate,industry," +
                           "instance,instead,instructions,Integer,intend," +
                           "intrinsic,introducing,jsr,keeping,Knuth,large," +
                           "last,leading,least,left,length,let,Lets," +
                           "libraries,library,location,locations,lower," +
                           "making,mantissa,microcontroller," +
                           "microcontrollers,microprocessors,misuse,modern," +
                           "moving,movw,much,Multiplication,multiplies," +
                           "multiply,necessary,needed,negate,negative,Next," +
                           "normalized,normalizing,obscure,obtain," +
                           "Occasionally,operations,overflow,Overview,page," +
                           "pages,parameters,part,pass,pattern,Perform," +
                           "Point,points,practice,precision,program," +
                           "Programming,pull,push,Questions,range,rather," +
                           "reason,recommend,recommended,registers,repeat," +
                           "represent,representation,represented,results," +
                           "Return,RPN,said,save,say,saying,scale,scaled," +
                           "Search,second,Section,sections,seen,sets," +
                           "setting,several,shifting,showing,sign,signed," +
                           "significant,sign-magnitude,single,split,stack," +
                           "standard,start,state,store,stored,storing," +
                           "study,subroutines,sum,system,table,task," +
                           "tedious,temperature,term,Text,time,too,trade," +
                           "tradeoff,two,use,used,users,using,value,values," +
                           "versus,Volume,word,write,zero,zeroes";
entry.item[113].page = "part025.html";
entry.item[113].description = "Floating Point Arithmetic";
entry.item[114].keywords = "#255,$80,accuracy,accurate,Addition,address," +
                           "addressing,aid,algorithm,algorithms,allows," +
                           "analyze,andb,andcc,appears,applications," +
                           "arguments,Arithmetic,asked,asld,assembly," +
                           "assumes,back,based,basic,behave,beq,bias," +
                           "binary,bit,bits,bra,branch,byte,bytes," +
                           "calculation,calculations,called,carried,case," +
                           "cases,causing,chapter,characteristics,check," +
                           "clear,clra,cmpa,code,codes,college,Comparison," +
                           "complete,Computer,concerned,Conclusion," +
                           "condition,considered,considering,consistent," +
                           "Converting,cpd,developed,didn,different," +
                           "difficult,Digression,discussion,divided," +
                           "division,E-127,embedded,equ,error,errors," +
                           "evenings,examples,exception,execution,exist," +
                           "experience,explicit,exponent,exponents," +
                           "extensively,extra,Extract,extraction,FEXPO," +
                           "FHIGH,field,fields,Floating,FLOW,following," +
                           "follows,Format,formats,four,fpExtract,fpExZer," +
                           "fpExZerJoin,fpPack,fpSetCC,fpSetMaybeZero," +
                           "fpSetMaybeZeroN,fpSetOV,FPSIZE,fraction," +
                           "fractions,FSIGN,full,function,get,gives,going," +
                           "gradual,gradually,handle,here,hidden,high," +
                           "identical,IEEE,IEEEFP,implementation," +
                           "implementing,implied,impressed,inc,Index," +
                           "Indexed,indicates,infinities,infinity,instance," +
                           "instead,instructions,instructor,Integer,Intel," +
                           "involved,involves,keep,known,lab,label," +
                           "language,last,later,ldab,ldd,least,left,length," +
                           "lengths,lines,listing,location,look,low," +
                           "machine,made,mainly,manipulation,manufacturer," +
                           "mathematical,maximum,microcontroller,minimize," +
                           "mode,Move,movw,msb,MSW,much,Multiplication," +
                           "NANs,need,needs,negative,Next,normalize," +
                           "normalized,number,Numbers,obtained,occupy," +
                           "Offset,optimized,orab,orcc,order,overflow," +
                           "Overview,own,pack,package,packing,paraphrased," +
                           "passed,perform,perhaps,places,Point,pointed," +
                           "positive,possible,possibly,precision," +
                           "pre-existing,principles,processor,Questions," +
                           "quite,range,reason,register,represented," +
                           "require,reserved,result,results,Return,right," +
                           "rorb,routine,Routines,rts,said,Save,Science," +
                           "Search,Section,separate,separately,sets,sev," +
                           "Shift,Short,shortcomings,shown,sign," +
                           "significant,signs,simple,six,Size,small," +
                           "smaller,smallest,son,sound,source,special," +
                           "specifies,staa,stab,standard,std,still,Store," +
                           "stored,students,subroutines,subtraction," +
                           "supported,takes,talk,task,test,Text,three,time," +
                           "took,treated,two,underflow,undergraduate," +
                           "unnormalized,unpack,unpacked,unsigned,use,used," +
                           "useful,using,Utility,value,values,week,word," +
                           "write,writing,wrote,years,zero";
entry.item[114].page = "part025a.html";
entry.item[114].description = "Floating Point Arithmetic";
entry.item[115].keywords = "#150,$13A,$40490fd0,$439D145A,$75BCD15,$82,$87," +
                           "$99,$F8A432EB,accurate,adca,adcb,add,addb," +
                           "Addition,adjust,advance,algorithm,allocate," +
                           "appear,applet,argument,Arithmetic,basically," +
                           "beq,big,binary,bit,bits,bmi,bne,bra,byte,bytes," +
                           "calculated,calculation,calculations,called," +
                           "Celsius,check,code,coma,comb,command," +
                           "Comparison,complement,concern,Conclusion," +
                           "condition,constant,constants,conversion," +
                           "conversions,convert,Converting,corresponds,cpx," +
                           "decimal,degree,desired,development,directory," +
                           "double-clicking,earlier,efficient,eliminating," +
                           "embedded,executing,exercise,exg,explicitly," +
                           "Explorer,exponent,factor,Fahrenheit,far,faster," +
                           "fd0,fe6,field,fields,file,find,First,fit,flag," +
                           "Floating,Format,formed,fpAdd,fpAdj,fpFix," +
                           "fpFloat,fpFloatMi,fpFloatPl,fpFloatZer," +
                           "fpMultiply,fpPack,FPSIZE,fraction,function," +
                           "functions,generating,get,gives,giving,handling," +
                           "having,here,hexadecimal,high,identical,IEEE," +
                           "implementation,including,Index,indicate," +
                           "Infinity,input,Inserting,instance,Integer," +
                           "integers,involve,involves,irrational,jar,Java," +
                           "jsr,language,larger,ldd,ldx,ldy,leading,leas," +
                           "least,leay,left,less,Let,library,line,location," +
                           "look,loose,low,made,maintain,maintains,make," +
                           "memory,modified,movb,movw,Multiplication," +
                           "multiplies,multiply,multiplying,necessary,need," +
                           "needs,Negate,negative,Next,normalization," +
                           "normalize,numbers,operation,opposite,order," +
                           "original,overflow,overflows,Overview,pack," +
                           "Packing,painfully,particulary,performing," +
                           "placing,platform,Point,positive,prior,process," +
                           "program,psha,pshd,pshx,Push,pushes,quantity," +
                           "Questions,RAM,replicated,representation," +
                           "represented,representing,requires,Reset,result," +
                           "results,Return,right,round,rts,run,running," +
                           "scale,scaled,scaling,Search,Section,seen," +
                           "separate,setting,shift,shifted,shifting,shifts," +
                           "should,show,sign,significance,significant," +
                           "simplest,size,slow,small,smaller,source,space," +
                           "split,stack,start,store,stores,take,technique," +
                           "temperature,tenths,Text,tfr,three,times,too," +
                           "try,under,units,unnecessary,unpacked,unsigned," +
                           "use,useful,uses,using,utility,value,values," +
                           "variables,way,Windows,word,written,zero";
entry.item[115].page = "part025b.html";
entry.item[115].description = "Floating Point Arithmetic";
entry.item[116].keywords = "#126,#254,#255,$41480000,$4569E000,adca,adcb," +
                           "add,addd,adding,Addition,address,adjust," +
                           "adjusting,algorithm,Algorithms,allow,allowed," +
                           "allows,analysis,appearance,approach,aren," +
                           "argument,arguments,Arithmetic,asl,back," +
                           "basically,beginning,beq,bias,binary,bit,bits," +
                           "ble,bmi,bne,book,both,bpl,bra,branch,bvs,byte," +
                           "bytes,calculate,calculated,calculation," +
                           "calculations,came,cannot,carry,case,changes," +
                           "check,clear,clr,clra,code,coded,Comparison," +
                           "compensate,complete,Conclusion,constant," +
                           "constants,conversion,Converting,correct," +
                           "covered,cpd,cross,decimal,decrementing,defined," +
                           "deleting,determination,didn,difficult,dividing," +
                           "Division,doesn,don,Donald,easy,effectively," +
                           "EMUL,end,entry,eora,example,exclusive-or," +
                           "expect,exponent,exponents,extra,extracted," +
                           "extremely,fact,FEXPO,FHIGH,fields,fine," +
                           "finishing,first,Floating,FLOW,Format,four," +
                           "fpExtract,fpMul2AdjRet,fpMulAdjRet,fpMulJoin," +
                           "fpMulNorm,fpMulNormDone,fpMulNormOK,fpMultiply," +
                           "fpMulTooSmall,fpMulZero,FPOFF,fpPack,fpSetCC," +
                           "FPSIZE,fraction,fractions,frankly,FSIGN," +
                           "fudging,full,fully,function,future,get,give," +
                           "giving,here,high,hold,IEEE,implemented," +
                           "incrementing,Index,indicate,indicates,Infinity," +
                           "instruction,Integer,integers,involves," +
                           "involving,isn,jmp,jsr,jump,know,Knuth,larger," +
                           "ldaa,ldab,ldd,ldy,leas,leaving,leax,leay,left," +
                           "less,let,library,loc,location,low,lower,lsr," +
                           "Luckily,major,make,makes,means,memory,minimum," +
                           "movb,move,moved,moving,movw,Multiplication," +
                           "multiplications,multiply,multiplying,NAN,NANs," +
                           "necessarily,need,negative,never,Next,normal," +
                           "normalize,normalized,Note,Now,offset,operand," +
                           "operands,operation,order,original,overflow," +
                           "Overview,pack,partial,performed,performing," +
                           "place,plus,Point,pointer,position,possible," +
                           "pretend,process,produces,product,products," +
                           "progress,promise,Questions,Quite,RAM,rather," +
                           "reaches,remainder,remove,representation," +
                           "reserve,reserved,restore,result,return," +
                           "returning,right,rol,ror,routines,rts,save," +
                           "Search,second,Section,Seminumerical,shared," +
                           "shift,shifted,shifting,should,shown,sign," +
                           "significant,signs,simplifying,simply,size," +
                           "small,source,space,special,Splitting,staa,stab," +
                           "stack,start,std,straightforward,sty,subd," +
                           "subtract,subtracted,sum,support,supporting," +
                           "technique,temporary,Text,tfr,thing,three,thus," +
                           "times,too,tst,two,un-normalized,unpack," +
                           "unpacked,unsigned,upper,use,Using,value,values," +
                           "variable,variables,verify,walk,word,x32,zero";
entry.item[116].page = "part025c.html";
entry.item[116].description = "Floating Point Arithmetic";
entry.item[117].keywords = "$41410000,$4461e000,accumulator,adca,adcb,add," +
                           "addb,addd,addend,adding,Addition,address," +
                           "adjust,argument,Arithmetic,back,beq,bge,bit," +
                           "bits,blo,bmi,bra,byte,calculations,carry,case," +
                           "check,cmpa,code,coma,comb,compare,comparing," +
                           "Comparison,complement,complete,complicated," +
                           "Conclusion,consider,Converting,correct," +
                           "de-normalize,determine,differ,difference," +
                           "division,eora,exceed,exg,exponent,exponents," +
                           "fact,factors,FEXPO,FHIGH,fields,first,Floating," +
                           "FLOW,Format,fpAdd,fpAddAdj1,fpAddJoin," +
                           "fpAddNoAdj,fpAddSubtract,fpAdj,fpExtract,fpFix," +
                           "fpMul2AdjRet,fpMulAdjRet,fpPack,fpSetCC,FPSIZE," +
                           "fractions,FSIGN,get,handle,here,high,IEEE," +
                           "incrementing,Index,Instead,instruction,Integer," +
                           "jsr,larger,lbeq,lbvs,ldaa,ldd,ldx,leas,leax," +
                           "leay,Let,local,look,low,magnitude,match,means," +
                           "move,Multiplication,NAN,NANs,need,Next," +
                           "normalized,Now,order,Overview,pack,performed," +
                           "performing,Point,position,process,pshx,pulx," +
                           "push,Questions,rather,rejoin,remove," +
                           "representation,reserve,result,return,right," +
                           "routine,routines,rts,saw,sbca,scale,scaled," +
                           "Search,second,Section,shifted,shifting,sign," +
                           "signs,simple,smaller,space,Splitting,staa," +
                           "stack,std,subd,subtract,subtracted,Subtraction," +
                           "sum,Text,tfr,time,two,unless,Unpack,unpacked," +
                           "unpacking,use,used,utility,value,values," +
                           "variables,way,wrong,zero";
entry.item[117].page = "part025d.html";
entry.item[117].description = "Floating Point Arithmetic";
entry.item[118].keywords = "$404a62c1,$404a62c2,$41200000,Addition,aid," +
                           "algorithm,answer,Arithmetic,best,bits,both," +
                           "bytes,calculate,calculated,calculation," +
                           "calculations,clearing,closest,code,compare," +
                           "Comparison,Conclusion,conditions,constant," +
                           "consuming,Converting,correct,count,dbne," +
                           "debugger,differ,dividing,dynamic,enclosed," +
                           "equal,especially,estimate,exchanged,extensive," +
                           "f00,factors,Finally,finds,finish,finished," +
                           "first,Floating,following,Format,fpAdd,fpDivide," +
                           "fpMultiply,Fuzzy,Goes,greater,hardware,Here," +
                           "IEEE,Index,initial,Instead,instructions," +
                           "Integer,integers,iteration,iterations," +
                           "iterative,jsr,large,ldaa,less,library,little," +
                           "Logic,loop,make,memory,method,Microcontrollers," +
                           "microseconds,movw,Multiplication,multiply," +
                           "necessary,negative,new,Newton,Next,number," +
                           "occupies,often,overcome,Overview,package,Point," +
                           "positive,problems,processors,program,provide," +
                           "providing,psha,pula,Questions,range,reason," +
                           "repeat,result,return,root,roughly,run,save," +
                           "Search,Section,seven,shifting,sign,size,slow," +
                           "source,speed,sqrt,square,start,starting,steps," +
                           "stored,subtracted,swi,takes,taking,ten,Text," +
                           "time,times,two,under,use,using,val,val/sqrt," +
                           "value,values,wanted,way,wish,words,zero";
entry.item[118].page = "part025e.html";
entry.item[118].description = "Floating Point Arithmetic";
entry.item[119].keywords = "$1000,$1004,appear,browser,byte,code,controls," +
                           "disabled,executing,exited,file,floating," +
                           "generating,loading,location,log,page,placed," +
                           "point,program,root,run,separate,Simulator," +
                           "snapshot,square,starting,stop,take,taking," +
                           "value,window";
entry.item[119].page = "part025ex.html";
entry.item[119].description = "Square Root Calculation";
entry.item[120].keywords = "#iv1,#rulelist,$00,$fe,$FF,accommodated," +
                           "Accumulator,add,addition,additional,address," +
                           "aid,algorithms,allow,allowing,allows,analyzing," +
                           "AND/OR,antecedent,antecedents,applying," +
                           "approach,Area,aren,arguments,array,arrays," +
                           "assign,Assuming,average,averaged,averaging," +
                           "bear,bit,Boolean,build,byte,bytes,calculate," +
                           "calculates,calculating,called,cascaded,case," +
                           "CCR,change,circuit,clear,cleared,clr,combined," +
                           "combines,comparator,comparators,complement," +
                           "complements,complete,complex,consequent," +
                           "consequents,Consider,consist,consists,contain," +
                           "continuum,control,controller,controllers," +
                           "convert,converters,converts,CPU,decide,defined," +
                           "Defuzzification,derived,description,design," +
                           "designed,desired,determines,Developing," +
                           "different,difficult,easily,ediv,efficient," +
                           "Electrical,emacs,end,ending,Engineering,entry," +
                           "equations,etbl,evaluate,Evaluation,example," +
                           "execute,executed,executing,execution,expect," +
                           "fact,factor,falling,false,familiar,fast,final," +
                           "first,followed,following,follows,form,four," +
                           "fully,function,functions,Fuzzification,fuzzify," +
                           "Fuzzy,gate,gates,generalized,get,greater," +
                           "groups,handles,happen,HC12,helpful,Here,holds," +
                           "implement,implementation,implemented," +
                           "implementing,implements,includes,incremented," +
                           "Index,indices,infinite,input,inputs,instead," +
                           "instruction,instructions,integers,intended," +
                           "interrupt,interruptable,Introduction,isn,iv1," +
                           "iv2,iv3,know,ldaa,ldx,ldy,leading,left,less," +
                           "Lets,level,levels,Likewise,linear,list,Load," +
                           "location,Logic,long,longer,lookup,map,mapping," +
                           "max,maximum,means,Mechanical,meet,mem," +
                           "membership,min,minimization,minimum,MIN-MAX," +
                           "modeling,much,multiple,multiply,necessary,need," +
                           "network,Next,none,normal,Note,Now,number," +
                           "observe,operation,order,original,output," +
                           "outputs,ov1,ov2,performing,performs,physical," +
                           "piecewise,point,Point_1,Point_2,possibility," +
                           "possible,Prior,process,processing,program," +
                           "provided,Questions,RAM,ramp,range,rather," +
                           "reasonable,register,relates,replaced,represent," +
                           "represented,require,resemblance,result,results," +
                           "resume,return,rev,revw,rising,ROM,Rule," +
                           "rulelist,rules,RuleTwister,say,scale,scaled," +
                           "scope,Search,second,Section,Shareware,shown," +
                           "side,sides,simple,simplest,slope,Slope_1," +
                           "Slope_2,sloping,smooth,start,starting,states," +
                           "strong,sufficient,sum-of-products," +
                           "sum-of-weights,Support,system,systems,table," +
                           "tables,take,task,tbl,term,terminated,terms," +
                           "Text,third,three,Thus,time,Traditionally," +
                           "trailing,transition,trapezoid,true,try,two," +
                           "unbearably,unity,unsigned,use,used,useful,uses," +
                           "using,value,values,variable,variables,view," +
                           "volt,voltages,volts,wav,weighed,weight,weights," +
                           "world,X-axis,zero";
entry.item[120].page = "part026.html";
entry.item[120].description = "Fuzzy Logic";
entry.item[121].keywords = "#include,$0000,$1000,$2000,$400,$C00,add," +
                           "addition,address,addresses,Advanced,allocated," +
                           "allocation,allow,allowing,allows,alter,appear," +
                           "appended,Appendix,application,applied,arrange," +
                           "array,ASCII,asked,Assembler,assemblers,author," +
                           "background,beginning,best,bra,byte,bytes," +
                           "changes,characters,close,code,Comment,comments," +
                           "compiled,compiler,complexity,consider," +
                           "constants,contain,contains,contents,convenient," +
                           "convention,copyright,corporate,correspond,Data," +
                           "DATASTART,date,D-Bug12,debugging,Declaration," +
                           "declarations,declared,define,defined,defines," +
                           "definitions,describing,description,devices," +
                           "different,difficult,directive,Displays,don," +
                           "downward,driven,eeprom,elements,end,ends,entry," +
                           "executable,execution,existing,explicitly,fall," +
                           "fcc,file,files,fills,finishes,first,follows," +
                           "forever,free,Freescale,general,generates,gets," +
                           "given,Gnu,goes,having,HC12,HCS12,Here,high," +
                           "highest,I/O,important,inc,Include,included," +
                           "Index,initial,initialization,initialize," +
                           "initialized,instruction,interrupt,ioports,jmp," +
                           "jump,keep,label,labels,languages,later,least," +
                           "length,Lets,level,line,lines,linker," +
                           "linker/relocator,Linkers,list,location," +
                           "locations,long,look,loop,lowest,Main,make," +
                           "makes,map,mapped,mapping,matter,meet,memory," +
                           "missing,modify,movb,movw,multiple,Multiplexed," +
                           "names,necessary,need,needs,never,Next,note," +
                           "nothing,notice,Now,object,often,opposed,order," +
                           "org,organizing,personal,physical,place,placed," +
                           "point,pointer,points,power,prevents,problems," +
                           "process/routine,Program,programs,project," +
                           "projects,PROVIDE,PRSTART,pure,purposes,put,RAM," +
                           "range,readable,reference,referenced,references," +
                           "registers,Relocating,replaced,resolves,Return," +
                           "ROM,routine,routines,runs,rwx,Search,section," +
                           "segment,segments,selected,service,sets,sharing," +
                           "should,simple,small,source,space,spreading," +
                           "stack,standard,starting,starts,statement,step," +
                           "string,strings,structure,students,Subroutines," +
                           "sufficient,system,table,Tables,taste,tells," +
                           "Template,Text,things,time,tool,two,undefined," +
                           "upwards,use,using,value,values,variable," +
                           "variables,vectors,virtual,way,won,word,words," +
                           "work,works,writeable,written,x0000,x1000,x2000," +
                           "x400,xc00";
entry.item[121].page = "part027a.html";
entry.item[121].description = "Assembler Program Template";
entry.item[122].keywords = "access,acquires,action,adding,allow,allows," +
                           "Appendix,application,asm_,back,background,bclr," +
                           "binary,bra,branch,brset,bset,bypass,byte," +
                           "called,cannot,case,change,chapter,char,clear," +
                           "cli,code,command,complete,completes,concept," +
                           "conclude,condensed,considerably,consists," +
                           "control,controls,cooperative,COP,copy,counter," +
                           "CPU,create,critical,cycles,declared,design," +
                           "desires,determine,devices,disabled,disallow," +
                           "disasterous,divide,driven,driver,DS1820,easily," +
                           "easy,effectively,effects,effort,else,enable," +
                           "enabled,event,example,execute,executed," +
                           "executes,executing,execution,existing,expanded," +
                           "external,feature,figure,first,flag,forced," +
                           "general,gets,getting,handle,handled,handling," +
                           "hangs,happens,having,HCS12,here,hogs,idle," +
                           "implement,Implementing,important,increment," +
                           "independent,Index,indicates,information," +
                           "initialization,input,inputs,instance,Instead," +
                           "int,interface,interrupt,interrupts,jsr,know," +
                           "knowledge,latest,lets,light,lights,location," +
                           "lock,long,Looking,machine,machines,main,making," +
                           "manner,measurement,mechanism,memory," +
                           "microcontroller,microcontrollers,millisecond," +
                           "monitor,moves,much,Multiple,multiprocessing," +
                           "multitasking,Namely,needed,needs,new,Next," +
                           "nothing,now,number,occur,occuring,occurs,Often," +
                           "order,output,outputs,ow_reset,ow_write,own," +
                           "part,pass,passed,percentage,perform,performed," +
                           "performs,place,placed,pointer,possible," +
                           "preemptive,prevent,preventing,problem,process," +
                           "Processes,processing,processor,processors," +
                           "produces,program,programs,protection,providing," +
                           "rate,read,reading,readings,recognize," +
                           "re-enables,reentered,reentering,reentrancy," +
                           "reentrant,referred,require,reserved,reset," +
                           "result,return,ROM,routine,routines,RTI,run," +
                           "running,save,scheduler,scheme,scratchpad," +
                           "Search,sec_count,second,seconds,seen,sei," +
                           "sensors,sequence,served,service,serviced," +
                           "shared,showing,shown,simplify,simply," +
                           "simultaneous,simultaneously,single,Skip," +
                           "snippet,Software,solve,spent,stack,start,state," +
                           "state_machine,states,stored,switch,take,task," +
                           "tasks,temp_state,tempbuf,temperature,Text,time," +
                           "timely,timer,traffic,two,unsigned,use,uses," +
                           "Using,utilized,value,valve,variables,volatile_," +
                           "wai,waiting,wants,watchdog,way,wire,works," +
                           "written,xbe,xcc,yield";
entry.item[122].page = "part027b.html";
entry.item[122].description = "Multiple Processes";
entry.item[123].keywords = "#-1,#10,$11,$1f,$f7,$fb,$fd,$fe,A321," +
                           "accomplish,accumulator,accurately,adda," +
                           "additional,advance,allow,allows,Amazingly,anda," +
                           "appears,Appendix,Application,asra,assumes," +
                           "Auto-repeating,B654,based,basically,beq,bge," +
                           "bits,bmi,bne,board,both,bottom,bounce,Bouncing," +
                           "bra,branch,bset,bsr,buffer,buffered,built-in," +
                           "button,C987,cable,called,calls,case,cause," +
                           "causes,changed,character,check,checking," +
                           "choices,clear,cli,cmpa,code,colindx,colmask," +
                           "column,columns,configured,connect,connected," +
                           "connection,connections,connector,consider," +
                           "contacts,convert,correct,correspond,counter," +
                           "counts,CPU,CRGFLG,cycles,DDRA,debcnt,de-bounce," +
                           "De-bounced,debouncing,de-bouncing,dec," +
                           "declarations,definition,depending,depressed," +
                           "depressing,depression,depressions,described," +
                           "development,devices,different,differentiate," +
                           "direction,discussed,display,displayed,Displays," +
                           "divided,divider,documentation,doesn,don,down," +
                           "DRAGON12,Dragon12-Plus,drive,driven,driver," +
                           "driving,earlier,EEPROM/ROM,effect,effective," +
                           "eight-wire,electrical,fast,fetch,filter," +
                           "Finally,fine,fingers,First,flag,followed," +
                           "following,fool,forced,found,frequency,general," +
                           "generate,Get,getkey,gets,gives,good,gotone," +
                           "Grayhill,ground,handle,handled,handling," +
                           "Hardware,hasn,HCS12,held,here,high,higher," +
                           "hogging,holds,human,idle,illustration,Imagine," +
                           "implement,Implementing,independently,Index," +
                           "initialization,inputs,intended,interest," +
                           "interface,interpreted,interrupt,interrupts," +
                           "invalid,issue,J29,key,Keyboard,keyboards," +
                           "keybuf,keypad,keypads,keys,keystroke,known,kpd," +
                           "labeled,last,lastval,ldaa,LED,leds,Let,levels," +
                           "look,looks,low,low-pass,lsra,main,makes," +
                           "manufactured,mark,mask,masked,matrix,means," +
                           "mechanical,middle,missing,mounting,movb,msb," +
                           "mSec,much,multiple,Multiplexed,necessary,need," +
                           "new,Next,N-key,none,normally,nothing,noval,now," +
                           "nowrap,number,occur,occurs,output,outputs,PA0," +
                           "PA1,PA3,PA4,PA5,PA7,part,parts,passed,pick,pin," +
                           "Pins,place,plenty,plus,poll,polled,polling," +
                           "port,PORTA,possibility,possible,potential," +
                           "power,press,pressed,presses,press-release," +
                           "prevents,problem,problems,process,program," +
                           "project,propagation,provides,pull-up,Putting," +
                           "quick,read,reading,reads,release,released," +
                           "releasing,represent,representative,represents," +
                           "requirements,reset,resistors,respectively," +
                           "return,returned,rolling,rollover,roughly," +
                           "routine,row,rows,RS232,RTI,rtiisr,rts,samelast," +
                           "save,saved,scan,scanned,scanning,schematic," +
                           "Search,second,seen,segment,selected,sense,sent," +
                           "sequence,Series,Service,several,shift,shown," +
                           "shows,signal,simple,simultaneously,single," +
                           "slowly,solution,solve,staa,standard,start," +
                           "subroutine,subroutines,succession,switch," +
                           "switches,table,technique,telephone,template," +
                           "Text,tfr,thing,think,thinking,third,Time,timer," +
                           "times,trick,true,try,two,unchanged,under,upper," +
                           "use,used,user,using,valid,valtbl,value,values," +
                           "variable,wai,wait,way,wiring,won,written";
entry.item[123].page = "part027c.html";
entry.item[123].description = "Implementing a Debounced Keyboard";
entry.item[124].keywords = "$000,$1000,$3C00,$3DFF,$3E00,$3FF,$400,$EF80," +
                           "$EFFE,$FEF80,$FEFFF,$FFD,$FFF,$FFF80,$FFFFF," +
                           "accomplish,addition,Additional,address," +
                           "allowing,amount,Appendix,Application," +
                           "applications,applies,appropriate,areas,array," +
                           "assembled,assembler,bank,based,BDM,bit,block," +
                           "board,boards,boot,brclr,Byte,cannot,capable," +
                           "case,change,changed,changing,CLKSEL,clock,code," +
                           "command,commercial,compiler,configure," +
                           "configured,Consider,consideration,constants," +
                           "copy,corresponding,created,CRGFLG,crystal," +
                           "crystals,data,D-Bug12,DBUG12MAP,debugger," +
                           "definition,definitions,desired,developer," +
                           "development,dip,directives,divided," +
                           "Dragon12-plus,E7F,easier,easily,edit,EEPROM," +
                           "EEPROM/ROM,EEPROMMAP,EF80,EFFF,Enable,ENTIRE," +
                           "equ,evaluation,Example,executed,execution," +
                           "factor,FFF,figure,file,final,flash,FLASHMAP," +
                           "following,frequency,full,general,given,guide," +
                           "handle,handled,HCS12,hidden,ignored,impossible," +
                           "inc,including,increase,Index,information," +
                           "initial,initialization,initialize,initialized," +
                           "initializes,installed,instance,intended," +
                           "interfaces,interrupt,Interrupts,jump,jumps," +
                           "left,load,loaded,loader,loading,location," +
                           "locations,lock,maintained,Make,making,managed," +
                           "map,MC9S12DG256B,means,memory,mentioned,Meter," +
                           "MHz,mode,modified,movb,moved,multiplication," +
                           "multiplier,multiply,necessary,need,needs,Next," +
                           "None,non-volatile,Normally,on-chip,operation," +
                           "peripheral,PLL,pointer,power-up,present," +
                           "procedure,program,programmed,Programming," +
                           "protection,provide,provided,provides,Putting," +
                           "RAM,RAM-based,rather,recovery,register," +
                           "registers,relies,rely,remove,reprogramming," +
                           "requires,reset,Return,revectored,right,ROM," +
                           "routine,routines,run,runtime,SCI0,Search," +
                           "should,shown,shows,side,specific,specified," +
                           "speed,stack,standalone,start,starting,still," +
                           "stored,switches,switching,SYNR,system,systems," +
                           "table,Text,tools,turn,two,usage,use,used,uses," +
                           "using,value,values,variables,vector,vectors," +
                           "via,wait,WARNING,work,WRITE,writing";
entry.item[124].page = "part027d.html";
entry.item[124].description = "Putting an Application in EEPROM/ROM";
entry.item[125].keywords = "#-1,#10,#ENABLE,#inidsp,#lcdbuf,#LCDBUFLEN," +
                           "#LCDBUFLEN-1,#LCDCLEARDELAY,#LCDCMD,#LCDIDLE," +
                           "#LCDRESETDELAY,#nomeas,#REG_SEL,#result," +
                           "#TEXTLEN,$01,$06,$0c,$28,$32,$33,$80,$ff," +
                           "accommodate,accomplished,Accumulator,addb,addd," +
                           "addition,additional,address,adjust,Alarm," +
                           "algorithm,allowed,allows,anda,Appendix," +
                           "application,arithmetic,array,ASCII,assert," +
                           "Assuming,back,based,Basically,bclr,begin,beq," +
                           "bhs,bit,bits,blank,blinking,blo,bls,bne,board," +
                           "both,bpl,bra,branch,bset,bsr,buffer,Buffered," +
                           "buffering,bufin,build,byte,bytes,calculate," +
                           "calling,capability,care,case,change,changed," +
                           "changing,character,characters,check,checked," +
                           "checks,circular,clear,cleared,clearing,cli," +
                           "clock,clr,cmpa,code,combine,command," +
                           "command/data,commands,comments,complete," +
                           "completes,components,concern,concerned," +
                           "configuration,configuring,connect,Conversion," +
                           "convert,converted,converting,correct,correctly," +
                           "counter,cover,cpd,cpx,cpy,crystal,cursor,data," +
                           "dbne,DDRK,de-assert,dec,declarations,delay," +
                           "delays,design,developed,development,diagram," +
                           "difference,different,digit,Digits,disable," +
                           "discussed,discussion,display,displayed,divide," +
                           "dividend,dividing,division,divisions,doesn,don," +
                           "doneflag,doneflg,dot,down,Dragon12-Plus,drive," +
                           "driven,Driving,easily,ediv,EEPROM,eight,Enable," +
                           "enabled,end,entire,Example,except,execute," +
                           "executed,executes,executing,execution,exists," +
                           "expect,far,fast,fcb,fcc,fetch,fill,filled," +
                           "final,fine,finished,first,flag,follow," +
                           "following,frequencies,Frequency,future,general," +
                           "generates,get,given,gives,goal,goes,groups," +
                           "handle,Hantronix,hardware,here,high,higher," +
                           "home,hurt,idiv,idle,implement,important," +
                           "included,increment,Index,indicate,indicated," +
                           "indicating,information,inidsp,initial," +
                           "Initialization,initialize,initialized," +
                           "initially,initiates,input,instruction," +
                           "instructions,insure,Interface,interrupt," +
                           "interrupts,involves,iscmd,jmp,jsr,keeping,know," +
                           "large,later,LCD,lcd_ini,lcd_ini_loop,lcd_line1," +
                           "lcdbuf,lcdbufin,LCDBUFLEN,lcdbufout,lcdcin2," +
                           "lcdclear,LCDCLEARDELAY,LCDCMD,lcddelay,lcdfin," +
                           "LCDIDLE,lcdin2,lcdnibble,lcdreset," +
                           "LCDRESETDELAY,lcdstate,ldaa,ldab,ldd,ldx,ldy," +
                           "leading,least,left,less,Lets,line,line1,lines," +
                           "linked,list,long,look,loop,loops,low,lower," +
                           "lsla,lsra,Machine,Main,mainly,make,making,mask," +
                           "means,measure,measurement,Measurements,meet," +
                           "memory,message,met,Meter,MHz,microcontroller," +
                           "microseconds,millisecond,milliseconds,Module," +
                           "movb,move,movw,MSB,msec,msg_out,multiple," +
                           "necessary,need,needed,negative,new,Next,nibble," +
                           "nibbles,nomeas,nomeasure,non-displaying,none," +
                           "nonzero,non-zero,nop,normally,Note,nothing,Now," +
                           "nsec,number,occasions,occur,occurs,operation," +
                           "operations,oraa,order,output,part,parts,per," +
                           "perform,performing,pins,PK0,pk2-pk5,PK5,placed," +
                           "PLL,Pointer,pointers,port,PORTK,pos,position," +
                           "positions,precludes,prefix,prepare,printed," +
                           "priority,problem,proceed,process,processing," +
                           "processor,program,project,provide,psha,pshx," +
                           "pshy,pula,Pulse,pulsing,pulx,puly,put,putchar," +
                           "putlcd,putlcd2,putlcd3,putlcd4,putlcd5," +
                           "quotient,rate,rather,read-back,reason,Refer," +
                           "REG_SEL,register,remainder,remaining,renamed," +
                           "repeated,require,requirement,requirements," +
                           "requires,reset,resolution,results,return," +
                           "returns,right,room,routine,routines,rti,rts," +
                           "run,sample,save,saved,Search,second,section," +
                           "sections,seen,select,send,sending,sends," +
                           "sensitive,sent,separate,sequence,sets,setting," +
                           "Seven,sheet,shift,shifted,shown,shows,signal," +
                           "significant,slightly,slowing,source,special," +
                           "split,staa,stab,stack,stand-alone,start," +
                           "starting,startup,State,states,step,store," +
                           "storing,string,strobe,stx,sty,subd,subroutine," +
                           "sufficient,sufficiently,supplies,supported," +
                           "system,take,taken,task,temporarily,Text,tfr," +
                           "thing,time,Timer,times,timing,transfers,try," +
                           "tst,two,updated,upper,use,used,user,using," +
                           "value,Values,variable,via,wai,wait,waiting," +
                           "wide,won,worry,wrap,write,writes,zero";
entry.item[125].page = "part027e.html";
entry.item[125].description = "Frequency Meter Example";
entry.item[126].keywords = "#define,&dispa,&dispt,&timer5,&timer6,&timer7," +
                           "added,adding,addition,additional,address," +
                           "adjustable,ADR00H,advance,Alarm,ALARM_SW," +
                           "alarmCheck,alarmOff,alarmon,alarmon2,algorithm," +
                           "aliases,allow,AM/PM,AMPM,AMPM/24hour,AMPM_SW," +
                           "appear,Appendix,approach,appropriate,argument," +
                           "array,arrays,asm_,assembly,Assignments,ATD," +
                           "ATD0CTL2,ATD0CTL3,ATD0CTL4,ATD0CTL5,automatic," +
                           "automatically,Auto-repeats,base,based,basic," +
                           "behave,behavior,best,bit,bits,blank,board,both," +
                           "bottom,Brightness,buffer,bus,button," +
                           "buttonCheck,buttons,buzzing,byte,bytes," +
                           "calculations,called,carry,case,change,changed," +
                           "changes,channel,channels,char,character,chart," +
                           "charts,check,checked,checks,choice,chorded," +
                           "clear,clearing,cli,CLKSEL,Clock,code,colon," +
                           "combination,combinations,combine,Compare," +
                           "compares,complete,complexity,compromise," +
                           "condition,configure,configured,connect," +
                           "connected,connects,considered,const,constant," +
                           "constants,containing,contents,control," +
                           "controlled,controls,convenient,conversion," +
                           "conversions,converter,corresponding,counter," +
                           "counts,covers,CRGFLG,cycle,cycles,Data,DDRB," +
                           "DDRH,DDRP,debounce,de-bounce,debounce-," +
                           "DEBOUNCE_DELAY,debouncing,decimal,Declarations," +
                           "declare,declared,declares,default,define," +
                           "defined,definitions,Delay,depressed,depression," +
                           "described,describes,design,development,devices," +
                           "difference,differences,different,digit,Digital," +
                           "digits,DIP,direction,Disable,disabling," +
                           "discussed,discusses,disp,dispa,dispadp,display," +
                           "displayed,displaying,Displays,dispt,disptdp," +
                           "document,doesn,don,down,DRAGON12,Dragon12-plus," +
                           "driven,drives,dspmap,earlier,ease,easy," +
                           "electrical,else,enable,enabled,end,enhancement," +
                           "entire,EPROM,event,eventual,examined,Example," +
                           "examples,except,exclusive-or,executed,executes," +
                           "execution,explained,explicitly,Family,features," +
                           "file,final,Finally,fine,First,flag,flash," +
                           "flashes,flashing,flashsec,flashsec2,flow," +
                           "followed,follows,formats,four,fraction," +
                           "frequency,Function,functionality,functions," +
                           "further,generate,generated,generates,get,gets," +
                           "given,GNU,goal,ground,group,half,halfSecond," +
                           "handles,Hardware,haven,having,held,here,high," +
                           "hold,hour,HOUR_SW,HOUR1,HOUR10,hours,I/O,idle," +
                           "illuminated,illumination,implement," +
                           "implementation,implemented,increment," +
                           "incremented,incrementH,incrementing,incrementM," +
                           "Index,indexing,indicator,ing,initial," +
                           "INITIAL_REPEAT_DELAY,Initialization,initialize," +
                           "initialized,initializes,initializing,input," +
                           "instance,instruction,instructional,int," +
                           "interface,interrupt,interrupts,interval," +
                           "inverted,invoked,involved,isn,Keeping,kept,key," +
                           "keypad,keyword,know,language,last,lastButtons," +
                           "latch,later,least,LED,ledFraction,let,level," +
                           "levels,linker,local,locations,logically,long," +
                           "Look,lookup,loop-forever,low,lower,macro," +
                           "macros,main,maintenance,makes,making," +
                           "manipulates,maps,mask,match,matches,maximum," +
                           "MC9S12C,means,memory,met,method,MHz," +
                           "Millisecond,milliseconds,millisecs,MIN1,MIN10," +
                           "Minute,MINUTE_SW,minutes,mode,multiple," +
                           "multiplex,Multiplexed,names,necessary," +
                           "necessitating,needed,new,Next,non-zero,Note," +
                           "numeral,occur,occurs,OL5,older,OM5,open," +
                           "Operation,order,output,overflow,parallel," +
                           "parameter,passed,PB_MASK,per,percentage," +
                           "perform,performed,perhaps,pin,pins,place,PLL," +
                           "point,points,poll,port,portb,porth,portp,ports," +
                           "position,possible,potential,potentiometer," +
                           "powerOnCheck,preceding,press,pressed,presses," +
                           "prior,process,processing,produce,program," +
                           "programmed,project,Proper,proportional," +
                           "provides,PT5,PTH,PTH&AMPM_SW,PTP,Pull-up,push," +
                           "put,RAM,rather,reached,read,reader,reasons," +
                           "re-enabled,refresh,register,registers,released," +
                           "remainder,repeat,repeat-,REPEAT_DELAY," +
                           "repeatDelay,repeatedly,repeats,represents," +
                           "require,requires,reset,resistors,respectively," +
                           "return,returns,ROM,roughly,routine,routines," +
                           "run,runtime,rusty,S19,Save,SCAN,Search,second," +
                           "seconds,section,seen,sees,segm_ptrn,segment," +
                           "segments,sei,select,selection,separate," +
                           "sequence,service,setting,short,show,shows," +
                           "signed,significant,signify,simple,simpler," +
                           "simulator,single,small,solely,sound,sounding," +
                           "sounds,span,speaker,speed,stack,start,started," +
                           "starts,startup,state,statement,statements," +
                           "status,still,stops,stored,structure,structures," +
                           "substituted,SW2,SW3,SW4,SW5,switch,switches," +
                           "SYNR,table,Tables,TB1MS,TC5,TC6,TC7,TCTL1," +
                           "technique,temp,ten,tested,testing,Text,TFLG1," +
                           "things,Three,Thus,time,TIME_SW,timer,timer5," +
                           "timer6,timer7,times,TIOS,TMSK1,Toggle,toggled," +
                           "toggling,tone,tools,TSCR,Turn,turned,turning," +
                           "turns,twice,two,unless,Unlike,unsigned,update," +
                           "updated,updates,updating,use,used,user," +
                           "UserTimerCh5,UserTimerCh6,UserTimerCh7,using," +
                           "valid,value,values,variable,variables,vectors," +
                           "via,void,volatile_,voltage,volts,WAI,wait," +
                           "waiting,way,wherever,whether,won,work,wrap," +
                           "wrapped,wraps,x00,x01,x06,x07,x08,x09,x0b,x0c," +
                           "x0d,x0e,x0f,x1c,x1e,x20,x27,x38,x39,x3d,x3e," +
                           "x3f,x40,x41,x48,x49,x4f,x50,x54,x5b,x5c,x5e," +
                           "x63,x66,x6d,x6e,x6f,x71,x73,x74,x76,x77,x78," +
                           "x79,x7c,x7d,x7f,x80,xe0,xf0,xff,zero";
entry.item[126].page = "part027f.html";
entry.item[126].description = "Alarm Clock Example";
entry.item[127].keywords = "$1000,appear,browser,byte,code,controls,create," +
                           "disabled,exited,file,frequency,generating," +
                           "generator,loading,location,log,made," +
                           "measurement,menu,need,page,pin,Port,program," +
                           "run,second,separate,signal,simulation," +
                           "Simulator,snapshot,starting,stop,stored,taking," +
                           "time,use,variable,view,waveform,window";
entry.item[127].page = "part18d2x.html";
entry.item[127].description = "Direct Frequency Measurement";
entry.item[128].keywords = "appear,area,browser,Click,code,controls,cursor," +
                           "disabled,display,emulator,example,exited,file," +
                           "generating,loading,log,make,page,run,SCI1," +
                           "separate,Simulator,snapshot,stop,taking," +
                           "terminal,type,used,window";
entry.item[128].page = "part22c2x.html";
entry.item[128].description = "Line Buffering";
entry.item[129].keywords = "appear,browser,button,code,contents,controls," +
                           "CPU,disabled,Display,execute,exited,file," +
                           "generating,instruction,loading,log,memory," +
                           "monitor,page,register,Registers,run,separate," +
                           "show,Simulator,snapshot,Step,stop,taking,time," +
                           "Use,values,view,window";
entry.item[129].page = "part3x.html";
entry.item[129].description = "The First 68HCS12 Example";
entry.item[130].keywords = "#-123,$00,$000,$0000,$00FF,$07,$10,$1000,$1001," +
                           "$1002,$1003,$100f,$1020,$1022,$1023,$11,$1100," +
                           "$1102,$12,$1200,$1202,$1203,$1210,$1220,$1230," +
                           "$1231,$1234,$20,$2000,$2001,$200F,$2010,$21," +
                           "$23,$2345,$25,$30,$32,$35,$37,$3FF,$40,$400," +
                           "$40f,$42,$43,$4567,$4C,$6655,$71,$7766,$7800," +
                           "$80,$8002,$8100,$C000,$C001,$E5002,$EF80,$FE00," +
                           "$FF,$FF00,$FFC0,$FFFFE,$FFFFF,A10x5,abort," +
                           "absval,access,accessing,accomplish," +
                           "accomplished,accomplishes,accumuator," +
                           "accumulated,Accumulation,accumulator," +
                           "accumulators,accurate,actual_value,ADC,add," +
                           "adda,ADDD,added,addend,adding,addition," +
                           "additional,additions,ADDR0,address,addresses," +
                           "addressing,Adjust,adjustable,ADVANCED," +
                           "advantage,advantages,affecting,algorithm,allow," +
                           "alternate,alternating,amount,and/or,answer," +
                           "answers,appendix,application,applied,apply," +
                           "approach,appropriate,arbitrary,architecture," +
                           "area,argument,arguments,Arithmetic,ARMCOP," +
                           "array,Arrays,ASCIF,ASCII,ASR,assemble," +
                           "assembler,assigned,assignment,Assume,Assuming," +
                           "assumption,assumptions,ATD,ATD0CTL3,ATD0CTL4," +
                           "ATD0CTL5,Atmel,attempt,AVE,average,AVR,back," +
                           "based,BCD,BDLC,BDM,belong,bidirectional," +
                           "big-endian,Binary,bit,bits,bits/second,blocks," +
                           "BNE,board,boards,boot,bootloader,both,bps,BRA," +
                           "branch,Branching,breadboard,break,breaking," +
                           "broken,browser,buffer,buffering,Build,built," +
                           "Bus,busses,busy,button,byte,bytes,byts,cable," +
                           "calculate,calculates,calculation,called," +
                           "calling,calls,capabilities,capability,capture," +
                           "carriage,carry,case,cause,caused,Celsius," +
                           "Central,change,changes,changing,Channel," +
                           "channels,char,character,Characteristics,chart," +
                           "check,checking,chip,choice,Circuit,clear,clock," +
                           "Clocks,CLRA,CNT0,CNT1,CNT2,CNT3,code,codes," +
                           "coding,column,columns,combination,combinations," +
                           "coming,command,commercial,communcation," +
                           "communicate,communicating,Communication," +
                           "Communications,compare,compared,Compile," +
                           "compiler,complement,complete,conditions," +
                           "configuration,configure,configured,configures," +
                           "configuring,connect,connected,connecting," +
                           "connection,considered,Considering,consuming," +
                           "contain,contained,contains,content,contents," +
                           "control,controlled,controlling,conversion," +
                           "conversions,Convert,converted,Converter," +
                           "converts,COP,COPCTL,copy,correct,corresponding," +
                           "corresponds,count,counter,counts,CPHA,CPOL,CPU," +
                           "CRC,Create,crystal,CS0,cycle,cycles,DAC,data," +
                           "DBNE,D-Bug12,DBUG-12,deca,DECB,decides,decimal," +
                           "Decision,decrease,decreased,decrement,defined," +
                           "defuzzification,degrees,delay,demonstrate," +
                           "Demonstration,depending,derived,Describe," +
                           "description,design,desired,details,detect," +
                           "determine,Development,device,devices,DEX,DEY," +
                           "DG256,differ,difference,differences,different," +
                           "differentiate,differs,difficult,digit,Digital," +
                           "digits,dimmensional,directives,disadvantages," +
                           "discussed,display,displays,distinction," +
                           "distinctive,divide,division,divisor," +
                           "documentation,don,down,DP256,DRAGON12," +
                           "Dragon-12,Dragon12-plus,drive,driven,dropping," +
                           "duty,dynamic,easiest,ECLK,edge,edges,ediv," +
                           "EEPROM,EEPROM/ROM,EEPROMs,effective,eight," +
                           "Electrical,eliminating,emptied,emul,enable," +
                           "enabled,end,ending,ends,engineer,Enhanced," +
                           "enter,entries,equal,equivalent,error," +
                           "evaluation,example,exchange,exchanged," +
                           "exclusive-or,execute,executed,executing," +
                           "execution,EXG,Expanded,expected,explain," +
                           "explicit,Extend,extended,External,factor," +
                           "Fahreheit,Fahrenheit,failure,falling,familiar," +
                           "families,family,faster,fastest,feature,FIFO," +
                           "figure,file,filled,filter,final,Finally,Find," +
                           "finished,First,five,flag,flash,flashes," +
                           "flipflop,Floating,followed,following,follows," +
                           "foo,form,formulas,forth,found,four,fractional," +
                           "framing,free,Freescale,frequency,full,function," +
                           "functionality,functions,fuzzification,Fuzzy," +
                           "Gated,General,generate,generated,generates," +
                           "generator,genint,Give,given,Global,GNU,going," +
                           "good,greater,guidelines,half,handle," +
                           "handshaking,handy,hardware,has/have,haveing," +
                           "HC12,HC597,HCS12,heartbeat,high,Hint,hobby," +
                           "hold,I/O,IDE,idle,IIC,illuminate,impedence," +
                           "implement,implemented,implements,important,inc," +
                           "INCA,inclusive,Increase,increased,increment," +
                           "index,Indicate,indicated,individual," +
                           "information,Infrared,initial,initialization," +
                           "initialize,initialized,initializing,initially," +
                           "input,Input/Output,inputs,instead,Instruction," +
                           "Instructions,insure,Integer,integers,Intel," +
                           "intended,Interface,interfaced,Interfaces," +
                           "Interfacing,Inter-Integrated,Internal," +
                           "interpolation,interrupt,interruptable," +
                           "Interrupts,Introduction,intterupt,invalid," +
                           "involve,INX,IRQ,Iteration,iterative,JMP,jsr," +
                           "justified,Key,kHz,know,Knowing,kx8,labeled,lag," +
                           "language,LAPSEDTIME,largest,last,later,LC16B," +
                           "ldaa,ldd,lead,leas,least,leave,leaving,LED," +
                           "LEDS,left,leftmost,length,less,library,light," +
                           "limitations,limits,Line,linefeed,lines,links," +
                           "Liquid,List,little-endian,Load,loaded,loads," +
                           "location,locations,lock,Logic,logical,long," +
                           "look,looked,loop,loop/process,loops,low,lower," +
                           "low-pass,LS74,LSB,LSBFE,LSTRB,LTC,LTC1661," +
                           "machine,machines,made,major,make,makes,manner," +
                           "manufacturers,mapped,Mapping,master,maximum," +
                           "MC68HC812A4,MC9S12DP256,meaning,means,measure," +
                           "measured,measured_value,measurement," +
                           "measurements,measuring,measurment,mechanical," +
                           "meet,memories,Memory,Memory/Peripheral,met,MHz," +
                           "Microchip,Microcontroller,microcontrollers," +
                           "microsecond,microseconds,millisecond,millivolt," +
                           "millivolts,minimal,minimum,mirrored,missing," +
                           "mistakes,Mode,models,modify,modulated," +
                           "Modulation,modulator,Module,Monitor,monitoring," +
                           "MOSI,motor,Move,movw,MSCAN,msec,much,multiple," +
                           "multiplication,Multiply,Name,named,names," +
                           "Narrow,necessary,need,needs,negative,never,new," +
                           "next,noise,Note,now,Number,numbers,observe," +
                           "Obtain,occur,odd,offset,ohm,open,operate," +
                           "operating,operation,operations,optimal,order," +
                           "org,original,oscillator,oscilloscope,output," +
                           "outputs,overflow,overhead,overrun,Overview," +
                           "overwrite,package,PACN3/PACN2,PACTL,PAD04," +
                           "PAD05,page,Parallel,parity,parses,parts,PDM," +
                           "peak-peak,per,Perform,performed,performing," +
                           "period,Peripheral,phase,physical,PIC18,pin," +
                           "Pins,PJ0,PLL,plus,Point,pointer,polling,Port," +
                           "Ports,position,positioning,positions,positive," +
                           "possible,potentially,power,power-on,PPAGE," +
                           "preceding,predicted,prescaler,present," +
                           "preserved,pressed,pressing,probably,problem," +
                           "Processes,Processing,produce,produced,produces," +
                           "product,program,programming,PROJECT,projects," +
                           "propagation,properly,protocol,provide,provided," +
                           "PRS0,PRS1,PRS2,PRS3,PRS4,PT7,PULD,pull," +
                           "pulldown,pulled,pull-up,pullup/pulldown," +
                           "pullups,Pulse,pulsed,pulses,Purpose,push," +
                           "pushbutton,pushbuttons,pushed,put,putting," +
                           "PWMDTY,question,Questions,quickly,radio,RAM," +
                           "RAMs,range,rate,rather,read,readings,reads," +
                           "real,received,receiver,recommended,record," +
                           "recording,reduce,reduced,re-entering,REFDV," +
                           "refer,reference,regardless,register,registers," +
                           "relationship,reload,remember,removed,Repeat," +
                           "repeatedly,replace,report,represent," +
                           "Representation,represented,representing," +
                           "represents,require,requirement,Research,reset," +
                           "Resets,resistor,resolution,Resource,respective," +
                           "respectively,responding,restore,result,results," +
                           "retrieved,Return,returned,returning,rev," +
                           "reverse,revision,revw,Rewrite,right," +
                           "right-justified,rightmost,rising,robotics,ROM," +
                           "roughly,Round,rounding,routine,routines,row," +
                           "rows,RS232,RS-232,RTI,rts,rule,Run,running," +
                           "runs,S19,saved,sawtooth,says,SC1BDH,SC1BDL," +
                           "scale,scale_factor,Scaled,scales,scaling,SCAN," +
                           "SCI,SCI0,SCI1,SCIISR,SCK,Second,seconds," +
                           "section,segments,select,selected,selection," +
                           "Semiconductor,send,sequence,sequences,Serial," +
                           "service,serviced,servo,setting,settings,setup," +
                           "seven,seven-segment,sheet,sheets,shift," +
                           "shifting,shop,short,should,Show,shown,shows," +
                           "signal,signals,signed,significant," +
                           "significantly,similarly,simplify,simulate," +
                           "simulating,simulator,simultaneously,sine," +
                           "single,size,skew,slave,slide,slow,small,solve," +
                           "source,space,special,specific,specifically," +
                           "specification,specifications,specified,speed," +
                           "SPI,SPI0,square,squarewave,staa,stab,Stack," +
                           "stand-alone,start,starting,starts,STARTTIME," +
                           "state,static,status,std,step,steps,still,stop," +
                           "Store,stored,stores,storing,strength,stretch," +
                           "string,strobe,structure,Study,stx,subroutine," +
                           "Subroutines,subtract,subtraction,sufficient," +
                           "Suggested,sum,supplied,sweep,swi,switch," +
                           "switches,synchronous,SYNR,SYSCLK,System,table," +
                           "Tables,take,taken,takes,task,TCNT,technique," +
                           "teh,tell,temperature,temperatures,ten,terminal," +
                           "terms,Test,tests,text,textbook,TFFCA,things," +
                           "three,three-state,time,timeint,timeout,Timer," +
                           "times,timing,toggle,toggled,Tools,top,transmit," +
                           "transmits,transmitted,transmitter,trap,Traps," +
                           "Trees,triggered,TSCR1,TSCR2,TTL,turn,turning," +
                           "two,type,types,unchanged,Under,underneath,Unit," +
                           "units,unsigned,unused,upper,uppoer,use,used," +
                           "uses,Using,val,value,values,variable,variables," +
                           "varies,vector,verification,verify,version,via," +
                           "volltage,volt,voltage,voltages,voltmeter,volts," +
                           "WAI,wait,waiting,waits,Wakeup,wav,wave," +
                           "waveform,way,ways,whenever,whether,wide,Width," +
                           "widths,wire,wired-or,wish,word,words,work," +
                           "works,worst,write,writes,writing,written,wrong," +
                           "XIRQ,xor,zero";
entry.item[130].page = "questions.html";
entry.item[130].description = "Questions for Designing with " +
                              "Microcontrollers -- The 68HCS12";
entry.item[131].keywords = "Accumulated,Addition,additional,Alarm,asm," +
                           "asymmetrical,best,board,Buffered,Buffering," +
                           "Calculation,Clock,Compare,Conversion,dbug12," +
                           "Debounced,definitions,development,Digital," +
                           "Direct,Displays,DRAGON12,Driven,EEPROM,Example," +
                           "executed,file,files,First,floating,following," +
                           "fplib,Freescale,Frequency,Generated,Generating," +
                           "generator,Hardware,iic,Implementing,inc," +
                           "include,Index,Interpolation,Interrupt," +
                           "Interrupts,Keyboard,language,library,Light," +
                           "Line,Machine,map,Measurements,Measuring,memory," +
                           "Meter,Mixed,Modulation,Multiple,Multiplexed," +
                           "Multiplication,Output,point,port,Precision," +
                           "Programs,provided,Pulse,registers,registersee," +
                           "replaces,require,results,Return,Root,Run," +
                           "Sample,Simple,simulator,Sine,Sources,SPI," +
                           "square,stand-alone,State,subroutines,Table," +
                           "text,Time,Timer,Traffic,used,View,wave,Waves," +
                           "Width,Widths";
entry.item[131].page = "sampl.html";
entry.item[131].description = "Sample Programs";
}

//----------------------------------------------------------- Scanner/Parser -

function getToken() {
// ***************************************************************************
// * Function...: getToken
// * Description: Get token out of inputform string
// ***************************************************************************

  cLiteral = "";
  while ((input.length > 0) && (input.substring(0,1) == " ")) {
    input = input.substring(1,input.length);
  }
  if ((input.substring(0,1) == "(") || (input.substring(0,1) == ")")) {
    cLiteral = input.substring(0,1);
    input = input.substring(1,input.length);
  }
  else {
    while ((input.length > 0) && (input.substring(0,1) != " ") &&
       (input.substring(0,1) != "(") && (input.substring(0,1) != ")")) {
      cLiteral = cLiteral + input.substring(0,1);
      input = input.substring(1,input.length);
    }
  }
  if (cLiteral.toUpperCase() == orTokenString) { 
    token = tOr 
  }
  else {
    if (cLiteral.toUpperCase() == andTokenString) { 
      token = tAnd 
    }
    else {
      if (cLiteral.toUpperCase() == notTokenString) { 
        token = tNot
      }
      else {
        if (cLiteral == "(") { 
          token = tParenthesisOpen
        }
        else {
          if (cLiteral == ")") { 
            token = tParenthesisClose
          }
          else {
            if ((input == "") && (cLiteral == "")) { 
              token = tEOF
            }
            else {
              token = tLiteral
            }
          }
        }
      }
    }
  };
}

function expression(inFound,layer) {
// ***************************************************************************
// * Function...: expression
// * Description: Parser starting point:
// *              (Parser priority: NOT, AND, OR)
// *              Expression ::= Term [[OR] Term]*
// *	          (Space interpreted like tOr).
// ***************************************************************************

  inFound = term(inFound,layer);
  while ((error == false) && ((token == tOr) || (token == tNot) ||           
         (token == tLiteral) || (token == tParenthesisOpen))) {
    if (token == tOr) { getToken() };          
    inFound = result_or(inFound,term(inFound,layer));
  }
  if ((layer == 0) && (token != tEOF)) { 
    showError(orNotExpectedString) 
  }
  return inFound;
}

function term(inFound,layer) {
// ***************************************************************************
// * Function...: term
// * Description: Parser: recursive down, 1st layer:
// *              Term ::= Not_faktor [AND Not_faktor]*
// ***************************************************************************

  inFound = nFactor(inFound,layer);
  while ((error == false) && (token == tAnd)) {
    getToken();
    inFound = result_and(inFound,nFactor(inFound,layer));
  }
  return inFound;
}

function nFactor(inFound,layer) {
// ***************************************************************************
// * Function...: nFactor
// * Description: Parser: recursive down, 2nd layer:
// *             Not_faktor ::= [NOT] Binary_faktor
// ***************************************************************************

  if (token == tNot) {
    getToken();
    inFound = result_not(bFaktor(inFound,layer));
  } 
  else {
    inFound = bFaktor(inFound,layer);
  }
  return inFound;
}

function bFaktor(inFound,layer) {
// ***************************************************************************
// * Function...: bFaktor
// * Description: Parser: recursive down, 3rd layer:
// *              Binary_faktor ::= Literal | (expression)
// ***************************************************************************

  if (token == tParenthesisOpen) {
    getToken();
    layer = layer + 1;
    inFound = expression(inFound,layer);
    if (token != tParenthesisClose) { showError(ParenthesisExpectedString) }; 
    getToken(); 
  }
  else {
    if (token == tLiteral) {
      inFound = searchKeyword(cLiteral);
      getToken();
    }
    else { showError(keywordExpectedString) };
  }
  return inFound;
}

function result_or(inResult,inResult2) {
// ***************************************************************************
// * Function...: result_or
// * Description: Return arrays; concatenate "or"
// ***************************************************************************

  var result = inResult.concat(inResult2);
  var found = new arrayCreate();
  for (var i = 0; i < result.length(); i++) {
    if (result.item[i].exists == false) { 
      found.add(result.item[i]); 
      for (var ii = i + 1; ii < result.length(); ii++) {
        if (result.item[ii].exists == false) {
          if (result.item[ii] == result.item[i]) {
            result.item[ii].exists = true;
          }
          else {
            if (result.item[ii].position == result.item[i].position) {
              result.item[ii].exists = true;
              found.item[found.length() - 1].addPerCent(
                                              result.item[ii].perCent);
              found.item[found.length() - 1].addKeyword(
                                              result.item[ii].keywords);
            }
          }
        }
      }
    }
  }
  return found;
}

function result_and(inResult,inResult2) {
// ***************************************************************************
// * Function...: result_and
// * Description: Return arrays; concatenate "and"
// ***************************************************************************

  var result = inResult.concat(inResult2);
  var found = new arrayCreate();
  for (var i = 0; i < result.length(); i++) {
    var created = false;
    if (result.item[i].exists == false) {
        for (var ii = i + 1; ii < result.length(); ii++) {
        if (result.item[ii].exists == false) {
          if (result.item[ii] == result.item[i]) {
            result.item[ii].exists = true;
          }
          else {
            if (result.item[ii].position == result.item[i].position) {
              result.item[ii].exists = true;
              if (created == false) {
                found.add(result.item[i]);
                created = true;
              }
              found.item[found.length() - 1].addPerCent(
                                              result.item[ii].perCent);
              found.item[found.length() - 1].addKeyword(
                                              result.item[ii].keywords);
            }
          }
        }
      }
    }
  }
  return found;
}

function result_not(inResult) {
// ***************************************************************************
// * Function...: result_not
// * Description: Return inverted result set of database
// ***************************************************************************

  var found = new arrayCreate();
  for (var i = 0; i < entry.length(); i++) {
    found.add(new foundCreate());
    found.item[found.length() - 1].position = i;
  }
  for (var i = 0; i < inResult.length(); i++) {
    for (var ii = 0; ii < found.length(); ii++) {
      if (found.item[ii].exists == false) {
        if (found.item[ii].position == inResult.item[i].position) {
          found.item[ii].exists = true;
        }
      }
    }
  }
  var result = new arrayCreate();
  for (var i = 0; i < found.length(); i++) {
    if (found.item[i].exists == false) {
      result.add(found.item[i]);
    }
  }
  return result;
}

function showError(text) {
// ***************************************************************************
// * Function...: showError
// * Description: Parser: Show error position in input form string 
// *                      ("<" used)
// ***************************************************************************

  if (error == false) {
    if (input.length == 0) {
      cInputRef.value = cInput + "<";
    }
    else {
      cInputRef.value = 
         cInput.substring(0,cInput.lastIndexOf(input,
                            cInput.length)) + "<" + 
         cInput.substring(cInput.lastIndexOf(input,
                            cInput.length),cInput.length);
    }
    alert(wrongInputString + text + lookString);
  }
  error = true;
}

//------------------------------------------------------------------- Output -

function outputWindow(html) {
// ***************************************************************************
// * Function...: outputWindow
// * Description: Write HTML to output window
// ***************************************************************************

  parent.searchoutput.document.write(html);
}

function header() {
// ***************************************************************************
// * Function...: header
// * Description: Show header of hit list
// ***************************************************************************

  if ((cBeginOfWord == true) && (cCaseSensitive == true)) {
    var input = "<b>" + cInput + "</b><br>" + beginCaseString;
  }
  else { 
    if (cCaseSensitive == true) {
      var input = "<b>" + cInput + "</b><br>" + caseString;
    }
    else {
      if (cBeginOfWord == true) { 
        input = "<b>" + cInput + "</b><br>" + beginString;
      }
      else { 
        var input = "<b>" + cInput + "</b>";
      }
    }
  }
  outputWindow('<HTML><HEAD><TITLE>' + 
     hitlistTitleString + '</TITLE></HEAD><BODY TEXT="' + textColor + 
     '" LINK="' + linkColor + '" VLINK="' + vLinkColor + '" ALINK="' + 
     aLinkColor + '" BGCOLOR="' + backgroundColor + '" BACKGROUND="' + 
     backgroundImage + '"><TABLE BORDER="0" ALIGN="center" WIDTH="' + 
     tableWidth + 
     '" CELLSPACING="2" CELLPADDING="0"><TBODY><TR><TD COLSPAN="5" BGCOLOR="' + 
     tableOuterColor + '"><FONT SIZE="' + charSmaller + '" FACE="' + charset + 
     '"><p ALIGN="right">' + ++run + '. ' + searchString + '</p>' + input + 
     '</FONT></TD></TR><TR><TD BGCOLOR="' + tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="1" HEIGHT="1" BORDER="0"></TD><TD BGCOLOR="' + 
     tableColor + '"><FONT SIZE="' + charNormal + '" FACE="' + charset + 
     '">' + perCentString + '</FONT></TD><TD BGCOLOR="' + tableColor + 
     '"><FONT SIZE="' + charNormal + '" FACE="' + charset + '">' + 
     keywordString + '</FONT></TD><TD BGCOLOR="' + tableColor + 
     '"><FONT SIZE="' + charNormal + '" FACE="' + charset + '">' + 
     descriptionString + '</FONT></TD><TD BGCOLOR="' + tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="5" HEIGHT="0" BORDER="0"></TD></TR>');
}

function noEntry() {
// ***************************************************************************
// * Function...: noEntry
// * Description: No entry found
// ***************************************************************************

  outputWindow('<TR><TD BGCOLOR="' + tableColor + 
     '">-</TD><TD><center><FONT SIZE="' + charNormal + '" FACE="' + 
     charset + '">0%</font></center></TD><TD><FONT SIZE="' + charNormal + 
     '" FACE="' + charset + '">---</font></TD><TD><FONT SIZE="' + charNormal + 
     '" FACE="' + charset + '">' + noEntriesString + 
     '</font></TD><TD BGCOLOR="' + tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="5" HEIGHT="0" BORDER="0"></TD></TR>');
}

function line(found,perCent,keyword,page,description) {
// ***************************************************************************
// * Function...: line
// * Description: Show line of hit list
// ***************************************************************************

  if (cNoInputForm == false) {
    outputWindow('<TR><TD VALIGN="TOP" BGCOLOR="' + 
        tableColor + '"><FONT SIZE="' + charNormal + '" FACE="' + charset + 
        '">' + found + '.</font></TD><TD VALIGN="TOP"><center><FONT SIZE="' + 
        charNormal + '" FACE="' + charset + '">' + perCent + 
        '%</font></center></TD><TD VALIGN="TOP"><A HREF="' + linkTarget + page + 
        linkTarget2 + '"><FONT SIZE="' + charNormal + '" FACE="' + charset + '">' +
        keyword + '</font></A></TD><TD VALIGN="TOP"><FONT SIZE="' + 
        charNormal + '" FACE="' + charset + '">' + description + 
        '</font></TD><TD BGCOLOR="' + tableColor + 
        '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="5" HEIGHT="0" BORDER="0"></TD></TR>');
  }
  else {
    outputWindow('<TR><TD VALIGN="TOP" BGCOLOR="' + 
        tableColor + '"><FONT SIZE="' + charNormal + '" FACE="' + charset + 
        '">' + found + '.</font></TD><TD VALIGN="TOP"><center><FONT SIZE="' + 
        charNormal + '" FACE="' + charset + '">' + perCent + 
        '%</font></center></TD><TD VALIGN="TOP"><A HREF="' + linkTarget + page + 
        linkTarget2 + '" TARGET="_parent"><FONT SIZE="' + charNormal + 
        '" FACE="' + charset + '">' + keyword + 
        '</font></A></TD><TD VALIGN="TOP"><FONT SIZE="' + charNormal + 
        '" FACE="' + charset + '">' + description + 
        '</font></TD><TD BGCOLOR="' + tableColor + 
        '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="5" HEIGHT="0" BORDER="0"></TD></TR>');
  }
}

function footer() {
// ***************************************************************************
// * Function...: footer
// * Description: Show footer of hit list
// ***************************************************************************

  outputWindow('<TR><TD BGCOLOR="' + tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="0" HEIGHT="5" BORDER="0"><TD BGCOLOR="' + 
     tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="0" HEIGHT="5" BORDER="0"><TD BGCOLOR="' + 
     tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="0" HEIGHT="5" BORDER="0"><TD BGCOLOR="' + 
     tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="0" HEIGHT="5" BORDER="0"><TD BGCOLOR="' + 
     tableColor + 
     '"><IMG SRC="pixel.gif" HSPACE="0" VSPACE="0" ALIGN="LEFT" WIDTH="0" HEIGHT="5" BORDER="0"></TD></TR><TR><TD VALIGN="TOP" BGCOLOR="' + 
     tableOuterColor + '" COLSPAN="5"><FONT SIZE="' + charSmaller + 
     '" FACE="' + charset + '">' + lastUpdateString + lastupdate + 
     copyrightString + '</FONT></TD></TR></TBODY></TABLE><br><br></BODY></HTML>');
}

function hitlist(found) {
// ***************************************************************************
// * Function...: hitlist
// * Description: Show hit list
// ***************************************************************************

  if (found.length() == 0) { 
    noEntry();
  }
  else {
    for (var i = found.length() - 1; i > -1; i--) {
      line(i + 1,found.item[i].perCent,found.item[i].keywords,
            entry.item[found.item[i].position].page,
            entry.item[found.item[i].position].description);
    }
  }
}

//------------------------------------------------------------------- Search -

function toUpperCaseUmlaute(inputKeyword) {
// ***************************************************************************
// * Function...: toUpperCaseUmlaute
// * Description: UpperCase + Umlaute workaround
// ***************************************************************************

  inputKeyword = inputKeyword.toUpperCase();
  for (var i = 0;i < charsSmall.length;i++) {
    var pos = inputKeyword.indexOf(charsSmall[i]);
    while (pos > -1) {
      inputKeyword = inputKeyword.substring(0,pos) +
                       charsLarge[i] + inputKeyword.substring(pos +
                       1,inputKeyword.length); 
      pos = inputKeyword.indexOf(charsSmall[i],pos + 1);
    }
  }
  return inputKeyword;
}

function searchKeyword(input) {
// ***************************************************************************
// * Function...: keywordsSearch
// * Description: Compare keyword with database entries
// ***************************************************************************

  var found = new arrayCreate();
  var inputKeyword = new String(input);
  if (cCaseSensitive != true) { 
    inputKeyword = toUpperCaseUmlaute(input);
  }
  for (var i = 0 ; i < entry.length(); i++) {
    if (glossaryMode == true) {
      var entryGlossary = new String(entry.item[i].keywords);
      var entryKeyword = new String();
      var separatorBefore = -1;
      var separatorAfter = entryGlossary.indexOf(",",pos); 
      while (separatorAfter > -1) {
        entryKeyword += g[entryGlossary.substring(separatorBefore + 1,
                            separatorAfter)] + ",";
        separatorBefore = separatorAfter;
        separatorAfter = entryGlossary.indexOf(",",separatorAfter + 1);
      }
      entryKeyword += g[entryGlossary.substring(separatorBefore + 1,
                        entryGlossary.length)];

      entryKeyword = entryKeyword.substring(0,entryKeyword.length);
    } 
    else {
      var entryKeyword = new String(entry.item[i].keywords);
    }
    var entryKeywordOutput = entryKeyword;
    if (cCaseSensitive != true) { 
      entryKeyword = toUpperCaseUmlaute(entryKeyword);
    }
    var created = false;  // true == found entry is created
    var pos = entryKeyword.indexOf(inputKeyword);
    while (pos > -1) {
      var separatorBefore = entryKeyword.lastIndexOf(",",pos);
      var separatorAfter = entryKeyword.indexOf(",",pos); 
      if (separatorAfter < 0) { separatorAfter = entryKeyword.length };
      var entryKeywordSingle = entryKeyword.substring(separatorBefore + 1,
                                    separatorAfter);
      var entryKeywordSingleOutput = entryKeywordOutput.substring(separatorBefore + 1,
                                    separatorAfter);
      var perCent = 100;
      if ((entryKeywordSingle.length - input.length > 0)) {
        perCent = Math.round((input.length / entryKeywordSingle.length) * 100);
      }
      var posKeywordSingle = entryKeywordSingle.indexOf(inputKeyword);
      entryKeywordSingle = entryKeywordSingleOutput.substring(0,posKeywordSingle) + 
         "<b>" + entryKeywordSingleOutput.substring(posKeywordSingle,
         posKeywordSingle + input.length) + "</b>" + 
         entryKeywordSingleOutput.substring(posKeywordSingle + input.length,
         entryKeywordSingle.length);
      if (created == false) {
        if (cBeginOfWord == true) {
          if (posKeywordSingle == 0) {
            created = true;
            found.add(new foundCreate());
            found.item[found.length() - 1].position = i;
            found.item[found.length() - 1].keywords = entryKeywordSingle;
            found.item[found.length() - 1].perCent = perCent;
          }
        }
        else {
          created = true;
          found.add(new foundCreate());
          found.item[found.length() - 1].position = i;
          found.item[found.length() - 1].keywords = entryKeywordSingle;
          found.item[found.length() - 1].perCent = perCent;
        }
      }
      else {
        if (cBeginOfWord == true) {
          if (posKeywordSingle == 0) {
            found.item[found.length() - 1].position = i;
            found.item[found.length() - 1].addKeyword(entryKeywordSingle);
            found.item[found.length() - 1].addPerCent(perCent);
          }
        }
        else {
          found.item[found.length() - 1].position = i;
          found.item[found.length() - 1].addKeyword(entryKeywordSingle);
          found.item[found.length() - 1].addPerCent(perCent);
        }
      }
      pos = entryKeyword.indexOf(inputKeyword,separatorAfter);
    }
  }
  return found;
}

function search(inInputRef,inInputText,inBeginOfWord,inCaseSensitive,inHitlist,inNoInputForm) {
// ***************************************************************************
// * Function...: search
// * Description: Start search after submit                      
// ***************************************************************************

  if (inInputRef != null) {
    cInputRef = inInputRef; 
    cInput = inInputText;     
  }
  if (inBeginOfWord != null) {
    cBeginOfWord = inBeginOfWord; 
  }
  if (inCaseSensitive != null) {
    cCaseSensitive = inCaseSensitive;   
  }
  if (inHitlist != null) {
    cHitlist = inHitlist;   
  }
  if (inNoInputForm != null) {
    cNoInputForm = inNoInputForm;   
  }
  var found = new arrayCreate();
  if (cInput == "") { 
    alert(enterKeywordString);
    return;
  };
  if (cHitlist != true) {                   // Clear window
    eval(outputWindowRef + 'document.open("text/html")'); 
  };
  header();                                                             
  error = false;
  input = cInput;
  getToken();
  var layer = 0;
  found = expression(found,layer);
  if (error == false) {
    found.sort(sortPerCent);
    hitlist(found);
  }
  else {
    noEntry();
  }
  footer();
  if (cHitlist != true) {                      // Close output stream and
   eval(outputWindowRef + 'document.close()'); // stop blinking in browser
  }                                            // footer
}
