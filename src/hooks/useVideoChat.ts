'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { toast } from 'sonner';

interface Message {
  text: string;
  sender: 'me' | 'stranger';
  timestamp: Date;
}

export const useVideoChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [remoteIsAudioOnly, setRemoteIsAudioOnly] = useState(false);
  const [localAudioLevel, setLocalAudioLevel] = useState(0);
  const [remoteAudioLevel, setRemoteAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [remoteSpeaking, setRemoteSpeaking] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localAnalyserRef = useRef<AnalyserNode | null>(null);
  const remoteAnalyserRef = useRef<AnalyserNode | null>(null);
  const localAnimationRef = useRef<number | null>(null);
  const remoteAnimationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Initialize local media stream
  useEffect(() => {
    const initMediaStream = async () => {
      try {
        // Try video first
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          setIsAudioOnly(false);
          console.log('Video and audio enabled');
        } catch (err) {
          console.log('Video not available, falling back to audio only', err);
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          });
          setIsAudioOnly(true);
          toast.warning("Camera not available", {
            description: "You can still use voice chat!",
          });
        }
        
        setLocalStream(stream);
        
        if (localVideoRef.current && !isAudioOnly) {
          localVideoRef.current.srcObject = stream;
        }

        // Setup audio level monitoring for local stream
        setupAudioMonitoring(stream, true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error("Media access denied", {
          description: "Please allow microphone access to use this app",
        });
      }
    };

    initMediaStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (localAnimationRef.current) {
        cancelAnimationFrame(localAnimationRef.current);
      }
      if (remoteAnimationRef.current) {
        cancelAnimationFrame(remoteAnimationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket || !localStream) return;

    socket.on('waiting', () => {
      console.log('Waiting for a peer...');
      setIsWaiting(true);
      setIsConnected(false);
    });

    socket.on('room-waiting', ({ roomId }: { roomId: string }) => {
      console.log('Waiting in room:', roomId);
      setCurrentRoomId(roomId);
      setIsWaiting(true);
      setIsConnected(false);
    });

    socket.on('peer-matched', ({ peerId, initiator, roomId }: { peerId: string; initiator: boolean; roomId?: string }) => {
      console.log('Matched with peer:', peerId, 'Initiator:', initiator);
      if (roomId) {
        setCurrentRoomId(roomId);
      }
      setIsWaiting(false);
      createPeerConnection(initiator);
    });

    socket.on('signal', ({ signal }: { signal: SimplePeer.SignalData }) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    socket.on('chat-message', ({ message }: { message: string }) => {
      setMessages(prev => [...prev, {
        text: message,
        sender: 'stranger',
        timestamp: new Date()
      }]);
    });

    socket.on('peer-disconnected', () => {
      console.log('Peer disconnected');
      handleCleanup();
      toast.error("Stranger disconnected", {
        description: "The person you were chatting with has left",
      });
    });

    return () => {
      socket.off('waiting');
      socket.off('room-waiting');
      socket.off('peer-matched');
      socket.off('signal');
      socket.off('chat-message');
      socket.off('peer-disconnected');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, localStream]);

  // Audio monitoring function
  const setupAudioMonitoring = useCallback((stream: MediaStream, isLocal: boolean) => {
    try {
      console.log(`Setting up audio monitoring - isLocal: ${isLocal}`);
      
      // Create or reuse audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        console.log('Created new AudioContext');
      }
      
      const audioContext = audioContextRef.current;
      
      // Resume if suspended (Chrome security requirement)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('AudioContext resumed');
        });
      }
      
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      
      microphone.connect(analyser);
      
      if (isLocal) {
        localAnalyserRef.current = analyser;
        console.log('Local analyser connected');
      } else {
        remoteAnalyserRef.current = analyser;
        console.log('Remote analyser connected');
      }
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const detectAudio = () => {
        if (!analyser) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalized = Math.min(100, (average / 128) * 100);
        
        if (isLocal) {
          setLocalAudioLevel(normalized);
          setIsSpeaking(normalized > 5); // Threshold for speaking detection
          localAnimationRef.current = requestAnimationFrame(detectAudio);
        } else {
          setRemoteAudioLevel(normalized);
          setRemoteSpeaking(normalized > 5);
          remoteAnimationRef.current = requestAnimationFrame(detectAudio);
        }
      };
      
      detectAudio();
      console.log(`Audio detection loop started - isLocal: ${isLocal}`);
    } catch (error) {
      console.error('Error setting up audio monitoring:', error);
    }
  }, []);

  const createPeerConnection = (initiator: boolean) => {
    if (!localStream) return;

    const newPeer = new SimplePeer({
      initiator,
      stream: localStream,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    newPeer.on('signal', (signal: SimplePeer.SignalData) => {
      socket?.emit('signal', { signal });
    });

    newPeer.on('stream', (stream: MediaStream) => {
      console.log('Received remote stream');
      
      // Check if remote stream has video
      const hasVideo = stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;
      setRemoteIsAudioOnly(!hasVideo);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      
      // Setup audio monitoring for remote stream
      setupAudioMonitoring(stream, false);
      
      setIsConnected(true);
    });

    newPeer.on('connect', () => {
      console.log('Peer connection established');
      setIsConnected(true);
    });

    newPeer.on('error', (err: Error) => {
      console.error('Peer connection error:', err);
    });

    newPeer.on('close', () => {
      console.log('Peer connection closed');
      handleCleanup();
    });

    peerRef.current = newPeer;
  };

  const findPeer = useCallback(() => {
    if (socket) {
      handleCleanup();
      setMessages([]);
      setCurrentRoomId(null);
      socket.emit('find-peer');
    }
  }, [socket]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket && roomId.trim()) {
      handleCleanup();
      setMessages([]);
      socket.emit('join-room', roomId.trim());
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket && currentRoomId) {
      socket.emit('leave-room', currentRoomId);
      setCurrentRoomId(null);
      setIsWaiting(false);
    }
  }, [socket, currentRoomId]);

  const sendMessage = useCallback((message: string) => {
    if (socket && isConnected && message.trim()) {
      socket.emit('chat-message', message);
      setMessages(prev => [...prev, {
        text: message,
        sender: 'me',
        timestamp: new Date()
      }]);
    }
  }, [socket, isConnected]);

  const skipPeer = useCallback(() => {
    if (socket) {
      socket.emit('skip');
      if (currentRoomId) {
        socket.emit('leave-room', currentRoomId);
      }
      handleCleanup();
      setMessages([]);
      setCurrentRoomId(null);
      // Automatically find a new peer
      setTimeout(() => {
        socket.emit('find-peer');
      }, 500);
    }
  }, [socket, currentRoomId]);

  const handleCleanup = () => {
    setIsConnected(false);
    setIsWaiting(false);
    setRemoteIsAudioOnly(false);
    setLocalAudioLevel(0);
    setRemoteAudioLevel(0);
    setIsSpeaking(false);
    setRemoteSpeaking(false);
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    if (localAnimationRef.current) {
      cancelAnimationFrame(localAnimationRef.current);
      localAnimationRef.current = null;
    }
    
    if (remoteAnimationRef.current) {
      cancelAnimationFrame(remoteAnimationRef.current);
      remoteAnimationRef.current = null;
    }
  };

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  return {
    localVideoRef,
    remoteVideoRef,
    isConnected,
    isWaiting,
    messages,
    findPeer,
    joinRoom,
    leaveRoom,
    sendMessage,
    skipPeer,
    toggleVideo,
    toggleAudio,
    currentRoomId,
    isAudioOnly,
    remoteIsAudioOnly,
    localAudioLevel,
    remoteAudioLevel,
    isSpeaking,
    remoteSpeaking
  };
};
