// Automatic location detection helper
export const autoDetectLocation = async () => {
  try {
    // Attempt 1: Fetch via IP Geolocation (Fast & doesn't require prompt permission)
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        return {
          city: data.city || "",
          state: data.region || "",
          country: data.country_name || "",
          coordinates: {
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          },
        };
      }
    }
  } catch (err) {
    console.warn("IP location lookup failed, trying fallback...", err);
  }

  try {
    // Attempt 2: Fallback via ip-api.com
    const res = await fetch("http://ip-api.com/json/");
    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        return {
          city: data.city || "",
          state: data.regionName || "",
          country: data.country || "",
          coordinates: {
            latitude: data.lat || null,
            longitude: data.lon || null,
          },
        };
      }
    }
  } catch (err) {
    console.warn("Fallback location lookup failed:", err);
  }

  return {
    city: "Nearby",
    state: "",
    country: "",
  };
};
