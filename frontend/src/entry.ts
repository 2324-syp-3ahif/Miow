import {Entry} from "../interfaces/entry";

 async function submit(): Promise<void> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        console.error('Token or username not found in localStorage');
        return;
    }

    const date = document.getElementById("date")?.textContent.trim();
    const mood = getSelectedMood();
    const period = getSelectedPeriod();
    const emotions = getSelectedEmotions();
    const weather = getSelectedWeather();
    const sleep = (document.getElementById("sleep-input") as HTMLInputElement)?.value.trim();
    const water = (document.getElementById("water-input") as HTMLInputElement)?.value.trim();
    const text = (document.getElementById("note-content") as HTMLTextAreaElement)?.value.trim();

    const data = {
        date,
        mood,
        period,
        emotions,
        weather,
        sleep: parseInt(sleep || '0', 10),
        water: parseInt(water || '0', 10),
        text
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch('http://localhost:3000/entry/day', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Log entry submitted successfully:', responseData);
    } catch (error) {
        console.error('Error submitting log entry:', error);
    }
}

function getSelectedMood() {
    const moodButtons = document.querySelectorAll('.mood .emotion_button');
    let selectedMood = 0;
    moodButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            const buttonId = button.id;
            let moodValue;
            switch (buttonId) {
                case 'very-good':
                    moodValue = 5;
                    break;
                case 'good':
                    moodValue = 4;
                    break;
                case 'meh':
                    moodValue = 3;
                    break;
                case 'bad':
                    moodValue = 2;
                    break;
                case 'very-bad':
                    moodValue = 1;
                    break;
                default:
                    moodValue = 0;
                    break;
            }
            if (moodValue > selectedMood) {
                selectedMood = moodValue;
            }
        }
    });
    return selectedMood;
}


function getSelectedPeriod() {
    const periodButtons = document.querySelectorAll('.period button img');
    let selectedPeriod = 2;
    periodButtons.forEach(imgButton => {
        if (imgButton.classList.contains('selected')) {
            const imgSrc = imgButton.getAttribute('src');
            selectedPeriod=1;
        }
    });
    return selectedPeriod;
}


function getSelectedEmotions() {
    const emotionButtons = document.querySelectorAll('.emotion_button');
    const emotions: { [key: string]: boolean } = {};
    for (let i = 5; i < emotionButtons.length; i++) {
        const emotionName = (emotionButtons[i] as HTMLImageElement).id?.trim().toLowerCase();
        if (emotionName) {
            emotions[emotionName] = emotionButtons[i].classList.contains('selected');
        }
    }
    return emotions;
}

function getSelectedWeather() {
    const weatherButtons = document.querySelectorAll('.weather_button');
    const weather: { [key: string]: boolean } = {};
    weatherButtons.forEach(button => {
        const weatherType = (button as HTMLImageElement).id?.trim().toLowerCase();
        if (weatherType) {
            weather[weatherType] = button.classList.contains('selected');
        }
    });
    return weather;
}

 function updateDateDisplay() {
    let currentDate = new Date(new Date().toLocaleDateString('en-CA'));
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.textContent = currentDate.toISOString().split('T')[0];
    }
    changeDay(0);
}

function changeDay(delta: number) {
    const currentDateHtml= document.getElementById('date');
    let currentDate= (currentDateHtml as HTMLSpanElement).textContent;
    fetchEntryByDateAndUpdate(addDaysToDate(currentDate, delta))
}

function addDaysToDate(dateString: string, delta: number): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + delta);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const currentDateHtml= document.getElementById('date');
     currentDateHtml.textContent=formattedDate;
    return formattedDate;
}

async function fetchEntryByDateAndUpdate(date: string) {
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
        updateUI(responseData);
    } catch (error) {
        console.error('Error fetching entry by date:', error);
    }
}

