"use client";

import { useState, useRef, useEffect } from "react";
import { useVideoChat } from "@/hooks/useVideoChat";
import { toast } from "sonner";

export default function Home() {
  const {
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
    remoteSpeaking,
  } = useVideoChat();

  const [messageInput, setMessageInput] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [showRoomInput, setShowRoomInput] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Show toast when connected
  useEffect(() => {
    if (isConnected) {
      toast.success("Connected to stranger!", {
        description: "You can now chat and talk",
      });
    }
  }, [isConnected]);

  // Show toast when waiting
  useEffect(() => {
    if (isWaiting) {
      toast.info("Searching for someone...", {
        description: "Please wait while we find you a match",
      });
    }
  }, [isWaiting]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleToggleVideo = () => {
    const newState = toggleVideo();
    setIsVideoOn(newState);
  };

  const handleToggleAudio = () => {
    const newState = toggleAudio();
    setIsAudioOn(newState);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      joinRoom(roomIdInput.trim());
      setShowRoomInput(false);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setRoomIdInput("");
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomIdInput(newRoomId);
    joinRoom(newRoomId);
    setShowRoomInput(false);
    toast.success("Room Created!", {
      description: `Room ID: ${newRoomId} - Share it with your friends!`,
    });
  };

  const copyRoomId = () => {
    if (currentRoomId) {
      navigator.clipboard.writeText(currentRoomId);
      toast.success("Room ID copied!", {
        description: "Share this ID with your friends to connect directly",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Modern Header */}
        <header className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xl bg-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-5 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex flex-wrap items-center gap-2">
                  VicoChat
                  {isAudioOnly && (
                    <span className="text-sm sm:text-lg text-blue-400">🎤 Audio</span>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Connect instantly with people worldwide
                </p>
              </div>
            </div>

            {/* Room ID Badge */}
            {currentRoomId && (
              <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400 font-medium">
                    Room ID
                  </span>
                </div>
                <code className="text-sm sm:text-lg font-mono font-bold text-blue-400 tracking-wider">
                  {currentRoomId}
                </code>
                <button
                  onClick={copyRoomId}
                  className="ml-auto sm:ml-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-white text-xs font-medium rounded-lg transition-all hover:scale-105 border border-blue-500/50"
                >
                  📋 Copy
                </button>
                {isWaiting && (
                  <button
                    onClick={handleLeaveRoom}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600/30 hover:bg-red-600/50 text-white text-xs font-medium rounded-lg transition-all hover:scale-105 border border-red-500/50"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            {/* Remote Video - Modern Glass Card */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 aspect-video rounded-xl sm:rounded-2xl overflow-hidden m-1 sm:m-2">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Remote Voice Activity Indicator - Modernized */}
                {isConnected && (
                  <div className="absolute top-2 left-2 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-3 backdrop-blur-2xl bg-slate-900/80 px-2 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-lg ${
                        remoteSpeaking
                          ? "bg-emerald-400 animate-pulse shadow-emerald-400/50"
                          : "bg-slate-500"
                      }`}
                    ></div>
                    <span className="text-white text-xs sm:text-sm font-semibold hidden sm:inline">
                      {remoteSpeaking ? "🎙️ Speaking" : "🔇 Silent"}
                    </span>
                    <span className="text-white text-xs font-semibold sm:hidden">
                      {remoteSpeaking ? "🎙️" : "🔇"}
                    </span>
                    <div className="w-12 sm:w-20 h-1.5 sm:h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150 shadow-lg"
                        style={{ width: `${remoteAudioLevel}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {remoteIsAudioOnly && isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                    <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-white/20">
                      <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl backdrop-blur-md">
                        <span className="text-5xl sm:text-7xl">🎤</span>
                      </div>
                      <p className="text-white text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
                        Audio Only Mode
                      </p>
                      <p className="text-white/80 text-sm sm:text-lg">
                        Stranger has no camera
                      </p>
                    </div>
                  </div>
                )}
                {!isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-slate-900/50">
                    <div className="text-center p-4 sm:p-8">
                      {isWaiting ? (
                        <>
                          <div className="relative inline-block">
                            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                          </div>
                          <p className="text-white text-2xl font-semibold mb-2">
                            Finding someone...
                          </p>
                          <p className="text-gray-400">Please wait a moment</p>
                        </>
                      ) : (
                        <>
                          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <svg
                              className="w-16 h-16 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-white text-2xl font-bold mb-2">
                            Ready to Connect
                          </p>
                          <p className="text-gray-400 text-lg">
                            Click a button below to start chatting
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) - Modern Design */}
            <div className="relative group">
              {!isAudioOnly ? (
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-32 h-24 sm:w-52 sm:h-40 object-cover rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/20 shadow-2xl backdrop-blur-xl ring-2 sm:ring-4 ring-blue-500/30"
                  />
                  {/* Local Voice Activity - Compact */}
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 backdrop-blur-2xl bg-slate-900/90 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/20 shadow-lg">
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        isSpeaking
                          ? "bg-emerald-400 animate-pulse shadow-emerald-400/50"
                          : "bg-slate-500"
                      }`}
                    ></div>
                    <div className="w-8 sm:w-14 h-1 sm:h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-100"
                        style={{ width: `${localAudioLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 backdrop-blur-xl bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow-xl border border-white/30 sm:border-2">
                    <span className="text-white text-[10px] sm:text-xs font-bold">YOU</span>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-24 sm:w-52 sm:h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/20 shadow-2xl flex items-center justify-center relative backdrop-blur-xl">
                  <div className="text-center">
                    <span className="text-3xl sm:text-5xl mb-1 sm:mb-2 block">🎤</span>
                    <p className="text-white text-xs sm:text-sm font-bold">Audio Mode</p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 backdrop-blur-xl bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow-xl border border-white/30 sm:border-2">
                    <span className="text-white text-[10px] sm:text-xs font-bold">YOU</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Control Panel */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-3 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-stretch">
                {!isConnected && !isWaiting && (
                  <>
                    <button
                      onClick={findPeer}
                      className="flex-1 basis-full sm:basis-auto sm:flex-none min-w-0 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all transform active:scale-95 sm:hover:scale-105 hover:shadow-2xl border border-white/20 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                      </svg>
                      <span className="whitespace-nowrap">Random Chat</span>
                    </button>

                    <button
                      onClick={() => setShowRoomInput(!showRoomInput)}
                      className="flex-1 basis-[45%] sm:basis-auto sm:flex-none min-w-0 px-3 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all transform active:scale-95 sm:hover:scale-105 hover:shadow-2xl border border-white/20 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Join Room</span>
                    </button>

                    <button
                      onClick={handleCreateRoom}
                      className="flex-1 basis-[45%] sm:basis-auto sm:flex-none min-w-0 px-3 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all transform active:scale-95 sm:hover:scale-105 hover:shadow-2xl border border-white/20 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Create Room</span>
                    </button>
                  </>
                )}

                {isConnected && (
                  <>
                    {!isAudioOnly && (
                      <button
                        onClick={handleToggleVideo}
                        className={`flex-1 basis-[30%] sm:basis-auto sm:flex-none min-w-0 px-3 sm:px-6 py-3 sm:py-4 ${
                          isVideoOn
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        } text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all active:scale-95 sm:hover:scale-105 border border-white/20 flex items-center justify-center gap-1 sm:gap-2`}
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="hidden xs:inline sm:inline">{isVideoOn ? "Video On" : "Video Off"}</span>
                        <span className="xs:hidden">Video</span>
                      </button>
                    )}

                    <button
                      onClick={handleToggleAudio}
                      className={`flex-1 basis-[30%] sm:basis-auto sm:flex-none min-w-0 px-3 sm:px-6 py-3 sm:py-4 ${
                        isAudioOn
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                      } text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all active:scale-95 sm:hover:scale-105 border border-white/20 flex items-center justify-center gap-1 sm:gap-2`}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      <span className="hidden xs:inline sm:inline">{isAudioOn ? "Mic On" : "Mic Off"}</span>
                      <span className="xs:hidden">Mic</span>
                    </button>

                    <button
                      onClick={skipPeer}
                      className="flex-1 basis-[30%] sm:basis-auto sm:flex-none min-w-0 px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all active:scale-95 sm:hover:scale-105 border border-white/20 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Room Input */}
            {showRoomInput && !isConnected && !isWaiting && (
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-3 sm:p-5 shadow-2xl border border-white/10 mt-4">
                <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) =>
                      setRoomIdInput(e.target.value.toUpperCase())
                    }
                    placeholder="Enter Room ID (e.g., ABC123)"
                    className="flex-1 px-4 sm:px-5 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                    maxLength={10}
                  />
                  <button
                    type="submit"
                    disabled={!roomIdInput.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-xl transition-all hover:scale-105 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join Room
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Chat Section - Modern Design */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl sm:rounded-3xl shadow-2xl h-[400px] sm:h-[500px] lg:h-[680px] flex flex-col border border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base sm:text-lg">Chat</h2>
                    <p className="text-white/70 text-[10px] sm:text-xs hidden sm:block">Send messages</p>
                  </div>
                </div>
                {isConnected && (
                  <span className="px-2 sm:px-3 py-1 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/50 rounded-full text-emerald-100 text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Connected</span>
                    <span className="sm:hidden">●</span>
                  </span>
                )}
              </div>

              {/* Messages - Modern Style */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2 sm:space-y-3 bg-slate-900/30"
              >
                {messages.length === 0 && (
                  <div className="text-center mt-6 sm:mt-12">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                      <svg
                        className="w-6 h-6 sm:w-10 sm:h-10 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base font-semibold">
                      No messages yet
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Connect and start chatting!
                    </p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm ${
                        msg.sender === "me"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                          : "bg-white/10 text-white rounded-bl-md border border-white/10"
                      }`}
                    >
                      <p className="text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1 opacity-70">
                        {msg.sender === "me" ? "You" : "Stranger"}
                      </p>
                      <p className="break-words text-xs sm:text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input - Modern Style */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-5 border-t border-white/10 backdrop-blur-sm bg-white/5"
              >
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      isConnected
                        ? "Type a message..."
                        : "Connect to start chatting"
                    }
                    disabled={!isConnected}
                    className="flex-1 px-3 sm:px-5 py-2 sm:py-3 bg-white/10 text-white text-sm sm:text-base placeholder-gray-400 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 backdrop-blur-sm border border-white/20"
                  />
                  <button
                    type="submit"
                    disabled={!isConnected || !messageInput.trim()}
                    className="px-4 sm:px-7 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-xl border border-white/20 flex items-center gap-1 sm:gap-2"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <footer className="text-center py-8 mt-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl px-8 py-6 border border-white/10 max-w-3xl mx-auto">
            <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Be respectful and have fun! Use{" "}
                <strong className="text-white">&quot;Create Room&quot;</strong>{" "}
                to share with friends.
              </span>
            </p>
            {isAudioOnly && (
              <div className="mt-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl inline-flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">🎤</span>
                <p className="text-yellow-300 text-sm font-semibold">
                  Running in audio-only mode
                </p>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
