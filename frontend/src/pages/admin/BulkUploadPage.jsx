import React, { useState } from 'react';
import API from '../../services/api';
import { 
    FaCloudUploadAlt, 
    FaFileCsv, 
    FaDownload, 
    FaRegFileArchive, 
    FaDatabase, 
    FaGoogleDrive, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaTimesCircle, 
    FaArrowLeft, 
    FaInfoCircle 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BulkUploadPage = () => {
    // CSV State
    const [csvFile, setCsvFile] = useState(null);
    const [csvUploading, setCsvUploading] = useState(false);
    const [csvMessage, setCsvMessage] = useState('');
    const [csvDetails, setCsvDetails] = useState({ created: 0, updated: 0, errors: [] });

    // ZIP State
    const [zipFile, setZipFile] = useState(null);
    const [storageOption, setStorageOption] = useState('local'); // 'local' or 'google-drive'
    const [zipUploading, setZipUploading] = useState(false);
    const [zipMessage, setZipMessage] = useState('');
    const [zipDetails, setZipDetails] = useState(null); // { successCount, skippedCount, results: [] }

    const handleCsvFileChange = (e) => {
        setCsvFile(e.target.files[0]);
        setCsvMessage('');
        setCsvDetails({ created: 0, updated: 0, errors: [] });
    };

    const handleZipFileChange = (e) => {
        setZipFile(e.target.files[0]);
        setZipMessage('');
        setZipDetails(null);
    };

    // Handle CSV Product Upload
    const handleCsvUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) return;

        const formData = new FormData();
        formData.append('file', csvFile);

        setCsvUploading(true);
        setCsvMessage('');
        setCsvDetails({ created: 0, updated: 0, errors: [] });

        try {
            const { data } = await API.post('/products/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setCsvMessage(`CSV processed successfully!`);
            setCsvDetails({
                created: data.createdCount || 0,
                updated: data.updatedCount || 0,
                errors: data.errors || [],
            });
        } catch (error) {
            setCsvMessage(error.response?.data?.message || 'CSV Import Failed');
        } finally {
            setCsvUploading(false);
        }
    };

    // Handle ZIP Images Upload
    const handleZipUpload = async (e) => {
        e.preventDefault();
        if (!zipFile) return;

        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('storageOption', storageOption);

        setZipUploading(true);
        setZipMessage('');
        setZipDetails(null);

        try {
            const { data } = await API.post('/products/import-zip', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setZipMessage(`ZIP images processed!`);
            setZipDetails({
                successCount: data.successCount || 0,
                skippedCount: data.skippedCount || 0,
                results: data.results || []
            });
        } catch (error) {
            setZipMessage(error.response?.data?.message || 'ZIP Upload Failed');
        } finally {
            setZipUploading(false);
        }
    };

    // Export CSV
    const handleExport = async () => {
        try {
            const response = await API.get('/products/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products_catalog_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Export Failed');
        }
    };

    // Download Sample CSV Template
    const handleDownloadSample = async () => {
        try {
            const response = await API.get('/products/sample-csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products_import_sample.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Failed to download sample CSV');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bulk Catalog Operations</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Upload inventory spreadsheets, map models, and batch upload image assets with automated slug-matching.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition duration-200"
                >
                    <FaDownload /> Export Active Products
                </button>
            </div>

            {/* Main Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Spreadsheets Upload Panel --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between h-fit">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <FaFileCsv size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">1. Product CSV Upload</h2>
                            </div>
                            <button
                                onClick={handleDownloadSample}
                                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold underline transition"
                            >
                                <FaDownload /> Sample CSV Template
                            </button>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-xl">
                            <div className="flex gap-2.5">
                                <FaInfoCircle className="text-blue-500 mt-0.5" size={16} />
                                <div className="text-xs text-blue-800 space-y-1">
                                    <p className="font-bold">Model Mapping Verification:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>Models are <strong>strictly required</strong> for categories: <em>Parts, Cases, Laptop Parts</em>.</li>
                                        <li>Models can be left blank for generic categories: <em>Accessories, Chargers</em>.</li>
                                        <li>Missing Categories, Subcategories, Brands, and Models are created dynamically!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleCsvUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCsvFileChange}
                                    className="hidden"
                                    id="csvInput"
                                />
                                <label htmlFor="csvInput" className="cursor-pointer block">
                                    <FaCloudUploadAlt className="mx-auto text-indigo-400 mb-3" size={48} />
                                    <span className="text-slate-700 font-bold block text-sm">
                                        {csvFile ? csvFile.name : 'Choose product list CSV'}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1 block">
                                        {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Spreadsheets in CSV format only'}
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!csvFile || csvUploading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {csvUploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Analyzing and Importing...</span>
                                    </>
                                ) : (
                                    <span>Validate and Upload Catalog</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results / Details section */}
                    {csvMessage && (
                        <div className="mt-8 border border-slate-100 rounded-2xl p-6 bg-slate-50">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                                <FaCheckCircle size={20} />
                                <span className="text-sm">{csvMessage}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center">
                                    <span className="text-xs text-slate-500 font-medium block">Products Created</span>
                                    <span className="text-2xl font-black text-indigo-600 mt-1 block">{csvDetails.created}</span>
                                </div>
                                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center">
                                    <span className="text-xs text-slate-500 font-medium block">Products Updated</span>
                                    <span className="text-2xl font-black text-emerald-600 mt-1 block">{csvDetails.updated}</span>
                                </div>
                            </div>

                            {csvDetails.errors && csvDetails.errors.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 text-amber-600 font-bold mb-2 text-xs uppercase tracking-wider">
                                        <FaExclamationTriangle />
                                        <span>Warnings & Skipped Rows ({csvDetails.errors.length})</span>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto border border-amber-100 rounded-xl p-3 bg-amber-50/50 space-y-1.5 scrollbar-thin">
                                        {csvDetails.errors.map((err, i) => (
                                            <p key={i} className="text-xs text-amber-800 font-medium leading-relaxed">
                                                • {err}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- ZIP Image Matching Panel --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between h-fit">
                    <div>
                        <div className="flex items-center gap-3 text-purple-600 mb-6">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <FaRegFileArchive size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">2. Zip Images Bulk Upload</h2>
                        </div>

                        {/* Storage Options Selection Cards */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                                Storage Output Destination
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setStorageOption('local')}
                                    className={`flex items-center gap-3 border p-4 rounded-xl text-left transition duration-150 ${storageOption === 'local' ? 'border-purple-600 bg-purple-50/30 text-purple-900 ring-2 ring-purple-100' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <FaDatabase size={20} className={storageOption === 'local' ? 'text-purple-600' : 'text-slate-400'} />
                                    <div>
                                        <span className="font-bold text-sm block">Local Storage</span>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">Saves to backend server</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setStorageOption('google-drive')}
                                    className={`flex items-center gap-3 border p-4 rounded-xl text-left transition duration-150 ${storageOption === 'google-drive' ? 'border-purple-600 bg-purple-50/30 text-purple-900 ring-2 ring-purple-100' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <FaGoogleDrive size={20} className={storageOption === 'google-drive' ? 'text-purple-600' : 'text-slate-400'} />
                                    <div>
                                        <span className="font-bold text-sm block">Google Drive</span>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">Saves to drive folder</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-xl">
                            <div className="flex gap-2.5">
                                <FaInfoCircle className="text-purple-500 mt-0.5" size={16} />
                                <div className="text-xs text-purple-800 space-y-1">
                                    <p className="font-bold">Automated Image Matching:</p>
                                    <p className="leading-relaxed">
                                        The system extracts files from your ZIP archive and matches each image file with products by searching for a matching <strong>product slug</strong> (e.g., matching image <code>samsung-galaxy-s21-screen.jpg</code> with product slug <code>samsung-galaxy-s21-screen</code>).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleZipUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleZipFileChange}
                                    className="hidden"
                                    id="zipInput"
                                />
                                <label htmlFor="zipInput" className="cursor-pointer block">
                                    <FaCloudUploadAlt className="mx-auto text-purple-400 mb-3" size={48} />
                                    <span className="text-slate-700 font-bold block text-sm">
                                        {zipFile ? zipFile.name : 'Choose compressed images ZIP'}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1 block">
                                        {zipFile ? `${(zipFile.size / 1024 / 1024).toFixed(2)} MB` : 'Files in ZIP archive only'}
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!zipFile || zipUploading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-bold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {zipUploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Extracting & Uploading Zip...</span>
                                    </>
                                ) : (
                                    <span>Validate and Upload Assets</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Zip Upload Results */}
                    {zipMessage && zipDetails && (
                        <div className="mt-8 border border-slate-100 rounded-2xl p-6 bg-slate-50">
                            <div className="flex items-center gap-2 text-purple-600 font-bold mb-4">
                                <FaCheckCircle size={20} />
                                <span className="text-sm">{zipMessage}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center">
                                    <span className="text-xs text-slate-500 font-medium block">Successfully Matched</span>
                                    <span className="text-2xl font-black text-purple-600 mt-1 block">{zipDetails.successCount}</span>
                                </div>
                                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center">
                                    <span className="text-xs text-slate-500 font-medium block">Skipped/No Match</span>
                                    <span className="text-2xl font-black text-slate-600 mt-1 block">{zipDetails.skippedCount}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                                    Extraction matching log
                                </span>
                                <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-xl bg-white divide-y divide-slate-100 scrollbar-thin">
                                    {zipDetails.results.map((res, index) => (
                                        <div key={index} className="p-3 flex items-start gap-2.5 text-xs">
                                            {res.status === 'success' ? (
                                                <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={14} />
                                            ) : res.status === 'warning' ? (
                                                <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={14} />
                                            ) : (
                                                <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" size={14} />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-slate-700 truncate">{res.file}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{res.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 border-t border-slate-100 pt-6">
                <Link 
                    to="/admin/products" 
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-semibold transition"
                >
                    <FaArrowLeft /> Back to Product Catalog
                </Link>
            </div>
        </div>
    );
};

export default BulkUploadPage;
