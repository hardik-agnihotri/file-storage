import React, { useRef } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { useChunkUpload } from './hooks/useChunkUpload';
import { AuthGate } from './components/AuthGate';
import './components/Dashboard.css';

function MainDriveDashboard() {
  const { user, executeLogout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadLargeFile, isUploading, progress } = useChunkUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const targetFile = e.target.files[0];

    try {
      await uploadLargeFile(targetFile);
      alert(`🎉 Success! ${targetFile.name} chunked and uploaded seamlessly.`);
    } catch (err) {
      alert('Upload pipeline failure.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header-bar">
        <div className="brand-title">Storage Cloud</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontWeight: 600 }}>Hello, {user?.firstName}</span>
          <button 
            className="action-btn" 
            style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--color-border)' }}
            onClick={executeLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="workspace-view">
        <div className="upload-card-wrapper" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} className="hidden-file-input" onChange={handleFileChange} />
          <h3>Drag and drop assets or click here to upload</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Fully automated direct-to-storage multipart chunking framework.
          </p>
          <button className="action-btn" disabled={isUploading}>
            {isUploading ? 'Streaming Binary Packets...' : 'Select File'}
          </button>

          {isUploading && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uploading: {progress}%</p>
              <div className="progress-track-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Global Orchestrating Root Wrapper
export default function App() {
  return (
    <AuthProvider>
      <InnerAppGuard />
    </AuthProvider>
  );
}

function InnerAppGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 600 }}>Loading Cloud Infrastructure...</div>;
  
  // If user is unauthenticated, redirect them automatically to the Auth screen layout gate
  if (!isAuthenticated) return <AuthGate />;

  return <MainDriveDashboard />;
}