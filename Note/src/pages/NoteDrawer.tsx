import axios from "axios";
import React, { useState, useEffect } from "react";
import { config } from "../config";

interface Note {
  id?: number;
  title: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  editingNote?: Note | null;
  refresh: (isrefresh: boolean) => void;
}

const NoteDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  editingNote,
  refresh,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingNote]);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      note_title: title,
      note_content: description,
    };

    try {
      if (editingNote && editingNote.id !== undefined) {
        const res = await axios.put(
          `${config.BASE_URL}notes/${editingNote.id}`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(res, "update response");
        onClose();
        refresh(true);
      } else {
        const res = await axios.post(`${config.BASE_URL}notes`, payload, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log(res, "create response");
        alert(res.data.msg || "Note added successfully");
        onClose();
        refresh(true);
      }
    } catch (e) {
      alert("Error while saving the note.");
      console.error(e);
    }
  };

  const handledelete = async(id:number)=>{
     try{
      await axios.delete(`${config.BASE_URL}notes/${id}`,
 {
            headers: {
              Authorization: "Bearer " + token,
            },
          }

      );

      alert('Delete SuccessFully');
      refresh(true)

     }catch(error){
      console.log(error)
     }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } bg-black/30`}
    >
      <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {editingNote ? "Edit Note" : "Create Note"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-gray-300 p-2 rounded resize-none h-32"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
           {editingNote && editingNote.id && (
  <button
    onClick={() => handledelete(editingNote.id || 0)}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Delete
  </button>
)}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteDrawer;
