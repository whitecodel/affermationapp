import React, { useState, useRef, useEffect } from "react";
import "./DashboardPage.scss";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { audioList } from "../../redux/reducer/AffermationSlice";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";



const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};


export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0 Sec";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const minPart = mins > 0 ? `${mins} M` : "";
  const secPart = secs > 0 ? `${secs} Sec` : "";

  return `${minPart} ${secPart}`.trim();
};

const DashboardPage = () => {
  const [affirmations, setAffirmations] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState("newest");

  const audioRef = useRef(null);
  const dispatch = useDispatch()

  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

const {AudioListData, AudioListLoading, AudioListError} = useSelector(
  (prev) => prev?.affer
);

const sortMap = {
  newest: "newest",
  oldest: "oldest",
  az: "az",
};



// useEffect(()=>{
//   dispatch(audioList(searchTerm))
// },[dispatch, searchTerm])

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    dispatch(audioList({ sort_by: sortMap[sortBy], search_query: searchTerm }));
  }, 700); // Debounce delay

  return () => clearTimeout(delayDebounce);
}, [searchTerm, sortBy, dispatch]);


const formatTime = (time) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

  const handleMenuClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handlePlay = (item) => {
   
    setPlayingTrack(item);
    setIsPlaying(true);
    setActiveMenu(null);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = item.audio_url;
    link.download = `${item.title}.mp3`;
    link.click();
  };

  const handleDelete = (itemId) => {
    const updated = AudioListData?.filter((item) => item.id !== itemId);
    setAffirmations(updated);
    setActiveMenu(null);
    if (playingTrack?.id === itemId) {
      setPlayingTrack(null);
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  };

  

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dash-left">
          <div className="seach-box">
        <SearchOutlined className="search-icon" style={{ fontSize: '16px', color: '#1B1F26B8' }} />

          <input className="search-input"  placeholder="Search here..."
          onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
          </select>

        </div>
        <Link to="/affermation" className="generate-button">
          <span className="white-emoji">✨</span> Generate New
        </Link>
      </div>

      {/* Section Title */}
      <h3 className="section-title">
        Affirmations <span className="count">{AudioListData?.length}</span>
      </h3>

      {/* Cards Grid */}
      <div className="cards-grid">
        {AudioListData?.map((item) => (
          <div key={item.id} className="card">
            <div className="card-play-icon" onClick={() => handlePlay(item)}>
              <img src={assets?.play} alt="play" />
              {/* {false ? <PauseCircleOutlined style={{ fontSize: 32, color: "#fff" }} /> : <PlayCircleOutlined style={{ fontSize: 32, color: "#fff" }} />} */}
            </div>
            <div className="card-info">
              <div className="card-title">{item?.title}</div>
              <div className="card-duration">⏱ {formatDuration(item?.duration)}</div>
            </div>
            <div className="menu-wrapper">
              <div className="menu-icon" onClick={() => handleMenuClick(item?.id)}>
                ⋮
              </div>
              {activeMenu === item.id && (
                <div className="dropdown-menu">
                  <div onClick={() => handlePlay(item)}> Play</div>
                  <div onClick={() => handleDownload(item)}> Download Audio</div>
                  <div onClick={() => handleDelete(item.id)}>Delete</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Audio Player Bar */}
      {/* {playingTrack && (
        <div className="audio-bar">
          <audio
            ref={audioRef}
            src={playingTrack.audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
          <span>🎵 {playingTrack.title}</span>
          {isPlaying ? (
            <button onClick={handlePause}>⏸ Pause</button>
          ) : (
            <button onClick={() => handlePlay(playingTrack)}>▶ Play</button>
          )}
        </div>
      )} */}

{playingTrack && (
  <div className="audio-bar">
    <audio
      ref={audioRef}
      src={playingTrack.audio_url}
      onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
      onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      onEnded={() => setIsPlaying(false)}
    />
    <div className="audio-left">
      <span className="music-icon"><img src={assets?.music} height="40px" width="40px" /></span>
      <span className="track-title">{playingTrack.title}</span>
    </div>

    <div className="audio-center">
      <button className="icon-btn" disabled>⏮</button>
      {isPlaying ? (
        <button className="icon-btn" onClick={handlePause}>⏸</button>
      ) : (
        <button className="icon-btn" onClick={() => handlePlay(playingTrack)}>▶</button>
      )}
      <button className="icon-btn" disabled>⏭</button>
    </div>

    <div className="audio-progress">
      <span className="time">{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          const time = parseFloat(e.target.value);
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }}
      />
      <span className="time">{formatTime(duration)}</span>
    </div>

    <div className="audio-right">
      <a
        href={playingTrack.audio_url}
        download={`${playingTrack.title}.mp3`}
        className="download-btn"
      >
       <span className="mr-10"> <img src={assets?.download} height="20px" width="20px" /></span>
         Download
      </a>
    </div>
  </div>
)}

    </div>
  );
};

export default DashboardPage;

