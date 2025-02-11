import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { RootStackNavigationProp } from '../../navigation/types';
import { fontSize } from '../../utils/texts';
import SubjectCheckPoints from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  pointsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPoints: {
    alignItems: 'center',
    width: '25%',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontWeight: '600',
    marginRight: 10,
  },
});

const CardSign = ({ subject }: { subject: ISubject }) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <CardHeaderIn topText={subject.name}>
      <View style={styles.pointsView}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignsDetails', { subject })}
          activeOpacity={0.45}
        >
          <SubjectCheckPoints data={subject.checkPoints} />
        </TouchableOpacity>
        <TotalPoints subject={subject} style={styles.totalPoints} />
      </View>
      {subject.mark !== null && (
        <View style={styles.markView}>
          <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
            Оценка: {subject.mark}
          </Text>
        </View>
      )}
    </CardHeaderIn>
  );
};

export default CardSign;
