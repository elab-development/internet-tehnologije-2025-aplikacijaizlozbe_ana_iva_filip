import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`border px-3 py-2 rounded w-full ${className}`}
    />
  );
}
