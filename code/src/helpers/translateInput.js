/*******************************
 * [_translateInput.js]
 * Define the translation code here
 ******************************/

let numberToWords = (input, callback) => {

	console.log('translateInput: init payload:');
	//console.log(input);

	const arabic = input.arabic.value;

	/**
	 * Support functions
	 */
		const wordDefinitions = {
			singles : [
				'', 'one', 'two', 'three', 'four',
				'five', 'six', 'seven', 'eight', 'nine',
				'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
				'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
			],

			tens : [
				'', '', 'twenty', 'thirty', 'forty',
				'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
			],

/*			thousands : [
				'', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
				'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'
			]*/

			thousands(lengthAfter) {
				const x = lengthAfter;

				switch (true) {
					case (x < 3):
						return '';
					case (x >= 3 && x < 6):
						return ' thousand and ';
					case (x < 9):
						return ' million and ';
					case (x < 12):
						return ' billion and ';
					case (x < 15):
						return ' trillion and ';
					case (x < 18):
						return ' quadrillion and ';
					case (x < 21):
						return ' quintillion and ';
					case (x < 24):
						return ' sextillion and ';
					case (x < 26):
						return ' octillion and ';
					case (x < 29):
						return ' nonillion and ';
					case (x > 29):
						return 'Dude, big number. Tone it down.';
					default:
						return '';
				}
			}
		};

		const helpers = {
			reverse(payload) {
				return payload.reverse();
			},

			divideInto(arr, chunkSize) {
				let groups = [], i;

				for (i = 0; i < arr.length; i += chunkSize) {
						groups.push(arr.slice(i, i + chunkSize));
				}
				return groups;
			},

			matchDefinitions([singles, tens, hundreds]) {
				// Array position defines what it is. 0 = singles, 1 = tens, 2 = hundreds
				console.log(singles, tens, hundreds);

				return [
				// Result for the hundreds
					// If result is 0, return blank
					// Else return the definition for the single digit based on index in array
					hundreds == 0 || hundreds == null ? '' : wordDefinitions.singles[hundreds] + ' hundred ',

				// Result for the singles and tens
					// If single digit is 0, return the definition for the base tens (2 digit) number (e.g: 20, 30)
					// Else return definition of the base tens + '-' + single digit
					// If no arguments, return blank
					singles == 0 ? wordDefinitions.tens[tens] :
					wordDefinitions.tens[tens] && wordDefinitions.tens[tens] + '-' || '',

				// Attach the tens and singles if available, otherwise just take the singles
					wordDefinitions.singles[tens + singles] || wordDefinitions.singles[singles]
				].join(''); //Join them
			},

			addThousands(originalArray, index) {

				console.log(originalArray);

				// Define the entire thousandsArray
				let thousandsArray = helpers.reverse(originalArray);

				thousandsArray = helpers.divideInto(thousandsArray, 3);
				thousandsArray = helpers.reverse(thousandsArray);
				console.log('thousandsArray: ', thousandsArray);


				let itemCount = 0;

				thousandsArray.forEach(function (item, index) {
					console.log(item, index);
					itemCount = itemCount + item.length;
				});

				// Remove the array that you want to find the trail of from the count
				// (so you know how many are AFTER it)
				itemCount = itemCount - thousandsArray[index].length;

				console.log('done, you have ' + itemCount + ' items after your current array item');

				const inbetween = wordDefinitions.thousands(itemCount);

				console.log(inbetween);
				return inbetween;

				//let word =
			}
		};

	/**
	* Process the input
	*/

		// 1. Throw the entire input into an array
		const originalArray = [...arabic];
		let inputArray = [...arabic];


		// 2. Reverse it so that it is spaced into neat blocks and only the first section of the number has gaps in the array
		// (so that we can name it properly when we add thousands)
		inputArray = helpers.reverse(inputArray);

		// 3. Divide it into chunks
		inputArray = helpers.divideInto(inputArray, 3);
		console.log('divided: ', inputArray);

		inputArray.map(function (item) {
			while (item.length != 3){
				item.push(null);
			}
		});

		console.log(inputArray);

		// 4. Map each item to a definition
		let translation = inputArray.map(helpers.matchDefinitions);

		// 5. Add thousands
		//helpers.addThousands(originalArray);

		// 6. Reverse it again
		translation = helpers.reverse(translation);

		// Filter empty
		translation = translation.filter(Boolean);
		console.log('teeeest ', translation);

		// 7. Add in-between-labels
		const translationItems = translation.length;

		translation.forEach(function (item, index) {
			console.log('---------');
			console.log(translationItems);
			console.log(index);
			console.log('---------');
			//If it's the last item, don't run the check (unless there is only one)
			if (index + 1 == translationItems && translationItems != 1){
				return;
			}
			translation.splice(index + 1, 0, helpers.addThousands(originalArray, index));
		});

		console.log(translation);

		// 8. Clean up
		if (translation.length == 2) {
			// If there are only 2 items in the array, you don't need the "and part".
			translation = translation.join(' ');
			translation = translation.split(' and');
			translation = translation[0];

			// Remove duplicate whitespaces
			translation = translation.replace(/\s+/g, ' ');
			console.log(translation);
		} else {
			translation = translation.join(' ');
			translation = translation.replace(/\s+/g, ' ');
		}

		const result = {
			english : {
				value : translation
			}
		};

		callback(result);
};

//numberToWords(120000)
//12 | twelve
//123  | onehundred and twenty three
//1234 | onethousand twohundred and thirty-four
//12345 | twelvethousand threehundred and fourty-five
//123456 | onehundred and twenty-three thousand fifty-six
//1 234 567 | one million twohundred thirty-four thousand five hundred sixty-seven

// 1 000 000 000
// The groups of 3 never change. Use this as a base. You need to make sure everything is paired in groups of three.

//10 000
//1 000

export default numberToWords;
