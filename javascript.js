'use strict';

/* Add New Animation */

document.querySelector('.add-icon').addEventListener('click', startAnimation);
let toggler = 1;

function startAnimation() {
	if (toggler == 1) {
		toggler = 0;
		document.querySelector('.add-icon').addEventListener('animationend', formAnimation);
		document.querySelector('.add-icon').classList.add('createWidth');
	} else if (toggler == 0) {
		toggler = 1;
		document.querySelector('.add-icon').classList.remove('createWidth');
		document.querySelector('.add-form form').style.display = 'none';
		document.querySelector('.add-form form').classList.remove('createHeight');
		document.querySelector('.add-form form').classList.remove('translateHeight');
		document.querySelector('.add-form form').style.height = '0px';
		document.querySelectorAll('.add-form form *').forEach((el) => el.classList.remove('raiseOpacity'));
		document.querySelectorAll('.add-form form *').forEach((el) => (el.style.opacity = 0));
		document.querySelector('.add-header').style.display = 'none';
		document.querySelector('.add-header').classList.remove('raiseOpacity');
	}
}

function formAnimation() {
	document.querySelector('.add-icon').removeEventListener('animationend', formAnimation);
	document.querySelector('.add-form form').addEventListener('animationend', inputAnimation);
	document.querySelector('.add-form form').style.display = 'grid';
	document.querySelector('.add-form form').classList.add('createHeight');
}

function inputAnimation() {
	document.querySelector('.add-form form').removeEventListener('animationend', inputAnimation);
	document.querySelector('.add-form form').classList.add('translateHeight');
	document.querySelector('.add-form form').style.height = '260px';
	document.querySelector('.add-header').style.display = 'block';
	document.querySelector('.add-header').classList.add('raiseOpacity');
	document.querySelectorAll('.add-form form *').forEach((el) => el.classList.add('raiseOpacity'));
}

/* Javascript Validation */

document.querySelectorAll('input').forEach((el) => el.addEventListener('input', checkValidity));

function checkValidity() {
	if (event.target.checkValidity() == false) {
		event.target.style.opacity = '1';
		event.target.classList.add('shakeElem');
		event.target.addEventListener('animationend', removeShake);
	}
}

function removeShake() {
	event.target.classList.remove('shakeElem');
	event.target.removeEventListener('animationend', removeShake);
}

/* Card Switch */
let i = 1;

function cardFunctionality() {
	document.querySelector(`.card:nth-of-type(${i})`).style.display = 'block';
}

function switchCardBack() {
	event.target.parentElement.parentElement.querySelector('.card-side-front').style.transform = 'rotateY(-180deg)';
}

function switchCardFront() {
	event.target.parentElement.parentElement.querySelector('.card-side-front').style.transform = 'rotateY(0deg)';
}

document.querySelector('.todo-controls .move-previous').addEventListener('click', showPreviousCard);
document.querySelector('.todo-controls .move-next').addEventListener('click', showNextCard);

function showPreviousCard() {
	if (i != 1) {
		document.querySelector(`.card:nth-of-type(${i})`).style.display = 'none';
		document.querySelector(`.card:nth-of-type(${i - 1})`).style.display = 'block';
		console.log(i);
		i -= 1;
	}
}

function showNextCard() {
	if (i != document.querySelectorAll('.card').length) {
		document.querySelector(`.card:nth-of-type(${i})`).style.display = 'none';
		document.querySelector(`.card:nth-of-type(${i + 1})`).style.display = 'block';
		console.log(i);
		i += 1;
	}
}

/* Database functions */

function get() {
	fetch('https://frontendautumn2019-e4d9.restdb.io/rest/todolist', {
		method: 'get',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'x-apikey': '5d887446fd86cb75861e25f5',
			'cache-control': 'no-cache'
		}
	})
		.then((e) => e.json())
		.then((activities) => {
			activities.forEach(addActivityToDOM);
		});
}

