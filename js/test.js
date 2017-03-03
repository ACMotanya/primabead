function stringsRearrangement(inputArray) {
	for (var i = 1; i < inputArray.length; i++) {
		if (inputArray[i].length !== inputArray[0].length)
			return false;
	}

	inputArray.sort();
	var total = 0;
	for (i = 1; i < inputArray.length; i++) {
		var answer = 0;
		first  = inputArray[i-1].split("");
		second = inputArray[i].split("");
		
		for (k = 0; k < first.length; k++) {
			if ( first[k] === second[k] ) {
				answer += 1;
			} else {
				answer += 0;
			}
		}
		
		if ( answer !== first.length - 1 ) {
			total += 1
		}
		if ( inputArray.length - 1 !== total) {
			return false;
		}
	}
	return true;
}


function getValue(x)
{
	value = 0;
	y = x.split("");
	for (var i = 0; i < y.length; i++) {
		value += alpha.indexOf(y[i]);
	}
	return value;
}


//	alpha = "0abcdefghijklmnopqrstuvwxyz".split("");

//	for (var j = 0; j < inputArray.length; j++) {
//		number = getValue(inputArray[j]);
//		values.push([number,inputArray[j]]);
//	}

function stringsRearrangement(inputArray) {
	for (var i = 1; i < inputArray.length; i++) {
		if (inputArray[i].length !== inputArray[0].length) {
			return false;
		}
	}

	inputArray.sort();
	var answer = 0;
	var total = 0;
	for (i = 1; i < inputArray.length; i++) {
		if ( inputArray[i-1].localeCompare(inputArray[i]) === 0 ) {
			continue;
		} else {
			first  = inputArray[i-1].split("");
			second = inputArray[i].split("");
			total += 1
			for (k = 0; k < first.length; k++) {
				if ( first[k] === second[k] ) {
					answer += 0;
				} else {
					answer += 1;
				}
			}
			console.log(total + " total");
			console.log(answer + " answer");
		}
	}

	if ( answer === total ) {
		return false;
	}
	return true;
}