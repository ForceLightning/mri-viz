let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    MouseContraint = Matter.Mouseconstrant,
    Body = Matter.Body;

let engine = Engine.create();
var compass;

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
          idRAF = requestAnimationFrame(update.bind(this));
          compass.angle += -damping_value*compass.angularVelocity                               -0.001*Math.sin(compass.angle);
     }
     document.onkeypress = function(e) {
          switch(e.keyCode) {
               case 114:
                    Body.setAngle(compass, (Math.random()-0.5)*2*Math.PI);
                    break;
               case 43:
               case 61:
                    // compass.angle = Math.random(-Math.PI, Math.PI);
                    damping_value += 0.01;
                    break;
               case 45:
               case 95:
                    // compass.angle = Math.random(-Math.PI, Math.PI);
                    damping_value -= 0.01;
                    break;
               case 32:
                    console.log(compass)
                    break;
          };
          console.log(e.keyCode, compass.angle, damping_value);
     }
     update();
}
init();


$(window).resize(function() {
     init();
});