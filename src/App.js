import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze file');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const filename = `genome_report_${file.name.replace(/\.txt$/, '')}.txt`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setResponseText(`✅ Genome report downloaded: ${filename}`);
    } catch (err) {
      setResponseText('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h2>🧬 Upload your 23andMe file</h2>
      <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>Upload & Analyze</button>

      {responseText && (
        <pre style={{ background: '#eee', padding: 20, marginTop: 20 }}>{responseText}</pre>
      )}

    </div>
  );
}

export default App;