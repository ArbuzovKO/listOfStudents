function getEducationPeriod(startYear) {
    const endYear = startYear + 4;
    const currentYear = new Date().getFullYear();
    let course = '';
    if (currentYear > endYear) {
        course = 'закончил/а';
    } else {
        course = `${currentYear - startYear} курс`;
    }
    return `${startYear}-${endYear} (${course})`;
}

let listStudents = [{
    name: 'Андрей',
    lastname: 'Андреев',
    surname: 'Андреевич',
    birthday: new Date(1998, 6, 23),
    faculty: 'Экономика',
    start: 2019,
},
{
    name: 'Валерий',
    lastname: 'Иванов',
    surname: 'Антонович',
    birthday: new Date(1994, 10, 30),
    faculty: 'Менеджмент',
    start: 2013,
},
{
    name: 'Валентин',
    lastname: 'Сидоров',
    surname: 'Сергеевич',
    birthday: new Date(1993, 12, 15),
    faculty: 'Аудит',
    start: 2019,
},
{
    name: 'Эдуард',
    lastname: 'Петров',
    surname: 'Кириллович',
    birthday: new Date(1992, 2, 3),
    faculty: 'Бухгалтер',
    start: 2011,
},
{
    name: 'Сергей',
    lastname: 'Андреев',
    surname: 'Викторович',
    birthday: new Date(1999, 5, 25),
    faculty: 'Логистика',
    start: 2009,
}
]

const table = document.querySelector('.table');
const filter = document.querySelectorAll('.filter_input')
let filteredStudents = [];

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

function $getNewStudent(studObj) {
    const $tr = document.createElement("tr")
    const $tdFIO = document.createElement("td")
    const $tdBirthday = document.createElement("td")
    const $tdFaculty = document.createElement("td")
    const $tdStart = document.createElement("td")
    const startYear = parseInt(studObj.start);
    const curDate = new Date();


    $tdFIO.textContent = `${studObj.lastname} ${studObj.name} ${studObj.surname}`
    $tdBirthday.textContent = formatDate(studObj.birthday)
    $tdFaculty.textContent = studObj.faculty
    $tdStart.textContent = getEducationPeriod(startYear)
    $tr.append($tdFIO, $tdBirthday, $tdFaculty, $tdStart)

    const birthdayNormalFormat = formatDate(studObj.birthday)
    const years = wordEnding(new Date(curDate - studObj.birthday).getFullYear() - 1970, ['год', 'года', 'лет']);
    $tdBirthday.innerText = `${birthdayNormalFormat} (${new Date(curDate - studObj.birthday).getFullYear() - 1970} ${years})`;

    return $tr
}

Object.assign(filteredStudents, listStudents);

filter.forEach(item => {
    item.addEventListener('input', e => {
        const self = e.target;
        Object.assign(filteredStudents, listStudents);

        filter.forEach(item => {
            if (item.value.length) {
                const self = item;
                switch (item.getAttribute('data-filter')) {
                    case 'fio':
                        filteredStudents = filteredStudents.filter(item => {
                            if (`${item.lastname} ${item.name} ${item.surname}`.toLowerCase().includes(self.value.toLowerCase())) {
                                return item;
                            }
                        })
                        break;
                    case 'faculty':
                        filteredStudents = filteredStudents.filter(item => {
                            if (`${item.faculty}`.toLowerCase().includes(self.value.toLowerCase())) {
                                return item;
                            }
                        })
                        break;
                    case 'admission':
                        if (self.value.length === 4) {
                            filteredStudents = filteredStudents.filter(item => {
                                if (`${item.start}` === self.value) {
                                    return item;
                                }
                            })
                            break;
                        }
                    case 'graduation':
                        if (self.value.length === 4) {
                            filteredStudents = filteredStudents.filter(item => {
                                if (`${parseInt(item.start) + 4}` === self.value) {
                                    return item;
                                }
                            })
                            break;
                        }
                }
            }
        })

        redner(filteredStudents);
    })
})

table.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn_order')) {
        const orderedStudents = [];
        Object.assign(orderedStudents, filteredStudents);
        switch (e.target.getAttribute('data-sort')) {
            case 'fio':
                orderedStudents.sort((prev, next) => {
                    if (`${prev.lastname} ${prev.name} ${prev.surname}` < `${next.lastname} ${next.name} ${next.surname}`) return -1;
                    if (`${prev.lastname} ${prev.name} ${prev.surname}` < `${next.lastname} ${next.name} ${next.surname}`) return 1;
                });
                redner(orderedStudents);
                break;
            case 'faculty':
                orderedStudents.sort((prev, next) => {
                    if (prev.faculty < next.faculty) return -1;
                    if (prev.faculty < next.faculty) return 1;
                });
                redner(orderedStudents);
                break;
            case 'birthday':
                orderedStudents.sort((prev, next) => prev.birthday - next.birthday);
                redner(orderedStudents);
                break;
            case 'start':
                orderedStudents.sort((prev, next) => prev.start - next.start);
                redner(orderedStudents);
                break;
            default:
                break;
        }
    }
})


const wordEnding = (number, txt) => {
    var cases = [2, 0, 1, 1, 1, 2];
    return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function redner(arr) {
    let copyArr = [...arr]

    const $studTable = document.getElementById("stud-table")

    $studTable.innerHTML = ''
    for (const studObj of copyArr) {
        const $newTr = $getNewStudent(studObj)
        $studTable.append($newTr)
    }
}

redner(listStudents)

function validation(form) {

    function removeError(input) {
        const parent = input.parentNode;

        if (input.classList.contains('is-invalid')) {
            parent.querySelector('.invalid-feedback').remove()
            input.classList.remove('is-invalid')
        }
    }

    function createError(input, text) {
        const parent = input.parentNode;
        const errorLabel = document.createElement('label')

        errorLabel.classList.add('invalid-feedback')
        errorLabel.textContent = text

        input.classList.add('is-invalid')

        parent.append(errorLabel)
    }

    let result = true

    const allInput = form.querySelectorAll('input')
    for (const input of allInput) {

        removeError(input)

        if (input.value.trim().length == "") {
            createError(input, 'Заполните поле')
            result = false
        } else {
            input.classList.add('is-valid')
        }
    }

    return result
}

document.getElementById("add-form").addEventListener("submit", function (event) {
    event.preventDefault()

    let newStudentObj = {
        name: document.getElementById("name-inp").value,
        lastname: document.getElementById("lastname-inp").value,
        surname: document.getElementById("surname-inp").value,
        birthday: new Date(document.getElementById("birthday-inp").value),
        faculty: document.getElementById("faculty-inp").value,
        start: document.getElementById("start-inp").value,
    }

    if (validation(this) == true) {

        listStudents.push(newStudentObj)
        Object.assign(filteredStudents, listStudents);

        redner(listStudents)
    }

})

redner(listStudents) 
