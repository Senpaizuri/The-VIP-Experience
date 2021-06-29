import { currentSources } from "./modules/audio.js"
import { AudioNode, audioContext, Panner } from "./modules/audio.js"

const clips = await AudioNode.loadMultiple([
    './audio/clip01.wav',
    './audio/clip02.wav'
]) 

const panner = 
    new Panner(clips[0])

const app = {
    init:()=>{

        document.querySelector('#beep').addEventListener('click',async ()=>{
            panner.play()
        })

        document.querySelector('#droop').addEventListener('click',async ()=>{
            AudioNode.play(clips[1], 'Rain', true)
        })

        document.querySelector('#stop').addEventListener('click',async ()=>{
            panner.stop()
        })
        
    }
}

app.init()