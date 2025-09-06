import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
export function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!projectId) return;
            setIsLoading(true);
            try {
                const [projectRes, tasksRes, membersRes] = await Promise.all([
                    api.get(`/projects/${projectId}`),
                    api.get(`/tasks/projects/${projectId}`),
                    api.get(`/projects/${projectId}/members`)
                ]);
                setProject(projectRes.data);
                setTasks(tasksRes.data);
                setMembers(membersRes.data);
            } catch (err) {
                setError('Failed to load project data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const tasksByStatus = (status) => tasks.filter(task => task.status === status);

    if (isLoading) return <div className="p-8 text-center">Loading project...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">{project?.project_name}</h1>
                <p className="text-lg text-gray-600 mt-2">{project?.description}</p>
                
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {['To-Do', 'In Progress', 'Done'].map(status => (
                    <div key={status} className="bg-gray-200 p-4 rounded-lg">
                        <h2 className="font-bold text-xl mb-4">{status}</h2>
                        <div className="space-y-4">
                            {tasksByStatus(status).length > 0 ? (
                                tasksByStatus(status).map(task => (
                                    <div key={task.task_id} className="bg-white p-4 rounded-md shadow">
                                        <h3 className="font-semibold">{task.title}</h3>
                                        <p className="text-sm text-gray-500 mt-2">{task.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No tasks in this stage.</p>
                            )}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}