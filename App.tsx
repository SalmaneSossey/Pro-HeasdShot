import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2, Download, AlertCircle, Image as ImageIcon, CheckCircle2, User, RefreshCw, Briefcase, Zap } from 'lucide-react';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateProImage } from './services/geminiService';
import { PresetPrompt } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(PresetPrompt.LINKEDIN);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size too large. Please upload an image under 10MB.");
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      setResultImage(null); // Reset result on new upload

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 10MB.");
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResultImage(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !imagePreview) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Use custom prompt if selected, otherwise use the preset
      const finalPrompt = customPrompt.trim() !== "" && prompt === "custom" 
        ? customPrompt 
        : (prompt === "custom" ? "Make this image look professional" : prompt);

      const result = await generateProImage(
        imagePreview,
        selectedFile.type,
        finalPrompt
      );
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate image. Please try again with a clear photo or different prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `pro-headshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Input */}
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Turn your selfie into a <span className="text-blue-500">Pro Profile Pic</span>
              </h2>
              <p className="text-slate-400">
                Upload a casual photo and let our AI transform it into a professional LinkedIn headshot in seconds.
              </p>
            </div>

            {/* Upload Area */}
            <div 
              className={`
                relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 group cursor-pointer
                ${imagePreview ? 'border-slate-700 bg-slate-900/50' : 'border-slate-700 hover:border-blue-500 hover:bg-slate-900'}
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
              `}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {imagePreview ? (
                <div className="relative w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden bg-slate-950">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors text-slate-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Click or drag image here</h3>
                  <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Prompt Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Choose Style</label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setPrompt(PresetPrompt.LINKEDIN)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${prompt === PresetPrompt.LINKEDIN ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <Briefcase className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Standard LinkedIn</span>
                </button>

                <button 
                  onClick={() => setPrompt(PresetPrompt.CASUAL_BUSINESS)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${prompt === PresetPrompt.CASUAL_BUSINESS ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Casual Business</span>
                </button>

                <button 
                  onClick={() => setPrompt(PresetPrompt.TECH_STARTUP)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${prompt === PresetPrompt.TECH_STARTUP ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <Zap className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Tech Startup</span>
                </button>

                <button 
                  onClick={() => setPrompt("custom")}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${prompt === "custom" ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <Wand2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Custom Prompt</span>
                </button>
              </div>

              {prompt === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="E.g. Make me look like a cyberpunk character, or remove the background..."
                    className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder:text-slate-600"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={!imagePreview || isProcessing}
              className={`
                sticky bottom-6 w-full py-4 px-6 rounded-xl font-semibold text-white shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                ${!imagePreview || isProcessing 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500 shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:shadow-blue-500/40'}
              `}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Professional Headshot
                </>
              )}
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col gap-6">
            <div className="lg:sticky lg:top-24 space-y-6">
               <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-blue-400" />
                 Result
               </h3>

               <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
                 {isProcessing ? (
                   <LoadingSpinner size={48} text="Gemini is analyzing and redrawing your image..." className="z-10" />
                 ) : resultImage ? (
                   <div className="relative w-full h-full group">
                     <img 
                       src={resultImage} 
                       alt="Generated Result" 
                       className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-500" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <button
                          onClick={downloadImage}
                          className="w-full py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Download className="w-5 h-5" />
                          Download Image
                        </button>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center p-8 max-w-sm">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-slate-600" />
                      </div>
                      <h4 className="text-slate-300 font-medium mb-2">No result yet</h4>
                      <p className="text-sm text-slate-500">Upload an image and click generate to see the magic happen.</p>
                   </div>
                 )}
               </div>
               
               {resultImage && (
                 <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-green-500" />
                   <div>
                     <p className="text-green-200 font-medium text-sm">Generation Successful!</p>
                     <p className="text-green-200/60 text-xs">Image generated using Gemini 2.5 Flash Image.</p>
                   </div>
                 </div>
               )}

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tips for best results</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      Use a photo with good lighting (not too dark).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      Ensure your face is clearly visible and unobstructed.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      Looking directly at the camera works best.
                    </li>
                  </ul>
                </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;