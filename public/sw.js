self.addEventListener("push", function (event) {
	if (event.data) {
		const data = event.data.json()
		const options = {
			body: data.body,
			icon: data.icon || "/logo.svg",
			badge: "/badge.png",
			vibrate: [100, 50, 100],
			data: {
				url: JSON.parse(event.data).url,
				dateOfArrival: Date.now(),
				primaryKey: "2"
			}
		}

		event.waitUntil(self.registration.showNotification(data.title, options))
	}
})

self.addEventListener("notificationclick", function (event) {
	event.notification.close()
	event.waitUntil(clients.openWindow(event.notification.data.url))
})
