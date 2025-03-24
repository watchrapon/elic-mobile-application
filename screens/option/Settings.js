import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text as RNText } from 'react-native';
import { Icon } from '@rneui/themed';
import { Card } from '@rneui/themed';
import { Overlay } from '@rneui/themed';


const ROLE_DESCRIPTIONS = {
  'hotel': 'ฝึกภาษาอังกฤษในสถานการณ์การจองห้องพักโรงแรม เรียนรู้คำศัพท์และประโยคที่ใช้ในการจองห้องพัก การเช็คอิน และการสอบถามข้อมูลบริการต่างๆ ของโรงแรม',
  'restaurant': 'ฝึกสนทนาภาษาอังกฤษในร้านอาหาร เรียนรู้การสั่งอาหาร บอกความต้องการพิเศษ และศัพท์เกี่ยวกับอาหารและการบริการ',
  'interview': 'เตรียมความพร้อมสำหรับการสัมภาษณ์งานเป็นภาษาอังกฤษ ฝึกตอบคำถามสัมภาษณ์ และเรียนรู้คำศัพท์ในการนำเสนอตัวเอง',
  'doctor': 'ฝึกสื่อสารกับแพทย์เป็นภาษาอังกฤษ เรียนรู้การอธิบายอาการ การถาม-ตอบเกี่ยวกับการรักษา และคำศัพท์ทางการแพทย์',
  'new_friend': 'ฝึกการแนะนำตัวและพูดคุยกับเพื่อนใหม่เป็นภาษาอังกฤษ เรียนรู้การสนทนาทั่วไป การแลกเปลี่ยนความสนใจ และการสร้างความสัมพันธ์',
  'taxi': 'ฝึกสนทนากับคนขับแท็กซี่เป็นภาษาอังกฤษ เรียนรู้การบอกทาง การต่อรองราคา และคำศัพท์เกี่ยวกับการเดินทาง'
};

export const CHATBOT_ROLES = [
  { label: 'การจองโรงแรมกับพนักงานโรงแรม ', value: 'hotel' },
  { label: 'การสั่งอาหารในร้าน', value: 'restaurant' },
  { label: 'การสัมภาษณ์งาน', value: 'interview' },
  { label: 'การสนทนาเมื่อไปพบแพทย์', value: 'doctor' },
  { label: 'การแนะนำตัวเองกับเพื่อนใหม่', value: 'new_friend' },
  { label: 'การพูดคุยกับคนขับแท็กซี่', value: 'taxi' },
];

const Settings = ({ chatbotRole, setChatbotRole }) => {
  const [isRolePickerVisible, setRolePickerVisible] = useState(false);

  const generatePrompt = (role) => {
    return ROLE_DESCRIPTIONS[role] || 'กรุณาเลือกบทบาทที่ต้องการ';
  };

  const renderSelectionBar = (label, value, description, onPress) => (
    <View style={styles.settingItem}>
      <RNText style={styles.label}>{label}:</RNText>
      <TouchableOpacity
        style={styles.selectionBar}
        onPress={onPress}
      >
        <RNText style={styles.selectionBarText}>
          {value || `เลือก ${label}`}
        </RNText>
        <View style={styles.chevronContainer}>
          <Icon 
            name="chevron-down" 
            type="feather" 
            size={20} 
            color="#8D493A"
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.card}>
        <RNText style={styles.cardTitle}>การตั้งค่าแชท</RNText>

        {renderSelectionBar('บทบาทของแชทบอท', CHATBOT_ROLES.find(role => role.value === chatbotRole)?.label, '', () => setRolePickerVisible(true))}

        {chatbotRole && (
          <View style={styles.promptContainer}>
            <RNText style={styles.promptLabel}>คำอธิบาย:</RNText>
            <RNText style={styles.promptText}>{generatePrompt(chatbotRole)}</RNText>
          </View>
        )}
      </Card>

      <Overlay
        isVisible={isRolePickerVisible}
        onBackdropPress={() => setRolePickerVisible(false)}
        overlayStyle={styles.overlay}
      >
        <ScrollView>
          <RNText style={styles.overlayTitle}>เลือกบทบาทของแชทบอท</RNText>
          {CHATBOT_ROLES.map((role) => (
            <TouchableOpacity
              key={role.value}
              style={styles.roleOption}
              onPress={() => {
                setChatbotRole(role.value);
                setRolePickerVisible(false);
              }}
            >
              <RNText style={styles.roleOptionText}>{role.label}</RNText>
              {chatbotRole === role.value && (
                <Icon name="check" type="feather" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Overlay>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    margin: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectionBarText: {
    fontSize: 16,
  },
  promptContainer: {
    marginTop: 16,
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
  },
  overlay: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 8,
    padding: 16,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  roleOptionText: {
    fontSize: 16,
  },
  chevronContainer: {
    backgroundColor: 'rgba(141, 73, 58, 0.1)',
    borderRadius: 15,
    padding: 5,
  },
});

export default Settings;
