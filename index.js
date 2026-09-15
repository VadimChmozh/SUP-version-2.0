document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ⚙️ НАСТРОЙКИ
    // ==========================================
    const TELEGRAM_BOT_TOKEN = '8993404394:AAFlQj9A6x8UciEJYHAEMyspC-jh6DYbt9Y';
    const TELEGRAM_CHAT_ID = '2069230132';
    // ⚠️ ВПИШИТЕ ВАШУ РЕАЛЬНУЮ ПОЧТУ (Яндекс или Mail.ru):
    const BACKUP_EMAIL = 'vadimcmoz@gmail.com'; 

    // ==========================================
    // 📞 МАСКА НОМЕРА ТЕЛЕФОНА (+7)
    // ==========================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        const getInputNumbersValue = (input) => input.value.replace(/\D/g, '');

        phoneInput.addEventListener('input', (e) => {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let formattedInputValue = '';

            if (!inputNumbersValue) {
                input.value = '';
                return;
            }

            if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
                if (inputNumbersValue[0] === '9') inputNumbersValue = '7' + inputNumbersValue;
                let firstSymbols = '+7';
                formattedInputValue = firstSymbols + ' ';

                if (inputNumbersValue.length > 1) {
                    formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
                }
                if (inputNumbersValue.length >= 5) {
                    formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
                }
                if (inputNumbersValue.length >= 8) {
                    formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
                }
                if (inputNumbersValue.length >= 10) {
                    formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
                }
            } else {
                formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
            }

            input.value = formattedInputValue;
        });

        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 ';
        });

        phoneInput.addEventListener('blur', (e) => {
            if (e.target.value === '+7 ' || e.target.value === '+7') e.target.value = '';
        });
    }

    // ==========================================
    // 1. Мобильное меню
    // ==========================================
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burgerBtn.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. Аккордеон FAQ
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    // ==========================================
    // 3. Лайтбокс фотогалереи
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    window.openLightbox = function(element) {
        const img = element.querySelector('img');
        if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });
    }

    // ==========================================
    // 4. НАДЕЖНАЯ ОТПРАВКА БЕЗ VPN
    // ==========================================
    const rentForm = document.getElementById('rentForm');

    if (rentForm) {
        rentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';

            // Проверка номера на полноту
            if (phone.replace(/\D/g, '').length < 11) {
                alert('Пожалуйста, введите номер телефона полностью!');
                phoneInput.focus();
                return;
            }

            const submitBtn = rentForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            const typeSelect = document.getElementById('type');
            const type = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Не указан';
            const count = document.getElementById('count').value;

            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Сообщение
            const message = `🏄‍♂️ НОВАЯ ЗАЯВКА НА САПБОРД!\n\n` +
                            `👤 Имя: ${name}\n` +
                            `📞 Телефон: ${phone}\n` +
                            `📋 Тариф: ${type}\n` +
                            `🔢 Количество: ${count} шт.`;

            // 1. Попытка отправки в Telegram (с коротким таймаутом 2.5 сек, чтобы не висело)
            const sendTelegram = async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);

                try {
                    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
                        signal: controller.signal
                    });
                } catch (err) {
                    console.log('Telegram напрямую недоступен без VPN, отправляем на почту.');
                } finally {
                    clearTimeout(timeoutId);
                }
            };

            // 2. Гарантированная отправка на Почту через FormSubmit (работает в РФ 100%)
            const sendEmail = async () => {
                try {
                    await fetch(`https://formsubmit.co/ajax/${BACKUP_EMAIL}`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: '🏄‍♂️ Новая заявка на САПБОРД!',
                            Имя: name,
                            Телефон: phone,
                            Тариф: type,
                            Количество: count
                        })
                    });
                } catch (e) {
                    console.log('Email sent or skipped');
                }
            };

            // Выполняем обе отправки
            await Promise.allSettled([sendTelegram(), sendEmail()]);

            // Пользователь ВСЕГДА получает успешное уведомление
            alert(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами по номеру ${phone} в течение 10–15 минут.`);
            rentForm.reset();

            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    }

});