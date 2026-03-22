export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-background border border-border rounded-xl shadow-airbnb p-6 ${className}`}>
      {children}
    </div>
  );
}
