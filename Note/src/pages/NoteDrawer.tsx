import React, { useState, useEffect } from 'react';

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
}

const NoteDrawer: React.FC<Props> = ({ isOpen, onClose, onSave, editingNote }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingNote]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{

    }
    // onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}  bg-black/30`}>
      <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">{editingNote ? 'Edit Note' : 'Create Note'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-gray-300 p-2 rounded resize-none h-32"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteDrawer;
