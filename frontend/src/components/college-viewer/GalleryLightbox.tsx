import React from 'react';

interface GalleryLightboxProps {
    images: string[];
    selectedIndex: number;
    onClose: () => void;
    onChangeIndex: (index: number) => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
    images,
    selectedIndex,
    onClose,
    onChangeIndex,
}) => {
    return (
        <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors z-10"
            >
                ×
            </button>
            
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={images[selectedIndex]} 
                    alt={`Gallery ${selectedIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => onChangeIndex(
                                selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
                            )}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => onChangeIndex(
                                selectedIndex === images.length - 1 ? 0 : selectedIndex + 1
                            )}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                        >
                            →
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GalleryLightbox;
