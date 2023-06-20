<div align="center" style="background-color: #464d7b; margin-bottom: 15px; user-select:none">
  <img src="android-chrome-512x512.png" width="60px"/>
</div>

<div align="center">

  <h1> Little Man Computer </h1>

  [PTBR Documentation](README-PTBR.md)
  | <a href="https://xarss.github.io/LMC/" target="_blank"> Simulator </a>
  | [Commands](#commands-and-structure)

  <img src="https://img.shields.io/badge/Version-1.0-303060"/>
  <img src="https://img.shields.io/badge/Status-Under%20Development-9cf"/>
  <img src="https://img.shields.io/badge/Compatibility-Desktop-9cf"/>

 </div>

# Objective

* The Little Man Computer (LMC) provides a simplified model of a computer, making it an easy-to-understand teaching tool for computer science and programming students.

* Through working with the LMC, students gain a deeper understanding of computer architecture and the basics of pipelining, which are fundamental concepts in computer science.

* The hands-on approach to programming with the LMC provides practical experience that can be applied in real-world computer systems design and optimization.

# About us

We are third-semester Computer Science students at the Pontifical Catholic University of Paraná (PUCPR). This project was a challenge proposed by Professor Frank de Alcantara in the subject Performance in Cyber-Physical Systems.

# Commands and Structure

## Writting for LMC

Codes for Little Man Computers are a set of simple instructions that simulate the instructions of a real computer. The LMC has an accumulator, that keeps one value for operations.

### Here are some simple LMC codes that use most of its features.
This code takes one input and counts from it to 0.

```js
	INP
loop	OUT
	STA count
	SUB one
	STA count
	BRP loop
	HLT

one     DAT 1
count	DAT
```

This code adds the inputed numbers
```js
	INP
	STA	number     
	INP     
	ADD	number
	OUT
	HLT

number	DAT
```

## Labels

Labels can be used to increase the complexity of the code, to apply conditions or loops.
To create a label, type any name followed by ":" and the first command that should be excecuted when jumped to the label.

### Creating labels
```bash
#Label named "label1"
label1    OUT
          HLT

#Label named "label2"
label2    HLT

#Label named "anyname"
anyname   INP
          HLT
```

To branch to a certain label use [jump](#jumps) commands.

## All Commands

<table width="100%" style="font-size:large">

<tr width="100%">
  <td width="33%" align="top">
  
  * [Input](#input)
  * [Output](#output)
  * [Halt](#halt)
  
  </td>
  <td width="33%" align="top">
  
  * [Add](#add)
  * [Subtract](#subtract)
  * [Jumps](#jumps)
  
  </td>
  <td width="33%" align="top">
  
  * [Store](#store)
  * [Load](#load)
  * [Dat](#dat)

  </td>
</tr>

</table>

## Input

> Command: INP
> 
> OPCODE: 901

Will take the next user input and add it to the accumulator.
If there are no more inputs, the value added to the accumulator will be 0.

### Usage

```bash
# User input: 1 | 2 | 3

  INP

# User input: 1 | 2
# Accumulator: 3
```

## Output

> Command: OUT
> 
> OPCODE: 902

Will add to the output list the accumulator value



### Usage

```bash
# Output: 2 | 3
# Accumulator: 1

  OUT
  
# Output: 1 | 2 | 3
```

## Add

> Command: ADD [ pos ]
> 
> OPCODE: 1xx

Will add the value located at the specified position to the accumulator.



### Usage

```bash
# Accumulator: 2
# Value at postion 3: 5

  ADD 3
  
# Accumulator: 7
```

## Subtract

> Command: SUB [ pos ]
> 
> OPCODE: 2xx

Will subtract the value located at the specified position to the accumulator.



### Usage

```bash
# Accumulator: 7
# Value at postion 3: 5

  SUB 3
  
# Accumulator: 2
```

## Load

> Command: LDA [ pos ]
> 
> OPCODE: 5xx

Will load the value inside a RAM Slot to the accumulator.

### Usage

```bash
# Value at position 3: 5

  LDA 3
  
# Accumulator: 5
```

## Store

> Command: STA [ pos ]
> 
> OPCODE: 3xx

Will store the current accumulator value inside the specified RAM position.

### Usage

```bash
# Accumulator: 2

  STA 3
  
# Value at position 3: 2
```

## Dat

> Command: LDA [ pos ]
> 
> OPCODE: 5xx

Will load the value inside a RAM Slot to the accumulator.

### Usage

```bash
# Value at position 3: 5

  LDA 3
  
# Accumulator: 5
```

## Store

> Command: [ name ] DAT (optional: [ value ]) 
> 
> OPCODE: None

Will name a RAM Slot. This command is not executed when the code is running, only before, when loading the code to the RAM.
It is possible to pass a initial value. This command should be added AFTER the end of the code.

### Usage

```bash
x DAT
y DAT 12

# On the first free slot after the commands: RAM slot named x, value: 000
# On the second free slot after the commands: RAM slot named y, value: 12
```
### When using DAT, commands accept the position name

```js
      LDA x
      STA y
      ADD z
      SUB name

x     DAT
y     DAT
z     DAT 1
name  DAT 3
```

## Jumps

There are three types of jumps. All jumps will go to the specified [label](#labels) if the conditions are met.

### Branch Always

> Command: BRA [ Label ]
> 
> OPCODE: 6xx

Will always branch to the specified label

#### Usage

```bash
      BRA exit

exit  HLT
```

### Branch if Positive

> Command: BRP [ Label ]
> 
> OPCODE: 8xx

Will only branch to the specified label if the accumulator value is positive.

#### Usage

```bash
# Accumulator value: 1
      BRP exit

exit  HLT
```

### Branch if Zero

> Command: BRZ [ Label ]
> 
> OPCODE: 7xx

Will only branch to the specified label if the accumulator value is positive.

#### Usage

```bash
# Accumulator value: 0
      BRZ exit

exit  HLT
```
## Halt

> Command: HLT 
> 
> OPCODE: 000

Will halt the execution of the code.
