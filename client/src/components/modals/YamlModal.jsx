import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { customSyntaxTheme } from "../../styles/syntaxTheme";

const YamlModal = ({ name, content, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1a3c] rounded-xl border border-[#4e3976]/30 max-w-4xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#4e3976]/30">
          <h3 className="text-lg font-semibold text-white">
            Docker Compose - {name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer font-bold text-xl"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <SyntaxHighlighter
            language="yaml"
            style={customSyntaxTheme}
            showLineNumbers={true}
            customStyle={{
              borderRadius: "0.5rem",
              backgroundColor: "#100e21",
              border: "none",
              margin: 0,
            }}
            codeTagProps={{
              style: {
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.875rem",
              },
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default YamlModal;
