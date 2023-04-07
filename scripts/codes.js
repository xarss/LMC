codes = {};

codes["add2"] = `\tINP
\tSTA\tnumber     
\tINP     
\tADD\tnumber
\tOUT
\tHLT\n\nnumber\tDAT`;

codes["countdown"] = `\tINP\nloop:\tOUT
\tSTA\tcount
\tSUB\tone
\tSTA\tcount
\tBRP\tloop
\tHLT\n\none\tDAT\t1\ncount\tDAT`;

codes["sort3"] = `\tINP
\tSTA\tfirst
\tINP
\tSTA\tsecond
\tINP
\tSTA\tthird
\tBRA\tloop
loop:\tLDA\tfirst
\tSUB\tsecond
\tBRP\tswapf
\tLDA\tsecond
\tSUB\tthird
\tBRP\tswaps
\tLDA\tfirst
\tOUT
\tLDA\tsecond
\tOUT
\tLDA\tthird
\tOUT
\tHLT
swapf:\tLDA\tfirst
\tSTA\ttemp
\tLDA\tsecond
\tSTA\tfirst
\tLDA\ttemp
\tSTA\tsecond
\tBRA\tloop
swaps:\tLDA\tsecond
\tSTA\ttemp
\tLDA\tthird
\tSTA\tsecond
\tLDA\ttemp
\tSTA\tthird
\tBRA\tloop\n
first\tDAT
second\tDAT
third\tDAT
temp\tDAT`;
   
