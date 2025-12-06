import React, { useEffect, useState } from "react";
import keycloak from "./keycloak";

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        keycloak.init({ onLoad: "login-required", checkLoginIframe: false })
            .then(auth => {
                setAuthenticated(auth);
                if (auth) loadCourses();
            })
            .catch(err => console.error("Keycloak init error:", err));
    }, []);

    const loadCourses = () => {
        fetch("http://localhost:8081/courses", {
            headers: { Authorization: "Bearer " + keycloak.token }
        })
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    };

    const logout = () => keycloak.logout({ redirectUri: "http://localhost:3000" });

    if (!authenticated) {
        return (
            <div style={styles.loadingContainer}>
                <h2>Connexion en cours...</h2>
            </div>
        );
    }

    return (
        <div style={styles.appContainer}>
            <header style={styles.header}>
                <h1>Bienvenue {keycloak.tokenParsed?.preferred_username}</h1>
                <button style={styles.logoutButton} onClick={logout}>Se déconnecter</button>
            </header>

            <main style={styles.main}>
                <h2 style={styles.sectionTitle}>Cours disponibles</h2>
                <div style={styles.coursesContainer}>
                    {courses.map((course, idx) => (
                        <div key={idx} style={styles.courseCard}>
                            <p style={styles.courseName}>{course}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

// Styles
const styles = {
    appContainer: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        backgroundColor: "#4a90e2",
        color: "#fff",
        padding: "15px 20px",
        borderRadius: "8px"
    },
    logoutButton: {
        padding: "8px 15px",
        backgroundColor: "#e94e77",
        border: "none",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    main: {
        maxWidth: "800px",
        margin: "0 auto"
    },
    sectionTitle: {
        marginBottom: "15px",
        color: "#333"
    },
    coursesContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "15px"
    },
    courseCard: {
        flex: "1 1 200px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        textAlign: "center",
        transition: "transform 0.2s",
        cursor: "pointer"
    },
    courseName: {
        fontWeight: "bold",
        color: "#4a90e2",
        fontSize: "18px"
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "20px",
        color: "#4a90e2"
    }
};

export default App;
