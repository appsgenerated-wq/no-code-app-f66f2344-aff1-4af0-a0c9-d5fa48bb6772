import React, { useState, useEffect, useCallback } from 'react';
import config from '../constants';
import { PlusIcon, UserCircleIcon, LogoutIcon } from '@heroicons/react/solid';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [dolphins, setDolphins] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedDolphin, setSelectedDolphin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDolphinForm, setShowDolphinForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [newDolphinData, setNewDolphinData] = useState({ name: '', species: '', birthDate: '' });
  const [newSessionData, setNewSessionData] = useState({ durationMinutes: 30, notes: '', performanceRating: 'consistent', skillsPracticed: [] });

  const loadDolphins = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await manifest.from('Dolphin').find({
        filter: { trainer: { id: user.id } },
        sort: { name: 'asc' },
        include: ['trainer']
      });
      setDolphins(response.data);
      if (response.data.length > 0) {
        setSelectedDolphin(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load dolphins:', error);
    }
    setLoading(false);
  }, [manifest, user]);

  const loadSkills = useCallback(async () => {
    try {
      const response = await manifest.from('Skill').find();
      setSkills(response.data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  }, [manifest]);

  useEffect(() => {
    loadDolphins();
    loadSkills();
  }, [loadDolphins, loadSkills]);

  useEffect(() => {
    const loadSessions = async () => {
      if (selectedDolphin) {
        try {
          const response = await manifest.from('TrainingSession').find({
            filter: { dolphin: { id: selectedDolphin.id } },
            sort: { sessionDate: 'desc' },
            include: ['skillsPracticed']
          });
          setSessions(response.data);
        } catch (error) {
          console.error('Failed to load sessions:', error);
        }
      }
    };
    loadSessions();
  }, [selectedDolphin, manifest]);

  const handleCreateDolphin = async (e) => {
    e.preventDefault();
    try {
      const createdDolphin = await manifest.from('Dolphin').create(newDolphinData);
      setDolphins([createdDolphin, ...dolphins]);
      setNewDolphinData({ name: '', species: '', birthDate: '' });
      setShowDolphinForm(false);
    } catch (error) {
      console.error('Failed to create dolphin:', error);
      alert('Could not create dolphin.');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!selectedDolphin) return;
    try {
      const sessionData = { 
        ...newSessionData,
        dolphin: selectedDolphin.id, // Link to dolphin
      };
      const createdSession = await manifest.from('TrainingSession').create(sessionData);
      setSessions([createdSession, ...sessions]);
      setNewSessionData({ durationMinutes: 30, notes: '', performanceRating: 'consistent', skillsPracticed: [] });
      setShowSessionForm(false);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Could not create session.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600">Admin</a>
            <button onClick={onLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dolphins List Column */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Dolphins</h2>
              <button onClick={() => setShowDolphinForm(!showDolphinForm)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            {showDolphinForm && (
              <form onSubmit={handleCreateDolphin} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-md">
                <input type="text" placeholder="Name" value={newDolphinData.name} onChange={(e) => setNewDolphinData({...newDolphinData, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                <input type="text" placeholder="Species" value={newDolphinData.species} onChange={(e) => setNewDolphinData({...newDolphinData, species: e.target.value})} className="w-full p-2 border rounded-md" />
                <input type="date" value={newDolphinData.birthDate} onChange={(e) => setNewDolphinData({...newDolphinData, birthDate: e.target.value})} className="w-full p-2 border rounded-md" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Add Dolphin</button>
              </form>
            )}
            <ul className="space-y-2">
              {dolphins.map(dolphin => (
                <li key={dolphin.id} onClick={() => setSelectedDolphin(dolphin)} className={`p-3 rounded-lg cursor-pointer transition ${selectedDolphin?.id === dolphin.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'}`}>
                  <p className="font-semibold">{dolphin.name}</p>
                  <p className="text-sm text-gray-600">{dolphin.species}</p>
                </li>
              ))}
              {dolphins.length === 0 && !loading && <p className="text-gray-500 text-sm">No dolphins found. Add one!</p>}
              {loading && <p className="text-gray-500 text-sm">Loading dolphins...</p>}
            </ul>
          </div>

          {/* Training Sessions Column */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            {selectedDolphin ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Training Sessions for {selectedDolphin.name}</h2>
                  <button onClick={() => setShowSessionForm(!showSessionForm)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {showSessionForm && (
                  <form onSubmit={handleCreateSession} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-md">
                    <input type="number" placeholder="Duration (mins)" value={newSessionData.durationMinutes} onChange={(e) => setNewSessionData({...newSessionData, durationMinutes: e.target.value})} className="w-full p-2 border rounded-md" required />
                    <textarea placeholder="Session Notes" value={newSessionData.notes} onChange={(e) => setNewSessionData({...newSessionData, notes: e.target.value})} className="w-full p-2 border rounded-md" rows="3"></textarea>
                    <select value={newSessionData.performanceRating} onChange={(e) => setNewSessionData({...newSessionData, performanceRating: e.target.value})} className="w-full p-2 border rounded-md">
                      <option value="learning">Learning</option>
                      <option value="inconsistent">Inconsistent</option>
                      <option value="consistent">Consistent</option>
                      <option value="mastered">Mastered</option>
                    </select>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills Practiced</label>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.map(skill => (
                          <label key={skill.id} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={newSessionData.skillsPracticed.includes(skill.id)}
                              onChange={(e) => {
                                const skillId = skill.id;
                                const currentSkills = newSessionData.skillsPracticed;
                                const newSkills = e.target.checked ? [...currentSkills, skillId] : currentSkills.filter(id => id !== skillId);
                                setNewSessionData({...newSessionData, skillsPracticed: newSkills});
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>{skill.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Log Session</button>
                  </form>
                )}
                <ul className="space-y-4">
                  {sessions.length > 0 ? sessions.map(session => (
                    <li key={session.id} className="p-4 border rounded-lg bg-gray-50">
                      <p className="font-semibold">{new Date(session.sessionDate).toLocaleString()}</p>
                      <p className="text-sm text-gray-700 mt-1">Duration: {session.durationMinutes} mins | Rating: <span className="font-medium">{session.performanceRating}</span></p>
                      <div className="prose prose-sm mt-2" dangerouslySetInnerHTML={{ __html: session.notes }}></div>
                      {session.skillsPracticed && session.skillsPracticed.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-600">Skills:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {session.skillsPracticed.map(skill => <span key={skill.id} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{skill.name}</span>)}
                          </div>
                        </div>
                      )}
                    </li>
                  )) : <p className="text-gray-500 text-sm">No training sessions logged for {selectedDolphin.name}.</p>}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <UserCircleIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Select a Dolphin</h3>
                <p>Choose a dolphin from the list to view their training history, or add a new dolphin to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
