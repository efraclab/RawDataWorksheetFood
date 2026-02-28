import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { DiluentPreparation } from "../../preparation_models/DiluentPreparation";

interface DiluentPreparationDetailProps {
  diluentPreparation: DiluentPreparation;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const DiluentPreparationDetail: React.FC<DiluentPreparationDetailProps> = ({
  diluentPreparation,
  onEdit,
  onRemove,
}) => {
  if (!diluentPreparation) return null;

  const getPlainTextLength = (html: string) =>
    html.replace(/<[^>]*>/g, "").length;

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
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-700">
              {diluentPreparation.label}
            </h4>
            <p className="text-xs text-emerald-600/70">
              {getPlainTextLength(diluentPreparation.content || "")} characters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(diluentPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Edit document"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onRemove(diluentPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Delete document"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="px-4 py-4">
        {diluentPreparation.content ? (
          <div
            className="prose prose-sm max-w-none prose-emerald"
            dangerouslySetInnerHTML={{ __html: diluentPreparation.content }}
            style={{ lineHeight: "1.6", fontSize: "14px" }}
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

export default DiluentPreparationDetail;