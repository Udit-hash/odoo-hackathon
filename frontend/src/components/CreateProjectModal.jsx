import React, { useState } from 'react';
import { api } from '../services/api';

export function CreateProjectModal({ onClose, onProjectCreated }) {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!projectName) {
            setError('Project name is required.');
            return;
        }
        try {
            const response = await api.post('/projects', { projectName, description });
            onProjectCreated(response.data.project);
            onClose();
        } catch (err) {
            setError('Failed to create project. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit}>
                  
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
                        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="4"></textarea>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}