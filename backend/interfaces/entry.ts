interface Entry {
    fixed_blocks: FixedBlocks;
    icon_blocks:IconBlock[];
    number_blocks: NumberBlock[];
}
interface FixedBlocks {
    date: string;//yyyy-mm-dd
    mood: number;//1-5, 1 is best
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
}
interface NumberBlock {
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