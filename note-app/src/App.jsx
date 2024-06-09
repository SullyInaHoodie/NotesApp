import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './index.css';

const App = () => {
    const [notes, setNotes] = useState(getNotes());
    const [confetti, setConfetti] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const btnEl = document.getElementById("btn");
        btnEl.addEventListener("click", addNote);

        // Play rain sounds in loop
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.play();
        }

        return () => {
            btnEl.removeEventListener("click", addNote);
        };
    }, []);

    useEffect(() => {
        if (confetti) {
            setTimeout(() => setConfetti(false), 3000);
        }
    }, [confetti]);

    const createNoteEl = (id, content) => (
        <textarea
            key={id}
            className="note"
            defaultValue={content}
            onDoubleClick={() => {
                const warning = confirm("Do you want to delete this note?");
                if (warning) {
                    deleteNote(id);
                }
            }}
            onInput={(e) => updateNote(id, e.target.value)}
        />
    );

    const deleteNote = (id) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
    };

    const updateNote = (id, content) => {
        const updatedNotes = notes.map((note) =>
            note.id === id ? { ...note, content } : note
        );
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
    };

    const addNote = () => {
        const noteObj = {
            id: Math.floor(Math.random() * 100000),
            content: "",
        };
        const updatedNotes = [...notes, noteObj];
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
        setConfetti(true);
    };

    const saveNotes = (notes) => {
        localStorage.setItem("note-app", JSON.stringify(notes));
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div>
            {confetti && <Confetti />}
            <h1 className="heading">Note App</h1>
            <p className="info-text">Double click to remove a note</p>
            <div className="app" id="app">
                <button className="btn" id="btn">+</button>
                {notes.map((note) => createNoteEl(note.id, note.content))}
            </div>
            <button className="mute-btn" onClick={toggleMute}>
                {isMuted ? "Unmute" : "Mute"}
            </button>
            <audio ref={audioRef} src="/rain.mp3" autoPlay loop />
        </div>
    );
};

const getNotes = () => {
    return JSON.parse(localStorage.getItem("note-app") || "[]");
};

export default App;
