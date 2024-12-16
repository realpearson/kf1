let cnv;

//Primary audio system


const mainLoop = new Tone.Player('assets/PadLoop.wav').toDestination();
mainLoop.loop = true;

const kick = new Tone.Player('assets/kickn.wav').toDestination();

const noteGain = new Tone.Gain(0.4).toDestination();
const note1 = new Tone.Player('assets/notes.wav').connect(noteGain);
const note2 = new Tone.Player('assets/notes-1.wav').connect(noteGain);
const note3 = new Tone.Player('assets/notes-2.wav').connect(noteGain);
const note4 = new Tone.Player('assets/notes-3.wav').connect(noteGain);
const note5 = new Tone.Player('assets/notes-4.wav').connect(noteGain);
const note6 = new Tone.Player('assets/notes-5.wav').connect(noteGain);
const note7 = new Tone.Player('assets/notes-6.wav').connect(noteGain);
const note8 = new Tone.Player('assets/notes-7.wav').connect(noteGain);

let notes = [note1, note2, note3, note4, note5, note6, note7, note8];

let verb = new Tone.Reverb(4.5).toDestination();
noteGain.connect(verb);

let seg;

//Time between each loop
let timer = 0;

//UX & States
let on = false;
let dynamicMode = false;

function start(){
  Tone.Transport.start();
  mainLoop.start();
  timer = millis();
}

function stop(){
  Tone.Transport.stop();
  mainLoop.stop();
}

//Static Mode
let conditionAButton;

//Dynamic Mode
let conditionBButton;

//Toggle
let togglePlayButton;

function setup() {
  cnv = createCanvas(displayWidth * (1 / displayDensity()), displayHeight * (1 / displayDensity()));
  background(20);

  seg = new container(10000, true);
  makeDynamicSeq2(seq);

  //Static Mode
  conditionAButton = {
    pos:{x:200, y:height-250},
    size:{x:200, y:100},
    func: () => {
      if(on) {
        on = false;
        stop();
      }
      seg.clear();
      seg = new container(10000, true);
      makeDynamicSeq2(seq);
      dynamicMode = false;
    }
  }

//Dynamic Mode
conditionBButton = {
  pos:{x:width-450, y:height-250},
  size:{x:200, y:100},
  func: () => {
    if(on) {
      on = false;
      stop();
    }
    seg.clear();
    seg = new container(10000, true);
    makeDynamicSeq2(seq);
    dynamicMode = true;
  }
}

togglePlayButton = {
  pos:{x:width/4, y:height/2},
  func: () => {
    on = !on;
    if (on) {
      start()
    } else {
      stop();
    }
  }
}

}

function mousePressed(){
  if(!fullscreen()) fullscreen(true);
  if(mouseX > conditionAButton.pos.x && mouseX < conditionAButton.pos.x + conditionAButton.size.x
    && mouseY > conditionAButton.pos.y && mouseY < conditionAButton.pos.y + conditionAButton.size.y)
  {
    console.log("push A")
    conditionAButton.func();
  }
  if(mouseX > conditionBButton.pos.x && mouseX < conditionBButton.pos.x + conditionBButton.size.x
    && mouseY > conditionBButton.pos.y && mouseY < conditionBButton.pos.y + conditionBButton.size.y)
  {
    console.log("push B")
    conditionBButton.func();
  }
//width/2.1, height/2.1, 400)
  if(createVector(mouseX, mouseY).dist(createVector(width/2.1, height/2.1)) < 200){
    console.log("toggle")
    togglePlayButton.func();
  }
}


function draw(){

  //Rendering
  background(20);
  textSize(55);
  fill(235);

  if(on){
    text("Music Playing", width/2.85, height/2);
  } else {
    text("Music Stopped", width/2.85, height/2)
  }

  if(!on)noFill();
  else fill(240, 20, 10, 50);
  stroke(222);
  circle(width/2.1, height/2.1, 400);

  if(!dynamicMode) fill(222, 30);
  else noFill();
  rect(conditionAButton.pos.x, conditionAButton.pos.y, conditionAButton.size.x, conditionAButton.size.y);
  text("A", conditionAButton.pos.x+ 80, conditionAButton.pos.y +70);
  if(dynamicMode) fill(222, 30);
  else noFill();
  rect(conditionBButton.pos.x, conditionBButton.pos.y, conditionBButton.size.x, conditionBButton.size.y);
  text("B", conditionBButton.pos.x+ 80, conditionBButton.pos.y +70);
}


function makeDynamicSeqtest(_segment){
  
  seg.addSeqObj(notes, {
    length : 16,
    playFor : 16,
    density : 20,
    polyChance : 35,
    polyphony : 3,
    maxOffset : 0.02,
    offsetChance : 65
  })
    
  seg.addSeqObj(notes, {
    length: 8,
    density: 100,
    playFor: 64,
    quant: 4, 
    pickOne: true
  });
  
  seg.addSeqObj(notes, {
    length: 100,
    //playFor: 1000,
    density: 100
  });
  /*
  seg.addSeqObj(notes, {
    length: 4,
    density: 50
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 15
  });
  seg.addSeqObj(notes, {
    length: 16,
    density: 30,
    playFor: 16
  });
  */

  /*
  seg.addSeqObj(notes, {
    length: 4,
    density: 0
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 100,
    playFor: 8
  });
  */
  //seg.addSeqObj(notes, 32, 0, 1);
}
function makeDynamicSeq2(_segment){
  seg.addSeqObj(notes, {
    length : 16,
    playFor : 8,
    density : 20,
    polyChance : 35,
    polyphony : 3,
    //maxOffset : 0.02,
    //offsetChance : 65
  })
  seg.addSeqObj(notes, {
    pickOne: true,
    length: 8,
    density: 100,
    playFor: 8,
    quant: 4
  });
  seg.addSeqObj(notes, {
    length: 8,
    density: 100
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 50
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 15
  });
  /*
  seg.addSeqObj(notes, {
    length: 8,
    density: 30,
    playFor: 8
  });

  */
}


function makeDefault(_segment){
  seg.addSeqObj(notes, {
    length : 16,
    playFor : 32,
    density : 20,
    polyChance : 35,
    polyphony : 3,
    maxOffset : 0.02,
    offsetChance : 65
  })
  seg.addSeqObj([notes[0]], {
    length: 16,
    density: 100,
    playFor: 64,
    quant: 4
  });
  seg.addSeqObj(notes, {
    length: 16,
    density: 100
  });
  seg.addSeqObj(notes, {
    length: 8,
    density: 50
  });
  seg.addSeqObj(notes, {
    length: 8,
    density: 0
  });
  seg.addSeqObj(notes, {
    length: 16,
    density: 30,
    playFor: 64
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 0
  });
  seg.addSeqObj(notes, {
    length: 4,
    density: 100,
    playFor: 16
  });
  seg.addSeqObj(notes, 32, 0, 1);
}
