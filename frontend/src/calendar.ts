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

        //adding days before month
        for (let i = 0; i < startDay; i++) {
            const dayElement = this.createDayElement((daysInPrevMonth - startDay + i + 1).toString());
            dayElement.classList.add('other-month');
            this.daysElement.appendChild(dayElement);
        }


        const periodData = await fetchPeriodByDateCalendar(this.year+"-"+(this.month+1).toString().padStart(2, '0')+"-01");


        if (periodData && periodData.values) {
            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = day.toString().padStart(2, '0');
                // @ts-ignore
                const dayData = periodData.values.find(value => value.day === dayStr);
                const dayElement = this.createDayElement(dayStr);

                if (dayData) {
                    if (dayData.period === 1) {
                        dayElement.classList.add('period-1');
                    } else if (dayData.period === 2) {
                        dayElement.classList.add('period-2');
                    } else if (dayData.period === 3) {
                        dayElement.classList.add('period-3');
                    }

                    if (dayData.mood >= 1 && dayData.mood <= 5) {
                        dayElement.classList.add(`mood-${dayData.mood}`);
                    }
                }

                if (isCurrentMonth && day === today.getDate()) {
                    dayElement.classList.add('current-date');
                }

                this.daysElement.appendChild(dayElement);
            }
        }


        //adding days after mothn
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

async function fetchPeriodByDateCalendar(date: string) {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found in localStorage');
        return;
    }
    const requestBody = {
        date: date
    };

    try {
        const response = await fetch(`http://localhost:3000/evaluate/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const periodData = await response.json();
        return periodData;
    } catch (error) {
        console.error('Error fetching period by date:', error);
        return undefined; // Gib undefined zurück, wenn ein Fehler auftritt.
    }
}

window.onload = () => {
    new Calendar();
};