import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Microscope, Dna, Activity, FileText, Droplet, Pill, TestTubes,
  CheckCircle2, XCircle, AlertCircle, Info, ChevronRight, RotateCcw,
  Check, Fingerprint, ScanEye, BadgeCheck, FileWarning, Search,
  Briefcase, ShieldAlert, Crosshair, Map, Radar, Target
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(0);

  // States Interaksi Simulasi
  const [sampleStatus, setSampleStatus] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);

  const [activeProcess, setActiveProcess] = useState(null);
  const [visitedProcesses, setVisitedProcesses] = useState([]);

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [interpStatus, setInterpStatus] = useState(null);

  // States Khusus Post-Test
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);

  // Data Soal Post-Test
  const postTestQuestions = [
    {
      q: '"Apa itu HPV?", tipe HPV risiko tinggi seperti tipe 16 dan 18 dapat menyebabkan...',
      options: ['A. Kutil kelamin', 'B. Kanker, terutama kanker serviks', 'C. Infeksi saluran pernapasan', 'D. Ruam pada kulit tubuh'],
      answer: 1 // Index B
    },
    {
      q: 'Bagaimana cara penularan utama virus HPV menurut informasi?',
      options: ['A. Melalui udara dan bersin', 'B. Melalui makanan dan minuman yang terkontaminasi', 'C. Melalui kontak kulit-ke-kulit/intim, termasuk aktivitas seksual', 'D. Melalui gigitan serangga'],
      answer: 2 // Index C
    },
    {
      q: 'Berapa jumlah estimasi kasus kanker di seluruh dunia setiap tahun yang disebabkan oleh HPV berdasarkan hasil penelitian?',
      options: ['A. Sekitar 400.000 kasus', 'B. Sekitar 500.000 kasus', 'C. Sekitar 630.000 kasus', 'D. Sekitar 1.000.000 kasus'],
      answer: 2 // Index C
    },
    {
      q: 'Berikut ini adalah beberapa jenis penyakit/kanker yang berhubungan dengan HPV yang disebutkan dalam poster, kecuali...',
      options: ['A. Kanker serviks', 'B. Kanker orofaring', 'C. Kutil kelamin', 'D. Kanker paru-paru'],
      answer: 3 // Index D
    },
    {
      q: 'Berapa usia yang direkomendasikan untuk menerima vaksinasi HPV (dan dapat dilanjutkan hingga usia 26 tahun)?',
      options: ['A. Usia 5–8 tahun', 'B. Usia 9–14 tahun', 'C. Usia 15–18 tahun', 'D. Usia 20–25 tahun'],
      answer: 1 // Index B
    }
  ];

  // Navigasi
  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };

  const resetApp = () => {
    setStep(0);
    setSampleStatus(null);
    setTargetStatus(null);
    setActiveProcess(null);
    setVisitedProcesses([]);
    setIsResultOpen(false);
    setInterpStatus(null);
    setErrorId(null);

    // Reset Quiz
    setQuizStarted(false);
    setQuizStep(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setQuizShowFeedback(false);
  };

  const handleCheck = (isCorrect, id, setStatus) => {
    if (!isCorrect) {
      setErrorId(id);
      setStatus('error');
      setTimeout(() => setErrorId(null), 500);
    } else {
      setStatus('success');
      setErrorId(null);
    }
  };

  // DATA PROSES LAB
  const labProcesses = [
    {
      id: 1,
      icon: <TestTubes className="w-8 h-8" />,
      title: '1. Swab Serviks (Preparasi)',
      desc: 'Pengamanan Barang Bukti: Sampel usapan serviks diterima oleh lab forensik medis. Di tahap ini, ATLM memastikan identitas pada sampel cocok dengan berkas pasien (chain of custody). Sampel wajib dijaga pada suhu dingin (2–8°C) agar "jejak pelaku" (DNA virus) tidak rusak atau hilang sebelum dianalisis.'
    },
    {
      id: 2,
      icon: <Fingerprint className="w-8 h-8" />,
      title: '2. Ekstraksi DNA',
      desc: 'Isolasi & Pemurnian Petunjuk: Tahap ini ibarat mencari sidik jari di TKP. Sel-sel sampel akan dipecah menggunakan reagen kimia khusus (lisis). Kotoran sel seperti protein dan lemak dibuang, menyisakan cairan murni yang hanya berisi untaian DNA, siap untuk diinvestigasi.'
    },
    {
      id: 3,
      icon: <Target className="w-8 h-8" />,
      title: '3. Amplifikasi (PCR)',
      desc: 'Penggandaan Jejak: Jumlah DNA target dari pelaku (HPV) di TKP seringkali terlalu sedikit. Mesin PCR digunakan untuk menggandakan bagian spesifik dari DNA pelaku hingga jutaan kali lipat melalui siklus pemanasan dan pendinginan, agar wujud pelaku terlihat jelas.'
    },
    {
      id: 4,
      icon: <Radar className="w-8 h-8" />,
      title: '4. Deteksi Real-Time',
      desc: 'Pelacakan Radar Aktif: Bersamaan dengan penggandaan, mesin menembakkan sinar optik. Jika DNA pelaku ada, pelacak berpendar (probe fluoresensi) akan menyala. Sensor mesin menangkap pendaran ini secara langsung (real-time). Jika cahaya melewati ambang batas, radar memastikan pelaku ada di lokasi.'
    },
    {
      id: 5,
      icon: <Briefcase className="w-8 h-8" />,
      title: '5. Output Hasil',
      desc: 'Penyusunan Berkas Perkara: Sebelum mencetak hasil akhir, ATLM (Investigator) wajib memvalidasi kurva grafik untuk menyingkirkan kemungkinan alarm palsu (false positive). Setelah dipastikan akurat, laporan resmi dirilis: apakah pasien positif terinfeksi HPV tipe risiko tinggi atau tidak.'
    }
  ];

  const handleProcessClick = (id) => {
    setActiveProcess(id);
    if (!visitedProcesses.includes(id)) {
      setVisitedProcesses([...visitedProcesses, id]);
    }
  };

  // Efek Confetti untuk Skor Kuis Bagus
  useEffect(() => {
    if (step === 7 && quizStarted && quizStep === 5 && quizScore >= 3) {
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 }, colors: ['#eab308', '#3b82f6', '#10b981'] });
    }
  }, [step, quizStarted, quizStep, quizScore]);

  // Komponen Jendela Utama (Forensic Tablet UI)
  const WindowFrame = ({ children, title = "", stepNum }) => (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
      className="bg-[#0b1221]/90 backdrop-blur-2xl rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.7)] border border-slate-700/60 w-full max-w-4xl mx-auto overflow-hidden relative"
    >
      {/* Warning Tape Top */}
      <div className="h-2 w-full bg-amber-400 overflow-hidden relative flex items-center">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#000_15px,#000_30px)] opacity-40"></div>
      </div>

      {/* Header Panel */}
      <div className="bg-slate-900/90 px-6 py-4 flex items-center justify-between border-b border-slate-700/60">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-amber-400 text-xs font-mono tracking-[0.3em] font-bold">SYSTEM ACTIVE</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span className="text-center text-cyan-50 text-sm font-bold tracking-[0.2em] uppercase">{title}</span>
        </div>

        <div className="text-slate-500 text-xs font-mono bg-slate-800 px-3 py-1 rounded border border-slate-700">
          ATLM-ID: 9402
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-10 relative z-10">
        {/* Subtle grid and scanning line in the background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.4)] pointer-events-none z-0"
        ></motion.div>

        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 flex items-center justify-center p-4 md:p-8 overflow-hidden relative selection:bg-amber-500/30 selection:text-amber-200">

      {/* Animated Background Mesh - Forensic UV Light Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[45vw] h-[45vw] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[120px]" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-slate-800/20 rounded-full mix-blend-screen filter blur-[150px]"></div>
        {/* Grain Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <AnimatePresence mode="wait">

        {/* 1. Halaman Awal */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }} className="relative text-center w-full max-w-4xl mx-auto z-10 flex flex-col items-center">

            {/* Top Secret Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex items-center gap-3 bg-red-950/40 border border-red-900/50 px-6 py-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="text-red-400 text-sm font-bold tracking-[0.3em] uppercase">Confidential: ATLM Training Protocol</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none relative drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">LAB</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">INVESTIGATION</span>
            </h1>

            <div className="flex items-center gap-4 mb-10 bg-slate-900/50 px-6 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <p className="text-cyan-400 text-lg font-mono tracking-widest uppercase">Case File: #001</p>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>

            <p className="text-slate-300 mb-12 text-xl font-light max-w-2xl leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
              Penyelidikan kasus molekuler dimulai. Analisis bukti medis, telusuri jejak DNA tersangka, dan temukan pelakunya di dalam laboratorium.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="group relative inline-flex items-center justify-center gap-3 bg-amber-500 text-slate-900 px-12 py-5 rounded-lg font-black shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all overflow-hidden text-xl uppercase tracking-wider"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Briefcase className="w-6 h-6 relative z-10" />
              <span className="relative z-10 flex items-center gap-2">BUKA BERKAS KASUS <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
            </motion.button>

            {/* Fingerprint decoration */}
            <div className="absolute -bottom-20 -right-10 opacity-20 pointer-events-none">
              <Fingerprint className="w-64 h-64 text-cyan-500" />
            </div>
          </motion.div>
        )}

        {/* 2. Informasi Pasien */}
        {step === 1 && (
          <WindowFrame key="step1" title="Phase 1: Berkas Pasien">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-700/60 pb-6 mb-8 gap-4">
              <div>
                <h2 className="font-black text-3xl text-white mb-1 uppercase tracking-wide">Dossier Tersangka / Korban</h2>
                <p className="text-slate-400 font-mono text-sm">Analisis data medis dengan saksama untuk mencari petunjuk awal.</p>
              </div>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-2 rounded font-bold tracking-widest flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <FileWarning className="w-4 h-4" /> CASE #001
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10 relative">
              {/* Profile Card */}
              <div className="flex gap-5 items-center p-6 bg-slate-800/60 rounded-xl border-l-4 border-l-cyan-500 border border-slate-700/50 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-shadow">
                <div className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center text-3xl shrink-0 shadow-inner overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50"></div>
                  👩🏻
                </div>
                <div className="text-sm space-y-2 w-full font-mono text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/50 pb-1"><span className="text-cyan-500/80">Nama</span> <span className="font-bold text-white text-base">Ny. A</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1"><span className="text-cyan-500/80">Usia</span> <span className="text-white">28 Tahun</span></div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1"><span className="text-cyan-500/80">Gender</span> <span className="text-white">Perempuan</span></div>
                </div>
              </div>

              {/* Symptoms Card */}
              <div className="bg-red-950/30 p-6 rounded-xl border-l-4 border-l-red-500 border border-red-900/40 text-sm font-mono shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-shadow">
                <h3 className="font-bold mb-4 text-red-400 flex items-center gap-2 border-b border-red-900/50 pb-2 uppercase tracking-wider text-base">
                  <AlertCircle className="w-5 h-5" /> Keluhan Utama (Gejala)
                </h3>
                <ul className="space-y-3 text-red-200/90">
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Keputihan tidak normal</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Pendarahan pasca-sanggama</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Nyeri pada area genital</li>
                </ul>
              </div>

              {/* History Card */}
              <div className="bg-amber-950/30 p-6 rounded-xl border-l-4 border-l-amber-500 border border-amber-900/40 text-sm font-mono shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-shadow">
                <h3 className="font-bold mb-4 text-amber-400 flex items-center gap-2 border-b border-amber-900/50 pb-2 uppercase tracking-wider text-base">
                  <RotateCcw className="w-5 h-5" /> Riwayat Kasus
                </h3>
                <ul className="space-y-3 text-amber-200/90">
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div> Aktif seksual tanpa kontrasepsi</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div> Riwayat IMS: Negatif (-)</li>
                  <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div> Tes HPV sebelumnya: Negatif (-)</li>
                </ul>
              </div>

              {/* Request Card */}
              <div className="bg-cyan-950/30 p-6 rounded-xl border-l-4 border-l-cyan-500 border border-cyan-900/40 text-sm flex flex-col justify-center shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-shadow">
                <h3 className="font-bold mb-3 text-cyan-400 flex items-center gap-2 border-b border-cyan-900/50 pb-2 uppercase tracking-wider text-base">
                  <FileText className="w-5 h-5" /> Perintah Investigasi
                </h3>
                <p className="text-cyan-100 text-base leading-relaxed">
                  Lakukan Pemeriksaan Laboratorium Molekuler untuk melacak <strong className="text-cyan-300 border-b-2 border-cyan-400">Target: HPV DNA</strong>.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="bg-cyan-500 text-slate-900 px-10 py-4 rounded-lg font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all flex items-center gap-3 uppercase tracking-widest text-lg"
              >
                PROSES BERKAS <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 3. Pilih Sampel */}
        {step === 2 && (
          <WindowFrame key="step2" title="Phase 2: Pengumpulan Bukti">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <div className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">Tahap 1</div>
              <h2 className="font-black text-3xl text-white uppercase tracking-wide">Koleksi Spesimen</h2>
            </div>
            <p className="text-slate-300 mb-8 font-mono text-base bg-slate-800/50 p-4 rounded-lg border border-slate-700">Berdasarkan surat perintah investigasi, sampel (barang bukti) apa yang wajib diamankan dari TKP?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { id: 'darah', icon: <Droplet className="w-12 h-12 mb-4" />, label: 'Sampel Darah', isCorrect: false },
                { id: 'urin', icon: <TestTubes className="w-12 h-12 mb-4" />, label: 'Sampel Urin', isCorrect: false },
                { id: 'swab', icon: <Search className="w-12 h-12 mb-4" />, label: 'Swab Serviks', isCorrect: true }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  animate={errorId === item.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  onClick={() => handleCheck(item.isCorrect, item.id, setSampleStatus)}
                  className={`p-8 border-2 rounded-xl flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group font-mono shadow-lg
                    ${sampleStatus === 'success' && item.isCorrect ? 'border-emerald-500 bg-emerald-900/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      : errorId === item.id ? 'border-red-500 bg-red-900/40 text-red-400'
                        : sampleStatus === 'success' ? 'opacity-30 grayscale pointer-events-none border-slate-700 bg-slate-800/30'
                          : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:border-cyan-500/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-slate-300'}`}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    {item.icon}
                    <span className="font-bold text-lg uppercase tracking-wider">{item.label}</span>
                  </div>
                  {sampleStatus === 'success' && item.isCorrect && (
                    <div className="absolute top-4 right-4"><CheckCircle2 className="w-8 h-8 text-emerald-400" /></div>
                  )}
                  {/* Scanning line on hover */}
                  <div className="absolute inset-x-0 h-1 bg-cyan-500 top-0 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between items-center min-h-[5rem]">
              <AnimatePresence>
                {sampleStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 flex items-center gap-4 font-mono bg-red-950/60 px-6 py-4 rounded-lg border border-red-900/60 shadow-lg">
                    <XCircle className="w-8 h-8 shrink-0" />
                    <div><strong className="block text-white uppercase text-base">Bukti Ditolak</strong> <span className="text-sm">Sampel ini tidak sesuai dengan kasus yang sedang diselidiki.</span></div>
                  </motion.div>
                )}
                {sampleStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-400 font-mono bg-emerald-950/60 px-6 py-4 rounded-lg border border-emerald-900/60 flex items-center gap-4 shadow-lg">
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                    <div><strong className="text-white uppercase block text-base">Bukti Diverifikasi</strong> <span className="text-sm">Swab serviks adalah barang bukti utama untuk melacak HPV.</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                onClick={nextStep}
                disabled={sampleStatus !== 'success'}
                className={`px-10 py-4 rounded-lg font-bold ml-auto transition-all flex items-center gap-3 uppercase tracking-widest text-lg ${sampleStatus === 'success' ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
              >
                AMANKAN BUKTI <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 4. Target Pemeriksaan */}
        {step === 3 && (
          <WindowFrame key="step3" title="Phase 3: Profiling Tersangka">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <div className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">Tahap 2</div>
              <h2 className="font-black text-3xl text-white uppercase tracking-wide">Identifikasi Target</h2>
            </div>
            <p className="text-slate-300 mb-8 font-mono text-base bg-slate-800/50 p-4 rounded-lg border border-slate-700">Jejak biomolekuler apa yang secara spesifik harus dilacak oleh lab forensik dari bukti tersebut?</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { id: 'protein', icon: <Activity className="w-10 h-10 mb-3" />, label: 'Protein Virus' },
                { id: 'antibodi', icon: <ShieldAlert className="w-10 h-10 mb-3" />, label: 'Antibodi Pasien' },
                { id: 'dna', icon: <Dna className="w-10 h-10 mb-3" />, label: 'DNA Tersangka (HPV)', isCorrect: true },
                { id: 'darah', icon: <Droplet className="w-10 h-10 mb-3" />, label: 'Sel Darah Merah' }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  animate={errorId === item.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  onClick={() => handleCheck(item.isCorrect, item.id, setTargetStatus)}
                  className={`p-6 border-2 rounded-xl flex flex-col items-center justify-center gap-3 font-mono transition-all relative shadow-lg
                      ${targetStatus === 'success' && item.isCorrect ? 'border-emerald-500 bg-emerald-900/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : errorId === item.id ? 'border-red-500 bg-red-900/40 text-red-400'
                        : targetStatus === 'success' ? 'opacity-30 grayscale pointer-events-none border-slate-700 bg-slate-800/30'
                          : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:border-cyan-500/80 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-slate-300'}`}
                >
                  {item.icon}
                  <span className="text-center text-sm font-bold uppercase tracking-wide">{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between items-center min-h-[5rem]">
              <AnimatePresence>
                {targetStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 flex items-center gap-4 font-mono bg-red-950/60 px-6 py-4 rounded-lg border border-red-900/60 shadow-lg">
                    <XCircle className="w-8 h-8 shrink-0" />
                    <div><strong className="block text-white uppercase text-base">Profil Salah</strong> <span className="text-sm">Kita harus mencari cetak biru genetik pelakunya.</span></div>
                  </motion.div>
                )}
                {targetStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-400 font-mono bg-emerald-950/60 px-6 py-4 rounded-lg border border-emerald-900/60 flex items-center gap-4 shadow-lg">
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                    <div><strong className="text-white uppercase block text-base">Profil Terkunci</strong> <span className="text-sm">PCR forensik melacak jejak DNA secara spesifik.</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                onClick={nextStep}
                disabled={targetStatus !== 'success'}
                className={`px-10 py-4 rounded-lg font-bold ml-auto transition-all flex items-center gap-3 uppercase tracking-widest text-lg ${targetStatus === 'success' ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
              >
                MULAI PELACAKAN <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 5. Proses Lab Interaktif */}
        {step === 4 && (
          <WindowFrame key="step4" title="Phase 4: Prosedur Forensik Lab">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <div className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">Tahap 3</div>
              <h2 className="font-black text-3xl text-white uppercase tracking-wide">Investigasi Molekuler</h2>
            </div>

            <div className="bg-cyan-950/40 text-cyan-100 border-2 border-cyan-800/60 px-5 py-4 rounded-lg mb-8 flex items-start gap-4 font-mono text-base shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Info className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
              <p><strong>Otorisasi ATLM:</strong> Klik setiap stasiun kerja di bawah secara berurutan untuk menjalankan protokol lab forensik.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/60 p-8 rounded-xl border border-slate-700/60 mb-10 relative shadow-2xl">
              {labProcesses.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleProcessClick(item.id)}
                    className={`relative z-10 flex flex-col items-center cursor-pointer group w-24 transition-all ${visitedProcesses.includes(item.id) ? '' : 'opacity-80'}`}
                  >
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 shadow-xl border-2
                      ${activeProcess === item.id ? 'bg-cyan-500 border-cyan-300 text-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.6)] scale-110'
                        : visitedProcesses.includes(item.id) ? 'bg-emerald-950 border-emerald-500/80 text-emerald-400'
                          : 'bg-slate-800 border-slate-600 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'}`}
                    >
                      {item.icon}
                    </div>
                    <p className={`font-mono font-bold text-[11px] text-center leading-tight uppercase tracking-wider ${activeProcess === item.id ? 'text-cyan-400' : visitedProcesses.includes(item.id) ? 'text-slate-200' : 'text-slate-500'}`}>
                      {item.title.split(' ').slice(1).join(' ')}
                    </p>

                    {/* Completion dot */}
                    {visitedProcesses.includes(item.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      </div>
                    )}
                  </motion.div>

                  {/* Connector Line */}
                  {idx < 4 && (
                    <div className="hidden md:block flex-1 h-1.5 mx-3 relative bg-slate-800 rounded-full overflow-hidden">
                      <div className={`absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-700 shadow-[0_0_10px_rgba(34,211,238,0.8)] ${visitedProcesses.includes(item.id + 1) ? 'w-full' : 'w-0'}`}></div>
                    </div>
                  )}
                  {/* Mobile Connector */}
                  {idx < 4 && <div className="md:hidden w-1.5 h-8 my-3 bg-slate-800 rounded-full"></div>}
                </React.Fragment>
              ))}
            </div>

            <div className="h-[26rem] md:h-48 mb-8">
              <AnimatePresence mode="wait">
                {activeProcess ? (
                  <motion.div
                    key={activeProcess}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                    className="bg-slate-800/40 border-l-4 border-cyan-500 p-8 rounded-r-lg shadow-2xl h-full flex flex-col justify-center border-y border-r border-y-slate-700/50 border-r-slate-700/50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Fingerprint className="w-32 h-32" />
                    </div>
                    <h4 className="font-black text-white text-xl mb-4 flex items-center gap-4 uppercase tracking-wider">
                      <span className="text-cyan-400 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">{labProcesses.find(p => p.id === activeProcess).icon}</span>
                      {labProcesses.find(p => p.id === activeProcess).title}
                    </h4>
                    <p className="text-slate-200 text-base leading-relaxed font-mono relative z-10">{labProcesses.find(p => p.id === activeProcess).desc}</p>
                  </motion.div>
                ) : (
                  <div className="h-full border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-lg bg-slate-900/40 font-mono uppercase tracking-widest shadow-inner">
                    [ Menunggu Input Operator ]
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center border-t border-slate-700/50 pt-8">
              <div className="text-sm font-mono uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700">
                {visitedProcesses.length < 5 ? (
                  <span className="text-amber-400 flex items-center gap-3"><AlertCircle className="w-5 h-5" /> Proses belum selesai</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> Investigasi Lengkap</span>
                )}
              </div>
              <motion.button
                onClick={nextStep}
                disabled={visitedProcesses.length < 5}
                className={`px-10 py-4 rounded-lg font-bold transition-all flex items-center gap-3 uppercase tracking-widest text-lg ${visitedProcesses.length === 5 ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
              >
                CETAK LAPORAN <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 6. Hasil Amplop */}
        {step === 5 && (
          <WindowFrame key="step5" title="Phase 5: Laporan Forensik">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <div className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">Tahap 4</div>
              <h2 className="font-black text-3xl text-white uppercase tracking-wide">Dokumen Barang Bukti</h2>
            </div>

            <div className="flex justify-center my-12 relative min-h-[400px] items-center bg-slate-900/70 rounded-2xl border border-slate-700/60 backdrop-blur-md overflow-hidden shadow-2xl">
              {/* Radar/Grid Background Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.9)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-cyan-500/20 rounded-full opacity-40"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-cyan-500/30 rounded-full opacity-40"></div>

              <AnimatePresence mode="wait">
                {!isResultOpen ? (
                  <motion.div exit={{ scale: 0, opacity: 0 }} className="text-center relative z-10 flex flex-col items-center">

                    {/* Secure File Folder */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-56 h-64 bg-amber-600/20 border-2 border-amber-500 rounded-md shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-8 relative flex items-center justify-center backdrop-blur-md"
                    >
                      {/* Folder tab */}
                      <div className="absolute top-[-18px] left-[-2px] w-1/3 h-[18px] border-t-2 border-l-2 border-r-2 border-amber-500 bg-amber-600/20 backdrop-blur-md rounded-t-md"></div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <Briefcase className="w-20 h-20 text-amber-500 mb-6" />
                        <div className="w-full h-px bg-amber-500/60 mb-3"></div>
                        <span className="text-amber-500 font-mono text-sm font-bold tracking-[0.2em]">FILE: EVD-001</span>
                      </div>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setIsResultOpen(true)}
                      className="bg-amber-500 text-slate-900 px-10 py-4 rounded-lg font-black shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center gap-3 uppercase tracking-widest text-lg"
                    >
                      <ScanEye className="w-6 h-6" /> BUKA SEGEL BUKTI
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="bg-[#f8f9fa] p-10 border-4 border-slate-300 rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.6)] w-full max-w-lg relative z-10 text-slate-800"
                  >
                    {/* Top Secret Stamp */}
                    <div className="absolute top-8 right-8 border-4 border-red-600 text-red-600 font-black text-xl px-5 py-2 rounded transform rotate-[15deg] opacity-80 uppercase tracking-widest shadow-md">
                      RAHASIA
                    </div>

                    <div className="border-b-4 border-slate-800 pb-6 mb-8 flex flex-col items-center text-center">
                      <Crosshair className="w-16 h-16 text-slate-800 mb-3" />
                      <h3 className="font-black text-3xl tracking-tight text-slate-900 uppercase">DEP. KEDOKTERAN MOLEKULER</h3>
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest font-mono">Laporan Investigasi Resmi</p>
                    </div>

                    <div className="space-y-5 text-base mb-10 font-mono">
                      <div className="flex justify-between border-b-2 border-slate-300 pb-2">
                        <span className="text-slate-500 font-bold">KODE BUKTI</span><span className="font-black text-slate-800 text-lg">SWB-01-CVX</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-slate-300 pb-2">
                        <span className="text-slate-500 font-bold">TARGET DNA</span><span className="font-black text-slate-800 text-lg">HIGH-RISK HPV</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-slate-300 pb-2">
                        <span className="text-slate-500 font-bold">METODE</span><span className="font-black text-slate-800 text-lg">REAL-TIME PCR</span>
                      </div>
                    </div>

                    <div className="bg-slate-200 rounded-lg p-6 border-2 border-slate-300 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.6)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
                      <span className="text-sm font-black text-slate-600 uppercase tracking-widest block mb-4 relative z-10">STATUS TERSANGKA:</span>
                      <div className="inline-block bg-red-100 text-red-700 px-8 py-3 rounded-lg font-black text-4xl tracking-widest border-4 border-red-500 shadow-md relative z-10">
                        + POSITIF
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-end">
              <motion.button
                onClick={nextStep}
                disabled={!isResultOpen}
                className={`px-10 py-4 rounded-lg font-bold flex items-center gap-3 uppercase tracking-widest text-lg ${isResultOpen ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
              >
                LANJUTKAN ANALISIS <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 7. Interpretasi */}
        {step === 6 && (
          <WindowFrame key="step6" title="Phase 6: Putusan Akhir">
            <div className="mb-4 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <div className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]">Tahap Akhir</div>
              <h2 className="font-black text-3xl text-white uppercase tracking-wide">Vonis Klinis</h2>
            </div>
            <p className="text-slate-300 mb-8 font-mono text-base bg-slate-800/50 p-4 rounded-lg border border-slate-700">Berdasarkan bukti laboratorium yang menunjukkan <strong>POSITIF</strong>, apa putusan (interpretasi medis) terhadap kasus ini?</p>

            <div className="space-y-4 mb-10 font-mono text-base">
              {[
                { id: 'bakteri', label: 'Tersangka A: Ditemukan Infeksi Bakteri Tertentu', isCorrect: false },
                { id: 'hpv', label: 'Tersangka B: Ditemukan Infeksi Human Papillomavirus (HPV)', isCorrect: true },
                { id: 'parasit', label: 'Tersangka C: Ditemukan Infeksi Parasit', isCorrect: false },
                { id: 'negatif', label: 'Tersangka D: Bebas dari Dakwaan (Normal)', isCorrect: false }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  animate={errorId === item.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  onClick={() => handleCheck(item.isCorrect, item.id, setInterpStatus)}
                  className={`p-6 border-2 rounded-lg flex items-center gap-5 cursor-pointer font-bold transition-all group uppercase tracking-wide shadow-md
                      ${interpStatus === 'success' && item.isCorrect ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : errorId === item.id ? 'border-red-500 bg-red-950/60 text-red-400'
                        : interpStatus === 'success' ? 'opacity-30 pointer-events-none border-slate-700 bg-slate-800/50'
                          : 'border-slate-600 bg-slate-800/40 hover:bg-slate-700 hover:border-cyan-500/70 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-slate-300'}`}
                >
                  <div className={`w-8 h-8 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                      ${interpStatus === 'success' && item.isCorrect ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-500 group-hover:border-cyan-500/70'}`}>
                    {interpStatus === 'success' && item.isCorrect && <div className="w-3.5 h-3.5 bg-emerald-400 rounded-sm"></div>}
                  </div>
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between items-center min-h-[5rem]">
              <AnimatePresence>
                {interpStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 flex items-center gap-4 font-mono bg-red-950/60 px-6 py-4 rounded-lg border border-red-900/60 shadow-lg">
                    <XCircle className="w-8 h-8 shrink-0" />
                    <div><strong className="block text-white uppercase text-base">Vonis Ditolak</strong> <span className="text-sm">Kesimpulan tidak sesuai dengan target DNA di awal investigasi.</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                onClick={() => {
                  setQuizStarted(true);
                  nextStep();
                }}
                disabled={interpStatus !== 'success'}
                className={`px-10 py-4 rounded-lg font-bold ml-auto transition-all flex items-center gap-3 uppercase tracking-widest text-lg ${interpStatus === 'success' ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
              >
                TUTUP KASUS (EVALUASI) <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </WindowFrame>
        )}

        {/* 8. Post Test - REAL QUIZ */}
        {step === 7 && (
          <motion.div key="step7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto z-10">

            {/* STATE 2: Menjawab Soal Kuis */}
            {quizStarted && quizStep < postTestQuestions.length && (
              <WindowFrame title={`Peninjauan Kasus (Q${quizStep + 1}/5)`}>
                <div className="mb-8 flex justify-between items-center border-b-2 border-slate-700/60 pb-6 bg-slate-900/40 p-4 rounded-xl">
                  <div className="flex gap-3">
                    {[0, 1, 2, 3, 4].map(idx => (
                      <div key={idx} className={`h-2 rounded-full w-14 transition-all ${idx < quizStep ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]' : idx === quizStep ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 'bg-slate-700'}`}></div>
                    ))}
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-200 bg-slate-800 px-5 py-2 rounded-lg border border-slate-600 uppercase tracking-widest shadow-inner">
                    Skor Analisis: <span className="text-amber-400 text-lg ml-2">{quizScore}</span>
                  </span>
                </div>

                <div className="flex items-start gap-5 mb-10 bg-slate-800/40 p-6 rounded-xl border border-slate-700">
                  <Briefcase className="w-10 h-10 text-cyan-500 shrink-0 mt-1" />
                  <h3 className="font-bold text-2xl text-white leading-relaxed">
                    {postTestQuestions[quizStep].q}
                  </h3>
                </div>

                <div className="space-y-4 mb-10 font-mono text-base">
                  {postTestQuestions[quizStep].options.map((opt, idx) => {
                    let btnClass = "border-slate-600 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300";
                    if (quizShowFeedback) {
                      if (idx === postTestQuestions[quizStep].answer) btnClass = "border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                      else if (idx === quizSelectedOption) btnClass = "border-red-500 bg-red-950/80 text-red-400";
                      else btnClass = "border-slate-800 opacity-30 bg-transparent";
                    } else {
                      if (quizSelectedOption === idx) btnClass = "border-cyan-500 bg-cyan-950/80 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]";
                    }

                    return (
                      <div
                        key={idx} onClick={() => !quizShowFeedback && setQuizSelectedOption(idx)}
                        className={`p-6 border-2 rounded-lg flex items-center gap-5 cursor-pointer font-bold transition-all ${btnClass}`}
                      >
                        <div className={`w-8 h-8 rounded-md border-2 flex items-center justify-center shrink-0
                           ${quizShowFeedback && idx === postTestQuestions[quizStep].answer ? 'border-emerald-500 bg-emerald-500 text-slate-900' :
                            quizShowFeedback && idx === quizSelectedOption ? 'border-red-500 bg-red-500 text-white' :
                              quizSelectedOption === idx ? 'border-cyan-500 bg-cyan-500 text-slate-900' : 'border-slate-500'
                          }`}
                        >
                          {(quizShowFeedback && idx === postTestQuestions[quizStep].answer) && <Check className="w-5 h-5 stroke-[3]" />}
                          {(quizShowFeedback && idx === quizSelectedOption && idx !== postTestQuestions[quizStep].answer) && <XCircle className="w-5 h-5" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end pt-8 border-t border-slate-700/50">
                  {!quizShowFeedback ? (
                    <motion.button
                      whileHover={quizSelectedOption !== null ? { scale: 1.05 } : {}}
                      onClick={() => {
                        setQuizShowFeedback(true);
                        if (quizSelectedOption === postTestQuestions[quizStep].answer) setQuizScore(prev => prev + 1);
                      }}
                      disabled={quizSelectedOption === null}
                      className={`px-10 py-4 rounded-lg font-bold transition-all uppercase tracking-widest text-lg ${quizSelectedOption !== null ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-cyan-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
                    >
                      VERIFIKASI JAWABAN
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setQuizShowFeedback(false);
                        setQuizSelectedOption(null);
                        setQuizStep(prev => prev + 1);
                      }}
                      className="px-10 py-4 rounded-lg font-black bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center gap-3 uppercase tracking-widest text-lg"
                    >
                      {quizStep === 4 ? 'ARSIPKAN KASUS' : 'LANJUTKAN INTEROGASI'} <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
              </WindowFrame>
            )}

            {/* STATE 3: Hasil Kuis Selesai */}
            {quizStarted && quizStep === postTestQuestions.length && (
              <WindowFrame title="Case Closed">
                <div className="text-center py-16 relative">

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                  <div className="inline-flex items-center justify-center w-40 h-40 mb-10 relative z-10">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl"></div>
                    <div className="relative w-full h-full rounded-full border-8 border-slate-700 bg-slate-900 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-7xl font-black text-amber-400">{quizScore}</span>
                      <div className="w-16 h-1 bg-slate-600 my-2"></div>
                      <span className="text-xl font-bold text-slate-400">5</span>
                    </div>
                  </div>

                  <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-widest relative z-10 drop-shadow-xl">KASUS DITUTUP</h2>

                  <div className="relative z-10 mb-12 font-mono bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 inline-block max-w-2xl">
                    {quizScore === 5 && <p className="text-emerald-400 font-bold text-2xl flex items-center justify-center gap-3"><BadgeCheck className="w-8 h-8" /> Detektif Ahli! Analisis ATLM Anda sempurna.</p>}
                    {quizScore >= 3 && quizScore < 5 && <p className="text-cyan-400 font-bold text-2xl">Kerja Bagus, Agen. Investigasi molekuler berhasil dipahami dengan baik.</p>}
                    {quizScore < 3 && <p className="text-red-400 font-bold text-2xl">Catatan Kasus Kurang. Silakan buka kembali berkas perkara (Restart).</p>}
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetApp}
                      className="relative z-10 border-2 border-slate-500 bg-slate-800 text-white px-10 py-4 rounded-lg font-bold hover:bg-slate-700 hover:border-slate-400 transition-all shadow-xl inline-flex items-center gap-3 uppercase tracking-widest text-lg"
                    >
                      <RotateCcw className="w-6 h-6" /> INVESTIGASI KASUS BARU
                    </motion.button>
                  </div>
                </div>
              </WindowFrame>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}