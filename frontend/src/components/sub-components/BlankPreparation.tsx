import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlankPreparationProps {
  onClose: () => void;
  onSave?: (label: string, content: string) => void;
  existingContent?: string;
  existingLabel?: string;
  isEditing?: boolean;
}

const BlankPreparation: React.FC<BlankPreparationProps> = ({ 
  onClose, 
  onSave, 
  existingContent,
  existingLabel,
  isEditing 
}) => {
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("");
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState("3");
  const [currentTextColor, setCurrentTextColor] = useState("#000000");

  useEffect(() => {
    if (existingContent && editorRef.current) {
      editorRef.current.innerHTML = existingContent;
      setContent(existingContent);
    } else if (!isEditing && editorRef.current) {
      // Clear the editor for new documents
      editorRef.current.innerHTML = "";
      setContent("");
    }
    
    // Load existing label if editing
    if (existingLabel) {
      setLabel(existingLabel);
    } else if (!isEditing) {
      setLabel("");
    }
  }, [existingContent, existingLabel, isEditing]);

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');
    if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
    if (document.queryCommandState('justifyFull')) formats.add('justifyFull');
    
    setActiveFormats(formats);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('mouseup', updateActiveFormats);
      editor.addEventListener('keyup', updateActiveFormats);
      return () => {
        editor.removeEventListener('mouseup', updateActiveFormats);
        editor.removeEventListener('keyup', updateActiveFormats);
      };
    }
  }, []);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handleFormatClick = (format: string, value?: string) => {
    execCommand(format, value);
  };

  const handleSave = () => {
    setIsSaving(true);
    if (editorRef.current && label.trim()) {
      const currentContent = editorRef.current.innerHTML;
      if (onSave) {
        onSave(label.trim(), currentContent);
      }
    }
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      setContent("");
      setActiveFormats(new Set());
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const table = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #059669; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #059669; padding: 8px;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #059669; padding: 8px;">Cell 3</td>
          <td style="border: 1px solid #059669; padding: 8px;">Cell 4</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, table);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const toolbarSections = [
    {
      title: "Text Style",
      buttons: [
        { 
          icon: <span className="font-bold text-base">B</span>, 
          command: "bold", 
          tooltip: "Bold (Ctrl+B)" 
        },
        { 
          icon: <span className="italic text-base">I</span>, 
          command: "italic", 
          tooltip: "Italic (Ctrl+I)" 
        },
        { 
          icon: <span className="underline text-base">U</span>, 
          command: "underline", 
          tooltip: "Underline (Ctrl+U)" 
        },
        { 
          icon: <span className="line-through text-base">S</span>, 
          command: "strikeThrough", 
          tooltip: "Strikethrough" 
        },
      ],
    },
    {
      title: "Alignment",
      buttons: [
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          ), 
          command: "justifyLeft", 
          tooltip: "Align Left" 
        },
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          ), 
          command: "justifyCenter", 
          tooltip: "Align Center" 
        },
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          ), 
          command: "justifyRight", 
          tooltip: "Align Right" 
        },
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          ), 
          command: "justifyFull", 
          tooltip: "Justify" 
        },
      ],
    },
    {
      title: "Lists",
      buttons: [
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3-8a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
          ), 
          command: "insertUnorderedList", 
          tooltip: "Bullet List" 
        },
        { 
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm4-8a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z" />
            </svg>
          ), 
          command: "insertOrderedList", 
          tooltip: "Numbered List" 
        },
      ],
    },
  ];

  const headingButtons = [
    { label: "H1", command: "formatBlock", value: "h1", tooltip: "Heading 1" },
    { label: "H2", command: "formatBlock", value: "h2", tooltip: "Heading 2" },
    { label: "H3", command: "formatBlock", value: "h3", tooltip: "Heading 3" },
    { label: "P", command: "formatBlock", value: "p", tooltip: "Paragraph" },
  ];

  const fontSizes = [
    { label: "Very Small", value: "1" },
    { label: "Small", value: "2" },
    { label: "Normal", value: "3" },
    { label: "Medium", value: "4" },
    { label: "Large", value: "5" },
    { label: "Very Large", value: "6" },
    { label: "Huge", value: "7" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit' : 'Create'} Blank Preparation
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Label Input Section */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Preparation Label <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter a label for this preparation"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            autoFocus
          />
          {!label.trim() && (
            <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Label is required to save this preparation
            </p>
          )}
        </label>
      </div>

      {/* Toolbar - Classic UI */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {/* Text Formatting Buttons */}
          {toolbarSections.map((section, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="w-px h-6 bg-gray-300 mx-1" />}
              <div className="flex items-center gap-1">
                {section.buttons.map((btn, btnIdx) => (
                  <button
                    key={btnIdx}
                    onClick={() => handleFormatClick(btn.command)}
                    title={btn.tooltip}
                    className={`p-2 text-sm rounded hover:bg-gray-200 transition-colors ${
                      activeFormats.has(btn.command)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </React.Fragment>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <div className="flex items-center gap-1">
            {headingButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleFormatClick(btn.command, btn.value)}
                title={btn.tooltip}
                className="px-3 py-1.5 text-sm font-semibold bg-white text-gray-700 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Font Size */}
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Size
              <svg className={`w-3 h-3 transition-transform ${showFontMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            <AnimatePresence>
              {showFontMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1 min-w-[160px]"
                >
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => {
                        handleFormatClick("fontSize", size.value);
                        setCurrentFontSize(size.value);
                        setShowFontMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        currentFontSize === size.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Colors */}
          <div className="relative">
            <input
              type="color"
              value={currentTextColor}
              onChange={(e) => {
                setCurrentTextColor(e.target.value);
                handleFormatClick("foreColor", e.target.value);
              }}
              title="Text Color"
              className="w-10 h-8 border border-gray-300 rounded cursor-pointer bg-white"
            />
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Advanced Tools */}
          <button
            onClick={insertLink}
            className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-2"
            title="Insert Link"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
            </svg>
            Link
          </button>

          <button
            onClick={insertTable}
            className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-2"
            title="Insert Table"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" />
            </svg>
            Table
          </button>

          <div className="flex-1" />

          {/* Action Buttons */}
          <button
            onClick={handleClear}
            className="px-4 py-1.5 text-sm font-medium text-red-700 bg-white hover:bg-red-50 border border-red-300 rounded transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
            </svg>
            Clear
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !label.trim()}
            className={`px-5 py-1.5 text-sm font-semibold text-white rounded transition-colors flex items-center gap-2 ${
              isSaving || !label.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
            title={!label.trim() ? "Please enter a label to save" : "Save preparation"}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-6xl mx-auto p-8">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="min-h-[calc(100vh-300px)] p-8 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
            suppressContentEditableWarning
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
            </svg>
            <span className="font-medium">{content.replace(/<[^>]*>/g, "").length}</span> characters
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
            </svg>
            <span className="font-medium">{content.split(/\s+/).filter(w => w).length}</span> words
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default BlankPreparation;