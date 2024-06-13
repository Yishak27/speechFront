import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { Button, ButtonGroup } from '@mui/material'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const AudioRecorderT = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioPlayerRef = useRef(null);

    const startRecording = () => {
        try {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;

                    const chunks = [];
                    mediaRecorder.addEventListener('dataavailable', (event) => {
                        chunks.push(event.data);
                    });

                    mediaRecorder.addEventListener('stop', () => {
                        const blob = new Blob(chunks, { type: 'audio/wav' });
                        setAudioBlob(blob);
                    });

                    mediaRecorder.start();
                    setIsRecording(true);
                }).catch((error) => {

                    console.log('error', error);
                    if (error.name === 'NotAllowedError') {
                        console.log('permission denied');
                    } else {
                        console.error('Error accessing microphone:', error);
                    }
                });
        } catch (error) {
            console.log('denied', error);

        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const restartRecording = () => {
        stopRecording();
        startRecording();
    };

    const sendAudioToBackend = async () => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        try {
            // post to back end ...
            await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Audio file uploaded successfully!');
        } catch (error) {
            console.error('Error uploading audio file:', error);
        }
    };

    return (
        <div>
            <h1>Start Recording</h1>
            <Button variant='contained' onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {audioBlob && (
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center"
                         spacing={3}>
                        <Grid item xs={12} md={8} lg={10}>
                            <ReactAudioPlayer
                                ref={audioPlayerRef}
                                src={URL.createObjectURL(audioBlob)}
                                controls
                            />
                        </Grid>
                        <Grid item xs={12} md={8} lg={10}>
                            <Button variant="outlined" style={{ margin: 10 }} onClick={restartRecording}>Re-record</Button>
                            <Button variant="contained" onClick={sendAudioToBackend}>Translate</Button>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </div>
    );
};

export default AudioRecorderT;