function addActivityToDOM(activity) {
	const parent = document.querySelector('.wrapper');
	const template = document.querySelector('template').content;
	const clone = template.cloneNode(true);
	console.log(activity);
	clone.querySelector('.name-activity').textContent = activity.Activity;
	clone.querySelector('.date-activity').textContent = activity.Date;
	console.log(activity.Importance);
	if (activity.Importance < 4) {
		clone.querySelector('svg').children[1].style.display = 'none';
		clone.querySelector('svg').children[2].style.display = 'none';
	} else if (activity.Importance > 4 && activity.Importance < 7) {
		clone.querySelector('svg').children[2].style.display = 'none';
	}
	clone.querySelector('.description-activity').textContent = activity.Description;
	clone.querySelector('.meet-activity-set').textContent = activity.Partners;
	clone.querySelector('.press-to-edit').addEventListener('click', switchCardBack);
	clone.querySelector('.cancel').addEventListener('click', switchCardFront);

	clone.querySelector('.card').dataset.postid = activity._id;
	clone.querySelector('.delete-it').addEventListener('click', () => {
		deleteIt(activity._id);
	});

	clone.querySelector('.press-to-edit').addEventListener('click', () => {
		fetchAndPopulate(activity._id);
	});

	clone.querySelector('.storeID').value = activity._id;

	clone.querySelector('.edit-submit').addEventListener('submit', (e) => {
		console.log('hello');
		put();
		e.preventDefault();
	});

	parent.appendChild(clone);

	cardFunctionality();
}

function fetchAndPopulate(id) {
	let formEdit = document.querySelector(`[data-postid="${id}"] form`);

	fetch('https://frontendautumn2019-e4d9.restdb.io/rest/todolist/' + id, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'x-apikey': '5d887446fd86cb75861e25f5',
			'cache-control': 'no-cache'
		}
	})
		.then((e) => e.json())
		.then((activity) => {
			formEdit.elements.nameActivity.value = activity.Activity;
			formEdit.elements.dateActivity.value = activity.Date;
			formEdit.elements.importanceActivity.value = activity.Importance;
			formEdit.elements.descriptionActivity.value = activity.Description;
			formEdit.elements.meetActivity.value = activity.Partners;
			formEdit.elements.id.value = activity._id;
		});
}

get();

const data = {
	Activity: 'Gardening',
	Date: Date.now(),
	Importance: 7,
	Description:
		'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque minus ipsa impedit delectus repellendus cupiditate?',
	Partners: 'Laura, Elizabeth'
};

function post() {
	fetch('https://frontendautumn2019-e4d9.restdb.io/rest/todolist', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'x-apikey': '5d887446fd86cb75861e25f5',
			'cache-control': 'no-cache'
		},
		body: JSON.stringify(data)
	})
		.then((e) => e.json())
		.then((newActivity) => {
			addActivityToDOM(newActivity);
		});
}

let formAdd = document.querySelector('.add-element-form');

formAdd.elements.nameActivity.addEventListener('input', (e) => {
	e.preventDefault();
	data.Activity = formAdd.elements.nameActivity.value;
});

formAdd.elements.dateActivity.addEventListener('input', (e) => {
	e.preventDefault();
	data.Date = formAdd.elements.dateActivity.value;
});

formAdd.elements.importanceActivity.addEventListener('input', (e) => {
	e.preventDefault();
	data.Importance = formAdd.elements.importanceActivity.value;
});

formAdd.elements.descriptionActivity.addEventListener('input', (e) => {
	e.preventDefault();
	data.Description = formAdd.elements.descriptionActivity.value;
});

formAdd.elements.meetActivity.addEventListener('input', (e) => {
	e.preventDefault();
	data.Partners = formAdd.elements.meetActivity.value;
});

formAdd.addEventListener('submit', (e) => {
	e.preventDefault();
	post();
});

function deleteIt(id) {
	fetch('https://frontendautumn2019-e4d9.restdb.io/rest/todolist/' + id, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'x-apikey': '5d887446fd86cb75861e25f5',
			'cache-control': 'no-cache'
		}
	})
		.then((res) => res.json())
		.then((data) => {
			document.querySelector(`[data-postid="${id}"]`).remove();
		});
}

function put() {
	let id = event.target.parentElement.querySelector('.storeID').value;
	console.log(id);
	let formEdit = document.querySelector(`[data-postid="${id}"] form`);

	console.log(formEdit);

	const data = {
		Activity: formEdit.elements.nameActivity.value,
		Date: formEdit.elements.dateActivity.value,
		Importance: formEdit.elements.importanceActivity.value,
		Description: formEdit.elements.descriptionActivity.value,
		Partners: formEdit.elements.meetActivity.value
	};

	fetch('https://frontendautumn2019-e4d9.restdb.io/rest/todolist/' + id, {
		method: 'put',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'x-apikey': '5d887446fd86cb75861e25f5',
			'cache-control': 'no-cache'
		},
		body: JSON.stringify(data)
	})
		.then((e) => e.json())
		.then((editedActivity) => {
			// find the parent
			console.log(document.querySelector(`[data-postid="${editedActivity._id}"]`).remove());
			// update the dom
		});
}
