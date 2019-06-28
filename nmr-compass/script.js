let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    Body = Matter.Body;

class Params {
     constructor() {
          this.timesteps = 1000;
          this.state = 0;
          this.damping_factor = 0.01;
          this.b1 = function () {
               this.bias = (this.bias != 0) ? 0 : -Math.PI / 4;
               $('strong.b1').text((this.bias != 0) ? "On" : "Off");
               // console.log(this.accel);
               $('img.b1').toggle();
          };
          this.resonating = false;
          this.resonance = function () {
               this.resonating = !this.resonating;
          };
          this.ninety = function () {
               // Body.setAngle(compass, 0.5*Math.PI);
               this.bias = (this.bias != 0) ? 0 : -Math.PI / 2;
               $('strong.b1').text((this.bias != 0) ? "On" : "Off");
               // console.log(this.accel);
          };
          this.angle = 0;
          this.signal = 0;
          this.bias = 0;
          this.accel = 0;
          this.needle_skins = 0;
          this.b1_skins = 0;
     }
}

var compass;
var params = new Params();
let engine = Engine.create();

function gui_init() {
     var gui = new dat.GUI({
          height : 5 * 32 - 1
     });
     var info = gui.addFolder('State Info');
     info.add(params, 'damping_factor').min(0).max(0.1).step(0.005);
     info.add(params, 'angle').step(0.01).listen();
     info.add(params, 'signal').step(0.01).listen();
     info.add(params, 'bias').step(0.1).listen();
     info.add(params, 'accel').name('torque').step(0.01).listen();
     var actions = gui.addFolder('Actions');
     actions.add(params, 'b1').name("toggle B1 field");
     actions.add(params, 'ninety').name("90 deg excitation");
     // actions.add(params, 'resonance').name("Toggle Resonance");
     actions.add(params, 'resonating').name("resonance");
     var skins = gui.addFolder('Skinning');
     skins.add(params, 'needle_skins', {"Compass Needle": 0, "Proton": 1, "Nuclear Spin": 2, "Shaded Proton": 3}).name("needle").onFinishChange(function(value) {
          compass.render.sprite.texture = [
               "images/Compass Needle.png",
               "images/Proton White.png",
               "images/Proton Spin.png",
               "images/Proton.png"
          ][value];
     });;
     skins.add(params, "b1_skins", {"B1 Field": 0, "Bar Magnet": 1, "AC Coil": 2}).name("b1_field").onFinishChange(function(value) {
          $('#b1').attr("src", [
               "images/B1 Field.png",
               "images/B1 Magnet.png",
               "images/B1 Coil.png"
          ][value]);
     });
     info.open();
     actions.open();
}

function init() {
     
     let numm = Math.random();
     $("canvas").remove();

     let width = $(window).width() * 0.95;
     let height = $(window).height() * 0.95;
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
                         texture: 'images/Compass Needle.png'
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
     Render.run(render);
     engine.world.gravity.scale = 0;
     function update() {
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
     }
     update();
}
init();
gui_init();


$(window).resize(function() {
     // TODO(CANVAS): Fix resizing bugs.
     params = new Params();
     var width =  $(window).width() * 0.95;
     var height =  $(window).height() * 0.95;
     $('canvas').attr("width", width);
     $('canvas').attr("height", height);
     Body.setPosition(compass, Matter.Vector.create(width/2, height/2));
     // init();
});