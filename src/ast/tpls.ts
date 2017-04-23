export default {
  encode: `var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (function (doNotSkipEncoded) {
    var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
      matchHTML = doNotSkipEncoded ? /[&<>"'\\/]/g : /&(?!#?\\w+;)|<|>|"|'|\\//g;
    return function(code) {
      return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
    };
  }());`
}
