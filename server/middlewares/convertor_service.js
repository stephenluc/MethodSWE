function toCents(str) {
    return parseInt(str.replace("$", "").replace(".", ""));
}

function dollarToCents(num) {
	return num * 100;
}

function toDollarNum(num) {
	return (num / 100).toFixed(2);
}

function toDollarStr(num) {
    return "$" + (num / 100).toLocaleString(undefined, {minimumFractionDigits: 2});
}

function toList(value) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

module.exports = { toCents, dollarToCents, toDollarNum, toDollarStr, toList }
