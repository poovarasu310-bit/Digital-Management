export default function Input({ id, label, type = "text", value, onChange, placeholder, required = false }) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <div className="flex flex-col mb-1 w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 font-medium text-foreground text-sm sm:text-base cursor-pointer">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 min-h-[3rem] text-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background text-foreground shadow-sm placeholder-gray-400"
      />
    </div>
  );
}
