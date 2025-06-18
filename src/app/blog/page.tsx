"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeIcon, HandThumbUpIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon } from "@heroicons/react/24/solid";
import "@/styles/header.css";

interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  status: string;
  media?: { type: string; url: string };
  author: { id: number; name: string };
  likes: number;
  comments: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    count: number;
    totalPages: number;
  };
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const router = useRouter();
  const [showCommentBox, setShowCommentBox] = useState<number | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      fetchLikedPosts();
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>("http://localhost:5000/blog/posts", {
        params: { page: 1, limit: 10 },
      });
      if (response.data.success) {
        const postedPosts = response.data.data.posts
          .filter((post: Post) => post.status === "posted")
          .map((post) => ({
            ...post,
            author: { id: post.author.id, name: post.author.name },
          }));
        setPosts(postedPosts);
      } else {
        setError("Failed to fetch posts: Invalid response");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    if (!token) return;

    try {
      const likedSet = new Set<number>();
      console.log("Checking likes for", posts.length, "posts");
      for (const post of posts) {
        try {
          const response = await axios.get(`http://localhost:5000/blog/posts/${post.id}/like`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`Post ${post.id} like status:`, response.data);
          if (response.data.success && response.data.data.liked) {
            likedSet.add(post.id);
          }
        } catch (err) {
          console.log(`Error checking like for post ${post.id}:`, err);
          // Ignore errors for individual post like checks
        }
      }
      console.log("Final liked posts set:", Array.from(likedSet));
      setLikedPosts(likedSet);
    } catch (err) {
      console.error("Error fetching liked posts:", err);
    }
  };

  const handleView = (id: number) => {
    router.push(`/blog/${id}`);
  };

  const handleLike = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts");
      return;
    }

    try {
      console.log("Liking post:", id);
      const response = await axios.post(`http://localhost:5000/blog/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Like response:", response.data);
      
      if (response.data.success) {
        // Update the posts with new like count
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === id 
              ? { ...post, likes: response.data.data.likes }
              : post
          )
        );

        // Update liked posts set
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          console.log("Previous liked posts:", Array.from(prev));
          console.log("Response liked status:", response.data.data.liked);
          if (response.data.data.liked) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          console.log("New liked posts set:", Array.from(newSet));
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error liking post:", err);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleComment = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/blog/posts/${id}/comment`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchPosts();
    } catch (err) {
      // handle error
    }
  };

  // Debug logging
  console.log("Current likedPosts:", Array.from(likedPosts));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Latest Blog Posts
        </h2>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center text-lg">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            No published posts available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {post.media && (
                  <div className="h-56 overflow-hidden">
                    {post.media.type === "image" && (
                      <img
                        src={post.media.url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                    {post.media.type === "video" && (
                      <video
                        src={post.media.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    )}
                    {post.media.type === "document" && (
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          Document Preview
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      By {post.author.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.body.substring(0, 100)}... {/* Changed from content to body */}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button 
                      onClick={() => handleLike(post.id)} 
                      className={`flex items-center ${
                        likedPosts.has(post.id) 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {likedPosts.has(post.id) ? (
                        <HandThumbUpSolidIcon className="h-5 w-5 mr-1" />
                      ) : (
                        <HandThumbUpIcon className="h-5 w-5 mr-1" />
                      )}
                      {post.likes}
                    </button>
                    <button onClick={() => setShowCommentBox(post.id)} className="flex items-center text-gray-600 hover:text-blue-600">
                      <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-1" /> {post.comments}
                    </button>
                  </div>
                </div>
                {showCommentBox === post.id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-80">
                      <h3 className="font-bold mb-2">Add a Comment</h3>
                      <input
                        type="text"
                        placeholder="Name (optional)"
                        value={commentName}
                        onChange={e => setCommentName(e.target.value)}
                        className="w-full mb-2 px-2 py-1 border rounded"
                      />
                      <textarea
                        placeholder="Your comment"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        className="w-full mb-2 px-2 py-1 border rounded"
                        required
                      />
                      {commentError && <div className="text-red-600 text-sm mb-2">{commentError}</div>}
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setShowCommentBox(null); setCommentName(""); setCommentText(""); setCommentError(""); }} className="px-3 py-1 text-gray-600">Cancel</button>
                        <button
                          onClick={async () => {
                            setSending(true);
                            setCommentError("");
                            try {
                              const res = await fetch(`http://localhost:5000/blog/posts/${post.id}/comment`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: commentName, comment: commentText }),
                              });
                              if (!res.ok) throw new Error("Failed to send comment");
                              setShowCommentBox(null);
                              setCommentName("");
                              setCommentText("");
                              setCommentError("");
                              fetchPosts(); // update stats
                            } catch (err) {
                              setCommentError("Failed to send comment. Please try again.");
                            } finally {
                              setSending(false);
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                          disabled={sending || !commentText.trim()}
                        >
                          {sending ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;