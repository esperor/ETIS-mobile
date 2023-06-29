import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { setIntroViewed } from '../../redux/reducers/settingsSlice';
import { fontSize } from '../../utils/texts';

const ResetIntroSetting = () => {
  const dispatch = useAppDispatch();
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity onPress={() => dispatch(setIntroViewed(false))} activeOpacity={0.9}>
      <Text style={[fontSize.medium, { fontWeight: '500' }, globalStyles.textColor ]}>
        Сбросить обучение
      </Text>
    </TouchableOpacity>
  );
};

export default ResetIntroSetting;
