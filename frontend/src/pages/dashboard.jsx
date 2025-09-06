import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api'; 
import { CreateProjectModal } from "../components/CreateProjectModal";

export function DashboardPage() { 
    const [projects, setProjects] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, tasksResponse] = await Promise.all([
                    api.get('/projects'), 
                    api.get('/tasks')      
                ]);
                setProjects(projectsResponse.data);
                setMyTasks(tasksResponse.data);
            } catch (err) {
                setError('Failed to load data. Please try refreshing the page.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects([newProject, ...projects]);
    };

    if (isLoading) return <div className="p-8 text-center">Loading your dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    + New Project
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Projects Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Projects</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        {projects.length > 0 ? (
                            projects.map(project => (
                                <Link to={`/project/${project.project_id}`} key={project.project_id} className="block p-4 border rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all">
                                    <h3 className="font-bold text-lg text-blue-600">{project.project_name}</h3>
                                    <p className="text-sm text-gray-600">{project.description}</p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500">You are not a member of any projects yet.</p>
                        )}
                    </div>
                </section>

                {/* My Tasks Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Tasks</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        {myTasks.length > 0 ? (
                            myTasks.map(task => (
                                <div key={task.task_id} className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-lg">{task.title}</h3>
                                    <p className="text-sm text-gray-500">Status: {task.status}</p>
                                    {task.due_date && <p className="text-sm text-red-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">You have no tasks assigned to you.</p>
                        )}
                    </div>
                </section>
            </div>

            {isModalOpen && (
                <CreateProjectModal
                    onClose={() => setIsModalOpen(false)}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    );
}