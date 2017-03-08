function stringsRearrangement(Y) {
	for (var i = 1; i < Y.length; i++) {
		if (Y[i].length !== Y[0].length) {
			return false;
		}
	}
	var Z = Y.filter(function(t, p) {
    return Y.indexOf(t) == p;
	});
    if ( Y.length != Z.length && (O(Y.length) === 0 && O(Z.length) === 1)) {
		return false;
	} else {
	
		Z.sort();
    
		var a = 0;
		
		for (i = 1; i < Z.length; i++) {
				f = Z[i-1].split("");
				s = Z[i].split("");
				for (k = 0; k < f.length; k++) {
					if ( f[k] !== s[k] ) {
						a += 1;
					}
				}
		}
		if ((a + (Z.length - Y.length)) !== Y.length - 1) {
			return false;
		}
}
	return true;
}

function O(n) {return n % 2;}

 ['aby', 'ayy', 'aby', 'abc', 'xbc', 'xxc', 'xbc']

"<div class='pindiv_pinWrapper' bg-image='" + pinobj.data[i].image.original.url + "'> 	
<div class='pindiv_pinWrapper_content' style='background-color: " + pinobj.data[i].color + ";width:" + pin_columnsize + "px;height:" + pinobj.data[i].image.original.height * pin_columnsize / 237 + "px;'> 	
<a class='pindiv_pinWrapper_pinlink' target='_blank' style='width:" + pin_columnsize + "px;height:" + Math.floor((pinobj.data[i].image.original.height - 40) * pin_columnsize / 237) + "px' href='" + pinobj.data[i].url + "'></a> 	
<a class='pindiv_pinWrapper_sourcelink' target='_blank' href='" + pinobj.data[i].original_link + "'>" + parsePinUrl(pinobj.data[i].original_link) + "</a> </div> 
<div class='pindiv_pinWrapper_decr' style='width:" + pin_columnsize + "px'>" + descriptionTrim + "</div> </div>" : 
						
						
"<div class='pindiv_pinWrapper' bg-image='" + pinobj.data[i].image.original.url + "'> 	
<div class='pindiv_pinWrapper_content' style='background-color: " + pinobj.data[i].color + ";width:" + pin_columnsize + "px;height:" + pinobj.data[i].image.original.height * pin_columnsize / 237 + "px;'> 	
<a class='pindiv_pinWrapper_pinlink' target='_blank' style='width:" + pin_columnsize + "px;height:" + Math.floor((pinobj.data[i].image.original.height - 40) * pin_columnsize / 237) + "px' href='" + pinobj.data[i].url + "'></a> 	
</div> <div class='pindiv_pinWrapper_decr' style='width:" + pin_columnsize + "px'>" + descriptionTrim + "</div> </div>";

$(currentpindiv).find(".pindiv_container_inner").append(pintoappend);