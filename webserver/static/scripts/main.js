// Generated by CoffeeScript 1.4.0
(function() {
  var canvas, ctx, onError, onSuccess, update, video, ws_image_np;
    
  var ws_return;
  var startTime = new Date();
  var elapsedTime;
    
  var openCvCoords, tempOpenCvCoords;
  openCvCoords = []

  onError = function(e) {
    return console.log("Rejected", e);
  };

  onSuccess = function(localMediaStream) {
    video.src = URL.createObjectURL(localMediaStream);
    return setInterval(update, 50);
  };

  update = function() {
    ctx.drawImage(video, 0, 0, 640, 480);
    canvas.toBlob(function(blob) {
       return ws_image_np.send(blob);
    }, 'image/jpeg');
    openCvCoords = tempOpenCvCoords;
    // Draw the bounding boxes
    for (var i = 0, len = openCvCoords.length; i < len; ++i) {
       var data = openCvCoords[i];
        for (var j = 0, len2 = data.bbs.length; j < len2; ++j ){
          var bb = data.bbs[j]
           ctx.strokeRect(bb[1],bb[0],bb[3] - bb[1],bb[2] - bb[0]);
        }
    }
  };

  video = document.querySelector('#live');

  canvas = document.querySelector('#canvaswc');

  ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#ff0';

  ctx.lineWidth = 2;

  ws_image_np = new WebSocket("wss://" + location.host + "/webcam");
  ws_return = new WebSocket("wss://" + location.host + "/mlresults");

  ws_image_np.onopen = function() {
    return console.log("Opened webcam websocket");
  };

  ws_return.onopen = function() {
    return console.log("Opened mlresults websocket");
  };
  // Move this to a new websocket
  ws_return.onmessage = function(e) {
    tempOpenCvCoords = JSON.parse(e.data);
    return console.log('receiving message' + e.data +'. Buffered Amount: ' +  ws_return.bufferedAmount);
  };



  var constraints = { audio: false, video: { width: 1280, height: 720 } }; 
  navigator.mediaDevices.getUserMedia(constraints)
     .then(onSuccess)
     .catch(onError);

}).call(this);
