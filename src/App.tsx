import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './App.css';
import { MapPin, ChefHat, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function ScrollFade({ children, delay = 0, yOffset = 40 }: { children: ReactNode, delay?: number, yOffset?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00", hours: "00", minutes: "00", seconds: "00"
  });

  const [formData, setFormData] = useState({
    name: '',
    attendance: 'yes',
    pairName: '',
    drinks: [] as string[],
    customDrink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDrinkChange = (drink: string) => {
    setFormData(prev => ({
      ...prev,
      drinks: prev.drinks.includes(drink) 
        ? prev.drinks.filter(d => d !== drink)
        : [...prev.drinks, drink]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!formData.name) {
      setErrorMsg("Пожалуйста, введите ваше имя и фамилию.");
      return;
    }

    setIsSubmitting(true);

    const token = import.meta.env.VITE_TG_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TG_CHAT_ID;

    if (!token || !chatId || token === 'YOUR_BOT_TOKEN_HERE') {
      setErrorMsg("Вам необходимо настроить Telegram-бота в файле .env (см. инструкцию).");
      setIsSubmitting(false);
      return;
    }

    let finalDrinks = [...formData.drinks];
    if (finalDrinks.includes('*Свой вариант ответа') && formData.customDrink.trim()) {
      finalDrinks = finalDrinks.map(d => d === '*Свой вариант ответа' ? `Другое: ${formData.customDrink}` : d);
    }

    const message = `
🎉 Новая анкета гостя!
👤 Имя: ${formData.name}
💌 Присутствие: ${formData.attendance === 'yes' ? '✅ Да, с удовольствием' : '❌ К сожалению, нет'}
👫 Пара: ${formData.pairName || 'Без пары'}
🍷 Напитки: ${finalDrinks.length > 0 ? finalDrinks.join(', ') : 'Не выбрано'}
    `;

    try {
      // Отправляем GET запрос вместо POST, чтобы избежать возможных блокировок CORS (Preflight)
      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        console.error("Telegram API Error:", errorData);
        setErrorMsg(`Ошибка Telegram: ${errorData.description || 'Проверьте токен и chat_id'}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Не удалось отправить данные. Проверьте подключение к интернету или попробуйте включить VPN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const targetDate = new Date("2026-07-25T00:00:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);


  const onClick = () => {
    window.open("https://yandex.ru/maps/org/iz_za_lyubvi/57220165080/?ll=37.599355%2C55.468076&z=17", "_blank");
  }

  return (
    <div className="mobile-layout">
      {/* HERO SECTION */}
      <section className="hero">
        <img src="/images/3.png" alt="Hero top" className="hero-img" />
        <h2 className="hero-title">наконец-то</h2>
        <h1 className="hero-names">МЫ ЖЕНИМСЯ</h1>

        {/* Absolute 1-in-1 layout based on provided image */}
        <div className="absolute-girl-text">- давай (хихик)</div>
        <img src="/images/2.png" alt="girl" className="absolute-girl-img" />

        <div className="absolute-boy-text">- малышка, тебе винду<br />переустановить ?</div>
        <img src="/images/1.png" alt="boy" className="absolute-boy-img boy-flip" />
      </section>

      {/* NEW BAR */}
      <motion.div
        className="new-bar"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="inv-1">Вы приглашены</span>
        <span className="inv-2">Вы приглашены</span>
        <span className="inv-3">Вы приглашены</span>
      </motion.div>

      {/* DATE SECTION */}
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
              <span className="cal-day">ПН</span><span className="cal-day">ВТ</span><span className="cal-day">СР</span><span className="cal-day">ЧТ</span><span className="cal-day">ПТ</span><span className="cal-day">СБ</span><span className="cal-day">ВС</span>
              <span className="empty"></span><span className="empty"></span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
              <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span className="highlight">25</span><span>26</span>
              <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* LOCATION SECTION */}
      <section className="location-section">
        <ScrollFade>
          <div className="loc-title">Локация</div>
          <div className="loc-sub">НАША СВАДЬБА<br />ПРОЙДЁТ В</div>

          <div className="main-card">
            <img src="/images/4.png" alt="Location main" className="main-photo" />
            <div className="loc-name">«ИЗ-ЗА ЛЮБВИ»</div>
            <div className="loc-addr">Адрес: Подольский район, п. Быково,<br />Луговая 17</div>
          </div>

          <div className="thumbs">
            <img src="/images/5.jpg" alt="Thumb 1" className="thumb" />
            <img src="/images/6.jpg" alt="Thumb 2" className="thumb" />
          </div>

          <button className="loc-btn" onClick={onClick}>
            <span className="btn-text">Как добраться</span>
          </button>
        </ScrollFade>
      </section>

      {/* TIMELINE SECTION */}
      <section className="timeline-section">
        <ScrollFade>
          <div className="tl-head">ТАЙМИНГ</div>
          <div className="tl-axis"></div>

          {/* Step 1 */}
          <div className="tl-time t1">12:30</div>
          <div className="tl-icon i1"><MapPin size={24} color="#4B4F58" /></div>
          <div className="tl-sub s1">We Meet</div>
          <div className="tl-text d1">Сбор гостей у<br />ЗАГСа</div>
          <div className="tl-line hl1"></div>

          {/* Step 2 */}
          <div className="tl-time t2">13:15</div>
          <div className="tl-icon i2">
            <div className="rings">
              <div className="ring1"></div>
              <div className="ring2"></div>
            </div>
          </div>
          <div className="tl-sub s2">We Do</div>
          <div className="tl-text d2">Церемония<br />регистрации</div>
          <div className="tl-line hl2"></div>

          {/* Step 3 */}
          <div className="tl-time t3">14:00</div>
          <div className="tl-icon i3"><ChefHat size={24} color="#4B4F58" /></div>
          <div className="tl-sub s3">We Party</div>
          <div className="tl-text d3">Начало фуршета</div>
          <div className="tl-line hl3"></div>

          {/* Step 4 */}
          <div className="tl-time t4">22:00</div>
          <div className="tl-icon i4"><Sparkles size={24} color="#4B4F58" /></div>
          <div className="tl-sub s4">The End</div>
          <div className="tl-text d4">Завершение<br />вечера</div>
          <div className="tl-line hl4"></div>
        </ScrollFade>
      </section>

      {/* DRESS CODE SECTION */}
      <section className="dress-code">
        <ScrollFade>
          <div className="dc-title">Дресс-Код</div>
          <div className="dc-text">
            Мы очень ждём и готовимся к нашему<br />
            незабываемому дню! Поддержите нас<br />
            Вашими улыбками и объятиями, а также<br />
            красивыми нарядами в палитре<br />
            мероприятия
          </div>
          <div className="palette">
            <div style={{ backgroundColor: '#D8C5AD' }} />
            <div style={{ backgroundColor: '#D9BFB8' }} />
            <div style={{ backgroundColor: '#A8B295' }} />
            <div style={{ backgroundColor: '#9A8C80' }} />
            <div style={{ backgroundColor: '#7A5D4A' }} />
            <div style={{ backgroundColor: '#6A6C44' }} />
            <div style={{ backgroundColor: '#5A5046' }} />
            <div style={{ backgroundColor: '#000000' }} />
          </div>
        </ScrollFade>
      </section>

      {/* WISHES SECTION */}
      <section className="wishes">
        <ScrollFade>
          <div className="wish-title">Пожелания</div>
          <div className="wish-line" />
          <div className="wish-text">
            Хотим, чтобы все гости могли отдохнуть<br />
            по-взрослому, поэтому говорим<br />
            заранее спасибо за понимание —<br />
            праздник для гостей 12+.
          </div>
          <div className="wish-text w2">
            Будем очень признательны, если Вы<br />
            воздержитесь от криков «Горько». Ведь<br />
            поцелуй — это знак выражения чувств, и<br />
            он не может быть по заказу.
          </div>
          <div className="wish-text w3">
            Лучшая поддержка для нас - ваши<br />
            искренние пожелания и лучезарные<br />
            улыбки, остальное можно поместить в<br />
            конверт.
          </div>
        </ScrollFade>
      </section>

      {/* COUNTDOWN SECTION - Node ID: 14FYO containing gbWRC */}
      <section className="countdown">
        <ScrollFade>
          <div className="cd-title">ДО НАШЕЙ<br />СВАДЬБЫ ОСТАЛОСЬ</div>
          <div className="cd-paper gbWRC">
            <div className="paper-top-line" />
            <div className="cd-vals kEqpg">
              <div className="cd-group">
                <span className="cd-val">{timeLeft.days}</span>
                <span className="cd-label">дни</span>
              </div>
              <span className="cd-sep">:</span>
              <div className="cd-group">
                <span className="cd-val">{timeLeft.hours}</span>
                <span className="cd-label">часы</span>
              </div>
              <span className="cd-sep">:</span>
              <div className="cd-group">
                <span className="cd-val">{timeLeft.minutes}</span>
                <span className="cd-label">минуты</span>
              </div>
              <span className="cd-sep">:</span>
              <div className="cd-group">
                <span className="cd-val">{timeLeft.seconds}</span>
                <span className="cd-label">сек</span>
              </div>
            </div>
            <div className="paper-bottom-line" />
          </div>
        </ScrollFade>
      </section>

      {/* RSVP TOP */}
      <section className="rsvp-top">
        <ScrollFade>
          <div style={{ position: 'relative', width: '390px', height: '422px' }}>
            <div className="rsvp-t1">БУДЕМ РАДЫ ВИДЕТЬ</div>
            <div className="rsvp-t2">Вас</div>
            <div className="rsvp-t3">Пожалуйста, подтвердите ваше<br />присутствие на нашей свадьбе до:</div>

            <div className="rsvp-date-row">
              <div className="rsvp-line" />
              <div className="rsvp-date-big">25.07.2026</div>
              <div className="rsvp-line" />
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* RSVP FORM */}
      <section className="rsvp-form-wrapper">
        <ScrollFade>
          {isSuccess ? (
            <div className="new-form" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>💌</div>
              <div className="f-label" style={{ fontSize: '24px', color: '#c6215d' }}>Анкета отправлена!</div>
              <div className="f-label" style={{ marginTop: '10px' }}>Спасибо за ваш ответ, мы очень ждем нашей встречи!</div>
            </div>
          ) : (
            <form className="new-form" onSubmit={handleSubmit}>
              <div className="f-label">Ваше имя и фамилия *</div>
              <input 
                className="f-input" 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />

              <div className="f-label">Планируете ли Вы присутствовать?</div>
              <label className="f-opt">
                <input 
                  type="radio" 
                  name="att" 
                  checked={formData.attendance === 'yes'}
                  onChange={() => setFormData({...formData, attendance: 'yes'})}
                /> Да, с удовольствием
              </label>
              <label className="f-opt">
                <input 
                  type="radio" 
                  name="att" 
                  checked={formData.attendance === 'no'}
                  onChange={() => setFormData({...formData, attendance: 'no'})}
                /> К сожалению, нет
              </label>

              {formData.attendance === 'yes' && (
                <>
                  <div className="f-label">Если Вы будете со своей парой, укажите его/ее имя и фамилию</div>
                  <input 
                    className="f-input" 
                    type="text" 
                    value={formData.pairName} 
                    onChange={(e) => setFormData({...formData, pairName: e.target.value})}
                  />

                  <div className="f-label">Ваши предпочтения из напитков</div>
                  <div className="f-checks">
                    {['Шампанское', 'Вино', 'Джин', 'Виски', 'Коньяк', 'Водка', 'Не буду пить', '*Свой вариант ответа'].map((drink) => (
                      <label className="f-check" key={drink} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.drinks.includes(drink)}
                          onChange={() => handleDrinkChange(drink)}
                        /> 
                        {drink}
                        {drink === 'Не буду пить' && formData.drinks.includes('Не буду пить') && (
                          <span style={{ fontSize: '20px', animation: 'bounce 0.5s' }}>🤡</span>
                        )}
                      </label>
                    ))}
                  </div>
                  {formData.drinks.includes('*Свой вариант ответа') && (
                    <input 
                      className="f-input" 
                      type="text" 
                      placeholder="Напишите ваш напиток..." 
                      value={formData.customDrink} 
                      onChange={(e) => setFormData({...formData, customDrink: e.target.value})}
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </>
              )}

              {errorMsg && (
                <div style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}

              <button className="f-submit" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Отправляем...' : 'Отправить'}
              </button>
            </form>
          )}
        </ScrollFade>
      </section>
    </div>
  );
}
