import { useState, useEffect } from "react";
import {
  Beaker,
  Wrench,
  FlaskConical,
  TestTube2,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Search,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import {
  getChemicals,
  getInstruments,
  getStandards,
  getMedia,
  deleteChemical,
  deleteInstrument,
  deleteStandard,
  deleteMedia,
  addChemical,
  updateChemical,
  addInstrument,
  updateInstrument,
  addStandard,
  updateStandard,
  addMedia,
  updateMedia,
  insertWorksheetLog,
} from "../services/api";

type TabType = "chemicals" | "instruments" | "standards" | "media";

interface ReferenceDataManagementProps {
  onBack: () => void;
}

export default function ReferenceDataManagement({
  onBack = () => {},
}: ReferenceDataManagementProps) {
  const employeeId = localStorage.getItem("EmployeeId") || "";
  const role = localStorage.getItem("Role") || "";

  const [activeTab, setActiveTab] = useState<TabType>("chemicals");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  // Data states
  const [chemicals, setChemicals] = useState<any[]>([]);
  const [instruments, setInstruments] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const refTypeLabel = (tab: TabType): string =>
    ({ chemicals: "Chemical", instruments: "Instrument", standards: "Standard", media: "Media" })[tab];

  const refIdFromItem = (tab: TabType, item: any): string => {
    if (tab === "chemicals") return String(item.slno || "");
    if (tab === "instruments") return String(item.id || "");
    if (tab === "standards") return String(item.serialNo || "");
    return String(item.id || "");
  };

  const fireRefLog = (action: string, remarks: string, refId: string) => {
    insertWorksheetLog({
      action,
      remarks,
      employeeId,
      role,
      referenceType: refTypeLabel(activeTab),
      referenceId: refId,
    }).catch((err) => console.warn("Failed to insert reference log:", err));
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "chemicals") {
        const data = await getChemicals();
        setChemicals(data);
      } else if (activeTab === "instruments") {
        const data = await getInstruments();
        setInstruments(data);
      } else if (activeTab === "standards") {
        const data = await getStandards();
        setStandards(data);
      } else if (activeTab === "media") {
        const data = await getMedia();
        setMedia(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Helper function to get next primary key
  const getNextPrimaryKey = (): string => {
    if (activeTab === "chemicals") {
      if (chemicals.length === 0) return "0001";
      const maxId = Math.max(...chemicals.map(c => parseInt(c.slno) || 0));
      return String(maxId + 1).padStart(4, "0");
    } else if (activeTab === "instruments") {
      if (instruments.length === 0) return "0001";
      const maxId = Math.max(...instruments.map(i => parseInt(i.id) || 0));
      return String(maxId + 1).padStart(4, "0");
    } else if (activeTab === "standards") {
      if (standards.length === 0) return "STN-0001";
      const maxId = Math.max(...standards.map(s => {
        const num = s.serialNo.replace("STN-", "");
        return parseInt(num) || 0;
      }));
      return `STN-${String(maxId + 1).padStart(4, "0")}`;
    } else {
      return "";
    }
  };

  const handleAdd = () => {
    setModalMode("add");
    const nextKey = getNextPrimaryKey();
    
    // Pre-populate the primary key based on the tab
    let initialData: any = {};
    if (activeTab === "chemicals") {
      initialData = { slno: nextKey };
    } else if (activeTab === "instruments") {
      initialData = { id: nextKey };
    } else if (activeTab === "standards") {
      initialData = { serialNo: nextKey };
    } else {
      initialData = {};
    }
    
    setEditingItem(initialData);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalMode("edit");
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    setError(null);
    try {
      const refId = refIdFromItem(activeTab, itemToDelete);
      if (activeTab === "chemicals") {
        await deleteChemical(itemToDelete.slno);
      } else if (activeTab === "instruments") {
        await deleteInstrument(itemToDelete.id);
      } else if (activeTab === "standards") {
        await deleteStandard(itemToDelete.serialNo);
      } else if (activeTab === "media") {
        await deleteMedia(itemToDelete.id);
      }
      fireRefLog(
        `${refTypeLabel(activeTab)} Deleted`,
        `${refTypeLabel(activeTab)} '${itemToDelete.name || refId}' deleted`,
        refId
      );
      showSuccess("Item deleted successfully");
      setShowDeleteDialog(false);
      setItemToDelete(null);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "chemicals") {
        if (modalMode === "add") {
          await addChemical(data);
        } else {
          await updateChemical(data);
        }
      } else if (activeTab === "instruments") {
        if (modalMode === "add") {
          await addInstrument(data);
        } else {
          await updateInstrument(data);
        }
      } else if (activeTab === "standards") {
        if (modalMode === "add") {
          await addStandard(data);
        } else {
          await updateStandard(data);
        }
      } else if (activeTab === "media") {
        if (modalMode === "add") {
          await addMedia(data);
        } else {
          await updateMedia(data);
        }
      }
      const refId = activeTab === "media" && modalMode === "add"
        ? ""
        : refIdFromItem(activeTab, data);
      const verb = modalMode === "add" ? "Added" : "Updated";
      fireRefLog(
        `${refTypeLabel(activeTab)} ${verb}`,
        `${refTypeLabel(activeTab)} '${data.name || refId}' ${verb.toLowerCase()}`,
        refId
      );
      showSuccess(
        `Item ${modalMode === "add" ? "added" : "updated"} successfully`
      );
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = () => {
    let data: any[] = [];
    if (activeTab === "chemicals") data = chemicals;
    else if (activeTab === "instruments") data = instruments;
    else if (activeTab === "standards") data = standards;
    else if (activeTab === "media") data = media;

    if (!searchQuery) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredData().length / rowsPerPage);
  };

  const tabs = [
    { id: "chemicals" as TabType, label: "Chemicals", icon: Beaker },
    { id: "instruments" as TabType, label: "Instruments", icon: Wrench },
    { id: "standards" as TabType, label: "Standards", icon: FlaskConical },
    { id: "media" as TabType, label: "Media", icon: TestTube2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-[1900px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Reference Data Management
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage chemicals, instruments, standards, and media
                </p>
              </div>
            </div>

            {/* Tabs moved to right */}
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Add Bar */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-24 right-6 z-50 animate-fadeIn">
          <div className="bg-white border border-emerald-200 rounded-xl shadow-xl p-4 flex items-center gap-3 min-w-[300px]">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-24 right-6 z-50 animate-fadeIn">
          <div className="bg-white border border-red-200 rounded-xl shadow-xl p-4 flex items-center gap-3 min-w-[300px]">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1900px] mx-auto px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Top Pagination */}
          {!isLoading && getFilteredData().length > 0 && (
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-bold text-slate-800">
                    {(currentPage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-slate-800">
                    {Math.min(
                      currentPage * rowsPerPage,
                      getFilteredData().length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-800">
                    {getFilteredData().length}
                  </span>{" "}
                  entries
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-emerald-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-sm">
                    Page {currentPage} of {getTotalPages()}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(getTotalPages(), p + 1)
                      )
                    }
                    disabled={currentPage === getTotalPages()}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-emerald-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {isLoading ? (
            <div className="h-96 p-16 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === "chemicals" && (
                <ChemicalsTable
                  data={getPaginatedData()}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              )}
              {activeTab === "instruments" && (
                <InstrumentsTable
                  data={getPaginatedData()}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              )}
              {activeTab === "standards" && (
                <StandardsTable
                  data={getPaginatedData()}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              )}
              {activeTab === "media" && (
                <MediaTable
                  data={getPaginatedData()}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              )}

              {/* Bottom Pagination */}
              {getFilteredData().length > 0 && (
                <div className="p-6 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Showing{" "}
                      <span className="font-bold text-slate-800">
                        {(currentPage - 1) * rowsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-slate-800">
                        {Math.min(
                          currentPage * rowsPerPage,
                          getFilteredData().length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-800">
                        {getFilteredData().length}
                      </span>{" "}
                      entries
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-emerald-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-sm">
                        Page {currentPage} of {getTotalPages()}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(getTotalPages(), p + 1)
                          )
                        }
                        disabled={currentPage === getTotalPages()}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-emerald-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <FormModal
          mode={modalMode}
          type={activeTab}
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteDialog
          itemName={
            itemToDelete?.name ||
            itemToDelete?.slno ||
            itemToDelete?.serialNo ||
            String(itemToDelete?.id ?? "")
          }
          type={activeTab}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteDialog(false);
            setItemToDelete(null);
          }}
          isDeleting={isLoading}
        />
      )}
    </div>
  );
}

// Delete Dialog Component
function DeleteDialog({
  itemName,
  type,
  onConfirm,
  onClose,
  isDeleting,
}: {
  itemName: string;
  type: string;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">
                Delete Confirmation
              </h3>
              <p className="text-sm text-red-100 mt-0.5">
                This action cannot be undone
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-900">
              Are you sure you want to delete this {type.slice(0, -1)}?
            </p>
            <p className="text-sm font-semibold text-red-900 mt-2">
              {itemName}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                This will permanently delete the item from the database. This action cannot be reversed.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// Helper function to convert date from DD/MM/YYYY or other formats to YYYY-MM-DD for input[type="date"]
function formatDateForInput(dateString: string): string {
  if (!dateString) return "";
  
  try {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Handle DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse as ISO date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Error formatting date:', e);
  }
  
  return "";
}

// Helper function to convert date to DD/MM/YYYY format for display in tables
function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "-";
  
  try {
    // Handle YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Handle DD/MM/YYYY format (already in correct format)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse as ISO date and convert
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    console.error('Error formatting date for display:', e);
  }
  
  return "-";
}

// Helper function to convert date to YYYY-MM-DD format for API
function formatDateForAPI(dateString: string): string {
  if (!dateString) return "";
  
  try {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Parse the date and convert to YYYY-MM-DD
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Error formatting date for API:', e);
  }
  
  return "";
}

// Form Modal Component
function FormModal({
  mode,
  type,
  initialData,
  onSave,
  onClose,
  isLoading,
}: {
  mode: "add" | "edit";
  type: TabType;
  initialData: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert all date fields to YYYY-MM-DD format before sending to API
    const processedData = { ...formData };
    
    // List of all date fields
    const dateFields = [
      'exp_Date', 'manufacturer_Date', // Chemicals
      'purchaseDate', 'warrenty_UOTO', 'amc_UPTO', 'cmc_UPTO',
      'calibrationDoneDate', 'calibrationDueDate', // Instruments
      'expDate', // Media
      'validity', // Standards <-- ADD THIS LINE
    ];
    
    dateFields.forEach(field => {
      if (processedData[field]) {
        processedData[field] = formatDateForAPI(processedData[field]);
      }
    });
    
    onSave(processedData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    if (type === "chemicals") {
      return (
        <>
          <FormField
            label="SL NO *"
            value={formData.slno || ""}
            onChange={(v) => handleChange("slno", v)}
            disabled={true}
            required
            isLocked={mode === "add"}
            helperText={mode === "add" ? "Auto-generated ID (locked)" : "Primary key (cannot be changed)"}
          />
          <FormField
            label="Name *"
            value={formData.name || ""}
            onChange={(v) => handleChange("name", v)}
            required
          />
          <FormField
            label="Code *"
            value={formData.code || ""}
            onChange={(v) => handleChange("code", v)}
            required
          />
          <FormField
            label="Make"
            value={formData.make || ""}
            onChange={(v) => handleChange("make", v)}
          />
          <FormField
            label="Part No"
            value={formData.part_No || ""}
            onChange={(v) => handleChange("part_No", v)}
          />
          <FormField
            label="Expiry Date"
            type="date"
            value={formatDateForInput(formData.exp_Date || "")}
            onChange={(v) => handleChange("exp_Date", v)}
          />
          <FormField
            label="Batch No"
            value={formData.batchNo || ""}
            onChange={(v) => handleChange("batchNo", v)}
          />
          <FormField
            label="Modular Height"
            value={formData.modular_Height || ""}
            onChange={(v) => handleChange("modular_Height", v)}
          />
          <FormField
            label="CAS No"
            value={formData.cas_No || ""}
            onChange={(v) => handleChange("cas_No", v)}
          />
          <FormField
            label="Manufacturer Date"
            type="date"
            value={formatDateForInput(formData.manufacturer_Date || "")}
            onChange={(v) => handleChange("manufacturer_Date", v)}
          />
          <FormField
            label="Pack Quantity"
            value={formData.packQuantity || ""}
            onChange={(v) => handleChange("packQuantity", v)}
          />
          <FormField
            label="Pack Unit"
            value={formData.packUnit || ""}
            onChange={(v) => handleChange("packUnit", v)}
          />
        </>
      );
    } else if (type === "instruments") {
      return (
        <>
          <FormField
            label="ID *"
            value={formData.id || ""}
            onChange={(v) => handleChange("id", v)}
            disabled={true}
            required
            isLocked={mode === "add"}
            helperText={mode === "add" ? "Auto-generated ID (locked)" : "Primary key (cannot be changed)"}
          />
          <FormField
            label="Name *"
            value={formData.name || ""}
            onChange={(v) => handleChange("name", v)}
            required
          />
          <FormField
            label="Serial No"
            value={formData.sl_No || ""}
            onChange={(v) => handleChange("sl_No", v)}
          />
          <FormField
            label="Make"
            value={formData.make || ""}
            onChange={(v) => handleChange("make", v)}
          />
          <FormField
            label="Instrument Tag"
            value={formData.instrumentTag || ""}
            onChange={(v) => handleChange("instrumentTag", v)}
          />
          <FormField
            label="Purchase Date"
            type="date"
            value={formatDateForInput(formData.purchaseDate || "")}
            onChange={(v) => handleChange("purchaseDate", v)}
          />
          <FormField
            label="Lab Name"
            value={formData.labName || ""}
            onChange={(v) => handleChange("labName", v)}
          />
          <FormField
            label="Warranty UPTO"
            type="date"
            value={formatDateForInput(formData.warrenty_UOTO || "")}
            onChange={(v) => handleChange("warrenty_UOTO", v)}
          />
          <FormField
            label="AMC UPTO"
            type="date"
            value={formatDateForInput(formData.amc_UPTO || "")}
            onChange={(v) => handleChange("amc_UPTO", v)}
          />
          <FormField
            label="CMC UPTO"
            type="date"
            value={formatDateForInput(formData.cmc_UPTO || "")}
            onChange={(v) => handleChange("cmc_UPTO", v)}
          />
          <FormField
            label="Calibration Done Date"
            type="date"
            value={formatDateForInput(formData.calibrationDoneDate || "")}
            onChange={(v) => handleChange("calibrationDoneDate", v)}
          />
          <FormField
            label="Calibration Due Date"
            type="date"
            value={formatDateForInput(formData.calibrationDueDate || "")}
            onChange={(v) => handleChange("calibrationDueDate", v)}
          />
          <FormField
            label="Calibration Agency"
            value={formData.calibrationAgency || ""}
            onChange={(v) => handleChange("calibrationAgency", v)}
          />
        </>
      );
    } else if (type === "media") {
      return (
        <>
          {mode === "edit" && (
            <FormField
              label="ID"
              value={formData.id !== undefined ? String(formData.id) : ""}
              onChange={() => {}}
              disabled={true}
              isLocked={true}
              helperText="Auto-generated by database"
            />
          )}
          <FormField
            label="Name *"
            value={formData.name || ""}
            onChange={(v) => handleChange("name", v)}
            required
          />
          <FormField
            label="Code"
            value={formData.code || ""}
            onChange={(v) => handleChange("code", v)}
          />
          <FormField
            label="Expiry Date"
            type="date"
            value={formatDateForInput(formData.expDate || "")}
            onChange={(v) => handleChange("expDate", v)}
          />
          <FormField
            label="Quantity Value"
            type="number"
            value={formData.quantityValue !== undefined && formData.quantityValue !== null ? String(formData.quantityValue) : ""}
            onChange={(v) => handleChange("quantityValue", v)}
          />
          <FormField
            label="Quantity Unit"
            value={formData.quantityUnit || ""}
            onChange={(v) => handleChange("quantityUnit", v)}
          />
        </>
      );
    } else {
      return (
        <>
          <FormField
            label="Serial No *"
            value={formData.serialNo || ""}
            onChange={(v) => handleChange("serialNo", v)}
            disabled={true}
            required
            isLocked={mode === "add"}
            helperText={mode === "add" ? "Auto-generated Serial No (locked)" : "Primary key (cannot be changed)"}
          />
          <FormField
            label="Name *"
            value={formData.name || ""}
            onChange={(v) => handleChange("name", v)}
            required
          />
          <FormField
            label="Batch No"
            value={formData.batchNo || ""}
            onChange={(v) => handleChange("batchNo", v)}
          />
          <FormField
            label="Make"
            value={formData.make || ""}
            onChange={(v) => handleChange("make", v)}
          />
          <FormField
            label="Purity"
            value={formData.purity || ""}
            onChange={(v) => handleChange("purity", v)}
          />
          <FormField
            label="Department"
            value={formData.department || ""}
            onChange={(v) => handleChange("department", v)}
          />
          <FormField
            label="Pack"
            value={formData.pack || ""}
            onChange={(v) => handleChange("pack", v)}
          />
          <FormField
            label="Unit Code"
            type="number"
            value={formData.unitCode || ""}
            onChange={(v) => handleChange("unitCode", v)}
          />
          <FormField
            label="Unit"
            value={formData.unit || ""}
            onChange={(v) => handleChange("unit", v)}
          />
          <FormField
            label="Validity"
            type="date"
            value={formatDateForInput(formData.validity || "")}
            onChange={(v) => handleChange("validity", v)}
          />
          <FormField
            label="Remarks"
            value={formData.remarks || ""}
            onChange={(v) => handleChange("remarks", v)}
          />
        </>
      );
    }
  };

  const getModalTitle = () => {
    const singularMap: Record<TabType, string> = {
      chemicals: "Chemical",
      instruments: "Instrument",
      standards: "Standard",
      media: "Media",
    };
    const typeLabel = singularMap[type];
    return mode === "add" ? `Add New ${typeLabel}` : `Edit ${typeLabel}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {mode === "add" ? (
                  <Plus className="w-6 h-6 text-white" />
                ) : (
                  <Edit2 className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {getModalTitle()}
                </h3>
                <p className="text-sm text-emerald-100 mt-0.5">
                  {mode === "add"
                    ? "Fill in the details below"
                    : "Update the information"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {renderFields()}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{mode === "add" ? "Add" : "Update"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Form Field Component with lock indicator
function FormField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  isLocked = false,
  helperText = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  isLocked?: boolean;
  helperText?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all ${
            disabled
              ? "bg-slate-100 text-slate-600 cursor-not-allowed border-slate-300"
              : "border-slate-200"
          } ${isLocked ? "pr-10" : ""}`}
        />
        {isLocked && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {isLocked && <Lock className="w-3 h-3" />}
          {helperText}
        </p>
      )}
    </div>
  );
}

// Chemicals Table - ALL COLUMNS
function ChemicalsTable({
  data,
  onEdit,
  onDelete,
}: {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <Beaker className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No chemicals found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              SL NO
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Make
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Part No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Expiry Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Batch No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Modular Height
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              CAS No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Manufacturer Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Pack Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Pack Unit
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase sticky right-0 bg-slate-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, idx) => (
            <tr
              key={item.slno}
              className={`hover:bg-emerald-50 transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                {item.slno}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-slate-900">
                {item.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.code || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.make || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.part_No || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.exp_Date)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.batchNo || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.modular_Height || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.cas_No || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.manufacturer_Date)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.packQuantity || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.packUnit || "-"}
              </td>
              <td className="px-4 py-3 text-right sticky right-0 bg-white">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Instruments Table - ALL COLUMNS
function InstrumentsTable({
  data,
  onEdit,
  onDelete,
}: {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No instruments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Serial No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Make
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Instrument Tag
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Purchase Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Lab Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Warranty UPTO
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              AMC UPTO
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              CMC UPTO
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Cal. Done Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Cal. Due Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Cal. Agency
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase sticky right-0 bg-slate-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className={`hover:bg-emerald-50 transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                {item.id}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-slate-900">
                {item.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.sl_No || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.make || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.instrumentTag || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.purchaseDate)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.labName || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.warrenty_UOTO)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.amc_UPTO)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.cmc_UPTO)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.calibrationDoneDate)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.calibrationDueDate)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.calibrationAgency || "-"}
              </td>
              <td className="px-4 py-3 text-right sticky right-0 bg-white">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Media Table
function MediaTable({
  data,
  onEdit,
  onDelete,
}: {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <TestTube2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No media found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Code</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Expiry Date</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Qty Value</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Qty Unit</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase sticky right-0 bg-slate-50">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className={`hover:bg-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-700">{item.id}</td>
              <td className="px-4 py-3 text-sm font-bold text-slate-900">{item.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.code || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{formatDateForDisplay(item.expDate)}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.quantityValue ?? "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.quantityUnit || "-"}</td>
              <td className="px-4 py-3 text-right sticky right-0 bg-white">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Standards Table - ALL COLUMNS
function StandardsTable({
  data,
  onEdit,
  onDelete,
}: {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <FlaskConical className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No standards found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Serial No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Batch No
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Make
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Purity
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Pack
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Unit Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Unit
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Validity
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
              Remarks
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase sticky right-0 bg-slate-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, idx) => (
            <tr
              key={item.serialNo}
              className={`hover:bg-emerald-50 transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                {item.serialNo}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-slate-900">
                {item.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.batchNo || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.make || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.purity || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.department || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.pack || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.unitCode !== null ? item.unitCode : "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.unit || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateForDisplay(item.validity)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {item.remarks || "-"}
              </td>
              <td className="px-4 py-3 text-right sticky right-0 bg-white">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}