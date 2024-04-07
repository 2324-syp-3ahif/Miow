export var BaseEntry:Entry= {
    fixed_blocks: {
        date: "",
        mood: 0,
        emotions: {//
            exited: false,
            relaxed: false,
            proud: false,
            hopefull: false,
            happy: false,
            pit_a_pet: false,
            hungry: false,
            gloomy: false,
            lonely: false,
            depressed: false,
            anxious: false,
            sad: false,
            angry: false,
            tired: false
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
    period: number;//0.. not tracking period, 1.. period, 2.. no period, 3.. predicted period, -1 not set
}
export interface IconBlock{
    name:string;
    icons:Icon[];
}
export interface Icon{
    name: string;
    value: boolean;
    iconPicID:number;
}
export interface NumberBlock {
    name:string;
    unit: string;
    amount: number;
}
export interface Emotions {//0.. no, 1.. yes
    exited: boolean;
    relaxed: boolean;
    proud: boolean;
    hopefull: boolean;
    happy: boolean;
    pit_a_pet: boolean;
    hungry: boolean;
    gloomy: boolean;
    lonely: boolean;
    depressed: boolean;
    anxious: boolean;
    sad: boolean;
    angry: boolean;
    tired: boolean;
}