(function() {
  // 检查更新的函数
  function checkForUpdates() {
    fetch('/version.json?t=' + new Date().getTime())
      .then(response => response.json())
      .then(data => {
        // 从localStorage获取当前版本
        const currentVersion = localStorage.getItem('blogVersion');
        
        if (currentVersion && currentVersion !== data.version) {
          // 显示更新提示
          showUpdateNotification();
        }
        
        // 保存新版本号
        localStorage.setItem('blogVersion', data.version);
      })
      .catch(error => {
        console.log('检查更新失败:', error);
      });
  }
  
  // 显示更新通知
  function showUpdateNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; bottom: 20px; right: 20px; background: #49b1f5; color: white; padding: 15px; border-radius: 5px; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
        <p style="margin: 0 0 10px 0;">博客内容已更新！</p>
        <button onclick="location.reload()" style="background: white; color: #49b1f5; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">点击刷新</button>
        <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">稍后再说</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 30秒后自动移除通知
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 30000);
  }
  
  // 页面加载完成后检查更新
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForUpdates);
  } else {
    checkForUpdates();
  }
  
  // 每隔5分钟检查一次更新
  setInterval(checkForUpdates, 5 * 60 * 1000);
})();