var Fields = new Map();
Fields.set('shmmitzrach', 'שם מוצר');
Fields.set('protein', 'חלבונים');
Fields.set('total_fat', 'שומנים');
Fields.set('carbohydrates', 'פחמימות');
Fields.set('food_energy', 'קלוריות');
Fields.set('total_dietary_fiber', 'סיבים תזונתיים');

window.CaloriesData = {
    loaded: false,
    data: {
        result: {
            records: []
        }
    },
    filter: {
        q: null,
        data: []
    },
    selectedIndex: null,
    prev: [],
    next: [],
    throttle: null
};


function loadJSON(filename, callback) {
    var xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    xObj.open('GET', filename, true);
    xObj.onreadystatechange = function () {
        if (xObj.readyState === 4 && xObj.status === 200) {
            // 2. call your callback function
            callback(xObj.responseText);
        }
    };
    xObj.send(null);
}
if (!window.CaloriesData.loaded) {
    // https://data.gov.il/api/3/action/datastore_search?resource_id=c3cb0630-0650-46c1-a068-82d575c094b2&limit=5000&fields=shmmitzrach,protein,total_fat,carbohydrates,food_energy,total_dietary_fiber
    loadJSON('db.json', (str) => {
        try {
            window.CaloriesData.data = JSON.parse(str);
            window.CaloriesData.data.result.records = window.CaloriesData.data.result.records.map((v, i) => ({ ...v, index: i }))
            window.CaloriesData.loaded = true
        } catch (error) {
            alert('מיד לא נטען')
        }
    })
}

function wrapKeywordWithSpan(text, keyword) {
    const regex = new RegExp(keyword, 'gi'); // 'gi' flag for case-insensitive global search
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

function selectCaleroies(index, containerElement) {
    const selected = window.CaloriesData.data.result.records[index];
    if (containerElement) {
        const results = document.querySelector('#results', containerElement);
        if (results.classList.contains('show')) { results.classList.remove('show'); }
    }

    const container = document.querySelector('.CaloriesCalOutput', containerElement);

    if (!container.classList.contains('show')) {
        container.classList.add('show')
    }

    const nameLabel = container.querySelector('[data-field="shmmitzrach"]');
    const caloriesLabel = container.querySelector('[data-field="food_energy"]');
    const proteinLabel = container.querySelector('[data-field="protein"]');
    const totalFatLabel = container.querySelector('[data-field="total_fat"]');
    const carbohydratesLabel = container.querySelector('[data-field="carbohydrates"]');
    const totalDietaryFiberlabel = container.querySelector('[data-field="total_dietary_fiber"]');

    nameLabel.innerHTML = selected.shmmitzrach === null ? '--' : wrapKeywordWithSpan(selected.shmmitzrach, window.CaloriesData.filter.q) // Assuming 'result[0]' contains the first record
    caloriesLabel.textContent = selected.food_energy === null ? '--' : selected.food_energy; // Assuming 'result[0]' contains the first record
    proteinLabel.textContent = selected.protein === null ? '--' : selected.protein; // Assuming 'result[0]' contains the first record
    totalFatLabel.textContent = selected.total_fat === null ? '--' : selected.total_fat; // Assuming 'result[0]' contains the first record
    carbohydratesLabel.textContent = selected.carbohydrates === null ? '--' : selected.carbohydrates; // Assuming 'result[0]' contains the first record
    totalDietaryFiberlabel.textContent = selected.total_dietary_fiber === null ? '--' : selected.total_dietary_fiber; // Assuming 'result[0]' contains the first record

    const inputElement = document.querySelector('.CaloriesCalSearchInput');
    inputElement.value = '';
}

if (!autoCompleteCaleriesCala && typeof autoCompleteCaleriesCala !== 'function')
    function autoCompleteCaleriesCala(query, containerElement) {
        if (!window.CaloriesData.loaded || !window.CaloriesData.data || !window.CaloriesData.data.result || !window.CaloriesData.data.result.records || !window.CaloriesData.data.result.records.length) return;

        const results = document.querySelector('#results', containerElement);

        window.CaloriesData.filter.q = query;
        if (!query) {
            results.innerHTML = '';
            if (results.classList.contains('show')) { results.classList.remove('show'); }
            return;
        }

        window.CaloriesData.filter.data = window.CaloriesData.data.result.records.filter(x => x.shmmitzrach.match(new RegExp(query, 'i')));
        results.innerHTML = '';
        if (window.CaloriesData.filter.data.length) {
            if (!results.classList.contains('show')) { results.classList.add('show'); }
            let html = `<ul>`;
            for (let index = 0; index < window.CaloriesData.filter.data.length; index++) {
                const element = window.CaloriesData.filter.data[index];
                html += `<li data-index="${element.index}">${wrapKeywordWithSpan(element.shmmitzrach, query)}</li>`
            }
            html += `</ul>`;
            results.innerHTML = html;

            // Add click event listener to each li element
            const liElements = results.querySelectorAll('li');
            liElements.forEach((liElement) => {
                liElement.addEventListener('click', (event) => {
                    const dataIndex = event.target.getAttribute('data-index');
                    selectCaleroies(Number(dataIndex), containerElement);
                });
            });
        }
        if (!window.CaloriesData.filter.data.length && results.classList.contains('show')) {
            results.classList.remove('show')
        }
    }

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
// Debounce the searchHandler function with 500ms delay
const debouncedSearchHandler = debounce(autoCompleteCaleriesCala, 500);

document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.querySelector('.CaloriesCalSearchInput');
    const containerElement = document.querySelector('.CaloriesCalOutput');

    inputElement.addEventListener('keyup', function (event) {
        // Handle the "Enter" key press here
        if (event.keyCode === 13) {
            if (window.CaloriesData.filter.q) {
                selectCaleroies(Number(window.CaloriesData.filter.data[0].index), containerElement)
            }
            return;
        }

        const query = event.target.value;
        debouncedSearchHandler(query, containerElement);
    });

    inputElement.addEventListener('focus', (event) => {
        const results = document.querySelector('#results', containerElement);
        if (window.CaloriesData.filter.data.length && !results.classList.contains('show')) {
            inputElement.value = window.CaloriesData.filter.q;
            results.classList.add('show')
        }
    });
});

document.addEventListener('click', function (event) {
    const containerElement = document.querySelector('.CaloriesCalOutput');
    const results = document.querySelector('#results', containerElement);
    const input = document.querySelector('input.CaloriesCalSearchInput', containerElement);
    if (!results.contains(event.target) && !input.contains(event.target)) {
        results.classList.remove('show');
    }
})




