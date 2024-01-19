
unlock();

// 解锁屏幕 
function unlock() {
  if (!device.isScreenOn()) {
    device.wakeUp();
    sleep(1000);
    device.wakeUp();
    sleep(1000);
    swipe(500, 2000, 500, 1000, 210);
  }
}
