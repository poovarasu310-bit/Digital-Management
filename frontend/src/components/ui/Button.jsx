export default function Button({ children, onClick, type = "button", fullWidth = false, variant = "primary", className = "", disabled = false }) {
  const baseStyles = "min-h-[3rem] px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed",
    outline: "border border-border text-foreground hover:bg-gray-50 active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed",
    ghost: "text-foreground hover:bg-gray-100 active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
