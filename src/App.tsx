import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChefHat, MapPin, Music2, Sparkles } from "lucide-react";
import "./App.css";

type Attendance = "yes" | "no";
type SoundState = "idle" | "playing" | "blocked";

type FormData = {
  name: string;
  attendance: Attendance;
  drinks: string[];
  customDrink: string;
};

type TimelineItem = {
  time: string;
  label: string;
  description: ReactNode;
  icon: ReactNode;
  timeClassName: string;
  iconClassName: string;
  subtitleClassName: string;
  descriptionClassName: string;
  lineClassName: string;
};

const WEDDING_DATE = new Date("2026-07-25T00:00:00").getTime();
const RSVP_DEADLINE = "01.06.2026";
const MAP_URL =
  "https://yandex.ru/maps/org/iz_za_lyubvi/57220165080/?ll=37.599355%2C55.468076&z=17";
const CUSTOM_DRINK_OPTION = "*Свой вариант ответа";
const NO_ALCOHOL_OPTION = "Не буду пить";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mpqozrap";
const PRELOAD_IMAGES = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/ken.png",
  "/images/barby.png",
];
const PRELOAD_AUDIO = "/images/sound.MP3";
const FONT_PRELOAD_SAMPLE =
  "Мы ждем вас на свадьбе 25.07.2026 We Meet We Party Из-за любви";
const FONT_VARIANTS_TO_PRELOAD = [
  '400 1em "Caveat"',
  '500 1em "Caveat"',
  '600 1em "Caveat"',
  '700 1em "Caveat"',
  '500 1em "Cormorant Garamond"',
  '400 1em "Great Vibes"',
  '400 1em "Lora"',
  '500 1em "Lora"',
  '600 1em "Lora"',
];
const INITIAL_FORM_DATA: FormData = {
  name: "",
  attendance: "yes",
  drinks: [],
  customDrink: "",
};

const INVITATION_LINES = ["Вы приглашены", "Вы приглашены", "Вы приглашены"];
const DRINK_OPTIONS = [
  "Шампанское",
  "Вино",
  "Джин",
  "Виски",
  "Коньяк",
  "Водка",
  NO_ALCOHOL_OPTION,
  CUSTOM_DRINK_OPTION,
];
const PALETTE_COLORS = [
  "#D8C5AD",
  "#D9BFB8",
  "#A8B295",
  "#9A8C80",
  "#7A5D4A",
  "#6A6C44",
  "#5A5046",
  "#000000",
];
const WISHES = [
  <>
    Хотим, чтобы все гости могли отдохнуть
    <br />
    по-взрослому, поэтому говорим
    <br />
    заранее спасибо за понимание:
    <br />
    праздник для гостей 12+.
  </>,
  <>
    Будем очень признательны, если Вы
    <br />
    воздержитесь от криков «Горько». Ведь
    <br />
    поцелуй это знак выражения чувств, и
    <br />
    он не может быть по заказу.
  </>,
  <>
    Лучшая поддержка для нас это ваши
    <br />
    искренние пожелания и лучезарные
    <br />
    улыбки, остальное можно поместить в
    <br />
    конверт.
  </>,
];
const CALENDAR_WEEK_DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const CALENDAR_DAYS = [
  "",
  "",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    time: "12:30",
    label: "We Meet",
    description: (
      <>
        Сбор гостей у
        <br />
        ЗАГСа
      </>
    ),
    icon: <MapPin size={24} color="#4B4F58" />,
    timeClassName: "t1",
    iconClassName: "i1",
    subtitleClassName: "s1",
    descriptionClassName: "d1",
    lineClassName: "hl1",
  },
  {
    time: "13:15",
    label: "We Do",
    description: (
      <>
        Церемония
        <br />
        регистрации
      </>
    ),
    icon: (
      <div className="rings">
        <div className="ring1" />
        <div className="ring2" />
      </div>
    ),
    timeClassName: "t2",
    iconClassName: "i2",
    subtitleClassName: "s2",
    descriptionClassName: "d2",
    lineClassName: "hl2",
  },
  {
    time: "14:00",
    label: "We Party",
    description: "Начало фуршета",
    icon: <ChefHat size={24} color="#4B4F58" />,
    timeClassName: "t3",
    iconClassName: "i3",
    subtitleClassName: "s3",
    descriptionClassName: "d3",
    lineClassName: "hl3",
  },
  {
    time: "22:00",
    label: "The End",
    description: (
      <>
        Завершение
        <br />
        вечера
      </>
    ),
    icon: <Sparkles size={24} color="#4B4F58" />,
    timeClassName: "t4",
    iconClassName: "i4",
    subtitleClassName: "s4",
    descriptionClassName: "d4",
    lineClassName: "hl4",
  },
];

