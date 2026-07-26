"use client";

import { useEffect, useMemo, useState } from "react";

type Prompt = {
  id: string;
  category: "업무" | "수업" | "비교" | "검증";
  title: string;
  description: string;
  prompt: string;
};

const navItems = [
  ["overview", "연수 안내"],
  ["understanding", "이해"],
  ["start", "시작하기"],
  ["questions", "질문 방법"],
  ["work", "업무 활용"],
  ["class", "수업 활용"],
  ["studio", "스튜디오"],
  ["practice", "실습"],
  ["verification", "검증"],
  ["resources", "자료실"],
] as const;

const preparationItems = [
  "Google 계정 로그인",
  "Gemini Notebook 접속 확인",
  "Chrome 또는 최신 브라우저 준비",
  "실습용 PDF 파일 준비",
  "비교할 문서 2개 준비",
  "개인정보가 포함된 자료를 사용하지 않기로 확인",
  "오디오 오버뷰 청취용 이어폰 준비",
];

const startSteps = [
  {
    number: "01",
    title: "Gemini Notebook 접속",
    time: "3분",
    body: "Google 계정으로 로그인한 뒤 Gemini Notebook에 접속합니다. 처음이라면 ‘사용해 보기’를 선택하세요.",
    tip: "브라우저 탭을 이 실습 페이지와 나란히 열어 두세요.",
  },
  {
    number: "02",
    title: "새 노트북 만들기",
    time: "3분",
    body: "‘새 노트 만들기’를 선택하고 자료의 목적이 드러나는 구체적인 제목을 붙입니다.",
    tip: "예: 2022 개정 교육과정 핵심 내용 / 6학년 기후변화 프로젝트",
  },
  {
    number: "03",
    title: "소스 추가",
    time: "5분",
    body: "PDF, 텍스트, Google 문서·슬라이드, 웹페이지, YouTube, 복사한 텍스트, 오디오 파일을 추가할 수 있습니다.",
    tip: "하나의 노트북에는 하나의 분명한 주제만 담으세요.",
  },
  {
    number: "04",
    title: "소스 인식 확인",
    time: "4분",
    body: "자동 생성된 요약을 읽고 표·도표·스캔 문서까지 잘 인식했는지 핵심 질문으로 확인합니다.",
    tip: "업로드한 파일의 연도, 버전, 적용 범위를 다시 확인하세요.",
  },
];

const questionSteps = [
  {
    title: "요약",
    purpose: "전체 구조 파악",
    prompt: "선택한 소스의 핵심 내용을 다섯 가지로 요약하고, 각 내용의 근거가 되는 인용을 표시해 주세요.",
  },
  {
    title: "분류",
    purpose: "대상과 성격별 구분",
    prompt: "이 자료의 내용을 학교, 담임교사, 업무담당자의 역할로 구분해 표로 정리해 주세요.",
  },
  {
    title: "비교",
    purpose: "공통점과 차이 확인",
    prompt: "전년도 자료와 올해 자료의 공통점과 달라진 점을 비교하고, 변경 근거가 있는 소스를 표시해 주세요.",
  },
  {
    title: "적용",
    purpose: "우리 학교 상황에 맞게 변환",
    prompt: "이 내용을 우리 학교에서 실행할 수 있도록 담당자, 기한, 준비물, 유의사항을 포함한 체크리스트로 바꾸어 주세요.",
  },
  {
    title: "검토",
    purpose: "누락·모순·위험 확인",
    prompt: "답변에서 해석이 모호하거나 조건과 예외가 생략된 부분, 원문을 다시 확인해야 할 부분을 알려 주세요.",
  },
];

const prompts: Prompt[] = [
  {
    id: "p1",
    category: "업무",
    title: "공문 업무 체크리스트",
    description: "기한과 담당 업무를 한눈에 정리합니다.",
    prompt:
      "이 공문에서 학교가 해야 할 일을 기한순으로 정리하고, 담당자, 준비 서류, 제출 방법, 유의사항을 표로 작성해 주세요. 각 항목의 근거가 되는 소스도 표시해 주세요.",
  },
  {
    id: "p2",
    category: "업무",
    title: "학교교육계획 비교",
    description: "전년도 계획과 올해 지침의 차이를 찾습니다.",
    prompt:
      "올해 교육청 지침과 전년도 학교교육계획을 비교하여 새로 반영할 내용, 수정할 내용, 유지할 내용을 표로 정리해 주세요.",
  },
  {
    id: "p3",
    category: "업무",
    title: "학부모 안내문 만들기",
    description: "행정 문장을 쉽고 명확하게 바꿉니다.",
    prompt:
      "이 계획서를 학부모가 이해하기 쉬운 안내문으로 바꾸고, 날짜, 대상, 장소, 준비물, 신청 방법을 표로 정리한 뒤 예상 질문을 FAQ로 만들어 주세요.",
  },
  {
    id: "p4",
    category: "수업",
    title: "성취기준과 차시 연결",
    description: "단원의 핵심과 수업 흐름을 설계합니다.",
    prompt:
      "이 단원의 핵심 개념을 추출하고, 성취기준과 차시별 학습 내용을 연결해 표로 정리해 주세요. 예상 오개념과 탐구 질문도 제안해 주세요.",
  },
  {
    id: "p5",
    category: "수업",
    title: "수준별 학습 가이드",
    description: "같은 목표에 도달하는 여러 경로를 만듭니다.",
    prompt:
      "선택한 소스의 내용을 초등학생이 이해할 수 있는 쉬운 설명, 핵심 용어집, 기본 질문 5개, 심화 질문 5개로 구성해 주세요.",
  },
  {
    id: "p6",
    category: "수업",
    title: "평가 문항 점검",
    description: "문항과 근거의 적절성을 함께 살핍니다.",
    prompt:
      "핵심 개념을 확인하는 선다형 문항 5개와 서술형 문항 3개를 만들고, 정답과 근거를 표시해 주세요. 모호하거나 복수 정답이 가능한 문항도 점검해 주세요.",
  },
  {
    id: "p7",
    category: "비교",
    title: "복수 자료 관점 비교",
    description: "주장, 근거, 수치, 관점을 나란히 봅니다.",
    prompt:
      "선택한 소스별로 핵심 주장, 근거, 주요 수치, 관점, 공통점과 차이점을 데이터 표로 정리해 주세요. 확인할 수 없는 항목은 추정하지 말고 빈칸으로 남겨 주세요.",
  },
  {
    id: "p8",
    category: "검증",
    title: "AI 답변 검증",
    description: "그럴듯한 답변보다 정확한 근거를 우선합니다.",
    prompt:
      "방금 답변에서 사실과 해석을 구분하고, 인용이 답변을 충분히 뒷받침하는지 확인해 주세요. 생략된 조건, 예외, 서로 충돌하는 내용도 표시해 주세요.",
  },
];

