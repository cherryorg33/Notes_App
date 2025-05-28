import React, { useEffect, useState } from "react";
import NoteDrawer from "./NoteDrawer";
import Navbar from "./Navbar";
import axios from "axios";
import { config } from "../config";

interface Note {
  id: number;
  title: string;
  description: string;
  created_on?: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 18) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
};

const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const token = localStorage.getItem("token");

  const gettingNote = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}notes`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const mappedNotes: Note[] = res.data.map((note: any) => ({
        id: note.note_id,
        title: note.note_title,
        description: note.note_content,
        created_on: note.created_on,
      }));

      setNotes(mappedNotes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    gettingNote();
  }, []);

  const openCreateDrawer = () => {
    setEditingNote(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (note: Note) => {
    setEditingNote(note);
    setDrawerOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        {notes.length === 0 ? (
          <div className="text-gray-500 text-lg">
            {getGreeting()}, you have no notes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-gray-200 shadow-sm rounded p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => openEditDrawer(note)}
              >
                <h3 className="font-semibold text-lg text-blue-600">
                  Title: {note.title}
                </h3>
                <p className="text-gray-600 mt-2">Description: {note.description}</p>
                <p className="text-gray-600 mt-2">{note.created_on}</p>
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={openCreateDrawer}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Add Note"
        >
          +
        </button>

        <NoteDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSave={() => {}}
          editingNote={editingNote}
          refresh={(isrefresh: boolean) => {
            if (isrefresh) {
              gettingNote();
            }
          }}
        />
      </div>
    </>
  );
};

export default HomePage;
