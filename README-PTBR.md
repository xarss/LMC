<div align="center" style="background-color: #464d7b; margin-bottom: 15px; user-select:none">
  <img src="android-chrome-512x512.png" width="60px"/>
</div>

<div align="center">

  <h1> Little Man Computer </h1>

  [PTBR Documentation](README-PTBR.md)
  | <a href="https://xarss.github.io/LMC/" target="_blank"> Simulador </a>
  | [Commands](#commands-and-structure)

  <img src="https://img.shields.io/badge/Versão-1.0-303060"/>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-9cf"/>
  <img src="https://img.shields.io/badge/Compatibilidade-Desktop-9cf"/>

 </div>

# Objetivo


* O Little Man Computer (LMC) fornece um modelo simplificado de um computador, tornando-se uma ferramenta de ensino de fácil compreensão para estudantes de ciência da computação e programação.

* Ao trabalhar com o LMC, os alunos adquirem uma compreensão mais profunda da arquitetura de computadores e dos conceitos básicos de pipeline, que são conceitos fundamentais na ciência da computação.

* A abordagem prática de programação com o LMC proporciona experiência prática que pode ser aplicada no projeto e otimização de sistemas computacionais do mundo real.


# Sobre nós

Nós somos estudantes de Ciência da Computação do terceiro semestre na Pontifícia Universidade Católica do Paraná (PUCPR). Este projeto foi um desafio proposto pelo professor Frank de Alcântara na disciplina de Desempenho em Sistemas Ciberfísicos.

# Comandos e Estrutura

## Programando para o LMC

Os códigos para o Computador do Homem Pequeno são um conjunto de instruções simples que simulam as instruções de um computador real. O LMC possui um acumulador que mantém um valor para operações.

### Aqui estão alguns exemplos simples de códigos para o LMC que utilizam a maioria de suas características.
Este código recebe uma entrada e conta de forma decrescente até 0.


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

Esse codigo soma os dois numeros dados.
```js
	INP
	STA	number     
	INP     
	ADD	number
	OUT
	HLT

number	DAT
```

## Rótulos

Rótulos podem ser usados para aumentar a complexidade do código, aplicar condições ou loops.
Para criar um rótulo, digite qualquer nome seguido por ":" e o primeiro comando que deve ser executado ao pular para o rótulo.

### Criando rótulos

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

Para pular para um determinado rótulo, utilize comandos [jump](#jumps).

## Todos os Comandos


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

> Comando: INP
> 
> OPCODE: 901

Pegará a próxima entrada do usuário e a adicionará ao acumulador.
Se não houver mais entradas, o valor adicionado ao acumulador será 0.

### Uso

```bash
# User input: 1 | 2 | 3

  INP

# User input: 1 | 2
# Accumulator: 3
```

## Output

> Comando: OUT
> 
> OPCODE: 902

Adicionará à lista de saída o valor do acumulador

### Uso

```bash
# Output: 2 | 3
# Accumulator: 1

  OUT
  
# Output: 1 | 2 | 3
```

## Add

> Comando: ADD [ pos ]
> 
> OPCODE: 1xx

Adicionará ao acumulador o valor localizado na posição especificada.

### Uso

```bash
# Accumulator: 2
# Value at postion 3: 5

  ADD 3
  
# Accumulator: 7
```
## Subtract

> Comando: SUB [ pos ]
> 
> OPCODE: 2xx

Subtrairá do acumulador o valor localizado na posição especificada.

### Uso

```bash
# Accumulator: 7
# Value at postion 3: 5

  SUB 3
  
# Accumulator: 2
```
## Load

> Comando: LDA [ pos ]
> 
> OPCODE: 5xx

Carregará o valor dentro de um slot de RAM para o acumulador.

### Uso

```bash
# Value at position 3: 5

  LDA 3
  
# Accumulator: 5
```
## Store

> Comando: STA [ pos ]
> 
> OPCODE: 3xx

Armazenará o valor atual do acumulador na posição de RAM especificada.

### Uso

```bash
# Accumulator: 2

  STA 3
  
# Valor na posição 3: 2
```

## Dat

> Comando: [ nome ] DAT (opcional: [ valor ]) 
> 
> OPCODE: Nenhum

Nomeará um Slot de RAM. Este comando não é executado quando o código está rodando, apenas antes, quando carregando o código para a RAM.
É possível passar um valor inicial. Este comando deve ser adicionado APÓS o fim do código.

### Uso

```bash
x DAT
y DAT 12

# No primeiro espaço livre apos os comandos: espaço RAM chamado x, valor: 000
# No segundo espaço livre apos os comandos: espaço RAM chamado y, valor: 12
```
### Ao usar DAT, os comandos aceitam o nome da posição

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

Existem três tipos de saltos. Todos os saltos irão para o [rótulo](#rótulos) especificado se as condições forem cumpridas.

### Branch Always

> Comando: BRA [ Rótulo ]
> 
> OPCODE: 6xx

Sempre ramificará para o rótulo especificado

#### Uso

```bash
      BRA exit

exit  HLT
```
### Branch If Positive

> Comando: BRP [ Rótulo ]
> 
> OPCODE: 8xx

Só ramificará para o rótulo especificado se o valor do acumulador for positivo.

#### Uso

```bash
# Accumulator value: 1
      BRP exit

exit  HLT
```
### Branch if Zero

> Comando: BRZ [ Rótulo ]
> 
> OPCODE: 7xx

Só ramificará para o rótulo especificado se o valor do acumulador for positivo.

#### Uso

```bash
# Accumulator value: 0
      BRZ exit

exit  HLT
```
## Halt

> Comando: HLT 
> 
> OPCODE: 000

Parará a execução do código.
