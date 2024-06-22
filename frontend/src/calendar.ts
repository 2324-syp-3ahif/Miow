 function calendar(){
    let date: Date = new Date();
    let year: number = date.getFullYear();
    let month: number = date.getMonth();

    const day: HTMLElement | null = document.querySelector(".calendar-dates");

    const currdate: HTMLElement | null = document.querySelector(".calendar-current-date");

    const prenexIcons: NodeListOf<HTMLElement> = document.querySelectorAll(".calendar-navigation span");

// Array of month names
    const months: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const manipulate = (): void => {

        let dayone: number = new Date(year, month, 1).getDay();

        let lastdate: number = new Date(year, month + 1, 0).getDate();

        let dayend: number = new Date(year, month, lastdate).getDay();

        let monthlastdate: number = new Date(year, month, 0).getDate();

        let lit: string = "";


        for (let i = dayone; i > 0; i--) {
            lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
        }


        for (let i = 1; i <= lastdate; i++) {


            let isToday: string = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
                ? "active"
                : "";
            lit += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive">${i - dayend + 1}</li>`
        }

        if (currdate) {
            currdate.innerText = `${months[month]} ${year}`;
        }

        if (day) {
            day.innerHTML = lit;
        }
    }

    manipulate();


    prenexIcons.forEach(icon => {

        icon.addEventListener("click", () => {

            month = icon.id === "calendar-prev" ? month - 1 : month + 1;

            if (month < 0 || month > 11) {

                date = new Date(year, month, new Date().getDate());

                year = date.getFullYear();

                month = date.getMonth();
            }

            else {

                date = new Date();
            }

            manipulate();
        });
    });

//junk code rn
    function fetchMoodData(): string[] {
        return [];
    }

    let moodData: string[] = fetchMoodData();

    let dateElements: NodeListOf<HTMLElement> = document.querySelectorAll('.calendar-dates li');


    dateElements.forEach((dateElement, index) => {

        let mood: string = moodData[index];

        let color: string;
        switch (mood) {
            case 'very-good':
                color = '#22ec22';
                break;
            case 'good':
                color = '#a3ff95';
                break;
            case 'meh':
                color = '#ffda0c';
                break;
            case 'bad':
                color = '#ffa056';
                break;
            case 'very-bad':
                color = '#ff4d4d';
                break;
            default:
                color = '#fff'; // Default color if no mood data
        }

        dateElement.style.backgroundColor = color;
        dateElement.style.color = '#000'; // Set text color to black
    });
}

