# tnet.js

An implementation of [TNetStrings](http://tnetstrings.org) for node.js

# Install

	$ npm install tnet

# Usage

```javascript

var Tnet = require('tnet')

// Parse

"hello" === Tnet.parse("5:hello,")
true === Tnet.parse("4:true!")
99 === Tnet.parse("2:99#")
1.01 === Tnet.parse("4:1.01^")
null === Tnet.parse("0:~")
{count:99} === Tnet.parse("13:5:count,2:99#}")
['A','B','C'] === Tnet.parse("12:1:A,1:B,1:C,]")

// Stringify

Tnet.stringify("hello") === "5:hello,"
Tnet.stringify(true) === "4:true!"
Tnet.stringify(99) === "2:99#"
Tnet.stringify(1.01) === "4:1.01^"
Tnet.stringify(null) === "0:~"
Tnet.stringify({count:99}) === "13:5:count,2:99#}"
Tnet.stringify(['A','B','C']) === "12:1:A,1:B,1:C,]"

```