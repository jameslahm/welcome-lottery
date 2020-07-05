import parse from 'csv-parse/lib/sync';
// import data from './assets/data/candidate';
import Chance from 'chance';
import gradientData from './assets/colors/gradients';

export function randomCandidates() {
	const chance = new Chance(Math.floor(Math.random()*100));
	const totalNum = Math.floor(20 + 10);
	const candidatesData = [...Array(totalNum)].map(() => {
		return {
			name: chance.first() + '-' +chance.integer({min:2017000000,max:2018000000}) ,
		};
	});
	return generateUiData(candidatesData);
}

export function parseCsv(file, callback) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('progress', (event) => {
			if (event.loaded && event.total) {
				const percent = (event.loaded / event.total) * 100;
				callback(percent);
			}
		});
		reader.addEventListener('load', (event) => {
			const result = event.target.result;
			const candidatesData = parse(result, {
				columns: ['name'],
				skip_empty_lines: true,
			});
			resolve(generateUiData(candidatesData));
		});
		reader.readAsText(file);
	});
}

function generateUiData(candidatesData) {
	return candidatesData.map((item) => {
		const gradients =
			gradientData[Math.floor(Math.random() * gradientData.length)]
				.colors;

		return {
			name: item.name,
			css: `linear-gradient(135deg,${gradients.join(',')})`,
			height: 100,
		};
	});
}