const workUses = [
  ["교육과정·학교교육계획", "국가교육과정, 교육청 계획, 전년도 계획과 설문을 비교해 학교 과제를 도출합니다.", "올해 지침과 전년도 계획의 수정 필요 내용을 표로 정리해 주세요."],
  ["공문·업무 지침", "본문과 붙임에서 기한, 담당자, 준비 서류, 제출 방법을 추출합니다.", "학교가 해야 할 일을 기한순으로 정리하고 누락 가능성을 알려 주세요."],
  ["학교 규정·사안 대응", "관련 절차와 역할을 찾되 실제 학생 정보는 제거하고 최신 공식 지침을 재확인합니다.", "학교와 교육지원청의 역할을 구분하고 근거가 되는 부분을 표시해 주세요."],
  ["회의·협의 자료", "여러 의견의 공통점과 차이, 결정 사항과 후속 과제를 정리합니다.", "결정해야 할 사항과 단순 공유 사항을 구분해 주세요."],
  ["연구·연수 자료", "논문 목적, 방법, 결과와 학교급별 적용 가능성을 비교합니다.", "자료별 연구 목적과 주요 결과를 표로 비교해 주세요."],
  ["학부모 안내", "행정 표현을 쉬운 문장으로 바꾸고 일정·준비물·FAQ를 만듭니다.", "오해할 수 있는 표현을 찾아 더 명확하게 고쳐 주세요."],
];

const classUses = [
  ["교육과정·교과서 분석", "핵심 개념, 성취기준, 차시, 예상 오개념과 평가의 정렬을 점검합니다."],
  ["탐구수업 설계", "교과서, 기사, 통계, 영상의 관점을 비교하고 주장과 근거를 구성합니다."],
  ["수준별 학습 자료", "쉬운 설명, 핵심 용어집, 기본·심화 질문과 읽기 지원 자료를 만듭니다."],
  ["평가 문항·피드백", "형성평가 초안을 만들고 정답, 근거, 난이도와 애매성을 교사가 검토합니다."],
  ["학생 탐구 활동", "읽기 전·중·후 활동에서 AI 답변과 원자료를 비교하고 인용을 기록합니다."],
];

const studioItems = [
  { icon: "◉", title: "AI 오디오 오버뷰", tags: ["듣기·보기", "업무", "수업"], work: "긴 연수·정책 자료를 이동 중 듣기", classUse: "예습·복습 후 근거 찾기", check: "핵심 조건과 예외를 원문에서 확인" },
  { icon: "▤", title: "슬라이드 자료", tags: ["듣기·보기", "업무", "수업"], work: "회의·연수·보고용 발표 초안", classUse: "단원 도입과 발표 구조 참고", check: "순서·강조점·이미지 맥락 검토" },
  { icon: "▶", title: "동영상 개요", tags: ["듣기·보기", "수업"], work: "긴 보고서의 핵심 흐름 공유", classUse: "사전 학습·복습 자료", check: "자막·용어·이미지의 정확성 확인" },
  { icon: "⌘", title: "마인드맵", tags: ["비교·구조화", "업무", "수업"], work: "복잡한 지침과 사업 구조 파악", classUse: "개념 관계와 탐구 흐름 확인", check: "개념 위계와 누락 여부 확인" },
  { icon: "▥", title: "보고서", tags: ["업무", "수업"], work: "브리핑·FAQ·타임라인 초안", classUse: "학습 가이드와 읽기 자료", check: "공식 문서와 대조하고 수준 조정" },
  { icon: "◇", title: "플래시카드", tags: ["평가·복습", "수업"], work: "연수 핵심 용어 복습", classUse: "반복 학습과 자기 점검", check: "원문 맥락과 학생 수준 확인" },
  { icon: "?", title: "퀴즈", tags: ["평가·복습", "수업"], work: "연수 참여자 이해도 점검", classUse: "진단·형성평가와 마무리", check: "정답·오답·복수 정답 가능성 검토" },
  { icon: "✦", title: "인포그래픽", tags: ["듣기·보기", "업무", "수업"], work: "사업 개요와 연구 결과 한 장 요약", classUse: "단원 핵심과 탐구 결과 시각화", check: "수치·단위·강조 방식 검토" },
  { icon: "▦", title: "데이터 표", tags: ["비교·구조화", "업무", "수업"], work: "지침·사업·연구 항목 비교", classUse: "주장·근거·수치·관점 비교", check: "빈칸을 임의 추정하지 않았는지 확인" },
];

