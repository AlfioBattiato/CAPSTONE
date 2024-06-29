import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const supressWarningsMiddleware = (options = {}) => {
  const { blacklist = [] } = options;

  return {
    configureServer({ middlewares }) {
      middlewares.use((req, res, next) => {
        res.on("finish", () => {
          const { method, originalUrl } = req;
          if (res.statusCode === 404 && method === "GET" && originalUrl.includes(".map")) {
            console.log("Warning:", req.originalUrl);
          }
        });
        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    supressWarningsMiddleware({
      blacklist: ["DROPPABLE_SUPPORT_REMOVE_DEFAULT_PROPS"], // Aggiungi qui eventuali altri codici di warning da ignorare
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000/",
        // changeOrigin: true,
      },
      "/osrm-api": {
        target: "https://router.project-osrm.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osrm-api/, ''),
      },
    },
  },
});
