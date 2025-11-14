import React, { useState } from "react";
import { useAuth } from "./modules/auth/auth";
import useGroups from "./hooks/useGroups";
import useNotifications from "./hooks/useNotifications";
import AuthForm from "./components/AuthForm";
import CreateGroupModal from "./components/CreateGroupModal";
import {
  User,
  Users,
  Plus,
  Bell,
  LogOut,
  Trash2,
  ArrowRight,
} from "lucide-react";

const App = () => {
  const { user, loading, signOut } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { groups, createGroup, deleteGroup, completeTurn, nudgeMember } =
    useGroups(user?.id);
  const { notifications, markAsRead, unreadCount } = useNotifications(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={() => {}} />;
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Turn Tracker</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>

            <button
              onClick={signOut}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="max-w-4xl mx-auto px-4 mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-3">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg ${
                      notif.read ? "bg-gray-50" : "bg-blue-50"
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <p className="font-medium text-sm">{notif.groupName}</p>
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

export default App;
