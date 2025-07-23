import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';

interface VideoTileProps {
  stream?: MediaStream;
  participantName: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
  isScreenShare?: boolean;
  handRaised?: boolean;
}

function VideoTile({ 
  stream, 
  participantName, 
  isLocal = false, 
  isMuted = false, 
  isCameraOff = false,
  isScreenShare = false,
  handRaised = false
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  const initials = participantName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video min-h-0">
      {stream && !isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <span className="text-sm sm:text-xl font-semibold">{initials}</span>
            </div>
            <p className="text-xs sm:text-sm truncate px-2">{participantName}</p>
          </div>
        </div>
      )}

      {/* Hand raised indicator */}
      {handRaised && (
        <div className="absolute top-1 right-1 sm:top-3 sm:right-3">
          <div className="bg-yellow-500 text-white p-2 rounded-full animate-bounce">
            <Hand className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 sm:p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs sm:text-sm font-medium truncate flex-1 mr-2">
            {participantName} {isLocal && '(You)'}
          </span>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {isMuted ? (
              <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            ) : (
              <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            )}
            {isCameraOff && <VideoOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />}
          </div>
        </div>
      </div>

      {isScreenShare && (
        <div className="absolute top-1 left-1 sm:top-3 sm:left-3">
          <span className="text-xs bg-green-500 text-white px-1 sm:px-2 py-1 rounded">
            Screen Share
          </span>
        </div>
      )}
    </div>
  );
}

interface VideoGridProps {
  localStream?: MediaStream;
  remoteStreams: Map<string, { stream: MediaStream; name: string }>;
  localParticipantName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  handRaisedParticipants: Set<string>;
  localHandRaised: boolean;
}

export function VideoGrid({
  localStream,
  remoteStreams,
  localParticipantName,
  isMuted,
  isCameraOff,
  isScreenSharing,
  handRaisedParticipants,
  localHandRaised
}: VideoGridProps) {
  const totalParticipants = 1 + remoteStreams.size;
  
  // Determine grid layout - optimized for mobile
  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1 gap-2 lg:gap-4';
    if (totalParticipants === 2) return 'grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4';
    if (totalParticipants <= 4) return 'grid-cols-2 gap-1 sm:gap-2 lg:gap-4';
    if (totalParticipants <= 6) return 'grid-cols-2 sm:grid-cols-3 gap-1 lg:gap-3';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-2';
  };

  // Determine container padding for mobile
  const getContainerClass = () => {
    return 'p-2 sm:p-3 lg:p-4 h-full overflow-hidden';
  };

  return (
    <div className={`grid ${getGridClass()} ${getContainerClass()}`}>
      {/* Local video */}
      <VideoTile
        stream={localStream}
        participantName={localParticipantName}
        isLocal={true}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isScreenShare={isScreenSharing}
        handRaised={localHandRaised}
      />

      {/* Remote videos */}
      {Array.from(remoteStreams.entries()).map(([peerId, { stream, name }]) => (
        <VideoTile
          key={peerId}
          stream={stream}
          participantName={name}
          isLocal={false}
          handRaised={handRaisedParticipants.has(peerId)}
        />
      ))}
    </div>
  );
}