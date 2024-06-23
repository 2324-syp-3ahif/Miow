document.addEventListener("DOMContentLoaded", () => {
    const themes: any= {
        Matcha: {
            "--primary-color": "#35008c",
            "--inner-color": "#dcedc1",
            "--input-color": "#ffd3b6",
            "--background-color": "#ffaaa5",
            "--font-color": "#de4b4b",
        },
        Bubblegum: {
            "--primary-color": "#ffb6c1",
            "--inner-color": "#ffe4e1",
            "--input-color": "#ffc0cb",
            "--background-color": "#ff69b4",
            "--font-color": "#ff1493",
        },
        CottonCandy: {
            "--primary-color": "#ffdde1",
            "--inner-color": "#ffb6c1",
            "--input-color": "#ffb6c1",
            "--background-color": "#ffa6c9",
            "--font-color": "#ff69b4",
        },
        Dragona: {
            "--primary-color": "#ff7f50",
            "--inner-color": "#ff6347",
            "--input-color": "#ff4500",
            "--background-color": "#ff8c00",
            "--font-color": "#ff4500",
        },
        Dragonfruit: {
            "--primary-color": "#ff4500",
            "--inner-color": "#ff6347",
            "--input-color": "#ff7f50",
            "--background-color": "#ff8c00",
            "--font-color": "#ff4500",
        },
        Gatorade: {
            "--primary-color": "#00bfff",
            "--inner-color": "#1e90ff",
            "--input-color": "#87cefa",
            "--background-color": "#4682b4",
            "--font-color": "#136079",
        },
        Lavafoodcake: {
            "--primary-color": "#d2691e",
            "--inner-color": "#8b4513",
            "--input-color": "#a0522d",
            "--background-color": "#deb887",
            "--font-color": "#65462f",
        },
        Peachpunch: {
            "--primary-color": "#ffdab9",
            "--inner-color": "#ffdead",
            "--input-color": "#ffebcd",
            "--background-color": "#ffe4b5",
            "--font-color": "#ff8c00",
        },

    };

    const buttons = document.querySelectorAll(".theme-button") as NodeListOf<HTMLButtonElement>;

    buttons.forEach((button) => {
        button.addEventListener('click', function(this: HTMLButtonElement) {
            const themeName = this.id;
            const theme = themes[themeName];

            for (let color in theme) {
                document.documentElement.style.setProperty(color, theme[color]);
            }
        });
    });
});
