import React, { useState } from "react";

const CreateGroupModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, desc: string, members: string[]) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const addMember = () => {
    if (memberEmail && !members.includes(memberEmail)) {
      setMembers([...members, memberEmail]);
      setMemberEmail("");
    }
  };

  const handleSubmit = () => {
    if (!name || !description) return;
    onCreate(name, description, members);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dishes Duty"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this rotation for?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addMember()}
                placeholder="roommate@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addMember}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>

            {members.length > 0 && (
              <div className="mt-2 space-y-1">
                {members.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      onClick={() =>
                        setMembers(members.filter((_, i) => i !== idx))
                      }
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
