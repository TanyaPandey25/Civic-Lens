
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("civiclens-user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem("civiclens-token") || ""
    );

    // Save the authenticated user and token
    const login = (userData, authToken) => {
        localStorage.setItem("civiclens-user", JSON.stringify(userData));
        localStorage.setItem("civiclens-token", authToken);

        setUser(userData);
        setToken(authToken);
    };

    // Clear the authenticated session
    const logout = () => {
        localStorage.removeItem("civiclens-user");
        localStorage.removeItem("civiclens-token");

        setUser(null);
        setToken("");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: Boolean(user && token),
                isAdmin: user?.role === "ADMIN",
                isStudent: user?.role === "STUDENT"
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Access authentication state from any component
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}
