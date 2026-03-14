import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { CORE_10_ITEMS, VIDEOS } from './constants';
import { CheckCircle2, AlertCircle, Info, PlayCircle, RefreshCcw, ChevronRight } from 'lucide-react';
import { Score, VideoData } from './types';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(VIDEOS[0]);
  const [scores, setScores] = useState<Record<number, Score>>({});
  const [mode, setMode] = useState<'intro' | 'evaluate' | 'explain'>('intro');
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLElement>(null);

  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e: ReactMouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    if (Math.abs(walk) > 5) {
      e.preventDefault();
      scrollRef.current.scrollTop = scrollTop - walk;
    }
  };

  // Reset scores when video changes
  useEffect(() => {
    setScores({});
    setMode(prev => prev === 'intro' ? 'intro' : 'evaluate');
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [selectedVideo]);

  const handleScoreChange = (itemId: number, score: Score) => {
    setScores(prev => ({ ...prev, [itemId]: score }));
  };

  const isAllAnswered = CORE_10_ITEMS.every(item => scores[item.id] !== undefined && scores[item.id] !== null);

  const handleFinish = () => {
    setMode('explain');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setScores({});
    setMode('evaluate');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md shrink-0 z-30">
        <h1 className="text-lg md:text-xl font-bold text-center">食事介助スキル評価 (Core 10)</h1>
      </header>

      {/* Sticky Video Player - Hidden in intro mode */}
      {mode !== 'intro' && (
        <div className="shrink-0 z-20 bg-black shadow-lg border-b border-slate-800">
          <div className="relative w-full max-w-3xl mx-auto bg-black flex justify-center items-center h-[30vh] md:h-[40vh]">
            <video
              ref={videoRef}
              src={selectedVideo.src}
              className="w-full h-full object-contain"
              loop
              autoPlay
              muted
              playsInline
              controls
            >
              お使いのブラウザは動画タグをサポートしていません。
            </video>
          </div>
          {/* Video Selector */}
          <div className="bg-slate-900 p-3 flex justify-center gap-2 overflow-x-auto">
            {VIDEOS.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVideo(v)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedVideo.id === v.id 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <main 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        <div className="max-w-3xl mx-auto pb-20">
        {mode === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-500 mt-4 md:mt-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl shadow-lg text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-emerald-400 tracking-tight leading-snug">
                すべての食事支援に関わるプロフェッショナルへ
              </h2>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-4">
                本アプリは、食事介助の基本評価指標である「Core 10」を実践的に学ぶための学習ツールです。このアプリでは、これが完璧な正解であるという正解は示しておりません。
              </p>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium mb-8">
                なぜなら、患者さん一人ひとりの状態や環境によって、最適な食事支援の形は常に変化するからです。ここにある動画からの気づきを出発点とし、Core 10の基準を満たすだけでなく、その先にある<span className="text-emerald-300 font-bold">「目の前の方に寄り添った、さらに工夫を凝らした食事支援」</span>を皆様の手で探求し、実践していただきたいと願っています。
              </p>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 mb-8">
                <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" /> 参考動画リンク
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="https://www.youtube.com/watch?v=X7P_rAsfgT8" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline flex items-center gap-2 transition-colors">
                      <PlayCircle className="w-5 h-5" /> （１）Core 10とは
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/watch?v=avR3CxZt_D8" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline flex items-center gap-2 transition-colors">
                      <PlayCircle className="w-5 h-5" /> （２）Core 10解説
                    </a>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setMode('evaluate');
                  scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 rounded-xl font-bold text-lg bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                動画の評価に進む <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {mode === 'evaluate' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-emerald-600" />
                評価モード
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                上のループ動画を観察し、以下の「Core 10」の10項目について評価してください。
                すべての項目を評価すると、解説モードに進むことができます。
              </p>
            </div>

            <div className="space-y-5">
              {CORE_10_ITEMS.map((item, index) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                  <p className="font-medium text-slate-800 mb-4 text-base md:text-lg leading-relaxed">
                    <span className="text-emerald-600 font-black text-xl mr-2">Q{index + 1}.</span>
                    {item.text}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {[
                      { value: 2, label: 'できている', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 ring-blue-500' },
                      { value: 1, label: '不十分', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 ring-amber-500' },
                      { value: 0, label: 'できていない', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 ring-rose-500' },
                      { value: -1, label: '評価できない', color: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 ring-slate-500' }
                    ].map(option => {
                      const isSelected = scores[item.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleScoreChange(item.id, option.value as Score)}
                          className={`py-3 px-2 rounded-xl border-2 transition-all font-bold text-sm md:text-base ${
                            isSelected
                              ? `${option.color.split(' ')[0]} ${option.color.split(' ')[1]} ${option.color.split(' ')[4]} ring-2 ring-offset-2 border-transparent`
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 pb-12">
              <button
                onClick={handleFinish}
                disabled={!isAllAnswered}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isAllAnswered
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isAllAnswered ? '評価を終了して解説を見る' : 'すべての項目を評価してください'}
                {isAllAnswered && <ChevronRight className="w-6 h-6" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'explain' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-emerald-50 p-5 rounded-2xl shadow-sm border border-emerald-200 flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-emerald-800 mb-2">評価完了・解説モード</h2>
                <p className="text-sm md:text-base text-emerald-700 leading-relaxed">
                  お疲れ様でした。各項目の解説と、食事介助で注意したい「15のポイント」との関連を確認しましょう。動画は引き続き上で確認できます。
                </p>
              </div>
            </div>

            <div className="bg-rose-50 p-5 md:p-6 rounded-2xl shadow-sm border border-rose-200">
              <h3 className="text-lg md:text-xl font-bold text-rose-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                この動画（{selectedVideo.title}）の具体的な問題点
              </h3>
              <p className="text-sm md:text-base text-rose-900 leading-relaxed whitespace-pre-wrap">
                {selectedVideo.explanation}
              </p>
            </div>

            <div className="space-y-6">
              {CORE_10_ITEMS.map((item, index) => {
                const score = scores[item.id];
                return (
                  <div key={item.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <h3 className="font-bold text-slate-800 text-base md:text-lg leading-relaxed flex-1">
                        <span className="text-emerald-600 font-black text-xl mr-2">Q{index + 1}.</span>
                        {item.text}
                      </h3>
                      <div className={`shrink-0 self-start px-4 py-1.5 rounded-full text-sm font-bold border ${
                        score === 2 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        score === 1 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        score === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        あなたの評価: {score === 2 ? 'できている' : score === 1 ? '不十分' : score === 0 ? 'できていない' : '評価できない'}
                      </div>
                    </div>

                    {selectedVideo.itemExplanations?.[item.id] && (
                      <div className="bg-rose-50 p-4 md:p-5 rounded-xl mb-4 text-sm md:text-base text-rose-900 leading-relaxed border border-rose-200">
                        <p className="flex items-center gap-2 font-bold text-rose-800 mb-3">
                          <AlertCircle className="w-5 h-5 text-rose-600" /> この動画での具体的な問題点
                        </p>
                        <p>{selectedVideo.itemExplanations[item.id]}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 p-4 md:p-5 rounded-xl mb-4 text-sm md:text-base text-slate-700 leading-relaxed border border-slate-200">
                      <p className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                        <Info className="w-5 h-5 text-emerald-600" /> Core 10 解説
                      </p>
                      {score === -1 && (
                        <p className="mb-3 font-bold text-slate-600 bg-slate-200 p-3 rounded-lg">
                          ※この画像（動画）では見えない・確認できませんが、本来は以下の状態が望ましいです。
                        </p>
                      )}
                      <p>{item.explanation}</p>
                    </div>

                    {item.related15Points.length > 0 && (
                      <div className="bg-orange-50 p-4 md:p-5 rounded-xl text-sm md:text-base text-orange-900 border border-orange-200">
                        <p className="flex items-center gap-2 font-bold mb-3">
                          <AlertCircle className="w-5 h-5 text-orange-600" /> 15のポイント関連
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-1">
                          {item.related15Points.map((pt, i) => (
                            <li key={i} className="font-medium">{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-8 pb-12">
              <button
                onClick={handleReset}
                className="w-full py-4 rounded-2xl font-bold text-lg bg-slate-800 text-white shadow-lg hover:bg-slate-700 active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                もう一度評価する
              </button>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
