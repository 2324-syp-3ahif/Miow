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
  } catch (error) {
    console.error('Error:', error);
  }
}

async function submitNote() {
    const noteContent = document.getElementById('note-content') as HTMLInputElement;
    const username = localStorage.getItem('username');
    const response = await fetch('http://localhost:3000/api/entry/day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, note: noteContent.value }),
    });

    if (!response.ok) {
        console.error(`Error: ${response.status}`);
        return;
    }

    console.log('Note submitted successfully');
}