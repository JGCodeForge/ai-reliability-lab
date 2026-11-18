export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-indigo-500/40 text-gray-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
    >
      <i className="fa-solid fa-circle-info text-indigo-400" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
