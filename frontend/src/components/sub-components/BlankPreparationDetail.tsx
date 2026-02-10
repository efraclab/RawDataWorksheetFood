import React from "react";
import { motion } from "framer-motion";
import type { BlankPreparation } from "../../preparation_models/BlankPreparation";

interface BlankPreparationDetailProps {
  blankPreparation: BlankPreparation;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const BlankPreparationDetail: React.FC<BlankPreparationDetailProps> = ({
  blankPreparation,
  onEdit,
  onRemove,
}) => {
  if (!blankPreparation) {
    return null;
  }

  // Strip HTML tags for character count
  const getPlainTextLength = (html: string) => {
    return html.replace(/<[^>]*>/g, "").length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-300/50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-4 py-3 border-b border-emerald-200/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-700">
              {blankPreparation.label || "Blank Preparation"}
            </h4>
            <p className="text-xs text-emerald-600/70">
              {getPlainTextLength(blankPreparation.content || "")} characters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Edit document"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onRemove(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Delete document"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="px-4 py-4">
        {blankPreparation.content ? (
          <div
            className="prose prose-sm max-w-none prose-emerald"
            dangerouslySetInnerHTML={{ __html: blankPreparation.content }}
            style={{
              lineHeight: "1.6",
              fontSize: "14px",
            }}
          />
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No content available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlankPreparationDetail;