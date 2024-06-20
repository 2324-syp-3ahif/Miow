export var BaseEntry:Entry= {
        date: "",
        mood: 3,
        period: 2,
        emotions: {
            exited: false,
            relaxed: false,
            proud: false,
            hopefull: false,
            happy: false,
            lonely: false,
            emo: false,
            anxious: false,
            sad: false,
            angry: false,
            tired: false
        },
        weather:{
            sunny:false,
            windy:false,
            rainy:false,
            snowy:false,
            cloudy:false
        },
        sleep:0,
        water:2,
        text: ""
}
export interface Entry {
    date:string,
    mood: number,
    period: number,
    emotions: {
        exited: boolean,
        relaxed: boolean,
        proud: boolean,
        hopefull: boolean,
        happy: boolean,
        lonely: boolean,
        emo: boolean,
        anxious: boolean,
        sad: boolean,
        angry: boolean,
        tired: boolean
    },
    weather:{
        sunny:boolean,
        windy:boolean,
        rainy:boolean,
        snowy:boolean,
        cloudy:boolean
    },
    sleep:number,
    water:number,
    text: string
}