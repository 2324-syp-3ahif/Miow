import {Entry} from "../interfaces/entry";

// Add event listener to the submit button
const submitButton = document.getElementById("submitbtn");

export async function submit(): Promise<void> {
    // Retrieve token and username from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        console.error('Token or username not found in localStorage');
        return;
    }

    // Gather data from the form
    const date = document.getElementById("date")?.textContent.trim(); // Assuming you have the date element
    const mood = getSelectedMood(); // Implement getSelectedMood() to get the selected mood value
    const period = getSelectedPeriod(); // Implement getSelectedPeriod() to get the selected period value
    const emotions = getSelectedEmotions(); // Implement getSelectedEmotions() to get selected emotions
    const weather = getSelectedWeather(); // Implement getSelectedWeather() to get selected weather
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

    // Construct headers with Authorization Bearer token
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
    let selectedMood = 5; // Default mood value

    moodButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            const buttonId = button.id;
            let moodValue = 5; // Default value if no specific value is defined

            // Assign specific mood values based on button id
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
                    moodValue = 5; // Default to highest mood value if none matched
                    break;
            }

            if (moodValue < selectedMood) {
                selectedMood = moodValue;
            }
        }
    });

    return selectedMood;
}


function getSelectedPeriod() {
    const periodButtons = document.querySelectorAll('.period button img');
    let selectedPeriod = 2; // Default period value (grey drop)

    periodButtons.forEach(imgButton => {
        if (imgButton.classList.contains('selected')) {
            const imgSrc = imgButton.getAttribute('src');
            if (imgSrc === 'images/light_red_drop.png' || imgSrc === 'images/red_drop.png') {
                selectedPeriod = 2; // Use value 2 for light red and dark red drops
            }
        }
    });

    return selectedPeriod;
}


function getSelectedEmotions() {
    const emotionButtons = document.querySelectorAll('.emotion_button');
    const emotions: { [key: string]: boolean } = {};

    emotionButtons.forEach(button => {
        const emotionName = button.textContent?.trim().toLowerCase(); // Assuming button text is emotion name
        if (emotionName) {
            emotions[emotionName] = button.classList.contains('selected');
        }
    });

    return emotions;
}

function getSelectedWeather() {
    const weatherButtons = document.querySelectorAll('.weather_button');
    const weather: { [key: string]: boolean } = {};

    weatherButtons.forEach(button => {
        const weatherType = button.textContent?.trim().toLowerCase(); // Assuming button text is weather type
        if (weatherType) {
            weather[weatherType] = button.classList.contains('selected');
        }
    });

    return weather;
}











// Initial load: Set today's date


updateDateDisplay();

// Function to update the displayed date
export function updateDateDisplay() {
    let currentDate = new Date(new Date().toLocaleDateString('en-CA'));
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.textContent = currentDate.toISOString().split('T')[0];
    }
}


export function changeDay(delta: number) {
    const currentDateHtml= document.getElementById('date');
    let currentDate= (currentDateHtml as HTMLSpanElement).textContent;
    fetchEntryByDate(addDaysToDate(currentDate, delta))
}

function addDaysToDate(dateString: string, delta: number): string {
    // Parse the dateString in yyyy-mm-dd format to a Date object
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 because month in Date constructor is 0-based

    // Add delta days to the date
    date.setDate(date.getDate() + delta);

    // Format the date as yyyy-mm-dd
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const currentDateHtml= document.getElementById('date');
     currentDateHtml.textContent=formattedDate;
    return formattedDate;
}



// Function to fetch entry by date
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

        // Update UI with fetched data
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

// Helper function to get mood value from button id
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
            return 0; // Default value when no match
    }
}

// Helper function to get period value from image src
function getPeriodValueFromSrc(src: string | null): number {
    switch (src) {
        case 'images/light_red_drop.png':
            return 0;
        case 'images/red_drop.png':
            return 2;
        case 'images/grey_drop.png':
        default:
            return 0; // Default value when no match
    }
}


function resetUI() {
    // Reset Mood Buttons
    const moodButtons = document.querySelectorAll('.mood .emotion_button');
    moodButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });

    // Reset Period Buttons
    const periodButtons = document.querySelectorAll('.period button img');
    periodButtons.forEach((imgButton: Element) => {
        imgButton.parentElement?.classList.remove('selected');
    });

    // Reset Emotion Buttons
    const emotionButtons = document.querySelectorAll('.emotions .emotion_button');
    emotionButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });

    // Reset Weather Buttons
    const weatherButtons = document.querySelectorAll('.weather .weather_button');
    weatherButtons.forEach((button: Element) => {
        button.classList.remove('selected');
    });

    // Reset Sleep Input
    const sleepInput = document.getElementById('sleep-input') as HTMLInputElement;
    sleepInput.value = '0';

    // Reset Water Input
    const waterInput = document.getElementById('water-input') as HTMLInputElement;
    waterInput.value = '0';

    // Reset Note Content
    const noteContent = document.getElementById('note-content') as HTMLTextAreaElement;
    noteContent.value = '';
}








function toggleSelected(button: { classList: { toggle: (arg0: string) => void; }; }) {
    button.classList.toggle("selected");
}

