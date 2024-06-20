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
let currentDate = new Date();
updateDateDisplay();

// Function to update the displayed date
function updateDateDisplay() {
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.textContent = currentDate.toISOString().split('T')[0];
    }
}

// Event listeners for previous and next day buttons
const prevButton = document.getElementById('prev') as HTMLButtonElement;
const nextButton = document.getElementById('next') as HTMLButtonElement;

prevButton.addEventListener('click', () => changeDay(-1));
nextButton.addEventListener('click', () => changeDay(1));

function changeDay(delta: number) {
    currentDate.setDate(currentDate.getDate() + delta);
    fetchEntryByDate(currentDate);
}

// Function to fetch entry by date
async function fetchEntryByDate(date: Date) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token not found in localStorage');
        return;
    }

    const dateString = date.toISOString().split('T')[0];
    try {
        const response = await fetch(`http://localhost:3000/entry/day?date=${dateString}`, {
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

// Function to update UI with fetched data
function updateUI(data: Entry) {
    // Update mood
    const moodButtons = document.querySelectorAll('.mood .emotion_button');
    moodButtons.forEach(button => {
        button.classList.remove('selected'); // Clear previously selected
        const buttonId = button.id;
        if (data.mood === 5 && buttonId === 'very-good') {
            button.classList.add('selected');
        } else if (data.mood === 4 && buttonId === 'good') {
            button.classList.add('selected');
        } else if (data.mood === 3 && buttonId === 'meh') {
            button.classList.add('selected');
        } else if (data.mood === 2 && buttonId === 'bad') {
            button.classList.add('selected');
        } else if (data.mood === 1 && buttonId === 'very-bad') {
            button.classList.add('selected');
        }
    });

    // Update period
    const periodButtons = document.querySelectorAll('.period button img');
    periodButtons.forEach(imgButton => {
        imgButton.classList.remove('selected');
        const imgSrc = imgButton.getAttribute('src');
        if (data.period === 2 && (imgSrc === 'images/light_red_drop.png' || imgSrc === 'images/red_drop.png')) {
            imgButton.classList.add('selected');
        }
    });

    // Update emotions
    const emotionButtons = document.querySelectorAll('.emotion_button');
    emotionButtons.forEach(button => {
        const emotionName = button.id;
        if (data.emotions && data.emotions[emotionName]) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Update weather
    const weatherButtons = document.querySelectorAll('.weather_button');
    weatherButtons.forEach(button => {
        const weatherType = button.id;
        if (data.weather && data.weather[weatherType]) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Update sleep
    const sleepInput = document.getElementById('sleep-input') as HTMLInputElement;
    sleepInput.value = data.sleep.toString();

    // Update water
    const waterInput = document.getElementById('water-input') as HTMLInputElement;
    waterInput.value = data.water.toString();

    // Update text
    const noteContent = document.getElementById('note-content') as HTMLTextAreaElement;
    noteContent.value = data.text;
}

// Initial fetch for today's entry
fetchEntryByDate(currentDate);











function toggleSelected(button: { classList: { toggle: (arg0: string) => void; }; }) {
    button.classList.toggle("selected");
}

