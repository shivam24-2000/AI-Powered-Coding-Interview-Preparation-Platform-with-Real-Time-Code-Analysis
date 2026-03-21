import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, CameraOff } from 'lucide-react';

interface VideoCallProps {
  channel: any;
  peerRole: 'coder' | 'interviewer';
}

export const VideoCall: React.FC<VideoCallProps> = ({ channel, peerRole }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    let localStream: MediaStream | null = null;
    let isMounted = true;

    const setupWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream);
        });

        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            channel.send({
              type: 'broadcast',
              event: 'webrtc_signal',
              payload: { type: 'candidate', candidate: event.candidate }
            });
          }
        };

        // If I'm the Coder, I initiate the Offer
        if (peerRole === 'coder') {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          channel.send({
            type: 'broadcast',
            event: 'webrtc_signal',
            payload: offer
          });
        }

        channel.on('broadcast', { event: 'webrtc_signal' }, async ({ payload }: any) => {
          if (!peerConnectionRef.current) return;

          if (payload.type === 'offer' && peerRole === 'interviewer') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            channel.send({
              type: 'broadcast',
              event: 'webrtc_signal',
              payload: answer
            });
          } else if (payload.type === 'answer' && peerRole === 'coder') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload));
          } else if (payload.type === 'candidate') {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
            } catch (e) {
               console.error("Ice error", e);
            }
          }
        });

      } catch (err) {
        console.error("Failed to access media devices:", err);
        alert("Camera and Microphone are mandatory to join the mock interview room!");
      }
    };

    setupWebRTC();

    return () => {
      isMounted = false;
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
    };
  }, [channel, peerRole]);

  const toggleMic = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMicOn(track.enabled);
      });
    }
  };

  const toggleCam = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsCamOn(track.enabled);
      });
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', display: 'flex', gap: '12px', zIndex: 1000, pointerEvents: 'auto' }}>
      {/* Local Video */}
      <div style={{
         width: '150px', height: '112px', borderRadius: '16px', background: '#000',
         position: 'relative', overflow: 'hidden', border: '2px solid rgba(16, 185, 129, 0.4)',
         boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
         <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         <div style={{ position: 'absolute', bottom: '6px', left: '6px', padding: '2px 6px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', fontSize: '0.65rem', color: '#10B981' }}>
           You ({peerRole === 'coder' ? 'Coder' : 'Interviewer'})
         </div>

         {/* Local Controls Overlay */}
         <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
            <button onClick={toggleMic} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: isMicOn ? '#fff' : '#EF4444', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}>
               {isMicOn ? <Mic size={12} /> : <MicOff size={12} />}
            </button>
            <button onClick={toggleCam} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: isCamOn ? '#fff' : '#EF4444', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}>
               {isCamOn ? <Camera size={12} /> : <CameraOff size={12} />}
            </button>
         </div>
      </div>

      {/* Remote Video */}
      <div style={{
         width: '150px', height: '112px', borderRadius: '16px', background: '#000',
         position: 'relative', overflow: 'hidden', border: '2px solid rgba(139, 92, 246, 0.4)',
         boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
         <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         <div style={{ position: 'absolute', bottom: '6px', left: '6px', padding: '2px 6px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', fontSize: '0.65rem', color: '#A855F7' }}>
            {peerRole === 'coder' ? 'Interviewer' : 'Coder'}
         </div>
      </div>
    </div>
  );
};
