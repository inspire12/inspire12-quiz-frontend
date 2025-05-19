import React, { useState } from 'react';

function parseQuizMd(md) {
  const blocks = md.split(/\n(?=\d+\. )/g).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const questionLine = lines[0];
    const choices = [];
    let answer = '';
    let explanation = '';
    let type = 'choice';
    for (let i = 1; i < lines.length; i++) {
      if (/^[A-D]\. /.test(lines[i])) {
        choices.push(lines[i]);
      } else if (lines[i].startsWith('정답:')) {
        answer = lines[i].replace('정답:', '').trim();
      } else if (lines[i].startsWith('해설:')) {
        explanation = lines[i].replace('해설:', '').trim();
      } else if (lines[i].includes('___') || lines[i].includes('□')) {
        type = 'blank';
      }
    }
    if (choices.length === 0) type = 'blank';
    return { question: questionLine, choices, answer, explanation, type };
  });
}

// md 파일에서 meta 정보 추출 (파일명 기반)
function extractMetaFromMd(file, md, group) {
  // 파일명에서 .md 제거
  const base = file.name.replace(/\.md$/, '');
  // 첫 줄이 # 제목이면 title, 아니면 파일명
  const firstLine = md.split('\n').map(l => l.trim()).find(Boolean) || '';
  let title = base;
  if (/^#/.test(firstLine)) {
    title = firstLine.replace(/^#+/, '').trim();
  }
  // description, extra는 비워두거나 자동 생성
  return {
    file: file.name,
    title,
    description: '',
    extra: '',
    group: group || '기타'
  };
}

export default function MdToJsonConverter() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [jsonPreview, setJsonPreview] = useState('');
  const [jsonFileName, setJsonFileName] = useState('');

  // 단일 파일 변환
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFiles([]);
    const text = await file.text();
    const json = parseQuizMd(text);
    setJsonPreview(JSON.stringify(json, null, 2));
    setJsonFileName(file.name.replace(/\.md$/, '.json'));
  };

  // json 다운로드 버튼
  const handleDownloadJson = () => {
    if (!jsonPreview || !jsonFileName) return;
    const blob = new Blob([jsonPreview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = jsonFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // json 복사 버튼
  const handleCopyJson = async () => {
    if (!jsonPreview) return;
    try {
      await navigator.clipboard.writeText(jsonPreview);
      alert('JSON이 복사되었습니다!');
    } catch {
      alert('복사 실패!');
    }
  };

  // 여러 파일 한 번에 변환 (meta.json도 생성)
  const handleMultiFiles = async (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setJsonPreview('');
    setJsonFileName('');
  };

  // 실행 버튼 클릭 시 실제 변환 및 다운로드
  const handleConvertAll = async () => {
    if (!selectedFiles.length) return;
    const metaArr = [];
    for (const file of selectedFiles) {
      const text = await file.text();
      const json = parseQuizMd(text);
      // json 파일 다운로드
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.md$/, '.json');
      a.click();
      URL.revokeObjectURL(url);
      // meta 정보 추출 (group명 입력)
      let group = window.prompt(`${file.name}의 그룹명을 입력하세요. (예: DB, 상식 등)`, '');
      if (!group) group = '기타';
      metaArr.push(extractMetaFromMd(file, text, group));
    }
    // meta.json 생성 및 다운로드
    const metaJson = { quizzes: metaArr };
    const metaBlob = new Blob([JSON.stringify(metaJson, null, 2)], { type: 'application/json' });
    const metaUrl = URL.createObjectURL(metaBlob);
    const a = document.createElement('a');
    a.href = metaUrl;
    a.download = 'meta.json';
    a.click();
    URL.revokeObjectURL(metaUrl);
  };

  return (
    <div className="main-container" style={{ maxWidth: 480, margin: '2rem auto', background: '#fff' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>MD → JSON 변환기</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <b>단일 변환:</b> 
          <input type="file" accept=".md" onChange={handleFile} />
        </label>
      </div>
      {jsonPreview && (
        <div style={{ width: '100%', marginBottom: 12 }}>
          <div style={{ fontSize: '0.97rem', color: '#333', marginBottom: 6 }}>
            변환 결과 미리보기
          </div>
          <textarea
            style={{ width: '100%', minHeight: 180, fontSize: '1rem', fontFamily: 'monospace', marginBottom: 8, resize: 'vertical' }}
            value={jsonPreview}
            readOnly
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button className="start-btn" style={{ minWidth: 90 }} onClick={handleCopyJson}>
              JSON 복사
            </button>
            <button className="start-btn" style={{ minWidth: 90 }} onClick={handleDownloadJson}>
              JSON 다운로드
            </button>
          </div>
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <b>여러 파일 한 번에 변환:</b> 
          <input type="file" accept=".md" multiple onChange={handleMultiFiles} />
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.97rem', color: '#333', marginBottom: 6 }}>
            선택된 파일: {selectedFiles.map(f => f.name).join(', ')}
          </div>
          <button className="start-btn" style={{ minWidth: 100 }} onClick={handleConvertAll}>
            실행 (변환 및 meta.json 생성)
          </button>
        </div>
      )}
      <p style={{ color: '#666', fontSize: '0.98rem' }}>
        md 파일을 업로드하면 json 파일로 변환되어 다운로드됩니다.<br />
        여러 개의 md 파일을 한 번에 선택해 변환할 수도 있습니다.<br />
        여러 파일 변환 시 meta.json도 자동 생성됩니다.
      </p>
    </div>
  );
} 