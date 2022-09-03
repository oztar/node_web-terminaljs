'use strict'

module.exports = {
    color: function(m,color){
	return '[[;'+color+';]'+JSON.stringify(m)+']';
    },
    bold: function(m) {
        return '[[b;rgba(255,255,255,0.9);]'+JSON.stringify(m)+']';
    },
    overline: function() {
        return '[[o;;]'+JSON.stringify(m)+']';
    },
    strike: function() {
        return '[[s;;]'+JSON.stringify(m)+']';
    },
    underline: function() {
        return '[[u;;]'+JSON.stringify(m)+']';
    },
    glow: function() {
        return '[[g;;]'+JSON.stringify(m)+']';
    },
    italic: function() {
        return '[[i;;]'+JSON.stringify(m)+']';
    },
    link: function(m,attrs) {
        return '[[!;;;;' + attrs.href + ']'+JSON.stringify(m)+']';
    },
    teal : function(m,color = 'black'){
	return "[[gb;teal;'+color+']" + m + "]";
    },
    col : function(txt,spaces,color,max){
	if( max){
	    txt= txt.substring(0,10);
	}
	if(txt.length < 4){
	    spaces +=3;
	}else if( txt.length < 8){
	    spaces +=2;
	}else{
	    ++spaces;
	}
	
	if( color !== undefined){
	    txt = '[[;'+color+';]'+JSON.stringify(txt)+']';
	}
	while( spaces > 0){
	    txt +="\t";
	    --spaces;
	}
	return txt;
    }
}

