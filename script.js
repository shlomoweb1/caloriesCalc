class CaloriesCalc {

    cacheKey = '_history';
    wrapperCaloriesCalc = document.querySelector('.wrapperCaloriesCalc')
    containerElement = this.wrapperCaloriesCalc.querySelector('.CaloriesCalOutput');

    constructor() {
        this.domInit();

        this.getData((err) => {
            if (err) {
                alert('מידע לא נטען, רענן את הדף');
                console.log(err);
                return;
            }
            this.watchHistory();
        });

    }

    watchHistory() {
        const fwd = this.wrapperCaloriesCalc.querySelector('.CaloriesCalFwd');
        const back = this.wrapperCaloriesCalc.querySelector('.CaloriesCalBack');
        this.data.history = new Proxy(this.data.history, {
            set: (target, property, value) => {
                // Perform actions whenever this.data.history properties are updated
                if(property === 'index'){

                    if(!value){
                        if(!fwd.classList.contains('disabled')) fwd.classList.add('disabled');
                        if(this.data.history.data.length){
                            if(back.classList.contains('disabled')) back.classList.remove('disabled');
                        }else{
                            if(!back.classList.contains('disabled'))  back.classList.add('disabled');
                        }
                    }else{
                        if(fwd.classList.contains('disabled')) fwd.classList.remove('disabled');
                        // ignore position 0
                        if(this.data.history.data.length -2 >= value){
                            if(back.classList.contains('disabled')) back.classList.remove('disabled')
                        }else{
                            if(!back.classList.contains('disabled')) back.classList.add('disabled')
                        }
                    }

                    
                }
                // Update the original property with the new value
                target[property] = value;
                return true;
            }
        })

        if (this.data.history.data.length) {
            back.classList.remove('disabled');
        }

        fwd.addEventListener('click', () => {
            if (!this.data.history.data.length || this.data.history.index === 0) return;
            const selectedIndex = this.data.history.index - 1;
            if (!this.data.history.data[selectedIndex]) return;
            this.data.filter.q = this.data.history.data[selectedIndex].q;
            this.data.filter.data = this.filter(this.data.history.data[selectedIndex].q);
            this.selectCaleroies(Number(this.data.history.data[selectedIndex].selectedIndex), this.containerElement, true);
            this.data.history.index = selectedIndex;
            this.autoCompleteCaleriesCala(this.data.filter.q, this.containerElement, true);
        })

        back.addEventListener('click', () => {
            if (!this.data.history.data.length) return;
            const selectedIndex = this.data.history.index + 1
            if (!this.data.history.data[selectedIndex]) return;
            this.data.filter.q = this.data.history.data[selectedIndex].q;
            this.data.filter.data = this.filter(this.data.history.data[selectedIndex].q);
            this.selectCaleroies(Number(this.data.history.data[selectedIndex].selectedIndex), this.containerElement, true);
            this.data.history.index = selectedIndex;
            this.autoCompleteCaleriesCala(this.data.filter.q, this.containerElement, true);
        })

    }

    data = {
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
        history: {
            index: 0,
            data: []
        }
    }

    loadJSON(filename, callback) {
        var xObj = new XMLHttpRequest();
        xObj.overrideMimeType("application/json");
        xObj.open('GET', filename, true);
        xObj.onreadystatechange = function () {
            if (xObj.readyState === 4 && xObj.status === 200) {
                // 2. call your callback function
                try {
                    callback(null, JSON.parse(xObj.responseText))
                } catch (error) {
                    callback(error)
                }
            }
        };
        xObj.send(null);
    }

    getCahce() {
        try {
            const d = localStorage.getItem(this.cacheKey);
            if (!d) return;
            this.data.history.data = JSON.parse(d)
        } catch (error) {

        }
    }

    getData(cb) {
        this.loadJSON('db.json', (err, data) => {
            if (err) {
                return cb(err);
            }
            try {
                this.data.data = data;
                this.data.data.result.records = this.data.data.result.records.map((v, i) => ({ ...v, index: i }))
                this.loaded = true;
                // this.getCahce();
                cb(null)
            } catch (error) {
                cb(error);
            }
        })
    }

    wrapKeywordWithSpan(text, keyword) {
        const keyRegExp = keyword.split(' ').join('|');
        const regex = new RegExp(keyRegExp, 'gi'); // 'gi' flag for case-insensitive global search
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    filter(query = this.data.filter.q){
        return this.data.data.result.records.filter(x => x.shmmitzrach.match(new RegExp(query.split(' ').join('|'), 'i')));
    }

    selectCaleroies(index, containerElement, skipHistory) {
        const selected = this.data.data.result.records[index];
        if (!skipHistory) {
            this.data.history.index = 0;
            this.data.history.data.unshift({ q: this.data.filter.q, selectedIndex: index });
            // localStorage.setItem(this.cacheKey, JSON.stringify(this.data.history.data));
            this.data.history.index = index;
        }

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

        nameLabel.innerHTML = selected.shmmitzrach === null ? '--' : this.wrapKeywordWithSpan(selected.shmmitzrach, this.data.filter.q) // Assuming 'result[0]' contains the first record
        caloriesLabel.textContent = selected.food_energy === null ? '--' : selected.food_energy; // Assuming 'result[0]' contains the first record
        proteinLabel.textContent = selected.protein === null ? '--' : selected.protein; // Assuming 'result[0]' contains the first record
        totalFatLabel.textContent = selected.total_fat === null ? '--' : selected.total_fat; // Assuming 'result[0]' contains the first record
        carbohydratesLabel.textContent = selected.carbohydrates === null ? '--' : selected.carbohydrates; // Assuming 'result[0]' contains the first record
        totalDietaryFiberlabel.textContent = selected.total_dietary_fiber === null ? '--' : selected.total_dietary_fiber; // Assuming 'result[0]' contains the first record

        const inputElement = document.querySelector('.CaloriesCalSearchInput');
        inputElement.value = '';
    }

    autoCompleteCaleriesCala(query, containerElement, hide) {
        const { data } = this;

        const results = document.querySelector('#results', containerElement);

        data.filter.q = query;
        if (!data.filter.q) {
            results.innerHTML = '';
            if (results.classList.contains('show')) { results.classList.remove('show'); }
            return;
        }


        data.filter.data = this.filter(data.filter.q);
        results.innerHTML = '';
        if (data.filter.data.length) {
            if (!results.classList.contains('show')) { results.classList.add('show'); }
            let html = `<ul>`;
            for (let index = 0; index < data.filter.data.length; index++) {
                const element = data.filter.data[index];
                html += `<li data-index="${element.index}">${this.wrapKeywordWithSpan(element.shmmitzrach, query)}</li>`
            }
            html += `</ul>`;
            results.innerHTML = html;

            // Add click event listener to each li element
            const liElements = results.querySelectorAll('li');
            liElements.forEach((liElement) => {
                liElement.addEventListener('click', (event) => {
                    const dataIndex = event.target.getAttribute('data-index');
                    this.selectCaleroies(Number(dataIndex), containerElement);
                });
            });
        }
        if(hide) return;
        if (!this.data.filter.data.length && results.classList.contains('show')) {
            results.classList.remove('show')
        }
    }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }



    domInit() {
        const inputElement = document.querySelector('.CaloriesCalSearchInput');
        const containerElement = this.containerElement;
        const debouncedSearchHandler = this.debounce(this.autoCompleteCaleriesCala, 500).bind(this);

        inputElement.addEventListener('keyup', function (event) {
            const query = event.target.value;
            // Handle the "Enter" key press here
            if (event.keyCode === 13) {
                if (self.data.filter.q) {
                    self.selectCaleroies(Number(this.data.filter.data[0].index), containerElement)
                }
                return;
            }
            debouncedSearchHandler(query, containerElement);
        });

        inputElement.addEventListener('focus', (event) => {
            const results = document.querySelector('#results', containerElement);

            if (this.data.filter.data.length && !results.classList.contains('show')) {
                inputElement.value = this.data.filter.q;
                results.classList.add('show')
            }
        });
        document.addEventListener('click', function (event) {
            const containerElement = this.containerElement;
            const results = document.querySelector('#results', containerElement);
            const input = document.querySelector('input.CaloriesCalSearchInput', containerElement);
            if (!results.contains(event.target) && !input.contains(event.target)) {
                results.classList.remove('show');
            }
        })

    }

}
document.addEventListener('DOMContentLoaded', () => {
    new CaloriesCalc();
})
