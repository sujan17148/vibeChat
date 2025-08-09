import { forwardRef } from "react";

const Input = forwardRef(({ label, type = "text", placeholder, error, ...rest }, ref) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block mb-1 text-[var(--color-text)]">{label}</label>}
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded border border-[var(--color-soft-accent)] bg-[var(--color-secondary)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
    </div>
  );
});

export default Input;
