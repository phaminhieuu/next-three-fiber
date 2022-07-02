import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import links from "../constants/link";
import Image from "next/image";
import NextLink from "next/link";

const Lesson = ({ thumbnail, name, path, currentPath }) => {
  return (
    <NextLink href={path}>
      <div
        className={`bg-[#2E2E2E] hover:bg-gray-600 ${
          path === currentPath && "border-4 border-blue-400"
        } focus:outline-none focus:ring focus:ring-violet-300 rounded-lg w-full my-3 cursor-pointer overflow-hidden relative`}
      >
        <Image
          src={thumbnail}
          alt={name}
          width="280px"
          height="150px"
          className="object-cover"
        />

        <div className="w-full p-2">{name}</div>
      </div>
    </NextLink>
  );
};

const Drawer = ({ isOpen, setIsOpen, currentPath }) => {
  const typingTimeoutRef = useRef();
  const [search, setSearch] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [filterList, setFilterList] = useState(links);
  const handleFilter = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (typingTimeoutRef) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTrigger(!trigger);
    }, [500]);
  };

  useEffect(() => {
    const filteredList = links.filter((link) =>
      link.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilterList(filteredList);
  }, [trigger]);

  return (
    <div>
      {isOpen && (
        <div
          className="w-screen h-screen fixed top-0 left-0 content-none bg-black opacity-60 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`top-0 left-0 fixed bg-[#222222] w-[calc(100vw-60px)] sm:w-[300px] max-w-[300px] h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ease-in-out duration-300 `}
      >
        <div className="flex justify-start items-center mb-3 border-b p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="ml-2 w-full"
            value={search}
            onChange={handleFilter}
          ></input>
        </div>

        <div className="h-full w-full overflow-x-hidden px-3 pb-16">
          {filterList.map((link, index) => (
            <Lesson
              key={index}
              thumbnail={link.image}
              name={link.name}
              path={link.path}
              currentPath={currentPath}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Navbar({ path }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed z-[2000]" as="nav">
      <div className="pl-3 pt-3">
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="inline-block px-2 py-2 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentPath={path}
      />
    </div>
  );
}
