import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";
import { User, Bell, LogOut } from "lucide-react";

function Navbar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAsRead, unreadCount } = useNotifications(user?.id);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link to={user ? "/dashboard" : "/"}>
        <h1 className="text-lg font-semibold">WhoseTurn</h1>
      </Link>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : user ? (
        <div className="flex items-center gap-4 relative" ref={notificationsRef}>
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-gray-800">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          notif.read ? "bg-gray-50" : "bg-blue-50"
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <p className="font-medium text-sm text-gray-800">
                          {notif.groupName}
                        </p>
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

          {/* User Info */}
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">{user.name}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <NavLink
          to="/auth/login"
          className="text-sm text-gray-700 hover:text-black transition"
        >
          Login
        </NavLink>
      )}
    </nav>
  );
}

export default Navbar;