const practiceItems = [
  {
    title: "소스 추가 + 핵심 찾기",
    time: "15분",
    goal: "공문 또는 교육과정 PDF를 넣고 답변과 원문을 연결합니다.",
    tasks: ["핵심 내용 5가지 요약", "인용 번호 선택", "원문과 답변 비교", "생략·모호한 부분 메모"],
    prompt: "이 자료의 핵심 내용을 다섯 가지로 요약하고, 각 내용의 근거가 되는 인용을 표시해 주세요.",
  },
  {
    title: "여러 자료 비교하기",
    time: "15분",
    goal: "전년도와 올해 자료의 공통점·차이점을 표로 만듭니다.",
    tasks: ["비교할 소스 2개 선택", "공통점·차이 표 만들기", "변경 근거 확인", "학교 적용 시 수정점 논의"],
    prompt: "두 자료의 공통점과 달라진 점을 비교표로 만들고, 변경된 내용의 근거가 되는 원문을 표시해 주세요.",
  },
  {
    title: "업무 결과물 만들기",
    time: "15분",
    goal: "업무 지침을 실제 실행 가능한 체크리스트와 FAQ로 바꿉니다.",
    tasks: ["기한·담당·서류 분류", "체크리스트 생성", "FAQ 생성", "개인정보·표현 점검"],
    prompt: "업무 지침을 기한, 담당자, 준비 서류, 제출 방법, 유의사항으로 분류하고 체크리스트와 FAQ를 만들어 주세요.",
  },
  {
    title: "수업 자료 만들기",
    time: "15분",
    goal: "학교급에 맞는 학습 가이드와 스튜디오 결과물을 만듭니다.",
    tasks: ["교과 자료와 영상 추가", "학습 가이드 생성", "마인드맵 생성", "퀴즈·플래시카드 검토"],
    prompt: "이 자료로 학습 가이드와 핵심 용어집을 만들고, 초등 또는 중·고등 수준에 맞는 퀴즈 5개를 제안해 주세요.",
  },
  {
    title: "AI 결과 검증하기",
    time: "10분",
    goal: "사실·해석·인용을 구분하고 교사가 수정할 부분을 표시합니다.",
    tasks: ["사실과 해석 구분", "인용 적절성 확인", "질문 변화 비교", "최종 수정 지점 표시"],
    prompt: "답변의 사실과 해석을 구분하고 인용이 충분한지, 조건과 예외가 빠지지 않았는지 검토해 주세요.",
  },
];

const verificationItems = [
  "답변에 인용이 표시되어 있는가?",
  "인용된 원문이 실제 질문과 관련 있는가?",
  "원문의 조건과 예외가 생략되지 않았는가?",
  "여러 문서의 내용이 부적절하게 결합되지 않았는가?",
  "표와 수치가 원문과 일치하는가?",
  "최신 문서인지 확인했는가?",
  "AI가 소스에 없는 내용을 덧붙이지 않았는가?",
  "공식 업무에 쓰기 전 원문을 다시 확인했는가?",
  "개인정보 또는 민감정보가 포함되지 않았는가?",
];

