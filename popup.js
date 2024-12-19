document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 检查 QRCode 是否正确加载
    if (typeof QRCode === 'undefined') {
      throw new Error('QRCode library not loaded');
    }

    // 获取当前标签页信息
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('Cannot get current tab info');
    }

    const url = tab.url;
    const favicon = tab.favIconUrl || 'assets/default-favicon.png';
    const title = tab.title || '未知网站';

    // 更新网站图标和名称
    const faviconElement = document.getElementById('favicon');
    const siteNameElement = document.getElementById('siteName');
    
    if (!faviconElement || !siteNameElement) {
      throw new Error('Required DOM elements not found');
    }

    // 先清空内容，确保页面干净
    document.body.innerHTML = `
      <div class="container">
        <div class="qr-wrapper">
          <div id="qrcode"></div>
          <img id="favicon" class="favicon" src="${favicon}" alt="网站图标" onerror="this.src='assets/default-favicon.png'">
        </div>
        <h1 id="siteName" class="site-name">${title}</h1>
      </div>
    `;

    // 生成二维码
    const qrcodeElement = document.getElementById('qrcode');
    new QRCode(qrcodeElement, {
      text: url,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

  } catch (error) {
    console.error('Error:', error);
    // 只在真正出错时显示错误信息
    document.body.innerHTML = `
      <div class="error-message">
        <p>抱歉，发生了一个错误：</p>
        <p>${error.message}</p>
        <p>请确保：</p>
        <ul>
          <li>已下载并正确放置 qrcode.min.js 文件</li>
          <li>扩展有足够的权限访问当前页面</li>
          <li>当前页面是一个正常的网页（不是浏览器内置页面）</li>
        </ul>
      </div>
    `;
  }
}); 