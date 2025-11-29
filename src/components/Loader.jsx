// Loader.jsx
const Loader = () => (
    <div className="w-full h-1 bg-gray-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 h-1 w-1/2 bg-blue-500 animate-loader"></div>
        <style jsx>{`
      @keyframes loader {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-loader {
        animation: loader 1s linear infinite;
      }
    `}</style>
    </div>
);
export default Loader;
