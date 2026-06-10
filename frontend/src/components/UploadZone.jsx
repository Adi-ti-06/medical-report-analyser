import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, X, AlertCircle, CheckCircle } from 'lucide-react'

export default function UploadZone({ type, onFileSelect, selectedFile, isLoading }) {
  const [dragError, setDragError] = useState('')

  const isPdf = type === 'report'
  const accept = isPdf
    ? { 'application/pdf': ['.pdf'] }
    : {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
        'image/gif': ['.gif'],
      }

  const onDrop = useCallback((accepted, rejected) => {
    setDragError('')
    if (rejected.length > 0) {
      const ext = rejected[0]?.file?.name?.split('.').pop()?.toLowerCase()
      if (ext === 'dcm' || ext === 'dicom') {
        setDragError('DICOM files are not supported. Please export your X-ray as a JPG or PNG from your hospital app first.')
      } else {
        setDragError(isPdf ? 'Only PDF files are accepted.' : 'Only image files (JPG, PNG, WebP) are accepted.')
      }
      return
    }
    if (accepted.length > 0) onFileSelect(accepted[0])
  }, [isPdf, onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, maxFiles: 1, disabled: isLoading,
  })

  const removeFile = (e) => {
    e.stopPropagation()
    onFileSelect(null)
    setDragError('')
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : dragError
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-white/15 bg-white/3 hover:border-indigo-500/50 hover:bg-indigo-500/5'
          }
          ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex items-center justify-center gap-4">
            <div className={`p-3 rounded-xl ${isPdf ? 'bg-red-500/20' : 'bg-indigo-500/20'}`}>
              {isPdf
                ? <FileText className="w-8 h-8 text-red-400" />
                : <Image className="w-8 h-8 text-indigo-400" />
              }
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{selectedFile.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">{formatSize(selectedFile.size)}</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Ready to analyze
              </p>
            </div>
            {!isLoading && (
              <button
                onClick={removeFile}
                className="p-2 rounded-full hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-colors ${isDragActive ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
              {isDragActive
                ? <Upload className="w-10 h-10 text-indigo-400" />
                : isPdf
                ? <FileText className="w-10 h-10 text-slate-500" />
                : <Image className="w-10 h-10 text-slate-500" />
              }
            </div>
            <div>
              <p className="font-semibold text-slate-300">
                {isDragActive ? 'Drop it here!' : `Drag & drop your ${isPdf ? 'PDF report' : 'medical image'}`}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                or <span className="text-indigo-400 font-medium">click to browse</span>
              </p>
            </div>
            <p className="text-xs text-slate-600">
              {isPdf ? 'PDF files up to 32MB' : 'JPG, PNG, WebP up to 20MB'}
            </p>
          </div>
        )}
      </div>

      {dragError && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{dragError}</span>
        </div>
      )}
    </div>
  )
}
