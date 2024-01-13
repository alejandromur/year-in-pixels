/* 
  TODO: 
  
  - Update state of each cell on click not from the 'happy' mood 
  - Review Cell class
*/

const STORAGE = 'mamutloveAYearInPixels';
const MOODS = [
	'default',
	'happy',
	'delighted',
	'normal',
	'sad',
	'depressed',
	'angry'
];

const getData = () => JSON.parse(localStorage.getItem(STORAGE));

const saveData = data => localStorage.setItem(STORAGE, JSON.stringify(data));

const highlightMoods = calendar =>
	calendar.forEach(day =>
		document
			.querySelector(`[data-day="${day.id}"]`)
			.setAttribute('data-mood', day.mood)
	);

const createCalendar = (cols, rows, value = '-') => {
	let calendar = [];
	for (let i = 0; i < cols; i++) {
		let month = [];
		for (let j = 0; j < rows; j++) {
			month[j] = value;
		}
		calendar[i] = month;
	}
	return calendar;
};

class Cell {
	constructor(el) {
		this.element = el;
		this.id = this.element.getAttribute('data-day');
		this.state = 0;
		this.mood = 'default';
	}

	updateMood() {
		if (this.state >= MOODS.length) {
			this.state = 0;
		}
		this.element.setAttribute('data-mood', MOODS[this.state]);
		this.mood = MOODS[this.state];
	}

	updateState() {
		this.state++;
		this.updateMood();
	}

	saveState(id, mood) {
		let _calendar = getData();

		function searchEntry(calendar, id) {
			return calendar.findIndex(day => day.id === id);
		}

		function createEntry(calendar, id, mood) {
			calendar = [...calendar, { id, mood }];
			saveData(calendar);
		}

		function updateEntry(calendar, idx, mood) {
			calendar[idx].mood = mood;
			saveData(calendar);
		}

		const idx = searchEntry(_calendar, id);

		if (idx >= 0) {
			updateEntry(_calendar, idx, mood);
		} else {
			createEntry(_calendar, id, mood);
		}
	}
}

const initCalendar = () => {
	if (localStorage.getItem(STORAGE)) {
		let calendar = getData();
		highlightMoods(calendar);
	} else {
		let calendar = [];
		saveData(calendar);
	}

	const instances = {};

	document.querySelectorAll('.cell').forEach(el => {
		const instance = new Cell(el);
		const _index = el.getAttribute('data-day').toString();
		instances[_index] = instance;
	});

	document.querySelector('table').addEventListener('click', e => {
		if (e.target.tagName === 'TD') {
			const day = e.target.getAttribute('data-day');
			instances[day].updateState();
			instances[day].saveState(instances[day].id, instances[day].mood);
		}
	});
};

initCalendar();

