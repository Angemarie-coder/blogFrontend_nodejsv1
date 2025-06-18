"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: "", email: "", role: "", profileImage: "" });
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/users/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProfile(res.data.data);
      setName(res.data.data.name);
      setProfileImage(res.data.data.profileImage || "");
    } catch (err: any) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      await axios.put(
        "http://localhost:5000/users/me",
        { name, profileImage },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSuccess("Profile updated successfully");
      fetchProfile();
    } catch (err: any) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Profile Image URL</label>
          <input
            type="text"
            value={profileImage}
            onChange={e => setProfileImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {profileImage && (
            <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full mt-4" />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="text"
            value={profile.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <input
            type="text"
            value={profile.role}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage; 