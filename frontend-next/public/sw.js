// Service worker Web Push layanan alumni SMKN 2 Kota Mojokerto.
// Hanya menangani notifikasi; tidak menyimpan cache halaman.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Layanan TU SMKN 2 Kota Mojokerto";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/images/brand/emblem-smkn2.png",
      badge: "/images/brand/emblem-smkn2.png",
      tag: data.tag || "layanan-tu",
      renotify: true,
      data: { url: data.url || "/layanan-alumni" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/layanan-alumni", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url === target);
      if (open) return open.focus();
      return self.clients.openWindow(target);
    }),
  );
});
