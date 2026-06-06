import Bar from "./domain/bar";
import { SessionProvider } from "./domain/session";

export default function App() {
    return (
        <SessionProvider>
            <div style={{ padding: "16px 12px 48px", fontFamily: "system-ui, sans-serif" }}>
                <header style={{ marginBottom: 8 }}>
                    <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>바 메뉴</h1>
                    <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
                        디지털 메뉴 POC — SPEC 스펙 검증용
                    </p>
                </header>
                <Bar />
            </div>
        </SessionProvider>
    );
}
