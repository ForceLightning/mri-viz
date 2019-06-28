let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    MouseContraint = Matter.Mouseconstrant,
    Body = Matter.Body;

var Params = function() {
	this.timesteps = 1000;
	this.state = 0;
	// this.next_state = function() {  };
	// this.prev_state = function() {  };
	
	this.damping_factor = 0.01;
	this.b1 = function () {
          this.bias = (this.bias != 0) ? 0 : -Math.PI/4;
          $('strong.b1').text((this.bias != 0) ? "On" : "Off");
          console.log(this.accel);
          $('img.b1').toggle();
     };
     this.resonating = false;
     this.resonance = function () {
          this.resonating = !this.resonating;
     };
     this.ninety = function () {
          // Body.setAngle(compass, 0.5*Math.PI);
          this.bias = (this.bias != 0) ? 0 : -Math.PI/2;
          $('strong.b1').text((this.bias != 0) ? "On" : "Off");
          console.log(this.accel);
     };
	this.angle = 0;
     this.signal = 0;
     this.bias = 0;
     this.accel = 0;
     this.needle_skin = 0;
     this.needle_skins = [
          "images/Compass Needle.png",
          "images/Proton White.png",
          "images/Proton Spin.png",
          "images/Proton.png"
     ];
     this.b1_skin = 0;
     this.b1_skins = [
          "images/B1 Field.png",
          "images/B1 Magnet.png",
          "images/B1 Coil.png"
     ];
};

var params = new Params();
let engine = Engine.create();
var compass;

function gui_init() {
     var gui = new dat.GUI({
          height : 5 * 32 - 1
     });
     var info = gui.addFolder('State Info');
     info.add(params, 'damping_factor').min(0).max(0.1).step(0.005);
     info.add(params, 'angle').step(0.01).listen();
     info.add(params, 'signal').step(0.01).listen();
     info.add(params, 'bias').step(0.1).listen();
     info.add(params, 'accel').name('torque').step(0.0001).listen();
     var actions = gui.addFolder('Actions');
     actions.add(params, 'b1').name("toggle B1 field");
     actions.add(params, 'ninety').name("90 deg excitation");
     // actions.add(params, 'resonance').name("Toggle Resonance");
     actions.add(params, 'resonating').name("resonance");
     var skins = gui.addFolder('Skinning');
     skins.add(params, 'needle_skin', {"Compass Needle": 0, "Proton": 1, "Nuclear Spin": 2, "Shaded Proton": 3}).name("needle").listen();
     skins.add(params, "b1_skin", {"B1 Field": 0, "Bar Magnet": 1, "AC Coil": 2}).name("b1_field").listen();
     info.open();
     actions.open();
}

function init() {
     
     let numm = Math.random();
     $("canvas").remove();

     let width = $(window).width() * 0.9;
     let height = $(window).height() * 0.9;
     let vmin = Math.min(width, height);
     
     engine.events = {};
     World.clear(engine.world);
     Engine.clear(engine);

     engine = Engine.create();

     let render = Render.create({
          element: document.body,
          engine: engine,
          options: {
               wireframes: false,
               background: "transparent",
               width: width,
               height: height,

          }
     });

     compass = Bodies.rectangle(
          width / 2,
          height / 2,
          vmin * 0.1,
          vmin * 0.5,
          {
               render: {
                    // fillStyle: "a",
                    sprite: {
                         texture: 'https://dl3.pushbulletusercontent.com/PHk7gPffdiagleOjreHIqB9OxoyxNJWz/Compass%20Needle.png'
                    }
               },
               angle: (Math.random()-0.5)*2*Math.PI,
               frictionAir: 0
          }
     );

     World.add(engine.world, [
          Bodies.rectangle(width / 2, height + 50, width, 100, {
               isStatic: true
          }),
          Bodies.rectangle(width / 2, -50, width, 100, {
               isStatic: true
          }),
          Bodies.rectangle(-50, height / 2, 100, height, {
               isStatic: true
          }),
          Bodies.rectangle(width + 50, height / 2, 100, height, {
               isStatic: true
          }),
          compass
     ]);

     Engine.run(engine);
     var damping_value = 0.01;
     Engine.run(engine);
     Render.run(render);
     engine.world.gravity.scale = 0;
     function update() {
          compass.render.sprite.texture = params.needle_skins[params.needle_skin];
          $('#b1').attr("src", params.b1_skins[params.b1_skin]);
          params.accel = compass.angularVelocity - params.accel;
          idRAF = requestAnimationFrame(update.bind(this));
          if (params.resonating) {
               if (params.accel > 0.001) {
                    params.bias = -Math.PI/4;
                    $('img.b1').show();
               }
               else {
                    $('img.b1').hide();
                    params.bias = 0;
               }
          }
          compass.angle += -params.damping_factor * compass.angularVelocity                               - 0.001 * Math.sin(compass.angle + params.bias);
          params.signal = Math.abs(Math.sin(compass.angle)) % (2*Math.PI);
          params.angle = compass.angle % (2 * Math.PI);
          $('strong.b1').text((params.bias != 0) ? "On" : "Off");
          $('strong.dr').text(damping_value);
          $('strong.angle').text((compass.angle).toFixed(2));
          $('strong.signal').text(Math.abs((Math.sin(compass.angle).toFixed(2))));
     }
     document.onkeypress = function(e) {
          switch(e.keyCode) {
               case 114:
                    Body.setAngle(compass, (Math.random()-0.5)*2*Math.PI);
                    break;
               case 43:
               case 61:
                    // compass.angle = Math.random(-Math.PI, Math.PI);
                    params.damping_factor += 0.01;
                    break;
               case 45:
               case 95:
                    // compass.angle = Math.random(-Math.PI, Math.PI);
                    params.damping_factor -= 0.01;
                    break;
               case 32:
                    console.log(compass.angle, bias_angle);
                    break;
               case 98:
                    // toggle b1_field
                    this.bias = (this.bias != 0) ? 0 : -Math.PI/4;
                    $('strong.b1').text((this.bias != 0) ? "On" : "Off");
                    $('img.b1').toggle();
                    break;
               case 115:
                    params.needle_skins.push(params.needle_skins.shift());
                    break;
          };
          // console.log(e.keyCode);
     }
     update();
}
init();
gui_init();


$(window).resize(function() {
     init();
     gui.removeFolder();
});