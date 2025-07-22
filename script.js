const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let myStream;

const peer = new Peer(undefined, {
  host: location.hostname,
  port: location.port || (location.protocol === 'https:' ? 443 : 80),
  path: '/peerjs'
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    myStream = stream;
    addVideo(myVideo, stream);

    peer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => addVideo(video, userVideoStream));
    });

    peer.on('open', id => {
      if (!location.hash) {
        location.hash = id;
      } else {
        const call = peer.call(location.hash.slice(1), stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => addVideo(video, userVideoStream));
      }
    });
  });

function addVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => video.play());
  videoGrid.appendChild(video);
}

function toggleMic() {
  myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
}
function toggleCam() {
  myStream.getVideoTracks()[0].enabled = !myStream.getVideoTracks()[0].enabled;
}
function copyLink() {
  navigator.clipboard.writeText(location.href);
  alert("Link copied. Share to connect!");
}
