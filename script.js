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
		// this.element.style.backgroundColor = this.colourPattern[this.state];
		this.element.setAttribute('data-mood', MOODS[this.state]);
		this.mood = MOODS[this.state];
	}

	updateState() {
		this.state++;
		this.updateMood();
	}

	saveState(id, mood) {
		let _calendar = getData();

		function searchEntry(calendar, id, mood) {
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

		const idx = searchEntry(_calendar, id, mood);

		if (idx >= 0) {
			updateEntry(_calendar, idx, mood);
		} else {
			createEntry(_calendar, id, mood);
		}
	}

	init() {
		this.element.addEventListener('click', event => {
			this.updateState();
			this.saveState(this.id, this.mood);
		});
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
};

initCalendar();

document.querySelectorAll('.cell').forEach((el, idx) => new Cell(el).init());

