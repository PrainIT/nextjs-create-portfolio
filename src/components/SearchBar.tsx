"use client";

import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder = "SEARCH",
  onSearch,
  className = "",
  value: controlledValue,
  onChange,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const searchKeyword =
    controlledValue !== undefined ? controlledValue : internalValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchKeyword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center justify-end opacity-70 w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={searchKeyword}
          onChange={handleChange}
          className="w-full max-w-[400px] h-[57px] px-[14px] rounded-full bg-white text-black text-2xl ring-1 ring-grey-500 placeholder:text-2xl placeholder:text-gray-400 placeholder:pl-4 focus:outline-none focus:ring-2 focus:ring-brand"
          style={{
            textAlign: "left",
            lineHeight: "120px",
            paddingLeft: "20px",
          }}
        />
      </div>
    </form>
  );
}
