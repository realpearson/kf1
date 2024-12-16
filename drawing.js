let gPos;
//Superdupershaper
let thingMaka;

let r = 15;
let theta = 0;
let res = 50;
let inc;
let ran = 0;
let noice = 0;

let rnoise = 0;
let nnoise = 0;


//Shaper
let shp;


function drawOnBeat(_noteOn, _beat) {
  /*
  if (_noteOn) {
    shp.update();
    ran = random(100);
    thingMaka.update();
  }
  spawnObj();
  shp.render();
  thingMaka.render();
  */
}

let Shaper = function() {
  let coords = [];
  let numCoords = 6;
  const inc = 30;

  const pg = createGraphics(width, height);

  //Initialize
  for (let i = 0; i < numCoords; i++) {
    coords.push(makeCoord());
  }

  pg.stroke(255);
  //pg.fill(20);
  pg.noFill();
  for (let c of coords) pg.rect(c.coord.x, c.coord.y, c.size.x, height - c.coord.y);
  //rectMode(CENTER);

  //Generate
  let cobj = coords[Math.floor(random(numCoords))];
  let start = Math.floor(random(cobj.coord.x, cobj.size.x + cobj.coord.x));
  let currentY = cobj.coord.y;

  this.update = function() {

    if (currentY > height) {
      cobj = coords[Math.floor(random(numCoords))];
      start = Math.floor(random(cobj.coord.x, cobj.size.x + cobj.coord.x - height / 20));
      currentY = cobj.coord.y;
    }

    pg.noStroke();
    pg.fill(random(255), random(255), random(255), random(255));

    let rSize = random(height / 65, height / 20);
    pg.rect(start, currentY, rSize, rSize);
    currentY += inc;
  }
  
  this.render = function(){
    image(pg, 0, 0);
  }


  //Helpers
  function makeCoord() {
    if (coords.length == 0) {
      return makeCoordObj();
    }

    let iteration = 0;
    let weight = 90;

    while (iteration < 100) {
      let c = makeCoordObj();

      for (let oth of coords) {
        const dist = p5.Vector.dist(c.coord, oth.coord)
        if (dist < c.size.x) {
          weight = 10;
        }
      }

      iteration++;
      if (random(100) < weight) return c;
      if (iteration >= 100) return c;
    }

  }

  function makeCoordObj() {
    return {
      coord: createVector(random(width), random(height - 100, 150)),
      size: createVector(random(130, 300), 0)
    }
  }
}


function MakeThing() {
  let pos = createVector(width / 2, height / 3);
  const pg = createGraphics(width, height);

  this.update = function() {
    rnoise += 0.005;
    nnoise += 0.01;
    noice += 0.025;
    r = noise(nnoise) * 100 + 50;

    pg.noStroke();
    //pg.stroke(random(150), random(255), random(255), random(100));
    pg.fill(random(255), random(255), random(255), random(255));

    for (let f = 0; f < 10; f++) {
      pg.beginShape();
      for (let i = 0; i < TWO_PI + 0.3; i += inc) {
        theta += inc;
        n = noice + i * 1000;

        let x = (r - f * 15) * cos(i);
        let y = (r - f * 15) * sin(i);
        pg.curveVertex(x + pos.x + random(-ran, ran), y + pos.y + random(-ran, ran));
        pg.curveVertex(x + pos.x - (noise(n) - 0.5) * ran * f * 0.5, y + pos.y + (noise(n) - 0.5) * ran * f * 0.5);
        pg.curveVertex(x + pos.x - (noise(n) - 0.5) * ran, y + pos.y + (noise(n + 1000) - 0.5) * ran);

        //stroke(random(255), random(255), random(255), random(255));
        //strokeWeight(map(f, 0, 10, 10, 0) / 2);
        pg.point(x + pos.x + random(-ran, ran), y + pos.y + random(-ran, ran));
        pg.point(x + pos.x - (noise(n) - 0.5) * ran, y + pos.y + (noise(n + 1000) - 0.5));
      }
      pg.endShape();
    }
  }
  
  this.render = function(){
    image(pg, 0, 0);
  }


  //rect(width/2, height/2 , 200, 200);
}


function spawnObj() {
  this.inc = 25;


  if (gPos.y > height) {
    gPos.x = random(width);
    gPos.y = random(height);
  }

  gPos.y += this.inc;

  noStroke();
  fill(random(200), random(40, 255));
  //fill(random(255), random(255), random(255), random(255));

  let rSize = random(height / 65, height / 20);

  rect(gPos.x, gPos.y, rSize, rSize);
}

function sky(){
  noStroke()
  for(let x = 0; x < width; x += (20 + Math.floor(random(10)))){
    for(let y = 0; y < height; y += (20 + Math.floor(random(10)))){
      fill(random(0, 20), random(0, 20), random(40, 100));
      let rSize = random(height / 65, height / 20);
      rect(x, y, rSize, rSize);
    }
  }
}