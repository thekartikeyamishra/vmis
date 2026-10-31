import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr. VedPati Mishra Institute Of Scholars",
    short_name: "VMIS",
    start_url: "/en",
    display: "standalone",
    background_color: "#F2F9FD",
    theme_color: "#145B98",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/vmis-logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
