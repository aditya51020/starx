import { Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ImageUpload({ form, errors, imageInput, setImageInput, handleFileUpload, handleAddImage, handleRemoveImage }) {
    const [isDragging, setIsDragging] = useState(false);

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload({ target: { files } });
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#FFFDF0] rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Property Images</h2>
                    <p className="text-sm text-gray-600">Upload or add image URLs</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Media (Images & Videos)
                </label>
                <div className="flex items-center gap-4 mb-4">
                    <label
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`flex-1 flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition ${isDragging ? 'border-[#D4AF37] bg-[#FFFDF0]' : errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                            <p className="text-sm font-medium text-gray-700">
                                {isDragging ? 'Drop media here' : 'Click or Drag images/videos here'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP, MP4</p>
                        </div>
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                    </label>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Or Add Image URL
                </label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageInput}
                        onChange={e => setImageInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#C5A059] transition flex items-center gap-2 font-semibold"
                    >
                        <Plus className="w-5 h-5" /> Add
                    </button>
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            </div>

            {/* Image Preview Grid */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Images ({form.images.length})
                </label>
                {form.images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No images added yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {form.images.map((img, index) => (
                            <div key={index} className="relative group">
                                {img.match(/\.(mp4|webm|mov)$/i) ? (
                                    <video
                                        src={img}
                                        className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={img}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400x300?text=Invalid+URL';
                                        }}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-sm z-10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                    #{index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
