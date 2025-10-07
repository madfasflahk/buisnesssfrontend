import React, { useState, useEffect } from 'react';
import { Rnd } from "react-rnd";

const UserModal = ({
  showModal,
  handleCloseModal,
  handleAddUser,
  newUser,
  handleInputChange,
  isFormValid,
  isClosing,
  users,
  setNewUser,
  setUserUpdateId,
  userUpdateId
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 400,
    height: 400,
    x: (window.innerWidth - 400) / 2,
    y: (window.innerHeight - 400) / 2
  });

  useEffect(() => {
    if (newUser.name) {
      setUserSearch(newUser.name);
    } else {
      setUserSearch('');
    }
  }, [newUser.name]);

  useEffect(() => {
    if (showModal) {
      // Re-center modal when window resizes
      const handleResize = () => {
        setDimensions(prev => ({
          ...prev,
          x: (window.innerWidth - prev.width) / 2,
          y: (window.innerHeight - prev.height) / 2
        }));
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showModal]);

  const handleUserSearchChange = (e) => {
    const value = e.target.value;
    setUserSearch(value);
    if (!value) {
      setSelectedUser(null);
      setNewUser({ name: '', role: 'staff', phone: '', whatsapp: '', email: '', password: '', address: '' });
      setUserUpdateId(null);
    }
    setShowUserList(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserSearch(user.name);
    setShowUserList(false);
    setNewUser(user);
    setUserUpdateId(user._id);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setUserSearch('');
    setShowUserList(true);
    setNewUser({ name: '', role: 'staff', phone: '', whatsapp: '', email: '', password: '', address: '' });
    setUserUpdateId(null);
  };

  const handleUserKeyDown = (e) => {
    if (e.key === 'Backspace' && !userSearch) {
      handleClearUser();
    }
  };

  const filteredUsers = users && Array.isArray(users) ? users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  ) : [];

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Rnd
        size={{ width: dimensions.width, height: dimensions.height }}
        position={{ x: dimensions.x, y: dimensions.y }}
        minWidth={350}
        minHeight={300}
        maxHeight={window.innerHeight - 40}
        bounds="window"
        dragHandleClassName="drag-handle"
        enableResizing={{
          bottom: true,
          right: true,
          bottomRight: true,
          bottomLeft: false,
          left: false,
          top: false,
          topRight: false,
          topLeft: false
        }}
        onDragStop={(e, d) => {
          setDimensions(prev => ({ ...prev, x: d.x, y: d.y }));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setDimensions({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            ...position
          });
        }}
        className="bg-transparent"
      >
        <div className={`bg-white rounded-lg shadow-lg flex flex-col ${isClosing ? "animate-slideFadeOut" : "animate-slideFadeIn"} w-full h-full overflow-auto`}>
          {/* Header */}
          <div className="drag-handle cursor-move bg-primary-600 text-white flex justify-between items-center px-4 py-2 rounded-t-lg sticky top-0 z-10">
            <h2 className="text-lg font-semibold">{userUpdateId ? `Edit ${newUser.name}` : 'Add New User'}</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCloseModal}
                className="text-sm border border-white px-3 py-1 rounded hover:bg-white hover:text-app-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!isFormValid}
                className={`text-sm px-3 py-1 rounded transition ${isFormValid
                  ? "bg-white text-app-primary-600 hover:bg-app-primary-100"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                Save
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userSearch}
                onChange={handleUserSearchChange}
                onKeyDown={handleUserKeyDown}
                onFocus={() => setShowUserList(true)}
                onBlur={() => setTimeout(() => setShowUserList(false), 100)}
                placeholder="User Name"
                className="w-full border px-3 py-2 rounded"
              />
              {selectedUser && (
                <button
                  onClick={handleClearUser}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              )}
              {showUserList && !selectedUser && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp:</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                value={newUser.whatsapp}
                onChange={handleInputChange}
                placeholder="WhatsApp Number"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full border px-3 py-2 rounded"
                autoComplete='new-password'
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default UserModal;