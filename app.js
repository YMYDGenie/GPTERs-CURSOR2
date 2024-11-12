class MedicineIdentifier {
    constructor() {
        this.selectedForm = '';
        this.selectedColor = '';
        this.searchHistory = [];
        
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.attachEventListeners();
        this.renderSearchHistory();
    }

    attachEventListeners() {
        // 모양 버튼 이벤트
        document.querySelectorAll('.form-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedForm = e.target.dataset.form;
            });
        });

        // 색상 버튼 이벤트
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedColor = e.target.dataset.color;
            });
        });

        // 검색 버튼 이벤트
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchMedicines();
        });
    }

    searchMedicines() {
        const results = medicines.filter(medicine => {
            const formMatch = !this.selectedForm || medicine.form === this.selectedForm;
            const colorMatch = !this.selectedColor || medicine.colorFront === this.selectedColor;
            return formMatch && colorMatch;
        });

        this.saveSearchHistory();
        this.renderResults(results);
    }

    renderResults(results) {
        const resultsContainer = document.getElementById('resultsList');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        results.forEach(medicine => {
            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.innerHTML = `
                <img src="${medicine.imageUrl}" alt="${medicine.name}">
                <h3>${medicine.name}</h3>
                <p>${medicine.appearance}</p>
                ${medicine.markingsFront ? `<p>앞면 각인: ${medicine.markingsFront}</p>` : ''}
                ${medicine.markingsBack ? `<p>뒷면 각인: ${medicine.markingsBack}</p>` : ''}
            `;
            resultsContainer.appendChild(card);
        });
    }

    saveSearchHistory() {
        const searchData = {
            form: this.selectedForm,
            color: this.selectedColor,
            timestamp: new Date().toISOString()
        };

        this.searchHistory.unshift(searchData);
        if (this.searchHistory.length > 5) {
            this.searchHistory.pop();
        }

        localStorage.setItem('medicineSearchHistory', JSON.stringify(this.searchHistory));
        this.renderSearchHistory();
    }

    loadSearchHistory() {
        const savedHistory = localStorage.getItem('medicineSearchHistory');
        this.searchHistory = savedHistory ? JSON.parse(savedHistory) : [];
    }

    renderSearchHistory() {
        const historyContainer = document.getElementById('historyList');
        historyContainer.innerHTML = '';

        this.searchHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p>모양: ${item.form || '전체'}, 색상: ${item.color || '전체'}</p>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            `;
            historyContainer.appendChild(historyItem);
        });
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MedicineIdentifier();
}); 