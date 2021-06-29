const AudioNode = {
    init: ()=>{

        let audioContext = window.AudioContext || window.webkitAudioContext;

        if(window.AudioContext !== undefined){
            audioContext = new AudioContext()
        }
        
        return audioContext

    },
    load: async (audioPath)=>{

        const clip = new Promise(resolve =>{
            fetch(audioPath)
                .then(res => res.arrayBuffer())
                .then(response => resolve(response))
                .catch(err => console.error(err))
        })
        return AudioNode.decodeClip(await clip)

    },
    loadMultiple: (audioPaths)=>{

        let audioToFetch = []

        audioPaths.forEach(audioPath => {
            audioToFetch.push(
                AudioNode.load(audioPath)
            )
        })

        return Promise.all(audioToFetch)

    },
    decodeClip: (clip)=>{
        return audioContext.decodeAudioData(clip)    
    },
    play: (decodedClip, clipName, loop = false)=>{

        const source = audioContext.createBufferSource()
        source.buffer = decodedClip
        loop && (source.loop = true)
        source.connect(audioContext.destination)
        source.start(0)
        
        currentSources.push({
            clipName,
            source
        })
        
    },
    stop: (source)=>{
        source.stop(0)
    }
}

class Panner{
    constructor (decodedClip, pos = false, loop = false){
        this.clip = decodedClip
        this.pos = pos
        this.loop = loop
        
        this.bootup(this.pos)

        this.source.onended = ()=>{
            this.bootup(this.pos)
        }
    }

    bootup(pos){
        this.audioContext = audioContext
        this.panner = this.audioContext.createPanner()
        this.panner.panningModel = "HRTF"

        this.source = this.audioContext.createBufferSource()
        this.source.buffer = this.clip

        this.source.connect(this.panner)
        this.panner.connect(this.audioContext.destination)           
        
        this.panner.setPosition(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        )

        this.available = true
        console.log('Clip ready')
    }

    play(){
        if(this.available){
            this.source.start()
            this.available = false
        } else{
            this.bootup() 
            this.play()
        }
    }
    
    stop(){
        this.source.stop()
        this.available = false
    }
}

const currentSources = []

const audioContext = AudioNode.init()

export {AudioNode, audioContext, currentSources, Panner};