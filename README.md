# ELIC Mobile Application

(English Language Improvement Chatbot) เป็นแอปพลิเคชันมือถือที่ช่วยให้ผู้ใช้พัฒนาทักษะภาษาอังกฤษผ่านการสนทนาโต้ตอบกับ AI ด้วยฟังก์ชันที่หลากหลายและปรับแต่งได้

---

## ✨ คุณสมบัติเด่น

ELIC มาพร้อมกับคุณสมบัติหลักที่ออกแบบมาเพื่อการเรียนรู้ภาษาอังกฤษอย่างมีประสิทธิภาพ:

1.  **การสนทนาแบบปรับแต่งได้:**
    * ฟังก์ชัน `generateResponse` สร้างคำตอบที่เหมาะสมตามข้อความที่ผู้ใช้ป้อนมา โดยมีการตรวจสอบลักษณะภาษา เช่น การตรวจสอบว่าข้อความมีตัวอักษรภาษาไทยมากกว่า 30% หรือไม่
    * ระบบสามารถตรวจจับคำขอเกี่ยวกับคำศัพท์ (vocabulary request) และตอบกลับในรูปแบบ JSON ที่มีโครงสร้างเฉพาะเจาะจง เช่น `type`, `words`, และ `example`

2.  **ฟังก์ชันการปรับบทบาท (Role-Based Chatbot):**
    * สามารถเปลี่ยนบทบาทของแชทบอท เช่น "เพื่อนใหม่" หรือ "ผู้ฝึกภาษาอังกฤษ" โดยมีการตั้งค่าภาษาที่เหมาะสมกับบทบาท และระดับความยากง่ายของคำตอบ

3.  **การจัดการประวัติแชท:**
    * ฟังก์ชัน `resetChat` ช่วยรีเซ็ตประวัติการสนทนาและเริ่มต้นการทักทายใหม่
    * การฟอร์แมตประวัติการสนทนาในรูปแบบที่เข้าใจง่าย เช่น `User: ข้อความ` และ `Elic: คำตอบ`

4.  **การตอบสนองในรูปแบบ JSON:**
    * ระบบสามารถตรวจสอบและตอบกลับคำถามที่เกี่ยวข้องกับคำศัพท์หรือการแก้ไขคำผิดในภาษาอังกฤษ โดยตอบกลับในโครงสร้าง JSON ที่เข้าใจง่าย

5.  **การปรับแต่งหน้าจอและการเลื่อนอัตโนมัติ:**
    * มีการใช้ `useEffect` เพื่อตรวจจับข้อความใหม่และเลื่อนหน้าจอไปยังข้อความล่าสุดอัตโนมัติ เพื่อประสบการณ์การใช้งานที่ราบรื่น

---

## 🚀 เทคโนโลยีที่ใช้

โปรเจกต์นี้ถูกพัฒนาด้วยเทคโนโลยีที่ทันสมัย เพื่อให้ได้ประสิทธิภาพและความยืดหยุ่นสูงสุด:

### 🧠 การใช้งาน Gemini API สำหรับการสนทนา (AI Conversation)

เราใช้ **Google Gemini API** เป็นหัวใจหลักในการขับเคลื่อนการสนทนาของ ELIC ด้วยความสามารถของ Gemini ที่เข้าใจบริบทและสร้างคำตอบได้อย่างเป็นธรรมชาติ ทำให้ผู้ใช้สามารถโต้ตอบกับ AI ได้อย่างราบรื่นเสมือนคุยกับมนุษย์

**การดึง API Gemini มาใช้งาน:**

1.  **รับ API Key:** ก่อนอื่นคุณต้องมี **API Key** จาก Google Cloud Console โดยเปิดใช้งาน Gemini API สำหรับโปรเจกต์ของคุณ
2.  **ติดตั้ง Google Generative AI Library:** ติดตั้งไลบรารีที่จำเป็นสำหรับภาษาที่คุณใช้ (เช่น Python หรือ Node.js) ในฝั่งเซิร์ฟเวอร์หรือบน Firebase Cloud Functions เพื่อจัดการการเรียกใช้ API
    ```bash
    npm install @google/generative-ai # สำหรับ Node.js/JavaScript
    ```
3.  **สร้าง Instance ของ Gemini Model:**
    ```javascript
    import { GoogleGenerativeAI } from "@google/generative-ai";

    const API_KEY = "YOUR_GEMINI_API_KEY"; // แทนที่ด้วย API Key ของคุณ
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // ใช้โมเดลที่เหมาะสม
    ```
