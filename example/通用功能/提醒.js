// 震动3次
function errorAlert() {
    for (let i = 0; i < 3; i++) {
        sleep(500)
        device.vibrate(200)
    }
}