function ScrollFade({
  children,
  delay = 0,
  yOffset = 40,
}: {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: prefersReducedMotion ? 0.35 : 0.7,
        delay,
        ease: "easeOut",
      }}
      className="scroll-fade"
    >
      {children}
    </motion.div>
  );
}

function getTimeLeft(targetDate: number) {
  const difference = targetDate - Date.now();

  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  return {
    days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(
      2,
      "0",
    ),
    minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
  };
}

function getPreferredDrinks(formData: FormData) {
  return formData.drinks.map((drink) =>
    drink === CUSTOM_DRINK_OPTION && formData.customDrink.trim()
      ? `Другое: ${formData.customDrink.trim()}`
      : drink,
  );
}

function CountdownCard() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(WEDDING_DATE));

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTimeLeft(getTimeLeft(WEDDING_DATE));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="cd-paper">
      <div className="paper-top-line" />
      <div className="cd-values">
        {[
          { label: "дни", value: timeLeft.days },
          { label: "часы", value: timeLeft.hours },
          { label: "минуты", value: timeLeft.minutes },
          { label: "сек", value: timeLeft.seconds },
        ].map((item, index) => (
          <div className="cd-fragment" key={item.label}>
            <div className="cd-group">
              <span className="cd-val">{item.value}</span>
              <span className="cd-label">{item.label}</span>
            </div>
            {index < 3 && <span className="cd-sep">:</span>}
          </div>
        ))}
      </div>
      <div className="paper-bottom-line" />
    </div>
  );
}

function useFontReadiness() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      if (typeof document === "undefined" || !("fonts" in document)) {
        if (isMounted) {
          setFontsReady(true);
        }
        return;
      }

      try {
        await Promise.all(
          FONT_VARIANTS_TO_PRELOAD.map((font) =>
            document.fonts.load(font, FONT_PRELOAD_SAMPLE),
          ),
        );
        await document.fonts.ready;
      } finally {
        if (isMounted) {
          setFontsReady(true);
        }
      }
    };

    void loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return fontsReady;
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function preloadAudio(src: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio();
    const cleanup = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("loadeddata", onReady);
      audio.removeEventListener("error", onReady);
    };
    const onReady = () => {
      cleanup();
      resolve();
    };

    audio.preload = "auto";
    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("loadeddata", onReady, { once: true });
    audio.addEventListener("error", onReady, { once: true });
    audio.src = src;
    audio.load();
  });
}

function useMediaReadiness() {
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadAssets = async () => {
      const timeoutMs = 6000;
      const withTimeout = (promise: Promise<void>) =>
        Promise.race([
          promise,
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, timeoutMs);
          }),
        ]);

      await Promise.allSettled([
        ...PRELOAD_IMAGES.map((src) => withTimeout(preloadImage(src))),
        withTimeout(preloadAudio(PRELOAD_AUDIO)),
      ]);

      if (isMounted) {
        setMediaReady(true);
      }
    };

    void preloadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  return mediaReady;
}

