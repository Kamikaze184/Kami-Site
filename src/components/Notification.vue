<script>
import { eventEmitter } from '../utils/EventEmitter'

export default {
    data() {
        return {
            notificationId: 0,
            notifications: [],
            notificationHistory: []
        }
    },
    methods: {
        addNotification(title, message, type, timeout, showOnly = false) {
            if (showOnly) {
                this.notifications.push({
                    id: this.notificationId + 1,
                    title: title,
                    message: message,
                    type: type,
                    data: new Date(),
                    timeout: timeout,
                })

                this.notificationId++

                return this.notificationId
            }
            else {
                this.notificationHistory.push({
                    id: this.notificationId + 1,
                    title: title,
                    type: type,
                    message: message,
                    data: new Date(),
                    timeout: timeout,
                })

                this.notifications.push({
                    id: this.notificationId + 1,
                    title: title,
                    type: type,
                    message: message,
                    data: new Date(),
                    timeout: timeout,
                })

                localStorage.setItem('notification-history', JSON.stringify(this.notificationHistory))

                this.notificationId++

                return this.notificationId
            }
        },
        removeNotification(id) {
            this.notifications = this.notifications.map(n => {
                if (n.id == id) {
                    n.scaleOff = true
                }

                return n
            })

            setTimeout(() => {
                this.notifications = this.notifications.filter(n => n.id != id)
            }, 550)
        }
    },
    mounted() {
        if (localStorage.getItem('notification-history')) {
            let localNotificationHistory = JSON.parse(localStorage.getItem('notification-history'))

            if (localNotificationHistory.length > 20) {
                localNotificationHistory = localNotificationHistory.slice(localNotificationHistory.length - 20, localNotificationHistory.length)
            }

            this.notificationHistory = localNotificationHistory
        }

        eventEmitter.on('add-notification', (title, message, type, timeout = 10000) => {
            const notificationId = this.addNotification(title, message, type, timeout)

            setTimeout(() => {
                this.removeNotification(notificationId)
            }, timeout)
        })

        eventEmitter.on('get-notification-history', () => {
            eventEmitter.emit('notification-history', this.notificationHistory)
        })

        eventEmitter.on('clear-notification-history', () => {
            this.notificationHistory = []
        })

        this.notificationHistory.forEach(n => {
            if (new Date(n.data).getTime() + n.timeout > new Date().getTime()) {
                const notificationId = this.addNotification(n.title, n.message, n.type, n.timeout, true)

                setTimeout(() => {
                    this.removeNotification(notificationId)
                }, n.timeout)
            }
        })
    },
}
</script>
<template>
    <div id="notification-box">
        <div class="notification" v-for="notification in notifications" :key="notification.id"
            :style="notification.scaleOff ? 'animation: scale-off 1s ease' : ''">
            <div class="notification-progress-bar">
                <div class="notification-progress-bar-inner-display"
                    :style="`animation: progress-bar ${(notification.timeout + 50) / 1000}s linear;`">
                </div>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    {{ notification.title }}
                </div>
                <div class="notification-message">
                    {{ notification.message }}
                </div>
            </div>
            <div class="notification-close" @click="removeNotification(notification.id)">
                <img src="../assets/img/cancel.svg">
            </div>
        </div>
    </div>
</template>
<style>
.notification-progress-bar {
    width: 10px;
    height: 90%;
    min-height: 40px;
    background-color: var(--background);
    border-radius: 5px;
    position: relative;
    overflow: hidden;
}

.notification-progress-bar-inner-display {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background-color: var(--text);
}

@keyframes progress-bar {
    0% {
        height: 0%;
    }

    100% {
        height: 100%;
    }
}

#notification-box {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}

.notification {
    display: flex;
    align-items: center;
    width: 300px;
    padding: 20px;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    animation: slide-right 1.0s ease-in-out;
}

.notification-content {
    flex: 1;
    padding: 0 10px;
}

.notification-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--text);
}

.notification-message {
    font-size: 14px;
    color: var(--text);
}

.notification-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    cursor: pointer;
    position: relative;
}

.notification-close img {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 5px;
}

@keyframes slide-right {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes slide-top {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes scale-off {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0.1);
        opacity: 0;
    }
}

@media (max-width: 800px) {
    #notification-box {
        top: 10px;
        right: unset;
        left: unset;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .notification {
        width: 80%;
        animation: slide-top 1.0s ease-in-out;
    }
}
</style>