function usePersistentRecord(key: string) {
  const [values, setValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setValues(JSON.parse(localStorage.getItem(key) || "{}"));
    } catch {
      setValues({});
    }
  }, [key]);

  const toggle = (id: string) => {
    setValues((current) => {
      const next = { ...current, [id]: !current[id] };
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    setValues({});
    localStorage.removeItem(key);
  };

  return { values, toggle, reset };
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [promptFilter, setPromptFilter] = useState("전체");
  const [promptSearch, setPromptSearch] = useState("");
  const [studioFilter, setStudioFilter] = useState("전체");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const prep = usePersistentRecord("gemini-notebook-preparation");
  const questionProgress = usePersistentRecord("gemini-notebook-questions");
  const practice = usePersistentRecord("gemini-notebook-practice");
  const verification = usePersistentRecord("gemini-notebook-verification");

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("gemini-notebook-favorites") || "[]"));
      setNotes(JSON.parse(localStorage.getItem("gemini-notebook-notes") || "{}"));
    } catch {
      setFavorites([]);
      setNotes({});
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -68% 0px", threshold: [0.05, 0.25, 0.5] },
    );
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("프롬프트를 복사했습니다.");
    } catch {
      showToast("복사하지 못했습니다. 텍스트를 직접 선택해 주세요.");
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("gemini-notebook-favorites", JSON.stringify(next));
      return next;
    });
  };

  const updateNote = (id: string, value: string) => {
    setNotes((current) => {
      const next = { ...current, [id]: value };
      localStorage.setItem("gemini-notebook-notes", JSON.stringify(next));
      return next;
    });
  };

  const filteredPrompts = useMemo(
    () =>
      prompts.filter((item) => {
        const matchesFilter =
          promptFilter === "전체" ||
          item.category === promptFilter ||
          (promptFilter === "즐겨찾기" && favorites.includes(item.id));
        const query = promptSearch.trim().toLowerCase();
        return (
          matchesFilter &&
          (!query ||
            `${item.title} ${item.description} ${item.prompt}`.toLowerCase().includes(query))
        );
      }),
    [favorites, promptFilter, promptSearch],
  );

  const practiceTotal = practiceItems.reduce((sum, item) => sum + item.tasks.length, 0);
  const practiceDone = Object.entries(practice.values).filter(
    ([key, value]) => key.startsWith("practice-") && value,
  ).length;
  const practicePercent = Math.round((practiceDone / practiceTotal) * 100);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <header className="site-header">
        <a href="#overview" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>
            <strong>Gemini Notebook</strong>
            <small>교사 실습 연수</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "닫기" : "메뉴"}
        </button>
        <nav id="main-nav" className={menuOpen ? "nav-open" : ""} aria-label="주요 메뉴">
          {navItems.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={activeSection === id ? "active" : ""}
              onClick={() => jumpTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main id="main">
        <section
          id="overview"
          className="hero bg-gradient-to-br from-violet-50 via-white to-emerald-50"
        >
          <div
            className="hero-palette pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <span className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
            <span className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />
          </div>
          <div className="hero-copy">
            <span className="eyebrow">초·중·고 교사 · 120분 실습형 연수</span>
            <h1>
              자료를 읽고,
              <br />
              <span>근거를 확인하고,</span>
              <br />
              수업과 업무에 연결합니다.
            </h1>
            <p className="hero-lead">
              Gemini Notebook의 소스 구성부터 질문, 인용 확인, 스튜디오 결과물,
              검증까지 한 번에 익히는 현장형 학습 노트입니다.
            </p>
            <p className="rename-note">
              <span aria-hidden="true">↗</span> 이전 명칭 <strong>NotebookLM</strong>을
              이 페이지에서는 <strong>Gemini Notebook</strong>으로 표기합니다.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://notebooklm.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                Gemini Notebook 열기 <span aria-hidden="true">↗</span>
              </a>
              <button className="button button-secondary" type="button" onClick={() => jumpTo("practice")}>
                실습 바로 시작
              </button>
              <a
                className="button button-quiet"
                href="./materials/gemini-notebook-training.pdf"
                target="_blank"
                rel="noreferrer"
              >
                연수 원고 PDF
              </a>
            </div>
            <div className="hero-meta" aria-label="연수 정보">
              <div><span>대상</span><strong>초·중·고 교사</strong></div>
              <div><span>시간</span><strong>2시간 · 실습 중심</strong></div>
              <div><span>준비물</span><strong>노트북 · PDF 2개 · 이어폰</strong></div>
            </div>
          </div>

          <div className="hero-board" aria-label="120분 학습 흐름">
            <div className="board-top">
              <span className="board-kicker">TODAY&apos;S LEARNING PATH</span>
              <strong>120 min</strong>
            </div>
            <ol className="timeline">
              {[
                ["01", "이해", "15분", "자료 기반 AI와 RAG"],
                ["02", "시작", "15분", "노트북·소스 구성"],
                ["03", "질문", "20분", "요약→분류→비교→적용"],
                ["04", "활용", "20분", "업무와 수업에 연결"],
                ["05", "스튜디오", "20분", "9가지 결과물"],
                ["06", "실습·검증", "30분", "만들고 근거 확인"],
              ].map(([number, title, time, description]) => (
                <li key={number}>
                  <span className="timeline-number">{number}</span>
                  <div><strong>{title}</strong><small>{description}</small></div>
                  <span className="timeline-time">{time}</span>
                </li>
              ))}
            </ol>
            <div className="board-note">
              <span aria-hidden="true">!</span>
              <p><strong>오늘의 기준</strong> 답변보다 인용, 속도보다 검증</p>
            </div>
          </div>
        </section>

        <section
          id="prepare"
          className="section section-soft bg-stone-50"
        >
          <div className="section-heading">
            <span className="section-number">00</span>
            <div>
              <p className="kicker">BEFORE WE START</p>
              <h2>3분 준비 체크</h2>
              <p>체크한 내용은 이 기기의 브라우저에만 저장됩니다.</p>
            </div>
          </div>
          <div className="prepare-layout">
            <div className="check-card">
              <div className="card-heading">
                <strong>연수 전 준비물</strong>
                <span>{Object.values(prep.values).filter(Boolean).length}/{preparationItems.length}</span>
              </div>
              <div className="progress-track" aria-label="준비 진행률">
                <span
                  style={{
                    width: `${(Object.values(prep.values).filter(Boolean).length / preparationItems.length) * 100}%`,
                  }}
                />
              </div>
              <div className="check-list">
                {preparationItems.map((item, index) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={Boolean(prep.values[`prep-${index}`])}
                      onChange={() => prep.toggle(`prep-${index}`)}
                    />
                    <span className="custom-check" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <button className="text-button" type="button" onClick={prep.reset}>체크 초기화</button>
            </div>
            <aside className="privacy-card">
              <span className="privacy-icon" aria-hidden="true">⊘</span>
              <p className="kicker">개인정보 STOP</p>
              <h3>실제 학생 정보는 소스에 넣지 않습니다.</h3>
              <p>
                이름, 연락처, 건강 정보, 상담 기록, 학교폭력 진술 등 개인정보·민감정보는
                업로드하지 마세요. 사례가 필요하면 익명화하거나 가상의 표현으로 바꿉니다.
              </p>
              <strong>공개 페이지에는 학교 내부 공문이나 비공개 자료도 올리지 않습니다.</strong>
            </aside>
          </div>
        </section>

        <section
          id="understanding"
          className="section bg-white"
        >
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <p className="kicker">UNDERSTAND</p>
              <h2>Gemini Notebook은 무엇이 다른가요?</h2>
              <p>정답을 대신 내리는 AI가 아니라, 소스와 답변의 연결을 보여 주는 연구 보조자입니다.</p>
            </div>
          </div>
          <div className="core-message">
            <span aria-hidden="true">“</span>
            <p>
              교사를 대신하여 판단하는 도구가 아니라,
              <strong> 교사가 자료를 더 빠르게 읽고 근거 있게 판단하도록 지원하는 도구</strong>입니다.
            </p>
          </div>
          <div className="comparison-grid" role="table" aria-label="일반 생성형 AI와 Gemini Notebook 비교">
            <div className="comparison-head" role="row">
              <span role="columnheader">비교 기준</span>
              <strong role="columnheader">일반 생성형 AI</strong>
              <strong role="columnheader">Gemini Notebook</strong>
            </div>
            {[
              ["답변 기반", "학습된 일반 지식과 입력", "사용자가 추가한 소스"],
              ["주요 목적", "아이디어·글쓰기·대화", "분석·비교·요약·탐색"],
              ["출처 확인", "별도 확인 필요", "답변과 관련된 인용 위치"],
              ["교사 역할", "사실성과 적절성 검토", "소스와 답변의 연결·맥락 검토"],
            ].map((row) => (
              <div className="comparison-row" role="row" key={row[0]}>
                <span role="cell">{row[0]}</span>
                <p role="cell">{row[1]}</p>
                <p role="cell">{row[2]}</p>
              </div>
            ))}
          </div>
          <div className="rag-panel">
            <div className="rag-intro">
              <span className="eyebrow">RAG, 교사의 언어로</span>
              <h3>먼저 책장에서 근거를 찾고,<br />그다음 설명하는 방식</h3>
              <p>
                어떤 자료를 넣었는지가 결과를 좌우합니다. 인용을 누르는 순간이 검증의
                시작입니다.
              </p>
            </div>
            <ol className="rag-flow">
              {[
                ["1", "질문 입력", "알고 싶은 내용을 구체화"],
                ["2", "소스 검색", "관련 문장과 페이지 찾기"],
                ["3", "답변 생성", "찾은 근거로 설명 구성"],
                ["4", "인용 확인", "원문 맥락과 조건 검토"],
              ].map(([number, title, text]) => (
                <li key={number}>
                  <span>{number}</span>
                  <div><strong>{title}</strong><small>{text}</small></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="start" className="section section-ink">
          <div className="section-heading light">
            <span className="section-number">02</span>
            <div>
              <p className="kicker">GET STARTED · 15분</p>
              <h2>첫 노트북을 함께 만듭니다</h2>
              <p>한 단계씩 완료하고 다음으로 넘어가세요.</p>
            </div>
          </div>
          <div className="step-tabs" role="tablist" aria-label="시작 단계">
            {startSteps.map((step, index) => (
              <button
                type="button"
                key={step.number}
                role="tab"
                aria-selected={startIndex === index}
                onClick={() => setStartIndex(index)}
              >
                <span>{step.number}</span>
                <strong>{step.title}</strong>
              </button>
            ))}
          </div>
          <div className="step-content" role="tabpanel">
            <div>
              <span className="time-chip">{startSteps[startIndex].time}</span>
              <h3>{startSteps[startIndex].title}</h3>
              <p>{startSteps[startIndex].body}</p>
              <div className="tip-line"><span>TIP</span>{startSteps[startIndex].tip}</div>
            </div>
            <div className="step-visual" aria-hidden="true">
              <span className="window-dot dot-one" />
              <span className="window-dot dot-two" />
              <span className="window-dot dot-three" />
              <div className="mock-note">
                <span>GEMINI NOTEBOOK</span>
                <strong>{startSteps[startIndex].number}</strong>
                <p>{startSteps[startIndex].title}</p>
              </div>
            </div>
          </div>
          <div className="source-strip" aria-label="지원 소스 형식">
            {["PDF", "TXT", "Google 문서", "Google 슬라이드", "웹", "YouTube", "복사한 텍스트", "오디오"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section
          id="sources"
          className="section bg-violet-50/40"
        >
          <div className="split-heading">
            <div>
              <p className="kicker">SOURCE QUALITY</p>
              <h2>좋은 답변은 좋은 소스에서 시작합니다</h2>
            </div>
            <p>하나의 노트북, 하나의 분명한 주제. 최신성·공신력·관련성을 먼저 확인하세요.</p>
          </div>
          <div className="principle-grid">
            {[
              ["01", "주제", "한 노트북에는 하나의 분명한 주제"],
              ["02", "출처", "법령·교육과정·공공기관 자료 우선"],
              ["03", "시점", "최신 지침과 과거 자료의 연도 구분"],
              ["04", "파일명", "연도와 자료 성격을 파일명에 표시"],
              ["05", "선택", "중복·저관련 자료는 제외하고 필요한 소스만 선택"],
              ["06", "보안", "개인정보·민감정보가 없는 자료만 사용"],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span><strong>{title}</strong><p>{text}</p>
              </article>
            ))}
          </div>
          <details className="source-check">
            <summary>
              <span>소스 업로드 전 6문항 점검</span>
              <strong>펼쳐 보기 +</strong>
            </summary>
            <div>
              {[
                "출처가 명확한가?",
                "작성 시점이 확인되는가?",
                "현재 적용되는 자료인가?",
                "질문 목적과 관련 있는가?",
                "개인정보가 포함되어 있지 않은가?",
                "스캔 상태와 글자 인식이 양호한가?",
              ].map((item) => <span key={item}>✓ {item}</span>)}
            </div>
          </details>
        </section>

        <section id="questions" className="section section-lavender">
          <div className="section-heading">
            <span className="section-number">03</span>
            <div>
              <p className="kicker">ASK BETTER · 20분</p>
              <h2>질문은 세 가지로 만듭니다</h2>
              <p>복잡한 공식보다 목적, 기준, 결과 형식을 분명하게 씁니다.</p>
            </div>
          </div>
          <div className="question-formula" aria-label="질문 공식">
            <div><small>WHAT</small><strong>무엇을</strong><span>찾고 싶은 내용</span></div>
            <b aria-hidden="true">+</b>
            <div><small>CRITERIA</small><strong>어떤 기준으로</strong><span>대상·관점·범위</span></div>
            <b aria-hidden="true">+</b>
            <div><small>FORMAT</small><strong>어떤 형식으로</strong><span>표·목록·안내문</span></div>
          </div>
          <div className="before-after">
            <div>
              <span className="label-muted">단순 질문</span>
              <p>“이 자료를 요약해 주세요.”</p>
            </div>
            <span className="arrow" aria-hidden="true">→</span>
            <div className="improved">
              <span className="label-accent">개선된 질문</span>
              <p>
                “담임교사가 반드시 알아야 할 내용을 다섯 가지로 정리하고,
                각 내용의 근거가 되는 소스를 표시해 주세요.”
              </p>
              <button type="button" onClick={() => copyText("이 자료에서 담임교사가 반드시 알아야 할 내용을 다섯 가지로 정리하고, 각 내용의 근거가 되는 소스를 표시해 주세요.")}>복사</button>
            </div>
          </div>
          <div className="question-accordion">
            {questionSteps.map((step, index) => (
              <details key={step.title} open={index === 0}>
                <summary>
                  <label onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={Boolean(questionProgress.values[`question-${index}`])}
                      onChange={() => questionProgress.toggle(`question-${index}`)}
                      aria-label={`${step.title} 단계 완료`}
                    />
                    <span className="custom-check" aria-hidden="true">✓</span>
                  </label>
                  <span className="accordion-number">0{index + 1}</span>
                  <div><strong>{step.title}</strong><small>{step.purpose}</small></div>
                  <b aria-hidden="true">+</b>
                </summary>
                <div className="accordion-body">
                  <p>{step.prompt}</p>
                  <button type="button" onClick={() => copyText(step.prompt)}>프롬프트 복사</button>
                </div>
              </details>
            ))}
          </div>

          <div className="prompt-library">
            <div className="library-heading">
              <div>
                <p className="kicker">PROMPT LIBRARY</p>
                <h3>바로 쓰고, 고쳐 쓰는 질문 모음</h3>
              </div>
              <label className="search-box">
                <span className="sr-only">프롬프트 검색</span>
                <input
                  value={promptSearch}
                  onChange={(event) => setPromptSearch(event.target.value)}
                  placeholder="검색어를 입력하세요"
                />
                <span aria-hidden="true">⌕</span>
              </label>
            </div>
            <div className="filter-row" aria-label="프롬프트 분류">
              {["전체", "업무", "수업", "비교", "검증", "즐겨찾기"].map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={promptFilter === filter ? "selected" : ""}
                  onClick={() => setPromptFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="prompt-grid">
              {filteredPrompts.map((item) => (
                <article className="prompt-card" key={item.id}>
                  <div className="prompt-card-top">
                    <span>{item.category}</span>
                    <button
                      type="button"
                      aria-label={`${item.title} 즐겨찾기`}
                      aria-pressed={favorites.includes(item.id)}
                      onClick={() => toggleFavorite(item.id)}
                    >
                      {favorites.includes(item.id) ? "★" : "☆"}
                    </button>
                  </div>
                  <h4>{item.title}</h4>
                  <p className="prompt-description">{item.description}</p>
                  <textarea
                    aria-label={`${item.title} 프롬프트 편집`}
                    defaultValue={item.prompt}
                    id={`prompt-${item.id}`}
                  />
                  <button
                    className="copy-button"
                    type="button"
                    onClick={() => {
                      const field = document.getElementById(`prompt-${item.id}`) as HTMLTextAreaElement;
                      copyText(field?.value || item.prompt);
                    }}
                  >
                    <span aria-hidden="true">⧉</span> 수정한 프롬프트 복사
                  </button>
                </article>
              ))}
              {filteredPrompts.length === 0 && (
                <p className="empty-state">조건에 맞는 프롬프트가 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        <section
          id="work"
          className="section bg-white"
        >
          <div className="section-heading">
            <span className="section-number">04</span>
            <div>
              <p className="kicker">TEACHER WORK · 10분</p>
              <h2>교사 업무에 연결하기</h2>
              <p>초안은 빠르게, 공식 판단은 소스와 담당 기관을 다시 확인합니다.</p>
            </div>
          </div>
          <div className="use-grid">
            {workUses.map(([title, body, prompt], index) => (
              <article className="use-card" key={title}>
                <span className="use-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="mini-prompt">
                  <span>추천 질문</span>
                  <p>{prompt}</p>
                  <button type="button" onClick={() => copyText(prompt)}>복사</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="class" className="section section-mint">
          <div className="section-heading">
            <span className="section-number">05</span>
            <div>
              <p className="kicker">CLASSROOM · 10분</p>
              <h2>수업과 학생의 탐구에 연결하기</h2>
              <p>AI가 답을 주는 수업보다, 원문을 찾고 자기 말로 설명하는 수업을 설계합니다.</p>
            </div>
          </div>
          <div className="class-layout">
            <div className="class-list">
              {classUses.map(([title, body], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
            </div>
            <aside className="school-levels">
              <p className="kicker">SCHOOL LEVEL GUIDE</p>
              <h3>학교급별로 이렇게 달라집니다</h3>
              <div>
                <span>초등학교</span>
                <p><strong>자료</strong> 짧고 분명한 교사 선별 자료</p>
                <p><strong>질문</strong> 구체적이고 짧은 질문</p>
                <p><strong>활동</strong> 요약·마인드맵·퀴즈</p>
                <p><strong>중점</strong> 원문 찾기와 자기 말로 표현</p>
              </div>
              <div>
                <span>중·고등학교</span>
                <p><strong>자료</strong> 다양한 관점의 복수 자료</p>
                <p><strong>질문</strong> 비교·분석·비판·논증</p>
                <p><strong>활동</strong> 토론·보고서·자료 분석</p>
                <p><strong>중점</strong> 출처·연구 윤리·관점 비교</p>
              </div>
            </aside>
          </div>
        </section>

        <section id="studio" className="section section-ink">
          <div className="section-heading light">
            <span className="section-number">06</span>
            <div>
              <p className="kicker">STUDIO · 20분</p>
              <h2>9가지 결과물을 목적에 맞게</h2>
              <p>화려한 결과물보다 원자료와의 연결을 먼저 봅니다.</p>
            </div>
          </div>
          <div className="filter-row filter-dark" aria-label="스튜디오 기능 분류">
            {["전체", "업무", "수업", "듣기·보기", "평가·복습", "비교·구조화"].map((filter) => (
              <button
                type="button"
                key={filter}
                className={studioFilter === filter ? "selected" : ""}
                onClick={() => setStudioFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="studio-grid">
            {studioItems
              .filter((item) => studioFilter === "전체" || item.tags.includes(studioFilter))
              .map((item) => (
                <article key={item.title}>
                  <div className="studio-icon" aria-hidden="true">{item.icon}</div>
                  <div className="studio-title"><h3>{item.title}</h3><span>{item.tags[0]}</span></div>
                  <dl>
                    <div><dt>업무</dt><dd>{item.work}</dd></div>
                    <div><dt>수업</dt><dd>{item.classUse}</dd></div>
                  </dl>
                  <p className="studio-check"><span aria-hidden="true">!</span>{item.check}</p>
                  <button type="button" onClick={() => jumpTo("practice")}>실습에서 만들어 보기 →</button>
                </article>
              ))}
          </div>
        </section>

        <section
          id="practice"
          className="section bg-stone-50"
        >
          <div className="practice-header">
            <div className="section-heading">
              <span className="section-number">07</span>
              <div>
                <p className="kicker">HANDS-ON · 70분</p>
                <h2>이제 직접 해봅니다</h2>
                <p>다섯 실습을 순서대로 진행하고 개인 메모를 남기세요.</p>
              </div>
            </div>
            <div className="progress-dial" style={{ "--progress": `${practicePercent}%` } as React.CSSProperties}>
              <strong>{practicePercent}%</strong>
              <span>완료</span>
            </div>
          </div>
          <div className="overall-progress">
            <span style={{ width: `${practicePercent}%` }} />
          </div>
          <div className="practice-list">
            {practiceItems.map((item, practiceIndex) => (
              <details key={item.title} open={practiceIndex === 0}>
                <summary>
                  <span className="practice-number">{practiceIndex + 1}</span>
                  <div><strong>{item.title}</strong><small>{item.goal}</small></div>
                  <span className="time-chip">{item.time}</span>
                  <b aria-hidden="true">+</b>
                </summary>
                <div className="practice-body">
                  <div>
                    <h4>해야 할 일</h4>
                    <div className="check-list compact">
                      {item.tasks.map((task, taskIndex) => {
                        const key = `practice-${practiceIndex}-${taskIndex}`;
                        return (
                          <label key={task}>
                            <input
                              type="checkbox"
                              checked={Boolean(practice.values[key])}
                              onChange={() => practice.toggle(key)}
                            />
                            <span className="custom-check" aria-hidden="true">✓</span>
                            <span>{task}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h4>실습 프롬프트</h4>
                    <div className="practice-prompt">
                      <p>{item.prompt}</p>
                      <button type="button" onClick={() => copyText(item.prompt)}>복사</button>
                    </div>
                    <label className="note-field">
                      <span>개인 메모 <small>이 기기에 자동 저장</small></span>
                      <textarea
                        value={notes[`note-${practiceIndex}`] || ""}
                        onChange={(event) => updateNote(`note-${practiceIndex}`, event.target.value)}
                        placeholder="발견한 점, 수정할 점, 적용 아이디어를 적어 보세요."
                      />
                    </label>
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="practice-actions">
            <button className="button button-primary" type="button" onClick={() => window.print()}>실습 결과 인쇄 · PDF 저장</button>
            <button className="button button-secondary" type="button" onClick={practice.reset}>실습 체크 초기화</button>
          </div>
        </section>

        <section id="verification" className="section section-warning">
          <div className="section-heading">
            <span className="section-number">08</span>
            <div>
              <p className="kicker">VERIFY BEFORE USE</p>
              <h2>생성보다 중요한 마지막 9가지</h2>
              <p>Gemini Notebook의 답변은 완성본이 아니라 검토 가능한 초안입니다.</p>
            </div>
          </div>
          <div className="verification-layout">
            <div className="verification-list">
              {verificationItems.map((item, index) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={Boolean(verification.values[`verify-${index}`])}
                    onChange={() => verification.toggle(`verify-${index}`)}
                  />
                  <span className="custom-check" aria-hidden="true">✓</span>
                  <span><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
                </label>
              ))}
            </div>
            <aside className="red-flag">
              <span className="red-flag-icon" aria-hidden="true">!</span>
              <p className="kicker">반드시 재확인</p>
              <h3>최신 법령·공식 지침·담당 기관의 안내가 최종 기준입니다.</h3>
              <div className="warning-tags">
                {["학생의 권리", "평가", "생활지도", "학교폭력", "개인정보", "예산", "법적 절차"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p>AI는 법적 판단이나 사안 처리의 책임 주체가 아닙니다.</p>
            </aside>
          </div>
        </section>

        <section
          id="resources"
          className="section bg-violet-50/40"
        >
          <div className="split-heading">
            <div>
              <p className="kicker">TAKE IT WITH YOU</p>
              <h2>연수 후에도 다시 꺼내 쓰세요</h2>
            </div>
            <p>교안, 프롬프트, 체크리스트를 열거나 인쇄할 수 있습니다.</p>
          </div>
          <div className="resource-grid">
            <a href="./materials/gemini-notebook-training.pdf" target="_blank" rel="noreferrer">
              <span className="resource-type">PDF · 17쪽</span>
              <strong>Gemini Notebook 연수 원고</strong>
              <p>생성형 AI 시대의 교사 역할부터 실습과 검증까지</p>
              <b>열기 ↗</b>
            </a>
            <button type="button" onClick={() => jumpTo("questions")}>
              <span className="resource-type">WEB · 편집 가능</span>
              <strong>프롬프트 라이브러리</strong>
              <p>업무·수업·비교·검증 질문을 검색하고 복사하기</p>
              <b>바로 가기 →</b>
            </button>
            <button type="button" onClick={() => jumpTo("verification")}>
              <span className="resource-type">CHECKLIST</span>
              <strong>결과 검증 체크리스트</strong>
              <p>인용·조건·수치·최신성·개인정보를 최종 점검하기</p>
              <b>바로 가기 →</b>
            </button>
            <button type="button" onClick={() => window.print()}>
              <span className="resource-type">PRINT · PDF</span>
              <strong>전체 연수 노트 저장</strong>
              <p>이 페이지의 핵심 내용을 인쇄하거나 PDF로 저장하기</p>
              <b>인쇄하기 →</b>
            </button>
          </div>
        </section>

        <section id="finish" className="finish">
          <span className="eyebrow">ONE THING TO REMEMBER</span>
          <h2>
            좋은 활용은 AI에게 일을 맡기는 것이 아니라,
            <br /><strong>AI와 함께 자료를 더 깊게 읽는 것</strong>입니다.
          </h2>
          <p>자료 선택, 질문 설계, 정확성 판단, 학생의 배움에 맞춘 재설계는 여전히 교사의 몫입니다.</p>
          <div className="finish-actions">
            <a className="button button-light" href="https://notebooklm.google.com/" target="_blank" rel="noreferrer">Gemini Notebook 열기 ↗</a>
            <button className="button button-outline-light" type="button" onClick={() => jumpTo("practice")}>실습 결과 다시 보기</button>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <span className="brand-mark" aria-hidden="true">✦</span>
          <p><strong>Gemini Notebook 교사 연수</strong><br />초·중·고 교사를 위한 120분 실습 페이지</p>
        </div>
        <p>개인정보를 수집하지 않습니다. 체크와 메모는 현재 브라우저에만 저장됩니다.</p>
      </footer>

      <div className="mobile-dock" aria-label="빠른 이동">
        <button type="button" onClick={() => jumpTo("practice")}>실습</button>
        <button type="button" onClick={() => jumpTo("questions")}>프롬프트</button>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>맨 위</button>
      </div>
      <button className="back-to-top" type="button" aria-label="맨 위로 이동" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