4.  **ส่งข้อความและรับคำตอบ:**
    ```javascript
    async function generateResponse(prompt) {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    }
    ```
    โค้ดข้างต้นแสดงตัวอย่างการเรียกใช้งานเบื้องต้น โดยใน ELIC เราจะมีการปรับแต่ง `prompt` ให้เหมาะสมกับบทบาทและการตรวจจับประเภทของคำถาม เช่น การขอคำศัพท์ หรือการแก้ไขประโยค

### ⚛️ React Native สำหรับ UI & UX (Cross-Platform Mobile Development)

**React Native** คือ JavaScript framework สำหรับการพัฒนาแอปพลิเคชันมือถือที่สามารถรันได้ทั้งบน iOS และ Android จากโค้ดเบสเดียวกัน ทำให้เราสามารถสร้าง UI ที่สวยงามและตอบสนองได้ดี พร้อมประสิทธิภาพใกล้เคียงกับแอปพลิเคชัน Native

**ข้อดีของ React Native:**

* **Cross-Platform:** เขียนโค้ดครั้งเดียวใช้ได้ทั้งสองแพลตฟอร์ม (iOS, Android)
* **Component-Based:** การสร้าง UI ด้วย Component ที่นำกลับมาใช้ใหม่ได้ ทำให้การพัฒนาเป็นระเบียบและรวดเร็ว
* **Hot Reloading:** ช่วยให้เห็นการเปลี่ยนแปลงโค้ดได้ทันทีโดยไม่ต้องคอมไพล์ใหม่ทั้งหมด
* **Large Community:** มีชุมชนนักพัฒนาขนาดใหญ่ที่คอยช่วยเหลือและมีไลบรารีรองรับมากมาย

### 🔥 Firebase สำหรับการจัดการข้อมูล (Backend & Data Storage)

**Firebase** เป็นแพลตฟอร์มการพัฒนาแอปพลิเคชันที่ให้บริการแบ็คเอนด์แบบครบวงจรจาก Google เราใช้ Firebase สำหรับ:

* **Authentication:** จัดการการเข้าสู่ระบบของผู้ใช้
* **Firestore (NoSQL Database):** สำหรับจัดเก็บข้อมูลการสนทนาของผู้ใช้ ประวัติแชท หรือการตั้งค่าส่วนตัว
* **Cloud Functions:** สำหรับการทำงานฝั่งเซิร์ฟเวอร์ เช่น การเรียกใช้ Gemini API เพื่อป้องกันการเปิดเผย API Key ในฝั่งไคลเอ็นต์โดยตรง

**ข้อดีของ Firebase:**

* **Scalability:** สามารถขยายขนาดได้ง่ายรองรับผู้ใช้จำนวนมาก
* **Realtime Database:** ข้อมูลอัปเดตแบบเรียลไทม์ ทำให้การสนทนาเป็นไปอย่างราบรื่น
* **Easy to Integrate:** เชื่อมต่อกับ React Native ได้อย่างง่ายดาย

---

## 🛠️ การตั้งค่าและติดตั้ง

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/your-username/elic-mobile-application.git](https://github.com/your-username/elic-mobile-application.git)
    cd elic-mobile-application
    ```
2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    # หรือ
    yarn install
    ```
3.  **ตั้งค่า Firebase:**
    * สร้างโปรเจกต์ Firebase และตั้งค่า `firebaseConfig` ในโปรเจกต์ของคุณ
    * ตั้งค่ากฎ (Rules) สำหรับ Firestore ให้เหมาะสม
4.  **ตั้งค่า Gemini API Key:**
    * สร้างไฟล์ `.env` ที่ root ของโปรเจกต์
    * เพิ่ม API Key ของคุณ: `GEMINI_API_KEY=YOUR_API_KEY_HERE`
    * **ข้อควรระวัง:** ไม่ควรเก็บ API Key ไว้ในโค้ดฝั่ง Client โดยตรง ควรใช้ Firebase Cloud Functions เป็นตัวกลางในการเรียกใช้ Gemini API

5.  **รันแอปพลิเคชัน:**
    * สำหรับ iOS: `npx react-native run-ios`
    * สำหรับ Android: `npx react-native run-android`

---

## 🤝 การมีส่วนร่วม

เรายินดีต้อนรับการมีส่วนร่วมจากนักพัฒนาทุกท่าน! หากคุณมีข้อเสนอแนะ การปรับปรุง หรือต้องการรายงานข้อผิดพลาด สามารถ:

* เปิด **Issue** เพื่อแจ้งปัญหาหรือเสนอคุณสมบัติใหม่
* ส่ง **Pull Request** พร้อมการเปลี่ยนแปลงโค้ดของคุณ

---

## 📜 License

โปรเจกต์นี้อยู่ภายใต้ [MIT License](LICENSE)

