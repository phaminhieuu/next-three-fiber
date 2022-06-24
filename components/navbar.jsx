import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import links from "../constants/link";

export default function Navbar({ path }) {
  const router = useRouter();

  console.log(path);

  const onSelect = (e) => {
    const locale = e.target.value;
    router.push(locale);
  };

  return (
    <div className="fixed w-full h-12 z-10" as="nav">
      <select
        className="form-select appearance-none
      block
      w-1/4
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        aria-label="Default select example"
        onChange={onSelect}
      >
        {links.map((link, index) => (
          <option value={link.path} key={index} selected={link.path === path}>
            {index + 1} - {link.name}
          </option>
        ))}
      </select>
    </div>
  );
}
