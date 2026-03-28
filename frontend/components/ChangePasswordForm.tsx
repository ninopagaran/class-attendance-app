'use client'

import React, { useState } from 'react'

interface ChangePasswordFormProps {
  onClose: () => void
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleChange = () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      alert('Please enter both your current and new passwords.')
      return
    }

    onChangePassword({ currentPassword: currentPassword.trim(), newPassword: newPassword.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Change Password</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleChange}
            className="px-4 py-2 bg-myred text-white rounded hover:bg-red-700"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordForm