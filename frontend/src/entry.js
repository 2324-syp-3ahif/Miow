async function getDate() {
    try {
        const response = await fetch('http://localhost:3000/day');
        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            return;
        }
        const data = await response.json();
        const date = data.date;
        document.getElementById('date').textContent = date;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
export async function submitNote() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token || !username) {
        console.error('Token or username not found in localStorage');
        return;
    }
    const noteContent = document.getElementById('note-content');
    const entry = {
        fixed_blocks: {
            date: new Date().toISOString().split('T')[0],
            mood: -1,
            emotions: {
                exited: -1,
                relaxed: -1,
                proud: -1,
                hopefull: -1,
                happy: -1,
                pit_a_pet: -1,
                hungry: -1,
                gloomy: -1,
                lonely: -1,
                depressed: -1,
                anxious: -1,
                sad: -1,
                angry: -1,
                tired: -1
            },
            text: noteContent.value,
            period: -1
        },
        icon_blocks: [],
        number_blocks: []
    };
    try {
        const response = await fetch('http://localhost:3000/api/entry/day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(entry),
        });
        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            return;
        }
        console.log('Note submitted successfully');
    }
    catch (error) {
        console.error('Error submitting note:', error);
    }
}
//# sourceMappingURL=entry.js.map