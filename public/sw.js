self.addEventListener("push", function (event) {
	if (event.data) {
		const data = event.data.json()
		const options = {
			body: data.body,
			icon: data.icon || "/logo.svg",
			badge: "/badge.png",
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: "2"
			}
		}

		const notification = new self.Notification(data.title, options)

		notification.addEventListener("click", () => {
			clients.openWindow(data.url)
		})
	}
})