function FontPreloadProbe() {
  return (
    <div className="font-preload-probe" aria-hidden="true">
      <span className="font-probe caveat-400">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe caveat-500">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe caveat-600">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe caveat-700">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe cormorant-500">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe great-vibes-400">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe lora-400">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe lora-500">{FONT_PRELOAD_SAMPLE}</span>
      <span className="font-probe lora-600">{FONT_PRELOAD_SAMPLE}</span>
    </div>
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fontsReady = useFontReadiness();
  const mediaReady = useMediaReadiness();

  const [entered, setEntered] = useState(false);
  const [soundState, setSoundState] = useState<SoundState>("idle");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const canEnterInvitation = fontsReady && mediaReady;

  useEffect(() => {
    document.body.style.overflowY = entered ? "auto" : "hidden";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [entered]);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const tryPlaySound = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      setSoundState("playing");
    } catch {
      setSoundState("blocked");
    }
  };

  const handleEnterInvitation = () => {
    if (!canEnterInvitation) {
      return;
    }

    setEntered(true);
    void tryPlaySound();
  };

  const handleSoundToggle = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      await tryPlaySound();
      return;
    }

    audio.pause();
    setSoundState("idle");
  };

  const handleDrinkToggle = (drink: string) => {
    setFormData((prev) => {
      const drinks = prev.drinks.includes(drink)
        ? prev.drinks.filter((item) => item !== drink)
        : [...prev.drinks, drink];

      return {
        ...prev,
        drinks,
        customDrink: drinks.includes(CUSTOM_DRINK_OPTION) ? prev.customDrink : "",
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Пожалуйста, введите ваше имя и фамилию.");
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedName = formData.name.trim();
      const attendanceText =
        formData.attendance === "yes"
          ? "Да, с удовольствием"
          : "К сожалению, нет";
      const drinks = getPreferredDrinks(formData);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          attendance: attendanceText,
          drinks: drinks.length > 0 ? drinks.join(", ") : "Не выбрано",
        }),
      });

      if (!response.ok) {
        let message = "Не удалось отправить форму. Попробуйте чуть позже.";

        try {
          const errorData = (await response.json()) as {
            errors?: Array<{ message?: string }>;
          };
          message = errorData.errors?.[0]?.message ?? message;
        } catch {
          // Keep default error text if response is not JSON.
        }

        setErrorMsg(message);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Formspree request failed", error);
      setErrorMsg(
        "Не удалось отправить форму. Проверьте подключение к сети и повторите попытку.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLocation = () => {
    window.open(MAP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="experience-shell">
      <FontPreloadProbe />
      <audio ref={audioRef} preload="auto" loop>
        <source src="/images/sound.MP3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.section
            key="preview"
            className="preview-screen-minimal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.008 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="preview-ambient preview-ambient-one"
              animate={
                prefersReducedMotion ? undefined : { x: [0, 16, 0], y: [0, -14, 0] }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="preview-ambient preview-ambient-two"
              animate={
                prefersReducedMotion ? undefined : { x: [0, -18, 0], y: [0, 10, 0] }
              }
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="preview-ambient preview-ambient-three"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [0, -10, 0], opacity: [0.32, 0.48, 0.32] }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="preview-grain" />

            <motion.div
              className="preview-text-stage"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.button
                className="preview-text-button"
                onClick={handleEnterInvitation}
                disabled={!canEnterInvitation}
                aria-busy={!canEnterInvitation}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.span
                  className="preview-text-button-label"
                  initial={{ y: prefersReducedMotion ? 0 : "115%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.85,
                    delay: prefersReducedMotion ? 0 : 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {canEnterInvitation ? "Открыть приглашение" : "Загружаем..."}
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          <motion.div
            key="main"
            className="site-shell"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button className="sound-chip" onClick={handleSoundToggle} type="button">
              <Music2 size={14} />
              {soundState === "playing"
                ? "Музыка играет"
                : soundState === "blocked"
                  ? "Включить звук"
                  : "Музыка"}
            </button>

            <div className="mobile-layout">
              <section className="hero">
                <img src="/images/3.png" alt="Hero top" className="hero-img" />
                <h2 className="hero-title">наконец-то</h2>
                <h1 className="hero-names">МЫ ЖЕНИМСЯ</h1>

                <div className="absolute-girl-text">- давай (хихик)</div>
                <img src="/images/2.png" alt="girl" className="absolute-girl-img" />

                <div className="absolute-boy-text">
                  - малышка, тебе винду
                  <br />
                  переустановить ?
                </div>
                <img
                  src="/images/1.png"
                  alt="boy"
                  className="absolute-boy-img boy-flip"
                />
              </section>

              <motion.div
                className="new-bar"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {INVITATION_LINES.map((line, index) => (
                  <span className={`inv-${index + 1}`} key={`${line}-${index}`}>
                    {line}
                  </span>
                ))}
              </motion.div>

              <section className="date-section">
                <ScrollFade>
                  <div className="date-title">МЫ ЖДЁМ</div>
                  <div className="date-month">Вас</div>
                  <div className="date-row">
                    <div className="date-big">25.07.2026</div>
                  </div>
                  <div className="new-cal">
                    <div className="cal-month">Июль</div>
                    <div className="cal-grid">
                      {CALENDAR_WEEK_DAYS.map((day) => (
                        <span className="cal-day" key={day}>
                          {day}
                        </span>
                      ))}
                      {CALENDAR_DAYS.map((day, index) =>
                        day ? (
                          <span
                            className={day === "25" ? "highlight" : undefined}
                            key={`${day}-${index}`}
                          >
                            {day}
                          </span>
                        ) : (
                          <span className="empty" key={`empty-${index}`} />
                        ),
                      )}
                    </div>
                  </div>
                </ScrollFade>
              </section>

              <section className="location-section">
                <ScrollFade>
                  <div className="loc-title">Локация</div>
                  <div className="loc-sub">
                    НАША СВАДЬБА
                    <br />
                    ПРОЙДЁТ В
                  </div>

                  <div className="main-card">
                    <img
                      src="/images/4.png"
                      alt="Location main"
                      className="main-photo"
                    />
                    <div className="loc-name">«ИЗ-ЗА ЛЮБВИ»</div>
                    <div className="loc-addr">
                      Адрес: Подольский район, п. Быково,
                      <br />
                      Луговая 17
                    </div>
                  </div>

                  <div className="thumbs">
                    <img src="/images/5.jpg" alt="Thumb 1" className="thumb" />
                    <img src="/images/6.jpg" alt="Thumb 2" className="thumb" />
                  </div>

                  <button className="loc-btn" onClick={openLocation} type="button">
                    <span className="btn-text">Как добраться</span>
                  </button>
                </ScrollFade>
              </section>

              <section className="timeline-section">
                <ScrollFade>
                  <div className="tl-head">ТАЙМИНГ</div>
                  <div className="tl-axis" />

                  {TIMELINE_ITEMS.map((item) => (
                    <div key={item.time}>
                      <div className={`tl-time ${item.timeClassName}`}>{item.time}</div>
                      <div className={`tl-icon ${item.iconClassName}`}>{item.icon}</div>
                      <div className={`tl-sub ${item.subtitleClassName}`}>
                        {item.label}
                      </div>
                      <div className={`tl-text ${item.descriptionClassName}`}>
                        {item.description}
                      </div>
                      <div className={`tl-line ${item.lineClassName}`} />
                    </div>
                  ))}
                </ScrollFade>
              </section>

              <section className="dress-code">
                <ScrollFade>
                  <div className="dc-title">Дресс-Код</div>
                  <div className="dc-text">
                    Мы очень ждём и готовимся к нашему
                    <br />
                    незабываемому дню. Поддержите нас
                    <br />
                    вашими улыбками и объятиями, а также
                    <br />
                    красивыми нарядами в палитре
                    <br />
                    мероприятия
                  </div>
                  <div className="palette">
                    {PALETTE_COLORS.map((color) => (
                      <div key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </ScrollFade>
              </section>

              <section className="wishes">
                <ScrollFade>
                  <div className="wish-title">Пожелания</div>
                  <div className="wish-line" />
                  {WISHES.map((wish, index) => (
                    <div
                      className={`wish-text${index > 0 ? ` w${index + 1}` : ""}`}
                      key={index}
                    >
                      {wish}
                    </div>
                  ))}
                </ScrollFade>
              </section>

              <section className="countdown">
                <ScrollFade>
                  <div className="cd-title">
                    ДО НАШЕЙ
                    <br />
                    СВАДЬБЫ ОСТАЛОСЬ
                  </div>
                  <CountdownCard />
                </ScrollFade>
              </section>

              <section className="rsvp-top">
                <ScrollFade>
                  <div className="rsvp-stage">
                    <div className="rsvp-t1">БУДЕМ РАДЫ ВИДЕТЬ</div>
                    <div className="rsvp-t2">Вас</div>
                    <div className="rsvp-t3">
                      Пожалуйста, подтвердите ваше
                      <br />
                      присутствие на нашей свадьбе до:
                    </div>

                    <div className="rsvp-date-row">
                      <div className="rsvp-line" />
                      <div className="rsvp-date-big">{RSVP_DEADLINE}</div>
                      <div className="rsvp-line" />
                    </div>
                  </div>
                </ScrollFade>
              </section>

              <section className="rsvp-form-wrapper">
                <ScrollFade>
                  {isSuccess ? (
                    <div className="success-scene">
                      <motion.img
                        src="/images/ken.png"
                        alt=""
                        aria-hidden="true"
                        className="success-figure success-figure-left"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -88, scale: 0.94 }
                        }
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0.2 : 0.7,
                          delay: prefersReducedMotion ? 0 : 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                      <div className="new-form success-card">
                        <div className="success-card-icon">Спасибо</div>
                        <div className="f-label success-card-title">
                          Анкета отправлена!
                        </div>
                        <div className="f-label success-card-text">
                          Спасибо за ваш ответ, мы очень ждём нашей встречи!
                        </div>
                      </div>
                      <motion.img
                        src="/images/barby.png"
                        alt=""
                        aria-hidden="true"
                        className="success-figure success-figure-right"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: 88, scale: 0.94 }
                        }
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0.2 : 0.7,
                          delay: prefersReducedMotion ? 0 : 0.16,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  ) : (
                    <form className="new-form" onSubmit={handleSubmit}>
                      <div className="f-label">Ваше имя и фамилия *</div>
                      <input
                        className="f-input"
                        type="text"
                        value={formData.name}
                        onChange={(event) => setField("name", event.target.value)}
                        required
                      />

                      <div className="f-label">Планируете ли Вы присутствовать?</div>
                      <label className="f-opt">
                        <input
                          type="radio"
                          name="attendance"
                          checked={formData.attendance === "yes"}
                          onChange={() => setField("attendance", "yes")}
                        />
                        Да, с удовольствием
                      </label>
                      <label className="f-opt">
                        <input
                          type="radio"
                          name="attendance"
                          checked={formData.attendance === "no"}
                          onChange={() => setField("attendance", "no")}
                        />
                        К сожалению, нет
                      </label>

                      {formData.attendance === "yes" && (
                        <>
                          <div className="f-label">Ваши предпочтения из напитков</div>
                          <div className="f-checks">
                            {DRINK_OPTIONS.map((drink) => (
                              <label className="f-check" key={drink}>
                                <input
                                  type="checkbox"
                                  checked={formData.drinks.includes(drink)}
                                  onChange={() => handleDrinkToggle(drink)}
                                />
                                {drink}
                                {drink === NO_ALCOHOL_OPTION &&
                                  formData.drinks.includes(NO_ALCOHOL_OPTION) && (
                                    <span className="drink-emoji">🤡</span>
                                  )}
                              </label>
                            ))}
                          </div>

                          {formData.drinks.includes(CUSTOM_DRINK_OPTION) && (
                            <input
                              className="f-input custom-drink-input"
                              type="text"
                              placeholder="Напишите ваш напиток..."
                              value={formData.customDrink}
                              onChange={(event) =>
                                setField("customDrink", event.target.value)
                              }
                            />
                          )}
                        </>
                      )}

                      {errorMsg && <div className="form-error">{errorMsg}</div>}

                      <button
                        className="f-submit"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Отправляем..." : "Отправить"}
                      </button>
                    </form>
                  )}
                </ScrollFade>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
