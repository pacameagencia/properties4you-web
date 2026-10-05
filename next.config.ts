import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone solo para la imagen Docker (VPS). En el hosting de Hostinger la
  // web arranca con `next start`, que no admite la salida standalone.
  output: process.env.NEXT_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "njlbbvkdkuavbayqcszp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
