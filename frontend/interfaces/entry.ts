export var BaseEntry:Entry= {
    fixed_blocks: {
        date: "",
        mood: 0,
        emotions: {
            exited: 0,
            relaxed: 0,
            proud: 0,
            hopefull: 0,
            happy: 0,
            pit_a_pet: 0,
            hungry: 0,
            gloomy: 0,
            lonely: 0,
            depressed: 0,
            anxious: 0,
            sad: 0,
            angry: 0,
            tired: 0
        },
        text: "",
        period: 2
    },
    icon_blocks: [
        {
            name: "Weather",
            icons: [
                {
                    name:"Sunny",
                    value:false,
                    iconPicID:0
                },
                {
                    name:"Cloudy",
                    value:false,
                    iconPicID:0
                },
                {
                    name:"Rainy",
                    value:false,
                    iconPicID:0
                },
                {
                    name:"Snowy",
                    value:false,
                    iconPicID:0
                },
                {
                    name:"Windy",
                    value:false,
                    iconPicID:0
                },
            ]
        }
    ],
    number_blocks: [
        {
            name:"Water drunken:",
            unit:"Glasses",
            amount:0
        }
    ]
}
export interface Entry {
    fixed_blocks: FixedBlocks;
    icon_blocks:IconBlock[];
    number_blocks: NumberBlock[];
}
interface FixedBlocks {
    date: string;//yyyy-mm-dd
    mood: number;//1-5, 1 is best, 0 is not choosen jet
    emotions: Emotions;
    text: string;
    period: number;//0.. not tracking period, 1.. period, 2.. no period, 3.. predicted period
}
interface IconBlock{
    name:string;
    icons:Icon[];
}
interface Icon{
    name: string;
    value: boolean;
    iconPicID:number;
}
interface NumberBlock {
    name:string;
    unit: string;
    amount: number;
}
interface Emotions {//0.. no, 1.. yes
    exited: number;
    relaxed: number;
    proud: number;
    hopefull: number;
    happy: number;
    pit_a_pet: number;
    hungry: number;
    gloomy: number;
    lonely: number;
    depressed: number;
    anxious: number;
    sad: number;
    angry: number;
    tired: number;
}