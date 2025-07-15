import React, { useState } from "react";
import { Modal, Button } from "antd";
import { ReactMediaRecorder } from "react-media-recorder";

const AudioRecorderDialog = ({ open, onClose, onSubmit }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  return (
    <Modal
      title="Record Your Audio"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      maskClosable={false}
    >
      <ReactMediaRecorder
        audio
        render={({
          status,
          startRecording,
          stopRecording,
          mediaBlobUrl,
          mediaBlob,
          clearBlobUrl,
        }) => (
          <div style={{ textAlign: "center" }}>
            <p>Status: {status}</p>
            {!mediaBlobUrl ? (
              <>
                <Button
                  type="primary"
                  onClick={startRecording}
                  disabled={status === "recording"}
                  style={{ marginRight: 8 }}
                >
                  Start Recording
                </Button>
                <Button
                  onClick={stopRecording}
                  disabled={status !== "recording"}
                >
                  Stop Recording
                </Button>
              </>
            ) : (
              <>
                <audio
                  src={mediaBlobUrl}
                  controls
                  style={{ width: "100%", marginBottom: 16 }}
                />
                <div>
                  <Button
                    onClick={() => {
                      clearBlobUrl();
                      setAudioUrl(null);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Record Again
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setAudioUrl(mediaBlobUrl);
                      // Only submit if mediaBlob is available
                      if (mediaBlob) {
                        onSubmit({ url: mediaBlobUrl, blob: mediaBlob });
                      } else {
                        // fallback: fetch blob from blobUrl
                        fetch(mediaBlobUrl)
                          .then((res) => res.blob())
                          .then((blob) => {
                            onSubmit({ url: mediaBlobUrl, blob });
                          });
                      }
                      onClose();
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      />
    </Modal>
  );
};

export default AudioRecorderDialog;
