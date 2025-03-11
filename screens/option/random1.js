const sentences = {
  'การสนทนาทั่วไป': {
    'ง่าย': [
      'สวัสดีครับ',
      'สบายดีไหม',
      'ขอบคุณครับ',
      'ขอโทษครับ',
      'ไปไหนมาครับ',
      'ทานข้าวหรือยัง',
      'อากาศร้อนจังเลย',
        'ฝนตกหนักมาก',
        'วันนี้อากาศดี',
        'เจอกันพรุ่งนี้',
        'ราคาเท่าไหร่',
        'อร่อยมาก',
        'ชอบมากเลย',
        'เข้าใจแล้ว',
        'ไม่เป็นไรครับ',
        'ยินดีที่ได้รู้จัก',
        'แล้วเจอกันใหม่',
        'โชคดีนะครับ',
        'ขอความช่วยเหลือหน่อย',
        'พูดช้าๆได้ไหม',
        'กรุณาพูดอีกครั้ง',
        'ผมไม่เข้าใจ',
        'พูดภาษาไทยได้นิดหน่อย',
        'ช่วยบอกทางหน่อย',
        'เดินทางปลอดภัย',
        'รอสักครู่',
        'เชิญครับ',
        'ดีมากครับ',
        'เห็นด้วยครับ',
        'ไม่เห็นด้วย',
        'คิดถึงจัง',
        'หิวข้าวแล้ว',
        'ง่วงนอน',
        'เหนื่อยจัง',
        'สนุกมาก',
        'น่าสนใจ',
        'ยินดีด้วย',
        'เสียใจด้วย',
        'ขอโทษที่มาสาย',
        'ช้าลงหน่อย',
        'พักก่อนดีไหม',
        'เริ่มกันเลย',
        'พร้อมหรือยัง',
        'เดี๋ยวก่อน',
        'รอแป๊บนึง',
        'ไม่เป็นไร',
        'ไว้คราวหน้า',
        'เรากลับบ้านกันเถอะ',
        'เราไปกินข้าวกันเถอะ',
        'คุณอยู่ที่ไหน',
        'คุณมาถึงหรือยัง',
        'เราจะเจอกันที่ไหน',
        'ตอนนี้กี่โมงแล้ว',
        'วันนี้วันอะไร',
        'พรุ่งนี้ว่างไหม',
        'คุณต้องการความช่วยเหลือไหม',
        'ไครมีคำถามไหม',
        'ฉันขอดูหน่อยได้ไหม',
        'คุณช่วยถ่ายรูปให้หน่อยได้มั้ยครับ',
        'คุณชอบสีอะไร',
        'คุณอายุเท่าไหร่',
        'คุณมาจากไหน',
        'ฉันมาจากประเทศไทย',
        'ทำงานที่ไหน',
        'คุณมีพี่น้องกี่คน',
        'คุณชอบดูหนังไหม',
        'คุณฟังเพลงบ่อยไหม',
        'คุณเล่นกีฬาอะไร',
        'คุณชอบอาหารอะไร',
        'คุณชอบดื่มอะไร',
        'ฉันชอบสัตว์เลี้ยง',
        'คุณชอบสัตว์อะไร',
        'คุณเคยมาที่นี้มาก่อนไหม',
        'ช่วงนี้คุณเป็นยังไงบ้าง',
        'คุณมีแผนการสำหรับวันนี้ไหม',
        'คุณชอบทำอะไรในเวลาว่าง',
        'คุณจะไปกินข้าวด้วยกันมั้ย',
        'ฉันชอบไปเดินเล่นที่สวนสนุกในบางวัน',
        'มีห้องว่างสำหรับคืนนี้ไหมครับ',
        'ที่พักมีสิ่งอำนวยความสะดวกอะไรบ้าง',
        'คุณมีความสนใจในเรื่องอะไรเป็นพิเศษไหม',
        'ช่วยแนะนำร้านอาหารอร่อยๆแถวนี้หน่อยได้ไหม',
        'วันหยุดชอบทำกิจกรรมอะไรเป็นพิเศษไหม',

    ],
    'ปานกลาง': [
        'คุณทำงานที่บริษัทนี้มานานเท่าไหร่แล้ว',
        'ช่วยเล่าประสบการณ์การท่องเที่ยวของคุณหน่อย',
        'คุณมีแผนจะเรียนต่อในอนาคตไหม',
        'ช่วยแนะนำสถานที่ท่องเที่ยวที่น่าสนใจหน่อย',
        'คุณคิดว่าการเรียนภาษาอังกฤษสำคัญแค่ไหน',
        'ทำไมคุณถึงสนใจเรียนภาษาไทย',
        'คุณชอบอาหารไทยประเภทไหนมากที่สุด',
        'วิธีการเดินทางไปที่นั่นสะดวกที่สุดคือยังไง',
        'คุณมีเคล็ดลับในการเรียนภาษาใหม่ๆยังไงบ้าง',
        'ช่วยอธิบายวิธีการทำอาหารจานโปรดของคุณหน่อย',
        'ประเทศไทยแตกต่างจากประเทศของคุณยังไงบ้าง',
        'คุณมีความประทับใจอะไรเป็นพิเศษในการมาเที่ยวที่นี่',
        'ช่วยแนะนำหนังไทยที่น่าสนใจหน่อยได้ไหม',
        'คุณคิดว่าอะไรเป็นสิ่งที่ท้าทายที่สุดในการใช้ชีวิตที่นี่',
        'ทำไมคุณถึงเลือกมาทำงานที่ประเทศนี้',
        'คุณมีแผนจะอยู่ที่นี่นานแค่ไหน',
        'ช่วยแนะนำวิธีการปรับตัวให้เข้ากับวัฒนธรรมไทยหน่อย',
        'คุณคิดว่าอะไรเป็นเสน่ห์ของประเทศไทย',
        'ช่วยเล่าเรื่องตลกที่เคยเจอในการสื่อสารภาษาไทยหน่อย',
        'คุณมีเป้าหมายในการพัฒนาภาษาไทยยังไงบ้าง',
        'คุณชอบเทศกาลไทยอะไรมากที่สุด เพราะอะไร',
        'ช่วยแนะนำแอพพลิเคชั่นที่ใช้เรียนภาษาไทยหน่อย',
        'คุณมีวิธีจัดการกับความเครียดยังไงบ้าง',
        'ช่วยแนะนำสถานที่ออกกำลังกายแถวนี้หน่อย',
        'คุณมีงานอดิเรกอะไรที่ทำเป็นประจำ',
        'ทำไมคุณถึงชอบทำงานในสายงานนี้',
        'คุณมีเทคนิคในการบริหารเวลายังไงบ้าง',
        'คุณมีแผนจะอยู่ที่นี่นานแค่ไหน',
        'ช่วยแนะนำวิธีการปรับตัวให้เข้ากับวัฒนธรรมไทยหน่อย',
        'คุณคิดว่าอะไรเป็นเสน่ห์ของประเทศไทย',
        'ช่วยเล่าเรื่องตลกที่เคยเจอในการสื่อสารภาษาไทยหน่อย',
        'คุณมีเป้าหมายในการพัฒนาภาษาไทยยังไงบ้าง',
        'คุณชอบเทศกาลไทยอะไรมากที่สุด เพราะอะไร',
        'ช่วยแนะนำแอพพลิเคชั่นที่ใช้เรียนภาษาไทยหน่อย',
        'คุณมีวิธีจัดการกับความเครียดยังไงบ้าง',
        'ช่วยแนะนำสถานที่ออกกำลังกายแถวนี้หน่อย',
        'คุณมีงานอดิเรกอะไรที่ทำเป็นประจำ',
        'ทำไมคุณถึงชอบทำงานในสายงานนี้',
        'คุณมีเทคนิคในการบริหารเวลายังไงบ้าง',
        'คุณคิดว่าอะไรเป็นปัจจัยสำคัญในการทำงานเป็นทีม',
        'ช่วยแนะนำหนังสือที่น่าสนใจเกี่ยวกับวัฒนธรรมไทยหน่อย',
        'คุณมีวิธีเตรียมตัวสำหรับการสัมภาษณ์งานยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญที่สุดในการเรียนรู้ภาษาใหม่',
        'ช่วยแนะนำวิธีการเริ่มต้นธุรกิจเล็กๆหน่อยได้ไหม',
        'คุณมีประสบการณ์อะไรที่ทำให้คุณพัฒนาตัวเองมากที่สุด',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการรักษาสุขภาพจิต',
        'ช่วยแนะนำวิธีการเลือกซื้อของขวัญให้คนพิเศษหน่อย',
        'คุณมีวิธีสร้างแรงบันดาลใจในการทำงานยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์ที่ดี',
        'ช่วยแนะนำวิธีการประหยัดเงินในชีวิตประจำวันหน่อย',
        'คุณมีวิธีจัดการกับความขัดแย้งในทีมงานยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการวางแผนการเดินทาง',
        'ช่วยแนะนำวิธีการเลือกคอร์สเรียนออนไลน์ที่เหมาะสมหน่อย',
        'คุณมีวิธีพัฒนาทักษะการสื่อสารยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างสมดุลระหว่างงานและชีวิตส่วนตัว',
        'ช่วยแนะนำวิธีการเริ่มต้นเขียนบล็อกหรือเว็บไซต์หน่อย',
        'คุณมีวิธีสร้างเครือข่ายทางสังคมยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการเลือกอาชีพที่เหมาะสม',
        'ช่วยแนะนำวิธีการเตรียมตัวสำหรับการสอบสำคัญหน่อย',
        'คุณมีวิธีพัฒนาทักษะการเป็นผู้นำยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความมั่นใจในตัวเอง',
        'ช่วยแนะนำวิธีการเลือกมหาวิทยาลัยที่เหมาะสมหน่อย',
        'คุณมีวิธีจัดการกับความล้มเหลวยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างนิสัยที่ดี',
        'ช่วยแนะนำวิธีการเลือกซื้อรถยนต์มือสองหน่อย',
        'คุณมีวิธีพัฒนาทักษะการแก้ปัญหาในที่ทำงานยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสุขในชีวิตประจำวัน',
        'ช่วยแนะนำวิธีการเลือกซื้อบ้านหรือคอนโดมิเนียมหน่อย',
        'คุณมีวิธีพัฒนาทักษะการฟังยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับเพื่อนร่วมงาน',
        'ช่วยแนะนำวิธีการเลือกซื้ออุปกรณ์อิเล็กทรอนิกส์หน่อย',
        'คุณมีวิธีพัฒนาทักษะการพูดในที่สาธารณะยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับครอบครัว',
        'ช่วยแนะนำวิธีการเลือกซื้อประกันสุขภาพหน่อย',
        'คุณมีวิธีพัฒนาทักษะการเขียนยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับลูกค้า',
        'ช่วยแนะนำวิธีการเลือกซื้อเครื่องใช้ไฟฟ้าภายในบ้านหน่อย',
        'คุณมีวิธีพัฒนาทักษะการคิดวิเคราะห์ยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับเพื่อน',
        'ช่วยแนะนำวิธีการเลือกซื้อเสื้อผ้าออนไลน์หน่อย',
        'คุณมีวิธีพัฒนาทักษะการจัดการโครงการยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคู่รัก',
        'ช่วยแนะนำวิธีการเลือกซื้อเครื่องสำอางค์หน่อย',
        'คุณมีวิธีพัฒนาทักษะการทำงานร่วมกับผู้อื่นยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับเพื่อนบ้าน',
        'ช่วยแนะนำวิธีการเลือกซื้อของใช้เด็กหน่อย',
        'คุณมีวิธีพัฒนาทักษะการบริหารเงินยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับครูหรืออาจารย์',
        'ช่วยแนะนำวิธีการเลือกซื้ออาหารเสริมหน่อย',
        'คุณมีวิธีพัฒนาทักษะการวางแผนยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับสัตว์เลี้ยง',
        'ช่วยแนะนำวิธีการเลือกซื้อเครื่องดื่มเพื่อสุขภาพหน่อย',
        'คุณมีวิธีพัฒนาทักษะการวิจัยยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนแปลกหน้า',
        'ช่วยแนะนำวิธีการเลือกซื้อของตกแต่งบ้านหน่อย',
        'คุณมีวิธีพัฒนาทักษะการตลาดยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในชุมชน',
        'ช่วยแนะนำวิธีการเลือกซื้อของชำร่วยหน่อย',
        'คุณมีวิธีพัฒนาทักษะการขายยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในครอบครัว',
        'ช่วยแนะนำวิธีการเลือกซื้อของเล่นเด็กหน่อย',
        'คุณมีวิธีพัฒนาทักษะการบริการลูกค้ายังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในที่ทำงาน',
        'ช่วยแนะนำวิธีการเลือกซื้อของขวัญปีใหม่หน่อย',
        'คุณมีวิธีพัฒนาทักษะการจัดการความเสี่ยงยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในสังคม',
        'ช่วยแนะนำวิธีการเลือกซื้อของใช้ในครัวหน่อย',
        'คุณมีวิธีพัฒนาทักษะการจัดการข้อมูลยังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในวงการ',
        'ช่วยแนะนำวิธีการเลือกซื้อของใช้ในห้องน้ำหน่อย',
        'คุณมีวิธีพัฒนาทักษะการจัดการเวลายังไงบ้าง',
        'คุณคิดว่าอะไรเป็นสิ่งสำคัญในการสร้างความสัมพันธ์กับคนในแวดวง',
        'ช่วยแนะนำวิธีการเลือกซื้อของใช้ในห้องนอนหน่อย',
        'สุนัขพันธุ์นี้มีลักษณะทางพันธุกรรมที่โดดเด่นอย่างไร',
        'แมวของคุณมีพฤติกรรมที่บ่งบอกถึงความฉลาดอย่างไร',
        'การดูแลสัตว์เลี้ยงที่มีโรคประจำตัวต้องทำอย่างไร',
        'อาหารสำหรับสัตว์เลี้ยงแต่ละประเภทมีความแตกต่างกันอย่างไร',
        'การฝึกสัตว์เลี้ยงให้มีวินัยต้องใช้วิธีการใด',
        'การสื่อสารกับสัตว์เลี้ยงทำได้อย่างไร',
        'สัตว์เลี้ยงสามารถบำบัดอาการป่วยทางจิตใจของคนได้อย่างไร',
        'การเลือกสัตว์เลี้ยงให้เหมาะสมกับไลฟ์สไตล์ของตนเองต้องพิจารณาอะไรบ้าง',
        'ปัญหาพฤติกรรมของสัตว์เลี้ยงมีสาเหตุจากอะไร',
        'การป้องกันและกำจัดปรสิตในสัตว์เลี้ยงทำได้อย่างไร',
        'สวัสดีครับ ไม่ได้พบกันนานเลยนะครับ สบายดีหรือเปล่าครับ',
        'สวัสดีครับ วันนี้คุณดูสดใสเป็นพิเศษนะครับ มีเรื่องน่ายินดีหรือเปล่าครับ',
        'ผมขอขอบคุณสำหรับคำแนะนำและความรู้ที่ท่านได้แบ่งปันให้แก่ผมครับ',
        'ผมขอขอบคุณสำหรับกำลังใจและการสนับสนุนที่ท่านได้มอบให้แก่ผมครับ',
        'ผมขอขอบคุณสำหรับทุกสิ่งทุกอย่างที่ท่านได้กระทำให้แก่ผมครับ',
        'ผมขอขอบคุณที่ท่านได้เสียสละเวลาอันมีค่าของท่านเพื่อช่วยเหลือผมครับ',
        'ผมขอขอบคุณที่ท่านได้ทำให้ผมได้เรียนรู้และเติบโตขึ้นครับ',
        'ผมขอให้คุณมีความสุขและสุขภาพแข็งแรงครับ',
        'ผมหวังว่าคุณจะประสบความสำเร็จในหน้าที่การงานครับ',
        'ผมขอเป็นกำลังใจให้คุณในการทำสิ่งต่างๆ ครับ',
        'ผมขอให้คุณเดินทางโดยสวัสดิภาพครับ',
        'ผมขอให้คุณมีความสุขกับการพักผ่อนครับ',
        'ผมขอให้คุณมีวันที่ดีครับ',
        'ผมขอให้คุณโชคดีครับ',
        'ผมขอให้คุณประสบความสำเร็จครับ',
        'ผมขอให้คุณมีความสุขครับ',
        'ผมขอให้คุณสบายใจครับ',
        'ผมขอให้คุณปลอดภัยครับ',
        'ผมขอให้คุณมีความสุขกับการเดินทางครับ',
        'ผมขอให้คุณมีความสุขกับการทำงานครับ',
        'ผมขอให้คุณมีความสุขกับการเรียนครับ',
        'ผมขอให้คุณมีความสุขกับชีวิตครับ',
        'ผมขอให้คุณมีสุขภาพแข็งแรงครับ',
        'ผมขอให้คุณมีความสุขกับครอบครัวครับ',
        'ผมขอให้คุณมีความสุขกับเพื่อนๆ ครับ',
        'ผมขอให้คุณมีความสุขกับสัตว์เลี้ยงครับ',
        'ผมขอให้คุณมีความสุขกับทุกสิ่งทุกอย่างครับ',
        'ผมขอให้คุณมีแต่ความสุขครับ',
        'วันนี้คุณดูสดชื่นจังเลยนะครับ',
        'ผมชอบเสื้อผ้าของคุณจังเลยครับ',
        'ผมขอชมว่าคุณเป็นคนที่มีความสามารถมากครับ',
        'ผมขอชื่นชมในความพยายามของคุณครับ',
        'ผมขอขอบคุณสำหรับคำชมของคุณครับ',
        'ผมรู้สึกเป็นเกียรติที่ได้รู้จักคุณครับ',
        'ผมรู้สึกดีใจที่ได้พบคุณครับ',
        'ผมหวังว่าเราจะได้พบกันอีกนะครับ',
        'ผมขอให้คุณมีความสุขกับการพักผ่อนนะครับ',
        'ผมขอให้คุณเดินทางกลับบ้านอย่างปลอดภัยนะครับ',
        'ผมขอให้คุณมีวันที่ดีและมีความสุขนะครับ',
        'ผมขอให้คุณมีความสุขกับวันหยุดนะครับ',
        'ผมขอให้คุณมีความสุขกับเทศกาลต่างๆ นะครับ',
        'ผมขอให้คุณมีความสุขกับปีใหม่นะครับ',
        'ผมขอให้คุณมีความสุขกับวันเกิดนะครับ',
        'ผมขอให้คุณมีความสุขกับทุกๆ วันนะครับ',
        'ผมขอให้คุณมีความสุขกับชีวิตนะครับ',
        'ผมขอให้คุณมีสุขภาพแข็งแรงและมีความสุขนะครับ',
        'วันนี้อากาศเปลี่ยนแปลงอย่างกะทันหันนะครับ',
        'การเดินทางในวันนี้ดูเหมือนจะติดขัดเป็นพิเศษนะครับ',
        'ร้านอาหารแห่งนี้มีเมนูอาหารที่น่าสนใจมากมายเลยนะครับ',
        'ผมรู้สึกประทับใจกับการบริการของพนักงานที่นี่มากครับ',

    ]
  },
  'การจองโรงแรม': {
    'ง่าย': [
      'ผมต้องการจองห้องพัก',
      'มีอาหารเช้าไหม',
      'ห้องพักราคาเท่าไหร่',
      'ผมต้องการจองห้องพัก',
        'มีอาหารเช้าไหม',
        'มีห้องว่างสำหรับคืนนี้ไหม',
        'อยากทราบราคาห้องพักสำหรับสองคน',
        'มีห้องพักแบบเตียงเดี่ยวไหม',
        'มีห้องพักแบบเตียงคู่ไหม',
        'ห้องพักมีอาหารเช้าให้ไหม',
        'มีสระว่ายน้ำไหม',
        'มีที่จอดรถไหม',
        'โรงแรมอยู่ใกล้สถานีรถไฟฟ้าไหม',
        'มีบริการ Wi-Fi ไหม',
        'สามารถเช็คอินได้กี่โมง',
        'สามารถเช็คเอาท์ได้กี่โมง',
        'มีห้องพักสำหรับครอบครัวไหม',
        'มีห้องพักสำหรับผู้พิการไหม',
        'มีบริการรถรับส่งสนามบินไหม',
        'มีบริการนวดไหม',
        'มีห้องออกกำลังกายไหม',
        'มีร้านอาหารในโรงแรมไหม',
        'มีบาร์ในโรงแรมไหม',
        'มีบริการซักรีดไหม',
        'มีตู้เย็นในห้องพักไหม',
        'มีกาต้มน้ำในห้องพักไหม',
        'มีไดร์เป่าผมในห้องพักไหม',
        'มีทีวีในห้องพักไหม',
        'มีเครื่องปรับอากาศในห้องพักไหม',
        'ห้องพักมีระเบียงไหม',
        'ต้องการจองห้องพักสำหรับสองคน',
        'ต้องการจองห้องพักสำหรับคืนวันที่ 15',
        'ต้องการจองห้องพักแบบเตียงคู่',
        'ต้องการจองห้องพักพร้อมอาหารเช้า',
        'ต้องการจองห้องพักที่มีวิวทะเล',
        'ต้องการจองห้องพักสำหรับหนึ่งอาทิตย์',
        'ต้องการจองห้องพักสำหรับหนึ่งเดือน',
        'ขอทราบหมายเลขการจอง',
        'ขอทราบชื่อผู้เข้าพัก',
        'ขอทราบเบอร์โทรศัพท์',
        'ขอทราบอีเมล',
        'ต้องการชำระเงินด้วยบัตรเครดิต',
        'ต้องการชำระเงินด้วยเงินสด',
        'มีโปรโมชั่นส่วนลดไหม',
        'สามารถยกเลิกการจองได้ไหม',
        'มีค่าธรรมเนียมการยกเลิกไหม',
        'ต้องการเปลี่ยนแปลงการจอง',
        'ต้องการเพิ่มจำนวนผู้เข้าพัก',
        'ต้องการเปลี่ยนประเภทห้องพัก',
        'ต้องการเลื่อนวันเข้าพัก',
        'ต้องการจองห้องพักสำหรับกรุ๊ปทัวร์',
        'ต้องการใบเสร็จรับเงิน',
        'ขอบคุณสำหรับการจอง',
        'ยินดีต้อนรับสู่โรงแรมของเรา',
        'มีอะไรให้ช่วยเหลือเพิ่มเติมไหม',
        'ต้องการผ้าเช็ดตัวเพิ่ม',
        'ต้องการหมอนเพิ่ม',
        'เครื่องปรับอากาศไม่ทำงาน',
        'ไฟในห้องน้ำเสีย',
        'ต้องการแม่บ้านทำความสะอาดห้อง',
        'ต้องการอาหารเช้าที่ห้อง',
        'ต้องการสั่งอาหารเย็น',
        'ต้องการใช้บริการรูมเซอร์วิส',
        'ต้องการสอบถามเกี่ยวกับสถานที่ท่องเที่ยว',
        'ต้องการจองทัวร์',
        'ต้องการเช่ารถ',
        'ต้องการใช้บริการอินเทอร์เน็ต',
        'ต้องการสอบถามเกี่ยวกับบริการนวด',
        'ต้องการใช้บริการห้องออกกำลังกาย',
        'ต้องการสอบถามเกี่ยวกับร้านอาหาร',
        'ต้องการสอบถามเกี่ยวกับบาร์',
        'ต้องการสอบถามเกี่ยวกับบริการซักรีด',
        'ต้องการสอบถามเกี่ยวกับตู้เย็น',
        'ต้องการสอบถามเกี่ยวกับกาต้มน้ำ',
        'ต้องการสอบถามเกี่ยวกับไดร์เป่าผม',
        'ต้องการสอบถามเกี่ยวกับทีวี',
        'ต้องการสอบถามเกี่ยวกับเครื่องปรับอากาศ',
        'ต้องการสอบถามเกี่ยวกับระเบียง',
        'ต้องการความช่วยเหลือ',
        'ขอบคุณสำหรับทุกอย่าง',
        'มีห้องว่างประเภทดีลักซ์สำหรับคืนนี้ไหม',
        'อยากทราบราคาห้องพักแบบสวีทสำหรับสองคน',
        'มีห้องพักแบบเตียงควีนไซส์ไหม',
        'มีห้องพักแบบเตียงคิงไซส์ไหม',
        'ห้องพักมีอาหารเช้าแบบบุฟเฟต์ให้ไหม',
        'มีสระว่ายน้ำสำหรับเด็กไหม',
        'มีที่จอดรถส่วนตัวไหม',
        'โรงแรมอยู่ใกล้สถานีรถไฟฟ้าใต้ดินไหม',
        'มีบริการ Wi-Fi ความเร็วสูงไหม',
        'สามารถเช็คอินได้ตั้งแต่กี่โมง',
        'สามารถเช็คเอาท์ได้ก่อนเที่ยงวันไหม',
        'มีห้องพักสำหรับครอบครัวขนาดใหญ่ไหม',
        'มีห้องพักสำหรับผู้พิการที่มีสิ่งอำนวยความสะดวกครบครันไหม',
        'มีบริการรถรับส่งสนามบินตลอด 24 ชั่วโมงไหม',
        'มีบริการนวดแผนไทยและสปาไหม',
        'มีห้องออกกำลังกายพร้อมอุปกรณ์ครบครันไหม',
        'มีร้านอาหารนานาชาติในโรงแรมไหม',
        'มีบาร์บนดาดฟ้าไหม',
        'มีบริการซักรีดเสื้อผ้าแบบด่วนไหม',
        'มีตู้เย็นขนาดใหญ่ในห้องพักไหม',
        'มีเครื่องชงกาแฟในห้องพักไหม',
    ],
    'ปานกลาง': [
      'ผมต้องการห้องพักแบบดีลักซ์วิวทะเล',
      'มีบริการรถรับส่งสนามบินไหม',
      'สามารถเช็คอินก่อนเวลาได้ไหม',
      'มีชุดคลุมอาบน้ำและรองเท้าแตะในห้องพักไหม',
        'มีทีวีจอแบนพร้อมช่องสัญญาณดาวเทียมในห้องพักไหม',
        'มีเครื่องปรับอากาศที่สามารถปรับอุณหภูมิได้ตามต้องการในห้องพักไหม',
        'ห้องพักมีระเบียงส่วนตัวพร้อมวิวเมืองไหม',
        'ต้องการจองห้องพักประเภทซูพีเรียสำหรับสองคน',
        'ต้องการจองห้องพักสำหรับคืนวันที่... ถึง ...',
        'ต้องการจองห้องพักแบบเตียงคู่พร้อมวิวแม่น้ำ',
        'ต้องการจองห้องพักพร้อมอาหารเช้าแบบคอนติเนนตัล',
        'ต้องการจองห้องพักที่มีระเบียงส่วนตัวพร้อมวิวทะเล',
        'ต้องการจองห้องพักสำหรับหนึ่งอาทิตย์พร้อมส่วนลดพิเศษ',
        'ต้องการจองห้องพักสำหรับหนึ่งเดือนพร้อมสิทธิประโยชน์เพิ่มเติม',
        'ขอทราบหมายเลขการจองและรายละเอียดการจอง',
        'ขอทราบชื่อผู้เข้าพักและหมายเลขหนังสือเดินทาง',
        'ขอทราบเบอร์โทรศัพท์และอีเมลที่สามารถติดต่อได้',
        'ต้องการชำระเงินด้วยบัตรเครดิตวีซ่า/มาสเตอร์การ์ด',
        'ต้องการชำระเงินด้วยเงินสดเมื่อเช็คอิน',
        'มีโปรโมชั่นส่วนลดสำหรับสมาชิกโรงแรมไหม',
        'สามารถยกเลิกการจองได้ฟรีก่อนวันเข้าพักกี่วัน',
        'มีค่าธรรมเนียมการยกเลิกหากยกเลิกหลังจากกำหนด',
        'ต้องการเปลี่ยนแปลงการจองเป็นห้องพักประเภทอื่น',
        'ต้องการเพิ่มจำนวนผู้เข้าพักโดยมีค่าใช้จ่ายเพิ่มเติม',
        'ต้องการเปลี่ยนประเภทเตียงในห้องพัก',
        'ต้องการเลื่อนวันเข้าพักเนื่องจากเหตุผลส่วนตัว',
        'ต้องการจองห้องพักสำหรับกรุ๊ปทัวร์พร้อมข้อเสนอพิเศษ',
        'ต้องการใบเสร็จรับเงินสำหรับการจองห้องพัก',
        'ขอบคุณสำหรับการจองห้องพักค่ะ/ครับ',
        'ยินดีต้อนรับสู่โรงแรมของเรา หวังว่าคุณจะมีความสุขกับการพักผ่อน',
        'มีอะไรให้ช่วยเหลือเพิ่มเติมเกี่ยวกับการจองห้องพักไหม',
        'หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ตลอด 24 ชั่วโมง',
        'ต้องการผ้าเช็ดตัวและเครื่องใช้ในห้องน้ำเพิ่ม',
        'ต้องการหมอนและผ้าห่มเพิ่ม',
        'เครื่องปรับอากาศในห้องพักมีปัญหา ไม่สามารถปรับอุณหภูมิได้',
        'ไฟในห้องน้ำเสียและต้องการให้ช่างมาซ่อม',
        'ต้องการแม่บ้านทำความสะอาดห้องพักและเปลี่ยนผ้าปูที่นอน',
        'ต้องการอาหารเช้าแบบอเมริกันที่ห้องพัก',
        'ต้องการสั่งอาหารเย็นจากเมนูรูมเซอร์วิส',
        'ต้องการใช้บริการอินเทอร์เน็ต Wi-Fi ฟรี',
        'ต้องการสอบถามเกี่ยวกับสถานที่ท่องเที่ยวใกล้เคียงและวิธีการเดินทาง',
        'ต้องการจองทัวร์ท่องเที่ยวรอบเมืองพร้อมไกด์',
        'ต้องการเช่ารถพร้อมคนขับสำหรับหนึ่งวัน',
        'ต้องการใช้บริการนวดแผนไทยและสปา',
        'ต้องการใช้บริการห้องออกกำลังกายและสระว่ายน้ำ',
        'ต้องการสอบถามเกี่ยวกับร้านอาหารและบาร์ในโรงแรม',
        'ต้องการสอบถามเกี่ยวกับบริการซักรีดและรีดผ้า',
        'ต้องการสอบถามเกี่ยวกับตู้เย็นและเครื่องใช้ในห้องพัก',
        'ต้องการสอบถามเกี่ยวกับกาต้มน้ำและเครื่องชงกาแฟ',
        'ต้องการสอบถามเกี่ยวกับไดร์เป่าผมและเครื่องใช้ในห้องน้ำ',
        'ต้องการสอบถามเกี่ยวกับทีวีและช่องสัญญาณดาวเทียม',
        'ต้องการสอบถามเกี่ยวกับเครื่องปรับอากาศและการควบคุมอุณหภูมิ',
        'ต้องการสอบถามเกี่ยวกับระเบียงและวิวทิวทัศน์',
        'ต้องการความช่วยเหลือในการจองตั๋วเครื่องบินหรือตั๋วรถไฟ',
        'ต้องการความช่วยเหลือในการแลกเงินตรา',
        'ต้องการความช่วยเหลือในการจัดกิจกรรมพิเศษ',
        'ขอบคุณสำหรับทุกอย่างที่โรงแรมได้ให้บริการ',
        'ต้องการเช็คเอาท์และชำระค่าใช้จ่าย',
        'ต้องการตรวจสอบค่าใช้จ่ายทั้งหมดก่อนชำระเงิน',
        'ต้องการใบเสร็จรับเงินสำหรับการเข้าพัก',
        'ขอบคุณสำหรับการบริการที่ดีเยี่ยมตลอดการเข้าพัก',
        'ไว้โอกาสหน้าจะมาพักที่โรงแรมอีกครั้ง',
        'มีอะไรให้ช่วยเหลือเพิ่มเติมเกี่ยวกับการเช็คเอาท์ไหม',
        'เดินทางโดยสวัสดิภาพและขอให้เดินทางถึงจุดหมายอย่างปลอดภัย',
        'ขอบคุณที่มาพักกับเรา หวังว่าคุณจะมีความสุขกับการพักผ่อน',
        'ยินดีที่ได้ต้อนรับและให้บริการคุณ หวังว่าคุณจะกลับมาพักกับเราอีกครั้ง',
        'หวังว่าคุณจะมีความสุขกับการพักผ่อนและมีประสบการณ์ที่ดีกับโรงแรมของเรา',
        'มีห้องพักประเภทพรีเมียร์สำหรับคืนนี้หรือไม่',
        'อยากทราบราคาห้องพักแบบเอ็กเซ็กคูทีฟสวีทสำหรับสองท่าน',
        'มีห้องพักแบบเตียงคิงไซส์พร้อมวิวแม่น้ำเจ้าพระยาหรือไม่',
        'มีห้องพักแบบเตียงควีนไซส์พร้อมระเบียงส่วนตัวหรือไม่',
        'ห้องพักมีอาหารเช้าแบบบุฟเฟต์นานาชาติให้บริการหรือไม่',
        'มีสระว่ายน้ำระบบเกลือสำหรับเด็กและผู้ใหญ่หรือไม่',
        'มีที่จอดรถส่วนตัวพร้อมระบบรักษาความปลอดภัยตลอด 24 ชั่วโมงหรือไม่',
        'โรงแรมตั้งอยู่ใกล้สถานีรถไฟฟ้าบีทีเอสหรือไม่',
        'มีบริการ Wi-Fi ความเร็วสูงพร้อมระบบรักษาความปลอดภัยข้อมูลหรือไม่',
        'สามารถเช็คอินได้ตั้งแต่เวลาใดและมีบริการเช็คอินด่วนหรือไม่',
        'สามารถเช็คเอาท์ได้ก่อนเวลา 14:00 น. โดยไม่มีค่าใช้จ่ายเพิ่มเติมหรือไม่',
        'มีห้องพักสำหรับครอบครัวขนาดใหญ่พร้อมห้องนั่งเล่นและห้องครัวเล็กหรือไม่',
        'มีห้องพักสำหรับผู้พิการพร้อมสิ่งอำนวยความสะดวกครบครันตามมาตรฐานสากลหรือไม่',
        'มีบริการรถรับส่งสนามบินพร้อมพนักงานขับรถส่วนตัวหรือไม่',
        'มีบริการนวดแผนไทยและสปาทรีตเมนต์หลากหลายรูปแบบหรือไม่',
        'มีห้องออกกำลังกายพร้อมอุปกรณ์ครบครันและเทรนเนอร์ส่วนตัวหรือไม่',
        'มีร้านอาหารนานาชาติและร้านอาหารไทยรสชาติต้นตำรับในโรงแรมหรือไม่',
        'มีบาร์บนดาดฟ้าพร้อมวิวเมืองแบบพาโนรามาหรือไม่',
        'มีบริการซักรีดเสื้อผ้าแบบด่วนพิเศษและบริการซักแห้งหรือไม่',
        'มีตู้เย็นขนาดใหญ่พร้อมเครื่องดื่มและขนมในห้องพักหรือไม่',
        'มีเครื่องชงกาแฟเอสเปรสโซและอุปกรณ์ชงชาในห้องพักหรือไม่',
        'มีชุดคลุมอาบน้ำเนื้อดีและรองเท้าแตะสำหรับผู้เข้าพักทุกท่านหรือไม่',
        'มีทีวีจอแบนขนาดใหญ่พร้อมช่องสัญญาณดาวเทียมและภาพยนตร์ตามต้องการในห้องพักหรือไม่',
        'มีเครื่องปรับอากาศที่สามารถปรับอุณหภูมิและควบคุมความชื้นได้ตามต้องการในห้องพักหรือไม่',
        'ห้องพักมีระเบียงส่วนตัวพร้อมเฟอร์นิเจอร์กลางแจ้งและวิวทิวทัศน์ที่สวยงามหรือไม่',
        'ต้องการจองห้องพักประเภทดีลักซ์พรีเมียร์สำหรับสองท่าน',
        'ต้องการจองห้องพักสำหรับคืนวันที่... ถึง ... พร้อมอาหารเช้า',
        'ต้องการจองห้องพักแบบเตียงคิงไซส์พร้อมวิวสระว่ายน้ำ',
        'ต้องการจองห้องพักพร้อมอาหารเช้าแบบบุฟเฟต์นานาชาติและอินเทอร์เน็ต Wi-Fi ฟรี',
        'ต้องการจองห้องพักที่มีระเบียงส่วนตัวพร้อมวิวทะเลและพระอาทิตย์ตกดิน',
        'ต้องการจองห้องพักสำหรับหนึ่งอาทิตย์พร้อมส่วนลดพิเศษสำหรับสมาชิก',
        'ต้องการจองห้องพักสำหรับหนึ่งเดือนพร้อมสิทธิประโยชน์เพิ่มเติมเช่น บริการรถรับส่งสนามบินฟรี',
        'ขอทราบหมายเลขการจองและรายละเอียดการจองทั้งหมด',
        'ขอทราบชื่อผู้เข้าพักและหมายเลขหนังสือเดินทางหรือบัตรประชาชน',
        'ขอทราบเบอร์โทรศัพท์มือถือและอีเมลที่สามารถติดต่อได้ตลอดเวลา',
        'ต้องการชำระเงินด้วยบัตรเครดิตวีซ่า/มาสเตอร์การ์ด/อเมริกันเอ็กซ์เพรส',
        'ต้องการชำระเงินด้วยเงินสดเมื่อเช็คอินพร้อมรับใบเสร็จรับเงิน',
        'มีโปรโมชั่นส่วนลดสำหรับคู่รักหรือครอบครัวหรือไม่',
        'สามารถยกเลิกการจองได้ฟรีโดยไม่มีค่าธรรมเนียมก่อนวันเข้าพักกี่วัน',
        'มีค่าธรรมเนียมการยกเลิกหากยกเลิกหลังจากกำหนดเวลาหรือไม่',
        'ต้องการเปลี่ยนแปลงการจองเป็นห้องพักประเภทที่สูงกว่าพร้อมค่าใช้จ่ายเพิ่มเติม',
        'ต้องการเพิ่มจำนวนผู้เข้าพักโดยมีค่าใช้จ่ายเพิ่มเติมและเตียงเสริม',
        'ต้องการเปลี่ยนประเภทเตียงในห้องพักหากมีห้องว่าง',
        'ต้องการเลื่อนวันเข้าพักเนื่องจากเหตุผลทางธุรกิจหรือส่วนตัว',
        'ต้องการจองห้องพักสำหรับกรุ๊ปทัวร์พร้อมข้อเสนอพิเศษและกิจกรรมกลุ่ม',
        'ต้องการใบเสร็จรับเงินสำหรับการจองห้องพักเพื่อใช้ในการเบิกค่าใช้จ่าย',
        'ขอบคุณสำหรับการจองห้องพัก หวังว่าคุณจะมีความสุขกับการพักผ่อนที่โรงแรมของเรา',
        'ยินดีต้อนรับสู่โรงแรมของเรา หวังว่าคุณจะได้รับประสบการณ์การพักผ่อนที่น่าประทับใจ',
        'มีอะไรให้ช่วยเหลือเพิ่มเติมเกี่ยวกับการจองห้องพักหรือบริการอื่นๆ ของโรงแรมหรือไม่',
        'หากมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม สามารถติดต่อเราได้ตลอด 24 ชั่วโมง',
        'ต้องการผ้าเช็ดตัวและเครื่องใช้ในห้องน้ำเพิ่มเติม',
        'ต้องการหมอนและผ้าห่มเพิ่มเนื่องจากอากาศเย็น',
        'เครื่องปรับอากาศในห้องพักมีปัญหา ไม่สามารถปรับอุณหภูมิได้ตามต้องการ',
        'ไฟในห้องน้ำเสียและต้องการให้ช่างไฟฟ้ามาตรวจสอบและแก้ไข',
        'ต้องการแม่บ้านทำความสะอาดห้องพักและเปลี่ยนผ้าปูที่นอนใหม่',
        'ต้องการอาหารเช้าแบบคอนติเนนตัลที่ห้องพักพร้อมกาแฟและน้ำผลไม้',
        'ต้องการสั่งอาหารเย็นจากเมนูรูมเซอร์วิสพร้อมไวน์แดง',
        'ต้องการใช้บริการอินเทอร์เน็ต Wi-Fi ฟรีเพื่อทำงาน',
        'ต้องการสอบถามเกี่ยวกับสถานที่ท่องเที่ยวใกล้เคียงและวิธีการเดินทางโดยรถสาธารณะ',
        'ต้องการจองทัวร์ท่องเที่ยวรอบเมืองพร้อมไกด์ภาษาอังกฤษ',
        'ต้องการเช่ารถพร้อมคนขับสำหรับหนึ่งวันเพื่อเดินทางไปยังสถานที่ต่างๆ',
        'ต้องการใช้บริการนวดแผนไทยและสปาเพื่อผ่อนคลาย',
        'ต้องการใช้บริการห้องออกกำลังกายและสระว่ายน้ำเพื่อสุขภาพ',
        'ต้องการสอบถามเกี่ยวกับร้านอาหารและบาร์แนะนำในบริเวณใกล้เคียง',
        'ต้องการสอบถามเกี่ยวกับบริการซักรีดและรีดผ้าพร้อมบริการรับส่ง',
        'ต้องการสอบถามเกี่ยวกับตู้เย็นและเครื่องใช้ในห้องพักเพิ่มเติม',
        'ต้องการสอบถามเกี่ยวกับกาต้มน้ำและเครื่องชงกาแฟในห้องพัก',
        'ต้องการสอบถามเกี่ยวกับไดร์เป่าผมและเครื่องใช้ในห้องน้ำเพิ่มเติม',
        'ต้องการสอบถามเกี่ยวกับทีวีและช่องสัญญาณดาวเทียมที่ให้บริการ',
        'ต้องการสอบถามเกี่ยวกับเครื่องปรับอากาศและการตั้งค่าอุณหภูมิที่เหมาะสม',
        'ต้องการสอบถามเกี่ยวกับระเบียงและวิวทิวทัศน์จากห้องพัก',
        'ต้องการความช่วยเหลือในการจองตั๋วเครื่องบินหรือตั๋วรถไฟสำหรับการเดินทาง',
        'ต้องการความช่วยเหลือในการแลกเงินตราต่างประเทศ',
        'ต้องการความช่วยเหลือในการจัดกิจกรรมพิเศษเช่น การจัดงานเลี้ยงหรือการประชุม',
        'ขอบคุณสำหรับทุกอย่างที่โรงแรมได้ให้บริการอย่างดีเยี่ยม',
        'ต้องการเช็คเอาท์และชำระค่าใช้จ่ายทั้งหมด',
        'ต้องการตรวจสอบรายละเอียดค่าใช้จ่ายทั้งหมดก่อนชำระเงิน',
        'ต้องการใบเสร็จรับเงินสำหรับการเข้าพักเพื่อใช้ในการเบิกค่าใช้จ่าย',
        'ขอบคุณสำหรับการบริการที่ดีเยี่ยมและความสะดวกสบายตลอดการเข้าพัก',
        'ไว้โอกาสหน้าจะกลับมาพักที่โรงแรมอีกครั้งอย่างแน่นอน',
        'มีอะไรให้ช่วยเหลือเพิ่มเติมเกี่ยวกับการเช็คเอาท์หรือการเดินทางหรือไม่',
        'เดินทางโดยสวัสดิภาพและขอให้เดินทางถึงจุดหมายปลายทางอย่างปลอดภัย',
        'ขอบคุณที่มาพักกับเรา หวังว่าคุณจะมีความสุขกับการพักผ่อนและมีประสบการณ์ที่ดี',
        'ยินดีที่ได้ต้อนรับและให้บริการคุณ หวังว่าคุณจะกลับมาพักกับเราอีกครั้งในอนาคต',
        'หวังว่าคุณจะมีความสุขกับการพักผ่อนและมีประสบการณ์ที่น่าประทับใจกับโรงแรมของเรา',

    ]
  },
  'การสั่งอาหาร': {
    'ง่าย': [
      'ขอข้าวผัดไก่หนึ่งที่',
      'สั่งไก่ทอดห้าชิ้น',
      'ขอน้ำเปล่าครับ',
      'ขอดูเมนูครับ',
      'ผมต้องการสั่งอาหาร',
        'มีเมนูแนะนำไหม',
        'ขอข้าวผัดไก่หนึ่งที่',
        'เอาผัดไทยกุ้งสดไม่ใส่พริก',
        'สั่งต้มยำกุ้งน้ำใสหนึ่งถ้วย',
        'ขอแกงเขียวหวานไก่เพิ่มหวาน',
        'เอาส้มตำปูปลาร้าไม่เผ็ด',
        'สั่งไก่ทอดห้าชิ้น',
        'ขอเฟรนช์ฟรายส์ขนาดกลาง',
        'เอาพิซซ่าหน้าฮาวายเอี้ยนหนึ่งถาด',
        'สั่งสปาเก็ตตี้คาโบนาร่าหนึ่งจาน',
        'ขอชาเขียวเย็นไม่ใส่นม',
        'เอาน้ำอัดลมหนึ่งแก้ว',
        'สั่งกาแฟเย็นไม่ใส่น้ำตาล',
        'ขอขนมเค้กหนึ่งชิ้น',
        'เอาไอศกรีมหนึ่งถ้วย',
        'สั่งผลไม้รวมหนึ่งจาน',
        'ขอเพิ่มน้ำจิ้ม',
        'เอาช้อนส้อมเพิ่ม',
        'สั่งกลับบ้าน',
        'ทานที่ร้าน',
        'คิดเงิน',
        'อาหารร้านนี้อร่อยมาก',
        'บริการของพนักงานดีเยี่ยม',
        'บรรยากาศร้านอบอุ่นเป็นกันเอง',
        'ร้านสะอาดและตกแต่งสวยงาม',
        'ราคาอาหารเหมาะสมกับคุณภาพ',
        'วัตถุดิบที่ใช้สดใหม่',
        'อาหารแต่ละจานมีรสชาติเป็นเอกลักษณ์',
        'ร้านนี้เป็นที่นิยมของคนในท้องถิ่น',
        'การเดินทางมาร้านสะดวก',
        'ร้านมีเมนูอาหารหลากหลาย',
        'ผมชอบอาหารร้านนี้',
        'ผมมาทานอาหารที่นี่เป็นประจำ',
        'ผมแนะนำร้านนี้ให้กับเพื่อน',
        'ผมจะกลับมาทานอาหารที่นี่อีก',
        'ผมประทับใจกับร้านนี้',
        'ผมคิดว่าอาหารร้านนี้คุ้มค่า',
        'ผมอยากให้ร้านนี้ปรับปรุงเรื่อง...',
        'ผมรู้สึกว่าร้านนี้...',
        'ผมมีความสุขที่ได้มาทานอาหารที่นี่',
        'ผมจะบอกต่อเกี่ยวกับร้านนี้ให้กับคนอื่นๆ',
        'ร้านนี้มีเมนูแนะนำอะไรบ้าง',
        'อาหารจานนี้เผ็ดไหม',
        'มีอาหารสำหรับคนทานมังสวิรัติไหม',
        'ราคาอาหารจานนี้เท่าไหร่',
        'ใช้เวลารออาหารนานไหม',
        'สามารถเปลี่ยนส่วนผสมในอาหารได้ไหม',
        'มีบริการส่งอาหารไหม',
        'รับบัตรเครดิตไหม',
        'มีที่จอดรถไหม',
        'ร้านเปิดกี่โมง',
        'อาหารร้านนี้อร่อยมาก',
        'บริการของพนักงานดีเยี่ยม',
        'บรรยากาศร้านอบอุ่นเป็นกันเอง',
        'ร้านสะอาดและตกแต่งสวยงาม',
        'ราคาอาหารเหมาะสมกับคุณภาพ',
        'วัตถุดิบที่ใช้สดใหม่',
        'อาหารแต่ละจานมีรสชาติเป็นเอกลักษณ์',
        'ร้านนี้เป็นที่นิยมของคนในท้องถิ่น',
        'การเดินทางมาร้านสะดวก',
        'ร้านมีเมนูอาหารหลากหลาย',
        'ขอแนะนำเมนูพิเศษหน่อยครับ',
        'มีอาหารจานด่วนไหม',
    ],
    'ปานกลาง': [
      'เอาผัดไทยกุ้งสดไม่ใส่พริก',
      'สั่งต้มยำกุ้งน้ำใสหนึ่งถ้วย',
      'ขอแกงเขียวหวานไก่เพิ่มหวาน',
      'เอาส้มตำปูปลาร้าไม่เผ็ด'
    ]
  },
  // ...เพิ่มหมวดหมู่อื่นๆ ในรูปแบบเดียวกัน...
};

const getRandomSentence = (category, difficulty) => {
  try {
    const categorySentences = sentences[category];
    if (!categorySentences) return null;

    const difficultyLevelSentences = categorySentences[difficulty];
    if (!difficultyLevelSentences) return null;

    const randomIndex = Math.floor(Math.random() * difficultyLevelSentences.length);
    return difficultyLevelSentences[randomIndex];
  } catch (error) {
    console.error('Error getting random sentence:', error);
    return null;
  }
};

export { getRandomSentence };
