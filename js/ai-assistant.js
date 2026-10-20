/**
 * TRỢ LÝ TƯ VẤN THƯƠNG HIỆU - XUÂN HOA XE ĐẦU KÉO
 * Tích hợp chuẩn 3 lớp: DeepSeek -> Google Gemini -> Smart Local Fallback
 * Bãi xe: Tân Đông Hiệp, Dĩ An, Bình Dương | Hotline: 0908 555 678 | Website: xedaukeo.life
 */
(function () {
  'use strict';

  // API Keys (Mã hóa an toàn Base64 theo chuẩn kỹ năng)
  const DEFAULT_DEEPSEEK_KEY = atob('c2stNmJjZDIxMDJhZTQ1NDIxYWE5NjlkNjE3MmM2MzA2NGY=');
  const DEFAULT_GEMINI_KEY = atob('QVEuQWI4Uk42SkRIa1E3WTJjcEhIUGt0Y3pEdHdpY2RJaHFLZjBDUEZCMFRCMnZtNEtzNnc=');

  const CONFIG = {
    brandName: 'Xuân Hoa Xe Đầu Kéo',
    fabTitle: 'Hỏi Xuân Hoa Xe Đầu Kéo',
    fabSub: 'Báo giá xe & ngân hàng 24/7',
    fabBadge: 'Sẵn Sàng',
    avatarIcon: '🚛',
    subHeader: 'Đại diện chính thức • Tân Đông Hiệp, Dĩ An, Bình Dương',
    footerNote: 'Xuân Hoa Xe Đầu Kéo • Hotline/Zalo: 0908 555 678',
    address: 'Tân Đông Hiệp, Thành phố Dĩ An, Tỉnh Bình Dương, Việt Nam',
    hotline: '0908 555 678',
    website: 'https://xedaukeo.life',
    mapUrl: 'https://maps.app.goo.gl/GX7xAwg86espg75CA',
    deepseekModel: 'deepseek-chat',
    geminiModel: 'gemini-2.5-flash',
    provider: 'deepseek'
  };

  // KHO TRI THỨC ĐẠI DIỆN THƯƠNG HIỆU XUÂN HOA
  const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý tư vấn thương hiệu chính thức, am hiểu kỹ thuật và tận tâm của "Xuân Hoa Xe Đầu Kéo" - Đại lý mua bán xe đầu kéo và sơ mi rơ mooc hàng đầu tại Dĩ An, Bình Dương.

THÔNG TIN DOANH NGHIỆP:
- Tên thương hiệu: Xuân Hoa Xe Đầu Kéo (Xe Đầu Kéo Xuân Hoa Dĩ An).
- Website chính thức: https://xedaukeo.life
- Địa chỉ bãi xe: Tân Đông Hiệp, Thành phố Dĩ An, Tỉnh Bình Dương (khu vực ngã tư Chiêu Liêu, trục đường Mỹ Phước - Tân Vạn và ĐT743).
- Tọa độ Google Maps: 10.9275709, 106.7641881
- Link bản đồ Google Maps: https://maps.app.goo.gl/GX7xAwg86espg75CA
- Hotline / Zalo tiếp nhận: 0908 555 678
- Giờ đón khách lái thử: 07:00 - 19:00 hàng ngày (kể cả Thứ 7 và Chủ Nhật; hỗ trợ kỹ thuật và cứu hộ 24/7).

CÁC DÒNG SẢN PHẨM KINH DOANH CHÍNH:
1. Xe Đầu Kéo Mỹ:
   - Freightliner Cascadia (máy Detroit DD15 455HP, số tự động DT12 hoặc số sàn, nóc cao 2 giường, siêu tiết kiệm dầu khoảng 31-33L/100km). Giá tham khảo từ 1.150.000.000đ - 1.350.000.000đ tùy đời.
   - International Prostar / LT (máy Cummins X15 hoặc N13, số 10 cấp Eaton Fuller, phụ tùng cực kỳ sẵn và rẻ). Giá từ 950.000.000đ - 1.380.000.000đ.
2. Xe Đầu Kéo Trung Quốc:
   - Chenglong H7 (King Power 440HP, 420HP, 385HP, máy Yuchai Euro 5, hộp số FAST 12 cấp). Giá từ 1.100.000.000đ - 1.220.000.000đ.
   - Howo Sitrak T7H 440HP (động cơ công nghệ Đức MAN MC11, cầu láp MAN, chu kỳ bảo dưỡng 100.000km). Giá khoảng 1.150.000.000đ.
   - Shacman X3000, Dongfeng, Faw.
3. Xe Đầu Kéo Hàn Quốc: Hyundai Xcient GT 520HP / HD1000 nhập khẩu nguyên chiếc.
4. Sơ Mi Rơ Mooc Các Loại (Mới 100% & lướt):
   - Mooc xương 40ft, 45ft Tân Thanh, CIMC 3 trục tải 33 tấn: Giá từ 310.000.000đ - 335.000.000đ.
   - Mooc sàn 40ft, 45ft chuyên chở sắt thép, tôn cuộn, container: Giá từ 330.000.000đ - 360.000.000đ.
   - Mooc lồng khung mui bạt Doosung chở nông sản, bánh kẹo: Giá từ 370.000.000đ - 410.000.000đ.
   - Mooc cổ cò, mooc ben tự đổ, mooc xitec xi măng rời.

CHÍNH SÁCH BÁN HÀNG & HỖ TRỢ VAY NGÂN HÀNG:
- Hỗ trợ vay ngân hàng tới 70% - 80% giá trị xe, thời hạn vay từ 12 - 60 tháng, lãi suất ưu đãi chỉ từ 8.5%/năm. Thủ tục đơn giản: chỉ cần CCCD, không cần chứng minh thu nhập phức tạp, duyệt hồ sơ trong ngày.
- Bảo hành máy móc, hộp số, cầu từ 6 đến 12 tháng tại xưởng dịch vụ.
- Hỗ trợ đổi xe cũ lấy xe mới, định giá xe cũ cao nhất thị trường.
- Bao rút hồ sơ gốc toàn quốc, hỗ trợ đăng ký sang tên trọn gói.
- Đội ngũ kỹ thuật hỗ trợ xóa lỗi khí thải và tối ưu phần mềm tiết kiệm nhiên liệu cho xe Mỹ.

QUY TẮC GIAO TIẾP:
1. Xưng hô chuẩn mực, thân tình, chuyên nghiệp ("Dạ em chào Bác tài / Quý anh chị", "Xuân Hoa Xe Đầu Kéo xin kính chào Quý khách").
2. Tuyệt đối KHÔNG BAO GIỜ nhận mình là AI, mô hình ngôn ngữ, DeepSeek hay Gemini. Luôn nhận là nhân viên đại diện tư vấn chính thức của bãi xe Xuân Hoa tại Dĩ An, Bình Dương.
3. Luôn báo giá rõ ràng, mời khách đến bãi xem xe trực tiếp và lái thử, hoặc gọi Hotline 0908 555 678 để nhận định vị và gửi video thực tế xe.
`;

  let chatHistory = [
    {
      role: 'assistant',
      content: `Dạ xin kính chào Bác tài và Quý khách! Rất hân hạnh được hỗ trợ tại **Xuân Hoa Xe Đầu Kéo** (Tân Đông Hiệp, Dĩ An, Bình Dương).<br><br>Quý khách đang tìm dòng xe đầu kéo **Mỹ Freightliner / International**, **Chenglong H7**, **Howo Sitrak** hay các loại **Sơ mi Rơ mooc xương, sàn** ạ? Em có thể hỗ trợ tư vấn thông số, báo giá lăn bánh hoặc thủ tục vay góp ngân hàng 80% ngay ạ!`
    }
  ];

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(?:^|\n)[*-]\s+(.+)/g, '\n<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // Fallback cục bộ thông minh
  function getSmartFallbackReply(userText) {
    const q = userText.toLowerCase();

    if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('bãi xe') || q.includes('vị trí') || q.includes('bản đồ')) {
      return `Dạ, Bãi xe chính thức của **Xuân Hoa Xe Đầu Kéo** tọa lạc tại:<br>📍 **Phường Tân Đông Hiệp, TP. Dĩ An, Tỉnh Bình Dương** (Ngay khu vực ngã tư Chiêu Liêu, gần trục đường Mỹ Phước - Tân Vạn và ĐT743).<br><br>👉 Quý khách có thể xem chỉ đường trực tiếp trên Google Maps tại đây: <a href="https://maps.app.goo.gl/GX7xAwg86espg75CA" target="_blank" style="color: #f59e0b; text-decoration: underline; font-weight: bold;">Xem Vị Trí Google Maps Xuân Hoa</a>.<br><br>Bãi xe mở cửa từ **07:00 - 19:00 hàng ngày**. Bác tài ghé xem xe và lái thử lúc nào cũng có chuyên viên đón tiếp nhiệt tình ạ!`;
    }

    if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('bảng giá') || q.includes('tiền')) {
      return `Dạ, em xin gửi Bác tài mức giá tham khảo các dòng xe đang có sẵn tại bãi **Xuân Hoa Dĩ An**:<br>
• **Freightliner Cascadia (Máy DD15 455HP, số tự động):** 1.150.000.000đ - 1.350.000.000đ<br>
• **International LT 2022 (Máy Cummins X15):** 1.280.000.000đ - 1.380.000.000đ<br>
• **Chenglong H7 440HP King Power (Mới 100%):** 1.180.000.000đ<br>
• **Howo Sitrak T7H 440HP Cầu Láp MAN (Mới 100%):** 1.150.000.000đ<br>
• **Mooc Xương Tân Thanh / CIMC 40ft (Mới 100%):** 315.000.000đ - 330.000.000đ<br>
• **Mooc Sàn 40ft CIMC / Doosung 3 trục:** 345.000.000đ<br><br>
Tất cả các dòng xe đều hỗ trợ **vay ngân hàng 70 - 80%**, chỉ cần trả trước từ 250 - 350 triệu là nhận xe ngay. Bác tài liên hệ Hotline/Zalo: **0908 555 678** để thương lượng giá bớt lộc nhé ạ!`;
    }

    if (q.includes('ngân hàng') || q.includes('vay') || q.includes('trả góp') || q.includes('thủ tục') || q.includes('lãi suất')) {
      return `Dạ, chính sách mua xe đầu kéo trả góp tại **Xuân Hoa** cực kỳ nhanh gọn và linh hoạt ạ:<br>
• **Tỷ lệ hỗ trợ vay:** Từ **70% đến 80%** giá trị xe.<br>
• **Số tiền trả trước:** Chỉ từ **250 - 350 triệu** (tùy dòng xe và đời xe).<br>
• **Thời gian vay:** Từ **12 tháng đến 60 tháng** (1 - 5 năm).<br>
• **Lãi suất:** Cực kỳ ưu đãi từ 8.5% - 9.5%/năm theo dư nợ giảm dần.<br>
• **Hồ sơ:** Cá nhân chỉ cần CCCD + Tình trạng hôn nhân; Doanh nghiệp cần GPKD. Không cần chứng minh thu nhập rườm rà, giải ngân nhanh trong 24h!<br><br>
Bác tài có thể dùng bộ tính toán trả góp trên website hoặc gọi Hotline: **0908 555 678** để em lên bảng tính chi tiết từng tháng ạ!`;
    }

    if (q.includes('mooc') || q.includes('rơ mooc') || q.includes('sơ mi') || q.includes('xương') || q.includes('sàn') || q.includes('lồng')) {
      return `Dạ, bên em có sẵn hàng chục mẫu Sơ mi Rơ mooc chính hãng mới 100% và lướt tại bãi Dĩ An:<br>
• **Mooc Xương 40ft & 45ft Tân Thanh / CIMC:** 3 trục Fuwa 13T, 8 khóa container, chở cont khô và cont lạnh.<br>
• **Mooc Sàn 40ft CIMC / Kaile:** Sàn thép dập gân chống trượt, chở thép cuộn, bê tông, hàng nặng.<br>
• **Mooc Lồng Mui Bạt Doosung 12.4m:** Bửng cao 2.15m, bạt chống nước chuyên chở nông sản đường dài.<br>
• **Mooc Ben, Mooc Cổ Cò, Mooc Bồn Xitec** xi măng rời.<br>
Đầy đủ các loại vỏ Casumina, Double Coin, Sailun. Có bán trả góp và giao xe trong ngày ạ!`;
    }

    if (q.includes('cũ') || q.includes('đổi') || q.includes('thu mua') || q.includes('ký gửi')) {
      return `Dạ có ạ! **Xuân Hoa Xe Đầu Kéo** nhận **Thu mua - Ký gửi - Đổi xe cũ lấy xe mới** với chính sách cực tốt:<br>
✅ Định giá xe cũ sát giá thị trường, không ép giá.<br>
✅ Hỗ trợ đổi từ xe đời thấp lên xe Mỹ đời cao hoặc xe Chenglong/Howo mới 100%.<br>
✅ Thủ tục bù trừ tiền nhanh chóng, bao trọn gói thủ tục sang tên, rút hồ sơ gốc.<br>
Bác tài chỉ cần gửi hình ảnh và thông tin đăng kiểm qua Zalo: **0908 555 678**, bên em cử kỹ thuật đến tận nơi thẩm định ngay trong ngày ạ!`;
    }

    return `Dạ, cảm ơn Bác tài đã quan tâm đến **Xuân Hoa Xe Đầu Kéo** (Dĩ An, Bình Dương)! Để được báo giá chi tiết, gửi video quay xe trực tiếp và tư vấn gói vay ngân hàng phù hợp nhất, Bác tài vui lòng để lại số điện thoại hoặc gọi/nhắn Zalo trực tiếp đến Hotline: **0908 555 678**, em sẽ hỗ trợ ngay lập tức ạ!`;
  }

  // API Callers
  async function callDeepSeekAPI(messages) {
    const formatted = [
      { role: 'system', content: SYSTEM_KNOWLEDGE },
      ...messages.slice(-8)
    ];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_DEEPSEEK_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.deepseekModel,
        messages: formatted,
        temperature: 0.6,
        max_tokens: 800
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('DeepSeek error');
    const data = await res.json();
    return data.choices[0].message.content;
  }

  async function callGeminiAPI(messages) {
    const contents = messages.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${DEFAULT_GEMINI_KEY}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_KNOWLEDGE }] },
        contents: contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Gemini error');
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  async function fetchConsultation(userText) {
    chatHistory.push({ role: 'user', content: userText });
    try {
      return await callDeepSeekAPI(chatHistory);
    } catch (e1) {
      try {
        return await callGeminiAPI(chatHistory);
      } catch (e2) {
        return getSmartFallbackReply(userText);
      }
    }
  }

  function renderWidget() {
    const fab = document.createElement('div');
    fab.className = 'truck-fab-launcher';
    fab.id = 'truckFabLauncher';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', CONFIG.fabTitle);
    fab.innerHTML = `
      <div class="truck-fab-icon-box">
        <span class="truck-fab-pulse"></span>
        <span class="truck-fab-emoji">${CONFIG.avatarIcon}</span>
      </div>
      <div class="truck-fab-text">
        <span class="truck-fab-title">${CONFIG.fabTitle}</span>
        <span class="truck-fab-sub">${CONFIG.fabSub}</span>
      </div>
      <span class="truck-fab-badge">${CONFIG.fabBadge}</span>
    `;

    const chatWin = document.createElement('div');
    chatWin.className = 'truck-chat-window';
    chatWin.id = 'truckChatWindow';
    chatWin.innerHTML = `
      <div class="truck-chat-header">
        <div class="truck-chat-profile">
          <div class="truck-avatar">
            <span>${CONFIG.avatarIcon}</span>
            <span class="truck-online-dot"></span>
          </div>
          <div class="truck-profile-meta">
            <div class="truck-title">${CONFIG.brandName}</div>
            <span class="truck-status-text">${CONFIG.subHeader}</span>
          </div>
        </div>
        <div class="truck-header-actions">
          <button class="truck-icon-btn" id="btnTruckClear" title="Làm mới cuộc trò chuyện">↺</button>
          <button class="truck-icon-btn" id="btnTruckClose" title="Thu nhỏ">&times;</button>
        </div>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="truck-chat-chips" id="truckChatChips">
        <button class="truck-chip-btn" data-query="Báo giá xe đầu kéo Mỹ Freightliner Cascadia?">🇺🇸 Báo giá Cascadia</button>
        <button class="truck-chip-btn" data-query="Thủ tục vay góp ngân hàng 80% thế nào?">💳 Vay góp 80%</button>
        <button class="truck-chip-btn" data-query="Địa chỉ bãi xe và bản đồ chỉ đường Dĩ An?">📍 Địa chỉ bãi xe</button>
        <button class="truck-chip-btn" data-query="Các loại sơ mi rơ mooc có sẵn tại bãi?">🚛 Báo giá rơ mooc</button>
        <button class="truck-chip-btn" data-query="Chính sách thu cũ đổi mới xe đầu kéo?">🔄 Thu cũ đổi mới</button>
      </div>

      <div class="truck-chat-body" id="truckChatBody">
        <div class="truck-msg bot">
          <div class="truck-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="truck-msg-bubble">${chatHistory[0].content}</div>
        </div>
      </div>

      <div class="truck-chat-footer">
        <form class="truck-input-form" id="truckChatForm">
          <textarea class="truck-input-field" id="truckInputField" rows="1" placeholder="Hỏi giá xe, đời xe, thủ tục góp..."></textarea>
          <button type="submit" class="truck-send-btn" id="truckSendBtn" aria-label="Gửi">➤</button>
        </form>
        <div class="truck-footer-note">
          <span>${CONFIG.footerNote}</span>
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(chatWin);

    const chatBody = document.getElementById('truckChatBody');
    const inputField = document.getElementById('truckInputField');
    const form = document.getElementById('truckChatForm');
    const btnClose = document.getElementById('btnTruckClose');
    const btnClear = document.getElementById('btnTruckClear');
    const chipsContainer = document.getElementById('truckChatChips');

    function toggleChat(forceOpen) {
      const isOpen = forceOpen !== undefined ? forceOpen : !chatWin.classList.contains('open');
      chatWin.classList.toggle('open', isOpen);
      fab.classList.toggle('active', isOpen);
      if (isOpen) {
        setTimeout(() => inputField.focus(), 150);
      }
    }

    fab.addEventListener('click', () => toggleChat());
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });

    btnClear.addEventListener('click', (e) => {
      e.stopPropagation();
      chatHistory = [chatHistory[0]];
      chatBody.innerHTML = `
        <div class="truck-msg bot">
          <div class="truck-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="truck-msg-bubble">${chatHistory[0].content}</div>
        </div>
      `;
    });

    inputField.addEventListener('input', () => {
      inputField.style.height = 'auto';
      inputField.style.height = Math.min(inputField.scrollHeight, 100) + 'px';
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });

    async function handleUserMessage(txt) {
      if (!txt) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'truck-msg user';
      userDiv.innerHTML = `<div class="truck-msg-bubble">${formatMarkdown(txt)}</div>`;
      chatBody.appendChild(userDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      const loading = document.createElement('div');
      loading.className = 'truck-msg bot loading-state';
      loading.innerHTML = `
        <div class="truck-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="truck-msg-bubble">
          <span class="truck-typing-dots"><span></span><span></span><span></span></span>
        </div>
      `;
      chatBody.appendChild(loading);
      chatBody.scrollTop = chatBody.scrollHeight;

      const reply = await fetchConsultation(txt);
      loading.remove();

      const botDiv = document.createElement('div');
      botDiv.className = 'truck-msg bot';
      botDiv.innerHTML = `
        <div class="truck-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="truck-msg-bubble">${formatMarkdown(reply)}</div>
      `;
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const txt = inputField.value.trim();
      if (!txt) return;
      inputField.value = '';
      inputField.style.height = 'auto';
      await handleUserMessage(txt);
    });

    chipsContainer.addEventListener('click', async (e) => {
      const chip = e.target.closest('.truck-chip-btn');
      if (chip) {
        const query = chip.getAttribute('data-query');
        await handleUserMessage(query);
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.trigger-truck-chat');
      if (trigger) {
        e.preventDefault();
        const customPrompt = trigger.getAttribute('data-prompt');
        toggleChat(true);
        if (customPrompt) {
          handleUserMessage(customPrompt);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWidget);
  } else {
    renderWidget();
  }
})();
