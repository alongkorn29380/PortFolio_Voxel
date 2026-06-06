import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
        'สวัสดีครับ ผมเป็นนักศึกษาคณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์และหุ่นยนต์ มีความสนใจทางด้านการพัฒนาเว็บแอปพลิเคชันแบบ Full Stack โดยเฉพาะงานที่เกี่ยวข้องกับการแสดงผลสามมิติ (3D/WebGL) ที่ผสมผสานระหว่างการออกแบบประสบการณ์ผู้ใช้งานที่น่าสนใจ เข้ากับการประมวลผลและการจัดการข้อมูลที่มีประสิทธิภาพ ผมมีพื้นฐานและประสบการณ์จากการทำโปรเจกต์ในการพัฒนาส่วนหน้าด้วย React, Three.js และ React Three Fiber บนพื้นฐานของเทคโนโลยี WebGL รวมถึงการพัฒนาส่วนหลังด้วย Node.js, REST API และการสื่อสารแบบเรียลไทม์ผ่าน WebSocket โดยสามารถดูแลและเชื่อมต่อการทำงานได้ครบทุกขั้นตอน ตั้งแต่การออกแบบระบบและจัดการข้อมูล ไปจนถึงการแสดงผลและการโต้ตอบในฝั่งผู้ใช้งาน \n\nนอกจากนี้ ผมยังมีประสบการณ์เพิ่มเติมด้านการสตรีมข้อมูลแบบเรียลไทม์ผ่าน WebRTC และการพัฒนาระบบ IoT ซึ่งช่วยให้เข้าใจการทำงานของระบบแบบครบวงจรตั้งแต่ฮาร์ดแวร์ไปจนถึงการแสดงผล ผมมีความมุ่งมั่นตั้งใจ พร้อมเรียนรู้สิ่งใหม่อยู่เสมอ และต้องการนำความรู้ความสามารถที่มีไปร่วมพัฒนาผลิตภัณฑ์ที่มีคุณภาพ พร้อมเติบโตในสายอาชีพไปพร้อมกับองค์กรครับ \n\nยกตัวอย่างผลงานที่ผ่านมาเช่น \n\n 🧊DashBoard Sensor \n\n 🍩Robotic Arm \n\n 🛢️Christmas Card \n\n 🔵 Calendar'
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
                    <button className="tab active">👨‍🎓</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Me.jpg" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">ALONGKORN ANUWATPRAKIT</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

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
