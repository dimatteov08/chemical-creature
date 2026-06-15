// Chemical Creature — Star Field Background
(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:0'
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var stars = [];
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initStars() {
    stars = [];
    var count = Math.floor((W * H) / 4000); // density
    for (var i = 0; i < count; i++) {
      stars.push({
        x:         rand(0, W),
        y:         rand(0, H),
        radius:    rand(0.2, 1.4),
        alpha:     rand(0.1, 1.0),
        delta:     rand(0.003, 0.012) * (Math.random() > 0.5 ? 1 : -1),
        color:     pickColor()
      });
    }
  }

  function pickColor() {
    var roll = Math.random();
    if (roll < 0.70) return '255,255,255';       // white — most common
    if (roll < 0.85) return '176,136,249';        // purple glow
    if (roll < 0.95) return '100,130,255';        // blue
    return '220,210,255';                          // pale lavender
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Twinkle
      s.alpha += s.delta;
      if (s.alpha >= 1.0) { s.alpha = 1.0; s.delta = -Math.abs(s.delta); }
      if (s.alpha <= 0.05) { s.alpha = 0.05; s.delta =  Math.abs(s.delta); }

      // Occasional glisten burst
      var glow = s.radius > 1.0 && s.alpha > 0.85;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + s.color + ',' + s.alpha + ')';
      ctx.fill();

      if (glow) {
        // soft halo
        var grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5);
        grad.addColorStop(0, 'rgba(' + s.color + ',' + (s.alpha * 0.4) + ')');
        grad.addColorStop(1, 'rgba(' + s.color + ',0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // cross sparkle for brightest stars
        if (s.alpha > 0.92) {
          ctx.strokeStyle = 'rgba(' + s.color + ',' + (s.alpha * 0.3) + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.radius * 4, s.y);
          ctx.lineTo(s.x + s.radius * 4, s.y);
          ctx.moveTo(s.x, s.y - s.radius * 4);
          ctx.lineTo(s.x, s.y + s.radius * 4);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    initStars();
    draw();
  }

  window.addEventListener('resize', function() {
    resize();
    initStars();
  });

  // Respect reduced motion
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq || !mq.matches) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
