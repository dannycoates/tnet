function parse (string) {
	console.assert(typeof string === 'string', "Parse only accepts a string")
	var data = parsePayload(string)
	var value = null
	switch (data.type) {
		case '#':
			value =  +data.value
			break;
		case '}':
			value = parseObject(data.value)
			break;
		case ']':
			value = parseArray(data.value)
			break;
		case '!':
			value = (data.value === "true")
			break;
		case '^':
			value = +data.value
			break;
		case '~':
			console.assert(data.value.length === 0, "Payload must be 0 length for null.")
			break;
		case ',':
			value = data.value
			break;
		default:
			console.assert(false, "Invalid payload type: " + data.type)
	}
	return {
		value: value,
		rest: data.rest
	}
}

function parsePayload (string) {
	console.assert(string.length > 0, "string can't be empty")
	var i = string.indexOf(':')
	var length = +(string.substr(0, i))
	var data = string.substr(i + 1)
	var x = {}

	x.value = data.substr(0, length)
	x.type = data.substr(length, 1)
	x.rest = data.substr(length + 1)

	console.assert(x.type, "No payload type: " + x.value + ", " + x.type)
	console.assert(x.value.length === length, "Data is wrong length, expected: " + length + " got: " + x.value.length)

	return x
}

function parseArray (string) {
	var result = [], x = { rest: string }
	if (string.length === 0) return result
	do {
		x = parse(x.rest)
		result.push(x.value)
	} while (x.rest)
	return result
}

function parseObject (string) {
	var result = {}, pair = { rest: string }
	if (string.length === 0) return result
	do {
		pair = parsePair(pair.rest)
		result[pair.key] = pair.value
	} while (pair.rest)
	return result
}

function parsePair (string) {
	var k = parse(string)
	console.assert(typeof(k.value) === "string", "Keys can only be strings.")
	console.assert(k.rest, "Unbalanced Object")
	var v = parse(k.rest)
	return {
		key: k.value,
		value: v.value,
		rest: v.rest
	}
}

function stringify(data) {
	var str, type, t = typeof(data)
	if (t === "string" || data instanceof String) {
		str = data;
		type = ','
	}
	else if (t === "number") {
		str = '' + data
		if (Math.floor(data) === data) {
			type = '#'
		}
		else {
			type = '^'
		}
	}
	else if (t === "boolean") {
		str = data ? "true" : "false"
		type = '!'
	}
	else if (data === null || data === undefined) {
		str = ''
		type = '~'
	}
	else if (Array.isArray(data)) {
		str = stringifyArray(data)
		type = ']'
	}
	else if (t === "object") {
		str = stringifyObject(data)
		type = '}'
	}
	return str.length + ':' + str + type;
}

function stringifyArray (array) {
	return array.map(stringify).join('')
}

function stringifyObject (object) {
	var k, v, result = [], keys = Object.keys(object)
	for (var i = 0; i < keys.length; i++) {
		k = keys[i]
		v = object[k]
		result.push(stringify(k))
		result.push(stringify(v))
	}
	return result.join('')
}

exports.parse = function (string, options) {
	if (options && options.includeRest) {
		return parse(string);
	}
	return parse(string).value;
}
exports.stringify = stringify