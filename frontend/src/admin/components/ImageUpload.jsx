import { Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export default function ImageUpload({
    form,
    errors,
    imageInput,
    setImageInput,
    handleFileUpload,
    handleAddImage,
    handleRemoveImage
}) {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Property Images</h2>
                    <p className="text-sm text-gray-600">Add image URLs</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Images (From Device)
                </label>
                <div className="flex items-center gap-4 mb-4">
                    <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload images</p>
                        </div>
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Or Add Image URL
                </label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageInput}
                        onChange={e => setImageInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
                    >
                        <Plus className="w-5 h-5" /> Add
                    </button>
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Use Unsplash for high-quality images
                </p>
            </div>

            {/* Image Preview Grid */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Images ({form.images.length})
                </label>
                {form.images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No images added yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {form.images.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/400x300?text=Invalid+URL';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
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
