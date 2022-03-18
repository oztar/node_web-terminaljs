'use strict'

module.exports = {
    color: function(m,color){
	return '[[;'+color+';]'+m+']';
    },
    bold: function(m) {
        return '[[b;rgba(255,255,255,0.9);]'+m+']';
    },
    overline: function() {
        return '[[o;;]'+m+']';
    },
    strike: function() {
        return '[[s;;]'+m+']';
    },
    underline: function() {
        return '[[u;;]'+m+']';
    },
    glow: function() {
        return '[[g;;]'+m+']';
    },
    italic: function() {
        return '[[i;;]'+m+']';
    },
    link: function(m,attrs) {
        return '[[!;;;;' + attrs.href + ']'+m+']';
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
	    txt = j.core.color(txt,color);
	}
	while( spaces > 0){
	    txt +="\t";
	    --spaces;
	}
	return txt;
    }
}

