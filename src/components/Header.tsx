"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useThemeStore } from "@/app/store/useThemeStore";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Interface for state
interface HeaderState {
  isOpen: boolean;
  isMenuOpen: boolean;
}

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [state, setState] = useState<HeaderState>({
    isOpen: false,
    isMenuOpen: false,
  });
  const { theme, toggleTheme } = useThemeStore();

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
        setState((prev) => ({ ...prev, isOpen: false }));
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
    <header className="bg-opacity-40 backdrop-blur-md p-4 shadow-lg">
      <div className="px-[5%] mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-red-600">
          <Link href="/">
            To-Do <span className="text-black dark:text-white">List</span>
          </Link>
        </h1>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() =>
            setState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
          }
        >
          {state.isMenuOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>

        {/* Navigation Links */}
        <nav
          className={`md:flex items-center space-x-6 absolute md:relative top-[100%] left-0 w-full md:w-auto md:bg-transparent bg-white md:shadow-none shadow-md rounded-lg transition-all ${
            state.isMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 p-4 md:p-0">
            <Link
              href="/"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              Add Task
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md transition-all"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            {/* Profile */}
            <div>
              {session?.user ? (
                <UserCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer"
                  id="profile-menu"
                  onClick={() =>
                    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }))
                  }
                />
              ) : (
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {state.isOpen && (
            <div
              id="dropdown-menu"
              className="absolute right-0 top-10 mt-2 w-fit bg-white dark:bg-slate-800 border rounded shadow-lg z-50"
            >
              <div className="px-4 py-3">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs ">{session?.user?.email}</p>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
