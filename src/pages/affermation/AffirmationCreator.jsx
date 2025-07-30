import React, { useEffect, useRef, useState } from "react";
import { Input, Button, Modal, Radio } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  PlayCircleOutlined,
  RightOutlined,
  PauseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./AffirmationCreator.scss";
import InputField from "../../components/InputField";
import { assets } from "../../assets/assets";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";
import useFreesound from "../../customHook/useFreeSound";
import { Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  generateAffirmationAudio,
  sampleVoiceListFun,
  generateAffirmationAudioRecord,
} from "../../redux/reducer/AffermationSlice";
import { toast } from "react-toastify";
import AudioRecorderDialog from "../../components/AudioRecorderDialog";

const { TextArea } = Input;

const AffirmationCreator = () => {
  const [searchInput, setSearchInput] = useState("");

  const [affirmations, setAffirmations] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("Title");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isTrackModalVisible, setIsTrackModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedVoiceName, setSelectedVoiceName] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedTrackMp3, setSelectedTrackMp3] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [voices, setVoices] = useState([]);

  const [audio, setAudio] = useState(null);
  const [playingVoiceName, setPlayingVoiceName] = useState(null); // stores voice.name that's playing
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const navigate = useNavigate();
  const goDashboard = () => {
    navigate("/dashboard");
  };

  const {
    SampleListData,
    AudioListLoading,
    AudioListError,
    generateAudio,
    generateAudioLoading,
    generateAudioError,
    generateAudioRecordLoading,
  } = useSelector((prev) => prev?.affer);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchInput); // Debounced update
    }, 700); // 700ms delay

    return () => clearTimeout(timer); // Cleanup if input changes quickly
  }, [searchInput]);

  const [mode, setMode] = useState("text"); // "text" or "voice"
  const [loadingVoiceGen, setLoadingVoiceGen] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) {
      return toast.error("Please provide a title");
    }

    if (mode === "text") {
      if (!selectedVoice) {
        return toast.error("Please select a voice");
      }
      if (!selectedTrackMp3) {
        return toast.error("Please select a background track");
      }
      if (affirmations.length === 0) {
        return toast.error("Please add at least one affirmation");
      }

      const payload = {
        title: title,
        speaker_id: selectedVoice,
        background_music: selectedTrackMp3,
        text: affirmations?.join(" ., "),
      };
      try {
        const data = await dispatch(generateAffirmationAudio(payload));
        if (data?.payload.status === 201) {
          toast.success("Audio Generate Succesfully");
          navigate("/dashboard");
        } else {
          toast.error(data?.payload?.message);
        }
      } catch (err) {
        toast.error(err?.payload?.message);
      }
    } else if (mode === "voice") {
      // Voice Affirmation: use custom API
      if (!recordedAudioBlob) {
        return toast.error("Please record your affirmation first.");
      }
      if (!selectedTrackMp3) {
        return toast.error("Please select a background track");
      }
      setLoadingVoiceGen(true);
      try {
        const formData = new FormData();
        formData.append("speech", recordedAudioBlob, "recording.webm");
        formData.append("background_music", selectedTrackMp3);
        formData.append("title", title);

        // Use redux thunk instead of fetch
        const token = ""; // optionally get from auth state if needed
        const apiKey = "affirm-2025";
        const data = await dispatch(
          generateAffirmationAudioRecord({ formData, token, apiKey })
        );
        console.log(data, "sdjhhds");
        if (data?.payload?.status === 201 || data?.payload?.status === 200) {
          toast.success("Voice affirmation generated successfully!");
          navigate("/dashboard");
        } else {
          toast.error(data?.payload?.message || "Failed to generate audio.");
        }
      } catch (err) {
        console.log("Error generating voice affirmation:", err);
        toast.error("Failed to generate audio.");
      } finally {
        setLoadingVoiceGen(false);
      }
    }
  };

  useEffect(() => {
    dispatch(sampleVoiceListFun());
  }, [dispatch]);

  useEffect(() => {
    const populateVoices = () => setVoices(window.speechSynthesis.getVoices());
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }, []);

  const { sounds, loading, setQuery } = useFreesound();

  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(new Audio());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleAdd = () => {
    if (input.trim()) {
      setAffirmations([...affirmations, input]);
      setInput("");
    }
  };

  const playAudio = async () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(affirmations.join(" ,\n "));

    const newVoice = voices?.find((v) => v.name === selectedVoice);
    if (newVoice) utterance.voice = newVoice;

    const music = new Audio(playingTrack);
    music.volume = 0.4;

    utterance.onstart = () => music.play();
    utterance.onend = () => music.pause();

    synth.speak(utterance);
  };

  const handlePlayPause = (track) => {
    const previewUrl = track?.previews?.["preview-lq-mp3"];
    if (!previewUrl) return;

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setPlayingTrackId(track.id);
    }
  };

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, []);

  const handlePlayPauseVoice = (voice) => {
    // If the same voice is already playing, pause it
    if (playingVoiceName === voice.name) {
      audio?.pause();
      setPlayingVoiceName(null);
      return;
    }

    // Stop current audio if any
    if (audio) {
      audio.pause();
    }

    // Create new audio
    const newAudio = new Audio(voice.voice_url);
    newAudio.play();
    setAudio(newAudio);
    setPlayingVoiceName(voice.name);

    // Reset when finished
    newAudio.onended = () => {
      setPlayingVoiceName(null);
    };
  };

  // const handlePlayPauseVoice = (voice) => {
  //   if (playingVoiceName === voice.name) {
  //     // If already playing, stop it
  //     window.speechSynthesis.cancel();
  //     setPlayingVoiceName(null);
  //   } else {
  //     // Stop any current speech
  //     window.speechSynthesis.cancel();

  //     const utterance = new SpeechSynthesisUtterance("This is a sample of the voice.");
  //     utterance.voice = voice;

  //     utterance.onend = () => {
  //       setPlayingVoiceName(null);
  //     };

  //     window.speechSynthesis.speak(utterance);
  //     setPlayingVoiceName(voice.name);
  //   }
  // };

  const handleRemove = (index) => {
    const updated = [...affirmations];
    updated.splice(index, 1);
    setAffirmations(updated);
  };

  const handleTitleEdit = () => setIsModalVisible(true);

  const handleModalOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const voiceOptions = ["John", "Michael", "Alex"];
  const trackOptions = ["Track 1", "Track 2", "Track 3"];

  return (
    <div className="affirmation-container">
      <div className="header">
        <h2 onClick={handleTitleEdit}>
          {title} <EditOutlined />
        </h2>
        <p>Generate and add new affirmations to personalize your audio</p>
      </div>

      {/* Toggle Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div
          style={{
            background: "#f5f6f7",
            borderRadius: 14,
            display: "flex",
            padding: 4,
            width: 380,
            maxWidth: "100%",
          }}
        >
          <button
            style={{
              flex: 1,
              border: "none",
              background: mode === "text" ? "#fff" : "transparent",
              color: "#6b6775",
              fontWeight: mode === "text" ? 500 : 500,
              fontSize: 16,
              borderRadius: 8,
              padding: "10px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => setMode("text")}
          >
            Text Affirmations
          </button>
          <button
            style={{
              flex: 1,
              border: "none",
              background: mode === "voice" ? "#fff" : "transparent",
              color: "#19171c",
              fontWeight: mode === "voice" ? 500 : 500,
              fontSize: 16,
              borderRadius: 8,
              padding: "10px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => setMode("voice")}
          >
            Voice Affirmations
          </button>
        </div>
      </div>

      <div className="selectors">
        {/* Show "Select Voice" only in Text mode */}
        {mode === "text" && (
          <Button
            className="select-box"
            onClick={() => setIsVoiceModalVisible(true)}
          >
            <span className="left-text">
              {selectedVoiceName
                ? `${selectedVoiceName}'s Voice`
                : "Select Voice"}
            </span>
            <RightOutlined className="right-icon" />
          </Button>
        )}
        {/* Always show "Select Background Track" */}
        <Button
          className="select-box"
          onClick={() => setIsTrackModalVisible(true)}
        >
          <span className="left-text">
            {selectedTrack || "Select Background Track"}
          </span>
          <RightOutlined className="right-icon" />
        </Button>
      </div>

      {/* Show input and add button only in Text mode */}
      {mode === "text" && (
        <div className="input-section">
          <InputField
            placeholder="What’s in your mind?"
            className="input-affermation"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add
          </Button>
        </div>
      )}

      {/* Show record button only in Voice mode */}
      {mode === "voice" && (
        <div style={{ marginBottom: 16 }}>
          <Button type="dashed" onClick={() => setIsRecorderOpen(true)}>
            Record Custom Audio
          </Button>
          {recordedAudioUrl && (
            <div style={{ marginTop: 12 }}>
              <audio
                src={recordedAudioUrl}
                controls
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Show affirmations preview only in Text mode */}
      {mode === "text" && (
        <div className="preview-box">
          {affirmations.length === 0 ? (
            <div className="empty-state">
              <img src={assets?.frame} alt="empty" />
            </div>
          ) : (
            <ul className="affirmation-list">
              {affirmations.map((a, i) => (
                <li key={i} className="affirmation-item">
                  <span>{a}</span>
                  <div className="remove-box">
                    <CloseOutlined
                      className="remove-icon"
                      onClick={() => handleRemove(i)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="footer-buttons">
        <Button className="cancel-button btn-height" onClick={goDashboard}>
          Cancel
        </Button>
        <Button
          type="primary"
          className="generate-button"
          loading={
            mode === "voice"
              ? loadingVoiceGen || generateAudioRecordLoading
              : generateAudioLoading
          }
          onClick={handleGenerate}
        >
          <span className="white-emoji">✨</span> Generate Now
        </Button>
      </div>

      <Modal
        title="Edit Title"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        centered
        maskClosable={false}
        okButtonProps={{
          style: {
            backgroundColor: "#8A5CFF", // Your custom color
            borderColor: "#8A5CFF",
            color: "#fff",
          },
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Modal>

      <Modal
        title={
          <div className="modal-title-center">
            {selectedVoiceName
              ? `${selectedVoiceName}'s Voice`
              : "Select Voice"}
          </div>
        }
        open={isVoiceModalVisible}
        footer={null}
        closable={false} // 🚫 removes the × icon
        centered // ✅ vertically centers the modal (optional)
        maskClosable={false}
      >
        <p className="forget-para">
          Please select a voice for your audio file.
        </p>

        <Radio.Group
          value={selectedVoice} // this will hold the selected voice name (string)
          // onChange={(e) => setSelectedVoice(e.target.value)}

          // onChange={(e) => {

          //   setSelectedVoice(e.target.value)
          // }}

          onChange={(e) => {
            const selected = SampleListData.find(
              (v) => v.speaker_id === e.target.value
            );
            setSelectedVoice(selected?.speaker_id); // set id
            setSelectedVoiceName(selected?.name); // set name
          }}
          className="track-options"
        >
          {SampleListData?.map((voice) => (
            <Radio
              key={voice?.name}
              value={voice.speaker_id}
              className="track-item"
            >
              <div className="track-row">
                <span className="track-name">
                  {voice?.length > 30
                    ? `${voice?.name?.slice(0, 30)}...`
                    : voice?.name}
                </span>
                <div
                  className="track-action"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the radio
                    handlePlayPauseVoice(voice);
                  }}
                >
                  {playingVoiceName === voice.name ? (
                    <>
                      <PauseCircleFilled className="pause-icon" />
                      <span className="pause-text">Pause</span>
                    </>
                  ) : (
                    <>
                      <PlayCircleFilled className="play-icon" />
                      <span className="play-text">Sample</span>
                    </>
                  )}
                </div>
              </div>
            </Radio>
          ))}
        </Radio.Group>

        <div className="track-modal-footer">
          <div className="button-group">
            <Button
              onClick={() => setIsVoiceModalVisible(false)}
              className="same-btn-one cancel-btn"
              htmlType="button"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setIsVoiceModalVisible(false);
              }}
              className="same-btn same-btn-one"
              htmlType="submit"
            >
              Select Voice
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div className="modal-title-center">Select Background Track</div>
        }
        open={isTrackModalVisible}
        onCancel={() => setIsTrackModalVisible(false)}
        footer={null} // 👈 Hide default buttons
        closable={false}
        centered
        maskClosable={false}
      >
        <div>
          <input
            type="text"
            className="search-background"
            placeholder="Search Music..."
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <p className="forget-para">
          Please select a background track for your audio file.
        </p>

        <Spin spinning={loading} tip="Loading sounds...">
          <Radio.Group
            value={selectedTrackId}
            onChange={(e) => {
              const selected = sounds.find((s) => s.id === e.target.value);

              setSelectedTrackMp3(selected?.previews["preview-hq-mp3"] || "");
              setSelectedTrack(selected?.name || "");
              setSelectedTrackId(e.target.value);
            }}
            className="track-options"
          >
            {sounds?.map((track) => (
              <Radio key={track.id} value={track?.id} className="track-item">
                <div className="track-row">
                  <span className="track-name">
                    {`${track?.name.slice(0, 40)}`}
                    {track?.name.length > 30 ?? `...`}
                  </span>
                  <div
                    className="track-action"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting radio
                      handlePlayPause(track);
                    }}
                  >
                    {playingTrackId === track.id ? (
                      <>
                        <PauseCircleFilled className="pause-icon" />
                        <span className="pause-text">Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircleFilled className="play-icon" />
                        <span className="play-text">Sample</span>
                      </>
                    )}
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </Spin>

        {/* Custom Footer Buttons */}
        <div className="track-modal-footer">
          <div className="button-group">
            <Button
              onClick={() => setIsTrackModalVisible(false)}
              className="same-btn-one cancel-btn"
              htmlType="button"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setIsTrackModalVisible(false);
              }}
              className="same-btn same-btn-one"
              htmlType="submit"
            >
              Select Track
            </Button>
          </div>
        </div>
      </Modal>

      <AudioRecorderDialog
        open={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        onSubmit={({ url, blob }) => {
          setRecordedAudioUrl(url);
          setRecordedAudioBlob(blob);
          console.log("Audio submitted:", url, blob);
          // Example: send to API
          // const formData = new FormData();
          // formData.append('audio', blob, 'recording.webm');
          // fetch('/your-api-endpoint', { method: 'POST', body: formData });
        }}
      />
    </div>
  );
};

export default AffirmationCreator;
