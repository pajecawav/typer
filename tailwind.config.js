const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                button: colors.white,
                primary: {
                    ...colors.trueGray,
                    600: "#2A2A2A",
                    700: "#222222",
                    800: "#181818",
                    900: "#121212",
                },
                secondary: {
                    ...colors.yellow,
                    DEFAULT: colors.yellow["400"],
                },
            },
            animation: {
                appear: "appear 0.3s linear",
            },
            keyframes: {
                appear: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "100" },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
