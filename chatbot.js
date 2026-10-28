(function () {
  // Estilos CSS dinâmicos integrados à paleta da Banca Fassina
  const styles = `
    .chatbot-widget {
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 9999;
      font-family: 'Poppins', sans-serif;
    }
    .chatbot-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #382043;
      color: #FFFFFF;
      border: none;
      box-shadow: 0 8px 25px rgba(56, 32, 67, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      transition: all 0.3s ease;
    }
    .chatbot-toggle-btn:hover {
      transform: scale(1.08);
      background: #291632;
    }
    .chatbot-window {
      position: absolute;
      bottom: 75px;
      right: 0;
      width: 350px;
      max-width: calc(100vw - 40px);
      height: 480px;
      max-height: calc(100vh - 120px);
      background: #FAF8F5;
      border-radius: 20px;
      box-shadow: 0 12px 35px rgba(56, 32, 67, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(56, 32, 67, 0.1);
    }
    .chatbot-window.open {
      display: flex;
    }
    .chatbot-header {
      background: #382043;
      color: #FFFFFF;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chatbot-header-title {
      font-family: 'Quicksand', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chatbot-close-btn {
      background: transparent;
      border: none;
      color: #FAF8F5;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .chatbot-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 0.9rem;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .chat-msg.bot {
      background: #FFFFFF;
      color: #2A1C30;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .chat-msg.user {
      background: #FF6B35;
      color: #FFFFFF;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .chatbot-quick-options {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .quick-chip {
      background: #FFFFFF;
      border: 1px solid #382043;
      color: #382043;
      font-size: 0.78rem;
      padding: 5px 10px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .quick-chip:hover {
      background: #382043;
      color: #FFFFFF;
    }
    .chatbot-input-area {
      display: flex;
      padding: 10px;
      background: #FFFFFF;
      border-top: 1px solid #EAE5DF;
      gap: 8px;
    }
    .chatbot-input {
      flex: 1;
      border: 1px solid #DCD6CD;
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 0.9rem;
      outline: none;
    }
    .chatbot-input:focus {
      border-color: #382043;
    }
    .chatbot-send-btn {
      background: #FF6B35;
      color: white;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .chatbot-send-btn:hover {
      background: #e05522;
    }
  `;

  // Função global de inicialização
  window.initChatbot = function (config) {
    // Injeta os estilos
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    let database = [];

    // Carrega o arquivo JSON
    fetch(config.jsonUrl || 'minha-base-dados.json')
      .then(res => res.json())
      .then(data => { database = data; })
      .catch(err => console.error("Erro ao carregar base do ChatBot:", err));

    // Monta o HTML do Widget
    const container = document.createElement('div');
    container.className = 'chatbot-widget';
    container.innerHTML = `
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-title">
            <i class="fa-solid fa-lemon" style="color: #FF6B35;"></i>
            <span>Assistente Fassina</span>
          </div>
          <button class="chatbot-close-btn" id="chatbotClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="chat-msg bot">
            Olá! Seja bem-vindo à <strong>Banca Fassina</strong>! 🍓<br>Como posso te ajudar hoje?
            <div class="chatbot-quick-options">
              <button class="quick-chip" onclick="window.sendChatQuery('Horário')">Horário</button>
              <button class="quick-chip" onclick="window.sendChatQuery('Endereço')">Endereço</button>
              <button class="quick-chip" onclick="window.sendChatQuery('Atacado')">Atacado</button>
              <button class="quick-chip" onclick="window.sendChatQuery('WhatsApp')">WhatsApp</button>
            </div>
          </div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Digite sua dúvida..." />
          <button class="chatbot-send-btn" id="chatbotSend"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button class="chatbot-toggle-btn" id="chatbotToggle">
        <i class="fa-solid fa-comments"></i>
      </button>
    `;
    document.body.appendChild(container);

    // Seletores de elementos
    const windowEl = document.getElementById('chatbotWindow');
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const messagesEl = document.getElementById('chatbotMessages');
    const inputEl = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');

    // Alternar visibilidade da janela
    toggleBtn.addEventListener('click', () => windowEl.classList.toggle('open'));
    closeBtn.addEventListener('click', () => windowEl.classList.remove('open'));

    // Normaliza texto removendo acentos e pontuação
    function normalizeText(text) {
      return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "");
    }

    // Processa pergunta do usuário e busca correspondência
    function processQuery(userText) {
      if (!userText.trim()) return;

      appendMessage(userText, 'user');
      inputEl.value = '';

      const normalizedInput = normalizeText(userText);
      const inputWords = normalizedInput.split(/\s+/);

      let bestMatch = null;
      let highestScore = 0;

      database.forEach(item => {
        let score = 0;
        item.keywords.forEach(kw => {
          const normKw = normalizeText(kw);
          if (inputWords.includes(normKw) || normalizedInput.includes(normKw)) {
            score += 1;
          }
        });
        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      });

      setTimeout(() => {
        if (bestMatch && highestScore > 0) {
          appendMessage(formatMarkdown(bestMatch.resposta), 'bot');
        } else {
          appendMessage(
            "Desculpe, não encontrei uma resposta exata. Você pode falar diretamente conosco pelo **WhatsApp (19) 99999-9999**!",
            'bot'
          );
        }
      }, 400);
    }

    // Formata negritos simples (**texto**) em HTML
    function formatMarkdown(text) {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }

    // Adiciona balão de mensagem no histórico
    function appendMessage(htmlContent, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;
      msgDiv.innerHTML = htmlContent;
      messagesEl.appendChild(msgDiv);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Eventos de envio
    sendBtn.addEventListener('click', () => processQuery(inputEl.value));
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') processQuery(inputEl.value);
    });

    // Função auxiliar para os botões de atalho (chips)
    window.sendChatQuery = function (text) {
      processQuery(text);
    };
  };
})();