async function updateUI(data: any) {
    resetUI();
    // Update Mood Buttons
    const moodButtons = document.querySelectorAll('.mood .emotion_button');
    moodButtons.forEach((button: Element) => {
        const moodId = button.id;
        if (data.mood === getMoodValueFromId(moodId)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Update Period Buttons
    const periodButtons = document.querySelectorAll('.period button img');
    periodButtons.forEach((imgButton: Element) => {
        const imgSrc = imgButton.getAttribute('src');
        if (data.period === getPeriodValueFromSrc(imgSrc)) {
            imgButton.parentElement?.classList.add('selected');
        } else {
            imgButton.parentElement?.classList.remove('selected');
        }
    });

    // Update Emotion Buttons
    const emotionButtons = document.querySelectorAll('.emotions .emotion_button');
    emotionButtons.forEach((button: Element) => {
        const emotionId = button.id;
        if (data.emotions[emotionId]) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Update Weather Buttons
    const weatherButtons = document.querySelectorAll('.weather .weather_button');
    weatherButtons.forEach((button: Element) => {
        const weatherId = button.id;
        if (data.weather[weatherId]) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Update Sleep Input
    const sleepInput = document.getElementById('sleep-input') as HTMLInputElement;
    sleepInput.value = data.sleep.toString();

    // Update Water Input
    const waterInput = document.getElementById('water-input') as HTMLInputElement;
    waterInput.value = data.water.toString();

    // Update Note Content
    const noteContent = document.getElementById('note-content') as HTMLTextAreaElement;
    noteContent.value = data.text || '';
}

function getMoodValueFromId(id: string): number {
    switch (id) {
        case 'very-good':
            return 5;
        case 'good':
            return 4;
        case 'meh':
            return 3;
        case 'bad':
            return 2;
        case 'very-bad':
            return 1;
        default:
            return 0;
    }
}

function getMoodColorClass(mood:number) :string{
    switch(mood) {
        case 5:
            return 'very-good';
        case 4:
            return 'good';
        case 3:
            return 'meh';
        case 2:
            return 'bad';
        case 1:
            return 'very-bad';
        default:
            return '';
    }
}


function getPeriodValueFromSrc(src: string | null): number {
    switch (src) {
        case 'images/light_red_drop.png':
            return 3;
        case 'images/red_drop.png':
            return 1;
        case 'images/grey_drop.png':
            return 2;
        default:
            return 0;
    }
}

function resetUI() {
    // Reset Mood Buttons
    const moodButtons = document.querySelectorAll('.mood .emotion_button');
    moodButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });
    const periodButtons = document.querySelectorAll('.period button img');
    periodButtons.forEach((imgButton: Element) => {
        imgButton.parentElement?.classList.remove('selected');
    });
    const emotionButtons = document.querySelectorAll('.emotions .emotion_button');
    emotionButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });
    const weatherButtons = document.querySelectorAll('.weather .weather_button');
    weatherButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });
    const sleepInput = document.getElementById('sleep-input') as HTMLInputElement;
    sleepInput.value = '0';
    const waterInput = document.getElementById('water-input') as HTMLInputElement;
    waterInput.value = '0';
    const noteContent = document.getElementById('note-content') as HTMLTextAreaElement;
    noteContent.value = '';
}

function toggleSelected(button:any) {
    if (button.id === 'very-good' || button.id === 'good' || button.id === 'bad' || button.id === 'very-bad' || button.id === 'meh') {
        var buttonElement = document.getElementById('very-good');
        buttonElement.classList.remove('selected');
        buttonElement=document.getElementById('good');
        buttonElement.classList.remove('selected');
        buttonElement=document.getElementById('meh');
        buttonElement.classList.remove('selected');
        buttonElement=document.getElementById('bad');
        buttonElement.classList.remove('selected');
        buttonElement=document.getElementById('very-bad');
        buttonElement.classList.remove('selected');
        button.classList.add('selected');
    }
    else if(button.alt==='grey drop'|| button.alt==='light red drop'|| button.alt==='dark red drop'){
        const buttons = ['button1', 'button2', 'button3'];
        buttons.forEach((buttonId) => {
            const btn = document.getElementById(buttonId) as HTMLButtonElement;
            const img = btn.querySelector('img') as HTMLImageElement;
            if (img === button) {
                img.classList.add('selected');
                img.classList.add('period-button-selected')
            } else {
                img.classList.remove('selected');
                img.classList.remove('period-button-selected')
            }
        });
    }
    else {
        button.classList.toggle("selected");
    }
}




















//week stuff

async function updateWeek(weeks_difference_from_today: number) {
    let currentMondayDate = document.getElementById("week_date_mon")?.textContent;
    if (!currentMondayDate ) {
        currentMondayDate = getCurrentWeekStartDate();
    }
    else{

    }
    let parts = currentMondayDate.split(" ");
    let month = parts[1]; // "June"
    let day = parseInt(parts[2].replace(',', '')); // 23
    let year = parseInt(parts[3]); // 2024
    if(year<100){
        year+=2000;
    }
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const currentDate = new Date(year, monthIndex, day);
    const targetDate = new Date(currentDate);
    targetDate.setDate(targetDate.getDate() + weeks_difference_from_today * 7);
     let month2 = targetDate.getMonth()+1;
     day = targetDate.getDate();
     year = targetDate.getFullYear();
    let formattedDate = `${year}-${month2.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const url = `http://localhost:3000/entry/week?date=${formattedDate}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        updateWeekUI(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function isValidDateString(dateString: string): boolean {
    const pattern = /^[A-Za-z]+ (\w{3}) (\d{1,2}), (\d{2,4})$/;
    return pattern.test(dateString);
}

function getCurrentWeekStartDate(): string {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    return startOfWeek.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function updateWeekUI(data:any) {
    document.getElementById("note-content").textContent = data.text;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
        document.getElementById(`${day.toLowerCase()}-log`).textContent = data.Days[day].text;
    });

    days.forEach((day, index) => {
        const dayDate = formatDate(addDays(data.weekStartDay, index));
        const moodClass = getMoodColorClass(data.Days[day].Mood);
        document.getElementById(`week_date_${day.toLowerCase().slice(0, 3)}`).innerHTML = `<span class="${moodClass}"></span>${day} ${dayDate}`;
    });

    document.getElementById("weekly_log").textContent = `Weekly Log ${formatDate2(data.weekStartDay)} - ${formatDate2(data.weekEndDay)}`;
    (document.getElementById("note-content")as HTMLTextAreaElement).value = data.text;

    days.forEach(day => {
        const period = data.Days[day].Period;
        document.getElementById(`week_date_${day.toLowerCase().slice(0, 3)}`).style.color = (period == 1) ? "red" : "white";
    });
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' ,year:'2-digit'})}`;
}

function formatDate2(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', {day: 'numeric', month: 'short' ,year:'numeric'})}`;
}

function addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
async function submit_week() {
    const entryData = (document.getElementById("note-content") as HTMLTextAreaElement).value.trim();
    const weekStartDate = document.getElementById("week_date_mon")?.textContent;
    if ( !weekStartDate) {
        console.error("Textarea content or week start date is missing.");
        return;
    }

    const parts = weekStartDate.split(" ");
    const month = parts[1];
    const day = parts[2].replace(',', '');
    const year = parts[3];
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;
    const formattedDate = `20${year}-${monthIndex.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    const url = "http://localhost:3000/entry/week/";
    const token = localStorage.getItem('token');
    const requestBody = {
        date: formattedDate,
        entryData: entryData
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Failed to submit week data");
        }

        const responseData = await response.json();
        console.log("Week data submitted successfully:", responseData);
    } catch (error) {
        console.error("Error submitting week data:", error);
    }
}
