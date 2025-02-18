"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Interface for state
interface HeaderState {
  isOpen: boolean;
}

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [state, setState] = useState<HeaderState>({ isOpen: false });

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const profileMenu = document.getElementById("profile-menu");
      const dropdownMenu = document.getElementById("dropdown-menu");

      if (
        dropdownMenu &&
        !dropdownMenu.contains(event.target as Node) &&
        profileMenu &&
        !profileMenu.contains(event.target as Node)
      ) {
        setState({ isOpen: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white bg-opacity-40 backdrop-blur-md text-[#777] p-4 shadow-lg">
      <div className="max-w-7xl md:px-0 px-[5%] mx-auto flex justify-between items-center relative">
        <h1 className="text-3xl font-bold text-red-600">
          <Link href="/">
            To-Do <span className="text-black">List</span>
          </Link>
        </h1>

        {/* Navigation Links */}
        <nav className="space-x-6">
          <Link
            href="/"
            className="hover:text-blue-200 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/create"
            className="hover:text-blue-200 transition-colors duration-300"
          >
            Add Task
          </Link>
        </nav>

        {/* Profile Image */}
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            id="profile-menu"
            onClick={() => setState({ isOpen: !state.isOpen })}
          />
        )}

        {/* Dropdown Menu */}
        {state.isOpen && (
          <div
            id="dropdown-menu"
            className="absolute right-0 top-10 mt-2 w-48 bg-white border rounded shadow-lg z-50"
          >
            <div className="px-4 py-3">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <hr />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
