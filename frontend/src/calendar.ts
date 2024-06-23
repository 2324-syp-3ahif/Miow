class Calendar {
    private date: Date;
    private month: number;
    private year: number;
    private daysElement: HTMLElement;
    private displayElement: HTMLElement;
    private selectedElement: HTMLElement;

    constructor() {
        this.date = new Date();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
        this.daysElement = document.querySelector('.days');
        this.displayElement = document.querySelector('.display');
        this.selectedElement = document.querySelector('.selected');

        document.querySelector('.left').addEventListener('click', () => this.changeMonth(-1));
        document.querySelector('.right').addEventListener('click', () => this.changeMonth(1));

        this.render();
    }

    private changeMonth(direction: number): void {
        if (direction === -1 && this.month === 0) {
            this.month = 11;
            this.year--;
        } else if (direction === 1 && this.month === 11) {
            this.month = 0;
            this.year++;
        } else {
            this.month += direction;
        }
        this.render();
    }

    private async render(): Promise<void>  {
        this.daysElement.innerHTML = '';
        this.displayElement.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(this.year, this.month))} ${this.year}`;

        const startDay = new Date(this.year, this.month, 1).getDay();
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
        const daysInPrevMonth = new Date(this.year, this.month, 0).getDate();

        const today = new Date();
        const isCurrentMonth = today.getMonth() === this.month && today.getFullYear() === this.year;

        for (let i = 0; i < startDay; i++) {
            const dayElement = this.createDayElement((daysInPrevMonth - startDay + i + 1).toString());
            dayElement.classList.add('other-month');
            this.daysElement.appendChild(dayElement);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = this.createDayElement(i.toString());

            const date = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const entryData = await fetchEntryByDate(date);
            if (entryData && entryData.mood) {
                dayElement.classList.add(`mood-${entryData.mood}`);
            }

            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('current-date');
            }

            dayElement.addEventListener('click', () => this.selectDay(i));
            this.daysElement.appendChild(dayElement);
        }

        let nextMonthDay = 1;
        while (this.daysElement.childElementCount < 42) {
            const dayElement = this.createDayElement(nextMonthDay.toString());
            dayElement.classList.add('other-month');
            this.daysElement.appendChild(dayElement);
            nextMonthDay++;
        }
    }

    private createDayElement(day: string): HTMLElement {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        return dayElement;
    }

    private selectDay(day: number): void {
        this.selectedElement.textContent = `Selected: ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(this.year, this.month))} ${day}, ${this.year}`;
    }

}

async function fetchEntryByDate(date: string) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found in localStorage');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/entry/day?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching entry by date:', error);
    }
}

window.onload = () => {
    new Calendar();
};