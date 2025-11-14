import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import useGroups from "../hooks/useGroups";

import CreateGroupModal from "../components/CreateGroupModal";
import {
  Users,
  Plus,
  Bell,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { groups, createGroup, deleteGroup, completeTurn, nudgeMember } =
    useGroups(user?.id);

  // Redirect to login if not authenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateGroup = (name: string, desc: string, members: string[]) => {
    createGroup(name, desc, members, user);
  };

  const handleCompleteTurn = (groupId: string) => {
    const success = completeTurn(groupId, user.id);
    if (!success) {
      alert("It's not your turn yet!");
    }
  };

  const handleNudge = (groupId: string) => {
    const success = nudgeMember(groupId, user.id);
    if (success) {
      alert("Reminder sent!");
    } else {
      alert("You can't nudge yourself!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Groups</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first group to start tracking turns
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {groups.map((group) => {
              const currentMember = group.members[group.currentTurnIndex];
              const isMyTurn = currentMember.id === user.id;

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {group.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {group.description}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Current Turn</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-indigo-600">
                          {currentMember.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentMember.email}
                        </p>
                      </div>
                      {isMyTurn && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Your Turn!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Rotation Order
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member, idx) => (
                        <div
                          key={member.id}
                          className={`px-3 py-1 rounded-full text-sm ${
                            idx === group.currentTurnIndex
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {member.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isMyTurn ? (
                      <button
                        onClick={() => handleCompleteTurn(group.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Mark Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNudge(group.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                      >
                        <Bell className="w-4 h-4" />
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Dashboard;
