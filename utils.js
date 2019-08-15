function divideSameLetter(source) {
	if (!source) {
		return;
	}
	const letters = source.split('');
	let prev;
	let target = ['-'];
	for (let i = 0, len = letters.length; i < len; i++) {
		let letter = letters[i];
		if (letter === prev) {
			target.push('-');
		} else {
			prev = letter;
		}
		target.push(letter);
	}
	target.push('-');
	return target.join('');
}

let result = divideSameLetter('11122233344566');
console.log(result);

console.log(result.replace(/-/g, ''));
