import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
        'ระบบตรวจวัดข้อมูลคุณภาพสภาพอากาศแบบเรียลไทม์ (Sensor Dashboard) \n\n ระบบนี้ทำหน้าที่ตรวจวัดและแสดงผลข้อมูลสภาพแวดล้อมแบบเรียลไทม์ โดยใช้เซนเซอร์เก็บค่าต่างๆ ยกตัวอย่างเช่น อุณหภูมิ ความชื้น ความดันอากาศ คาร์บอนไดออกไซด์ มีเทน และเอทานอล จากนั้นส่งข้อมูลผ่านเครือข่ายมาแสดงผลบนหน้าจอ ทำให้ผู้ใช้สามารถติดตามค่าล่าสุดและแนวโน้มการเปลี่ยนแปลงได้อย่างต่อเนื่องและทันต่อเหตุการณ์และสีของกราฟวามารถบ่งบอกได้ว่าตอนนี้ควรระวังหรือไม่ \n\n'
export default function MarkerModal({ onClose }) {
    const [revealed, setRevealed] = useState(0)
    const done = revealed >= FULL_TEXT.length

    useEffect(() => {
        if (done) return
        const id = setInterval(() =>
            setRevealed((r) => Math.min(r + 2, FULL_TEXT.length))
        , 20)
        return () => clearInterval(id)
    }, [done])

    useEffect(() => {
        const onKey = (e) => {
            if (e.code !== 'Enter') return
            e.stopImmediatePropagation()
            if (!done) setRevealed(FULL_TEXT.length)
            else onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [done, onClose])

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

                <div className="modal-tabs">
                    <button className="tab active">🌡️</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Sensor_Dashboard.png" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">SENSOR DASHBOARD</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

                        {done && (
                            <a
                                className="modal-link"
                                href="https://dashboard-sensor-chi.vercel.app/index.html"
                                target="_blank"
                                rel="noreferrer"
                            >
                                คลิ๊กที่นี่เพื่อรับชม Sensor Dashboard   
                            </a>
                        )}

                        {done
                            ? <p className="modal-enter-prompt">Press Enter to close</p>
                            : <p className="modal-enter-skip">Press Enter to skip</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
