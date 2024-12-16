function seq() {
  let pattern = [];
  let bpm = 120;
  let beat = 0;

  for (let i = 0; i < 4; i++) {
    pattern[i] = i;
  }

  let trig = function(_time, _step) {
    if (beat % 4 == 0) kick.start(_time);

    if (_step.on) {
      for (let snd of _step.sound) {
        snd.start(_time + _step.getOffset());
      }
    }
    
    seg.update();

    //Draw
    /*
    Tone.Draw.schedule((time) => {
      drawOnBeat(_step.on, beat);
    });
    */
    
    beat++;
  }
    
  /*
  let sequencer = new Tone.Sequence((_time, _pttrn) => {
    trig(_time, _pttrn);
  }, pattern, "16n");

  //sequencer.playbackRate = 2;
  sequencer.start(0);
  */

  let patternIncrement = 0;
  function onStep(_time){
    if(pattern.length === 0) return;
    if(patternIncrement >= pattern.length){
      patternIncrement = 0;
    }
    trig(_time, pattern[patternIncrement]);
    patternIncrement++;
  }

  Tone.Transport.scheduleRepeat(onStep, "16n");

  this.setPatt = function(_patt) {
    //sequencer.events = _patt;
    pattern = _patt;
  }

  this.clear = function(){
    //sequencer.events.length = 0
    pattern = [];
  }
}

let container = function(_len) {

  let sequencer = new seq();

  //Container logic
  let length = _len; //How many steps long this container is (16th notes)
  let counter = 0;
  let seqObjs = [];
  let done = false;
  let currObj = 0;
  let isLoaded = false;

  this.update = function() {
    if (!isLoaded) {

      //UGLY solution to add all sequences to one big array rather than switching in runtime
      if(!dynamicMode){
        const allSequences = [];
        for(let i = 0; i < seqObjs.length; i++){
          const currentSeq = seqObjs[i].getPatt();
          for(let j = 0; j < currentSeq.length; j++){
            allSequences.push(currentSeq[j]);
          }
        }
        sequencer.setPatt(allSequences);
        isLoaded = true;
        return;
      }
      sequencer.setPatt(seqObjs[currObj].getPatt());
      isLoaded = true;
    }

    if (counter >= length) {
      /*
      done = true; //Container is done, remove it
      sequencer.setPatt([new seqObj(0, 0, 0, 0)]);
      return;
      */
    }

    seqObjs[currObj].update();
    counter++;
  }

  this.loadNext = function() {
    currObj++;
    if (currObj == seqObjs.length) {
      //Reached END
      currObj = 0;
      //console.log((millis()-timer)/1000);
    }
    sequencer.setPatt(seqObjs[currObj].getPatt());
  }

  this.addSeqObj = function(_sounds, _params, _playLen) {
    seqObjs.push(new seqObj(_sounds, _params, this));
  }

  this.clear = function(){
    sequencer.clear();
  }

}

//888802
let seqObj = function(_sounds, _params, _parent) {
  let parent = _parent;
  let sounds = _sounds;

  let length = _params.length || 16;
  let density = _params.density || 0;
  let variation = _params.variation == undefined ? 100 : _params.variation;
  let playFor = _params.playFor || length;
  let maxOffset = _params.maxOffset || 0;
  let offsetChance = _params.offsetChance || 0;
  let quant = _params.quant || 1; //Triplets?
  let quantIgnoreChance = _params.quantIgnoreChance || 0;
  let polyphony = _params.polyphony || 1;
  let polyChance = _params.polyChance || 0;
  let shuffle = _params.shuffle || false; //Play each note at least once
  let startOn = _params.startOn || 0;
  let pickOne = _params.pickOne || false;

  let counter = 0;
  let patt = [];

  //Rules
  //only odd notes if prev note on

  function createPattern(){
    
    let pickOneSound;
    if(pickOne){
      let ind = Math.floor(random(sounds.length));
      pickOneSound = sounds[ind];
    }
      
    for (let i = 0; i < length; i++) {
      if ((i - startOn) % quant == 0 || random(100) < quantIgnoreChance) {
        const isOn = random(100) < density ? 1 : 0;
        let tmpSnd = [...sounds];
        let ind = Math.floor(random(sounds.length));
        let stepSounds = [sounds[ind]];
        if(pickOne) stepSounds = [pickOneSound];
        tmpSnd.splice(ind, 1);
  
        for (let n = 1; n < polyphony; n++) {
          if (random(100) < polyChance) {
            ind = Math.floor(random(tmpSnd.length));
            stepSounds.push(tmpSnd[ind]);
            tmpSnd.splice(ind, 1);
          }
        }
        patt[i] = createStep(isOn, stepSounds, maxOffset, offsetChance);
      } else {
        patt[i] = createStep(false, null);
      }
    }
  }
  
  createPattern();

  this.update = function(_time) {
    //console.log("counter: " + counter)
    counter++;
    
    if (counter > playFor) {
      counter = 0;
      //console.log("switch")
      if(dynamicMode) createPattern(); //Overwrite pattern with new one
      parent.loadNext(); //Schedule this...
      return;
    }


  }

  this.getPatt = function() {
    return patt
  }
  
  this.getOffset = function(){
    return random(maxOffset);
  }
}

function createStep(_on, _sound, _maxOffset, _offsetChance) {
  return {
    on: _on,
    sound: _sound,
    getOffset(){
      return random(100) < _offsetChance ? random(_maxOffset) : 0;
    }
  }
}
