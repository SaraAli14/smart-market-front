import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSearch, IoMic, IoHardwareChip } from "react-icons/io5";
import axios from "axios";
import "./HomePage.css";
import {
  IoCamera,
  IoLeaf,
  IoFastFood,
  IoCafe,
  IoSnow,
  IoWater,
} from "react-icons/io5";

const API_URL =
  "https://smart-market-back-production.up.railway.app/api/products";

const categories = [
  {
    id: "fruits-vegetables",
    name: { en: "Fruits & Vegetables", ar: "فواكه وخضار" },
    icon: <IoLeaf />,
    color: "#E0D7FF",
  },
  {
    id: "dairy",
    name: { en: "Dairy", ar: "منتجات ألبان" },
    icon: <IoFastFood />,
    color: "#D9F0FF",
  },
  {
    id: "snacks",
    name: { en: "Snacks", ar: "سناكس" },
    icon: <IoFastFood />,
    color: "#FFF1D6",
  },
  {
    id: "beverages",
    name: { en: "Beverages", ar: "مشروبات" },
    icon: <IoCafe />,
    color: "#F0E6FF",
  },
  {
    id: "frozen",
    name: { en: "Frozen", ar: "مجمدات" },
    icon: <IoSnow />,
    color: "#D6FAFF",
  },
  {
    id: "cleaning",
    name: { en: "Cleaning", ar: "منظفات" },
    icon: <IoWater />,
    color: "#FFE6ED",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.state?.lang || "ar";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [voiceInput, setVoiceInput] = useState("");
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [listening, setListening] = useState(false); // حالة الاستماع

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleTextSearch = () => {
    if (!search.trim()) return;
    const matched = products.find((p) =>
      p.name?.[lang]?.toLowerCase().includes(search.toLowerCase()),
    );
    if (matched) {
      navigate(`/product/${matched.id}`, { state: { lang } });
    } else {
      alert(lang === "en" ? "Product not found" : "المنتج غير موجود");
    }
  };

  const handleVoiceSearch = () => {
    if (!voiceInput.trim()) {
      //   alert(lang === "en" ? "I didn't hear anything" : "لم أسمع اسم المنتج");
      return;
    }

    const matched = products.find((p) =>
      p.name?.[lang]?.toLowerCase().includes(voiceInput.trim().toLowerCase()),
    );

    if (!matched) {
      //   alert(lang === "en" ? "Product not found" : "المنتج غير موجود");
      return;
    }

    const locationText =
      matched.location?.[lang] || (lang === "en" ? "Aisle 3" : "الممر 3");

    const msg =
      lang === "ar"
        ? `المنتج ${matched.name.ar}. سعره ${matched.price} جنيه. موجود في ${locationText}`
        : `Product ${matched.name.en}. Price ${matched.price}. Located at ${locationText}`;

    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = lang === "ar" ? "ar-EG" : "en-US";

    // صوت طفولي جدًا
    utterance.rate = 1.15; // سرعة معتدلة وحيوية
    utterance.pitch = 1.9; // نبرة طفولية مرتفعة جدًا
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const robotVoice = voices.find((v) =>
      lang === "ar"
        ? v.lang.includes("ar")
        : v.lang.includes("en") && v.name.toLowerCase().includes("google"),
    );
    if (robotVoice) utterance.voice = robotVoice;

    window.speechSynthesis.speak(utterance);

    navigate(`/product/${matched.id}`, { state: { lang } });
    setVoiceInput("");
    setShowVoiceModal(false);
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        lang === "en"
          ? "Your browser does not support voice recognition"
          : "المتصفح لا يدعم الصوت",
      );
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang === "ar" ? "ar-EG" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setVoiceInput("");
    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      alert(
        lang === "en"
          ? "Voice recognition failed"
          : "حدث خطأ في التعرف على الصوت",
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      handleVoiceSearch();
    };
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <div className="home-header">
        <div>
          <h2>{lang === "en" ? "Shopping Assistant" : "مساعد التسوق"}</h2>
          <p>
            {lang === "en" ? "How can I help you today?" : "أقدر أساعدك إزاي؟"}
          </p>
        </div>
        <div className="robot-box">
          <IoHardwareChip size={28} color="#2563eb" />
        </div>
      </div>

      <div className="search-card">
        <div className="search-input">
          <IoSearch size={20} color="#999" />
          <input
            type="text"
            placeholder={
              lang === "en" ? "Search for a product..." : "ابحث عن منتج..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
          />
        </div>
        <button className="mic-btn" onClick={() => setShowVoiceModal(true)}>
          <IoMic size={22} color="#fff" />
        </button>
        <button className="camera-btn">
          <IoCamera size={22} color="#fff" />
        </button>
      </div>

      <div className="grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`/category/${cat.id}`, { state: { lang } })}
          >
            <div className="icon-bg" style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <p>{cat.name[lang]}</p>
          </div>
        ))}
      </div>
      {/* VOICE MODAL */}
      {showVoiceModal && (
        <div className="voice-modal">
          <div className="voice-modal-content">
            <h4>
              {listening
                ? lang === "en"
                  ? "Listening..."
                  : "جاري الاستماع..."
                : lang === "en"
                  ? "Say the product name"
                  : "قل اسم المنتج"}
            </h4>

            <button
              className="voice-search-btn"
              onClick={startVoiceRecognition}
            >
              {lang === "en" ? "Start Voice" : "ابدأ الصوت"}
            </button>

            <button
              className="voice-cancel-btn"
              onClick={() => setShowVoiceModal(false)}
            >
              {lang === "en" ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
