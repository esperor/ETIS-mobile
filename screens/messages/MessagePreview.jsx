import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const styles = StyleSheet.create({
  textBold: {
    fontWeight: '600',
  },
  font16: {
    fontSize: 16,
  },
});

const MessagePreview = ({ data }) => {
  const navigation = useNavigation();
  const [mainMessage] = data;
  const { time, author, subject, theme } = mainMessage;

  return (
    <CardHeaderOut topText={author}>
      <TouchableOpacity onPress={() => navigation.navigate('Блок сообщений', { data })}>
        <Text style={[styles.textBold, styles.font16]}>{subject}</Text>
        <Text>{theme}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text>{time.format('DD.MM.YYYY HH:mm')}</Text>
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default MessagePreview;
